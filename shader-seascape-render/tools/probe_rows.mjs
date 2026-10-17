import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
const exe = await chromium.executablePath();
const browser = await puppeteer.launch({ args: [...chromium.args,'--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
  executablePath: exe, headless: true, protocolTimeout: 900000, defaultViewport:{width:800,height:450}});
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERROR:', e.message));
await page.goto('file:///home/user/test/shader-seascape-render/index.html?probe=1&loop=0&quality=0.25&terrainRes=256&scale=0.3', {waitUntil:'load', timeout:120000});
await page.waitForFunction(() => window.__probe && window.__probe.ready === true, {timeout:600000, polling:1000});
const out = await page.evaluate(() => {
  const p = window.__probe, R = p.renderer, gl = R.api.raw, api = R.api;
  p.set('sunElev',6); p.set('sunAzi',128); p.set('exposureAuto', false);
  p.look([2600,352,-300],[2600-9000*Math.sin(128*Math.PI/180),352-9000*Math.sin(3*Math.PI/180),-300-9000*Math.cos(128*Math.PI/180)],50);
  const stats = {};
  const grab = (label) => {
    R.render(0, true);
    const T = R.targets, w = T.w, h = T.h;
    gl.bindFramebuffer(gl.FRAMEBUFFER, T.scene.fbo);
    const u16 = new Uint16Array(w*h*4);
    while (gl.getError() !== 0) {}
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.HALF_FLOAT, u16);
    const e = gl.getError();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    const h2f = (v) => { const sg=(v&0x8000)?-1:1, ee=(v>>10)&0x1f, m=v&0x3ff; return ee===0? sg*Math.pow(2,-14)*(m/1024) : sg*Math.pow(2,ee-15)*(1+m/1024); };
    const rows = [];
    let nzRows = 0, maxv = 0;
    for (let y = 0; y < h; y++) {
      let s0=0,s1=0,s2=0;
      for (let x = 0; x < w; x++) { const i=((y*w)+x)*4; const a=h2f(u16[i]),b=h2f(u16[i+1]),c=h2f(u16[i+2]); s0+=a;s1+=b;s2+=c; if(Math.max(a,b,c)>1e-4) nzRows2(x,y); }
      maxv = Math.max(maxv, s1/w);
      if (s1/w > 1e-5) nzRows++;
      rows.push([+(s0/w).toFixed(4), +(s1/w).toFixed(4), +(s2/w).toFixed(4)]);
    }
    function nzRows2(){}
    stats[label] = { w, h, glError: e, nzRows, maxRowG: +maxv.toFixed(4), rows: rows.filter((_,i)=> i%6===0).map((r,i)=>[i*6, r]) };
  };
  p.setView(0); grab('beauty');
  p.setView(24); grab('view24');
  return stats;
});
for (const k of Object.keys(out)) {
  const s = out[k];
  console.log(`== ${k}: ${s.w}x${s.h} glError=${s.glError} rowsWithSky=${s.nzRows} maxRowG=${s.maxRowG}`);
  console.log('   y: [R,G,B]  (every 6th row, y = GL row, 0 = bottom)');
  console.log('   ' + s.rows.map(([y,r]) => `${y}:${r[0].toFixed(3)},${r[1].toFixed(3)},${r[2].toFixed(3)}`).join(' '));
}
await browser.close();
