// Small math / easing / noise toolkit. Everything in the PV is a pure function of
// time, so these helpers are deterministic (seeded) by design.

export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, t) => a + (b - a) * t;
export const invLerp = (a, b, x) => clamp((x - a) / (b - a));
export const remap = (x, a, b, c, d) => lerp(c, d, invLerp(a, b, x));
export const smooth = (a, b, x) => {
  const t = invLerp(a, b, x);
  return t * t * (3 - 2 * t);
};
export const smoother = (a, b, x) => {
  const t = invLerp(a, b, x);
  return t * t * t * (t * (t * 6 - 15) + 10);
};
export const fract = (x) => x - Math.floor(x);
export const TAU = Math.PI * 2;

// window: 0 before a, ramps to 1 over [a, a+fin], holds, ramps to 0 over [b-fout, b]
export function win(t, a, b, fin = 0.2, fout = 0.2) {
  if (t <= a || t >= b) return 0;
  return Math.min(fin > 0 ? clamp((t - a) / fin) : 1, fout > 0 ? clamp((b - t) / fout) : 1);
}

// ---- easings (t in 0..1)
export const ease = {
  linear: (t) => t,
  inQuad: (t) => t * t,
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  inOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  inCubic: (t) => t * t * t,
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outQuart: (t) => 1 - Math.pow(1 - t, 4),
  inQuart: (t) => t * t * t * t,
  inOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
  outExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inExpo: (t) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
  inOutExpo: (t) =>
    t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
  outBack: (t, s = 1.70158) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
  outElastic: (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
  },
};
// eased progress of x over [a,b]
export const ep = (a, b, x, fn = ease.outCubic) => fn(invLerp(a, b, x));

// ---- hashing / seeded random
export function hash1(n) {
  n = (n | 0) ^ 0x9e3779b9;
  n = Math.imul(n ^ (n >>> 16), 0x85ebca6b);
  n = Math.imul(n ^ (n >>> 13), 0xc2b2ae35);
  n ^= n >>> 16;
  return (n >>> 0) / 4294967296;
}
export const hash2 = (a, b) => hash1(Math.imul(a | 0, 73856093) ^ Math.imul(b | 0, 19349663));
export function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  const f = () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  f.range = (a, b) => a + (b - a) * f();
  f.int = (a, b) => Math.floor(a + (b - a + 1) * f());
  f.pick = (arr) => arr[Math.floor(f() * arr.length)];
  f.gauss = () => {
    let u = 0;
    for (let i = 0; i < 4; i++) u += f();
    return (u - 2) / 0.577;
  };
  return f;
}

// ---- value noise 1D/2D (smooth, deterministic)
export function noise1(x, seed = 0) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return lerp(hash2(i, seed), hash2(i + 1, seed), u) * 2 - 1;
}
export function noise2(x, y, seed = 0) {
  const ix = Math.floor(x),
    iy = Math.floor(y);
  const fx = x - ix,
    fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx),
    uy = fy * fy * (3 - 2 * fy);
  const s = seed * 7919;
  const a = hash2(ix + s, iy),
    b = hash2(ix + 1 + s, iy),
    c = hash2(ix + s, iy + 1),
    d = hash2(ix + 1 + s, iy + 1);
  return lerp(lerp(a, b, ux), lerp(c, d, ux), uy) * 2 - 1;
}
export function fbm1(x, seed = 0, oct = 4) {
  let a = 0.5,
    s = 0,
    f = 1;
  for (let i = 0; i < oct; i++) {
    s += a * noise1(x * f, seed + i * 31);
    f *= 2.03;
    a *= 0.5;
  }
  return s;
}

// shake vector driven by noise
export function shake(t, amp, freq = 18, seed = 0) {
  return [fbm1(t * freq, seed, 3) * amp, fbm1(t * freq, seed + 99, 3) * amp];
}

export const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
export const rgba = (hex, a = 1) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${(r * 255) | 0},${(g * 255) | 0},${(b * 255) | 0},${a})`;
};
