// 终 · 刻度之前
// The sixteen rules settle under the energy axis like foundation stones; the axis lights up from
// the mosquito to the edge of the universe; the next part is named and the picture fades.
import { makeScene } from './base.js';
import { clamp, lerp, smooth, ease, win, env } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { axis2d, RULES } from './common.js';

export function build() {
  const sc = makeScene('end', 'cosmos', { fov: 40, backdrop: { stars: 1, nebula: 0.9, tint: '#7a3418' } });
  const T = sc.c;
  const SEG_A = Math.log10(2.28e42);
  const SEG_B = Math.log10(3.69e49);
  sc.update = (t) => {
    sc.camera.position.set(Math.sin(t * 0.05) * 0.4, 0, 10);
    sc.camera.lookAt(0, 0, 0);
    sc.camera.updateMatrixWorld();
  };
  sc.draw = (g, t) => {
    const out = 1 - win(t, T(2, '', 3.5), 3.0);
    const AX = { x0: 150, x1: 1770, y: 470, d0: -5, d1: 86 };
    const X = (d) => lerp(AX.x0, AX.x1, (d - AX.d0) / (AX.d1 - AX.d0));
    const ka = win(t, T(1, '能量轴', -1.2), 2.4, ease.inOut3);
    axis2d(g, { ...AX, alpha: out * win(t, T(0, '', -1), 1), p: Math.max(0.25, ka), every: 10 });
    // three bands
    const kb = win(t, T(1, '每一格', -0.6), 1.2);
    if (kb > 0) {
      g.line([[X(-4.3), AX.y + 46], [X(SEG_A), AX.y + 46]], { color: 'energy', w: 8, p: kb, alpha: out, glow: 12 });
      g.line([[X(SEG_B), AX.y + 46], [X(85), AX.y + 46]], { color: 'range', w: 8, p: kb, alpha: out, glow: 12 });
      g.line([[X(SEG_A), AX.y + 46], [X(SEG_B), AX.y + 46]], { color: 'ink3', w: 3, dash: [5, 5], p: kb, alpha: out });
      g.text('蚊子叮咬', X(-4.3), AX.y - 40, { kind: 'sans', size: 24, color: 'ink2', align: 'center', alpha: out * kb });
      g.text('宇宙尽头', X(84), AX.y - 40, { kind: 'sans', size: 24, color: 'ink2', align: 'center', alpha: out * kb });
    }
    // rules as foundation stones
    RULES.forEach(([n], i) => {
      const k = win(t, T(0, '十六条', -0.6) + i * 0.08, 0.6, ease.out3);
      if (k <= 0) return;
      const x = 210 + i * 100;
      const y = lerp(840, 600, k);
      g.rect(x - 44, y - 34, 88, 68, { r: 6, fill: 'rgba(16,20,30,0.9)', color: 'gold', w: 1.5, alpha: out * smooth(k * 2) });
      g.text(n, x, y + 11, { kind: 'math', size: 28, weight: 600, color: 'gold', align: 'center', alpha: out * smooth(k * 2) });
    });
    const kl = env(t, T(0, '证据怎么读', -0.3), 0.6, T(2, '', -0.4), 0.8);
    const items = [['证据怎么读', T(0, '证据')], ['数字怎么取', T(0, '数字')], ['标签怎么挂', T(0, '标签')]];
    items.forEach(([s, tc], i) => g.text(s, 560 + i * 400, 800, { kind: 'serif', size: 40, weight: 700, color: 'ink', align: 'center', alpha: kl * win(t, tc - 0.2, 0.5) * out }));
    g.text('有了它们，每一格刻度才有分量', 960, 260, { kind: 'serif', size: 44, weight: 700, color: 'gold', align: 'center', alpha: env(t, T(1, '有了它们'), 0.8, T(2, '', -0.2), 0.8) * out, glow: 12 });
    // next part
    const kn = win(t, T(2, '下一部分', -0.2), 1.2);
    if (kn > 0) {
      g.text('下一部分', 960, 220, { kind: 'serif', size: 30, weight: 500, color: 'ink3', align: 'center', alpha: kn * out, track: 12 });
      g.text('第一部分 · 继承区', 960, 320, { kind: 'serif', size: 76, weight: 900, color: 'ink', align: 'center', alpha: kn * out, reveal: kn, glow: 20, track: 8 });
      g.text('爆恒星及以下 · 一格一格地看', 960, 380, { kind: 'sans', size: 28, color: 'ink2', align: 'center', alpha: win(t, T(2, '一格一格'), 0.8) * out });
    }
  };
  return sc;
}
