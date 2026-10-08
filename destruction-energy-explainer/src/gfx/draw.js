// 2D diagram vocabulary: progressive lines, arrows, brackets, log axes, bars, leaders, cards.
// Every primitive takes a progress p (0..1) so it can be drawn on rather than popped in.
import { clamp, ease, lerp } from '../core/util.js';
import { F, font, tracking } from '../core/type.js';
import { C, rgba } from '../core/style.js';

export function polyline(c, pts, p = 1) {
  if (p <= 0 || pts.length < 2) return;
  const L = [0];
  for (let i = 1; i < pts.length; i++) L[i] = L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const tot = L[L.length - 1] * clamp(p);
  c.beginPath();
  c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    if (L[i] <= tot) c.lineTo(pts[i][0], pts[i][1]);
    else {
      const f = (tot - L[i - 1]) / (L[i] - L[i - 1]);
      c.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f));
      break;
    }
  }
  c.stroke();
}

export function line(c, x0, y0, x1, y1, p = 1) {
  if (p <= 0) return;
  c.beginPath();
  c.moveTo(x0, y0);
  c.lineTo(lerp(x0, x1, clamp(p)), lerp(y0, y1, clamp(p)));
  c.stroke();
}

export function arrow(c, x0, y0, x1, y1, p = 1, head = 14) {
  if (p <= 0) return;
  const e = clamp(p);
  const x = lerp(x0, x1, e), y = lerp(y0, y1, e);
  line(c, x0, y0, x, y, 1);
  const a = Math.atan2(y1 - y0, x1 - x0);
  c.beginPath();
  c.moveTo(x, y);
  c.lineTo(x - Math.cos(a - 0.42) * head, y - Math.sin(a - 0.42) * head);
  c.lineTo(x - Math.cos(a + 0.42) * head, y - Math.sin(a + 0.42) * head);
  c.closePath();
  c.fill();
}

// curly-ish bracket between (x0,y) and (x1,y) opening downward (dir=1) or upward (-1)
export function bracket(c, x0, x1, y, dir = 1, p = 1, depth = 14) {
  if (p <= 0) return;
  const m = (x0 + x1) / 2;
  const pts = [[x0, y + depth * dir], [x0, y], [m - 10, y], [m, y - depth * 0.8 * dir], [m + 10, y], [x1, y], [x1, y + depth * dir]];
  polyline(c, pts, p);
}

export function vbracket(c, x, y0, y1, dir = 1, p = 1, depth = 14) {
  if (p <= 0) return;
  const m = (y0 + y1) / 2;
  const pts = [[x - depth * dir, y0], [x, y0], [x, m - 10], [x + depth * 0.8 * dir, m], [x, m + 10], [x, y1], [x - depth * dir, y1]];
  polyline(c, pts, p);
}

// rounded card with hairline border
export function card(c, x, y, w, h, col = C.faint, fill = 'rgba(10,12,16,0.72)', r = 10) {
  c.beginPath();
  c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h);
  c.fillStyle = fill;
  c.fill();
  c.strokeStyle = col;
  c.lineWidth = 1.2;
  c.stroke();
}

// labelled leader from a point to a text anchor
export function leader(c, px, py, tx, ty, text, col, p = 1, size = 22, fam = F.sansM) {
  if (p <= 0) return;
  c.save();
  c.strokeStyle = col;
  c.fillStyle = col;
  c.lineWidth = 1.4;
  const e = ease.outCubic(clamp(p * 1.4));
  c.beginPath();
  c.arc(px, py, 4, 0, Math.PI * 2);
  c.fill();
  polyline(c, [[px, py], [tx, ty], [tx + (tx > px ? 30 : -30), ty]], e);
  c.globalAlpha *= clamp(p * 2 - 0.6);
  c.font = font(fam, size);
  c.textAlign = tx > px ? 'left' : 'right';
  c.textBaseline = 'middle';
  c.fillText(text, tx + (tx > px ? 40 : -40), ty);
  c.restore();
}

// logarithmic axis. vertical from (x,y0) bottom to (x,y1) top, decades e0..e1
export function logAxis(c, x, y0, y1, e0, e1, col, p = 1, opts = {}) {
  const pos = (e) => lerp(y0, y1, (e - e0) / (e1 - e0));
  c.save();
  c.strokeStyle = col;
  c.fillStyle = col;
  c.lineWidth = 1.5;
  line(c, x, y0, x, lerp(y0, y1, p), 1);
  c.font = font(F.mono, opts.size ?? 14);
  c.textAlign = 'right';
  c.textBaseline = 'middle';
  const step = opts.step ?? 1;
  for (let e = e0; e <= e1; e += step) {
    const y = pos(e);
    const q = clamp((p - (e - e0) / (e1 - e0)) * 6);
    if (q <= 0) continue;
    c.globalAlpha = q;
    const major = e % (opts.major ?? 5) === 0;
    line(c, x - (major ? 12 : 6), y, x, y, 1);
    if (major || opts.all) c.fillText(`10${supStr(e)}`, x - 18, y);
  }
  c.restore();
  return pos;
}
const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const supStr = (n) => String(n).split('').map((d) => SUP[d] ?? d).join('');

// a bar that grows from its base; vertical when h<0 grows up
export function bar(c, x, y, w, h, col, p = 1, glow = 0) {
  if (p <= 0) return;
  const e = ease.outCubic(clamp(p));
  c.save();
  c.fillStyle = col;
  if (glow) {
    c.shadowColor = col;
    c.shadowBlur = glow;
  }
  c.fillRect(x, y, w, h * e);
  c.restore();
}

// small caption in mono with tracking
export function tag(c, text, x, y, col, size = 13, align = 'left', track = 2) {
  c.save();
  c.font = font(F.mono, Math.max(size, 14));
  c.fillStyle = col;
  c.textAlign = align;
  c.textBaseline = 'middle';
  tracking(c, track);
  c.fillText(text, x, y);
  c.restore();
}

// big strike-through (an X or a line) for "wrong" ideas
export function strike(c, x0, y0, x1, y1, p, col = C.warn, w = 4) {
  if (p <= 0) return;
  c.save();
  c.strokeStyle = col;
  c.lineWidth = w;
  c.lineCap = 'round';
  line(c, x0, y0, x1, y1, ease.outCubic(clamp(p)));
  c.restore();
}

export { rgba };
