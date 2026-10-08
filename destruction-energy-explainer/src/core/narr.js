// Narration clock helpers. Every visual cue is anchored to what the narrator is saying:
// a line's start/end, or the moment a given word inside a line is spoken.
import { TOTAL, SCENES } from '../data/timeline.js';
import { clamp } from './util.js';

export { TOTAL, SCENES };

const byId = {};
for (const s of SCENES) {
  byId[s.id] = s;
  // map every character of the spoken text to a time using the word boundaries
  for (const l of s.lines) {
    const times = new Array(l.say.length).fill(null);
    let pos = 0;
    for (let k = 0; k < l.words.length; k++) {
      const w = l.words[k];
      const at = l.say.indexOf(w.w, pos);
      if (at < 0) continue;
      const next = l.words[k + 1] ? l.words[k + 1].t : w.t + 0.25 * w.w.length;
      for (let j = 0; j < w.w.length; j++) times[at + j] = w.t + ((next - w.t) * j) / w.w.length;
      pos = at + w.w.length;
    }
    // fill gaps (punctuation) with the previous known time
    let last = l.t0;
    for (let j = 0; j < times.length; j++) {
      if (times[j] === null) times[j] = last;
      else last = times[j];
    }
    l.ct = times;
  }
}

export const scene = (id) => byId[id];
export const line = (id, i) => byId[id].lines[i];
// time at which `kw` (a substring of the spoken text) starts being said
export function cue(id, i, kw, off = 0) {
  const l = byId[id].lines[i];
  if (!kw) return l.t0 + off;
  const at = l.say.indexOf(kw);
  if (at < 0) {
    console.warn('cue not found', id, i, kw);
    return l.t0 + off;
  }
  return l.ct[at] + off;
}
export const lineEnd = (id, i) => byId[id].lines[i].t1;
export function sceneAt(t) {
  let cur = SCENES[0];
  for (const s of SCENES) if (t >= s.t0) cur = s;
  return cur;
}
export function lineAt(t) {
  for (const s of SCENES) for (const l of s.lines) if (t >= l.t0 - 0.12 && t <= l.t1 + 0.3) return l;
  return null;
}
// progress helper anchored on a cue
export const after = (t, at, dur = 0.6) => clamp((t - at) / dur);

export const CHAPTERS = [
  ['cold', '序', '两个问题'],
  ['five', '01', '五本账'],
  ['axes', '02', '两条轴'],
  ['frag', '03', '破碎'],
  ['strength', '04', '强度'],
  ['phase', '05', '相变'],
  ['gbe', '06', '束缚能'],
  ['bound', '07', '下限'],
  ['meteor', '08', '斩陨'],
  ['gbu', '09', '失真'],
  ['tools', '10', '工具'],
  ['flux', '11', '通量'],
  ['end', '终', '先问量纲'],
];
