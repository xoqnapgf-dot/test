// Typography helpers for Canvas2D layers: font registry, vertical (tategaki) setting,
// per-character reveal styles. Font families are registered from assets/fonts.js.
import { clamp, ease, hash1 } from './util.js';

export const F = {
  mincho: 'KMincho',
  minchoB: 'KMinchoB',
  gothic: 'KGothic',
  brush: 'KBrush',
  syuku: 'KSyuku',
  black: 'KBlack',
  serif: 'KSerif',
  mono: 'KMono',
  dot: 'KDot',
};

export async function loadFonts() {
  const src = window.KAMINARE_FONTS || {};
  const jobs = Object.entries(src).map(async ([fam, b64]) => {
    try {
      const ff = new FontFace(fam, `url(data:font/woff2;base64,${b64})`);
      await ff.load();
      document.fonts.add(ff);
    } catch (e) {
      console.warn('font failed', fam, e);
    }
  });
  await Promise.all(jobs);
}

export const font = (fam, px, weight = '') => `${weight ? weight + ' ' : ''}${Math.round(px * 100) / 100}px ${fam}, "Hiragino Mincho ProN", "Yu Mincho", serif`;

// characters that need special handling in vertical setting
const SMALL = new Set('ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ');
const ROT = new Set('ー―…〜-—()（）「」『』[]');
const PUNCT = new Set('、。，．');

// Draw one glyph centred at (x,y) honouring vertical-writing conventions.
export function glyphV(c, ch, x, y, size) {
  if (ROT.has(ch)) {
    c.save();
    c.translate(x, y);
    c.rotate(Math.PI / 2);
    c.fillText(ch, 0, 0);
    c.restore();
  } else if (SMALL.has(ch)) {
    c.fillText(ch, x + size * 0.1, y - size * 0.1);
  } else if (PUNCT.has(ch)) {
    c.fillText(ch, x + size * 0.6, y - size * 0.55);
  } else c.fillText(ch, x, y);
}

// Layout positions for a vertical column. returns [{ch, x, y, i}] (spaces add a gap)
export function layoutV(text, x, y, size, track = 1.08) {
  const out = [];
  let yy = y;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === ' ' || ch === '　') {
      yy += size * 0.6;
      continue;
    }
    out.push({ ch, x, y: yy + size * 0.5, i });
    yy += size * track;
  }
  return out;
}
export function layoutH(c, text, x, y, size, track = 0, align = 'center') {
  const out = [];
  const ws = [...text].map((ch) => (ch === ' ' ? size * 0.45 : c.measureText(ch).width + track));
  const total = ws.reduce((a, b) => a + b, 0) - track;
  let xx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  [...text].forEach((ch, i) => {
    if (ch !== ' ') out.push({ ch, x: xx + ws[i] / 2, y, i, w: ws[i] });
    xx += ws[i];
  });
  out.total = total;
  return out;
}

// per-char reveal renderers. p: 0..1 appearance progress
export const REVEAL = {
  // ink soak: starts blurred & large, settles
  ink(c, g, p, size, vertical = true) {
    if (p <= 0) return;
    const e = ease.outCubic(p);
    c.save();
    c.globalAlpha *= clamp(p * 2.2);
    c.translate(g.x, g.y);
    const s = 1.18 - 0.18 * e;
    c.scale(s, s);
    if (p < 0.9) c.filter = `blur(${((1 - e) * size * 0.08).toFixed(1)}px)`;
    if (vertical) glyphV(c, g.ch, 0, 0, size);
    else c.fillText(g.ch, 0, 0);
    c.restore();
  },
  // slam: big & bright, punches in
  slam(c, g, p, size, vertical = false) {
    if (p <= 0) return;
    const e = ease.outExpo(p);
    c.save();
    c.globalAlpha *= clamp(p * 4);
    c.translate(g.x, g.y);
    const s = 1 + (1 - e) * 1.6;
    c.scale(s, s);
    if (vertical) glyphV(c, g.ch, 0, 0, size);
    else c.fillText(g.ch, 0, 0);
    c.restore();
  },
  // rise: slides up from a mask line
  rise(c, g, p, size, vertical = false) {
    if (p <= 0) return;
    const e = ease.outQuart(p);
    c.save();
    c.beginPath();
    c.rect(g.x - size, g.y - size * 0.62, size * 2, size * 1.24);
    c.clip();
    c.translate(g.x, g.y + (1 - e) * size * 1.1);
    if (vertical) glyphV(c, g.ch, 0, 0, size);
    else c.fillText(g.ch, 0, 0);
    c.restore();
  },
  // flicker in like a neon/strobe
  flick(c, g, p, size, vertical = false) {
    if (p <= 0) return;
    const on = p > 0.6 || hash1(Math.floor(p * 24) + g.i * 17) > 0.5;
    if (!on) return;
    c.save();
    c.translate(g.x, g.y);
    if (vertical) glyphV(c, g.ch, 0, 0, size);
    else c.fillText(g.ch, 0, 0);
    c.restore();
  },
};

// draw a lyric line glyph-by-glyph using its per-char timing
export function drawLine(c, line, glyphs, t, size, style = 'ink', vertical = true, dur = 0.22) {
  for (const g of glyphs) {
    const tc = line.c[g.i] ?? line.t0;
    const p = clamp((t - tc + 0.05) / dur);
    REVEAL[style](c, g, p, size, vertical);
  }
}

// a tiny bracketed caption in monospace with letter-spacing
export function caption(c, text, x, y, size, color, align = 'left', track = 0.22) {
  c.save();
  c.font = font(F.mono, size);
  c.fillStyle = color;
  c.textBaseline = 'middle';
  if ('letterSpacing' in c) {
    c.letterSpacing = `${size * track}px`;
    c.textAlign = align;
    c.fillText(text, x, y);
  } else {
    c.textAlign = align;
    c.fillText(text.split('').join(' '), x, y);
  }
  c.restore();
}
