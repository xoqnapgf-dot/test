/* Motion graphics: the film's continuous graphic layer.
 *
 * One canvas (see index.html) that sits above the picture and below every panel, so a
 * graphic can run full bleed across the frame and still never draw over a card or an
 * instrument: they paint on top of it. Everything is redrawn from the renderer's live
 * state, and nothing is a redrawn illustration of the idea -
 *
 *   ch01  射线   the ray fan at true scale, and the internal framebuffer's own pixel grid
 *   ch02  地形  the real height field: a silhouette panorama around the camera, and the
 *                march along the view ray replayed with the shader's own step rule
 *   ch03  光照  the material ramps the shader actually tests, with the field's own
 *                (height, slope) cloud dropped onto them
 *   ch04  大气  a column of the baked sky LUT, plus the baked sun-transmittance table
 *   ch05  海面  the water's absorption against depth, and the hypsometric curve with the
 *                film's waterline on it
 *   ch06  反射  the Fresnel curve, the band this frame's rays occupy on it, and the row
 *                where a flat sea would mirror the sun
 *   ch07  云    the cloud slab, and the three-lobe phase function the clouds are lit by
 *   ch08  合成  the tone curve with the live histogram of the finished frame on one axis
 *   ch09  实时  the frame-time trace and the camera path with the current pose on it
 *
 * The base layer under all of them is the horizon itself: the row a direction with no
 * vertical component projects to, which is where the shader puts it too.
 */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});

  var cv = null, g = null, W = 1280, H = 720, dpr = 1, built = false;
  var S = { x0: 0, y0: 0, x1: 0, y1: 0, w: 0, h: 0 };
  var lastDraw = -1e9, lastTick = 0, cur = -1, frames = 0;

  var F_MONO = '"JetBrains Mono", "Noto Sans SC", ui-monospace, monospace';
  var F_SANS = '"Space Grotesk", "Noto Sans SC", sans-serif';
  var DEG = Math.PI / 180, TAU = Math.PI * 2;

  // ---------------------------------------------------------------- math
  function clamp(x, a, b) { return x < a ? a : (x > b ? b : x); }
  function sat(x) { return clamp(x, 0, 1); }
  function smoothstep(a, b, x) { var t = sat((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function mix(a, b, t) { return a + (b - a) * t; }
  function fmtM(m) {
    if (m < 1000) return Math.round(m) + ' m';
    if (m < 10000) return (m / 1000).toFixed(1) + ' km';
    return Math.round(m / 1000) + ' km';
  }

  // ---------------------------------------------------------------- colour
  function ink(a) { return 'rgba(243,238,229,' + a + ')'; }
  function warm(a) { return 'rgba(255,192,120,' + a + ')'; }
  function cool(a) { return 'rgba(127,216,232,' + a + ')'; }
  function coral(a) { return 'rgba(255,122,99,' + a + ')'; }
  function gray(v, a) { return 'rgba(' + Math.round(v * 255) + ',' + Math.round(v * 255) + ',' + Math.round(v * 255) + ',' + a + ')'; }
  function rgb01(c, a) {
    return 'rgba(' + Math.round(sat(c[0]) * 255) + ',' + Math.round(sat(c[1]) * 255) +
      ',' + Math.round(sat(c[2]) * 255) + ',' + a + ')';
  }

  // the shader's own output transform, in JS, so a swatch of a baked table lands on the
  // same pixel value the picture would show for it
  var M_IN = [0.59719, 0.07600, 0.02840, 0.35458, 0.90834, 0.13383, 0.04823, 0.01566, 0.83777];
  var M_OUT = [1.60475, -0.10208, -0.00327, -0.53108, 1.10813, -0.07276, -0.07367, -0.00605, 1.07602];
  function mul3(m, v) {
    return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
            m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
            m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
  }
  function srgbEnc(c) {
    return [c[0] <= 0.0031308 ? c[0] * 12.92 : 1.055 * Math.pow(Math.max(c[0], 0), 1 / 2.4) - 0.055,
            c[1] <= 0.0031308 ? c[1] * 12.92 : 1.055 * Math.pow(Math.max(c[1], 0), 1 / 2.4) - 0.055,
            c[2] <= 0.0031308 ? c[2] * 12.92 : 1.055 * Math.pow(Math.max(c[2], 0), 1 / 2.4) - 0.055];
  }
  function grade(lin, exposure) {
    var c = [lin[0] * exposure, lin[1] * exposure, lin[2] * exposure];
    c = mul3(M_IN, c);
    for (var i = 0; i < 3; i++) {
      var x = c[i];
      c[i] = (x * (x + 0.0245786) - 0.000090537) / (x * (0.983729 * x + 0.432951) + 0.238081);
    }
    c = mul3(M_OUT, c);
    for (i = 0; i < 3; i++) c[i] = sat(c[i]);
    var l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    var t = smoothstep(0.25, 0.8, l);
    c = [mix(c[0] * 0.96, c[0] * 1.05, t), mix(c[1] * 0.99, c[1] * 1.0, t), mix(c[2] * 1.06, c[2] * 0.94, t)];
    return srgbEnc(c);
  }
  function lumaDisplay(lin, exposure) {
    var d = grade(lin, exposure);
    return 0.2126 * d[0] + 0.7152 * d[1] + 0.0722 * d[2];
  }

  // ---------------------------------------------------------------- primitives
  function text(s, x, y, o) {
    o = o || {};
    g.font = (o.size || 9.5) + 'px ' + (o.mono === false ? F_SANS : F_MONO);
    g.fillStyle = o.col || ink(0.6);
    g.textAlign = o.align || 'left';
    g.textBaseline = o.base || 'alphabetic';
    if (o.letter) { s = s.split('').join('\u2009'); }
    if (window.__mglog) window.__mglog.push([s, x, y, g.measureText(s).width, o.align || 'left', o.size || 9.5]);
    g.fillText(s, x, y);
  }
  function line(x1, y1, x2, y2, col, w, dash) {
    g.save();
    g.strokeStyle = col;
    g.lineWidth = w || 1;
    if (dash) g.setLineDash(dash);
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
    g.restore();
  }
  function box(x, y, w, h, col) { g.fillStyle = col; g.fillRect(x, y, w, h); }
  function frame(x, y, w, h, col, lw) {
    g.save(); g.strokeStyle = col; g.lineWidth = lw || 1;
    g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); g.restore();
  }
  /* A soft plate behind one chapter's diagram. The picture is bright exactly where the sun
     is, and 9 px hairlines over a specular halo cannot be read; this is the same device the
     instrument panels use, feathered so it never reads as a box. */
  function scrim(x0, y0, x1, y1, av, hard) {
    if (hard) {
      // a chart that has to stay legible corner to corner: a rounded plate, no falloff
      var r = Math.min(12, x1 - x0, y1 - y0) * 0.5;
      g.save();
      g.fillStyle = 'rgba(9,10,13,' + av.toFixed(3) + ')';
      g.beginPath();
      g.moveTo(x0 + r, y0); g.lineTo(x1 - r, y0); g.quadraticCurveTo(x1, y0, x1, y0 + r);
      g.lineTo(x1, y1 - r); g.quadraticCurveTo(x1, y1, x1 - r, y1);
      g.lineTo(x0 + r, y1); g.quadraticCurveTo(x0, y1, x0, y1 - r);
      g.lineTo(x0, y0 + r); g.quadraticCurveTo(x0, y0, x0 + r, y0);
      g.closePath(); g.fill();
      g.restore();
      return;
    }
    var cx = (x0 + x1) * 0.5, cy = (y0 + y1) * 0.5;
    var rx = Math.max(1, (x1 - x0) * 0.5), ry = Math.max(1, (y1 - y0) * 0.5);
    g.save();
    g.translate(cx, cy);
    g.scale(rx, ry);
    var gr = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    gr.addColorStop(0, 'rgba(9,10,13,' + Math.min(0.95, av * 1.06).toFixed(3) + ')');
    gr.addColorStop(0.55, 'rgba(9,10,13,' + (av * 0.88).toFixed(3) + ')');
    gr.addColorStop(0.85, 'rgba(9,10,13,' + (av * 0.34).toFixed(3) + ')');
    gr.addColorStop(1, 'rgba(9,10,13,0)');
    g.fillStyle = gr;
    g.beginPath(); g.arc(0, 0, 1, 0, TAU); g.fill();
    g.restore();
  }
  function dot(x, y, r, col) { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
  function poly(pts, stroke, fill, lw, dash) {
    if (!pts.length) return;
    g.save();
    g.beginPath();
    for (var i = 0; i < pts.length; i++) {
      if (pts[i][0] !== pts[i][0] || pts[i][1] !== pts[i][1]) continue;
      if (i === 0) g.moveTo(pts[i][0], pts[i][1]); else g.lineTo(pts[i][0], pts[i][1]);
    }
    if (fill) { g.fillStyle = fill; g.fill(); }
    if (stroke) {
      g.strokeStyle = stroke; g.lineWidth = lw || 1;
      if (dash) g.setLineDash(dash);
      g.stroke();
    }
    g.restore();
  }

  // ---------------------------------------------------------------- camera
  function cam(R) {
    var c = R.camera || {};
    var pos = c.pos || [0, 0, 0], fwd = c.fwd || [0, 0, -1], up = c.up || [0, 1, 0], right = c.right || [1, 0, 0];
    var tanF = Math.tan((c.fov || 50) * DEG * 0.5);
    var f = (H * 0.5) / Math.max(tanF, 1e-4);
    return { pos: pos, fwd: fwd, up: up, right: right, tanF: tanF, f: f, cx: W * 0.5, cy: H * 0.5, fov: c.fov || 50 };
  }
  function projPoint(c, p) {
    var rx = p[0] - c.pos[0], ry = p[1] - c.pos[1], rz = p[2] - c.pos[2];
    var w = rx * c.fwd[0] + ry * c.fwd[1] + rz * c.fwd[2];
    if (w <= 0.05) return null;
    var u = rx * c.right[0] + ry * c.right[1] + rz * c.right[2];
    var v = rx * c.up[0] + ry * c.up[1] + rz * c.up[2];
    return [c.cx + (u / w) * c.f, c.cy - (v / w) * c.f];
  }
  function projDir(c, d) {
    var w = d[0] * c.fwd[0] + d[1] * c.fwd[1] + d[2] * c.fwd[2];
    if (w <= 1e-3) return null;
    var u = d[0] * c.right[0] + d[1] * c.right[1] + d[2] * c.right[2];
    var v = d[0] * c.up[0] + d[1] * c.up[1] + d[2] * c.up[2];
    return [c.cx + (u / w) * c.f, c.cy - (v / w) * c.f];
  }
  function rayAt(c, sx, sy) {
    var u = (sx - c.cx) / c.f, v = (c.cy - sy) / c.f;
    var d = [c.fwd[0] + c.right[0] * u + c.up[0] * v,
             c.fwd[1] + c.right[1] * u + c.up[1] * v,
             c.fwd[2] + c.right[2] * u + c.up[2] * v];
    var l = Math.hypot(d[0], d[1], d[2]) || 1;
    return [d[0] / l, d[1] / l, d[2] / l];
  }
  function sunDirOf(R) {
    var e = (R.s.sunElev || 0) * DEG, a = (R.s.sunAzi || 0) * DEG;
    return [Math.cos(e) * Math.sin(a), Math.sin(e), Math.cos(e) * Math.cos(a)];
  }
  function horizonRow(c) {
    var l = Math.hypot(c.fwd[0], c.fwd[2]) || 1;
    var p = projDir(c, [c.fwd[0] / l, 0, c.fwd[2] / l]);
    return p ? p[1] : c.cy;
  }

  // ---------------------------------------------------------------- the height field
  function tileDist(x, z, dx, dz, half) {
    var t = 1e9;
    if (dx > 1e-6) t = Math.min(t, (half - x) / dx);
    if (dx < -1e-6) t = Math.min(t, (-half - x) / dx);
    if (dz > 1e-6) t = Math.min(t, (half - z) / dz);
    if (dz < -1e-6) t = Math.min(t, (-half - z) / dz);
    return Math.max(0, t);
  }

  var cache = { prof: {}, pano: {}, grid: {}, hist: {}, sun: {}, column: {}, curve: {} };
  var lastPano = null, lastProf = null;      // for the verification tools

  function profile(R, azi, n, dMin, dMax) {
    var c = cam(R), half = (R.s.terrainSize || 16384) * 0.5;
    var key = (c.pos[0] / 600 | 0) + '|' + (c.pos[2] / 600 | 0) + '|' + (azi * 180 / Math.PI / 5 | 0);
    var pc = cache.prof[key];
    if (pc && pc.n === n) return pc;
    var d = new Float64Array(n), h = new Float64Array(n);
    var dx = Math.sin(azi), dz = Math.cos(azi);
    var exit = tileDist(c.pos[0], c.pos[2], dx, dz, half);
    var dd = dMin, f = Math.pow(dMax / dMin, 1 / (n - 1));
    for (var i = 0; i < n; i++) {
      d[i] = dd;
      h[i] = dd <= exit ? R.groundHeight(c.pos[0] + dx * dd, c.pos[2] + dz * dd) : NaN;
      dd *= f;
    }
    pc = cache.prof[key] = { n: n, d: d, h: h, exit: exit, dMin: dMin, dMax: dMax, azi: azi };
    var hmn = 1e9, hmx = -1e9;
    for (var j2 = 0; j2 < n; j2++) { if (h[j2] !== h[j2]) continue; if (h[j2] < hmn) hmn = h[j2]; if (h[j2] > hmx) hmx = h[j2]; }
    pc.hMin = hmn; pc.hMax = hmx;
    lastProf = pc;
    return pc;
  }
  function profAt(pc, t) {
    if (t < pc.d[0] || t > pc.exit) return null;
    var n = pc.n, lo = 0, hi = n - 1;
    while (hi - lo > 1) { var m = (lo + hi) >> 1; if (pc.d[m] > t) hi = m; else lo = m; }
    var f = (t - pc.d[lo]) / Math.max(1e-9, pc.d[hi] - pc.d[lo]);
    var a = pc.h[lo], b = pc.h[hi];
    if (a !== a || b !== b) return null;
    return a + (b - a) * f;
  }
  /* The silhouette around the camera: for every azimuth, the largest elevation angle any
     point of the field inside the tile reaches. This is what the march integrates over. */
  function panorama(R, na, nd) {
    var c = cam(R), half = (R.s.terrainSize || 16384) * 0.5;
    var key = (c.pos[0] / 1500 | 0) + '|' + (c.pos[2] / 1500 | 0) + '|' + (R.s.seaLevel | 0);
    var pa = cache.pano[key];
    if (pa && pa.na === na) return pa;
    var yaw = Math.atan2(c.fwd[0], c.fwd[2]);
    var el = new Float32Array(na), exits = new Float32Array(na);
    var base = yaw - Math.PI, dMin = 120, dMax = 64000, f = Math.pow(dMax / dMin, 1 / (nd - 1));
    for (var i = 0; i < na; i++) {
      var azi = base + (i / (na - 1)) * TAU;
      var dx = Math.sin(azi), dz = Math.cos(azi);
      var exit = tileDist(c.pos[0], c.pos[2], dx, dz, half);
      var best = -90, d = dMin;
      for (var j = 0; j < nd; j++) {
        if (d <= exit) {
          var h = R.groundHeight(c.pos[0] + dx * d, c.pos[2] + dz * d);
          var a = Math.atan2(h - c.pos[1], d) / DEG;
          if (a > best) best = a;
        }
        d *= f;
      }
      el[i] = best; exits[i] = exit;
    }
    pa = cache.pano[key] = { na: na, el: el, exits: exits, base: base };
    var mn = 1e9, mx = -1e9;
    for (var k2 = 0; k2 < na; k2++) { if (el[k2] < mn) mn = el[k2]; if (el[k2] > mx) mx = el[k2]; }
    pa.min = mn; pa.max = mx;
    lastPano = pa;
    return pa;
  }
  function terrainGrid(R, n) {
    var key = 'g' + n + '|' + (R.s.terrainSize | 0);
    var t = cache.grid[key];
    if (t) return t;
    var hs = new Float32Array(n * n), ts = R.s.terrainSize || 16384;
    var step = ts / (n - 1), half = ts * 0.5;
    for (var j = 0; j < n; j++) {
      for (var i = 0; i < n; i++) hs[j * n + i] = R.groundHeight(-half + i * step, -half + j * step);
    }
    t = cache.grid[key] = { n: n, h: hs, step: step, half: half };
    return t;
  }

  /* The march, replayed in one dimension along the view ray with the shader's own rules:
     the step grows with the distance, is floored by terrain.js's minStep and capped by its
     far-field step, and the crossing is refined linearly. */
  function march1D(R, pc, camY, slope) {
    var steps = [], t = pc.d[0] * 1.15, hit = -1, hitH = 0;
    var rdY = Math.max(Math.abs(slope), 0.02);
    for (var k = 0; k < 64; k++) {
      var h = profAt(pc, t);
      if (h === null) break;
      var ray = camY + slope * t, diff = h - ray;
      steps.push(t);
      if (diff >= 0) {
        var t0 = k > 0 ? steps[k - 1] : t * 0.75;
        var a = (profAt(pc, t0) || 0) - (camY + slope * t0), b = diff;
        hit = Math.abs(b - a) > 1e-6 ? t0 + (t - t0) * (-a / (b - a)) : t;
        hitH = profAt(pc, hit);
        break;
      }
      var dt = clamp(0.6 * Math.abs(diff) / rdY, mix(0.45, 7.0, sat(t / 1800)), mix(1000.0, 220.0, sat(t / 4000)));
      t += dt;
      if (t > pc.exit) break;
    }
    return { steps: steps, hit: hit, hitH: hitH };
  }

  // ---------------------------------------------------------------- the base layer
  function drawBase(R, ch, u) {
    var c = cam(R), hr = horizonRow(c);
    if (ch <= 5) {
      line(0, hr, W, hr, warm(0.10), 1);
    }
  }
  /* A chapter's opening beat shows one layer *alone*: the height field, the normals, the
     cloud volume, the shadow term. Those frames are diagnostics, and unlabelled they read as
     a glitch - the picture is suddenly a flat map. This names the layer, in the film's own
     voice, and marks the frame as deliberate. (These views bypass the grade in post.js, so
     what is named here is exactly what is on screen.) */
  var VIEW_NAME = {
    1: '光线方向', 2: '命中距离', 3: '法线', 4: '坡度 · 高程 · 材质', 5: '阴影', 6: '大气厚度',
    7: '水深', 9: '云密度', 11: '图层栈', 12: '天空查找表', 13: '云的厚度', 14: '云的水平切片',
    15: '云的剖面', 16: '高度场（俯视）', 17: '材质反射率', 18: '坡度', 19: '阴影项',
    20: '天空辐照度与 N·L', 21: '环境光采样', 22: '步进误差', 23: '阴影首采样',
    24: '天空（无云无雾）', 25: '云层单独显示', 26: '多次散射', 27: '命中与视线',
    28: '反射项', 29: '波法线', 30: '160 km 天气图', 31: '云体素', 32: '环境光分解'
  };
  function drawViewBadge(R) {
    var v = (R.s.view || 0) | 0;
    if (!v) return;
    var label = '单独图层 · ' + (VIEW_NAME[v] || ('视图 ' + v));
    g.save();
    g.font = '10.5px ' + F_SANS;
    var tw = g.measureText(label).width;
    g.restore();
    /* A solid plate: this lands over whatever the layer happens to be, and the height-field
       view is snow-white in the north, where a feathered scrim left the label unreadable.
       Light type on a hard dark plate reads on any of them. */
    var cx = W * 0.5, y = 24;
    scrim(cx - tw * 0.5 - 24, y - 15, cx + tw * 0.5 + 24, y + 9, 0.68, true);
    dot(cx - tw * 0.5 - 11, y - 3.6, 2.4, cool(0.95));
    text(label, cx - tw * 0.5 - 1, y, { col: ink(0.94), size: 10.5, mono: false });
  }

  // the distance rail - chapter 01 only, because that is the chapter about this intersection
  function drawRail(R, u, alpha) {
    var c = cam(R), sea = R.s.seaLevel || 0;
    var camY = Math.max(c.pos[1] - sea, 1.0);
    var hr = horizonRow(c), x = W * 0.5;
    g.save(); g.globalAlpha = alpha;
    line(x, hr, x, S.y1, warm(0.22), 1, [2, 3]);
    line(x - 14, hr, x + 22, hr, warm(0.5), 1);
    text('水平线', x + 26, hr + 3.4, { col: warm(0.8), size: 9.5 });
    text('相机高度 ' + Math.round(camY) + ' m', x + 26, S.y1 - 24, { col: ink(0.34), size: 9 });
    var steps = [0.25, 0.5, 1, 2, 5, 10, 20, 50], labels = ['250 m', '500 m', '1 km', '2 km', '5 km', '10 km', '20 km', '50 km'];
    var shown = 0;
    for (var i = 0; i < steps.length; i++) {
      var d = steps[i] * 1000;
      if (d <= camY * 1.2) continue;
      // the point on the sea directly along the camera's heading, projected
      var ex = c.pos[0] + (c.fwd[0]) * 0 + Math.sin(Math.atan2(c.fwd[0], c.fwd[2])) * d;
      var ez = c.pos[2] + Math.cos(Math.atan2(c.fwd[0], c.fwd[2])) * d;
      var p = projPoint(c, [ex, sea, ez]);
      if (!p || p[1] > S.y1 + 6) continue;
      var t = sat((u - 0.03) / 0.26 - i * 0.06);
      if (t <= 0.02) continue;
      shown++;
      var op = (0.34 + 0.5 * (i / steps.length)) * t;
      line(x, p[1], x + (i % 2 ? 9 : 15), p[1], ink(op), 1);
      // the height label owns the row above the rail's own caption
      if (Math.abs(p[1] - (S.y1 - 24)) > 15) {
        text(labels[i], x + (i % 2 ? 15 : 21), p[1] + 3.2, { col: ink(op), size: 9.5 });
      }
    }
    text('d = h / tan θ', x + 26, S.y1 - 8, { col: ink(0.3), size: 9 });
    g.restore();
  }

  // ---------------------------------------------------------------- readouts
  function drawReadouts(R, ch, u, alpha) {
    var rows = [], s = R.s;
    if (ch === 1) {
      rows.push(['瓦片', Math.round((s.terrainSize || 0) / 1000) + ' km']);
      rows.push(['高度场', (R.buildInfo ? R.buildInfo.terrainRes : 0) + '\u00b2']);
      rows.push(['海平面', (s.seaLevel || 0).toFixed(1) + ' m']);
    } else if (ch === 2) {
      rows.push(['太阳高度', (s.sunElev || 0).toFixed(1) + '\u00b0']);
      rows.push(['太阳方位', Math.round(s.sunAzi) + '\u00b0']);
      rows.push(['曝光', (R.lastExposure || 0).toFixed(2) + '\u00d7']);
    } else if (ch === 3) {
      rows.push(['太阳高度', (s.sunElev || 0).toFixed(1) + '\u00b0']);
      rows.push(['空气质量', (1 / Math.max(Math.sin((s.sunElev || 1) * DEG), 0.02)).toFixed(2) + '\u00d7']);
      rows.push(['米氏 β', (s.betaM * 1e6).toFixed(0) + 'e\u22126']);
    } else if (ch === 4) {
      rows.push(['海平面', (s.seaLevel || 0).toFixed(1) + ' m']);
      rows.push(['风速', (s.wind || 0).toFixed(1) + ' m/s']);
      rows.push(['白沫覆盖率', (3.84e-6 * Math.pow(Math.max(s.wind || 1, 1), 3.41) * 100).toFixed(3) + '%']);
    } else if (ch === 5) {
      var cosT = Math.abs((R.camera || {}).fwd ? R.camera.fwd[1] : 0.05);
      var F = 0.0204 + (1 - 0.0204) * Math.pow(1 - cosT, 5);
      rows.push(['掠射角', (Math.acos(clamp(cosT, 0, 1)) * 180 / Math.PI).toFixed(1) + '\u00b0']);
      rows.push(['菲涅耳 F', F.toFixed(3)]);
      rows.push(['水色深度', (s.waterClarity || 1).toFixed(2) + '\u00d7']);
    } else if (ch === 6) {
      rows.push(['云量', Math.round((s.cloudCover || 0) * 100) + '%']);
      rows.push(['云底 / 云顶', Math.round(s.cloudBase) + ' / ' + Math.round(s.cloudTop) + ' m']);
      rows.push(['太阳遮挡', (s.cloudSun || 1).toFixed(2) + '\u00d7']);
    } else if (ch === 7) {
      rows.push(['曝光', (R.lastExposure || 0).toFixed(2) + '\u00d7']);
      rows.push(['泛光', (s.bloom || 0).toFixed(3)]);
      rows.push(['帧时间', (R.stats.ms || 0).toFixed(1) + ' ms']);
    } else if (ch === 8) {
      var mst = msStats();
      rows.push(['帧间隔 p50', mst.p50.toFixed(1) + ' ms']);
      rows.push(['帧间隔 p95', mst.p95.toFixed(1) + ' ms']);
      rows.push(['内部分辨率', R.targets.w + '\u00d7' + R.targets.h + ' · ' + Math.round((R.stats.scale || 1) * 100) + '%']);
    }
    if (!rows.length) return;
    g.save(); g.globalAlpha = alpha;
    var x = S.x0 + 2, y = S.y0 + 12;
    scrim(x - 2, S.y0 + 1, x + 150, y + rows.length * 14.5 + 2, 0.26);
    for (var i = 0; i < rows.length; i++) {
      text(rows[i][0], x, y + i * 14.5, { col: ink(0.36), size: 9 });
      text(rows[i][1], x + 74, y + i * 14.5, { col: ink(0.72), size: 9.5 });
    }
    g.restore();
  }

  // ---------------------------------------------------------------- chapter 01 · rays
  function h01(R, t, u, a, c) {
    // left: the fan at true scale (equal x and y scales, so the angles are the real angles)
    var sea = R.s.seaLevel || 0;
    var camY = Math.max(c.pos[1] - sea, 1.0);
    var px0 = S.x0 + 4, px1 = S.x0 + S.w * 0.46;
    var gy = S.y1 - 34, hPx = Math.min(64, (gy - S.y0 - 74) * 0.75);
    var mf = camY / hPx, dmax = (px1 - px0) * mf;
    var ex = px0 + 4, ey = gy - hPx;
    scrim(px0 - 12, S.y0 + 48, px1 + 14, S.y1 - 16, 0.30);
    line(px0 - 2, gy, px1, gy, ink(0.22), 1);
    line(ex, ey, ex, gy, ink(0.16), 1, [2, 3]);
    // the frame's own vertical cone, at the true half-angle
    var pitch = Math.asin(clamp(c.fwd[1], -1, 1));
    var half = c.fov * DEG * 0.5;
    for (var sgn = -1; sgn <= 1; sgn += 2) {
      var ang = pitch + sgn * half, L = px1 - ex;
      line(ex, ey, ex + L, ey - L * Math.tan(pitch + sgn * half), cool(0.3), 1, [3, 3]);
    }
    line(ex, ey, px1, ey - (px1 - ex) * Math.tan(pitch), ink(0.2), 1, [2, 4]);
    // the ray fan: one ray per distance, at the angle the intersection actually makes
    var fr = [1, 0.72, 0.5, 0.33, 0.2, 0.12, 0.06];
    for (var i = 0; i < fr.length; i++) {
      var d = dmax * fr[i];
      var x = ex + d / mf;
      line(ex, ey, x, gy, warm(0.20 + 0.05 * i), 1);
      if (i % 2 === 0) text(fmtM(d), x + 3, gy - 4, { col: ink(0.40), size: 8.5 });
    }
    // one ray sweeping the fan, with its live distance and angle
    var sw = (t * 0.11) % 1, ds = dmax * (0.06 + 0.9 * sw), xs = ex + ds / mf;
    line(ex, ey, xs, gy, warm(0.95), 1.4);
    dot(ex, ey, 2.6, warm(0.95));
    dot(xs, gy, 2.2, warm(0.9));
    text('d = ' + fmtM(ds), xs + 5, gy - 33, { col: warm(0.9), size: 9.5 });
    text('θ = ' + (Math.atan2(hPx * mf, ds) / DEG).toFixed(1) + '\u00b0', xs + 5, gy - 21, { col: ink(0.55), size: 9 });
    text('等比 1:1 · 视野内最远 ' + fmtM(dmax), px0, gy + 16, { col: ink(0.4), size: 9 });
    text('h = ' + Math.round(camY) + ' m', ex + 6, ey - 4, { col: ink(0.5), size: 9 });
    // right: the internal framebuffer's own pixel grid, magnified
    var tw = R.targets.w, th = R.targets.h;
    var cell = 21, cols = 6, rows2 = 4;
    var bx = S.x1 - (cols * cell) - 2, by = S.y0 + S.h * 0.46;
    scrim(bx - 14, by - 34, bx + cols * cell + 12, by + rows2 * cell + 24, 0.36);
    box(bx, by, cols * cell, rows2 * cell, 'rgba(255,255,255,0.025)');
    g.save(); g.globalAlpha = a;
    for (var yy = 0; yy < rows2; yy++) for (var xx = 0; xx < cols; xx++) {
      frame(bx + xx * cell, by + yy * cell, cell, cell, ink(0.13));
    }
    // the one ray this cell is marching, sweeping
    var cxx = Math.floor(((t * 0.7) % 1) * cols), cyy = Math.floor(((t * 0.31) % 1) * rows2);
    box(bx + cxx * cell, by + cyy * cell, cell, cell, warm(0.14));
    frame(bx + cxx * cell, by + cyy * cell, cell, cell, warm(0.85));
    g.restore();
    text('内部分辨率 ' + tw + '\u00d7' + th, bx, by - 24, { col: ink(0.55), size: 9.5 });
    text('每格 1 条射线', bx, by - 11, { col: ink(0.4), size: 9 });
    text((tw * th).toLocaleString('en-US') + ' 条/帧', bx, by + rows2 * cell + 13, { col: warm(0.75), size: 9.5 });
  }

  // ---------------------------------------------------------------- chapter 02 · terrain
  function h02(R, t, u, a, c) {
    var sea = R.s.seaLevel || 0;
    panePanorama(R, c, sea, a);
    paneProfile(R, c, sea, a);
  }
  function panePanorama(R, c, sea, a) {
    // 96 samples on the geometric ladder: 30 was coarse enough to miss whole ridges
    var pa = panorama(R, 110, 96);
    var x0 = S.x0 + 2, x1 = S.x1 - 2, yTop = S.y0 + 74, hgt = 74;
    var yBot = yTop + hgt;
    var elMax = 12, elMin = -8;
    var xL = x0 + 24;                          // gutter so the degree labels never sit on the curve
    scrim(x0, yTop - 6, x1, yBot + 10, 0.30);
    function yOf(el) { return yBot - (el - elMin) / (elMax - elMin) * hgt; }
    function xs(i) { return xL + (i / (pa.na - 1)) * (x1 - xL); }
    // the axis: 0 degrees is the true horizon
    for (var e = -6; e <= 12; e += 6) {
      var yy = yOf(e);
      line(xL, yy, x1, yy, e === 0 ? ink(0.22) : ink(0.08), 1, e === 0 ? null : [1, 4]);
      text((e > 0 ? '+' : '') + e + '\u00b0', x0 + 2, yy + 3, { col: ink(0.34), size: 8 });
    }
    // the silhouette the field actually has, in every direction
    var pts = [];
    for (var i = 0; i < pa.na; i++) {
      var el = pa.el[i];
      pts.push([xs(i), yOf(el !== el ? elMin : clamp(el, elMin, elMax))]);
    }
    // the far edge of the tile, as a curve: what the field covers is not the horizon
    var ex_pts = [];
    for (i = 0; i < pa.na; i++) {
      var d = pa.exits[i];
      ex_pts.push([xs(i), yOf(Math.atan2(sea - c.pos[1], Math.max(d, 1)) / DEG)]);
    }
    poly(ex_pts, ink(0.16), null, 1, [2, 3]);
    poly(pts, warm(0.75), warm(0.10), 1.1);
    // the camera's own view cone, at the true field of view
    var cx0 = (xL + x1) * 0.5;
    var cone = (x1 - xL) * 0.5 * (c.fov * DEG * 0.5) / Math.PI;
    box(cx0 - cone, yTop, cone * 2, hgt, warm(0.055));
    line(cx0, yTop, cx0, yBot, warm(0.3), 1);
    // the sun, in the same panorama
    var sunAz = Math.atan2(sunDirOf(R)[0], sunDirOf(R)[2]);
    var rel = ((sunAz - pa.base + Math.PI) % TAU + TAU) % TAU - Math.PI;
    var sx = xL + ((rel + Math.PI) / TAU) * (x1 - xL);
    if (sx > x0 - 2 && sx < x1 + 2) {
      dot(sx, yOf(R.s.sunElev), 3, warm(0.9));
      text('太阳', sx + 5, yOf(R.s.sunElev) + 3.2, { col: warm(0.8), size: 8.5 });
    }
    text('四周的轮廓', x0, yTop - 8, { col: ink(0.5), size: 9.5 });
    text('每 3.3° 取一条方位 · 高度场', x1, yTop - 8, { col: ink(0.3), size: 9, align: 'right' });
    return yBot;
  }
  function paneProfile(R, c, sea) {
    var azi = Math.atan2(c.fwd[0], c.fwd[2]);
    var pc = profile(R, azi, 56, 150, Math.max(2000, Math.min(60000, (R.s.terrainSize || 16384))));
    var x0 = S.x0 + 2, x1 = S.x1 - 2;
    var yTop = S.y0 + S.h * 0.52, yBot = S.y1 - 16, hgt = yBot - yTop;
    var hMax = 900;
    for (var i = 0; i < pc.n; i++) if (pc.h[i] === pc.h[i] && pc.h[i] > hMax) hMax = pc.h[i];
    hMax = Math.min(2400, Math.max(600, hMax * 1.15));
    scrim(x0, yTop - 8, x1, yBot + 22, 0.32);
    // the axis spans what this profile actually does, not a fixed window
    var hMin = clamp(Math.min(sea - 120, pc.hMin === pc.hMin ? pc.hMin : sea), -1600, sea);
    var l0 = Math.log(pc.d[0]), l1 = Math.log(Math.min(pc.exit, pc.dMax));
    function xOf(d) { return x0 + (Math.log(d) - l0) / Math.max(1e-6, l1 - l0) * (x1 - x0); }
    function yOf(h) { return yBot - (clamp(h, hMin, hMax) - hMin) / (hMax - hMin) * hgt; }
    // the sea level and the axis
    line(x0, yOf(sea), x1, yOf(sea), cool(0.35), 1, [3, 3]);
    text('海平面', x1, yOf(sea) - 4, { col: cool(0.5), size: 8.5, align: 'right' });
    text(Math.round(hMax) + ' m', x0 + 3, yOf(hMax) + 9, { col: ink(0.34), size: 8 });
    text(Math.round(hMin) + ' m', x0 + 3, yOf(hMin) - 4, { col: ink(0.34), size: 8 });
    var ticks = [200, 500, 1000, 2000, 5000, 10000, 20000, 50000];
    for (i = 0; i < ticks.length; i++) {
      if (ticks[i] > pc.exit) continue;
      var xx = xOf(ticks[i]);
      // the tile-edge label owns the right end of this row
      if (x1 - xx < 84) continue;
      line(xx, yBot, xx, yBot + 3, ink(0.22), 1);
      text(fmtM(ticks[i]), xx, yBot + 13, { col: ink(0.3), size: 8, align: 'center' });
    }
    var exitX = xOf(pc.exit);
    line(exitX, yTop, exitX, yBot + 4, cool(0.30), 1, [2, 4]);
    text('瓦片边界 ' + fmtM(pc.exit), x1, yBot + 13, { col: cool(0.62), size: 8.5, align: 'right' });
    // the field along the view ray, filled to sea level
    var pts = [], fillPts = [[x0, yOf(sea)]];
    for (i = 0; i < pc.n; i++) {
      if (pc.d[i] > pc.exit) break;
      if (pc.h[i] !== pc.h[i]) continue;
      var p = [xOf(pc.d[i]), yOf(pc.h[i])];
      pts.push(p); fillPts.push(p);
    }
    fillPts.push([pts.length ? pts[pts.length - 1][0] : x0, yOf(sea)]);
    poly(fillPts, null, 'rgba(255,192,120,0.075)', 1);
    poly(pts, warm(0.8), null, 1.2);
    // the ray, and the march's own samples on it
    var camY = c.pos[1];
    var hl = Math.hypot(c.fwd[0], c.fwd[2]) || 1;
    var slope = c.fwd[1] / hl;
    var rayPts = [];
    for (i = 0; i < pc.n; i++) {
      if (pc.d[i] > pc.exit) break;
      rayPts.push([xOf(pc.d[i]), yOf(camY + slope * pc.d[i])]);
    }
    poly(rayPts, cool(0.4), null, 1, [3, 3]);
    var m = march1D(R, pc, camY, slope);
    for (i = 0; i < m.steps.length; i++) {
      var mx = xOf(m.steps[i]), my = yOf(camY + slope * m.steps[i]);
      dot(mx, my, 1.1, ink(0.0));
      dot(mx, my, 1.1, i === m.steps.length - 1 ? warm(0.95) : ink(0.45));
    }
    text('沿这条射线的步进：' + m.steps.length + ' 步', x0, yTop - 6, { col: ink(0.5), size: 9.5 });
    text('步长随距离增长 · 上限 64', x1, yTop - 6, { col: ink(0.3), size: 9, align: 'right' });
    if (m.hit > 0) {
      var hx = xOf(m.hit);
      line(hx, yTop, hx, yBot, warm(0.42), 1, [2, 3]);
      dot(hx, yOf(m.hitH), 2.4, warm(0.95));
      text('命中 ' + fmtM(m.hit), hx + 4, yTop + 10, { col: warm(0.85), size: 9 });
    }
  }

  // ---------------------------------------------------------------- chapter 03 · light
  function h03(R, t, u, a, c) {
    var sea = R.s.seaLevel || 0;
    var x0 = S.x0 + 26, x1 = S.x0 + S.w * 0.54, y0 = S.y0 + 80, y1 = S.y1 - 74;
    var hMax = 2000, sMax = 0.46;
    var nx = 40, ny = 15, cw = (x1 - x0) / nx, chh = (y1 - y0) / ny;
    var grid = terrainGrid(R, 64);
    scrim(x0 - 28, y0 - 20, x1 + 8, y1 + 30, 0.62, true);
    // the ramps the shader tests, in the shader's own units: slope = 1 - n.y
    for (var j = 0; j < ny; j++) {
      var slope = (1 - (j + 0.5) / ny) * sMax;
      for (var i = 0; i < nx; i++) {
        var height = (i + 0.5) / nx * hMax;
        // a little patch variation, so the chart reads as a field and not as a gradient
        var patch = clamp(0.5 + 0.26 * Math.sin(i * 2.399 + j * 1.117) + 0.13 * Math.cos(i * 5.71 - j * 3.33), 0, 1);
        var col = matCol(height - sea, height, slope, patch).col;
        // the chart is a reading surface, not a light source: it sits a stop under the film
        var shade = (0.52 + 0.48 * (1 - (j + 0.5) / ny * 0.5)) * 0.82;
        box(x0 + i * cw, y0 + (ny - 1 - j) * chh, cw + 0.6, chh + 0.6,
          rgb01([col[0] * shade, col[1] * shade, col[2] * shade], 0.94));
      }
    }
    // the field's own (height, slope) cloud, from the same readback the rest of the page uses
    var n = grid.n, seen = 0;
    for (j = 1; j < n - 1; j += 2) {
      for (i = 1; i < n - 1; i += 2) {
        var hi = grid.h[j * n + i];
        var gx = (grid.h[j * n + i + 1] - grid.h[j * n + i - 1]) / (2 * grid.step);
        var gz = (grid.h[(j + 1) * n + i] - grid.h[(j - 1) * n + i]) / (2 * grid.step);
        var g2 = gx * gx + gz * gz;
        var sl = 1 - 1 / Math.sqrt(1 + g2);
        if (sl > sMax || hi > hMax || hi < sea) continue;
        seen++;
        var sxp = x0 + (hi / hMax) * (x1 - x0), syp = y0 + (1 - sl / sMax) * (y1 - y0);
        dot(sxp, syp, 0.75, 'rgba(12,14,19,0.34)');
        if (i % 8 === 2 && j % 8 === 2) dot(sxp, syp, 1.1, cool(0.5));
      }
    }
    // the pixel this frame's own centre ray lands on, priced by the same masks
    var hit = hitOf(R, c);
    if (hit) {
      var mxp = x0 + sat(hit.h / hMax) * (x1 - x0), myp = y0 + (1 - sat(hit.slope / sMax)) * (y1 - y0);
      line(mxp - 8, myp, mxp + 8, myp, warm(0.9), 1);
      line(mxp, myp - 8, mxp, myp + 8, warm(0.9), 1);
      dot(mxp, myp, 2.4, warm(0.95));
      var lab = hit.name + ' · 高程 ' + Math.round(hit.h) + ' m · 坡度 ' + hit.slope.toFixed(2);
      text(lab, mxp + 12, myp + 3.4, { col: warm(0.94), size: 9.2 });
      var sp = projPoint(c, hit.p);
      if (sp && sp[0] > 6 && sp[0] < W - 6 && sp[1] > 6 && sp[1] < H - 6) {
        line(x1 + 6, myp, sp[0], sp[1], warm(0.40), 1, [2, 3]);
        dot(sp[0], sp[1], 2.4, warm(0.9));
        text(Math.round(hit.dist / 1000) + ' km', sp[0] + 6, sp[1] - 5, { col: warm(0.78), size: 8.5 });
      }
    }
    // axes
    frame(x0, y0, x1 - x0, y1 - y0, ink(0.14));
    text('高度 m · 0 → ' + Math.round(hMax), x0, y1 + 27, { col: ink(0.36), size: 8.5 });
    for (i = 0; i <= 4; i++) {
      var hx = x0 + (i / 4) * (x1 - x0);
      line(hx, y1, hx, y1 + 3, ink(0.2), 1);
      text(String(Math.round(i / 4 * hMax)), hx, y1 + 13, { col: ink(0.3), size: 8, align: 'center' });
    }
    g.save(); g.translate(x0 - 6, (y0 + y1) * 0.5); g.rotate(-Math.PI / 2);
    text('坡度 1−n·y   0 → ' + sMax, 0, 0, { col: ink(0.36), size: 8.5, align: 'center' });
    g.restore();
    text('材质由坡度与高度决定 · 点 = 高度场里的真实采样', S.x1, y0 - 10, { col: ink(0.34), size: 9, align: 'right' });
    text('岩 >0.025 坡 · 草 <1200 m · 沙 <13 m · 雪 >1450 m', x0, y0 - 10, { col: ink(0.34), size: 9 });
    for (var b = 0; b < 4; b++) {
      var bxp = x0 + ([13, 200, 1200, 1450][b] / hMax) * (x1 - x0);
      line(bxp, y1 + 2, bxp, y1 + 7, ink(0.3), 1);
    }
    line(x0 + (13 / hMax) * (x1 - x0), y1 + 5, x0 + (1450 / hMax) * (x1 - x0), y1 + 5, ink(0.10), 1);

    // the sun, and what it does to this frame
    var cxp = S.x1 - 42, cyp = S.y1 - 52, rr = 30;
    scrim(S.x1 - 96, S.y1 - 100, S.x1 + 4, S.y1 - 4, 0.28);
    g.save();
    g.strokeStyle = ink(0.2); g.lineWidth = 1;
    g.beginPath(); g.arc(cxp, cyp, rr, 0, TAU); g.stroke();
    line(cxp - rr, cyp, cxp + rr, cyp, ink(0.12), 1);
    line(cxp, cyp - rr, cxp, cyp + rr, ink(0.12), 1);
    var nrm = Math.atan2(-(c.fwd[0]), -(c.fwd[2]));
    var sunA = (R.s.sunAzi || 0) * DEG;
    var sxp = cxp + Math.sin(sunA) * rr, syp = cyp - Math.cos(sunA) * rr;
    line(cxp, cyp, sxp, syp, warm(0.8), 1.4);
    dot(sxp, syp, 3, warm(0.95));
    line(cxp, cyp, cxp + Math.sin(nrm) * rr * 0.8, cyp - Math.cos(nrm) * rr * 0.8, cool(0.55), 1.2);
    text('太阳', sxp + 5, syp + 3, { col: warm(0.8), size: 8.5 });
    text('视线', cxp + Math.sin(nrm) * rr * 0.8 + (Math.sin(nrm) > 0 ? 4 : -4), cyp - Math.cos(nrm) * rr * 0.8 + 3,
      { col: cool(0.6), size: 8.5, align: Math.sin(nrm) > 0 ? 'left' : 'right' });
    g.restore();
    var nl = Math.max(0, Math.sin((R.s.sunElev || 0) * DEG));
    text('平面 N·L ' + nl.toFixed(2), S.x1, S.y1 - 8, { col: ink(0.5), size: 9, align: 'right' });
  }
  function mix3(a, b, t) { return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)]; }
  /* The material decision, replayed from src/glsl/terrain.js: the same thresholds and the same
     ramps, so the chart is a picture of the shader and not a decoration. */
  function matCol(above, height, slope, patch) {
    var beach = smoothstep(13.0, 3.0, above) * smoothstep(0.09, 0.0, slope);
    var sandMask = beach * (0.5 + 0.5 * patch);
    var col = mix3([0.50, 0.46, 0.41], [0.42, 0.40, 0.38], smoothstep(0.025, 0.10, slope));
    col = mix3(col, mix3([0.28, 0.36, 0.18], [0.42, 0.40, 0.38], smoothstep(0.05, 0.16, slope)),
      smoothstep(0.06, 0.0, slope) * 0.9);
    col = mix3(col, [0.66, 0.58, 0.45], sat(sandMask) * 0.9);
    var vegMask = smoothstep(0.12, 0.02, slope) * smoothstep(11.0, 26.0, above) *
      (1 - smoothstep(700.0, 1200.0, height));
    col = mix3(col, mix3([0.24, 0.30, 0.15], [0.20, 0.24, 0.13], patch), sat(vegMask) * 0.92);
    var snowLine = 1450.0 + 520.0 * (patch - 0.5);
    var snowMask = smoothstep(snowLine - 180, snowLine + 220, height) * smoothstep(0.42, 0.20, slope);
    col = mix3(col, [0.93, 0.95, 0.98], sat(snowMask));
    var wet = 1 - smoothstep(-2.0, 6.0, above);
    col = mix3(col, [0.40, 0.36, 0.30], wet * smoothstep(0.05, 0.0, slope));
    var name = '岩';
    if (snowMask > 0.25) name = '雪';
    else if (sandMask > 0.35) name = '沙';
    else if (vegMask > 0.30) name = '草';
    else if (wet > 0.55) name = '湿岩';
    return { col: col, snow: snowMask, sand: sandMask, veg: vegMask, wet: wet, name: name };
  }
  /* Slope the way the shader reads it: one texel either side, n.y = 1 / sqrt(1 + |grad|²). */
  function slopeAt(R, x, z, e) {
    e = e || 32;
    var gx = (R.groundHeight(x + e, z) - R.groundHeight(x - e, z)) / (2 * e);
    var gz = (R.groundHeight(x, z + e) - R.groundHeight(x, z - e)) / (2 * e);
    return clamp(1 - 1 / Math.sqrt(1 + gx * gx + gz * gz), 0, 0.99);
  }
  /* Where this frame's centre ray lands, judged on the field the shader marches: the same
     profile, the same march rules and the same neighbour-difference normal as chapter 03. */
  function hitOf(R, c) {
    var azi = Math.atan2(c.fwd[0], c.fwd[2]);
    var pc = profile(R, azi, 56, 150, Math.max(2000, Math.min(60000, R.s.terrainSize || 16384)));
    var hl = Math.hypot(c.fwd[0], c.fwd[2]) || 1;
    var m = march1D(R, pc, c.pos[1], c.fwd[1] / hl);
    if (!(m.hit > 0)) return null;
    var fl = Math.hypot(c.fwd[0], c.fwd[1], c.fwd[2]) || 1;
    var px = c.pos[0] + c.fwd[0] / fl * m.hit, py = c.pos[1] + c.fwd[1] / fl * m.hit, pz = c.pos[2] + c.fwd[2] / fl * m.hit;
    var sl = slopeAt(R, px, pz, 0);
    var mc = matCol(py - (R.s.seaLevel || 0), py, sl, 0.5);
    return { h: m.hitH, slope: sl, dist: m.hit, p: [px, py, pz], name: mc.name, col: mc.col };
  }

  // ---------------------------------------------------------------- chapter 04 · atmosphere
  function h04(R, t, u, a, c) {
    var x0 = S.x0 + 2, x1 = S.x0 + S.w * 0.34, y0 = S.y0 + 62, y1 = S.y1 - 112;
    // a column of the baked sky LUT, in the azimuth the camera is looking at
    scrim(x0 - 6, y0 - 18, x1 + 46, S.y1 - 4, 0.34);
    var col = skyColumn(R, a);
    if (col) {
      var n = col.rows, hgt = y1 - y0;
      for (var i = 0; i < n; i++) {
        var frac = i / (n - 1);                    // row 0 is the lowest elevation
        var disp = col.disp[i];
        box(x0, y0 + (1 - frac) * hgt - hgt / n - 0.6, x1 - x0, hgt / n + 1.4,
          rgb01([disp[0], disp[1], disp[2]], 1));
      }
      frame(x0, y0, x1 - x0, y1 - y0, ink(0.2));
      text('烘焙的天穹 LUT · 视线方位', x0, y0 - 10, { col: ink(0.5), size: 9 });
      text('90\u00b0', x1 + 4, y0 + 10, { col: ink(0.36), size: 8.5 });
      text('0\u00b0', x1 + 4, (y0 + y1) * 0.5, { col: ink(0.36), size: 8.5 });
      text('-3\u00b0', x1 + 4, y1 - 2, { col: ink(0.36), size: 8.5 });
    }
    // the sun's own transmittance, read back from the baked table
    var st = R.sunTransAt((R.s.sunElev || 0) * DEG, c.pos[1]);
    var sx0 = x0, sy0 = y1 + 22;
    if (st) {
      var mx = Math.max(st[0], st[1], st[2]) || 1;
      box(sx0, sy0, 34, 18, rgb01([st[0] / mx, st[1] / mx, st[2] / mx], 1));
      frame(sx0, sy0, 34, 18, ink(0.2));
      text('直接光透射率 @ ' + (R.s.sunElev || 0).toFixed(1) + '\u00b0', sx0 + 42, sy0 + 7, { col: ink(0.5), size: 9 });
      text('R ' + st[0].toFixed(3) + '   G ' + st[1].toFixed(3) + '   B ' + st[2].toFixed(3), sx0 + 42, sy0 + 18,
        { col: warm(0.75), size: 9 });
      text('短波先被散射掉', sx0 + 42, sy0 + 30, { col: ink(0.3), size: 8.5 });
    }
    // the two exponential layers, on a 0 - 30 km axis, plus the cloud deck
    var px0 = S.x0 + S.w * 0.44, px1 = S.x1 - 2, py0 = S.y0 + 70, py1 = S.y1 - 48;
    scrim(px0 - 54, py0 - 20, px1 + 6, py1 + 20, 0.30);
    var hR = 8000, hM = 1200, camH = c.pos[1];
    var cb = (R.s.cloudBase || 1900), ct = (R.s.cloudTop || 3300);
    var yOfH = function (h) { return py1 - sat(h / 30000) * (py1 - py0); };
    box(px0, yOfH(ct), px1 - px0, yOfH(cb) - yOfH(ct), 'rgba(255,192,120,0.10)');
    text('云层 ' + Math.round(cb) + '–' + Math.round(ct) + ' m', px0 + 4, yOfH(cb) - 4, { col: warm(0.6), size: 8.5 });
    var HK = [4000, 8000, 16000, 25000];
    for (var k = 0; k < HK.length; k++) {
      var hh = HK[k];
      line(px0, yOfH(hh), px1, yOfH(hh), ink(0.07), 1, [1, 4]);
      text((hh / 1000) + ' km', px0 - 4, yOfH(hh) + 3, { col: ink(0.30), size: 8, align: 'right' });
    }
    var rp = [], mp = [], op = [];
    for (i = 0; i <= 60; i++) {
      var h = (i / 60) * 30000;
      var x = mix(px0, px1, i / 60);
      rp.push([x, mix(py1, py0, Math.exp(-h / hR))]);
      mp.push([x, mix(py1, py0, Math.exp(-h / hM))]);
      op.push([x, mix(py1, py0, Math.exp(-Math.pow((h - 25000) / 15000, 2)))]);
    }
    text('密度（归一化）', px0, py0 - 12, { col: ink(0.5), size: 9 });
    text('高度 0 → 30 km', px1, py0 - 12, { col: ink(0.3), size: 9, align: 'right' });
    poly(rp, cool(0.72), null, 1.2);
    poly(mp, warm(0.72), null, 1.2);
    poly(op, 'rgba(190,150,255,0.6)', null, 1.2, [3, 3]);
    text('瑞利 H=8 km', px1 - 6, py0 + 10, { col: cool(0.74), size: 8.5, align: 'right' });
    text('米氏 H=1.2 km', px1 - 6, py0 + 21, { col: warm(0.74), size: 8.5, align: 'right' });
    text('臭氧 25 km', px1 - 6, py0 + 32, { col: 'rgba(190,150,255,0.80)', size: 8.5, align: 'right' });
    dot(px0 + 1, yOfH(camH), 2.6, ink(0.85));
    text('相机 ' + Math.round(camH) + ' m', px1 - 6, yOfH(camH) - 5, { col: ink(0.62), size: 8.5, align: 'right' });
  }
  function skyColumn(R, a) {
    var key = (R.s.sunElev || 0).toFixed(2) + '|' + (R.s.sunAzi || 0).toFixed(0);
    var T = R.gen && R.gen.sky;
    if (!T) return null;
    var rel = ((Math.atan2(R.camera.fwd[0], R.camera.fwd[2])) - (R.s.sunAzi || 0) * DEG + Math.PI) % TAU;
    if (rel < 0) rel += TAU;
    var u = Math.round(rel / TAU * 48) / 48;
    var ck = key + '|' + u.toFixed(3);
    var cc = cache.column[ck];
    if (cc) return cc;
    var now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    if (now - (cache.columnT || 0) < 900) {
      var kk = Object.keys(cache.column);
      return kk.length ? cache.column[kk[kk.length - 1]] : null;
    }
    cache.columnT = now;
    var px = R.lutColumn(T, u, null);
    if (!px) return null;
    var rows = T.h, el = [], disp = [];
    var exposure = R.lastExposure || 1;
    for (var i = 0; i < rows; i += 2) {
      var v = i / (rows - 1);
      el.push(-0.06 + (1.5707963 + 0.06) * Math.pow(v, 2.2));
      disp.push(grade([px[i * 4], px[i * 4 + 1], px[i * 4 + 2]], exposure));
    }
    cc = cache.column[ck] = { rows: el.length, el: el, disp: disp };
    if (Object.keys(cache.column).length > 12) cache.column = {};
    return cc;
  }

  // ---------------------------------------------------------------- chapter 05 · water
  function h05(R, t, u, a, c) {
    var sea = R.s.seaLevel || 0;
    // left: absorption against depth, with the shader's own coefficients
    var x0 = S.x0 + 2, x1 = S.x0 + 34, y0 = S.y0 + 66, y1 = S.y1 - 40;
    var abs = (R.s.absorption || 1) / Math.max(R.s.waterClarity || 1, 0.05);
    var sig = [0.34 * abs, 0.065 * abs, 0.009 * abs];
    scrim(x0 - 8, y0 - 18, x1 + 42, y1 + 36, 0.32);
    var n = 40, dMax = 40;
    for (var i = 0; i < n; i++) {
      var d = (i + 0.5) / n * dMax;
      var att = [Math.exp(-sig[0] * d * 1.35), Math.exp(-sig[1] * d * 1.35), Math.exp(-sig[2] * d * 1.35)];
      var col = [mix(0.06, 0.30, att[0]), mix(0.10, 0.62, att[1]), mix(0.14, 0.66, att[2])];
      box(x0, y0 + (i / n) * (y1 - y0), x1 - x0, (y1 - y0) / n + 0.7, rgb01(col, 0.95));
    }
    frame(x0, y0, x1 - x0, y1 - y0, ink(0.2));
    text('深度 0', x0 + 3, y0 + 11, { col: ink(0.7), size: 8.5 });
    for (i = 1; i <= 3; i++) {
      var dd = i * 10, yy = y0 + (dd / dMax) * (y1 - y0);
      line(x1, yy, x1 + 4, yy, ink(0.24), 1);
      text(dd + ' m', x1 + 7, yy + 3, { col: ink(0.34), size: 8.5 });
    }
    text('吸收 σ = (0.34, 0.065, 0.009) /m', x0, y0 - 10, { col: ink(0.5), size: 9 });
    text('红光先走', x0, y1 + 15, { col: warm(0.7), size: 9 });
    text('蓝绿留下', x0, y1 + 26, { col: cool(0.7), size: 9 });
    // right: the hypsometric curve of the field, with the film's waterline on it
    var grid = terrainGrid(R, 96);
    var n2 = grid.n, hMin = 1e9, hMax = -1e9;
    for (i = 0; i < n2 * n2; i++) { var hv = grid.h[i]; if (hv < hMin) hMin = hv; if (hv > hMax) hMax = hv; }
    var nb = 200, bins = new Float32Array(nb);
    for (i = 0; i < n2 * n2; i++) {
      var b = clamp(Math.floor((grid.h[i] - hMin) / (hMax - hMin + 1e-6) * nb), 0, nb - 1);
      bins[b]++;
    }
    var px0 = S.x0 + S.w * 0.30, px1 = S.x1 - 2, py0 = S.y0 + 70, py1 = S.y1 - 52;
    var xOfH = function (h) { return px0 + sat((h - hMin) / (hMax - hMin)) * (px1 - px0); };
    var yOfF = function (f) { return py1 - sat(f) * (py1 - py0); };
    scrim(px0 - 8, py0 - 20, px1 + 6, py1 + 26, 0.30);
    var cum = 0, pts = [[px0, py1]];
    for (i = 0; i < nb; i++) {
      cum += bins[i];
      var hh = hMin + (i + 0.5) / nb * (hMax - hMin);
      pts.push([xOfH(hh), yOfF(cum / (n2 * n2))]);
    }
    var flooded = 0;
    for (i = 0; i < nb; i++) {
      var hb = hMin + (i + 0.5) / nb * (hMax - hMin);
      if (hb <= sea) flooded += bins[i];
    }
    // the area under the curve is the seabed part of the field: the same cumulative the
    // curve itself is drawn from, carried forward instead of re-summed for every bin
    var fill = [[px0, py1]];
    var c2 = 0;
    for (i = 0; i < nb; i++) {
      var hf = hMin + (i + 0.5) / nb * (hMax - hMin);
      if (hf > sea) break;
      c2 += bins[i];
      fill.push([xOfH(hf), yOfF(c2 / (n2 * n2))]);
    }
    fill.push([xOfH(Math.min(sea, hMax)), yOfF(flooded / (n2 * n2))], [px0, yOfF(flooded / (n2 * n2))]);
    poly(fill, null, 'rgba(127,216,232,0.16)', 1);
    poly(pts, warm(0.75), null, 1.2);
    var wx = xOfH(sea), wy = yOfF(flooded / (n2 * n2));
    line(wx, py0, wx, py1, cool(0.6), 1, [3, 3]);
    dot(wx, wy, 2.6, cool(0.95));
    text('水线 ' + (flooded / (n2 * n2) * 100).toFixed(1) + '% 被淹没', wx + 6, wy - 6, { col: cool(0.85), size: 9 });
    text('高度范围 ' + Math.round(hMin) + ' … ' + Math.round(hMax) + ' m', px1, py1 + 30, { col: ink(0.5), size: 9, align: 'right' });
    text('纵轴：低于该高度的比例', px1, py0 - 12, { col: ink(0.3), size: 9, align: 'right' });
    text('16 km 瓦片 · ' + (n2 * n2) + ' 个采样点', px0, py1 + 15, { col: ink(0.3), size: 8.5 });
  }

  // ---------------------------------------------------------------- chapter 06 · reflection
  function h06(R, t, u, a, c) {
    var sd = sunDirOf(R);
    // the row a flat sea would mirror the sun in, and the spread the surface adds
    var p = projDir(c, [sd[0], -sd[1], sd[2]]);
    var mss = 0.003 + 0.00512 * Math.max(R.s.wind || 1, 1) - 0.005;
    if (p && p[1] > -20 && p[1] < H + 20) {
      var pA = projDir(c, [sd[0], -sd[1] + mss, sd[2]]), pB = projDir(c, [sd[0], -sd[1] - mss, sd[2]]);
      if (pA && pB) {
        var yA = Math.min(pA[1], pB[1]), yB = Math.max(pA[1], pB[1]);
        box(0, yA, W, Math.max(1, yB - yA), 'rgba(255,192,120,0.05)');
      }
      line(0, p[1], W, p[1], warm(0.34), 1, [5, 4]);
      text('平面海面会把太阳照在这一行 · 斜率方差 ±' + mss.toFixed(4), W - 12, p[1] - 6,
        { col: warm(0.7), size: 9, align: 'right' });
    }
    // the Fresnel curve
    var x0 = S.x0 + 2, x1 = S.x0 + S.w * 0.72, y0 = S.y0 + 66, y1 = S.y1 - 40;
    scrim(x0 - 6, y0 - 20, x1 + 6, y1 + 42, 0.34);
    var F0 = 0.0204;
    var xOfA = function (deg) { return x0 + (deg / 90) * (x1 - x0); };
    var yOfF = function (f) { return y1 - sat(f) * (y1 - y0); };
    // the range of incident angles this frame's own rays cover
    var rBot = rayAt(c, c.cx, Math.min(H, S.y1 + 40));
    var rTop = rayAt(c, c.cx, Math.max(0, horizonRow(c) - 4));
    var aBot = Math.acos(clamp(Math.abs(rBot[1]), 0, 1)) / DEG;
    var aTop = Math.acos(clamp(Math.abs(rTop[1]), 0, 1)) / DEG;
    var cB = Math.cos(aBot * DEG), cT = Math.cos(aTop * DEG);
    var fB = F0 + (1 - F0) * Math.pow(1 - cB, 5), fT = F0 + (1 - F0) * Math.pow(1 - cT, 5);
    box(xOfA(aBot), yOfF(Math.max(fB, fT)), Math.max(2, xOfA(aTop) - xOfA(aBot)), Math.max(2, Math.abs(yOfF(fT) - yOfF(fB))),
      'rgba(127,216,232,0.16)');
    var pts = [];
    for (var i = 0; i <= 90; i++) pts.push([xOfA(i), yOfF(F0 + (1 - F0) * Math.pow(1 - Math.cos(i * DEG), 5))]);
    var fill = pts.concat([[x1, y1], [x0, y1]]);
    poly(fill, null, 'rgba(255,192,120,0.10)', 1);
    poly(pts, warm(0.8), null, 1.3);
    for (i = 0; i <= 4; i++) {
      var ax = xOfA(i * 22.5);
      line(ax, y1, ax, y1 + 3, ink(0.2), 1);
      text(Math.round(i * 22.5) + '\u00b0', ax, y1 + 13, { col: ink(0.3), size: 8, align: 'center' });
    }
    line(x0, yOfF(1), x1, yOfF(1), ink(0.1), 1, [1, 4]);
    text('F', x0 - 4, yOfF(1) + 3, { col: ink(0.36), size: 8.5, align: 'right' });
    text('掠射角 θ → 菲涅耳反射率 F', x0, y0 - 12, { col: ink(0.5), size: 9.5 });
    text('F(θ) = F₀ + (1−F₀)(1−cos θ)⁵', x1, y1 + 28, { col: ink(0.6), size: 9.5, align: 'right' });
    text('F₀ = ' + F0 + ' · 这一帧覆盖 ' + aBot.toFixed(0) + '\u00b0 … ' + aTop.toFixed(0) + '\u00b0', x0, y1 + 28,
      { col: ink(0.38), size: 9 });
    // the live marker, at the frame's own centre ray
    var rc = rayAt(c, c.cx, c.cy);
    var aC = Math.acos(clamp(Math.abs(rc[1]), 0, 1)) / DEG;
    var fC = F0 + (1 - F0) * Math.pow(1 - Math.cos(aC * DEG), 5);
    line(xOfA(aC), y1, xOfA(aC), yOfF(fC), warm(0.5), 1, [2, 3]);
    dot(xOfA(aC), yOfF(fC), 3, warm(0.95));
    var fRight = aC > 46;
    text('视野中心 ' + aC.toFixed(1) + '\u00b0 · F ' + fC.toFixed(3),
      xOfA(aC) + (fRight ? -6 : 6), yOfF(fC) + (fRight ? 17 : -7),
      { col: warm(0.92), size: 9.5, align: fRight ? 'right' : 'left' });
    // reflection against transmission, as the water splits them
    var bx0 = S.x1 - S.w * 0.2, by0 = S.y0 + 70;
    scrim(bx0 - 8, by0 - 20, S.x1 + 4, by0 + 52, 0.30);
    // one bar, split at this frame's own Fresnel weight, labelled underneath
    box(bx0, by0, S.x1 - bx0, 16, 'rgba(255,192,120,0.30)');
    box(bx0, by0, (S.x1 - bx0) * fC, 16, 'rgba(127,216,232,0.82)');
    frame(bx0, by0, S.x1 - bx0, 16, ink(0.24));
    text('反射 ' + (fC * 100).toFixed(1) + '%', bx0, by0 + 32, { col: cool(0.88), size: 9 });
    text('折射 ' + ((1 - fC) * 100).toFixed(1) + '%', S.x1, by0 + 32, { col: warm(0.88), size: 9, align: 'right' });
    text('掠射角越大，越多来自天空', bx0, by0 + 46, { col: ink(0.42), size: 8.5 });
  }

  // ---------------------------------------------------------------- chapter 07 · clouds
  function h07(R, t, u, a, c) {
    var cb = R.s.cloudBase || 1900, ct = R.s.cloudTop || 3300;
    var x0 = S.x0 + 2, x1 = S.x0 + S.w * 0.33, y0 = S.y0 + 64, y1 = S.y1 - 46;
    var top = 4400;
    var yOfH = function (h) { return y1 - sat(h / top) * (y1 - y0); };
    scrim(x0 - 8, y0 - 18, x1 + 8, y1 + 30, 0.32);
    // the slab, the water below it, and the ray the camera is looking along
    line(x0, y1, x1, y1, ink(0.3), 1);
    box(x0, yOfH(ct), x1 - x0, Math.max(2, yOfH(cb) - yOfH(ct)), 'rgba(255,192,120,0.10)');
    line(x0, yOfH(cb), x1, yOfH(cb), warm(0.42), 1);
    line(x0, yOfH(ct), x1, yOfH(ct), warm(0.42), 1);
    text('云底 ' + Math.round(cb) + ' m', x1, yOfH(cb) - 4, { col: warm(0.6), size: 8.5, align: 'right' });
    text('云顶 ' + Math.round(ct) + ' m', x1, yOfH(ct) - 4, { col: warm(0.6), size: 8.5, align: 'right' });
    text('地面', x0, y1 - 5, { col: ink(0.4), size: 8.5 });
    // The ray's own entry and exit of the slab, from the camera's height and the ray's
    // vertical slope. Cases: below the slab looking up (enters at the base), inside it
    // (enters here), above it looking down (enters at the top - the case the first version
    // got wrong, reporting "the view is below the cloud layer" over a cloud-filled frame),
    // and a ray that never reaches the slab at all.
    var hCam = c.pos[1], sy = c.fwd[1] / Math.max(1e-4, Math.hypot(c.fwd[0], c.fwd[2]));
    var tA = 0, tB = 0;
    if (Math.abs(sy) < 1e-4) {
      if (hCam >= cb && hCam <= ct) tB = 1;                 // horizontal, inside the slab
    } else {
      var t1 = (cb - hCam) / sy, t2 = (ct - hCam) / sy;
      tA = Math.max(0, Math.min(t1, t2));
      tB = Math.max(t1, t2);
      if (tB <= 0) { tA = 0; tB = 0; }                      // the slab is behind the camera
    }
    var span = Math.max(0, tB - tA);
    var rx = mix(x0 + 10, x1 - 34, 0.5);
    if (span > 0) {
      var yA = yOfH(cb), yB = yOfH(ct);
      line(rx - 26, yOfH(hCam), rx + 26, yA, cool(0.5), 1, [3, 3]);
      line(rx + 26, yA, rx - 8, yB, cool(0.5), 1, [3, 3]);
      dot(rx + 26, yA, 2, cool(0.8));
      text('射线穿过 ' + Math.round(span / 1000) + ' km', x0 + 4, yA - 6, { col: cool(0.74), size: 8.5 });
    } else {
      line(rx - 30, yOfH(hCam), rx + 30, yOfH(hCam) - 22, cool(0.5), 1, [3, 3]);
      text(hCam > ct ? '视线朝向云层之上' : '视线在云层之下', rx + 34, yOfH(hCam) - 22, { col: cool(0.6), size: 8.5 });
    }
    dot(rx - 30, yOfH(hCam), 2.4, ink(0.85));
    text('相机 ' + Math.round(hCam) + ' m', x0, yOfH(hCam) + 12, { col: ink(0.55), size: 8.5 });
    // what those two numbers cost: the shader's own step budget, and its shadow samples
    var maxSteps = clamp(16 + (R.s.cloudSteps || 0) * 56 + span / 90, 16, 88);
    text('采样 ' + Math.round(maxSteps) + ' 步（上限 88） · 阴影 6 步', x0, y0 - 10, { col: ink(0.5), size: 9 });
    text('云量 ' + Math.round((R.s.cloudCover || 0) * 100) + '% · 遮挡 ' + (R.s.cloudSun || 1).toFixed(2) + '\u00d7',
      S.x1, y0 - 10, { col: ink(0.4), size: 9, align: 'right' });
    // the three-lobe phase function, evaluated, in polar coordinates
    var cx = S.x1 - S.w * 0.17, cy = (y0 + y1) * 0.5 + 8, rr = Math.min(76, (y1 - y0) * 0.44);
    scrim(cx - rr - 14, cy - rr - 30, cx + rr + 14, cy + rr + 26, 0.32);
    function hg(mu, gg) { var d = 1 + gg * gg - 2 * gg * mu; return (1 - gg * gg) / (4 * Math.PI * Math.max(d, 1e-5) * Math.sqrt(Math.max(d, 1e-5))); }
    function ph(mu) { return hg(mu, 0.72) * 0.70 + hg(mu, -0.30) * 0.18 + (1 / (4 * Math.PI)) * 0.16; }
    var pmax = ph(1), pts2 = [];
    for (var i = 0; i <= 100; i++) {
      var th = (i / 100) * TAU, mu = Math.cos(th);
      var r = rr * Math.pow(ph(mu) / pmax, 0.42);
      pts2.push([cx + Math.cos(th) * r, cy - Math.sin(th) * r * 0.86]);
    }
    g.save();
    g.strokeStyle = ink(0.12); g.lineWidth = 1;
    g.beginPath(); g.arc(cx, cy, rr, 0, TAU); g.stroke();
    g.restore();
    poly(pts2, warm(0.7), 'rgba(255,192,120,0.09)', 1.2);
    line(cx, cy, cx + rr * 1.06, cy, ink(0.14), 1, [2, 3]);
    text('前向', cx + rr * 1.06, cy + 11, { col: warm(0.6), size: 8, align: 'right' });
    var rd = rayAt(c, c.cx, c.cy), sd = sunDirOf(R);
    var mu = rd[0] * sd[0] + rd[1] * sd[1] + rd[2] * sd[2];
    var th = Math.acos(clamp(mu, -1, 1));
    var r = rr * Math.pow(ph(mu) / pmax, 0.42);
    line(cx, cy, cx + r, cy - r * 0.86, cool(0.8), 1.3);
    dot(cx + r, cy - r * 0.86, 2.6, cool(0.95));
    text('视线 ' + (th / DEG).toFixed(0) + '\u00b0', cx + r - 2, cy - r * 0.86 - 6, { col: cool(0.85), size: 8.5, align: 'right' });
    text('p(θ) 前向 0.70 · 背向 0.18 · 均向 0.16', S.x1, y1 + 15, { col: ink(0.36), size: 8.5, align: 'right' });
    text('米氏 g = 0.72 · 三叶相位函数', cx, cy - rr - 12, { col: ink(0.46), size: 9, align: 'center' });
  }
  function chunk2(arr) { var out = []; for (var i = 0; i < arr.length; i += 2) out.push([arr[i], arr[i + 1]]); return out; }

  // ---------------------------------------------------------------- chapter 08 · grade
  function h08(R, t, u, a, c) {
    var x0 = S.x0 + 2, x1 = S.x1 - 2, y0 = S.y0 + 66, y1 = S.y1 - 46;
    var s0 = -14, s1 = 10;                     // log2 of the luminance after exposure: the
                                               // range the strip's second channel covers
    scrim(x0 - 6, y0 - 20, x1 + 6, y1 + 32, 0.34);
    var xOfS = function (s) { return x0 + (s - s0) / (s1 - s0) * (x1 - x0); };
    var yOfO = function (o) { return y1 - sat(o) * (y1 - y0); };
    for (var s = -4; s <= 8; s += 2) {
      line(xOfS(s), y0, xOfS(s), y1, ink(0.08), 1, [1, 4]);
      text('2^' + s, xOfS(s), y1 + 13, { col: ink(0.3), size: 8, align: 'center' });
    }
    text('曝光后的亮度（对数轴）', (x0 + x1) * 0.5, y1 + 26, { col: ink(0.34), size: 8.5, align: 'center' });
    // the histogram of the frame itself, on the same axis
    var h = histOf(R);
    if (h) {
      var bins = h.hist.length, maxv = 1;
      for (var i = 0; i < bins; i++) maxv = Math.max(maxv, h.hist[i]);
      var bw = (x1 - x0) / bins;
      // bin b covers s0 + b*step .. s0 + (b+1)*step stops, so its centre is at (b + 0.5)
      var step = (s1 - s0) / bins;
      for (i = 0; i < bins; i++) {
        var bb = Math.pow(h.hist[i] / maxv, 0.42);
        var hh = bb * (y1 - y0) * 0.62;
        var sBin = s0 + (i + 0.5) * step;
        box(xOfS(sBin) + 0.4, y1 - hh, Math.max(1, bw - 1), hh, 'rgba(127,216,232,0.30)');
      }
      // the median, from the same bins
      var tot = 0, med = 0, csum = 0;
      for (i = 0; i < bins; i++) tot += h.hist[i];
      for (i = 0; i < bins; i++) { csum += h.hist[i]; if (csum >= tot * 0.5) { med = s0 + (i + 0.5) * step; break; } }
      line(xOfS(med), y0, xOfS(med), y1, ink(0.4), 1, [2, 3]);
      text('中位 2^' + med.toFixed(1), xOfS(med) + 4, y0 + 10, { col: ink(0.6), size: 9 });
      // how much of the frame is at the floor and at the ceiling
      var lo = h.hist[0] / tot * 100, hi = h.hist[bins - 1] / tot * 100;
      text('最暗一档 ' + lo.toFixed(2) + '% · 最亮一档 ' + hi.toFixed(2) + '%', x1, y1 + 26,
        { col: ink(0.34), size: 8.5, align: 'right' });
    }
    // the tone curve, the same fit the post pass uses
    for (var chI = 0; chI < 3; chI++) {
      var cp = [];
      for (i = 0; i <= 80; i++) {
        var sv = s0 + (i / 80) * (s1 - s0);
        var v = Math.pow(2, sv);
        var lin = [chI === 0 ? v : 0, chI === 1 ? v : 0, chI === 2 ? v : 0];
        var d = grade(lin, 1.0);
        cp.push([xOfS(sv), yOfO(d[chI])]);
      }
      poly(cp, chI === 1 ? ink(0.62) : (chI === 0 ? 'rgba(255,140,120,0.28)' : 'rgba(140,190,255,0.28)'), null, 1.1);
    }
    line(x0, yOfO(1), x1, yOfO(1), ink(0.10), 1, [1, 4]);
    line(x0, yOfO(0.5), x1, yOfO(0.5), ink(0.08), 1, [1, 4]);
    text('中灰 0.18', x0 + 4, yOfO(0.18) - 4, { col: ink(0.3), size: 8 });
    text('ACES（Stephen Hill 拟合）', x0, y0 - 12, { col: ink(0.55), size: 9.5 });
    text('曝光 ' + (R.lastExposure || 0).toFixed(3) + '\u00d7', x1, y0 - 12, { col: warm(0.8), size: 9.5, align: 'right' });
  }
  function gradeDisplayChannel(lin) {
    return grade(lin, 1.0);
  }
  function histOf(R) {
    var t = R.s.time || 0;
    var hc = cache.hist;
    if (hc.h && Math.abs(t - hc.t) < 0.25) return hc.h;
    var h = null;
    try { h = R.histogram(48, 'log2'); } catch (e) { h = null; }
    if (h && h.hist) { cache.hist = { t: t, h: h }; return h; }
    return hc.h || null;
  }

  // ---------------------------------------------------------------- chapter 09 · real time
  var msRing = new Float32Array(240), msN = 0;
  function pushMs(ms) { msRing[msN % msRing.length] = ms; msN++; }
  function msStats() {
    var n = Math.min(msN, msRing.length);
    if (!n) return { p50: 0, p95: 0, max: 0, n: 0 };
    var v = [];
    for (var i = 0; i < n; i++) v.push(msRing[(msN - 1 - i + msRing.length * 2) % msRing.length]);
    v.sort(function (a, b) { return a - b; });
    return { p50: v[Math.floor(n * 0.5)], p95: v[Math.floor(n * 0.95)], max: v[n - 1], n: n };
  }
  function h09(R, t, u, a, c) {
    // the camera path, plan view, with the field's own land/sea mask under it
    var x0 = S.x0 + 2, x1 = S.x0 + S.w * 0.46, y0 = S.y0 + 66, y1 = S.y1 - 40;
    var grid = terrainGrid(R, 64);
    var span = 9000, hf = span * 0.5, sea = R.s.seaLevel || 0;
    var xOfW = function (wx) { return x0 + sat((wx + hf) / span) * (x1 - x0); };
    var yOfW = function (wz) { return y0 + sat((wz + hf) / span) * (y1 - y0); };
    var nx = 34, ny = 34, cell = (x1 - x0) / nx, cellY = (y1 - y0) / ny;
    scrim(x0 - 8, y0 - 18, x1 + 8, y1 + 10, 0.34, true);
    for (var j = 0; j < ny; j++) {
      for (var i = 0; i < nx; i++) {
        var wx = -hf + (i + 0.5) / nx * span, wz = -hf + (j + 0.5) / ny * span;
        var gi = clamp(Math.round((wx / grid.half * 0.5 + 0.5) * (grid.n - 1)), 0, grid.n - 1);
        var gj = clamp(Math.round((wz / grid.half * 0.5 + 0.5) * (grid.n - 1)), 0, grid.n - 1);
        var hv = grid.h[gj * grid.n + gi];
        var col = hv > sea
          ? (hv > 900 ? 'rgba(196,186,172,0.34)' : (hv > 120 ? 'rgba(122,108,88,0.34)' : 'rgba(86,84,70,0.34)'))
          : 'rgba(26,52,70,0.46)';
        box(x0 + i * cell, y0 + j * cellY, cell + 0.6, cellY + 0.6, col);
      }
    }
    frame(x0, y0, x1 - x0, y1 - y0, ink(0.16));
    // the authored camera path
    var keys = (SS.timeline && SS.timeline.keys) || [];
    var path = [];
    for (i = 0; i < keys.length; i++) path.push([xOfW(keys[i].x), yOfW(keys[i].z)]);
    if (path.length > 1) {
      path.push(path[0]);
      poly(path, warm(0.5), null, 1.2, [4, 3]);
    }
    for (i = 0; i < path.length; i++) dot(path[i][0], path[i][1], 1.6, ink(0.4));
    text('01', path[0] ? path[0][0] + 5 : 0, path[0] ? path[0][1] - 4 : 0, { col: ink(0.5), size: 8.5 });
    text('09', path[path.length - 2] ? path[path.length - 2][0] + 5 : 0, path[path.length - 2] ? path[path.length - 2][1] + 10 : 0,
      { col: ink(0.5), size: 8.5 });
    var cp = [xOfW(c.pos[0]), yOfW(c.pos[2])];
    dot(cp[0], cp[1], 3, warm(0.95));
    var l = Math.hypot(c.fwd[0], c.fwd[2]) || 1;
    line(cp[0], cp[1], cp[0] + c.fwd[0] / l * 16, cp[1] + c.fwd[2] / l * 16, warm(0.85), 1.4);
    text('相机', cp[0] + 6, cp[1] + 3, { col: warm(0.85), size: 8.5 });
    text('航线 · 18 km 视野', x0, y1 + 16, { col: ink(0.54), size: 9 });
    text('回到起点 · 环路闭合', x1, y1 + 16, { col: ink(0.36), size: 9, align: 'right' });

    // the frame-time trace, along the bottom, above the timeline
    var tx0 = W * 0.05, tx1 = W * 0.95, ty1 = H * 0.897, ty0 = H * 0.862;
    var st = msStats();
    var top = Math.max(34, st.p95 * 1.25);
    var yOfMs = function (ms) { return ty1 - sat(ms / top) * (ty1 - ty0); };
    scrim(tx0 - 6, ty0 - 14, tx1 + 6, ty1 + 8, 0.34);
    box(tx0, ty0, tx1 - tx0, ty1 - ty0, 'rgba(255,255,255,0.02)');
    line(tx0, yOfMs(16.7), tx1, yOfMs(16.7), cool(0.35), 1, [3, 3]);
    line(tx0, yOfMs(33.3), tx1, yOfMs(33.3), coral(0.3), 1, [3, 3]);
    text('16.7 ms · 60 fps', tx1 - 4, yOfMs(16.7) - 4, { col: cool(0.6), size: 8.5, align: 'right' });
    text('33.3 ms · 30 fps', tx1 - 4, yOfMs(33.3) + 11, { col: coral(0.55), size: 8.5, align: 'right' });
    frame(tx0, ty0, tx1 - tx0, ty1 - ty0, ink(0.12));
    var n = Math.min(msN, msRing.length);
    if (n > 2) {
      var tp = [];
      for (i = 0; i < n; i++) {
        var idx = (msN - n + i + msRing.length * 2) % msRing.length;
        tp.push([mix(tx0, tx1, i / (n - 1)), yOfMs(msRing[idx])]);
      }
      poly(tp, warm(0.8), 'rgba(255,192,120,0.08)', 1.2);
    }
    text('帧时间 p50 ' + st.p50.toFixed(1) + ' ms · p95 ' + st.p95.toFixed(1) + ' ms · ' + st.n + ' 帧',
      tx1 - 4, ty0 - 6, { col: ink(0.6), size: 9, align: 'right' });
    text('内部分辨率 ' + R.targets.w + '\u00d7' + R.targets.h + ' · 比例 ' + Math.round((R.stats.scale || 1) * 100) + '%',
      tx0 + 4, ty0 + 11, { col: ink(0.45), size: 9 });
    text('每帧的代价', tx0, ty0 - 20, { col: ink(0.5), size: 9 });
  }

  // ---------------------------------------------------------------- dispatch
  var HEROES = [h01, h02, h03, h04, h05, h06, h07, h08, h09];

  function draw(R, app) {
    var t = (app && app.time !== undefined) ? app.time : 0;
    var pr = SS.timeline ? SS.timeline.progress(t) : { index: 0 };
    var ch = clamp(pr.index | 0, 0, 8);
    var c = (SS.timeline ? SS.timeline.chapters[ch] : null) || { t0: 0, t1: 1 };
    var u = sat((t - c.t0) / Math.max(0.001, c.t1 - c.t0));
    var env = sat((u - 0.03) / 0.16) * sat((1 - u) / 0.09);
    g.clearRect(0, 0, W, H);
    if (env <= 0.01) { cur = ch; return; }
    var cam_ = cam(R);
    g.save();
    g.globalAlpha = env;
    drawBase(R, ch, u);
    if (ch === 0) drawRail(R, u, sat((u - 0.02) / 0.2));
    HEROES[ch](R, t, u, env, cam_);
    g.restore();
    /* Outside the layer's own fade envelope: the badge names what the frame *is*, so it has
       to be readable at the moment the layer appears - inside the envelope it inherited the
       fade and came up at a tenth of its weight. */
    drawViewBadge(R);
    drawReadouts(R, ch, u, env * 0.95);
    cur = ch;
  }

  SS.mg = {
    enter: function (R) {
      cv = document.getElementById('mg');
      if (!cv) return false;
      this.resize();
      built = true;
      return true;
    },
    resize: function () {
      W = Math.max(320, window.innerWidth);
      H = Math.max(240, window.innerHeight);
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      if (cv) {
        cv.width = Math.round(W * dpr);
        cv.height = Math.round(H * dpr);
        g = cv.getContext('2d');
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.textBaseline = 'alphabetic';
      }
      S.x0 = W * 0.25; S.x1 = W * 0.655;
      S.y0 = H * 0.19; S.y1 = H * 0.685;
      S.w = S.x1 - S.x0; S.h = S.y1 - S.y0;
      lastDraw = -1e9;
    },
    tick: function (R, app) {
      if (!built || !g || !R || !R.ready) return false;
      var now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      // the trace wants the interval between frames, which is what "real time" means; the
      // renderer's own ms is kept when it is the larger of the two (it is the GPU's share)
      var gap = (lastTick > 0 && now - lastTick < 400) ? now - lastTick : 0;
      lastTick = now;
      pushMs(Math.max(R.stats && R.stats.ms ? R.stats.ms : 0, gap, 0.1));
      var pr = SS.timeline ? SS.timeline.progress((app && app.time) || 0) : { index: 0 };
      var changed = (pr.index | 0) !== cur;
      if (!changed && now - lastDraw < 45) return true;
      lastDraw = now;
      frames++;
      try { draw(R, app); } catch (e) {
        if (window.console) console.warn('mg: ' + e.message);
        try { g.clearRect(0, 0, W, H); } catch (e2) { }
      }
      return true;
    },
    clear: function () {
      if (g) g.clearRect(0, 0, W, H);
      cache = { prof: {}, pano: {}, grid: {}, hist: {}, sun: {}, column: {}, curve: {} };
      cur = -1;
      return true;
    },
    // the caches are keyed by the camera's position, so a reseed must drop them
    invalidate: function () {
      cache.grid = {}; cache.pano = {}; cache.prof = {};
      return true;
    },
    // for the verification tools
    state: function () {
      return {
        chapter: cur, stage: { x0: S.x0, y0: S.y0, x1: S.x1, y1: S.y1 }, frames: frames, msN: msN,
        pano: lastPano ? { na: lastPano.na, min: +lastPano.min.toFixed(2), max: +lastPano.max.toFixed(2) } : null,
        prof: lastProf ? { n: lastProf.n, exit: Math.round(lastProf.exit), hMin: Math.round(lastProf.hMin), hMax: Math.round(lastProf.hMax) } : null,
        texts: window.__mglog ? window.__mglog.slice() : null
      };
    }
  };
})();
