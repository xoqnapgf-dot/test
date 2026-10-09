// Player: audio-locked clock, chapter crossfades, chapter cards, subtitles, controls.
import * as THREE from 'three';
import { Stage } from './core/stage.js';
import { TOTAL, SCENES, sceneIndexAt, subtitleAt } from './core/time.js';
import { SCENE_LIST } from './scenes/index.js';
import { drawChapterCard } from './core/chapter.js';
import { clamp } from './core/util.js';
import { loadImages } from './core/images.js';

const qs = new URLSearchParams(location.search);
const CAPTURE = qs.has('capture');
const XFADE = 1.5; // seconds of ink-bleed between chapters

async function loadFonts() {
  const F = window.__FONTS || {};
  const jobs = [];
  for (const [family, variants] of Object.entries(F)) {
    for (const [weight, b64] of Object.entries(variants)) {
      const bin = Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0));
      const ff = new FontFace(family, bin.buffer, { weight: String(weight) });
      jobs.push(ff.load().then((f) => document.fonts.add(f)));
    }
  }
  await Promise.all(jobs);
}

const byId = {};
for (const s of SCENE_LIST) byId[s.id] = s;
const built = {};
function sceneObj(id) {
  if (!built[id]) built[id] = byId[id].build();
  return built[id];
}

const canvas = document.getElementById('gl');
const stage = new Stage(canvas, { capture: CAPTURE });
const subEl = document.getElementById('sub');
const audio = document.getElementById('audio');
let quality = +(localStorage.getItem('pv-quality') || 1);
let subsOn = localStorage.getItem('pv-subs') !== '0';

function layout() {
  const w = CAPTURE ? +(qs.get('w') || 1920) : window.innerWidth;
  const h = CAPTURE ? Math.round((w * 9) / 16) : window.innerHeight;
  stage.resize(w, h, CAPTURE ? 1 : window.devicePixelRatio || 1, CAPTURE ? 1 : quality);
  const r = stage.css;
  const stageEl = document.getElementById('stagebox');
  stageEl.style.cssText = `left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px`;
  document.documentElement.style.setProperty('--u', r.w / 1920 + 'px');
}

// per-frame uniforms some materials want (pixel scale for points & hatching)
function syncPx(sc) {
  const half = stage.ph / 2;
  const virt = stage.ph / 1080;
  sc.three.traverse((o) => {
    const m = o.material;
    if (!m || !m.uniforms) return;
    if (m.uniforms.uPx) m.uniforms.uPx.value = m.userData.virtPx ? virt : m.isPoints || o.isPoints ? half : virt;
  });
}

const ctx = {
  THREE,
  after(g, sc, t) {
    drawChapterCard(g, sc, t);
  },
};

function render(t) {
  t = clamp(t, 0, TOTAL);
  const i = sceneIndexAt(t);
  const cur = SCENES[i];
  const A = sceneObj(cur.id);
  let k = 0;
  let B = null;
  let prev = null;
  // crossfade happens at the start of each chapter: previous chapter -> current
  if (i > 0 && t - cur.t0 < XFADE) {
    prev = sceneObj(SCENES[i - 1].id);
    k = (t - cur.t0) / XFADE;
    B = A;
  }
  for (const s of [prev, A]) if (s) syncPx(s);
  const seed = [0.3 + 0.4 * ((i * 0.618) % 1), 0.35 + 0.3 * ((i * 0.37) % 1)];
  if (B) stage.frame(t, prev, B, k, ctx, seed);
  else stage.frame(t, A, null, 0, ctx);
  // global fade in / out
  stage.fin.u.uFade.value = Math.min(clamp(t / 2.2), clamp((TOTAL - t) / 3.5));
  const started = CAPTURE || document.getElementById('start').classList.contains('gone');
  const txt = subsOn && started ? subtitleAt(t) : '';
  if (subEl.textContent !== txt) subEl.textContent = txt;
  subEl.className = 'sub ' + (A.mode === 'paper' && k > 0.5 ? 'paper' : !B && A.mode === 'paper' ? 'paper' : B && k < 0.5 && prev.mode === 'paper' ? 'paper' : '');
  updateHud(t);
}

// --------------------------------------------------------------- clock
let playing = false;
let tBase = 0;
let perfBase = 0;
let tNow = +(qs.get('t') || 0);
function now() {
  if (!playing) return tNow;
  const t = tBase + (performance.now() - perfBase) / 1000;
  // stay locked to the audio element
  if (!audio.paused && Math.abs(audio.currentTime - t) > 0.08) {
    tBase = audio.currentTime;
    perfBase = performance.now();
    return tBase;
  }
  return t;
}
function play() {
  if (playing) return;
  playing = true;
  audio.currentTime = tNow;
  tBase = tNow;
  perfBase = performance.now();
  audio.play().catch(() => {});
  document.body.classList.add('playing');
}
function pause() {
  if (!playing) return;
  tNow = now();
  playing = false;
  audio.pause();
  document.body.classList.remove('playing');
}
function seek(t) {
  tNow = clamp(t, 0, TOTAL);
  tBase = tNow;
  perfBase = performance.now();
  audio.currentTime = tNow;
  if (!playing) render(tNow);
}
audio.addEventListener('ended', () => {
  pause();
  tNow = TOTAL;
});

