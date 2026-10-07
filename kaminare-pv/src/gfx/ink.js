// Sumi brush engine. A stroke is rendered as a bundle of bristles that run out of ink
// along the path (kasure / "flying white"). Every plate is baked twice:
//   color canvas  — the finished ink image (alpha = ink)
//   time canvas   — per-pixel reveal time (0..1, earliest stroke wins) for draw-on animation.
import { rng, noise1, noise2, clamp, lerp } from '../core/util.js';

// Catmull-Rom resample of control points [[x,y,p?],...] to ~step px spacing
export function resample(pts, step = 2, closed = false) {
  const P = pts.map((p) => [p[0], p[1], p[2] ?? 1]);
  if (P.length < 2) return P;
  const out = [];
  const n = P.length;
  const get = (i) => (closed ? P[(i + n) % n] : P[clamp(i, 0, n - 1)]);
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const k = Math.max(1, Math.ceil(len / step));
    for (let j = 0; j < k; j++) {
      const t = j / k, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1]), lerp(p1[2], p2[2], t)]);
    }
  }
  if (!closed) out.push(P[n - 1].slice());
  else out.push(out[0].slice());
  return out;
}

const defaultPressure = (s) => {
  // quick press-in, body, tapering flick
  const a = clamp(s / 0.08);
  const b = clamp((1 - s) / 0.35);
  return (0.35 + 0.65 * Math.sin((a * Math.PI) / 2)) * (0.25 + 0.75 * Math.pow(b, 0.7));
};

export class InkPlate {
  constructor(w, h, { seed = 1, scale = 1 } = {}) {
    this.w = w;
    this.h = h;
    this.scale = scale; // backing resolution multiplier
    this.R = rng(seed);
    this.strokes = [];
    this.ops = []; // non-stroke ops (fills, stamps) with times
  }
  // pts: control points; opt: {w, t0, t1, dry, ink, color, pressure(s)->k, bristles, closed, spread}
  stroke(pts, opt = {}) {
    this.strokes.push({ pts, ...opt, kind: 'stroke' });
    return this;
  }
  // filled shape revealed as a whole between t0..t1 (radial/linear by "from")
  fill(path2dFn, opt = {}) {
    this.strokes.push({ fn: path2dFn, ...opt, kind: 'fill' });
    return this;
  }
  // dots / splatter
  splat(x, y, r, opt = {}) {
    this.strokes.push({ x, y, r, ...opt, kind: 'splat' });
    return this;
  }

  bake() {
    const S = this.scale;
    const W = Math.round(this.w * S), H = Math.round(this.h * S);
    const col = document.createElement('canvas');
    col.width = W;
    col.height = H;
    const tim = document.createElement('canvas');
    tim.width = W;
    tim.height = H;
    const c = col.getContext('2d');
    const tc = tim.getContext('2d');
    c.setTransform(S, 0, 0, S, 0, 0);
    tc.setTransform(S, 0, 0, S, 0, 0);
    tc.fillStyle = '#fff';
    tc.fillRect(0, 0, this.w, this.h);
    c.lineCap = 'round';
    c.lineJoin = 'round';
    tc.lineCap = 'round';
    tc.lineJoin = 'round';

    const bl = document.createElement('canvas');
    bl.width = W;
    bl.height = H;
    this._bleed = bl.getContext('2d');
    this._bleed.setTransform(S, 0, 0, S, 0, 0);
    this._bleed.lineCap = 'round';
    // colour pass in drawing order
    for (const st of this.strokes) {
      if (st.kind === 'stroke') this._drawStroke(c, st);
      else if (st.kind === 'fill') this._drawFill(c, st);
      else this._drawSplat(c, st);
    }
    if (this._bleedW) {
      c.save();
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.globalCompositeOperation = 'destination-over';
      c.filter = `blur(${Math.max(1.5, this._bleedW * 0.12 * S).toFixed(1)}px)`;
      c.drawImage(bl, 0, 0);
      c.restore();
    }
    this._bleed = null;
    // time pass in reverse order so the earliest time wins
    for (let i = this.strokes.length - 1; i >= 0; i--) {
      const st = this.strokes[i];
      if (st.kind === 'stroke') this._timeStroke(tc, st);
      else if (st.kind === 'fill') this._timeFill(tc, st);
      else this._timeSplat(tc, st);
    }
    this.color = col;
    this.time = tim;
    return this;
  }

