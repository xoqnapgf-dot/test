// Drawing helpers shared by several chapters.
import { clamp, lerp, smooth, ease, win, sup } from '../core/util.js';

// a flat 2D energy axis: decades d0..d1 mapped to x0..x1 at height y
export function axis2d(g, o) {
  const { x0, x1, y, d0 = 0, d1 = 80, alpha = 1, p = 1, every = 10, color = 'energyLite', label = true } = o;
  const X = (d) => lerp(x0, x1, (d - d0) / (d1 - d0));
  const xe = lerp(x0, x1, ease.inOut3(p));
  if (alpha <= 0 || p <= 0) return X;
  g.line([[x0, y], [xe, y]], { color: 'energy', w: 7, alpha: 0.12 * alpha, glow: 24 });
  g.line([[x0, y], [xe, y]], { color, w: 2, alpha: 0.95 * alpha, glow: 8 });
  if (p > 0.98) g.arrow([x1 - 4, y], [x1 + 22, y], { color, w: 2, head: 12, alpha });
  for (let d = Math.ceil(d0); d <= d1; d++) {
    const x = X(d);
    if (x > xe) break;
    const major = d % every === 0;
    g.seg(x, y, x, y - (major ? 14 : 7), { color, w: major ? 1.6 : 1, alpha: alpha * (major ? 0.9 : 0.45) });
    if (label && major) {
      g.text('10', x - 6, y + 30, { kind: 'mono', size: 17, color: 'ink3', align: 'center', alpha });
      g.text(String(d).replace('-', '−'), x + 7, y + 20, { kind: 'mono', size: 11, color: 'ink3', alpha });
    }
  }
  return X;
}

// a marker pin standing on the axis
export function pin(g, x, y, o = {}) {
  const k = o.p == null ? 1 : o.p;
  if (k <= 0) return;
  const h = (o.h || 60) * ease.out3(k);
  const col = o.color || 'energy';
  g.seg(x, y, x, y - h, { color: col, w: 2, alpha: o.alpha == null ? 1 : o.alpha, glow: 10 });
  g.circle(x, y - h, o.r || 7, { fill: col, alpha: (o.alpha == null ? 1 : o.alpha) * smooth(k * 2) });
  g.circle(x, y, 4, { fill: col, alpha: o.alpha == null ? 1 : o.alpha });
}

// rounded box with a centred caption, highlighted by `hi`
export function slot(g, cx, cy, w, h, text, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha;
  if (a <= 0) return;
  const hi = o.hi || 0;
  const col = o.color || 'ink';
  g.rect(cx - w / 2, cy - h / 2, w, h, { r: 12, fill: g.mode === 'paper' ? 'card' : 'rgba(14,18,28,0.85)', alpha: a });
  g.rect(cx - w / 2, cy - h / 2, w, h, { r: 12, color: hi > 0 ? (o.hiColor || 'energy') : 'rule', w: 1.5 + hi * 1.5, alpha: a });
  if (hi > 0 && g.mode === 'cosmos') g.glow(cx, cy, w * 0.7, o.hiColor || 'energy', 0.18 * hi * a);
  g.text(text, cx, cy + (o.size || 28) * 0.36 - (o.sub ? 12 : 0), { kind: o.kind || 'serif', size: o.size || 28, weight: 700, color: hi > 0.5 ? (o.hiColor || 'energy') : col, align: 'center', alpha: a });
  if (o.sub) g.text(o.sub, cx, cy + h / 2 - 16, { kind: 'sans', size: 20, color: 'ink3', align: 'center', alpha: a });
}

// strike-through a region
export function strike(g, x0, y0, x1, y1, p, o = {}) {
  if (p <= 0) return;
  g.brush([[x0, y0], [lerp(x0, x1, 0.5), lerp(y0, y1, 0.5) - 6], [x1, y1]], { w: o.w || 10, color: o.color || 'red', p, seed: o.seed || 5, alpha: o.alpha });
}

