// VERSE I — an emakimono handscroll unrolled right-to-left. Four ink paintings, one per
// line: the rosary-wound neck, the warped hymn, a moon in a gourd, a laughing song.
// Ink is drawn on with time maps; vertical lyrics are brushed in beside each panel.
import { Paper, PlateView, WashView, Layer2D } from './base.js';
import { InkPlate } from '../gfx/ink.js';
import { paint } from '../gfx/watercolor.js';
import { lines, SEC, kickHit, beatF, snareHit } from '../core/music.js';
import { F, font, layoutV, REVEAL, caption } from '../core/type.js';
import { gloss } from '../core/lyrics-meta.js';
import { clamp, lerp, ease, ep, rng, TAU, smooth } from '../core/util.js';

const PW = 1920; // panel width (scroll px) — one screen per painting
const CENTERS = [6720, 4800, 2880, 960]; // right-to-left
const TITLES = [
  ['第一段', 'I · THE ROSARY NECK'],
  ['第二段', 'II · A HYMN, BENT'],
  ['第三段', 'III · MOON IN A GOURD'],
  ['第四段', 'IV · SHE LAUGHS, SHE SINGS'],
];

function panelRosary() {
  const p = new InkPlate(PW, 1080, { seed: 11 });
  const P0 = [-60, 1010], P1 = [1230, 250];
  const L = Math.hypot(P1[0] - P0[0], P1[1] - P0[1]);
  const d = [(P1[0] - P0[0]) / L, (P1[1] - P0[1]) / L];
  const n = [-d[1], d[0]];
  const hw = 56;
  const at = (s, o) => [P0[0] + d[0] * L * s + n[0] * o, P0[1] + d[1] * L * s + n[1] * o];
  // neck edges (two long confident strokes)
  p.stroke([at(-0.05, hw), at(0.5, hw + 2), at(1.0, hw)], { w: 16, dry: 0.55, t0: 0.0, t1: 0.16 });
  p.stroke([at(-0.05, -hw), at(0.5, -hw - 2), at(1.0, -hw)], { w: 13, dry: 0.65, t0: 0.05, t1: 0.2 });
  // headstock: flared paddle beyond the nut
  const H0 = at(1.0, 0);
  const hd = (s, o) => [H0[0] + d[0] * s + n[0] * o, H0[1] + d[1] * s + n[1] * o];
  p.stroke([hd(0, -hw), hd(80, -hw - 22), hd(250, -hw - 30), hd(300, -hw + 6)], { w: 11, dry: 0.5, t0: 0.18, t1: 0.26 });
  p.stroke([hd(0, hw), hd(80, hw + 22), hd(250, hw + 28), hd(300, hw - 4), hd(300, -hw + 6)], { w: 11, dry: 0.5, t0: 0.2, t1: 0.28 });
  for (let k = 0; k < 3; k++)
    for (const side of [-1, 1]) {
      const c = hd(70 + k * 70, side * (hw + 6));
      p.fill((ctx) => {
        ctx.beginPath();
        ctx.arc(c[0], c[1], 9, 0, TAU);
        ctx.fill();
      }, { t0: 0.26 + k * 0.01, t1: 0.3, bounds: [c[0] - 12, c[1] - 12, 24, 24], from: 'center' });
      const e = hd(70 + k * 70, side * (hw + 40));
      p.stroke([c, e], { w: 7, dry: 0.2, t0: 0.27, t1: 0.3, bristles: 6 });
    }
  // nut
  p.stroke([at(1.0, -hw), at(1.0, hw)], { w: 10, dry: 0.2, t0: 0.16, t1: 0.18 });
  // frets (closer together toward the body)
  for (let k = 1; k <= 15; k++) {
    const s = 1 - (1700 * (1 - Math.pow(2, -k / 12))) / L;
    if (s < 0.02) break;
    p.stroke([at(s, -hw + 4), at(s, hw - 4)], { w: 5, dry: 0.35, t0: 0.12 + k * 0.006, t1: 0.14 + k * 0.006, bristles: 5 });
  }
  // strings
  for (let i = 0; i < 6; i++) {
    const o = -hw * 0.72 + (i / 5) * hw * 1.44;
    p.stroke([at(1.0, o), at(0.5, o), at(-0.05, o)], { w: 2.2, dry: 0.1, ink: 0.7, t0: 0.2 + i * 0.01, t1: 0.3 + i * 0.01, bristles: 3, bleed: 0, body: 0, pressure: () => 1 });
  }
  // rosary: a helix of beads wound around the neck (front beads dark, back beads pale)
  const R = rng(5);
  const beads = [];
  const N = 58;
  for (let i = 0; i < N; i++) {
    const u = i / (N - 1);
    const s = 0.28 + u * 0.4;
    const ph = u * TAU * 3.1;
    const o = Math.cos(ph) * hw * 1.32;
    const front = Math.sin(ph) > -0.1;
    beads.push({ pos: at(s, o), front, u });
  }
  // chain
  for (let i = 1; i < N; i++) {
    const a = beads[i - 1], b = beads[i];
    if (a.front && b.front) p.stroke([a.pos, b.pos], { w: 2, dry: 0.05, ink: 0.8, t0: 0.38 + a.u * 0.4, t1: 0.39 + b.u * 0.4, bristles: 3, bleed: 0, pressure: () => 1 });
  }
  for (const b of beads) {
    const r = b.front ? 9 + R() * 2 : 6;
    p.fill((ctx) => {
      ctx.globalAlpha = b.front ? 0.95 : 0.3;
      ctx.beginPath();
      ctx.arc(b.pos[0], b.pos[1], r, 0, TAU);
      ctx.fill();
    }, { t0: 0.38 + b.u * 0.4, t1: 0.4 + b.u * 0.4, bounds: [b.pos[0] - r, b.pos[1] - r, 2 * r, 2 * r], from: 'center' });
  }
  // hanging strand + crucifix
  const hang = at(0.47, hw * 1.3);
  const pts = [];
  for (let k = 0; k <= 9; k++) pts.push([hang[0] + Math.sin(k * 0.3) * 8 + k * 2, hang[1] + k * 26]);
  p.stroke(pts, { w: 2, dry: 0.05, t0: 0.8, t1: 0.86, bristles: 3, bleed: 0, pressure: () => 1 });
  pts.forEach((q, k) => {
    if (k % 1 === 0 && k < 9)
      p.fill((ctx) => {
        ctx.beginPath();
        ctx.arc(q[0], q[1], 7.5, 0, TAU);
        ctx.fill();
      }, { t0: 0.8 + k * 0.006, t1: 0.82 + k * 0.006, bounds: [q[0] - 8, q[1] - 8, 16, 16], from: 'center' });
  });
  const cb = pts[9];
  p.stroke([[cb[0], cb[1]], [cb[0] + 4, cb[1] + 120]], { w: 15, dry: 0.4, t0: 0.87, t1: 0.92, spatter: 0.5 });
  p.stroke([[cb[0] - 40, cb[1] + 38], [cb[0] + 44, cb[1] + 34]], { w: 13, dry: 0.45, t0: 0.92, t1: 0.96 });
  return p.bake();
}

