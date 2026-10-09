// 0.1 · 定级基本原则
// The sixteen rules laid out as an index; 0.1 lifts out. Highest upper limit; weak / strong
// versions inside a tier; the reference triangle; real world vs story world (same mortal blow,
// different crack -> ×N); vague counts by median; no invented numbers; and the rules resting on
// four pillars of method.
import { makeScene } from './base.js';
import { clamp, lerp, smooth, ease, win, env, rng } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { strike, ruleCard, RULES, view, slot } from './common.js';

export function build() {
  const sc = makeScene('r01', 'paper', { fov: 30 });
  const T = sc.c;

  const gridPos = (i) => [150 + (i % 4) * 420, 200 + Math.floor(i / 4) * 190];

  sc.draw = (g, t) => {
    // ---------------------------------------------------- 0–1 the index
    {
      const a = env(t, T(0, '', -0.6), 0.6, T(2, '', -0.2), 0.7);
      if (a > 0) {
        g.text('第零部分 · 判定通则', 960, 120, { kind: 'serif', size: 46, weight: 700, color: 'ink', align: 'center', alpha: a });
        RULES.forEach((_, i) => {
          const [x, y] = gridPos(i);
          const k = win(t, T(0, '十六条', -1.0) + i * 0.07, 0.6);
          const focus = win(t, T(1, '第一条', -0.3), 0.8);
          const al = i === 0 ? 1 : 1 - 0.75 * focus;
          ruleCard(g, x, y, 380, 160, i, { p: k, alpha: a * al, hi: i === 0 && focus > 0.5, lift: 40 });
        });
      }
    }
    // ---------------------------------------------------- 2–4 upper limit, weak / strong
    {
      const a = env(t, T(2, '', -0.3), 0.7, T(5, '', -0.3), 0.7);
      if (a > 0) {
        g.text('取角色的最高上限', 960, 130, { kind: 'serif', size: 50, weight: 700, color: 'ink', align: 'center', alpha: a * win(t, T(2, '最高上限', -0.4), 0.6) });
        // feats of one character on a line
        const y = 330;
        const x0 = 240;
        const x1 = 1680;
        g.line([[x0, y], [x1, y]], { color: 'ink', w: 2, p: win(t, T(2, '', -0.2), 0.8) });
        const feats = [0.12, 0.28, 0.35, 0.52, 0.47, 0.81];
        feats.forEach((f, i) => {
          const k = win(t, T(2, '所有') + i * 0.12, 0.4);
          const top = i === 5;
          const x = lerp(x0, x1, f);
          g.circle(x, y, top ? 14 : 9, { fill: top ? 'energy' : 'ink3', alpha: a * k });
          if (top) {
            const kk = win(t, T(2, '最高上限'), 0.6);
            g.icon('crown', x, y - 52, 46, { color: 'energy', p: kk, alpha: a });
            g.text('定级取这一项', x, y + 50, { kind: 'sans', size: 24, weight: 500, color: 'energy', align: 'center', alpha: a * kk });
          }
        });
        g.text('一个角色的全部战绩', x0, y - 30, { kind: 'sans', size: 22, color: 'ink3', alpha: a * win(t, T(2, ''), 0.6) });
        // tier band: 星系级 with sub-tiers, next 星系团级
        const by = 640;
        const bx0 = 260;
        const bx1 = 1660;
        const kb = win(t, T(3, '', -0.3), 0.8);
        const subs = ['弱星系', '标准星系', '强星系', '超星系'];
        const bw = (bx1 - bx0 - 300) / 4;
        subs.forEach((s, i) => {
          const hiW = i === 0 ? env(t, T(3, '弱化版本', -0.3), 0.4, T(4, '', 0), 0.4) : i === 2 ? win(t, T(4, '强化版本', -0.3), 0.4) : 0;
          g.rect(bx0 + i * bw + 3, by, bw - 6, 64, { r: 6, fill: hiW > 0 ? (i === 0 ? 'rgba(30,91,138,0.14)' : 'rgba(176,106,23,0.16)') : 'card', color: hiW > 0 ? (i === 0 ? 'range' : 'energy') : 'rule', w: 1.4 + hiW * 1.5, alpha: a * kb });
          g.text(s, bx0 + i * bw + bw / 2, by + 42, { kind: 'serif', size: 28, weight: 700, color: 'ink', align: 'center', alpha: a * kb });
        });
        g.rect(bx1 - 290, by, 290, 64, { r: 6, fill: 'rgba(28,26,31,0.06)', color: 'ink3', w: 1.4, dash: [8, 6], alpha: a * kb });
        g.text('星系团级（下一个量级）', bx1 - 145, by + 42, { kind: 'sans', size: 24, color: 'ink3', align: 'center', alpha: a * kb });
        // case weak: erosion over time
        const kw = env(t, T(3, '时间', -0.3), 0.6, T(4, '', -0.2), 0.6);
        if (kw > 0) {
          const cx = bx0 + bw / 2;
          const cy = 500;
          const sweep = win(t, T(3, '慢慢磨灭', -0.2), 3.0, ease.inOut2);
          g.circle(cx, cy, 60, { color: 'ink', w: 2, alpha: kw });
          g.x.save();
          g.x.globalAlpha = kw * 0.85;
          g.x.fillStyle = g.col('range');
          g.x.beginPath();
          g.x.moveTo(cx, cy);
          g.x.arc(cx, cy, 58, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * sweep);
          g.x.fill();
          g.x.restore();
          g.icon('hourglass', cx + 110, cy, 54, { alpha: kw, color: 'ink2' });
          g.text('逐步磨灭、慢慢达到', cx + 160, cy + 10, { kind: 'sans', size: 26, color: 'ink2', alpha: kw });
          g.arrow([cx, cy + 70], [cx, by - 6], { color: 'range', w: 2.5, p: win(t, T(3, '弱化版本', -0.4), 0.5), alpha: kw });
          g.text('→ 弱化版本', bx0 + 20, by + 120, { kind: 'serif', size: 32, weight: 700, color: 'range', alpha: win(t, T(3, '弱化版本', -0.2), 0.5) * a * kw });
        }
        // case strong: surplus energy but short of the next tier
        const ks = win(t, T(4, '', -0.2), 0.6);
        if (ks > 0) {
          const fill = win(t, T(4, '余力', -0.6), 1.6, ease.out3);
          const target = bx0 + bw * 2.62;
          const yb = by - 60;
          g.rect(bx0, yb, (target - bx0) * fill, 22, { r: 4, fill: 'energy', alpha: a * ks });
          g.seg(bx0 + bw, yb - 16, bx0 + bw, yb + 38, { color: 'ink', w: 2, alpha: a * ks });
          g.text('一击毁灭星系', bx0 + bw - 10, yb - 24, { kind: 'sans', size: 22, color: 'ink', align: 'right', alpha: a * ks });
          g.text('还有余力', bx0 + bw + 20, yb - 24, { kind: 'sans', size: 22, color: 'energy', alpha: a * win(t, T(4, '余力'), 0.5) });
          const nk = win(t, T(4, '够不到'), 0.6);
          g.seg(bx1 - 290, yb - 30, bx1 - 290, yb + 50, { color: 'red', w: 2.5, dash: [6, 5], alpha: a * nk });
          g.text('够不到', bx1 - 300, yb - 38, { kind: 'sans', size: 22, color: 'red', align: 'right', alpha: a * nk });
          g.text('→ 强化版本', bx0 + bw * 2 + 20, by + 120, { kind: 'serif', size: 32, weight: 700, color: 'energy', alpha: a * win(t, T(4, '强化版本', -0.2), 0.5) });
        }
      }
    }
    // ---------------------------------------------------- 5–6 reference triangle
    {
      const a = env(t, T(5, '', -0.3), 0.7, T(7, '', -0.3), 0.7);
      if (a > 0) {
        g.text('先找参照物', 960, 130, { kind: 'serif', size: 50, weight: 700, color: 'ink', align: 'center', alpha: a });
        const P = [
          [960, 330, 'wall', '被破坏的东西', T(5, '被破坏')],
          [560, 760, 'user', '角色本身', T(5, '角色本身')],
          [1360, 760, 'atom', '现实世界的材质与规律', T(5, '现实世界')],
        ];
        const lk = win(t, T(5, '换算'), 1.0);
        for (let i = 0; i < 3; i++) {
          const A = P[i];
          const B = P[(i + 1) % 3];
          const dx = B[0] - A[0];
          const dy = B[1] - A[1];
          const L = Math.hypot(dx, dy);
          const ux = dx / L;
          const uy = dy / L;
          g.arrow([A[0] + ux * 110, A[1] + uy * 110], [B[0] - ux * 110, B[1] - uy * 110], { color: 'ink3', w: 2, p: clamp(lk * 3 - i), head: 12 });
          g.arrow([B[0] - ux * 110, B[1] - uy * 110], [A[0] + ux * 110, A[1] + uy * 110], { color: 'ink3', w: 2, p: clamp(lk * 3 - i), head: 12 });
        }
        g.text('换算 · 联系', 960, 620, { kind: 'kai', size: 40, color: 'ink2', align: 'center', alpha: a * lk });
        const def = win(t, T(6, '默认', -0.2), 0.6);
        P.forEach(([x, y, ic, nm, tc], i) => {
          const k = win(t, tc - 0.3, 0.6);
          const hl = i === 2 ? def : 0;
          g.circle(x, y, 92, { fill: hl > 0.5 ? 'rgba(176,106,23,0.12)' : 'card', color: hl > 0.5 ? 'energy' : 'ink', w: 2 + hl, alpha: a * k });
          g.icon(ic, x, y - 6, 70, { color: hl > 0.5 ? 'energy' : 'ink', w: 1.6, alpha: a * k, p: k });
          g.text(nm, x, y + 140, { kind: 'serif', size: 32, weight: 700, color: 'ink', align: 'center', alpha: a * k });
        });
        g.tag('没有线索：默认 ×1', 1360, 960, 'energy', { align: 'center', size: 26, p: def });
      }
    }
    // ---------------------------------------------------- 7–8 world strength by mortals
    {
      const a = env(t, T(7, '', -0.3), 0.7, T(9, '', -0.3), 0.7);
      if (a > 0) {
        g.text('世界观明确不同：看最低位面的凡人', 960, 130, { kind: 'serif', size: 46, weight: 700, color: 'ink', align: 'center', alpha: a });
        const panel = (cx, title, crack, tc) => {
          const k = win(t, tc, 0.7);
          g.card(cx - 380, 210, 760, 560, {
            p: k,
            alpha: a,
            fn: (g2, w, h) => {
              g2.text(title, w / 2, 64, { kind: 'serif', size: 36, weight: 700, align: 'center' });
              // stone block with engraving hatch
              const bx = w / 2 - 170;
              const by = 300;
              g2.rect(bx, by, 340, 170, { fill: '#E3D9C4', color: 'ink', w: 2 });
              for (let i = -6; i < 30; i++) g2.seg(bx + i * 16, by + 170, bx + i * 16 + 60, by, { color: 'ink', w: 0.8, alpha: 0.28 });
              // mortal with hammer
              g2.icon('user', bx - 70, by + 40, 90, { w: 1.6 });
              g2.icon('hammer', bx + 10, by - 50, 70, { w: 1.6 });
              // crack depth
              const hit = win(t, T(7, '互动', -0.4), 0.8, ease.out3);
              const depth = crack * hit;
              const pts = [[w / 2, by]];
              const rr = rng(crack * 100);
              for (let i = 1; i <= 8; i++) pts.push([w / 2 + (rr() - 0.5) * 30, by + (170 * depth * i) / 8]);
              g2.line(pts, { color: 'ink', w: 3 });
              g2.text(depth > 0.5 ? '凿开一大块' : '只留下白痕', w / 2, by + 230, { kind: 'sans', size: 26, color: 'ink2', align: 'center', alpha: hit });
              g2.text('凡人 · 同样的一锤', w / 2, by - 120, { kind: 'sans', size: 24, color: 'ink3', align: 'center' });
            },
          });
        };
        panel(520, '现实世界', 0.85, T(7, '', 0));
        panel(1400, '作品世界', 0.12, T(7, '最低位面', -0.3));
        const k = win(t, T(8, '强多少倍'), 0.7);
        g.text('材质强度 ≈ 现实 × N', 960, 880, { kind: 'serif', size: 52, weight: 900, color: 'energy', align: 'center', alpha: a * k, reveal: k });
        g.text('也可能更弱：× 1/N', 960, 940, { kind: 'sans', size: 28, color: 'ink2', align: 'center', alpha: a * win(t, T(8, '弱多少倍'), 0.6) });
      }
    }
    // ---------------------------------------------------- 9–10 vague counts, no invention
    {
      const a = env(t, T(9, '', -0.3), 0.7, T(11, '', -0.3), 0.7);
      if (a > 0) {
        const nl = (y, word, lo, hi, tc) => {
          const k = win(t, tc, 0.8);
          g.text(`“${word}”`, 280, y + 10, { kind: 'kai', size: 50, color: 'ink', align: 'right', alpha: a * k });
          const x0 = 340;
          const x1 = 1500;
          g.line([[x0, y], [x1, y]], { color: 'ink3', w: 2, p: k });
          for (let i = 1; i <= 9; i++) {
            const x = lerp(x0, x1, (i - 0.5) / 9);
            g.seg(x, y - 10, x, y + 10, { color: 'ink3', w: 1.5, alpha: a * k });
            g.text(String(i * lo), x, y + 44, { kind: 'mono', size: 22, color: 'ink3', align: 'center', alpha: a * k });
          }
          const m = win(t, T(9, '中位数', -0.2), 0.7);
          const xm = lerp(x0, x1, 4.5 / 9);
          g.circle(xm, y, 16, { fill: 'energy', alpha: a * m });
          g.text(`≈ ${5 * lo}`, xm, y - 32, { kind: 'mono', size: 32, weight: 600, color: 'energy', align: 'center', alpha: a * m });
        };
        nl(300, '几十', 10, 90, T(9, '几十', -0.4));
        nl(520, '几百', 100, 900, T(9, '几百', -0.4));
        g.text('中位数 · 语言常识 · 上下文', 960, 690, { kind: 'serif', size: 36, weight: 700, color: 'ink', align: 'center', alpha: a * win(t, T(9, '语言常识'), 0.6) });
        // invented numbers
        const ki = win(t, T(10, '不要臆造', -0.3), 0.6);
        if (ki > 0) {
          g.rect(0, 0, W, H, { fill: 'rgba(236,229,214,0.985)', alpha: ki });
          g.text('“大约 3.7×10⁵⁰ 焦耳”', 960, 330, { kind: 'kai', size: 64, color: 'ink2', align: 'center', alpha: ki });
          strike(g, 620, 320, 1300, 300, win(t, T(10, '臆造', 0.2), 0.5), { w: 14 });
          g.seal('臆造', 1360, 250, { size: 120, p: win(t, T(10, '具体数字', -0.3), 0.5) });
          g.text('文本没有给的数字，不替作者假设', 960, 450, { kind: 'serif', size: 34, weight: 700, color: 'red', align: 'center', alpha: ki * win(t, T(10, '假设不存在'), 0.6) });
          const kw = win(t, T(10, '前后联系', -0.3), 0.8);
          const nodes = [[600, 700, '战力表现'], [1320, 700, '设定'], [960, 880, '前后文']];
          nodes.forEach(([x, y, s], i) => {
            g.card(x - 140, y - 50, 280, 100, { p: clamp(kw * 3 - i), fn: (g2, w) => g2.text(s, w / 2, 64, { kind: 'serif', size: 34, weight: 700, align: 'center' }) });
          });
          const lk = win(t, T(10, '互相对照', -0.3), 0.8);
          g.line([[740, 700], [1180, 700]], { color: 'energy', w: 2.5, p: lk });
          g.line([[640, 750], [880, 860]], { color: 'energy', w: 2.5, p: lk });
          g.line([[1280, 750], [1040, 860]], { color: 'energy', w: 2.5, p: lk });
          g.text('互相对照印证 · 立体分析', 960, 640, { kind: 'sans', size: 28, color: 'energy', align: 'center', alpha: win(t, T(10, '立体'), 0.6) });
        }
      }
    }
    // ---------------------------------------------------- 11–14 rules rest on method
    {
      const a = win(t, T(11, '', -0.3), 0.8);
      if (a > 0) {
        g.text('细则是方法论的具体化，不是穷举清单', 960, 110, { kind: 'serif', size: 44, weight: 700, color: 'ink', align: 'center', alpha: a });
        // roof: the sixteen rules as small cards
        const kr = win(t, T(11, '具体化', -0.4), 1.0);
        RULES.forEach((_, i) => {
          const x = 250 + (i % 8) * 180;
          const y = 190 + Math.floor(i / 8) * 104;
          g.card(x, y, 166, 90, {
            p: clamp(kr * 16 - i * 0.6),
            fn: (g2, w, h) => {
              g2.text(RULES[i][0], 14, 38, { kind: 'math', size: 26, weight: 600, color: 'gold' });
              g2.text(RULES[i][1].slice(0, 6), 14, 72, { kind: 'sans', size: 18, color: 'ink2' });
            },
          });
        });
        // beam
        const kb = win(t, T(13, '方法论本身', -0.6), 0.8);
        g.rect(230, 420, 1460, 26, { r: 4, fill: 'ink', alpha: kb * 0.9 });
        // four pillars
        const PIL = [['找参照物', T(13, '找参照物')], ['交叉验证', T(13, '交叉验证')], ['按证据分级', T(13, '按证据分级')], ['区分自述与实际表现', T(13, '区分自述')]];
        PIL.forEach(([nm, tc], i) => {
          const k = win(t, tc - 0.3, 0.6);
          const x = 380 + i * 386;
          const top = 446;
          const hh = 360 * ease.out3(k);
          g.rect(x - 60, top, 120, hh, { fill: '#E3D8C1', color: 'ink', w: 2, alpha: kb });
          for (let j = 0; j < 7; j++) g.seg(x - 40 + j * 14, top, x - 40 + j * 14, top + hh, { color: 'ink', w: 0.8, alpha: 0.25 * kb });
          g.rect(x - 80, top + hh, 160, 22, { fill: 'ink', alpha: kb * k });
          g.text(nm, x, 880, { kind: 'serif', size: nm.length > 5 ? 26 : 32, weight: 700, color: 'ink', align: 'center', alpha: k });
        });
        // an odd case that fits no card
        const ko = env(t, T(12, '没覆盖', -0.6), 0.6, T(14, '', -0.2), 0.6);
        if (ko > 0) {
          const drop = win(t, T(13, '遇到', 0), 1.6, ease.inOut3);
          const x = lerp(1790, 1790, drop);
          const y = lerp(260, 700, drop);
          g.x.save();
          g.x.globalAlpha = ko;
          g.x.translate(x, y);
          g.x.rotate(0.2 - drop * 0.2);
          g.x.fillStyle = g.col('card');
          g.x.strokeStyle = g.col('red');
          g.x.lineWidth = 2.5;
          g.x.beginPath();
          g.x.moveTo(-60, -40);
          g.x.lineTo(30, -55);
          g.x.lineTo(65, 10);
          g.x.lineTo(10, 30);
          g.x.lineTo(20, 60);
          g.x.lineTo(-55, 40);
          g.x.closePath();
          g.x.fill();
          g.x.stroke();
          g.x.restore();
          g.text('特殊作品', x, y - 80, { kind: 'kai', size: 30, color: 'red', align: 'center', alpha: ko });
          g.text('条文对不上 → 回到方法论去类推', 1500, 980, { kind: 'sans', size: 26, color: 'red', align: 'center', alpha: ko * win(t, T(13, '类推'), 0.5) });
          
          g.text('机械照抄字面条文', 1410, 1030, { kind: 'sans', size: 22, color: 'ink3', align: 'center', alpha: ko * win(t, T(13, '机械照抄', -0.2), 0.4) });
          strike(g, 1300, 1022, 1520, 1018, win(t, T(13, '机械照抄', 0.3), 0.4), { w: 6 });
        }
        // 14: rules grow out of the method
        const kp = win(t, T(14, '产物', -0.3), 0.9);
        if (kp > 0) {
          for (let i = 0; i < 4; i++) {
            const x = 380 + i * 386;
            g.arrow([x, 430], [x + (i - 1.5) * 30, 300], { color: 'energy', w: 3, p: kp, head: 14, alpha: kp });
          }
          g.text('条文是方法论的产物，不是方法论本身', 960, 1000, { kind: 'serif', size: 40, weight: 900, color: 'energy', align: 'center', alpha: kp, reveal: kp });
        }
      }
    }
  };
  return sc;
}
