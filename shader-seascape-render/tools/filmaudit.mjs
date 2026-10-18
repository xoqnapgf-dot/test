/* Audit the film's structure without rendering the 3D layer: walk the timeline and report what
 * every layer is doing at each stamp - which card is up, how much of the caption is lit, which
 * instrument panels are showing, whether the leader line is drawn, whether the mg canvas has
 * ink where the rail should be, and whether any of the boxes overlap each other or run off the
 * frame.
 *
 * What it checks, per stamp:
 *   exactly one card, inside the frame, clear of the caption, the chapter block and the panels
 *   the caption is inside the lower half, has tokens, and something is lit
 *   the instrument set matches the film's own chapter table, and the panels never overlap
 *     each other, the caption, the title or the visible timeline bar
 *   the mg canvas is painting (whole-canvas ink, and ink in the rail strip)
 *   once a chapter is half way in, its annotation has a leader line
 *
 *   node tools/filmaudit.mjs [step] [width] [height]
 */
import { launch } from './_browser.mjs';
import path from 'node:path';

const step = parseFloat(process.argv[2] || '1.5');
const W = parseInt(process.argv[3] || '1280', 10);
const H = parseInt(process.argv[4] || '720', 10);
const root = path.resolve('.');
const { browser, page } = await launch({ width: W, height: H });
const errs = [];
page.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });

await page.goto('file://' + root + '/index.html?probe=1&loop=0&quality=0.2&terrainRes=256&scale=0.3',
  { waitUntil: 'domcontentloaded' });
await page.waitForFunction('window.__probe && window.__probe.booted === true', { timeout: 300000 });

