import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
const exe = await chromium.executablePath();
const browser = await puppeteer.launch({ args: [...chromium.args,'--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
  executablePath: exe, headless: true, protocolTimeout: 900000, defaultViewport:{width:320,height:180}});
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERROR:', e.message));
await page.goto('file:///home/user/test/shader-seascape-render/index.html?probe=1&loop=0&quality=0.2&terrainRes=256&scale=0.3', {waitUntil:'load', timeout:120000});
await page.waitForFunction(() => window.__probe && window.__probe.ready === true, {timeout:600000, polling:1000});
const out = await page.evaluate(() => {
  const R = window.__probe.renderer, gl = R.api.raw;
  const p = R.programs.scene;
  R.s.stages = [1,1,1,1,1,1,1,1,1];
  R.render(0, true);
  const res = {};
  res.uStageCached = String(p.u['uStage']);
  for (const i of [0,1,2,3,4,5,6,7,8,9,10,11]) {
    const loc = gl.getUniformLocation(p.raw, 'uStage[' + i + ']');
    res['uStage['+i+']'] = loc ? gl.getUniform(p.raw, loc) : 'NO LOC';
  }
  const l7 = gl.getUniformLocation(p.raw, 'uStage[7]');
  res.locIsSameAsElement0 = (l7 && p.u['uStage']) ? (gl.getUniform(p.raw, l7) === gl.getUniform(p.raw, p.u['uStage'])) : 'n/a';
  // does the shader see clouds?
  res.uniforms = {};
  for (const n of ['uCloudCover','uCloudDensityScale','uCloudUnit','uCloudBase','uCloudTop','uWeatherTile']) {
    const l = gl.getUniformLocation(p.raw, n);
    res.uniforms[n] = l ? gl.getUniform(p.raw, l) : 'NO LOC';
  }
  res.sampler3D = {};
  for (const n of ['uNoiseAtlas','uNoiseAtlasDetail','uWeather']) {
    const l = gl.getUniformLocation(p.raw, n);
    res.sampler3D[n] = l ? gl.getUniform(p.raw, l) : 'NO LOC';
  }
  return res;
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
