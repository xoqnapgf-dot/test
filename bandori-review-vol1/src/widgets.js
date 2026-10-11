// ─── reusable widgets for scenes ─────────────────────────────────────────────

// pop-in scale for stickers/chips: 0 → overshoot → 1
const pop = (t, t0, d = 0.45) => ease.back(ramp(t, t0, d));

// stamp image (official in-game stamp) popping in with a wobble
function stamp(c, name, x, y, size, t, t0, o = {}) {
  if (t < t0) return;
  const k = pop(t, t0, 0.4), wob = Math.sin((t - t0) * 9) * Math.exp(-(t - t0) * 4) * 0.25;
  const fade = o.t1 ? 1 - ramp(t, o.t1, 0.3) : 1;
  if (fade <= 0) return;
  img(c, name, x, y, size * k, { rot: (o.rot || 0) + wob, alpha: fade, shadow: 'rgba(0,0,0,.25)', blur: 18, sy: 10 });
}

// name plate: big name + small subtitle lines, accent bar
function namePlate(c, x, y, k, name, sub, acc, o = {}) {
  if (k <= 0) return;
  c.save(); c.translate(x + (1 - k) * -80, y); c.globalAlpha *= k;
  const w = Math.max(measure(c, name, 84, F.black), measure(c, sub, 34, F.bold)) + 90;
  c.fillStyle = 'rgba(0,0,0,.22)'; rrect(c, 8, 10, w, 190, 28); c.fill();
  c.fillStyle = '#fffaf2'; rrect(c, 0, 0, w, 190, 28); c.fill();
  c.fillStyle = acc; rrect(c, 0, 0, 22, 190, 11); c.fill();
  txt(c, name, 52, 72, { size: 84, fam: F.black, color: '#1e1a2b', align: 'left' });
  txt(c, sub, 54, 148, { size: 34, fam: F.bold, color: hexA('#1e1a2b', 0.6), align: 'left' });
  c.restore();
}

function check(c, x, y, s, k, color = '#19c37d') {
  if (k <= 0) return;
  c.save(); c.strokeStyle = color; c.lineWidth = s * 0.22; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); const p1 = [x - s * 0.45, y], p2 = [x - s * 0.1, y + s * 0.35], p3 = [x + s * 0.5, y - s * 0.4];
  const k1 = clamp(k * 2), k2 = clamp(k * 2 - 1);
  c.moveTo(...p1); c.lineTo(lerp(p1[0], p2[0], k1), lerp(p1[1], p2[1], k1));
  if (k2 > 0) c.lineTo(lerp(p2[0], p3[0], k2), lerp(p2[1], p3[1], k2));
  c.stroke(); c.restore();
}
function cross(c, x, y, s, k, color = '#ff3344', lw = 0.2) {
  if (k <= 0) return;
  c.save(); c.strokeStyle = color; c.lineWidth = s * lw; c.lineCap = 'round';
  const k1 = clamp(k * 2), k2 = clamp(k * 2 - 1);
  c.beginPath(); c.moveTo(x - s / 2, y - s / 2); c.lineTo(x - s / 2 + s * k1, y - s / 2 + s * k1); c.stroke();
  if (k2 > 0) { c.beginPath(); c.moveTo(x + s / 2, y - s / 2); c.lineTo(x + s / 2 - s * k2, y - s / 2 + s * k2); c.stroke(); }
  c.restore();
}

// red ink seal stamp (e.g. 天经地义 / 命中率100%)
function seal(c, s, x, y, size, t, t0, o = {}) {
  if (t < t0) return;
  const k = ramp(t, t0, 0.22), sc = lerp(2.4, 1, ease.out(k));
  c.save(); c.translate(x, y); c.rotate(o.rot ?? -0.18); c.scale(sc, sc); c.globalAlpha *= Math.min(1, k * 1.5) * 0.92;
  const w = measure(c, s, size, o.fam || F.punch) + size * 0.9, h = size * 1.55;
  c.strokeStyle = o.color || '#e8202f'; c.lineWidth = size * 0.12; rrect(c, -w / 2, -h / 2, w, h, size * 0.22); c.stroke();
  txt(c, s, 0, 2, { size, fam: o.fam || F.punch, color: o.color || '#e8202f' });
  c.restore();
}

// horizontal meter
function meter(c, x, y, w, label, v, color, o = {}) {
  const h = o.h || 34;
  txt(c, label, x, y - h - 6, { size: o.size || 38, fam: F.black, color: o.labelColor || '#fff', align: 'left', stroke: o.stroke, sw: 8 });
  c.fillStyle = o.track || 'rgba(255,255,255,.25)'; rrect(c, x, y - h / 2, w, h, h / 2); c.fill();
  c.fillStyle = color; rrect(c, x, y - h / 2, Math.max(h, w * clamp(v)), h, h / 2); c.fill();
  if (o.value !== undefined) txt(c, o.value, x + w + 16, y, { size: o.size || 38, fam: F.round, color: o.labelColor || '#fff', align: 'left', stroke: o.stroke, sw: 8 });
}

// polaroid frame with custom content drawer
function polaroid(c, x, y, w, h, rot, k, caption, drawInner) {
  if (k <= 0) return;
  c.save(); c.translate(x, y + (1 - k) * 300); c.rotate(rot * k + (1 - k) * 0.6); c.globalAlpha *= clamp(k * 1.5);
  c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(-w / 2 + 10, -h / 2 + 14, w, h + 90);
  c.fillStyle = '#fbf8f1'; c.fillRect(-w / 2, -h / 2, w, h + 90);
  c.save(); c.beginPath(); c.rect(-w / 2 + 24, -h / 2 + 24, w - 48, h - 48); c.clip(); drawInner(-w / 2 + 24, -h / 2 + 24, w - 48, h - 48); c.restore();
  txt(c, caption, 0, h / 2 + 30, { size: 46, fam: F.hand, color: '#3a3346' });
  c.restore();
}

