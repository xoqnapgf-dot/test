// Projection check: where is the sun supposed to land on screen, and what does the
// renderer actually show there? Also reports the ray direction at the frame corners, so a
// camera-convention mistake shows up as a number instead of a guess.
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const exe = await chromium.executablePath();
const browser = await puppeteer.launch({
  args: [...chromium.args, '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader',
    '--no-sandbox', '--disable-dev-shm-usage', '--force-device-scale-factor=1'],
  executablePath: exe, headless: true, protocolTimeout: 900000,
  defaultViewport: { width: 320, height: 180 }
});
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERROR:', e.message));

const args = Object.fromEntries(process.argv.slice(2).map(a => a.split('=')));
const raw = { x: +args.x, z: +args.z, up: +args.up, fov: +args.fov || 55,
  at: [+args.atx, +args.aty, +args.atz] };

await page.goto('file:///home/user/test/shader-seascape-render/index.html?probe=1&loop=0&quality=0.3&terrainRes=256&scale=0.3',
  { waitUntil: 'load', timeout: 120000 });
await page.waitForFunction(() => window.__probe && window.__probe.ready === true, { timeout: 600000, polling: 1000 });
console.log('state keys:', JSON.stringify(await page.evaluate(() => Object.keys(window.__probe.state() || {}))));

const res = await page.evaluate((place) => {
  const p = window.__probe;
  p.place(place);
  p.set('sunElev', 16); p.set('sunAzi', 250); p.set('multiScatter', 1.0);
  p.setView(1); p.renderAt(0);
  const st = p.state();
  const cam = window.__probe.renderer.camera;
  const T = p.target();
  // build the basis the same way the shader does, from the state the page reports
  const fwd = cam.fwd, up = cam.up, right = cam.right, tanHalf = Math.tan(cam.fov * Math.PI / 360);
  const dir = (x, y) => {
    const sx = (x / T.w * 2 - 1) * tanHalf * (T.w / T.h);
    const sy = (1 - y / T.h * 2) * tanHalf;
    return [fwd[0] + right[0] * sx + up[0] * sy,
            fwd[1] + right[1] * sx + up[1] * sy,
            fwd[2] + right[2] * sx + up[2] * sy];
  };
  const el = st.sunElev * Math.PI / 180, az = st.sunAzi * Math.PI / 180;
  const sun = { dir: [Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)] };
  // project the sun direction into normalised screen space with that basis
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const s = sun.dir || sun;
  const sd = [s[0] ?? s.x, s[1] ?? s.y, s[2] ?? s.z];
  const zc = dot(sd, fwd) || 1e-6;
  const nx = dot(sd, right) / zc / (tanHalf * T.w / T.h);
  const ny = dot(sd, up) / zc / tanHalf;
  return {
    target: T,
    cam: { pos: cam.pos, fwd, up, right, fov: cam.fov },
    sun: sd,
    sunScreen: [0.5 + nx * 0.5, 0.5 - ny * 0.5],
    cornerDirs: { tl: dir(0, 0), tr: dir(T.w, 0), bl: dir(0, T.h) },
    stateSun: { elev: st.sunElev, azi: st.sunAzi }
  };
}, raw);

console.log(JSON.stringify(res, null, 1));

// measure the actual pixel brightness along the sun's screen column
const pts = [];
for (let i = 0; i <= 20; i++) pts.push([res.sunScreen[0], i / 20]);
await page.evaluate(() => window.__probe.setView(24));
await page.evaluate(() => window.__probe.renderAt(0));
const samples = await page.evaluate((pts) => {
  const T = window.__probe.target();
  return window.__probe.sample(pts.map(p => [Math.round(p[0] * T.w), Math.round(p[1] * T.h)]));
}, pts);
console.log(samples.map((s, i) => `y=${(i / 20).toFixed(2)} luma=${s.luma.toFixed(3)}`).join('\n'));
await browser.close();