const report = await page.evaluate(async (o) => {
  const p = window.__probe, app = p.app, R = p.renderer;
  app.playing = false;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const T = window.SS.timeline;
  const SHOW = (window.SS.instruments && window.SS.instruments.SHOW) || {};
  const out = [];
  const rect = (e) => { const r = e.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; };
  const hit = (a, b) => a.w > 0 && b.w > 0 && !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
  const union = (a, b) => ({
    x: Math.min(a.x, b.x), y: Math.min(a.y, b.y),
    w: Math.max(a.x + a.w, b.x + b.w) - Math.min(a.x, b.x),
    h: Math.max(a.y + a.h, b.y + b.h) - Math.min(a.y, b.y)
  });
  // ink coverage of the mg canvas (the rail and the readouts live there, not in the DOM)
  const cv = document.getElementById('mg');
  const ink = (fx0, fy0, fx1, fy1) => {
    if (!cv || !cv.getContext) return -1;
    const g = cv.getContext('2d');
    const x0 = Math.floor(fx0 * cv.width), y0 = Math.floor(fy0 * cv.height);
    const w = Math.max(1, Math.floor((fx1 - fx0) * cv.width)), h = Math.max(1, Math.floor((fy1 - fy0) * cv.height));
    try {
      const d = g.getImageData(x0, y0, w, h).data;
      let n = 0, k = 0;
      for (let i = 3; i < d.length; i += 4 * 17) { k++; if (d[i] > 8) n++; }
      return k ? +(n / k).toFixed(3) : -1;
    } catch (e) { return -1; }
  };

  const CUES = T.cues || [];
  for (let t = 0; t <= 96.001; t += o.step) {
    const tt = Math.min(95.999, t % 96);
    T.seekTo(tt, R, app);
    /* Let the page run one frame after the seek. Everything on screen that is not the DOM
       (the instrument canvases, the motion-graphics layer) is painted by the animation loop,
       and this whole audit is one synchronous evaluate: without this yield the canvases are
       still showing the previous stamp's chapter, which is exactly the sort of artifact that
       looks like a bug in the film. Two frames, because a painter may be inside its throttle
       window on the first. */
    await sleep(60);
    if (T.tickDom) T.tickDom(R, app);
    await sleep(60);
    const pr = T.progress(tt);
    if (window.SS.instruments) window.SS.instruments.tick(R, app);
    const cards = [...document.querySelectorAll('#cards .card.on')].map((c) => ({ h: c.querySelector('.h').textContent, r: rect(c) }));
    const capEl = document.getElementById('caption');
    const cap = { text: capEl.textContent, r: rect(capEl) };
    const lit = capEl.querySelectorAll('.w.on').length, total = capEl.querySelectorAll('.w').length;
    const instEls = [...document.querySelectorAll('.instrument.on')].filter((e) => e.getBoundingClientRect().width > 0);
    const inst = instEls.map((e) => e.id);
    const leads = [...document.querySelectorAll('#annot .lead')].filter((g) => +g.getAttribute('opacity') > 0.01).length;
    const title = document.getElementById('titleBlock');
    const titleR = rect(title);
    // #timeline spans the window on purpose (it is the scrub target); the visible bar is
    // the track plus the button row
    const tlR = union(rect(document.getElementById('track')), rect(document.getElementById('controls')));
    const playhead = document.getElementById('playhead').style.left;
    const problems = [];

    if (cards.length !== 1) problems.push('cards:' + cards.length);
    for (const c of cards) {
      if (c.r.x < 0 || c.r.y < 0 || c.r.x + c.r.w > o.W || c.r.y + c.r.h > o.H) problems.push('card-off-frame');
      if (hit(c.r, cap.r)) problems.push('card-over-caption');
      if (hit(c.r, titleR)) problems.push('card-over-title');
      if (hit(c.r, tlR)) problems.push('card-over-timeline');
    }
    if (cap.r.w > 0 && cap.r.y < o.H * 0.45) problems.push('caption-too-high');
    if (cap.r.w > 0 && hit(cap.r, tlR)) problems.push('caption-over-timeline');
    const st = window.SS.captions.state();
    if (cap.text && lit === 0 && st.tOn >= 0 && tt > st.tOn + 0.4) problems.push('nothing-lit');
    /* A gap between cues is only a defect if it is longer than the film's own breathing room
       between chapters (1.2 s, the same threshold the cue-gap report below uses). The short
       silences before a chapter's first line are written into the script. */
    if (!cap.text && tt > 1 && tt < 95) {
      const nx = CUES.find((c) => c.t0 > tt), pv = CUES.filter((c) => c.t1 < tt).pop();
      const gap = (nx ? nx.t0 : 96) - (pv ? pv.t1 : 0);
      if (gap > 1.2) problems.push('gap-in-captions:' + gap.toFixed(1));
    }

    // the panel set the film asks for, versus what is on screen and where
    const want = Object.keys(SHOW).filter((id) => SHOW[id].indexOf(pr.index) >= 0);
    const missing = want.filter((id) => inst.indexOf(id) < 0);
    const extra = inst.filter((id) => want.indexOf(id) < 0);
    if (missing.length && pr.u > 0.12) problems.push('inst-missing:' + missing.join('+'));
    if (extra.length) problems.push('inst-extra:' + extra.join('+'));
    const panelInks = [];
    for (let i = 0; i < instEls.length; i++) {
      const r = rect(instEls[i]);
      if (r.x < 0 || r.y < 0 || r.x + r.w > o.W || r.y + r.h > o.H) problems.push('inst-off-frame:' + inst[i]);
      if (hit(r, cap.r)) problems.push('inst-over-caption:' + inst[i]);
      if (hit(r, tlR)) problems.push('inst-over-timeline:' + inst[i]);
      if (hit(r, titleR)) problems.push('inst-over-title:' + inst[i]);
      for (let j = i + 1; j < instEls.length; j++) if (hit(r, rect(instEls[j]))) problems.push('inst-overlap:' + inst[i] + '+' + inst[j]);
      for (const c of cards) if (hit(r, c.r)) problems.push('inst-over-card:' + inst[i]);
      const cvs = instEls[i].querySelector('canvas');
      let panelInk = -1;
      if (cvs && cvs.getContext('2d')) {
        // a panel that never painted is a panel that is lying about being live. The first
        // version of this sampled the canvas's top-left 8x8 corner and called a panel blank
        // whenever that corner happened to be background - the histogram's frame starts a
        // few pixels in, so it was reported blank while it was painting. Measure the whole
        // surface instead.
        const g = cvs.getContext('2d');
        try {
          const d = g.getImageData(0, 0, cvs.width, cvs.height).data;
          let n = 0, k = 0;
          for (let q = 3; q < d.length; q += 4 * 13) { k++; if (d[q] > 6) n++; }
          panelInk = k ? +(n / k).toFixed(3) : -1;
        } catch (e) { panelInk = -1; }
        panelInks.push(panelInk);
        if (panelInk >= 0 && panelInk < 0.004 && pr.u > 0.12) problems.push('inst-blank:' + inst[i]);
      }
    }
    const mgAll = ink(0, 0, 1, 1), mgRail = ink(0, 0.58, 1, 0.74);
    if (pr.u > 0.30 && mgAll >= 0 && mgAll < 0.002) problems.push('mg-blank');
    if (pr.u > 0.50 && mgRail >= 0 && mgRail < 0.002) problems.push('mg-rail-blank');
    if (pr.u > 0.50 && leads < 1) problems.push('lead-missing');
    out.push({
      t: +t.toFixed(1), ch: document.getElementById('chapterNum').textContent + ' ' + document.getElementById('chapterTitle').textContent,
      view: R.s.view, u: +pr.u.toFixed(2), capY: cap.r.y,
      card: cards.map((c) => c.h + '@' + [c.r.x, c.r.y, c.r.w, c.r.h].join(',')).join('|'),
      lit: lit + '/' + total, cap: cap.text.slice(0, 26),
      inst: inst.join('|'), leads, mgInk: mgAll, mgRail, playhead,
      panelInk: panelInks.length ? Math.min.apply(null, panelInks) : -1,
      problems: problems.join(',')
    });
  }
  return { rows: out, cues: CUES.map((c) => [c.t0, c.t1]), n: CUES.length };
}, { step, W, H });