// simple open hand (palm + 4 fingers + thumb), pivot at wrist
function hand(c, x, y, s, color, alpha = 1) {
  c.save(); c.translate(x, y); c.globalAlpha *= alpha; c.fillStyle = color; c.strokeStyle = 'rgba(40,30,80,.5)'; c.lineWidth = s * 0.06;
  rrect(c, -s * 0.42, -s * 0.9, s * 0.84, s * 0.85, s * 0.28); c.fill(); c.stroke();
  for (let i = 0; i < 4; i++) { rrect(c, -s * 0.42 + i * s * 0.215, -s * 1.55 + Math.abs(i - 1.5) * s * 0.12, s * 0.19, s * 0.75, s * 0.1); c.fill(); c.stroke(); }
  withT(c, s * 0.42, -s * 0.45, 0.7, 1, () => { rrect(c, -s * 0.1, -s * 0.45, s * 0.2, s * 0.55, s * 0.1); c.fill(); c.stroke(); });
  c.restore();
}

// maple-ish leaf
function leaf(c, x, y, s, rot, color) {
  c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = color; c.beginPath();
  for (let i = 0; i <= 10; i++) {
    const a = -Math.PI / 2 + (i / 10) * TAU, r = s * (i % 2 ? 0.45 : 1) * (i === 5 ? 0.6 : 1);
    c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  c.closePath(); c.fill(); c.strokeStyle = 'rgba(80,20,0,.35)'; c.lineWidth = s * 0.07; c.beginPath(); c.moveTo(0, s * 0.2); c.lineTo(0, s * 1.2); c.stroke();
  c.restore();
}

// falling leaves over the whole frame (deterministic in t)
function leaves(c, t, t0, n, alpha = 1) {
  if (t < t0) return;
  const cols = ['#f0762a', '#e4502b', '#f2a33a', '#d9452b', '#f6c04a'];
  particles(c, t, n, 77, (a, b, d, e, i) => {
    const speed = 90 + d * 120, life = (H + 300) / speed, tt = (t - t0 + e * life) % life;
    const y = -150 + tt * speed, x = a * W + Math.sin(tt * (0.8 + b) + i) * 70;
    leaf(c, x, y, 18 + b * 22, tt * (1 + d * 2) + i, hexA(cols[i % cols.length].slice(0, 7), alpha * 0.9));
  });
}

// danmaku comments flying right → left
function danmaku(c, t, t0, list) {
  list.forEach(([s, lane, delay, col], i) => {
    const tt = t - t0 - delay; if (tt < 0) return;
    const w = measure(c, s, 50, F.black), x = W + 20 - tt * (360 + (i % 3) * 70);
    if (x < -w - 40) return;
    txt(c, s, x, 330 + lane * 82, { size: 50, fam: F.black, color: col || '#fff', stroke: 'rgba(0,0,0,.55)', sw: 9, align: 'left' });
  });
}

// generic "light rays" behind something
function rays(c, x, y, r, t, color, n = 14, alpha = 0.25) {
  c.save(); c.translate(x, y); c.rotate(t * 0.15); c.fillStyle = color; c.globalAlpha *= alpha;
  for (let i = 0; i < n; i++) { c.rotate(TAU / n); c.beginPath(); c.moveTo(0, 0); c.lineTo(r, -r * 0.09); c.lineTo(r, r * 0.09); c.closePath(); c.fill(); }
  c.restore();
}

// speed lines toward a point (manga focus lines)
function focusLines(c, x, y, t, alpha, color = '#fff') {
  if (alpha <= 0) return;
  c.save(); c.globalAlpha *= alpha; c.fillStyle = color;
  particles(c, t, 70, Math.floor(t * 12), (a, b, d) => {
    const ang = a * TAU, r0 = 420 + b * 260, r1 = 1500, wd = 0.004 + d * 0.01;
    c.beginPath(); c.moveTo(x + Math.cos(ang) * r0, y + Math.sin(ang) * r0);
    c.lineTo(x + Math.cos(ang - wd) * r1, y + Math.sin(ang - wd) * r1); c.lineTo(x + Math.cos(ang + wd) * r1, y + Math.sin(ang + wd) * r1); c.closePath(); c.fill();
  });
  c.restore();
}

// camera shake offset
function shake(t, t0, amp = 14, dur = 0.35) {
  const k = 1 - ramp(t, t0, dur); if (t < t0 || k <= 0) return [0, 0];
  return [noise1(t * 40) * amp * k, noise1(t * 40 + 9) * amp * k];
}

// vignette + film grain on top of everything
function finish(c, t) {
  const g = c.createRadialGradient(W / 2, H * 0.45, H * 0.35, W / 2, H * 0.5, H * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,6,20,.38)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  const bt = c.createLinearGradient(0, 1300, 0, H); bt.addColorStop(0, 'rgba(10,6,20,0)'); bt.addColorStop(1, 'rgba(10,6,20,.55)'); c.fillStyle = bt; c.fillRect(0, 1300, W, H - 1300);
}

// music level 0..1 at time t (from assets/viz.js); band b of 0..7
function vizLevel(t, b = -1) {
  if (!window.VIZ) return 0;
  const i = Math.floor(t * VIZ.fps); const f = VIZ.frames[clamp(i, 0, VIZ.frames.length - 1)] || [];
  if (b < 0) return (f[0] || 0) / 255;
  return (f[1 + b] || 0) / 255;
}
