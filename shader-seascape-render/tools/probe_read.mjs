import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
const exe = await chromium.executablePath();
const browser = await puppeteer.launch({ args: [...chromium.args,'--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
  executablePath: exe, headless: true, protocolTimeout: 900000, defaultViewport:{width:240,height:135}});
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERROR:', e.message));
await page.goto('file:///home/user/test/shader-seascape-render/index.html?probe=1&loop=0&quality=0.25&terrainRes=256&scale=0.3', {waitUntil:'load', timeout:120000});
await page.waitForFunction(() => window.__probe && window.__probe.ready === true, {timeout:600000, polling:1000});
const out = await page.evaluate(() => {
  const p = window.__probe, R = p.renderer, gl = R.api.raw, api = R.api;
  p.set('sunElev',6); p.set('sunAzi',128);
  p.look([2600,352,-300],[2600-9000*Math.sin(128*Math.PI/180),352-9000*Math.sin(3*Math.PI/180),-300-9000*Math.cos(128*Math.PI/180)],50);
  R.render(0, true);
  const T = R.targets, res = {};
  res.readFloatType = api.readFloatType;
  res.sceneFmt = { w: T.w, h: T.h };
  const gx = Math.round(0.5*T.w), gy = Math.round(0.25*T.h);
  const glY = T.h - 1 - gy;
  res.coords = { gx, gy, glY };
  // (1) direct 1x1 half-float readout
  gl.bindFramebuffer(gl.FRAMEBUFFER, T.scene.fbo);
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  res.fbComplete = status === gl.FRAMEBUFFER_COMPLETE;
  res.readBuffer = gl.getParameter(gl.READ_BUFFER);
  res.drawBuffer = gl.getParameter(gl.DRAW_BUFFER);
  while (gl.getError() !== 0) {}
  const u16 = new Uint16Array(4);
  gl.readPixels(gx, glY, 1, 1, gl.RGBA, gl.HALF_FLOAT, u16);
  res.errHalf = gl.getError();
  const h2f = (v) => { const sg=(v&0x8000)?-1:1, e=(v>>10)&0x1f, m=v&0x3ff; return e===0? sg*Math.pow(2,-14)*(m/1024) : sg*Math.pow(2,e-15)*(1+m/1024); };
  res.viaHalf = [h2f(u16[0]), h2f(u16[1]), h2f(u16[2])].map(v=>+v.toFixed(5));
  while (gl.getError() !== 0) {}
  const f32 = new Float32Array(4);
  gl.readPixels(gx, glY, 1, 1, gl.RGBA, gl.FLOAT, f32);
  res.errFloat = gl.getError();
  res.viaFloat = [f32[0], f32[1], f32[2]].map(v=>+v.toFixed(5));
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  // (2) through the API (what measurement scripts use)
  res.viaSample = R.sampleScene(gx, gy).map(v=>+v.toFixed(5));
  // (3) a 4x4 block read to see whether size is the problem
  gl.bindFramebuffer(gl.FRAMEBUFFER, T.scene.fbo);
  const blk = new Uint16Array(4*4*4);
  while (gl.getError() !== 0) {}
  gl.readPixels(gx-2, glY-2, 4, 4, gl.RGBA, gl.HALF_FLOAT, blk);
  res.errBlock = gl.getError();
  res.blockCentre = [h2f(blk[(2*4+2)*4]), h2f(blk[(2*4+2)*4+1]), h2f(blk[(2*4+2)*4+2])].map(v=>+v.toFixed(5));
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  res.apiTypeAfter = api.readFloatType;
  return res;
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
