// Music-time helpers: beat grid, section map, envelopes, onsets and lyrics.
// All analysis lives in data/audio-data.js (generated offline from the track).
import { DURATION, BEAT, OFFSET, FPS, NCH, ENV_B64, KICKS, SNARES, LYRICS } from '../data/audio-data.js';
import { clamp } from './util.js';

export { DURATION, BEAT, OFFSET, LYRICS };

// beat k -> seconds. 172 BPM; 8 beats = one bar of the half-time feel (2.79 s)
export const B = (k) => OFFSET + k * BEAT;
export const beatF = (t) => (t - OFFSET) / BEAT; // fractional beat index
export const beatPhase = (t) => {
  const b = beatF(t);
  return b - Math.floor(b);
};
// pulse that peaks at every beat and decays (k: sharpness)
export const beatPulse = (t, div = 1, k = 6) => {
  const b = beatF(t) / div;
  const ph = b - Math.floor(b);
  return b < 0 ? 0 : Math.exp(-ph * k);
};

export const SEC = {
  intro: [0, B(32)],
  v1: [B(32), B(64)],
  pre1: [B(64), B(96)],
  ch1: [B(96), B(160)],
  post: [B(160), B(188)],
  v2: [B(188), B(240)],
  pre2: [B(240), B(272)],
  ch2: [B(272), B(336)],
  inter: [B(336), B(368)],
  solo: [B(368), B(394)],
  freeze: [B(394), B(400)],
  bridge: [B(400), B(432)],
  fc: [B(432), B(496)],
  outro: [B(496), DURATION],
};
export const GONG = B(15); // 5.30 s
export const CHAPTERS = [
  ['intro', 'INTRO', '序'],
  ['v1', 'VERSE I', '壱'],
  ['pre1', 'PRE', '昇'],
  ['ch1', 'CHORUS', '神鳴'],
  ['post', 'POST', '拍'],
  ['v2', 'VERSE II', '弐'],
  ['pre2', 'PRE', '昇'],
  ['ch2', 'CHORUS', '神鳴'],
  ['inter', 'INTERLUDE', '縄'],
  ['solo', 'SOLO', '鳩'],
  ['bridge', 'BRIDGE', '燈'],
  ['fc', 'FINAL', '神鳴'],
  ['outro', 'OUTRO', '鐘'],
];

// ---- envelopes (0 kick, 1 snare, 2 hats, 3 bass, 4 vocal, 5 loudness)
const raw = (() => {
  const s = atob(ENV_B64);
  const a = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
  return a;
})();
const NF = Math.floor(raw.length / NCH);
export function env(ch, t) {
  const f = clamp(t * FPS, 0, NF - 1.001);
  const i = Math.floor(f);
  const u = f - i;
  return (raw[i * NCH + ch] * (1 - u) + raw[(i + 1) * NCH + ch] * u) / 255;
}
export const kick = (t) => env(0, t);
export const snare = (t) => env(1, t);
export const hats = (t) => env(2, t);
export const bass = (t) => env(3, t);
export const vocal = (t) => env(4, t);
export const loud = (t) => env(5, t);

// ---- onset events
function lastBefore(arr, t) {
  let lo = 0,
    hi = arr.length - 1,
    r = -1;
  while (lo <= hi) {
    const m = (lo + hi) >> 1;
    if (arr[m] <= t) {
      r = m;
      lo = m + 1;
    } else hi = m - 1;
  }
  return r;
}
export const kickIndex = (t) => lastBefore(KICKS, t);
export const snareIndex = (t) => lastBefore(SNARES, t);
export const sinceKick = (t) => {
  const i = lastBefore(KICKS, t);
  return i < 0 ? 99 : t - KICKS[i];
};
export const sinceSnare = (t) => {
  const i = lastBefore(SNARES, t);
  return i < 0 ? 99 : t - SNARES[i];
};
export const kickHit = (t, k = 9) => Math.exp(-sinceKick(t) * k);
export const snareHit = (t, k = 9) => Math.exp(-sinceSnare(t) * k);
export const KICK_TIMES = KICKS;
export const SNARE_TIMES = SNARES;

// ---- lyrics
// each line: {sec, text, t0, t1, c:[per-char time]} ; spaces have times too
export const lines = (sec) => LYRICS.filter((l) => l.sec === sec);
export function lineAt(t, sec) {
  const ls = sec ? lines(sec) : LYRICS;
  let cur = null;
  for (const l of ls) if (t >= l.t0 - 0.05) cur = l;
  return cur;
}
// visible character count for a line at time t (fractional, for soft reveals)
export function charsShown(line, t, lead = 0.04) {
  let n = 0;
  for (let i = 0; i < line.c.length; i++) if (t >= line.c[i] - lead) n = i + 1;
  return n;
}
// progress [0..1] of char i appearing (0 before its time, 1 after dur)
export const charP = (line, i, t, dur = 0.18, lead = 0.05) =>
  clamp((t - (line.c[i] - lead)) / dur);
// end of singing for a line ≈ last char time + small tail
export const lineEnd = (line) => line.c[line.c.length - 1] + 0.35;
