// Small math helpers shared by every scene. Everything is a pure function of time so any
// frame can be rendered on its own (scrubbing, capture).
export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, t) => a + (b - a) * t;
export const invLerp = (a, b, x) => clamp((x - a) / (b - a));
export const remap = (x, a, b, c, d) => lerp(c, d, invLerp(a, b, x));
export const smooth = (t) => {
  t = clamp(t);
  return t * t * (3 - 2 * t);
};
export const smoother = (t) => {
  t = clamp(t);
  return t * t * t * (t * (t * 6 - 15) + 10);
};
export const ease = {
  in2: (t) => clamp(t) ** 2,
  out2: (t) => 1 - (1 - clamp(t)) ** 2,
  out3: (t) => 1 - (1 - clamp(t)) ** 3,
  out4: (t) => 1 - (1 - clamp(t)) ** 4,
  inOut2: (t) => ((t = clamp(t)) < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
  inOut3: (t) => ((t = clamp(t)) < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  inOut4: (t) => ((t = clamp(t)) < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2),
  outExpo: (t) => ((t = clamp(t)) >= 1 ? 1 : 1 - 2 ** (-10 * t)),
  inOutExpo: (t) => {
    t = clamp(t);
    if (t === 0 || t === 1) return t;
    return t < 0.5 ? 2 ** (20 * t - 10) / 2 : (2 - 2 ** (-20 * t + 10)) / 2;
  },
  outBack: (t, s = 1.70158) => {
    t = clamp(t) - 1;
    return 1 + (s + 1) * t * t * t + s * t * t;
  },
  // damped spring settling at 1: fast attack, one soft overshoot
  spring: (t, k = 7, z = 0.55) => {
    t = Math.max(0, t);
    return 1 - Math.exp(-k * z * t) * Math.cos(k * Math.sqrt(1 - z * z) * t);
  },
};
// progress of a window [a, a+d] eased with fn
export const win = (t, a, d, fn = smooth) => fn((t - a) / d);
// rises over [a, a+din], holds, falls over [b, b+dout]
export const env = (t, a, din, b, dout = din) => Math.min(smooth((t - a) / din), 1 - smooth((t - b) / dout));
export const pulse = (t, a, d) => {
  const x = (t - a) / d;
  return x < 0 || x > 1 ? 0 : Math.sin(Math.PI * x);
};

// deterministic RNG
export function rng(seed) {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const hash1 = (n) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// 2D value noise + fbm (for brush jitter and paper grain in 2D)
const P = new Uint8Array(512);
{
  const r = rng(1337);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) P[i] = p[i & 255];
}
const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
function grad(h, x, y) {
  const u = h & 1 ? x : -x;
  const v = h & 2 ? y : -y;
  return (h & 4 ? u + v : u - v) * 0.7071;
}
export function noise2(x, y) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  const u = fade(x);
  const v = fade(y);
  const a = P[X] + Y;
  const b = P[X + 1] + Y;
  return lerp(lerp(grad(P[a], x, y), grad(P[b], x - 1, y), u), lerp(grad(P[a + 1], x, y - 1), grad(P[b + 1], x - 1, y - 1), u), v);
}
export function fbm2(x, y, o = 4) {
  let s = 0;
  let a = 0.5;
  for (let i = 0; i < o; i++) {
    s += a * noise2(x, y);
    x *= 2.03;
    y *= 2.03;
    a *= 0.5;
  }
  return s;
}

// scientific notation pieces: 2.28e41 -> ['2.28', '41']
export function sciParts(x, digits = 3) {
  if (x === 0) return ['0', '0'];
  const e = Math.floor(Math.log10(Math.abs(x)));
  let m = x / 10 ** e;
  let s = m.toPrecision(digits);
  if (+s >= 10) {
    m /= 10;
    s = m.toPrecision(digits);
    return [s.replace(/\.?0+$/, ''), String(e + 1)];
  }
  return [s.includes('.') ? s.replace(/\.?0+$/, '') : s, String(e)];
}
const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
export const sup = (s) => String(s).replace(/[0-9-]/g, (c) => SUP[c]);
export const sci = (x, digits = 3) => {
  const [m, e] = sciParts(x, digits);
  return m === '1' ? `10${sup(e)}` : `${m}×10${sup(e)}`;
};

// keyframes [[t, v], ...]; each segment eased in-out (stops at every key)
export function keys(t, K, fn = ease.inOut3) {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) {
    if (t <= K[i][0]) {
      const [t0, a] = K[i - 1];
      const [t1, b] = K[i];
      const k = fn((t - t0) / (t1 - t0));
      return Array.isArray(a) ? a.map((x, j) => lerp(x, b[j], k)) : lerp(a, b, k);
    }
  }
  return K[K.length - 1][1];
}
// keyframes through a centripetal-free Catmull-Rom (keeps moving through keys)
export function spline(t, K) {
  if (t <= K[0][0]) return K[0][1];
  if (t >= K[K.length - 1][0]) return K[K.length - 1][1];
  let i = 1;
  while (K[i][0] < t) i++;
  const p0 = K[Math.max(0, i - 2)];
  const p1 = K[i - 1];
  const p2 = K[i];
  const p3 = K[Math.min(K.length - 1, i + 1)];
  const u = (t - p1[0]) / (p2[0] - p1[0]);
  const cr = (a, b, c, d) => {
    const m1 = (c - a) * ((p2[0] - p1[0]) / Math.max(1e-6, p2[0] - p0[0]));
    const m2 = (d - b) * ((p2[0] - p1[0]) / Math.max(1e-6, p3[0] - p1[0]));
    const u2 = u * u;
    const u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * b + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * c + (u3 - u2) * m2;
  };
  const v1 = p1[1];
  return Array.isArray(v1) ? v1.map((_, j) => cr(p0[1][j], p1[1][j], p2[1][j], p3[1][j])) : cr(p0[1], p1[1], p2[1], p3[1]);
}
