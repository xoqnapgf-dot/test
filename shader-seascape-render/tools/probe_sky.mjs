// Compare, inside one page, what the scene's skyRadiance returns at a pixel with the raw
// texel of the sky LUT that the same ray maps to. If they disagree, the lookup mapping and
// the bake mapping are not the same function.
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const exe = await chromium.executablePath();
const browser = await puppeteer.launch({
  args: [...chromium.args, '--enable-unsafe-swiftshader', '--use-gl=angle',
    '--use-angle=swiftshader', '--no-sandbox', '--disable-dev-shm-usage'],
  executablePath: exe, headless: true, protocolTimeout: 900000, defaultViewport: { width: 480, height: 270 }
});
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERROR:', e.message));
await page.goto('file:///home/user/test/shader-seascape-render/index.html?probe=1&loop=0&quality=0.4&terrainRes=256&scale=0.3', { waitUntil: 'load', timeout: 120000 });
await page.waitForFunction(() => window.__probe && window.__probe.ready === true, { timeout: 600000, polling: 1000 });

const out = await page.evaluate(() => {
  const R = window.__probe.renderer, gl = R.api.raw, api = R.api;
  R.s.sunElev = 6; R.s.sunAzi = 128; R.s.skyScale = 1.0; R.s.view = 24;
  window.__probe.look([2600, 352, -300], [2600 - 9000 * Math.sin(128 * Math.PI / 180) * Math.cos(3 * Math.PI / 180), 352 - 9000 * Math.sin(3 * Math.PI / 180), -300 - 9000 * Math.cos(128 * Math.PI / 180) * Math.cos(3 * Math.PI / 180)], 50);
  R.render(0, true);

  // rebuild the ray exactly like the shader does
  const cam = R.camera, tanH = Math.tan(cam.fov * Math.PI / 360);
  const f = cam.fwd, right = cam.right, up = cam.up;
  const u = (x, y) => { const p = [x, y]; return p; };
  const res = {};
  const dirFor = (fx, fy) => {
    const px = (fx * 2 - 1) * (R.targets.w / R.targets.h) * tanH;
    const py = (fy * 2 - 1) * tanH;
    const d = [f[0] + right[0] * px + up[0] * py, f[1] + right[1] * px + up[1] * py, f[2] + right[2] * px + up[2] * py];
    const l = Math.hypot(d[0], d[1], d[2]);
    return [d[0] / l, d[1] / l, d[2] / l];
  };
  res.target = { w: R.targets.w, h: R.targets.h };
  // read the LUT as floats
  const sky = R.gen.sky;
  const t = api.target(sky.w, sky.h, gl.RGBA16F, gl.HALF_FLOAT, gl.NEAREST);
  api.bind(t);
  R.programs.copy.use().setTex('uSrc', sky.tex, 0).set('uRes', [sky.w, sky.h]);
  api.drawQuad();
  const buf = new Float32Array(sky.w * sky.h * 4);
  api.readFloats(0, 0, sky.w, sky.h, buf);
  const lutAt = (uu, vv) => {
    const x = Math.min(sky.w - 1, Math.max(0, Math.round(uu * (sky.w - 1))));
    const y = Math.min(sky.h - 1, Math.max(0, Math.round(vv * (sky.h - 1))));
    const i = (y * sky.w + x) * 4;
    return [buf[i], buf[i + 1], buf[i + 2]].map(v => +v.toFixed(4));
  };
  const TAU = Math.PI * 2;
  const ELMIN = -0.06, ELMAX = Math.PI / 2;
  const rows = [];
  for (const [fx, fy] of [[0.5, 0.06], [0.5, 0.30], [0.5, 0.42], [0.5, 0.45], [0.5, 0.5], [0.5, 0.7]]) {
    const d = dirFor(fx, fy);
    const el = Math.asin(Math.max(-1, Math.min(1, d[1])));
    const v = Math.pow(Math.max(0, Math.min(1, (el - ELMIN) / (ELMAX - ELMIN))), 1 / 2.2);
    let rel = Math.atan2(d[0], d[2]) - (128 * Math.PI / 180) + Math.PI;
    rel = ((rel % TAU) + TAU) % TAU;
    const uu = rel / TAU;
    const scene = R.sampleScene(Math.round(fx * R.targets.w), Math.round(fy * R.targets.h));
    rows.push({ fx, fy, dir: d.map(v => +v.toFixed(3)), el: +el.toFixed(3), uv: [+uu.toFixed(3), +v.toFixed(3)],
      lut: lutAt(uu, v), scene: scene.map(v => +v.toFixed(4)) });
  }
  res.rows = rows;
  return res;
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
