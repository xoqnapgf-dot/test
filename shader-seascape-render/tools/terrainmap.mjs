/* Judge the baked height field, and the film's flight over it.
 *
 * Three things come out of one boot:
 *   - a coarse table of ground heights over the tile
 *   - statistics over a dense sample: how tall the land is, how steep it is, and how much
 *     of its relief lives at the texel scale (the number that tells a mountain range from
 *     a field of needles)
 *   - the flight path sampled every few seconds with the clearance above the ground, so a
 *     camera key that flies through a hill shows up as a small or negative AGL before it
 *     is rendered
 *
 *   node tools/terrainmap.mjs [terrainRes] [frame]
 */
import { launch } from './_browser.mjs';
import path from 'node:path';

const tres = parseInt(process.argv[2] || '512', 10);
const frame = process.argv[3];
const extra = process.argv[4] || '';
const root = path.resolve('.');
const { browser, page } = await launch({ width: 320, height: 200 });
await page.goto('file://' + root + '/index.html?probe=1&loop=0&quality=0.2&terrainRes=' + tres + '&scale=0.3' +
  (frame ? '&erode=' + frame : '') + (extra ? '&' + extra : ''), { waitUntil: 'domcontentloaded' });
await page.waitForFunction('window.__probe && window.__probe.booted === true', { timeout: 300000 });

const out = await page.evaluate((o) => {
  const p = window.__probe, R = p.renderer;
  const TS = R.params.terrainSize, TN = R.params.terrainRes;
  const dx = TS / TN;

  // ---- coarse table
  const xs = [];
  for (let x = -9000; x <= 9000; x += 1500) xs.push(x);
  const zs = [];
  for (let z = -4500; z <= 4500; z += 750) zs.push(z);
  const head = 'z\\x    ' + xs.map((x) => String(Math.round(x / 1000) + 'k').padStart(6)).join('');
  const rows = [];
  for (const z of zs) {
    let line = String(Math.round(z)).padStart(6) + ' ';
    for (const x of xs) line += String(Math.round(p.ground(x, z))).padStart(6);
    rows.push(line);
  }

  // ---- statistics over the tile, on a grid aligned with the texels
  const N = 256, half = TS / 2;
  const h = new Float32Array(N * N);
  for (let j = 0; j < N; j++) {
    const z = -half + (j + 0.5) * (TS / N);
    for (let i = 0; i < N; i++) h[j * N + i] = p.ground(-half + (i + 0.5) * (TS / N), z);
  }
  const sea = R.s.seaLevel || 0;
  const land = [], slope = [], fine = [], mid = [];
  let landN = 0, deepN = 0, maxH = -1e9, minH = 1e9;
  for (let j = 1; j < N - 1; j++) {
    for (let i = 1; i < N - 1; i++) {
      const a = h[j * N + i];
      maxH = Math.max(maxH, a); minH = Math.min(minH, a);
      if (a <= sea) { deepN++; continue; }
      landN++;
      land.push(a);
      const gx = (h[j * N + i + 1] - h[j * N + i - 1]) / (2 * TS / N);
      const gz = (h[(j + 1) * N + i] - h[(j - 1) * N + i]) / (2 * TS / N);
      slope.push(Math.sqrt(gx * gx + gz * gz));
      // energy at one tile-sample step vs eight: the needle test
      fine.push(Math.abs(h[j * N + i + 1] - a));
      mid.push(Math.abs(h[j * N + Math.min(N - 1, i + 8)] - a));
    }
  }
  const q = (arr, f) => { if (!arr.length) return 0; const s = arr.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(f * s.length))]; };
  const mean = (arr) => arr.reduce((s, v) => s + v, 0) / Math.max(1, arr.length);
  const step = TS / N;                     // sample spacing of the grid above
  const stats = {
    landFrac: +(landN / (N * N)).toFixed(3),
    hMax: Math.round(maxH), hMin: Math.round(minH),
    landP50: Math.round(q(land, 0.5)), landP90: Math.round(q(land, 0.9)), landP99: Math.round(q(land, 0.99)),
    slopeMean: +mean(slope).toFixed(3), slopeP50: +q(slope, 0.5).toFixed(3), slopeP90: +q(slope, 0.9).toFixed(3),
    sampleStep: Math.round(step), texel: Math.round(dx),
    fineMean: +mean(fine).toFixed(1), midMean: +mean(mid).toFixed(1),
    needle: +(mean(fine) / Math.max(0.01, mean(mid))).toFixed(2)
  };

  // ---- the flight
  const flight = [];
  const T = window.SS.timeline;
  if (T && T.cameraAt) {
    for (let t = 0; t <= (T.duration || 96); t += 2) {
      const c = T.cameraAt(t);
      const pos = c.pos || c;
      const g = p.ground(pos[0], pos[2]);
      flight.push({ t, x: Math.round(pos[0]), y: Math.round(pos[1]), z: Math.round(pos[2]),
        g: Math.round(g), agl: Math.round(pos[1] - g) });
    }
  }
  return { head, rows, stats, flight, seaLevel: sea, tres: TN, size: TS,
    params: { plainH: R.params.plainH, seaDepth: R.params.seaDepth, relief: R.params.relief,
      ridgeGain: R.params.ridgeGain, ridgeMix: R.params.ridgeMix, massifBias: R.params.massifBias,
      sink: R.params.sink, seed: R.params.seed, erodeIterations: R.params.erodeIterations,
      blur: R.params.blur, carve: R.params.carve, talus: R.params.talus } };
}, { tres, frame });

console.log('tile ' + out.size + ' m, terrainRes ' + out.tres + ' (texel ' + out.stats.texel + ' m), sea ' + out.seaLevel + ' m');
console.log(out.head);
for (const r of out.rows) console.log(r);
console.log('stats ' + JSON.stringify(out.stats));
console.log('params ' + JSON.stringify(out.params));
console.log('flight (t, x, y, z, ground, agl):');
for (const f of out.flight) console.log('  ' + JSON.stringify(f));
const low = out.flight.filter((f) => f.agl < 40);
console.log(low.length ? 'LOW CLEARANCE: ' + JSON.stringify(low) : 'clearance: all keys clear the ground by 40 m or more');
await browser.close();
