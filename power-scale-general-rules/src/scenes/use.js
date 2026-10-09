// 一 · 定级与证伪
// Two uses of equal weight (a level balance). Rating: range + structure -> joules -> a tier on
// the axis. Debunking: an inflated pin is struck off. Then "无穷无尽" becomes a particle ∞ that
// goes through the three steps: stamped as rhetoric (0.2), sorted by the four grades (3.10.3),
// drained and cracked by energy exhaustion, and finally pulled back onto the finite energy axis.
// It ends by unrolling into a straight line: not an end point, a starting point.
import * as THREE from 'three';
import { makeScene } from './base.js';
import { makeInfinity } from '../gfx/objects.js';
import { clamp, lerp, smooth, ease, win, env, keys } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { axis2d, pin, slot, strike, balance, settle } from './common.js';

const PPU = 98.1; // overlay px per world unit at z = 0 (camera z 16, fov 38)
const wv = (px, py) => [(px - W / 2) / PPU, (H / 2 - py) / PPU, 0];

export function build() {
  const sc = makeScene('use', 'cosmos', { fov: 38, backdrop: { stars: 0.8, nebula: 0.6, tint: '#5a2a14' } });
  const { three, camera, c } = sc;
  camera.position.set(0, 0, 16);
  camera.lookAt(0, 0, 0);
  const inf = makeInfinity(9000, { scale: 2.4, size: 0.028, intensity: 0.5, thick: 0.06 });
  three.add(inf);
  const U = inf.userData.u;

  const AX = { x0: 170, x1: 1750, y: 930, d0: 0, d1: 80 };
  const Xd = (d) => lerp(AX.x0, AX.x1, (d - AX.d0) / (AX.d1 - AX.d0));
  const SLOTS = [
    ['超大可计算', '默认档'],
    ['不可计算', '三条件同时满足'],
    ['铺垫法', '有前置节点的递进'],
    ['能量枯竭证伪', '直接实锤'],
  ];
  const slotX = (i) => 390 + i * 380;
  const SLOT_Y = 600;

  // ∞ placement track: [t, [px, py, scale]]
  const T = c;
  const place = [
    [T(3, '', -0.4), [960, 400, 2.4]],
    [T(4, '现有', -0.2), [960, 400, 2.4]],
    [T(4, '比如', 0.2), [960, 250, 1.35]],
    [T(7, '打回', -0.6), [960, 255, 1.35]],
    [T(8, '第二步', -0.2), [960, 255, 1.35]],
    [T(8, '超大', -0.5), [slotX(0), 455, 0.62]],
    [T(8, '不可计算', -0.3), [slotX(1), 455, 0.62]],
    [T(8, '铺垫法', -0.3), [slotX(2), 455, 0.62]],
    [T(8, '能量枯竭', -0.3), [slotX(3), 455, 0.62]],
    [T(9, '实锤', 1.5), [slotX(3), 455, 0.62]],
  ];
  const segA = Xd(48.8);
  const segB = Xd(51.2);

  sc.update = (t) => {
    U.uTime.value = t;
    const k = keys(t, place, ease.inOut3);
    let center = wv(k[0], k[1]);
    let scale = k[2];
    // reform at the centre for the finale
    const fin0 = T(13, '这个无限', -0.6);
    if (t > fin0 - 1.5) {
      const q = ease.inOut3((t - (fin0 - 1.5)) / 1.6);
      const c2 = wv(960, 420);
      center = center.map((v, i) => lerp(v, c2[i], q));
      scale = lerp(scale, 2.3, q);
    }
    U.uCenter.value.set(...center);
    U.uScale.value = scale;
    U.uRot.value = Math.sin(t * 0.35) * 0.35;
    U.uTilt.value = Math.sin(t * 0.23) * 0.18;
    // presence
    const born = win(t, T(3, '', -0.4), 2.2, ease.out3);
    U.uI.value = 0.5 * born * (1 - 0.6 * env(t, T(12, '旧体系', -0.3), 0.7, T(13, '这个无限', -1.2), 0.7));
    // stamped as rhetoric -> greys out; the remaining grades keep it grey
    U.uGrey.value = 0.7 * win(t, T(7, '虚词', 0.1), 0.8) * (1 - win(t, T(10, '回到', 0), 1.2));
    // drained, then cracked
    const drain = win(t, T(9, '能量枯竭', -0.2), 2.4, ease.inOut2);
    const crack = win(t, T(9, '实锤', 0), 0.9, ease.out3);
    // regather onto the axis
    const gather = win(t, T(10, '回到能量轴', -0.4), 2.0, ease.inOut3);
    const toLine = win(t, T(10, '回到能量轴', 0.2), 2.4, ease.inOut3);
    // finale: back to ∞, then unrolled into the start line
    const reform = win(t, fin0 - 1.4, 1.6, ease.inOut3);
    const unroll = win(t, T(13, '起点', -0.9), 2.2, ease.inOut3);
    U.uDrain.value = drain * (1 - gather);
    U.uScatter.value = Math.max(1 - born, crack * (1 - gather));
    U.uMorph.value = Math.max(toLine * (1 - reform), unroll);
    if (unroll > 0) {
      U.uLineA.value.set(...wv(420, 560));
      U.uLineB.value.set(...wv(1500, 560));
    } else {
      U.uLineA.value.set(...wv(segA, AX.y));
      U.uLineB.value.set(...wv(segB, AX.y));
    }
  };

  sc.draw = (g, t) => {
    // ------------------------------------------------- 0: balance of two uses
    {
      const a = env(t, T(0, '', -0.6), 0.8, T(1, '第一个', 0.3), 0.8);
      if (a > 0) {
        const tilt = settle(t, T(0, '分量'), -0.22, 4.2);
        balance(g, 960, 360, { alpha: a, tilt, p: win(t, T(0, '', -0.5), 1.4), left: '定级', right: '证伪', leftSub: '给达标者定级', rightSub: '取消不达标者的虚高', len: 300, labelA: win(t, T(0, '两个用途'), 0.8) });
        g.text('分量一样重', 960, 300 - 70, { kind: 'serif', size: 30, weight: 500, color: 'gold', align: 'center', alpha: a * win(t, T(0, '分量'), 0.6), track: 6 });
      }
    }
    // ------------------------------------------------- axis (rating & final)
    const axA = Math.max(env(t, T(0, '', -0.6), 1.0, T(3, '', -0.4), 0.8), win(t, T(10, '回到', -0.4), 1.0) * (1 - win(t, T(12, '旧体系'), 0.8)));
    if (axA > 0) axis2d(g, { ...AX, alpha: axA, p: Math.max(win(t, T(0, '', -0.5), 1.8), 1 - 0) });

    // ------------------------------------------------- 1: rating, worked example
    {
      const a = env(t, T(1, '定级', -0.2), 0.7, T(2, '证伪', 0.4), 0.8);
      if (a > 0) {
        const cx = 780;
        const cy = 480;
        g.text('定级', 960, 190, { kind: 'serif', size: 56, weight: 700, color: 'energy', align: 'center', alpha: a, reveal: win(t, T(1, '定级', -0.2), 0.6) });
        // coverage disc
        const rA = win(t, T(1, '覆盖'), 1.2, ease.out3);
        const R = 220 * rA;
        if (rA > 0) {
          g.circle(cx, cy, R, { fill: 'rgba(120,200,255,0.08)', alpha: a });
          g.circle(cx, cy, R, { color: 'range', w: 2.5, alpha: a, glow: 12 });
          for (let i = 1; i < 4; i++) g.circle(cx, cy, R * (i / 4), { color: 'range', w: 1, alpha: a * 0.3, dash: [4, 6] });
          g.seg(cx, cy, cx + R, cy, { color: 'range', w: 1.5, alpha: a });
          g.text('覆盖范围', cx, cy - R - 60, { kind: 'serif', size: 36, weight: 700, color: 'range', align: 'center', alpha: a * rA });
          g.text('≈ 105 km²', cx, cy - R - 20, { kind: 'mono', size: 28, color: 'rangeLite', align: 'center', alpha: a * rA });
        }
        // target structure: blocks in the disc
        const sA = win(t, T(1, '打穿'), 0.8);
        if (sA > 0) {
          for (let i = 0; i < 19; i++) {
            const ang = i * 2.39996;
            const rr = Math.sqrt((i + 0.5) / 19) * 175;
            const x = cx + Math.cos(ang) * rr;
            const y = cy + Math.sin(ang) * rr * 0.92;
            const hit = win(t, T(1, '算出', -0.6) + i * 0.03, 0.5);
            g.icon('building', x, y, 42, { color: hit > 0.5 ? 'red' : 'ink', w: 1.4, p: win(t, T(1, '打穿') + i * 0.04, 0.5), alpha: a * (1 - 0.6 * hit) });
          }
          g.text('目标结构：钢混建成区', cx, cy + 268, { kind: 'sans', size: 30, weight: 500, color: 'ink', align: 'center', alpha: a * sA });
        }
        // energy
        const eA = win(t, T(1, '算出'), 0.9);
        if (eA > 0) {
          g.arrow([cx + 250, cy], [1110, cy], { color: 'ink3', w: 2, p: eA, head: 14, alpha: a });
          g.text('能量', 1420, cy - 84, { kind: 'serif', size: 36, weight: 700, color: 'energy', align: 'center', alpha: a * eA });
          g.sci([4.18, 15], 1420, cy + 8, { size: 80, weight: 600, color: 'energy', unit: 'J', align: 'center', alpha: a, reveal: eA, glow: 18 });
          g.text('≈ 一百万吨 TNT', 1420, cy + 70, { kind: 'sans', size: 28, color: 'ink2', align: 'center', alpha: a * eA });
        }
        // tier
        const tA = win(t, T(1, '落到'), 1.0, ease.inOut3);
        if (tA > 0) {
          const x = Xd(15.62);
          const y0 = cy + 90;
          const yy = lerp(y0, AX.y, ease.in2(tA));
          const xx = lerp(1420, x, ease.inOut2(tA));
          g.circle(xx, yy - 12, 9, { fill: 'energy', alpha: a });
          if (tA >= 1) {
            pin(g, x, AX.y, { p: win(t, T(1, '落到', 1.0), 0.6), h: 80, color: 'energy', alpha: a });
            g.circle(x, AX.y, 10 + 40 * win(t, T(1, '落到', 1.0), 0.8), { color: 'energy', w: 2, alpha: a * (1 - win(t, T(1, '落到', 1.0), 0.8)) });
            g.text('弱爆城', x, AX.y - 104, { kind: 'serif', size: 40, weight: 700, color: 'ink', align: 'center', alpha: a * win(t, T(1, '量级'), 0.5) });
          }
        }
      }
    }
    // ------------------------------------------------- 2: debunking, a pin struck off
    {
      const a = env(t, T(2, '证伪', -0.3), 0.7, T(3, '', -0.6), 0.6);
      if (a > 0) {
        g.text('证伪', 960, 190, { kind: 'serif', size: 56, weight: 700, color: 'red', align: 'center', alpha: a });
        const x = Xd(76);
        const fall = win(t, T(2, '取消'), 1.0, ease.in2);
        const h = 300;
        const y = AX.y + fall * 260;
        g.x.save();
        g.x.translate(x, y);
        g.x.rotate(fall * 0.9);
        g.x.translate(-x, -y);
        pin(g, x, y, { h, color: 'red', alpha: a * (1 - fall * 0.8), p: win(t, T(2, '证伪'), 0.6) });
        g.text('虚高定级', x, y - h - 26, { kind: 'serif', size: 30, weight: 700, color: 'red', align: 'center', alpha: a * (1 - fall) });
        g.x.restore();
        // dotted to where it should sit
        g.text('不达标', x, AX.y - 340, { kind: 'sans', size: 22, color: 'ink2', align: 'center', alpha: a * win(t, T(2, '不达标'), 0.5) * (1 - fall) });
        strike(g, x - 90, AX.y - h - 40, x + 90, AX.y - h + 10, win(t, T(2, '取消', -0.3), 0.4), { w: 9 });
      }
    }
    // ------------------------------------------------- 3: 无穷无尽
    {
      const a = env(t, T(3, '无穷'), 0.9, T(4, '比如'), 0.8);
      g.inkWord('无穷无尽', 960, 640, { size: 120, color: 'gold', p: win(t, T(3, '无穷', -0.1), 1.2), alpha: a, glow: 20 });
      const b = env(t, T(4, '比如', 0.3), 0.6, T(6, '本体系', 0.3), 0.6);
      g.text('“无穷无尽”', 960, 120, { kind: 'kai', size: 40, color: 'gold', align: 'center', alpha: b * 0.9 });
    }
    // ------------------------------------------------- 4–5: how existing systems take it
    {
      const a = env(t, T(4, '现有'), 0.7, T(6, '本体系', 0.2), 0.7);
      if (a > 0) {
        const names = [['汪吧', T(4, '汪吧')], ['VS Battles Wiki', T(4, 'VS')], ['全作品战力评鉴所', T(4, '全作品')]];
        names.forEach(([nm, tc], i) => {
          const x = 520 + i * 440;
          const k = win(t, tc - 0.3, 0.7);
          g.card(x - 190, 470, 380, 170, {
            p: k,
            alpha: a,
            fn: (g2, w, h) => {
              g2.text(nm, w / 2, 62, { kind: nm.length > 8 ? 'sans' : 'serif', size: nm.length > 8 ? 32 : 36, weight: 700, color: 'ink', align: 'center' });
              const f = win(t, T(4, '既定事实', -0.2) + i * 0.25, 0.6);
              g2.text('“无限” → 既定事实', w / 2, 122, { kind: 'sans', size: 24, color: 'ink2', align: 'center', alpha: f });
              if (f > 0) g2.line([[w - 64, 104], [w - 52, 118], [w - 30, 92]], { color: 'gold', w: 3, p: f });
            },
          });
        });
        // outcomes
        const o1 = win(t, T(5, '最高档', -0.3), 0.7);
        const o2 = win(t, T(5, '搁置', -0.3), 0.7);
        const o3 = win(t, T(5, '不再追问', -0.2), 0.6);
        g.arrow([700, 660], [700, 760], { color: 'gold', w: 2, p: o1, alpha: a });
        g.icon('crown', 700, 812, 54, { color: 'gold', p: o1, alpha: a, glow: 10 });
        g.text('直接给到最高档', 700, 880, { kind: 'serif', size: 28, weight: 700, color: 'gold', align: 'center', alpha: a * o1 });
        g.arrow([1220, 660], [1220, 760], { color: 'ink3', w: 2, p: o2, alpha: a });
        g.icon('archive', 1220, 812, 54, { color: 'ink2', p: o2, alpha: a });
        g.text('搁置不谈', 1220, 880, { kind: 'serif', size: 28, weight: 700, color: 'ink2', align: 'center', alpha: a * o2 });
        g.text('不再追问', 1220, 920, { kind: 'sans', size: 22, color: 'ink3', align: 'center', alpha: a * o3 });
        if (o3 > 0) g.seg(1160, 914, 1280, 914, { color: 'ink3', w: 1.5, p: o3, alpha: a });
      }
    }
    // ------------------------------------------------- 6–12: three steps header
    const stepsA = env(t, T(6, '分三步', -0.3), 0.8, T(12, '旧体系', -0.2), 0.8);
    const cur = t < T(8, '第二步', -0.3) ? 0 : t < T(10, '第三步', -0.3) ? 1 : 2;
    const STEPS = [['第一步', '打回虚词', '通则 0.2'], ['第二步', '四种分档', '3.10.3'], ['第三步', '回到能量轴', '重新定量']];
    if (stepsA > 0) {
      g.seg(560, 110, 1360, 110, { color: 'rule', w: 1.5, alpha: stepsA, p: win(t, T(6, '分三步', -0.2), 1.0) });
      STEPS.forEach(([a1, a2, a3], i) => {
        const x = 560 + i * 400;
        const k = win(t, T(6, '分三步', -0.1) + i * 0.25, 0.6);
        const on = t > T(7, '第一步', -0.3) && i === cur ? 1 : 0;
        const onK = on * win(t, i === 0 ? T(7, '第一步', -0.3) : i === 1 ? T(8, '第二步', -0.3) : T(10, '第三步', -0.3), 0.5);
        g.circle(x, 110, 11, { fill: onK > 0.5 ? 'energy' : 'ink3', alpha: stepsA * k });
        if (onK > 0) g.glow(x, 110, 60, 'energy', 0.4 * onK * stepsA);
        g.text(a1, x, 70, { kind: 'sans', size: 24, color: onK > 0.5 ? 'energy' : 'ink3', align: 'center', alpha: stepsA * k });
        g.text(a2, x, 162, { kind: 'serif', size: 34, weight: 700, color: onK > 0.5 ? 'ink' : 'ink3', align: 'center', alpha: stepsA * k });
        g.text(a3, x, 198, { kind: 'mono', size: 20, color: 'ink3', align: 'center', alpha: stepsA * k * (0.5 + 0.5 * onK) });
      });
      // 11: the third step is the core advantage
      const adv = env(t, T(11, '第三步', -0.2), 0.7, T(12, '旧体系', -0.4), 0.6);
      if (adv > 0) {
        g.rect(1360 - 150, 40, 300, 170, { r: 14, color: 'gold', w: 2.5, alpha: adv * stepsA });
        g.glow(1360, 125, 260, 'gold', 0.18 * adv);
        g.tag('核心优势', 1360, 245, 'energy', { align: 'center', size: 24, p: win(t, T(11, '核心优势'), 0.5) });
      }
    }
    // ------------------------------------------------- 7: step one
    {
      const a = env(t, T(7, '第一步', -0.2), 0.6, T(8, '第二步', -0.3), 0.6);
      if (a > 0) {
        g.seal('虚词', 1150, 265, { size: 120, p: win(t, T(7, '虚词', -0.25), 0.5), rot: 0.12, alpha: a });
        const bal = win(t, T(7, '举证责任', -0.4), 0.9);
        const tilt = settle(t, T(7, '主张', 0), 0.0, 4) + 0.2 * win(t, T(7, '主张', -0.2), 0.9, ease.out3);
        balance(g, 960, 560, { alpha: a * bal, tilt, left: '主张方', right: '质疑方', leftSub: '承担举证', rightSub: '无需反证', len: 250, chain: 100, post: 200, labelA: 1, leftColor: 'energy' });
        g.text('举证责任', 960, 500, { kind: 'serif', size: 30, weight: 700, color: 'ink', align: 'center', alpha: a * bal });
      }
    }
    // ------------------------------------------------- 8–9: four grades
    {
      const a = env(t, T(8, '第二步', -0.2), 0.7, T(10, '回到', -0.2), 0.7);
      if (a > 0) {
        SLOTS.forEach(([nm, sub], i) => {
          const tc = [T(8, '超大'), T(8, '不可计算'), T(8, '铺垫法'), T(8, '能量枯竭')][i];
          const hi = env(t, tc - 0.2, 0.4, i < 3 ? [T(8, '不可计算'), T(8, '铺垫法'), T(8, '能量枯竭')][i] - 0.3 : 1e9, 0.4);
          const isLast = i === 3;
          slot(g, slotX(i), SLOT_Y, 350, 140, nm, { alpha: a * win(t, T(8, '四种', -0.3) + i * 0.15, 0.5), hi, hiColor: isLast ? 'red' : 'energy', size: 36, sub });
        });
        g.seal('证伪', slotX(3) + 150, SLOT_Y - 130, { size: 110, p: win(t, T(9, '实锤', -0.1), 0.5), rot: -0.1, alpha: a });
        // energy gauge draining under the last slot
        const gA = env(t, T(9, '能量枯竭', -0.4), 0.5, T(10, '回到', -0.2), 0.5);
        if (gA > 0) {
          const lvl = 1 - win(t, T(9, '能量枯竭', -0.2), 2.4, ease.inOut2);
          const x = slotX(3) - 120;
          g.rect(x, 700, 240, 26, { r: 6, color: 'ink3', w: 1.5, alpha: gA });
          g.rect(x + 3, 703, 234 * lvl, 20, { r: 4, fill: lvl > 0.25 ? 'energy' : 'red', alpha: gA });
          g.text(lvl < 0.02 ? '枯竭' : '“还在生成”', slotX(3), 770, { kind: 'sans', size: 22, color: lvl < 0.02 ? 'red' : 'ink2', align: 'center', alpha: gA });
        }
      }
    }
    // ------------------------------------------------- 10: back onto the axis
    {
      const a = env(t, T(10, '回到', 1.0), 0.8, T(12, '旧体系', -0.2), 0.8);
      if (a > 0) {
        const xm = (segA + segB) / 2;
        const rK = win(t, T(10, '覆盖范围'), 0.8);
        g.line([[segA - 60, AX.y - 120], [segA - 60, AX.y - 140], [segB + 60, AX.y - 140], [segB + 60, AX.y - 120]], { color: 'range', w: 2, p: rK, alpha: a });
        g.text('实际覆盖范围', xm, AX.y - 160, { kind: 'sans', size: 28, weight: 500, color: 'range', align: 'center', alpha: a * rK });
        const sK = win(t, T(10, '目标结构'), 0.8);
        g.text('目标结构', xm, AX.y - 198, { kind: 'sans', size: 28, weight: 500, color: 'ink2', align: 'center', alpha: a * sK });
        const qK = win(t, T(10, '重新算出'), 1.4);
        if (qK > 0) {
          const roll = Math.round(lerp(78, 50, ease.out4(qK)));
          g.sci(['1', String(roll)], xm, AX.y - 252, { size: 52, color: 'energy', align: 'center', unit: 'J', alpha: a * smooth(qK * 2), glow: 14 });
          g.text('具体量级（示意）', xm, AX.y - 318, { kind: 'serif', size: 32, weight: 700, color: 'ink', align: 'center', alpha: a * win(t, T(10, '具体量级'), 0.6) });
        }
      }
    }
    // ------------------------------------------------- 12: old way vs this way
    {
      const a = env(t, T(12, '旧体系', -0.3), 0.7, T(13, '这个无限', -0.8), 0.7);
      if (a > 0) {
        const L = 520;
        const R = 1400;
        g.text('旧做法', L, 200, { kind: 'serif', size: 40, weight: 700, color: 'ink2', align: 'center', alpha: a });
        g.text('∞', L, 330, { kind: 'math', size: 110, color: 'ink2', align: 'center', alpha: a });
        const k1 = win(t, T(12, '照单全收'), 0.6);
        const k2 = win(t, T(12, '避而不谈'), 0.6);
        g.arrow([L - 30, 370], [L - 170, 520], { color: 'ink3', w: 2, p: k1, alpha: a });
        g.text('照单全收', L - 190, 570, { kind: 'serif', size: 32, weight: 700, color: 'ink2', align: 'center', alpha: a * k1 });
        g.arrow([L + 30, 370], [L + 170, 520], { color: 'ink3', w: 2, p: k2, alpha: a });
        g.text('避而不谈', L + 190, 570, { kind: 'serif', size: 32, weight: 700, color: 'ink2', align: 'center', alpha: a * k2 });
        if (k2 > 0.5) {
          g.seg(L - 260, 610, L - 120, 610, { color: 'ink3', w: 3, alpha: a });
          g.seg(L + 120, 610, L + 260, 610, { color: 'ink3', w: 3, alpha: a });
        }
        g.seg(960, 180, 960, 760, { color: 'rule', w: 1.2, alpha: a * 0.8 });
        g.text('本体系', R, 200, { kind: 'serif', size: 40, weight: 700, color: 'gold', align: 'center', alpha: a });
        g.text('∞', R, 330, { kind: 'math', size: 110, color: 'gold', align: 'center', alpha: a, glow: 16 });
        const k3 = win(t, T(12, '拉回'), 0.8);
        g.arrow([R, 380], [R, 560], { color: 'gold', w: 2.5, p: k3, alpha: a });
        g.line([[R - 240, 610], [R + 240, 610]], { color: 'energyLite', w: 2.5, p: k3, alpha: a, glow: 10 });
        g.text('拉回有限的能量轴', R, 670, { kind: 'serif', size: 32, weight: 700, color: 'ink', align: 'center', alpha: a * k3 });
        g.text('重新定量', R, 716, { kind: 'sans', size: 26, color: 'energy', align: 'center', alpha: a * win(t, T(12, '重新定量'), 0.6) });
      }
    }
    // ------------------------------------------------- 13: end point / starting point
    {
      const a = win(t, T(13, '终点', -0.3), 0.6) * (1 - win(t, c.end(13, 1.2), 1.5));
      if (a > 0) {
        g.text('结论的终点', 960, 700, { kind: 'serif', size: 40, weight: 700, color: 'ink2', align: 'center', alpha: a * (1 - win(t, T(13, '起点', -0.6), 0.8)) });
        strike(g, 840, 690, 1080, 680, win(t, T(13, '而是', -0.2), 0.4), { w: 8 });
        const s = win(t, T(13, '起点', 0.6), 0.8);
        g.glow(420 * 1, 560, 120, 'energy', 0.8 * s);
        g.circle(420, 560, 9, { fill: 'energyLite', alpha: s });
        g.text('重新计算的起点', 420, 650, { kind: 'serif', size: 40, weight: 700, color: 'gold', alpha: s, align: 'left', reveal: s, glow: 14 });
        g.arrow([1490, 560], [1560, 560], { color: 'energyLite', w: 2, head: 14, alpha: s });
      }
    }
  };
  return sc;
}
