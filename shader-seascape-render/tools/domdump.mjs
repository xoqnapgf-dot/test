/* Dump what the DOM actually shows at a list of film stamps, with the numbers a layout
 * review needs: every card's text/rect/class, the instrument panels that are on and where,
 * the title block, the caption, the visible timeline bar, the mg canvas' ink coverage, and
 * the pairwise overlaps between all of them.
 *
 *   node tools/domdump.mjs 5,16,26
 *
 * The point is to be the cheap, browser-accurate sibling of tools/ovprobe.mjs (which walks
 * the whole timeline): this one answers "is the card sitting on a panel right now".
 */
import { launch } from './_browser.mjs';

const times = (process.argv[2] || '5').split(',').map(Number);
const PAGE = 'file://' + new URL('../index.html', import.meta.url).pathname +
  '?loop=0&probe=1&quality=0.15&terrainRes=512&scale=0.2';
const { browser, page } = await launch({ width: 1280, height: 720 });
const errs = [];
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
page.on('pageerror', (e) => errs.push('pageerror: ' + String(e).slice(0, 200)));
await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
await page.waitForFunction('window.__probe && window.__probe.booted === true', { timeout: 300000 });

for (const t of times) {
  const r = await page.evaluate((tt) => {
    const p = window.__probe, app = p.app, R = p.renderer;
    app.playing = false;
    p.frameAt(tt);
    p.converge ? p.converge(6, 0.15) : p.settle(6);
    const pr = window.SS.timeline.progress(tt);
    const box = (e) => { const q = e.getBoundingClientRect(); return [Math.round(q.x), Math.round(q.y), Math.round(q.width), Math.round(q.height)]; };
    const ov = (a, b) => {
      const w = Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0]);
      const h = Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1]);
      return (w > 0 && h > 0) ? Math.round(w * h) : 0;
    };
    const cards = [...document.querySelectorAll('#cards .card')].map((c) => ({
      h: c.querySelector('.h').textContent.trim().slice(0, 12),
      on: c.classList.contains('on'), box: box(c), op: +getComputedStyle(c).opacity
    }));
    const on = cards.filter((c) => c.on);
    const inst = [...document.querySelectorAll('.instrument')].filter((e) => e.classList.contains('on'))
      .map((e) => ({ id: e.id, box: box(e) }));
    const title = box(document.getElementById('titleBlock'));
    const cap = box(document.getElementById('caption'));
    const tl = box(document.getElementById('track'));
    const led = [...document.querySelectorAll('#annot g.lead')].filter((g) => +g.getAttribute('opacity') > 0.02).length;
    const hit = [];
    for (const c of on) {
      if (ov(c.box, title)) hit.push('card-title:' + ov(c.box, title));
      if (ov(c.box, cap)) hit.push('card-caption:' + ov(c.box, cap));
      if (ov(c.box, tl)) hit.push('card-track:' + ov(c.box, tl));
      for (const i of inst) { const a = ov(c.box, i.box); if (a) hit.push('card-' + i.id + ':' + a); }
    }
    for (let i = 0; i < inst.length; i++) {
      if (ov(inst[i].box, cap)) hit.push(inst[i].id + '-caption:' + ov(inst[i].box, cap));
      if (ov(inst[i].box, tl)) hit.push(inst[i].id + '-track:' + ov(inst[i].box, tl));
      if (ov(inst[i].box, title)) hit.push(inst[i].id + '-title:' + ov(inst[i].box, title));
      for (let j = i + 1; j < inst.length; j++) { const a = ov(inst[i].box, inst[j].box); if (a) hit.push(inst[i].id + '-' + inst[j].id + ':' + a); }
    }
    // ink: how much of the mg canvas actually has pixels in it, whole and in the rail strip
    const cv = document.getElementById('mg');
    let mgAll = -1, mgRail = -1;
    if (cv && cv.getContext) {
      const g = cv.getContext('2d');
      const ink = (fx0, fy0, fx1, fy1) => {
        const x0 = Math.floor(fx0 * cv.width), y0 = Math.floor(fy0 * cv.height);
        const w = Math.max(1, Math.floor((fx1 - fx0) * cv.width)), h = Math.max(1, Math.floor((fy1 - fy0) * cv.height));
        try {
          const d = g.getImageData(x0, y0, w, h).data;
          let n = 0, k = 0;
          for (let i = 3; i < d.length; i += 4 * 17) { k++; if (d[i] > 8) n++; }
          return k ? +(n / k).toFixed(3) : -1;
        } catch (e) { return -1; }
      };
      mgAll = ink(0, 0, 1, 1); mgRail = ink(0, 0.60, 1, 0.72);
    }
    return {
      index: pr.index, u: +pr.u.toFixed(3), view: R.s.view,
      cardsOn: on.map((c) => c.h + '@' + c.box.join(',')),
      cardsStale: cards.filter((c) => !c.on && c.op > 0.02).map((c) => c.h + ' op' + c.op),
      inst: inst.map((i) => i.id + '@' + i.box.join(',')),
      title: title.join(','), caption: cap.join(','), track: tl.join(','),
      lead: led, hit: hit,
      mg: window.SS.mg ? window.SS.mg.state() : null, mgInk: mgAll, mgRail: mgRail,
      mgSize: cv ? cv.width + 'x' + cv.height : null
    };
  }, t);
  console.log(JSON.stringify({ t: t, ...r }));
}
if (errs.length) console.log('ERRORS: ' + errs.slice(0, 6).join(' | '));
await browser.close();
