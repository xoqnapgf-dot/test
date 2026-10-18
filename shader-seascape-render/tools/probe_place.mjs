import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
const exe = await chromium.executablePath();
const browser = await puppeteer.launch({ args:[...chromium.args,'--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
  executablePath: exe, headless: true, protocolTimeout: 600000, defaultViewport:{width:320,height:180,deviceScaleFactor:1}});
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERROR', e.message.slice(0,200)));
await page.goto('file:///home/user/test/shader-seascape-render/index.html?probe=1&loop=0&quality=0.3&terrainRes=512&scale=0.3', {waitUntil:'load'});
await page.waitForFunction('window.__probe && window.__probe.ready === true', {timeout: 300000, polling: 800});
const out = await page.evaluate(() => {
  const p = window.__probe, g = [];
  for (const [x,z] of [[900,900],[400,1200],[-600,2000],[1600,2600],[-1800,2600],[0,0],[0,-5000],[0,5000]])
    g.push({xz:[x,z], h: Math.round(p.ground(x,z))});
  const pose = p.place({x:900,z:900,up:22,at:[-2600,60,-6500],fov:48});
  const sea = p.state().seaLevel;
  return {g, pose, sea, camera: {pos: pose.pos.map(v=>Math.round(v)), fwd: pose.fwd.map(v=>+v.toFixed(3))}};
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
