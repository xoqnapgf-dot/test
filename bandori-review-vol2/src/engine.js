// ─── engine: canvas, time, easing, drawing helpers ──────────────────────────
// Every frame is a pure function of t (seconds), so the page can play in real time
// and the renderer can step through frames exactly.

const W = 1080, H = 1920;
const TAU = Math.PI * 2;
const IMG = {};            // name -> HTMLImageElement
const CACHE = {};          // offscreen canvases

// ── math ──
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ramp = (t, t0, dur) => clamp((t - t0) / dur);
const inv = (k) => 1 - k;
const ease = {
  out: (k) => 1 - Math.pow(1 - k, 3),
  in: (k) => k * k * k,
  io: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  back: (k) => { const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); },
  elastic: (k) => (k <= 0 ? 0 : k >= 1 ? 1 : Math.pow(2, -10 * k) * Math.sin((k * 10 - 0.75) * (TAU / 3)) + 1),
  sine: (k) => 0.5 - Math.cos(k * Math.PI) / 2,
};
// ramp + ease in one call
const ez = (t, t0, dur, f = ease.out) => f(ramp(t, t0, dur));
// in at t0, out at t1 (fade both sides)
const live = (t, t0, t1, fin = 0.35, fout = 0.3) => Math.min(ease.out(ramp(t, t0, fin)), 1 - ease.in(ramp(t, t1 - fout, fout)));

function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
function noise1(x) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; }

function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
function mix(h1, h2, k) {
  const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16);
  const c = (s) => Math.round(lerp((a >> s) & 255, (b >> s) & 255, k));
  return `rgb(${c(16)},${c(8)},${c(0)})`;
}

// ── fonts ──
const F = {
  black: '"NSC9"', bold: '"NSC7"', med: '"NSC5"',
  fun: '"KL"', punch: '"HY"', hand: '"WK"', round: '"FR"', serif: '"SER"',
};
const font = (fam, px) => `${px}px ${fam}, "NSC9", "PingFang SC", "Microsoft YaHei", sans-serif`;

// ── draw helpers ──
function rrect(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}

function withT(c, x, y, rot, s, fn) {
  c.save(); c.translate(x, y); if (rot) c.rotate(rot); if (s !== undefined && s !== 1) c.scale(s, s); fn(); c.restore();
}

// text with outline; opts: size, fam, color, stroke, sw, align, base, alpha, shadow, ls (letter spacing px)
function txt(c, s, x, y, o = {}) {
  const size = o.size || 60;
  c.save();
  c.font = font(o.fam || F.black, size);
  c.textAlign = o.align || 'center';
  c.textBaseline = o.base || 'middle';
  if (o.alpha !== undefined) c.globalAlpha *= o.alpha;
  if (o.ls) c.letterSpacing = o.ls + 'px';
  if (o.shadow) { c.shadowColor = o.shadow; c.shadowBlur = o.blur ?? 0; c.shadowOffsetX = o.sx ?? 0; c.shadowOffsetY = o.sy ?? 8; }
  if (o.stroke) {
    c.lineJoin = 'round'; c.miterLimit = 2; c.strokeStyle = o.stroke; c.lineWidth = o.sw || size * 0.18;
    c.strokeText(s, x, y);
    c.shadowColor = 'transparent';
  }
  c.fillStyle = o.color || '#fff';
  c.fillText(s, x, y);
  c.restore();
}
function measure(c, s, size, fam = F.black, ls = 0) {
  c.save(); c.font = font(fam, size); if (ls) c.letterSpacing = ls + 'px'; const w = c.measureText(s).width; c.restore(); return w;
}

// image: fit by height h, anchor (ax, ay) in [0..1] of the image
function img(c, name, x, y, h, o = {}) {
  const im = IMG[name]; if (!im || !im.width) return;
  const w = (h * im.width) / im.height;
  c.save();
  c.translate(x, y);
  if (o.rot) c.rotate(o.rot);
  if (o.flip) c.scale(-1, 1);
  if (o.alpha !== undefined) c.globalAlpha *= o.alpha;
  if (o.shadow) { c.shadowColor = o.shadow; c.shadowBlur = o.blur ?? 30; c.shadowOffsetX = o.sx ?? 0; c.shadowOffsetY = o.sy ?? 16; }
  if (o.filter) c.filter = o.filter;
  c.drawImage(im, -w * (o.ax ?? 0.5), -h * (o.ay ?? 0.5), w, h);
  c.restore();
}

