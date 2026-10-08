// App shell: renderer, audio-locked clock, director (scene per narration section,
// transitions at the boundaries), overlay (HUD + subtitles), deterministic capture.
import * as THREE from 'three';
import { Post } from './post.js';
import { Pass, CanvasLayer, detectCaps } from './gl.js';
import { TOTAL, SCENES, CHAPTERS } from './narr.js';
import { clamp } from './util.js';

const OVER_FRAG = /* glsl */ `
uniform sampler2D tHud; uniform float uA; varying vec2 vUv;
vec4 overSRGB(vec3 lin, float a){ return vec4(lin * pow(a, 2.2), 1. - pow(1. - a, 2.2)); }
void main(){ vec4 c = texture2D(tHud, vUv); gl_FragColor = overSRGB(c.rgb, c.a*uA); }`;

export class App {
  constructor({ scenes, transitions, overlay, capture }) {
    this.sceneDefs = scenes;
    this.transitions = transitions;
    this.overlayDraw = overlay;
    this.capture = capture;
    this.t = 0;
    this.playing = false;
    this.quality = 1;
    // shots = narration sections, each mapped to a scene class key
    this.shots = SCENES.map((s) => ({ id: s.id, scene: s.id, t0: s.t0, t1: s.t1 }));
  }

  async init(onProgress) {
    const stage = (this.stage = document.getElementById('stage'));
    const canvas = (this.canvas = document.createElement('canvas'));
    canvas.id = 'gl';
    stage.prepend(canvas);
    const r = (this.renderer = new THREE.WebGLRenderer({
      canvas, antialias: false, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: !!this.capture,
    }));
    detectCaps(r);
    r.outputColorSpace = THREE.LinearSRGBColorSpace;
    r.autoClear = false;
    this.post = new Post(r);
    this.hud = new CanvasLayer(1920, 1080);
    this.hudPass = new Pass(OVER_FRAG, { tHud: { value: this.hud.tex }, uA: { value: 1 } }, { transparent: true, noNoise: true });
    Object.assign(this.hudPass.material, {
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    });
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.scenes = {};
    const names = Object.keys(this.sceneDefs);
    let done = 0;
    for (const name of names) {
      const t0 = performance.now();
      const s = new this.sceneDefs[name](this);
      await s.init?.();
      if (this.capture) console.log(`init ${name} ${(performance.now() - t0).toFixed(0)}ms`);
      this.scenes[name] = s;
      onProgress?.(++done / names.length, name);
      await new Promise((res) => setTimeout(res, 0));
    }
    if (!this.capture) for (const sh of this.shots) this.renderScene(sh.scene, (sh.t0 + sh.t1) / 2, this.post.rtA);
  }

  resize() {
    const rect = this.stage.getBoundingClientRect();
    const w = rect.width || window.innerWidth;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rw = Math.min(Math.round(w * dpr), 1920 * this.quality);
    if (this.capture) rw = this.capture.width || 1280;
    const rh = Math.round((rw * 9) / 16);
    this.rw = rw;
    this.rh = rh;
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(rw, rh, false);
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.post.setSize(rw, rh);
    for (const s of Object.values(this.scenes || {})) s.resize?.(rw, rh);
  }

  shotAt(t) {
    let i = 0;
    for (let k = 0; k < this.shots.length; k++) if (t >= this.shots[k].t0) i = k;
    return i;
  }
  renderScene(name, t, rt) {
    this.renderer.setRenderTarget(rt);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.clear(true, true, true);
    return this.scenes[name].render(t, rt) || {};
  }
  frame(t) {
    const i = this.shotAt(t);
    const shot = this.shots[i];
    const next = this.shots[i + 1];
    const tin = this.transitions[shot.id];
    const tnext = next && this.transitions[next.id];
    let out, fx;
    if (tnext && t > next.t0 - (tnext.pre || 0)) {
      const p = clamp((t - (next.t0 - tnext.pre)) / (tnext.pre + (tnext.post || 0)));
      const fa = this.renderScene(shot.scene, t, this.post.rtA);
      const fb = this.renderScene(next.scene, t, this.post.rtB);
      out = this.post.transition(tnext.type, p, tnext.angle ?? 0.6, t);
      fx = p < 0.5 ? fa : fb;
    } else if (i > 0 && tin && t < shot.t0 + (tin.post || 0)) {
      const prev = this.shots[i - 1];
      const p = clamp((t - (shot.t0 - (tin.pre || 0))) / ((tin.pre || 0) + tin.post));
      const fa = this.renderScene(prev.scene, t, this.post.rtA);
      const fb = this.renderScene(shot.scene, t, this.post.rtB);
      out = this.post.transition(tin.type, p, tin.angle ?? 0.6, t);
      fx = p < 0.5 ? fa : fb;
    } else {
      fx = this.renderScene(shot.scene, t, this.post.rtA);
      out = this.post.rtA;
    }
    const c = this.hud.begin();
    this.overlayDraw(c, t, fx, this);
    this.hud.end();
    this.hudPass.render(this.renderer, out, false);
    fx.time = t;
    fx.bloomThresh = fx.bloomThresh ?? 1.05;
    this.post.render(out, fx);
  }

  attachAudio(audio) {
    this.audio = audio;
    this.syncT = 0;
    this.syncPerf = performance.now();
    audio.addEventListener('play', () => { this.playing = true; this.resync(); });
    audio.addEventListener('pause', () => { this.playing = false; this.resync(); });
    audio.addEventListener('seeked', () => this.resync());
    audio.addEventListener('ended', () => { this.playing = false; this.onEnded?.(); });
  }
  resync() {
    this.syncT = this.audio.currentTime;
    this.syncPerf = performance.now();
  }
  clockTime() {
    if (!this.audio) return this.t;
    const a = this.audio.currentTime;
    if (!this.playing) return a;
    let t = this.syncT + (performance.now() - this.syncPerf) / 1000;
    if (Math.abs(t - a) > 0.08) {
      this.syncT = a;
      this.syncPerf = performance.now();
      t = a;
    }
    return t;
  }
  start() {
    const loop = () => {
      requestAnimationFrame(loop);
      this.t = clamp(this.clockTime(), 0, TOTAL);
      try {
        this.frame(this.t);
      } catch (e) {
        console.error(e);
      }
      this.onTick?.(this.t);
    };
    loop();
  }
  renderAt(t) {
    this.t = t;
    this.frame(t);
  }
  chapterAt(t) {
    let c = CHAPTERS[0], idx = 0;
    CHAPTERS.forEach((ch, k) => {
      const s = SCENES.find((x) => x.id === ch[0]);
      if (t >= s.t0) {
        c = ch;
        idx = k;
      }
    });
    return { ch: c, idx };
  }
}
