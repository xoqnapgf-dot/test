import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'node:fs';
const exe = await chromium.executablePath();
const browser = await puppeteer.launch({ args:[...chromium.args,'--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
  executablePath: exe, headless: true, protocolTimeout: 600000, defaultViewport:{width:320,height:180,deviceScaleFactor:1}});
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERROR', e.message.slice(0,200)));
await page.goto('file:///home/user/test/shader-seascape-render/index.html?probe=1&loop=0&quality=0.3&terrainRes=512&scale=0.3', {waitUntil:'load'});
await page.waitForFunction('window.__probe && window.__probe.ready === true', {timeout: 300000, polling: 800});
const out = await page.evaluate(() => {
  const p = window.__probe;
  p.setStages([1,1,1,1,1,1,1,1,1]); p.setView(0);
  p.place({x:900,z:900,up:22,at:[-2600,60,-6500],fov:48});
  p.renderAt(0);
  const t = p.target();
  const fracs = [[0.5,0.1],[0.5,0.3],[0.5,0.5],[0.5,0.7],[0.5,0.9]];
  const hdr = p.sample(fracs.map(f => [f[0]*t.w, f[1]*t.h]));
  const disp = p.display(fracs);
  const png = p.capture() || '';
  return {t, png, state:{exposure:p.state().exposure, bloom:p.state().bloom, vignette:p.state().vignette, stages:p.state().stages},
    rows: fracs.map((f,i)=>({f, hdr:hdr[i].rgb.map(v=>+v.toFixed(3)), luma:+hdr[i].luma.toFixed(3), disp:disp[i]}))};
});
console.log('state', JSON.stringify(out.state));
for (const r of out.rows) console.log('y=' + r.f[1].toFixed(1), 'hdr=[' + r.hdr.join(' ') + ']', 'luma=' + r.luma.toFixed(3), 'disp=[' + r.disp.join(' ') + ']');
await browser.close();
