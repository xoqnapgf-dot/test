// INTRO — darkness, a sea of penlights in the five member colours, a lone keyboard
// melody written in light. The gong hit (5.30 s) turns the melody into a bronze gong;
// "This is a Japanese song" is spoken; the title is painted; we push into the gong.
import * as THREE from 'three';
import { Layer2D } from './base.js';
import { Pass } from '../core/gl.js';
import { KEYS } from '../data/keys.js';
import { GONG, SEC, beatF, kickHit, loud, hats, B } from '../core/music.js';
import { F, font, caption } from '../core/type.js';
import { bolt, drawBolt, strikeI } from '../gfx/lightning.js';
import { clamp, lerp, ease, ep, rng, hash1, smooth, TAU, win } from '../core/util.js';

export const MEMBER_COLORS = ['#ff4a2e', '#f4f1ff', '#ffc24a', '#a56bff', '#3fe0b0'];

const BG_FRAG = /* glsl */ `
uniform float uTime, uGong, uAge, uZoom, uLight, uOpen;
uniform vec2 uC; uniform float uR;
varying vec2 vUv;
void main(){
  vec2 asp = vec2(16./9., 1.);
  vec2 p = (vUv - .5) * asp / uZoom + (uC - .5)*asp*(1. - 1./uZoom);
  vec2 cc = (uC - .5) * asp;
  vec2 d = p - cc;
  float r = length(d);
  // shock ring distortion
  float wave = sin((r - uAge*1.25)*55.) * exp(-abs(r - uAge*1.25)*14.) * exp(-uAge*1.6) * step(0., uAge);
  vec2 pw = p + normalize(d+1e-5) * wave * 0.012;
  // smoke
  float sm = fbm(pw*2.2 + vec2(uTime*0.03, -uTime*0.05)) * fbm(pw*4. - uTime*0.02);
  vec3 col = vec3(0.012, 0.008, 0.012) + vec3(0.22,0.08,0.05) * sm * (0.4 + uLight*1.6) * smoothstep(1.2, 0.0, length(pw - cc + vec2(0.,0.3)));
  // stage glow from below
  col += vec3(0.5,0.12,0.06) * exp(-(1.-vUv.y)*0.0) * smoothstep(0.55, -0.1, vUv.y) * 0.18 * (0.5+uLight);
  // gong
  float R = uR;
  if(uGong > 0.001){
    vec2 q = (pw - cc) / R;
    float rr = length(q);
    float ang = atan(q.y, q.x);
    // hammered bronze: polar dents + concentric lathe lines
    float dents = vnoise(vec2(ang*9., rr*18.)) * 0.6 + vnoise(q*22.)*0.4;
    float lathe = sin(rr*160. + vnoise(q*6.)*4.) * 0.5 + 0.5;
    // vibration waves after the hit
    float vib = sin(rr*38. - uAge*42.) * exp(-uAge*0.9) * step(0., uAge);
    // normal-ish shading
    vec2 grad = vec2(cos(ang), sin(ang)) * (dents - .5) * 0.6 + q*0.25 + vec2(cos(ang),sin(ang))*vib*0.25;
    vec3 n = normalize(vec3(grad, 1.));
    vec3 L = normalize(vec3(-0.5, 0.6, 0.8));
    float diff = max(dot(n, L), 0.);
    float spec = pow(max(dot(reflect(-L, n), vec3(0.,0.,1.)), 0.), 30.);
    vec3 bronze = mix(vec3(0.35,0.18,0.07), vec3(0.85,0.55,0.22), lathe*0.35 + dents*0.4);
    // raised boss
    float boss = smoothstep(0.24, 0.2, rr);
    bronze = mix(bronze, vec3(0.95,0.68,0.3), boss*0.6);
    vec3 g = bronze * (0.15 + diff*0.9) + vec3(1.,.8,.5) * spec * (0.6 + 1.5*exp(-uAge*2.));
    g *= 0.6 + 0.6*uLight;
    // rim band
    float rim = smoothstep(0.93, 0.95, rr) * smoothstep(1.0, 0.98, rr);
    g = mix(g, vec3(0.12,0.07,0.04), rim*0.8);
    g += vec3(1.0,0.55,0.2) * exp(-abs(rr-0.97)*80.) * (0.3 + 1.2*exp(-uAge*1.5)) ;
    float inside = smoothstep(1.0, 0.99, rr);
    col = mix(col, g, inside * uGong);
    // open: the centre glows white-hot when we push in
    col += vec3(1.,.85,.6) * smoothstep(0.9, 0.0, rr) * uOpen * 2.5 * uGong;
    // halo
    col += vec3(1.0,0.45,0.15) * exp(-max(rr-1.,0.)*5.) * (0.08 + 0.6*exp(-uAge*1.4)) * uGong * step(1., rr);
  }
  // bright shock ring
  col += vec3(1.,.7,.4) * exp(-abs(r - uAge*1.25)*40.) * exp(-uAge*1.8) * step(0., uAge) * 1.5;
  gl_FragColor = vec4(col, 1.);
}`;

