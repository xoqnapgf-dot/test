/* Why is #caption empty? Dump the caption layer's own state, the DOM, and any error
 * thrown while entering the film.  node tools/capdbg.mjs
 */
import { launch } from './_browser.mjs';
import path from 'node:path';

const root = path.resolve('.');
const { browser, page } = await launch({ width: 900, height: 520 });
const errs = [];
page.on('pageerror', (e) => errs.push('pageerror: ' + String(e.stack || e).slice(0, 400)));
page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 300)); });

await page.goto('file://' + root + '/index.html?probe=1&loop=0&quality=0.2&terrainRes=256&scale=0.3',
  { waitUntil: 'domcontentloaded' });
await page.waitForFunction('window.__probe && window.__probe.booted === true', { timeout: 300000 });

const out = await page.evaluate(() => {
  const p = window.__probe, app = p.app, R = p.renderer;
  const el = document.getElementById('caption');
  const sub = document.getElementById('captionSub');
  const snap = (tag) => ({
    tag,
    appTime: +app.time.toFixed(2),
    captionsFlag: app.captions,
    film: !!app.film,
    ssCaptions: !!window.SS.captions,
    captionHtmlLen: el ? el.innerHTML.length : -1,
    captionText: el ? el.textContent.slice(0, 40) : null,
    captionOpacity: el ? el.style.opacity : null,
    subText: sub ? sub.textContent : null,
    parent: el && el.parentNode ? el.parentNode.id || el.parentNode.className : null
  });
  const log = [snap('booted')];
  app.playing = false;
  window.SS.timeline.seekTo(5, R, app);
  log.push(snap('t=5'));
  try {
    window.SS.captions.enter(window.SS.timeline.cues, app);
    log.push(snap('after-manual-enter'));
    window.SS.timeline.seekTo(5, R, app);
    log.push(snap('after-enter-t5'));
  } catch (e) { log.push({ tag: 'enter-threw', msg: String(e && e.message) }); }
  return { log, cueCount: window.SS.timeline.cues.length, firstCue: window.SS.timeline.cues[0], capRect: el ? el.getBoundingClientRect().toJSON() : null };
});
console.log(JSON.stringify(out, null, 1));
console.log('ERR', JSON.stringify(errs.slice(0, 8), null, 1));
await browser.close();
