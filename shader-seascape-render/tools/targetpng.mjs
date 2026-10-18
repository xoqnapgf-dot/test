// Dump the pre-composite scene target (and optionally the post canvas) for a given state.
// Usage: node tools/targetpng.mjs <query> <label> [stateJson]
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'node:fs';
const exe = await chromium.executablePath();
const browser = await puppeteer.launch({ args: [...chromium.args,'--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
  executablePath: exe, headless: true, protocolTimeout: 900000, defaultViewport:{width:640,height:360}});
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERROR:', e.message));
const q = process.argv[2] || 'probe=1&loop=0&quality=0.4&terrainRes=512&scale=0.3';
await page.goto('file:///home/user/test/shader-seascape-render/index.html?' + q, {waitUntil:'load', timeout:120000});
await page.waitForFunction(() => window.__probe && window.__probe.ready === true, {timeout:600000, polling:1000});
const label = process.argv[3] || 't';
const state = process.argv[4] ? JSON.parse(process.argv[4]) : {};
const out = await page.evaluate((state) => {
  const p = window.__probe;
  for (const k in state) p.set(k, state[k]);
  p.renderAt(0);
  return { scene: p.targetPNG('scene', 640), canvas: p.capture() };
}, state);
fs.writeFileSync('/home/user/test/shader-seascape-render/shots/tgt_' + label + '_scene.png', Buffer.from(out.scene.split(',')[1],'base64'));
fs.writeFileSync('/home/user/test/shader-seascape-render/shots/tgt_' + label + '_canvas.png', Buffer.from(out.canvas.split(',')[1],'base64'));
console.log('written', label);
await browser.close();