const CUES = report.cues || [];
const cueGaps = [];
for (let i = 1; i < CUES.length; i++) {
  const g = CUES[i][0] - CUES[i - 1][1];
  if (g > 1.2) cueGaps.push(CUES[i - 1][1].toFixed(1) + '..' + CUES[i][0].toFixed(1));
}
if (CUES.length && CUES[0][0] > 1.2) cueGaps.push('open..' + CUES[0][0].toFixed(1));
if (CUES.length && 96 - CUES[CUES.length - 1][1] > 1.2) cueGaps.push(CUES[CUES.length - 1][1].toFixed(1) + '..end');

let bad = 0;
for (const r of report.rows) {
  if (r.problems) bad++;
  console.log([String(r.t).padStart(5), r.ch.padEnd(11), ('v' + r.view).padEnd(3),
    'u' + String(r.u).padEnd(4), r.card.padEnd(30),
    ('lit ' + r.lit).padEnd(9), ('cap ' + r.cap).padEnd(30), ('inst ' + r.inst).padEnd(11),
    ('ink ' + (r.panelInk === undefined ? '-' : r.panelInk)).padEnd(9),
    'lead ' + r.leads, 'ink ' + r.mgInk + '/' + r.mgRail,
    r.problems ? ('<< ' + r.problems) : ''].join(' '));
}
console.log('caption gaps > 1.2s: ' + (cueGaps.length ? cueGaps.join(' ') : 'none') +
  '  (' + report.n + ' cues over 96s)');
console.log(JSON.stringify({ stamps: report.rows.length, withProblems: bad, errors: errs.slice(0, 6) }));
await browser.close();
