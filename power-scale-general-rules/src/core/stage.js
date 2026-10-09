// WebGL stage: every chapter renders its 3D scene into an HDR target, its 2D overlay is
// composited on top, chapters cross over with an ink-bleed mask, then bloom and grading.
// The composited alpha channel carries "paper-ness" (0 = cosmos, 1 = paper) per pixel so
// grading can differ between the two registers even halfway through a transition.
import * as THREE from 'three';
import { NOISE, FULLSCREEN_VERT } from '../gfx/glsl.js';
import { G, W, H } from './draw2d.js';

const quadGeo = new THREE.PlaneGeometry(2, 2);
function pass(frag, uniforms) {
  const m = new THREE.ShaderMaterial({ vertexShader: FULLSCREEN_VERT, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false });
  const mesh = new THREE.Mesh(quadGeo, m);
  mesh.frustumCulled = false;
  const sc = new THREE.Scene();
  sc.add(mesh);
  return { m, sc, u: uniforms };
}
const orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const COMPOSITE = /* glsl */ `
uniform sampler2D t3d; uniform sampler2D tOv; uniform float uGain; uniform float uPaper; uniform float uOvAlpha;
varying vec2 vUv;
void main(){
  vec4 a = texture2D(t3d, vUv);
  vec4 o = texture2D(tOv, vUv);            // premultiplied sRGB
  vec3 ov = o.a > 0.0 ? pow(o.rgb / o.a, vec3(2.2)) * o.a : vec3(0.0);
  float oa = o.a * uOvAlpha;
  vec3 c = a.rgb * (1.0 - oa) + ov * uOvAlpha * mix(uGain, 1.0, uPaper);
  gl_FragColor = vec4(c, uPaper);
}`;

const TRANSITION = /* glsl */ `
uniform sampler2D tA; uniform sampler2D tB; uniform float uK; uniform vec2 uSeed; uniform float uAspect; uniform float uTime;
varying vec2 vUv;
${NOISE}
void main(){
  vec4 a = texture2D(tA, vUv);
  vec4 b = texture2D(tB, vUv);
  vec2 p = vec2((vUv.x - uSeed.x) * uAspect, vUv.y - uSeed.y);
  float n = fbm3(vec3(vUv * vec2(uAspect, 1.0) * 3.2, 1.7)) * 0.5 + fbm3(vec3(vUv * vec2(uAspect,1.0) * 14.0, 4.1)) * 0.12;
  float field = length(p) * 0.62 + n * 0.42;
  float edge = uK * 1.75 - 0.25;
  float m = smoothstep(edge - 0.035, edge + 0.035, field);   // 1 = still A
  float rim = 1.0 - smoothstep(0.0, 0.07, abs(field - edge));
  vec4 c = mix(b, a, m);
  float paper = c.a;
  // ink front: dark rim on paper, warm ember on night
  vec3 rimCol = mix(vec3(1.4, 0.75, 0.35) * 0.8, vec3(0.02, 0.018, 0.02), paper);
  c.rgb = mix(c.rgb, rimCol, rim * 0.55 * step(0.001, uK) * step(uK, 0.999));
  gl_FragColor = c;
}`;

const DOWN = /* glsl */ `
uniform sampler2D tIn; uniform vec2 uTexel; uniform float uThresh; uniform bool uFirst;
varying vec2 vUv;
vec3 pre(vec3 c){ if(!uFirst) return c; float l = max(c.r, max(c.g, c.b)); float k = max(l - uThresh, 0.0); k = k * k / (k + 0.6); return c * (k / max(l, 1e-4)); }
void main(){
  vec2 o = uTexel;
  vec3 c = pre(texture2D(tIn, vUv).rgb) * 4.0;
  c += pre(texture2D(tIn, vUv + vec2(-o.x, -o.y)).rgb);
  c += pre(texture2D(tIn, vUv + vec2( o.x, -o.y)).rgb);
  c += pre(texture2D(tIn, vUv + vec2(-o.x,  o.y)).rgb);
  c += pre(texture2D(tIn, vUv + vec2( o.x,  o.y)).rgb);
  gl_FragColor = vec4(c / 8.0, 1.0);
}`;
const UP = /* glsl */ `
uniform sampler2D tIn; uniform sampler2D tPrev; uniform vec2 uTexel; uniform float uMix;
varying vec2 vUv;
void main(){
  vec2 o = uTexel;
  vec3 c = texture2D(tIn, vUv + vec2(-o.x * 2.0, 0.0)).rgb;
  c += texture2D(tIn, vUv + vec2(-o.x, o.y)).rgb * 2.0;
  c += texture2D(tIn, vUv + vec2(0.0, o.y * 2.0)).rgb;
  c += texture2D(tIn, vUv + vec2(o.x, o.y)).rgb * 2.0;
  c += texture2D(tIn, vUv + vec2(o.x * 2.0, 0.0)).rgb;
  c += texture2D(tIn, vUv + vec2(o.x, -o.y)).rgb * 2.0;
  c += texture2D(tIn, vUv + vec2(0.0, -o.y * 2.0)).rgb;
  c += texture2D(tIn, vUv + vec2(-o.x, -o.y)).rgb * 2.0;
  gl_FragColor = vec4(c / 12.0 + texture2D(tPrev, vUv).rgb * uMix, 1.0);
}`;