  _path(st) {
    if (!st._rs) st._rs = resample(st.pts, 1.6, st.closed);
    return st._rs;
  }

  _drawStroke(c, st) {
    const R = this.R;
    const pts = this._path(st);
    const n = pts.length;
    if (n < 2) return;
    const Wd = st.w ?? 12;
    const press = st.pressure || defaultPressure;
    const dry = st.dry ?? 0.5; // 0 wet .. 1 very dry
    const ink = st.ink ?? 1; // ink tone: 1 = 濃墨 (dense) .. 0.3 = 淡墨 (diluted)
    const color = st.color || '#100d0c';
    const nb = st.bristles ?? Math.round(clamp(Wd * 0.85, 8, 110));
    const hasP = st.pts[0][2] !== undefined;
    const L = [0];
    for (let i = 1; i < n; i++) L[i] = L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    const total = L[n - 1] || 1;
    const N = pts.map((p, i) => {
      const a = pts[Math.max(0, i - 2)], b = pts[Math.min(n - 1, i + 2)];
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const l = Math.hypot(dx, dy) || 1;
      return [-dy / l, dx / l];
    });
    const width = (i) => Wd * press(L[i] / total) * (hasP ? pts[i][2] : 1) * (st.spread ?? 1);
    const seed = R.int(0, 1e6);

    // 1) wet underlayer (nijimi) — accumulated, blurred once per plate
    const bleed = st.bleed ?? 0.35;
    if (bleed > 0 && this._bleed) {
      const b = this._bleed;
      b.save();
      b.globalAlpha = 0.13 * bleed * ink * clamp(1.1 - dry);
      b.strokeStyle = color;
      for (let i = 1; i < n; i += 2) {
        const s = L[i] / total;
        b.lineWidth = width(i) * (1.0 + 0.25 * (1 - s));
        b.beginPath();
        b.moveTo(pts[i - 1][0], pts[i - 1][1]);
        b.lineTo(pts[Math.min(n - 1, i + 1)][0], pts[Math.min(n - 1, i + 1)][1]);
        b.stroke();
      }
      b.restore();
      this._bleedW = Math.max(this._bleedW || 0, Math.min(Wd, 60));
    }

    c.save();
    c.strokeStyle = color;
    c.fillStyle = color;
    // 2) body: one translucent polygon (no overlap build-up) so bristles sit on a tone
    const body = (st.body ?? 0.92) * ink * clamp(1 - dry * 1.4);
    if (body > 0.02) {
      const left = [], right = [];
      for (let i = 0; i < n; i += 2) {
        const s = L[i] / total;
        const w = width(i) * 0.5 * 0.86 * clamp(1 - Math.pow(s, 2) * dry);
        left.push([pts[i][0] + N[i][0] * w, pts[i][1] + N[i][1] * w]);
        right.push([pts[i][0] - N[i][0] * w, pts[i][1] - N[i][1] * w]);
      }
      c.globalAlpha = body;
      c.beginPath();
      c.moveTo(left[0][0], left[0][1]);
      for (const q of left) c.lineTo(q[0], q[1]);
      for (let k = right.length - 1; k >= 0; k--) c.lineTo(right[k][0], right[k][1]);
      c.closePath();
      c.fill();
      const w0 = width(Math.min(n - 1, 2)) * 0.43;
      if (w0 > 1) {
        c.beginPath();
        c.arc(pts[0][0], pts[0][1], w0, 0, Math.PI * 2);
        c.fill();
      }
    }
    // press-in blob at the start (brush lands)
    if ((st.blob ?? 0) > 0 && Wd > 8) {
      const w0 = width(Math.min(n - 1, 3));
      c.globalAlpha = 0.9 * ink;
      c.beginPath();
      const a0 = Math.atan2(N[0][1], N[0][0]);
      c.ellipse(pts[0][0], pts[0][1], w0 * 0.5, w0 * 0.42, a0, 0, Math.PI * 2);
      c.fill();
    }

    // 3) bristles with dry-brush streaks (kasure)
    const bw = Math.max(0.6, (Wd / nb) * 1.7);
    for (let j = 0; j < nb; j++) {
      const off = (j / (nb - 1)) * 2 - 1 + (R() - 0.5) * (2.2 / nb);
      const edge = Math.abs(off);
      const load = 0.7 + 0.3 * R();
      const thirst = (0.5 + R()) * (0.65 + edge * 0.8); // how quickly this hair runs dry
      const fq = 0.0035 + R() * 0.011; // long streaks
      const fq2 = 0.03 + R() * 0.05; // small breaks
      const bs = seed + j * 13;
      const tone = (0.82 + 0.18 * R()) * ink;
      c.lineWidth = bw * (0.75 + R() * 0.5);
      let drawing = false, cnt = 0;
      for (let i = 0; i < n; i++) {
        const s = L[i] / total;
        const w = width(i);
        if (w < 0.4) {
          if (drawing) { c.stroke(); drawing = false; }
          continue;
        }
        const sway = noise1(L[i] * 0.006 + j * 3.1, bs) * 0.06;
        const x = pts[i][0] + N[i][0] * (off + sway) * w * 0.5;
        const y = pts[i][1] + N[i][1] * (off + sway) * w * 0.5;
        const thr = clamp(dry * thirst * (0.22 + 1.05 * Math.pow(s, 1.2)) + (1 - load) * 0.35 - 0.06);
        const nz = (noise2(L[i] * 0.0055, off * 2.6, seed) * 0.62 + noise2(L[i] * 0.022, off * 9, seed + 3) * 0.28 + noise1(L[i] * fq2, bs + 7) * 0.1) * 0.5 + 0.5;
        const vis = nz > thr;
        if (vis) {
          if (!drawing) {
            c.beginPath();
            c.moveTo(x, y);
            drawing = true;
            cnt = 0;
            c.globalAlpha = clamp(tone * (0.75 + (nz - thr) * 2));
          } else c.lineTo(x, y);
        } else if (drawing) {
          c.stroke();
          drawing = false;
        }
      }
      if (drawing) c.stroke();
    }
    // 4) spatter at the landing point
    const sp = st.spatter ?? 0;
    if (sp > 0) {
      for (let k = 0; k < sp * 14; k++) {
        const i = Math.floor(R() * Math.min(n, 40));
        const a = R() * Math.PI * 2, d = Wd * (0.55 + R() * 1.6);
        c.globalAlpha = (0.5 + R() * 0.5) * ink;
        c.beginPath();
        c.arc(pts[i][0] + Math.cos(a) * d, pts[i][1] + Math.sin(a) * d, R() * Wd * 0.07 + 0.5, 0, Math.PI * 2);
        c.fill();
      }
    }
    c.restore();
  }

