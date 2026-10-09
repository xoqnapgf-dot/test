// Overlay drawn on top of every frame: ledger tabs, chapter mark, timecode, subtitles.
import { F, font, tracking, wrap } from './type.js';
import { C, LEDGER, rgba } from './style.js';
import { lineAt, CHAPTERS } from './narr.js';
import { clamp } from './util.js';

const pad = (n) => String(Math.floor(n)).padStart(2, '0');

export function drawOverlay(c, t, fx, app) {
  const hud = fx.hud ?? 1;
  if (hud > 0.001 && !app.hideHud) {
    c.save();
    c.globalAlpha = hud;
    // top-left: series mark + chapter
    const { ch, idx } = app.chapterAt(t);
    c.fillStyle = C.ink;
    c.textBaseline = 'middle';
    c.font = font(F.serif, 22);
    c.fillText('破坏的账本', 64, 62);
    c.fillStyle = C.dim;
    c.font = font(F.mono, 15);
    tracking(c, 2);
    c.fillText(`${ch[1]}  ${ch[2]}`, 200, 63);
    tracking(c, 0);
    // progress ticks for chapters
    for (let k = 0; k < CHAPTERS.length; k++) {
      c.fillStyle = k === idx ? C.ink : k < idx ? C.dim : C.faint;
      c.fillRect(64 + k * 14, 84, 9, 2);
    }
    // top-right: ledger tabs (which quantity is in play)
    const active = fx.ledger ?? -1;
    let x = 1856;
    c.textAlign = 'right';
    for (let k = LEDGER.length - 1; k >= 0; k--) {
      const L = LEDGER[k];
      const on = Array.isArray(active) ? active.includes(k) : active === k;
      c.font = font(on ? F.sansB : F.sans, 15);
      const w = c.measureText(L.name).width;
      c.fillStyle = on ? L.col : C.faint;
      c.fillText(L.name, x, 62);
      c.fillRect(x - w, 76, w, on ? 3 : 1);
      if (on) {
        c.font = font(F.mono, 12);
        c.fillStyle = rgba(L.col, 0.85);
        c.fillText(L.unit, x, 94);
      }
      x -= w + 26;
    }
    c.textAlign = 'left';
    // bottom-right timecode
    c.fillStyle = C.faint;
    c.font = font(F.mono, 13);
    c.textAlign = 'right';
    c.fillText(`${pad(t / 60)}:${pad(t % 60)}`, 1856, 1040);
    c.textAlign = 'left';
    c.restore();
  }

  // subtitles
  const l = lineAt(t);
  const subA = fx.subs ?? 1;
  if (l && subA > 0.001 && !app.hideSubs) {
    const a = clamp((t - (l.t0 - 0.12)) / 0.18) * clamp((l.t1 + 0.3 - t) / 0.2) * subA;
    c.save();
    c.globalAlpha = a;
    c.font = font(F.sansM, 34);
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    const lines = wrap(c, l.show, 1380);
    const y0 = 1000 - (lines.length - 1) * 48;
    lines.forEach((s, k) => {
      const y = y0 + k * 48;
      c.shadowColor = 'rgba(0,0,0,0.85)';
      c.shadowBlur = 14;
      c.lineWidth = 5;
      c.strokeStyle = 'rgba(6,7,10,0.55)';
      c.lineJoin = 'round';
      c.strokeText(s, 960, y);
      c.shadowBlur = 0;
      c.fillStyle = '#f4f0e6';
      c.fillText(s, 960, y);
    });
    c.restore();
  }
}
