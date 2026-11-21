// Render stills or a video file of the MV with headless Chromium (Playwright).
//
//   node tools/render.mjs stills [landscape|portrait] 47 52.4 58 ...   (clip seconds)
//   node tools/render.mjs sheet  [landscape|portrait]                  (contact sheet)
//   node tools/render.mjs video  [landscape|portrait] [fps]            (mp4 with audio)
//
// The page is opened from file:// exactly as a viewer would open it, with ?export=1 so it
// sizes the canvases to the layout (1920x1080 or 1080x1920) and waits to be driven frame by
// frame through window.MVExport.renderAt(t). Every frame is a pure function of t, so the
// video is identical to what the page plays live. Output goes to tools/out/ (or $OUT).
import { spawn, execSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
// use a local playwright if there is one, else the globally installed one
const require = createRequire(import.meta.url);
let pw;
try { pw = require("playwright"); } catch { pw = require(join(execSync("npm root -g").toString().trim(), "playwright")); }
const { chromium } = pw;
const ROOT = resolve(HERE, "..");
const OUT = process.env.OUT || join(HERE, "out");
mkdirSync(OUT, { recursive: true });

const [mode = "stills", layout = "landscape", ...rest] = process.argv.slice(2);
const size = layout === "portrait" ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: size, deviceScaleFactor: 1 });
const errors = [];
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
const url = pathToFileURL(join(ROOT, "index.html")).href + `?export=1&layout=${layout}` + (process.env.DEBUG ? `&debug=${process.env.DEBUG}` : "");
await page.goto(url);
await page.waitForFunction(() => window.MVExport && window.MVExport.ready);
await page.evaluate(() => window.MVExport.ready);
await page.evaluate((l) => window.MVExport.resize(l), layout);
const DUR = await page.evaluate(() => window.MVExport.DUR);

async function frame(t) {
  await page.evaluate(([t, l]) => window.MVExport.renderAt(t, l), [t, layout]);
}

if (mode === "stills") {
  const times = rest.length ? rest.map(Number) : [1, 5.6, 9, 12, 14, 19, 26, 28.5, 31, 33, 36, 38.5, 40, 44];
  for (const t of times) {
    await frame(t);
    const f = join(OUT, `${layout}-${t.toFixed(2)}.png`);
    await page.screenshot({ path: f });
    console.log(f);
  }
} else if (mode === "sheet") {
  const n = Number(rest[0] || 24);
  const tiles = [];
  for (let i = 0; i < n; i++) {
    const t = 0.6 + (DUR - 1.2) * i / (n - 1);
    await frame(t);
    const f = join(OUT, `sheet-${layout}-${String(i).padStart(2, "0")}.jpg`);
    await page.screenshot({ path: f, type: "jpeg", quality: 85 });
    tiles.push(f);
  }
  const cols = layout === "portrait" ? 8 : 6;
  const tw = layout === "portrait" ? 240 : 320, th = layout === "portrait" ? 427 : 180;
  const sheet = join(OUT, `sheet-${layout}.jpg`);
  await new Promise((res, rej) => {
    const p = spawn("ffmpeg", ["-v", "error", "-y", "-i", join(OUT, `sheet-${layout}-%02d.jpg`),
      "-vf", `scale=${tw}:${th},tile=${cols}x${Math.ceil(n / cols)}:padding=4:color=black`, "-frames:v", "1", sheet], { stdio: "inherit" });
    p.on("close", (c) => (c ? rej(new Error("ffmpeg " + c)) : res()));
  });
  console.log(sheet);
} else if (mode === "video") {
  const fps = Number(rest[0] || 30);
  const total = Math.round(DUR * fps);
  const out = join(OUT, `ruguo-mingtian-mv-${layout}.mp4`);
  const audio = join(ROOT, "assets", "chorus.m4a");
  const ff = spawn("ffmpeg", ["-v", "error", "-y",
    "-f", "image2pipe", "-framerate", String(fps), "-c:v", "png", "-i", "-",
    "-i", audio,
    "-map", "0:v", "-map", "1:a",
    "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    "-c:a", "aac", "-b:a", "192k", "-shortest", out], { stdio: ["pipe", "inherit", "inherit"] });
  const t0 = Date.now();
  for (let i = 0; i < total; i++) {
    await frame(i / fps);
    const buf = await page.screenshot({ type: "png" });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (i % 60 === 0) {
      const el = (Date.now() - t0) / 1000;
      console.log(`frame ${i}/${total}  ${(el / (i + 1)).toFixed(2)} s/frame`);
    }
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  console.log(out);
}

if (errors.length) console.log("page messages:\n" + [...new Set(errors)].join("\n"));
await browser.close();