// a pan balance (2D). tilt > 0 means the left pan sinks.
export function balance(g, cx, cy, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha;
  if (a <= 0) return;
  const L = o.len || 260;
  const tilt = o.tilt || 0;
  const col = o.color || 'gold';
  const p = o.p == null ? 1 : o.p;
  g.line([[cx, cy + (o.post || 170)], [cx, cy]], { color: col, w: 3, alpha: a, p });
  g.line([[cx - 60, cy + (o.post || 170)], [cx + 60, cy + (o.post || 170)]], { color: col, w: 3, alpha: a, p });
  const dx = Math.cos(tilt) * L;
  const dy = Math.sin(tilt) * L;
  const A = [cx - dx, cy + dy];
  const B = [cx + dx, cy - dy];
  g.line([A, B], { color: col, w: 3.5, alpha: a, p, glow: 8 });
  g.circle(cx, cy, 7, { fill: col, alpha: a * p });
  const pan = (P, label, sub, hc) => {
    const ch = o.chain || 110;
    const py = P[1] + ch;
    g.line([P, [P[0] - 62, py]], { color: col, w: 1.4, alpha: a * 0.8, p });
    g.line([P, [P[0] + 62, py]], { color: col, w: 1.4, alpha: a * 0.8, p });
    g.x.save();
    g.x.globalAlpha = a * p;
    g.x.strokeStyle = g.col(col);
    g.x.lineWidth = 3;
    g.x.beginPath();
    g.x.ellipse(P[0], py, 78, 14, 0, 0, Math.PI);
    g.x.stroke();
    g.x.restore();
    if (label) g.text(label, P[0], py - 22, { kind: 'serif', size: o.size || 34, weight: 700, color: hc || 'ink', align: 'center', alpha: a * (o.labelA == null ? 1 : o.labelA) });
    if (sub) g.text(sub, P[0], py + 46, { kind: 'sans', size: 20, color: 'ink2', align: 'center', alpha: a * (o.labelA == null ? 1 : o.labelA) });
  };
  pan(A, o.left, o.leftSub, o.leftColor);
  pan(B, o.right, o.rightSub, o.rightColor);
}

// spring-settling angle that starts at amp and dies out after t0
export function settle(t, t0, amp, k = 5) {
  const x = t - t0;
  if (x < 0) return amp;
  return amp * Math.exp(-x * 1.6) * Math.cos(x * k);
}

export const RULES = [
  ['0.1', '定级基本原则'],
  ['0.2', '“无数”不等于 ℵ₀'],
  ['0.3', '适用范围'],
  ['0.4', '暗物质与暗能量'],
  ['0.5', '天体系统的核心'],
  ['0.6', '能量与范围分开'],
  ['0.7', '世界观强度换算'],
  ['0.8', '半球扩散为默认'],
  ['0.9', '空间能力与无范围摧毁'],
  ['0.10', '远距离打击交叉比对'],
  ['0.11', '掌控等价于毁灭'],
  ['0.12', '速度、防御与攻击'],
  ['0.13', '束缚能只是下限'],
  ['0.14', '认知规模≠实际规模'],
  ['0.15', '有限资源与无限战力'],
  ['0.16', '特殊能力的量化路径'],
];

// a small index card for one rule
export function ruleCard(g, x, y, w, h, i, o = {}) {
  const [n, name] = RULES[i];
  g.card(x, y, w, h, {
    p: o.p == null ? 1 : o.p,
    alpha: o.alpha,
    lift: o.lift,
    rot: o.rot,
    border: o.hi ? 'energy' : undefined,
    fn: (g2, ww, hh) => {
      g2.text(n, 22, hh * 0.42, { kind: 'math', size: hh * 0.28, weight: 600, color: o.hi ? 'energy' : 'gold' });
      g2.text(name, 22, hh * 0.8, { kind: 'serif', size: Math.min(hh * 0.22, (ww - 40) / Math.max(6, [...name].length)), weight: 700, color: 'ink' });
    },
  });
}

// soft 2D "camera": push in on (cx, cy) by zoom z, around the frame centre
export function view(g, cx, cy, z, fn) {
  const c = g.x;
  c.save();
  c.translate(960, 540);
  c.scale(z, z);
  c.translate(-cx, -cy);
  fn();
  c.restore();
}
