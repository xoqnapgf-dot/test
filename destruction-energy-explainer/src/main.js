// Entry: boot card, fonts, scene construction, player UI.
import { App } from './core/app.js';
import { loadFonts } from './core/type.js';
import { drawOverlay } from './core/overlay.js';
import { SCENE_CLASSES, TRANSITIONS } from './scenes/index.js';
import { TOTAL, SCENES, CHAPTERS } from './core/narr.js';

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
  const set = (p, m) => {
    $('#loadbar').style.width = `${Math.round(p * 100)}%`;
    if (m) $('#loadmsg').textContent = m;
  };
  set(0.05, '字体');
  await loadFonts();
  const app = new App({ scenes: SCENE_CLASSES, transitions: TRANSITIONS, overlay: drawOverlay, capture });
  window.PV = app;
  await app.init((p, name) => set(0.1 + p * 0.88, `准备 ${name}`));
  set(1, '就绪');
  if (capture) {
    $('#boot').style.display = 'none';
    app.renderAt(+params.get('t') || 0);
    window.__ready = true;
    return;
  }
  const audio = $('#track');
  app.attachAudio(audio);
  const t0 = +params.get('t') || 0;
  app.t = t0;
  app.start();
  if (t0) audio.currentTime = t0;

  const play = $('#play');
  play.disabled = false;
  const ui = $('#ui');
  const pp = $('#pp');
  const started = () => $('#boot').classList.contains('gone');
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
    if (!started()) return begin();
    if (audio.paused) audio.play();
    else audio.pause();
  };
  audio.addEventListener('play', () => (pp.textContent = '❚❚ 暂停'));
  audio.addEventListener('pause', () => (pp.textContent = '▶ 播放'));
  pp.addEventListener('click', toggle);
  app.onEnded = () => ui.classList.add('show');

  const barEl = $('#bar');
  for (const [id, num, name] of CHAPTERS) {
    const s = SCENES.find((x) => x.id === id);
    const tk = document.createElement('div');
    tk.className = 'tick';
    tk.style.left = `${(s.t0 / TOTAL) * 100}%`;
    tk.innerHTML = `<b>${num} ${name}</b>`;
    barEl.appendChild(tk);
  }
  const seekTo = (t) => {
    audio.currentTime = Math.max(0, Math.min(TOTAL - 0.05, t));
    app.resync();
  };
  let dragging = false;
  const seekEv = (e) => {
    const r = barEl.getBoundingClientRect();
    seekTo(((e.clientX - r.left) / r.width) * TOTAL);
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
    const p = (t / TOTAL) * 100;
    $('#fill').style.width = `${p}%`;
    $('#head').style.left = `${p}%`;
    $('#tc').textContent = `${fmt(t)} / ${fmt(TOTAL)}`;
    const { ch } = app.chapterAt(t);
    $('#chap').textContent = `${ch[1]} ${ch[2]}`;
  };
  let hideT = 0;
  const poke = () => {
    if (!started()) return;
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
  const fs = () => (!document.fullscreenElement ? document.documentElement.requestFullscreen?.() : document.exitFullscreen?.());
  $('#fsbtn').addEventListener('click', fs);
  const subs = () => {
    app.hideSubs = !app.hideSubs;
    $('#subbtn').textContent = `字幕 ${app.hideSubs ? '关' : '开'}`;
  };
  $('#subbtn').addEventListener('click', subs);
  const QL = [0.5, 0.75, 1];
  $('#qbtn').addEventListener('click', () => {
    const i = (QL.indexOf(app.quality) + 1) % QL.length;
    app.quality = QL[i];
    $('#qbtn').textContent = `画质 ${'●'.repeat(i + 1)}${'○'.repeat(2 - i)}`;
    app.resize();
  });
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      toggle();
    } else if (e.code === 'ArrowRight') seekTo(audio.currentTime + 5);
    else if (e.code === 'ArrowLeft') seekTo(audio.currentTime - 5);
    else if (e.code === 'KeyF') fs();
    else if (e.code === 'KeyC') subs();
    else if (e.code === 'KeyH') app.hideHud = !app.hideHud;
    else if (/^Digit[1-9]$/.test(e.code)) {
      const ch = CHAPTERS[+e.code.slice(5)];
      if (ch) seekTo(SCENES.find((x) => x.id === ch[0]).t0);
      if (!started()) begin();
    }
    poke();
  });
}

boot();
