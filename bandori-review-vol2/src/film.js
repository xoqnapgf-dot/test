// ─── film: the "UP主" look — real stills in a 16:9 frame over a blurred copy, slow push-ins,
// hand-drawn red circles, meme pop-ins, plain white subtitles ────────────────────────────

const FRAME = { x: 0, y: 660, w: 1080, h: 608 };
const SUB_Y = 1365;

// ── blurred backdrop, cached per image (draw small, scale up = cheap blur)
function blurred(name) {
  const key = 'blur:' + name; if (CACHE[key]) return CACHE[key];
  const im = IMG[name]; if (!im || !im.width) return null;
  const cv = document.createElement('canvas'); cv.width = 72; cv.height = 128; const g = cv.getContext('2d');
  const s = Math.max(cv.width / im.width, cv.height / im.height);
  g.filter = 'blur(3px) saturate(1.25)';
  g.drawImage(im, (cv.width - im.width * s) / 2, (cv.height - im.height * s) / 2, im.width * s, im.height * s);
  return (CACHE[key] = cv);
}

// draw image to cover a box; focus (fx,fy) in [0..1] is kept stable, scale >= 1 zooms in
function cover(c, name, x, y, w, h, o = {}) {
  const im = IMG[name]; if (!im || !im.width) return;
  const sc = Math.max(w / im.width, h / im.height) * (o.scale || 1);
  const iw = im.width * sc, ih = im.height * sc;
  const fx = o.fx ?? 0.5, fy = o.fy ?? 0.5;
  let ix = x + w / 2 - iw * fx, iy = y + h / 2 - ih * fy;
  ix = Math.min(x, Math.max(x + w - iw, ix)); iy = Math.min(y, Math.max(y + h - ih, iy));
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  if (o.flip) { c.translate(x * 2 + w, 0); c.scale(-1, 1); }
  if (o.filter) c.filter = o.filter;
  c.drawImage(im, ix, iy, iw, ih); c.restore();
}

// ── shots: built from SHOTLIST (per section, keyed by line index) once the timeline is known
let SHOTS = [];
function buildShots() {
  SHOTS = [];
  for (const sec of TL.sections) {
    const list = (SHOTLIST[sec.id] || []).map((e) => {
      const [li, a, b] = e; const spec = typeof a === 'string' ? b : a; const word = typeof a === 'string' ? a : null;
      const t0 = li === 0 && !word ? sec.t0 + 0.05 : word ? sec.at(li, word) - 0.12 : sec.L(li) - 0.12;
      const punch = (spec.pw || []).map(([l, w]) => sec.at(l, w));
      return Object.assign({ t0, punch }, spec);
    });
    list.forEach((s, i) => { s.t1 = i + 1 < list.length ? list[i + 1].t0 : sec.t1; s.sec = sec.id; s.k = SHOTS.length + i; });
    SHOTS.push(...list);
  }
}
function shotIndexAt(t) { let i = 0; while (i + 1 < SHOTS.length && SHOTS[i + 1].t0 <= t) i++; return i; }

// Ken Burns: each shot slowly pushes in (or out) toward its focus point
function kb(s, t) {
  const k = clamp((t - s.t0) / Math.max(1, s.t1 - s.t0));
  const dir = s.out ? -1 : 1, z0 = s.z0 ?? (dir > 0 ? 1.0 : 1.12), z1 = s.z1 ?? (dir > 0 ? 1.1 : 1.0);
  const punch = s.punch ? s.punch.reduce((acc, p) => acc + 0.1 * Math.exp(-Math.max(0, t - p) * 7) * (t > p ? 1 : 0), 0) : 0;
  const drift = (hash(s.k) - 0.5) * 0.06 * k;
  return { scale: lerp(z0, z1, ease.sine(k)) + punch, fx: (s.fx ?? 0.5) + drift, fy: s.fy ?? 0.45 };
}

function drawShot(c, s, t, alpha) {
  if (!s || alpha <= 0) return;
  c.save(); c.globalAlpha *= alpha;
  const K = kb(s, t), F = FRAME;
  if (s.kind === 'duo') {
    const w = F.w / 2;
    cover(c, s.img, F.x, F.y, w - 3, F.h, { scale: K.scale, fx: s.fx ?? 0.5, fy: K.fy });
    cover(c, s.img2, F.x + w + 3, F.y, w - 3, F.h, { scale: K.scale, fx: s.fx2 ?? 0.5, fy: s.fy2 ?? K.fy, flip: s.flip2 });
    c.fillStyle = '#fff'; c.fillRect(F.x + w - 3, F.y, 6, F.h);
  } else if (s.kind === 'contain') {
    const im = IMG[s.img]; if (im) { const sc = Math.min(F.w * 0.86 / im.width, F.h * 0.86 / im.height) * K.scale; img(c, s.img, F.x + F.w / 2, F.y + F.h / 2, im.height * sc, { shadow: 'rgba(0,0,0,.4)', blur: 30 }); }
  } else if (s.kind === 'logos') {
    c.fillStyle = 'rgba(8,8,14,.55)'; c.fillRect(F.x, F.y, F.w, F.h);
    s.logos.forEach((l, i) => { const n = s.logos.length; img(c, l, F.x + F.w * (i + 1) / (n + 1), F.y + F.h / 2, 170 * K.scale, { shadow: 'rgba(0,0,0,.5)', blur: 20 }); });
  } else {
    cover(c, s.img, F.x, F.y, F.w, F.h, { scale: K.scale, fx: K.fx, fy: K.fy, flip: s.flip, filter: s.filter });
  }
  c.restore();
}

