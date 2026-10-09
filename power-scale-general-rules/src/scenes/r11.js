// 0.11 · 掌控等价于毁灭
// Paper register. One region drawn in ink: a dotted field of matter inside a ruled boundary.
// Destruction and control as two faces of one coin; the condition (matter AND range); the four
// cases laid out as a matrix; and the two labels, 掌控式 and 砸坑式, level in rank but different in
// output, sustainability and energy.
import { makeScene } from './base.js';
import { clamp, lerp, smooth, ease, win, env, rng, noise2 } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { strike } from './common.js';

export function build() {
  const sc = makeScene('r11', 'paper', { fov: 30 });
  const T = sc.c;
  const r = rng(23);
  const dots = Array.from({ length: 140 }, () => {
    const a = r() * Math.PI * 2;
    const rr = Math.sqrt(r());
    return { a, rr, s: 2 + r() * 3.5, star: r() < 0.12, ph: r() * 6 };
  });

  // a region: boundary circle + matter dots. mode: 'raw' | 'matter' (aligned flow) | 'range' (warped grid) | 'both' | 'stars'
  function region(g, cx, cy, R, t, o = {}) {
    const a = o.alpha == null ? 1 : o.alpha;
    if (a <= 0) return;
    const mode = o.mode || 'raw';
    const k = o.k == null ? 1 : o.k;
    const rangeOn = mode === 'range' || mode === 'both';
    const matterOn = mode === 'matter' || mode === 'both' || mode === 'stars';
    // range: a warped grid inside the boundary
    if (rangeOn) {
      g.x.save();
      g.x.beginPath();
      g.x.arc(cx, cy, R, 0, Math.PI * 2);
      g.x.clip();
      for (let i = -6; i <= 6; i++) {
        const pts = [];
        const pts2 = [];
        for (let j = -12; j <= 12; j++) {
          const u = j / 12;
          const v = i / 6;
          const w = 0.12 * k * Math.sin(u * 3 + t * 0.8) * Math.cos(v * 2);
          pts.push([cx + (u + w) * R, cy + (v + w * 0.6) * R]);
          pts2.push([cx + (v + w * 0.6) * R, cy + (u + w) * R]);
        }
        g.line(pts, { color: 'range', w: 1.2, alpha: a * 0.55 });
        g.line(pts2, { color: 'range', w: 1.2, alpha: a * 0.55 });
      }
      g.x.restore();
    }
    g.circle(cx, cy, R, { color: rangeOn ? 'range' : 'ink', w: rangeOn ? 3 : 2, alpha: a, dash: rangeOn ? null : [10, 7] });
    for (const d of dots) {
      let ang = d.a;
      let rr = d.rr;
      if (matterOn && (mode !== 'stars' || d.star)) {
        ang += k * (0.4 + 0.6 * (1 - rr)) * t * 0.25; // matter flows in an ordered swirl
      } else if (mode === 'raw') {
        ang += 0.02 * noise2(d.ph, t * 0.2);
      }
      const x = cx + Math.cos(ang) * rr * R * 0.92;
      const y = cy + Math.sin(ang) * rr * R * 0.92;
      const isCtrl = matterOn && (mode !== 'stars' || d.star);
      g.circle(x, y, d.star ? d.s * 1.6 : d.s, { fill: isCtrl ? 'energy' : 'ink2', alpha: a * (d.star || mode !== 'stars' ? 1 : 0.35) });
    }
  }

  sc.draw = (g, t) => {
    // ---------------------------------------------- 0–2 the coin
    {
      const a = env(t, T(0, '', -0.5), 0.8, T(3, '', -0.3), 0.7);
      if (a > 0) {
        g.text('掌控等价于毁灭', 960, 120, { kind: 'serif', size: 52, weight: 700, color: 'ink', align: 'center', alpha: a });
        const k1 = win(t, T(1, '砸坑'), 0.8);
        // left: destroyed (empty, cracked region)
        g.circle(560, 540, 230, { color: 'ink', w: 2, alpha: a * k1, dash: [10, 7] });
        if (k1 > 0) {
          const rr = rng(4);
          for (let i = 0; i < 14; i++) {
            const ang = rr() * Math.PI * 2;
            const pts = [[560, 540]];
            let x = 560;
            let y = 540;
            for (let j = 0; j < 6; j++) {
              x += Math.cos(ang + (rr() - 0.5) * 0.8) * 36;
              y += Math.sin(ang + (rr() - 0.5) * 0.8) * 36;
              pts.push([x, y]);
            }
            g.line(pts, { color: 'ink', w: 2.2, p: k1, alpha: a });
          }
          g.circle(560, 540, 46, { fill: 'ink', alpha: a * k1 * 0.85 });
        }
        g.text('砸坑 · 破坏', 560, 840, { kind: 'serif', size: 38, weight: 700, align: 'center', alpha: a * k1 });
        // right: controlled
        const k2 = win(t, T(1, '掌控某个'), 0.8);
        region(g, 1360, 540, 230, t, { alpha: a * k2, mode: 'both' });
        g.text('掌控范围内的一切', 1360, 840, { kind: 'serif', size: 38, weight: 700, align: 'center', alpha: a * k2 });
        const k3 = win(t, T(1, '同样计入'), 0.6);
        g.text('=', 960, 570, { kind: 'math', size: 120, color: 'energy', align: 'center', alpha: a * k3 });
        g.text('同一量级', 960, 660, { kind: 'sans', size: 30, color: 'energy', align: 'center', alpha: a * k3 });
        const k4 = win(t, T(2, '特例'), 0.6);
        g.text('完全毁灭是完全掌控的一个特例', 960, 960, { kind: 'serif', size: 38, weight: 700, color: 'ink', align: 'center', alpha: a * k4 });
        g.text('能毁灭就能掌控，反之亦然', 960, 1020, { kind: 'kai', size: 34, color: 'ink2', align: 'center', alpha: a * win(t, T(2, '能毁灭'), 0.6) });
      }
    }
    // ---------------------------------------------- 3–6 the matrix of cases
    {
      const a = env(t, T(3, '', -0.3), 0.7, T(7, '', -0.3), 0.7);
      if (a > 0) {
        g.text('成立条件：同时覆盖物质与范围', 960, 110, { kind: 'serif', size: 46, weight: 700, color: 'ink', align: 'center', alpha: a });
        const cells = [
          { cx: 560, cy: 420, mode: 'both', title: '物质 ✓  范围 ✓', verdict: '构成本级：掌控式', vk: 'ok', tc: T(3, '同时覆盖') },
          { cx: 1360, cy: 420, mode: 'matter', title: '物质 ✓  范围 ✗', verdict: '只算物质总和（0.9）', vk: 'doubt', tc: T(4, '全部物质') },
          { cx: 560, cy: 800, mode: 'range', title: '物质 ✗  范围 ✓', verdict: '单独标注，不计入', vk: 'unobserved', tc: T(5, '范围本身') },
          { cx: 1360, cy: 800, mode: 'stars', title: '只掌控一类要素', verdict: '不构成本级，按实际折算', vk: 'rejected', tc: T(6, '某一类') },
        ];
        cells.forEach((cl) => {
          const k = win(t, cl.tc - 0.4, 0.8);
          if (k <= 0) return;
          g.card(cl.cx - 380, cl.cy - 170, 760, 340, { p: k, alpha: a });
          region(g, cl.cx - 200, cl.cy, 130, t, { alpha: a * k, mode: cl.mode });
          g.text(cl.title, cl.cx + 160, cl.cy - 60, { kind: 'serif', size: 34, weight: 700, align: 'center', alpha: a * k });
          g.tag(cl.verdict, cl.cx + 160, cl.cy + 10, cl.vk, { align: 'center', size: 26, p: win(t, cl.tc + 0.6, 0.5) });
        });
        // details for 4 and 6
        const d4 = env(t, T(4, '空间结构', -0.2), 0.5, T(5, '', -0.2), 0.5);
        g.text('改变不了空间结构 · 作用不到空隙', 1360 + 160, 420 + 70, { kind: 'sans', size: 22, color: 'ink2', align: 'center', alpha: a * d4 });
        const d6a = win(t, T(6, '恒星'), 0.5);
        const d6b = win(t, T(6, '时间'), 0.5);
        g.text('只操控星系里的恒星', 1360 + 160, 800 + 70, { kind: 'sans', size: 22, color: 'ink2', align: 'center', alpha: a * d6a });
        g.text('只操控范围里的时间', 1360 + 160, 800 + 104, { kind: 'sans', size: 22, color: 'ink2', align: 'center', alpha: a * d6b });
        if (d6b > 0) g.icon('clock', 1360 - 200, 800, 56, { color: 'energy', alpha: a * d6b, p: d6b });
      }
    }
    // ---------------------------------------------- 7–8 two labels
    {
      const a = win(t, T(7, '', -0.3), 0.8);
      if (a > 0) {
        g.text('达标的写法', 960, 120, { kind: 'sans', size: 30, color: 'ink3', align: 'center', alpha: a });
        g.card(320, 190, 560, 150, { p: win(t, T(7, '掌控式'), 0.6), border: 'energy', fn: (g2, w) => g2.text('掌控式 某某级', w / 2, 96, { kind: 'serif', size: 50, weight: 900, color: 'energy', align: 'center' }) });
        g.card(1040, 190, 560, 150, { p: win(t, T(7, '砸坑式'), 0.6), fn: (g2, w) => g2.text('砸坑式 某某级', w / 2, 96, { kind: 'serif', size: 50, weight: 900, color: 'ink', align: 'center' }) });
        // level in rank
        const kr = win(t, T(8, '排序上等价', -0.3), 0.7);
        g.seg(600, 400, 1320, 400, { color: 'ink', w: 2.5, p: kr });
        g.text('量级排序：等价', 960, 440, { kind: 'serif', size: 32, weight: 700, align: 'center', alpha: kr });
        // but differ
        const rows = [['输出方式', T(8, '输出方式'), 0.35, 0.8], ['可持续性', T(8, '可持续性'), 0.85, 0.3], ['能量需求', T(8, '能量需求'), 0.55, 0.9]];
        rows.forEach(([nm, tc, l, rr2], i) => {
          const k = win(t, tc - 0.2, 0.7);
          const y = 560 + i * 120;
          g.text(nm, 960, y + 12, { kind: 'serif', size: 34, weight: 700, align: 'center', alpha: k });
          g.rect(860 - 360 * l * k, y - 16, 360 * l * k, 36, { r: 6, fill: 'energyLite', alpha: 0.9 });
          g.rect(1060, y - 16, 360 * rr2 * k, 36, { r: 6, fill: 'rgba(28,26,31,0.35)', alpha: 0.9 });
        });
        g.text('（条长仅示意差异）', 960, 930, { kind: 'sans', size: 22, color: 'ink3', align: 'center', alpha: win(t, T(8, '完全不同'), 0.5) });
        g.seal('分开陈述', 1640, 840, { size: 140, p: win(t, T(8, '分开陈述', -0.2), 0.5) });
      }
    }
  };
  return sc;
}
