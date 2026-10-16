/* Film frame capture: the whole page (canvas + every DOM layer) at one or more timeline
 * stamps. One browser session for all of them, so a sweep does not pay the boot per frame.
 *
 *   node tools/film.mjs --t 42 --w 1280 --h 720 --q 0.5 --tres 512 --out shots/film_42.png
 *   node tools/film.mjs --t 0,10.5,21,31.5 --out shots/sweep/film_{t}.png
 *
 * Each stamp is seeked, then rendered until the auto-exposure settles (--frames caps that),
 * then the whole page is screenshotted. Prints one JSON line per stamp: timing, exposure,
 * the chapter/layer state and the painted DOM boxes, so overlap can be checked numerically
 * as well as by looking at the PNG.
 */
import { launch } from './_browser.mjs';
import fs from 'node:fs';
import path from 'node:path';

const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1];
}
const STAMPS = (args.t !== undefined ? String(args.t) : '0')
  .split(',').map((v) => parseFloat(v)).filter((v) => !isNaN(v));
const T = STAMPS[0];
const W = parseInt(args.w || '1280', 10);
const H = parseInt(args.h || '720', 10);
const Q = args.q !== undefined ? parseFloat(args.q) : 0.5;
const TRES = args.tres !== undefined ? parseInt(args.tres, 10) : 512;
const SCALE = args.scale !== undefined ? parseFloat(args.scale) : 1.0;
const SETTLE = args.settle !== undefined ? parseInt(args.settle, 10) : 4;
const FRAMES = args.frames !== undefined ? parseInt(args.frames, 10) : 64;
const DT = args.dt !== undefined ? parseFloat(args.dt) : 0.1;
const OUT = args.out || `shots/film_${Math.round(T)}.png`;
const outFor = (t) => OUT.indexOf('{t}') >= 0 ? OUT.replace('{t}', t.toFixed(1)) : OUT;
const ERODE = args.erode !== undefined ? parseInt(args.erode, 10) : null;
const URL = 'file://' + path.resolve(args.html || 'index.html') +
  '?loop=0&probe=1&quality=' + Q + '&terrainRes=' + TRES + '&scale=' + SCALE +
  (ERODE === null ? '' : '&erode=' + ERODE) + (args.extra ? '&' + args.extra : '');

const { browser, page } = await launch({ width: W, height: H });
const errs = [];
page.on('console', (m) => {
  const tx = m.text();
  if (m.type() === 'error') errs.push(tx.slice(0, 300));
  else if (tx.indexOf('mg:') === 0 || tx.indexOf('warn') >= 0) errs.push('warn: ' + tx.slice(0, 300));
});
page.on('pageerror', (e) => errs.push('pageerror: ' + String(e).slice(0, 300)));

await page.goto(URL, { waitUntil: 'domcontentloaded' });
await page.waitForFunction('window.__probe && window.__probe.booted === true', { timeout: 300000 });

const info = await page.evaluate((o) => {
  const p = window.__probe;
  return p.info;
}, { q: Q, tres: TRES, scale: SCALE });

for (const stamp of STAMPS) {
const t0 = Date.now();
const state = await page.evaluate((o) => {
  const p = window.__probe, R = p.renderer, app = p.app;
  app.playing = false;
  p.frameAt(o.t);
  // --set k=v,k2=v2 : poke the renderer state after the film has had its say, for A/B work
  const sets = (o.set || '').split(',').filter(Boolean);
  for (const kv of sets) {
    const i = kv.indexOf('=');
    const k = kv.slice(0, i), raw = kv.slice(i + 1);
    const v = raw === 'true' ? true : raw === 'false' ? false : (isNaN(parseFloat(raw)) ? raw : parseFloat(raw));
    if (k.indexOf('[') > 0) { const arr = k.slice(0, k.indexOf('[')), idx = parseInt(k.slice(k.indexOf('[') + 1, k.indexOf(']')), 10); R.s[arr][idx] = v; }
    else p.set(k, v);
  }
  const ex = (p.converge ? p.converge(o.frames, o.dt) : { frames: p.settle(o.settle) }).exposure;
  // what the DOM actually shows now
  const box = (id) => {
    const e = document.getElementById(id);
    if (!e) return null;
    const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    return { id, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), op: +cs.opacity };
  };
  const cards = [...document.querySelectorAll('#cards .card')].filter((c) => c.classList.contains('on')).map((c) => {
    const r = c.getBoundingClientRect();
    return { t: c.querySelector('.h').textContent, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  });
  const caption = document.getElementById('caption');
  const capOn = [...caption.querySelectorAll('.w.on')].map((s) => s.textContent).join('');
  const inst = [...document.querySelectorAll('.instrument')].filter((e) => e.classList.contains('on')).map((e) => e.id);
  const fonts = [...document.fonts].map((f) => f.family + ':' + f.status);
  return {
    chapter: app.chapter, time: +app.time.toFixed(2), exposure: ex, res: [R.targets.w, R.targets.h],
    cards, caption: capOn, captionBox: box('caption'), inst,
    fonts, ms: R.stats.ms, sunElev: R.s.sunElev, view: R.s.view, stages: R.s.stages.slice()
  };
}, { t: stamp, settle: SETTLE, frames: FRAMES, dt: DT, set: args.set || '' });
const ms = Date.now() - t0;

const outFile = outFor(stamp);
fs.mkdirSync(path.dirname(outFile), { recursive: true });
await page.screenshot({ path: outFile, captureBeyondViewport: false });
const meta = { t: stamp, out: outFile, size: [W, H], q: Q, tres: TRES, ms, info: { renderer: info.renderer && info.renderer.slice(0, 40) }, ...state, errors: errs.slice(0, 6) };
console.log(JSON.stringify(meta));
if (args.meta) fs.writeFileSync(args.meta.replace('{t}', stamp.toFixed(1)), JSON.stringify(meta, null, 1));
}
await browser.close();
