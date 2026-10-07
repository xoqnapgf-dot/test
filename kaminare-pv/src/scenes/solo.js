// SOLO — the lead guitar flies. A volumetric storm tunnel (raymarched at half res) with
// lightning inside the clouds; a white dove of light leads, trailing a ribbon that
// follows the shred. At 137.5 s time freezes: the whisper of the bridge begins.
import * as THREE from 'three';
import { Layer2D } from './base.js';
import { Pass, makeRT } from '../core/gl.js';
import { SEC, kickHit, snareHit, hats, loud, beatF, KICK_TIMES, lines } from '../core/music.js';
import { F, font, caption, layoutV, REVEAL } from '../core/type.js';
import { EMBLEMS, drawBird } from '../gfx/symbols.js';
import { bolt, drawBolt, strikeI } from '../gfx/lightning.js';
import { drawWhisper } from './bridge.js';
import { clamp, lerp, ease, ep, hash1, TAU, fbm1 } from '../core/util.js';

const CLOUD_FRAG = /* glsl */ `
uniform float uTime, uZ, uFlash, uRoll, uFreeze; uniform vec3 uFlashP; uniform vec2 uLook;
varying vec2 vUv;
float fbmC(vec3 p){ float s=0., a=.5; for(int i=0;i<3;i++){ s+=a*vnoise3(p); p=p*2.07+vec3(1.7,9.2,3.1); a*=.5;} return s/0.875; }
vec2 path(float z){ return vec2(sin(z*0.035)*7., cos(z*0.027)*4.5); }
float dens(vec3 p){
  vec2 c = path(p.z);
  float r = length(p.xy - c);
  float tunnel = smoothstep(3.5, 9.5, r);
  float n = fbmC(p*0.085 + vec3(0., 0., uTime*0.12));
  float n2 = vnoise3(p*0.4 + vec3(uTime*0.3, 0., 0.));
  float d = n*1.3 - 0.62 + tunnel*0.75 - (1. - tunnel)*0.45 + (n2 - .5)*0.18;
  return clamp(d*3.2, 0., 1.);
}
void main(){
  vec2 q = (vUv - .5) * vec2(16./9., 1.);
  q = rot(uRoll) * q;
  vec3 ro = vec3(path(uZ), uZ);
  vec2 ahead = path(uZ - 12.) - ro.xy;
  vec3 fw = normalize(vec3(ahead*0.08 + uLook, -1.));
  vec3 rt = normalize(cross(fw, vec3(0.,1.,0.)));
  vec3 up = cross(rt, fw);
  vec3 rd = normalize(fw*1.15 + rt*q.x + up*q.y);
  vec3 far0 = normalize(vec3(path(uZ - 60.) - ro.xy, -60.));
  vec3 col = vec3(0.); float T = 1.;
  float t = 0.6 + hash12(gl_FragCoord.xy + fract(uTime)*13.)*0.9;
  for(int i=0;i<22;i++){
    vec3 p = ro + rd*t;
    float d = dens(p);
    if(d > 0.01){
      float fl = uFlash * exp(-length(p - uFlashP)*0.08);
      // self-shadow toward a high moon: silver linings on the cloud tops
      float sh = dens(p + vec3(0.6, 2.2, -0.6));
      float lit = exp(-sh*2.4);
      vec3 base = mix(vec3(0.03,0.025,0.08), vec3(0.28,0.1,0.2), smoothstep(-6., 6., p.y - path(p.z).y));
      float back = pow(max(dot(normalize(p - ro), far0), 0.), 12.) * smoothstep(10., 40., t);
      vec3 lum = base * (0.35 + 0.5*(1.-d)) + vec3(1.0,0.7,0.55)*back*0.22 + vec3(0.55,0.6,0.85)*lit*0.55 + vec3(0.8,0.85,1.)*fl*2.6*(0.4+lit) + vec3(1.,0.45,0.2)*0.08*smoothstep(4.,-6.,p.y);
      float a = d*0.42;
      col += T * a * lum;
      T *= 1. - a;
      if(T < 0.03) break;
    }
    t += 1.1 + t*0.04;
  }
  // background deep sky
  vec3 far = normalize(vec3(path(uZ - 60.) - ro.xy, -60.));
  float toward = max(dot(rd, far), 0.);
  vec3 sky = mix(vec3(0.02,0.015,0.05), vec3(0.25,0.08,0.16), smoothstep(-0.3,0.4,rd.y));
  sky += vec3(1.0,0.82,0.62) * pow(toward, 140.) * 0.85 + vec3(0.9,0.5,0.45) * pow(toward, 10.) * 0.22;
  col += T * sky;
  col += T * vec3(0.8,0.85,1.) * uFlash * 0.15;
  // freeze desaturation
  float L = luma(col);
  col = mix(col, vec3(L)*vec3(0.9,0.95,1.05), uFreeze*0.85);
  gl_FragColor = vec4(col, 1.);
}`;
const UP_FRAG = /* glsl */ `
uniform sampler2D tIn; varying vec2 vUv;
void main(){ gl_FragColor = vec4(texture2D(tIn, vUv).rgb, 1.); }`;

