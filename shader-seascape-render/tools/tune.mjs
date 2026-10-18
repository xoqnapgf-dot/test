// One-launch tuning rig: render a small set of frames and read a fixed grid of HDR
// samples plus the finished canvas, so a tuning decision can be made from numbers and
// from the images without paying the browser start-up cost for every try.
//
//   node tools/tune.mjs <spec.json>
//
// Spec shape (all optional except variants):
//   { query, width, height, look, points, variants: [ { name, state, stages, view } ] }
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'node:fs';
import path from 'node:path';

const specFile = process.argv[2];
const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
const root = spec.root || '/home/user/test/shader-seascape-render';
const outDir = spec.out || path.join(root, 'shots');
const W = spec.width || 480, H = spec.height || 270;

const exe = await chromium.executablePath();
const browser = await puppeteer.launch({
  args: [...chromium.args, '--enable-unsafe-swiftshader', '--use-gl=angle',
    '--use-angle=swiftshader', '--no-sandbox', '--disable-dev-shm-usage', '--force-device-scale-factor=1'],
  executablePath: exe, headless: true, protocolTimeout: 900000,
  defaultViewport: { width: W, height: H }
});
const page = await browser.newPage();
const logs = [];
page.on('console', m => logs.push(m.text().slice(0, 200)));
page.on('pageerror', e => { console.log('PAGEERROR:', e.message); logs.push('ERR ' + e.message); });
const q = spec.query || 'probe=1&loop=0&quality=0.35&terrainRes=512&scale=0.35';
await page.goto('file://' + root + '/index.html?' + q, { waitUntil: 'load', timeout: 120000 });
await page.waitForFunction(() => window.__probe && window.__probe.booted === true, { timeout: 600000, polling: 1000 });

const out = [];
for (const v of spec.variants) {
  const t0 = Date.now();
  const res = await page.evaluate((v) => {
    const p = window.__probe;
    // the film writes the render state every frame it runs, so a probe takes it back
    // first - unless the variant asks for a film stamp (v.film)
    if (v.film) { if (p.attach) p.attach(); } else if (p.detach) p.detach();
    if (v.state) for (const k in v.state) p.set(k, v.state[k]);
    if (v.stages) p.setStages(v.stages);
    p.setView(v.view || 0);
    if (v.look) p.look(v.look.pos, v.look.target, v.look.fov);
    if (v.place) p.place(v.place);
    // let the auto exposure settle: it is a filter, so a single frame reads the previous
    // value. Eight frames is enough for a 1.9/s adaptation at 1/30 s per frame.
    for (let i = 0; i < (v.settleFrames === undefined ? 6 : v.settleFrames); i++) {
      p.renderAt(0, 1 / 30);
    }
    const data = p.capture();
    const pts = (v.points || []).map(f => [Math.round(f[0] * p.target().w), Math.round(f[1] * p.target().h)]);
    const hdr = p.sample(pts).map((s, i) => ({ xy: pts[i], rgb: s.rgb.map(x => +x.toFixed(4)), luma: +s.luma.toFixed(4) }));
    const canvasPts = (v.points || []).map(f => [f[0] * p.renderer.canvas.width, f[1] * p.renderer.canvas.height]);
    const canvas = p.display(canvasPts).map((c, i) => ({ xy: (v.points || [])[i], rgb: c, luma: +(0.2126 * c[0] / 255 + 0.7152 * c[1] / 255 + 0.0722 * c[2] / 255).toFixed(4) }));
    return { hdr, canvas, dataUrl: data, exposure: p.renderer.lastExposure, autoExp: p.renderer.autoExp };
  }, v);
  const file = path.join(outDir, v.name + '.png');
  fs.writeFileSync(file, Buffer.from(res.dataUrl.split(',')[1], 'base64'));
  out.push({ name: v.name, ms: Date.now() - t0, exposure: res.exposure, autoExp: res.autoExp, hdr: res.hdr, canvas: res.canvas });
}
console.log(JSON.stringify({ variants: out, logs: logs.slice(0, 30) }, null, 1));
await browser.close();