function panelHymn() {
  const p = new InkPlate(PW, 1080, { seed: 23 });
  const y0 = 430, gap = 44;
  const warp = (x, k) => Math.sin(x * 0.009 + k * 0.4) * (8 + (x / PW) * 70) + Math.sin(x * 0.023 + k) * (x / PW) * 16;
  for (let k = 0; k < 5; k++) {
    const pts = [];
    for (let x = 70; x <= 1520; x += 40) pts.push([x, y0 + k * gap + warp(x, k)]);
    p.stroke(pts, { w: 6, dry: 0.55, t0: 0.02 + k * 0.03, t1: 0.3 + k * 0.03, bristles: 7, bleed: 0.2, pressure: (s) => 0.7 + 0.3 * Math.sin(s * 9) });
  }
  // G clef as a spiral gesture
  const cx = 170, cy = y0 + gap * 2.6;
  const cl = [];
  for (let a = 0; a < TAU * 1.6; a += 0.25) {
    const r = 18 + a * 9;
    cl.push([cx + Math.cos(a + 1.6) * r, cy + Math.sin(a + 1.6) * r * 1.15]);
  }
  cl.push([cx + 30, y0 - 90], [cx + 5, y0 - 120], [cx - 10, y0 - 60], [cx + 10, y0 + gap * 4 + 60], [cx - 12, y0 + gap * 4 + 90]);
  p.stroke(cl, { w: 14, dry: 0.5, t0: 0.18, t1: 0.36, spatter: 0.6 });
  // notes riding the warped staff
  const notes = [[330, 3.5, 0], [430, 2.5, 1], [530, 2, 0], [640, 3, 1], [760, 1.5, 0], [880, 2.5, 0], [990, 4, 1], [1110, 1, 0], [1220, 2, 1], [1330, 3, 0]];
  notes.forEach(([x, line, hollow], i) => {
    const y = y0 + line * gap + warp(x, line);
    const t0 = 0.36 + i * 0.055;
    p.fill((ctx) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.35 + Math.sin(i) * 0.15);
      ctx.beginPath();
      ctx.ellipse(0, 0, 22, 15, 0, 0, TAU);
      if (hollow) {
        ctx.ellipse(0, 0, 13, 6, 0.3, 0, TAU, true);
      }
      ctx.fill('evenodd');
      ctx.restore();
    }, { t0, t1: t0 + 0.02, bounds: [x - 24, y - 18, 48, 36], from: 'center' });
    p.stroke([[x + 19, y - 4], [x + 21 + Math.sin(i) * 6, y - 140 - warp(x, 0) * 0.3]], { w: 6, dry: 0.3, t0: t0 + 0.02, t1: t0 + 0.05, bristles: 5 });
  });
  // a beam sweeping off, breaking into dry streaks (the hymn bending)
  p.stroke([[1060, 250], [1240, 220], [1420, 160], [1480, 140]], { w: 40, dry: 0.92, t0: 0.92, t1: 1.0 });
  return p.bake();
}