const FINAL = /* glsl */ `
uniform sampler2D tIn; uniform sampler2D tBloom; uniform float uBloom; uniform float uTime; uniform vec2 uRes;
uniform float uExposure; uniform float uFade;
varying vec2 vUv;
${NOISE}
vec3 aces(vec3 x){ const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14; return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0); }
vec3 toSRGB(vec3 c){ c = max(c, 0.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c)); }
void main(){
  vec2 uv = vUv;
  vec2 d = uv - 0.5;
  float r2 = dot(d, d);
  vec4 base = texture2D(tIn, uv);
  float paper = base.a;
  // gentle lateral chromatic aberration toward the edges (night register only)
  float ca = 0.0018 * r2 * (1.0 - paper);
  vec3 c;
  c.r = texture2D(tIn, uv - d * ca * 4.0).r;
  c.g = base.g;
  c.b = texture2D(tIn, uv + d * ca * 4.0).b;
  vec3 bl = texture2D(tBloom, uv).rgb;
  c += bl * uBloom * mix(1.0, 0.35, paper);
  // night: filmic; paper: near-linear with a soft shoulder so ivory stays ivory
  vec3 night = aces(c * uExposure * 0.92);
  vec3 day = c / (1.0 + max(c - 0.9, 0.0) * 1.6);
  vec3 col = mix(night, day, paper);
  // grade: cool shadows / warm highlights at night, slight warm cast on paper
  float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(col, col * vec3(0.92, 0.97, 1.08), (1.0 - smoothstep(0.0, 0.25, l)) * 0.6 * (1.0 - paper));
  col = mix(col, col * vec3(1.04, 1.0, 0.95), smoothstep(0.4, 1.0, l) * 0.4 * (1.0 - paper));
  // vignette
  float vig = 1.0 - smoothstep(0.18, 0.95, r2 * 1.9) * mix(0.55, 0.28, paper);
  col *= vig;
  col *= uFade;
  vec3 s = toSRGB(col);
  // film grain (stable per frame time)
  float g = hash12(uv * uRes + fract(uTime * 7.13) * 97.0) - 0.5;
  s += g * mix(0.035, 0.022, paper);
  gl_FragColor = vec4(s, 1.0);
}`;

