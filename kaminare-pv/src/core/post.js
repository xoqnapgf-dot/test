// Post pipeline: transition mixer -> bloom (dual-filter mip chain) -> god rays -> final grade.
import * as THREE from 'three';
import { Pass, makeRT } from './gl.js';

const MIX_FRAG = /* glsl */ `
uniform sampler2D tA, tB; uniform float uP, uType, uAngle, uTime; uniform vec2 uRes;
varying vec2 vUv;
// type 0: cut/crossfade  1: blade slash (diagonal split, halves slide)  2: ink bleed
//      3: white flash dip  4: radial iris  5: vertical shutter slices  6: glitch blocks
void main(){
  vec2 uv = vUv; float p = uP; vec3 c;
  vec2 asp = vec2(uRes.x/uRes.y, 1.);
  if(uType < 0.5){
    c = mix(texture2D(tA,uv).rgb, texture2D(tB,uv).rgb, p);
  } else if(uType < 1.5){
    // blade: line through center at uAngle; A splits & slides away along the line, B revealed behind
    vec2 n = vec2(cos(uAngle), sin(uAngle));
    vec2 q = (uv-.5)*asp;
    float side = sign(dot(q, n));
    vec2 tdir = vec2(-n.y, n.x);
    float e = p*p*(3.-2.*p);
    vec2 off = tdir * side * e * 1.4 + n*side*e*0.08;
    vec2 uvA = uv - off/asp;
    float gap = abs(dot(q,n)) - e*0.02;
    vec3 a = texture2D(tA, uvA).rgb;
    vec3 b = texture2D(tB, uv).rgb;
    float inA = step(0., uvA.x)*step(uvA.x,1.)*step(0.,uvA.y)*step(uvA.y,1.);
    float cutLine = exp(-abs(dot(q,n))*900.) * (1.-e) * step(0.001, p);
    c = mix(b, a, inA*step(0., gap));
    c += vec3(1.,.95,.9)*cutLine*4.;
  } else if(uType < 2.5){
    // ink bleed: fbm threshold front moving through
    float n = fbm(uv*asp*3.5 + 3.1) * .55 + fbm(uv*asp*18.)*.18;
    float front = mix(-0.3, 1.2, p);
    float g = (1.-uv.y)*0.45 + n;
    float m = smoothstep(front-0.03, front+0.03, g);
    float edge = smoothstep(0.06,0.,abs(g-front));
    c = mix(texture2D(tB,uv).rgb, texture2D(tA,uv).rgb, m);
    c *= 1. - edge*0.55;
  } else if(uType < 3.5){
    float w = 1.-abs(p*2.-1.);
    c = p < .5 ? texture2D(tA,uv).rgb : texture2D(tB,uv).rgb;
    c = mix(c, vec3(1.,.98,.95), smoothstep(0.,1.,w)*1.2);
  } else if(uType < 4.5){
    float r = length((uv-.5)*asp);
    float m = smoothstep(p*1.05-0.01, p*1.05+0.01, r);
    c = mix(texture2D(tB,uv).rgb, texture2D(tA,uv).rgb, m);
    c += vec3(1.,.8,.5) * exp(-abs(r-p*1.05)*120.) * (1.-p);
  } else if(uType < 5.5){
    float k = floor(uv.x*14.);
    float d = hash12(vec2(k,3.))*0.35;
    float lp = clamp((p - d)/(1.-0.35), 0., 1.);
    float m = step(uv.y, lp*lp*(3.-2.*lp));
    c = mix(texture2D(tA,uv).rgb, texture2D(tB,uv).rgb, m);
  } else {
    vec2 blk = floor(uv*vec2(24.,14.));
    float r = hash12(blk + floor(uTime*30.));
    float m = step(r, p);
    vec2 o = (hash22(blk)-.5)*0.04*(1.-abs(p*2.-1.));
    c = mix(texture2D(tA,uv+o).rgb, texture2D(tB,uv-o).rgb, m);
  }
  gl_FragColor = vec4(c,1.);
}`;

