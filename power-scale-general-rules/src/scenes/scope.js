// 二 · 适用范围与分批
// Engraved books on the desk: a booklet, a tall stack of volumes, a thick setting tome. Then
// density (judgement points per page), feeding the material in batches, cutting batches by
// judgement unit (a worked chapter ribbon), and keeping analysis and calculation in separate
// rounds so each round stays inside its working range.
import * as THREE from 'three';
import { makeScene } from './base.js';
import { makeBook, makeShadow, setMats } from '../gfx/paper3d.js';
import { lin } from '../gfx/materials.js';
import { clamp, lerp, smooth, ease, win, env, keys, rng } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { strike, slot } from './common.js';

const INK = lin('#1C1A1F');
const PAPERC = lin('#ECE5D6');

export function build() {
  const sc = makeScene('scope', 'paper', { fov: 34 });
  const { three, camera, c } = sc;
  const T = c;

  const booklet = makeBook(1.25, 0.05, 1.75, { cover: '#C9B48F', boardScale: 0.6 });
  booklet.position.set(-3.3, 0.025, 0.2);
  booklet.rotation.y = 0.18;
  const stack = new THREE.Group();
  const r = rng(12);
  let y = 0;
  for (let i = 0; i < 9; i++) {
    const t = 0.15 + r() * 0.1;
    const b = makeBook(1.2 + r() * 0.35, t, 1.6 + r() * 0.4, { cover: ['#B7A07C', '#A9967A', '#C4AF8B', '#9E8C70'][i % 4] });
    b.position.y = y + t / 2;
    b.rotation.y = (r() - 0.5) * 0.35;
    b.position.x = (r() - 0.5) * 0.12;
    y += t;
    stack.add(b);
  }
  stack.position.set(0, 0, 0);
  const tome = makeBook(1.65, 0.62, 2.2, { cover: '#8F7B5E', boardScale: 1.6 });
  tome.position.set(3.4, 0.31, 0.1);
  tome.rotation.y = -0.22;
  const props = [booklet, stack, tome];
  three.add(booklet, stack, tome);
  const shadows = [];
  for (const [x, z, w, d, a] of [[-3.3, 0.25, 2.2, 2.6, 0.28], [0, 0.05, 2.4, 2.8, 0.38], [3.4, 0.15, 2.8, 3.0, 0.36]]) {
    const s = makeShadow(w, d, { alpha: a });
    s.position.set(x, 0.002, z);
    three.add(s);
    shadows.push(s);
  }

  const cam = [
    [T(0, '', -3.4), [0.4, 4.4, 7.4, 0.2, 0.3, 0.2]],
    [T(0, '有多大'), [0, 4.6, 7.0, 0, 0.35, 0.2]],
    [T(1, '短篇', -0.2), [-2.0, 3.4, 5.4, -2.6, 0.2, 0.2]],
    [T(1, '一轮', 0.5), [-1.9, 3.4, 5.3, -2.5, 0.2, 0.2]],
    [T(2, '长篇', -0.3), [0.9, 5.2, 8.6, 0.9, 0.9, 0.2]],
    [T(2, '设定集', -0.3), [2.0, 4.9, 8.0, 2.0, 0.8, 0.2]],
    [T(3, '', 0.4), [2.0, 4.9, 7.8, 2.0, 0.8, 0.2]],
  ];

  sc.update = (t) => {
    const k = keys(t, cam, ease.inOut3);
    camera.position.set(k[0], k[1], k[2]);
    camera.lookAt(k[3], k[4], k[5]);
    camera.updateMatrixWorld();
    // focus: dim the props that are not being talked about
    const f = [
      env(t, T(1, '短篇', -0.3), 0.5, T(2, '下面'), 0.6),
      env(t, T(2, '长篇', -0.3), 0.5, T(2, '设定集', -0.2), 0.6),
      env(t, T(2, '设定集', -0.3), 0.5, 1e9, 0.6),
    ];
    const anyF = Math.max(...f);
    props.forEach((p, i) => {
      const dimK = anyF * (1 - f[i]) * 0.7;
      const ink = INK.clone().lerp(PAPERC, dimK);
      setMats(p, 'uInk', [ink.r, ink.g, ink.b]);
    });
    // books are wiped off the page once the talk turns to pages
    const wipe = win(t, T(3, '', -0.2), 1.4, ease.inOut2);
    for (const p of props) setMats(p, 'uReveal', lerp(1.2, -0.3, wipe));
    for (const s of shadows) s.material.uniforms.uA.value = 0.32 * (1 - wipe);
  };

  sc.draw = (g, t) => {
    // -------------------------------------------------------- 0–2 objects
    {
      const a = env(t, T(0, '', -0.5), 0.8, T(3, '', -0.3), 0.6);
      if (a > 0) {
        g.text('先看处理的对象有多大', 960, 140, { kind: 'serif', size: 46, weight: 700, color: 'ink', align: 'center', alpha: a * env(t, T(0, '先看'), 0.6, T(1, '短篇', -0.3), 0.5) });
        const lab = (obj, yOff, title, lines, k, col, verdict, vk, vcol) => {
          if (k <= 0) return;
          const p = sc.p3(obj.position.x, obj.position.y + yOff, obj.position.z);
          g.text(title, p[0], p[1] - 40, { kind: 'serif', size: 40, weight: 700, color: col, align: 'center', alpha: a * k, reveal: k });
          lines.forEach(([s, tc], i) => g.text(s, p[0], p[1] + 4 + i * 38, { kind: 'sans', size: 26, color: 'ink2', align: 'center', alpha: a * win(t, tc, 0.5) }));
          if (verdict) g.tag(verdict, p[0], p[1] + 30 + lines.length * 38, vcol, { align: 'center', size: 26, p: vk });
        };
        lab(booklet, 0.9, '短篇', [['单一的战斗场景', T(1, '单一')], ['篇幅有限的片段', T(1, '篇幅有限')]], win(t, T(1, '短篇', -0.2), 0.6), 'ink', '一轮完整处理', win(t, T(1, '一轮'), 0.6), 'ok');
        lab(stack, 2.35, '长篇连载 · 多卷系列', [['时间跨度大', T(2, '时间跨度')], ['战力阶段几次跃升', T(2, '跃升')]], win(t, T(2, '长篇', -0.2), 0.6), 'ink', '必须分批', win(t, T(2, '必须分批', -0.6), 0.6), 'rejected');
        lab(tome, 1.15, '纯设定集', [['世界观资料集', T(2, '世界观资料')]], win(t, T(2, '设定集', -0.2), 0.6), 'ink', null);
      }
    }
    // -------------------------------------------------------- 3 density
    {
      const a = env(t, T(3, '', 0.3), 0.8, T(4, '', -0.1), 0.6);
      if (a > 0) {
        g.text('同样一页纸，判定点的密度', 960, 120, { kind: 'serif', size: 44, weight: 700, color: 'ink', align: 'center', alpha: a });
        const page = (x, title, n, seed, tc) => {
          g.card(x - 230, 200, 460, 600, {
            p: win(t, tc, 0.7),
            alpha: a,
            fill: '#F7F2E7',
            fn: (g2, w, h) => {
              const rr = rng(seed);
              for (let i = 0; i < 17; i++) {
                const lw = (i % 5 === 4 ? 0.55 : 0.88) * (w - 80);
                g2.rect(40, 50 + i * 31, lw, 9, { r: 3, fill: 'rgba(28,26,31,0.13)' });
              }
              const k = win(t, tc + 0.6, 2.4);
              for (let i = 0; i < n; i++) {
                const px = 50 + rr() * (w - 100);
                const py = 54 + Math.floor(rr() * 17) * 31;
                const kk = clamp(k * n - i);
                if (kk > 0) {
                  g2.circle(px, py, 9 * ease.outBack(kk), { fill: 'red', alpha: 0.85 });
                }
              }
            },
          });
          g.text(title, x, 860, { kind: 'serif', size: 36, weight: 700, color: 'ink', align: 'center', alpha: a * win(t, tc, 0.6) });
        };
        page(640, '正文', 4, 3, T(3, '正文', -1.4));
        page(1280, '设定集', 34, 5, T(3, '设定集', -0.2));
        const k = win(t, T(3, '多得多'), 0.6);
        g.text('判定点', 960, 470, { kind: 'sans', size: 26, color: 'red', align: 'center', alpha: a * k });
        g.text('≪', 960, 530, { kind: 'math', size: 64, color: 'red', align: 'center', alpha: a * k });
      }
    }
    // -------------------------------------------------------- 4–6 batches
    {
      const a = env(t, T(4, '', -0.2), 0.7, T(7, '', -0.4), 0.6);
      if (a > 0) {
        // top: all at once, struck out
        const k0 = win(t, T(4, '原文'), 0.6);
        g.icon('books', 520, 320, 96, { p: k0, alpha: a, w: 1.6 });
        g.text('一次性全量投入', 520, 430, { kind: 'serif', size: 32, weight: 700, color: 'ink2', align: 'center', alpha: a * k0 });
        strike(g, 380, 420, 660, 410, win(t, T(4, '不一次性', 0.4), 0.5), { w: 9 });
        // conveyor: pages enter the judging box a few at a time
        const k1 = win(t, T(4, '分批提供', -0.4), 0.7);
        const y = 330;
        g.line([[760, y + 40], [1420, y + 40]], { color: 'ink3', w: 2, p: k1, alpha: a });
        g.rect(1430, y - 60, 220, 150, { r: 12, color: 'ink', w: 2.5, alpha: a * k1, fill: 'card' });
        g.text('判定', 1540, y + 26, { kind: 'serif', size: 38, weight: 700, color: 'ink', align: 'center', alpha: a * k1 });
        const flow = (t - T(4, '分批提供', -0.4)) * 0.38;
        for (let b = 0; b < 6; b++) {
          const ph = flow - b * 0.42;
          if (ph < 0 || ph > 1) continue;
          for (let j = 0; j < 3; j++) {
            const x = lerp(760, 1430, ph) - j * 36;
            if (x < 760) continue;
            g.rect(x - 28, y - 10 - j * 4, 30, 40, { r: 3, fill: 'card', color: 'ink2', w: 1.2, alpha: a * k1 * clamp((1 - ph) * 8) });
          }
        }
        g.text('一批 · 一个可独立判定的单元', 1090, y + 100, { kind: 'sans', size: 26, color: 'ink2', align: 'center', alpha: a * k1 });
        // 5: units and images
        const units = [['swords', '一场战斗', T(5, '一场战斗')], ['stairs-up', '一个境界阶段', T(5, '境界阶段')], ['list-details', '一组设定条目', T(5, '设定条目')]];
        units.forEach(([ic, nm, tc], i) => {
          const k = win(t, tc - 0.2, 0.6);
          const x = 560 + i * 400;
          g.card(x - 160, 540, 320, 200, {
            p: k,
            alpha: a,
            fn: (g2, w, h) => {
              g2.icon(ic, w / 2, 76, 70, { p: k, w: 1.6 });
              g2.text(nm, w / 2, 160, { kind: 'serif', size: 32, weight: 700, align: 'center' });
            },
          });
        });
        const imgs = [['photo', '截图', T(5, '截图')], ['map', '设定图', T(5, '设定图')], ['table', '数据表图片', T(5, '数据表')]];
        imgs.forEach(([ic, nm, tc], i) => {
          const k = win(t, tc - 0.1, 0.5);
          const x = 600 + i * 360;
          g.icon(ic, x - 50, 830, 46, { p: k, alpha: a, color: 'ink2' });
          g.text(nm, x - 18, 842, { kind: 'sans', size: 28, color: 'ink2', alpha: a * k });
        });
        g.text('同样按批次给', 960, 930, { kind: 'serif', size: 30, weight: 700, color: 'ink', align: 'center', alpha: a * win(t, T(5, '按批次'), 0.6) });
        // 6: unit, not length
        const k6 = env(t, T(6, '', -0.2), 0.6, T(7, '', -0.4), 0.5);
        if (k6 > 0) {
          g.rect(0, 0, W, H, { fill: 'rgba(236,229,214,0.9)', alpha: k6 });
          g.icon('ruler-measure', 640, 470, 120, { alpha: k6, color: 'ink3', p: k6 });
          g.text('篇幅', 640, 600, { kind: 'serif', size: 44, weight: 700, color: 'ink3', align: 'center', alpha: k6 });
          strike(g, 540, 590, 740, 580, win(t, T(6, '不是篇幅'), 0.4), { w: 9 });
          g.icon('target', 1280, 470, 120, { alpha: k6, color: 'ink', p: k6 });
          g.text('判定单元', 1280, 600, { kind: 'serif', size: 44, weight: 700, color: 'ink', align: 'center', alpha: k6 });
          g.seal('依此', 1420, 420, { size: 100, p: win(t, T(6, '判定单元'), 0.5), alpha: k6 });
        }
      }
    }
    // -------------------------------------------------------- 7 worked ribbon
    {
      const a = env(t, T(7, '', -0.3), 0.7, T(8, '', -0.3), 0.6);
      if (a > 0) {
        g.text('按判定单元划批，不按篇幅', 960, 130, { kind: 'serif', size: 44, weight: 700, color: 'ink', align: 'center', alpha: a });
        const x0 = 260;
        const cw = 280;
        const yb = 640;
        const chap = ['第一章', '第二章', '第三章', '第四章', '第五章'];
        const k0 = win(t, T(7, '', -0.2), 1.0);
        chap.forEach((nm, i) => {
          g.rect(x0 + i * cw + 4, yb, cw - 8, 54, { r: 6, fill: i === 1 ? 'rgba(176,106,23,0.08)' : 'card', color: 'rule', w: 1.2, alpha: a * k0 });
          g.text(nm, x0 + i * cw + cw / 2, yb + 37, { kind: 'sans', size: 24, color: 'ink2', align: 'center', alpha: a * k0 });
        });
        // energy level line
        const lvl = (x) => {
          const u = (x - x0) / cw; // chapter units
          if (u < 1.5) return 0;
          if (u < 2) return Math.min(3, Math.floor((u - 1.5) / (0.5 / 3)) + 1);
          return 3;
        };
        const pts = [];
        for (let x = x0; x <= x0 + cw * 5; x += 3) pts.push([x, yb - 80 - lvl(x) * 85]);
        g.line(pts, { color: 'energy', w: 3.5, p: win(t, T(7, '', 0), 1.6), alpha: a });
        g.text('量级', x0 - 20, yb - 80, { kind: 'sans', size: 22, color: 'energy', align: 'right', alpha: a * k0 });
        // three cuts in half a chapter
        const cut = win(t, T(7, '拆成三批', -0.6), 0.8);
        for (let j = 0; j < 3; j++) {
          const xa = x0 + cw * (1.5 + j / 6);
          const xb = xa + cw / 6;
          const yy = yb + 80;
          g.line([[xa + 4, yy], [xa + 4, yy + 14], [xb - 4, yy + 14], [xb - 4, yy]], { color: 'red', w: 2.5, p: clamp(cut * 3 - j), alpha: a });
          g.text(['①', '②', '③'][j], (xa + xb) / 2, yy + 52, { kind: 'sans', size: 28, color: 'red', align: 'center', alpha: a * clamp(cut * 3 - j) });
          g.seg(xa, yb - 330, xa, yb + 60, { color: 'red', w: 1.5, dash: [6, 6], alpha: a * clamp(cut * 3 - j) });
        }
        g.text('半章三次跃升 → 三批', x0 + cw * 1.75, yb + 140, { kind: 'serif', size: 30, weight: 700, color: 'red', align: 'center', alpha: a * cut });
        // three flat chapters merged
        const mg = win(t, T(7, '合成一批', -0.6), 0.9);
        g.line([[x0 + cw * 2 + 6, yb + 80], [x0 + cw * 2 + 6, yb + 94], [x0 + cw * 5 - 6, yb + 94], [x0 + cw * 5 - 6, yb + 80]], { color: 'ok', w: 2.5, p: mg, alpha: a });
        g.text('同一量级的日常 → 合成一批', x0 + cw * 3.5, yb + 140, { kind: 'serif', size: 30, weight: 700, color: 'ok', align: 'center', alpha: a * mg });
      }
    }
    // -------------------------------------------------------- 8–9 output in stages
    {
      const a = env(t, T(8, '', -0.3), 0.7, 1e9, 0.6);
      if (a > 0) {
        g.text('输出也分阶段', 960, 120, { kind: 'serif', size: 44, weight: 700, color: 'ink', align: 'center', alpha: a });
        const k0 = env(t, T(8, '', -0.1), 0.6, T(9, '', 0.4), 0.6);
        if (k0 > 0) {
          g.card(660, 210, 600, 140, { p: k0, alpha: k0, fn: (g2, w, h) => g2.text('一轮做完全部工作', w / 2, 86, { kind: 'serif', size: 38, weight: 700, color: 'ink2', align: 'center' }) });
          strike(g, 690, 290, 1230, 270, win(t, T(8, '不在一轮'), 0.5), { w: 10 });
          const k1 = win(t, T(8, '分析和计算'), 0.7);
          g.card(430, 470, 440, 220, { p: k1, alpha: k0, fn: (g2, w) => { g2.text('第一轮', w / 2, 70, { kind: 'sans', size: 26, color: 'ink3', align: 'center' }); g2.text('分析', w / 2, 150, { kind: 'serif', size: 56, weight: 900, color: 'ink', align: 'center' }); } });
          g.arrow([890, 580], [1030, 580], { color: 'ink', w: 2.5, p: win(t, T(8, '计算'), 0.6), alpha: k0 });
          g.card(1050, 470, 440, 220, { p: win(t, T(8, '计算'), 0.7), alpha: k0, fn: (g2, w) => { g2.text('第二轮', w / 2, 70, { kind: 'sans', size: 26, color: 'ink3', align: 'center' }); g2.text('计算', w / 2, 150, { kind: 'serif', size: 56, weight: 900, color: 'energy', align: 'center' }); } });
        }
        // 9: working range
        const k9 = win(t, T(9, '', 0.2), 0.8);
        if (k9 > 0) {
          const zx0 = 280;
          const zx1 = 1180;
          const top = 300;
          const rowH = 92;
          // zone
          g.rect(zx0, top - 40, zx1 - zx0, rowH * 4 + 30, { fill: 'rgba(45,91,71,0.07)', alpha: k9 });
          g.seg(zx1, top - 60, zx1, top + rowH * 4, { color: 'ok', w: 2, dash: [8, 6], alpha: k9 });
          g.text('有效工作区间', zx1 - 10, top - 70, { kind: 'sans', size: 24, weight: 500, color: 'ok', align: 'right', alpha: k9 });
          // case A: first round overruns, later rounds squeezed
          const ka = win(t, T(9, '太长'), 1.0);
          const kb = win(t, T(9, '变少'), 1.2);
          const rows = [
            [1.22, '第一轮：分析＋计算全塞进去'],
            [0.55, '第二批'],
            [0.4, '第三批'],
          ];
          rows.forEach(([len, nm], i) => {
            const k = i === 0 ? ka : kb;
            const L = (zx1 - zx0) * len * k * (i === 0 ? 1 : lerp(1.6, 1, kb));
            const over = L > zx1 - zx0;
            const y = top + i * rowH;
            g.rect(zx0, y, Math.min(L, zx1 - zx0), 46, { r: 6, fill: i === 0 ? 'energyLite' : 'rgba(28,26,31,0.22)', alpha: k9 * (i === 0 ? 1 : 1 - 0.45 * kb) });
            if (over) g.rect(zx1, y, L - (zx1 - zx0), 46, { r: 6, fill: 'red', alpha: k9 * 0.85 });
            g.text(nm, zx0 + 16, y + 32, { kind: 'sans', size: 24, weight: 500, color: 'ink', alpha: k9 * (i === 0 ? ka : kb) });
          });
          const kq = win(t, T(9, '判定质量'), 0.7);
          g.arrow([zx0 + 560, top + rowH * 1.4], [zx0 + 560, top + rowH * 2.9], { color: 'red', w: 3, p: kq, alpha: k9 });
          g.text('判定质量下降', zx0 + 590, top + rowH * 2.4, { kind: 'serif', size: 30, weight: 700, color: 'red', alpha: k9 * kq });
          // case B: staged rounds all fit
          const ks = win(t, T(9, '分阶段做'), 1.2);
          if (ks > 0) {
            const bx = 1480;
            g.text('分阶段', bx + 130, top - 70, { kind: 'serif', size: 34, weight: 700, color: 'ok', align: 'center', alpha: ks });
            for (let i = 0; i < 4; i++) {
              const y = top + i * rowH;
              const L = 260 * (0.62 + 0.08 * Math.sin(i * 2.1)) * clamp(ks * 4 - i);
              g.rect(bx, y, L, 46, { r: 6, fill: i % 2 ? 'energyLite' : 'rgba(28,26,31,0.3)', alpha: ks });
              g.text(i % 2 ? '计算' : '分析', bx + 14, y + 32, { kind: 'sans', size: 24, weight: 500, color: 'ink', alpha: ks * clamp(ks * 4 - i) });
            }
            g.seg(bx + 260, top - 40, bx + 260, top + rowH * 4, { color: 'ok', w: 2, dash: [8, 6], alpha: ks });
            g.text('每一轮都留在区间内', bx + 130, top + rowH * 4 + 50, { kind: 'serif', size: 28, weight: 700, color: 'ok', align: 'center', alpha: win(t, T(9, '有效的工作区间', -0.4), 0.6) });
          }
        }
      }
    }
  };
  return sc;
}
