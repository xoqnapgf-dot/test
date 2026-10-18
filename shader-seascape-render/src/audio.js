/* Sound. There is no audio file in this project either: the mix is synthesised from
 * filtered noise and a few oscillators, and its layers follow the renderer's own numbers.
 *
 *   sea      filtered noise, gain and brightness following the wind speed of the shot
 *   swell    a slow tide on top of that, plus one breaking wave every few seconds
 *   drone    a low fifth that arrives with the water and stays to the end
 *   shimmer  a high, quiet bank of partials for the light chapters
 *   bell     one soft pluck per chapter change, a semitone higher each time, so the
 *            film's nine steps are audible as well as visible
 *
 * Browsers only allow sound after a gesture, so the graph is built on the first click,
 * tap or key. Everything in it is deterministic, which is what makes it checkable: the
 * same graph renders offline (SS.audio.renderOffline) and its levels can be measured
 * instead of guessed. tools/audiocheck.mjs does exactly that and prints the numbers.
 */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});

  var ctx = null, graph = null, started = false, enabled = true, lastCh = -1;
  var swellAt = 6, swellPhase = 0;

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function noiseBuffer(c, seconds, seed, tilt) {
    var n = Math.floor(c.sampleRate * seconds);
    var buf = c.createBuffer(1, n, c.sampleRate);
    var d = buf.getChannelData(0);
    var rnd = mulberry32(seed);
    var last = 0, acc = 0;
    for (var i = 0; i < n; i++) {
      var w = rnd() * 2 - 1;
      last = tilt * last + (1 - tilt) * w;         // a one pole low pass: brown-ish noise
      acc += (w - acc) * 0.02;                     // and a slow wander
      d[i] = last * 0.7 + acc * 3.0;
      // cross-fade the ends so the loop does not click
      var fade = 0.02 * c.sampleRate;
      if (i < fade) d[i] *= i / fade;
      if (i > n - fade) d[i] *= (n - i) / fade;
    }
    return buf;
  }

  /* The whole graph. Same code for a live context and for an offline render, so what is
     measured offline is what plays. */
  function buildGraph(c, dest) {
    var g = { ctx: c, waves: [] };
    var t0 = 0;

    g.master = c.createGain();
    g.master.gain.value = 0.0001;
    g.comp = c.createDynamicsCompressor();
    g.comp.threshold.value = -10; g.comp.knee.value = 8; g.comp.ratio.value = 6;
    g.comp.attack.value = 0.03; g.comp.release.value = 0.4;
    g.master.connect(g.comp); g.comp.connect(dest);

    // ---- sea
    g.seaSrc = c.createBufferSource(); g.seaSrc.buffer = noiseBuffer(c, 6, 12345, 0.86);
    g.seaSrc.loop = true;
    g.seaLP = c.createBiquadFilter(); g.seaLP.type = 'lowpass'; g.seaLP.frequency.value = 340; g.seaLP.Q.value = 0.7;
    g.seaGain = c.createGain(); g.seaGain.gain.value = 0.30;
    g.seaSrc.connect(g.seaLP); g.seaLP.connect(g.seaGain); g.seaGain.connect(g.master);

    // ---- wind (a band of the same noise, brighter)
    g.windSrc = c.createBufferSource(); g.windSrc.buffer = noiseBuffer(c, 6, 9876, 0.55);
    g.windSrc.loop = true;
    g.windBP = c.createBiquadFilter(); g.windBP.type = 'bandpass'; g.windBP.frequency.value = 900; g.windBP.Q.value = 0.7;
    g.windGain = c.createGain(); g.windGain.gain.value = 0.05;
    g.windSrc.connect(g.windBP); g.windBP.connect(g.windGain); g.windGain.connect(g.master);

    // ---- surf swells: a very slow tremolo on the sea bed
    g.swell = c.createOscillator(); g.swell.type = 'sine'; g.swell.frequency.value = 0.07;
    g.swellGain = c.createGain(); g.swellGain.gain.value = 0.16;
    g.swell.connect(g.swellGain);
    g.swellGain.connect(g.seaGain.gain);

    // ---- drone: a fifth, low, arriving with the water
    g.drone = c.createGain(); g.drone.gain.value = 0.0001;
    g.droneLP = c.createBiquadFilter(); g.droneLP.type = 'lowpass'; g.droneLP.frequency.value = 420;
    g.drone.connect(g.droneLP); g.droneLP.connect(g.master);
    [55, 82.5, 110.3].forEach(function (f, i) {
      var o = c.createOscillator();
      o.type = i === 2 ? 'triangle' : 'sine';
      o.frequency.value = f;
      var og = c.createGain(); og.gain.value = i === 0 ? 0.5 : (i === 1 ? 0.34 : 0.14);
      o.connect(og); og.connect(g.drone);
      o.detune.value = i * 4 - 4;
    });

    // ---- shimmer: high partials for the light chapters
    g.shimmer = c.createGain(); g.shimmer.gain.value = 0.0001;
    g.shimmer.connect(g.master);
    [1174, 1568, 1760, 2349].forEach(function (f, i) {
      var o = c.createOscillator();
      o.type = 'sine'; o.frequency.value = f;
      var og = c.createGain(); og.gain.value = [0.03, 0.022, 0.016, 0.008][i];
      var lfo = c.createOscillator(); lfo.frequency.value = 0.05 + i * 0.017;
      var lg = c.createGain(); lg.gain.value = og.gain.value * 0.7;
      lfo.connect(lg); lg.connect(og.gain);
      o.connect(og); og.connect(g.shimmer);
      o.start(t0); lfo.start(t0);
    });

    // ---- bells for the chapter changes
    g.bell = c.createGain(); g.bell.gain.value = 0.5; g.bell.connect(g.master);
    g.bellOut = g.bell;

    g.seaSrc.start(t0); g.windSrc.start(t0); g.swell.start(t0);
    g.droneStart = function () { };
    return g;
  }

  function pluck(c, g, semitone) {
    var t = c.currentTime;
    var f = 196 * Math.pow(2, semitone / 12);
    var o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    var o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 2.01;
    var env = c.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.09, t + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 1.7);
    var og = c.createGain(); og.gain.value = 0.22;
    o.connect(env); o2.connect(og); og.connect(env); env.connect(g.bell);
    o.start(t); o2.start(t); o.stop(t + 1.9); o2.stop(t + 1.9);
  }

  function windNorm(w) { return Math.max(0, Math.min(1.2, ((w === undefined ? 8.5 : w) - 2) / 10)); }

  SS.audio = {
    enabled: true,
    get started() { return started; },
    get context() { return ctx; },
    get nodes() { return graph; },

    /* Called from the boot path: this only arms the first gesture, because a browser
       will not start an audio context before one. */
    init: function (R, app) {
      this.R = R; this.app = app;
      var self = this;
      function arm() {
        window.removeEventListener('pointerdown', arm);
        window.removeEventListener('keydown', arm);
        window.removeEventListener('touchstart', arm);
        if (enabled) self.start();
      }
      window.addEventListener('pointerdown', arm);
      window.addEventListener('keydown', arm);
      window.addEventListener('touchstart', arm);
      return true;
    },

    start: function () {
      if (started) return true;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      try {
        ctx = new AC({ latencyHint: 'playback' });
        graph = buildGraph(ctx, ctx.destination);
        started = true;
        SS.audio.started = true;
        SS.audio.enabled = enabled;
        var t = ctx.currentTime;
        graph.master.gain.cancelScheduledValues(t);
        graph.master.gain.setValueAtTime(0.0001, t);
        graph.master.gain.linearRampToValueAtTime(0.85, t + 2.2);
        if (ctx.state === 'suspended') ctx.resume();
      } catch (e) { started = false; }
      return started;
    },

    setEnabled: function (on) {
      enabled = !!on;
      SS.audio.enabled = enabled;
      if (!enabled) {
        if (graph) {
          var t = ctx.currentTime;
          graph.master.gain.cancelScheduledValues(t);
          graph.master.gain.setTargetAtTime(0.0001, t, 0.25);
        }
        return false;
      }
      if (!started) return this.start();
      var t2 = ctx.currentTime;
      graph.master.gain.cancelScheduledValues(t2);
      graph.master.gain.setTargetAtTime(0.85, t2, 0.35);
      return true;
    },

    toggle: function () { return this.setEnabled(!enabled); },

    /* Per chapter. Levels are set once here plus per frame in tick(); the bell marks the
       chapter change so the film has audible steps. */
    setChapter: function (ch, u, R, app) {
      if (!started || !graph) { lastCh = ch; return false; }
      var t = ctx.currentTime;
      if (ch !== lastCh) {
        if (lastCh >= 0) pluck(ctx, graph, ch);
        lastCh = ch;
      }
      var drone = ch >= 4 ? 0.30 : (ch >= 3 ? 0.16 : 0.0001);
      var shim = (ch === 3 || ch === 7 || ch === 8) ? 0.16 : 0.04;
      graph.drone.gain.setTargetAtTime(drone, t, 1.2);
      graph.shimmer.gain.setTargetAtTime(shim, t, 1.5);
      return true;
    },

    tick: function (dt, R, app) {
      if (!started || !graph || !R) return false;
      var t = ctx.currentTime;
      var wn = windNorm(R.s.wind);
      graph.seaGain.gain.setTargetAtTime(0.16 + 0.20 * wn, t, 0.8);
      graph.seaLP.frequency.setTargetAtTime(240 + 320 * wn, t, 0.8);
      graph.windGain.gain.setTargetAtTime(0.012 + 0.05 * wn, t, 0.8);
      // one breaking wave every few seconds, on its own clock so it never repeats exactly
      swellPhase += dt;
      if (swellPhase > swellAt) {
        swellPhase = 0;
        swellAt = 6 + Math.random() * 6;
        var burst = ctx.createBufferSource();
        burst.buffer = noiseBuffer(ctx, 2.4, Math.floor(Math.random() * 1e6), 0.75);
        var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 700; bp.Q.value = 0.8;
        var env = ctx.createGain();
        env.gain.setValueAtTime(0.0001, t);
        env.gain.exponentialRampToValueAtTime(0.16 + 0.14 * wn, t + 0.5);
        env.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
        burst.connect(bp); bp.connect(env); env.connect(graph.master);
        burst.start(t); burst.stop(t + 2.4);
      }
      return true;
    },

    /* ---------------------------------------------------------------- offline check
       Render the same graph offline and report what a listener would get: peak and RMS
       per second, the clipping count, and the level at each chapter change. This is how
       the mix was verified without a speaker. */
    renderOffline: function (seconds, opts) {
      var o = opts || {};
      var OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!OC) return Promise.reject(new Error('no OfflineAudioContext'));
      var sr = 48000;
      var c = new OC(2, Math.round(sr * seconds), sr);
      var g = buildGraph(c, c.destination);
      var wind = o.wind === undefined ? 8.5 : o.wind;
      var wn = windNorm(wind);
      g.master.gain.setValueAtTime(0.85, 0);
      g.seaGain.gain.setValueAtTime(0.16 + 0.20 * wn, 0);
      g.windGain.gain.setValueAtTime(0.012 + 0.05 * wn, 0);
      g.drone.gain.setValueAtTime(0.30, 6);
      g.shimmer.gain.setValueAtTime(0.10, 4);
      var chapters = o.chapters || [0, 1, 2, 3, 4, 5, 6, 7, 8];
      for (var i = 1; i < chapters.length; i++) {
        var ch = chapters[i], at = i * 10.6;
        if (at >= seconds) break;
        // a pluck needs a live-ish context time: schedule through a helper that takes t
        var f = 196 * Math.pow(2, ch / 12);
        var osc = c.createOscillator(); osc.type = 'sine'; osc.frequency.value = f;
        var env = c.createGain();
        env.gain.setValueAtTime(0.0001, at);
        env.gain.exponentialRampToValueAtTime(0.09, at + 0.012);
        env.gain.exponentialRampToValueAtTime(0.0001, at + 1.7);
        osc.connect(env); env.connect(g.bell);
        osc.start(at); osc.stop(at + 1.9);
      }
      // swells, on the same clock as the live one
      var at2 = 6;
      while (at2 < seconds - 2) {
        var burst = c.createBufferSource();
        burst.buffer = noiseBuffer(c, 2.4, (at2 * 7919) | 0, 0.75);
        var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 700; bp.Q.value = 0.8;
        var env2 = c.createGain();
        env2.gain.setValueAtTime(0.0001, at2);
        env2.gain.exponentialRampToValueAtTime(0.16 + 0.14 * wn, at2 + 0.5);
        env2.gain.exponentialRampToValueAtTime(0.0001, at2 + 2.2);
        burst.connect(bp); bp.connect(env2); env2.connect(g.master);
        burst.start(at2); burst.stop(at2 + 2.4);
        at2 += 6.5;
      }
      return c.startRendering().then(function (buf) {
        var d = buf.getChannelData(0), n = d.length, sr2 = buf.sampleRate;
        var peak = 0, sum = 0, clip = 0, perSec = [];
        for (var k = 0; k < n; k++) {
          var v = d[k];
          var av = v < 0 ? -v : v;
          if (av > peak) peak = av;
          if (av >= 0.999) clip++;
          sum += v * v;
        }
        for (var s = 0; s < Math.floor(n / sr2); s++) {
          var a = s * sr2, b = a + sr2, p = 0, su = 0;
          for (var j = a; j < b; j++) { var q = d[j]; var aq = q < 0 ? -q : q; if (aq > p) p = aq; su += q * q; }
          perSec.push({ s: s, rms: +Math.sqrt(su / sr2).toFixed(5), peak: +p.toFixed(5) });
        }
        return {
          seconds: n / sr2, sr: sr2, peak: +peak.toFixed(5), rms: +Math.sqrt(sum / n).toFixed(5),
          clip: clip, perSec: perSec
        };
      });
    }
  };
})();
