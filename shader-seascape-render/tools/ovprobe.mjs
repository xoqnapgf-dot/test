/* Overlay geometry audit.
 *
 * Boots the page once, walks the whole film in --step seconds, and for every stamp records
 * the painted rectangle of every DOM overlay layer plus the SVG nodes the annotation layer
 * draws (cards, leader lines, the ruler, the motion graphics). Then it reports every pair of
 * rectangles that actually intersect, so collisions are found by measurement instead of by
 * squinting at a scaled-down contact sheet.
 *
 *   node tools/ovprobe.mjs --w 1280 --h 720 --step 2
 *   node tools/ovprobe.mjs --w 1024 --h 640 --step 4 --quiet
 */
import { launch } from './_browser.mjs';

const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  if (!process.argv[i].startsWith('--')) continue;
  args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1];
}
const W = parseInt(args.w || '1280', 10);
const H = parseInt(args.h || '720', 10);
const STEP = parseFloat(args.step || '2');
const SCALE = parseFloat(args.scale || '0.18');
const Q = parseFloat(args.q || '0.15');
const QUIET = !!args.quiet;

const PAGE = 'file://' + new URL('../index.html', import.meta.url).pathname +
  '?loop=0&probe=1&quality=' + Q + '&terrainRes=512&scale=' + SCALE;

const { browser, page } = await launch({ width: W, height: H });
const errs = [];
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 240)); });
page.on('pageerror', (e) => errs.push('pageerror: ' + String(e).slice(0, 240)));
await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
await page.waitForFunction('window.__probe && window.__probe.booted === true', { timeout: 300000 });

// one page-side snapshot function: every rectangle we care about, in CSS pixels
const snap = (t) => {
  const box = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return null;
    const op = parseFloat(cs.opacity);
    if (!(r.width > 0.5 && r.height > 0.5) || op < 0.02) return null;
    return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), op: +op.toFixed(2) };
  };
  const out = { parts: [], svg: [] };
  const P = (kind, name, el) => { const b = box(el); if (b) out.parts.push({ kind: kind, name: name, ...b }); };

  P('frame', 'title', document.getElementById('titleBlock'));
  P('frame', 'readouts', document.getElementById('readouts'));
  P('caption', 'caption', document.getElementById('caption'));
  P('caption', 'sub', document.getElementById('captionSub'));
  P('frame', 'timeline', document.getElementById('timeline'));
  document.querySelectorAll('.instrument').forEach((e) => { if (e.classList.contains('on')) P('inst', e.id, e); });
  document.querySelectorAll('#cards .card').forEach((e) => {
    if (!e.classList.contains('on')) return;
    P('card', (e.querySelector('.h') || {}).textContent || '?', e);
    // the card's own child rows, so a leader line that lands on the formula is visible too
    e.querySelectorAll('.h,.b,.formula,.src').forEach((c) => {
      if (!c.textContent.trim()) return;
      const r = c.getBoundingClientRect();
      out.parts.push({ kind: 'cardRow', name: ((e.querySelector('.h') || {}).textContent || '?').slice(0, 12) + '/' + c.className, x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), op: 1 });
    });
  });
  // SVG side: leader groups, the ruler group, the motion graphics group
  const svg = document.getElementById('annot');
  svg.querySelectorAll('g').forEach((g) => {
    const op = parseFloat(getComputedStyle(g).opacity || g.getAttribute('opacity') || '1');
    if (op < 0.02) return;
    const r = g.getBoundingClientRect();
    if (!(r.width > 0.5 && r.height > 0.5)) return;
    const cls = g.getAttribute('class') || 'g';
    out.svg.push({ cls: cls, x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), op: +op.toFixed(2) });
  });
  return out;
};

const rows = [];
for (let t = 0; t <= 96.001; t += STEP) {
  const st = await page.evaluate((o) => {
    const p = window.__probe, app = p.app;
    app.playing = false;
    p.frameAt(o.t);
    p.converge ? p.converge(6, 0.1) : p.settle(6);
    const pr = window.SS.timeline.progress(o.t);
    const ch = pr.index;
    const cards = window.SS.timeline.cards;
    const card = cards[ch] || {};
    return { ch: ch, cardAt: card.at, cardSide: (card.at && card.at[0] > 0.5) ? 'right' : 'left' };
  }, { t: t });
  const sn = await page.evaluate(snap, t);
  rows.push({ t: +t.toFixed(1), ch: st.ch, cardAt: st.cardAt, cardSide: st.cardSide, ...sn });
}

// ---- overlap report -------------------------------------------------------
function inter(a, b) {
  const x = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const y = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  return x * y;
}
const IGNORE = (a, b) => {
  // a card and its own rows are the same object; svg groups legitimately overlap each other
  if (a.kind === 'cardRow' && b.kind === 'cardRow') return true;
  if (a.kind === 'svg' && b.kind === 'svg') return true;
  if (a.kind === 'card' && b.kind === 'cardRow') return true;
  return false;
};
let worst = new Map();
for (const r of rows) {
  const items = r.parts.concat(r.svg.map((s) => ({ kind: 'svg', name: s.cls, ...s })));
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i], b = items[j];
      if (IGNORE(a, b)) continue;
      // nested pairs (an instrument inside its own column, the svg over the frame) are not useful
      const area = inter(a, b);
      if (area < 220) continue;
      const key = a.kind + ':' + a.name + ' ∩ ' + b.kind + ':' + b.name;
      const rec = worst.get(key) || { key, area: 0, t: 0, ch: 0, a, b };
      if (area > rec.area) { rec.area = area; rec.t = r.t; rec.ch = r.ch; rec.a = a; rec.b = b; }
      worst.set(key, rec);
    }
  }
}
const list = [...worst.values()].sort((x, y) => y.area - x.area);
console.log('== stamps: ' + rows.length + '  size ' + W + 'x' + H + '  step ' + STEP + 's');
if (!QUIET) {
  for (const r of rows) {
    const ruler = r.svg.find((s) => s.cls === 'mg');
    const lead = r.svg.filter((s) => s.cls === 'lead').length;
    console.log(`t=${String(r.t).padStart(5)}  ch ${r.ch + 1}  card ${r.cardSide.padEnd(5)}  parts ${r.parts.length}  leaders ${lead}  ` +
      'mg ' + (ruler ? `[${ruler.x.toFixed(0)},${ruler.y.toFixed(0)} ${ruler.w.toFixed(0)}x${ruler.h.toFixed(0)}]` : '–'));
  }
}
console.log('\n== overlaps > 220 px² (area, worst stamp, chapter, rectangles)');
for (const w of list) {
  console.log(`${String(Math.round(w.area)).padStart(7)} px²  t=${String(w.t).padStart(5)} ch${w.ch + 1}  ` +
    `${w.a.kind}:${w.a.name} [${w.a.x.toFixed(0)},${w.a.y.toFixed(0)} ${w.a.w.toFixed(0)}x${w.a.h.toFixed(0)}] ∩ ` +
    `${w.b.kind}:${w.b.name} [${w.b.x.toFixed(0)},${w.b.y.toFixed(0)} ${w.b.w.toFixed(0)}x${w.b.h.toFixed(0)}]`);
}
if (errs.length) console.log('\n== page errors\n' + errs.slice(0, 8).join('\n'));
await browser.close();
