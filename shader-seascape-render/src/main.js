/* Boot, the main loop, and the probe hooks used by tools/shot.mjs for verification. */
(function () {
  'use strict';
  var SS = window.SS;

  function qs(name, dflt) {
    var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(location.search);
    return m ? decodeURIComponent(m[1]) : dflt;
  }
  function num(name, dflt) { var v = qs(name, null); return v === null ? dflt : parseFloat(v); }

  var canvas = document.getElementById('stage');
  var bootEl = document.getElementById('boot');
  var bootMsg = document.getElementById('bootMsg');
  var bootFill = document.getElementById('bootFill');
  var failEl = document.getElementById('fail');
  var failMsg = document.getElementById('failMsg');

  var probeMode = qs('probe', '0') === '1';
  var loopMode = qs('loop', '1') === '1';   // probe runs render on demand only

  /* What kind of renderer is this? The terrain bake is the page's one heavy startup cost -
     2048^2 with eight erosion passes - and it happens before the first frame, so on a
     software rasteriser (SwiftShader, llvmpipe, a VM with no GPU) the visitor would sit on
     the boot screen for minutes. Ask the driver once, before the renderer is built, and pick
     a bake the device can afford: a GPU gets the full 2048, software gets 768 and a smaller
     internal scale. Both can be overridden from the query string (?terrainRes=…), which is
     how the capture tools pin their resolution. */
  function deviceTier() {
    try {
      var c = document.createElement('canvas');
      var g = c.getContext('webgl2') || c.getContext('webgl');
      if (!g) return 'none';
      var ext = g.getExtension('WEBGL_debug_renderer_info');
      var name = ext ? String(g.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : String(g.getParameter(g.RENDERER));
      var lose = g.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
      if (/swiftshader|llvmpipe|softwarerasterizer|software rasterizer|mesa offscreen|basic render/i.test(name)) {
        return 'software';
      }
      return 'gpu';
    } catch (e) { return 'unknown'; }
  }
  var tier = deviceTier();
  window.__tier = tier;   // so a verification run can see which branch the page took
  var quality = num('quality', probeMode ? 0.35 : (tier === 'software' ? 0.5 : (window.devicePixelRatio > 1.5 ? 0.7 : 0.85)));
  var terrainRes = num('terrainRes', probeMode ? 768 : (tier === 'software' ? 768 : 2048));
  var renderScale = num('scale', probeMode ? 1.0 : 1.0);

  var opts = {
    terrainRes: terrainRes,
    quality: quality,
    renderScale: renderScale,
    // the adaptive controller only runs in the live page; a capture run pins the scale so
    // two runs of the same tool cost the same and look the same
    adaptive: num('adaptive', probeMode ? 0 : 1) === 1,
    /* A software rasteriser (SwiftShader, llvmpipe, a VM without a GPU) pays tens of seconds
       for one full-resolution frame of this shader, so it starts low and is allowed to go
       lower. Everything about this is visible in the panel's ms readout and the boot note. */
    startScale: num('startScale', tier === 'software' ? 0.3 : 1.0),
    minScale: num('minScale', tier === 'software' ? 0.18 : 0.45),
    targetMs: num('targetMs', tier === 'software' ? 140 : 16.7)
  };
  // Erosion passes. The relaxation is written per-pass in slope space, so the same count
  // gives the same landform at every tile resolution; scaling the count with the
  // resolution (which this line used to do) quietly flattened the mountains at 2048 and
  // left them jagged at 512. Probe runs may pass ?erode=N to shorten a capture.
  opts.erodeIterations = num('erode', opts.erodeIterations);
  // The landform parameters are baked once at load, so being able to set them from the URL
  // is the only practical way to work on the terrain without editing the file per test.
  // Only keys that are actually present may be written: assigning num(k, undefined) put an
  // explicit undefined into opts for every absent key, which then overrode the renderer's
  // defaults and silently zeroed the relief, the ridge gain and the erosion count.
  var BAKE = ['relief', 'ridgeGain', 'ridgeMix', 'massifBias', 'plainH', 'seaDepth', 'cliff',
    'islandH', 'sink', 'talus', 'talusAmount', 'blur', 'carve', 'aoStrength', 'seed'];
  for (var bi = 0; bi < BAKE.length; bi++) {
    var bv = qs(BAKE[bi], null);
    if (bv !== null) opts[BAKE[bi]] = parseFloat(bv);
  }

  var renderer;
  try {
    renderer = SS.Renderer(canvas, opts);
  } catch (e) {
    renderer = { error: (e && e.message) || String(e) };
  }

  if (!renderer || renderer.failed || renderer.error) {
    bootEl.classList.add('done');
    failEl.hidden = false;
    if (renderer && renderer.error) failMsg.textContent = '着色器编译或初始化失败：' + renderer.error;
    window.__probe = { ready: false, error: (renderer && renderer.error) || 'no-webgl2' };
    return;
  }

  SS.renderer = renderer;
  var R = renderer;

  // ---------------------------------------------------------------- state
  var app = SS.app = {
    playing: true,
    time: 0,
    speed: 1,
    captions: true,
    ui: true,
    audioEnabled: true,
    chapter: 0
  };

  function set(path, value) {
    // tiny deep set: "s.sunElev": 3
    if (path.indexOf('.') < 0) { R.s[path] = value; return; }
    var head = path.split('.')[0];
    var rest = path.slice(head.length + 1);
    var target = R.s;
    if (head === 'camera') target = R.camera;
    else if (head === 'params') target = R.params;
    if (rest.indexOf('.') < 0) { target[rest] = value; return; }
    var parts = rest.split('.');
    for (var i = 0; i < parts.length - 1; i++) { target = target[parts[i]] = target[parts[i]] || {}; }
    target[parts[parts.length - 1]] = value;
  }

  // ---------------------------------------------------------------- loop
  var last = 0, fpsAcc = 0, fpsN = 0, fpsShown = 0;
  var lastWall = 0;
  function frame(now) {
    if (!last) last = now;
    /* Elapsed real time, measured off the monotonic clock rather than the requestAnimationFrame
       timestamp: a frame timestamp reports when the frame was scheduled, not when the previous
       one finished, so on a renderer that blocks for seconds the rAF deltas say "16 ms" and the
       film creeps. Capped at 2 s so a tab that was in the background does not land the viewer in
       a random chapter on the way back. */
    var wallNow = performance.now();
    if (!lastWall) lastWall = wallNow;
    var wall = (wallNow - lastWall) / 1000;
    lastWall = wallNow;
    var dt = Math.min(0.05, wall);           // keeps a shader step from lurching
    last = now;
    var t0 = performance.now();
    /* The film's clock is wall time. Driving it with the clamped render dt meant a device that
       draws one frame every several seconds advanced the film a few hundredths of a second per
       frame: the picture sat there looking frozen while the soundtrack (which runs on the audio
       clock) ran away from it. Now a slow device drops frames the way a video player does and
       keeps the clock - and keeps sound and picture together. The render itself still gets the
       clamped dt, so the wave motion stays stable. */
    var filmDt = Math.min(2.0, wall);
    if (app.playing && SS.timeline) SS.timeline.update(filmDt, R, app);
    else R.s.time += dt * (app.playing ? 1 : 0);
    R.render(dt);
    var ms = performance.now() - t0;
    R.adapt(ms);
    R.stats.ms = ms;
    fpsAcc += dt; fpsN++;
    if (fpsAcc > 0.5) { fpsShown = fpsN / fpsAcc; fpsAcc = 0; fpsN = 0; R.stats.fps = fpsShown; }
    if (SS.ui) SS.ui.tick(R, app);
    if (SS.timeline && SS.timeline.tickDom) SS.timeline.tickDom(R, app);
    /* The soundtrack is a continuous bed whose mix follows the chapter and the renderer's own
       numbers, so it cannot drift out of sync; the one thing it times off a delta is its swell
       rate, and that gets the film's own advance so a device rendering slowly hears the swells
       at the pace it is watching at, not at a different one. */
    if (SS.audio) SS.audio.tick(filmDt, R, app);
    requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------------- resize
  function onResize() {
    R.resize();
    if (SS.ui && SS.ui.onResize) SS.ui.onResize();
    if (SS.overlays && SS.overlays.resize) SS.overlays.resize();
  }
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', function () { setTimeout(onResize, 200); });
  R.resize();

  // ---------------------------------------------------------------- boot
  if (window.console && console.log) console.log('[boot] gen done in ' + R.buildInfo.genMs + ' ms');
  bootFill.style.width = '45%';
  bootMsg.textContent = '地形高度场与噪声图集已生成（' + R.buildInfo.genMs + ' ms）' +
    (tier === 'software' ? ' · 检测到软件渲染器，已用 ' + R.buildInfo.terrainRes + '² 高度场' : '');
  setTimeout(function () {
    bootFill.style.width = '80%';
    bootMsg.textContent = '烘焙大气查找表…';
    var bt = performance.now();
    R.render(0, true);
    if (window.console && console.log) console.log('[boot] first frame ' + Math.round(performance.now() - bt) + ' ms at ' + R.targets.w + 'x' + R.targets.h);
    bootFill.style.width = '100%';
    bootMsg.textContent = '就绪 · ' + R.buildInfo.renderer;
    setTimeout(function () {
      bootEl.classList.add('done');
      document.body.classList.remove('booting');
      if (SS.timeline) SS.timeline.enter(0, R, app);
      if (SS.ui) SS.ui.init(R, app);
      if (SS.audio) SS.audio.init(R, app);
      if (loopMode) requestAnimationFrame(frame);
      else window.__probeLooped = true;
      // ready means "the renderer exists"; booted means "the layers are up and the film
      // has been entered". Tools must wait for booted, or the boot's own enter() lands on
      // top of whatever they set up.
      window.__probe.booted = true;
    }, 240);
  }, 30);

  // ---------------------------------------------------------------- probe API (verification only)
  window.__probe = {
    ready: true,
    renderer: R,
    app: app,
    info: R.buildInfo,
    set: set,
    state: function () { return R.s; },
    renderAt: function (t, dt) { R.s.time = t; R.render(dt || 0); return true; },
    step: function (dt) { R.s.time += (dt || 1 / 60); R.render(dt || 1 / 60); },
    capture: function () { return R.capturePNG(); },
    display: function (fracs) {          // [[x,y], ...] as fractions of the canvas
      var pts = fracs.map(function (f) { return [f[0] * R.canvas.width, f[1] * R.canvas.height]; });
      return R.canvasSample(pts);
    },
    resize: function (w, h) {
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      R.resize(); R.render(0, true);
    },
    histogram: function (bins) { return R.histogram(bins || 64); },
    sample: function (pts) {                       // [[x,y], ...] in render-target pixels
      var out = [];
      for (var i = 0; i < pts.length; i++) {
        var c = R.sampleScene(pts[i][0], pts[i][1]);
        out.push({ xy: pts[i], rgb: [c[0], c[1], c[2]],
          luma: 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] });
      }
      return out;
    },
    target: function () { return { w: R.targets.w, h: R.targets.h }; },
    // Read a generated texture back as floats. 8-bit dumps of the HDR lookup tables
    // read as pure black (anything below 1/255) and tell you nothing about the bake.
    texFloats: function (kind, step) {
      var map = { terrain: R.gen.terrain, heightRaw: R.gen.heightRaw, weather: R.gen.weather,
        blueNoise: R.gen.blueNoise, sky: R.gen.sky, sunTrans: R.gen.sunTrans };
      var src = map[kind];
      if (!src) return null;
      var w = (src.w || src.__w), h = (src.h || src.__h);
      var api = R.api;
      var t = R.floatReadTarget || (R.floatReadTarget = api.target(w, h, api.raw.RGBA16F, api.raw.HALF_FLOAT, api.raw.NEAREST));
      api.bind(t);
      R.programs.copy.use().setTex('uSrc', src.tex || src, 0).set('uRes', [w, h]);
      api.drawQuad();
      var out = new Float32Array(w * h * 4);
      var ok = api.readFloats(0, 0, w, h, out);
      var st = step || 1, rows = [];
      for (var y = h - 1; y >= 0; y -= st) {
        var row = [];
        for (var x = 0; x < w; x += st) {
          var i = (y * w + x) * 4;
          row.push([+out[i].toFixed(4), +out[i + 1].toFixed(4), +out[i + 2].toFixed(4)]);
        }
        rows.push(row);
      }
      return { w: w, h: h, ok: ok, rows: rows };
    },
    // Vertical profile of a render target, read back as floats. This is how a banding
    // artifact is pinned on the pass that produced it: read the scene target and the
    // canvas at the same rows and see which one already has the stripes.
    hdrRows: function (kind, h0, h1, cols) {
      var T = (kind === 'bloom') ? R.targets.bloomUp[0] : R.targets.scene;
      var api = R.api;
      api.bind(T);
      var out = new Float32Array(T.w * T.h * 4);
      api.readFloats(0, 0, T.w, T.h, out);
      var rows = [];
      for (var y = h0; y <= h1; y++) {
        var s = 0, n = 0;
        for (var x = 0; x < T.w; x += (cols || 8)) { var i = (y * T.w + x) * 4; s += out[i] + out[i + 1] + out[i + 2]; n++; }
        rows.push(+(s / n / 3).toFixed(5));
      }
      return { w: T.w, h: T.h, rows: rows };
    },
    // The scene render target as a PNG, before bloom/tonemap/grade. Splitting the
    // composite apart is the only way to tell an artifact in the scene from one in post.
    targetPNG: function (kind, maxSize) {
      var T = (kind === 'bloom') ? R.targets.bloomUp[0] : R.targets.scene;
      var w = T.w, h = T.h;
      var full = document.createElement('canvas');
      full.width = w; full.height = h;
      R.textureToCanvas(T, full, 0, kind === 'scene' && arguments[2] !== undefined ? arguments[2] : (kind === 'scene' ? 6.0 : 1.0));
      var c2 = document.createElement('canvas');
      var scale = Math.min(1, (maxSize || 640) / Math.max(w, h));
      c2.width = Math.round(w * scale); c2.height = Math.round(h * scale);
      c2.getContext('2d').drawImage(full, 0, 0, c2.width, c2.height);
      return c2.toDataURL('image/png');
    },
    // Which state keys the uniform table expects but R.s does not define. A missing key
    // is skipped silently in setSceneUniforms and the uniform keeps its default (0), which
    // is exactly how the cloud layer went invisible: uWeatherTile was 0, the weather
    // sample divided by it, and every cloud evaluated to zero density.
    missingUniforms: function () {
      var miss = [];
      for (var i = 0; i < R.uniformTable.length; i++) {
        var k = R.uniformTable[i][1];
        if (R.s[k] === undefined || R.s[k] === null) miss.push(R.uniformTable[i][0] + ' <- ' + k);
      }
      return miss;
    },
    ground: function (x, z) { return R.groundHeight(x, z); },
    place: function (o) {
      // put the camera at (x,z) at a given height above the ground and aim it
      var g = R.groundHeight(o.x, o.z);
      var pos = [o.x, g + (o.up === undefined ? 12 : o.up), o.z];
      var tgt = o.at ? [o.at[0], o.at[1], o.at[2]] : [o.x, g, o.z - 1];
      SS.camera.setLookAt(R, pos, tgt, [0, 1, 0]);
      if (o.fov) R.camera.fov = o.fov;
      return { pos: pos, ground: g, fwd: R.camera.fwd };
    },
    look: function (pos, target, fov) {
      SS.camera.setLookAt(R, pos, target, [0, 1, 0]);
      if (fov) R.camera.fov = fov;
      return { pos: R.camera.pos, fwd: R.camera.fwd, fov: R.camera.fov };
    },
    terrainStats: function (n) { return R.terrainStats(n || 128); },
    texturePNG: function (kind, maxSize) {
      var map = { terrain: R.gen.terrain, heightRaw: R.gen.heightRaw, weather: R.gen.weather,
        blueNoise: R.gen.blueNoise, sky: R.gen.sky, sunTrans: R.gen.sunTrans };
      var src = map[kind] || R.gen.heightRaw;
      if (!src) return null;
      var w = src.w || src.__w, h = src.h || src.__h;
      if (!w || !h) return null;
      var c2 = document.createElement('canvas');
      var scale = Math.min(1, (maxSize || 512) / Math.max(w, h));
      c2.width = Math.round(w * scale); c2.height = Math.round(h * scale);
      // draw at full size into an offscreen canvas first
      var full = document.createElement('canvas');
      full.width = w; full.height = h;
      R.textureToCanvas(src, full);
      var ctx = c2.getContext('2d');
      ctx.drawImage(full, 0, 0, c2.width, c2.height);
      return c2.toDataURL('image/png');
    },
    detach: function () { return SS.timeline ? SS.timeline.detach(R, app) : true; },
    attach: function () { app.film = true; return true; },
    setStages: function (arr) { R.s.stages = arr; },
    setView: function (v) { R.s.view = v; },
    // the timeline/animation layers can be driven from a probe too
    chapter: function (i, t) {
      app.playing = false;
      if (SS.timeline) {
        var c = SS.timeline.chapters[i];
        SS.timeline.enter(c ? c.t0 + 0.01 : 0, R, app);
        if (t !== undefined) SS.timeline.seekTo(t, R, app);
      }
    },
    audioCheck: function (seconds, wind) {
      if (!SS.audio || !SS.audio.renderOffline) return Promise.reject(new Error('no audio'));
      var seq = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (i) { return 440 * Math.pow(2, (i - 4) / 12); });
      return SS.audio.renderOffline(seconds || 30, wind, seq);
    },
    frameAt: function (t) {
      app.playing = false;
      if (SS.timeline) {
        SS.timeline.seekTo(t, R, app);
      }
      R.s.time = t;
      R.render(0);
      // the DOM layers are painted from what the renderer just produced, so they have to
      // be refreshed after the frame, not only when the chapter changes
      if (SS.ui) SS.ui.tick(R, app);
      if (SS.overlays) SS.overlays.tick(R, app);
      if (SS.instruments) SS.instruments.tick(R, app);
      return true;
    },
    // Render frames at the current time until the auto-exposure stops moving. A capture
    // tool that seeks to a stamp and renders two frames shows the wrong brightness: the
    // meter is still catching up to a scene it has never seen. This is what the tools use
    // instead of guessing a frame count.
    converge: function (maxFrames, dt) {
      var mx = maxFrames || 64, d = dt === undefined ? 0.1 : dt;
      var prev = R.lastExposure || 0, i = 0, e = prev;
      for (; i < mx; i++) {
        R.render(d);
        e = R.lastExposure || 0;
        if (i > 3 && prev > 0 && e > 0 && Math.abs(Math.log2(e / prev)) < 0.004) { i++; break; }
        prev = e;
      }
      if (SS.instruments) SS.instruments.tick(R, app);
      if (SS.overlays) SS.overlays.tick(R, app);
      return { frames: i, exposure: R.lastExposure };
    },

    // render n frames at the current time: this is what converges the auto-exposure
    // without advancing the animation
    settle: function (n, dt) {
      var last = null;
      for (var i = 0; i < (n || 4); i++) { R.render(dt === undefined ? 1 / 60 : dt); }
      if (SS.instruments) SS.instruments.tick(R, app);
      if (SS.overlays) SS.overlays.tick(R, app);
      return R.lastExposure;
    }
  };
})();