// draw an image as a flat silhouette of `color` (cached per image+color)
function silhouette(name, color) {
  const key = 'sil:' + name + color;
  if (CACHE[key]) return CACHE[key];
  const im = IMG[name]; if (!im || !im.width) return null;
  const cv = document.createElement('canvas'); cv.width = im.width; cv.height = im.height;
  const g = cv.getContext('2d'); g.drawImage(im, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = color; g.fillRect(0, 0, cv.width, cv.height);
  return (CACHE[key] = cv);
}
function drawCanvas(c, cv, x, y, h, o = {}) {
  if (!cv) return; const w = (h * cv.width) / cv.height;
  c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot); if (o.alpha !== undefined) c.globalAlpha *= o.alpha;
  c.drawImage(cv, -w * (o.ax ?? 0.5), -h * (o.ay ?? 0.5), w, h); c.restore();
}

// character cutout ("trim" art, 1024²): positioned by its face so framing stays stable.
// FACE gives the face centre in normalised image coords.
const FACE = {
  ksm_soft: [0.5, 0.33], ksm_go: [0.5, 0.26], ksm_mega: [0.76, 0.42], ksm_star: [0.48, 0.35],
  otae: [0.47, 0.23], otae_b: [0.4, 0.38], ars_b: [0.48, 0.27], ran_stage: [0.33, 0.38], ran_off: [0.55, 0.3],
  moca: [0.33, 0.32], moca_b: [0.43, 0.28], chisato: [0.5, 0.3], maya: [0.38, 0.33], eve: [0.37, 0.34],
  ykn: [0.4, 0.28], sayo: [0.48, 0.33], lisa: [0.33, 0.27],
};
// put face of `name` at (fx, fy), image size `size`
function chara(c, name, fx, fy, size, o = {}) {
  const f = FACE[name] || [0.5, 0.3];
  img(c, name, fx, fy, size, Object.assign({ ax: f[0], ay: f[1] }, o));
}

function star(c, x, y, r, n = 5, inner = 0.45, rot = -Math.PI / 2) {
  c.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const a = rot + (i * Math.PI) / n, rr = i % 2 ? r * inner : r;
    c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  c.closePath();
}
function heart(c, x, y, s) {
  c.beginPath(); c.moveTo(x, y + s * 0.35);
  c.bezierCurveTo(x - s * 1.05, y - s * 0.35, x - s * 0.45, y - s * 1.05, x, y - s * 0.45);
  c.bezierCurveTo(x + s * 0.45, y - s * 1.05, x + s * 1.05, y - s * 0.35, x, y + s * 0.35);
  c.closePath();
}
function arrowLine(c, x1, y1, x2, y2, o = {}) {
  const k = o.k ?? 1; const ex = lerp(x1, x2, k), ey = lerp(y1, y2, k);
  c.save(); c.strokeStyle = o.color || '#fff'; c.fillStyle = o.color || '#fff'; c.lineWidth = o.lw || 8; c.lineCap = 'round';
  if (o.alpha !== undefined) c.globalAlpha *= o.alpha;
  if (o.dash) c.setLineDash(o.dash);
  if (o.dashOff) c.lineDashOffset = o.dashOff;
  c.beginPath(); c.moveTo(x1, y1); c.lineTo(ex, ey); c.stroke(); c.setLineDash([]);
  if (k > 0.05 && o.head !== false) {
    const a = Math.atan2(y2 - y1, x2 - x1), hs = o.hs || c.lineWidth * 3;
    c.beginPath(); c.moveTo(ex + Math.cos(a) * hs * 0.6, ey + Math.sin(a) * hs * 0.6);
    c.lineTo(ex + Math.cos(a + 2.5) * hs, ey + Math.sin(a + 2.5) * hs);
    c.lineTo(ex + Math.cos(a - 2.5) * hs, ey + Math.sin(a - 2.5) * hs); c.closePath(); c.fill();
  }
  c.restore();
}

// rounded label chip
function chip(c, s, x, y, o = {}) {
  const size = o.size || 40, fam = o.fam || F.black, padX = o.padX ?? size * 0.55, padY = o.padY ?? size * 0.32;
  const w = measure(c, s, size, fam, o.ls) + padX * 2, h = size + padY * 2;
  const ax = o.align === 'left' ? 0 : o.align === 'right' ? 1 : 0.5;
  c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot); if (o.scale !== undefined) c.scale(o.scale, o.scale);
  if (o.alpha !== undefined) c.globalAlpha *= o.alpha;
  if (o.shadow !== false) { c.fillStyle = o.shadowColor || 'rgba(0,0,0,.28)'; rrect(c, -w * ax + 6, -h / 2 + 8, w, h, o.r ?? h / 2); c.fill(); }
  c.fillStyle = o.bg || '#fff'; rrect(c, -w * ax, -h / 2, w, h, o.r ?? h / 2); c.fill();
  if (o.border) { c.lineWidth = o.bw || 5; c.strokeStyle = o.border; c.stroke(); }
  txt(c, s, -w * ax + w / 2, 2, { size, fam, color: o.color || '#222', ls: o.ls });
  c.restore();
  return w;
}

