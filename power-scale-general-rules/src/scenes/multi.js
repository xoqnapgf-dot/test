// 0.15.1 · 多击不认
// Paper register, a surveyor's map. The tier table is calibrated on single concentrated blasts.
// Reason one: same total energy, 1 blast of 100 Mt vs 10,000 blasts of 10 kt; with radius ∝ E^⅓
// the scattered ones cover ∛10000 ≈ 21.5 × the area (drawn to scale, every one of the 10,000).
// Reason two: the core of a concentrated blast is overheated to vapour, energy wasted. Then the
// three rules.
import { makeScene } from './base.js';
import { clamp, lerp, smooth, ease, win, env, rng } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { strike } from './common.js';

export function build() {
  const sc = makeScene('multi', 'paper', { fov: 30, backdrop: { grid: 0.35 } });
  const T = sc.c;

  // pre-render the 10,000 small craters once (hex packing), revealed by a sweep
  const R1 = 120; // one 100 Mt blast
  const r2 = R1 / Math.cbrt(10000); // ≈ 5.57 px per 10 kt blast
  let field = null;
  const FX = 520;
  const FY = 230;
  const FW = 1370;
  const FH = 800;
  const cells = [];
  {
    const dx = r2 * 2.0;
    const dy = r2 * Math.sqrt(3);
    let row = 0;
    for (let y = r2; y < FH - r2 && cells.length < 10000; y += dy, row++) {
      for (let x = r2 + (row % 2) * r2; x < FW - r2 && cells.length < 10000; x += dx) cells.push([x, y]);
    }
  }
  const getField = (g) => {
    if (field) return field;
    field = document.createElement('canvas');
    field.width = FW * 2;
    field.height = FH * 2;
    const c = field.getContext('2d');
    c.scale(2, 2);
    for (const [x, y] of cells) {
      c.beginPath();
      c.arc(x, y, r2 * 0.96, 0, Math.PI * 2);
      c.fillStyle = 'rgba(184,50,31,0.22)';
      c.fill();
      c.lineWidth = 0.7;
      c.strokeStyle = 'rgba(184,50,31,0.85)';
      c.stroke();
    }
    return field;
  };

  sc.draw = (g, t) => {
    // ------------------------------------------- 0–2 single point vs scattered
    {
      const a = env(t, T(0, '', -0.5), 0.8, T(3, '', -0.3), 0.6);
      if (a > 0) {
        g.text('多击不认', 960, 130, { kind: 'serif', size: 60, weight: 900, color: 'ink', align: 'center', alpha: a });
        g.text('分散攻击的能量，不能加起来套集中破坏的标准', 960, 200, { kind: 'sans', size: 30, color: 'ink2', align: 'center', alpha: a * win(t, T(0, '分散的攻击'), 0.6) });
        // left: calibration on a single concentrated blast
        const k1 = win(t, T(1, '单点集中', -0.6), 1.2);
        const cx = 520;
        const cy = 600;
        for (let i = 1; i <= 5; i++) g.circle(cx, cy, 44 * i * ease.out3(k1), { color: 'red', w: i === 5 ? 3 : 1.4, alpha: a * (1 - i * 0.12) });
        g.circle(cx, cy, 10, { fill: 'red', alpha: a * k1 });
        g.text('爆街 · 爆城 …', cx, cy + 290, { kind: 'serif', size: 34, weight: 700, align: 'center', alpha: a * win(t, T(1, '爆街'), 0.5) });
        g.text('按单点集中释放标定', cx, cy + 340, { kind: 'sans', size: 28, color: 'ink2', align: 'center', alpha: a * k1 });
        // right: scattered hits
        const k2 = win(t, T(2, '多次攻击', -0.3), 0.7);
        if (k2 > 0) {
          const rr = rng(5);
          const n = Math.floor(60 * win(t, T(2, '一次次'), 3.0));
          for (let i = 0; i < 60; i++) {
            const x = 1200 + (rr() - 0.5) * 640;
            const y = 600 + (rr() - 0.5) * 420;
            if (i < n) g.circle(x, y, 14 + rr() * 8, { color: 'red', w: 1.6, alpha: a });
          }
          g.text('多次 · 分散 · 大量独立爆点', 1200, cy + 290, { kind: 'serif', size: 34, weight: 700, align: 'center', alpha: a * k2 });
          const sum = win(t, T(2, '简单相加'), 0.5);
          g.text('E₁ + E₂ + … → 对照单点表？', 1200, cy + 340, { kind: 'math', size: 30, color: 'ink2', align: 'center', alpha: a * sum });
          strike(g, 1000, cy + 330, 1400, cy + 322, win(t, T(2, '不能把', 0.4), 0.4), { w: 8 });
        }
      }
    }
    // ------------------------------------------- 3–7 reason one: area scaling
    {
      const a = env(t, T(3, '', -0.3), 0.7, T(8, '', -0.3), 0.6);
      if (a > 0) {
        g.text('理由一：分散比集中更“划算”', 960, 100, { kind: 'serif', size: 46, weight: 700, color: 'ink', align: 'center', alpha: a });
        // scaling law
        const k4 = env(t, T(4, '', -0.2), 0.6, T(6, '', -0.4), 0.6);
        if (k4 > 0) {
          g.text('半径 r ∝ E^(1/3)', 960, 300, { kind: 'math', size: 56, color: 'ink', align: 'center', alpha: a * win(t, T(4, '立方根'), 0.6) });
          g.text('面积 A ∝ E^(2/3)', 960, 400, { kind: 'math', size: 56, color: 'energy', align: 'center', alpha: a * win(t, T(4, '三分之二'), 0.6) });
          // curve
          const x0 = 560;
          const y0 = 900;
          const ww = 800;
          const hh = 380;
          const kc = win(t, T(4, '面积'), 1.0);
          g.line([[x0, y0 - hh], [x0, y0], [x0 + ww, y0]], { color: 'ink', w: 2, alpha: a * k4 });
          const pts = [];
          for (let i = 0; i <= 60; i++) {
            const u = i / 60;
            pts.push([x0 + u * ww, y0 - hh * Math.pow(u, 2 / 3)]);
          }
          g.line(pts, { color: 'energy', w: 3.5, p: kc, alpha: a });
          g.line([[x0, y0], [x0 + ww, y0 - hh]], { color: 'ink3', w: 1.5, dash: [8, 6], alpha: a * kc });
          g.text('能量 E', x0 + ww, y0 + 40, { kind: 'sans', size: 24, color: 'ink2', align: 'right', alpha: a * k4 });
          g.text('覆盖面积', x0 - 10, y0 - hh - 16, { kind: 'sans', size: 24, color: 'ink2', alpha: a * k4 });
          g.text('正比（虚线）', x0 + ww - 10, y0 - hh + 40, { kind: 'sans', size: 22, color: 'ink3', align: 'right', alpha: a * kc });
          g.text('N 份分开：面积 × ∛N（互不重叠时）', 960, 480, { kind: 'serif', size: 34, weight: 700, color: 'red', align: 'center', alpha: a * win(t, T(5, '立方根倍'), 0.6) });
        }
        // the to-scale comparison
        const k6 = win(t, T(6, '', -0.4), 0.8);
        if (k6 > 0) {
          const cx = 330;
          const cy = 560;
          g.circle(cx, cy, R1 * ease.out3(k6), { fill: 'rgba(184,50,31,0.18)', color: 'red', w: 2.5, alpha: a });
          g.text('一枚 · 一亿吨', cx, cy + R1 + 60, { kind: 'serif', size: 32, weight: 700, align: 'center', alpha: a * k6 });
          g.text('面积 = 1', cx, cy + R1 + 104, { kind: 'mono', size: 26, color: 'ink2', align: 'center', alpha: a * k6 });
          const sweep = win(t, T(6, '一万枚', -0.2), 2.6, ease.inOut2);
          if (sweep > 0) {
            const img = getField(g);
            g.x.save();
            g.x.globalAlpha = a;
            g.x.beginPath();
            g.x.rect(FX, FY, FW * sweep, FH);
            g.x.clip();
            g.x.drawImage(img, FX, FY, FW, FH);
            g.x.restore();
            g.rect(FX, FY, FW, FH, { color: 'ink3', w: 1.2, dash: [6, 6], alpha: a * sweep });
          }
          g.text('一万枚 · 每枚一万吨（同比例，全部画出）', FX + FW / 2, FY - 24, { kind: 'serif', size: 30, weight: 700, align: 'center', alpha: a * win(t, T(6, '一万枚'), 0.6) });
          const kr = win(t, T(6, '二十一倍', -0.3), 0.6);
          g.card(FX + FW - 520, FY + FH - 170, 500, 150, {
            p: kr,
            alpha: a,
            border: 'red',
            fn: (g2, w) => {
              g2.text('面积 ≈ 21.5', 30, 70, { kind: 'math', size: 50, weight: 600, color: 'red' });
              g2.text('∛10000 ≈ 21.5 · 总能量相同', 30, 120, { kind: 'sans', size: 26, color: 'ink2' });
            },
          });
          const k7 = win(t, T(7, '架空', -0.3), 0.6);
          g.seal('标准失效', 330, 900, { size: 130, p: k7 });
        }
      }
    }
    // ------------------------------------------- 8–10 reason two: core waste
    {
      const a = env(t, T(8, '', -0.3), 0.7, T(11, '', -0.3), 0.6);
      if (a > 0) {
        g.text('理由二：集中释放，核心区有额外损耗', 960, 100, { kind: 'serif', size: 46, weight: 700, color: 'ink', align: 'center', alpha: a });
        // cross-section
        const cx = 620;
        const gy = 640;
        const k9 = win(t, T(9, '', -0.2), 1.0);
        g.rect(160, gy, 920, 320, { fill: '#DCCFB4', color: 'ink', w: 2, alpha: a });
        for (let i = -10; i < 50; i++) g.seg(160 + i * 22, gy + 320, 160 + i * 22 + 60, gy, { color: 'ink', w: 0.8, alpha: a * 0.2 });
        // crater bowl
        g.x.save();
        g.x.globalAlpha = a * k9;
        g.x.fillStyle = g.col('bg');
        g.x.beginPath();
        g.x.ellipse(cx, gy, 300 * k9, 170 * k9, 0, 0, Math.PI);
        g.x.fill();
        g.x.restore();
        // overheated core
        const hk = win(t, T(9, '升华', -0.4), 0.8);
        const grd = g.x.createRadialGradient(cx, gy, 0, cx, gy, 140);
        grd.addColorStop(0, 'rgba(255,240,200,1)');
        grd.addColorStop(0.4, 'rgba(255,140,60,0.9)');
        grd.addColorStop(1, 'rgba(184,50,31,0)');
        g.x.save();
        g.x.globalAlpha = a * hk;
        g.x.fillStyle = grd;
        g.x.beginPath();
        g.x.arc(cx, gy, 140, 0, Math.PI * 2);
        g.x.fill();
        g.x.restore();
        g.text('核心区：过度加热到升华', cx, gy - 190, { kind: 'serif', size: 32, weight: 700, color: 'red', align: 'center', alpha: a * hk });
        g.arrow([cx, gy - 170], [cx, gy - 60], { color: 'red', w: 2.5, p: hk, alpha: a });
        // efficiency vs distance
        const ke = win(t, T(9, '利用效率', -0.4), 1.0);
        const x0 = 1180;
        const y0 = 820;
        g.line([[x0, y0 - 380], [x0, y0], [x0 + 600, y0]], { color: 'ink', w: 2, alpha: a * ke });
        const pts = [];
        for (let i = 0; i <= 50; i++) {
          const u = i / 50;
          pts.push([x0 + u * 600, y0 - 340 * (1 - Math.exp(-u * 3.2))]);
        }
        g.line(pts, { color: 'energy', w: 3.5, p: ke, alpha: a });
        g.text('能量利用效率', x0 - 10, y0 - 400, { kind: 'sans', size: 24, color: 'ink2', alpha: a * ke });
        g.text('离爆心距离 →', x0 + 600, y0 + 40, { kind: 'sans', size: 24, color: 'ink2', align: 'right', alpha: a * ke });
        g.text('越近越低', x0 + 30, y0 - 40, { kind: 'sans', size: 26, color: 'red', alpha: a * ke });
        const k10 = win(t, T(10, '', -0.2), 0.6);
        g.tag('分散的小规模释放：没有这部分浪费', 160, 1030, 'ok', { size: 28, p: k10 });
      }
    }
    // ------------------------------------------- 11–13 rules
    {
      const a = win(t, T(11, '', -0.3), 0.8);
      if (a > 0) {
        g.text('判定规则', 960, 110, { kind: 'serif', size: 50, weight: 700, color: 'ink', align: 'center', alpha: a });
        const R = [
          ['默认不认可多击累加', '逐次攻击 · 单技能大量独立爆点', 'red', T(11, '默认')],
          ['没说集中还是分散 → 按分散计算', '如“击碎了一大块岩石”：取较低的能量估算（下限）', 'energy', T(12, '没有明确说明')],
          ['明写单点集中 ＋ 核心熔化、升华', '反向确认集中释放，按单点标准', 'ok', T(13, '单点集中')],
        ];
        R.forEach(([h, sub, col, tc], i) => {
          const k = win(t, tc - 0.4, 0.6);
          g.card(200, 200 + i * 270, 1520, 220, {
            p: k,
            alpha: a,
            border: col,
            fn: (g2, w) => {
              g2.text(String(i + 1), 50, 130, { kind: 'math', size: 100, weight: 600, color: col });
              g2.text(h, 160, 92, { kind: 'serif', size: 44, weight: 900 });
              g2.text(sub, 160, 156, { kind: 'sans', size: 30, color: 'ink2' });
            },
          });
        });
      }
    }
  };
  return sc;
}
