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
    if (!(window.__mglog || []).length) {  // a throttle that still missed: one more try
      window.__mglog = [];
      if (window.SS.mg.invalidate) window.SS.mg.invalidate();
      if (window.SS.timeline && window.SS.timeline.tickDom) window.SS.timeline.tickDom(R, app);
      await sleep(80);
    }
    const st = window.SS.mg.state();
    const pr = window.SS.timeline.progress(t);
    rows.push({ t, ch: pr.index, texts: st.texts || [], frames: st.frames, msN: st.msN });
  }
  return rows;
}, { stamps, w, h });

const box = (s, x, y, tw, align, size) => {
  const x0 = align === 'right' ? x - tw : (align === 'center' ? x - tw / 2 : x);
  return { s, x0, x1: x0 + tw, y0: y - size * 0.80, y1: y + size * 0.26, size };
};
let total = 0, all = [];
console.log('# mg text @' + w + 'x' + h);
for (const r of out) {
  const bs = r.texts.map((a) => box(a[0], a[1], a[2], a[3], a[4], a[5]));
  const bad = [];
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
  console.log('t ' + String(r.t).padStart(5) + '  ch ' + r.ch + '  labels ' + bs.length + '  collisions ' + bad.length);
  for (const d of bad) console.log('    "' + d[0] + '" @' + d[1] + '  vs  "' + d[2] + '" @' + d[3] + '  ' + d[4] + ' px2');
}
console.log('\ntotal collisions ' + total);
await browser.close();