export class Solo {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.cloud = new Pass(CLOUD_FRAG, {
      uTime: { value: 0 }, uZ: { value: 0 }, uFlash: { value: 0 }, uRoll: { value: 0 }, uFreeze: { value: 0 },
      uFlashP: { value: new THREE.Vector3() }, uLook: { value: new THREE.Vector2() },
    });
    this.up = new Pass(UP_FRAG, { tIn: { value: null } }, { noNoise: true });
    this.resize(this.app.rw, this.app.rh);
    this.glow = new Layer2D();
    this.type = new Layer2D();
    this.wl = lines('br')[0];
  }
  resize(w, h) {
    this.rt?.dispose();
    this.rt = makeRT(Math.max(2, Math.round(w * 0.5)), Math.max(2, Math.round(h * 0.5)));
  }
  render(t, rt) {
    const r = this.app.renderer;
    const [a] = SEC.solo;
    const fz = SEC.freeze[0];
    const freeze = ep(fz - 0.05, fz + 0.35, t, ease.outCubic);
    // animation time slows to a stop at the freeze
    const ta = t < fz ? t : fz + (1 - Math.exp(-(t - fz) * 6)) / 6;
    const z = -(ta - a) * 34;
    // lightning inside the clouds on kicks
    let flash = 0, fp = null, fseed = 0;
    for (let i = 0; i < KICK_TIMES.length; i++) {
      const kt = KICK_TIMES[i];
      if (kt > ta) break;
      if (kt < ta - 0.5 || kt < a) continue;
      if (hash1(i * 13 + 1) < 0.55) {
        const I = strikeI(ta - kt, i);
        if (I > flash) {
          flash = I;
          fseed = i;
        }
      }
    }
    const u = this.cloud.u;
    u.uTime.value = ta;
    u.uZ.value = z;
    u.uFlash.value = flash * (1 - freeze * 0.7);
    u.uFlashP.value.set((hash1(fseed) - 0.5) * 30, (hash1(fseed + 1) - 0.3) * 14, z - 20 - hash1(fseed + 2) * 30);
    u.uRoll.value = Math.sin(ta * 0.7) * 0.18 + fbm1(ta * 0.5, 4) * 0.2;
    u.uLook.value.set(Math.sin(ta * 0.9) * 0.1, Math.sin(ta * 0.6) * 0.08 + 0.05);
    u.uFreeze.value = freeze;
    this.cloud.render(r, this.rt, true);
    this.up.u.tIn.value = this.rt.texture;
    this.up.render(r, rt, false);

    // ---- dove of light + ribbon
    const g = this.glow.begin();
    const c = this.type.begin();
    const dpos = (tt) => [960 + Math.sin(tt * 1.3) * 320 + Math.sin(tt * 3.1) * 80, 470 + Math.sin(tt * 0.9 + 1) * 160 - hats(tt) * 60];
    g.save();
    g.globalCompositeOperation = 'lighter';
    // ribbon (lead melody)
    for (const [w, al] of [[16, 0.08], [5, 0.25], [1.6, 0.9]]) {
      g.strokeStyle = `rgba(230,240,255,${al})`;
      g.lineWidth = w;
      g.beginPath();
      for (let k = 0; k < 60; k++) {
        const tt = ta - k * 0.025;
        const [x, y] = dpos(tt);
        const spread = k * 9;
        const yy = y + spread * 0.6 + Math.sin(tt * 40) * loud(tt) * 14;
        const xx = x + Math.sin(k * 0.3) * spread * 0.4;
        if (k === 0) g.moveTo(xx, yy);
        else g.lineTo(xx, yy);
      }
      g.stroke();
    }
    const [dx, dy] = dpos(ta);
    const bob = 1 + kickHit(ta, 8) * 0.15;
    const ph = ta * 13;
    const [px] = dpos(ta - 0.05);
    const facing = dx >= px ? 1 : -1;
    for (const [s, al] of [[1.35, 0.1], [1.12, 0.22], [1, 1]]) {
      g.fillStyle = `rgba(255,255,255,${al})`;
      drawBird(g, dx, dy, 300 * s * bob, ph, facing);
    }
    // feathers shed
    for (let k = 0; k < 24; k++) {
      const age = (ta * 1.7 + k / 24) % 1;
      const seed = Math.floor(ta * 1.7 + k / 24) * 31 + k;
      const fx = dx - age * 500 + (hash1(seed) - 0.5) * 200;
      const fy = dy + age * 300 + (hash1(seed + 1) - 0.5) * 160;
      g.fillStyle = `rgba(255,255,255,${(1 - age) * 0.7})`;
      g.beginPath();
      g.ellipse(fx, fy, 7, 2.5, age * 6 + seed, 0, TAU);
      g.fill();
    }
    g.restore();
    // rain / speed streaks radiating from the vanishing point
    g.save();
    g.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 70; k++) {
      const ang = hash1(k * 7) * TAU;
      const ph = (ta * (0.9 + hash1(k) * 1.4) + hash1(k * 3)) % 1;
      const r0 = 80 + ph * ph * 1100, r1 = r0 + 40 + ph * 160;
      g.strokeStyle = `rgba(210,220,255,${(1 - freeze) * 0.35 * ph})`;
      g.lineWidth = 1 + ph * 1.5;
      g.beginPath();
      g.moveTo(960 + Math.cos(ang) * r0, 500 + Math.sin(ang) * r0 * 0.6);
      g.lineTo(960 + Math.cos(ang) * r1, 500 + Math.sin(ang) * r1 * 0.6);
      g.stroke();
    }
    g.restore();
    // a few 2D bolts framing the shot
    if (flash > 0.2 && freeze < 0.5) {
      const segs = bolt(200 + hash1(fseed * 3) * 1500, -20, 200 + hash1(fseed * 5) * 1500, 400 + hash1(fseed) * 500, fseed + 700, { branch: 0.8, depth: 2, w: 3 });
      drawBolt(g, segs, flash, 1);
    }
    // ---- type
    const fin = ep(a + 0.2, a + 1, t) * (1 - freeze);
    c.save();
    c.globalAlpha = fin;
    c.fillStyle = '#f1e8da';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = font(F.mincho, 120);
    const gl = layoutV('独奏', 230, 300, 120, 1.1);
    gl.forEach((gg) => REVEAL.ink(c, gg, ep(a + 0.2 + gg.i * 0.2, a + 0.8 + gg.i * 0.2, t), 120, true));
    caption(c, 'SOLO  ·  ハト  ·  LEAD GUITAR', 230, 640, 14, 'rgba(241,232,218,0.75)', 'center', 0.35);
    c.restore();
    // freeze ring + whisper
    if (freeze > 0) {
      g.save();
      g.globalCompositeOperation = 'lighter';
      const ra = (t - fz) * 1600;
      g.strokeStyle = `rgba(255,255,255,${Math.max(0, 1 - (t - fz) * 1.5) * 0.8})`;
      g.lineWidth = 2;
      g.beginPath();
      g.arc(dx, dy, ra, 0, TAU);
      g.stroke();
      g.restore();
      drawWhisper(c, t, this.wl, freeze);
      caption(c, '— TIME STOPS —', 960, 1000, 13, `rgba(241,232,218,${0.55 * freeze})`, 'center', 0.6);
    }
    this.glow.draw(r, rt, { boost: 2.2 });
    this.type.draw(r, rt, {});
    return {
      hudInk: 'light', bloom: 1.1, bloomThresh: 0.85, grain: 0.06 + freeze * 0.04, vig: 0.7,
      ca: 0.003 + kickHit(t, 10) * 0.006 * (1 - freeze), flash: flash * 0.12 * (1 - freeze) + (t > fz && t < fz + 0.08 ? 0.5 : 0),
      sat: 1 - freeze * 0.5, contrast: 1.05,
    };
  }
}
