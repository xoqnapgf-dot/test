// Drive the page headlessly: export sound-effect cues, grab stills, or encode frames to video.
//   node tools/render.mjs cues  <out.json>
//   node tools/render.mjs still <outdir> <t1,t2,...>
//   node tools/render.mjs video <out.mp4> <fromSec> <toSec> [fps=30]   (env RENDER_P=720 renders 720×1280, RENDER_CRF sets quality)
// Needs Playwright (global install is fine: NODE_PATH=$(npm root -g)) and ffmpeg on PATH.
import { createRequire } from 'module';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.json': 'application/json' };

function serve() {
  return new Promise((res) => {
    const srv = http.createServer((q, r) => {
      const p = path.join(root, decodeURIComponent(q.url.split('?')[0]));
      if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
      r.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(r);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}

const [mode, out, a, b, fpsArg] = process.argv.slice(2);
const srv = await serve();
const url = `http://127.0.0.1:${srv.address().port}/index.html?capture`;
const exe = fs.existsSync('/opt/pw-browsers/chromium') ? undefined : undefined;
const browser = await chromium.launch({ executablePath: exe, args: ['--disable-gpu-vsync', '--force-device-scale-factor=1'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.error('PAGE ERROR', e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.error('console:', m.text()); });
await page.goto(url);
await page.waitForFunction(() => window.READY === true, null, { timeout: 120000 });

const grab = (t, q = 0.93) => page.evaluate(([t, q]) => { window.renderAt(t); return document.getElementById('cv').toDataURL('image/jpeg', q); }, [t, q]);

if (mode === 'cues') {
  const cues = await page.evaluate(() => window.collectSfx());
  fs.writeFileSync(out, JSON.stringify(cues));
  console.log('cues', cues.length);
} else if (mode === 'still') {
  fs.mkdirSync(out, { recursive: true });
  for (const t of a.split(',').map(Number)) {
    const d = await grab(t, 0.85);
    fs.writeFileSync(path.join(out, `t${t.toFixed(2).padStart(7, '0')}.jpg`), Buffer.from(d.split(',')[1], 'base64'));
  }
  console.log('stills', a.split(',').length);
} else if (mode === 'video') {
  const fps = Number(fpsArg || 30), f0 = Math.round(Number(a) * fps), f1 = Math.round(Number(b) * fps);
  const p = Number(process.env.RENDER_P || 1080), scale = p < 1080 ? ['-vf', `scale=${p}:${Math.round(p * 16 / 9 / 2) * 2}:flags=lanczos`] : [];  // "720p" = 720×1280 for this vertical video
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', ...scale,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', process.env.RENDER_CRF || '19', '-pix_fmt', 'yuv420p', '-tune', 'animation', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    const d = await grab(f / fps, 0.95);
    const buf = Buffer.from(d.split(',')[1], 'base64');
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if ((f - f0) % 300 === 0) console.log(`${path.basename(out)} frame ${f - f0}/${f1 - f0}  ${((f - f0) / ((Date.now() - t0) / 1000 + 1e-3)).toFixed(1)} fps`);
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
  console.log('done', out);
}
await browser.close(); srv.close();
