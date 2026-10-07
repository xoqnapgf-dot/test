// VERSE II — a risograph zine. Two inks (Medium Blue + Fluorescent Red) on cream stock,
// halftone screens, grain dropouts and misregistration that kicks with the drums.
// Shots: octagram sticks · twin kicks shatter the night · lead → white doves ·
//        altar → wall of sound · sutra & strings · one vibration (Chladni sand).
import * as THREE from 'three';
import { Pass, CanvasLayer } from '../core/gl.js';
import { lines, SEC, beatF, kickHit, snareHit, KICK_TIMES, beatPulse, B } from '../core/music.js';
import { F, font, layoutH, layoutV, REVEAL, caption } from '../core/type.js';
import { gloss } from '../core/lyrics-meta.js';
import { EMBLEMS, SYMBOLS, SYMBOL_KEYS, drawSym, drawBird } from '../gfx/symbols.js';
import { clamp, lerp, ease, ep, rng, TAU, hash1, noise2 } from '../core/util.js';

const RISO_FRAG = /* glsl */ `
uniform sampler2D tB, tR; uniform vec3 uPaper, uBlue, uRed; uniform vec2 uMis; uniform float uTime, uSeed;
varying vec2 vUv;
float screenDot(vec2 p, float ang, float size, float a){
  vec2 q = rot(ang) * p / size;
  float d = length(fract(q) - .5);
  float r = sqrt(clamp(a,0.,1.)) * 0.72;
  return smoothstep(r + 0.06, r - 0.06, d);
}
void main(){
  vec2 px = vUv * vec2(1920., 1080.);
  vec2 res = vec2(1920.,1080.);
  vec4 b = texture2D(tB, vUv);
  vec4 r = texture2D(tR, vUv + uMis/res);
  // halftone only the mid-tones; solids stay solid
  float aB = b.a, aR = r.a;
  float hB = screenDot(px, 0.785, 6.5, aB);
  float hR = screenDot(px, 0.26, 6.5, aR);
  aB = mix(hB, aB, smoothstep(0.85, 0.98, aB));
  aR = mix(hR, aR, smoothstep(0.85, 0.98, aR));
  // riso grain: ink dropouts + roller streaks
  float n = hash12(floor(px*0.9) + uSeed);
  float streak = vnoise(vec2(px.x*0.004, px.y*0.25 + uSeed));
  aB *= 1. - 0.32*step(0.86, n) - 0.12*smoothstep(0.6,0.9,streak);
  aR *= 1. - 0.28*step(0.88, hash12(floor(px*0.9)+uSeed+7.)) - 0.1*smoothstep(0.65,0.9,streak);
  // cream stock with fibres
  vec3 paper = uPaper * (0.94 + 0.06*fbm(px*0.01)) * (0.97 + 0.03*hash12(floor(px)));
  vec3 c = paper;
  c *= mix(vec3(1.), uBlue, aB);
  c *= mix(vec3(1.), uRed, aR);
  // overprint is a deep plum like real riso
  gl_FragColor = vec4(c, 1.);
}`;

function shards(seed) {
  // break the night (a rectangle) into jagged triangles radiating from a few impact points
  const R = rng(seed);
  const tris = [];
  const cx = 960, cy = 520;
  const rings = [0, 120, 260, 420, 620, 900];
  for (let k = 0; k < rings.length - 1; k++) {
    const n = 7 + k * 5;
    const off = R() * TAU;
    for (let i = 0; i < n; i++) {
      const a0 = off + (i / n) * TAU + (R() - 0.5) * 0.2;
      const a1 = off + ((i + 1) / n) * TAU + (R() - 0.5) * 0.2;
      const r0 = rings[k] * (0.85 + R() * 0.3), r1 = rings[k + 1] * (0.85 + R() * 0.3);
      const P = (a, rr) => [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.75];
      tris.push({ pts: [P(a0, r0), P(a1, r0), P(a1, r1), P(a0, r1)], ang: (a0 + a1) / 2, k, sp: 0.6 + R() * 0.8, rot: (R() - 0.5) * 2 });
    }
  }
  return tris;
}

