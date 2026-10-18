/* Contact sheet: lay several PNGs out in a grid with labels, as one PNG, so a run of
 * frames can be reviewed in a single look instead of one file at a time.
 *
 *   node tools/sheet.mjs --out shots/sheet.png --cols 3 --tile 480 \
 *     --files a.png,b.png,c.png [--labels "one,two,three"]
 *
 * Images are referenced by relative path from tools/tmp, so file:// can load them.
 */
import { launch } from './_browser.mjs';
import path from 'node:path';
import fs from 'node:fs';

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith('--')) args[a.slice(2)] = (process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) ? process.argv[++i] : true;
}
const files = String(args.files || '').split(',').map((s) => s.trim()).filter(Boolean);
if (!files.length) { console.log('need --files'); process.exit(1); }
const cols = parseInt(args.cols || '3', 10);
const tile = parseInt(args.tile || '480', 10);
const labels = String(args.labels || '').split(',').map((s) => s.trim());
const out = args.out || 'shots/sheet/sheet.png';
const rows = Math.ceil(files.length / cols);
const W = cols * tile, H = rows * (tile + 22);

const root = path.resolve('.');
fs.mkdirSync(path.join(root, 'tools', 'tmp'), { recursive: true });
const rel = files.map((f) => path.relative(path.join(root, 'tools', 'tmp'), path.resolve(f)).split(path.sep).join('/'));
const html = `<!doctype html><meta charset="utf-8"><style>
  html,body{margin:0;background:#101216;font:12px/16px -apple-system,Segoe UI,Roboto,sans-serif;color:#dfe4ea}
  .grid{display:grid;grid-template-columns:repeat(${cols},${tile}px)}
  figure{margin:0;padding:0;position:relative;background:#000}
  figure img{width:${tile}px;height:${tile}px;object-fit:contain;display:block}
  figcaption{height:22px;line-height:22px;padding:0 6px;color:#9fb0c0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:#181c22}
  b{color:#ffb347;font-weight:600}</style>
  <div class="grid">${rel.map((r, i) => `<figure><img src="${r}"><figcaption><b>${String(i + 1).padStart(2, '0')}</b> ${labels[i] || files[i]}</figcaption></figure>`).join('')}</div>`;
const tmp = path.join(root, 'tools', 'tmp', 'sheet.html');
fs.writeFileSync(tmp, html);

const { browser, page } = await launch({ width: W, height: H });
await page.goto('file://' + tmp, { waitUntil: 'load' });
await page.evaluate(() => Promise.all(Array.from(document.images).map((im) => im.complete ? 1 : new Promise((r) => { im.onload = r; im.onerror = r; }))));
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: W, height: H } });
console.log(JSON.stringify({ out, tiles: files.length, cols, rows, size: [W, H] }));
await browser.close();