  _timeStroke(tc, st) {
    const pts = this._path(st);
    const n = pts.length;
    if (n < 2) return;
    const Wd = st.w ?? 12;
    const press = st.pressure || defaultPressure;
    const L = [0];
    for (let i = 1; i < n; i++) L[i] = L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    const total = L[n - 1] || 1;
    const t0 = st.t0 ?? 0, t1 = st.t1 ?? 1;
    for (let i = n - 1; i >= 1; i--) {
      const s = L[i] / total;
      const v = clamp(lerp(t0, t1, s));
      const g = Math.round(v * 254);
      tc.strokeStyle = `rgb(${g},${g},${g})`;
      const pr = Math.max(press(s), 0.15) * (st.pts[0][2] !== undefined ? pts[i][2] : 1);
      tc.lineWidth = Wd * pr * (st.spread ?? 1) * 1.35 + 6;
      tc.beginPath();
      tc.moveTo(pts[i][0], pts[i][1]);
      tc.lineTo(pts[i - 1][0], pts[i - 1][1]);
      tc.stroke();
    }
  }

  _drawFill(c, st) {
    c.save();
    c.fillStyle = st.color || '#100d0c';
    c.globalAlpha = st.alpha ?? 1;
    if (st.blur) c.filter = `blur(${st.blur}px)`;
    st.fn(c, this.R);
    c.restore();
  }
  _timeFill(tc, st) {
    // radial or linear reveal: draw concentric/scan bands of increasing time
    const t0 = st.t0 ?? 0, t1 = st.t1 ?? 1;
    const [bx0, by0, bw0, bh0] = st.bounds || [0, 0, this.w, this.h];
    const steps = Math.max(6, Math.min(48, Math.round(Math.max(bw0, bh0) / 6)));
    void bx0, by0;
    tc.save();
    tc.beginPath();
    st.fn(new PathProxy(tc), this.R, true);
    tc.clip();
    const [bx, by, bw, bh] = st.bounds || [0, 0, this.w, this.h];
    for (let k = steps - 1; k >= 0; k--) {
      const v = clamp(lerp(t0, t1, k / (steps - 1)));
      const g = Math.round(v * 254);
      tc.fillStyle = `rgb(${g},${g},${g})`;
      if (st.from === 'center') {
        const cx = bx + bw / 2, cy = by + bh / 2;
        const r = (Math.hypot(bw, bh) / 2) * ((k + 1) / steps);
        tc.beginPath();
        tc.arc(cx, cy, r, 0, Math.PI * 2);
        tc.fill();
      } else if (st.from === 'top') {
        tc.fillRect(bx - 4, by - 4, bw + 8, ((bh + 8) * (k + 1)) / steps);
      } else {
        // left->right
        tc.fillRect(bx - 4, by - 4, ((bw + 8) * (k + 1)) / steps, bh + 8);
      }
    }
    tc.restore();
  }
  _drawSplat(c, st) {
    const R = this.R;
    c.save();
    c.fillStyle = st.color || '#100d0c';
    const n = st.n ?? 18;
    for (let k = 0; k < n; k++) {
      const a = R() * Math.PI * 2, d = st.r * Math.pow(R(), 0.6);
      c.globalAlpha = 0.6 + R() * 0.4;
      c.beginPath();
      c.arc(st.x + Math.cos(a) * d, st.y + Math.sin(a) * d, (st.dot ?? 3) * (0.3 + R()), 0, Math.PI * 2);
      c.fill();
    }
    c.restore();
  }
  _timeSplat(tc, st) {
    const g = Math.round(clamp(st.t0 ?? 0) * 254);
    tc.fillStyle = `rgb(${g},${g},${g})`;
    tc.beginPath();
    tc.arc(st.x, st.y, st.r + 10, 0, Math.PI * 2);
    tc.fill();
  }
}

// lets fill callbacks call ctx path methods without filling twice in time pass
class PathProxy {
  constructor(ctx) {
    this.ctx = ctx;
  }
  beginPath() {}
  fill() {}
  stroke() {}
  save() { this.ctx.save(); }
  restore() { this.ctx.restore(); }
  translate(...a) { this.ctx.translate(...a); }
  rotate(...a) { this.ctx.rotate(...a); }
  scale(...a) { this.ctx.scale(...a); }
  set fillStyle(v) {}
  set strokeStyle(v) {}
  set lineWidth(v) {}
  set globalAlpha(v) {}
  set filter(v) {}
  moveTo(...a) { this.ctx.moveTo(...a); }
  lineTo(...a) { this.ctx.lineTo(...a); }
  arc(...a) { this.ctx.arc(...a); }
  ellipse(...a) { this.ctx.ellipse(...a); }
  bezierCurveTo(...a) { this.ctx.bezierCurveTo(...a); }
  quadraticCurveTo(...a) { this.ctx.quadraticCurveTo(...a); }
  closePath() { this.ctx.closePath(); }
  rect(...a) { this.ctx.rect(...a); }
}
