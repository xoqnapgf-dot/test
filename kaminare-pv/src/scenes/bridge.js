// BRIDGE — stripped to a single candle and a whisper. Keys rise as sparks from the flame;
// laughter and volume are a flat line; a church and a shrine are drawn in gold line and
// hauled up onto a stage whose lights come on one beat at a time.
import * as THREE from 'three';
import { Layer2D } from './base.js';
import { Pass } from '../core/gl.js';
import { KEYS } from '../data/keys.js';
import { SEC, lines, vocal, beatF, B, kickHit, snareHit, loud } from '../core/music.js';
import { F, font, layoutV, layoutH, REVEAL, caption } from '../core/type.js';
import { gloss } from '../core/lyrics-meta.js';
import { clamp, lerp, ease, ep, TAU, hash1, fbm1 } from '../core/util.js';

// shared with the solo freeze so the whisper continues across the cut
export function drawWhisper(c, t, line, alpha = 1) {
  if (!line) return;
  c.save();
  c.globalAlpha = alpha;
  c.fillStyle = 'rgba(236,226,208,0.86)';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.font = font(F.mincho, 46);
  const parts = line.text.split(' ');
  let off = 0;
  parts.forEach((p, k) => {
    const gl = layoutV(p, 1330 - k * 70, 300 + k * 50, 46, 1.18);
    gl.forEach((g) => {
      g.i += off;
      REVEAL.ink(c, g, clamp((t - line.c[g.i] + 0.08) / 0.5), 46, true);
    });
    off += p.length + 1;
  });
  c.globalAlpha = alpha * 0.55 * clamp((t - line.t0) * 1.2);
  c.font = font(F.serif, 22);
  if ('letterSpacing' in c) c.letterSpacing = '4px';
  c.textAlign = 'left';
  c.fillText(gloss(line), 1420, 300);
  c.restore();
}

const FLAME_FRAG = /* glsl */ `
uniform float uTime, uSize, uWind, uBright; uniform vec2 uPos;
varying vec2 vUv;
void main(){
  vec2 px = vec2(vUv.x*1920., (1.-vUv.y)*1080.);
  vec2 d = (px - uPos) / uSize;            // flame space: y up negative
  d.y = -d.y;
  float flick = fbm(vec2(uTime*3., d.y*2.)) - .5;
  d.x += flick * 0.25 * max(d.y, 0.) + uWind*d.y*d.y*0.08;
  // teardrop
  float w = 0.32 * (1. - smoothstep(0., 2.2, d.y)) * smoothstep(-0.6, 0.15, d.y) + 0.05;
  float body = smoothstep(w, w*0.35, abs(d.x)) * smoothstep(2.4, 1.2, d.y) * smoothstep(-0.7, -0.2, d.y);
  float core = smoothstep(w*0.55, 0., abs(d.x)) * smoothstep(1.1, 0.2, d.y) * smoothstep(-0.5, -0.1, d.y);
  float blue = smoothstep(0.2, -0.3, d.y) * body;
  vec3 c = vec3(1.0, 0.45, 0.12) * body * 1.6 + vec3(1.0, 0.9, 0.65) * core * 2.6 + vec3(0.2, 0.35, 1.0) * blue * 0.8;
  // halo
  float r = length((px - uPos - vec2(0., -uSize*0.9)) / vec2(1., 1.25));
  c += vec3(1.0, 0.55, 0.22) * exp(-r / (uSize*3.2)) * 0.32 * uBright;
  c += vec3(1.0, 0.4, 0.15) * exp(-r / (uSize*14.)) * 0.08 * uBright;
  gl_FragColor = vec4(c * uBright, 1.);
}`;

