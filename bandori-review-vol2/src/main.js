// ─── main: assets, render loop, player UI, capture hooks ────────────────────

const IMAGES = ['anon_ep1', 'anon_idea', 'anon_tomori', 'anon_tomori2', 'anon_stage', 'taki_ep2', 'taki_angry', 'taki_drum', 'soyo_ep2', 'soyo_ep9', 'soyo_sad', 'soyo_bass',
  'tomori_ep1', 'tomori_sing', 'mygo_group', 'uika_saki_park', 'saki_smile', 'uika_cap', 'uika_nyamu', 'uika_ep11', 'saki_close', 'am_stage', 'am_group',
  'anon_happy', 'anon_heart', 'anon_shock', 'anon_back', 'anon_soyo', 'soyo_glare', 'soyo_smile', 'soyo_break', 'soyo_silh', 'taki_shout', 'taki_cry', 'soyo_taki', 'taki_brick',
  'uika_dress', 'uika_face', 'uika_glasses', 'misaki_michelle', 'misaki_card', 'misaki_card2', 'kokoro_card', 'arisa_card', 'lock_card', 'lock_card2', 'anon_card', 'soyo_card',
  'taki_card', 'tomori_card', 'misaki_chibi', 'uika_chibi', 'soyo_chibi', 'misaki_chibi2', 'chara_uika', 'chara_sakiko', 'logo3', 'logo18', 'logo21', 'logo45'];

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

const XF = 0.32; // crossfade between shots
function render(t) {
  const c = ctx;
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.filter = 'none';
  const i = shotIndexAt(t), s = SHOTS[i], p = SHOTS[i - 1];
  const k = p && p.sec === s.sec ? ease.io(ramp(t, s.t0, XF)) : 1;
  drawBackdrop(c, p && k < 1 ? p : s, s, k < 1 ? k : 0);
  // frame: subtle drop shadow band behind the 16:9 still
  c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, FRAME.y - 6, W, FRAME.h + 12);
  if (k < 1) drawShot(c, p, t, 1);
  drawShot(c, s, t, k);
  overlays(c, t);
  moodBars(c, t);
  drawHeader(c, t);
  drawSubtitle(c, t);
  drawFooter(c, t);
  // dip to black between sections and at both ends
  const sec = sectionAt(t);
  const dip = Math.max(sec.index ? 1 - ramp(t, sec.t0, 0.35) : 0, ramp(t, sec.t1 - 0.25, 0.25) * (sec.index < TL.sections.length - 1 ? 1 : 0));
  const ends = Math.max(1 - ramp(t, 0, 0.6), ramp(t, TL.dur - 1.0, 1.0));
  const a = Math.max(dip * 0.85, ends);
  if (a > 0) { c.fillStyle = `rgba(0,0,0,${a})`; c.fillRect(0, 0, W, H); }
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
function toggle() { if (!started) return; if (audio.paused) audio.play(); else audio.pause(); }
function seek(e) { const r = ui.bar.getBoundingClientRect(); audio.currentTime = clamp((e.clientX - r.left) / r.width) * TL.dur; }

function boot() {
  initTimeline();
  buildShots();
  const capture = /[?&]capture/.test(location.search);
  loadAssets((p) => { if (ui.load) ui.load.style.width = p * 100 + '%'; }).then(() => {
    render(1.0);
    window.READY = true;
    if (capture) { ui.boot.remove(); ui.ctrl.remove(); document.body.classList.add('capture'); return; }
    ui.play.disabled = false; ui.play.textContent = '▶ 播放';
  });
  ui.play.addEventListener('click', () => { ui.boot.classList.add('gone'); started = true; audio.play(); cancelAnimationFrame(raf); tick(); });
  cv.addEventListener('click', toggle);
  ui.bar.addEventListener('click', seek);
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); toggle(); }
    if (e.code === 'ArrowRight') audio.currentTime = Math.min(TL.dur, audio.currentTime + 5);
    if (e.code === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
  });
  audio.addEventListener('ended', () => { cancelAnimationFrame(raf); render(TL.dur - 0.01); });
}

window.renderAt = (t) => render(t);
window.collectSfx = () => sfxCues();
window.DEBUG = { SEC, SHOTLIST, SHOTS: () => SHOTS }; // for tools/ checks
boot();
