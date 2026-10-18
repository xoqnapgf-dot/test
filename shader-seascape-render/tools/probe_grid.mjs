// Prints a coarse grid of HDR scene values for a few debug views, so the layout of a frame
// (sky / land / sea / black) can be read as numbers instead of guessed from a PNG.
//   node tools/probe_grid.mjs <terrainRes> <quality>
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
const TR = process.argv[2] || '512', Q = process.argv[3] || '0.6';
const exe = await chromium.executablePath();
const browser = await puppeteer.launch({ args: [...chromium.args,'--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
  executablePath: exe, headless: true, protocolTimeout: 900000, defaultViewport:{width:480,height:270}});
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERROR:', e.message));
await page.goto('file:///home/user/test/shader-seascape-render/index.html?probe=1&loop=0&quality=' + Q + '&terrainRes=' + TR + '&scale=1.0', {waitUntil:'load', timeout:120000});
await page.waitForFunction(() => window.__probe && window.__probe.ready === true, {timeout:600000, polling:1000});
const out = await page.evaluate(() => {
  const p = window.__probe, R = p.renderer, gl = R.api.raw, api = R.api;
  p.set('sunElev', 6); p.set('sunAzi', 128); p.set('exposureAuto', false); p.set('exposure', 1.0);
  p.setStages([1,1,1,1,1,1,1,1,1]);
  const azi = 130, pitch = -3, d = 9000;
  p.look([2600,352,-300], [2600 - d*Math.sin(azi*Math.PI/180), 352 + d*Math.sin(pitch*Math.PI/180), -300 - d*Math.cos(azi*Math.PI/180)], 50);
  const h2f = (v) => { const sg=(v&0x8000)?-1:1, e=(v>>10)&0x1f, m=v&0x3ff; return e===0? sg*Math.pow(2,-14)*(m/1024) : sg*Math.pow(2,e-15)*(1+m/1024); };
  const report = {};
  for (const view of [0, 3, 27]) {
    p.setView(view);
    for (let i=0;i<2;i++) p.renderAt(0, 1/30);
    const T = R.targets, w = T.w, h = T.h;
    gl.bindFramebuffer(gl.FRAMEBUFFER, T.scene.fbo);
    const u16 = new Uint16Array(w*h*4);
    while (gl.getError() !== 0) {}
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.HALF_FLOAT, u16);
    const err = gl.getError();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    const GX = 6, GY = 5, cells = [];
    for (let cy = 0; cy < GY; cy++) {
      const row = [];
      for (let cx = 0; cx < GX; cx++) {
        let s = [0,0,0], n = 0;
        const x0 = Math.floor(cx*w/GX), x1 = Math.floor((cx+1)*w/GX);
        const y0 = Math.floor(cy*h/GY), y1 = Math.floor((cy+1)*h/GY);
        for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) {
          const i = (y*w + x)*4;
          s[0] += h2f(u16[i]); s[1] += h2f(u16[i+1]); s[2] += h2f(u16[i+2]); n++;
        }
        row.push(s.map(v => +(v/n).toFixed(4)));
      }
      cells.push(row);   // row 0 = bottom of the image (GL convention)
    }
    report[view] = { res: [w,h], err, grid: cells };
  }
  return report;
});
for (const view of Object.keys(out)) {
  const r = out[view];
  console.log(`\n=== view ${view}  target ${r.res[0]}x${r.res[1]}  glError ${r.err}   (rows bottom -> top)`);
  for (let i = r.grid.length - 1; i >= 0; i--) {
    const cy = i;
    console.log(' y' + (cy*20) + '%  ' + r.grid[i].map(c => '[' + c.join(' ') + ']').join(' '));
  }
}
await browser.close();