function polyLen(pl) {
  let L = 0;
  for (let i = 1; i < pl.length; i++) L += Math.hypot(pl[i][0] - pl[i - 1][0], pl[i][1] - pl[i - 1][1]);
  return L;
}
function drawPolys(c, polys, p) {
  // reveal a list of polylines by cumulative length fraction p
  const total = polys.reduce((a, pl) => a + pl._L, 0);
  let budget = total * p;
  for (const pl of polys) {
    if (budget <= 0) break;
    c.beginPath();
    c.moveTo(pl[0][0], pl[0][1]);
    let used = 0;
    for (let i = 1; i < pl.length; i++) {
      const seg = Math.hypot(pl[i][0] - pl[i - 1][0], pl[i][1] - pl[i - 1][1]);
      if (used + seg > budget) {
        const f = (budget - used) / seg;
        c.lineTo(lerp(pl[i - 1][0], pl[i][0], f), lerp(pl[i - 1][1], pl[i][1], f));
        used = budget;
        break;
      }
      c.lineTo(pl[i][0], pl[i][1]);
      used += seg;
    }
    c.stroke();
    budget -= pl._L;
  }
}
const arcPts = (cx, cy, r, a0, a1, n = 24) => Array.from({ length: n + 1 }, (_, i) => [cx + Math.cos(lerp(a0, a1, i / n)) * r, cy + Math.sin(lerp(a0, a1, i / n)) * r]);

function church() {
  const P = [];
  P.push([[330, 780], [330, 300], [380, 180], [430, 300], [430, 780]]); // left tower
  P.push([[610, 780], [610, 300], [660, 180], [710, 300], [710, 780]]); // right tower
  P.push([[330, 780], [710, 780]]);
  P.push([[430, 520], [520, 380], [610, 520]]); // gable
  P.push([[430, 520], [610, 520]]);
  P.push(arcPts(520, 465, 38, 0, TAU, 40));
  for (let k = 0; k < 8; k++) P.push([[520, 465], [520 + Math.cos((k / 8) * TAU) * 38, 465 + Math.sin((k / 8) * TAU) * 38]]);
  P.push([[480, 780], [480, 670], [488, 640], [505, 618], [520, 606], [535, 618], [552, 640], [560, 670], [560, 780]]); // portal
  P.push([[520, 380], [520, 320]], [[502, 340], [538, 340]]); // cross
  for (const x of [380, 660]) for (const y of [380, 560]) P.push([[x - 12, y + 70], [x - 12, y + 10], [x, y - 6], [x + 12, y + 10], [x + 12, y + 70]]);
  P.forEach((pl) => (pl._L = polyLen(pl)));
  return P;
}
function shrine() {
  const P = [];
  P.push([[1150, 780], [1590, 780]], [[1150, 750], [1590, 750]]);
  for (const x of [1190, 1300, 1440, 1550]) P.push([[x, 750], [x, 600]]);
  const roof = [];
  for (let i = 0; i <= 30; i++) {
    const u = i / 30;
    const x = lerp(1100, 1640, u);
    const y = 600 - Math.sin(u * Math.PI) * 170 - (u < 0.5 ? -1 : -1) * Math.pow(Math.abs(u - 0.5) * 2, 3) * 30;
    roof.push([x, y]);
  }
  P.push(roof);
  P.push([[1100, 600], [1640, 600]]);
  P.push([[1270, 432], [1470, 432]]);
  for (const x of [1270, 1470]) P.push([[x - 22, 448], [x + 26, 368]], [[x + 22, 448], [x - 26, 368]]);
  for (const x of [1320, 1370, 1420]) P.push([[x - 14, 420], [x + 14, 420], [x + 14, 410], [x - 14, 410], [x - 14, 420]]);
  // shimenawa with shide across the front
  const rope = [];
  for (let i = 0; i <= 20; i++) rope.push([lerp(1190, 1550, i / 20), 640 + Math.sin((i / 20) * Math.PI) * 26]);
  P.push(rope);
  for (const x of [1260, 1370, 1480]) P.push([[x, 660], [x + 12, 676], [x - 6, 690], [x + 10, 708], [x - 4, 722]]);
  P.push([[1330, 780], [1310, 840], [1430, 840], [1410, 780]]);
  P.forEach((pl) => (pl._L = polyLen(pl)));
  return P;
}

