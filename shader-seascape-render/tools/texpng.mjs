/* Write one of the renderer's own textures out as a PNG, so the height field, the weather
 * map or the sky LUT can be looked at directly instead of being inferred from a frame.
 *
 *   node tools/texpng.mjs <kind> <out.png> [maxSize] [extraQuery]
 *   kinds: terrain (post-erosion) heightRaw (first pass) ao weather blueNoise sky sunTrans
 */
import { launch } from './_browser.mjs';
import fs from 'node:fs';
import path from 'node:path';

const kind = process.argv[2] || 'terrain';
const out = process.argv[3] || 'shots/tex_' + kind + '.png';
const maxSize = process.argv[4] ? parseInt(process.argv[4], 10) : 1024;
const extra = process.argv[5] || '';
const root = path.resolve('.');
const { browser, page } = await launch({ width: 320, height: 200 });
await page.goto('file://' + root + '/index.html?probe=1&loop=0&quality=0.2&terrainRes=512&scale=0.3' +
  (extra ? '&' + extra : ''), { waitUntil: 'domcontentloaded' });
await page.waitForFunction('window.__probe && window.__probe.booted === true', { timeout: 300000 });

const res = await page.evaluate((a) => {
  const url = window.__probe.texturePNG(a.kind, a.maxSize);
  return { url, info: window.__probe.state ? window.__probe.state() : null };
}, { kind, maxSize });

if (!res.url) { console.log('no texture for ' + kind); await browser.close(); process.exit(1); }
fs.writeFileSync(out, Buffer.from(res.url.split(',')[1], 'base64'));
console.log(JSON.stringify({ out, kind, bytes: fs.statSync(out).size }));
await browser.close();
