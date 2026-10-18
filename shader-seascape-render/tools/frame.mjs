// Camera-basis verification: put the camera somewhere known, render the ray-direction
// view, and compare the measured rays with the basis the JS side claims. A flipped
// handedness (screen rotated 180 degrees) shows up immediately as a sign mismatch.
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const exe = await chromium.executablePath();
const browser = await puppeteer.launch({
  args: [...chromium.args, '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader',
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars',
    '--force-device-scale-factor=1'],
  executablePath: exe, headless: true, protocolTimeout: 900000,
  defaultViewport: { width: 320, height: 180, deviceScaleFactor: 1 }
});
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERROR:', e.message));
await page.goto('file:///home/user/test/shader-seascape-render/index.html?probe=1&loop=0&quality=0.2&terrainRes=128&scale=0.3',
  { waitUntil: 'load', timeout: 120000 });
await page.waitForFunction(() => window.__probe && window.__probe.ready === true, { timeout: 600000, polling: 1000 });

const out = await page.evaluate(() => {
  const p = window.__probe;
  p.place({ x: 1800, z: -2600, up: 40, at: [1800, 60, -3600], fov: 60 });   // straight down -Z, level
  p.setView(1);
  p.setStages([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  p.renderAt(0);
  const cam = window.__probe.renderer.camera;
  const T = p.target();
  const pts = [[0.5, 0.5], [0.5, 0.05], [0.5, 0.95], [0.05, 0.5], [0.95, 0.5]];
  const s = p.sample(pts.map(q => [Math.round(q[0] * T.w), Math.round(q[1] * T.h)]));
  const rays = s.map((v, i) => ({ screen: pts[i], rd: v.rgb.map(c => +(c * 2 - 1).toFixed(4)) }));
  return { fwd: cam.fwd, right: cam.right, up: cam.up, pos: cam.pos, fov: cam.fov, rays };
});
console.log(JSON.stringify(out, null, 1));
// what the correct basis would be
const f = out.fwd, u = [0, 1, 0];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nz = v => { const l = Math.hypot(...v); return v.map(c => +(c / l).toFixed(4)); };
const rCorrect = nz(cross(f, u));
console.log('correct right  :', rCorrect, ' page right:', out.right.map(c => +c.toFixed(4)));
console.log('correct up     :', nz(cross(rCorrect, f)), ' page up   :', out.up.map(c => +c.toFixed(4)));
await browser.close();