export class Bridge {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.flame = new Pass(FLAME_FRAG, { uTime: { value: 0 }, uSize: { value: 40 }, uWind: { value: 0 }, uBright: { value: 1 }, uPos: { value: new THREE.Vector2(960, 740) } });
    this.glow = new Layer2D(1);
    this.type = new Layer2D(0);
    this.ls = lines('br');
    this.church = church();
    this.shrine = shrine();
  }
  render(t, rt) {
    const r = this.app.renderer;
    const ls = this.ls;
    const [A, Bt] = SEC.bridge;
    const stage = ep(ls[3].t0 - 0.2, ls[3].t0 + 1.2, t, ease.inOutCubic);
    const gap = t > 150.02 ? 1 : 0; // the breath before the final chorus (held through the cut)
    const camZ = 1 + stage * -0.25; // pull back as the stage arrives
    // candle flame (moves down as we pull back)
    const fu = this.flame.u;
    const fy = lerp(740, 870, stage);
    fu.uTime.value = t;
    fu.uPos.value.set(960, fy);
    fu.uSize.value = lerp(40, 22, stage) * (1 + vocal(t) * 0.25);
    fu.uWind.value = Math.sin(t * 0.7) * 0.6 + vocal(t) * 1.2;
    fu.uBright.value = (1 - gap * 0.85) * (0.9 + loud(t) * 0.3);
    this.flame.render(r, rt, false);

    const g = this.glow.begin();
    const c = this.type.begin();
    // candle body
    c.save();
    const cw = lerp(46, 26, stage), ch = lerp(260, 120, stage);
    const grd = c.createLinearGradient(960 - cw, 0, 960 + cw, 0);
    grd.addColorStop(0, '#2a1e16');
    grd.addColorStop(0.45, '#cdb894');
    grd.addColorStop(1, '#1a120c');
    c.fillStyle = grd;
    c.globalAlpha = 1 - gap * 0.8;
    c.fillRect(960 - cw, fy + 10, cw * 2, ch);
    c.fillStyle = '#1b130e';
    c.fillRect(960 - 2, fy - 4, 4, 18);
    c.restore();

    // key sparks rising from the flame
    g.save();
    g.globalCompositeOperation = 'lighter';
    for (const [nt, m] of KEYS.bridge) {
      const a = t - nt;
      if (a < 0 || a > 3) continue;
      const x = 960 + (m - 56) * 9 + Math.sin(a * 3 + m) * 20 * a;
      const y = fy - 60 - a * 160;
      const al = (1 - a / 3) * (1 - gap);
      const rr = 3 + Math.exp(-a * 5) * 6;
      const gr = g.createRadialGradient(x, y, 0, x, y, rr * 5);
      gr.addColorStop(0, `rgba(255,236,190,${al})`);
      gr.addColorStop(1, 'rgba(255,140,60,0)');
      g.fillStyle = gr;
      g.beginPath();
      g.arc(x, y, rr * 5, 0, TAU);
      g.fill();
    }
    g.restore();

    // whisper lines
    const cur = (() => {
      let k = 0;
      for (let i = 0; i < ls.length; i++) if (t >= ls[i].t0 - 0.2) k = i;
      return k;
    })();
    if (cur === 0) drawWhisper(c, t, ls[0], 1);
    else {
      const l = ls[cur];
      const out = cur < 3 ? 1 - ep(ls[cur + 1].t0 - 0.4, ls[cur + 1].t0, t) : 1 - gap;
      c.save();
      c.globalAlpha = out;
      c.fillStyle = 'rgba(236,226,208,0.9)';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      const sz = cur === 3 ? 64 : 50;
      c.font = font(cur === 3 ? F.minchoB : F.mincho, sz);
      const y = cur === 3 ? 170 : 200;
      const gl = layoutH(c, l.text, 960, y, sz, cur === 3 ? 8 : 18);
      gl.forEach((gg) => REVEAL.ink(c, gg, clamp((t - l.c[gg.i] + 0.08) / 0.4), sz, false));
      c.globalAlpha = out * 0.6 * clamp((t - l.t0) * 1.5);
      c.font = font(F.serif, 24);
      if ('letterSpacing' in c) c.letterSpacing = '6px';
      c.fillText(gloss(l).toUpperCase(), 960, y + 62);
      c.restore();
    }

    // 笑い声も 音量も — the volume as a near-flat oscilloscope line
    {
      const l = ls[1];
      const a = ep(l.t0 - 0.2, l.t0 + 0.3, t) * (1 - ep(ls[2].t0, ls[2].t0 + 0.5, t));
      if (a > 0) {
        g.save();
        g.globalAlpha = a;
        g.strokeStyle = '#ffcf8a';
        g.lineWidth = 1.6;
        g.beginPath();
        for (let x = 280; x <= 1640; x += 4) {
          const tt = t - (1640 - x) / 1360;
          const v = vocal(tt) * 26 * Math.sin(x * 0.35 + t * 20) * Math.exp(-Math.abs(x - 960) / 500);
          if (x === 280) g.moveTo(x, 900 + v);
          else g.lineTo(x, 900 + v);
        }
        g.stroke();
        g.restore();
        caption(c, 'LAUGHTER  ·  VOLUME   ▸  −∞ dB', 960, 940, 13, `rgba(236,226,208,${0.6 * a})`, 'center', 0.4);
      }
    }

    // church & shrine in gold line, then hauled onto the stage
    {
      const l = ls[2];
      const pc = ep(l.c[0] - 0.2, l.c[3] + 0.4, t, ease.inOutCubic);
      const ps = ep(l.c[5] - 0.2, l.c[8] + 0.6, t, ease.inOutCubic);
      if (pc > 0) {
        const s = lerp(1, 0.62, stage);
        const drawSet = (polys, p, ox, cxp) => {
          g.save();
          g.translate(cxp, 780);
          g.scale(s, s);
          g.translate(-cxp + ox * stage, -780 + stage * 40);
          g.strokeStyle = '#ffcf7a';
          g.lineWidth = 2.2;
          g.lineJoin = 'round';
          g.globalAlpha = 1 - gap * 0.6;
          drawPolys(g, polys, p);
          g.restore();
        };
        drawSet(this.church, pc, 300, 520);
        if (ps > 0) drawSet(this.shrine, ps, -300, 1370);
      }
    }
    // the stage arrives; lights switch on beat by beat
    if (stage > 0) {
      const sy = lerp(1180, 800, stage);
      c.save();
      c.fillStyle = '#0d0a0b';
      c.beginPath();
      c.moveTo(260, sy);
      c.lineTo(1660, sy);
      c.lineTo(1860, sy + 180);
      c.lineTo(60, sy + 180);
      c.closePath();
      c.fill();
      c.restore();
      g.save();
      g.strokeStyle = '#f2c766';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(260, sy);
      g.lineTo(1660, sy);
      g.moveTo(60, sy + 180);
      g.lineTo(1860, sy + 180);
      g.stroke();
      const startB = Math.floor(beatF(ls[3].t0 + 0.6));
      const nOn = clamp(Math.floor(beatF(t)) - startB + 1, 0, 8);
      g.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 8; k++) {
        if (k >= nOn) break;
        const x = 280 + k * 194;
        const on = gap ? (k === 3 ? 1 : 0) : 1;
        const fl = Math.exp(-((beatF(t) - startB - k) % 8) * 0.0) * on;
        const cone = g.createLinearGradient(x, 0, x, sy);
        cone.addColorStop(0, `rgba(255,236,200,${0.0})`);
        cone.addColorStop(0.15, `rgba(255,236,200,${0.22 * fl})`);
        cone.addColorStop(1, `rgba(255,190,110,${0.05 * fl})`);
        g.fillStyle = cone;
        g.beginPath();
        g.moveTo(x - 8, -10);
        g.lineTo(x + 8, -10);
        g.lineTo(x + 120, sy + 10);
        g.lineTo(x - 120, sy + 10);
        g.closePath();
        g.fill();
        g.fillStyle = `rgba(255,240,210,${0.9 * fl})`;
        g.beginPath();
        g.ellipse(x, sy + 6, 120, 14, 0, 0, TAU);
        g.fill();
      }
      g.restore();
    }
    // chapter mark
    const fin = ep(A, A + 1, t) * (1 - stage);
    c.save();
    c.globalAlpha = fin;
    c.fillStyle = '#ece2d0';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = font(F.mincho, 96);
    layoutV('静', 240, 330, 96).forEach((gg) => c.fillText(gg.ch, gg.x, gg.y));
    caption(c, 'BRIDGE  ·  ONE CANDLE', 240, 470, 13, 'rgba(236,226,208,0.6)', 'center', 0.4);
    c.restore();

    this.glow.draw(r, rt, { boost: 1.8, scale: camZ < 1 ? 1 : 1 });
    this.type.draw(r, rt, {});
    return {
      hudInk: 'light', hud: 1 - gap, bloom: 1.0, bloomThresh: 0.8, grain: 0.07, vig: 0.85, ca: 0.0015,
      exposure: 1 - gap * 0.3, contrast: 1.04, sat: 0.95,
    };
  }
}