// speech bubble with tail; (x,y) = bubble centre
function bubble(c, s, x, y, o = {}) {
  const size = o.size || 52, fam = o.fam || F.black;
  const lines = String(s).split('\n');
  const w = Math.max(...lines.map((l) => measure(c, l, size, fam))) + size * 1.2, lh = size * 1.3, h = lh * lines.length + size * 0.8;
  c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot); if (o.scale !== undefined) c.scale(o.scale, o.scale); if (o.alpha !== undefined) c.globalAlpha *= o.alpha;
  const tx = o.tail ? o.tail[0] : -w * 0.25, ty = o.tail ? o.tail[1] : h * 0.9;
  c.fillStyle = o.bg || '#fff'; c.strokeStyle = o.border || '#222'; c.lineWidth = o.bw || 6; c.lineJoin = 'round';
  if (o.think) {
    rrect(c, -w / 2, -h / 2, w, h, h / 2); c.fill(); c.stroke();
    for (let i = 0; i < 3; i++) { const k = (i + 1) / 4; c.beginPath(); c.arc(lerp(0, tx, k + 0.2), lerp(h / 2, ty, k + 0.2), 14 - i * 3, 0, TAU); c.fill(); c.stroke(); }
  } else {
    c.beginPath(); c.moveTo(-w * 0.12 + tx * 0.2, h / 2 - 2); c.lineTo(tx, ty); c.lineTo(w * 0.08 + tx * 0.2, h / 2 - 2);
    rrect(c, -w / 2, -h / 2, w, h, Math.min(46, h / 2)); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-w * 0.12 + tx * 0.2, h / 2 - 2); c.lineTo(tx, ty); c.lineTo(w * 0.08 + tx * 0.2, h / 2 - 2); c.fill(); c.stroke();
    c.fillRect(-w * 0.12 + tx * 0.2 + 4, h / 2 - 12, w * 0.2 - 8, 12);
  }
  lines.forEach((l, i) => txt(c, l, 0, -h / 2 + size * 0.4 + lh * (i + 0.5), { size, fam, color: o.color || '#222' }));
  c.restore();
}

// soft background: vertical gradient + drifting blobs + halftone dots
function dotPattern(color, gap = 26, r = 3) {
  const key = 'dots:' + color + gap + r;
  if (CACHE[key]) return CACHE[key];
  const cv = document.createElement('canvas'); cv.width = gap * 2; cv.height = gap * 2; const g = cv.getContext('2d');
  g.fillStyle = color;
  [[gap / 2, gap / 2], [gap * 1.5, gap * 1.5]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); });
  return (CACHE[key] = cv);
}
function bg(c, t, top, bottom, o = {}) {
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bottom);
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  (o.blobs || []).forEach((b, i) => {
    const x = b[0] + Math.sin(t * 0.21 + i * 2.1) * 90, y = b[1] + Math.cos(t * 0.17 + i * 1.3) * 120, r = b[2];
    const rg = c.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, b[3]); rg.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = rg; c.fillRect(x - r, y - r, r * 2, r * 2);
  });
  if (o.dots) {
    const p = c.createPattern(dotPattern(o.dots, o.gap || 30, o.r || 3), 'repeat');
    c.save(); c.translate((t * 12) % ((o.gap || 30) * 2), (t * 20) % ((o.gap || 30) * 2)); c.fillStyle = p; c.globalAlpha = o.dotAlpha ?? 1;
    c.fillRect(-120, -120, W + 240, H + 240); c.restore();
  }
  if (o.stripes) {
    c.save(); c.globalAlpha = o.stripeAlpha ?? 0.07; c.fillStyle = o.stripes; c.translate(W / 2, H / 2); c.rotate(-0.5);
    const off = (t * 40) % 160; for (let x = -1800 - off; x < 1800; x += 160) c.fillRect(x, -1800, 60, 3600); c.restore();
  }
}

// seeded particle field: n particles moving deterministically with t
function particles(c, t, n, seed, draw) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) draw(r(), r(), r(), r(), i);
}
