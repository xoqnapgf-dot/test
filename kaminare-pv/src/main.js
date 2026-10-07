// Entry: boot screen, font loading, scene construction, player UI.
import { App } from './core/app.js';
import { loadFonts } from './core/type.js';
import { drawHud } from './core/hud.js';
import { SHOTS, SCENES } from './shots.js';
import { DURATION, SEC, CHAPTERS } from './core/music.js';

const $ = (s) => document.querySelector(s);
const params = new URLSearchParams(location.search);
const capture = params.has('capture') ? { width: +params.get('w') || 1280 } : null;

function hasWebGL2() {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch (e) {
    return false;
  }
}

async function boot() {
  if (!hasWebGL2()) {
    $('#boot').style.display = 'none';
    $('#fallback').style.display = 'grid';
    return;
  }
  const msg = $('#loadmsg');
  const bar = $('#loadbar');
  const set = (p, m) => {
    bar.style.width = `${Math.round(p * 100)}%`;
    if (m) msg.textContent = m;
  };
  set(0.05, '書体を読み込み中…');
  await loadFonts();
  const app = new App({ shots: SHOTS, scenes: SCENES, hud: drawHud, capture });
  window.PV = app;
  const labels = {
    intro: '灯を点しています…', emaki: '墨を磨っています…', pre: '朱を溶いています…', chorus: '硝子を嵌めています…',
    post: '拍を数えています…', verse2: '版を刷っています…', rope: '縄を綯っています…', solo: '雲を集めています…',
    bridge: '蝋燭を立てています…', outro: '鐘を吊るしています…',
  };
  await app.init((p, name) => set(0.1 + p * 0.85, labels[name] || '準備中…'));
  set(1, '準備完了 — 奉納して再生');

  if (capture) {
    document.body.classList.add('capture');
    $('#boot').style.display = 'none';
    app.renderAt(+params.get('t') || 0);
    window.__ready = true;
    return;
  }

  const audio = $('#song');
  app.attachAudio(audio);
  const t0 = +params.get('t') || 0;
  app.t = t0;
  app.start();
  if (t0) audio.currentTime = t0;

  // ---------- UI
  const play = $('#play');
  play.disabled = false;
  const ui = $('#ui');
  const pp = $('#pp');
  const begin = async () => {
    try {
      await audio.play();
    } catch (e) {
      console.warn(e);
    }
    $('#boot').classList.add('gone');
  };
  play.addEventListener('click', begin);

  const toggle = () => {
    if ($('#boot').classList.contains('gone') === false) return begin();
    if (audio.paused) audio.play();
    else audio.pause();
  };
  audio.addEventListener('play', () => (pp.textContent = '❚❚ PAUSE'));
  audio.addEventListener('pause', () => (pp.textContent = '▶ PLAY'));
  pp.addEventListener('click', toggle);
  app.onEnded = () => {
    ui.classList.add('show');
  };

  // timeline with chapter ticks
  const barEl = $('#bar');
  for (const [key, , kanji] of CHAPTERS) {
    const tk = document.createElement('div');
    tk.className = 'tick';
    tk.style.left = `${(SEC[key][0] / DURATION) * 100}%`;
    tk.innerHTML = `<b>${kanji}</b>`;
    barEl.appendChild(tk);
  }
  const seekTo = (t) => {
    audio.currentTime = Math.max(0, Math.min(DURATION - 0.05, t));
    app.resync();
  };
  let dragging = false;
  const seekEv = (e) => {
    const r = barEl.getBoundingClientRect();
    seekTo(((e.clientX - r.left) / r.width) * DURATION);
  };
  barEl.addEventListener('pointerdown', (e) => {
    dragging = true;
    barEl.setPointerCapture(e.pointerId);
    seekEv(e);
  });
  barEl.addEventListener('pointermove', (e) => dragging && seekEv(e));
  barEl.addEventListener('pointerup', () => (dragging = false));

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  app.onTick = (t) => {
    const p = (t / DURATION) * 100;
    $('#fill').style.width = `${p}%`;
    $('#head').style.left = `${p}%`;
    $('#tc').textContent = `${fmt(t)} / ${fmt(DURATION)}`;
    const ch = app.chapterAt(t);
    $('#chap').textContent = `${ch[2]}  ${ch[1]}`;
  };

  // auto-hide controls
  let hideT = 0;
  const poke = () => {
    if (!$('#boot').classList.contains('gone')) return;
    ui.classList.add('show');
    document.body.style.cursor = '';
    clearTimeout(hideT);
    hideT = setTimeout(() => {
      if (!audio.paused) {
        ui.classList.remove('show');
        document.body.style.cursor = 'none';
      }
    }, 2200);
  };
  window.addEventListener('pointermove', poke);
  window.addEventListener('pointerdown', poke);

  const fs = () => {
    const st = document.documentElement;
    if (!document.fullscreenElement) st.requestFullscreen?.();
    else document.exitFullscreen?.();
  };
  $('#fsbtn').addEventListener('click', fs);
  $('#hudbtn').addEventListener('click', () => (app.hideHud = !app.hideHud));
  const QL = [0.5, 0.75, 1];
  const qbtn = $('#qbtn');
  qbtn.addEventListener('click', () => {
    const i = (QL.indexOf(app.quality) + 1) % QL.length;
    app.quality = QL[i];
    qbtn.textContent = `QUALITY ${'●'.repeat(i + 1)}${'○'.repeat(2 - i)}`;
    app.resize();
  });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      toggle();
    } else if (e.code === 'ArrowRight') seekTo(audio.currentTime + 5);
    else if (e.code === 'ArrowLeft') seekTo(audio.currentTime - 5);
    else if (e.code === 'KeyF') fs();
    else if (e.code === 'KeyH') app.hideHud = !app.hideHud;
    else if (/^Digit[1-9]$/.test(e.code)) {
      const idx = +e.code.slice(5) - 1;
      const keys = ['intro', 'v1', 'pre1', 'ch1', 'v2', 'ch2', 'solo', 'bridge', 'fc'];
      seekTo(SEC[keys[idx]][0]);
      if ($('#boot').classList.contains('gone') === false) begin();
    }
    poke();
  });
}

boot();
