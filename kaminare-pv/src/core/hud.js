// The thin editorial HUD that frames the whole video: crop marks, timecode,
// bar/beat counter, chapter seal. Colours adapt to the scene (fx.hudInk: 'dark'|'light').
import { font, F, caption } from './type.js';
import { beatF, BEAT, LYRICS } from './music.js';
import { clamp } from './util.js';

const pad = (n, k = 2) => String(Math.floor(n)).padStart(k, '0');

export function drawHud(c, t, fx, app) {
  const dark = fx.hudInk === 'dark';
  const col = dark ? 'rgba(20,14,12,0.78)' : 'rgba(240,232,216,0.82)';
  const dim = dark ? 'rgba(20,14,12,0.42)' : 'rgba(240,232,216,0.42)';
  const shu = fx.hudShu || '#e3402a';
  const M = 46; // margin
  c.save();
  c.lineWidth = 1.4;
  c.strokeStyle = dim;
  // crop marks
  const L = 22;
  for (const [x, y, sx, sy] of [
    [M, M, 1, 1],
    [1920 - M, M, -1, 1],
    [M, 1080 - M, 1, -1],
    [1920 - M, 1080 - M, -1, -1],
  ]) {
    c.beginPath();
    c.moveTo(x - sx * 10, y);
    c.lineTo(x + sx * L, y);
    c.moveTo(x, y - sy * 10);
    c.lineTo(x, y + sy * L);
    c.stroke();
  }
  // registration target top-center
  c.beginPath();
  c.arc(960, M, 7, 0, Math.PI * 2);
  c.moveTo(948, M);
  c.lineTo(972, M);
  c.moveTo(960, M - 12);
  c.lineTo(960, M + 12);
  c.stroke();

  // top-left title
  c.fillStyle = col;
  c.textBaseline = 'middle';
  c.font = font(F.mincho, 22);
  c.fillText('カミナレ', M + 34, M + 2);
  caption(c, 'KAMINARE  /  神鳴れ', M + 140, M + 2, 13, dim);

  // top-right timecode + bar/beat
  const fps = 24;
  const tc = `${pad(t / 60)}:${pad(t % 60)}:${pad((t % 1) * fps)}`;
  caption(c, tc, 1920 - M - 34, M + 2, 15, col, 'right', 0.18);
  const b = Math.max(0, Math.floor(beatF(t)));
  const bar = Math.floor(b / 4) + 1;
  caption(c, `BPM 172  ·  BAR ${pad(bar, 3)}.${(b % 4) + 1}`, 1920 - M - 34, M + 30, 12, dim, 'right');

  // bottom-left chapter seal
  const ch = app.chapterAt(t);
  const sx = M + 34, sy = 1080 - M - 36;
  c.fillStyle = shu;
  c.globalAlpha = 0.92;
  const sw = ch[2].length > 1 ? 58 : 40;
  c.fillRect(sx, sy - 20, sw, 40);
  c.globalAlpha = 1;
  c.fillStyle = '#f6efe2';
  c.font = font(F.mincho, ch[2].length > 1 ? 21 : 24);
  c.textAlign = 'center';
  c.fillText(ch[2], sx + sw / 2, sy + 1);
  c.textAlign = 'left';
  caption(c, ch[1], sx + sw + 16, sy - 7, 13, col);
  // lyric counter
  let li = 0;
  for (let i = 0; i < LYRICS.length; i++) if (t >= LYRICS[i].t0) li = i + 1;
  caption(c, `LINE ${pad(li)}/${LYRICS.length}`, sx + sw + 16, sy + 13, 11, dim);

  // bottom-right beat dots (4/4)
  const ph = beatF(t);
  const cur = Math.floor(ph) % 4;
  for (let i = 0; i < 4; i++) {
    const x = 1920 - M - 34 - (3 - i) * 22, y = 1080 - M - 30;
    const on = i === cur && ph >= 0;
    const k = on ? clamp(1 - (ph - Math.floor(ph)) * 1.5) : 0;
    c.beginPath();
    c.arc(x, y, 4 + k * 3, 0, Math.PI * 2);
    c.fillStyle = on ? shu : dim;
    c.fill();
  }
  caption(c, `${(BEAT * 1000).toFixed(0)} MS / BEAT`, 1920 - M - 34, 1080 - M - 6, 11, dim, 'right');
  c.restore();
}
