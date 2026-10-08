// 01 FIVE LEDGERS — five quantities, five units; each card shows what its number measures.
// On the last line the cards try to connect and the links break: the tables don't mix.
import { Background, Layer2D } from './base.js';
import { cue, line } from '../core/narr.js';
import { F, font, tracking, wrap } from '../core/type.js';
import { C, LEDGER, rgba } from '../core/style.js';
import { line as ln, arrow, polyline, tag, strike } from '../gfx/draw.js';
import { clamp, ease, ep, lerp, hash1, TAU } from '../core/util.js';

const XS = [256, 608, 960, 1312, 1664];
const Q = ['多大的应力下开始坏', '把它打碎要花多少能量', '熔化、汽化要多少能量', '把物质全部送到无穷远', '持续加热的功率'];
const NOTE = ['门槛，不是价钱', '经验值', '比破碎高 2–3 个量级', '只对天体', '单位是瓦，不是焦'];

export class Five {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.bg = new Background();
    this.l = new Layer2D(0);
    this.g = new Layer2D(1);
  }
  render(t, rt) {
    const r = this.app.renderer;
    this.bg.draw(r, rt, t, { poolX: 0.5, poolY: 0.5, grid: 1 });
    const c = this.l.begin();
    const g = this.g.begin();
    const l0 = line('five', 0);
    const qa = ep(l0.t0 - 0.2, l0.t0 + 0.6, t);
    c.save();
    c.globalAlpha = qa;
    c.textAlign = 'center';
    c.font = font(F.serif, 52);
    c.fillStyle = C.ink;
    c.fillText('你问的，是哪一种量？', 960, 205);
    c.restore();

    const breakT = line('five', 6).t0;
    for (let k = 0; k < 5; k++) {
      const lk = line('five', k + 1);
      const a = ep(lk.t0 - 0.35, lk.t0 + 0.55, t, ease.outCubic);
      if (a <= 0) continue;
      const focus = t >= lk.t0 - 0.35 && t < (k < 4 ? line('five', k + 2).t0 - 0.35 : breakT);
      this.card(c, g, k, XS[k], 300 + (1 - a) * 60, a, t - lk.t0, focus);
    }
    // the tables don't mix: links between cards snap
    const b = ep(breakT, breakT + 0.6, t);
    if (b > 0) {
      for (let k = 0; k < 4; k++) {
        const x0 = XS[k] + 150, x1 = XS[k + 1] - 150 + 4;
        const y = 560;
        const p = ep(breakT + k * 0.18, breakT + 0.4 + k * 0.18, t);
        c.save();
        c.strokeStyle = rgba(C.ink, 0.6);
        c.lineWidth = 2;
        c.setLineDash([6, 6]);
        ln(c, x0 - 10, y, x1 + 10, y, p);
        c.setLineDash([]);
        const xm = (x0 + x1) / 2;
        const s = ep(breakT + 0.35 + k * 0.18, breakT + 0.6 + k * 0.18, t);
        c.fillStyle = 'rgba(10,12,16,1)';
        if (s > 0) c.fillRect(xm - 18, y - 18, 36, 36);
        c.font = font(F.sansB, 34);
        c.fillStyle = C.warn;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.globalAlpha = s;
        c.fillText('≠', xm, y + 1);
        c.restore();
      }
      c.save();
      c.globalAlpha = ep(breakT + 1.2, breakT + 1.8, t);
      c.textAlign = 'center';
      c.font = font(F.serif, 40);
      c.fillStyle = C.ink;
      c.fillText('五本账，互不通用', 960, 860);
      c.restore();
    }
    this.g.draw(r, rt, { boost: 1.8 });
    this.l.draw(r, rt);
    const lk = [1, 2, 3, 4, 5].map((k) => line('five', k).t0);
    let led = -1;
    lk.forEach((tt, k) => {
      if (t >= tt - 0.3) led = k;
    });
    if (t >= breakT) led = [0, 1, 2, 3, 4];
    return { ledger: led, bloom: 0.6, vig: 0.6, grain: 0.035 };
  }

  card(c, g, k, cx, y, a, lt, focus) {
    const L = LEDGER[k];
    const w = 300, h = 470, x = cx - w / 2;
    c.save();
    c.globalAlpha = a * (focus ? 1 : 0.82);
    c.fillStyle = 'rgba(14,16,21,0.88)';
    c.fillRect(x, y, w, h);
    c.strokeStyle = focus ? rgba(L.col, 0.65) : C.faint;
    c.lineWidth = 1.2;
    c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    c.fillStyle = L.col;
    c.fillRect(x, y, w, 5);
    tag(c, `0${k + 1}`, x + 22, y + 34, rgba(L.col, 0.9), 14);
    c.font = font(F.sansB, 32);
    c.fillStyle = C.ink;
    c.textBaseline = 'alphabetic';
    c.fillText(L.name, x + 22, y + 90);
    c.font = font(F.monoB, 26);
    c.fillStyle = L.col;
    c.fillText(L.unit, x + 22, y + 128);
    // illustration window
    const ix = x + 20, iy = y + 150, iw = w - 40, ih = 190;
    c.strokeStyle = C.grid;
    c.strokeRect(ix, iy, iw, ih);
    c.save();
    c.beginPath();
    c.rect(ix, iy, iw, ih);
    c.clip();
    // fragmentation and binding loop so the card stays alive while the others are read
    const it = Math.max(lt, 0);
    ICON[k](c, g, ix, iy, iw, ih, k === 1 || k === 3 ? it % 5.5 : it, L.col);
    c.restore();
    c.font = font(F.sans, 20);
    c.fillStyle = C.dim;
    wrap(c, Q[k], w - 44).forEach((s, i) => c.fillText(s, x + 22, y + 384 + i * 28));
    tag(c, NOTE[k], x + 22, y + h - 24, rgba(L.col, 0.85), 14, 'left', 1);
    c.restore();
  }
}

