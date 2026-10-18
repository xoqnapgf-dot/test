import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'node:fs';
const exe = await chromium.executablePath();
const browser = await puppeteer.launch({ args:[...chromium.args,'--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage','--force-device-scale-factor=1'],
  executablePath: exe, headless: true, protocolTimeout: 600000, defaultViewport:{width:320,height:180,deviceScaleFactor:1}});
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERROR', e.message.slice(0,200)));
page.on('console', m => console.log('['+m.type()+']', m.text().slice(0,200)));
page.on('requestfailed', r => console.log('REQFAIL', r.url().slice(-40), r.failure() && r.failure().errorText));
await page.goto('file:///home/user/test/shader-seascape-render/index.html?probe=1&loop=0&quality=0.25&terrainRes=512&scale=0.3', {waitUntil:'load'});
await page.waitForFunction('window.__probe && window.__probe.ready === true', {timeout: 120000, polling: 800}).catch(e => console.log('WAIT FAILED'));
console.log('probe state:', await page.evaluate(() => window.__probe ? JSON.stringify({ready: window.__probe.ready, boot: window.__probe.boot}) : 'no probe'));
const grid = await page.evaluate(() => {
  const p = window.__probe, out = [];
  const N = 41, half = 6100;   // the whole tile
  for (let j = 0; j < N; j++) {
    const row = [];
    for (let i = 0; i < N; i++) {
      const x = -half + (2*half) * i/(N-1), z = -half + (2*half)*j/(N-1);
      row.push(Math.round(p.ground(x, z)));
    }
    out.push(row);
  }
  return { stats: p.terrainStats(128), grid: out };
});
// ASCII map + stats
const g = grid.grid, N = g.length; const flat = g.flat().sort((a,b)=>a-b);
const q = p => flat[Math.round(p*(flat.length-1))];
console.log('stats', JSON.stringify(grid.stats));
console.log('min',flat[0],'p10',q(.1),'p50',q(.5),'p90',q(.9),'max',flat[flat.length-1],'water frac', (flat.filter(v=>v<0).length/flat.length).toFixed(3));
const chars = ' .:-=+*#%@';
let min = flat[0], max = flat[flat.length-1];
for (const row of g) console.log(row.map(v => chars[Math.max(0, Math.min(9, Math.round((v-min)/(max-min)*9)))]).join(''));
fs.writeFileSync('/tmp/scan.json', JSON.stringify(grid));
await browser.close();
