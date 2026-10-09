// 0.2 · “无数”不等于 ℵ₀
// Night register. The natural numbers march to the horizon (that is ℵ₀). "无数宇宙 = ℵ₀" is
// forbidden. The same word spoken by three speakers carries three weights. 0.2.1: the writer's
// motive changes nothing; jargon falls through a sieve that asks what the text actually does.
import * as THREE from 'three';
import { makeScene } from './base.js';
import { clamp, lerp, smooth, ease, win, env, rng } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { strike, slot, balance, settle } from './common.js';

export function build() {
  const sc = makeScene('r02', 'cosmos', { fov: 40, backdrop: { stars: 0.9, nebula: 0.7, tint: '#3a2a60' } });
  const { camera } = sc;
  const T = sc.c;
  camera.position.set(0, 1.6, 6);
  camera.lookAt(0, 0.4, -20);

  sc.update = (t) => {
    camera.position.set(Math.sin(t * 0.07) * 0.3, 2.4, 6);
    camera.lookAt(0, -0.2, -26);
    camera.updateMatrixWorld();
  };

  sc.draw = (g, t) => {
    // ------------------------------------------------ 0–3 numbers to the horizon
    {
      const a = env(t, T(0, '', -0.6), 0.8, T(4, '', -0.3), 0.8);
      if (a > 0) {
        // title
        const kt = win(t, T(0, '无数', -0.2), 0.8);
        g.inkWord('无数', 650, 190, { size: 110, color: 'ink', p: kt, alpha: a, glow: 10 });
        g.text('≠', 960, 225, { kind: 'math', size: 110, color: 'red', align: 'center', alpha: a * win(t, T(0, '不等于'), 0.4), glow: 14 });
        g.text('ℵ₀', 1250, 230, { kind: 'math', size: 120, weight: 600, color: 'gold', align: 'center', alpha: a * win(t, T(0, '阿列夫零'), 0.6), glow: 22 });
        // 1, 2, 3 ... marching toward the vanishing point
        const km = win(t, T(1, '', -0.4), 1.2);
        if (km > 0) {
          const flow = (t - T(1, '')) * 1.6;
          for (let k = 0; k < 90; k++) {
            const n = k + 1;
            const z = 0.5 - k * 1.1 + (flow % 1.1);
            if (z > 1.2) continue;
            const p = sc.p3(0, 0, z);
            if (!p[3]) continue;
            const ppu = sc.pxPerUnit(new THREE.Vector3(0, 0, z));
            const size = ppu * 0.42;
            if (size < 4) continue;
            const num = n + Math.floor(flow / 1.1);
            const fade = clamp((1.2 - z) / 1.4) * clamp(size / 14) * (1 - win(t, T(2, '', -0.4), 0.8));
            g.text(String(num), p[0], p[1], { kind: 'math', size, weight: 600, color: 'gold', align: 'center', alpha: a * km * fade * 0.95, glow: 8 });
            // rail
            const q = sc.p3(0, -0.15, z);
            const q2 = sc.p3(0, -0.15, z - 1.1);
            g.seg(q[0] - ppu * 0.6, q[1], q[0] + ppu * 0.6, q[1], { color: 'energy', w: 1, alpha: a * km * fade * 0.4 });
            if (q2[3]) g.seg(q[0], q[1], q2[0], q2[1], { color: 'energy', w: 1, alpha: a * km * fade * 0.3 });
          }
          const vp = sc.p3(0, 0, -90);
          g.glow(vp[0], vp[1], 120, 'energy', 0.5 * km * a);
          g.text('自然数有多少个，', 260, 560, { kind: 'serif', size: 44, weight: 700, color: 'ink', alpha: a * km * env(t, T(1, '自然数', -0.2), 0.6, T(2, '', 0), 0.6) });
          g.text('ℵ₀ 就有多大', 260, 630, { kind: 'serif', size: 44, weight: 700, color: 'gold', alpha: a * km * env(t, T(1, '自然数', -0.2), 0.6, T(2, '', 0), 0.6) });
          g.text('可数无限', 1250, 320, { kind: 'sans', size: 30, color: 'ink2', align: 'center', alpha: a * win(t, T(1, '可数无限'), 0.6) });
        }
        // 2: "无数宇宙 = ℵ₀" forbidden
        const k2 = env(t, T(2, '', -0.2), 0.6, T(4, '', -0.3), 0.6);
        if (k2 > 0) {
          g.rect(0, 380, W, 520, { fill: 'rgba(4,6,12,0.72)', alpha: k2 * win(t, T(2, '无数宇宙', -0.4), 0.6) });
          g.inkWord('无数宇宙', 560, 560, { size: 92, color: 'gold', p: win(t, T(2, '无数宇宙', -0.2), 0.7), alpha: k2, glow: 10 });
          g.inkWord('无数星辰', 560, 720, { size: 92, color: 'gold', p: win(t, T(2, '无数星辰', -0.2), 0.7), alpha: k2, glow: 10 });
          const eq = win(t, T(2, '直接等同', -0.3), 0.5);
          g.text('=', 960, 670, { kind: 'math', size: 120, color: 'ink', align: 'center', alpha: k2 * eq });
          g.text('ℵ₀', 1300, 680, { kind: 'math', size: 130, weight: 600, color: 'gold', align: 'center', alpha: k2 * eq, glow: 18 });
          strike(g, 880, 700, 1040, 600, win(t, T(2, '禁止', -0.2), 0.4), { w: 16 });
          g.seal('禁止', 1560, 560, { size: 130, p: win(t, T(2, '禁止'), 0.5) });
          // 3: default rhetoric
          const k3 = win(t, T(3, '默认', -0.2), 0.6);
          g.text('没有明确递进和证据', 960, 840, { kind: 'sans', size: 30, color: 'ink2', align: 'center', alpha: k2 * win(t, T(3, '递进'), 0.5) });
          g.tag('默认：虚词 · 夸张', 960, 880, 'rejected', { align: 'center', size: 30, p: k3 });
        }
      }
    }
    // ------------------------------------------------ 4–8 who says it, where
    {
      const a = env(t, T(4, '', -0.3), 0.8, T(9, '', -0.3), 0.8);
      if (a > 0) {
        g.text('同一句话，谁说、在什么场合说', 960, 110, { kind: 'serif', size: 46, weight: 700, color: 'ink', align: 'center', alpha: a });
        const S = [
          ['eye', '旁白定调', '作者以全知视角交代世界规则', '最高', 3, '可支撑铺垫法', T(5, '旁白定调')],
          ['user', '角色平静陈述', '不带情绪地描述自己或世界', '中等', 2, '还要过 0.14 自述检验', T(6, '平静')],
          ['speakerphone', '鼓动 / 仪式性发言', '演讲 · 祭祀 · 战前动员', '最低', 1, '修辞工具 · 默认虚词', T(7, '演讲')],
        ];
        S.forEach(([ic, nm, sub, lvl, bars, note, tc], i) => {
          const x = 380 + i * 580;
          const k = win(t, (i === 0 ? T(4, '谁说') : tc) - 0.4, 0.7);
          const on = env(t, tc - 0.2, 0.5, i < 2 ? S[i + 1][6] - 0.3 : T(8, '', -0.2), 0.5);
          g.card(x - 250, 190, 500, 600, {
            p: k,
            alpha: a,
            border: on > 0.5 ? 'gold' : undefined,
            fn: (g2, w, h) => {
              g2.icon(ic, w / 2, 90, 80, { color: on > 0.5 ? 'gold' : 'ink', w: 1.5, glow: on * 10 });
              g2.text(nm, w / 2, 190, { kind: 'serif', size: 36, weight: 700, align: 'center', color: on > 0.5 ? 'gold' : 'ink' });
              g2.text(sub, w / 2, 232, { kind: 'sans', size: 22, color: 'ink2', align: 'center' });
              // the same word in a bubble
              g2.rect(70, 270, w - 140, 96, { r: 18, color: 'ink2', w: 1.5, fill: 'rgba(255,255,255,0.03)' });
              g2.text('“无限”', w / 2, 334, { kind: 'kai', size: 44, color: 'ink', align: 'center' });
              // evidence weight bars
              const kw = win(t, tc + 0.6, 0.8);
              for (let b = 0; b < 3; b++) {
                const filled = b < bars;
                g2.rect(w / 2 - 105 + b * 75, 420, 60, 34, { r: 4, fill: filled ? (bars === 3 ? 'gold' : bars === 2 ? 'energy' : 'red') : 'rgba(255,255,255,0.06)', alpha: filled ? kw : 1, color: 'rule', w: 1 });
              }
              g2.text(`证据力 ${lvl}`, w / 2, 500, { kind: 'serif', size: 30, weight: 700, color: bars === 3 ? 'gold' : bars === 2 ? 'energy' : 'red', align: 'center', alpha: kw });
              g2.text(note, w / 2, 550, { kind: 'sans', size: 22, color: 'ink2', align: 'center', alpha: kw });
            },
          });
        });
        // narrator's example
        const ex = env(t, T(5, '比如', -0.2), 0.6, T(6, '', -0.2), 0.6);
        g.text('“某物有限，某物才是真正的无限”', 960, 880, { kind: 'kai', size: 38, color: 'gold', align: 'center', alpha: a * ex });
        // ritual: even an important character
        const im = win(t, T(7, '重要角色'), 0.6);
        g.text('说话的是重要角色，也一样', 1540, 880, { kind: 'sans', size: 26, color: 'red', align: 'center', alpha: a * im * (1 - win(t, T(8, ''), 0.5)) });
        // 8: same words, different weight
        const k8 = win(t, T(8, '一字不差', -0.4), 0.7);
        if (k8 > 0) {
          for (let i = 0; i < 2; i++) g.text('=', 670 + i * 580, 530, { kind: 'math', size: 64, color: 'ink2', align: 'center', alpha: a * k8 });
          g.text('字面一样 · 可信度不能同等对待', 960, 900, { kind: 'serif', size: 40, weight: 700, color: 'ink', align: 'center', alpha: a * win(t, T(8, '可信度'), 0.6) });
        }
      }
    }
    // ------------------------------------------------ 9–17 0.2.1 motive
    {
      const a = win(t, T(9, '', -0.3), 0.8);
      if (a > 0) {
        g.text('0.2.1', 960, 100, { kind: 'math', size: 40, weight: 600, color: 'gold', align: 'center', alpha: a });
        g.text('写作动机不影响判定标准', 960, 160, { kind: 'serif', size: 46, weight: 700, color: 'ink', align: 'center', alpha: a });
        const sieveOn = win(t, T(13, '', -0.4), 1.0);
        const leave = win(t, T(17, '反过来', -0.3), 0.8);
        // two manuscripts
        const ms = (x, title, sub, jargon, tc, kind) => {
          const k = win(t, tc - 0.3, 0.7);
          const y = lerp(250, 230, sieveOn);
          g.card(x - 230, y, 460, 300, {
            p: k,
            alpha: a * (1 - leave),
            fn: (g2, w, h) => {
              g2.text(title, w / 2, 56, { kind: 'serif', size: 32, weight: 700, align: 'center' });
              g2.text(sub, w / 2, 92, { kind: 'sans', size: 22, color: 'ink2', align: 'center' });
              if (jargon) {
                const syms = ['ℵ₀', 'κ', 'ω', 'ε₀', 'Γ₀', 'ℵ₁', 'ω^ω', '2^ℵ₀'];
                const gone = win(t, T(14, '复读', -0.2), 0.2);
                syms.forEach((s, i) => g2.text(s, 50 + (i % 4) * 100, 160 + Math.floor(i / 4) * 70, { kind: 'math', size: 40, color: 'gold', alpha: 1 - gone }));
              } else {
                for (let i = 0; i < 5; i++) g2.rect(40, 130 + i * 30, w - 80 - (i % 2) * 60, 8, { r: 3, fill: 'rgba(238,232,218,0.14)' });
              }
            },
          });
        };
        ms(560, '为论战而写', '直接套用大基数等数学概念', true, T(10, '为了战力论战'), 'a');
        ms(1360, '普通叙事', '按情节展开的作品', false, T(10, '为了战力论战'), 'b');
        // 11: same standard both ways
        const k11 = env(t, T(11, '', -0.2), 0.6, T(13, '', -0.2), 0.6);
        if (k11 > 0) {
          g.arrow([560, 580], [560, 700], { color: 'ink2', w: 2, p: k11 });
          g.arrow([1360, 580], [1360, 700], { color: 'ink2', w: 2, p: k11 });
          g.text('不加码怀疑', 560, 760, { kind: 'sans', size: 28, color: 'ink', align: 'center', alpha: k11 * win(t, T(11, '加码'), 0.5) });
          g.text('不放宽标准', 1360, 760, { kind: 'sans', size: 28, color: 'ink', align: 'center', alpha: k11 * win(t, T(11, '放宽'), 0.5) });
          g.rect(560, 820, 800, 70, { r: 10, color: 'gold', w: 2, alpha: k11 });
          g.text('同一套标准', 960, 868, { kind: 'serif', size: 34, weight: 700, color: 'gold', align: 'center', alpha: k11 });
        }
        // 12: no sincerity score
        const k12 = env(t, T(12, '', -0.2), 0.6, T(13, '', -0.2), 0.6);
        if (k12 > 0) {
          g.rect(0, 0, W, H, { fill: 'rgba(4,6,12,0.82)', alpha: k12 });
          g.text('判定对象：文本实际展示了什么', 960, 420, { kind: 'serif', size: 44, weight: 700, color: 'ink', align: 'center', alpha: k12 });
          g.card(760, 520, 400, 120, { p: win(t, T(12, '诚意分', -0.6), 0.5), alpha: k12, fn: (g2, w) => { g2.text('诚意分：____', 40, 74, { kind: 'kai', size: 40 }); } });
          strike(g, 760, 600, 1160, 560, win(t, T(12, '没有'), 0.4), { w: 12 });
          g.text('动机无法验证', 960, 720, { kind: 'sans', size: 28, color: 'ink2', align: 'center', alpha: k12 * win(t, T(12, '动机'), 0.5) });
        }
        // 13–16: the sieve
        if (sieveOn > 0) {
          const sy = 680;
          const sk = sieveOn * (1 - leave);
          g.line([[260, sy], [1660, sy]], { color: 'ink', w: 3, alpha: sk });
          for (let x = 280; x < 1660; x += 40) g.seg(x, sy - 6, x, sy + 6, { color: 'ink', w: 2, alpha: sk * 0.7 });
          g.text('具体操作证据', 1680, sy + 10, { kind: 'serif', size: 30, weight: 700, color: 'ink', alpha: sk });
          // jargon falls through
          const fall = win(t, T(14, '复读', -0.2), 3.0, ease.in2);
          const syms = ['ℵ₀', 'κ', 'ω', 'ε₀', 'Γ₀', 'ℵ₁', 'ω^ω', '2^ℵ₀'];
          const rr = rng(5);
          syms.forEach((s, i) => {
            const x0 = 380 + (i % 4) * 100;
            const y0 = lerp(250, 230, sieveOn) + 160 + Math.floor(i / 4) * 70;
            if (fall <= 0) return;
            const y = y0 + fall * (700 + rr() * 200);
            if (y > 1120) return;
            g.text(s, x0, y, { kind: 'math', size: 40, color: 'gold', alpha: sk * (1 - fall * 0.5) });
          });
          const q1 = win(t, T(15, '战斗场景', -0.2), 0.5);
          const q2 = win(t, T(15, '角色互动', -0.2), 0.5);
          g.text('没有战斗场景 → 没有范围数据', 1180, 450, { kind: 'sans', size: 28, color: 'ink', align: 'center', alpha: sk * q1 });
          g.text('没有角色互动 → 没有比较对象', 1180, 500, { kind: 'sans', size: 28, color: 'ink', align: 'center', alpha: sk * q2 });
          const q3 = win(t, T(16, '这一问', -0.2), 0.7);
          g.text('文本对这个对象，实际做了什么操作？', 960, 880, { kind: 'serif', size: 44, weight: 900, color: 'gold', align: 'center', alpha: sk * q3, glow: 14, reveal: q3 });
          g.text('落空不是被针对，是先天证据不足', 960, 960, { kind: 'sans', size: 26, color: 'ink2', align: 'center', alpha: sk * env(t, T(14, '不是体系'), 0.6, T(15, ''), 0.6) });
        }
        // 17: a copied but consistent framework passes
        if (leave > 0) {
          g.card(560, 330, 800, 380, {
            p: leave,
            fn: (g2, w, h) => {
              g2.text('照搬来的框架', w / 2, 70, { kind: 'serif', size: 38, weight: 700, align: 'center' });
              const items = [['内部自洽', T(17, '内部自洽')], ['有具体机制支撑', T(17, '具体机制')], ['用得对 · 用得一致', T(17, '用得对')], ['扛得住检验', T(17, '扛得住')]];
              items.forEach(([s, tc], i) => {
                const k = win(t, tc - 0.1, 0.5);
                g2.line([[90, 132 + i * 56], [102, 144 + i * 56], [124, 118 + i * 56]], { color: 'ok', w: 3.5, p: k });
                g2.text(s, 150, 146 + i * 56, { kind: 'sans', size: 30, alpha: k });
              });
            },
          });
          g.seal('正常定级', 1360, 680, { size: 140, p: win(t, T(17, '正常定级', -0.2), 0.5), color: 'ok' });
        }
      }
    }
  };
  return sc;
}