// ---- card illustrations (time since the card's line began)
const ICON = [
  // strength: a block squeezed; the gauge climbs to the threshold, a crack appears
  (c, g, x, y, w, h, t, col) => {
    const cx = x + w / 2, cy = y + h / 2 + 8;
    const load = clamp(t / 2.2);
    const crack = load > 0.82;
    const sq = load * 6;
    c.fillStyle = 'rgba(200,196,188,0.85)';
    c.fillRect(cx - 50, cy - 40 + sq, 100, 80 - sq * 2);
    c.fillStyle = col;
    for (const s of [-1, 1]) arrow(c, cx, cy + s * 92, cx, cy + s * (46 - sq), 1, 12);
    c.strokeStyle = col;
    c.lineWidth = 2;
    for (const s of [-1, 1]) {
      c.beginPath();
      c.moveTo(cx - 60, cy + s * (42 - sq));
      c.lineTo(cx + 60, cy + s * (42 - sq));
      c.stroke();
    }
    // gauge
    const gx = x + w - 24;
    c.strokeStyle = C.faint;
    ln(c, gx, y + h - 20, gx, y + 20, 1);
    c.fillStyle = col;
    c.fillRect(gx - 3, y + h - 20 - (h - 40) * load, 6, (h - 40) * load);
    c.strokeStyle = C.warn;
    c.lineWidth = 1.5;
    ln(c, gx - 10, y + h - 20 - (h - 40) * 0.82, gx + 8, y + h - 20 - (h - 40) * 0.82, 1);
    if (crack) {
      c.strokeStyle = '#111';
      c.lineWidth = 2.5;
      polyline(c, [[cx - 8, cy - 40 + sq], [cx + 6, cy - 12], [cx - 6, cy + 6], [cx + 10, cy + 40 - sq]], clamp((load - 0.82) * 8));
    }
  },
  // fragmentation: a block splits and the pieces drift
  (c, g, x, y, w, h, t, col) => {
    const cx = x + w / 2, cy = y + h / 2;
    const s = ease.outCubic(clamp((t - 0.6) / 1.4));
    const pieces = [
      [[-50, -40], [0, -40], [-10, 0], [-50, 0]], [[0, -40], [50, -40], [50, -5], [-10, 0]], [[-50, 0], [-10, 0], [-20, 40], [-50, 40]],
      [[-10, 0], [50, -5], [50, 40], [-20, 40]],
    ];
    pieces.forEach((pc, i) => {
      const m = pc.reduce((a, p) => [a[0] + p[0] / pc.length, a[1] + p[1] / pc.length], [0, 0]);
      const dx = m[0] * s * 0.9, dy = m[1] * s * 0.9;
      c.save();
      c.translate(cx + dx, cy + dy);
      c.rotate((hash1(i) - 0.5) * s * 0.6);
      c.fillStyle = 'rgba(200,196,188,0.85)';
      c.beginPath();
      pc.forEach(([px, py], q) => (q ? c.lineTo(px - m[0], py - m[1]) : c.moveTo(px - m[0], py - m[1])));
      c.closePath();
      c.fill();
      c.restore();
    });
    for (let i = 0; i < 18; i++) {
      const a = hash1(i * 3) * TAU, d = s * (60 + hash1(i) * 50);
      c.fillStyle = 'rgba(200,196,188,0.6)';
      c.fillRect(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 3, 3);
    }
    tag(c, `${Math.round(s * 100)} J/cc`, x + 10, y + h - 14, col, 13);
  },
  // phase: block → melt → vapour
  (c, g, x, y, w, h, t, col) => {
    const cx = x + w / 2, cy = y + h / 2 + 20;
    const m = clamp((t - 0.4) / 1.6), v = clamp((t - 2.0) / 1.5);
    const top = lerp(-40, 18, ease.inOutCubic(m));
    const half = lerp(50, 70, m);
    c.fillStyle = m > 0.05 ? `rgba(255,${150 - m * 60},${60},${0.9 - v * 0.5})` : 'rgba(200,196,188,0.85)';
    c.beginPath();
    c.moveTo(cx - half, cy + 40);
    c.lineTo(cx - half + m * 14, cy + top);
    c.quadraticCurveTo(cx, cy + top - 10 * (1 - m), cx + half - m * 14, cy + top);
    c.lineTo(cx + half, cy + 40);
    c.closePath();
    c.fill();
    if (v > 0) {
      g.save();
      g.strokeStyle = rgba(col, 0.7 * v);
      g.lineWidth = 2;
      for (let k = 0; k < 4; k++) {
        const bx = cx - 45 + k * 30;
        const pts = [];
        for (let j = 0; j < 14; j++) pts.push([bx + Math.sin(j * 0.8 + t * 4 + k) * 6, cy + 10 - j * 8 * v]);
        polyline(g, pts, 1);
      }
      g.restore();
    }
  },
  // binding energy: material leaves for infinity
  (c, g, x, y, w, h, t, col) => {
    const cx = x + w / 2, cy = y + h / 2;
    const s = clamp((t - 0.5) / 2.5);
    c.fillStyle = rgba(col, 0.25);
    c.beginPath();
    c.arc(cx, cy, 48 * (1 - s * 0.9), 0, TAU);
    c.fill();
    for (let i = 0; i < 46; i++) {
      const a = hash1(i * 7) * TAU, r0 = Math.sqrt(hash1(i * 3)) * 46;
      const r = r0 + s * s * (120 + hash1(i) * 120);
      c.fillStyle = 'rgba(233,228,216,0.85)';
      c.fillRect(cx + Math.cos(a) * r - 1.5, cy + Math.sin(a) * r - 1.5, 3, 3);
    }
    c.fillStyle = col;
    if (s > 0.3) for (const a of [0.3, 2.2, 4.1]) arrow(c, cx + Math.cos(a) * 70, cy + Math.sin(a) * 70, cx + Math.cos(a) * 118, cy + Math.sin(a) * 118, clamp((s - 0.3) * 3), 9);
    tag(c, '→ ∞', x + w - 50, y + 22, col, 15);
  },
  // flux: sunlight pours in continuously; a clock ticks
  (c, g, x, y, w, h, t, col) => {
    const sx = x + 46, sy = y + 44;
    g.save();
    g.fillStyle = rgba(col, 0.9);
    g.beginPath();
    g.arc(sx, sy, 20, 0, TAU);
    g.fill();
    g.restore();
    c.strokeStyle = rgba(col, 0.7);
    c.lineWidth = 2;
    for (let k = 0; k < 5; k++) {
      const ph = ((t * 0.9 + k / 5) % 1);
      const x0 = sx + 30 + k * 26, y0 = sy + 20;
      ln(c, x0 + ph * 40, y0 + ph * 90, x0 + ph * 40 + 14, y0 + ph * 90 + 30, 1);
    }
    c.fillStyle = 'rgba(200,196,188,0.6)';
    c.fillRect(x, y + h - 36, w, 36);
    // clock
    const kx = x + w - 48, ky = y + 52;
    c.strokeStyle = C.ink;
    c.lineWidth = 1.5;
    c.beginPath();
    c.arc(kx, ky, 22, 0, TAU);
    c.stroke();
    const a = t * 2;
    ln(c, kx, ky, kx + Math.sin(a) * 16, ky - Math.cos(a) * 16, 1);
    tag(c, 'W = J/s', kx, ky + 42, col, 13, 'center', 1);
  },
];
