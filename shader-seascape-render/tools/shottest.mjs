/* Does a page screenshot of a live WebGL page work at all here, and does it disturb the
 * page? Captures the same frame three ways and reports what each produced. */
import { launch } from './_browser.mjs';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve('.');
const { browser, page } = await launch({ width: 640, height: 360 });
const logs = [];
page.on('pageerror', (e) => logs.push('PAGEERROR ' + String(e).slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'error') logs.push('ERR ' + m.text().slice(0, 200)); });

await page.goto('file://' + root + '/index.html?probe=1&loop=0&quality=0.2&terrainRes=256&scale=0.3',
  { waitUntil: 'domcontentloaded' });
await page.waitForFunction('window.__probe && window.__probe.booted === true', { timeout: 300000 });
await page.evaluate(() => { window.__probe.frameAt(30); window.__probe.settle(3); });
await new Promise((r) => setTimeout(r, 800));

const state = () => page.evaluate(() => ({
  failHidden: document.getElementById('fail').hidden,
  boot: document.getElementById('boot').className,
  canvasW: document.getElementById('stage').width,
  ctxLost: (window.__probe.renderer.api.raw && window.__probe.renderer.api.raw.isContextLost) ? window.__probe.renderer.api.raw.isContextLost() : 'unknown'
}));
const out = {};
out.before = await state();

try {
  await page.screenshot({ path: 'shots/sst_fromsurface.png', fromSurface: true, captureBeyondViewport: false });
  out.fromSurface = fs.statSync('shots/sst_fromsurface.png').size;
} catch (e) { out.fromSurfaceErr = String(e.message).slice(0, 120); }
out.mid = await state();

try {
  await page.screenshot({ path: 'shots/sst_nosurface.png', fromSurface: false, captureBeyondViewport: false });
  out.noSurface = fs.statSync('shots/sst_nosurface.png').size;
} catch (e) { out.noSurfaceErr = String(e.message).slice(0, 120); }
out.after = await state();

// and the canvas on its own, through the page's own exporter
const dataUrl = await page.evaluate(() => window.__probe.capture());
fs.writeFileSync('shots/sst_canvas.png', Buffer.from(dataUrl.split(',')[1], 'base64'));
out.canvas = fs.statSync('shots/sst_canvas.png').size;
out.logs = logs.slice(0, 6);
console.log(JSON.stringify(out, null, 1));
await browser.close();
