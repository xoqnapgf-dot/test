// Fonts and small typographic helpers for the Canvas2D layers.
import { clamp, ease } from './util.js';

export const F = {
  sans: 'KSans',
  sansM: 'KSansM',
  sansB: 'KSansB',
  serif: 'KSerif',
  serifH: 'KSerifH',
  mono: 'KMono',
  monoB: 'KMonoB',
  gro: 'KGro',
};

export async function loadFonts() {
  const src = window.EXPLAINER_FONTS || {};
  await Promise.all(
    Object.entries(src).map(async ([fam, b64]) => {
      try {
        const ff = new FontFace(fam, `url(data:font/woff2;base64,${b64})`);
        await ff.load();
        document.fonts.add(ff);
      } catch (e) {
        console.warn('font failed', fam, e);
      }
    })
  );
}

export const font = (fam, px) => `${Math.round(px * 100) / 100}px ${fam}, "PingFang SC", "Microsoft YaHei", sans-serif`;

export function tracking(c, px) {
  if ('letterSpacing' in c) c.letterSpacing = `${px}px`;
}

// text with a reveal: p 0..1, slides up from a mask and fades in
export function revealText(c, txt, x, y, p, opts = {}) {
  if (p <= 0) return;
  const e = ease.outCubic(clamp(p));
  c.save();
  c.globalAlpha *= clamp(p * 1.6);
  const dy = (1 - e) * (opts.rise ?? 18);
  c.fillText(txt, x, y + dy);
  c.restore();
}

// typewriter of a string: shows n characters as p goes 0..1
export function typeText(c, txt, x, y, p) {
  const n = Math.floor(clamp(p) * txt.length + 0.0001);
  if (n <= 0) return;
  c.fillText(txt.slice(0, n), x, y);
}

// wrap a string to a max width (CJK-aware: breaks between any characters)
export function wrap(c, txt, maxW) {
  const out = [];
  let cur = '';
  // tokens: a run of Latin letters/digits/number punctuation stays on one line (e.g. "1200", "J/cc")
  const toks = txt.match(/[A-Za-z0-9.,%/≈≥≤×²³⁰¹⁴⁵⁶⁷⁸⁹⁻–\-]+|[\s\S]/g) || [];
  for (const ch of toks) {
    const test = cur + ch;
    if (c.measureText(test).width > maxW && cur) {
      // avoid starting a line with punctuation
      if ('，。、：；！？）」”’'.includes(ch)) {
        cur += ch;
        out.push(cur);
        cur = '';
        continue;
      }
      out.push(cur);
      cur = ch;
    } else cur = test;
  }
  if (cur) out.push(cur);
  return out;
}

// format numbers like 2.49×10³²
const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
export const sup = (n) => String(n).split('').map((d) => SUP[d] ?? d).join('');
export const sci = (m, e) => (m === 1 ? `10${sup(e)}` : `${m}×10${sup(e)}`);
