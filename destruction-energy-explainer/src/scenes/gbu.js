// 09 HOW A NUMBER DRIFTS — "GBU-57 goes through 60 m of concrete". Three cross-sections at
// one depth scale show what the sources actually say: ≈60 m of earth (USAF figure, material
// unspecified), ≈18 m of 5 000 psi reinforced concrete, ≈2.4 m of 10 000 psi concrete.
import { Background, Layer2D } from './base.js';
import { cue, line } from '../core/narr.js';
import { F, font, tracking } from '../core/type.js';
import { C, LEDGER, rgba } from '../core/style.js';
import { line as ln, tag, strike, vbracket } from '../gfx/draw.js';
import { clamp, ease, ep, lerp, rng, TAU } from '../core/util.js';

const TOP = 300, PXM = 8; // ground surface y, pixels per metre
const COLS = [
  { x: 640, name: '土层', sub: '美国空军：200 ft（材质未注明）', d: 60, txt: '≈ 60 m', kw: '土层', pat: 'soil' },
  { x: 1040, name: '普通钢筋混凝土', sub: '5 000 psi ≈ 34 MPa', d: 18, txt: '≈ 18 m', kw: '十八米', pat: 'rc' },
  { x: 1440, name: '高强混凝土', sub: '10 000 psi ≈ 69 MPa', d: 2.4, txt: '≈ 2.4 m', kw: '两米多', pat: 'hpc' },
];
const CWID = 300;

function pattern(kind) {
  const cv = document.createElement('canvas');
  cv.width = CWID;
  cv.height = 540;
  const c = cv.getContext('2d');
  const R = rng(kind.length * 31 + 7);
  if (kind === 'soil') {
    c.fillStyle = '#3a3026';
    c.fillRect(0, 0, CWID, 540);
    for (let y = 0; y < 540; y += 2) {
      c.fillStyle = `rgba(${90 + R() * 40},${70 + R() * 30},${50 + R() * 20},${0.08 + (y / 540) * 0.08})`;
      c.fillRect(0, y, CWID, 2);
    }
    for (let i = 0; i < 1600; i++) {
      c.fillStyle = `rgba(${120 + R() * 80},${100 + R() * 60},${70 + R() * 40},${0.25 + R() * 0.4})`;
      const s = 1 + R() * 3;
      c.fillRect(R() * CWID, R() * 540, s, s);
    }
  } else {
    const base = kind === 'rc' ? '#5d5c59' : '#7a7a76';
    c.fillStyle = base;
    c.fillRect(0, 0, CWID, 540);
    for (let i = 0; i < (kind === 'rc' ? 900 : 1400); i++) {
      const g = 80 + R() * 70;
      c.fillStyle = `rgba(${g},${g},${g - 4},${0.35 + R() * 0.4})`;
      const s = kind === 'rc' ? 2 + R() * 7 : 1 + R() * 4;
      c.beginPath();
      c.ellipse(R() * CWID, R() * 540, s, s * (0.6 + R() * 0.4), R() * 3, 0, TAU);
      c.fill();
    }
    if (kind === 'rc') {
      // rebar mat every ~1.5 m
      for (let y = 6; y < 540; y += 12) {
        for (let x = 8; x < CWID; x += 22) {
          c.fillStyle = 'rgba(120,70,40,0.9)';
          c.beginPath();
          c.arc(x, y, 2.4, 0, TAU);
          c.fill();
        }
      }
    } else {
      for (let y = 4; y < 540; y += 6) {
        c.strokeStyle = 'rgba(130,80,50,0.55)';
        c.lineWidth = 1.4;
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(CWID, y);
        c.stroke();
      }
    }
  }
  return cv;
}

