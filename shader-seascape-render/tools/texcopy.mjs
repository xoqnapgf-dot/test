// Copy a generated texture out to a raw file for CPU-side analysis.
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'node:fs';
const exe = await chromium.executablePath();
const browser = await puppeteer.launch({ args: [...chromium.args,'--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
  executablePath: exe, headless: true, protocolTimeout: 900000, defaultViewport:{width:320,height:180}});
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERROR:', e.message));
const q = process.argv[3] || 'probe=1&loop=0&quality=0.2&terrainRes=512&scale=0.3';
await page.goto('file:///home/user/test/shader-seascape-render/index.html?' + q, {waitUntil:'load', timeout:120000});
await page.waitForFunction(() => window.__probe && window.__probe.ready === true, {timeout:600000, polling:1000});
const kind = process.argv[2] || 'terrain';
const out = await page.evaluate((k) => {
  const p = window.__probe;
  const t = p.texFloats(k, 1);
  return { w: t.w, h: t.h, rows: t.rows };
}, kind);
fs.writeFileSync('/tmp/' + kind + '.json', JSON.stringify(out));
console.log(kind, out.w + 'x' + out.h, 'genMs', (await page.evaluate(() => window.__probe.info.genMs)));
await browser.close();