// ── overlays (time cues): red circle, meme pop, flash, glow, petals, fast-forward
// red hand-drawn ellipse, coordinates in frame-normalised space
function redCircle(c, t, t0, cx, cy, rx, ry, until) {
  if (t < t0 || t > until) return;
  const k = ease.out(ramp(t, t0, 0.35)), a = 1 - ramp(t, until - 0.25, 0.25);
  const X = FRAME.x + cx * FRAME.w, Y = FRAME.y + cy * FRAME.h, RX = rx * FRAME.w, RY = ry * FRAME.h;
  c.save(); c.globalAlpha *= a; c.strokeStyle = '#ff2a2a'; c.lineWidth = 9; c.lineCap = 'round'; c.lineJoin = 'round';
  c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 6; c.beginPath();
  const n = 60, end = TAU * 1.08 * k;
  for (let i = 0; i <= n; i++) {
    const a2 = -2.2 + (i / n) * end, wob = 1 + noise1(i * 0.35 + cx * 10) * 0.05 + (i / n) * 0.06;
    const px = X + Math.cos(a2) * RX * wob, py = Y + Math.sin(a2) * RY * wob;
    i ? c.lineTo(px, py) : c.moveTo(px, py);
  }
  c.stroke(); c.restore();
}
// meme / sticker pop-in with white border
function memePop(c, t, t0, until, name, x, y, h, rot = 0) {
  if (t < t0 || t > until) return;
  const im = IMG[name]; if (!im) return;
  const k = ease.back(ramp(t, t0, 0.32)), a = 1 - ramp(t, until - 0.2, 0.2);
  const w = (h * im.width) / im.height;
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot + Math.sin((t - t0) * 2.2) * 0.012); c.scale(k, k);
  c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 24; c.shadowOffsetY = 10;
  c.fillStyle = '#fff'; c.fillRect(-w / 2 - 10, -h / 2 - 10, w + 20, h + 20); c.shadowColor = 'transparent';
  c.drawImage(im, -w / 2, -h / 2, w, h); c.restore();
}
function flash(c, t, t0, color = '255,255,255', dur = 0.35, max = 0.7) {
  const k = ramp(t, t0, dur); if (t < t0 || k >= 1) return;
  c.fillStyle = `rgba(${color},${max * (1 - k) * (1 - k)})`; c.fillRect(0, 0, W, H);
}
// soft light leak / glow inside the frame
function glow(c, x, y, r, a, color = '255,236,200') {
  if (a <= 0) return;
  const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${color},${a})`); g.addColorStop(0.35, `rgba(${color},${a * 0.45})`); g.addColorStop(1, `rgba(${color},0)`);
  c.save(); c.globalCompositeOperation = 'screen'; c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); c.restore();
}
function sakura(c, t, a) {
  if (a <= 0) return;
  c.save(); c.beginPath(); c.rect(FRAME.x, FRAME.y, FRAME.w, FRAME.h); c.clip(); c.globalAlpha *= a;
  particles(c, t, 26, 17, (p, q, d, e, i) => {
    const sp = 70 + d * 60, life = (FRAME.h + 120) / sp, tt = (t + e * life) % life;
    const x = FRAME.x + p * FRAME.w + Math.sin(tt * 1.3 + i) * 40, y = FRAME.y - 60 + tt * sp, s = 9 + q * 9;
    c.save(); c.translate(x, y); c.rotate(tt * (1 + d) + i); c.scale(1, 0.6 + 0.4 * Math.sin(tt * 3 + i));
    c.fillStyle = `rgba(255,${200 + Math.floor(q * 30)},${215 + Math.floor(d * 25)},.9)`;
    c.beginPath(); c.moveTo(0, -s); c.quadraticCurveTo(s, -s * 0.2, 0, s); c.quadraticCurveTo(-s, -s * 0.2, 0, -s); c.fill(); c.restore();
  });
  c.restore();
}
// fast-forward skip: speed streaks + ▶▶ drawn
function fastForward(c, t, t0, t1) {
  if (t < t0 || t > t1) return;
  const k = ramp(t, t0, 0.2) * (1 - ramp(t, t1 - 0.2, 0.2));
  c.save(); c.globalAlpha *= k; c.beginPath(); c.rect(FRAME.x, FRAME.y, FRAME.w, FRAME.h); c.clip();
  particles(c, t, 40, Math.floor(t * 20), (p, q, d) => { c.fillStyle = `rgba(255,255,255,${0.15 + d * 0.3})`; c.fillRect(FRAME.x + p * FRAME.w * 1.2 - 100, FRAME.y + q * FRAME.h, 120 + d * 220, 3 + d * 4); });
  c.restore();
  c.save(); c.globalAlpha *= k; c.fillStyle = '#fff'; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 16;
  const x = FRAME.x + FRAME.w - 150, y = FRAME.y + 90;
  [0, 44].forEach((dx) => { c.beginPath(); c.moveTo(x + dx, y - 34); c.lineTo(x + dx + 40, y); c.lineTo(x + dx, y + 34); c.closePath(); c.fill(); });
  txt(c, '×16', x + 30, y + 70, { size: 34, fam: F.round, color: '#fff' });
  c.restore();
}

// ── chrome: backdrop, header, subtitle, footer
function drawBackdrop(c, s, s2, mixK) {
  c.fillStyle = '#0b0b10'; c.fillRect(0, 0, W, H);
  [[s, 1 - mixK], [s2, mixK]].forEach(([sh, a]) => {
    if (!sh || a <= 0) return; const nm = sh.img; const b = blurred(nm); if (!b) return;
    c.save(); c.globalAlpha = a * 0.75; c.drawImage(b, -60, -60, W + 120, H + 120); c.restore();
  });
  const g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, 'rgba(8,8,12,.55)'); g.addColorStop(0.28, 'rgba(8,8,12,.25)'); g.addColorStop(0.62, 'rgba(8,8,12,.35)'); g.addColorStop(1, 'rgba(8,8,12,.85)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
}

const HEAD = {
  intro: ['BanG Dream!', '邦多利角色个人向点评 · 下', '#ff3b6b'], misaki: ['Hello, Happy World!', '奥泽美咲', '#ffb000'],
  'morfo-ras': ['Morfonica · RAISE A SUILEN', '蝶团 · RAS', '#5b8cff'], anon: ['MyGO!!!!!', '千早爱音', '#ff88aa'],
  soyo: ['MyGO!!!!!', 'Soyo', '#e8b86a'], taki: ['MyGO!!!!!', 'Taki', '#8a8ac4'], uika: ['Ave Mujica', '三角初华', '#c9a24a'], outro: ['BanG Dream!', '邦多利角色个人向点评 · 下', '#ff3b6b'],
};
function drawHeader(c, t) {
  const s = sectionAt(t), h = HEAD[s.id]; if (!h) return;
  const k = ez(t, s.t0 + 0.1, 0.5), out = s.id === 'outro' ? 1 - ez(t, s.t1 - 1.2, 0.6) : 1;
  c.save(); c.globalAlpha = k * out;
  const x = 72, y0 = 420 + (1 - k) * 20;
  c.fillStyle = h[2]; c.fillRect(x, y0 - 70, 8, 132);
  txt(c, h[0], x + 34, y0 - 44, { size: 32, fam: F.round, color: hexA(h[2], 1), align: 'left', ls: 3 });
  txt(c, h[1], x + 32, y0 + 22, { size: s.id === 'intro' || s.id === 'outro' ? 60 : 84, fam: F.black, color: '#fff', align: 'left', shadow: 'rgba(0,0,0,.5)', blur: 18, sy: 4 });
  c.restore();
}
function drawSubtitle(c, t) {
  const l = lineAt(t); if (!l) return;
  const k = ez(t, l.t0 - 0.05, 0.12);
  const rows = splitSub(l.sub.replace(/[，。：；]$/, ''), l.br);
  let size = 54; const widest = Math.max(...rows.map((r) => measure(c, r, size, F.bold)));
  if (widest > 990) size = Math.floor(size * 990 / widest);
  const lh = size * 1.36, y0 = SUB_Y - ((rows.length - 1) * lh) / 2;
  c.save(); c.globalAlpha = k;
  rows.forEach((r, i) => txt(c, r, W / 2, y0 + i * lh, { size, fam: F.bold, color: '#fff', stroke: 'rgba(0,0,0,.85)', sw: 7, shadow: 'rgba(0,0,0,.6)', blur: 10, sy: 3 }));
  c.restore();
}
function drawFooter(c, t) {
  txt(c, '邦多利角色个人向点评 · 下', W - 60, 1830, { size: 26, fam: F.med, color: 'rgba(255,255,255,.42)', align: 'right', ls: 3 });
}
