// 2D overlay toolkit. Scenes draw in a virtual 1920x1080 space; the stage scales it to the
// real canvas. Everything takes a progress value so strokes, text and stamps can be "written"
// on cue instead of popping in.
import { PAL, FONT } from './palette.js';
import { clamp, lerp, smooth, ease, rng, noise2, fbm2, sciParts, sup } from './util.js';
import { ICONS } from '../data/icons.js';

export const W = 1920;
export const H = 1080;

const sealCache = new Map();
const iconCache = new Map();
let measureSvg = null;

export class G {
  constructor(canvas) {
    this.cv = canvas;
    this.x = canvas.getContext('2d');
    this.mode = 'paper';
    this.p = PAL.paper;
    this.t = 0;
    this.ga = 1; // alpha multiplier for content nested in a fading card
  }
  begin(scale, mode, t) {
    const x = this.x;
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.clearRect(0, 0, this.cv.width, this.cv.height);
    x.setTransform(scale, 0, 0, scale, 0, 0);
    this.s = scale;
    this.mode = mode;
    this.p = PAL[mode];
    this.t = t;
    this.ga = 1;
    x.globalAlpha = 1;
    x.globalCompositeOperation = 'source-over';
    x.lineCap = 'round';
    x.lineJoin = 'round';
  }
  col(c) {
    return this.p[c] || c;
  }
  // ---------------------------------------------------------------- text
  font(kind = 'sans', size = 32, weight = 400, italic = false) {
    this.x.font = `${italic ? 'italic ' : ''}${weight} ${size}px ${FONT[kind] || kind}`;
  }
  measure(str, kind = 'sans', size = 32, weight = 400) {
    this.font(kind, size, weight);
    return this.x.measureText(str).width;
  }
  /**
   * text(str, x, y, o)
   * o: kind,size,weight,color,align('left'|'center'|'right'),base,alpha,reveal(0..1),
   *    track (letter spacing px), rise (px a char travels while appearing), glow
   */
  text(str, x, y, o = {}) {
    const c = this.x;
    const kind = o.kind || 'sans';
    const size = o.size || 32;
    const weight = o.weight || 400;
    const alpha = o.alpha == null ? 1 : o.alpha;
    if (alpha <= 0.003) return 0;
    this.font(kind, size, weight, o.italic);
    c.fillStyle = this.col(o.color || 'ink');
    c.textBaseline = o.base || 'alphabetic';
    const track = o.track || 0;
    const chars = [...str];
    const widths = chars.map((ch) => c.measureText(ch).width + track);
    const total = widths.reduce((a, b) => a + b, 0) - track;
    let x0 = x;
    if (o.align === 'center') x0 = x - total / 2;
    else if (o.align === 'right') x0 = x - total;
    const reveal = o.reveal == null ? 1 : clamp(o.reveal);
    if (o.glow && this.mode === 'cosmos') {
      c.shadowColor = this.col(o.glowColor || o.color || 'ink');
      c.shadowBlur = o.glow;
    }
    c.textAlign = 'left';
    if (reveal >= 1 && !track) {
      c.globalAlpha = this.ga * (alpha);
      c.fillText(str, x0, y);
    } else {
      const n = chars.length;
      const soft = o.soft || 3; // chars over which the fade front spreads
      let px = x0;
      for (let i = 0; i < n; i++) {
        const k = clamp(reveal * (n + soft) - i, 0, soft) / soft;
        if (k > 0) {
          c.globalAlpha = this.ga * (alpha * smooth(k));
          c.fillText(chars[i], px, y + (1 - ease.out3(k)) * (o.rise == null ? size * 0.25 : o.rise));
        }
        px += widths[i];
      }
    }
    c.globalAlpha = this.ga;
    c.shadowBlur = 0;
    return total;
  }
  // wrapped paragraph (CJK-aware: breaks anywhere, keeps punctuation off line starts)
  para(str, x, y, w, o = {}) {
    const size = o.size || 30;
    const lh = o.lh || size * 1.6;
    this.font(o.kind || 'sans', size, o.weight || 400);
    const lines = this.wrap(str, w);
    const n = lines.reduce((a, l) => a + l.length, 0);
    let done = 0;
    const reveal = o.reveal == null ? 1 : o.reveal;
    lines.forEach((l, i) => {
      const r = clamp((reveal * n - done) / l.length);
      this.text(l, x, y + i * lh, { ...o, reveal: r, soft: 4 });
      done += l.length;
    });
    return lines.length * lh;
  }
  wrap(str, w) {
    const c = this.x;
    const out = [];
    let cur = '';
    for (const ch of str) {
      if (ch === '\n') {
        out.push(cur);
        cur = '';
        continue;
      }
      const t = cur + ch;
      if (c.measureText(t).width > w && cur) {
        if (/[，。、；：？！”）》]/.test(ch)) {
          cur = t;
          continue;
        }
        out.push(cur);
        cur = ch;
      } else cur = t;
    }
    if (cur) out.push(cur);
    return out;
  }
  // mantissa × 10^exp with a real raised exponent; returns width
  sci(value, x, y, o = {}) {
    let m, e;
    if (Array.isArray(value)) [m, e] = value;
    else [m, e] = sciParts(value, o.digits || 3);
    m = String(m);
    const size = o.size || 36;
    const kind = o.kind || 'mono';
    const weight = o.weight || 500;
    const parts = [];
    if (o.prefix) parts.push([o.prefix, size, 0, o.prefixKind || 'sans']);
    if (m !== '1' || o.forceMant) parts.push([m + '×', size, 0, kind]);
    parts.push(['10', size, 0, kind]);
    parts.push([String(e).replace('-', '−'), size * 0.62, -size * 0.42, kind]);
    if (o.unit) parts.push([' ' + o.unit, size * (o.unitScale || 0.8), 0, o.unitKind || 'sans']);
    const ws = parts.map(([s, sz, , k]) => this.measure(s, k, sz, weight));
    const total = ws.reduce((a, b) => a + b, 0);
    let px = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x;
    const rev = o.reveal == null ? 1 : o.reveal;
    parts.forEach(([s, sz, dy, k], i) => {
      const r = clamp(rev * parts.length - i);
      this.text(s, px, y + dy, { kind: k, size: sz, weight, color: o.color, alpha: (o.alpha == null ? 1 : o.alpha) * smooth(r), glow: o.glow });
      px += ws[i];
    });
    return total;
  }
  // ------------------------------------------------------------- strokes
  path(pts) {
    const c = this.x;
    c.beginPath();
    c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
  }
  // polyline with partial progress, optional hand wobble and dash
  line(pts, o = {}) {
    const p = o.p == null ? 1 : clamp(o.p);
    if (p <= 0 || (o.alpha != null && o.alpha <= 0)) return;
    let q = o.rough ? roughen(pts, o.rough, o.seed || 7) : pts;
    if (p < 1) q = cut(q, p);
    const c = this.x;
    c.save();
    c.globalAlpha = this.ga * (o.alpha == null ? 1 : o.alpha);
    c.strokeStyle = this.col(o.color || 'ink');
    c.lineWidth = o.w || 2;
    if (o.dash) c.setLineDash(o.dash);
    if (o.dashOff) c.lineDashOffset = o.dashOff;
    if (o.glow && this.mode === 'cosmos') {
      c.shadowColor = c.strokeStyle;
      c.shadowBlur = o.glow;
    }
    if (o.add) c.globalCompositeOperation = 'lighter';
    this.path(q);
    c.stroke();
    c.restore();
  }
  seg(x1, y1, x2, y2, o) {
    this.line([[x1, y1], [x2, y2]], o);
  }
  // quadratic/cubic helper -> points
  curve(a, b, bend = 0.2, n = 40) {
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const cx = mx - dy * bend;
    const cy = my + dx * bend;
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      pts.push([(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * cx + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * cy + t * t * b[1]]);
    }
    return pts;
  }
  arrow(a, b, o = {}) {
    const pts = o.bend ? this.curve(a, b, o.bend) : [a, b];
    const p = o.p == null ? 1 : clamp(o.p);
    if (p <= 0) return;
    this.line(pts, o);
    const q = cut(pts, p);
    const e = q[q.length - 1];
    const f = q[Math.max(0, q.length - 2)];
    let ang = Math.atan2(e[1] - f[1], e[0] - f[0]);
    if (q.length < 2 || (e[0] === f[0] && e[1] === f[1])) ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const hs = o.head || 14;
    const c = this.x;
    c.save();
    c.globalAlpha = this.ga * ((o.alpha == null ? 1 : o.alpha) * smooth(p * 6));
    c.fillStyle = this.col(o.color || 'ink');
    c.translate(e[0], e[1]);
    c.rotate(ang);
    c.beginPath();
    c.moveTo(2, 0);
    c.lineTo(-hs, -hs * 0.48);
    c.lineTo(-hs * 0.72, 0);
    c.lineTo(-hs, hs * 0.48);
    c.closePath();
    c.fill();
    c.restore();
  }
  // ink brush stroke: tapered body, dry-brush streaks near the tail
  brush(pts, o = {}) {
    const p = o.p == null ? 1 : clamp(o.p);
    if (p <= 0) return;
    const seed = o.seed || 3;
    const dense = resample(pts, 4);
    const n = Math.max(2, Math.floor(dense.length * p));
    const q = dense.slice(0, n);
    const w = o.w || 18;
    const c = this.x;
    const L = [];
    const R = [];
    for (let i = 0; i < q.length; i++) {
      const a = q[Math.max(0, i - 1)];
      const b = q[Math.min(q.length - 1, i + 1)];
      let nx = -(b[1] - a[1]);
      let ny = b[0] - a[0];
      const l = Math.hypot(nx, ny) || 1;
      nx /= l;
      ny /= l;
      const u = i / (dense.length - 1);
      const press = Math.min(1, u / 0.06 + 0.25) * (u > 0.82 ? lerp(1, 0.35, (u - 0.82) / 0.18) : 1);
      const wob = 1 + 0.18 * noise2(u * 9 + seed, seed * 1.7);
      const hw = (w / 2) * press * wob;
      L.push([q[i][0] + nx * hw, q[i][1] + ny * hw]);
      R.push([q[i][0] - nx * hw, q[i][1] - ny * hw]);
    }
    c.save();
    c.globalAlpha = this.ga * (o.alpha == null ? 1 : o.alpha);
    c.fillStyle = this.col(o.color || 'ink');
    if (o.glow && this.mode === 'cosmos') {
      c.shadowColor = c.fillStyle;
      c.shadowBlur = o.glow;
    }
    c.beginPath();
    c.moveTo(L[0][0], L[0][1]);
    for (const v of L) c.lineTo(v[0], v[1]);
    for (let i = R.length - 1; i >= 0; i--) c.lineTo(R[i][0], R[i][1]);
    c.closePath();
    c.fill();
    c.shadowBlur = 0;
    // dry streaks: cut thin gaps in the stroke near its end
    if (o.dry !== false && q.length > 6) {
      c.globalCompositeOperation = 'destination-out';
      const r = rng(seed);
      const streaks = 5;
      for (let s = 0; s < streaks; s++) {
        const off = (r() - 0.5) * 0.8;
        const from = 0.55 + r() * 0.3;
        c.beginPath();
        let started = false;
        for (let i = Math.floor(q.length * from); i < q.length; i++) {
          const k = i / q.length;
          const x = lerp(L[i][0], R[i][0], 0.5 + off);
          const y = lerp(L[i][1], R[i][1], 0.5 + off);
          if (!started) c.moveTo(x, y), (started = true);
          else c.lineTo(x, y);
        }
        c.lineWidth = w * 0.06 * (0.5 + r());
        c.globalAlpha = 0.85;
        c.stroke();
      }
    }
    c.restore();
  }
  circle(x, y, r, o = {}) {
    const c = this.x;
    const p = o.p == null ? 1 : clamp(o.p);
    if (p <= 0 || r <= 0) return;
    c.save();
    c.globalAlpha = this.ga * (o.alpha == null ? 1 : o.alpha);
    if (o.add) c.globalCompositeOperation = 'lighter';
    c.beginPath();
    const a0 = o.a0 == null ? -Math.PI / 2 : o.a0;
    c.arc(x, y, r, a0, a0 + Math.PI * 2 * p);
    if (o.fill) {
      c.fillStyle = this.col(o.fill);
      c.fill();
    }
    if (o.color || !o.fill) {
      c.strokeStyle = this.col(o.color || 'ink');
      c.lineWidth = o.w || 2;
      if (o.dash) c.setLineDash(o.dash);
      if (o.glow && this.mode === 'cosmos') {
        c.shadowColor = c.strokeStyle;
        c.shadowBlur = o.glow;
      }
      c.stroke();
    }
    c.restore();
  }
  rect(x, y, w, h, o = {}) {
    const c = this.x;
    c.save();
    c.globalAlpha = this.ga * (o.alpha == null ? 1 : o.alpha);
    c.beginPath();
    if (o.r) c.roundRect(x, y, w, h, o.r);
    else c.rect(x, y, w, h);
    if (o.fill) {
      c.fillStyle = this.col(o.fill);
      c.fill();
    }
    if (o.color) {
      c.strokeStyle = this.col(o.color);
      c.lineWidth = o.w || 2;
      if (o.dash) c.setLineDash(o.dash);
      c.stroke();
    }
    c.restore();
  }
  // radial glow (cosmos) / soft wash (paper)
  glow(x, y, r, color, a = 1) {
    if (a <= 0 || r <= 0) return;
    const c = this.x;
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    const col = this.col(color);
    g.addColorStop(0, withAlpha(col, a));
    g.addColorStop(0.35, withAlpha(col, a * 0.35));
    g.addColorStop(1, withAlpha(col, 0));
    c.save();
    if (this.mode === 'cosmos') c.globalCompositeOperation = 'lighter';
    c.fillStyle = g;
    c.fillRect(x - r, y - r, r * 2, r * 2);
    c.restore();
  }
  // ---------------------------------------------------------- composites
  // paper card with soft shadow; drawn content goes inside via fn(g)
  card(x, y, w, h, o = {}) {
    const p = o.p == null ? 1 : o.p;
    if (p <= 0) return;
    const c = this.x;
    const k = ease.out3(p);
    c.save();
    c.globalAlpha = this.ga * (smooth(p * 1.5) * (o.alpha == null ? 1 : o.alpha));
    c.translate(x + w / 2, y + h / 2 + (1 - k) * (o.lift == null ? 30 : o.lift));
    if (o.rot) c.rotate(o.rot);
    c.translate(-w / 2, -h / 2);
    const paper = this.mode === 'paper';
    c.shadowColor = this.p.shadow;
    c.shadowBlur = paper ? 28 : 40;
    c.shadowOffsetY = paper ? 10 : 0;
    c.fillStyle = o.fill ? this.col(o.fill) : this.p.card;
    c.beginPath();
    c.roundRect(0, 0, w, h, o.r == null ? 6 : o.r);
    c.fill();
    c.shadowColor = 'transparent';
    if (o.border !== false) {
      c.strokeStyle = this.col(o.border || 'rule');
      c.lineWidth = 1.2;
      c.stroke();
    }
    if (o.fn) {
      c.save();
      c.beginPath();
      c.rect(0, 0, w, h);
      c.clip();
      const ga = this.ga;
      this.ga = c.globalAlpha;
      o.fn(this, w, h);
      this.ga = ga;
      c.restore();
    }
    c.restore();
  }
  // chinese seal stamp (cached texture, slammed in on progress)
  seal(text, x, y, o = {}) {
    const p = o.p == null ? 1 : clamp(o.p);
    if (p <= 0) return;
    const size = o.size || 120;
    const color = this.col(o.color || 'red');
    const key = text + '|' + size + '|' + color + '|' + (o.shape || 'sq');
    let cv = sealCache.get(key);
    if (!cv) {
      cv = makeSeal(text, size, color, o.shape || 'sq');
      sealCache.set(key, cv);
    }
    const c = this.x;
    const k = clamp(p * 1.25);
    const sc = lerp(1.6, 1, ease.out4(k)) + 0.04 * Math.sin(clamp((p - 0.6) / 0.4) * Math.PI);
    c.save();
    c.globalAlpha = this.ga * (smooth(k * 2.5) * (o.alpha == null ? 1 : o.alpha));
    c.translate(x, y);
    c.rotate(o.rot == null ? -0.06 : o.rot);
    c.scale(sc, sc);
    if (this.mode === 'cosmos') {
      c.shadowColor = color;
      c.shadowBlur = 18;
    }
    c.drawImage(cv, -cv.width / 4, -cv.height / 4, cv.width / 2, cv.height / 2);
    c.restore();
  }
  // small semantic tag: kind in confirmed | doubt | rejected | unobserved | energy | range
  tag(text, x, y, kind = 'ok', o = {}) {
    const p = o.p == null ? 1 : clamp(o.p);
    if (p <= 0) return 0;
    const size = o.size || 22;
    const col = { ok: 'ok', doubt: 'doubt', rejected: 'red', unobserved: 'ink3', energy: 'energy', range: 'range', ink: 'ink' }[kind] || kind;
    const tw = this.measure(text, 'sans', size, 500);
    const padX = size * 0.6;
    const w = tw + padX * 2;
    const h = size * 1.7;
    const x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
    const c = this.x;
    c.save();
    c.globalAlpha = this.ga * (smooth(p * 2) * (o.alpha == null ? 1 : o.alpha));
    c.translate(0, (1 - ease.out3(p)) * 10);
    c.beginPath();
    c.roundRect(x0, y - h / 2, w, h, h / 2);
    c.strokeStyle = this.col(col);
    c.lineWidth = 1.6;
    if (kind === 'doubt') c.setLineDash([6, 5]);
    if (kind === 'unobserved') c.setLineDash([2, 4]);
    c.stroke();
    c.fillStyle = withAlpha(this.col(col), this.mode === 'paper' ? 0.08 : 0.14);
    c.fill();
    c.restore();
    this.text(text, x0 + padX, y + size * 0.36, { size, weight: 500, color: col, alpha: smooth(p * 2) * (o.alpha == null ? 1 : o.alpha) });
    return w;
  }
  // tabler outline icon, drawn as strokes that write themselves on
  icon(name, x, y, size, o = {}) {
    const p = o.p == null ? 1 : clamp(o.p);
    if (p <= 0) return;
    const ic = getIcon(name);
    if (!ic) return;
    const c = this.x;
    c.save();
    c.globalAlpha = this.ga * (o.alpha == null ? 1 : o.alpha);
    c.translate(x - size / 2, y - size / 2);
    c.scale(size / 24, size / 24);
    c.strokeStyle = this.col(o.color || 'ink');
    c.lineWidth = (o.w || 1.6) * (24 / size) * (size / 24);
    c.lineWidth = o.w ? o.w * (24 / size) : 1.6;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    if (o.glow && this.mode === 'cosmos') {
      c.shadowColor = c.strokeStyle;
      c.shadowBlur = o.glow;
    }
    for (const seg of ic) {
      if (p < 1) {
        c.setLineDash([seg.len * p, seg.len + 1]);
      }
      if (o.fill) {
        c.fillStyle = this.col(o.fill);
        c.fill(seg.path);
      }
      c.stroke(seg.path);
    }
    c.restore();
  }
  // big brush-lettered word (font glyphs given an ink texture)
  inkWord(str, x, y, o = {}) {
    const size = o.size || 160;
    const key = 'ink|' + str + '|' + size + '|' + (o.kind || 'kai') + '|' + this.col(o.color || 'ink');
    let cv = sealCache.get(key);
    if (!cv) {
      cv = makeInkWord(str, size, o.kind || 'kai', this.col(o.color || 'ink'), o.weight || 400);
      sealCache.set(key, cv);
    }
    const p = o.p == null ? 1 : clamp(o.p);
    if (p <= 0) return;
    const c = this.x;
    c.save();
    c.globalAlpha = this.ga * (o.alpha == null ? 1 : o.alpha);
    if (o.glow && this.mode === 'cosmos') {
      c.shadowColor = this.col(o.glowColor || o.color || 'ink');
      c.shadowBlur = o.glow;
    }
    const w = cv.width / 2;
    const h = cv.height / 2;
    const x0 = o.align === 'left' ? x : x - w / 2;
    // reveal left-to-right with a soft brush front
    if (p < 1) {
      c.beginPath();
      c.rect(x0 - 10, y - h, (w + 20) * ease.inOut2(p), h * 2);
      c.clip();
    }
    c.drawImage(cv, x0, y - h / 2, w, h);
    c.restore();
  }
}

