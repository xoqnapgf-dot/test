/*
 * Where everything actually is, at one viewport, across the whole film.
 *
 * The overlay audit (tools/ovprobe.mjs) walks the film frame by frame and is thorough but
 * slow. This one boots once, seeks to a list of stamps, and for each stamp prints the box of
 * every visible overlay element plus the pairs that overlap. It is the tool to run after any
 * change to a card position, an instrument size or a CSS clamp.
 *
 * Two things it does that a naive probe does not:
 *   - it runs the film's own DOM tick once per seek. Seeks alone move the picture; the cards,
 *     the caption and the instrument panels are driven by tickDom, so a probe that skips it
 *     measures the previous chapter's layout.
 *   - it waits out the CSS fades (0.4 to 0.6 s) before reading boxes, and reads the panel
 *     state off the .on class instead of the opacity a transition is still animating.
 *
 *   node tools/layout.mjs [stamps] [W] [H]
 *     stamps   comma separated film times, default 5,16,26,37,47,58,68,79,90
 */
import { launch } from './_browser.mjs';
import path from 'node:path';

const stamps = (process.argv[2] || '5,16,26,37,47,58,68,79,90').split(',').map(Number);
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

  const rectOf = (el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  };
  const hits = (a, b, m) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  const contains = (a, b) => a.x <= b.x && a.y <= b.y && a.x + a.w >= b.x + b.w && a.y + a.h >= b.y + b.h;
  const overlap = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
                           Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

  const rows = [];
  for (const t of o.stamps) {
    p.frameAt(t);
    if (window.SS.timeline && window.SS.timeline.tickDom) window.SS.timeline.tickDom(R, app);
    await sleep(560);                                  // let every fade finish
    if (window.SS.timeline && window.SS.timeline.tickDom) window.SS.timeline.tickDom(R, app);

    const items = [];
    const push = (kind, name, el, forced) => {
      if (!el) return;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      const r = rectOf(el);
      if (r.w < 4 || r.h < 4) return;
      if (r.x > o.w || r.x + r.w < 0 || r.y > o.h || r.y + r.h < 0) return;
      if (!forced && parseFloat(cs.opacity) < 0.06) return;
      r.kind = kind; r.name = name;
      items.push(r);
    };

    document.querySelectorAll('#cards .card').forEach((c) => {
      const hd = c.querySelector('.hd, h4, .t');
      push('card', hd ? hd.textContent.trim().slice(0, 16) : 'card', c);
    });
    document.querySelectorAll('.instrument').forEach((c) => {
      push('inst', c.id + (c.classList.contains('on') ? '' : '(off)'), c, c.classList.contains('on'));
    });
    push('hud', 'title', document.getElementById('titleBlock'));
    push('hud', 'caption', document.getElementById('caption'));
    push('hud', 'captionSub', document.getElementById('captionSub'));
    push('hud', 'track', document.getElementById('track'));
    push('hud', 'controls', document.getElementById('controls'));
    push('hud', 'panel', document.getElementById('panel'));
    document.querySelectorAll('#readouts .ro').forEach((c, i) => push('row', 'ro' + i, c));

    const mm = [];
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i], b = items[j];
        if (contains(a, b) || contains(b, a)) continue;      // nested: not a collision
        if (a.kind === 'row' && b.kind === 'row') continue;
        if (a.kind === 'inst' && b.kind === 'inst') continue;
        const ov = overlap(a, b);
        if (ov > 200 && hits(a, b)) mm.push([a.name, b.name, Math.round(ov)]);
      }
    }
    const pr = window.SS.timeline.progress(t);
    const cap = document.getElementById('caption');
    rows.push({ t, ch: pr.index, u: +pr.u.toFixed(2), items, hits: mm,
      cap: cap ? (cap.textContent || '').slice(0, 18) : 'none',
      lit: cap ? cap.querySelectorAll('.w.on').length : 0 });
  }
  return rows;
}, { stamps, w, h });

console.log('# layout @' + w + 'x' + h + '   (tickDom + fade settle, .on class for panels)');
for (const r of out) {
  console.log('\nt ' + String(r.t).padStart(5) + '  ch ' + r.ch + '  u ' + r.u + '  cap "' + r.cap + '" lit ' + r.lit);
  for (const it of r.items) {
    console.log('   ' + it.kind.padEnd(5) + it.name.padEnd(22) + String(it.x).padStart(5) + ',' +
      String(it.y).padStart(4) + '  ' + it.w + 'x' + it.h);
  }
  console.log('   hits: ' + (r.hits.length ? JSON.stringify(r.hits) : 'none'));
}
await browser.close();