const BRIGHT_FRAG = /* glsl */ `
uniform sampler2D tIn; uniform float uThresh, uKnee; varying vec2 vUv;
void main(){
  vec3 c = texture2D(tIn, vUv).rgb;
  float br = max(c.r, max(c.g, c.b));
  float soft = clamp(br - uThresh + uKnee, 0., 2.*uKnee); soft = soft*soft/(4.*uKnee+1e-4);
  float w = max(soft, br-uThresh)/max(br,1e-4);
  gl_FragColor = vec4(c*w, 1.);
}`;
const DOWN_FRAG = /* glsl */ `
uniform sampler2D tIn; uniform vec2 uTexel; varying vec2 vUv;
void main(){
  vec2 o = uTexel;
  vec3 s = texture2D(tIn, vUv).rgb*4.;
  s += texture2D(tIn, vUv+vec2(-o.x,-o.y)).rgb + texture2D(tIn, vUv+vec2(o.x,-o.y)).rgb;
  s += texture2D(tIn, vUv+vec2(-o.x,o.y)).rgb + texture2D(tIn, vUv+vec2(o.x,o.y)).rgb;
  gl_FragColor = vec4(s/8., 1.);
}`;
const UP_FRAG = /* glsl */ `
uniform sampler2D tIn, tBase; uniform vec2 uTexel; uniform float uMix; varying vec2 vUv;
void main(){
  vec2 o = uTexel;
  vec3 s = texture2D(tIn, vUv+vec2(-o.x*2.,0.)).rgb + texture2D(tIn, vUv+vec2(o.x*2.,0.)).rgb
         + texture2D(tIn, vUv+vec2(0.,-o.y*2.)).rgb + texture2D(tIn, vUv+vec2(0.,o.y*2.)).rgb;
  s += (texture2D(tIn, vUv+vec2(-o.x,o.y)).rgb + texture2D(tIn, vUv+vec2(o.x,o.y)).rgb
      + texture2D(tIn, vUv+vec2(-o.x,-o.y)).rgb + texture2D(tIn, vUv+vec2(o.x,-o.y)).rgb)*2.;
  gl_FragColor = vec4(s/12. + texture2D(tBase, vUv).rgb*uMix, 1.);
}`;
const RAYS_FRAG = /* glsl */ `
uniform sampler2D tIn; uniform vec2 uCenter; uniform float uDecay, uLen; varying vec2 vUv;
void main(){
  vec2 d = (vUv - uCenter) * uLen / 40.;
  vec2 uv = vUv; vec3 s = vec3(0.); float w = 1.;
  float j = hash12(gl_FragCoord.xy);
  uv -= d*j;
  for(int i=0;i<40;i++){ uv -= d; s += texture2D(tIn, uv).rgb * w; w *= uDecay; }
  gl_FragColor = vec4(s/20., 1.);
}`;

const FINAL_FRAG = /* glsl */ `
uniform sampler2D tScene, tBloom, tRays;
uniform vec2 uRes; uniform float uTime;
uniform float uBloom, uRays, uCA, uGrain, uVig, uExposure, uFlash, uInvert, uSat, uContrast, uHue, uGlitch, uScan;
uniform vec3 uFlashCol, uLift, uGain, uTint;
varying vec2 vUv;
vec3 hueShift(vec3 c, float h){
  const vec3 k = vec3(0.57735);
  float ca = cos(h);
  return c*ca + cross(k,c)*sin(h) + k*dot(k,c)*(1.-ca);
}
void main(){
  vec2 uv = vUv;
  // glitch: horizontal block displacement
  if(uGlitch > 0.001){
    float row = floor(uv.y*48.);
    float r = hash12(vec2(row, floor(uTime*24.)));
    uv.x += (r-.5) * step(1.-uGlitch*0.6, r) * 0.08 * uGlitch;
  }
  vec2 dc = uv - .5;
  float ca = uCA * 0.7 * (0.3 + dot(dc,dc)*2.4);
  vec3 col;
  col.r = texture2D(tScene, uv + dc*ca).r;
  col.g = texture2D(tScene, uv).g;
  col.b = texture2D(tScene, uv - dc*ca).b;
  col += texture2D(tBloom, uv).rgb * uBloom;
  col += texture2D(tRays, uv).rgb * uRays;
  col *= uExposure;
  // filmic shoulder
  col = col / (1. + max(col - 1., 0.) * 0.6);
  // grade
  col = uLift + col * uGain;
  col *= uTint;
  float L = luma(col);
  col = mix(vec3(L), col, uSat);
  col = (col - .5) * uContrast + .5;
  if(abs(uHue) > 0.001) col = hueShift(col, uHue);
  // flash & invert
  col = mix(col, uFlashCol, clamp(uFlash,0.,1.));
  col = mix(col, 1. - col, uInvert);
  // vignette
  float v = smoothstep(1.15, 0.25, length(dc*vec2(1.,.82))*1.25);
  col *= mix(1., v, uVig);
  // scanline / print grain
  col += (hash12(gl_FragCoord.xy + fract(uTime*7.)*517.) - .5) * uGrain;
  col *= 1. - uScan * (0.5+0.5*sin(gl_FragCoord.y*3.14159));
  gl_FragColor = vec4(clamp(col,0.,1.), 1.);
}`;

