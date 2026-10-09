// Render chosen moments to PNG with headless Chromium for review.
// usage: node tools/frames.mjs <outdir> <width> t1 t2 ...   (times in seconds, or "scene:id[:n]")
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const [out, width = '1280', ...ts] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME || undefined,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: +width, height: Math.round((+width * 9) / 16) } });
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') console.log('[page]', m.text());
});
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
const url = pathToFileURL(path.join(root, 'index.html')).href + `?capture&w=${width}`;
await page.goto(url);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
let times = [];
for (const t of ts) {
  if (t.startsWith('scene:')) {
    const [, id, n = '8'] = t.split(':');
    const s = await page.evaluate((id) => window.PV.SCENES.find((s) => s.id === id), id);
    for (let i = 0; i < +n; i++) times.push(+(s.t0 + ((s.t1 - s.t0) * (i + 0.5)) / +n).toFixed(2));
  } else times.push(+t);
}
for (const t of times) {
  const t0 = Date.now();
  await page.evaluate((t) => window.PV.renderAt(t), t);
  const f = path.join(out, `f_${String(t.toFixed(2)).padStart(8, '0')}.png`);
  await page.locator('#gl').screenshot({ path: f });
  console.log(f, Date.now() - t0, 'ms');
}
await browser.close();
