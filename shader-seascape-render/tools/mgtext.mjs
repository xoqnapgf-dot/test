/*
 * The motion-graphics layer is a canvas, so its labels are not in the DOM and no overlay
 * audit can see them. This one makes the layer log every string it paints (mg.js pushes to
 * window.__mglog inside text()), then checks the boxes against each other at a list of
 * stamps. Two labels in the same band that overlap by more than a tenth of the smaller one
 * are a defect, not a judgement call.
 *
 *   node tools/mgtext.mjs [stamps] [W] [H]
 */
import { launch } from './_browser.mjs';
import path from 'node:path';

const stamps = (process.argv[2] || '4,16,26,34,42,50,58,68,79,90').split(',').map(Number);
const w = parseInt(process.argv[3] || '1280', 10);
const h = parseInt(process.argv[4] || '720', 10);
const root = path.resolve('.');
const PAGE = 'file://' + root + '/index.html?loop=0&probe=1&quality=0.25&terrainRes=512&scale=0.3';

const { browser, page } = await launch({ width: w, height: h });
await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
await page.waitForFunction('window.__probe && window.__probe.booted === true', { timeout: 300000 });

const out = await page.evaluate(async (o) => {
  const p = window.__probe, R = p.renderer, app = p.app;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  app.playing = false;
  window.__mglog = [];
  const rows = [];
  for (const t of o.stamps) {
    p.frameAt(t);
    // Clear the log *before* forcing the redraw: the layer only paints when the timeline
    // ticks it and its 45 ms throttle has expired, so the sequence has to be
    // clear -> invalidate -> tick -> wait. (Clearing after the wait threw away exactly the
    // labels this tool exists to measure.)
    window.__mglog = [];
    if (window.SS.mg.invalidate) window.SS.mg.invalidate();
    if (window.SS.timeline && window.SS.timeline.tickDom) window.SS.timeline.tickDom(R, app);
    await sleep(80);
    /* Tick again before measuring. The annotation labels are DOM and are applied by the same
       tick as the canvas, so the first draw after a seek can still be looking at the previous
       chapter's rectangles - measuring there reported placements that are one tick out of date.
       Settle the DOM, then redraw the layer against it and measure that. */
    if (window.SS.mg.invalidate) window.SS.mg.invalidate();
    if (window.SS.timeline && window.SS.timeline.tickDom) window.SS.timeline.tickDom(R, app);
    await sleep(120);
    const st = window.SS.mg.state();
    const pr = window.SS.timeline.progress(t);
    /* The DOM overlays the canvas paints under. A canvas label that lands in one of these is
       not crowded, it is invisible - and the collision test below cannot see them, because it
       only has the canvas's own labels. Collect them and test against them as well. */
    const over = [];
    for (const sel of ['#cards .card.on', '#annot .tl.on', '.instrument.on']) {
      for (const el of document.querySelectorAll(sel)) {
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        over.push([r.left, r.top, r.right, r.bottom, sel]);
      }
    }
    rows.push({ t, ch: pr.index, texts: st.texts || [], frames: st.frames, msN: st.msN, over });
  }
  return rows;
}, { stamps, w, h });

const box = (s, x, y, tw, align, size) => {
  const x0 = align === 'right' ? x - tw : (align === 'center' ? x - tw / 2 : x);
  return { s, x0, x1: x0 + tw, y0: y - size * 0.80, y1: y + size * 0.26, size };
};
let total = 0, all = [], drops = 0;
console.log('# mg text @' + w + 'x' + h);
let under = 0;
for (const r of out) {
  const dropped = r.texts.filter((a) => a[6] === 1);
  const bs = r.texts.filter((a) => a[6] !== 1).map((a) => box(a[0], a[1], a[2], a[3], a[4], a[5]));
  const bad = [];
  for (const b of bs) {
    for (const o of (r.over || [])) {
      const ox = Math.min(b.x1, o[2]) - Math.max(b.x0, o[0]);
      const oy = Math.min(b.y1, o[3]) - Math.max(b.y0, o[1]);
      if (ox > 0 && oy > 0) {
        const area = ox * oy, small = Math.min((b.x1 - b.x0) * (b.y1 - b.y0), (o[2] - o[0]) * (o[3] - o[1]));
        if (area > small * 0.08) {
          under++;
          console.log('\n  t ' + r.t + '  canvas label "' + b.s + '" @' + b.x0.toFixed(0) + ',' + b.y0.toFixed(0) +
            ' ' + (b.x1 - b.x0).toFixed(0) + 'x' + (b.y1 - b.y0).toFixed(0) +
            ' is under ' + o[4] + ' @' + o[0].toFixed(0) + ',' + o[1].toFixed(0) + ' ' +
            (o[2] - o[0]).toFixed(0) + 'x' + (o[3] - o[1]).toFixed(0) + '  (' + ox.toFixed(0) + 'x' + oy.toFixed(0) + ' px)');
        }
      }
    }
  }
  for (let i = 0; i < bs.length; i++) {
    for (let j = i + 1; j < bs.length; j++) {
      const a = bs[i], b = bs[j];
      const ox = Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0));
      const oy = Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
      if (!ox || !oy) continue;
      const ov = ox * oy;
      const small = Math.min((a.x1 - a.x0) * (a.y1 - a.y0), (b.x1 - b.x0) * (b.y1 - b.y0));
      if (ov > Math.max(8, small * 0.10)) {
        bad.push([a.s, Math.round(a.x0) + ',' + Math.round(a.y0), b.s, Math.round(b.x0) + ',' + Math.round(b.y0), Math.round(ov)]);
      }
    }
  }
  total += bad.length;
  all = all.concat(bad.map((d) => [r.t].concat(d)));
  for (const d of dropped) { drops++; console.log('\n  t ' + r.t + '  canvas label "' + d[0] + '" could not be placed anywhere clear'); }
  console.log('t ' + String(r.t).padStart(5) + '  ch ' + r.ch + '  labels ' + bs.length + '  collisions ' + bad.length +
    (dropped.length ? '  dropped ' + dropped.length : ''));
  for (const d of bad) console.log('    "' + d[0] + '" @' + d[1] + '  vs  "' + d[2] + '" @' + d[3] + '  ' + d[4] + ' px2');
}
console.log('\ntotal collisions ' + total + ' · canvas labels under a DOM overlay ' + under +
  ' · labels that could not be placed ' + drops);
await browser.close();