function loop() {
  if (playing) {
    tNow = now();
    if (tNow >= TOTAL) pause();
    render(tNow);
  }
  requestAnimationFrame(loop);
}

// ----------------------------------------------------------------- HUD
const hud = document.getElementById('hud');
const bar = document.getElementById('bar');
const fill = document.getElementById('fill');
const timeEl = document.getElementById('time');
const chapEl = document.getElementById('chap');
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
function buildMarks() {
  for (const s of SCENES) {
    if (!s.t0) continue;
    const m = document.createElement('i');
    m.style.left = (s.t0 / TOTAL) * 100 + '%';
    m.title = s.title.join(' ');
    bar.appendChild(m);
  }
}
let lastHud = -1;
function updateHud(t) {
  if (Math.abs(t - lastHud) < 0.2) return;
  lastHud = t;
  fill.style.width = (t / TOTAL) * 100 + '%';
  timeEl.textContent = `${fmt(t)} / ${fmt(TOTAL)}`;
  const s = SCENES[sceneIndexAt(t)];
  chapEl.textContent = `${s.title[0]}  ${s.title[1]}`;
}
let hideTimer = 0;
function poke() {
  hud.classList.add('show');
  document.body.classList.remove('nocursor');
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    if (playing) {
      hud.classList.remove('show');
      document.body.classList.add('nocursor');
    }
  }, 2200);
}
function scrubAt(e) {
  const r = bar.getBoundingClientRect();
  seek(((e.clientX - r.left) / r.width) * TOTAL);
}

function wire() {
  window.addEventListener('resize', () => {
    layout();
    if (!playing) render(tNow);
  });
  document.addEventListener('mousemove', poke);
  let drag = false;
  bar.addEventListener('pointerdown', (e) => {
    drag = true;
    bar.setPointerCapture(e.pointerId);
    scrubAt(e);
  });
  bar.addEventListener('pointermove', (e) => drag && scrubAt(e));
  bar.addEventListener('pointerup', () => (drag = false));
  document.getElementById('pp').onclick = () => (playing ? pause() : play());
  document.getElementById('cc').onclick = toggleSubs;
  document.getElementById('fs').onclick = toggleFs;
  const qb = document.getElementById('q');
  const qText = () => (qb.textContent = quality >= 1 ? '画质 高' : quality >= 0.75 ? '画质 中' : '画质 低');
  qText();
  qb.onclick = () => {
    quality = quality >= 1 ? 0.75 : quality >= 0.75 ? 0.5 : 1;
    localStorage.setItem('pv-quality', quality);
    qText();
    layout();
    if (!playing) render(tNow);
  };
  document.getElementById('stagebox').addEventListener('click', (e) => {
    if (e.target.closest('#hud') || !document.getElementById('start').classList.contains('gone')) return;
    playing ? pause() : play();
  });
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      playing ? pause() : play();
    } else if (e.code === 'ArrowRight') seek(now() + 5);
    else if (e.code === 'ArrowLeft') seek(now() - 5);
    else if (e.key === 'c' || e.key === 'C') toggleSubs();
    else if (e.key === 'f' || e.key === 'F') toggleFs();
    else if (e.key === 'h' || e.key === 'H') hud.classList.toggle('hidden');
    else if (/^[0-9]$/.test(e.key)) {
      const n = e.key === '0' ? 10 : +e.key;
      const s = SCENES[Math.min(SCENES.length - 1, n - 1)];
      seek(s.t0 + 0.01);
    }
    poke();
  });
}
function toggleSubs() {
  subsOn = !subsOn;
  localStorage.setItem('pv-subs', subsOn ? '1' : '0');
  document.getElementById('cc').classList.toggle('off', !subsOn);
  if (!playing) render(tNow);
}
function toggleFs() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => {});
}

async function boot() {
  await Promise.all([loadFonts(), loadImages()]);
  layout();
  // compile every chapter up front so playback never stalls on a shader build
  const R = stage.renderer;
  for (const s of SCENE_LIST) {
    const sc = sceneObj(s.id);
    if (!CAPTURE) R.compile(sc.three, sc.camera);
  }
  window.PV = {
    TOTAL,
    SCENES,
    renderAt(t) {
      tNow = t;
      render(t);
      if (CAPTURE) render(t); // first draw after a jump can come out blank on software GL
      return true;
    },
  };
  if (CAPTURE) {
    document.body.classList.add('capture');
    render(tNow);
    window.__ready = true;
    return;
  }
  buildMarks();
  wire();
  // poster behind the start screen: the title over the energy axis
  const startAt = tNow;
  render(qs.has('t') ? tNow : 34.6);
  document.getElementById('cc').classList.toggle('off', !subsOn);
  const start = document.getElementById('start');
  start.classList.add('ready');
  start.querySelector('button').onclick = (e) => {
    e.stopPropagation(); // the start screen sits inside the stage, whose click toggles play/pause
    start.classList.add('gone');
    tNow = startAt;
    play();
    poke();
  };
  requestAnimationFrame(loop);
}
boot();
