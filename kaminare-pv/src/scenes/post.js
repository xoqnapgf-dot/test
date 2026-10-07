// POST-CHORUS — "(さあ さあ) 四拍子の中 誰もが平等". A Swiss-grid poster in black,
// vermilion and gold: the bar is four columns, every beat lights one, and finally every
// symbol stands in one row separated by equals signs.
import { Layer2D, Paper } from './base.js';
import { lines, SEC, beatF, beatPulse, kickHit, snareHit, B } from '../core/music.js';
import { F, font, layoutH, REVEAL, caption } from '../core/type.js';
import { gloss } from '../core/lyrics-meta.js';
import { SYMBOLS, SYMBOL_KEYS, drawSym } from '../gfx/symbols.js';
import { MEMBER_COLORS } from './intro.js';
import { clamp, lerp, ease, ep, TAU, hash1 } from '../core/util.js';

const CRASH = [57.97, 58.67, 59.02, 59.37, 59.71];

export class Post {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.bg = new Paper('#141012', '#141012');
    this.l = new Layer2D(0);
    this.g = new Layer2D(1);
    this.ls = lines('post');
  }
  render(t, rt) {
    const r = this.app.renderer;
    this.bg.draw(r, rt, { dark: 0.55, zoom: 1.4 });
    const c = this.l.begin();
    const g = this.g.begin();
    const [sa, eq] = this.ls;
    const bf = beatF(t);
    const beat = ((Math.floor(bf) % 4) + 4) % 4;
    const ph = bf - Math.floor(bf);
    const shu = '#e3402a', gold = '#f2c766', paper = '#efe6d6';

    // grid lines (always)
    c.save();
    c.strokeStyle = 'rgba(239,230,214,0.12)';
    c.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      c.beginPath();
      c.moveTo(i * 480, 0);
      c.lineTo(i * 480, 1080);
      c.stroke();
    }
    c.beginPath();
    c.moveTo(0, 540);
    c.lineTo(1920, 540);
    c.stroke();
    c.restore();

    // the beat column
    const colA = (1 - ph) * 0.85;
    c.save();
    c.fillStyle = beat === 0 ? shu : 'rgba(239,230,214,0.09)';
    c.globalAlpha = beat === 0 ? colA : colA * 1.4;
    c.fillRect(beat * 480, 0, 480, 1080);
    c.restore();

    // giant numerals 1-4
    c.save();
    c.font = font(F.gothic, 520);
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    for (let i = 0; i < 4; i++) {
      const on = i === beat;
      c.lineWidth = 2;
      c.strokeStyle = on ? paper : 'rgba(239,230,214,0.18)';
      c.fillStyle = on ? paper : 'transparent';
      const s = on ? 1 + (1 - ph) * 0.06 : 1;
      c.save();
      c.translate(i * 480 + 240, 560);
      c.scale(s, s);
      if (on && t < eq.t0 - 0.2) {
        c.globalAlpha = 0.18 + (1 - ph) * 0.2;
        c.fillText(String(i + 1), 0, 0);
      } else c.strokeText(String(i + 1), 0, 0);
      c.restore();
    }
    c.restore();

    // ---- (さあ さあ) call & response with crash flashes
    let crashF = 0;
    for (const ct of CRASH) if (t >= ct && t < ct + 0.4) crashF = Math.max(crashF, 1 - (t - ct) / 0.4);
    if (t > sa.t0 - 0.3 && t < eq.t0) {
      const out = 1 - ep(eq.t0 - 0.4, eq.t0, t);
      c.save();
      c.globalAlpha = out;
      c.font = font(F.gothic, 300);
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillStyle = paper;
      const parts = [['さあ', 0, 560, 0], ['さあ', 3, 1360, 3]];
      for (const [w, off, x] of parts) {
        const p = clamp((t - sa.c[off] + 0.05) / 0.2);
        if (p <= 0) continue;
        const gl = layoutH(c, w, x, 520, 300, -10);
        gl.forEach((gg) => REVEAL.slam(c, gg, p, 300, false));
      }
      caption(c, '( CALL & RESPONSE )', 960, 800, 16, 'rgba(239,230,214,0.6)', 'center', 0.5);
      c.restore();
      // penlights up from below on each call
      g.save();
      for (let i = 0; i < 40; i++) {
        const x = (i + 0.5) * 48;
        const up = Math.max(clamp((t - sa.c[0]) / 0.3), 0) * (0.6 + 0.4 * Math.sin(t * 6 + i));
        const ang = Math.sin(t * 5 + i * 0.7) * 0.4;
        g.strokeStyle = MEMBER_COLORS[i % 5];
        g.globalAlpha = 0.8 * out;
        g.lineWidth = 7;
        g.lineCap = 'round';
        g.beginPath();
        g.moveTo(x, 1100);
        g.lineTo(x + Math.sin(ang) * 160 * up, 1100 - Math.cos(ang) * 160 * up);
        g.stroke();
      }
      g.restore();
    }

    // ---- 四拍子の中 → 誰もが平等 : symbols in the bar, then one row with ＝
    if (t > eq.t0 - 0.3) {
      const rowE = ep(eq.c[6] - 0.3, eq.c[6] + 0.6, t, ease.inOutCubic); // 誰
      for (let k = 0; k < 8; k++) {
        const col = k % 4, row = Math.floor(k / 4);
        const gx = col * 480 + 240, gy = row ? 760 : 330;
        const ex = 960 + (k - 3.5) * 205, ey = 560;
        const x = lerp(gx, ex, rowE), y = lerp(gy, ey, rowE);
        const lit = rowE > 0.9 ? 1 : col === beat ? 1 - ph * 0.6 : 0.25;
        const p = ep(eq.t0 + k * 0.05 - 0.2, eq.t0 + k * 0.05 + 0.2, t, ease.outBack);
        c.save();
        c.globalAlpha = clamp(p) * lit;
        c.fillStyle = rowE > 0.9 ? gold : paper;
        c.strokeStyle = c.fillStyle;
        drawSym(c, SYMBOLS[SYMBOL_KEYS[k]], x, y, lerp(95, 72, rowE) * p, 0);
        c.restore();
        if (rowE > 0.6 && k < 7) {
          c.save();
          c.globalAlpha = (rowE - 0.6) / 0.4;
          c.fillStyle = shu;
          c.font = font(F.gothic, 64);
          c.textAlign = 'center';
          c.textBaseline = 'middle';
          c.fillText('＝', ex + 102, ey + 4);
          c.restore();
        }
      }
      // lyric
      c.save();
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillStyle = paper;
      c.font = font(F.mincho, 86);
      const a = layoutH(c, '四拍子の中', 960, 150, 86, 20);
      a.forEach((gg) => REVEAL.rise(c, gg, clamp((t - eq.c[gg.i] + 0.05) / 0.25), 86));
      c.font = font(F.gothic, 150);
      const b = layoutH(c, '誰もが平等', 960, 870, 150, 10);
      b.forEach((gg) => {
        gg.i += 6;
        c.fillStyle = gg.i >= 9 ? shu : paper;
        REVEAL.slam(c, gg, clamp((t - eq.c[gg.i] + 0.04) / 0.2), 150, false);
      });
      c.font = font(F.serif, 28);
      if ('letterSpacing' in c) c.letterSpacing = '8px';
      c.fillStyle = 'rgba(239,230,214,0.75)';
      c.globalAlpha = clamp((t - eq.c[6]) * 2);
      c.fillText(gloss(eq).toUpperCase(), 960, 990);
      c.restore();
    }
    // bar counter
    caption(c, `4 / 4   ·   BEAT ${beat + 1}`, 960, 60, 14, 'rgba(239,230,214,0.55)', 'center', 0.5);

    this.g.draw(r, rt, { boost: 1.8 });
    this.l.draw(r, rt, {});
    return {
      hudInk: 'light', bloom: 0.6, bloomThresh: 0.9, grain: 0.06, vig: 0.5, flash: crashF * 0.22, flashCol: 0xe3402a,
      ca: 0.002 + kickHit(t, 10) * 0.004, contrast: 1.1,
    };
  }
}