export class Gbu {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.bg = new Background();
    this.pats = { soil: pattern('soil'), rc: pattern('rc'), hpc: pattern('hpc') };
    this.l = new Layer2D(0);
    this.g = new Layer2D(1);
  }
  render(t, rt) {
    const r = this.app.renderer;
    const L = (i) => line('gbu', i);
    const l0 = L(0), l1 = L(1), l2 = L(2);
    this.bg.draw(r, rt, t, { poolX: 0.5, poolY: 0.4, grid: 0.8 });
    const c = this.l.begin();
    const g = this.g.begin();

    // the viral claim
    const claimT = cue('gbu', 1, '网上常说');
    const checkT = cue('gbu', 1, '实际查下来');
    const cl = ep(l0.t0 - 0.2, l0.t0 + 0.8, t);
    const up = ep(checkT - 0.3, checkT + 0.9, t, ease.inOutCubic);
    if (cl > 0) {
      c.save();
      c.globalAlpha = cl;
      c.textAlign = 'center';
      if (t < claimT - 0.2) {
        c.font = font(F.serif, 52);
        c.fillStyle = C.ink;
        c.fillText('一个“权威数字”是怎么失真的', 960, 470);
        tag(c, 'GBU-57A/B MOP · 美军 13.6 吨级钻地弹', 960, 530, C.dim, 18, 'center', 4);
      } else {
        const y = lerp(480, 190, up), s = lerp(1, 0.6, up);
        c.translate(960, y);
        c.scale(s, s);
        c.globalAlpha = cl * ep(claimT - 0.2, claimT + 0.5, t);
        tag(c, '网传', 0, -92, C.warn, 20, 'center', 6);
        c.font = font(F.serifH, 74);
        c.fillStyle = C.ink;
        c.fillText('“能打穿 60 米混凝土”', 0, 10);
        const st = ep(checkT + 0.6, checkT + 1.2, t);
        if (st > 0) {
          c.strokeStyle = C.warn;
          c.lineWidth = 7;
          ln(c, -360, -14, -360 + 720 * ease.outCubic(st), -14, 1);
        }
      }
      c.restore();
    }

    // cross-sections
    if (up > 0) {
      const fade = 1 - ep(l2.t0 + 2.5, l2.t0 + 3.5, t) * 0.72;
      c.save();
      c.globalAlpha = up * fade;
      // depth scale
      c.strokeStyle = rgba(C.ink, 0.5);
      c.lineWidth = 1.2;
      ln(c, 380, TOP, 380, TOP + 62 * PXM, up);
      c.font = font(F.mono, 14);
      c.fillStyle = C.dim;
      c.textAlign = 'right';
      for (let m = 0; m <= 60; m += 10) {
        const y = TOP + m * PXM;
        ln(c, 372, y, 380, y, 1);
        c.fillText(`${m} m`, 362, y + 5);
      }
      c.strokeStyle = rgba(C.ink, 0.6);
      ln(c, 400, TOP, 1700, TOP, up);
      tag(c, '地表', 400, TOP - 16, C.dim, 13, 'left', 2);
      c.restore();
      COLS.forEach((col, k) => {
        const at = cue('gbu', 1, col.kw) - 0.4;
        const a = ep(at - 0.2, at + 0.6, t) * up * fade;
        if (a <= 0) return;
        const x0 = col.x - CWID / 2;
        const h = 62 * PXM;
        c.save();
        c.globalAlpha = a;
        c.drawImage(this.pats[col.pat], 0, 0, CWID, h, x0, TOP, CWID, h * ep(at - 0.2, at + 0.9, t, ease.inOutCubic));
        // the bomb sinks to its depth
        const p = ep(at + 0.2, at + 2.2, t, ease.outQuart);
        const nose = TOP + col.d * PXM * p;
        const bl = 6.2 * PXM, bw = 0.8 * PXM * 2.2;
        // tunnel
        c.fillStyle = 'rgba(8,8,10,0.75)';
        c.fillRect(col.x - bw / 2 - 2, TOP, bw + 4, Math.max(0, nose - TOP));
        // body (drawn above ground until it enters)
        const by = nose - bl;
        c.fillStyle = '#c9c4b8';
        c.beginPath();
        c.moveTo(col.x, nose);
        c.lineTo(col.x - bw / 2, nose - bw * 1.4);
        c.lineTo(col.x - bw / 2, by + 6);
        c.lineTo(col.x - bw * 0.9, by - 4);
        c.lineTo(col.x + bw * 0.9, by - 4);
        c.lineTo(col.x + bw / 2, by + 6);
        c.lineTo(col.x + bw / 2, nose - bw * 1.4);
        c.closePath();
        c.fill();
        if (p > 0 && p < 1) {
          g.fillStyle = `rgba(255,190,120,${0.6 * (1 - p)})`;
          g.beginPath();
          g.arc(col.x, nose, 18, 0, TAU);
          g.fill();
        }
        // depth marker
        const mk = ep(at + 1.6, at + 2.4, t);
        if (mk > 0) {
          c.globalAlpha = a * mk;
          c.strokeStyle = LEDGER[0].col;
          c.lineWidth = 2;
          c.setLineDash([6, 5]);
          ln(c, x0 - 10, TOP + col.d * PXM, x0 + CWID + 10, TOP + col.d * PXM, 1);
          c.setLineDash([]);
          c.font = font(F.monoB, 30);
          c.fillStyle = C.ink;
          c.textAlign = 'left';
          c.fillText(col.txt, col.x + 26, TOP + col.d * PXM + (col.d > 30 ? -16 : 40));
        }
        c.globalAlpha = a;
        c.textAlign = 'center';
        c.font = font(F.sansB, 24);
        c.fillStyle = C.ink;
        c.fillText(col.name, col.x, TOP - 58);
        tag(c, col.sub, col.x, TOP - 32, C.dim, 13, 'center', 1);
        c.restore();
      });
      // scale note
      tag(c, '纵向按真实深度绘制 · 弹体长 6.2 m，直径放大显示', 1700, TOP + 62 * PXM + 28, rgba(C.ink, 0.4 * up * fade), 12, 'right', 1);
    }

    // line 2: give a range
    const rg = ep(l2.t0 + 2.6, l2.t0 + 3.4, t);
    if (rg > 0) {
      c.save();
      c.globalAlpha = rg;
      c.fillStyle = 'rgba(10,12,16,0.85)';
      c.fillRect(560, 470, 800, 250);
      c.strokeStyle = C.faint;
      c.strokeRect(560, 470, 800, 250);
      c.textAlign = 'center';
      c.font = font(F.monoB, 54);
      c.fillStyle = C.ink;
      c.fillText('2.4 – 60 m', 960, 570);
      tag(c, '取决于介质 · 多为二手推测', 960, 615, C.dim, 16, 'center', 3);
      c.font = font(F.sansB, 30);
      c.fillStyle = LEDGER[0].col;
      c.fillText('给范围，别给单一数字', 960, 680);
      c.restore();
    }
    const src = ep(l2.t0, l2.t0 + 0.8, t);
    if (src > 0) tag(c, '来源：美国空军 · Janes（经 BBC）· GlobalSecurity.org（经维基百科转引）', 960, 885, rgba(C.ink, 0.42 * src), 12, 'center', 1);
    this.g.draw(r, rt, { boost: 1.6 });
    this.l.draw(r, rt);
    return { ledger: 0, bloom: 0.6, vig: 0.62, grain: 0.04, ca: 0.002 };
  }
}
