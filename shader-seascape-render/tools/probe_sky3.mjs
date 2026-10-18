import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
const exe = await chromium.executablePath();
const browser = await puppeteer.launch({ args: [...chromium.args,'--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
  executablePath: exe, headless: true, protocolTimeout: 900000, defaultViewport:{width:240,height:135}});
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERROR:', e.message));
await page.goto('file:///home/user/test/shader-seascape-render/index.html?probe=1&loop=0&quality=0.25&terrainRes=256&scale=0.3', {waitUntil:'load', timeout:120000});
await page.waitForFunction(() => window.__probe && window.__probe.ready === true, {timeout:600000, polling:1000});
const out = await page.evaluate((noauto) => {
  window.__NOAUTO = noauto;
  const p = window.__probe, R = p.renderer, gl = R.api.raw, api = R.api;
  const skyLutProbe = () => {
    const sky = R.gen.sky;
    if (!R.__t || R.__t.w !== sky.w) R.__t = api.target(sky.w, sky.h, gl.RGBA16F, gl.HALF_FLOAT, gl.NEAREST);
    api.bind(R.__t);
    R.programs.copy.use().setTex('uSrc', sky.tex, 0).set('uRes', [sky.w, sky.h]);
    api.drawQuad();
    const buf = new Float32Array(sky.w * sky.h * 4);
    api.readFloats(0, 0, sky.w, sky.h, buf);
    const pick = (u, v) => { const x = Math.round(u * (sky.w - 1)), y = Math.round(v * (sky.h - 1)); const i = (y * sky.w + x) * 4; return [+buf[i].toFixed(5), +buf[i+1].toFixed(5), +buf[i+2].toFixed(5)]; };
    return { low: pick(0.5, 0.10), mid: pick(0.5, 0.45), high: pick(0.5, 0.9) };
  };
  p.set('sunElev',6); p.set('sunAzi',128); p.set('skyScale',1.0);
  if (window.__NOAUTO) p.set('exposureAuto', false);
  p.look([2600,352,-300],[2600-9000*Math.sin(128*Math.PI/180),352-9000*Math.sin(3*Math.PI/180),-300-9000*Math.cos(128*Math.PI/180)],50);
  const px = [[Math.round(0.5*R.targets.w), Math.round(0.25*R.targets.h)]];
  const res = [];
  const labels = [['A_all',0,[1,1,1,1,1,1,1,1,1],0.36],['B_all_again',0,[1,1,1,1,1,1,1,1,1],0.36],
                  ['C_nocl',0,[1,1,1,1,1,1,0,1,1,1],0.36],['D_sky24',24,[1,1,1,1,1,1,1,1,1],0.36],
                  ['E_cover0',0,[1,1,1,1,1,1,1,1,1],0.0],['F_cover36',0,[1,1,1,1,1,1,1,1,1],0.36]];
  for (const [label, view, st, cov] of labels) {
    p.set('cloudCover', cov);
    p.setStages(st); p.setView(view);
    for (let i=0;i<3;i++) p.renderAt(0, 1/30);
    const s = p.sample(px)[0];
    const cv = p.display([[0.5*R.canvas.width, 0.25*R.canvas.height]])[0];
    res.push({ label, hdr: s.rgb.map(v=>+v.toFixed(5)), canvas: cv, exposure: +R.lastExposure.toFixed(3), lut: skyLutProbe() });
  }
  return { res, dirty: R.__dirtyInfo };
}, process.argv[2] === 'noauto');
for (const r of out.res) console.log(r.label.padEnd(12), 'hdr', r.hdr.join(' '), ' canvas', r.canvas.join(' '), ' exp', r.exposure, ' lut', JSON.stringify(r.lut));
await browser.close();