export class Stage {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.capture = !!opts.capture;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: this.capture });
    this.renderer.autoClear = true;
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.scale = 1;
    this.layers = [0, 1].map(() => this.makeLayer());
    this.comp = pass(COMPOSITE, { t3d: { value: null }, tOv: { value: null }, uGain: { value: 1.35 }, uPaper: { value: 0 }, uOvAlpha: { value: 1 } });
    this.trans = pass(TRANSITION, { tA: { value: null }, tB: { value: null }, uK: { value: 0 }, uSeed: { value: new THREE.Vector2(0.5, 0.5) }, uAspect: { value: 16 / 9 }, uTime: { value: 0 } });
    this.down = pass(DOWN, { tIn: { value: null }, uTexel: { value: new THREE.Vector2() }, uThresh: { value: 1.0 }, uFirst: { value: false } });
    this.up = pass(UP, { tIn: { value: null }, tPrev: { value: null }, uTexel: { value: new THREE.Vector2() }, uMix: { value: 1 } });
    this.fin = pass(FINAL, { tIn: { value: null }, tBloom: { value: null }, uBloom: { value: 0.9 }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2() }, uExposure: { value: 1 }, uFade: { value: 1 } });
    this.rtMix = this.rt();
    this.blooms = [];
  }
  rt(samples = 0) {
    return new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, format: THREE.RGBAFormat, samples, depthBuffer: samples > 0 || false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
  }
  makeLayer() {
    const cv = document.createElement('canvas');
    const tex = new THREE.CanvasTexture(cv);
    tex.premultiplyAlpha = true;
    tex.colorSpace = THREE.NoColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    const r3 = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4, depthBuffer: true });
    return { cv, tex, g: new G(cv), r3, rc: this.rt() };
  }
  // stage pixel size (16:9) from css size, dpr and quality scale
  resize(cssW, cssH, dpr, quality = 1) {
    let w = cssW;
    let h = (cssW * 9) / 16;
    if (h > cssH) {
      h = cssH;
      w = (cssH * 16) / 9;
    }
    this.css = { w, h, x: (cssW - w) / 2, y: (cssH - h) / 2 };
    const px = Math.min(dpr * quality, 2.5);
    let pw = Math.round(w * px);
    let ph = Math.round(h * px);
    const maxW = this.capture ? 3840 : 2560;
    if (pw > maxW) {
      ph = Math.round((ph * maxW) / pw);
      pw = maxW;
    }
    this.pw = pw;
    this.ph = ph;
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(pw, ph, false);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.canvas.style.left = this.css.x + 'px';
    this.canvas.style.top = this.css.y + 'px';
    // 2D overlays: crisp but capped, they are re-uploaded every frame
    const ow = Math.min(pw, this.capture ? 3840 : 2400);
    const oh = Math.round((ow * 9) / 16);
    for (const L of this.layers) {
      L.cv.width = ow;
      L.cv.height = oh;
      L.tex.dispose();
      L.tex = new THREE.CanvasTexture(L.cv);
      L.tex.premultiplyAlpha = true;
      L.tex.colorSpace = THREE.NoColorSpace;
      L.tex.minFilter = THREE.LinearFilter;
      L.tex.generateMipmaps = false;
      L.r3.setSize(pw, ph);
      L.rc.setSize(pw, ph);
      L.g.ow = ow;
    }
    this.rtMix.setSize(pw, ph);
    for (const b of this.blooms) b.dispose();
    this.blooms = [];
    let bw = pw >> 1;
    let bh = ph >> 1;
    for (let i = 0; i < 6 && bw > 8; i++) {
      const r = this.rt();
      r.setSize(bw, bh);
      const u = this.rt();
      u.setSize(bw, bh);
      this.blooms.push({ d: r, u, w: bw, h: bh });
      bw >>= 1;
      bh >>= 1;
    }
    this.fin.u.uRes.value.set(pw, ph);
    this.overlayScale = ow / W;
  }
  // render one chapter into layer i; returns the composited target
  renderLayer(i, sc, t, ctx) {
    const L = this.layers[i];
    const R = this.renderer;
    sc.update(t, ctx);
    if (sc.camera.isPerspectiveCamera && sc.camera.aspect !== 16 / 9) {
      sc.camera.aspect = 16 / 9;
      sc.camera.updateProjectionMatrix();
    }
    if (sc.backdrop) sc.backdrop.sync(sc.camera, t, this.pw, this.ph);
    R.setRenderTarget(L.r3);
    R.setClearColor(0x000000, 1);
    R.clear();
    R.render(sc.three, sc.camera);
    L.g.begin(this.overlayScale, sc.mode, t);
    sc.draw(L.g, t, ctx);
    if (ctx.after) ctx.after(L.g, sc, t);
    L.tex.needsUpdate = true;
    const u = this.comp.u;
    u.t3d.value = L.r3.texture;
    u.tOv.value = L.tex;
    u.uPaper.value = sc.mode === 'paper' ? 1 : 0;
    u.uGain.value = sc.overlayGain || 1.5;
    R.setRenderTarget(L.rc);
    R.render(this.comp.sc, orthoCam);
    return L.rc;
  }
  frame(t, A, B, k, ctx, seed) {
    const R = this.renderer;
    let src;
    if (!B || k <= 0) src = this.renderLayer(0, A, t, ctx);
    else if (k >= 1) src = this.renderLayer(1, B, t, ctx);
    else {
      const a = this.renderLayer(0, A, t, ctx);
      const b = this.renderLayer(1, B, t, ctx);
      const u = this.trans.u;
      u.tA.value = a.texture;
      u.tB.value = b.texture;
      u.uK.value = k;
      if (seed) u.uSeed.value.set(seed[0], seed[1]);
      R.setRenderTarget(this.rtMix);
      R.render(this.trans.sc, orthoCam);
      src = this.rtMix;
    }
    // bloom pyramid
    let prev = src;
    this.down.u.uThresh.value = 1.0;
    this.blooms.forEach((b, i) => {
      this.down.u.tIn.value = prev.texture;
      this.down.u.uFirst.value = i === 0;
      this.down.u.uTexel.value.set(1 / (i === 0 ? this.pw : this.blooms[i - 1].w), 1 / (i === 0 ? this.ph : this.blooms[i - 1].h));
      R.setRenderTarget(b.d);
      R.render(this.down.sc, orthoCam);
      prev = b.d;
    });
    let up = this.blooms[this.blooms.length - 1].d;
    for (let i = this.blooms.length - 2; i >= 0; i--) {
      const b = this.blooms[i];
      this.up.u.tIn.value = up.texture;
      this.up.u.tPrev.value = b.d.texture;
      this.up.u.uMix.value = 1;
      this.up.u.uTexel.value.set(1 / this.blooms[i + 1].w, 1 / this.blooms[i + 1].h);
      R.setRenderTarget(b.u);
      R.render(this.up.sc, orthoCam);
      up = b.u;
    }
    const f = this.fin.u;
    f.tIn.value = src.texture;
    f.tBloom.value = up.texture;
    f.uTime.value = t;
    R.setRenderTarget(null);
    R.render(this.fin.sc, orthoCam);
  }
}
