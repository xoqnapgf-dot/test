/* The film's direction: which view is on screen, where the camera is, and how strong each
 * effect is, as pure functions of song time st. Shared by the WebGL scene and the 2D overlay.
 *
 * Coordinates
 *   cover uv   0..1 over the square artwork, y down (0 = top of the picture)
 *   s          0..1 across the on-screen picture rectangle, y down
 * Depth d is 0 = far (sky, mountains) .. 1 = nearest road.
 *
 * Forward model (cover point u with depth d -> picture position s):
 *   q = u - c
 *   q = q * (1 + dolly * (d - D0))      physical push-in: near things grow faster
 *   q = q + par * (d - D0)              lateral parallax: near things move more
 *   q = rotate(q, roll)
 *   s = 0.5 + q / vis
 * The shader inverts this per pixel with a few fixed-point steps on the depth map.
 */
(function () {
  "use strict";
  var D = window.MV_DATA;
  var D0 = 0.65;            // the walker's depth: parallax pivots around him
  var SUN = [0.252, 0.316]; // the sun in the artwork
  var TEAR = null;          // where 泪 sits on screen (picture s coords), from the overlay

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function smooth(a, b, x) { var u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); }
  function ease(u) { u = clamp(u, 0, 1); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }
  function win(a, b, r, x) { return smooth(a - r, a + r, x) * (1 - smooth(b - r, b + r, x)); }

  // ---------------------------------------------------------------- view mode
  // 0 = player (artwork in a card), 1 = cinema (artwork is the whole frame)
  var EXPAND = [50.90, 51.95];
  var COLLAPSE = [86.05, 87.45];
  function mode(st) {
    return ease((st - EXPAND[0]) / (EXPAND[1] - EXPAND[0])) * (1 - ease((st - COLLAPSE[0]) / (COLLAPSE[1] - COLLAPSE[0])));
  }

  // ---------------------------------------------------------------- camera keys
  // t, cx, cy, f (fraction of the largest frame that fits), parx, pary, dolly, focus, dof
  var KEYS = [
    [46.00, 0.50, 0.52, 0.96, 0.000, 0.000, 0.00, 0.65, 0.00],
    [50.90, 0.50, 0.52, 0.96, 0.000, 0.000, 0.00, 0.65, 0.00],
    // wide: sun, cloud sea, the walker from the head down
    [52.00, 0.53, 0.44, 0.97, 0.000, 0.000, 0.02, 0.65, 0.15],
    // 1 如果明天我会离开 / 没有任何原因 - a slow push in on the walker
    [56.40, 0.555, 0.38, 0.82, -0.012, 0.000, 0.30, 0.65, 0.45],
    // 2 你能看到我的眼睛 / 看不见我的心 - close on him, then focus slips past him
    [58.90, 0.585, 0.31, 0.60, 0.018, 0.004, 0.22, 0.65, 0.80],
    [60.30, 0.575, 0.32, 0.58, 0.026, 0.004, 0.20, 0.02, 1.00],
    [61.60, 0.540, 0.34, 0.62, 0.030, 0.002, 0.18, 0.02, 0.90],
    // 3 别问我要去何处 / 为了寻找何物 - look where he is going: the sun, the far road
    [63.80, 0.300, 0.38, 0.56, 0.036, 0.000, 0.10, 0.04, 0.55],
    [66.70, 0.260, 0.40, 0.50, 0.046, -0.004, 0.12, 0.04, 0.50],
    // 4 当我放下所有包袱 / 也就不会再哭 - crane up off the road, weight lifting
    [67.80, 0.460, 0.68, 0.72, 0.010, 0.020, 0.10, 0.70, 0.40],
    [71.90, 0.520, 0.42, 0.86, 0.000, -0.020, 0.05, 0.60, 0.30],
    // 5 我不知道下一站的旅程 / 会在哪里出现 - rush down the road to the vanishing point
    [72.50, 0.420, 0.57, 0.92, 0.000, 0.000, 0.00, 0.40, 0.20],
    [75.10, 0.350, 0.555, 0.60, 0.000, 0.000, 0.42, 0.20, 0.30],
    // 6 如果你有思念 / 就把它送给大雁 - tilt up into the sky, geese crossing
    [75.80, 0.400, 0.40, 0.70, 0.010, 0.000, 0.20, 0.06, 0.40],
    [77.80, 0.470, 0.24, 0.62, 0.020, 0.000, 0.10, 0.04, 0.40],
    // 7 别问我是否疲惫 / 就这样喝醉 - the world sways (roll and doubling added below)
    [78.20, 0.540, 0.38, 0.80, 0.000, 0.000, 0.05, 0.65, 0.50],
    [80.50, 0.550, 0.38, 0.76, -0.010, 0.000, 0.05, 0.65, 0.60],
    // 8 留下我最后的爱 / 是你看不到的泪 - close, then a long pull back
    [80.90, 0.640, 0.33, 0.56, 0.015, 0.000, 0.15, 0.65, 0.70],
    [84.60, 0.620, 0.40, 0.70, 0.000, 0.000, 0.05, 0.65, 0.45],
    // harmonica: all the way out, then back into the card
    [86.00, 0.540, 0.46, 0.97, 0.000, 0.000, 0.00, 0.65, 0.10],
    [87.50, 0.500, 0.52, 0.96, 0.000, 0.000, 0.00, 0.65, 0.00],
    [94.00, 0.500, 0.52, 0.96, 0.000, 0.000, 0.00, 0.65, 0.00]
  ];
  var NK = KEYS[0].length;

  // cubic Hermite through the keys with finite-difference tangents: continuous velocity,
  // so the camera flies instead of stopping at every key
  function track(st) {
    var n = KEYS.length, i = 0;
    if (st <= KEYS[0][0]) return KEYS[0].slice(1);
    if (st >= KEYS[n - 1][0]) return KEYS[n - 1].slice(1);
    while (i < n - 2 && KEYS[i + 1][0] <= st) i++;
    var k0 = KEYS[i], k1 = KEYS[i + 1];
    var km = KEYS[Math.max(0, i - 1)], kp = KEYS[Math.min(n - 1, i + 2)];
    var h = k1[0] - k0[0], u = (st - k0[0]) / h;
    var u2 = u * u, u3 = u2 * u;
    var h00 = 2 * u3 - 3 * u2 + 1, h10 = u3 - 2 * u2 + u, h01 = -2 * u3 + 3 * u2, h11 = u3 - u2;
    var out = [];
    for (var j = 1; j < NK; j++) {
      var m0 = i === 0 ? 0 : (k1[j] - km[j]) / (k1[0] - km[0]);
      var m1 = i + 1 === n - 1 ? 0 : (kp[j] - k0[j]) / (kp[0] - k0[0]);
      out.push(h00 * k0[j] + h10 * h * m0 * 0.85 + h01 * k1[j] + h11 * h * m1 * 0.85);
    }
    return out;
  }

  // ---------------------------------------------------------------- the whole state
  function state(st, aspect, kick) {
    var e = mode(st);
    var k = track(st);
    // the card "breathes" in the player: a small orbit so the artwork feels alive
    var live = {
      cx: 0.5 + 0.004 * Math.sin(st * 0.37), cy: 0.52,
      f: 0.955, parx: 0.016 * Math.sin(st * 0.33), pary: 0.006 * Math.cos(st * 0.29),
      dolly: 0.06 + 0.04 * Math.sin(st * 0.21), focus: 0.65, dof: 0.0
    };
    function mix(a, b) { return a + (b - a) * e; }
    var c = {
      cx: mix(live.cx, k[0]), cy: mix(live.cy, k[1]), f: mix(live.f, k[2]),
      par: [mix(live.parx, k[3]), mix(live.pary, k[4])],
      dolly: mix(live.dolly, k[5]), focus: mix(live.focus, k[6]), dof: mix(live.dof, k[7])
    };
    var chorus = win(51.9, 83.7, 0.5, st);
    // beat: a tiny push on every kick inside the chorus
    c.f *= 1 - 0.010 * kick * chorus;

    // 7: drunk sway, two beats per swing
    var sway = win(77.85, 80.65, 0.35, st);
    var ph = (st - 77.92) / (2 * 60 / D.song.bpm) * Math.PI * 2;
    c.roll = sway * 2.4 * Math.PI / 180 * Math.sin(ph);
    c.cx += sway * 0.012 * Math.sin(ph + 0.6);
    c.ca = sway * (0.55 + 0.45 * Math.abs(Math.sin(ph)));
    c.ghost = sway * (0.5 + 0.5 * Math.sin(ph * 0.5));

    // frame size from the picture's aspect: the largest frame that fits in the artwork
    var hmax = Math.min(1, 1 / aspect);
    c.visH = hmax * c.f;
    c.visW = c.visH * aspect;
    // keep every sampled point inside the artwork. A push-in (dolly) draws far things
    // smaller, so the far layer needs a wider piece of the artwork than the frame itself:
    // its extent grows by 1 / (1 - D0 * dolly). Parallax shifts the far layer by par * D0.
    var ext = 1 / Math.max(0.3, 1 - D0 * Math.max(0, c.dolly));
    var rx = Math.abs(c.roll) * 0.5;
    var hw = c.visW / 2 * ext + Math.abs(c.par[0]) * D0 + rx * c.visH + 0.004;
    var hh = c.visH / 2 * ext + Math.abs(c.par[1]) * D0 + rx * c.visW + 0.004;
    var shrink = Math.min(1, 0.5 / hw, 0.5 / hh);
    if (shrink < 1) {
      c.visW *= shrink; c.visH *= shrink;
      hw = c.visW / 2 * ext + Math.abs(c.par[0]) * D0 + rx * c.visH + 0.004;
      hh = c.visH / 2 * ext + Math.abs(c.par[1]) * D0 + rx * c.visW + 0.004;
    }
    c.cx = clamp(c.cx, hw, 1 - hw);
    c.cy = clamp(c.cy, hh, 1 - hh);

    c.mode = e;
    c.chorus = chorus;
    c.fog = 0.55 + 0.45 * win(67.3, 72.2, 0.8, st);
    c.fogRise = win(67.2, 72.6, 0.6, st);
    c.rays = 0.45 + 0.55 * win(62.0, 67.0, 0.8, st) + 0.25 * chorus + 0.30 * kick * chorus;
    c.glints = 0.35 + 0.65 * win(72.2, 75.2, 0.3, st);
    c.warm = 0.06 * chorus - 0.22 * win(81.6, 85.5, 1.0, st);
    c.sat = 1.0 + 0.10 * chorus - 0.12 * win(81.6, 85.5, 1.0, st);
    c.exposure = 1.0 + 0.06 * chorus + 0.04 * kick * chorus;
    // light leaks on the two big moves
    c.leak = Math.exp(-Math.pow((st - 51.75) / 0.38, 2)) + 0.8 * Math.exp(-Math.pow((st - 86.7) / 0.45, 2));
    // 8: a drop of light runs down the lens and lands on 泪, which then ripples
    var tgt = TEAR || [0.80, 0.78];
    var dropT = (st - 81.84) / (83.32 - 81.84);
    c.drop = (dropT > 0 && dropT < 1.2) ? {
      x: tgt[0] + 0.004 * Math.sin(dropT * 9) * (1 - dropT),
      y: tgt[1] - 0.50 + 0.47 * Math.pow(clamp(dropT, 0, 1), 1.7),
      r: 0.026, a: smooth(0, 0.12, dropT) * (1 - smooth(1.0, 1.15, dropT))
    } : null;
    var rip = st - 83.32;
    c.ripple = (rip > 0 && rip < 1.6) ? { x: tgt[0], y: tgt[1] - 0.03, t: rip } : null;
    c.dt = 1 / 60;
    return c;
  }

  function project(c, u, v, d) {
    var qx = u - c.cx, qy = v - c.cy;
    var g = 1 + c.dolly * (d - D0);
    qx = qx * g + c.par[0] * (d - D0);
    qy = qy * g + c.par[1] * (d - D0);
    var cs = Math.cos(c.roll), sn = Math.sin(c.roll);
    var rx = cs * qx - sn * qy, ry = sn * qx + cs * qy;
    return [0.5 + rx / c.visW, 0.5 + ry / c.visH];
  }

  // the picture rectangle in stage units: the card in the player, the full frame in cinema
  function rect(L, e) {
    var C = L.cover, u = e;
    return {
      x: C.x * (1 - u), y: C.y * (1 - u),
      w: C.s + (L.W - C.s) * u, h: C.s + (L.H - C.s) * u,
      r: 18 * (1 - u)
    };
  }

  window.MVTimeline = {
    D0: D0, SUN: SUN, EXPAND: EXPAND, COLLAPSE: COLLAPSE,
    mode: mode, state: state, project: project, rect: rect,
    clamp: clamp, smooth: smooth, ease: ease, win: win,
    setTear: function (p) { TEAR = p; }
  };
})();
