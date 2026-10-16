import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
const exe = await chromium.executablePath();
const browser = await puppeteer.launch({args:[...chromium.args,'--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'], executablePath: exe, headless:true, protocolTimeout: 900000, defaultViewport:{width:800,height:450}});
const page = await browser.newPage();
page.on('console', m => console.log('CONSOLE:', m.text().slice(0,400)));
page.on('pageerror', e => console.log('PAGEERROR:', e.message, '\n', (e.stack||'').split('\n').slice(0,6).join('\n')));
page.on('requestfailed', r => console.log('REQFAIL:', r.url(), r.failure()?.errorText));
const q = process.argv[2] || 'probe=1&loop=0&quality=0.2&terrainRes=256&scale=0.3';
await page.goto('file:///home/user/test/shader-seascape-render/index.html?'+q, {waitUntil:'load', timeout:120000});
for (let i=0;i<40;i++){
  await new Promise(r=>setTimeout(r,3000));
  let st;
  try {
    st = await page.evaluate(() => {
      const p = window.__probe;
      return p ? {ready:p.ready, error:p.error, info:p.info, boot:(document.getElementById('bootMsg')||{}).textContent, fail:!document.getElementById('fail').hidden} : {none:true};
    });
  } catch(e) { st = {evalError: e.message.slice(0,200)}; }
  console.log(i*3+'s', JSON.stringify(st));
  if (st && (st.ready || st.error || st.fail)) break;
}
await browser.close();