// Chladni plate: f = cos(nπx)cos(mπy) - cos(mπx)cos(nπy). Converge particles to nodal lines.
function chladni(n, m, N, seed) {
  const R = rng(seed);
  const f = (x, y) => Math.cos(n * Math.PI * x) * Math.cos(m * Math.PI * y) - Math.cos(m * Math.PI * x) * Math.cos(n * Math.PI * y);
  const out = new Float32Array(N * 2);
  for (let i = 0; i < N; i++) {
    let x = R() * 2 - 1, y = R() * 2 - 1;
    for (let it = 0; it < 40; it++) {
      const v = f(x, y);
      const e = 1e-3;
      const gx = (f(x + e, y) - v) / e, gy = (f(x, y + e) - v) / e;
      const gl = gx * gx + gy * gy + 1e-6;
      x -= (v * gx) / gl * 0.6;
      y -= (v * gy) / gl * 0.6;
      x = clamp(x, -1, 1);
      y = clamp(y, -1, 1);
    }
    out[i * 2] = x;
    out[i * 2 + 1] = y;
  }
  return out;
}

const SUTRA = ['色即是空', '空即是色', '受想行識', '亦復如是', '羯諦羯諦', '波羅羯諦', '波羅僧羯諦', '菩提薩婆訶', '観自在菩薩', '照見五蘊皆空'];