export class Post {
  constructor(renderer) {
    this.r = renderer;
    this.mix = new Pass(MIX_FRAG, {
      tA: { value: null }, tB: { value: null }, uP: { value: 0 }, uType: { value: 0 },
      uAngle: { value: 0.5 }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) },
    });
    this.bright = new Pass(BRIGHT_FRAG, { tIn: { value: null }, uThresh: { value: 0.72 }, uKnee: { value: 0.25 } });
    this.down = new Pass(DOWN_FRAG, { tIn: { value: null }, uTexel: { value: new THREE.Vector2() } });
    this.up = new Pass(UP_FRAG, { tIn: { value: null }, tBase: { value: null }, uTexel: { value: new THREE.Vector2() }, uMix: { value: 1 } });
    this.rays = new Pass(RAYS_FRAG, { tIn: { value: null }, uCenter: { value: new THREE.Vector2(0.5, 0.6) }, uDecay: { value: 0.96 }, uLen: { value: 0.5 } });
    this.final = new Pass(FINAL_FRAG, {
      tScene: { value: null }, tBloom: { value: null }, tRays: { value: null },
      uRes: { value: new THREE.Vector2(1, 1) }, uTime: { value: 0 },
      uBloom: { value: 0.9 }, uRays: { value: 0 }, uCA: { value: 0.004 }, uGrain: { value: 0.05 }, uVig: { value: 0.6 },
      uExposure: { value: 1 }, uFlash: { value: 0 }, uInvert: { value: 0 }, uSat: { value: 1 }, uContrast: { value: 1 },
      uHue: { value: 0 }, uGlitch: { value: 0 }, uScan: { value: 0 },
      uFlashCol: { value: new THREE.Color(1, 0.98, 0.95) }, uLift: { value: new THREE.Color(0, 0, 0) },
      uGain: { value: new THREE.Color(1, 1, 1) }, uTint: { value: new THREE.Color(1, 1, 1) },
    });
    this.levels = 6;
    this.setSize(2, 2);
  }
  setSize(w, h) {
    this.w = w;
    this.h = h;
    const dispose = (a) => a && a.forEach((r) => r.dispose());
    dispose(this.mips);
    dispose(this.ups);
    this.rtA?.dispose();
    this.rtB?.dispose();
    this.rtMix?.dispose();
    this.rtRays?.dispose();
    this.rtA = makeRT(w, h, { depth: true });
    this.rtB = makeRT(w, h, { depth: true });
    this.rtMix = makeRT(w, h);
    this.mips = [];
    this.ups = [];
    let mw = Math.max(1, w >> 1), mh = Math.max(1, h >> 1);
    for (let i = 0; i < this.levels; i++) {
      this.mips.push(makeRT(mw, mh));
      this.ups.push(makeRT(mw, mh));
      mw = Math.max(1, mw >> 1);
      mh = Math.max(1, mh >> 1);
    }
    this.rtRays = makeRT(Math.max(1, w >> 2), Math.max(1, h >> 2));
    this.mix.u.uRes.value.set(w, h);
    this.final.u.uRes.value.set(w, h);
  }
  // compose two scene RTs into rtMix (or pass through)
  transition(type, p, angle, time) {
    const u = this.mix.u;
    u.tA.value = this.rtA.texture;
    u.tB.value = this.rtB.texture;
    u.uP.value = p;
    u.uType.value = type;
    u.uAngle.value = angle;
    u.uTime.value = time;
    this.mix.render(this.r, this.rtMix);
    return this.rtMix;
  }
  render(srcRT, fx) {
    const r = this.r;
    // bloom
    this.bright.u.tIn.value = srcRT.texture;
    this.bright.u.uThresh.value = fx.bloomThresh ?? 0.92;
    this.bright.render(r, this.mips[0]);
    for (let i = 1; i < this.levels; i++) {
      const s = this.mips[i - 1];
      this.down.u.tIn.value = s.texture;
      this.down.u.uTexel.value.set(1 / s.width, 1 / s.height);
      this.down.render(r, this.mips[i]);
    }
    let cur = this.mips[this.levels - 1];
    for (let i = this.levels - 2; i >= 0; i--) {
      this.up.u.tIn.value = cur.texture;
      this.up.u.tBase.value = this.mips[i].texture;
      this.up.u.uTexel.value.set(1 / cur.width, 1 / cur.height);
      this.up.render(r, this.ups[i]);
      cur = this.ups[i];
    }
    // god rays from bright pass
    if ((fx.rays ?? 0) > 0.001) {
      this.rays.u.tIn.value = this.mips[1].texture;
      this.rays.u.uCenter.value.set(fx.raysX ?? 0.5, fx.raysY ?? 0.6);
      this.rays.u.uLen.value = fx.raysLen ?? 0.55;
      this.rays.render(r, this.rtRays);
    }
    const u = this.final.u;
    u.tScene.value = srcRT.texture;
    u.tBloom.value = cur.texture;
    u.tRays.value = this.rtRays.texture;
    u.uTime.value = fx.time;
    u.uBloom.value = fx.bloom ?? 0.9;
    u.uRays.value = fx.rays ?? 0;
    u.uCA.value = fx.ca ?? 0.004;
    u.uGrain.value = fx.grain ?? 0.05;
    u.uVig.value = fx.vig ?? 0.6;
    u.uExposure.value = fx.exposure ?? 1;
    u.uFlash.value = fx.flash ?? 0;
    u.uInvert.value = fx.invert ?? 0;
    u.uSat.value = fx.sat ?? 1;
    u.uContrast.value = fx.contrast ?? 1;
    u.uHue.value = fx.hue ?? 0;
    u.uGlitch.value = fx.glitch ?? 0;
    u.uScan.value = fx.scan ?? 0;
    u.uFlashCol.value.set(fx.flashCol ?? 0xfffaf2);
    u.uLift.value.setRGB(...(fx.lift ?? [0, 0, 0]));
    u.uGain.value.setRGB(...(fx.gain ?? [1, 1, 1]));
    u.uTint.value.setRGB(...(fx.tint ?? [1, 1, 1]));
    this.final.render(r, null);
  }
}
