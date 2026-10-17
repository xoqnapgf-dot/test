/* Screenshot harness for verification.
   Usage:  node tools/shot.mjs <outdir> <spec.json>
   Needs a Chromium and puppeteer-core; see tools/README.md. The page is loaded from
   file:// with ?probe=1 so the timeline can be driven deterministically. */
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'node:fs';
import path from 'node:path';

const outDir = process.argv[2] || 'shots';
const specPath = process.argv[3];
const spec = specPath ? JSON.parse(fs.readFileSync(specPath, 'utf8')) : { shots: [] };

fs.mkdirSync(outDir, { recursive: true });

const exePath = await chromium.executablePath();
const browser = await puppeteer.launch({
  args: [...chromium.args, '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader',
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars',
    '--force-device-scale-factor=1'],
  executablePath: exePath,
  headless: true,
  protocolTimeout: 900000,
  defaultViewport: { width: spec.width || 1280, height: spec.height || 720, deviceScaleFactor: 1 }
});

const page = await browser.newPage();
const logs = [];
page.on('console', m => logs.push('[' + m.type() + '] ' + m.text()));
page.on('pageerror', e => logs.push('[pageerror] ' + e.message));
page.on('requestfailed', r => logs.push('[requestfailed] ' + r.url() + ' ' + (r.failure() && r.failure().errorText)));

const root = spec.root || path.resolve(path.dirname(specPath || '.'), '..');
// A spec can ask for one *page load per shot*: generation cost (terrain resolution, noise
// volume size) is a load-time parameter, so comparing those values means reloading.
const PER_SHOT = !!spec.reloadPerShot;
const urlFor = (q) => 'file://' + path.resolve(root, spec.url || 'index.html') + (q ? '?' + q : '');
const url = urlFor(spec.query);
const t0 = Date.now();
await page.goto(url, { waitUntil: 'load', timeout: 180000 });
await page.waitForFunction('window.__probe && window.__probe.booted === true', { timeout: 600000, polling: 1000 });
const bootMs = Date.now() - t0;

let info = await page.evaluate(() => window.__probe.info);
const results = [];
let genMs = [info.genMs];
for (const shot of spec.shots) {
  const t1 = Date.now();
  if (PER_SHOT && shot.query && shot.query !== spec.query) {
    await page.goto(urlFor(shot.query), { waitUntil: 'load', timeout: 180000 });
    await page.waitForFunction('window.__probe && window.__probe.booted === true', { timeout: 600000, polling: 1000 });
    info = await page.evaluate(() => window.__probe.info);
    genMs.push(info.genMs);
  }
  await page.evaluate((s) => {
    const p = window.__probe;
    if (s.film) { if (p.attach) p.attach(); } else if (p.detach) p.detach();
    if (s.state) for (const k in s.state) p.set(k, s.state[k]);
    if (s.stages) p.setStages(s.stages);
    p.setView(s.view || 0);
    if (s.look) p.look(s.look.pos, s.look.target, s.look.fov);
    if (s.place) p.place(s.place);
    if (s.renderAt !== undefined) p.renderAt(s.renderAt);
  }, shot);
  // give the compositor a frame
  await new Promise(r => setTimeout(r, spec.settleMs || 120));
  const dataUrl = await page.evaluate(() => window.__probe.capture());
  const b64 = dataUrl.split(',')[1];
  const file = path.join(outDir, shot.name + '.png');
  fs.writeFileSync(file, Buffer.from(b64, 'base64'));
  results.push({ name: shot.name, ms: Date.now() - t1, file });
}

// ---- numeric measures (no images): set state, render, sample the HDR target
const measures = [];
for (const m of (spec.measures || [])) {
  await page.evaluate((s) => {
    const p = window.__probe;
    if (s.film) { if (p.attach) p.attach(); } else if (p.detach) p.detach();
    if (s.state) for (const k in s.state) p.set(k, s.state[k]);
    if (s.stages) p.setStages(s.stages);
    p.setView(s.view || 0);
    if (s.look) p.look(s.look.pos, s.look.target, s.look.fov);
    if (s.place) p.place(s.place);
    p.renderAt(s.renderAt || 0);
  }, m);
  const tgt = await page.evaluate(() => window.__probe.target());
  const pts = m.points.map(p => Array.isArray(p) ? [Math.round(p[0] * tgt.w), Math.round(p[1] * tgt.h)] : p);
  // `canvas: true` reads the finished canvas (after tonemap and grade) instead of the
  // linear HDR scene target, which is the difference between "the scene is dark" and
  // "the grade is dark".
  const res = await page.evaluate(({ pts, canvas }) =>
    canvas ? window.__probe.display(pts.map(p => [p[0], p[1]]))
           : window.__probe.sample(pts), { pts, canvas: !!m.canvas });
  const norm = res.map((r, i) => Array.isArray(r) ? { xy: pts[i], rgb: r.map(v => v / 255), luma: 0.2126 * r[0] / 255 + 0.7152 * r[1] / 255 + 0.0722 * r[2] / 255 } : r);
  const rec = { name: m.name, target: tgt, samples: norm, mode: m.canvas ? 'canvas' : 'hdr' };
  if (m.hdrRows) {
    rec.hdrRows = await page.evaluate((o) => window.__probe.hdrRows(o.kind, o.h0, o.h1, o.cols), m.hdrRows);
    rec.canvasRows = await page.evaluate((o) => {
      const p = window.__probe, c = p.renderer.canvas;
      const out = [];
      for (let y = o.h0; y <= o.h1; y++) {
        // canvas rows are top-down; the target rows are bottom-up: flip so both lists
        // describe the same screen row
        const pts = [];
        for (let x = 0; x < c.width; x += Math.max(8, (c.width / 24) | 0)) pts.push([x, c.height - 1 - y]);
        const vals = p.display(pts);
        let s = 0; for (const v of vals) s += 0.2126 * v[0] / 255 + 0.7152 * v[1] / 255 + 0.0722 * v[2] / 255;
        out.push(+(s / vals.length).toFixed(5));
      }
      return out;
    }, m.hdrRows);
  }
  if (m.camera) {
    rec.camera = await page.evaluate(() => {
      const c = window.__probe.renderer.camera;
      return { pos: c.pos.map(v => +v.toFixed(1)), fwd: c.fwd.map(v => +v.toFixed(3)), fov: c.fov };
    });
  }
  if (m.stats) {
    const l = res.map(r => r.luma).sort((a, b) => a - b);
    const q = p => l[Math.min(l.length - 1, Math.round(p * (l.length - 1)))];
    rec.stats = { min: l[0], p10: q(0.1), p50: q(0.5), p90: q(0.9), max: l[l.length - 1],
      mean: l.reduce((a, b) => a + b, 0) / l.length };
  }
  measures.push(rec);
}

const terrain = await page.evaluate(() => window.__probe.terrainStats(128));
for (const kind of (spec.dumpTextures || [])) {
  const dataUrl = await page.evaluate((k) => window.__probe.texturePNG(k, 640), kind);
  fs.writeFileSync(path.join(outDir, 'tex_' + kind + '.png'), Buffer.from(dataUrl.split(',')[1], 'base64'));
}
const stats = await page.evaluate(() => ({ stats: window.__probe.renderer.stats, s: window.__probe.renderer.s }));
fs.writeFileSync(path.join(outDir, '_run.json'), JSON.stringify({ info, bootMs, results, stats, logs }, null, 1));
console.log(JSON.stringify({ bootMs, info, terrain, shots: results.length, measures, logs: logs.slice(0, 40) }, null, 1));
await browser.close();
