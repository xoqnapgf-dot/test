/* Shared headless launcher. Chromium does not need a visible window, but WebGL2 does
   need the SwiftShader flags. */
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function ensureNss() {
  const dir = '/tmp/nssstub';
  if (!fs.existsSync(path.join(dir, 'libnss3.so'))) {
    try {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const br = path.join(__dirname, 'node_modules/@sparticuz/chromium/bin/al2023.tar.br');
      if (fs.existsSync(br)) {
        fs.mkdirSync(dir, { recursive: true });
        const tarPath = '/tmp/al2023.tar';
        fs.writeFileSync(tarPath, zlib.brotliDecompressSync(fs.readFileSync(br)));
        execFileSync('tar', ['-xf', tarPath, '-C', dir, '--strip-components=1']);
      }
    } catch (e) { /* ignore */ }
  }
  const cur = process.env.LD_LIBRARY_PATH || '';
  if (!cur.split(':').includes(dir)) {
    process.env.LD_LIBRARY_PATH = cur ? `${dir}:${cur}` : dir;
  }
}

export async function launch({ width = 1280, height = 720, scale = 1, extraArgs = [] } = {}) {
  ensureNss();
  const exe = await chromium.executablePath();
  const browser = await puppeteer.launch({
    args: [...chromium.args, '--enable-unsafe-swiftshader', '--use-gl=angle',
      '--use-angle=swiftshader', '--no-sandbox', '--disable-dev-shm-usage',
      '--force-device-scale-factor=' + scale, '--font-render-hinting=none', ...extraArgs],
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
