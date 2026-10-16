import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
const q = process.argv[2] || 'probe=1&loop=0&quality=0.25&terrainRes=512&scale=0.3';
const exe = await chromium.executablePath();
const browser = await puppeteer.launch({ args:[...chromium.args,'--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
  executablePath: exe, headless: true, protocolTimeout: 600000, defaultViewport:{width:320,height:180,deviceScaleFactor:1}});
const page = await browser.newPage();
page.on('console', m => { if (m.type()==='error') console.log('ERR', m.text().slice(0,160)); });
page.on('pageerror', e => console.log('PAGEERROR', e.message.slice(0,200)));
await page.goto('file:///home/user/test/shader-seascape-render/index.html?' + q, {waitUntil:'load'});
await page.waitForFunction('window.__probe && window.__probe.ready === true', {timeout: 300000, polling: 800});
const out = await page.evaluate(() => {
  const p = window.__probe, row = [], col = [];
  for (let i = -8; i <= 8; i++) row.push([i*500, 0, Math.round(p.ground(i*500, 0))]);
  for (let i = -8; i <= 8; i++) col.push([0, i*500, Math.round(p.ground(0, i*500))]);
  const zs = [];
  for (const z of [-2000,-3000,-3600,-4200,-4800,-5500,-6200]) {
    let s2 = [];
    for (let x = -6000; x <= 6000; x += 1500) s2.push(Math.round(p.ground(x, z)));
    zs.push([z, s2]);
  }
  const mid = [];
  for (let x = -3000; x <= 3000; x += 250) mid.push(Math.round(p.ground(x, -4200)));
  return { row, col, zs, mid };
});
console.log('along  x (z=0):', out.row.map(a => a[2]).join(' '));
console.log('along  z (x=0):', out.col.map(a => a[2]).join(' '));
for (const [z, arr] of out.zs) console.log('z=' + z, arr.join(' '));
console.log('shoreline z=-4200 (x from -3000 step 250):', out.mid.join(' '));
await browser.close();
