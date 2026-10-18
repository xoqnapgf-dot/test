/* Parameter sweep: renders the sky in many configurations and reports linear radiance
   at fixed screen points, so the atmosphere can be tuned with numbers instead of taste.
   Usage: node tools/sweep.mjs <out.json> [cases.json] */
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'node:fs';
import path from 'node:path';

const outFile = process.argv[2] || '/tmp/sweep.json';
const cases = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], 'utf8')) : [];

const exe = await chromium.executablePath();
const browser = await puppeteer.launch({
  args: [...chromium.args, '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader',
    '--no-sandbox', '--disable-dev-shm-usage', '--force-device-scale-factor=1'],
  executablePath: exe, headless: true, protocolTimeout: 900000,
  defaultViewport: { width: cases.width || 320, height: cases.height || 180, deviceScaleFactor: 1 }
});
const page = await browser.newPage();
page.on('console', m => { if (m.type() === 'error') console.log('ERR', m.text().slice(0, 200)); });
page.on('pageerror', e => console.log('PAGEERROR', e.message.slice(0, 300)));

const q = cases.query || 'probe=1&loop=0&quality=0.25&terrainRes=256&scale=0.4';
await page.goto('file://' + path.resolve(cases.root || '.', 'index.html') + '?' + q, { waitUntil: 'load', timeout: 120000 });
await page.waitForFunction('window.__probe && window.__probe.ready === true', { timeout: 600000, polling: 1000 });

// screen points: fraction of the frame (x, y from top-left)
const pts = cases.points || [
  [0.5, 0.02], [0.5, 0.08], [0.5, 0.15], [0.5, 0.25], [0.5, 0.35], [0.5, 0.45],
  [0.08, 0.2], [0.92, 0.2], [0.25, 0.1], [0.75, 0.1]
];
const out = [];
for (const c of cases.cases) {
  await page.evaluate((c) => {
    const p = window.__probe;
    p.setStages([1, 0, 1, 1, 1, 0, 1, 0, 1]);
    p.setView(0);
    if (c.state) for (const k in c.state) p.set(k, c.state[k]);
    p.renderAt(0);
  }, c);
  const tgt = await page.evaluate(() => window.__probe.target());
  const samplePts = pts.map(([x, y]) => [Math.round(x * tgt.w), Math.round(y * tgt.h)]);
  const s = await page.evaluate((pts) => window.__probe.sample(pts), samplePts);
  const disp = await page.evaluate((f) => window.__probe.display(f), pts);
  // an sRGB preview colour for each sample, using plain exposure 0.9 and gamma
  out.push({
    name: c.name, state: c.state,
    display: disp,
    samples: s.map(v => {
      const e = 0.9;
      const g = v => Math.pow(Math.max(0, Math.min(1, v * e)), 1 / 2.2);
      const to255 = v => Math.round(255 * g(v));
      return { xy: v.xy, lin: v.rgb.map(x => +x.toFixed(4)), srgb: [to255(v.rgb[0]), to255(v.rgb[1]), to255(v.rgb[2])] };
    })
  });
  console.log(c.name, 'display:', out[out.length - 1].display.slice(0, 6).map(d => d.join(',')).join(' | '));
}
fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
await browser.close();
