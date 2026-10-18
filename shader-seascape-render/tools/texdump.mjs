// Read a generated lookup table back as floats and print a coarse table of it.
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
const exe = await chromium.executablePath();
const browser = await puppeteer.launch({ args: [...chromium.args,'--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
  executablePath: exe, headless: true, protocolTimeout: 900000, defaultViewport:{width:320,height:180}});
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERROR:', e.message));
await page.goto('file:///home/user/test/shader-seascape-render/index.html?probe=1&loop=0&quality=0.3&terrainRes=256&scale=0.3', {waitUntil:'load', timeout:120000});
await page.waitForFunction(() => window.__probe && window.__probe.ready === true, {timeout:600000, polling:1000});
const args = Object.fromEntries(process.argv.slice(2).map(a => a.split('=')));
const res = await page.evaluate(({kind, step, elev, azi, ms}) => {
  const p = window.__probe;
  if (elev) p.set('sunElev', +elev);
  if (azi) p.set('sunAzi', +azi);
  if (ms !== undefined) p.set('multiScatter', +ms);
  p.setView(0); p.renderAt(0);
  const t = p.texFloats(kind, +step || 8);
  return t;
}, {kind: args.kind || 'sky', step: args.step, elev: args.elev, azi: args.azi, ms: args.ms});
console.log(kind_line(res, args.kind || 'sky'));
function kind_line(r, kind){
  let out = kind + ' ' + r.w + 'x' + r.h + ' ok=' + r.ok + '\n';
  r.rows.forEach((row, i) => {
    out += '  ' + row.map(c => c.map(v => ('' + v).replace('0.', '.')).join(',').padEnd(20)).join(' ') + '\n';
    if (i > 12) { out += '  ...\n'; return; }
  });
  return out;
}
await browser.close();
