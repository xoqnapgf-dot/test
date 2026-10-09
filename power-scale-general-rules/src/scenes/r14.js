// 0.14 · 认知规模不等于实际规模  (+ 0.14.1 未遂战绩按说话人分级)
// Paper register. A punch nobody can price; "无穷无尽" in a thought bubble against a huge but
// finite count; result-type vs control-type self-reports; the whole world vs the part actually
// reached; the two gates (0.2, 0.14). Then the unfinished cut across a star, graded by speaker,
// written apart from realised feats, and the second criterion (data or mere exclamation) crossed
// with the first.
import { makeScene } from './base.js';
import { clamp, lerp, smooth, ease, win, env, rng } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { strike } from './common.js';

export function build() {
  const sc = makeScene('r14', 'paper', { fov: 30 });
  const T = sc.c;

  sc.draw = (g, t) => {
    // ---------------------------------------------- 0–2 a punch
    {
      const a = env(t, T(0, '', -0.5), 0.8, T(3, '', -0.3), 0.6);
      if (a > 0) {
        g.text('认知规模 ≠ 实际规模', 960, 120, { kind: 'serif', size: 52, weight: 700, color: 'ink', align: 'center', alpha: a });
        const k1 = win(t, T(1, '自述'), 0.7);
        g.card(140, 240, 760, 260, {
          p: k1,
          alpha: a,
          fn: (g2, w) => {
            g2.text('自述 · 自我认知', 40, 70, { kind: 'serif', size: 38, weight: 700 });
            g2.text('角色或作者对战绩规模的说法', 40, 126, { kind: 'sans', size: 28, color: 'ink2' });
            g2.tag('不构成可靠数据', 40, 192, 'rejected', { size: 28, p: win(t, T(1, '不构成'), 0.5) });
          },
        });
        g.card(1020, 240, 760, 260, {
          p: win(t, T(1, '实际可验证'), 0.7),
          alpha: a,
          fn: (g2, w) => {
            g2.text('实际可验证的表现', 40, 70, { kind: 'serif', size: 38, weight: 700, color: 'energy' });
            g2.text('客观展示出来的范围与结果', 40, 126, { kind: 'sans', size: 28, color: 'ink2' });
            g2.tag('分开处理', 40, 192, 'ok', { size: 28, p: win(t, T(1, '分开处理'), 0.5) });
          },
        });
        const k2 = win(t, T(2, '一拳', -0.6), 0.8);
        if (k2 > 0) {
          g.icon('karate', 760, 760, 220, { p: k2, w: 3.2 });
          g.text('这一拳是多少焦耳？', 1000, 720, { kind: 'kai', size: 50, alpha: k2 });
          g.text('出拳的人自己也不知道', 1000, 800, { kind: 'sans', size: 32, color: 'ink2', alpha: win(t, T(2, '没有人知道'), 0.5) });
        }
      }
    }
    // ---------------------------------------------- 3–4 infinite in the bubble, finite in fact
    {
      const a = env(t, T(3, '', -0.3), 0.7, T(5, '', -0.2), 0.6);
      if (a > 0) {
        // thought bubble
        g.x.save();
        g.x.globalAlpha = a;
        g.x.fillStyle = g.col('card');
        g.x.strokeStyle = g.col('ink');
        g.x.lineWidth = 2.5;
        g.x.beginPath();
        g.x.ellipse(560, 330, 380, 170, 0, 0, Math.PI * 2);
        g.x.fill();
        g.x.stroke();
        for (const [x, y, r] of [[380, 540, 30], [330, 600, 18], [300, 640, 10]]) {
          g.x.beginPath();
          g.x.arc(x, y, r, 0, Math.PI * 2);
          g.x.fill();
          g.x.stroke();
        }
        g.x.restore();
        g.text('“摧毁了无穷无尽的东西”', 560, 320, { kind: 'kai', size: 44, align: 'center', alpha: a });
        g.text('∞', 560, 420, { kind: 'math', size: 80, color: 'gold', align: 'center', alpha: a });
        g.text('角色自认为', 280, 700, { kind: 'sans', size: 30, color: 'ink2', alpha: a });
        // actual: a huge finite number
        const k4 = win(t, T(4, '巨大有限数', -0.3), 1.0);
        if (k4 > 0) {
          const digits = '9 482 006 513 774 208 391 650 427 118 902';
          g.text('实际可能是：', 1050, 300, { kind: 'sans', size: 30, color: 'ink2', alpha: a * k4 });
          g.text(digits.slice(0, Math.floor(digits.length * k4)) + ' …', 1050, 370, { kind: 'mono', size: 28, color: 'energy', alpha: a * k4 });
          g.text('一个连角色自己都估量不了的巨大有限数', 1050, 440, { kind: 'serif', size: 30, weight: 700, alpha: a * k4 });
          // threshold
          const kt = win(t, T(4, '门槛'), 0.7);
          const y = 640;
          g.seg(1050, y, 1780, y, { color: 'red', w: 2.5, dash: [10, 8], alpha: a * kt });
          g.text('不可计算的门槛', 1780, y - 16, { kind: 'sans', size: 24, color: 'red', align: 'right', alpha: a * kt });
          g.rect(1200, y + 20, 120, 220 * kt, { fill: 'energyLite', alpha: a * 0.9 });
          g.text('甚至够不上', 1350, y + 140, { kind: 'sans', size: 28, color: 'ink2', alpha: a * kt });
          g.text('只是相对角色自身的认知，显得像无限', 1050, 940, { kind: 'kai', size: 32, color: 'ink2', alpha: a * win(t, T(4, '显得像'), 0.6) });
        }
      }
    }
    // ---------------------------------------------- 5–7 two reliability tiers
    {
      const a = env(t, T(5, '', -0.2), 0.6, T(8, '', -0.2), 0.6);
      if (a > 0) {
        g.text('可靠性分两级', 960, 110, { kind: 'serif', size: 50, weight: 700, color: 'ink', align: 'center', alpha: a });
        const L = win(t, T(6, '', -0.2), 0.7);
        g.card(120, 200, 820, 700, {
          p: L,
          alpha: a,
          border: 'red',
          fn: (g2, w) => {
            g2.text('结果类', 40, 76, { kind: 'serif', size: 46, weight: 900, color: 'red' });
            g2.text('毁灭 · 移动速度', 40, 134, { kind: 'sans', size: 30, color: 'ink2' });
            g2.tag('自述规模不可靠 → 默认夸张、虚词（0.2）', 40, 210, 'rejected', { size: 26, p: win(t, T(6, '不可靠'), 0.5) });
            g2.text('采信需要独立证据：', 40, 300, { kind: 'serif', size: 32, weight: 700, alpha: win(t, T(6, '独立证据'), 0.5) });
            g2.text('· 客观展示的具体范围', 60, 356, { kind: 'sans', size: 30, alpha: win(t, T(6, '具体范围'), 0.5) });
            g2.text('· 跨层级的摧毁记录', 60, 406, { kind: 'sans', size: 30, alpha: win(t, T(6, '跨层级'), 0.5) });
            g2.text('不能只凭：', 40, 500, { kind: 'serif', size: 32, weight: 700, alpha: win(t, T(6, '不能只凭'), 0.5) });
            g2.text('角色自陈 · 战斗时的形容词', 60, 556, { kind: 'sans', size: 30, color: 'ink2', alpha: win(t, T(6, '形容词', -0.6), 0.5) });
            strike(g2, 56, 546, 420, 540, win(t, T(6, '形容词'), 0.4), { w: 7 });
          },
        });
        const R = win(t, T(7, '', -0.2), 0.7);
        g.card(980, 200, 820, 700, {
          p: R,
          alpha: a,
          border: 'ok',
          fn: (g2, w) => {
            g2.text('操控类', 40, 76, { kind: 'serif', size: 46, weight: 900, color: 'ok' });
            g2.tag('相对可靠一些', 40, 150, 'ok', { size: 26, p: win(t, T(7, '相对可靠'), 0.5) });
            // the boundary being sensed
            const bk = win(t, T(7, '边界', -0.6), 1.4);
            const pts = [];
            for (let i = 0; i <= 64; i++) {
              const an = (i / 64) * Math.PI * 2;
              const rr = 120 + 18 * Math.sin(an * 3) + 10 * Math.cos(an * 5);
              pts.push([w / 2 + Math.cos(an) * rr * 1.5, 360 + Math.sin(an) * rr]);
            }
            g2.line(pts, { color: 'ok', w: 3, p: bk });
            g2.icon('hand-finger', pts[Math.floor(64 * bk)][0], pts[Math.floor(64 * bk)][1] - 30, 54, { alpha: bk > 0 && bk < 1 ? 1 : 0 });
            g2.text('精细操控要求感知到对象的边界', w / 2, 540, { kind: 'sans', size: 28, align: 'center', alpha: win(t, T(7, '精细操控'), 0.5) });
            g2.tag('“操控无限”仍要过 0.2 的独立验证', w / 2, 610, 'doubt', { align: 'center', size: 26, p: win(t, T(7, '操控无限'), 0.5) });
          },
        });
      }
    }
    // ---------------------------------------------- 8–10 whole world vs part
    {
      const a = env(t, T(8, '', -0.2), 0.6, T(11, '', -0.3), 0.6);
      if (a > 0) {
        g.text('“感受到世界星辰无穷无尽”的那一刻', 960, 110, { kind: 'kai', size: 46, align: 'center', alpha: a });
        const cx = 700;
        const cy = 560;
        const R = 330;
        const kw = win(t, T(8, '整个世界'), 0.8);
        g.circle(cx, cy, R * ease.out3(kw), { color: 'ink', w: 2.5, alpha: a });
        const rr = rng(8);
        for (let i = 0; i < 120; i++) {
          const an = rr() * Math.PI * 2;
          const d = Math.sqrt(rr()) * R * 0.95;
          g.circle(cx + Math.cos(an) * d, cy + Math.sin(an) * d, 2 + rr() * 2.5, { fill: 'ink2', alpha: a * kw * 0.7 });
        }
        g.text('整个世界 / 所处位面', cx, cy - R - 24, { kind: 'serif', size: 30, weight: 700, align: 'center', alpha: a * kw });
        // perception rays (dashed) reach everything; actual reach is small
        const px = cx - 120;
        const py = cy + 80;
        const kp = win(t, T(8, '感受到'), 0.8);
        for (let i = 0; i < 16; i++) {
          const an = (i / 16) * Math.PI * 2;
          g.line([[px, py], [cx + Math.cos(an) * R * 0.98, cy + Math.sin(an) * R * 0.98]], { color: 'gold', w: 1.2, dash: [4, 7], p: kp, alpha: a * 0.8 });
        }
        const ka = win(t, T(8, '有限的一部分'), 0.8);
        g.circle(px, py, 110 * ease.out3(ka), { fill: 'rgba(176,106,23,0.18)', color: 'energy', w: 3, alpha: a });
        g.icon('user', px, py, 48, { alpha: a });
        g.text('实际能摧毁 / 掌控的部分', px, py + 150, { kind: 'sans', size: 26, weight: 500, color: 'energy', align: 'center', alpha: a * ka });
        const k9 = win(t, T(9, '前者'), 0.6);
        g.card(1160, 330, 620, 380, {
          p: k9,
          alpha: a,
          fn: (g2, w) => {
            g2.text('能摧毁 / 掌控整个范围', 30, 70, { kind: 'serif', size: 32, weight: 700 });
            g2.tag('计入战力规模', 30, 130, 'ok', { size: 26, p: win(t, T(9, '计入'), 0.4) });
            g2.text('只覆盖有限的一部分', 30, 230, { kind: 'serif', size: 32, weight: 700 });
            g2.tag('只反映认知广度 · 不折算量级', 30, 290, 'doubt', { size: 26, p: win(t, T(9, '认知的广度'), 0.4) });
          },
        });
        // 10: two gates
        const k10 = win(t, T(10, '', -0.2), 0.6);
        if (k10 > 0) {
          g.rect(0, 0, W, H, { fill: 'rgba(236,229,214,0.97)', alpha: k10 });
          const gate = (x, title, q, tc) => {
            const k = win(t, tc - 0.3, 0.6);
            g.rect(x - 230, 360, 460, 360, { r: 18, fill: 'card', color: 'ink', w: 2.5, alpha: k10 * k });
            g.text(title, x, 450, { kind: 'math', size: 64, weight: 600, color: 'gold', align: 'center', alpha: k10 * k });
            g.text(q[0], x, 560, { kind: 'serif', size: 32, weight: 700, align: 'center', alpha: k10 * k });
            g.text(q[1], x, 616, { kind: 'serif', size: 32, weight: 700, align: 'center', alpha: k10 * k });
          };
          gate(620, '0.2', ['“无数”这个词', '能不能当真'], T(10, '零点二'));
          g.arrow([870, 540], [1050, 540], { color: 'ink', w: 3, p: win(t, T(10, '这一条'), 0.5), alpha: k10 });
          gate(1300, '0.14', ['说话的人', '有没有匹配的能力'], T(10, '这一条'));
        }
      }
    }
    // ---------------------------------------------- 11–18 0.14.1
    {
      const a = env(t, T(11, '', -0.3), 0.7, T(19, '', -0.3), 0.6);
      if (a > 0) {
        g.text('0.14.1  未遂的战绩，按说话人分级', 960, 100, { kind: 'serif', size: 44, weight: 700, color: 'ink', align: 'center', alpha: a });
        // the star and the unfinished cut
        const sx = 400;
        const sy = 420;
        const kq = win(t, T(12, '', -0.2), 0.8);
        if (kq > 0) {
          g.circle(sx, sy, 160, { color: 'ink', w: 2.5, alpha: a * kq });
          for (let i = 0; i < 18; i++) {
            const an = (i / 18) * Math.PI * 2;
            g.seg(sx + Math.cos(an) * 175, sy + Math.sin(an) * 175, sx + Math.cos(an) * 205, sy + Math.sin(an) * 205, { color: 'ink', w: 2, alpha: a * kq });
          }
          for (let i = -6; i <= 6; i++) g.seg(sx - 150, sy + i * 22, sx + 150, sy + i * 22 + 30, { color: 'ink', w: 0.8, alpha: a * kq * 0.25 });
          const cut = win(t, T(12, '切开', -0.8), 1.2, ease.out3);
          g.brush([[sx - 260, sy - 160], [sx - 40, sy - 20]], { w: 12, color: 'red', p: cut, seed: 9 });
          g.rect(sx - 60, sy - 70, 16, 120, { fill: 'ink', alpha: a * win(t, T(12, '阻拦', -0.2), 0.4) });
          g.text('阻拦', sx - 52, sy + 90, { kind: 'sans', size: 24, align: 'center', alpha: a * win(t, T(12, '阻拦'), 0.4) });
          g.card(700, 220, 1080, 150, {
            p: kq,
            alpha: a,
            fn: (g2, w) => {
              g2.text('“若非某某阻拦，恐怕整颗星辰早已被切开。”', 40, 92, { kind: 'kai', size: 44 });
            },
          });
          g.text('没有实际发生、被外力阻止了的破坏', 1240, 430, { kind: 'sans', size: 28, color: 'ink2', align: 'center', alpha: a * win(t, T(12, '没有实际发生'), 0.6) });
        }
        // three speakers
        const rows = [
          ['旁白定调', '可采信为能力下限', 'ok', T(14, '旁白定调')],
          ['角色平静陈述', '记为意图或潜力，需过自述检验', 'doubt', T(15, '平静')],
          ['角色鼓动性发言', '按虚词处理，不采信', 'rejected', T(16, '鼓动')],
        ];
        const kr = env(t, T(13, '', -0.2), 0.6, T(17, '', -0.3), 0.6);
        if (kr > 0) {
          g.text('不一概排除，也不一概采信', 1240, 520, { kind: 'serif', size: 32, weight: 700, align: 'center', alpha: a * kr });
          rows.forEach(([who, verdict, kind, tc], i) => {
            const k = win(t, tc - 0.3, 0.6);
            const y = 620 + i * 120;
            g.card(720, y - 50, 1080, 100, {
              p: k,
              alpha: a * kr,
              fn: (g2, w) => {
                g2.text(who, 30, 64, { kind: 'serif', size: 34, weight: 700 });
                g2.tag(verdict, 340, 52, kind, { size: 26, p: win(t, tc + 0.3, 0.5) });
              },
            });
          });
          g.text('全知视角：等于作者替角色的能力背书', 1260, 1000, { kind: 'sans', size: 26, color: 'ink2', align: 'center', alpha: a * kr * win(t, T(14, '背书', -0.3), 0.5) });
        }
        // 17–18: written apart
        const k17 = win(t, T(17, '', -0.2), 0.7);
        if (k17 > 0) {
          g.card(700, 540, 1120, 200, {
            p: k17,
            border: 'gold',
            alpha: a,
            fn: (g2, w) => {
              g2.text('能力下限（旁白未遂）：XX', 40, 84, { kind: 'kai', size: 40, color: 'ok' });
              g2.seg(30, 112, w - 30, 112, { color: 'ink3', w: 1.5, dash: [8, 6] });
              g2.text('已实现战绩：XX', 40, 164, { kind: 'kai', size: 40, color: 'energy' });
            },
          });
          const k18a = win(t, T(18, '没打出来'), 0.5);
          const k18b = win(t, T(18, '代作者'), 0.5);
          g.text('对方：“没打出来就是没证实”', 760, 820, { kind: 'kai', size: 32, color: 'ink2', alpha: a * k18a });
          g.tag('成立', 1260, 810, 'ok', { size: 24, p: win(t, T(18, '质疑成立'), 0.4) });
          g.text('回应：旁白已代作者做出能力认定', 760, 890, { kind: 'kai', size: 32, color: 'ink', alpha: a * k18b });
          g.text('分开标注，比混为一谈更站得住', 1260, 980, { kind: 'serif', size: 34, weight: 900, color: 'gold', align: 'center', alpha: a * win(t, T(18, '分开标注'), 0.5) });
        }
      }
    }
    // ---------------------------------------------- 19–22 the second criterion, crossed
    {
      const a = win(t, T(19, '', -0.3), 0.8);
      if (a > 0) {
        g.text('第二条独立判据：有没有具体解释或数据', 960, 110, { kind: 'serif', size: 44, weight: 700, align: 'center', alpha: a });
        const x0 = 520;
        const y0 = 300;
        const cw = 560;
        const ch = 260;
        g.text('配有具体数据 / 解释', x0 + cw / 2, y0 - 24, { kind: 'serif', size: 30, weight: 700, color: 'ok', align: 'center', alpha: a });
        g.text('孤立感叹 · 只是渲染气氛', x0 + cw * 1.5, y0 - 24, { kind: 'serif', size: 30, weight: 700, color: 'red', align: 'center', alpha: a });
        g.text('旁白', x0 - 30, y0 + ch / 2 + 12, { kind: 'serif', size: 34, weight: 700, align: 'right', alpha: a });
        g.text('角色', x0 - 30, y0 + ch * 1.5 + 12, { kind: 'serif', size: 34, weight: 700, align: 'right', alpha: a });
        const cells = [
          [0, 0, '可采信', 'ok', T(20, '', -0.3), 0.9],
          [1, 1, '证据力弱', 'rejected', T(21, '', -0.3), 0.15],
          [0, 1, '可视同实际表现', 'ok', T(20, '就算出自角色', -0.3), 0.7],
          [1, 0, '证据力打折', 'doubt', T(21, '就算出自旁白', -0.3), 0.45],
        ];
        cells.forEach(([cx, cy, txt, kind, tc, lvl]) => {
          const k = win(t, tc, 0.6);
          const x = x0 + cx * cw;
          const y = y0 + cy * ch;
          g.rect(x + 6, y + 6, cw - 12, ch - 12, { r: 12, fill: 'card', color: 'rule', w: 1.5, alpha: a });
          g.rect(x + 40, y + ch - 70, (cw - 80) * lvl * k, 22, { r: 6, fill: kind === 'ok' ? 'ok' : kind === 'doubt' ? 'doubt' : 'red', alpha: a * 0.8 });
          g.tag(txt, x + cw / 2, y + ch / 2 - 20, kind, { align: 'center', size: 30, p: k });
        });
        const kc = win(t, T(22, '交叉考量', -0.3), 0.6);
        g.text('两条判据交叉考量，不能任选其一下结论', 960, 900 + 60, { kind: 'serif', size: 36, weight: 900, color: 'gold', align: 'center', alpha: a * kc });
      }
    }
  };
  return sc;
}
