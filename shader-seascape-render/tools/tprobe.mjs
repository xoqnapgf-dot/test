/* Where does a capture's wall time go? Boot once, then time each phase of one stamp:
 * frameAt (the timeline seek + the DOM layers), the first frame, N more frames, the
 * screenshot. Prints ms per phase so the review render can be planned instead of guessed.
 *
 *   node tools/tprobe.mjs [t] [frames]
 */
import { launch } from './_browser.mjs';

const T = parseFloat(process.argv[2] || '16');
const N = parseInt(process.argv[3] || '8', 10);
const PAGE = 'file://' + new URL('../index.html', import.meta.url).pathname +
  '?loop=0&probe=1&quality=0.35&terrainRes=512&scale=0.28';
const { browser, page } = await launch({ width: 1280, height: 720 });
const errs = [];
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
page.on('pageerror', (e) => errs.push('pageerror: ' + String(e).slice(0, 200)));
let t0 = Date.now();
await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
await page.waitForFunction('window.__probe && window.__probe.booted === true', { timeout: 300000 });
const boot = Date.now() - t0;

const phase = async (label, fn) => {
  const s = Date.now();
  const out = await fn();
  console.log(label.padEnd(22) + (Date.now() - s) + ' ms' + (out !== undefined ? '  ' + JSON.stringify(out).slice(0, 120) : ''));
};

await phase('seek (frameAt)', () => page.evaluate((t) => {
  const p = window.__probe; p.app.playing = false;
  const s = performance.now(); p.frameAt(t); return Math.round(performance.now() - s) + ' ms inside';
}, T));

await phase('converge(1,0.8)', () => page.evaluate(() => {
  const s = performance.now(); const r = window.__probe.converge(1, 0.8);
  return { inside: Math.round(performance.now() - s), exp: +r.exposure.toFixed(3) };
}));

await phase('converge(' + N + ',0.8)', () => page.evaluate((n) => {
  const s = performance.now(); const r = window.__probe.converge(n, 0.8);
  return { inside: Math.round(performance.now() - s), exp: +r.exposure.toFixed(3) };
}, N));

await phase('converge(1,0.05)', () => page.evaluate(() => {
  const s = performance.now(); const r = window.__probe.converge(1, 0.05);
  return { inside: Math.round(performance.now() - s), exp: +r.exposure.toFixed(3) };
}));

await phase('screenshot', () => page.screenshot({ path: 'shots/tmp/tprobe.png' }));

await phase('seek again', () => page.evaluate((t) => {
  const p = window.__probe; const s = performance.now(); p.frameAt(t + 1); return Math.round(performance.now() - s) + ' ms inside';
}, T));

await phase('mg only x8', () => page.evaluate(() => {
  const s = performance.now();
  for (let i = 0; i < 8; i++) window.SS.mg.tick(window.__probe.renderer, window.__probe.app);
  return Math.round(performance.now() - s) + ' ms inside';
}));

console.log(JSON.stringify({ boot: boot, errors: errs.slice(0, 4) }));
await browser.close();