export function withAlpha(col, a) {
  if (col.startsWith('rgba')) return col.replace(/[\d.]+\)$/, `${(+col.match(/([\d.]+)\)$/)[1] * a).toFixed(3)})`);
  if (col.startsWith('#')) {
    const n = parseInt(col.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a.toFixed(3)})`;
  }
  return col;
}

// ---- geometry helpers
export function resample(pts, step) {
  const out = [pts[0]];
  let carry = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let s = step - carry;
    while (s <= d) {
      const t = s / d;
      out.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t)]);
      s += step;
    }
    carry = d - (s - step);
  }
  out.push(pts[pts.length - 1]);
  return out;
}
export function cut(pts, p) {
  if (p >= 1) return pts;
  let L = 0;
  const seg = [];
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(d);
    L += d;
  }
  let target = L * p;
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    if (target <= seg[i - 1]) {
      const t = seg[i - 1] ? target / seg[i - 1] : 0;
      out.push([lerp(pts[i - 1][0], pts[i][0], t), lerp(pts[i - 1][1], pts[i][1], t)]);
      return out;
    }
    target -= seg[i - 1];
    out.push(pts[i]);
  }
  return out;
}
function roughen(pts, amt, seed) {
  const d = resample(pts, 10);
  return d.map(([x, y], i) => [x + amt * noise2(i * 0.21 + seed, seed * 3.1), y + amt * noise2(seed * 2.3, i * 0.21 + seed)]);
}

function makeSeal(text, size, color, shape) {
  const S = size * 2; // 2x supersample
  const cv = document.createElement('canvas');
  const chars = [...text];
  const wide = shape === 'rect' ? Math.max(1, chars.length / 2) : 1;
  cv.width = Math.ceil(S * wide + 8);
  cv.height = S + 8;
  const c = cv.getContext('2d');
  c.translate(4, 4);
  c.fillStyle = color;
  c.strokeStyle = color;
  const r = rng(text.length * 97 + size);
  const w = S * wide;
  if (shape === 'round') {
    c.lineWidth = S * 0.06;
    c.beginPath();
    c.arc(S / 2, S / 2, S * 0.46, 0, Math.PI * 2);
    c.stroke();
  } else {
    c.lineWidth = S * 0.065;
    c.beginPath();
    c.roundRect(S * 0.04, S * 0.04, w - S * 0.08, S * 0.92, S * 0.05);
    c.stroke();
  }
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  if (shape === 'rect' || chars.length > 4) {
    const fs = Math.min(S * 0.5, (w * 0.86) / chars.length);
    c.font = `900 ${fs}px ${FONT.serif}`;
    c.fillText(text, w / 2, S / 2 + fs * 0.04);
  } else if (chars.length === 4) {
    const fs = S * 0.36;
    c.font = `900 ${fs}px ${FONT.serif}`;
    // traditional order: right column top-down, then left column
    const pos = [[0.72, 0.31], [0.72, 0.69], [0.28, 0.31], [0.28, 0.69]];
    chars.forEach((ch, i) => c.fillText(ch, S * pos[i][0], S * pos[i][1]));
  } else if (chars.length === 2) {
    const fs = S * 0.4;
    c.font = `900 ${fs}px ${FONT.serif}`;
    c.fillText(chars[0], S / 2, S * 0.3);
    c.fillText(chars[1], S / 2, S * 0.71);
  } else if (chars.length === 3) {
    const fs = S * 0.3;
    c.font = `900 ${fs}px ${FONT.serif}`;
    c.fillText(chars[0], S * 0.71, S * 0.32);
    c.fillText(chars[1], S * 0.71, S * 0.69);
    c.font = `900 ${S * 0.42}px ${FONT.serif}`;
    c.fillText(chars[2], S * 0.29, S * 0.51);
  } else {
    c.font = `900 ${S * 0.6}px ${FONT.serif}`;
    c.fillText(text, S / 2, S / 2);
  }
  // wear: speckle erosion + uneven pressure
  c.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < S * 1.6; i++) {
    const x = r() * w;
    const y = r() * S;
    const n = fbm2(x * 0.02, y * 0.02);
    if (n > 0.08 || r() < 0.25) {
      c.globalAlpha = 0.25 + r() * 0.6;
      c.beginPath();
      c.arc(x, y, r() * S * 0.012 + 0.6, 0, Math.PI * 2);
      c.fill();
    }
  }
  const g = c.createLinearGradient(0, 0, w, S);
  g.addColorStop(0, 'rgba(0,0,0,0.0)');
  g.addColorStop(1, 'rgba(0,0,0,0.28)');
  c.globalAlpha = 1;
  c.fillStyle = g;
  c.fillRect(0, 0, w, S);
  return cv;
}

function makeInkWord(str, size, kind, color, weight) {
  const S = size * 2;
  const tmp = document.createElement('canvas').getContext('2d');
  tmp.font = `${weight} ${S}px ${FONT[kind] || kind}`;
  const w = Math.ceil(tmp.measureText(str).width + S * 0.3);
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = Math.ceil(S * 1.35);
  const c = cv.getContext('2d');
  c.font = tmp.font;
  c.textBaseline = 'middle';
  c.fillStyle = color;
  // bleed halo then the glyphs
  c.globalAlpha = 0.18;
  c.filter = `blur(${S * 0.012}px)`;
  c.fillText(str, S * 0.15, cv.height / 2);
  c.filter = 'none';
  c.globalAlpha = 1;
  c.fillText(str, S * 0.15, cv.height / 2);
  // dry-brush texture: streaks along x with noise
  c.globalCompositeOperation = 'destination-out';
  const r = rng(str.length * 31 + size);
  for (let y = 0; y < cv.height; y += 2) {
    const n = fbm2(y * 0.035, 3.1);
    if (n > 0.18) {
      c.globalAlpha = Math.min(0.9, (n - 0.18) * 3.5);
      const x0 = r() * w * 0.4;
      c.fillRect(x0 + w * 0.4, y, w * (0.2 + r() * 0.4), 1.2);
    }
  }
  for (let i = 0; i < w * 0.6; i++) {
    c.globalAlpha = 0.3 + r() * 0.5;
    c.beginPath();
    c.arc(r() * w, r() * cv.height, r() * 2.2 + 0.4, 0, Math.PI * 2);
    c.fill();
  }
  return cv;
}

function getIcon(name) {
  let ic = iconCache.get(name);
  if (ic) return ic;
  const ds = ICONS[name];
  if (!ds) {
    console.warn('missing icon', name);
    return null;
  }
  if (!measureSvg) {
    measureSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    measureSvg.style.cssText = 'position:absolute;width:0;height:0;visibility:hidden';
    document.body.appendChild(measureSvg);
  }
  ic = ds.map((d) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', d);
    measureSvg.appendChild(el);
    const len = el.getTotalLength();
    measureSvg.removeChild(el);
    return { path: new Path2D(d), len };
  });
  iconCache.set(name, ic);
  return ic;
}
