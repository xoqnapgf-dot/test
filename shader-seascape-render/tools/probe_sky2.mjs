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
  const p = window.__probe, R = p.renderer;
  p.set('sunElev',6); p.set('sunAzi',128); p.set('skyScale',1.0);
  p.look([2600,352,-300],[2600-9000*Math.sin(128*Math.PI/180),352-9000*Math.sin(3*Math.PI/180),-300-9000*Math.cos(128*Math.PI/180)],50);
  const pts = [[0.25,0.10],[0.5,0.10],[0.5,0.25],[0.5,0.40],[0.5,0.44],[0.5,0.60]];
  const px = pts.map(f => [Math.round(f[0]*R.targets.w), Math.round(f[1]*R.targets.h)]);
  const res = [];
  const rec = (label) => { const s = p.sample(px); res.push({ label, vals: s.map(x => x.rgb.map(v => +v.toFixed(4))) }); };
  const all=[1,1,1,1,1,1,1,1,1], nocl=[1,1,1,1,1,1,0,1,1,1], skyonly=[1,0,1,1,1,0,0,1,1,1];
  for (const [label, view, st] of [['sky24_all',24,all],['beauty_all',0,all],['beauty_nocl',0,nocl],['beauty_skyonly',0,skyonly],['beauty_all_cov0',0,all]]) {
    if (label === 'beauty_all_cov0') p.set('cloudCover', 0.0);
    p.setStages(st); p.setView(view);
    for (let i=0;i<3;i++) p.renderAt(0, 1/30);
    rec(label);
  }
  return { pts, res, exposure: R.lastExposure };
});
for (const r of out.res) {
  console.log(r.label.padEnd(16), out.pts.map((p,i) => `(${p[0]},${p[1]}) ${r.vals[i].join(' ')}`).join('  |  '));
}
console.log('exposure', out.exposure);
await browser.close();
