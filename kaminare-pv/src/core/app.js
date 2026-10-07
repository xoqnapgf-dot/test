// App shell: renderer, clock (audio-locked), director (shots + transitions), UI.
import * as THREE from 'three';
import { Post } from './post.js';
import { Pass, CanvasLayer } from './gl.js';
import { DURATION, SEC, CHAPTERS, beatF } from './music.js';
import { clamp } from './util.js';

THREE.ColorManagement.enabled = false;

const HUD_FRAG = /* glsl */ `
uniform sampler2D tHud; uniform float uA; varying vec2 vUv;
void main(){ vec4 c = texture2D(tHud, vUv); gl_FragColor = vec4(c.rgb, c.a*uA); }`;

export class App {
  constructor({ shots, scenes, hud, capture }) {
    this.shots = shots;
    this.sceneDefs = scenes;
    this.hudDraw = hud;
    this.capture = capture;
    this.t = 0;
    this.playing = false;
    this.quality = 1;
    this.debug = /[?&]debug/.test(location.search);
  }

  async init(onProgress) {
    const stage = (this.stage = document.getElementById('stage'));
    const canvas = (this.canvas = document.createElement('canvas'));
    canvas.id = 'gl';
    stage.prepend(canvas);
    const r = (this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: !!this.capture,
    }));
    r.outputColorSpace = THREE.LinearSRGBColorSpace;
    r.autoClear = false;
    r.setClearColor(0x000000, 1);
    this.post = new Post(r);
    this.hud = new CanvasLayer(1280, 720);
    this.hudPass = new Pass(HUD_FRAG, { tHud: { value: this.hud.tex }, uA: { value: 1 } }, {
      transparent: true,
      noNoise: true,
    });
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // build scenes (each may do async prep such as generating ink plates)
    this.scenes = {};
    const names = Object.keys(this.sceneDefs);
    let done = 0;
    for (const name of names) {
      const t0 = performance.now();
      const s = new this.sceneDefs[name](this);
      await s.init?.();
      if (this.capture) console.log(`init ${name} ${(performance.now() - t0).toFixed(0)}ms`);
      this.scenes[name] = s;
      done++;
      onProgress?.(done / names.length, name);
      await new Promise((res) => setTimeout(res, 0));
    }
    // warm up shaders: render every scene once off-screen
    for (const name of this.capture ? [] : names) {
      const sh = this.shots.find((x) => x.scene === name);
      if (!sh) continue;
      this.renderScene(name, (sh.t0 + sh.t1) / 2, this.post.rtA);
    }
  }

  resize() {
    const rect = this.stage.getBoundingClientRect();
    const w = rect.width || window.innerWidth;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const maxW = 1920 * this.quality;
    let rw = Math.min(Math.round(w * dpr), maxW);
    if (this.capture) rw = this.capture.width || 1280;
    const rh = Math.round((rw * 9) / 16);
    this.rw = rw;
    this.rh = rh;
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(rw, rh, false);
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.post.setSize(rw, rh);
    const hw = Math.min(rw, 1920), hh = Math.round((hw * 9) / 16);
    this.hud.resize(hw, hh);
    this.hudPass.u.tHud.value = this.hud.tex;
    for (const s of Object.values(this.scenes || {})) s.resize?.(rw, rh);
  }

  // ---------- director
  shotAt(t) {
    const S = this.shots;
    let i = 0;
    for (let k = 0; k < S.length; k++) if (t >= S[k].t0) i = k;
    return i;
  }
  renderScene(name, t, rt) {
    const s = this.scenes[name];
    this.renderer.setRenderTarget(rt);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.clear(true, true, true);
    return s.render(t, rt) || {};
  }
  frame(t) {
    const i = this.shotAt(t);
    const shot = this.shots[i];
    const prev = this.shots[i - 1];
    const tr = shot.tin;
    let out, fx;
    // transition window: [t0 - pre, t0 + post]
    const nextShot = this.shots[i + 1];
    const ntr = nextShot?.tin;
    if (ntr && ntr.pre && t > nextShot.t0 - ntr.pre) {
      // approaching next shot boundary, transition starts before the cut
      const p = clamp((t - (nextShot.t0 - ntr.pre)) / (ntr.pre + (ntr.post || 0)));
      const fa = this.renderScene(shot.scene, t, this.post.rtA);
      const fb = this.renderScene(nextShot.scene, t, this.post.rtB);
      out = this.post.transition(ntr.type, p, ntr.angle ?? 0.6, t);
      fx = p < 0.5 ? fa : fb;
    } else if (prev && tr && tr.post && t < shot.t0 + tr.post) {
      const p = clamp((t - (shot.t0 - (tr.pre || 0))) / ((tr.pre || 0) + tr.post));
      const fa = this.renderScene(prev.scene, t, this.post.rtA);
      const fb = this.renderScene(shot.scene, t, this.post.rtB);
      out = this.post.transition(tr.type, p, tr.angle ?? 0.6, t);
      fx = p < 0.5 ? fa : fb;
    } else {
      fx = this.renderScene(shot.scene, t, this.post.rtA);
      out = this.post.rtA;
    }
    // HUD overlay (drawn into the scene image so post FX treat it like the rest)
    const hudA = fx.hud ?? 1;
    if (hudA > 0.001 && !this.hideHud) {
      const c = this.hud.begin();
      this.hudDraw(c, t, fx, this);
      this.hud.end();
      this.hudPass.u.uA.value = hudA;
      this.hudPass.render(this.renderer, out, false);
    }
    fx.time = t;
    this.post.render(out, fx);
    this.lastFx = fx;
  }

  // ---------- clock
  attachAudio(audio) {
    this.audio = audio;
    this.syncT = 0;
    this.syncPerf = performance.now();
    audio.addEventListener('play', () => {
      this.playing = true;
      this.resync();
    });
    audio.addEventListener('pause', () => {
      this.playing = false;
      this.resync();
    });
    audio.addEventListener('seeked', () => this.resync());
    audio.addEventListener('ended', () => {
      this.playing = false;
      this.onEnded?.();
    });
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
    // drift correction toward the audio element's clock
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
      this.t = clamp(this.clockTime(), 0, DURATION);
      this.frame(this.t);
      this.onTick?.(this.t);
    };
    loop();
  }
  // deterministic single-frame render for capture/QA
  renderAt(t) {
    this.t = t;
    this.frame(t);
  }
  chapterAt(t) {
    let c = CHAPTERS[0];
    for (const ch of CHAPTERS) if (t >= SEC[ch[0]][0]) c = ch;
    return c;
  }
  beatInfo(t) {
    const b = Math.max(0, Math.floor(beatF(t)));
    return { bar: Math.floor(b / 4) + 1, beat: (b % 4) + 1 };
  }
}
