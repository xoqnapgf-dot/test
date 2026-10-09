// 10 TWO SMALL TOOLS — checkable geometry for two stock phrases.
// 深不见底: a pit of width b and depth h; as the sun sinks (elevation a) the lit patch on the floor
//   shrinks, and vanishes exactly when h > b·tan a.
// 远处可见: line of sight from height h grazes the Earth at √(2Rh + h²); a far peak of height H
//   adds √(2RH + H²). (Heights exaggerated in the drawing; refraction ignored.)
import { Background, Layer2D } from './base.js';
import { cue, line } from '../core/narr.js';
import { F, font, tracking } from '../core/type.js';
import { C, LEDGER, rgba } from '../core/style.js';
import { line as ln, arrow, tag, vbracket, bracket, polyline } from '../gfx/draw.js';
import { clamp, ease, ep, lerp, TAU } from '../core/util.js';

const SUN = LEDGER[4].col;
// pit geometry (design px)
const GY = 360, PX0 = 600, PB = 300, PH = 380;
// horizon geometry
const EC = [960, 2620], ER = 1920, TH = 80, MH = 150;

// draw "lhs = √(inner)" with a proper radical bar; returns width
function sqrtExpr(c, x, y, lhs, inner, size, col) {
  c.save();
  c.font = font(F.serif, size);
  c.fillStyle = col;
  c.textBaseline = 'alphabetic';
  c.fillText(lhs, x, y);
  let px = x + c.measureText(lhs).width + size * 0.15;
  c.font = font(F.sans, size * 1.15);
  c.fillText('√', px, y + size * 0.05);
  px += c.measureText('√').width - size * 0.06;
  c.font = font(F.serif, size);
  const w = c.measureText(inner).width;
  c.fillRect(px, y - size * 0.92, w + size * 0.12, Math.max(2, size * 0.05));
  c.fillText(inner, px + size * 0.06, y);
  c.restore();
  return px + w - x;
}

