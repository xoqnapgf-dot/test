/* Boot, clock, controls. The picture itself is timeline.js + scene.js + overlay.js. */
(function () {
  "use strict";
  var D = window.MV_DATA, TL = window.MVTimeline, OV = window.MVOverlay;
  var CLIP = D.clip, DUR = CLIP.end - CLIP.start;
  var params = new URLSearchParams(location.search);
  var EXPORT = params.get("export") === "1";

  var $ = function (id) { return document.getElementById(id); };
  var stage = $("stage"), glc = $("gl"), uic = $("ui"), audio = $("audio");
  var ui = uic.getContext("2d");
  var scene = null, fallback = null;
  var images = {};
  var layoutName = params.get("layout") || "auto";
  var quality = 1, k = 1;

  // ---------------------------------------------------------------- loading
  function loadImage(src) {
    return new Promise(function (res, rej) {
      var im = new Image();
      im.onload = function () { res(im); };
      im.onerror = function () { rej(new Error("image")); };
      im.src = src;
    });
  }
  function walkerTexture(cover, aux) {
    // walker colours + walker alpha (aux blue channel) in one RGBA texture
    var n = cover.naturalWidth, c = document.createElement("canvas");
    c.width = c.height = n;
    var g = c.getContext("2d");
    g.drawImage(aux, 0, 0, n, n);
    var a = g.getImageData(0, 0, n, n);
    g.clearRect(0, 0, n, n);
    g.drawImage(cover, 0, 0, n, n);
    var p = g.getImageData(0, 0, n, n);
    for (var i = 0; i < p.data.length; i += 4) p.data[i + 3] = a.data[i + 2];
    g.putImageData(p, 0, 0);
    return c;
  }
  function boot() {
    var I = window.MV_IMAGES;
    var fontLoads = [
      "400 20px 'MV Sans'", "500 20px 'MV Sans'", "700 40px 'MV Sans'", "600 80px 'MV Serif'"
    ].map(function (f) { return document.fonts ? document.fonts.load(f, "如果明天我会离开0:") : Promise.resolve(); });
    return Promise.all([loadImage(I.cover), loadImage(I.plate), loadImage(I.aux), loadImage(I.walker)].concat(fontLoads)).then(function (r) {
      images.cover = r[0]; images.plate = r[1]; images.aux = r[2];
      images.walker = walkerTexture(r[3], images.aux);
      try {
        scene = new window.MVScene(glc, images);
      } catch (err) {
        console.warn("WebGL unavailable, drawing a flat picture instead:", err);
        fallback = glc.getContext("2d");
      }
      OV.init(images.cover, images.aux);
    });
  }

  // ---------------------------------------------------------------- sizing
  function currentLayout() {
    if (layoutName === "landscape" || layoutName === "portrait") return layoutName;
    return innerWidth / innerHeight < 0.8 ? "portrait" : "landscape";
  }
  function resize() {
    var L = OV.LAYOUTS[currentLayout()];
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cw, ch;
    if (EXPORT) { cw = L.W; ch = L.H; dpr = 1; }
    else {
      var s = Math.min(innerWidth / L.W, innerHeight / L.H);
      cw = Math.round(L.W * s); ch = Math.round(L.H * s);
    }
    stage.style.width = cw + "px";
    stage.style.height = ch + "px";
    var bw = Math.round(cw * dpr * quality), bh = Math.round(ch * dpr * quality);
    // keep the GL buffer within a sane size
    var cap = 2560 / Math.max(bw, bh);
    if (cap < 1) { bw = Math.round(bw * cap); bh = Math.round(bh * cap); }
    glc.width = bw; glc.height = bh;
    uic.width = Math.round(cw * dpr); uic.height = Math.round(ch * dpr);
    k = bw / L.W;
    frameState.uiK = uic.width / L.W;
  }

  // ---------------------------------------------------------------- one frame
  var frameState = { uiK: 1 };
  function computeFrame(t, name) {
    var L = OV.LAYOUTS[name];
    TL.setTear(OV.tearFor(ui, name));
    var st = CLIP.start + t;
    var kick = OV.low(t);
    var e = TL.mode(st);
    var rect = TL.rect(L, e);
    var cam = TL.state(st, rect.w / rect.h, kick);
    // motion blur: where the centre of the picture was 1/48 s ago
    var tp = Math.max(0, t - 1 / 48), stp = CLIP.start + tp;
    var rectP = TL.rect(L, TL.mode(stp));
    var camP = TL.state(stp, rectP.w / rectP.h, OV.low(tp));
    var sp = TL.project(camP, cam.cx, cam.cy, TL.D0);
    var vel = [0.5 - sp[0], 0.5 - sp[1]];
    var vm = Math.hypot(vel[0], vel[1]);
    if (vm > 0.05) { vel[0] *= 0.05 / vm; vel[1] *= 0.05 / vm; }
    if (vm < 0.0015) vel = [0, 0];
    return { L: L, t: t, st: st, rect: rect, cam: cam, vel: vel };
  }

  function drawFlat(F, kk) {
    // without WebGL: the artwork cropped by the same camera, no depth effects
    var g = fallback, L = F.L, c = F.cam, r = F.rect;
    g.setTransform(kk, 0, 0, kk, 0, 0);
    g.fillStyle = "#1a110e"; g.fillRect(0, 0, L.W, L.H);
    g.save();
    g.globalAlpha = 0.35;
    g.drawImage(images.plate, -L.W * 0.2, -L.H * 0.2, L.W * 1.4, L.H * 1.4);
    g.restore();
    g.save();
    g.beginPath(); g.rect(r.x, r.y, r.w, r.h); g.clip();
    var n = images.cover.naturalWidth;
    g.drawImage(images.cover, (c.cx - c.visW / 2) * n, (c.cy - c.visH / 2) * n, c.visW * n, c.visH * n, r.x, r.y, r.w, r.h);
    g.restore();
  }

  function render(t, name) {
    var F = computeFrame(t, name);
    var L = F.L, c = F.cam, r = F.rect;
    if (scene) {
      var sun = TL.project(c, TL.SUN[0], TL.SUN[1], 0);
      var sx = r.x + sun[0] * r.w, sy = r.y + sun[1] * r.h;
      var inside = Math.min(sun[0], 1 - sun[0], sun[1], 1 - sun[1]);
      var sunVis = TL.smooth(-0.02, 0.04, inside) * (0.35 + 0.65 * c.mode);
      var drop = c.drop ? [(r.x + c.drop.x * r.w) * k, (r.y + c.drop.y * r.h) * k, c.drop.r * r.h * k, c.drop.a] : [0, 0, 1, 0];
      var rip = c.ripple ? [(r.x + c.ripple.x * r.w) * k, (r.y + c.ripple.y * r.h) * k, c.ripple.t, 1] : [0, 0, 0, 0];
      scene.render({
        w: glc.width, h: glc.height, k: k, rect: r, cam: c, vel: F.vel,
        sunPx: [sx * k, sy * k], sunVis: sunVis, dropPx: drop, ripplePx: rip,
        st: F.st, frame: Math.floor(t * 30), debug: Number(params.get("debug") || 0)
      });
    } else if (fallback) drawFlat(F, k);
    var uk = frameState.uiK;
    ui.setTransform(uk, 0, 0, uk, 0, 0);
    ui.clearRect(0, 0, L.W, L.H);
    OV.draw(ui, uk, name, t, F);
  }

  // ---------------------------------------------------------------- clock
  var clock = { anchorT: 0, anchorPerf: 0, last: -1, playing: false };
  function nowT() {
    if (!clock.playing) return audio.currentTime || 0;
    var at = audio.currentTime;
    var p = performance.now();
    if (at !== clock.last) { clock.last = at; clock.anchorT = at; clock.anchorPerf = p; }
    var t = clock.anchorT + (p - clock.anchorPerf) / 1000;
    return Math.min(t, at + 0.25);
  }

  // adaptive quality: drop the GL resolution if frames are slow
  var perf = { n: 0, acc: 0, lastP: 0 };
  function adapt(dt) {
    if (EXPORT || !clock.playing) return;
    perf.acc += dt; perf.n++;
    if (perf.n < 45) return;
    var avg = perf.acc / perf.n;
    perf.acc = 0; perf.n = 0;
    if (avg > 26 && quality > 0.5) { quality = Math.max(0.5, quality - 0.15); resize(); }
    else if (avg < 13 && quality < 1) { quality = Math.min(1, quality + 0.1); resize(); }
  }

  function loop(p) {
    var dt = perf.lastP ? p - perf.lastP : 16;
    perf.lastP = p;
    adapt(dt);
    var t = Math.min(nowT(), DUR);
    render(t, currentLayout());
    updateBar(t);
    requestAnimationFrame(loop);
  }

  // ---------------------------------------------------------------- controls
  var hideTimer = 0;
  function fmt(x) { x = Math.max(0, Math.floor(x)); return Math.floor(x / 60) + ":" + ("0" + (x % 60)).slice(-2); }
  function updateBar(t) {
    if (!scrubbing) $("scrub").value = String(Math.round(t / DUR * 1000));
    $("time").textContent = fmt(t) + " / " + fmt(DUR);
    $("play").setAttribute("aria-label", clock.playing ? "暂停" : "播放");
    $("play").dataset.state = clock.playing ? "pause" : "play";
  }
  function poke() {
    document.body.classList.remove("idle");
    clearTimeout(hideTimer);
    if (clock.playing) hideTimer = setTimeout(function () { document.body.classList.add("idle"); }, 2200);
  }
  function play() {
    if (audio.currentTime >= DUR - 0.05) audio.currentTime = 0;
    var p = audio.play();
    if (p && p.catch) p.catch(function () {});
  }
  function toggle() { if (audio.paused) play(); else audio.pause(); }
  var scrubbing = false;
  function wire() {
    audio.addEventListener("play", function () { clock.playing = true; clock.last = -1; document.body.classList.add("started"); poke(); });
    audio.addEventListener("pause", function () { clock.playing = false; poke(); });
    audio.addEventListener("ended", function () { clock.playing = false; document.body.classList.remove("idle"); });
    audio.addEventListener("seeked", function () { clock.last = -1; });
    $("start").addEventListener("click", function () { play(); });
    $("play").addEventListener("click", toggle);
    $("scrub").addEventListener("input", function () { scrubbing = true; audio.currentTime = this.value / 1000 * DUR; });
    $("scrub").addEventListener("change", function () { scrubbing = false; });
    $("layout").addEventListener("click", function () {
      layoutName = currentLayout() === "landscape" ? "portrait" : "landscape";
      resize();
    });
    $("fs").addEventListener("click", fullscreen);
    stage.addEventListener("click", function () { if (document.body.classList.contains("started")) toggle(); });
    addEventListener("mousemove", poke);
    addEventListener("touchstart", poke, { passive: true });
    addEventListener("resize", resize);
    addEventListener("keydown", function (e) {
      if (e.key === " ") { e.preventDefault(); if (!document.body.classList.contains("started")) play(); else toggle(); }
      else if (e.key === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - 5);
      else if (e.key === "ArrowRight") audio.currentTime = Math.min(DUR, audio.currentTime + 5);
      else if (e.key === "f" || e.key === "F") fullscreen();
      else if (e.key === "l" || e.key === "L") $("layout").click();
      else if (e.key === "h" || e.key === "H") document.body.classList.toggle("clean");
      poke();
    });
  }
  function fullscreen() {
    var el = document.documentElement;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  }

  // ---------------------------------------------------------------- go
  window.MVExport = {
    ready: null,
    // deterministic single frame for the video export (tools/render.mjs)
    renderAt: function (t, name) { layoutName = name; render(t, name); return true; },
    resize: function (name) { layoutName = name; resize(); },
    DUR: DUR
  };
  if (EXPORT) document.body.classList.add("export");
  resize();
  window.MVExport.ready = boot().then(function () {
    resize();
    document.body.classList.add("ready");
    if (!EXPORT) {
      wire();
      requestAnimationFrame(loop);
    }
    return true;
  }).catch(function (err) {
    $("msg").textContent = "加载失败：" + err.message;
    throw err;
  });
})();
