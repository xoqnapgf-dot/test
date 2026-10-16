import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
const exe = await chromium.executablePath();
const browser = await puppeteer.launch({ args: [...chromium.args,'--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
  executablePath: exe, headless: true, protocolTimeout: 900000, defaultViewport:{width:320,height:180}});
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERROR:', e.message));
page.on('console', m => { const t = m.text(); if (!/boot/.test(t)) console.log('CONSOLE:', t.slice(0,300)); });
await page.goto('file:///home/user/test/shader-seascape-render/index.html?probe=1&loop=0&quality=0.2&terrainRes=256&scale=0.3', {waitUntil:'load', timeout:120000});
await page.waitForFunction(() => window.__probe && window.__probe.ready === true, {timeout:600000, polling:1000});
const out = await page.evaluate(() => {
  const R = window.__probe.renderer, gl = R.api.raw, api = R.api;
  const res = {};
  const tex = R.gen.atlas;
  res.volumeSize = R.gen.volumeSize;
  res.isTexture = gl.isTexture(tex);
  for (const z of [0, 32, 64, 127]) {
    api.bind(api.target3D(tex, z));
    res['status_z' + z] = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE ? 'COMPLETE' : gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    const px = new Uint8Array(128 * 128 * 4);
    gl.readPixels(0, 0, 128, 128, gl.RGBA, gl.UNSIGNED_BYTE, px);
    let mn = 255, mx = 0, sum = 0;
    for (let i = 0; i < px.length; i += 4) { const v = px[i + 1]; mn = Math.min(mn, v); mx = Math.max(mx, v); sum += v; }
    res['layer' + z] = { min: mn, max: mx, mean: +(sum / (px.length / 4)).toFixed(2) };
  }
  // does the volume shader program exist and what does it think?
  res.hasVolumeProgram = !!R.programs.volume;
  // sample the volume from the scene shader by rendering view 31 at a few points
  return res;
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
