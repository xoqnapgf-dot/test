/* Controls: the buttons under the film, the panel on the right, the keyboard, and the
 * free camera.
 *
 * The film owns the renderer's state while it is playing, so the panel works the way a
 * film's control room should: the moment you touch anything, the film hands the camera
 * and the state over to you (the frame freezes where it was), and "回到影片" gives the
 * camera back to the timeline at the same time stamp.
 */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});

  function el(tag, cls, parent, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }

  // range control: label, slider, live value
  function slider(parent, label, path, min, max, step, fmt, onSet) {
    var row = el('div', 'row', parent);
    el('label', null, row, label);
    var range = el('input', null, row);
    range.type = 'range'; range.min = min; range.max = max; range.step = step;
    var val = el('span', 'val', row);
    function show(v) { val.textContent = fmt ? fmt(v) : (+v).toFixed(step < 1 ? 2 : 0); }
    range.addEventListener('input', function () {
      var v = parseFloat(range.value);
      if (SS.app) SS.app.film = false;
      if (onSet) onSet(v); else setPath(path, v);
      show(v);
    });
    return { row: row, range: range, show: show, set: function (v) { range.value = v; show(v); } };
  }

  function setPath(path, v) {
    if (!SS.app) return;
    if (path.indexOf('.') < 0) { SS.renderer.s[path] = v; return; }
    var head = path.split('.')[0], rest = path.slice(head.length + 1);
    var t = head === 'camera' ? SS.renderer.camera : (head === 'params' ? SS.renderer.params : SS.renderer.s);
    t[rest] = v;
  }
  function getPath(path) {
    if (!SS.app) return 0;
    if (path.indexOf('.') < 0) return SS.renderer.s[path];
    var head = path.split('.')[0], rest = path.slice(head.length + 1);
    var t = head === 'camera' ? SS.renderer.camera : (head === 'params' ? SS.renderer.params : SS.renderer.s);
    return t[rest];
  }

  function toggle(parent, label, initial, onToggle) {
    var t = el('div', 'toggle' + (initial ? ' on' : ''), parent);
    el('span', 'dot', t);
    el('span', null, t, label);
    t.addEventListener('click', function () {
      var on = !t.classList.contains('on');
      t.classList.toggle('on', on);
      if (onToggle) onToggle(on);
    });
    return t;
  }

  var keys = {};

  SS.ui = {
    init: function (R, app) {
      this.R = R; this.app = app;
      var self = this;
      var byId = function (id) { return document.getElementById(id); };

      byId('btnPlay').onclick = function () { app.playing = !app.playing; self.syncButtons(); };
      byId('btnPanel').onclick = function () { self.togglePanel(); };
      byId('panelClose').onclick = function () { self.togglePanel(false); };
      byId('btnCaptions').onclick = function () { self.toggleCaptions(); };
      byId('btnSound').onclick = function () { self.toggleSound(); };
      byId('btnFull').onclick = function () {
        if (document.fullscreenElement) document.exitFullscreen();
        else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
      };

      this.buildPanel();
      this.jump = byId('btnJump');                 // created by buildPanel

      window.addEventListener('keydown', function (e) {
        if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
        keys[e.code] = true;
        if (e.code === 'Space') { e.preventDefault(); app.playing = !app.playing; self.syncButtons(); }
        else if (e.key === 'c' || e.key === 'C') self.toggleCaptions();
        else if (e.key === 'h' || e.key === 'H') document.body.classList.toggle('uiHidden');
        else if (e.key === 'p' || e.key === 'P') self.togglePanel();
        else if (e.key === 'm' || e.key === 'M') self.toggleSound();
        else if (e.key === 'f' || e.key === 'F') byId('btnFull').click();
        else if (e.key === 'ArrowRight' && SS.timeline) SS.timeline.seekTo(app.time + 5, R, app);
        else if (e.key === 'ArrowLeft' && SS.timeline) SS.timeline.seekTo(app.time - 5, R, app);
      });
      window.addEventListener('keyup', function (e) { keys[e.code] = false; });

      // mouse look: drag anywhere on the picture
      var dragging = false, lastX = 0, lastY = 0;
      var stage = byId('stage');
      stage.addEventListener('pointerdown', function (e) {
        dragging = true; lastX = e.clientX; lastY = e.clientY;
        stage.setPointerCapture && stage.setPointerCapture(e.pointerId);
        stage.style.cursor = 'grabbing';
      });
      window.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        var dx = e.clientX - lastX, dy = e.clientY - lastY;
        lastX = e.clientX; lastY = e.clientY;
        var d = app.drag || (app.drag = { yaw: 0, pitch: 0 });
        d.yaw += dx * 0.09;
        d.pitch = Math.max(-70, Math.min(70, d.pitch - dy * 0.07));
        if (SS.app && SS.app.film === false) self.freeLook(d);
      });
      window.addEventListener('pointerup', function () { dragging = false; stage.style.cursor = ''; });

      this.syncButtons();
      this.setCaptions(app.captions !== false);
      return true;
    },

    // ---------------------------------------------------------------- panel
    buildPanel: function () {
      var body = document.getElementById('panelBody');
      if (!body || body.childNodes.length) return;
      var R = SS.renderer, app = this.app, self = this;

      var gFilm = el('div', 'group', body);
      el('h3', null, gFilm, '影片');
      var note = el('div', 'panelNote', gFilm,
        '影片由九章组成，共 ' + (SS.timeline ? Math.round(SS.timeline.duration) : 96) + ' 秒。改动任何一项，控制权就交给您——画面停在这一帧，方向键或拖动鼠标可以自由飞。');
      var row = el('div', 'row', gFilm);
      var jump = el('button', 'btn', row, '回到影片');
      jump.id = 'btnJump';
      jump.style.opacity = '0.45';
      jump.disabled = true;
      jump.addEventListener('click', function () {
        if (!SS.timeline) return;
        app.film = true;
        app.drag = { yaw: 0, pitch: 0 };
        SS.timeline.enter(app.time, R, app);
        app.playing = true;
        self.syncButtons();
        jump.style.opacity = '0.45'; jump.disabled = true;
        self.syncPanel();
      });
      var speed = slider(row, '速度', null, 0.25, 2, 0.05, function (v) { return v.toFixed(2) + '×'; },
        function (v) { app.speed = v; });
      speed.set(app.speed === undefined ? 1 : app.speed);

      var gPreset = el('div', 'group', body);
      el('h3', null, gPreset, '光况预设');
      var pr = el('div', 'presetRow', gPreset);
      var presets = [
        { n: '日落', s: { sunElev: 9.5, sunAzi: 196, haze: 0.5, cloudCover: 0.16, cloudSun: 1.1, exposureBias: 1.0 } },
        { n: '金色时刻', s: { sunElev: 4.5, sunAzi: 190, haze: 0.62, cloudCover: 0.20, cloudSun: 1.25, exposureBias: 1.05 } },
        { n: '正午', s: { sunElev: 52, sunAzi: 150, haze: 0.45, cloudCover: 0.14, cloudSun: 0.8, exposureBias: 0.9 } },
        { n: '蓝调', s: { sunElev: 1.2, sunAzi: 205, haze: 0.7, cloudCover: 0.22, cloudSun: 0.9, exposureBias: 1.15 } }
      ];
      presets.forEach(function (p) {
        var b = el('button', 'btn small', pr, p.n);
        b.addEventListener('click', function () {
          app.film = false;
          for (var k in p.s) R.s[k] = p.s[k];
          self.syncPanel();
        });
      });

      var gLight = el('div', 'group', body);
      el('h3', null, gLight, '光照与大气');
      var s1 = slider(gLight, '太阳高度', 'sunElev', 1, 60, 0.5, function (v) { return v.toFixed(1) + '°'; });
      var s2 = slider(gLight, '太阳方位', 'sunAzi', 100, 260, 1, function (v) { return v.toFixed(0) + '°'; });
      var s3 = slider(gLight, '雾霭', 'haze', 0, 1, 0.01);
      var s4 = slider(gLight, '曝光补偿', 'exposureKey', 0.05, 0.4, 0.005);
      var s5 = slider(gLight, '米氏散射', 'mieTint', 0.2, 1.6, 0.02);

      var gSea = el('div', 'group', body);
      el('h3', null, gSea, '海面');
      var w1 = slider(gSea, '风速', 'wind', 1, 18, 0.1, function (v) { return v.toFixed(1) + ' m/s'; });
      var w2 = slider(gSea, '海平面', 'seaLevel', -80, 80, 1, function (v) { return (v > 0 ? '+' : '') + v.toFixed(0) + ' m'; });
      var w3 = slider(gSea, '浪高', 'waveAmp', 0.2, 1.8, 0.02);
      var w4 = slider(gSea, '白冠', 'foam', 0, 2, 0.02);
      var w5 = slider(gSea, '水色浓度', 'absorption', 0, 2, 0.02);

      var gCloud = el('div', 'group', body);
      el('h3', null, gCloud, '云');
      var c1 = slider(gCloud, '云量', 'cloudCover', 0, 0.45, 0.005, function (v) { return (v * 100).toFixed(0) + '%'; });
      var c2 = slider(gCloud, '云底', 'cloudBase', 900, 3000, 20, function (v) { return (v | 0) + ' m'; });
      var c3 = slider(gCloud, '云顶', 'cloudTop', 1800, 4600, 20, function (v) { return (v | 0) + ' m'; });
      var c4 = slider(gCloud, '云的日照', 'cloudSun', 0.4, 2.0, 0.02);

      var gImg = el('div', 'group', body);
      el('h3', null, gImg, '画面');
      var i1 = slider(gImg, '泛光', 'bloom', 0, 0.14, 0.002);
      var i2 = slider(gImg, '暗角', 'vignette', 0, 0.6, 0.01);
      var i3 = slider(gImg, '颗粒', 'grain', 0, 0.04, 0.001);
      var i4 = slider(gImg, '分辨率倍率', null, 0.4, 1.0, 0.05, function (v) { return v.toFixed(2) + '×'; },
        function (v) { R.params.renderScale = v; R.resize(); });
      i4.set(R.params.renderScale);
      var i5 = slider(gImg, '渲染质量', null, 0.2, 1.0, 0.05, null,
        function (v) { R.params.quality = v; });
      i5.set(R.params.quality);

      var gView = el('div', 'group', body);
      el('h3', null, gView, '拆解视图');
      el('div', 'panelNote', gView, '章节之外的调试视图：法线、阴影、水面项、云密度。选定后影片暂停。');
      var vrow = el('div', 'presetRow', gView);
      [['关', 0], ['法线', 3], ['阴影', 19], ['反照率', 17], ['环境光', 32], ['水反射', 28], ['水体', 29], ['云密度', 25], ['天气图', 30]].forEach(function (v) {
        var b = el('button', 'btn small', vrow, v[0]);
        b.addEventListener('click', function () { app.film = false; R.s.view = v[1]; self.syncPanel(); });
      });

      var gTog = el('div', 'group', body);
      el('h3', null, gTog, '开关');
      toggle(gTog, '字幕', app.captions !== false, function (on) { self.setCaptions(on); });
      toggle(gTog, '声音', app.audioEnabled !== false, function (on) { self.setSound(on); });
      toggle(gTog, '界面', true, function (on) { document.body.classList.toggle('uiHidden', !on); });
      toggle(gTog, '自适应分辨率', R.params.adaptive !== false, function (on) { R.params.adaptive = on; });

      this.sliders = { sunElev: s1, sunAzi: s2, haze: s3, exposureKey: s4, mieTint: s5,
        wind: w1, seaLevel: w2, waveAmp: w3, foam: w4, absorption: w5,
        cloudCover: c1, cloudBase: c2, cloudTop: c3, cloudSun: c4,
        bloom: i1, vignette: i2, grain: i3 };
    },

    // the panel shows the film's current values
    syncPanel: function () {
      if (!this.sliders) return;
      var keys = ['sunElev', 'sunAzi', 'haze', 'exposureKey', 'mieTint', 'wind', 'seaLevel',
        'waveAmp', 'foam', 'absorption', 'cloudCover', 'cloudBase', 'cloudTop', 'cloudSun',
        'bloom', 'vignette', 'grain'];
      for (var i = 0; i < keys.length; i++) {
        var s = this.sliders[keys[i]];
        if (s) s.set(getPath(keys[i]));
      }
      if (this.jump) {
        var free = this.app && this.app.film === false;
        this.jump.disabled = !free;
        this.jump.style.opacity = free ? '1' : '0.45';
      }
    },

    // ---------------------------------------------------------------- camera
    /* Free camera: the film stops writing the camera, and the drag/keyboard take over
       from wherever it was. The ground is a hard floor - a free camera that can drive
       into a hill is a bug, not a feature. */
    freeze: function (R, app) {
      app.film = false;
      app.playing = false;
      var c = R.camera;
      app.free = { yaw: 0, pitch: 0, base: { pos: c.pos.slice(), fwd: c.fwd.slice() } };
      if (app.drag) { app.drag.yaw = 0; app.drag.pitch = 0; }
      if (this.jump) { this.jump.disabled = false; this.jump.style.opacity = '1'; }
      this.syncButtons();
    },

    freeLook: function (d) {
      var app = this.app, R = SS.renderer;
      if (!app.free) { this.freeze(R, app); return; }
      app.free.yaw = d.yaw; app.free.pitch = d.pitch;
    },

    freeStep: function (dt, R, app) {
      if (app.film !== false) return;
      var f = app.free || (this.freeze(R, app), app.free);
      var yaw = f.yaw * Math.PI / 180, pitch = Math.max(-80, Math.min(80, f.pitch)) * Math.PI / 180;
      var base = f.base.pos;
      // start from the frozen direction and rotate it by the drag
      var bf = f.base.fwd;
      var bYaw = Math.atan2(bf[0], bf[2]), bPitch = Math.asin(Math.max(-1, Math.min(1, bf[1])));
      var y = bYaw + yaw, p = Math.max(-1.35, Math.min(1.35, bPitch + pitch));
      var dir = [Math.cos(p) * Math.sin(y), Math.sin(p), Math.cos(p) * Math.cos(y)];
      var right = [Math.cos(y), 0, -Math.sin(y)];
      var sp = (keys['ShiftLeft'] || keys['ShiftRight'] ? 3 : 1) * 620 * dt;
      var pos = base.slice();
      if (keys['KeyW'] || keys['ArrowUp']) { pos[0] += dir[0] * sp; pos[1] += dir[1] * sp; pos[2] += dir[2] * sp; }
      if (keys['KeyS'] || keys['ArrowDown']) { pos[0] -= dir[0] * sp; pos[1] -= dir[1] * sp; pos[2] -= dir[2] * sp; }
      if (keys['KeyA'] || keys['ArrowLeft']) { pos[0] -= right[0] * sp; pos[2] -= right[2] * sp; }
      if (keys['KeyD'] || keys['ArrowRight']) { pos[0] += right[0] * sp; pos[2] += right[2] * sp; }
      if (keys['KeyQ']) pos[1] -= sp;
      if (keys['KeyE']) pos[1] += sp;
      // never below the ground, never below the sea
      var g = R.groundHeight ? R.groundHeight(pos[0], pos[2]) : 0;
      pos[1] = Math.max(pos[1], g + 12, (R.s.seaLevel || 0) + 6);
      f.base.pos = pos;
      SS.camera.setLookAt(R, pos, [pos[0] + dir[0] * 5000, pos[1] + dir[1] * 5000, pos[2] + dir[2] * 5000], [0, 1, 0]);
    },

    // ---------------------------------------------------------------- toggles
    togglePanel: function (force) {
      var p = document.getElementById('panel');
      var open = force === undefined ? !p.classList.contains('open') : force;
      p.classList.toggle('open', open);
      document.getElementById('btnPanel').classList.toggle('active', open);
      if (open) this.syncPanel();
    },
    setCaptions: function (on) {
      this.app.captions = !!on;
      var wrap = document.getElementById('captionWrap');
      if (wrap) wrap.style.opacity = on ? '' : '0';
      document.getElementById('btnCaptions').classList.toggle('active', !!on);
    },
    toggleCaptions: function () { this.setCaptions(this.app.captions === false); },
    setSound: function (on) {
      this.app.audioEnabled = !!on;
      if (SS.audio) SS.audio.setEnabled(!!on);
      var b = document.getElementById('btnSound');
      b.classList.toggle('active', !!on);
      b.title = on ? '声音：开 (M)' : '声音：关 (M)';
    },
    toggleSound: function () { this.setSound(this.app.audioEnabled === false); },
    syncButtons: function () {
      var g = document.getElementById('glyphPlay');
      if (!g) return;
      g.innerHTML = this.app.playing
        ? '<svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d="M3.1 1.8h2.1v8.4H3.1zM6.8 1.8h2.1v8.4H6.8z" fill="currentColor"/></svg>'
        : '<svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d="M2.6 1.6 L10.2 6 L2.6 10.4 Z" fill="currentColor"/></svg>';
    },
    onResize: function () {},

    tick: function (R, app) {
      if (app.film === false) this.freeStep(1 / 60, R, app);
      var ro = document.getElementById('roFps');
      if (!ro) return;
      if (R.stats.fps) ro.textContent = R.stats.fps.toFixed(0);
      document.getElementById('roRes').textContent = R.targets.w + '×' + R.targets.h;
      document.getElementById('roSun').textContent = R.s.sunElev.toFixed(1) + '°';
      document.getElementById('roWind').textContent = R.s.wind.toFixed(1) + ' m/s';
      document.getElementById('roGPU').textContent = (R.stats.ms || 0).toFixed(1) + ' ms';
      // the readouts glow when the frame is heavy
      ro.classList.toggle('hot', (R.stats.ms || 0) > 26);
    }
  };
})();
