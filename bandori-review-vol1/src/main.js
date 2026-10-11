// ─── main: assets, render loop, player UI, capture hooks ────────────────────

const IMAGES = ['ksm_soft', 'ksm_go', 'ksm_mega', 'ksm_star', 'otae', 'otae_b', 'ars_b', 'ran_stage', 'ran_off', 'moca', 'moca_b', 'chisato', 'maya', 'eve', 'ykn', 'sayo', 'lisa',
  'jk_mae', 'jk_mae_cd', 'jk_ars', 'logo1', 'logo2', 'logo3', 'logo4', 'logo5', 'st0101', 'st0147', 'st0222', 'st0532'];
for (let i = 1; i <= 25; i++) IMAGES.push(st(i));

const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
cv.width = W; cv.height = H;

function loadAssets(onProgress) {
  const jobs = [];
  for (const [fam, b64] of Object.entries(window.BR_FONTS || {})) {
    const ff = new FontFace(fam, `url(data:font/woff2;base64,${b64})`);
    jobs.push(ff.load().then((f) => document.fonts.add(f)));
  }
  for (const n of IMAGES) {
    jobs.push(new Promise((res) => { const im = new Image(); im.onload = () => { IMG[n] = im; res(); }; im.onerror = () => res(); im.src = 'assets/img/' + n + '.webp'; }));
  }
  let done = 0; jobs.forEach((p) => p.then(() => onProgress(++done / jobs.length)));
  return Promise.all(jobs);
}

// section transition: diagonal wipe in the incoming section's accent colour
const TR = 0.55;
function render(t) {
  const c = ctx;
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.filter = 'none';
  const s = sectionAt(t), prev = TL.sections[s.index - 1];
  const tr = prev ? ramp(t, s.t0, TR) : 1;
  if (tr < 1) {
    c.save(); SCENES[prev.id](c, t, prev); c.restore();
    const e = ease.io(tr), x = lerp(-700, W + 700, e);
    c.save(); c.beginPath(); c.moveTo(x - 600, 0); c.lineTo(-800, 0); c.lineTo(-800, H); c.lineTo(x - 1300, H); c.closePath(); c.clip();
    SCENES[s.id](c, t, s); c.restore();
    c.save(); c.fillStyle = ACCENT[s.id] || '#ff3b6b'; c.beginPath(); c.moveTo(x - 600, 0); c.lineTo(x - 420, 0); c.lineTo(x - 1120, H); c.lineTo(x - 1300, H); c.closePath(); c.fill();
    c.fillStyle = '#fff'; for (let i = 0; i < 6; i++) { const yy = (i + 0.5) * (H / 6), xx = lerp(x - 510, x - 1210, yy / H); star(c, xx, yy, 36, 5, 0.45, t * 3 + i); c.fill(); }
    c.restore();
  } else {
    c.save(); SCENES[s.id](c, t, s); c.restore();
  }
  drawHeader(c, t);
  finish(c, t);
  drawSubtitle(c, t);
  drawFooter(c, t);
  // fade in / out
  const fade = Math.max(1 - ramp(t, 0, 0.5), ramp(t, TL.dur - 0.8, 0.8));
  if (fade > 0) { c.fillStyle = `rgba(0,0,0,${fade})`; c.fillRect(0, 0, W, H); }
}

// ── player ──
const audio = document.getElementById('au');
const ui = { boot: document.getElementById('boot'), play: document.getElementById('play'), load: document.querySelector('.load i'), bar: document.getElementById('bar'), fill: document.querySelector('#bar .fill'), time: document.getElementById('time'), ctrl: document.getElementById('ctrl') };
let started = false, raf = 0;
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

function tick() {
  const t = audio.currentTime;
  render(t);
  ui.fill.style.width = (t / TL.dur) * 100 + '%';
  ui.time.textContent = fmt(t) + ' / ' + fmt(TL.dur);
  raf = requestAnimationFrame(tick);
}
function toggle() {
  if (!started) return;
  if (audio.paused) audio.play(); else audio.pause();
}
function seek(e) {
  const r = ui.bar.getBoundingClientRect(); audio.currentTime = clamp((e.clientX - r.left) / r.width) * TL.dur;
}

function boot() {
  initTimeline();
  const capture = /[?&]capture/.test(location.search);
  loadAssets((p) => { if (ui.load) ui.load.style.width = p * 100 + '%'; }).then(() => {
    render(0.6);
    window.READY = true;
    if (capture) { ui.boot.remove(); ui.ctrl.remove(); document.body.classList.add('capture'); return; }
    ui.play.disabled = false; ui.play.textContent = '▶ 播放';
  });
  ui.play.addEventListener('click', () => {
    ui.boot.classList.add('gone'); started = true; audio.play(); cancelAnimationFrame(raf); tick();
  });
  cv.addEventListener('click', toggle);
  ui.bar.addEventListener('click', seek);
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); toggle(); }
    if (e.code === 'ArrowRight') audio.currentTime = Math.min(TL.dur, audio.currentTime + 5);
    if (e.code === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
  });
  audio.addEventListener('ended', () => { cancelAnimationFrame(raf); render(TL.dur - 0.01); });
}

// hooks for tools/render.mjs
window.renderAt = (t) => render(t);
window.collectSfx = () => sfxCues();
boot();
