// Narration clock. Visual cues anchor to a line's start/end or to the moment a word inside
// a line is spoken (edge-tts word boundaries, mapped to every character of the line).
import { TOTAL, SCENES } from '../data/timeline.js';

export { TOTAL, SCENES };

const SPLIT = /[，。；：？！]/;

const byId = {};
for (const s of SCENES) {
  byId[s.id] = s;
  for (const l of s.lines) {
    const ct = new Array(l.say.length).fill(null);
    let pos = 0;
    for (let k = 0; k < l.w.length; k++) {
      const [wt, ww] = l.w[k];
      const at = l.say.indexOf(ww, pos);
      if (at < 0) continue;
      const next = l.w[k + 1] ? l.w[k + 1][0] : wt + 0.2 * ww.length;
      for (let j = 0; j < ww.length; j++) ct[at + j] = wt + ((next - wt) * j) / ww.length;
      pos = at + ww.length;
    }
    let last = l.t0;
    for (let j = 0; j < ct.length; j++) {
      if (ct[j] === null) ct[j] = last;
      else last = ct[j];
    }
    l.ct = ct;
    // subtitle segments: clause i of `show` is on screen while clause i of `say` is spoken
    const sayParts = splitKeep(l.say);
    const showParts = splitKeep(l.show);
    const segs = [];
    let ci = 0;
    for (let i = 0; i < sayParts.length; i++) {
      const a = ct[Math.min(ci, ct.length - 1)];
      ci += sayParts[i].length;
      const b = i + 1 < sayParts.length ? ct[Math.min(ci, ct.length - 1)] : l.t1;
      const text = (showParts.length === sayParts.length ? showParts[i] : i === 0 ? l.show : '').trim();
      if (text) segs.push({ a, b, text });
    }
    l.segs = mergeShort(segs);
  }
}

function splitKeep(s) {
  const out = [];
  let cur = '';
  for (const ch of s) {
    cur += ch;
    if (SPLIT.test(ch)) {
      out.push(cur);
      cur = '';
    }
  }
  if (cur) out.push(cur);
  return out;
}
// join tiny clauses with the next one so subtitles do not flicker
function mergeShort(segs) {
  const out = [];
  for (const s of segs) {
    const p = out[out.length - 1];
    if (p && (p.text.length < 7 || s.b - p.a < 1.6) && p.text.length + s.text.length <= 30) {
      p.text += s.text;
      p.b = s.b;
    } else out.push({ ...s });
  }
  return out;
}

export const scene = (id) => byId[id];
export const line = (id, i) => byId[id].lines[i];
// moment at which `kw` (substring of the spoken text) starts; nth occurrence optional
export function cue(id, i, kw, off = 0, nth = 0) {
  const s = byId[id];
  if (!s) throw new Error('no scene ' + id);
  const l = s.lines[i];
  if (!l) throw new Error(`no line ${id}:${i}`);
  if (!kw) return l.t0 + off;
  let at = -1;
  for (let n = 0; n <= nth; n++) at = l.say.indexOf(kw, at + 1);
  if (at < 0) {
    console.warn('cue not found', id, i, kw);
    return l.t0 + off;
  }
  return l.ct[at] + off;
}
export const lineEnd = (id, i) => byId[id].lines[i].t1;
export function sceneIndexAt(t) {
  let k = 0;
  for (let i = 0; i < SCENES.length; i++) if (t >= SCENES[i].t0) k = i;
  return k;
}
export function subtitleAt(t) {
  for (const s of SCENES) {
    if (t < s.t0 - 1 || t > s.t1 + 1) continue;
    for (const l of s.lines) {
      if (t < l.t0 - 0.1 || t > l.t1 + 0.35) continue;
      for (let i = 0; i < l.segs.length; i++) {
        const g = l.segs[i];
        const end = i + 1 < l.segs.length ? l.segs[i + 1].a : l.t1 + 0.35;
        if (t >= g.a - 0.1 && t < end) return g.text;
      }
    }
  }
  return '';
}
// helper bound to one scene: c(line, kw, off), e(line) end of line
export function cues(id) {
  const c = (i, kw, off = 0, nth = 0) => cue(id, i, kw, off, nth);
  c.end = (i, off = 0) => lineEnd(id, i) + off;
  c.s = byId[id];
  return c;
}
