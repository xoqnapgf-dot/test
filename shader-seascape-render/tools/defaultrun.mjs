/*
 * The path a visitor actually takes: open the page with no query parameters at all, watch the
 * boot screen, and let the film play.
 *
 * Every other tool in this folder drives the film through ?probe=1&quality=…&terrainRes=…,
 * because that is how a capture is made deterministic. None of them covers "what happens when
 * someone just opens index.html": the default terrain resolution (2048, a real bake), the
 * adaptive-resolution controller, the boot overlay fading out, the auto-exposure finding its
 * level from a cold start, and the clock running on its own. This does, and screenshots it.
 *
 *   node tools/defaultrun.mjs [url] [seconds...]
 */
import { launch } from './_browser.mjs';

const PAGE = process.argv[2] || 'http://127.0.0.1:8080/shader-seascape-render/index.html';
const shots = (process.argv[3] || '12,26,44').split(',').map(Number);
const { browser, page } = await launch({ width: 1280, height: 720 });

const errors = [];
const logs = [];
page.on('console', (m) => {
  const t = m.text();
  logs.push(m.type() + ': ' + t.slice(0, 160));
  if (m.type() === 'error') errors.push(t.slice(0, 200));
});
page.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 200)));
page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url().slice(-60)));

const t0 = Date.now();
await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
await page.waitForFunction('window.SS && window.SS.timeline && window.SS.renderer && window.SS.renderer.ready === true', { timeout: 600000 });
const bootMs = Date.now() - t0;
console.log('booted in ' + (bootMs / 1000).toFixed(1) + ' s');

let last = 0;
for (const s of shots) {
  const wait = Math.max(0, (s - last) * 1000);
  await new Promise((r) => setTimeout(r, wait));
  last = s;
  const st = await page.evaluate(() => {
    const R = window.SS.renderer, app = window.SS.app || (window.__probe && window.__probe.app);
    const T = window.SS.timeline;
    return {
      t: app ? +app.time.toFixed(1) : null, playing: app ? app.playing : null,
      res: [R.targets.w, R.targets.h], scale: +(R.stats.scale || 1).toFixed(2), ms: +(R.stats.ms || 0).toFixed(1),
      exp: +(R.lastExposure || 0).toFixed(3), ch: app ? T.progress(app.time).index : null,
      boot: document.getElementById('boot') ? getComputedStyle(document.getElementById('boot')).opacity : null,
      caption: (document.getElementById('caption') || {}).textContent || ''
    };
  });
  await page.screenshot({ path: 'shots/http/default_' + s + '.png' });
  console.log('at ' + s + 's wall: ' + JSON.stringify(st));
}
console.log('console: ' + logs.slice(0, 8).map((l) => l.slice(0, 90)).join(' | '));
console.log('errors: ' + (errors.length ? JSON.stringify(errors.slice(0, 6)) : 'none'));
await browser.close();
