/*
 * Does the page work when it is *served*, rather than opened from disk?
 *
 * The deliverable is deployed by pointing a static host (or a CDN) at the project folder,
 * so the page is fetched over HTTP from a sub-directory - a different situation from the
 * file:// URLs every other tool in this folder uses: MIME types matter, requests can 404,
 * and the fonts arrive over the network instead of off the disk. This runs the film against
 * a local static server and reports every response, every console message, and whether the
 * four fonts actually loaded.
 *
 *   python3 -m http.server 8080 --bind 0.0.0.0     (in the repository root)
 *   node tools/httpcheck.mjs [port] [stamps]
 */
import { launch } from './_browser.mjs';

const port = process.argv[2] || '8080';
const stamps = (process.argv[3] || '5,26,47,68,90').split(',').map(Number);
const PAGE = 'http://127.0.0.1:' + port + '/shader-seascape-render/index.html' +
  '?probe=1&loop=0&quality=0.35&scale=0.3&terrainRes=512';

const { browser, page } = await launch({ width: 1280, height: 720 });
const errors = [];
const responses = [];
const console_ = [];
page.on('console', (m) => {
  const t = m.text();
  console_.push(m.type() + ': ' + t);
  if (m.type() === 'error' || /fail|error|undefined is not|cannot read|three\.js|ERROR:/i.test(t)) errors.push('console ' + m.type() + ': ' + t);
});
page.on('pageerror', (e) => errors.push('pageerror: ' + (e && e.message)));
page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url() + ' ' + (r.failure() ? r.failure().errorText : '')));
page.on('response', (r) => responses.push([r.status(), r.url().replace('http://127.0.0.1:' + port, ''), r.headers()['content-type'] || '']));

await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
let booted = true;
try {
  await page.waitForFunction('window.__probe && window.__probe.booted === true', { timeout: 300000 });
} catch (e) {
  booted = false;
  errors.push('never booted: ' + e.message);
}

const out = await page.evaluate(async (o) => {
  const p = window.__probe, R = p.renderer;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  // the four faces, resolved through the CSS the page ships
  const faces = ['Space Grotesk', 'JetBrains Mono', 'Noto Sans SC', 'Noto Serif SC'];
  const fontCheck = {};
  await document.fonts.ready;
  for (const f of faces) fontCheck[f] = document.fonts.check('16px "' + f + '"', '0123 汉字ABC');
  const stamps = [];
  for (const t of o.stamps) {
    p.frameAt(t);
    p.settle(6, 0.25);
    stamps.push({ t, exp: +R.lastExposure.toFixed(3), ch: window.SS.timeline.progress(t).index,
      cards: document.querySelectorAll('#cards .card:not([hidden])').length, mg: window.SS.mg.state().frames });
  }
  return { fontCheck, stamps, renderer: { w: R.targets.w, h: R.targets.h, view: R.s.view, scale: R.stats.scale },
    gl: { vendor: R.api.raw.getParameter(0x1F00), renderer: R.api.raw.getParameter(0x1F01), lost: R.api.raw.isContextLost() } };
}, { stamps });

// a picture of the served page, so the HTTP path is judged by eye and not only by status codes
import fs from 'node:fs';
fs.mkdirSync('shots/http', { recursive: true });
for (const t of stamps) {
  await page.evaluate((tt) => { window.__probe.frameAt(tt); window.__probe.settle(4, 0.4); }, t);
  // the chapter title fades on a change (a CSS transition), and a screenshot taken during
  // it catches the whole title block at partial opacity - which reads as a defect in the
  // image and is not one
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: 'shots/http/served_' + t + '.png' });
}
console.log('screenshots: shots/http/served_{' + stamps.join(',') + '}.png');

const bad = responses.filter((r) => r[0] !== 200 && r[0] !== 206);
console.log('# served over HTTP from ' + PAGE.split('/index.html')[0]);
console.log('booted: ' + booted + '   gl: ' + JSON.stringify(out.gl));
console.log('renderer: ' + JSON.stringify(out.renderer));
console.log('fonts: ' + JSON.stringify(out.fontCheck));
console.log('stamps:');
for (const s of out.stamps) console.log('   t ' + String(s.t).padStart(3) + '  ch ' + s.ch + '  exp ' + s.exp + '  cards ' + s.drawn + '  mg frames ' + s.mg);
console.log('\nrequests (' + responses.length + '), non-200: ' + (bad.length ? JSON.stringify(bad) : 'none'));
const byType = {};
for (const r of responses) { const k = (r[2] || '?').split(';')[0]; byType[k] = (byType[k] || 0) + 1; }
console.log('content-types: ' + JSON.stringify(byType));
const htmlish = responses.filter((r) => /\.(js|css|woff2)$/.test(r[1]) && /text\/html/.test(r[2]));
console.log('script/css/font served as text/html: ' + (htmlish.length ? JSON.stringify(htmlish) : 'none'));
console.log('console messages: ' + console_.length + (console_.length ? '  e.g. ' + JSON.stringify(console_.slice(0, 6)) : ''));
console.log('errors: ' + (errors.length ? JSON.stringify(errors.slice(0, 12), null, 1) : 'none'));
await browser.close();