function panelGourd() {
  const p = new InkPlate(PW, 1080, { seed: 37 });
  const cx = 760;
  // gourd outline: lower bulb, waist, upper bulb (left & right sides as two strokes)
  const side = (sgn) => {
    const pts = [];
    const prof = [[0, 135], [0.06, 112], [0.14, 70], [0.24, 120], [0.33, 128], [0.42, 82], [0.47, 62], [0.53, 120], [0.65, 205], [0.8, 220], [0.92, 175], [1.0, 40]];
    for (const [v, r] of prof) pts.push([cx + sgn * r * 1.12, 175 + v * 800]);
    return pts;
  };
  p.stroke(side(-1), { w: 30, dry: 0.5, t0: 0.02, t1: 0.3, spatter: 0.6 });
  p.stroke(side(1), { w: 22, dry: 0.68, t0: 0.08, t1: 0.34 });
  // pale ink wash for volume (tan-boku)
  p.fill((ctx) => {
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.ellipse(cx - 26, 720, 215, 235, 0, 0, TAU);
    ctx.ellipse(cx - 14, 395, 125, 135, 0, 0, TAU);
    ctx.fill();
  }, { t0: 0.3, t1: 0.5, bounds: [cx - 250, 240, 500, 760], from: 'top', blur: 22 });
  // shading strokes on the shadow side
  p.stroke([[cx + 160, 560], [cx + 228, 720], [cx + 185, 900]], { w: 70, dry: 0.9, ink: 0.7, t0: 0.34, t1: 0.42 });
  p.stroke([[cx + 95, 300], [cx + 130, 400], [cx + 100, 480]], { w: 40, dry: 0.9, ink: 0.6, t0: 0.4, t1: 0.44 });
  // stem & cord
  p.stroke([[cx - 10, 185], [cx + 6, 140], [cx + 34, 110]], { w: 26, dry: 0.4, t0: 0.42, t1: 0.47 });
  const cord = [];
  for (let a = 0; a <= TAU * 1.1; a += 0.3) cord.push([cx + Math.cos(a) * 78, 535 + Math.sin(a) * 18]);
  cord.push([cx + 90, 600], [cx + 130, 700], [cx + 120, 760]);
  p.stroke(cord, { w: 5, dry: 0.15, t0: 0.47, t1: 0.56, bristles: 5 });
  // susuki grass, swept
  for (let i = 0; i < 6; i++) {
    const bx = 160 + i * 34, by = 1060;
    p.stroke([[bx, by], [bx + 40 + i * 12, by - 220 - i * 30], [bx + 140 + i * 20, by - 330 - i * 25]], { w: 9, dry: 0.6, t0: 0.7 + i * 0.03, t1: 0.82 + i * 0.03 });
  }
  return p.bake();
}

