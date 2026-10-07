// Lightning: recursive midpoint displacement with branches. Deterministic per seed.
// Rendered in Canvas2D with additive glow passes; bloom in post does the rest.
import { rng, clamp, hash1 } from '../core/util.js';

const cache = new Map();

export function bolt(x0, y0, x1, y1, seed, opts = {}) {
  const key = `${x0|0},${y0|0},${x1|0},${y1|0},${seed},${opts.branch ?? 0.5},${opts.rough ?? 1}`;
  if (cache.has(key)) return cache.get(key);
  if (cache.size > 600) cache.clear();
  const R = rng(seed);
  const rough = opts.rough ?? 1;
  const out = [];
  const build = (ax, ay, bx, by, w, depth, maxDepth) => {
    let pts = [[ax, ay], [bx, by]];
    let disp = Math.hypot(bx - ax, by - ay) * 0.22 * rough;
    for (let d = 0; d < 7; d++) {
      const np = [pts[0]];
      for (let i = 0; i < pts.length - 1; i++) {
        const [px, py] = pts[i], [qx, qy] = pts[i + 1];
        const mx = (px + qx) / 2, my = (py + qy) / 2;
        const dx = qx - px, dy = qy - py;
        const l = Math.hypot(dx, dy) || 1;
        const o = (R() - 0.5) * 2 * disp;
        np.push([mx - (dy / l) * o, my + (dx / l) * o], pts[i + 1]);
      }
      pts = np;
      disp *= 0.52;
    }
    out.push({ pts, w, depth });
    if (depth < maxDepth) {
      const nb = Math.floor(R() * 4 * (opts.branch ?? 0.5) * (1 - depth * 0.3)) + (depth === 0 ? 1 : 0);
      for (let k = 0; k < nb; k++) {
        const i = Math.floor((0.15 + R() * 0.6) * pts.length);
        const [sx, sy] = pts[i];
        const dirx = bx - ax, diry = by - ay;
        const ang = Math.atan2(diry, dirx) + (R() - 0.5) * 1.6;
        const len = Math.hypot(dirx, diry) * (0.18 + R() * 0.35) * (1 - depth * 0.25);
        build(sx, sy, sx + Math.cos(ang) * len, sy + Math.sin(ang) * len, w * 0.45, depth + 1, maxDepth);
      }
    }
  };
  build(x0, y0, x1, y1, opts.w ?? 3, 0, opts.depth ?? 2);
  cache.set(key, out);
  return out;
}

// intensity of a strike at age (s): main flash, a re-strike, quick decay
export function strikeI(age, seed = 0) {
  if (age < 0 || age > 0.6) return 0;
  const a = Math.exp(-age * 9);
  const re = age > 0.07 ? Math.exp(-(age - 0.07) * 16) * 0.8 : 0;
  const flick = 0.7 + 0.3 * hash1(Math.floor(age * 50) + seed * 7);
  return clamp((a + re) * flick, 0, 1.4);
}

// draw with glow passes; color: core tint; I: intensity 0..1+
export function drawBolt(c, segs, I, prog = 1, tint = [200, 220, 255]) {
  if (I <= 0.001) return;
  c.save();
  c.globalCompositeOperation = 'lighter';
  c.lineCap = 'round';
  c.lineJoin = 'round';
  const passes = [
    [26, 0.05, `rgba(${tint[0] * 0.6 | 0},${tint[1] * 0.5 | 0},${tint[2]},`],
    [9, 0.16, `rgba(${tint[0]},${tint[1]},${tint[2]},`],
    [3.2, 0.6, 'rgba(235,242,255,'],
    [1.3, 1, 'rgba(255,255,255,'],
  ];
  for (const [w, a, col] of passes) {
    for (const s of segs) {
      const n = Math.max(2, Math.floor(s.pts.length * clamp(prog * (1 + s.depth * 0.5))));
      if (s.depth > 0 && prog < 0.4) continue;
      c.strokeStyle = col + clamp(a * I * (s.depth ? 0.7 : 1)) + ')';
      c.lineWidth = w * (s.w / 3) * (s.depth ? 0.8 : 1);
      c.beginPath();
      c.moveTo(s.pts[0][0], s.pts[0][1]);
      for (let i = 1; i < n; i++) c.lineTo(s.pts[i][0], s.pts[i][1]);
      c.stroke();
    }
  }
  c.restore();
}
