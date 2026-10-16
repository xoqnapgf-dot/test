/* Shared headless launcher. Chromium does not need a visible window, but WebGL2 does
   need the SwiftShader flags. */
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function launch({ width = 1280, height = 720, scale = 1 } = {}) {
  const exe = await chromium.executablePath();
  const browser = await puppeteer.launch({
    args: [...chromium.args, '--enable-unsafe-swiftshader', '--use-gl=angle',
      '--use-angle=swiftshader', '--no-sandbox', '--disable-dev-shm-usage',
      '--force-device-scale-factor=' + scale, '--font-render-hinting=none'],
    executablePath: exe,
    headless: true,
    protocolTimeout: 900000,
    defaultViewport: { width, height, deviceScaleFactor: scale }
  });
  const page = await browser.newPage();
  // the boot bakes the terrain before DOMContentLoaded on a big tile; the default 30s
  // navigation timeout is shorter than that bake on a software rasteriser
  page.setDefaultNavigationTimeout(300000);
  page.setDefaultTimeout(300000);
  return { browser, page };
}
