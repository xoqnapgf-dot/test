// 四 · 超长篇与结转
// A thousand-chapter strip: dense setting marks, sparse battle marks. The step-one cursor crawls
// and stalls. Then the order flips: two or three landmark battles are computed first (with
// assumption / doubt tags), and the setting is used afterwards to cross-check. Short works keep
// the default order. Every batch ends with a carry-over card: confirmed and doubtful kept apart.
import { makeScene } from './base.js';
import { clamp, lerp, smooth, ease, win, env, rng } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { strike } from './common.js';

export function build() {
  const sc = makeScene('long', 'paper', { fov: 30 });
  const { c } = sc;
  const T = c;
  // strip data
  const r = rng(77);
  const N = 1200;
  const setting = [];
  const battles = [];
  for (let i = 0; i < N; i++) {
    const dens = 0.55 + 0.45 * Math.sin(i * 0.013) * Math.sin(i * 0.0041 + 1);
    if (r() < 0.32 * dens + 0.08) setting.push(i);
    if (r() < 0.012) battles.push(i);
  }
  const marquee = [battles[3], battles[Math.floor(battles.length / 2)], battles[battles.length - 4]];
  const SX0 = 120;
  const SX1 = 1800;
  const SY = 470;
  const sx = (i) => lerp(SX0, SX1, i / N);

  sc.draw = (g, t) => {
    // ---------------------------------------------------- strip
    const a = env(t, T(0, '', -0.6), 0.8, T(8, '不管哪种', -0.3), 0.8);
    if (a > 0) {
      const kIn = win(t, T(1, '上千章', -0.5), 1.6, ease.inOut3);
      g.text('超长篇', 960, 140, { kind: 'serif', size: 56, weight: 900, color: 'ink', align: 'center', alpha: a * win(t, T(0, '超长篇'), 0.6) });
      g.text('动辄上千章', 960, 200, { kind: 'sans', size: 28, color: 'ink2', align: 'center', alpha: a * win(t, T(1, '上千章'), 0.6) });
      // chapter strip
      g.rect(SX0, SY - 40, (SX1 - SX0) * kIn, 80, { fill: 'card', color: 'rule', w: 1.2, alpha: a });
      for (let i = 0; i < N; i += 100) g.text(String(i || 1), sx(i), SY + 72, { kind: 'mono', size: 16, color: 'ink3', align: 'center', alpha: a * clamp(kIn * N / 100 - i / 100) });
      // setting marks (blue) appear with the density line
      const kS = win(t, T(3, '信息密度', -0.4), 1.2);
      for (const i of setting) {
        if (sx(i) > lerp(SX0, SX1, kS)) break;
        g.seg(sx(i), SY - 34, sx(i), SY - 4, { color: 'range', w: 1.1, alpha: a * 0.7 });
      }
      // battle marks (gold) sparse
      const kB = win(t, T(3, '完整战斗描写', -0.4), 1.2);
      for (const i of battles) {
        if (sx(i) > lerp(SX0, SX1, kB)) break;
        const big = marquee.includes(i) ? win(t, T(5, '标志性', -0.4), 0.6) : 0;
        g.rect(sx(i) - 2.5 - big * 3, SY + 4 - big * 10, 5 + big * 6, 30 + big * 20, { fill: 'energy', alpha: a });
      }
      if (kS > 0) {
        g.seg(SX0, SY - 110, SX0 + 34, SY - 110, { color: 'range', w: 6, alpha: a * kS });
        g.text('设定 · 境界体系（可以无限细挖）', SX0 + 46, SY - 102, { kind: 'sans', size: 24, color: 'range', alpha: a * kS });
      }
      if (kB > 0) {
        g.seg(SX0 + 760, SY - 110, SX0 + 794, SY - 110, { color: 'energy', w: 6, alpha: a * kB });
        g.text('完整的战斗描写（稀疏，要一段一段找）', SX0 + 806, SY - 102, { kind: 'sans', size: 24, color: 'energy', alpha: a * kB });
      }
      // the step-one cursor crawling and stalling
      const kc = env(t, T(1, '停在第一步', -0.6), 0.6, T(4, '倒过来', 0), 0.6);
      if (kc > 0) {
        const prog = 0.07 * ease.out2((t - T(1, '停在第一步', -0.6)) / 9);
        const x = lerp(SX0, SX1, prog);
        g.seg(x, SY - 60, x, SY + 50, { color: 'ink', w: 3, alpha: kc });
        g.text('第一步', x + 10, SY - 64, { kind: 'serif', size: 28, weight: 700, color: 'ink', alpha: kc });
        g.text('第二步 ……', SX1 - 160, SY - 64, { kind: 'serif', size: 28, weight: 700, color: 'ink3', alpha: kc * 0.8 });
        g.text('迟迟进不了', SX1 - 160, SY - 104, { kind: 'sans', size: 22, color: 'ink3', alpha: kc * win(t, T(1, '迟迟'), 0.5) });
      }
      // not a failure
      const nf = env(t, T(2, '不是流程失败', -0.2), 0.6, T(3, '', 0.4), 0.6);
      g.text('不是流程失败 · 是这类体量固有的特征', 960, 700, { kind: 'serif', size: 34, weight: 700, color: 'ink', align: 'center', alpha: a * nf });
      // reverse order
      const rv = win(t, T(4, '倒过来', -0.3), 0.8);
      if (rv > 0) {
        g.text('默认顺序', 560, 610, { kind: 'sans', size: 26, color: 'ink3', align: 'center', alpha: a * rv });
        g.text('设定 → 战斗', 560, 654, { kind: 'serif', size: 36, weight: 700, color: 'ink3', align: 'center', alpha: a * rv });
        strike(g, 440, 644, 680, 638, win(t, T(4, '倒过来', 0.2), 0.4), { w: 8 });
        g.arrow([760, 640], [1080, 640], { color: 'ink', w: 3, p: rv, bend: -0.18 });
        g.text('超长篇', 1360, 610, { kind: 'sans', size: 26, color: 'energy', align: 'center', alpha: a * rv });
        g.text('战斗 → 设定', 1360, 654, { kind: 'serif', size: 36, weight: 700, color: 'energy', align: 'center', alpha: a * rv });
      }
      // marquee battles computed first
      const mk = win(t, T(5, '直接算出', -0.3), 0.8);
      marquee.forEach((i, j) => {
        const k = clamp(mk * 3 - j);
        if (k <= 0) return;
        const x = sx(i);
        const by = 890;
        g.seg(x, SY + 46, x, by - 70, { color: 'energy', w: 1.5, dash: [5, 5], alpha: a * k });
        g.card(x - 150, by - 70, 300, 150, {
          p: k,
          alpha: a * (1 - win(t, T(7, '短篇', -0.3), 0.6)),
          fill: '#FBF6EC',
          fn: (g2, w) => {
            g2.text(`标志性战斗 ${j + 1} · 示例`, w / 2, 42, { kind: 'sans', size: 22, color: 'ink3', align: 'center' });
            g2.sci([['3.2', '8.9', '1.5'][j], ['23', '31', '38'][j]], w / 2, 90, { size: 32, color: 'energy', align: 'center', unit: 'J' });
            const tg = win(t, T(5, '假设和存疑', -0.3) + j * 0.2, 0.5);
            g2.tag(j === 1 ? '存疑' : '假设', w / 2, 124, 'doubt', { align: 'center', size: 20, p: tg });
          },
        });
      });
      // then cross-check with the setting
      const cv = win(t, T(6, '回头', -0.3), 1.0);
      if (cv > 0) {
        marquee.forEach((i, j) => {
          const x = sx(i);
          const k = clamp(cv * 3 - j);
          const tgt = setting.find((s) => s > i + 60) || i;
          g.arrow([x + 20, SY + 70], [sx(tgt), SY + 26], { color: 'range', w: 2, p: k, bend: 0.35, head: 10, alpha: a * (1 - win(t, T(7, '短篇', -0.3), 0.6)) });
        });
        g.text('再用设定资料交叉验证、补全', 960, 300, { kind: 'serif', size: 32, weight: 700, color: 'range', align: 'center', alpha: a * cv * (1 - win(t, T(7, '短篇', -0.3), 0.6)) });
        g.text('设定是随后补充验证的材料，不是必须先摸透的前提', 960, 345, { kind: 'sans', size: 24, color: 'ink2', align: 'center', alpha: a * win(t, T(6, '不是必须'), 0.6) * (1 - win(t, T(7, '短篇', -0.3), 0.6)) });
      }
      // short works keep the default order
      const sh = env(t, T(7, '短篇', -0.2), 0.6, T(8, '不管哪种', -0.4), 0.6);
      if (sh > 0) {
        g.rect(0, 560, W, 520, { fill: 'rgba(236,229,214,0.92)', alpha: sh });
        g.rect(560, 760, 800, 60, { fill: 'card', color: 'rule', w: 1.2, alpha: sh });
        for (let i = 0; i < 40; i++) if (i % 3 !== 1) g.seg(570 + i * 19.5, 764, 570 + i * 19.5, 788, { color: 'range', w: 1.2, alpha: sh * 0.7 });
        for (const i of [7, 22, 33]) g.rect(566 + i * 19.5, 792, 6, 24, { fill: 'energy', alpha: sh });
        g.text('短篇 · 完本单篇', 960, 700, { kind: 'serif', size: 40, weight: 700, color: 'ink', align: 'center', alpha: sh });
        g.text('照常第一步先行 · 一轮就能兜住', 960, 900, { kind: 'sans', size: 28, color: 'ok', align: 'center', alpha: sh * win(t, T(7, '照常'), 0.5) });
      }
    }
    // ---------------------------------------------------- carry-over card
    {
      const a = win(t, T(8, '不管哪种', -0.2), 0.8);
      if (a > 0) {
        g.text('每一批结束：可结转的结论摘要', 960, 120, { kind: 'serif', size: 46, weight: 700, color: 'ink', align: 'center', alpha: a });
        const slide = win(t, T(9, '后续批次'), 1.6, ease.inOut3);
        const cx = lerp(300, 960, 0) + 0;
        const cardX = lerp(260, 1080, slide);
        // the processed originals stay behind, greyed
        for (let i = 0; i < 5; i++) {
          g.card(130 + i * 26, 250 + i * 18, 300, 380, { alpha: a * lerp(1, 0.35, slide), fill: '#F3EEE2', fn: (g2) => { for (let j = 0; j < 10; j++) g2.rect(30, 40 + j * 30, 220 - (j % 3) * 30, 8, { r: 3, fill: 'rgba(28,26,31,0.12)' }); } });
        }
        g.text('已处理的原文', 300, 700, { kind: 'sans', size: 24, color: 'ink3', align: 'center', alpha: a });
        g.text('不再重读', 300, 736, { kind: 'sans', size: 24, color: 'ink3', align: 'center', alpha: a * win(t, T(9, '不需要重新'), 0.5) });
        // next batch box
        const nb = win(t, T(9, '后续批次', -0.4), 0.7);
        g.rect(1120, 220, 680, 720, { r: 18, color: 'ink3', w: 2, dash: [10, 8], alpha: nb });
        g.text('下一批', 1460, 270, { kind: 'serif', size: 32, weight: 700, color: 'ink3', align: 'center', alpha: nb });
        // the card itself
        const ck = win(t, T(8, '结论摘要', -0.4), 0.8);
        const cw = 640;
        const chh = 560;
        const cyy = 320;
        g.card(cardX + (slide > 0 ? 0 : 200), cyy, cw, chh, {
          p: ck,
          alpha: a,
          fill: '#FBF7EE',
          rot: lerp(-0.015, 0.01, slide),
          fn: (g2, w, h) => {
            const wr = (s0, dur) => win(t, s0, dur);
            g2.text('结论摘要', 34, 62, { kind: 'serif', size: 34, weight: 900 });
            g2.text('批次 07', w - 34, 60, { kind: 'mono', size: 22, color: 'ink3', align: 'right' });
            g2.seg(30, 84, w - 30, 84, { color: 'ink', w: 1.5 });
            // confirmed
            const k1 = wr(T(10, '已确认', -0.3), 0.6);
            g2.text('已确认', 34, 132, { kind: 'sans', size: 26, weight: 700, color: 'ok', alpha: k1 });
            const rows = [
              ['世界观强度 = 现实 × N', 0],
              ['位面结构：A → B → C', 1],
              ['已定级战绩：X 为 YY 级（Z 焦耳）', 2],
            ];
            rows.forEach(([s, i]) => g2.text(s, 50, 182 + i * 50, { kind: 'kai', size: 30, reveal: wr(T(8, '结论摘要') + 0.4 + i * 0.7, 1.0) }));
            // hard divider
            const kd = wr(T(10, '严格分开', -0.4), 0.6);
            g2.line([[30, 350], [w - 30, 350]], { color: 'red', w: 3, p: kd });
            g2.text('严格分开', w - 40, 340, { kind: 'sans', size: 20, color: 'red', align: 'right', alpha: kd });
            const k2 = wr(T(10, '存疑', -0.3), 0.6);
            g2.text('存疑 / 待验证', 34, 400, { kind: 'sans', size: 26, weight: 700, color: 'doubt', alpha: k2 });
            g2.text('…', 50, 452, { kind: 'kai', size: 30, alpha: k2 });
            g2.rect(30, 370, w - 60, 160, { r: 8, color: 'doubt', w: 1.5, dash: [6, 5], alpha: k2 });
          },
        });
        const nk = win(t, T(10, '不能把推测', -0.2), 0.6);
        g.text('推测 ≠ 已确认', 960, 1000, { kind: 'serif', size: 36, weight: 700, color: 'red', align: 'center', alpha: nk });
      }
    }
  };
  return sc;
}
