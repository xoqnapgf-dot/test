/* Screenshots of the *whole* page - canvas plus the DOM overlays (title, captions,
   instruments) - at a few points in the timeline, so the delivered demo can be looked at
   the way a visitor sees it instead of through the probe.
   Usage:  node tools/pageshot.mjs <outdir> [w] [h] [query] [secs,secs,...]
*/
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'node:fs';
import path from 'node:path';

const outDir = process.argv[2] || 'shots/page';
const W = +(process.argv[3] || 1280), H = +(process.argv[4] || 720);
const query = process.argv[5] || 'quality=0.6&terrainRes=1024&scale=1.0';
const stamps = (process.argv[6] || '2,10,22').split(',').map(Number);
fs.mkdirSync(outDir, { recursive: true });

const exe = await chromium.executablePath();
const browser = await puppeteer.launch({
  args: [...chromium.args, '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader',
    '--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars', '--force-device-scale-factor=1'],
  executablePath: exe, headless: true, protocolTimeout: 900000,
  defaultViewport: { width: W, height: H, deviceScaleFactor: 1 }
});
const page = await browser.newPage();
const logs = [];
page.on('console', m => logs.push('[' + m.type() + '] ' + m.text().slice(0, 300)));
page.on('pageerror', e => logs.push('[pageerror] ' + e.message));
page.on('requestfailed', r => logs.push('[requestfailed] ' + r.url()));
const url = 'file:///home/user/test/shader-seascape-render/index.html?' + query;
const t0 = Date.now();
await page.goto(url, { waitUntil: 'load', timeout: 180000 });
// the real page runs its own loop; give generation time, then watch it play
await new Promise(r => setTimeout(r, 45000));
console.log('boot+settle ms', Date.now() - t0);
for (const s of stamps) {
  await new Promise(r => setTimeout(r, s * 1000));
  const file = path.join(outDir, 'page_' + s + 's.png');
  await page.screenshot({ path: file });
  const state = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    return { t: (window.SS && SS.timeline && SS.timeline.time) || null, w: c && c.width, h: c && c.height,
             fps: (window.SS && SS.stats && SS.stats.fps) || null };
  });
  console.log(file, JSON.stringify(state));
}
console.log('--- console ---');
console.log(logs.slice(0, 40).join('\n'));
await browser.close();