export class Tools {
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
    const L = (i) => line('tools', i);
    const l0 = L(0), l1 = L(1), l2 = L(2);
    this.bg.draw(r, rt, t, { poolX: 0.5, poolY: 0.45, grid: 1 });
    const c = this.l.begin();
    const g = this.g.begin();
    // intro
    const intro = ep(l0.t0 - 0.2, l0.t0 + 0.6, t) * (1 - ep(l1.t0 - 0.3, l1.t0 + 0.2, t));
    if (intro > 0) {
      c.save();
      c.globalAlpha = intro;
      c.textAlign = 'center';
      c.font = font(F.serif, 50);
      c.fillStyle = C.ink;
      c.fillText('两个能直接验算的小工具', 960, 470);
      tag(c, '深不见底  ·  远处可见', 960, 530, C.dim, 20, 'center', 8);
      c.restore();
    }
    const pitA = ep(l1.t0 - 0.2, l1.t0 + 0.7, t) * (1 - ep(l2.t0 - 0.4, l2.t0 + 0.2, t));
    if (pitA > 0) this.pit(c, g, t, pitA);
    const horA = ep(l2.t0 - 0.2, l2.t0 + 0.7, t);
    if (horA > 0) this.horizon(c, g, t, horA);
    this.g.draw(r, rt, { boost: 1.5 });
    this.l.draw(r, rt);
    return { ledger: -1, bloom: 0.7, vig: 0.6, grain: 0.035, ca: 0.0015 };
  }

  pit(c, g, t, A) {
    const kb = cue('tools', 1, '坑宽'), kh = cue('tools', 1, '深为'), ka = cue('tools', 1, '太阳高度角');
    const kf = cue('tools', 1, '只要'), kd = cue('tools', 1, '照不到底'), ko = cue('tools', 1, '物理上成立');
    // the sun sinks from 72° to 34° between the angle cue and the "can't reach the floor" cue
    const sink = ep(ka + 0.6, kd + 0.3, t, ease.inOutCubic);
    const aDeg = lerp(72, 34, sink);
    const a = (aDeg * Math.PI) / 180;
    const thr = (Math.atan(PH / PB) * 180) / Math.PI;
    c.save();
    c.globalAlpha = A;
    c.font = font(F.serif, 44);
    c.fillStyle = C.ink;
    c.fillText('深不见底', 120, 200);
    // ground with the pit
    c.fillStyle = '#2a2622';
    c.beginPath();
    c.moveTo(160, GY);
    c.lineTo(PX0, GY);
    c.lineTo(PX0, GY + PH);
    c.lineTo(PX0 + PB, GY + PH);
    c.lineTo(PX0 + PB, GY);
    c.lineTo(1160, GY);
    c.lineTo(1160, GY + PH + 60);
    c.lineTo(160, GY + PH + 60);
    c.closePath();
    c.fill();
    c.strokeStyle = rgba(C.ink, 0.7);
    c.lineWidth = 2;
    polyline(c, [[160, GY], [PX0, GY], [PX0, GY + PH], [PX0 + PB, GY + PH], [PX0 + PB, GY], [1160, GY]], 1);
    // light: rays parallel at elevation a, coming from the upper left; the pit interior is shadowed
    // except the part of the floor/right wall the rays can reach past the left rim
    const dx = Math.cos(a), dy = Math.sin(a);
    const reach = PX0 + PH / Math.tan(a); // where the rim ray meets the floor level
    const lit = PX0 + PB - reach; // lit width on the floor
    // sunlit ground surface
    g.fillStyle = rgba(SUN, 0.5 * A);
    g.fillRect(160, GY - 3, PX0 - 160, 4);
    g.fillRect(PX0 + PB, GY - 3, 1160 - PX0 - PB, 4);
    // lit region inside the pit (polygon: rim ray down to floor/right wall)
    c.save();
    c.beginPath();
    if (lit > 0) {
      c.moveTo(PX0, GY);
      c.lineTo(reach, GY + PH);
      c.lineTo(PX0 + PB, GY + PH);
      c.lineTo(PX0 + PB, GY);
    } else {
      const yw = GY + PB * Math.tan(a);
      c.moveTo(PX0, GY);
      c.lineTo(PX0 + PB, yw);
      c.lineTo(PX0 + PB, GY);
    }
    c.closePath();
    c.fillStyle = rgba(SUN, 0.16);
    c.fill();
    c.restore();
    if (lit > 0) {
      g.fillStyle = rgba(SUN, 0.9 * A);
      g.fillRect(reach, GY + PH - 4, lit, 6);
    }
    // rays
    c.strokeStyle = rgba(SUN, 0.55);
    c.lineWidth = 1.5;
    for (let k = -6; k <= 3; k++) {
      const x0 = PX0 + k * 70;
      const y1 = lit > 0 || x0 < PX0 ? GY : GY;
      ln(c, x0 - dx * 260, y1 - dy * 260, x0, y1, 1);
    }
    // the rim ray, continued into the pit
    c.strokeStyle = SUN;
    c.lineWidth = 2.5;
    const endX = lit > 0 ? reach : PX0 + PB, endY = lit > 0 ? GY + PH : GY + PB * Math.tan(a);
    ln(c, PX0 - dx * 300, GY - dy * 300, endX, endY, 1);
    // sun disc
    g.fillStyle = rgba(SUN, A);
    g.beginPath();
    g.arc(PX0 - dx * 330, GY - dy * 330, 22, 0, TAU);
    g.fill();
    // labels b, h, a
    const pb = ep(kb - 0.1, kb + 0.5, t), ph = ep(kh - 0.1, kh + 0.5, t), pa = ep(ka - 0.1, ka + 0.5, t);
    c.strokeStyle = c.fillStyle = C.ink;
    c.lineWidth = 1.5;
    c.globalAlpha = A * pb;
    bracket(c, PX0, PX0 + PB, GY - 26, -1, pb, 10);
    c.font = font(F.serif, 34);
    c.textAlign = 'center';
    c.fillText('b', PX0 + PB / 2, GY - 52);
    c.globalAlpha = A * ph;
    vbracket(c, PX0 + PB + 28, GY, GY + PH, 1, ph, 10);
    c.textAlign = 'left';
    c.fillText('h', PX0 + PB + 56, GY + PH / 2 + 12);
    c.globalAlpha = A * pa;
    c.strokeStyle = SUN;
    c.beginPath();
    c.arc(PX0, GY, 90, Math.PI, Math.PI + a, false);
    c.stroke();
    c.fillStyle = SUN;
    c.font = font(F.serif, 30);
    c.fillText('a', PX0 - 140, GY - 20);
    // live readout
    c.globalAlpha = A * pa;
    c.font = font(F.mono, 20);
    c.fillStyle = C.dim;
    c.textAlign = 'left';
    const bt = PB * Math.tan(a);
    c.fillText(`a = ${aDeg.toFixed(0)}°`, 1260, 360);
    c.fillText(`b·tan a = ${(bt / PB).toFixed(2)} b`, 1260, 396);
    c.fillText(`h = ${(PH / PB).toFixed(2)} b`, 1260, 432);
    c.fillStyle = lit > 0 ? SUN : C.warn;
    c.fillText(lit > 0 ? '底部还有光' : '底部全在阴影里', 1260, 474);
    // the inequality
    const pf = ep(kf - 0.1, kf + 0.7, t);
    if (pf > 0) {
      c.globalAlpha = A * pf;
      c.font = font(F.serif, 64);
      c.fillStyle = C.ink;
      c.fillText('h > b · tan a', 1260, 600);
      tag(c, `临界角 a = arctan(h/b) ≈ ${thr.toFixed(0)}°（本图）`, 1260, 646, C.dim, 15, 'left', 1);
    }
    const ok = ep(ko - 0.1, ko + 0.5, t);
    if (ok > 0) {
      c.globalAlpha = A * ok;
      c.font = font(F.sansB, 28);
      c.fillStyle = LEDGER[0].col;
      c.fillText('“深不见底”——物理上成立', 1260, 720);
    }
    c.restore();
  }

  horizon(c, g, t, A) {
    const kh = cue('tools', 2, '离地h'), ks = cue('tools', 2, '地平线最远'), km = cue('tools', 2, '对面的山');
    const th1 = Math.acos(ER / (ER + TH)), th2 = Math.acos(ER / (ER + MH));
    const P = (ang, rr) => [EC[0] + Math.sin(ang) * rr, EC[1] - Math.cos(ang) * rr];
    c.save();
    c.globalAlpha = A;
    c.font = font(F.serif, 44);
    c.fillStyle = C.ink;
    c.fillText('远处可见', 120, 200);
    // Earth limb
    const grd = c.createLinearGradient(0, EC[1] - ER, 0, EC[1] - ER + 300);
    grd.addColorStop(0, '#1d2a3c');
    grd.addColorStop(1, '#0b0f16');
    c.fillStyle = grd;
    c.beginPath();
    c.arc(EC[0], EC[1], ER, -Math.PI / 2 - 0.5, -Math.PI / 2 + 0.5);
    c.lineTo(EC[0] + Math.sin(0.5) * ER, 1080);
    c.lineTo(EC[0] - Math.sin(0.5) * ER, 1080);
    c.closePath();
    c.fill();
    g.strokeStyle = `rgba(110,170,255,${0.6 * A})`;
    g.lineWidth = 3;
    g.beginPath();
    g.arc(EC[0], EC[1], ER + 2, -Math.PI / 2 - 0.5, -Math.PI / 2 + 0.5);
    g.stroke();
    tag(c, 'R = 6 371 km', EC[0], EC[1] - ER + 60, C.dim, 15, 'center', 2);
    // observer tower
    const ph = ep(kh - 0.1, kh + 0.6, t);
    const base1 = P(-th1, ER), top1 = P(-th1, ER + TH * ph);
    c.strokeStyle = C.ink;
    c.lineWidth = 4;
    ln(c, base1[0], base1[1], top1[0], top1[1], 1);
    if (ph > 0) {
      c.fillStyle = C.ink;
      c.beginPath();
      c.arc(top1[0], top1[1], 7, 0, TAU);
      c.fill();
      tag(c, 'h', top1[0] - 26, (base1[1] + top1[1]) / 2, C.ink, 20, 'right', 0);
    }
    // sight line to the tangent point
    const ps = ep(ks - 0.1, ks + 0.9, t);
    const T = P(0, ER);
    if (ps > 0) {
      c.strokeStyle = SUN;
      c.lineWidth = 2;
      c.setLineDash([10, 7]);
      ln(c, top1[0], top1[1], T[0], T[1], ps);
      c.setLineDash([]);
      c.fillStyle = SUN;
      c.beginPath();
      c.arc(T[0], T[1], 6, 0, TAU);
      c.fill();
      c.globalAlpha = A * clamp(ps * 2 - 0.8);
      sqrtExpr(c, 300, 560, 'S₁ = ', '2Rh + h²', 44, C.ink);
      tag(c, '眼高 1.7 m → 约 4.7 km', 300, 610, C.dim, 16, 'left', 2);
    }
    // the far mountain
    const pm = ep(km - 0.1, km + 0.9, t);
    if (pm > 0) {
      c.globalAlpha = A;
      const b0 = P(th2 - 0.04, ER), b1 = P(th2 + 0.04, ER), pk = P(th2, ER + MH * pm);
      c.fillStyle = '#3b4250';
      c.beginPath();
      c.moveTo(b0[0], b0[1]);
      c.lineTo(pk[0], pk[1]);
      c.lineTo(b1[0], b1[1]);
      c.closePath();
      c.fill();
      tag(c, 'H', pk[0] + 30, (pk[1] + b0[1]) / 2, C.ink, 20, 'left', 0);
      c.strokeStyle = SUN;
      c.lineWidth = 2;
      c.setLineDash([10, 7]);
      ln(c, T[0], T[1], pk[0], pk[1], clamp(pm * 1.4 - 0.3));
      c.setLineDash([]);
      c.globalAlpha = A * clamp(pm * 2 - 0.8);
      sqrtExpr(c, 1180, 560, 'S₂ = ', '2RH + H²', 44, C.ink);
      tag(c, '山高 1 000 m → 再加约 113 km', 1180, 610, C.dim, 16, 'left', 2);
      c.globalAlpha = A * clamp(pm * 2 - 1.2);
      c.font = font(F.sansB, 26);
      c.fillStyle = SUN;
      c.textAlign = 'center';
      c.fillText('能看到的最远距离 = S₁ + S₂ ≈ 118 km', 960, 380);
      tag(c, '高度在图中放大 · 不计大气折射', 960, 418, C.dim, 13, 'center', 2);
    }
    c.restore();
  }
}