export class Verse2 {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.B = new CanvasLayer(1920, 1080);
    this.R = new CanvasLayer(1920, 1080);
    this.pass = new Pass(RISO_FRAG, {
      tB: { value: this.B.tex }, tR: { value: this.R.tex }, uPaper: { value: new THREE.Color('#f1e9d6') },
      uBlue: { value: new THREE.Color('#2f4bb8') }, uRed: { value: new THREE.Color('#ff4f3a') },
      uMis: { value: new THREE.Vector2(3, -2) }, uTime: { value: 0 }, uSeed: { value: 0 },
    });
    this.ls = lines('v2');
    this.tris = shards(17);
    this.cl = [chladni(3, 5, 5200, 3), chladni(4, 7, 5200, 4), chladni(2, 9, 5200, 5)];
    const Rr = rng(8);
    this.rand = new Float32Array(5200 * 2).map(() => Rr() * 2 - 1);
    const Rd = rng(9);
    this.flock = Array.from({ length: 46 }, () => ({ a: Rd() * 0.9 - 0.45, sp: 0.7 + Rd() * 0.6, s: 0.4 + Rd() * 0.8, ph: Rd() * TAU, d: Rd() * 0.6 }));
  }

  shot(t) {
    const ls = this.ls;
    let i = 0;
    for (let k = 0; k < ls.length; k++) if (t >= ls[k].t0 - 0.35) i = k;
    return i;
  }

  render(t, rt) {
    const r = this.app.renderer;
    const b = this.B.begin();
    const rr = this.R.begin();
    const i = this.shot(t);
    const l = this.ls[i];
    const s0 = i === 0 ? SEC.v2[0] : l.t0 - 0.35;
    const s1 = this.ls[i + 1] ? this.ls[i + 1].t0 - 0.35 : SEC.v2[1];
    const u = clamp((t - s0) / (s1 - s0));
    const k = kickHit(t, 10);
    const fn = ['sticks', 'night', 'doves', 'wall', 'sutra', 'chladni'][i];
    this[fn](b, rr, t, l, u, s0, s1);
    this.lyric(b, rr, t, l, i);
    // folio marks
    caption(b, `ZINE · KAMINARE · P.${String(i + 2).padStart(2, '0')}`, 80, 1035, 13, 'rgba(47,75,184,1)');
    caption(rr, 'RISO 2C  ·  MEDIUM BLUE / FLUO RED', 1840, 1035, 13, 'rgba(255,79,58,1)', 'right');
    this.B.end();
    this.R.end();
    const pu = this.pass.u;
    pu.tB.value = this.B.tex;
    pu.tR.value = this.R.tex;
    pu.uMis.value.set(3 + k * 14 * Math.sin(t * 50), -2 + k * 8);
    pu.uSeed.value = Math.floor(t * 12) % 7;
    this.pass.render(r, rt, false);
    return { hudInk: 'dark', bloom: 0.2, bloomThresh: 0.97, grain: 0.03, vig: 0.3, ca: 0.001, hudShu: '#ff4f3a' };
  }

  lyric(b, rr, t, l, i) {
    // big lyric set in Dela Gothic in blue with a red shadow plate
    const layouts = [
      [120, 'left', 112], [960, 'center', 118], [120, 'left', 100], [960, 'center', 104], [1800, 'right', 100], [960, 'center', 104],
    ];
    const [x, al, sz] = layouts[i];
    const y = i === 1 || i === 5 ? 930 : i === 3 ? 140 : 170;
    if (i === 2 || i === 4) {
      // paper label knocked out of the dark plate so the type stays legible
      b.save();
      b.font = font(F.gothic, sz);
      const gl = layoutH(b, l.text, x, y, sz, 2, al);
      const x0 = al === 'left' ? x : al === 'right' ? x - gl.total : x - gl.total / 2;
      const rev = clamp((t - l.t0 + 0.4) / 0.3);
      b.globalCompositeOperation = 'destination-out';
      b.fillRect(x0 - 30, y - sz * 0.75, (gl.total + 60) * rev, sz * 1.5 + 70);
      b.restore();
    }
    for (const [c, col, dx, dy] of [[rr, '#000', 8, 8], [b, '#000', 0, 0]]) {
      c.save();
      c.font = font(F.gothic, sz);
      c.textBaseline = 'middle';
      c.fillStyle = col;
      const gl = layoutH(c, l.text, x + dx, y + dy, sz, 2, al);
      gl.forEach((g) => REVEAL.rise(c, g, clamp((t - l.c[g.i] + 0.04) / 0.2), sz));
      c.restore();
    }
    b.save();
    b.font = font(F.mono, 18);
    b.fillStyle = '#000';
    b.globalAlpha = clamp((t - l.t0) * 2);
    b.textAlign = al;
    if ('letterSpacing' in b) b.letterSpacing = '5px';
    b.fillText(gloss(l).toUpperCase(), x, y + (y < 500 ? 90 : -88));
    b.restore();
  }

  // 1 — sticks tracing an octagram {8/3}
  sticks(b, rr, t, l, u) {
    const bf = beatF(t);
    const ang = bf * 0.25;
    const cx = 1100, cy = 560;
    // star trail grows one edge per beat
    const startB = Math.floor(beatF(l.t0 - 0.35));
    const edges = clamp(bf - startB, 0, 8);
    const R0 = 330;
    const P = (j) => {
      const a = ((j * 3) / 8) * TAU - Math.PI / 2;
      return [cx + Math.cos(a) * R0, cy + Math.sin(a) * R0];
    };
    rr.save();
    rr.strokeStyle = '#000';
    rr.lineWidth = 26;
    rr.lineJoin = 'miter';
    rr.beginPath();
    const n = Math.floor(edges);
    const fr = edges - n;
    rr.moveTo(...P(0));
    for (let j = 1; j <= n; j++) rr.lineTo(...P(j));
    if (n < 8) {
      const a = P(n), c2 = P(n + 1);
      rr.lineTo(lerp(a[0], c2[0], fr), lerp(a[1], c2[1], fr));
    }
    rr.stroke();
    rr.restore();
    // halftone glow disc behind (mid-tone)
    b.save();
    const gr = b.createRadialGradient(cx, cy, 0, cx, cy, 420);
    gr.addColorStop(0, 'rgba(0,0,0,0.55)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    b.fillStyle = gr;
    b.beginPath();
    b.arc(cx, cy, 420, 0, TAU);
    b.fill();
    b.restore();
    // two drumsticks crossing, swinging on beats
    const hit = beatPulse(t, 1, 8);
    for (const sgn of [-1, 1]) {
      b.save();
      b.translate(cx + sgn * 40, cy + 40);
      b.rotate(sgn * (0.6 - hit * 0.25) + ang * 0.2);
      b.fillStyle = '#000';
      b.beginPath();
      b.moveTo(-14, 420);
      b.lineTo(14, 420);
      b.lineTo(9, -330);
      b.quadraticCurveTo(0, -380, -9, -330);
      b.closePath();
      b.fill();
      b.beginPath();
      b.ellipse(0, -360, 13, 22, 0, 0, TAU);
      b.fill();
      b.restore();
    }
    // the drummer's emblem stamped in red
    rr.save();
    rr.fillStyle = '#000';
    rr.globalAlpha = 0.6;
    drawSym(rr, EMBLEMS.star8, 330, 640, 120 + hit * 10, ang);
    rr.restore();
  }

  // 2 — twin kicks smash the night
  night(b, rr, t, l, u) {
    const t0 = l.t0 - 0.35;
    let nk = 0;
    let last = -9;
    for (const kt of KICK_TIMES) if (kt >= t0 && kt <= t) {
      nk++;
      last = kt;
    }
    const age = t - last;
    const blast = clamp(nk / 14);
    // stars in the night (blue solid sky, stars knocked out)
    for (const tri of this.tris) {
      const d = blast * (tri.k + 1) * 60 * tri.sp + (age < 0.15 ? (0.15 - age) * 80 * (tri.k + 1) * 0.3 : 0);
      const dx = Math.cos(tri.ang) * d, dy = Math.sin(tri.ang) * d;
      const cxp = tri.pts.reduce((a, p) => a + p[0], 0) / 4, cyp = tri.pts.reduce((a, p) => a + p[1], 0) / 4;
      b.save();
      b.translate(cxp + dx, cyp + dy);
      b.rotate(tri.rot * blast * 0.8);
      b.fillStyle = '#000';
      b.globalAlpha = 0.95;
      b.beginPath();
      tri.pts.forEach(([x, y], q) => (q ? b.lineTo(x - cxp, y - cyp) : b.moveTo(x - cxp, y - cyp)));
      b.closePath();
      b.fill();
      b.restore();
    }
    // stars (knock-outs) and a red moon cracked
    b.save();
    b.globalCompositeOperation = 'destination-out';
    const R = rng(4);
    for (let s = 0; s < 140; s++) {
      const x = R() * 1920, y = R() * 1080, rad = R() * 2.5 + 0.6;
      b.beginPath();
      b.arc(x, y, rad, 0, TAU);
      b.fill();
    }
    b.restore();
    rr.save();
    rr.fillStyle = '#000';
    rr.beginPath();
    rr.arc(1500, 300, 120 * (1 - blast * 0.3), 0, TAU);
    rr.fill();
    rr.globalCompositeOperation = 'destination-out';
    rr.lineWidth = 6;
    rr.beginPath();
    rr.moveTo(1420, 220);
    rr.lineTo(1500, 300);
    rr.lineTo(1470, 380);
    rr.moveTo(1500, 300);
    rr.lineTo(1600, 280);
    rr.stroke();
    rr.restore();
    // impact rings on each kick
    rr.save();
    rr.strokeStyle = '#000';
    rr.lineWidth = 10 * Math.exp(-age * 6);
    rr.globalAlpha = Math.exp(-age * 4);
    rr.beginPath();
    rr.arc(960, 520, 60 + age * 900, 0, TAU);
    rr.stroke();
    rr.restore();
    caption(b, `KICKS ${String(nk).padStart(3, '0')}`, 1840, 520, 18, '#000', 'right', 0.4);
  }

  // 3 — the lead line becomes a flock of white doves
  doves(b, rr, t, l, u) {
    // blue ground, doves knocked out white
    b.save();
    b.fillStyle = '#000';
    b.globalAlpha = 0.92;
    b.fillRect(0, 0, 1920, 1080);
    b.restore();
    // guitar headstock silhouette in red (right)
    rr.save();
    rr.fillStyle = '#000';
    rr.translate(1650, 760);
    rr.rotate(-0.5);
    rr.fillRect(-40, 0, 80, 600);
    rr.beginPath();
    rr.moveTo(-60, 0);
    rr.lineTo(60, 0);
    rr.lineTo(80, -260);
    rr.lineTo(-80, -260);
    rr.closePath();
    rr.fill();
    rr.restore();
    const birth = l.c[6] - 0.2; // 白
    b.save();
    b.globalCompositeOperation = 'destination-out';
    for (const d of this.flock) {
      const a = t - birth - d.d;
      if (a < 0) continue;
      const x = 1600 - a * 900 * d.sp;
      const y = 600 + Math.sin(d.a * 6 + a) * 60 + d.a * a * 500 - a * 120;
      drawBird(b, x, y, d.s * 230, t * 13 * d.sp + d.ph, -1);
    }
    b.restore();
    // red trails
    rr.save();
    rr.strokeStyle = '#000';
    rr.lineWidth = 3;
    for (const d of this.flock.slice(0, 14)) {
      const a = t - birth - d.d;
      if (a < 0) continue;
      rr.beginPath();
      for (let q = 0; q < 12; q++) {
        const aa = Math.max(0, a - q * 0.04);
        const x = 1600 - aa * 900 * d.sp;
        const y = 600 + Math.sin(d.a * 6 + aa) * 60 + d.a * aa * 500 - aa * 120;
        if (q) rr.lineTo(x, y);
        else rr.moveTo(x, y);
      }
      rr.stroke();
    }
    rr.restore();
  }

  // 4 — altar → wall of sound
  wall(b, rr, t, l, u) {
    const ws = l.c[2] - 0.15; // から: the altar gives way to the amps
    const into = ep(ws - 0.2, ws + 0.5, t, ease.inOutCubic);
    // altar: cloth, candles, a gilded frame — sinking as the amps arrive
    const sink = into * 420;
    b.save();
    b.globalAlpha = 1 - into * 0.85;
    b.translate(0, sink);
    b.fillStyle = '#000';
    b.fillRect(420, 600, 1080, 70); // mensa
    b.fillRect(480, 670, 960, 330);
    b.globalAlpha *= 0.45;
    for (let k = 0; k < 9; k++) b.fillRect(520 + k * 104, 690, 40, 290); // cloth folds (halftone)
    b.restore();
    rr.save();
    rr.globalAlpha = 1 - into;
    rr.translate(0, sink);
    rr.fillStyle = '#000';
    rr.fillRect(470, 700, 980, 26); // antependium band
    for (let i = 0; i < 9; i++) {
      const x = 520 + i * 110;
      const h = 120 + (i % 2) * 40 + (i === 4 ? 80 : 0);
      b.save();
      b.globalAlpha = 1 - into;
      b.translate(0, sink);
      b.fillStyle = '#000';
      b.fillRect(x - 11, 600 - h, 22, h);
      b.restore();
      rr.beginPath();
      rr.ellipse(x, 600 - h - 26 + Math.sin(t * 9 + i) * 3, 10, 24, 0, 0, TAU);
      rr.fill();
    }
    rr.restore();
    // amp wall: three rows of eight drop in, bottom row first, one row per beat
    const startB = Math.floor(beatF(ws));
    const cols = 8, rows = 3;
    const pump = kickHit(t, 10);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const land = startB + row * 1 + (col % 2) * 0.5;
        const drop = clamp((beatF(t) - land) * 2.5);
        if (drop <= 0) continue;
        const w = 226, h = 196;
        const cx = 25 + col * 235, cyT = 860 - row * 206;
        const y = cyT - (1 - ease.outBack(drop)) * 700;
        b.save();
        b.fillStyle = '#000';
        b.fillRect(cx, y, w, h);
        b.globalCompositeOperation = 'destination-out';
        b.fillRect(cx + 12, y + 36, w - 24, h - 48);
        b.restore();
        b.save();
        b.globalAlpha = 0.42;
        b.fillStyle = '#000';
        b.fillRect(cx + 12, y + 36, w - 24, h - 48);
        b.restore();
        rr.save();
        rr.fillStyle = '#000';
        rr.font = font(F.black, 22);
        rr.fillText('Kaminare', cx + 16, y + 25);
        rr.strokeStyle = '#000';
        rr.lineWidth = 5;
        for (const [ox, oy] of [[62, 82], [164, 82], [62, 150], [164, 150]]) {
          rr.beginPath();
          rr.arc(cx + ox, y + oy, 28 + pump * 7, 0, TAU);
          rr.stroke();
        }
        rr.restore();
      }
    }
  }

  // 5 — sutra columns and vibrating strings
  sutra(b, rr, t, l, u) {
    const scroll = (t - l.t0) * 120;
    b.save();
    b.font = font(F.mincho, 62);
    b.fillStyle = '#000';
    b.textAlign = 'center';
    b.textBaseline = 'middle';
    for (let col = 0; col < 9; col++) {
      const x = 160 + col * 200;
      const txt = SUTRA[col % SUTRA.length] + '　' + SUTRA[(col + 3) % SUTRA.length] + '　' + SUTRA[(col + 6) % SUTRA.length];
      const dir = col % 2 ? 1 : -1;
      const off = ((scroll * dir) % 700 + 700) % 700;
      for (let rep = -1; rep < 2; rep++) {
        const gl = layoutV(txt, x, -off + rep * 1400 + 100, 62, 1.1);
        gl.forEach((g) => b.fillText(g.ch, g.x, g.y));
      }
    }
    b.restore();
    // strings between the columns (red), plucked on beats
    rr.save();
    rr.strokeStyle = '#000';
    for (let s = 0; s < 8; s++) {
      const x = 260 + s * 200;
      const pl = beatPulse(t - s * 0.04, 1, 4);
      rr.lineWidth = 3 + (s % 3);
      rr.beginPath();
      for (let y = 0; y <= 1080; y += 10) {
        const yy = y / 1080;
        const dx = Math.sin(yy * Math.PI) * Math.sin(yy * Math.PI * (3 + s % 3) + t * 40) * 26 * pl;
        if (y === 0) rr.moveTo(x + dx, y);
        else rr.lineTo(x + dx, y);
      }
      rr.stroke();
    }
    rr.restore();
  }

  // 6 — one vibration: sand on a Chladni plate
  chladni(b, rr, t, l, u) {
    const bf = beatF(t);
    const startB = Math.floor(beatF(l.t0 - 0.35));
    const mode = Math.floor((bf - startB) / 4);
    const A = this.cl[((mode % 3) + 3) % 3], Bm = this.cl[(((mode + 1) % 3) + 3) % 3];
    const mph = clamp(((bf - startB) % 4) / 1.2);
    const settle = ep(l.t0 - 0.35, l.t0 + 0.8, t, ease.outCubic);
    const cx = 960, cy = 560, S = 380;
    // plate
    rr.save();
    rr.strokeStyle = '#000';
    rr.lineWidth = 4;
    rr.strokeRect(cx - S - 20, cy - S - 20, 2 * S + 40, 2 * S + 40);
    rr.restore();
    b.save();
    b.fillStyle = '#000';
    const jitter = kickHit(t, 12) * 0.03;
    const N = 5200;
    for (let i = 0; i < N; i++) {
      const fx = lerp(A[i * 2], Bm[i * 2], ease.inOutCubic(mph));
      const fy = lerp(A[i * 2 + 1], Bm[i * 2 + 1], ease.inOutCubic(mph));
      const x0 = this.rand[i * 2], y0 = this.rand[i * 2 + 1];
      const x = lerp(x0, fx, settle) + (hash1(i + Math.floor(t * 30) * 7) - 0.5) * jitter;
      const y = lerp(y0, fy, settle) + (hash1(i * 3 + Math.floor(t * 30) * 5) - 0.5) * jitter;
      b.fillRect(cx + x * S, cy + y * S, 3, 3);
    }
    b.restore();
    // frequency read-out
    caption(rr, `MODE ${['3·5', '4·7', '2·9'][((mode % 3) + 3) % 3]}   ·   ${(172 / 60 * 4 * (2 + (mode % 3))).toFixed(2)} Hz`, cx, cy + S + 60, 18, '#000', 'center', 0.4);
  }
}
