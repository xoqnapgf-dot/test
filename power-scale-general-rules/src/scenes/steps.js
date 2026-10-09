// 三 · 执行顺序
// A three-station route stays on top. Step one: why the setting comes first (easiest, and the
// base everything else stands on; engraved plane layers float beside it) and its four outputs.
// Step two: one feat token runs the five-stage pipeline. Step three: a cross-check chart with
// monotonic growth, win/loss consistency, an outlier, and a whole curve shifted by a bad reference.
import * as THREE from 'three';
import { makeScene } from './base.js';
import { hatchMaterial, lin } from '../gfx/materials.js';
import { setMats } from '../gfx/paper3d.js';
import { clamp, lerp, smooth, ease, win, env, keys, rng } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { strike, slot } from './common.js';

export function build() {
  const sc = makeScene('steps', 'paper', { fov: 30, backdrop: { grid: 0.5 } });
  const { three, camera, c } = sc;
  const T = c;
  camera.position.set(0, 0, 14);
  camera.lookAt(0, 0, 0);

  // engraved plane layers A / B / C
  const slabs = new THREE.Group();
  const tints = ['#E6DCC7', '#D8CBB0', '#C8B795'];
  for (let i = 0; i < 3; i++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.09, 1.7), hatchMaterial({ tint: tints[i], freq: 14, axis: [1, 0, 0.3], light: [-0.3, 0.9, 0.4] }));
    m.position.y = (i - 1) * 0.85;
    slabs.add(m);
  }
  slabs.position.set(3.4, 0.0, 0);
  three.add(slabs);

  const CH = { x0: 300, x1: 1360, y0: 880, y1: 330 }; // chart frame

  sc.update = (t) => {
    slabs.rotation.set(0.42 + Math.sin(t * 0.3) * 0.04, -0.6 + t * 0.08, 0.05);
    const show = env(t, T(1, '第一步', 0.2), 1.0, T(6, '第二步', -0.4), 0.9);
    setMats(slabs, 'uReveal', lerp(-0.3, 1.2, show));
    const hi = env(t, T(5, '层级结构', -0.3), 0.5, T(5, '运作规则', -0.2), 0.5);
    const mv = ease.inOut3(win(t, T(5, '四样', -0.5), 1.0));
    slabs.position.set(lerp(3.4, 0, mv), lerp(0, 1.55, mv), 0);
    slabs.scale.setScalar(lerp(1, 0.62, mv) * (1 + 0.15 * hi));
  };

  sc.draw = (g, t) => {
    // ------------------------------------------------------------- route
    const cur = t < T(6, '第二步', -0.3) ? 0 : t < T(8, '第三步', -0.3) ? 1 : 2;
    const RA = win(t, T(0, '', -0.3), 1.2);
    const R = [['第一步', '世界观与设定'], ['第二步', '逐项分析与计算'], ['第三步', '交叉比对与验证']];
    const rx = (i) => 480 + i * 480;
    g.line([[rx(0), 100], [rx(2), 100]], { color: 'ink', w: 2, p: RA, rough: 1.5 });
    R.forEach(([a1, a2], i) => {
      const k = win(t, T(0, '三步') + i * 0.3, 0.5);
      const on = t > T(1, '第一步', -0.3) && cur === i;
      g.circle(rx(i), 100, on ? 13 : 9, { fill: on ? 'energy' : 'card', color: on ? 'energy' : 'ink', w: 2, alpha: k });
      g.text(a1, rx(i), 62, { kind: 'sans', size: 24, weight: 500, color: on ? 'energy' : 'ink3', align: 'center', alpha: k });
      g.text(a2, rx(i), 150, { kind: 'serif', size: 32, weight: 700, color: on ? 'ink' : 'ink3', align: 'center', alpha: k });
    });

    // ------------------------------------------------------------- step 1
    {
      const a = env(t, T(1, '第一步', -0.2), 0.7, T(6, '第二步', -0.4), 0.7);
      if (a > 0) {
        // plane labels next to the slabs
        const la = env(t, T(1, '设定', 0.3), 0.8, T(6, '第二步', -0.6), 0.6);
        const mv = ease.inOut3(win(t, T(5, '四样', -0.5), 1.0));
        ['位面 C', '位面 B', '位面 A'].forEach((nm, i) => {
          const p = sc.p3(lerp(3.4, 0, mv) + lerp(1.6, 1.0, mv), lerp(0, 1.55, mv) + (1 - i) * 0.85 * lerp(1, 0.62, mv), 0);
          g.text(nm, p[0] + 30, p[1] + 10, { kind: 'serif', size: 28, weight: 700, color: 'ink2', alpha: la });
        });
        // two reasons
        const k2 = win(t, T(2, '两个原因', -0.3), 0.7);
        const r1 = win(t, T(3, '最容易', -0.3), 0.7);
        const r2 = win(t, T(4, '基准', -0.3), 0.7);
        const outs = win(t, T(5, '四样', -0.3), 0.6);
        const shift = ease.inOut3(outs);
        g.card(140, 220 - shift * 30, 760, 230, {
          p: Math.max(k2 * 0.5, r1),
          alpha: a * (1 - shift),
          fn: (g2, w) => {
            g2.text('一', 50, 78, { kind: 'serif', size: 48, weight: 900, color: 'energy' });
            g2.text('最容易', 110, 76, { kind: 'serif', size: 40, weight: 700 });
            const items = [['设定通常是明写的', T(3, '明写')], ['不需要反推', T(3, '反推')], ['出错率最低', T(3, '出错率')]];
            items.forEach(([s, tc], i) => {
              const k = win(t, tc - 0.1, 0.5);
              g2.line([[60, 128 + i * 38], [70, 138 + i * 38], [88, 116 + i * 38]], { color: 'ok', w: 3, p: k });
              g2.text(s, 104, 140 + i * 38, { kind: 'sans', size: 26, color: 'ink2', alpha: k });
            });
          },
        });
        // foundation diagram
        g.card(140, 480 - shift * 30, 760, 380, {
          p: Math.max(k2 * 0.5, r2),
          alpha: a * (1 - shift),
          fn: (g2, w, h) => {
            g2.text('二', 50, 78, { kind: 'serif', size: 48, weight: 900, color: 'energy' });
            g2.text('后面一切的基准', 110, 76, { kind: 'serif', size: 40, weight: 700 });
            const miss = win(t, T(4, '基准没定', -0.1), 0.6);
            const fall = win(t, T(4, '返工', -0.6), 1.0, ease.in2);
            const bx = 380;
            const by = 330;
            // base
            if (miss < 1) g2.rect(bx - 300, by - 50, 600, 46, { r: 4, fill: 'rgba(176,106,23,0.18)', color: 'energy', w: 2, alpha: (1 - miss) * win(t, T(4, '基准'), 0.6) });
            g2.rect(bx - 300, by - 50, 600, 46, { r: 4, color: 'ink3', w: 1.6, dash: [8, 6], alpha: miss });
            g2.text(miss > 0.5 ? '基准未定' : '第一步：世界观基准', bx, by - 18, { kind: 'sans', size: 24, weight: 700, color: miss > 0.5 ? 'ink3' : 'energy', align: 'center', alpha: win(t, T(4, '基准'), 0.6) });
            const blocks = [['世界观强度换算', '0.7', T(4, '世界观强度'), -150], ['基准位面选取', '3.11.5', T(4, '位面以'), 150]];
            blocks.forEach(([nm, ref, tc, dx], i) => {
              const k = win(t, tc - 0.1, 0.5);
              g2.x.save();
              const px = bx + dx;
              const py = by - 78;
              g2.x.translate(px + (i ? 1 : -1) * 140 * fall, py + 260 * fall * fall);
              g2.x.rotate((i ? 1 : -1) * 0.5 * fall);
              g2.rect(-140, -28, 280, 56, { r: 4, fill: 'card', color: 'ink', w: 1.6, alpha: k });
              g2.text(nm, 0, 8, { kind: 'sans', size: 24, weight: 500, align: 'center', alpha: k });
              g2.x.restore();
              g2.text(ref, px, py - 40, { kind: 'mono', size: 18, color: 'ink3', align: 'center', alpha: k * (1 - fall) });
            });
            const kc = win(t, T(4, '先算战力', -0.2), 0.5);
            g2.rect(bx - 150, by - 168 + 200 * fall * fall, 300, 50, { r: 4, fill: 'rgba(28,26,31,0.08)', color: 'ink', w: 1.4, alpha: kc });
            g2.text('战力计算', bx, by - 135 + 200 * fall * fall, { kind: 'sans', size: 24, weight: 700, align: 'center', alpha: kc });
          },
        });
        g.seal('返工', 820, 760, { size: 120, p: win(t, T(4, '返工'), 0.5), alpha: a * (1 - shift) });
        // four outputs
        if (outs > 0) {
          const OUT = [
            ['材质强度倍率', '相对现实 ×N', T(5, '倍率')],
            ['位面层级结构', 'A → B → C', T(5, '层级结构')],
            ['能量体系运作规则', '怎么修、怎么用', T(5, '运作规则')],
            ['已明确的量化设定', '原文写死的数字', T(5, '量化设定')],
          ];
          g.text('这一步的产出', 960, 610, { kind: 'serif', size: 36, weight: 700, color: 'ink', align: 'center', alpha: a * outs });
          OUT.forEach(([nm, sub, tc], i) => {
            const k = win(t, tc - 0.3, 0.6);
            const x = 260 + i * 467;
            g.card(x - 200, 640, 400, 200, {
              p: k,
              alpha: a,
              fn: (g2, w) => {
                g2.text(String(i + 1), 36, 64, { kind: 'math', size: 40, weight: 600, color: 'energy' });
                g2.text(nm, w / 2 + 14, 90, { kind: 'serif', size: 32, weight: 700, align: 'center' });
                g2.text(sub, w / 2 + 14, 146, { kind: i === 1 ? 'math' : 'sans', size: 26, color: 'ink2', align: 'center' });
              },
            });
          });
        }
      }
    }

    // ------------------------------------------------------------- step 2
    {
      const a = env(t, T(6, '第二步', -0.2), 0.7, T(8, '第三步', -0.4), 0.7);
      if (a > 0) {
        g.text('逐项分析与计算', 960, 280, { kind: 'serif', size: 46, weight: 700, color: 'ink', align: 'center', alpha: a });
        g.text('按批次，一项战绩独立走完一条流程', 960, 336, { kind: 'sans', size: 28, color: 'ink2', align: 'center', alpha: a * win(t, T(7, '按批次'), 0.6) });
        const NODES = [
          ['search', '找参照物', '被破坏物 · 现实材质', T(7, '找参照物')],
          ['route', '覆盖范围与路径', '通则 0.10', T(7, '覆盖范围')],
          ['cube', '选模型', '扩散 / 定向 / 总和', T(7, '选模型')],
          ['math-function', '算能量', '焦耳', T(7, '算能量')],
          ['stairs-up', '落量级', '对应档位', T(7, '落量级')],
        ];
        const nx = (i) => 300 + i * 330;
        const y = 600;
        g.line([[nx(0), y], [nx(4), y]], { color: 'ink3', w: 2, p: win(t, T(7, '流程', -0.6), 1.0), dash: [10, 8] });
        let tokenX = nx(0) - 140;
        NODES.forEach(([ic, nm, sub, tc], i) => {
          const k = win(t, T(7, '流程', -0.4) + i * 0.15, 0.5);
          const on = win(t, tc - 0.15, 0.4);
          if (on > 0) tokenX = lerp(tokenX, nx(i), ease.inOut3(win(t, tc - 0.35, 0.5)));
          g.circle(nx(i), y, 62, { fill: 'card', color: on > 0.5 ? 'energy' : 'ink', w: on > 0.5 ? 3 : 1.6, alpha: a * k });
          g.icon(ic, nx(i), y, 56, { color: on > 0.5 ? 'energy' : 'ink', w: 1.6, alpha: a * k });
          g.text(nm, nx(i), y + 116, { kind: 'serif', size: 32, weight: 700, color: on > 0.5 ? 'ink' : 'ink3', align: 'center', alpha: a * k });
          g.text(sub, nx(i), y + 156, { kind: 'sans', size: 22, color: 'ink3', align: 'center', alpha: a * on });
        });
        // the feat token rides along
        const tk = win(t, T(7, '找参照物', -0.6), 0.5);
        g.card(tokenX - 90, y - 190, 180, 70, { p: tk, alpha: a, fill: '#FBF6EC', border: 'energy', fn: (g2, w) => g2.text('某项战绩', w / 2, 46, { kind: 'kai', size: 30, color: 'energy', align: 'center' }) });
        g.seg(tokenX, y - 120, tokenX, y - 64, { color: 'energy', w: 2, alpha: a * tk });
      }
    }

    // ------------------------------------------------------------- step 3
    {
      const a = env(t, T(8, '第三步', -0.2), 0.7, 1e9, 0.7);
      if (a > 0) {
        const { x0, x1, y0, y1 } = CH;
        const fk = win(t, T(9, '', -0.2), 1.0);
        g.line([[x0, y1 - 20], [x0, y0], [x1 + 20, y0]], { color: 'ink', w: 2, p: fk });
        g.text('战绩能量（对数）', x0 - 16, y1 - 40, { kind: 'sans', size: 22, color: 'ink2', alpha: fk });
        g.text('故事进程', x1 + 10, y0 + 40, { kind: 'sans', size: 22, color: 'ink2', align: 'right', alpha: fk });
        const sx = (i) => lerp(x0 + 90, x1 - 60, i / 4);
        const sy = (v) => lerp(y0 - 30, y1 + 20, v);
        for (let i = 0; i < 5; i++) g.text(`阶段 ${i + 1}`, sx(i), y0 + 36, { kind: 'sans', size: 20, color: 'ink3', align: 'center', alpha: fk });
        // growth corridor from the setting
        const corr = win(t, T(10, '成长节奏', -0.4), 0.9);
        const shiftK = win(t, T(14, '整体偏移', -0.2), 1.4, ease.inOut3);
        const A = [0.12, 0.3, 0.46, 0.62, 0.76];
        const Aout = 3; // the outlier index
        if (corr > 0) {
          const up = [];
          const lo = [];
          for (let i = 0; i <= 40; i++) {
            const u = i / 40;
            const v = 0.1 + u * 0.66;
            up.push([lerp(sx(0), sx(4), u), sy(v + 0.08)]);
            lo.push([lerp(sx(0), sx(4), u), sy(v - 0.08)]);
          }
          g.x.save();
          g.x.globalAlpha = 0.14 * corr;
          g.x.fillStyle = g.col('ok');
          g.x.beginPath();
          up.forEach(([x, y], i) => (i ? g.x.lineTo(x, y) : g.x.moveTo(x, y)));
          lo.reverse().forEach(([x, y]) => g.x.lineTo(x, y));
          g.x.fill();
          g.x.restore();
          g.text('设定的成长节奏', sx(0) + 10, sy(0.32), { kind: 'sans', size: 22, color: 'ok', alpha: corr });
        }
        // character A
        const kA = win(t, T(10, '同一个角色', -0.3), 1.6);
        const outK = win(t, T(12, '明显偏离', -0.4), 0.8);
        const Av = A.map((v, i) => (i === Aout ? lerp(v, 0.96, outK) : v) + shiftK * 0.0);
        const ptsA = Av.map((v, i) => [sx(i), sy(v)]);
        if (kA > 0) {
          g.line(ptsA, { color: 'energy', w: 3, p: kA });
          ptsA.forEach(([x, y], i) => g.circle(x, y, 10, { fill: 'energy', alpha: clamp(kA * 5 - i) }));
          g.text('角色甲', ptsA[4][0] + 22, ptsA[4][1] + 8, { kind: 'serif', size: 28, weight: 700, color: 'energy', alpha: kA });
          const mono = win(t, T(10, '单调上升'), 0.5);
          g.tag('单调上升', 380, 280, 'ok', { p: mono, size: 24 });
        }
        // systematic shift: whole curve displaced; only comparison reveals it
        if (shiftK > 0) {
          const ptsS = A.map((v, i) => [sx(i), sy(v + 0.17 * shiftK)]);
          g.line(ptsS, { color: 'red', w: 2.5, dash: [8, 6], alpha: shiftK });
          ptsS.forEach(([x, y]) => g.circle(x, y, 8, { color: 'red', w: 2, alpha: shiftK }));
          g.text('参照物选错：整条线一起偏移', sx(1), sy(0.88), { kind: 'serif', size: 30, weight: 700, color: 'red', alpha: shiftK });
        }
        // character B and win/loss
        const kB = win(t, T(11, '不同角色', -0.3), 1.2);
        const B = [0.08, 0.2, 0.36, 0.44, 0.58];
        const ptsB = B.map((v, i) => [sx(i), sy(v)]);
        if (kB > 0) {
          g.line(ptsB, { color: 'range', w: 3, p: kB });
          ptsB.forEach(([x, y], i) => g.circle(x, y, 9, { fill: 'range', alpha: clamp(kB * 5 - i) }));
          g.text('角色乙', ptsB[4][0] + 22, ptsB[4][1] + 8, { kind: 'serif', size: 28, weight: 700, color: 'range', alpha: kB });
          const wl = win(t, T(11, '胜负关系', -0.3), 0.7);
          const xa = sx(2);
          g.arrow([xa, sy(A[2]) + 14], [xa, sy(B[2]) - 16], { color: 'ink', w: 2.5, p: wl, head: 12 });
          g.text('原作：甲胜乙', xa + 20, (sy(A[2]) + sy(B[2])) / 2 + 8, { kind: 'kai', size: 28, color: 'ink', alpha: wl });
          g.tag('一致', xa + 20, (sy(A[2]) + sy(B[2])) / 2 + 50, 'ok', { p: win(t, T(11, '一致'), 0.4), size: 22 });
        }
        // outlier
        if (outK > 0) {
          const [ox, oy] = [sx(Aout), sy(lerp(A[Aout], 0.96, outK))];
          g.circle(ox, oy, 28, { color: 'red', w: 3, p: outK });
          g.text('偏离', ox + 36, oy + 8, { kind: 'serif', size: 30, weight: 700, color: 'red', alpha: outK });
          const k13 = win(t, T(13, '取值有误', -0.3), 0.5);
          const k13b = win(t, T(13, '特殊机制', -0.3), 0.5);
          g.card(1460, 330, 380, 230, {
            p: Math.max(k13, 0.001) * (k13 > 0 ? 1 : 0),
            alpha: 1 - shiftK,
            fn: (g2, w) => {
              g2.text('偏离意味着', 30, 56, { kind: 'sans', size: 24, color: 'ink3' });
              g2.text('① 某一步取值有误', 30, 116, { kind: 'serif', size: 30, weight: 700, alpha: k13 });
              g2.text('② 战绩本身有特殊机制', 30, 172, { kind: 'serif', size: 30, weight: 700, alpha: k13b });
            },
          });
        }
        const k14 = win(t, T(14, '这一步不能省', -0.2), 0.6);
        g.seal('不可省略', 1650, 700, { size: 150, p: k14, rot: -0.08 });
        g.text('放在一起比，才能发现系统性偏差', 1650, 850, { kind: 'serif', size: 28, weight: 700, color: 'ink', align: 'center', alpha: win(t, T(14, '放在一起比'), 0.7) });
      }
    }
  };
  return sc;
}
