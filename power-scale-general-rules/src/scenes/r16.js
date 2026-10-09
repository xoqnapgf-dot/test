// 0.16 · 特殊能力的量化路径
// Paper register. The usual road (energy -> model -> joules) and a second road for abilities
// with no energy reading: two independent axes, reach and the hardest material overcome. An
// engraved knot turns to stone from the base up (petrification against a known material).
// The record format, and how this rule sits next to 0.11 without overlapping it.
import * as THREE from 'three';
import { makeScene } from './base.js';
import { hatchMaterial } from '../gfx/materials.js';
import { setMats } from '../gfx/paper3d.js';
import { clamp, lerp, smooth, ease, win, env, rng } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { strike } from './common.js';

export function build() {
  const sc = makeScene('r16', 'paper', { fov: 30 });
  const { three, camera } = sc;
  const T = sc.c;
  camera.position.set(0, 0, 14);
  camera.lookAt(0, 0, 0);

  const geo = new THREE.TorusKnotGeometry(0.9, 0.3, 220, 32, 2, 3);
  const metal = new THREE.Mesh(geo, hatchMaterial({ tint: '#D9D2C2', freq: 22, axis: [0.3, 1, 0.2], light: [-0.4, 0.8, 0.6] }));
  const stone = new THREE.Mesh(geo, hatchMaterial({ tint: '#B8AE9C', freq: 60, axis: [0, 1, 0], base: 0.25, light: [-0.4, 0.8, 0.6] }));
  stone.scale.setScalar(1.012);
  const knot = new THREE.Group();
  knot.add(metal, stone);
  knot.position.set(3.9, -0.5, 0);
  three.add(knot);

  sc.update = (t) => {
    const show = env(t, T(7, '', -0.8), 0.8, T(8, '', -0.2), 0.8);
    setMats(metal, 'uReveal', lerp(-0.3, 1.3, show));
    const petr = win(t, T(7, '生效', -0.6), 3.0, ease.inOut2) * show;
    setMats(stone, 'uReveal', lerp(-0.3, 1.15, petr));
    knot.rotation.set(0.3, t * 0.25, 0.1);
  };

  const ICONS = [['eye', '幻术'], ['skull', '诅咒'], ['brain', '精神控制'], ['mountain', '石化'], ['dice-5', '概率操纵'], ['eye-off', '信息屏蔽'], ['virus', '诅咒蔓延']];
  const LADDER = ['木材', '钢', '钢筋混凝土', '花岗岩', '金刚石', '天体', '位面'];
  const RANGE = ['面积', '体积', '覆盖人口', '传播距离'];

  sc.draw = (g, t) => {
    // ---------------------------------------- 0–3 another road
    {
      const a = env(t, T(0, '', -0.5), 0.8, T(4, '', -0.3), 0.6);
      if (a > 0) {
        g.text('特殊能力的量化路径', 960, 120, { kind: 'serif', size: 52, weight: 700, color: 'ink', align: 'center', alpha: a });
        const road = ['输出能量', '套模型', '算焦耳'];
        const k1 = win(t, T(1, '输出能量', -0.4), 1.2);
        road.forEach((s, i) => {
          const x = 560 + i * 400;
          g.card(x - 140, 220, 280, 100, { p: clamp(k1 * 3 - i), alpha: a, fn: (g2, w) => g2.text(s, w / 2, 64, { kind: 'serif', size: 36, weight: 700, align: 'center' }) });
          if (i < 2) g.arrow([x + 150, 270], [x + 250, 270], { color: 'ink', w: 2.5, p: clamp(k1 * 3 - i - 0.5), alpha: a });
        });
        g.text('不是所有表现都走这条路', 960, 380, { kind: 'sans', size: 30, color: 'red', align: 'center', alpha: a * win(t, T(1, '不是所有'), 0.6) });
        // icons
        ICONS.forEach(([ic, nm], i) => {
          const tc = T(2, nm, -0.3);
          const k = win(t, tc, 0.5);
          const x = 330 + i * 210;
          g.circle(x, 540, 76, { fill: 'card', color: 'ink', w: 2, alpha: a * k });
          g.icon(ic, x, 540, 76, { p: k, w: 1.7, alpha: a });
          g.text(nm, x, 660, { kind: 'serif', size: 30, weight: 700, align: 'center', alpha: a * k });
        });
        g.tag('往往没有直接的能量读数', 960, 760, 'unobserved', { align: 'center', size: 28, p: win(t, T(2, '没有直接'), 0.5) });
        g.tag('但仍然可以量化', 960, 830, 'ok', { align: 'center', size: 28, p: win(t, T(2, '仍然可以'), 0.5) });
        const k3 = win(t, T(3, '不测能量', -0.3), 0.6);
        if (k3 > 0) {
          g.rect(0, 880, W, 200, { fill: 'rgba(236,229,214,0.94)', alpha: k3 });
          g.text('J', 520, 990, { kind: 'math', size: 70, color: 'ink3', align: 'center', alpha: a * k3 });
          strike(g, 470, 990, 570, 960, win(t, T(3, '不测能量', 0.3), 0.4), { w: 8 });
          g.text('测实际覆盖了多大范围', 960, 960, { kind: 'serif', size: 34, weight: 700, color: 'range', align: 'center', alpha: a * win(t, T(3, '覆盖了'), 0.5) });
          g.text('测实际压制过多强的材质和目标', 960, 1020, { kind: 'serif', size: 34, weight: 700, color: 'energy', align: 'center', alpha: a * win(t, T(3, '压制过'), 0.5) });
        }
      }
    }
    // ---------------------------------------- 4–7 two axes
    {
      const a = env(t, T(4, '', -0.3), 0.7, T(8, '', -0.3), 0.6);
      if (a > 0) {
        const x0 = 260;
        const y0 = 900;
        const ww = 1060;
        const hh = 640;
        const k4 = win(t, T(4, '', -0.2), 1.0);
        g.arrow([x0, y0], [x0 + ww, y0], { color: 'range', w: 3, p: k4, head: 16 });
        g.arrow([x0, y0], [x0, y0 - hh], { color: 'energy', w: 3, p: k4, head: 16 });
        g.text('影响范围', x0 + ww, y0 + 50, { kind: 'serif', size: 34, weight: 700, color: 'range', align: 'right', alpha: a * k4 });
        g.text('可影响材质上限', x0 - 20, y0 - hh - 30, { kind: 'serif', size: 34, weight: 700, color: 'energy', alpha: a * k4 });
        g.text('两条轴分别量化，不合并成一个焦耳数', 960, 110, { kind: 'serif', size: 40, weight: 700, align: 'center', alpha: a * win(t, T(4, '不强行合并'), 0.6) });
        // range ticks
        RANGE.forEach((s, i) => {
          const k = win(t, T(5, s, -0.2), 0.5);
          const x = x0 + 150 + i * 240;
          g.seg(x, y0, x, y0 + 14, { color: 'range', w: 2, alpha: a * k });
          g.text(s, x, y0 + 50, { kind: 'sans', size: 26, color: 'ink', align: 'center', alpha: a * k });
        });
        g.text('与覆盖模型的“直径”同一用法，不另设单位', x0 + ww / 2, y0 + 100, { kind: 'sans', size: 24, color: 'ink2', align: 'center', alpha: a * win(t, T(5, '直径'), 0.5) });
        // material ladder
        const k6 = win(t, T(6, '', -0.2), 1.2);
        LADDER.forEach((s, i) => {
          const y = y0 - 70 - i * 82;
          const k = clamp(k6 * LADDER.length - i);
          g.seg(x0 - 12, y, x0, y, { color: 'energy', w: 2, alpha: a * k });
          g.text(s, x0 - 22, y + 9, { kind: 'sans', size: 24, color: i >= 5 ? 'energy' : 'ink', align: 'right', alpha: a * k });
        });
        // an ability plotted as a point: reach x, hardest material y
        const kp = win(t, T(6, '反推', -0.3), 0.8);
        if (kp > 0) {
          const px = x0 + 150 + 1.6 * 240;
          const py = y0 - 70 - 3 * 82;
          g.seg(px, y0, px, py, { color: 'range', w: 1.5, dash: [6, 5], alpha: a * kp });
          g.seg(x0, py, px, py, { color: 'energy', w: 1.5, dash: [6, 5], alpha: a * kp });
          g.circle(px, py, 14, { fill: 'red', alpha: a * kp });
          g.text('某项能力', px + 24, py - 16, { kind: 'kai', size: 32, color: 'red', alpha: a * kp });
          g.text('作用过的最强目标 → 至少能压制这么硬', px + 24, py + 26, { kind: 'sans', size: 24, color: 'ink2', alpha: a * kp });
        }
        // petrification example
        const k7 = win(t, T(7, '', -0.4), 0.6);
        if (k7 > 0) {
          const kp2 = sc.project(knot.position);
          g.text('例：石化', kp2[0], 230, { kind: 'serif', size: 36, weight: 700, align: 'center', alpha: a * k7 });
          g.text('对已知强度的材质生效', kp2[0], 280, { kind: 'sans', size: 26, color: 'ink2', align: 'center', alpha: a * k7 });
          g.text('→ 按材料强度数据反推下限', kp2[0], 860, { kind: 'serif', size: 30, weight: 700, color: 'energy', align: 'center', alpha: a * win(t, T(7, '反推下限'), 0.5) });
          g.text('天体或位面级 → 用对应量级的强度锚点', kp2[0], 920, { kind: 'sans', size: 26, color: 'ink2', align: 'center', alpha: a * win(t, T(7, '天体'), 0.5) });
        }
      }
    }
    // ---------------------------------------- 8–9 the value of this road
    {
      const a = env(t, T(8, '', -0.3), 0.7, T(10, '', -0.3), 0.6);
      if (a > 0) {
        g.text('这不是在给能力硬凑一个焦耳数', 960, 140, { kind: 'serif', size: 46, weight: 700, align: 'center', alpha: a });
        const k = win(t, T(9, '依然能给出'), 0.6);
        g.card(220, 260, 700, 240, { p: win(t, T(9, '范围有多大', -0.3), 0.6), border: 'range', fn: (g2, w) => { g2.text('范围有多大', 40, 100, { kind: 'serif', size: 50, weight: 900, color: 'range' }); g2.text('可比较 · 可核实', 40, 170, { kind: 'sans', size: 30, color: 'ink2' }); } });
        g.card(1000, 260, 700, 240, { p: win(t, T(9, '能压制多硬', -0.3), 0.6), border: 'energy', fn: (g2, w) => { g2.text('能压制多硬', 40, 100, { kind: 'serif', size: 50, weight: 900, color: 'energy' }); g2.text('可比较 · 可核实', 40, 170, { kind: 'sans', size: 30, color: 'ink2' }); } });
        g.text('“很强的特殊能力”', 960, 620, { kind: 'kai', size: 48, color: 'ink2', align: 'center', alpha: a * win(t, T(9, '很强的特殊能力', -0.4), 0.5) });
        strike(g, 740, 610, 1180, 600, win(t, T(9, '没法比较', -0.2), 0.4), { w: 10 });
        const kf = win(t, T(9, '没法比较', 0.6), 0.6);
        g.card(360, 720, 1200, 150, {
          p: kf,
          border: 'gold',
          fn: (g2, w) => g2.text('「特殊能力 · 影响范围：XX · 可突破强度上限：XX」', w / 2, 92, { kind: 'kai', size: 40, color: 'ink', align: 'center' }),
        });
      }
    }
    // ---------------------------------------- 10 next to 0.11
    {
      const a = win(t, T(10, '', -0.3), 0.8);
      if (a > 0) {
        g.text('与 0.11 互补，不重叠', 960, 120, { kind: 'serif', size: 48, weight: 700, align: 'center', alpha: a });
        const kL = win(t, T(10, '整体接管', -0.4), 0.7);
        g.circle(620, 560, 260 * ease.out3(kL), { fill: 'rgba(30,91,138,0.12)', color: 'range', w: 3, alpha: a });
        g.text('0.11 掌控等价于毁灭', 620, 540, { kind: 'serif', size: 34, weight: 900, color: 'range', align: 'center', alpha: a * kL });
        g.text('对整个范围的整体接管', 620, 600, { kind: 'sans', size: 28, align: 'center', alpha: a * kL });
        const kR = win(t, T(10, '没有整体接管', -0.4), 0.7);
        g.circle(1300, 560, 260 * ease.out3(kR), { fill: 'rgba(176,106,23,0.12)', color: 'energy', w: 3, alpha: a });
        g.text('0.16 特殊能力', 1300, 520, { kind: 'serif', size: 34, weight: 900, color: 'energy', align: 'center', alpha: a * kR });
        g.text('没有整体接管', 1300, 580, { kind: 'sans', size: 28, align: 'center', alpha: a * kR });
        g.text('对具体目标产生可测效果', 1300, 624, { kind: 'sans', size: 28, align: 'center', alpha: a * kR });
        g.seal('互补', 960, 900, { size: 120, color: 'gold', p: win(t, T(10, '互补'), 0.5) });
      }
    }
  };
  return sc;
}
