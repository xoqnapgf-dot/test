import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
const exe = await chromium.executablePath();
const browser = await puppeteer.launch({ args: [...chromium.args,'--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
  executablePath: exe, headless: true, protocolTimeout: 900000, defaultViewport:{width:160,height:90}});
const page = await browser.newPage();
await page.goto('file:///home/user/test/shader-seascape-render/index.html?probe=1&loop=0&quality=0.2&terrainRes=512&scale=0.25', {waitUntil:'load', timeout:120000});
await page.waitForFunction(() => window.__probe && window.__probe.ready === true, {timeout:600000, polling:1000});
const rows = await page.evaluate(() => {
  const p = window.__probe, out = [];
  const R = 6400;
  for (const [name, x, z] of [['+X',R,0],['-X',-R,0],['+Z',0,R],['-Z',0,-R],
                              ['+XZ',R*0.7,R*0.7],['-X-Z',-R*0.7,-R*0.7],['+X-Z',R*0.7,-R*0.7],['-X+Z',-R*0.7,R*0.7]]) {
    out.push([name, +p.ground(x,z).toFixed(0)]);
  }
  const grid = [];
  for (const [x, z] of [[3000,-400],[2600,-200],[3600,-900],[2200,600],[4200,-1200],[1600,-1200],[5000,-2200],[1200,-800]]) {
    grid.push('(' + x + ',' + z + ') h=' + p.ground(x, z).toFixed(0));
  }
  return { out, grid, size: p.state().terrainSize };
});
console.log('sea level height along the axes (x100 m):', JSON.stringify(rows.out));
console.log('grid (hectometres, rows = z, cols = x):'); rows.grid.forEach(r => console.log(' ', r));
console.log('terrainSize', rows.size);
await browser.close();