export class Intro {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.bg = new Pass(BG_FRAG, {
      uTime: { value: 0 }, uGong: { value: 0 }, uAge: { value: -1 }, uZoom: { value: 1 }, uLight: { value: 0 }, uOpen: { value: 0 },
      uC: { value: new THREE.Vector2(0.5, 0.5) }, uR: { value: 0.3 },
    });
    this.glow = new Layer2D(1);
    this.type = new Layer2D(0);
    const R = rng(77);
    this.crowd = [];
    for (let i = 0; i < 230; i++) {
      const z = Math.pow(R(), 1.6); // 0 near .. 1 far
      this.crowd.push({
        x: R() * 2200 - 140,
        y: 1080 - lerp(40, 420, z) + R() * 40,
        z,
        col: MEMBER_COLORS[Math.floor(R() * 5)],
        ph: R() * TAU,
        sp: 0.6 + R() * 1.4,
        amp: 6 + R() * 20,
      });
    }
    this.crowd.sort((a, b) => b.z - a.z);
    this.notes = KEYS.intro.map(([tt, m], i) => ({ t: tt, m, i }));
  }

  render(t, rt) {
    const r = this.app.renderer;
    const age = t - GONG;
    const gongOn = ep(GONG - 0.02, GONG + 0.12, t, ease.outExpo);
    const push = ep(10.45, SEC.v1[0] + 0.4, t, ease.inCubic);
    const zoom = 1 + push * 5 + Math.max(0, t - 8) * 0.02;
    const u = this.bg.u;
    u.uTime.value = t;
    u.uGong.value = gongOn;
    u.uAge.value = age;
    u.uZoom.value = zoom;
    u.uLight.value = clamp(t / 5) * 0.4 + (age > 0 ? 0.6 * Math.exp(-age * 0.5) + 0.25 : 0) + loud(t) * 0.3;
    u.uOpen.value = push;
    this.bg.render(r, rt, false);

    const g = this.glow.begin();
    const c = this.type.begin();
    const flare = age > 0 ? Math.exp(-age * 1.2) : 0;
    // ---- stage searchlights sweeping through the haze
    g.save();
    g.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 5; k++) {
      const sx = 260 + k * 350;
      const sp = age > 0 ? 1.8 : 0.35;
      const ang = Math.sin(t * sp * (0.6 + k * 0.13) + k * 1.7) * 0.42 + (k - 2) * 0.08;
      const L = 1300;
      const ex = sx + Math.sin(ang) * L, ey = 1100 - Math.cos(ang) * L;
      const a = (0.05 + flare * 0.08) * clamp(t * 0.4);
      const grd = g.createLinearGradient(sx, 1100, ex, ey);
      grd.addColorStop(0, `rgba(255,170,110,${a * 1.6})`);
      grd.addColorStop(1, 'rgba(255,120,80,0)');
      g.fillStyle = grd;
      g.beginPath();
      g.moveTo(sx - 6, 1100);
      g.lineTo(sx + 6, 1100);
      g.lineTo(ex + Math.cos(ang) * 160, ey + Math.sin(ang) * 160);
      g.lineTo(ex - Math.cos(ang) * 160, ey - Math.sin(ang) * 160);
      g.closePath();
      g.fill();
    }
    g.restore();
    // ---- crowd penlights
    g.save();
    g.globalCompositeOperation = 'lighter';
    const sway = (p) => Math.sin(t * p.sp + p.ph) * p.amp * (1 + flare * 2);
    for (const p of this.crowd) {
      const s = lerp(11, 2.5, p.z) * (1 + flare * 0.4);
      const x = p.x + sway(p), y = p.y + Math.cos(t * p.sp * 0.7 + p.ph) * 4;
      const a = lerp(0.32, 0.14, p.z) * (0.6 + 0.4 * Math.sin(t * 3 + p.ph * 5)) * (1 + flare * 0.6);
      const grd = g.createRadialGradient(x, y, 0, x, y, s * 2.6);
      grd.addColorStop(0, p.col);
      grd.addColorStop(0.25, p.col + '88');
      grd.addColorStop(1, p.col + '00');
      g.globalAlpha = clamp(a * clamp(t * 0.6 + 0.2));
      g.fillStyle = grd;
      g.beginPath();
      g.arc(x, y, s * 2.6, 0, TAU);
      g.fill();
      // the stick itself (near ones)
      if (p.z < 0.12) {
        g.globalAlpha = clamp(a * 0.8);
        g.strokeStyle = p.col;
        g.lineWidth = Math.max(1.2, s * 0.28);
        g.beginPath();
        const ang = Math.sin(t * p.sp + p.ph) * 0.35;
        g.moveTo(x, y);
        g.lineTo(x + Math.sin(ang) * s * 7, y + Math.cos(ang) * s * 7);
        g.stroke();
      }
    }
    g.restore();

    // ---- melody: notes written in light, gathered into the gong rim at the hit
    const cx = 960, cy = 540;
    const gR = 0.3 * 1080 * 0.97;
    const pos = (n) => {
      const sx = 230 + (n.t / 5.3) * 1460;
      const sy = 560 - (n.m - 66) * 15;
      const k = ep(GONG - 0.05 + n.i * 0.008, GONG + 0.35 + n.i * 0.012, t, ease.inOutCubic);
      const ang = (n.i / this.notes.length) * TAU - Math.PI / 2;
      return [lerp(sx, cx + Math.cos(ang) * gR, k), lerp(sy, cy + Math.sin(ang) * gR, k), k];
    };
    g.save();
    g.globalCompositeOperation = 'lighter';
    const vis = this.notes.filter((n) => t >= n.t - 0.02);
    // thread
    if (vis.length > 1 && t < GONG + 0.6) {
      g.strokeStyle = 'rgba(242,190,110,0.5)';
      g.lineWidth = 1.4;
      g.beginPath();
      vis.forEach((n, i) => {
        const [x, y] = pos(n);
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      });
      g.globalAlpha = 1 - clamp((t - GONG) / 0.5);
      g.stroke();
      g.globalAlpha = 1;
    }
    for (const n of vis) {
      const [x, y, k] = pos(n);
      const a = t - n.t;
      const fade = 1 - clamp((t - GONG - 0.6) / 1.2);
      if (fade <= 0) continue;
      const rr = 5 + Math.exp(-a * 4) * 10;
      const grd = g.createRadialGradient(x, y, 0, x, y, rr * 4);
      grd.addColorStop(0, 'rgba(255,240,200,1)');
      grd.addColorStop(0.3, 'rgba(255,190,90,0.6)');
      grd.addColorStop(1, 'rgba(255,120,40,0)');
      g.fillStyle = grd;
      g.globalAlpha = fade;
      g.beginPath();
      g.arc(x, y, rr * 4, 0, TAU);
      g.fill();
      // birth ring
      if (a < 0.8) {
        g.strokeStyle = `rgba(255,210,150,${(1 - a / 0.8) * 0.8})`;
        g.lineWidth = 1.2;
        g.beginPath();
        g.arc(x, y, 8 + a * 70, 0, TAU);
        g.stroke();
      }
      g.globalAlpha = 1;
      // note name tick
      if (k < 0.1 && a < 1.6) {
        c.save();
        c.globalAlpha = (1 - a / 1.6) * 0.7;
        caption(c, ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][Math.round(n.m) % 12] + Math.floor(Math.round(n.m) / 12 - 1), x + 14, y - 16, 12, '#f2d58a');
        c.restore();
      }
    }
    g.restore();

    // ---- lightning crackle around the gong in the build (from ~9.8 s)
    if (t > 9.6 && t < SEC.v1[0] + 0.4) {
      const k = Math.floor(t * 9);
      for (let j = 0; j < 3; j++) {
        const seed = k * 3 + j;
        const st = seed / 9 / 3;
        const ag = t - Math.floor(t * 9) / 9;
        const a0 = hash1(seed) * TAU;
        const segs = bolt(cx + Math.cos(a0) * gR * 1.02, cy + Math.sin(a0) * gR * 1.02, cx + Math.cos(a0) * (gR + 260 + hash1(seed + 3) * 300), cy + Math.sin(a0) * (gR + 260 + hash1(seed + 3) * 300), seed + 5000, { branch: 0.6, depth: 1, w: 2.2 });
        drawBolt(g, segs, strikeI(ag + j * 0.03, seed) * ep(9.6, 11, t) * (hash1(seed + 9) < 0.7 ? 1 : 0), 1);
        void st;
      }
    }

    // ---- spoken caption: [ This is a Japanese song ]
    {
      const s0 = 5.82, s1 = 7.95;
      const txt = 'THIS IS A JAPANESE SONG';
      const n = Math.floor(clamp((t - s0) / (7.3 - s0)) * txt.length);
      if (t > s0 - 0.1 && t < s1 + 0.6) {
        const out = clamp((t - s1) / 0.5);
        c.save();
        c.globalAlpha = 1 - out;
        const glitch = out > 0 ? Math.floor(hash1(Math.floor(t * 30)) * 20) - 10 : 0;
        caption(c, `[  ${txt.slice(0, n)}${n < txt.length && Math.floor(t * 4) % 2 ? '▍' : ''}  ]`, 960 + glitch, 1080 - 150, 30, '#f1e8da', 'center', 0.32);
        caption(c, '● VOICE  ·  INTRO  ·  ' + t.toFixed(2) + 's', 960, 1080 - 112, 12, 'rgba(241,232,218,0.5)', 'center');
        c.restore();
      }
    }

    // ---- title painted across the gong
    {
      const a0 = 8.15;
      if (t > a0) {
        const p = ep(a0, a0 + 0.9, t, ease.outCubic);
        const zoomK = zoom;
        c.save();
        c.translate(cx, cy);
        c.scale(zoomK, zoomK);
        c.font = font(F.brush, 300);
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        const chars = ['カ', 'ミ', 'ナ', 'レ'];
        const step = 300;
        chars.forEach((ch, i) => {
          const pp = ep(a0 + i * 0.16, a0 + i * 0.16 + 0.45, t, ease.outCubic);
          if (pp <= 0) return;
          const x = (i - 1.5) * step;
          c.save();
          c.translate(x, 0);
          const sc = 1.25 - 0.25 * pp;
          c.scale(sc, sc);
          c.globalAlpha = clamp(pp * 1.6);
          if (pp < 0.95) c.filter = `blur(${((1 - pp) * 14).toFixed(1)}px)`;
          c.lineJoin = 'round';
          c.lineWidth = 14;
          c.strokeStyle = 'rgba(20,8,4,0.85)';
          c.strokeText(ch, 4, 8);
          c.fillStyle = '#e8432b';
          c.fillText(ch, 0, 0);
          c.restore();
        });
        const q = ep(a0 + 0.6, a0 + 1.4, t);
        c.globalAlpha = q;
        c.font = font(F.mincho, 40);
        c.fillStyle = '#f6e7c8';
        if ('letterSpacing' in c) c.letterSpacing = '30px';
        c.fillText('神 鳴 れ', 15, 190);
        c.font = font(F.black, 56);
        if ('letterSpacing' in c) c.letterSpacing = '4px';
        c.fillStyle = '#f2d58a';
        c.fillText('Kaminare', 0, -185);
        c.restore();
      }
    }
    // tiny opening slate
    if (t < 4.6) {
      c.save();
      c.globalAlpha = win(t, 0.4, 4.6, 0.8, 0.8) * 0.85;
      caption(c, 'LIVE  ·  神鳴 HALL  ·  2026', 960, 470, 16, '#f1e8da', 'center', 0.5);
      caption(c, 'ONE KEYBOARD.  FIVE NAMES.  ONE SOUND.', 960, 505, 12, 'rgba(241,232,218,0.55)', 'center', 0.4);
      c.restore();
    }

    this.glow.draw(r, rt, { boost: 2.2, scale: zoom });
    this.type.draw(r, rt, {});
    return {
      hudInk: 'light', bloom: 1.2, bloomThresh: 0.9, grain: 0.06, vig: 0.75, ca: 0.004,
      flash: Math.max(age > 0 && age < 0.25 ? (1 - age / 0.25) * 0.42 : 0, push * push * 0.9),
      exposure: 1 + (age > 0 ? Math.exp(-age * 3) * 0.4 : 0),
      hud: clamp(t / 2),
    };
  }
}
