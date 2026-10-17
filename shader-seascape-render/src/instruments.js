/* Instruments: the panels along the edges. Every one of them shows something the
 * renderer actually produced - a baked table, the weather map the clouds read, the
 * height field itself, the histogram of the finished frame, one level of the bloom
 * pyramid. Nothing here is a redrawn illustration of the idea.
 *
 *   #instAtlas  terrain: a hypsometric map of the height field with the waterline at the
 *               film's current sea level, the camera and its view cone, the sun's azimuth
 *   #instLUT    the 256x128 sky radiance table that was baked for this sun, with where
 *               the camera is looking marked on it
 *   #instMap    the 160 km weather map the cloud march samples
 *   #instHist   luminance histogram of the frame after exposure
 *   #instBloom  the coarsest level of the bloom pyramid
 *
 * The terrain map is drawn from R.groundHeight - the same readback the rest of the page
 * uses - so it cannot disagree with the picture.
 */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});

  var SHOW = {
    instAtlas: [0, 1, 2, 4],          // 01 rays meet the height field · 02 it is the field
                                      // 03 slope reads off it · 05 the waterline floods it
    instLUT: [3, 5],                  // 04 the bake · 06 every reflection is a lookup in it
    instMap: [6],                     // 07 where the clouds are
    instHist: [7, 8],                 // 08 the grade · 09 the running frame's exposure
    instBloom: [7]                    // 08 the coarsest pyramid level
  };
  var META = {
    instAtlas: { cap: '地形 · 高度场', note: '16 km 瓦片，512² 高度场，水线随海平面移动' },
    instLUT: { cap: '大气查找表 · 256×128', note: '烘焙一次，之后每帧只采样' },
    instMap: { cap: '天气图 · 160 km', note: '云在哪里，由它决定' },
    instHist: { cap: '亮度直方图', note: '曝光之后的分布' },
    instBloom: { cap: '泛光', note: '金字塔最粗一级 · 48×27' }
  };
  var SIZE = {
    instAtlas: [256, 160],
    instLUT: [256, 128],
    instMap: [176, 110],
    instHist: [240, 74],
    instBloom: [124, 70]
  };
  var GRID_N = 64, GRID_M = 40;            // samples of the height field for the map

  var panels = {}, canvases = {}, caps = {};
  var grid = null, gridSea = null;
  var lastPaint = {}, lastGrid = -1e9;

  function build() {
    for (var id in META) {
      var el = document.getElementById(id);
      if (!el) {
        el = document.createElement('div');
        el.className = 'instrument';
        el.id = id;
        var sz = SIZE[id];
        el.innerHTML = '<div class="cap"><span>' + META[id].cap + '</span><span class="val"></span></div>' +
          '<canvas width="' + sz[0] + '" height="' + sz[1] + '"></canvas>' +
          (META[id].note ? '<div class="note">' + META[id].note + '</div>' : '');
        document.body.appendChild(el);
      }
      panels[id] = el;
      canvases[id] = el.querySelector('canvas');
      caps[id] = el.querySelector('.cap .val');
    }
  }

  // ---------------------------------------------------------------- terrain map
  function sampleGrid(R, sea) {
    var span = (R.params && R.params.terrainSize) || 16384;
    if (!grid || gridSea !== sea) {
      grid = new Float32Array(GRID_N * GRID_M);
      gridSea = sea;
      for (var j = 0; j < GRID_M; j++) {
        for (var i = 0; i < GRID_N; i++) {
          var x = (i / (GRID_N - 1) - 0.5) * span;
          var z = (j / (GRID_M - 1) - 0.5) * span;
          grid[j * GRID_N + i] = R.groundHeight(x, z);
        }
      }
    }
    return grid;
  }

  function ramp(t) {
    // a hypsometric ramp: sea floor, then shore, grass, rock, snow
    var c = [
      [0.02, 0.06, 0.13], [0.05, 0.16, 0.28], [0.10, 0.31, 0.42],
      [0.62, 0.60, 0.48], [0.34, 0.44, 0.26], [0.30, 0.32, 0.28], [0.86, 0.88, 0.90]
    ];
    var f = Math.max(0, Math.min(0.999, t)) * (c.length - 1);
    var i = Math.floor(f), k = f - i;
    var a = c[i], b = c[i + 1] || c[i];
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  }

  function paintAtlas(R) {
    var cv = canvases.instAtlas; if (!cv) return;
    var g2d = cv.getContext('2d');
    var w = cv.width, h = cv.height;
    var sea = R.s.seaLevel || 0;
    var data = sampleGrid(R, 0);                    // the field itself, at sea level 0
    var img = g2d.createImageData(w, h);
    var lo = -400, hi = 900;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var gi = Math.min(GRID_N - 1, Math.round(x / (w - 1) * (GRID_N - 1)));
        var gj = Math.min(GRID_M - 1, Math.round((1 - y / (h - 1)) * (GRID_M - 1)));
        var hgt = data[gj * GRID_N + gi];
        var col;
        if (hgt <= sea) {
          var d = Math.min(1, (sea - hgt) / 500);
          col = [0.05 + 0.02 * (1 - d), 0.16 + 0.06 * (1 - d), 0.30 + 0.10 * (1 - d)];
        } else {
          col = ramp(Math.min(1, (hgt - sea) / (hi - lo)) * 0.55 + 0.45 * Math.min(1, (hgt - sea) / 900));
        }
        var o = (y * w + x) * 4;
        img.data[o] = col[0] * 255; img.data[o + 1] = col[1] * 255; img.data[o + 2] = col[2] * 255; img.data[o + 3] = 255;
      }
    }
    g2d.putImageData(img, 0, 0);
    // the waterline, drawn once more on top so it stays crisp
    g2d.strokeStyle = 'rgba(127,216,232,0.55)';
    g2d.lineWidth = 1;
    for (var x2 = 0; x2 < w; x2++) {
      var gx = Math.min(GRID_N - 1, Math.round(x2 / (w - 1) * (GRID_N - 1)));
      for (var v = 0; v < 4; v++) {
        var gj2 = Math.round(v / 4 * (GRID_M - 1));
        if (gj2 < 1 || gj2 >= GRID_M - 1) continue;
        var a = data[gj2 * GRID_N + gx] - sea, b2 = data[(gj2 + 1) * GRID_N + gx] - sea;
        if (a === 0 || (a > 0) !== (b2 > 0)) {
          var t = a / (a - b2);
          var yy = (1 - (gj2 + t) / (GRID_M - 1)) * (h - 1);
          g2d.beginPath(); g2d.moveTo(x2, yy - 0.5); g2d.lineTo(x2, yy + 0.5); g2d.stroke();
        }
      }
    }
    // the camera, its view cone and the sun's azimuth
    var span = (R.params && R.params.terrainSize) || 16384;
    function toMap(x, z) { return [(x / span + 0.5) * w, (1 - (z / span + 0.5)) * h]; }
    var c = R.camera, p = toMap(c.pos[0], c.pos[2]);
    var f = c.fwd;
    g2d.strokeStyle = 'rgba(255,192,120,0.75)';
    g2d.beginPath();
    g2d.moveTo(p[0], p[1]);
    g2d.lineTo(p[0] + f[0] * w * 0.22, p[1] - f[2] * h * 0.30);
    g2d.stroke();
    var fov = (c.fov || 50) * Math.PI / 180;
    var azi = Math.atan2(f[0], f[2]);
    for (var s2 = -1; s2 <= 1; s2 += 2) {
      var aa = azi + s2 * fov * 0.5;
      g2d.strokeStyle = 'rgba(255,192,120,0.28)';
      g2d.beginPath(); g2d.moveTo(p[0], p[1]);
      g2d.lineTo(p[0] + Math.sin(aa) * w * 0.30, p[1] - Math.cos(aa) * h * 0.42);
      g2d.stroke();
    }
    g2d.fillStyle = 'rgba(255,192,120,0.95)';
    g2d.beginPath(); g2d.arc(p[0], p[1], 2.6, 0, 6.2832); g2d.fill();
    var sunAzi = (R.s.sunAzi || 0) * Math.PI / 180;
    g2d.strokeStyle = 'rgba(255,214,165,0.5)';
    g2d.setLineDash([4, 3]);
    g2d.beginPath(); g2d.moveTo(p[0], p[1]);
    g2d.lineTo(p[0] + Math.sin(sunAzi) * w * 0.26, p[1] - Math.cos(sunAzi) * h * 0.36);
    g2d.stroke();
    g2d.setLineDash([]);
    g2d.font = '9px "JetBrains Mono", monospace';
    g2d.fillStyle = 'rgba(243,238,229,0.55)';
    g2d.fillText('4 km / 格', 6, h - 6);
  }

  // ---------------------------------------------------------------- others
  /* The weather map and the bloom level are debug textures: one is a dense noise field on a
     green-yellow ramp, the other a bright pyramid level. Shown raw they break the film's
     palette open. Both are mapped through this: a cool-to-warm duotone in the film's own
     colours, with the brightest values going to warm white. */
  function duotone(r, g, b, gain) {
    var l = Math.max(r, Math.max(g, b)) * (gain || 1);
    l = Math.pow(Math.max(0, Math.min(1, l)), 0.85);
    var lo = [0.05, 0.09, 0.15], mid = [0.42, 0.40, 0.40], hi = [0.99, 0.87, 0.66];
    var c = l < 0.55
      ? [lo[0] + (mid[0] - lo[0]) * (l / 0.55), lo[1] + (mid[1] - lo[1]) * (l / 0.55), lo[2] + (mid[2] - lo[2]) * (l / 0.55)]
      : [mid[0] + (hi[0] - mid[0]) * ((l - 0.55) / 0.45), mid[1] + (hi[1] - mid[1]) * ((l - 0.55) / 0.45),
         mid[2] + (hi[2] - mid[2]) * ((l - 0.55) / 0.45)];
    return c;
  }
  function paintMap(R) {
    var cv = canvases.instMap; if (!cv || !R.gen.weather) return;
    try { R.textureToCanvas(R.gen.weather, cv, 0, 1.0, function (r, g, b) { return duotone(r, g, b, 1.55); }); } catch (e) { return; }
    var g2d = cv.getContext('2d');
    var w = cv.width, h = cv.height;
    var tile = R.s.weatherTile || 160000;
    var u = ((R.camera.pos[0] / tile) % 1 + 1) % 1;
    var v = ((R.camera.pos[2] / tile) % 1 + 1) % 1;
    g2d.strokeStyle = 'rgba(255,192,120,0.9)';
    g2d.lineWidth = 1;
    g2d.beginPath(); g2d.arc(u * w, (1 - v) * h, 6, 0, 6.2832); g2d.stroke();
    g2d.beginPath(); g2d.moveTo(u * w - 10, (1 - v) * h); g2d.lineTo(u * w - 7, (1 - v) * h); g2d.stroke();
    g2d.beginPath(); g2d.moveTo(u * w + 7, (1 - v) * h); g2d.lineTo(u * w + 10, (1 - v) * h); g2d.stroke();
    g2d.beginPath(); g2d.moveTo(u * w, (1 - v) * h - 10); g2d.lineTo(u * w, (1 - v) * h - 7); g2d.stroke();
    g2d.beginPath(); g2d.moveTo(u * w, (1 - v) * h + 7); g2d.lineTo(u * w, (1 - v) * h + 10); g2d.stroke();
    g2d.fillStyle = 'rgba(243,238,229,0.6)';
    g2d.font = '9px "JetBrains Mono", monospace';
    g2d.fillText('160 km', 6, h - 6);
  }

  function paintLut(R) {
    var cv = canvases.instLUT; if (!cv || !R.gen.sky) return;
    // the table holds radiance: show it with a gain so the horizon band does not clip
    try { R.textureToCanvas(R.gen.sky, cv, 0, 0.30); } catch (e) { return; }
    var g2d = cv.getContext('2d');
    var w = cv.width, h = cv.height;
    // where the camera is looking, in the table's own coordinates
    var f = R.camera.fwd;
    var el = Math.asin(Math.max(-1, Math.min(1, f[1])));
    var camAzi = Math.atan2(f[0], f[2]);
    var relAzi = camAzi - (R.s.sunAzi || 0) * Math.PI / 180;
    var u = ((relAzi / (2 * Math.PI) + 0.5) % 1 + 1) % 1;
    var v = Math.pow(Math.max(0, (el + 0.06) / (Math.PI / 2 + 0.06)), 1 / 2.2);
    var px = u * w, py = (1 - v) * h;
    g2d.strokeStyle = 'rgba(255,255,255,0.85)';
    g2d.lineWidth = 1;
    g2d.beginPath(); g2d.arc(px, py, 5, 0, 6.2832); g2d.stroke();
    g2d.beginPath(); g2d.moveTo(px - 8, py); g2d.lineTo(px - 6, py); g2d.stroke();
    g2d.beginPath(); g2d.moveTo(px + 6, py); g2d.lineTo(px + 8, py); g2d.stroke();
    // the sun's own elevation
    var sv = Math.pow(Math.max(0, ((R.s.sunElev || 0) * Math.PI / 180 + 0.06) / (Math.PI / 2 + 0.06)), 1 / 2.2);
    g2d.strokeStyle = 'rgba(255,192,120,0.8)';
    g2d.setLineDash([3, 3]);
    g2d.beginPath(); g2d.moveTo(w * 0.5, h); g2d.lineTo(w * 0.5, (1 - sv) * h); g2d.stroke();
    g2d.setLineDash([]);
    g2d.fillStyle = 'rgba(255,192,120,0.9)';
    g2d.font = '9px "JetBrains Mono", monospace';
    g2d.fillText('太阳', w * 0.5 + 4, (1 - sv) * h - 3);
  }

  function paintHist(R) {
    var cv = canvases.instHist; if (!cv) return;
    var g2d = cv.getContext('2d');
    var w = cv.width, h = cv.height;
    var bins = 48, hist = null;
    try { hist = R.histogram(bins, 'display'); } catch (e) { hist = null; }
    if (hist && hist.hist) hist = hist.hist;
    g2d.clearRect(0, 0, w, h);
    g2d.fillStyle = 'rgba(255,255,255,0.03)';
    g2d.fillRect(0, 0, w, h);
    if (!hist) return;
    var max = 0;
    for (var i = 0; i < hist.length; i++) max = Math.max(max, hist[i]);
    if (max <= 0) max = 1;
    var bw = w / bins;
    for (var b = 0; b < bins; b++) {
      var t = Math.pow(hist[b] / max, 0.42);
      var bh = t * (h - 14);
      var shade = 150 + 105 * (b / bins);
      g2d.fillStyle = 'rgba(' + Math.round(shade) + ',' + Math.round(shade * 0.72 + 30) + ',' + Math.round(shade * 0.44 + 20) + ',0.85)';
      g2d.fillRect(b * bw + 0.5, h - 13 - bh, bw - 1, bh);
    }
    g2d.strokeStyle = 'rgba(243,238,229,0.22)';
    g2d.beginPath(); g2d.moveTo(0, h - 12.5); g2d.lineTo(w, h - 12.5); g2d.stroke();
    // the CJK in this label needs the CJK family in the font stack (a 2D canvas draws tofu
    // for a glyph the listed families do not have)
    g2d.font = '9px "JetBrains Mono", "Noto Sans SC", monospace';
    // the axis: display luminance, so the labels say what the bins mean
    g2d.fillStyle = 'rgba(243,238,229,0.5)';
    g2d.textAlign = 'left'; g2d.fillText('0', 2, h - 2);
    g2d.textAlign = 'center'; g2d.fillText('中灰', w * 0.5, h - 2);
    g2d.textAlign = 'right'; g2d.fillText('白', w - 2, h - 2);
    g2d.textAlign = 'left';
  }

  var bloomScratch = null;
  function paintBloom(R) {
    var cv = canvases.instBloom; if (!cv) return;
    var T = R.targets && R.targets.bloomUp;
    if (!T || !T.length) return;
    /* Show the coarsest level that still has a few pixels across, scaled up to fill the
       panel. Copying the smallest level (16x9) straight into a 120x68 canvas put a chip in
       the corner and left the rest of the panel empty - the copy writes one canvas pixel per
       texel and does not scale. */
    var pick = T[0];
    for (var i = 0; i < T.length; i++) { if ((T[i].w || 0) >= 48) pick = T[i]; }
    if (!bloomScratch) bloomScratch = document.createElement('canvas');
    if (bloomScratch.width !== pick.w || bloomScratch.height !== pick.h) {
      bloomScratch.width = pick.w; bloomScratch.height = pick.h;
    }
    try { R.textureToCanvas(pick, bloomScratch, 0, 1.0, function (r, g, b) { return duotone(r, g, b, 3.6); }); } catch (e) { return; }
    var g2d = cv.getContext('2d');
    g2d.imageSmoothingEnabled = true;
    g2d.clearRect(0, 0, cv.width, cv.height);
    g2d.drawImage(bloomScratch, 0, 0, pick.w, pick.h, 0, 0, cv.width, cv.height);
    g2d.textAlign = 'left';
  }

  function setCaps(R) {
    if (caps.instAtlas) caps.instAtlas.textContent = (R.s.seaLevel || 0).toFixed(0) + ' m';
    if (panels.instAtlas) {
      var noteEl = panels.instAtlas.querySelector('.note');
      var tres = (R.buildInfo && R.buildInfo.terrainRes) || (R.params && R.params.terrainRes) || 512;
      if (noteEl) noteEl.textContent = '16 km 瓦片，' + tres + '² 高度场，水线随海平面移动';
    }
    if (caps.instLUT) caps.instLUT.textContent = R.s.sunElev.toFixed(1) + '°';
    if (caps.instMap) caps.instMap.textContent = R.s.cloudCover.toFixed(2);
    if (caps.instHist) caps.instHist.textContent = (R.lastExposure || 0).toFixed(2) + '×';
    // the bloom panel is a picture of the bloom strength, so the readout is that strength
    if (caps.instBloom) caps.instBloom.textContent = (R.s.bloom || 0).toFixed(3);
  }

  SS.instruments = {
    SHOW: SHOW,                       // chapter -> panel table, for the audit tool
    enter: function () {
      build();
      return true;
    },
    setChapter: function (ch, u, R, app) {
      var changed = this._ch !== ch;
      this._ch = ch;
      for (var id in panels) panels[id].classList.toggle('on', (SHOW[id] || []).indexOf(ch) >= 0);
      /* The painters are throttled (the atlas rebuilds its grid, the LUT and the map read
         textures back), which is right while the film plays - but a seek is a hard cut, and
         without this the panel a chapter opens with stays empty for up to 0.7 s after a jump
         or a scrub. Forget the throttle on a chapter change so the panel is there at once. */
      if (changed) {
        lastPaint = {};
        if (R && app && SS.instruments) this.tick(R, app);
      }
      return true;
    },
    tick: function (R, app) {
      if (!R || !R.camera) return false;
      var t = app && app.time !== undefined ? app.time : (R.s.time || 0);
      var ch = 0;
      if (SS.timeline) ch = SS.timeline.progress(t).index;
      setCaps(R);
      // the terrain map is expensive: rebuild the grid at most every 0.8 s, and only
      // while the panel is on screen
      if (panels.instAtlas.classList.contains('on')) {
        if (t - (lastPaint.atlas || -9) > 0.8 || lastGrid !== R.s.seaLevel) {
          lastPaint.atlas = t; lastGrid = R.s.seaLevel;
          try { paintAtlas(R); } catch (e) { }
        }
      }
      if (panels.instLUT.classList.contains('on') && t - (lastPaint.lut || -9) > 0.35) {
        lastPaint.lut = t; try { paintLut(R); } catch (e) { }
      }
      if (panels.instMap.classList.contains('on') && t - (lastPaint.map || -9) > 0.6) {
        lastPaint.map = t; try { paintMap(R); } catch (e) { }
      }
      if (panels.instHist.classList.contains('on') && t - (lastPaint.hist || -9) > 0.5) {
        lastPaint.hist = t; try { paintHist(R); } catch (e) { }
      }
      if (panels.instBloom.classList.contains('on') && t - (lastPaint.bloom || -9) > 0.7) {
        lastPaint.bloom = t; try { paintBloom(R); } catch (e) { }
      }
      return true;
    },
    clear: function () {
      for (var id in panels) panels[id].classList.remove('on');
      return true;
    }
  };
})();