function panelSong() {
  const p = new InkPlate(PW, 1080, { seed: 53 });
  // ensō — one breath, open at the upper right
  const pts = [];
  for (let a = -0.6; a < TAU - 0.9; a += 0.18) pts.push([800 + Math.cos(a) * 330, 520 + Math.sin(a) * 330 * 0.96]);
  p.stroke(pts, { w: 74, dry: 0.78, t0: 0.0, t1: 0.42, spatter: 1, pressure: (s) => (0.5 + 0.5 * Math.sin(Math.min(1, s * 6) * Math.PI / 2)) * (1 - 0.6 * s) });
  // sound ripples spreading left (the direction the scroll travels)
  for (let k = 0; k < 4; k++) {
    const rr = 400 + k * 70;
    const arc = [];
    for (let a = 2.2; a < 4.1; a += 0.12) arc.push([800 + Math.cos(a) * rr, 520 + Math.sin(a) * rr]);
    p.stroke(arc, { w: 7 - k, dry: 0.5 + k * 0.1, t0: 0.6 + k * 0.08, t1: 0.75 + k * 0.08, bristles: 6 });
  }
  return p.bake();
}

export class Emaki {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.paper = new Paper('#ece2cf', '#d63a24');
    const plates = [panelRosary(), panelHymn(), panelGourd(), panelSong()];
    this.views = plates.map((pl, i) => new PlateView(pl, [CENTERS[i] - PW / 2, 0, PW, 1080], '#120e0c'));
    // gold-leaf moon (p5.brush watercolour) for the gourd panel
    const moon = paint(420, 420, 9, (b) => {
      b.noStroke();
      b.fill('#d9a63c', 200);
      b.fillBleed(0.12);
      b.fillTexture(0.55, 0.5);
      b.circle(210, 210, 150);
      b.fill('#f3d27a', 140);
      b.fillBleed(0.06);
      b.circle(196, 196, 108);
    });
    this.moon = new WashView(moon, [CENTERS[2] - PW / 2 + 760 - 230, 735 - 230, 460, 460]);
    // vermilion wash behind the seal
    const shu = paint(520, 520, 4, (b) => {
      b.noStroke();
      b.fill('#d8331f', 170);
      b.fillBleed(0.25);
      b.fillTexture(0.4, 0.6);
      b.circle(260, 260, 170);
    });
    this.shu = new WashView(shu, [CENTERS[3] - PW / 2 + 800 - 260, 520 - 260, 520, 520]);
    this.type = new Layer2D();
    this.ls = lines('v1');
    // kirikane: gold-leaf slivers scattered over the whole scroll
    const R = rng(808);
    this.flecks = Array.from({ length: 420 }, () => ({ x: R() * 7680, y: R() * 1080, s: 2 + Math.pow(R(), 3) * 16, r: R() * TAU, k: R() < 0.7 ? 0 : 1, ph: R() * TAU }));
  }

  pan(t) {
    // hold on each panel with a slow drift; glide between panels just before each line
    const ls = this.ls;
    const keys = ls.map((l) => l.t0);
    let i = 0;
    for (let k = 0; k < keys.length; k++) if (t >= keys[k] - 0.5) i = k;
    const a = keys[i] - 0.5;
    const b = keys[i + 1] !== undefined ? keys[i + 1] - 0.5 : SEC.v1[1];
    const drift = lerp(70, -70, clamp((t - a) / (b - a)));
    let x = CENTERS[i] + drift;
    if (i > 0) {
      const g = ep(a, a + 0.7, t, ease.inOutCubic);
      const prev = CENTERS[i - 1] - 70;
      x = lerp(prev, x, g);
    } else {
      x = lerp(CENTERS[0] + 380, x, ep(SEC.v1[0] - 0.6, keys[0] + 0.2, t, ease.outCubic));
    }
    return x - 960;
  }

  render(t, rt) {
    const r = this.app.renderer;
    const panX = this.pan(t);
    const zoom = 1 + kickHit(t, 10) * 0.006 + snareHit(t, 12) * 0.004;
    const ls = this.ls;
    this.paper.draw(r, rt, { panX, zoom });
    // plates: each revealed over its line
    ls.forEach((l, i) => {
      const end = l.c[l.c.length - 1] + 0.9;
      const prog = ep(l.t0 - 0.35, end, t, (x) => x);
      if (i === 2) this.moon.draw(r, rt, ep(l.c[6] - 0.2, l.c[6] + 0.9, t, ease.outCubic), { panX, zoom, mul: 1.05 });
      if (i === 3) this.shu.draw(r, rt, ep(l.c[6] - 0.15, l.c[6] + 0.7, t, ease.outCubic), { panX, zoom, alpha: 0.85 });
      this.views[i].draw(r, rt, prog, { panX, zoom, warp: i === 1 ? 0.25 + kickHit(t, 7) * 0.9 : 0, time: t });
    });

    // ---- type: vertical lyrics, panel titles, seal
    const c = this.type.begin();
    c.save();
    c.translate(960, 540);
    c.scale(zoom, zoom);
    c.translate(-960 - panX, -540);
    // gold leaf flecks (glinting as the scroll moves)
    for (const f of this.flecks) {
      if (f.x < panX - 40 || f.x > panX + 1960) continue;
      const gl = 0.55 + 0.45 * Math.sin(f.ph + panX * 0.01 + t * 0.8);
      c.save();
      c.translate(f.x, f.y);
      c.rotate(f.r);
      c.fillStyle = `rgba(${200 + gl * 50 | 0},${150 + gl * 50 | 0},${60 + gl * 30 | 0},${0.55 + gl * 0.4})`;
      if (f.k) c.fillRect(-f.s * 0.15, -f.s, f.s * 0.3, f.s * 2);
      else c.fillRect(-f.s / 2, -f.s / 2, f.s, f.s);
      c.restore();
    }
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    const cols = [
      [['ロザリオ', 0], ['巻きつけたネック', 5]],
      [['聖歌が', 0], ['ゆがんで始まる', 3]],
      [['ひょうたんに', 0], ['月をひとつ', 6]],
      [['彼女は笑って', 0], ['歌い出す', 6]],
    ];
    ls.forEach((l, i) => {
      const x0 = CENTERS[i] + PW / 2 - 170;
      c.font = font(F.mincho, 74);
      c.fillStyle = '#16100d';
      cols[i].forEach(([txt, off], k) => {
        const gl = layoutV(txt, x0 - k * 104, 150 + k * 92, 74, 1.12);
        gl.forEach((g) => {
          g.i += off;
          const tc = l.c[g.i];
          REVEAL.ink(c, g, clamp((t - tc + 0.06) / 0.4), 74, true);
        });
      });
      // English gloss, set vertically small
      c.save();
      c.globalAlpha = 0.55 * clamp((t - l.t0) * 1.5);
      c.translate(x0 - 230, 160);
      c.rotate(Math.PI / 2);
      c.font = font(F.serif, 24);
      c.textAlign = 'left';
      if ('letterSpacing' in c) c.letterSpacing = '5px';
      c.fillText(gloss(l), 0, 0);
      c.restore();
      // museum-style panel caption
      const bx = CENTERS[i] - PW / 2 + 130;
      c.save();
      c.globalAlpha = 0.75 * clamp((t - l.t0 + 0.4) * 2);
      c.fillStyle = '#16100d';
      c.font = font(F.mincho, 26);
      c.textAlign = 'left';
      c.fillText(TITLES[i][0], bx, 980);
      caption(c, TITLES[i][1], bx + 100, 981, 13, 'rgba(22,16,13,0.7)');
      c.fillRect(bx, 1005, 260, 1.5);
      c.restore();
    });
    // vermilion seal 「歌」 stamped on the word 歌
    {
      const l = ls[3];
      const ts = l.c[6];
      const a = t - ts;
      if (a > -0.05) {
        const k = ease.outBack(clamp(a / 0.22));
        const s = lerp(1.8, 1, k);
        c.save();
        c.translate(CENTERS[3] - PW / 2 + 800, 520);
        c.rotate(-0.06);
        c.scale(s, s);
        c.globalAlpha = clamp(a / 0.08);
        c.fillStyle = '#c92a1c';
        const R = rng(3);
        c.beginPath();
        // rough-edged square seal
        const pts = [];
        for (let e = 0; e < 4; e++)
          for (let j = 0; j < 12; j++) {
            const u = j / 12;
            const sx = [-1, 1, 1, -1][e], sy = [-1, -1, 1, 1][e];
            const ex = [1, 1, -1, -1][e], ey = [-1, 1, 1, -1][e];
            const x = lerp(sx, ex, u) * 125 + (R() - 0.5) * 6;
            const y = lerp(sy, ey, u) * 125 + (R() - 0.5) * 6;
            pts.push([x, y]);
          }
        pts.forEach(([x, y], q) => (q ? c.lineTo(x, y) : c.moveTo(x, y)));
        c.closePath();
        c.fill();
        c.globalCompositeOperation = 'destination-out';
        c.font = font(F.mincho, 190);
        c.fillText('歌', 0, 8);
        c.lineWidth = 7;
        c.strokeRect(-108, -108, 216, 216);
        c.restore();
      }
    }
    c.restore();
    this.type.draw(r, rt, {});
    return { hudInk: 'dark', bloom: 0.35, bloomThresh: 0.95, grain: 0.04, vig: 0.45, ca: 0.0015, contrast: 1.04, hudShu: '#c92a1c' };
  }
}
