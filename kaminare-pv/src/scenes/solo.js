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
uniform float uTime, uZ, uFlash, uRoll, uFreeze, uBank; uniform vec3 uFlashP; uniform vec2 uLook;
varying vec2 vUv;
float fbmC(vec3 p){ float s=0., a=.5; for(int i=0;i<3;i++){ s+=a*vnoise3(p); p=p*2.07+vec3(1.7,9.2,3.1); a*=.5;} return s/0.875; }
float topH(vec2 xz){ return -4.5 + fbm(xz*0.035 + vec2(0., uTime*0.02))*9.0; }
float dens(vec3 p){
  float h = topH(p.xz);
  float d = (h - p.y) * 0.8;
  d += (fbmC(p*0.16 + vec3(0., 0., uTime*0.1)) - 0.5) * 2.1;
  return clamp(d, 0., 1.);
}
void main(){
  vec2 q = (vUv - .5) * vec2(16./9., 1.);
  q = rot(uRoll) * q;
  vec3 ro = vec3(sin(uZ*0.012)*30., 5.5 + sin(uZ*0.03)*1.2, uZ);
  vec3 fw = normalize(vec3(uLook.x + uBank*0.2, -0.12 + uLook.y, -1.));
  vec3 rt = normalize(cross(fw, vec3(0.,1.,0.)));
  vec3 up = cross(rt, fw);
  vec3 rd = normalize(fw*1.2 + rt*q.x + up*q.y);
  vec3 L = normalize(vec3(0.52, 0.2, -1.));          // the moon, low ahead-right
  // sky
  float sy = rd.y;
  vec3 sky = mix(vec3(0.42,0.12,0.22), vec3(0.04,0.025,0.1), smoothstep(-0.02, 0.3, sy));
  sky = mix(sky, vec3(0.01,0.008,0.03), smoothstep(0.3, 0.9, sy));
  float md = max(dot(rd, L), 0.);
  sky += vec3(1.0,0.9,0.78) * smoothstep(0.9993, 0.9996, md) * 2.2;          // moon disc
  sky += vec3(1.0,0.6,0.5) * pow(md, 90.) * 0.3 + vec3(0.9,0.4,0.5) * pow(md, 8.) * 0.1;
  float st = step(0.996, hash12(floor(rd.xy*800.))) * smoothstep(0.1, 0.5, sy);
  sky += st * 0.8;
  vec3 col = vec3(0.); float T = 1.;
  if(rd.y < 0.08){
    float t = (ro.y - 5.0) / max(-rd.y, 0.02);            // jump to near the cloud tops
    t = max(t, 0.5);
    t += hash12(gl_FragCoord.xy + fract(uTime)*17.) * 1.2;
    for(int i=0;i<28;i++){
      vec3 p = ro + rd*t;
      if(p.y < -14. || t > 160.) break;
      float d = dens(p);
      if(d > 0.01){
        float sh = dens(p + L*1.8 + vec3(0.,1.2,0.));
        float lit = exp(-sh*2.2);
        float fl = uFlash * exp(-length(p - uFlashP)*0.06);
        vec3 shadowC = vec3(0.025,0.02,0.07);
        vec3 litC = vec3(0.85,0.62,0.72) * 0.75;
        float rimL = pow(max(dot(normalize(vec3(rd.x, 0., rd.z)), vec3(L.x, 0., L.z)), 0.), 8.);
        vec3 lum = mix(shadowC, litC, pow(lit, 1.6)*0.9) + vec3(1.,.75,.7)*rimL*lit*0.25 + vec3(0.75,0.82,1.)*fl*3.0 + vec3(0.6,0.2,0.3)*0.12*(1.-lit);
        float a = d*0.5;
        col += T*a*lum;
        T *= 1. - a;
        if(T < 0.03) break;
      }
      t += 0.9 + t*0.035;
    }
    float far = smoothstep(60., 160., (ro.y - 2.) / max(-rd.y,0.01));
    col = mix(col, sky*(1.-T) + col, 0.) ;
    col += T*sky;
    col = mix(col, sky, far*0.7);
  } else col = sky;
  float Lm = luma(col);
  col = mix(col, vec3(Lm)*vec3(0.9,0.95,1.05), uFreeze*0.85);
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
      uTime: { value: 0 }, uZ: { value: 0 }, uFlash: { value: 0 }, uRoll: { value: 0 }, uFreeze: { value: 0 }, uBank: { value: 0 },
      uFlashP: { value: new THREE.Vector3() }, uLook: { value: new THREE.Vector2() },
    });
    this.up = new Pass(UP_FRAG, { tIn: { value: null } }, { noNoise: true });
    this.resize(this.app.rw, this.app.rh);
    this.glow = new Layer2D(1);
    this.type = new Layer2D(0);
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
    const z = -(ta - a) * 30;
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
    u.uFlashP.value.set((hash1(fseed) - 0.5) * 80, -4 + hash1(fseed + 1) * 3, z - 30 - hash1(fseed + 2) * 60);
    u.uRoll.value = Math.sin(ta * 0.45) * 0.16 + fbm1(ta * 0.5, 4) * 0.08;
    if (u.uBank) u.uBank.value = Math.sin(ta * 0.45);
    u.uLook.value.set(Math.sin(ta * 0.35) * 0.12, Math.sin(ta * 0.6) * 0.04);
    u.uFreeze.value = freeze;
    this.cloud.render(r, this.rt, true);
    this.up.u.tIn.value = this.rt.texture;
    this.up.render(r, rt, false);

    // ---- dove of light + ribbon
    const g = this.glow.begin();
    const c = this.type.begin();
    const dpos = (tt) => [900 + Math.sin(tt * 1.1) * 300 + Math.sin(tt * 2.7) * 60, 420 + Math.sin(tt * 0.8 + 1) * 120 - hats(tt) * 40];
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
        const yy = y + spread * 0.45 + Math.sin(tt * 9 + k * 0.2) * loud(tt) * 6;
        const xx = x + spread * 0.25;
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
    for (const [s, al] of [[1.25, 0.08], [1.08, 0.16], [1, 0.85]]) {
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
      const segs = bolt(200 + hash1(fseed * 3) * 1500, -20, 200 + hash1(fseed * 5) * 1500, 400 + hash1(fseed) * 500, fseed + 700, { branch: 0.8, depth: 2, w: 1.8 });
      drawBolt(g, segs, flash * 0.6, 1);
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
      const ra = Math.max(0, t - fz) * 1600;
      g.strokeStyle = `rgba(255,255,255,${Math.max(0, 1 - (t - fz) * 1.5) * 0.8})`;
      g.lineWidth = 2;
      g.beginPath();
      g.arc(dx, dy, ra, 0, TAU);
      g.stroke();
      g.restore();
      drawWhisper(c, t, this.wl, freeze);
      caption(c, '— TIME STOPS —', 960, 1000, 13, `rgba(241,232,218,${0.55 * freeze})`, 'center', 0.6);
    }
    this.glow.draw(r, rt, { boost: 1.5 });
    this.type.draw(r, rt, {});
    return {
      hudInk: 'light', bloom: 1.1, bloomThresh: 0.85, grain: 0.06 + freeze * 0.04, vig: 0.7,
      ca: 0.003 + kickHit(t, 10) * 0.006 * (1 - freeze), flash: flash * 0.12 * (1 - freeze) + (t > fz && t < fz + 0.08 ? 0.5 : 0),
      sat: 1 - freeze * 0.5, contrast: 1.05,
    };
  }
}
