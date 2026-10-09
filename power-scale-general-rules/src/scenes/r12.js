// 0.12 · 速度、防御与攻击
// One rating card: the main axis is destructive power; speed and defence hang beside it as
// tags. Speed's chain to the energy axis is cut; defence only earns a "攻防双满" tag.
import { makeScene } from './base.js';
import { clamp, lerp, smooth, ease, win, env } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { strike } from './common.js';

export function build() {
  const sc = makeScene('r12', 'paper', { fov: 30, backdrop: { grid: 0.4 } });
  const T = sc.c;
  sc.draw = (g, t) => {
    const a = win(t, T(0, '', -0.5), 0.8);
    g.text('定级以破坏力为准', 960, 110, { kind: 'serif', size: 50, weight: 700, color: 'ink', align: 'center', alpha: a * win(t, T(1, '破坏力'), 0.6) });
    // the main axis
    const ax = win(t, T(1, '破坏力', -0.2), 1.0);
    const x0 = 260;
    const x1 = 1660;
    const y = 640;
    g.line([[x0, y], [x1, y]], { color: 'energy', w: 6, p: ax });
    g.arrow([x1 - 10, y], [x1 + 30, y], { color: 'energy', w: 4, head: 20, alpha: ax });
    g.text('破坏力（攻击）· 主轴', x0, y + 60, { kind: 'serif', size: 34, weight: 700, color: 'energy', alpha: ax });
    const main = win(t, T(4, '主轴', -0.4), 0.8);
    g.glow(1180, y, 200, 'energy', 0.0);
    g.circle(1180, y, 18, { fill: 'energy', alpha: ax });
    g.text('量级数字', 1180, y - 40, { kind: 'serif', size: 30, weight: 700, color: 'ink', align: 'center', alpha: ax });
    if (main > 0) g.circle(1180, y, 18 + 40 * main, { color: 'energy', w: 3, alpha: 1 - main * 0.6 });
    const noConv = win(t, T(1, '不参与'), 0.6);
    g.tag('不参与量级换算，只作标注', 960, 190, 'unobserved', { align: 'center', size: 28, p: noConv });
    // speed tag hanging
    const sp = win(t, T(2, '速度', -0.3), 0.8);
    if (sp > 0) {
      g.line([[1180, y - 20], [760, 330]], { color: 'ink3', w: 2, dash: [8, 6], p: sp });
      g.card(460, 250, 600, 170, {
        p: sp,
        fn: (g2, w) => {
          g2.icon('rocket', 54, 64, 60, { w: 1.6 });
          g2.text('速度', 100, 76, { kind: 'serif', size: 40, weight: 900 });
          g2.text('光速倍数 / 设定原文', 30, 136, { kind: 'sans', size: 30, color: 'ink2', alpha: win(t, T(2, '光速倍数'), 0.5) });
        },
      });
      const cut = win(t, T(2, '不绑定量级'), 0.6);
      // chain from speed card to the axis, cut
      g.line([[760, 420], [760, y - 10]], { color: 'ink', w: 3, dash: [3, 7], alpha: sp });
      if (cut > 0) {
        g.seg(730, 520, 790, 500, { color: 'red', w: 5, p: cut });
        g.text('不折算能量', 800, 540, { kind: 'sans', size: 26, color: 'red', alpha: win(t, T(2, '不折算'), 0.5) });
      }
    }
    // defence tag
    const df = win(t, T(3, '防御', -0.3), 0.8);
    if (df > 0) {
      g.line([[1180, y + 20], [1300, 800]], { color: 'ink3', w: 2, dash: [8, 6], p: df });
      g.card(1100, 790, 640, 190, {
        p: df,
        fn: (g2, w) => {
          g2.icon('shield', 54, 64, 60, { w: 1.6 });
          g2.text('防御：不单独定级', 100, 76, { kind: 'serif', size: 36, weight: 900 });
          g2.text('“攻防双满 · 标准星系级”', 30, 146, { kind: 'kai', size: 34, color: 'energy', alpha: win(t, T(3, '攻防双满', 0), 0.6) });
        },
      });
    }
    // conclusion
    const k5 = win(t, T(5, '', -0.2), 0.8);
    if (k5 > 0) {
      g.text('角色的量级 = 其破坏力量级', 560, 880, { kind: 'serif', size: 40, weight: 900, color: 'ink', align: 'center', alpha: k5 });
      g.text('其余维度：挂在数字旁边的标签', 560, 950, { kind: 'sans', size: 30, color: 'ink2', align: 'center', alpha: win(t, T(5, '标签'), 0.6) });
    }
  };
  return sc;
}
