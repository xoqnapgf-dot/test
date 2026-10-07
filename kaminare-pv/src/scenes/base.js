// Shared building blocks for scenes: a paper background, ink plate display, a 2D layer
// compositor and a 3D helper. Scenes render into whatever target the director has bound.
import * as THREE from 'three';
import { Pass, CanvasLayer, canvasTexture } from '../core/gl.js';
import { PAPER } from '../gfx/glsl.js';

// Composite a straight-alpha texture over the bound target. Optional displacement & tint.
const LAYER_FRAG = /* glsl */ `
uniform sampler2D tTex; uniform float uA; uniform vec3 uTint; uniform float uTintAmt;
uniform vec2 uOff; uniform float uScale, uRot; uniform float uWarp, uTime, uBoost;
varying vec2 vUv;
void main(){
  vec2 uv = (vUv - .5 - uOff) ;
  uv = rot(uRot) * (uv * vec2(16./9.,1.)) / vec2(16./9.,1.);
  uv = uv / uScale + .5;
  if(uWarp > 0.){
    uv.x += (fbm(vec2(uv.y*6., uTime*.7))-.5)*uWarp;
    uv.y += (fbm(vec2(uv.x*6.+9., uTime*.7))-.5)*uWarp*0.5;
  }
  vec4 c = texture2D(tTex, uv);
  if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.) c.a = 0.;
  c.rgb = mix(c.rgb, uTint, uTintAmt) * uBoost;
  gl_FragColor = vec4(c.rgb, c.a*uA);
}`;

export class Layer2D {
  constructor(w = 1920, h = 1080) {
    this.cl = new CanvasLayer(w, h);
    this.pass = new Pass(LAYER_FRAG, {
      tTex: { value: this.cl.tex }, uA: { value: 1 }, uTint: { value: new THREE.Color(1, 1, 1) }, uTintAmt: { value: 0 },
      uOff: { value: new THREE.Vector2() }, uScale: { value: 1 }, uRot: { value: 0 }, uWarp: { value: 0 }, uTime: { value: 0 }, uBoost: { value: 1 },
    }, { transparent: true });
  }
  get ctx() {
    return this.cl.ctx;
  }
  begin() {
    return this.cl.begin(true);
  }
  draw(renderer, target, opts = {}) {
    this.cl.end();
    const u = this.pass.u;
    u.tTex.value = this.cl.tex;
    u.uA.value = opts.alpha ?? 1;
    u.uOff.value.set(opts.x ?? 0, opts.y ?? 0);
    u.uScale.value = opts.scale ?? 1;
    u.uRot.value = opts.rot ?? 0;
    u.uWarp.value = opts.warp ?? 0;
    u.uTime.value = opts.time ?? 0;
    u.uTintAmt.value = opts.tintAmt ?? 0;
    u.uBoost.value = opts.boost ?? 1;
    if (opts.tint) u.uTint.value.set(opts.tint);
    this.pass.render(renderer, target, false);
  }
}

// Washi paper background with optional dye (vermilion soak) and camera pan.
const PAPER_FRAG = /* glsl */ `
${PAPER}
uniform vec3 uBase, uDye; uniform float uDyeAmt, uDyeFront; uniform vec2 uPan; uniform float uZoom, uTime, uDark;
uniform vec2 uRes;
varying vec2 vUv;
void main(){
  vec2 p = (vUv - .5) * vec2(1920., 1080.) / uZoom + uPan + vec2(960.,540.);
  float h;
  vec3 c = washi(p, uBase, h);
  // dye soak rising from bottom, fbm edge
  float n = fbm(p*0.004 + 3.) * 260. + fbm(p*0.02)*40.;
  float y = (1. - vUv.y) * 1080.;
  float front = uDyeFront;
  float m = smoothstep(front + 18., front - 18., 1080. - y + n - 130.);
  m = max(m, uDyeAmt);
  float edge = exp(-abs(1080. - y + n - 130. - front)*0.03) * (1.-uDyeAmt) * step(0.001, front+300.);
  vec3 dyed = washi(p + 77., uDye, h);
  c = mix(c, dyed, m);
  c = mix(c, uDye*0.55, edge*0.35);
  // light falloff (lamp)
  float v = 1. - length((vUv-.5)*vec2(1.,.8))*0.55;
  c *= mix(1., v, 0.8);
  c = mix(c, c*vec3(.18,.15,.14), uDark);
  gl_FragColor = vec4(c, 1.);
}`;
export class Paper {
  constructor(base = '#ede4d3', dye = '#d63a24') {
    this.pass = new Pass(PAPER_FRAG, {
      uBase: { value: new THREE.Color(base) }, uDye: { value: new THREE.Color(dye) }, uDyeAmt: { value: 0 },
      uDyeFront: { value: -400 }, uPan: { value: new THREE.Vector2() }, uZoom: { value: 1 }, uTime: { value: 0 },
      uDark: { value: 0 }, uRes: { value: new THREE.Vector2(1920, 1080) },
    });
  }
  draw(renderer, target, o = {}) {
    const u = this.pass.u;
    u.uPan.value.set(o.panX ?? 0, o.panY ?? 0);
    u.uZoom.value = o.zoom ?? 1;
    u.uDyeAmt.value = o.dye ?? 0;
    u.uDyeFront.value = o.dyeFront ?? -400;
    u.uDark.value = o.dark ?? 0;
    if (o.base) u.uBase.value.set(o.base);
    if (o.dyeCol) u.uDye.value.set(o.dyeCol);
    this.pass.render(renderer, target, false);
  }
}

