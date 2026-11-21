/* Everything drawn on top of the living artwork, with Canvas 2D.
 * Pure function of time: MVOverlay.draw(ctx, k, layoutName, t, frame) where frame carries
 * the camera state and picture rect computed by app.js (the same ones the WebGL scene uses).
 */
(function () {
  "use strict";
  var D = window.MV_DATA, TL = window.MVTimeline;
  var CLIP = D.clip, SONG = D.song;
  var DUR = CLIP.end - CLIP.start;
  var SANS = '"MV Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  var SERIF = '"MV Serif", "Songti SC", "STSong", "SimSun", serif';
  var clamp = TL.clamp, smooth = TL.smooth, ease = TL.ease;

  // ---------------------------------------------------------------- layouts (stage units)
  var LAYOUTS = {
    landscape: {
      W: 1920, H: 1080,
      cover: { x: 250, y: 140, s: 620 },
      info: { x: 250, y: 826, w: 620, title: 40, artist: 27 },
      bar: { x: 250, y: 918, w: 620 },
      ctrl: { cx: 560, y: 1010 },
      lyr: { x: 1010, w: 800, top: 70, bottom: 1010, anchor: 360, size: 50, lh: 68, gap: 30 },
      cine: { size: 80, rowGap: 1.32 },
      pill: { x: 48, y: 968, w: 600, h: 76 },
      shots: [
        { x: 140, y: 800, align: "left", indent: 1.6 },
        { x: 140, y: 470, align: "left", indent: 1.2 },
        { x: 140, y: 760, align: "left", indent: 1.4 },
        { x: 140, y: 470, align: "left", indent: 1.0 },
        { x: 140, y: 840, align: "left", indent: 1.4 },
        { x: 140, y: 640, align: "left", indent: 1.4 },
        { x: 140, y: 330, align: "left", indent: 1.0 },
        { x: 1790, y: 720, align: "right", indent: 0 }
      ]
    },
    portrait: {
      W: 1080, H: 1920,
      cover: { x: 190, y: 150, s: 700 },
      info: { x: 190, y: 940, w: 700, title: 44, artist: 30 },
      bar: { x: 190, y: 1724, w: 700 },
      ctrl: { cx: 540, y: 1822 },
      lyr: { x: 130, w: 830, top: 1010, bottom: 1660, anchor: 1092, size: 54, lh: 74, gap: 30 },
      cine: { size: 74, rowGap: 1.36 },
      pill: { x: 60, y: 1772, w: 960, h: 84 },
      shots: [
        { x: 540, y: 1430, align: "center" },
        { x: 540, y: 1300, align: "center" },
        { x: 540, y: 1380, align: "center" },
        { x: 540, y: 1460, align: "center" },
        { x: 540, y: 1520, align: "center" },
        { x: 540, y: 1300, align: "center" },
        { x: 540, y: 780, align: "center" },
        { x: 540, y: 1460, align: "center" }
      ]
    }
  };

  function mulberry(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function spring(x) { if (x <= 0) return 0; var w = 10; return 1 - (1 + w * x) * Math.exp(-w * x); }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function fmt(sec) {
    sec = Math.max(0, Math.floor(sec + 1e-6));
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  // ---------------------------------------------------------------- audio tables
  function decode(b64) {
    var bin = atob(b64), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  var A = D.audio, SPEC = decode(A.spec), LOW = decode(A.low);
  function fidx(t) { return clamp(t * A.fps, 0, A.frames - 1.001); }
  function low(t) { var f = fidx(t), i = Math.floor(f), u = f - i; return (LOW[i] * (1 - u) + LOW[i + 1] * u) / 255; }
  function band(b, t) { var f = fidx(t), i = Math.floor(f), u = f - i, n = A.bands; return (SPEC[i * n + b] * (1 - u) + SPEC[(i + 1) * n + b] * u) / 255; }

  function gain(t) {
    var g = 1;
    if (t < CLIP.fadeIn) g = Math.sin(Math.PI / 2 * clamp(t / CLIP.fadeIn, 0, 1));
    var o = DUR - CLIP.fadeOut;
    if (t > o) g *= 0.5 + 0.5 * Math.cos(Math.PI * clamp((t - o) / CLIP.fadeOut, 0, 1));
    if (t >= DUR) g = 0;
    return g;
  }

  // ---------------------------------------------------------------- resources
  var R = { cover: null, depth: null, layouts: {} };

  // ---------------------------------------------------------------- player lyric column
  var LEAD = 0.32;
  function layoutColumn(ctx, L) {
    var ly = L.lyr, items = [], y = 0;
    ctx.font = "700 " + ly.size + "px " + SANS;
    var track = ly.size * 0.03;
    D.lines.forEach(function (ln) {
      if (ln.kind === "interlude") {
        items.push({ ln: ln, y: y, h: ly.lh * 0.9, rows: [] });
        y += ly.lh * 0.9 + ly.gap;
        return;
      }
      var chars = Array.from(ln.text);
      var widths = chars.map(function (c) { return c === " " ? ly.size * 0.42 : ctx.measureText(c).width + track; });
      var total = widths.reduce(function (a, b) { return a + b; }, 0);
      var rows = [];
      if (total <= ly.w) rows.push([0, chars.length]);
      else {
        var br = chars.indexOf(" ");
        if (br < 0) br = ln.br;
        if (br == null) {
          var acc = 0; br = chars.length;
          for (var i = 0; i < chars.length; i++) { acc += widths[i]; if (acc > ly.w) { br = i; break; } }
        }
        rows.push([0, br]);
        rows.push([chars[br] === " " ? br + 1 : br, chars.length]);
      }
      var glyphs = [];
      rows.forEach(function (r, ri) {
        var x = 0;
        for (var i = r[0]; i < r[1]; i++) { glyphs.push({ ch: chars[i], x: x, w: widths[i], row: ri, t: ln.t[i] }); x += widths[i]; }
      });
      var h = rows.length * ly.lh;
      items.push({ ln: ln, y: y, h: h, rows: rows, glyphs: glyphs });
      y += h + ly.gap;
    });
    return items;
  }
  function activeIndex(items, st) {
    var k = 0;
    for (var i = 0; i < items.length; i++) if (items[i].ln.start - LEAD <= st) k = i;
    return k;
  }
  function lineState(items, i, st) {
    var ln = items[i].ln;
    var up = smooth(ln.start - LEAD, ln.start - LEAD + 0.38, st);
    var next = i + 1 < items.length ? items[i + 1].ln.start : 1e9;
    var off = Math.min(next, ln.end + 1.6);
    return up * (1 - smooth(off - LEAD, off - LEAD + 0.38, st));
  }
  function scrollFor(items, i, st) {
    var s = items[0].y;
    for (var j = 1; j < items.length; j++) {
      var T = items[j].ln.start - LEAD;
      if (T > st) break;
      s += (items[j].y - items[j - 1].y) * spring(st - T - clamp((i - j) * 0.05, 0, 0.32));
    }
    return s;
  }
  // soft focus: draw only the shadow of a glyph, from far off the canvas
  function blurText(ctx, ch, x, y, blur, color, k) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur * k;
    ctx.shadowOffsetX = 10000 * k;
    ctx.fillStyle = "#000";
    ctx.fillText(ch, x - 10000, y);
    ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0;
  }
  function drawColumnLine(ctx, it, ly, st, a, k, blur) {
    var dim = 0.30 + 0.10 * a, bright = 0.30 + 0.70 * a;
    for (var g = 0; g < it.glyphs.length; g++) {
      var gl = it.glyphs[g];
      if (gl.ch === " ") continue;
      var p = gl.t ? clamp((st - gl.t[0]) / Math.max(0.06, gl.t[1] - gl.t[0]), 0, 1) : 0;
      var y = gl.row * ly.lh - 3 * a * (p > 0 ? spring(p * 0.6) : 0), x = gl.x;
      if (blur > 0.4) { blurText(ctx, gl.ch, x, y, blur, "rgba(255,255,255," + (p >= 1 ? bright : dim).toFixed(3) + ")", k); continue; }
      if (p <= 0) ctx.fillStyle = "rgba(255,255,255," + dim.toFixed(3) + ")";
      else if (p >= 1) ctx.fillStyle = "rgba(255,255,255," + bright.toFixed(3) + ")";
      else {
        var edge = 0.45, s0 = clamp(p * (1 + edge) - edge, 0, 1), s1 = clamp(p * (1 + edge), 0, 1);
        var grd = ctx.createLinearGradient(x, 0, x + gl.w, 0);
        grd.addColorStop(s0, "rgba(255,255,255," + bright.toFixed(3) + ")");
        grd.addColorStop(Math.max(s0, s1), "rgba(255,255,255," + dim.toFixed(3) + ")");
        ctx.fillStyle = grd;
      }
      if (a > 0.5 && gl.t && st >= gl.t[0] && st <= gl.t[1] + 0.25) {
        var held = clamp((gl.t[1] - gl.t[0] - 0.25) / 0.5, 0, 1);
        ctx.shadowColor = "rgba(255,226,190," + (0.35 + 0.4 * held).toFixed(3) + ")";
        ctx.shadowBlur = (10 + 16 * held) * k;
      }
      ctx.fillText(gl.ch, x, y);
      ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
    }
  }
  function drawInterludeDots(ctx, it, ly, st, a, t) {
    var ln = it.ln, u = clamp((st - ln.start) / (ln.end - ln.start), 0, 1), lo = low(t);
    var r = ly.size * 0.16, gap = r * 3.4, cy = it.h * 0.5;
    for (var i = 0; i < 3; i++) {
      var fill = clamp(u * 3 - i, 0, 1);
      var breathe = 1 + a * (0.10 * Math.sin(st * Math.PI * (SONG.bpm / 60)) + 0.12 * lo);
      ctx.fillStyle = "rgba(255,255,255," + (0.28 + 0.72 * fill * a).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(r + i * gap, cy, r * breathe * (0.85 + 0.15 * fill), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function drawColumn(ctx, lay, t, st, k, alpha, dx) {
    if (alpha <= 0.003) return;
    var L = lay.L, ly = L.lyr, items = lay.column, k0 = activeIndex(items, st);
    ctx.font = "700 " + ly.size + "px " + SANS;
    ctx.textBaseline = "alphabetic";
    for (var i = 0; i < items.length; i++) {
      var it = items[i], y = ly.anchor + it.y - scrollFor(items, i, st);
      if (y + it.h < ly.top - 40 || y > ly.bottom + 40) continue;
      var a = lineState(items, i, st), dist = Math.abs(i - k0);
      var blur = (1 - a) * Math.min(dist, 4) * 1.2, scale = 0.955 + 0.045 * a;
      var mid = y + it.h * 0.5;
      var edgeA = smooth(ly.top - 20, ly.top + 110, mid) * (1 - smooth(ly.bottom - 150, ly.bottom + 10, mid));
      if (edgeA <= 0.003) continue;
      ctx.save();
      ctx.globalAlpha = edgeA * alpha;
      ctx.translate(ly.x + dx, y);
      ctx.scale(scale, scale);
      if (it.ln.kind === "interlude") drawInterludeDots(ctx, it, ly, st, a, t);
      else { ctx.translate(0, ly.size * 0.98); drawColumnLine(ctx, it, ly, st, a, k * scale, blur); }
      ctx.restore();
    }
  }

  // ---------------------------------------------------------------- player chrome
  function drawTimeText(ctx, text, x, y, align) {
    var cell = ctx.measureText("0").width, colon = ctx.measureText(":").width, minus = ctx.measureText("-").width;
    var parts = Array.from(text), w = 0;
    parts.forEach(function (c) { w += c === ":" ? colon : c === "-" ? minus : cell; });
    var px = align === "right" ? x - w : x;
    ctx.textAlign = "center";
    parts.forEach(function (c) { var cw = c === ":" ? colon : c === "-" ? minus : cell; ctx.fillText(c, px + cw / 2, y); px += cw; });
    ctx.textAlign = "left";
  }
  function tri(ctx, x, y, w, h, dir) {
    ctx.beginPath();
    if (dir > 0) { ctx.moveTo(x, y - h / 2); ctx.lineTo(x + w, y); ctx.lineTo(x, y + h / 2); }
    else { ctx.moveTo(x + w, y - h / 2); ctx.lineTo(x, y); ctx.lineTo(x + w, y + h / 2); }
    ctx.closePath(); ctx.fill();
  }
  function eqBars(ctx, x, y, t, scale) {
    [3, 8, 13, 18].forEach(function (b, i) {
      var v = 0.18 + 0.82 * Math.pow(band(b, t), 1.6), h = (6 + 22 * v) * scale;
      roundRect(ctx, x + i * 8 * scale, y - h, 5 * scale, h, 2 * scale); ctx.fill();
    });
  }
  function drawPlayerChrome(ctx, L, t, st, alpha, dy) {
    if (alpha <= 0.003) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(0, dy);
    var I = L.info, B = L.bar, C = L.ctrl;
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#fff";
    ctx.font = "700 " + I.title + "px " + SANS;
    ctx.fillText(SONG.title, I.x, I.y);
    ctx.fillStyle = "rgba(255,255,255,0.62)";
    ctx.font = "400 " + I.artist + "px " + SANS;
    ctx.fillText(SONG.artist, I.x, I.y + I.artist * 1.55);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    eqBars(ctx, I.x + I.w - 30, I.y - 2, t, 1);
    var f = clamp(st / SONG.total, 0, 1);
    roundRect(ctx, B.x, B.y - 3, B.w, 6, 3); ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.fill();
    roundRect(ctx, B.x, B.y - 3, Math.max(6, B.w * f), 6, 3); ctx.fillStyle = "rgba(255,255,255,0.88)"; ctx.fill();
    ctx.font = "500 20px " + SANS;
    ctx.fillStyle = "rgba(255,255,255,0.58)";
    drawTimeText(ctx, fmt(st), B.x, B.y + 34, "left");
    drawTimeText(ctx, "-" + fmt(SONG.total - st), B.x + B.w, B.y + 34, "right");
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    tri(ctx, C.cx - 190, C.y, 24, 28, -1); tri(ctx, C.cx - 166, C.y, 24, 28, -1);
    tri(ctx, C.cx + 142, C.y, 24, 28, 1); tri(ctx, C.cx + 166, C.y, 24, 28, 1);
    roundRect(ctx, C.cx - 17, C.y - 22, 11, 44, 3); ctx.fill();
    roundRect(ctx, C.cx + 6, C.y - 22, 11, 44, 3); ctx.fill();
    ctx.restore();
  }

  // the mini player that stays on screen while the artwork fills the frame
  function drawPill(ctx, L, t, st, alpha) {
    if (alpha <= 0.003) return;
    var P = L.pill, y = P.y + (1 - alpha) * 24;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 0;
    roundRect(ctx, P.x, y, P.w, P.h, P.h / 2);
    ctx.fillStyle = "rgba(16,11,11,0.42)"; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.14)"; ctx.lineWidth = 1; ctx.stroke();
    var th = P.h - 20, tx = P.x + 10, ty = y + 10;
    ctx.save(); roundRect(ctx, tx, ty, th, th, th / 2); ctx.clip();
    if (R.cover) {
      // the thumbnail turns slowly, like a record
      ctx.translate(tx + th / 2, ty + th / 2); ctx.rotate(st * 0.35);
      ctx.drawImage(R.cover, -th / 2, -th / 2, th, th);
    }
    ctx.restore();
    var x0 = tx + th + 18;
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#fff";
    ctx.font = "700 " + Math.round(P.h * 0.30) + "px " + SANS;
    ctx.fillText(SONG.title, x0, y + P.h * 0.46);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "400 " + Math.round(P.h * 0.22) + "px " + SANS;
    ctx.fillText(SONG.artist, x0, y + P.h * 0.78);
    ctx.font = "500 " + Math.round(P.h * 0.22) + "px " + SANS;
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    drawTimeText(ctx, fmt(st) + " / " + fmt(SONG.total), P.x + P.w - 92, y + P.h * 0.60, "right");
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    eqBars(ctx, P.x + P.w - 66, y + P.h * 0.66, t, 0.9);
    // progress as a hairline along the bottom of the pill
    var f = clamp(st / SONG.total, 0, 1), inset = P.h / 2;
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(P.x + inset, y + P.h - 4, P.w - inset * 2, 2);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillRect(P.x + inset, y + P.h - 4, (P.w - inset * 2) * f, 2);
    ctx.restore();
  }

  // ---------------------------------------------------------------- cinematic lyrics
  var CHORUS0 = D.lines.findIndex(function (l) { return l.text && l.text.indexOf("如果明天") === 0; });
  function layoutCine(ctx, L) {
    var out = [], S = L.cine.size;
    ctx.font = "600 " + S + "px " + SERIF;
    for (var i = 0; i < 8; i++) {
      var ln = D.lines[CHORUS0 + i], sh = L.shots[i];
      var chars = Array.from(ln.text);
      var br = chars.indexOf(" "); if (br < 0) br = ln.br;
      var rows = [[0, br], [chars[br] === " " ? br + 1 : br, chars.length]];
      var track = S * 0.10;
      var glyphs = [];
      rows.forEach(function (r, ri) {
        var w = 0, list = [];
        for (var j = r[0]; j < r[1]; j++) { var cw = ctx.measureText(chars[j]).width + track; list.push({ j: j, w: cw }); w += cw; }
        w -= track;
        var x0 = sh.align === "left" ? sh.x + (ri ? S * (sh.indent || 0) : 0)
          : sh.align === "right" ? sh.x - w - (ri ? 0 : S * (sh.indent || 0)) : sh.x - w / 2;
        var x = x0;
        list.forEach(function (g) {
          glyphs.push({ ch: chars[g.j], x: x, y: sh.y + ri * S * L.cine.rowGap, w: g.w - track, row: ri, t: ln.t[g.j], j: g.j });
          x += g.w;
        });
      });
      out.push({ ln: ln, glyphs: glyphs, idx: i });
    }
    return out;
  }

  function charProgress(g, st) { return g.t ? clamp((st - g.t[0]) / Math.max(0.14, g.t[1] - g.t[0]), 0, 1) : 0; }

  function drawCine(ctx, lay, t, st, k, F) {
    var L = lay.L, S = L.cine.size, lines = lay.cine;
    ctx.font = "600 " + S + "px " + SERIF;
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    for (var i = 0; i < lines.length; i++) {
      var Lc = lines[i], ln = Lc.ln;
      var next = i + 1 < lines.length ? lines[i + 1].ln.start : ln.end + 1.4;
      var tin = ln.start - 0.55, tout = Math.min(next - 0.30, ln.end + 1.2);
      if (st < tin - 0.1 || st > tout + 0.8) continue;
      // leave quickly when the next line follows close behind
      var outDur = clamp(next - tout + 0.1, 0.35, 0.7);
      var lineIn = smooth(tin, tin + 0.45, st);
      var out = smooth(tout, tout + outDur, st);
      var cam = F.cam;
      for (var g = 0; g < Lc.glyphs.length; g++) {
        var G = Lc.glyphs[g];
        var p = charProgress(G, st), e = ease(p);
        var x = G.x, y = G.y, sc = 1, alpha, blur, glow = 0;
        // waiting: a faint, out-of-focus ghost; sung: rises into focus
        alpha = lineIn * (0.20 + 0.80 * e);
        blur = 7 * (1 - e) + out * (4 + g * 0.6);
        y += 16 * (1 - e) - out * (18 + g * 1.5);
        if (G.t && st >= G.t[0] && st <= G.t[1] + 0.35) glow = clamp((st - G.t[0]) / 0.12, 0, 1) * (1 - clamp((st - G.t[1]) / 0.35, 0, 1));
        sc = 1.08 - 0.08 * e;
        // per-line direction
        if (i === 1 && G.row === 1) {
          // 看不见我的心: the words go soft as the focus slips past the walker
          var soft = smooth(60.0, 60.9, st);
          blur += soft * 2.4; alpha *= 1 - soft * 0.25;
        } else if (i === 2) {
          x += 46 * (1 - e) - out * 60; blur += 3 * (1 - e);
        } else if (i === 3) {
          var bag = G.ch === "包" || G.ch === "袱";
          if (bag && p > 0) y += 10 * Math.sin(Math.min(1, p) * Math.PI) - 26 * smooth(G.t[1], G.t[1] + 2.0, st);
          y -= 30 * smooth(ln.end - 0.2, ln.end + 1.5, st);
        } else if (i === 4) {
          // characters travel in from the vanishing point down the road
          var vp = F.vp;
          if (vp) {
            var tr = 1 - ease(clamp((st - (G.t ? G.t[0] - 0.28 : 0)) / 0.36, 0, 1));
            x += (vp[0] - x) * tr * 0.9; y += (vp[1] - y) * tr * 0.9; sc *= 1 - 0.75 * tr;
            alpha = lineIn * (tr > 0.98 ? 0 : 0.25 + 0.75 * e) ;
          }
        } else if (i === 6) {
          var sw = TL.win(77.85, 80.65, 0.3, st);
          y += Math.sin(st * 4.6 + g * 0.8) * 5 * sw;
          x += Math.cos(st * 3.1 + g * 1.3) * 3 * sw;
        } else if (i === 7 && G.ch === "泪" && p > 0) {
          glow = Math.max(glow, 0.6 * (1 - smooth(83.6, 85.0, st)));
        }
        alpha *= 1 - out;
        if (alpha <= 0.004) continue;
        ctx.save();
        ctx.translate(x + G.w / 2, y);
        ctx.scale(sc, sc);
        var col = "rgba(255,250,244," + alpha.toFixed(3) + ")";
        if (blur > 0.6) blurText(ctx, G.ch, -G.w / 2, 0, blur, col, k * sc);
        else {
          ctx.shadowColor = "rgba(0,0,0," + (0.45 * alpha).toFixed(3) + ")";
          ctx.shadowBlur = 26 * k; ctx.shadowOffsetY = 4 * k;
          ctx.fillStyle = col;
          ctx.fillText(G.ch, -G.w / 2, 0);
          ctx.shadowOffsetY = 0;
          if (glow > 0.01) {
            ctx.shadowColor = "rgba(255,206,150," + (0.85 * glow * alpha).toFixed(3) + ")";
            ctx.shadowBlur = 30 * k;
            ctx.fillText(G.ch, -G.w / 2, 0);
          }
          ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
          if (i === 6 && cam.ca > 0.02) {
            // the doubled, colour-split read of line 7
            ctx.globalCompositeOperation = "lighter";
            var o = cam.ca * 5;
            ctx.fillStyle = "rgba(255,60,40," + (0.35 * alpha * cam.ca).toFixed(3) + ")";
            ctx.fillText(G.ch, -G.w / 2 + o, 0);
            ctx.fillStyle = "rgba(40,190,255," + (0.35 * alpha * cam.ca).toFixed(3) + ")";
            ctx.fillText(G.ch, -G.w / 2 - o, 0);
            ctx.globalCompositeOperation = "source-over";
          }
        }
        ctx.restore();
      }
    }
  }

  // 思念 lifts off line 6 and follows the geese
  function drawLonging(ctx, lay, st, k, F) {
    var Lc = lay.cine[5], t0 = 76.36, t1 = 78.9;
    if (st < t0 || st > t1 || !F.geeseLead) return;
    var S = lay.L.cine.size;
    ctx.font = "600 " + S + "px " + SERIF;
    ctx.textBaseline = "alphabetic";
    Lc.glyphs.forEach(function (G, n) {
      if (G.ch !== "思" && G.ch !== "念") return;
      var u = ease(clamp((st - t0 - n * 0.08) / (t1 - t0 - 0.3), 0, 1));
      var tx = F.geeseLead[0] + 30 + n * 20, ty = F.geeseLead[1] + 10;
      var cx = (G.x + tx) / 2 + 80, cy = Math.min(G.y, ty) - 160;
      var x = (1 - u) * (1 - u) * G.x + 2 * (1 - u) * u * cx + u * u * tx;
      var y = (1 - u) * (1 - u) * G.y + 2 * (1 - u) * u * cy + u * u * ty;
      var sc = 1 - 0.82 * u, a = (1 - smooth(0.7, 1.0, u)) * smooth(0, 0.05, u);
      ctx.save();
      ctx.translate(x + G.w / 2, y);
      ctx.scale(sc, sc);
      ctx.shadowColor = "rgba(255,210,160," + (0.9 * a).toFixed(3) + ")";
      ctx.shadowBlur = 24 * k;
      ctx.fillStyle = "rgba(255,246,236," + (0.9 * a).toFixed(3) + ")";
      ctx.fillText(G.ch, -G.w / 2, 0);
      ctx.restore();
      // a short trail of sparks behind it
      for (var s = 1; s <= 6; s++) {
        var uu = Math.max(0, u - s * 0.025);
        var px = (1 - uu) * (1 - uu) * G.x + 2 * (1 - uu) * uu * cx + uu * uu * tx + G.w / 2;
        var py = (1 - uu) * (1 - uu) * G.y + 2 * (1 - uu) * uu * cy + uu * uu * ty - S * 0.35;
        ctx.fillStyle = "rgba(255,220,180," + (a * 0.35 * (1 - s / 7)).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(px, py, 3 * (1 - s / 8), 0, Math.PI * 2); ctx.fill();
      }
    });
  }

  // ---------------------------------------------------------------- scene-anchored things
  function toStage(F, u, v, d) {
    var s = TL.project(F.cam, u, v, d);
    return [F.rect.x + s[0] * F.rect.w, F.rect.y + s[1] * F.rect.h];
  }
  function depthAt(u, v) {
    if (!R.depth) return 0.3;
    var n = R.depth.n, x = clamp(Math.round(u * (n - 1)), 0, n - 1), y = clamp(Math.round(v * (n - 1)), 0, n - 1);
    return R.depth.data[y * n + x] / 255;
  }

  var GEESE = { start: 74.9, end: 81.2 };
  function geeseState(F, st) {
    if (st < GEESE.start || st > GEESE.end) return null;
    var u = (st - GEESE.start) / (GEESE.end - GEESE.start);
    var lu = 1.08 - 1.24 * u, lv = 0.135 + 0.05 * u + 0.008 * Math.sin(u * 7);
    return { u: u, lu: lu, lv: lv, lead: toStage(F, lu, lv, 0) };
  }
  function drawGeese(ctx, F, st, gs) {
    if (!gs) return;
    var u = gs.u, a = smooth(0, 0.08, u) * (1 - smooth(0.9, 1, u)) * 0.75;
    var unit = F.rect.w / F.cam.visW; // stage px per cover unit
    ctx.save();
    ctx.fillStyle = "rgba(38,22,20," + a.toFixed(3) + ")";
    for (var i = 0; i < 11; i++) {
      var j = Math.ceil(i / 2), side = i % 2 ? 1 : -1;
      var gu = gs.lu + j * 0.026 + 0.003 * Math.sin(st * 1.3 + i);
      var gv = gs.lv + side * j * 0.013 + 0.002 * Math.cos(st * 1.1 + i * 2);
      var P = toStage(F, gu, gv, 0);
      var flap = Math.sin(st * 7.2 + i * 0.9), span = unit * 0.0088, lift = flap * 0.45 * span;
      var bx = P[0], by = P[1];
      ctx.beginPath();
      ctx.moveTo(bx - span, by - lift);
      ctx.quadraticCurveTo(bx - span * 0.45, by - lift * 0.2 - 0.13 * span, bx, by + 0.1 * span);
      ctx.quadraticCurveTo(bx + span * 0.45, by - lift * 0.2 - 0.13 * span, bx + span, by - lift);
      ctx.quadraticCurveTo(bx + span * 0.45, by - lift * 0.2 + 0.1 * span, bx, by + 0.26 * span);
      ctx.quadraticCurveTo(bx - span * 0.45, by - lift * 0.2 + 0.1 * span, bx - span, by - lift);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(bx - 0.32 * span, by + 0.12 * span, 0.27 * span, 0.1 * span, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 下一站: a route drawn down the road to the vanishing point, a station on every beat
  var ROUTE = [[0.585, 0.935], [0.53, 0.80], [0.455, 0.68], [0.395, 0.61], [0.338, 0.566]];
  function routePoint(f) {
    var n = ROUTE.length - 1, x = clamp(f, 0, 1) * n, i = Math.min(n - 1, Math.floor(x)), u = x - i;
    var p0 = ROUTE[Math.max(0, i - 1)], p1 = ROUTE[i], p2 = ROUTE[i + 1], p3 = ROUTE[Math.min(n, i + 2)];
    function cr(a, b, c, d) { return 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u); }
    return [cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])];
  }
  function drawRoute(ctx, F, st, k) {
    var t0 = 72.1, t1 = 75.35;
    if (st < t0 || st > t1 + 0.6) return;
    var draw = ease(clamp((st - t0) / 2.6, 0, 1));
    var a = smooth(t0, t0 + 0.3, st) * (1 - smooth(t1, t1 + 0.5, st));
    var pts = [];
    for (var i = 0; i <= 60; i++) {
      var f = i / 60 * draw, p = routePoint(f);
      pts.push(toStage(F, p[0], p[1], depthAt(p[0], p[1])));
    }
    ctx.save();
    ctx.lineCap = "round";
    ctx.globalCompositeOperation = "lighter";
    for (var pass = 0; pass < 2; pass++) {
      ctx.beginPath();
      pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
      ctx.strokeStyle = pass ? "rgba(255,236,210," + (0.85 * a).toFixed(3) + ")" : "rgba(255,170,90," + (0.35 * a).toFixed(3) + ")";
      ctx.lineWidth = pass ? 3 : 12;
      ctx.setLineDash(pass ? [14, 12] : []);
      ctx.lineDashOffset = -st * 60;
      ctx.stroke();
    }
    ctx.setLineDash([]);
    // stations on the beats
    var beat = 60 / SONG.bpm, b0 = 72.37;
    for (var s = 0; s < 4; s++) {
      var tb = b0 + s * beat, f = (s + 1) / 4;
      if (st < tb || f > draw + 0.02) continue;
      var p = routePoint(f), P = toStage(F, p[0], p[1], depthAt(p[0], p[1]));
      var age = st - tb, ring = 1 - Math.exp(-age * 5);
      var sz = (s === 3 ? 16 : 9) * (1.2 - 0.12 * s);
      ctx.fillStyle = "rgba(255,242,224," + a.toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(P[0], P[1], sz * 0.55, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(255,210,160," + (a * (1 - ring) * 0.9).toFixed(3) + ")";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(P[0], P[1], sz + ring * 40, 0, Math.PI * 2); ctx.stroke();
      if (s === 3) {
        ctx.globalCompositeOperation = "source-over";
        ctx.font = "600 " + Math.round(44) + "px " + SERIF;
        ctx.fillStyle = "rgba(255,246,236," + (a * smooth(0, 0.3, age)).toFixed(3) + ")";
        ctx.textAlign = "center";
        ctx.fillText("？", P[0], P[1] - 30);
        ctx.textAlign = "left";
        ctx.globalCompositeOperation = "lighter";
      }
    }
    ctx.restore();
  }

  function drawDust(ctx, L, t, st, F) {
    var W = L.W, H = L.H, rnd = mulberry(42);
    var hi = (band(17, t) + band(19, t) + band(21, t)) / 3;
    var lift = 1 + 2.2 * F.cam.fogRise;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (var i = 0; i < 34; i++) {
      var r1 = rnd(), r2 = rnd(), r3 = rnd(), r4 = rnd(), r5 = rnd();
      var vy = (8 + r3 * 18) * lift, vx = (r4 - 0.5) * 10;
      var x = ((r1 * W + vx * t) % W + W) % W;
      var y = H + 40 - ((r2 * (H + 80) + vy * t) % (H + 80));
      var rad = 1.2 + r5 * 3.2;
      var a = (0.05 + 0.13 * (0.5 + 0.5 * Math.sin(t * (0.6 + r4) + r1 * 9))) * (0.65 + 0.7 * hi);
      var g = ctx.createRadialGradient(x, y, 0, x, y, rad * 4);
      g.addColorStop(0, "rgba(255,214,170," + a.toFixed(3) + ")");
      g.addColorStop(1, "rgba(255,214,170,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - rad * 4, y - rad * 4, rad * 8, rad * 8);
    }
    ctx.restore();
  }

  function getLayout(ctx, name) {
    if (!R.layouts[name]) {
      var L = LAYOUTS[name];
      R.layouts[name] = { L: L, column: layoutColumn(ctx, L), cine: layoutCine(ctx, L) };
    }
    return R.layouts[name];
  }

  window.MVOverlay = {
    LAYOUTS: LAYOUTS,
    // where 泪 sits in the full-frame picture (0..1), so the drop of light can land on it
    tearFor: function (ctx, name) {
      var lay = getLayout(ctx, name), L = lay.L, G = null;
      lay.cine[7].glyphs.forEach(function (g) { if (g.ch === "泪") G = g; });
      if (!G) return null;
      return [(G.x + G.w / 2) / L.W, (G.y - L.cine.size * 0.36) / L.H];
    },
    gain: gain,
    low: low,
    init: function (cover, depthImg) {
      R.cover = cover;
      R.layouts = {};
      if (depthImg) {
        var n = 256, c = document.createElement("canvas");
        c.width = c.height = n;
        var g = c.getContext("2d");
        g.drawImage(depthImg, 0, 0, n, n);
        var px = g.getImageData(0, 0, n, n).data, d = new Uint8Array(n * n);
        for (var i = 0; i < n * n; i++) d[i] = px[i * 4]; // R = plate depth
        R.depth = { n: n, data: d };
      }
    },
    // F: { cam, rect } from app.js
    draw: function (ctx, k, name, t, F) {
      var lay = getLayout(ctx, name), L = lay.L, st = CLIP.start + t, e = F.cam.mode;
      // where the road vanishes, for line 5's characters
      F.vp = toStage(F, 0.338, 0.566, depthAt(0.338, 0.566));
      var gs = geeseState(F, st);
      F.geeseLead = gs ? gs.lead : null;
      ctx.save();
      drawDust(ctx, L, t, st, F);
      drawGeese(ctx, F, st, gs);
      // card edge highlight in the player view
      if (e < 0.999) {
        ctx.save();
        ctx.globalAlpha = 1 - e;
        roundRect(ctx, F.rect.x + 0.5, F.rect.y + 0.5, F.rect.w - 1, F.rect.h - 1, Math.max(0.5, F.rect.r));
        ctx.strokeStyle = "rgba(255,255,255,0.10)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.restore();
      }
      drawRoute(ctx, F, st, k);
      drawPlayerChrome(ctx, L, t, st, 1 - smooth(0.0, 0.55, e), 40 * e);
      drawColumn(ctx, lay, t, st, k, 1 - smooth(0.0, 0.5, e), 80 * e);
      drawCine(ctx, lay, t, st, k, F);
      drawLonging(ctx, lay, st, k, F);
      drawPill(ctx, L, t, st, smooth(0.55, 1.0, e));
      // fade from / to black with the audio
      var g = gain(t);
      if (g < 1) {
        ctx.fillStyle = "rgba(0,0,0," + (1 - Math.pow(g, 0.85)).toFixed(4) + ")";
        ctx.fillRect(0, 0, L.W, L.H);
      }
      ctx.restore();
    }
  };
})();