// Display an InkPlate (colour + time maps) as a quad positioned in design pixels,
// revealed by draw-on progress, multiplied into the paper with fibre absorption.
const PLATE_FRAG = /* glsl */ `
uniform sampler2D tCol, tTime; uniform float uProg, uSoft, uA, uWet; uniform vec3 uInk;
uniform vec4 uRect; // x,y,w,h in design px (y down)
uniform vec2 uPan; uniform float uZoom, uWarp, uWT;
varying vec2 vUv;
void main(){
  // design pixels, y down
  vec2 p = vec2((vUv.x - .5) * 1920., (.5 - vUv.y) * 1080.) / uZoom + uPan + vec2(960.,540.);
  p.y += sin(p.x*0.011 + uWT*5.) * uWarp * 22. + sin(p.x*0.031 - uWT*3.) * uWarp * 6.;
  p.x += sin(p.y*0.02 + uWT*4.) * uWarp * 8.;
  vec2 uv = (p - uRect.xy) / uRect.zw;
  if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.) discard;
  uv.y = 1. - uv.y;
  vec4 c = texture2D(tCol, uv);
  float tm = texture2D(tTime, uv).r;
  float rev = clamp((uProg - tm) / uSoft, 0., 1.);
  float wet = 1. - clamp((uProg - tm) / uWet, 0., 1.);
  // fibre absorption: ink thins where paper is dense
  float fib = vnoise(p*vec2(0.9,0.08)) * vnoise(p*0.05);
  float a = c.a * rev * (0.9 + fib*0.15) * uA;
  vec3 ink = uInk * (1. - wet*0.5) + vec3(0.02,0.015,0.)*wet;
  gl_FragColor = vec4(mix(ink, c.rgb*0.25+ink*0.75, 0.5), a);
}`;
export class PlateView {
  constructor(plate, rect, ink = '#0f0c0b') {
    this.tc = canvasTexture(plate.color);
    this.tt = canvasTexture(plate.time);
    this.pass = new Pass(PLATE_FRAG, {
      tCol: { value: this.tc }, tTime: { value: this.tt }, uProg: { value: 1 }, uSoft: { value: 0.025 }, uWet: { value: 0.12 },
      uA: { value: 1 }, uInk: { value: new THREE.Color(ink) }, uRect: { value: new THREE.Vector4(...rect) },
      uPan: { value: new THREE.Vector2() }, uZoom: { value: 1 }, uWarp: { value: 0 }, uWT: { value: 0 },
    }, { transparent: true });
  }
  draw(renderer, target, prog, o = {}) {
    const u = this.pass.u;
    u.uProg.value = prog;
    u.uA.value = o.alpha ?? 1;
    u.uPan.value.set(o.panX ?? 0, o.panY ?? 0);
    u.uZoom.value = o.zoom ?? 1;
    u.uWarp.value = o.warp ?? 0;
    u.uWT.value = o.time ?? 0;
    if (o.ink) u.uInk.value.set(o.ink);
    if (o.rect) u.uRect.value.set(...o.rect);
    this.pass.render(renderer, target, false);
  }
}

// Show a full-colour canvas (e.g. a p5.brush watercolour) at a rect, revealed radially
// with a ragged, noisy front (like pigment soaking outward).
const WASH_FRAG = /* glsl */ `
uniform sampler2D tCol; uniform float uProg, uA; uniform vec4 uRect; uniform vec2 uPan, uFrom; uniform float uZoom, uMul;
varying vec2 vUv;
void main(){
  vec2 p = vec2((vUv.x - .5) * 1920., (.5 - vUv.y) * 1080.) / uZoom + uPan + vec2(960.,540.);
  vec2 uv = (p - uRect.xy) / uRect.zw;
  if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.) discard;
  float d = length((uv - uFrom) * vec2(uRect.z/uRect.w, 1.));
  float n = fbm(uv*7.) * 0.35 + fbm(uv*30.)*0.1;
  float v = d*1.2 + n;
  float m = smoothstep(uProg*1.9, uProg*1.9 - 0.08, v);
  m = uProg >= 1. ? 1. : m;
  uv.y = 1. - uv.y;
  vec4 c = texture2D(tCol, uv);
  gl_FragColor = vec4(c.rgb * uMul, c.a * m * uA);
}`;
export class WashView {
  constructor(canvas, rect) {
    this.tex = canvasTexture(canvas);
    this.pass = new Pass(WASH_FRAG, {
      tCol: { value: this.tex }, uProg: { value: 1 }, uA: { value: 1 }, uRect: { value: new THREE.Vector4(...rect) },
      uPan: { value: new THREE.Vector2() }, uFrom: { value: new THREE.Vector2(0.5, 0.5) }, uZoom: { value: 1 }, uMul: { value: 1 },
    }, { transparent: true });
  }
  draw(renderer, target, prog, o = {}) {
    const u = this.pass.u;
    u.uProg.value = prog;
    u.uA.value = o.alpha ?? 1;
    u.uPan.value.set(o.panX ?? 0, o.panY ?? 0);
    u.uZoom.value = o.zoom ?? 1;
    u.uMul.value = o.mul ?? 1;
    if (o.from) u.uFrom.value.set(o.from[0], o.from[1]);
    if (o.rect) u.uRect.value.set(...o.rect);
    this.pass.render(renderer, target, false);
  }
}

export { THREE, Pass, CanvasLayer, canvasTexture };
