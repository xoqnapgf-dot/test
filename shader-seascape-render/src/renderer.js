/* Frame orchestration: the scene pass, the bloom pyramid, the composite, the
   adaptive resolution controller and the capture hooks used for verification. */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});
  var GL = SS.GLSL;
  var assemble = SS.assembleFS;

  var DEFAULTS = {
    terrainSize: 16384,
    terrainRes: 2048,
    plainH: 22,
    seaDepth: 26,
    cliff: 34,
    islandH: 700,
    sink: 0,
    relief: 1400,
    ridgeGain: 1.35,
    ridgeMix: 0.55,
    massifBias: 0.15,
    seed: 17.3,
    talus: 0.5,
    talusAmount: 0.50,         // half of each repose gap closes per pass from each side
    blur: 0.011,                    // diffusion weight at a 32 m texel; scales as 1/dx^2
    carve: 0.25,
    aoStrength: 1.1,
    erodeIterations: 8,
    quality: 0.75,
    renderScale: 1.0,
    adaptive: true,
    targetMs: 16.7,
    // where the adaptive controller starts, and the floor it may fall to. A device that can
    // only afford a low internal resolution should start there: the controller's cooldown used
    // to be counted in frames, so on a slow renderer it never reached its floor - it sat at
    // full resolution paying minutes per frame while it waited for its 25-frame cooldown.
    startScale: 1.0,
    minScale: 0.45
  };

  SS.FallbackRenderer = function (canvas, P, reason) {
    var g2d = null;
    try { g2d = canvas.getContext('2d'); } catch (e) { g2d = null; }
    var drawCanvas = canvas;
    if (!g2d && canvas && canvas.parentNode) {
      drawCanvas = document.createElement('canvas');
      drawCanvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;display:block;z-index:0;pointer-events:none;';
      canvas.parentNode.insertBefore(drawCanvas, canvas.nextSibling);
      g2d = drawCanvas.getContext('2d');
    }
    var offCanvas = document.createElement('canvas');
    var offCtx = offCanvas.getContext('2d');

    var R = {
      api: { raw: null, rendererName: 'CPU Raymarch Fallback', colorFloat: true, colorHalf: true },
      params: P, canvas: canvas, fallback: true, fallbackReason: reason || 'no-webgl2',
      ready: false, error: null,
      stats: { ms: 0, fps: 0, scale: 0.25, quality: P.quality || 0.5, passes: 3 },
      gen: {}, programs: {}, targets: {},
      lastSun: { elev: -99, azi: -99 },
      frame: 0
    };

    // ---- deterministic fast math / noise matching src/glsl/common.js + gen.js
    function fract(x) { return x - Math.floor(x); }
    function clamp(x, a, b) { return x < a ? a : (x > b ? b : x); }
    function saturate(x) { return x < 0 ? 0 : (x > 1 ? 1 : x); }
    function mix(a, b, t) { return a + (b - a) * t; }
    function smoothstep(a, b, x) {
      var t = saturate((x - a) / (b - a));
      return t * t * (3 - 2 * t);
    }
    function hash12(px, py) {
      var x = fract(px * 0.1031), y = fract(py * 0.1030), z = fract(px * 0.0973);
      var d = x * (y + 33.33) + y * (z + 33.33) + z * (x + 33.33);
      x += d; y += d; z += d;
      return fract((x + y) * z);
    }
    function vnoise(px, py) {
      var ix = Math.floor(px), iy = Math.floor(py);
      var fx = px - ix, fy = py - iy;
      var ux = fx * fx * fx * (fx * (fx * 6 - 15) + 10);
      var uy = fy * fy * fy * (fy * (fy * 6 - 15) + 10);
      var a = hash12(ix, iy), b = hash12(ix + 1, iy);
      var c = hash12(ix, iy + 1), d = hash12(ix + 1, iy + 1);
      return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
    }
    function fbm2(px, py, oct) {
      var v = 0, a = 0.5;
      for (var i = 0; i < oct; i++) {
        v += a * vnoise(px, py);
        var nx = 1.6 * px + 1.2 * py;
        var ny = -1.2 * px + 1.6 * py;
        px = nx * 1.02; py = ny * 1.02;
        a *= 0.5;
      }
      return v;
    }
    function ridged(px, py, oct, sharp) {
      var v = 0, a = 0.5, w = 1.0;
      for (var i = 0; i < oct; i++) {
        var n = 1.0 - Math.abs(vnoise(px, py) * 2.0 - 1.0);
        n = Math.pow(clamp(n, 0, 1), sharp);
        n *= w;
        w = clamp(n * 1.9, 0.15, 1.0);
        v += n * a;
        var nx = 1.6 * px + 1.2 * py;
        var ny = -1.2 * px + 1.6 * py;
        px = nx * 1.03; py = ny * 1.03;
        a *= 0.5;
      }
      return v;
    }

    // ---- bake terrain (128x128 height + AO)
    var t0 = performance.now();
    var TN = 128, TS = P.terrainSize || 16384;
    var hGrid = new Float32Array(TN * TN);
    var aoGrid = new Float32Array(TN * TN);
    var seed = P.seed || 17.3;
    var sx = seed * 1.3, sy = seed * 2.1;
    for (var gy = 0; gy < TN; gy++) {
      for (var gx = 0; gx < TN; gx++) {
        var uvx = (gx + 0.5) / TN, uvy = (gy + 0.5) / TN;
        var px = (uvx - 0.5) * TS, pz = (uvy - 0.5) * TS;
        var wig = fbm2(px * 0.00018 + sx, pz * 0.00018 + sy, 4);
        var headA = Math.exp(-Math.pow((px - 1500) / 2300, 2));
        var bayB = -Math.exp(-Math.pow((px + 3400) / 1500, 2));
        var bayC = -Math.exp(-Math.pow((px - 6300) / 1600, 2));
        var shore = -520 + px * 0.14 + (wig - 0.5) * 1300 + 2300 * headA + 1300 * bayB + 1050 * bayC;
        var inlandDist = pz - shore;             // + inland (north), - offshore (south)
        var landMask = smoothstep(-160, 150, inlandDist);
        var coastalPlain = smoothstep(200, 1900, inlandDist);
        var inland = smoothstep(500, 3200, inlandDist);
        var qx = px * 0.00042 + sx * 0.7, qy = pz * 0.00042 + sy * 0.7;
        var wx = fbm2(qx * 0.9 + 1.7, qy * 0.9 + 9.2, 3) - 0.5;
        var wy = fbm2(qx * 0.9 + 8.3, qy * 0.9 + 2.8, 3) - 0.5;
        var ridgeA = ridged(qx + wx * 0.85, qy + wy * 0.85, 5, 1.35);
        var ridgeB = ridged(qx * 0.63 + 5.1, qy * 0.63 - 3.3, 4, 1.45);
        var ridge = mix(ridgeA, Math.max(ridgeA, ridgeB * 0.93), P.ridgeMix || 0.55);
        var macro = fbm2(qx * 0.30 + 3.3, qy * 0.30 + 6.1, 3);
        var baseT = fbm2(qx * 1.25 + 11.7, qy * 1.25 - 4.2, 4);
        var massif = smoothstep(P.massifBias || 0.15, (P.massifBias || 0.15) + 0.42, macro);
        var mountain = Math.pow(clamp(ridge, 0, 1), 1.35) * (P.ridgeGain || 1.35) * (P.relief || 1400) * massif * inland;
        var rolling = (baseT - 0.45) * 0.16 * (P.relief || 1400) * (0.35 + 0.65 * inland);
        var lowLine = 1.0 - smoothstep(0.34, 0.68, ridgeA * 0.35 + ridgeB * 0.25 + fbm2(qx * 0.85 + 77.1, qy * 0.85, 3) * 0.55);
        var downcut = lowLine * smoothstep(5200, -600, inlandDist) * (0.55 * (mountain + rolling * 0.6) + 70 * (1.0 - smoothstep(0, 4200, inlandDist)));
        var landH = (P.plainH || 22) + smoothstep(-150, 200, inlandDist) * 12 +
          (P.cliff || 34) * smoothstep(-40, 420, inlandDist) * (0.35 + 0.65 * baseT) +
          rolling + mountain - downcut;
        var offshore = saturate(-inlandDist / 12000);
        var seabed = -(P.seaDepth || 26) - smoothstep(200, 3000, -inlandDist) * 90 -
          offshore * offshore * 1400 + (fbm2(qx * 2.6 + 21.3, qy * 2.6, 3) - 0.5) * 14 -
          lowLine * 45 * smoothstep(9000, 1200, -inlandDist);
        var islandField = smoothstep(0.55, 0.78, macro) * smoothstep(0.40, 0.70, ridgeA);
        var islandBand = smoothstep(1800, 4200, -inlandDist) * (1.0 - smoothstep(8000, 11500, -inlandDist));
        seabed += (islandField * (P.islandH || 700) - (P.seaDepth || 26) * 1.2) * islandBand;
        var h = mix(seabed, landH, landMask) - (P.sink || 0);
        if (uvx < 0.002 || uvy < 0.002 || uvx > 0.998 || uvy > 0.998) h = -2400;
        hGrid[gy * TN + gx] = h;
      }
    }
    // simple smoothing/erosion + AO
    var hTmp = new Float32Array(TN * TN);
    for (var ep = 0; ep < 3; ep++) {
      for (var ey = 0; ey < TN; ey++) {
        var ym = Math.max(0, ey - 1), yp = Math.min(TN - 1, ey + 1);
        for (var ex = 0; ex < TN; ex++) {
          var xm = Math.max(0, ex - 1), xp = Math.min(TN - 1, ex + 1);
          var c = hGrid[ey * TN + ex];
          var avg = 0.25 * (hGrid[ey * TN + xm] + hGrid[ey * TN + xp] + hGrid[ym * TN + ex] + hGrid[yp * TN + ex]);
          hTmp[ey * TN + ex] = c + (avg - c) * 0.14;
        }
      }
      hGrid.set(hTmp);
    }
    var texelM = TS / TN;
    for (var ay = 0; ay < TN; ay++) {
      for (var ax = 0; ax < TN; ax++) {
        var hc = hGrid[ay * TN + ax];
        var occ = 0;
        var dirs = [[1,0],[-1,0],[0,1],[0,-1],[0.7,0.7],[-0.7,0.7],[0.7,-0.7],[-0.7,-0.7]];
        for (var d = 0; d < 8; d++) {
          var sx2 = Math.min(TN - 1, Math.max(0, Math.round(ax + dirs[d][0] * 2)));
          var sy2 = Math.min(TN - 1, Math.max(0, Math.round(ay + dirs[d][1] * 2)));
          var dh = hGrid[sy2 * TN + sx2] - hc;
          occ += Math.max(0, Math.atan2(dh, texelM * 2) / 1.5707963);
        }
        aoGrid[ay * TN + ax] = Math.pow(clamp(1.0 - (occ / 8) * (P.aoStrength || 1.1), 0.15, 1.0), 1.2);
      }
    }

    // ---- bake weather (128x128) & blueNoise (64x64)
    var WN = 128;
    var weatherTex = new Float32Array(WN * WN * 4);
    for (var wy2 = 0; wy2 < WN; wy2++) {
      for (var wx2 = 0; wx2 < WN; wx2++) {
        var uvwx = (wx2 + 0.5) / WN, uvwy = (wy2 + 0.5) / WN;
        var w1 = fbm2(uvwx * 6.0 + 1.3, uvwy * 6.0 + 2.7, 4);
        var w2 = fbm2(uvwx * 12.0 + 5.1, uvwy * 12.0 + 8.4, 3);
        var cov = smoothstep(0.28, 0.74, w1 * 0.72 + w2 * 0.28);
        var typ = clamp(w2, 0.1, 0.95);
        var wi = (wy2 * WN + wx2) * 4;
        weatherTex[wi] = cov; weatherTex[wi + 1] = typ; weatherTex[wi + 2] = w1; weatherTex[wi + 3] = 1;
      }
    }
    var BN = 64;
    var blueNoiseTex = new Float32Array(BN * BN * 4);
    for (var bi = 0; bi < BN * BN; bi++) {
      var bval = fract(52.9829189 * fract(0.06711056 * (bi % BN) + 0.00583715 * Math.floor(bi / BN)));
      blueNoiseTex[bi * 4] = bval; blueNoiseTex[bi * 4 + 1] = bval; blueNoiseTex[bi * 4 + 2] = bval; blueNoiseTex[bi * 4 + 3] = 1;
    }

    // terrain texture RGBA representation (for textureToCanvas / stats)
    var terrainRGBA = new Float32Array(TN * TN * 4);
    var heightRawRGBA = new Float32Array(TN * TN * 4);
    for (var ti = 0; ti < TN * TN; ti++) {
      var hn = clamp((hGrid[ti] - (-1600)) / 5800, 0, 1);
      var hi8 = Math.floor(hn * 255) / 255;
      var lo8 = clamp((hn - hi8) * 255, 0, 1);
      terrainRGBA[ti * 4] = hi8; terrainRGBA[ti * 4 + 1] = lo8; terrainRGBA[ti * 4 + 2] = aoGrid[ti]; terrainRGBA[ti * 4 + 3] = 1;
      heightRawRGBA[ti * 4] = hn; heightRawRGBA[ti * 4 + 1] = hn; heightRawRGBA[ti * 4 + 2] = hn; heightRawRGBA[ti * 4 + 3] = 1;
    }

    var SKY_W = 256, SKY_H = 128;
    var skyData = new Float32Array(SKY_W * SKY_H * 4);
    var ST_W = 64, ST_H = 32;
    var sunTransData = new Float32Array(ST_W * ST_H * 4);

    R.gen = {
      terrain: { w: TN, h: TN, data: terrainRGBA },
      heightRaw: { w: TN, h: TN, data: heightRawRGBA },
      weather: { w: WN, h: WN, data: weatherTex },
      blueNoise: { w: BN, h: BN, __w: BN, __h: BN, data: blueNoiseTex },
      sky: { w: SKY_W, h: SKY_H, data: skyData },
      sunTrans: { w: ST_W, h: ST_H, data: sunTransData },
      volumeSize: 64,
      size: { terrain: TS, terrainRes: TN, volume: 64 }
    };
    R.genMs = performance.now() - t0;

    // ---- state & camera
    R.s = {
      time: 0, frameJitter: 0,
      exposure: 0.55, bloom: 0.05, vignette: 0.22, grain: 0.012, chroma: 0.35, split: -1, postMix: 1,
      haze: 0.5, debugMix: 1.0, view: 0,
      exposureAuto: true, exposureKey: 0.135, exposureRate: 1.9,
      exposureMin: 0.05, exposureMax: 6.0, exposureBias: 1.0,
      stages: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      sunElev: 9.5, sunAzi: 196, sunDisk: 45,
      betaR: [5.8e-6, 13.5e-6, 33.1e-6], betaM: 42e-6, mieG: 0.72, hr: 8000, hm: 1200, ozone: 1.0, mieTint: 1.0,
      sunIrradiance: 11.0, skyScale: 1.0, multiScatter: 1.0,
      wind: 8.5, seaLevel: 0, waveAmp: 1, waveSpeed: 1, waterClarity: 1, foam: 1, waterIOR: 1.333, sunGlitter: 1.6,
      absorption: 1.0, seedW: 3.7, weatherTile: 160000.0, waveDir: [0.87, 0.49],
      cloudCover: 0.16, cloudBase: 1900, cloudTop: 3300, cloudScale: 46000, cloudUnit: 170, cloudDetailUnit: 48, cloudContrast: 1.8, cloudErosion: 0.55, cloudVert: 4.6,
      cloudFadeNear: 26000, cloudSteps: 0.6, cloudSun: 1.1, cloudAmbient: 1.35,
      cloudDensityScale: 0.020, detailAmp: 1,
      terrainTexel: P.terrainSize / P.terrainRes,
      terrainSize: P.terrainSize
    };
    R.camera = { pos: [0, 62, 900], fwd: [0, -0.05, -1], up: [0, 1, 0], right: [1, 0, 0], fov: 42 };
    R.uniformTable = [
      ['uWind', 'wind'], ['uSeaLevel', 'seaLevel'], ['uWaveAmp', 'waveAmp'],
      ['uWaveSpeed', 'waveSpeed'], ['uWaterClarity', 'waterClarity'], ['uFoam', 'foam'],
      ['uWaterIOR', 'waterIOR'], ['uSunGlitter', 'sunGlitter'],
      ['uAbsorption', 'absorption'], ['uSeedW', 'seedW'], ['uDetailAmp', 'detailAmp'],
      ['uTerrainTexel', 'terrainTexel'],
      ['uSunIrradiance', 'sunIrradiance'], ['uSkyScale', 'skyScale'],
      ['uSunDiskIntensity', 'sunDisk'], ['uHazeStrength', 'haze'],
      ['uMultiScatter', 'multiScatter'],
      ['uCloudBase', 'cloudBase'], ['uCloudTop', 'cloudTop'], ['uCloudCover', 'cloudCover'],
      ['uCloudUnit', 'cloudUnit'], ['uCloudDetailUnit', 'cloudDetailUnit'],
      ['uCloudContrast', 'cloudContrast'], ['uCloudErosion', 'cloudErosion'],
      ['uCloudVert', 'cloudVert'], ['uCloudFadeNear', 'cloudFadeNear'],
      ['uCloudSteps', 'cloudSteps'], ['uCloudDensityScale', 'cloudDensityScale'],
      ['uCloudSunScale', 'cloudSun'], ['uCloudAmbient', 'cloudAmbient'],
      ['uWeatherTile', 'weatherTile'], ['uWaveDir', 'waveDir']
    ];

    R.sunDir = function (elevDeg, aziDeg) {
      var e = elevDeg * Math.PI / 180, a = aziDeg * Math.PI / 180;
      return [Math.cos(e) * Math.sin(a), Math.sin(e), Math.cos(e) * Math.cos(a)];
    };
    R.mieBeta = function (s) {
      var t = clamp(s.mieTint === undefined ? 1 : s.mieTint, 0, 1);
      var m = s.betaM;
      return [m * (1 + (0.62 - 1) * t), m * (1 + (0.85 - 1) * t), m];
    };

    function sunTransCalc(elevRad, h, s) {
      var sinE = Math.sin(elevRad);
      var deg = elevRad * 180 / Math.PI;
      if (deg < -3.5) return [0, 0, 0];
      var airmass = 1 / (Math.max(sinE, 0.015) + 0.15 * Math.pow(Math.max(0.5, deg + 3.885), -1.253));
      airmass = Math.min(38, airmass);
      var hr = s.hr || 8000, hm = s.hm || 1200;
      var sR = hr * Math.exp(-Math.max(0, h) / hr) * airmass;
      var sM = hm * Math.exp(-Math.max(0, h) / hm) * airmass;
      var sO = sR * (s.ozone || 1.0);
      var bR = s.betaR, bM = R.mieBeta(s);
      var bO = [0.65e-6, 1.881e-6, 0.085e-6];
      return [
        Math.exp(-(bR[0] * sR + bM[0] * 1.11 * sM + bO[0] * sO)),
        Math.exp(-(bR[1] * sR + bM[1] * 1.11 * sM + bO[1] * sO)),
        Math.exp(-(bR[2] * sR + bM[2] * 1.11 * sM + bO[2] * sO))
      ];
    }

    function updateSky(force) {
      var s = R.s, L = R.lastSun;
      if (!force && Math.abs(s.sunElev - L.elev) < 0.02 && Math.abs(s.sunAzi - L.azi) < 0.05 && Math.abs(s.betaM - (L.betaM || 0)) < 1e-7) return;
      R.lastSun = { elev: s.sunElev, azi: s.sunAzi, betaM: s.betaM };
      var sd = R.sunDir(s.sunElev, s.sunAzi);
      var sunEl = s.sunElev * Math.PI / 180, sunAz = s.sunAzi * Math.PI / 180;
      for (var y = 0; y < ST_H; y++) {
        var vy = (y + 0.5) / ST_H;
        var h = vy * vy * 4200;
        for (var x = 0; x < ST_W; x++) {
          var vx = (x + 0.5) / ST_W;
          var el = -0.06 + Math.pow(vx, 2.2) * (1.5707963 + 0.06);
          var tr = sunTransCalc(el, h, s);
          var idx = (y * ST_W + x) * 4;
          sunTransData[idx] = tr[0]; sunTransData[idx + 1] = tr[1]; sunTransData[idx + 2] = tr[2]; sunTransData[idx + 3] = 1;
        }
      }
      var bR = s.betaR, bM = R.mieBeta(s), g = s.mieG || 0.72, g2 = g * g;
      var sunTr0 = sunTransCalc(sunEl, 60, s);
      var E0 = s.sunIrradiance || 11.0;
      for (var sy2 = 0; sy2 < SKY_H; sy2++) {
        var sv = (sy2 + 0.5) / SKY_H;
        var el2 = -0.06 + Math.pow(sv, 2.2) * (1.5707963 + 0.06);
        var cosEl = Math.cos(el2), sinEl = Math.sin(el2);
        var viewAir = 1 / Math.max(0.06, Math.abs(sinEl) + 0.08);
        var optR = (s.hr || 8000) * Math.min(18, viewAir);
        var optM = (s.hm || 1200) * Math.min(18, viewAir);
        var vTrR = Math.exp(-(bR[0] * optR + bM[0] * 1.11 * optM));
        var vTrG = Math.exp(-(bR[1] * optR + bM[1] * 1.11 * optM));
        var vTrB = Math.exp(-(bR[2] * optR + bM[2] * 1.11 * optM));
        var horGlow = Math.exp(-Math.max(0, sinEl) * 5.2);
        for (var sx2 = 0; sx2 < SKY_W; sx2++) {
          var su = (sx2 + 0.5) / SKY_W;
          var az = (su - 0.5) * 2 * Math.PI + sunAz;
          var dx = cosEl * Math.sin(az), dy = sinEl, dz = cosEl * Math.cos(az);
          var mu = clamp(dx * sd[0] + dy * sd[1] + dz * sd[2], -1, 1);
          var pR = 0.059683 * (1 + mu * mu);
          var pM = 0.079577 * (1 - g2) / Math.pow(Math.max(0.02, 1 + g2 - 2 * g * mu), 1.5);
          var ms = (s.multiScatter || 1.0) * 0.16 * (0.4 + 0.6 * horGlow);
          var rL = E0 * ((1 - vTrR) * (pR * 0.65 + pM * 0.28 * sunTr0[0] + ms * sunTr0[0]) + 0.14 * horGlow * sunTr0[0]);
          var gL = E0 * ((1 - vTrG) * (pR * 0.82 + pM * 0.24 * sunTr0[1] + ms * sunTr0[1]) + 0.09 * horGlow * sunTr0[1]);
          var bL = E0 * ((1 - vTrB) * (pR * 1.05 + pM * 0.18 * sunTr0[2] + ms * 0.85 * sunTr0[2]) + 0.05 * horGlow * sunTr0[2]);
          if (sinEl < 0) {
            var gd = Math.exp(sinEl * 16);
            rL *= gd; gL *= gd; bL *= gd;
          }
          var sidx = (sy2 * SKY_W + sx2) * 4;
          skyData[sidx] = Math.max(0, rL);
          skyData[sidx + 1] = Math.max(0, gL);
          skyData[sidx + 2] = Math.max(0, bL);
          skyData[sidx + 3] = 1;
        }
      }
      R.lut = { sunDir: sd };
    }

    function sampleSky(dx, dy, dz) {
      var s = R.s;
      var el = Math.asin(clamp(dy, -1, 1));
      var v = Math.pow(clamp((el + 0.06) / (1.5707963 + 0.06), 0, 1), 1 / 2.2);
      var az = Math.atan2(dx, dz) - (s.sunAzi * Math.PI / 180) + Math.PI;
      var u = ((az / (2 * Math.PI)) % 1 + 1) % 1;
      var fx = u * (SKY_W - 1), fy = v * (SKY_H - 1);
      var x0 = clamp(Math.floor(fx), 0, SKY_W - 1), x1 = (x0 + 1) % SKY_W;
      var y0 = clamp(Math.floor(fy), 0, SKY_H - 2), y1 = y0 + 1;
      var tx = fx - x0, ty = fy - y0;
      var i00 = (y0 * SKY_W + x0) * 4, i10 = (y0 * SKY_W + x1) * 4;
      var i01 = (y1 * SKY_W + x0) * 4, i11 = (y1 * SKY_W + x1) * 4;
      var sc = s.skyScale || 1.0;
      return [
        ((skyData[i00] * (1 - tx) + skyData[i10] * tx) * (1 - ty) + (skyData[i01] * (1 - tx) + skyData[i11] * tx) * ty) * sc,
        ((skyData[i00 + 1] * (1 - tx) + skyData[i10 + 1] * tx) * (1 - ty) + (skyData[i01 + 1] * (1 - tx) + skyData[i11 + 1] * tx) * ty) * sc,
        ((skyData[i00 + 2] * (1 - tx) + skyData[i10 + 2] * tx) * (1 - ty) + (skyData[i01 + 2] * (1 - tx) + skyData[i11 + 2] * tx) * ty) * sc
      ];
    }

    R.groundHeight = function (x, z) {
      var u = (x / TS + 0.5) * TN - 0.5, v = (z / TS + 0.5) * TN - 0.5;
      if (u < 0 || u >= TN - 1 || v < 0 || v >= TN - 1) {
        var edge = Math.max(Math.abs(x), Math.abs(z)) / (TS * 0.5);
        var sh = smoothstep(1.0, 1.35, edge);
        u = clamp(u, 0, TN - 1.001); v = clamp(v, 0, TN - 1.001);
        var u0e = Math.floor(u), v0e = Math.floor(v), fue = u - u0e, fve = v - v0e;
        var he = (hGrid[v0e * TN + u0e] * (1 - fue) + hGrid[v0e * TN + u0e + 1] * fue) * (1 - fve) +
                 (hGrid[(v0e + 1) * TN + u0e] * (1 - fue) + hGrid[(v0e + 1) * TN + u0e + 1] * fue) * fve;
        return mix(he, -260, sh);
      }
      var u0 = Math.floor(u), v0 = Math.floor(v), fu = u - u0, fv = v - v0;
      var a = hGrid[v0 * TN + u0], b = hGrid[v0 * TN + u0 + 1];
      var c = hGrid[(v0 + 1) * TN + u0], d = hGrid[(v0 + 1) * TN + u0 + 1];
      return (a * (1 - fu) + b * fu) * (1 - fv) + (c * (1 - fu) + d * fu) * fv;
    };
    R.readTerrainBlock = function () { return R.groundHeight; };

    function sampleAO(x, z) {
      var u = clamp(Math.floor((x / TS + 0.5) * TN), 0, TN - 1);
      var v = clamp(Math.floor((z / TS + 0.5) * TN), 0, TN - 1);
      return aoGrid[v * TN + u];
    }
    function terrainNormal(x, z, eps) {
      var e = Math.max(24, eps || 32);
      var hx = R.groundHeight(x + e, z) - R.groundHeight(x - e, z);
      var hz = R.groundHeight(x, z + e) - R.groundHeight(x, z - e);
      var nx = -hx, ny = 2 * e, nz = -hz;
      var len = Math.hypot(nx, ny, nz) || 1;
      return [nx / len, ny / len, nz / len];
    }

    function allocTargets(w, h) {
      var T = R.targets;
      T.w = w; T.h = h;
      T.scene = { w: w, h: h, data: new Float32Array(w * h * 4) };
      var bw = Math.max(48, w >> 2), bh = Math.max(27, h >> 2);
      var bloomBuf = { w: bw, h: bh, data: new Float32Array(bw * bh * 4) };
      T.bloomDown = [bloomBuf];
      T.bloomUp = [bloomBuf];
      T.strip = { w: 256, h: 144, data: new Float32Array(256 * 144 * 4) };
      T.levels = 1;
    }

    R.resize = function () {
      var cssW = canvas.clientWidth || canvas.width || 1280;
      var cssH = canvas.clientHeight || canvas.height || 720;
      if (canvas.width !== cssW || canvas.height !== cssH) { canvas.width = cssW; canvas.height = cssH; }
      if (drawCanvas !== canvas && (drawCanvas.width !== cssW || drawCanvas.height !== cssH)) {
        drawCanvas.width = cssW; drawCanvas.height = cssH;
      }
      var w = Math.max(160, Math.min(320, Math.round(cssW * (R.stats.scale || 0.25))));
      var h = Math.max(90, Math.min(180, Math.round(cssH * (R.stats.scale || 0.25))));
      if (!R.targets.scene || R.targets.w !== w || R.targets.h !== h) allocTargets(w, h);
    };

    function aces(x) {
      return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0, 1);
    }

    R.render = function (dt, force) {
      if (!R.ready) return;
      R.frame++;
      if (dt) R.s.time += dt;
      updateSky(force);
      var T = R.targets;
      if (!T.scene) R.resize();
      var w = T.w, h = T.h, scData = T.scene.data;
      var s = R.s, cam = R.camera, stg = s.stages;
      var sd = R.sunDir(s.sunElev, s.sunAzi);
      var sunTr = sunTransCalc(s.sunElev * Math.PI / 180, Math.max(1, cam.pos[1]), s);
      var sunCol = [sunTr[0] * s.sunIrradiance, sunTr[1] * s.sunIrradiance, sunTr[2] * s.sunIrradiance];
      var skyUp = sampleSky(0, 0.85, 0);
      var tanH = Math.tan((cam.fov || 42) * Math.PI / 360);
      var aspect = w / h;
      var ro0 = cam.pos[0], ro1 = cam.pos[1], ro2 = cam.pos[2];
      var fwd = cam.fwd, right = cam.right, up = cam.up;
      var seaL = s.seaLevel || 0;
      var view = s.view | 0;
      var time = s.time || 0;

      for (var py = 0; py < h; py++) {
        var ndcY = ((py + 0.5) / h) * 2 - 1;
        for (var px = 0; px < w; px++) {
          var ndcX = ((px + 0.5) / w) * 2 - 1;
          var rx = fwd[0] + right[0] * ndcX * aspect * tanH + up[0] * ndcY * tanH;
          var ry = fwd[1] + right[1] * ndcX * aspect * tanH + up[1] * ndcY * tanH;
          var rz = fwd[2] + right[2] * ndcX * aspect * tanH + up[2] * ndcY * tanH;
          var rlen = Math.hypot(rx, ry, rz) || 1;
          rx /= rlen; ry /= rlen; rz /= rlen;

          // Sky
          var sky = stg[4] > 0.01 ? sampleSky(rx, ry, rz) : [0.06, 0.07, 0.10];
          var muSun = rx * sd[0] + ry * sd[1] + rz * sd[2];
          if (stg[4] > 0.01 && ry > -0.02) {
            var disk = smoothstep(0.99965, 0.99992, muSun) * (s.sunDisk || 45);
            var glow = Math.pow(Math.max(0, muSun), 16) * 0.45;
            sky[0] += sunTr[0] * (disk + glow);
            sky[1] += sunTr[1] * (disk * 0.88 + glow * 0.75);
            sky[2] += sunTr[2] * (disk * 0.68 + glow * 0.45);
          }

          // Clouds (stage 7)
          if (stg[7] > 0.01 && ry > 0.015) {
            var ct = ((s.cloudBase || 1900) - ro1) / ry;
            if (ct > 0 && ct < 48000) {
              var cx = ro0 + rx * ct + time * (s.wind || 8.5) * 3.0;
              var cz = ro2 + rz * ct + time * (s.wind || 8.5) * 1.4;
              var wtile = s.weatherTile || 160000;
              var wu = ((cx / wtile) % 1 + 1) % 1, wv = ((cz / wtile) % 1 + 1) % 1;
              var widx = (Math.floor(wv * (WN - 1)) * WN + Math.floor(wu * (WN - 1))) * 4;
              var wcov = weatherTex[widx];
              var cn = fbm2(cx * 0.00028, cz * 0.00028, 3);
              var cdens = smoothstep(0.42 - (s.cloudCover || 0.16) * 0.55, 0.78, wcov * 0.65 + cn * 0.55) * stg[7];
              var cfade = Math.exp(-ct / 38000);
              cdens *= cfade;
              if (cdens > 0.005) {
                var hg = 0.25 + 0.95 * Math.pow(Math.max(0, muSun), 4);
                var cLightR = skyUp[0] * 0.85 + sunCol[0] * 0.22 * hg;
                var cLightG = skyUp[1] * 0.85 + sunCol[1] * 0.19 * hg;
                var cLightB = skyUp[2] * 0.85 + sunCol[2] * 0.15 * hg;
                var cAlpha = clamp(cdens * 0.82, 0, 0.92);
                sky[0] = mix(sky[0], cLightR, cAlpha);
                sky[1] = mix(sky[1], cLightG, cAlpha);
                sky[2] = mix(sky[2], cLightB, cAlpha);
              }
            }
          }

          var colR = sky[0], colG = sky[1], colB = sky[2];

          // Stage 0 ray-plane grid when terrain is off
          var tSea = ry < -1e-4 ? (seaL - ro1) / ry : 1e9;
          if (stg[1] < 0.999) {
            var bgR = 0.05, bgG = 0.06, bgB = 0.09;
            if (tSea > 0 && tSea < 40000) {
              var gx2 = ro0 + rx * tSea, gz2 = ro2 + rz * tSea;
              var gr = Math.max(
                1 - smoothstep(0, 0.08, Math.abs(fract(gx2 / 500) - 0.5)),
                1 - smoothstep(0, 0.08, Math.abs(fract(gz2 / 500) - 0.5))
              ) * Math.exp(-tSea / 14000);
              bgR += gr * 0.28; bgG += gr * 0.22; bgB += gr * 0.14;
            }
            if (stg[1] <= 0.001) {
              colR = bgR; colG = bgG; colB = bgB;
            }
          }

          // Terrain march (stage 1)
          var hitLand = false, tHit = 1e9, hx2 = 0, hy2 = 0, hz2 = 0;
          if (stg[1] > 0.001 && ry < 0.32) {
            var t = 18;
            var tMax = tSea > 0 ? Math.min(22000, tSea * 1.05) : 22000;
            var prevT = t, prevD = 1;
            for (var m = 0; m < 36; m++) {
              if (t > tMax) break;
              var mx2 = ro0 + rx * t, my2 = ro1 + ry * t, mz2 = ro2 + rz * t;
              var gh = R.groundHeight(mx2, mz2);
              var diff = my2 - gh;
              if (diff <= 0) {
                var frac = prevD / Math.max(1e-3, prevD - diff);
                tHit = prevT + clamp(frac, 0, 1) * (t - prevT);
                hx2 = ro0 + rx * tHit; hy2 = ro1 + ry * tHit; hz2 = ro2 + rz * tHit;
                hitLand = true;
                break;
              }
              prevT = t; prevD = diff;
              t += Math.max(24, diff * 0.48 + t * 0.032);
            }
          }

          var isWater = stg[5] > 0.01 && tSea > 0 && (!hitLand || tSea < tHit);
          var isLand = hitLand && (!isWater);

          if (isLand) {
            var n = terrainNormal(hx2, hz2, 24 + tHit * 0.006);
            var ndl = Math.max(0, n[0] * sd[0] + n[1] * sd[1] + n[2] * sd[2]);
            // shadow probe
            var sh = 1.0;
            if (stg[3] > 0.01 && ndl > 0.01) {
              var shH = R.groundHeight(hx2 + sd[0] * 180, hz2 + sd[2] * 180);
              if (shH > hy2 + sd[1] * 180 + 8) sh = 0.22;
            }
            var ao = sampleAO(hx2, hz2);
            var slope = 1 - n[1];
            var rockW = smoothstep(0.18, 0.42, slope);
            var grassW = (1 - rockW) * smoothstep(seaL + 6, seaL + 45, hy2) * (1 - smoothstep(550, 1100, hy2));
            var beachW = (1 - rockW) * (1 - smoothstep(seaL, seaL + 14, hy2));
            var snowW = smoothstep(1350, 1650, hy2) * smoothstep(0.45, 0.75, n[1]);
            var albR = 0.17, albG = 0.14, albB = 0.12;
            albR = mix(albR, 0.13, grassW); albG = mix(albG, 0.19, grassW); albB = mix(albB, 0.09, grassW);
            albR = mix(albR, 0.36, beachW); albG = mix(albG, 0.30, beachW); albB = mix(albB, 0.22, beachW);
            albR = mix(albR, 0.72, snowW);  albG = mix(albG, 0.75, snowW);  albB = mix(albB, 0.80, snowW);
            if (stg[3] < 0.99) {
              albR = mix(0.24, albR, stg[3]);
              albG = mix(0.23, albG, stg[3]);
              albB = mix(0.22, albB, stg[3]);
            }
            var dirLight = ndl * sh;
            var amb = (0.35 + 0.65 * n[1]) * ao;
            var lR = albR * (sunCol[0] * dirLight * 0.32 + skyUp[0] * amb * 1.1);
            var lG = albG * (sunCol[1] * dirLight * 0.32 + skyUp[1] * amb * 1.1);
            var lB = albB * (sunCol[2] * dirLight * 0.32 + skyUp[2] * amb * 1.1);
            if (stg[2] < 0.99) {
              var clay = 0.12 + 0.22 * clamp(hy2 / 1400, 0, 1);
              lR = mix(clay, lR, stg[2]);
              lG = mix(clay * 0.95, lG, stg[2]);
              lB = mix(clay * 0.90, lB, stg[2]);
            }
            if (stg[4] > 0.01) {
              var fog = (1 - Math.exp(-tHit * 0.000055 * (0.5 + (s.haze || 0.5)))) * stg[4];
              var hSky = sampleSky(rx, Math.max(0.02, ry), rz);
              lR = mix(lR, hSky[0], fog);
              lG = mix(lG, hSky[1], fog);
              lB = mix(lB, hSky[2], fog);
            }
            colR = lR; colG = lG; colB = lB;
          } else if (isWater && tSea < 45000) {
            var wx3 = ro0 + rx * tSea, wz3 = ro2 + rz * tSea;
            var bedH = R.groundHeight(wx3, wz3);
            var depth = Math.max(0.1, seaL - bedH);
            var wnx = Math.sin(wx3 * 0.08 + time * 1.9) * 0.045 + Math.cos(wz3 * 0.13 - time * 1.4) * 0.035;
            var wnz = Math.cos(wx3 * 0.06 - time * 1.6) * 0.045 + Math.sin(wz3 * 0.11 + time * 2.1) * 0.035;
            var foot = clamp(180 / (180 + tSea * 0.15), 0.08, 1);
            wnx *= foot * (s.waveAmp || 1); wnz *= foot * (s.waveAmp || 1);
            var cosT = clamp(-(rx * wnx + ry * 0.998 + rz * wnz), 0.02, 1);
            var fres = 0.0204 + 0.9796 * Math.pow(1 - cosT, 5);
            var rfx = rx + 2 * cosT * wnx, rfy = Math.abs(ry) + 2 * cosT * 0.02, rfz = rz + 2 * cosT * wnz;
            var refl = sampleSky(rfx, clamp(rfy, 0.02, 0.99), rfz);
            var absR = Math.exp(-depth * 0.34 * 0.12);
            var absG = Math.exp(-depth * 0.065 * 0.12);
            var absB = Math.exp(-depth * 0.009 * 0.12);
            var bodyR = (0.015 + 0.18 * absR) * sunCol[0] * 0.18;
            var bodyG = (0.055 + 0.24 * absG) * sunCol[1] * 0.22;
            var bodyB = (0.095 + 0.18 * absB) * sunCol[2] * 0.26;
            var reflW = fres * stg[6];
            var wR = mix(bodyR, refl[0], reflW);
            var wG = mix(bodyG, refl[1], reflW);
            var wB = mix(bodyB, refl[2], reflW);
            // Sun glitter path
            if (stg[6] > 0.01) {
              var hx3 = sd[0] - rx, hy3 = sd[1] - ry, hz3 = sd[2] - rz;
              var hlen = Math.hypot(hx3, hy3, hz3) || 1;
              hx3 /= hlen; hy3 /= hlen; hz3 /= hlen;
              var ndh = clamp(hx3 * wnx + hy3 * 0.998 + hz3 * wnz, 0, 1);
              var sigma2 = Math.max(0.004, 0.003 + 0.0035 * (s.wind || 8.5));
              var glit = Math.exp(-((1 - ndh * ndh) / Math.max(1e-4, ndh * ndh * sigma2))) / (Math.PI * sigma2 * 4);
              glit *= (s.sunGlitter || 1.6) * stg[6] * fres;
              wR += sunCol[0] * glit * 0.35;
              wG += sunCol[1] * glit * 0.30;
              wB += sunCol[2] * glit * 0.22;
            }
            // Shore foam
            var shoreFoam = Math.exp(-depth * 0.55) * (0.45 + 0.55 * Math.sin(depth * 2.5 - time * 2.8)) * (s.foam || 1) * foot;
            shoreFoam = clamp(shoreFoam, 0, 0.65);
            var fCol = (sunCol[0] * 0.16 + skyUp[0] * 0.7);
            wR = mix(wR, fCol, shoreFoam);
            wG = mix(wG, fCol * 0.96, shoreFoam);
            wB = mix(wB, fCol * 0.92, shoreFoam);
            if (stg[4] > 0.01) {
              var wFog = (1 - Math.exp(-tSea * 0.000045)) * stg[4];
              var hSky2 = sampleSky(rx, 0.02, rz);
              wR = mix(wR, hSky2[0], wFog);
              wG = mix(wG, hSky2[1], wFog);
              wB = mix(wB, hSky2[2], wFog);
            }
            colR = wR; colG = wG; colB = wB;
          }

          if (view === 24) {
            if (px > w * 0.68 && py < h * 0.36) {
              var lu = (px - w * 0.68) / (w * 0.30), lv = py / (h * 0.34);
              if (lu >= 0 && lu <= 1 && lv >= 0 && lv <= 1) {
                var lidx = (Math.floor((1 - lv) * (SKY_H - 1)) * SKY_W + Math.floor(lu * (SKY_W - 1))) * 4;
                colR = skyData[lidx] * 0.35; colG = skyData[lidx + 1] * 0.35; colB = skyData[lidx + 2] * 0.35;
              }
            }
          }

          var oi = (py * w + px) * 4;
          scData[oi] = Math.max(0, colR);
          scData[oi + 1] = Math.max(0, colG);
          scData[oi + 2] = Math.max(0, colB);
          scData[oi + 3] = 1;
        }
      }

      // Auto-exposure (trimmed mean)
      var ex = s.exposureAuto ? R.autoExp : s.exposure;
      if (s.exposureAuto) {
        var samples = [];
        var stepX = Math.max(1, Math.floor(w / 8)), stepY = Math.max(1, Math.floor(h / 8));
        for (var ey2 = 0; ey2 < 8; ey2++) {
          for (var ex2 = 0; ex2 < 8; ex2++) {
            var si = (Math.min(h - 1, ey2 * stepY) * w + Math.min(w - 1, ex2 * stepX)) * 4;
            var luma = 0.2126 * scData[si] + 0.7152 * scData[si + 1] + 0.0722 * scData[si + 2];
            if (isFinite(luma) && luma >= 0) samples.push(luma);
          }
        }
        samples.sort(function (a, b) { return a - b; });
        var i0 = Math.floor(samples.length * 0.25), i1 = Math.max(i0 + 1, Math.floor(samples.length * 0.88));
        var sum = 0;
        for (var k = i0; k < i1; k++) sum += samples[k];
        var avg = sum / Math.max(1, i1 - i0);
        if (avg > 1e-5) {
          var want = clamp(s.exposureKey * s.exposureBias / avg, s.exposureMin, s.exposureMax);
          var rate = R.frame < 40 ? 1.0 : (dt ? Math.min(1, dt * s.exposureRate) : 1);
          R.autoExp += (want - R.autoExp) * rate;
        }
        ex = R.autoExp;
      }
      R.lastExposure = ex;

      // Populate bloom buffer & composite to canvas
      var bl = T.bloomUp[0], bw = bl.w, bh = bl.h, bData = bl.data;
      for (var by = 0; by < bh; by++) {
        for (var bx = 0; bx < bw; bx++) {
          var sx3 = Math.min(w - 1, Math.floor(bx * w / bw));
          var sy3 = Math.min(h - 1, Math.floor(by * h / bh));
          var sIdx = (sy3 * w + sx3) * 4, dIdx = (by * bw + bx) * 4;
          bData[dIdx] = Math.max(0, scData[sIdx] * ex - 0.8);
          bData[dIdx + 1] = Math.max(0, scData[sIdx + 1] * ex - 0.8);
          bData[dIdx + 2] = Math.max(0, scData[sIdx + 2] * ex - 0.8);
          bData[dIdx + 3] = 1;
        }
      }

      if (offCanvas.width !== w || offCanvas.height !== h) {
        offCanvas.width = w; offCanvas.height = h;
      }
      var img = offCtx.createImageData(w, h);
      var d = img.data;
      var stg8 = stg[8] !== undefined ? stg[8] : 1;
      var vig = (s.vignette || 0.22) * stg8;
      for (var cy2 = 0; cy2 < h; cy2++) {
        var vy2 = (cy2 / h) - 0.5;
        for (var cx2 = 0; cx2 < w; cx2++) {
          var vx2 = (cx2 / w) - 0.5;
          var srcI = ((h - 1 - cy2) * w + cx2) * 4;
          var dstI = (cy2 * w + cx2) * 4;
          var r = scData[srcI] * ex, g = scData[srcI + 1] * ex, b = scData[srcI + 2] * ex;
          var tr = mix(clamp(r, 0, 1), aces(r), stg8);
          var tg = mix(clamp(g, 0, 1), aces(g), stg8);
          var tb = mix(clamp(b, 0, 1), aces(b), stg8);
          var vmul = 1 - vig * (vx2 * vx2 + vy2 * vy2) * 2.2;
          tr = Math.pow(clamp(tr * vmul, 0, 1), 1 / 2.2);
          tg = Math.pow(clamp(tg * vmul, 0, 1), 1 / 2.2);
          tb = Math.pow(clamp(tb * vmul, 0, 1), 1 / 2.2);
          d[dstI] = Math.round(tr * 255);
          d[dstI + 1] = Math.round(tg * 255);
          d[dstI + 2] = Math.round(tb * 255);
          d[dstI + 3] = 255;
        }
      }
      offCtx.putImageData(img, 0, 0);
      if (g2d) {
        g2d.imageSmoothingEnabled = true;
        g2d.drawImage(offCanvas, 0, 0, w, h, 0, 0, drawCanvas.width, drawCanvas.height);
      }
    };

    R.adapt = function (ms) {
      var st = R.stats;
      st.msAvg = st.msAvg === undefined ? ms : st.msAvg * 0.75 + ms * 0.25;
    };

    R.canvasSample = function (pts) {
      if (!g2d) return pts.map(function () { return [128, 128, 128]; });
      var out = [];
      for (var i = 0; i < pts.length; i++) {
        var x = clamp(Math.round(pts[i][0]), 0, drawCanvas.width - 1);
        var y = clamp(Math.round(pts[i][1]), 0, drawCanvas.height - 1);
        var p = g2d.getImageData(x, y, 1, 1).data;
        out.push([p[0], p[1], p[2]]);
      }
      return out;
    };

    R.capturePNG = function () {
      return drawCanvas.toDataURL('image/png');
    };

    R.textureToCanvas = function (target, c2, mode, gamma, tint) {
      if (!target || !c2) return c2;
      var w = target.w || target.__w || 64, h = target.h || target.__h || 64;
      var data = target.data;
      if (!data) return c2;
      var ctx = c2.getContext('2d');
      var img = ctx.createImageData(w, h);
      var gm = gamma === undefined ? 1.0 : gamma;
      for (var y = 0; y < h; y++) {
        var src = (h - 1 - y) * w * 4, dst = y * w * 4;
        for (var x = 0; x < w; x++) {
          var o = src + x * 4, d = dst + x * 4;
          var r = clamp(data[o] * gm, 0, 1);
          var g = clamp((mode > 0.5 ? data[o] : data[o + 1]) * gm, 0, 1);
          var b = clamp((mode > 0.5 ? data[o] : data[o + 2]) * gm, 0, 1);
          if (tint) {
            var tc = tint(r, g, b);
            r = clamp(tc[0], 0, 1); g = clamp(tc[1], 0, 1); b = clamp(tc[2], 0, 1);
          }
          img.data[d] = Math.round(r * 255);
          img.data[d + 1] = Math.round(g * 255);
          img.data[d + 2] = Math.round(b * 255);
          img.data[d + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      return c2;
    };

    R.sampleScene = function (x, y) {
      var T = R.targets;
      if (!T || !T.scene) return [0, 0, 0];
      var gx = clamp(Math.round(x), 0, T.w - 1);
      var gy = clamp(Math.round(T.h - 1 - y), 0, T.h - 1);
      var idx = (gy * T.w + gx) * 4;
      var d = T.scene.data;
      return [d[idx], d[idx + 1], d[idx + 2]];
    };

    R.terrainStats = function () {
      var mn = 1e9, mx = -1e9, sum = 0, above = 0, aoSum = 0, n = TN * TN;
      for (var i = 0; i < n; i++) {
        var hv = hGrid[i];
        if (hv < mn) mn = hv; if (hv > mx) mx = hv;
        sum += hv; aoSum += aoGrid[i];
        if (hv > 0) above++;
      }
      var sorted = Array.prototype.slice.call(hGrid).sort(function (a, b) { return a - b; });
      var pc = function (q) { return sorted[clamp(Math.round(q * (n - 1)), 0, n - 1)]; };
      return { min: mn, max: mx, mean: sum / n, landFraction: above / n,
        p01: pc(0.01), p05: pc(0.05), p50: pc(0.5), p95: pc(0.95), p99: pc(0.99), aoMean: aoSum / n };
    };

    R.lutColumn = function (target, u, out) {
      if (!target || !target.data) return null;
      var w = target.w, h = target.h, d = target.data;
      if (!out || out.length !== h * 4) out = new Float32Array(h * 4);
      var x = clamp(Math.round(u * (w - 1)), 0, w - 1);
      for (var y = 0; y < h; y++) {
        var si = (y * w + x) * 4, di = y * 4;
        out[di] = d[si]; out[di + 1] = d[si + 1]; out[di + 2] = d[si + 2]; out[di + 3] = 1;
      }
      return out;
    };

    R.sunTransAt = function (elevRad, height, out) {
      out = out || [0, 0, 0];
      var tr = sunTransCalc(elevRad, height, R.s);
      out[0] = tr[0]; out[1] = tr[1]; out[2] = tr[2];
      return out;
    };

    R.histogram = function (bins, mode) {
      var T = R.targets;
      var hist = new Float32Array(bins);
      if (!T || !T.scene) return { hist: hist, total: 1 };
      var d = T.scene.data, n = T.w * T.h;
      var ex = R.lastExposure !== undefined ? R.lastExposure : R.s.exposure;
      var log2mode = (mode === 'log2');
      for (var i = 0; i < n; i++) {
        var r = d[i * 4] * ex, g = d[i * 4 + 1] * ex, b = d[i * 4 + 2] * ex;
        var lLin = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        var v = log2mode
          ? clamp((Math.log2(Math.max(lLin, 1e-6)) - (-14)) / 24, 0, 1)
          : Math.pow(clamp(aces(lLin), 0, 1), 1 / 2.2);
        hist[clamp(Math.floor(v * bins), 0, bins - 1)]++;
      }
      return { hist: hist, total: n };
    };

    R.autoExp = R.s.exposure;
    R.ready = true;
    R.buildInfo = {
      renderer: 'CPU Raymarch Fallback',
      hdr: 'FLOAT32',
      terrainRes: P.terrainRes || TN,
      genMs: Math.round(R.genMs),
      colorFloat: true,
      colorHalf: true,
      fallback: true
    };
    return R;
  };

  SS.Renderer = function (canvas, opts) {
    var P = {};
    for (var k in DEFAULTS) P[k] = DEFAULTS[k];
    // An undefined here means "the caller forgot", not "use zero": ignoring it keeps the
    // default and turns a silent flat terrain into a working one.
    if (opts) for (var k2 in opts) if (opts[k2] !== undefined) P[k2] = opts[k2];

    var api = SS.gl(canvas);
    if (!api) return SS.FallbackRenderer(canvas, P, 'no-webgl2');
    var gl = api.raw;
    try {

    var R = {
      api: api, params: P, canvas: canvas,
      ready: false, error: null,
      stats: { ms: 0, fps: 0,
        scale: P.adaptive ? Math.max(0.05, P.startScale) : Math.max(0.08, P.renderScale),
        quality: P.quality, passes: 0 },
      gen: null, programs: {}, targets: {},
      lastSun: { elev: -99, azi: -99 },
      frame: 0
    };

    // ---------------------------------------------------------------- generation
    var t0 = performance.now();
    R.gen = SS.Generator(api, P);
    R.genMs = performance.now() - t0;

    // ---------------------------------------------------------------- programs
    var FS_SCENE = assemble(null, [
      GL.paramsBlock, GL.prototypes,
      GL.common, GL.atmo, GL.terrain, GL.clouds, GL.water, GL.scene
    ]);
    R.bakeSrc = { sky: GL.atmoParams + GL.common + GL.atmo + GL.skyLUTShader,
                  sun: GL.atmoParams + GL.common + GL.atmo + GL.sunTransShader };
    R.sceneSource = FS_SCENE;
    function mk(src) { return api.program(assemble(null, [src])); }
    R.programs.scene = api.program(FS_SCENE);
    R.programs.bloomDown = mk(GL.bloomDownShader);
    R.programs.bloomUp = mk(GL.bloomUpShader);
    R.programs.composite = mk(GL.compositeShader);
    R.programs.strip = mk(GL.stripShader);
    R.programs.avg = mk(GL.avgShader);
    R.programs.copy = api.program(assemble(null, [GL.common + `
      uniform sampler2D uSrc; uniform vec2 uRes; out vec4 outColor;
      void main(){ vec2 uv = gl_FragCoord.xy/uRes; outColor = vec4(texture(uSrc, uv).rgb, 1.0);} `]));
    R.programs.view = api.program(assemble(null, [GL.common + `
      uniform sampler2D uSrc; uniform vec2 uRes; uniform float uMode; uniform float uGamma;
      out vec4 outColor;
      void main(){
        vec2 uv = gl_FragCoord.xy/uRes;
        vec3 c = texture(uSrc, uv).rgb;
        if (uMode > 0.5) c = vec3(texture(uSrc, uv).r);      // single channel (height, ao)
        c *= uGamma;
        outColor = vec4(saturate(c), 1.0);
      }`]));

    // ---------------------------------------------------------------- targets
    var hdr = api.colorFloat ? gl.RGBA16F : (api.colorHalf ? gl.RGBA16F : gl.RGBA8);
    var hdrType = api.colorFloat ? gl.HALF_FLOAT : (api.colorHalf ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE);
    R.hdrInternal = hdr; R.hdrType = hdrType;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    R.dpr = dpr;

    function allocTargets(w, h) {
      var T = R.targets;
      T.w = w; T.h = h;
      if (T.scene) { gl.deleteTexture(T.scene.tex); gl.deleteFramebuffer(T.scene.fbo); }
      T.scene = api.target(w, h, hdr, hdrType, gl.LINEAR);
      var levels = 5;
      T.bloomDown = []; T.bloomUp = [];
      var bw = w, bh = h;
      for (var i = 0; i < levels; i++) {
        bw = Math.max(1, bw >> 1); bh = Math.max(1, bh >> 1);
        T.bloomDown.push(api.target(bw, bh, hdr, hdrType, gl.LINEAR));
        T.bloomUp.push(api.target(bw, bh, hdr, hdrType, gl.LINEAR));
      }
      if (!T.strip || T.strip.w !== 256) T.strip = api.target(256, 144, hdr, hdrType, gl.LINEAR);
      if (!T.expo || T.expo.w !== 8) T.expo = api.target(8, 8, hdr, hdrType, gl.LINEAR);
      T.levels = levels;
    }

    R.resize = function () {
      var dprUse = R.qualityScale ? dpr : dpr;
      var cssW = canvas.clientWidth || canvas.width;
      var cssH = canvas.clientHeight || canvas.height;
      var scale = R.stats.scale * dprUse;
      var w = Math.max(160, Math.round(cssW * scale));
      var h = Math.max(90, Math.round(cssH * scale));
      var bw = Math.round(cssW * dprUse), bh = Math.round(cssH * dprUse);
      if (canvas.width !== bw || canvas.height !== bh) { canvas.width = bw; canvas.height = bh; }
      if (!R.targets.scene || R.targets.w !== w || R.targets.h !== h) allocTargets(w, h);
    };

    // ---------------------------------------------------------------- params
    R.s = {
      time: 0, frameJitter: 0,
      exposure: 0.55, bloom: 0.05, vignette: 0.22, grain: 0.012, chroma: 0.35, split: -1, postMix: 1,
      haze: 0.5, debugMix: 1.0, view: 0,
      // auto exposure: the camera adapts to the average radiance of the frame, which is
      // what makes one set of numbers work from noon to the last light
      exposureAuto: true, exposureKey: 0.135, exposureRate: 1.9,
      exposureMin: 0.05, exposureMax: 6.0, exposureBias: 1.0,
      stages: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      sunElev: 9.5, sunAzi: 196, sunDisk: 45,
      betaR: [5.8e-6, 13.5e-6, 33.1e-6], betaM: 42e-6, mieG: 0.72, hr: 8000, hm: 1200, ozone: 1.0, mieTint: 1.0,
      sunIrradiance: 11.0, skyScale: 1.0, multiScatter: 1.0,
      wind: 8.5, seaLevel: 0, waveAmp: 1, waveSpeed: 1, waterClarity: 1, foam: 1, waterIOR: 1.333, sunGlitter: 1.6,
      // These four were missing from the state object, and a missing key is skipped
      // silently in setSceneUniforms: uWeatherTile stayed 0 (every cloud evaluated to
      // zero density, because the weather lookup divided by it), uWaveDir stayed the
      // zero vector (normalize() of which is NaN, so the water normals were garbage) and
      // uAbsorption stayed 0 (so the sea had no depth tint at all). Every entry in
      // R.uniformTable must exist here.
      absorption: 1.0, seedW: 3.7, weatherTile: 160000.0, waveDir: [0.87, 0.49],
      cloudCover: 0.16, cloudBase: 1900, cloudTop: 3300, cloudScale: 46000, cloudUnit: 170, cloudDetailUnit: 48, cloudContrast: 1.8, cloudErosion: 0.55, cloudVert: 4.6,
      cloudFadeNear: 26000, cloudSteps: 0.6, cloudSun: 1.1, cloudAmbient: 1.35,
      cloudDensityScale: 0.020, detailAmp: 1,
      terrainTexel: P.terrainSize / P.terrainRes,   // metres per height-field texel
      terrainSize: P.terrainSize
    };

    R.camera = {
      pos: [0, 62, 900], fwd: [0, -0.05, -1], up: [0, 1, 0], right: [1, 0, 0],
      fov: 42
    };

    function sunDir(elevDeg, aziDeg) {
      var e = elevDeg * Math.PI / 180, a = aziDeg * Math.PI / 180;
      return [Math.cos(e) * Math.sin(a), Math.sin(e), Math.cos(e) * Math.cos(a)];
    }
    R.sunDir = sunDir;

    // Mie scattering follows a weak power law (Angstrom exponent ~1.3 over the visible),
    // so a grey coefficient is only right for a monochromatic sky. Keeping it grey made
    // the whole twilight sky a tan haze with no blue left in the upper half: the halo was
    // scattering white light into regions that should have been dominated by Rayleigh.
    R.mieBeta = function (s) {
      var t = Math.max(0, Math.min(1, s.mieTint === undefined ? 1 : s.mieTint));
      var grey = [1, 1, 1];
      var angstrom = [0.62, 0.85, 1.0];              // 550 nm reference, alpha = 1.3
      var m = s.betaM;
      return [m * (grey[0] + (angstrom[0] - grey[0]) * t),
              m * (grey[1] + (angstrom[1] - grey[1]) * t),
              m * (grey[2] + (angstrom[2] - grey[2]) * t)];
    };
    function updateSky(force) {
      var s = R.s;
      var L = R.lastSun;
      var dirty = force
        || Math.abs(s.sunElev - L.elev) > 0.02
        || Math.abs(s.sunAzi - L.azi) > 0.05
        || Math.abs(s.betaM / (L.betaM || 1) - 1) > 0.02
        || Math.abs((s.mieTint === undefined ? 1 : s.mieTint) - (L.mieTint === undefined ? 1 : L.mieTint)) > 0.02
        || Math.abs(s.ozone - L.ozone) > 0.002
        || Math.abs(s.multiScatter - L.multiScatter) > 0.002
        || Math.abs(s.sunIrradiance / (L.sunIrradiance || 1) - 1) > 0.002
        || Math.abs(s.mieG - L.mieG) > 0.002
        || Math.abs(s.hr - (L.hr || 1)) > 1
        || Math.abs(s.hm - (L.hm || 1)) > 1
        || s.betaR[0] !== (L.betaR ? L.betaR[0] : null);
      if (!dirty) return;
      R.lastSun = { elev: s.sunElev, azi: s.sunAzi, betaM: s.betaM, mieTint: s.mieTint, ozone: s.ozone,
        multiScatter: s.multiScatter, sunIrradiance: s.sunIrradiance, mieG: s.mieG,
        hr: s.hr, hm: s.hm, betaR: s.betaR.slice() };
      var sd = sunDir(s.sunElev, s.sunAzi);
      R.gen.updateSky({
        sunElev: s.sunElev * Math.PI / 180, sunAzi: s.sunAzi * Math.PI / 180, sunDir: sd,
        betaR: s.betaR, betaM: R.mieBeta(s), mieG: s.mieG, hr: s.hr, hm: s.hm, ozone: s.ozone,
        sunIrradiance: s.sunIrradiance, sunDiskIntensity: s.sunDisk, skyScale: s.skyScale,
        multiScatter: s.multiScatter, quality: Math.min(1.0, P.quality + 0.25)
      }, Math.max(R.camera.pos[1], 1.0));
      R.lut = { sunDir: sd };
    }

    // ---------------------------------------------------------------- render
    // Every uniform the scene program reads, with the state key it comes from. Keeping
    // this in one table is what stops a control from silently doing nothing: the UI, the
    // timeline and the probe all write to R.s, and this is the only place that reads it.
    R.uniformTable = [
      ['uWind', 'wind'], ['uSeaLevel', 'seaLevel'], ['uWaveAmp', 'waveAmp'],
      ['uWaveSpeed', 'waveSpeed'], ['uWaterClarity', 'waterClarity'], ['uFoam', 'foam'],
      ['uWaterIOR', 'waterIOR'], ['uSunGlitter', 'sunGlitter'],
      ['uAbsorption', 'absorption'], ['uSeedW', 'seedW'], ['uDetailAmp', 'detailAmp'],
      ['uTerrainTexel', 'terrainTexel'],
      ['uSunIrradiance', 'sunIrradiance'], ['uSkyScale', 'skyScale'],
      ['uSunDiskIntensity', 'sunDisk'], ['uHazeStrength', 'haze'],
      ['uMultiScatter', 'multiScatter'],
      ['uCloudBase', 'cloudBase'], ['uCloudTop', 'cloudTop'], ['uCloudCover', 'cloudCover'],
      ['uCloudUnit', 'cloudUnit'], ['uCloudDetailUnit', 'cloudDetailUnit'],
      ['uCloudContrast', 'cloudContrast'], ['uCloudErosion', 'cloudErosion'],
      ['uCloudVert', 'cloudVert'], ['uCloudFadeNear', 'cloudFadeNear'],
      ['uCloudSteps', 'cloudSteps'], ['uCloudDensityScale', 'cloudDensityScale'],
      ['uCloudSunScale', 'cloudSun'], ['uCloudAmbient', 'cloudAmbient'],
      ['uWeatherTile', 'weatherTile'], ['uWaveDir', 'waveDir']
    ];

    function setSceneUniforms() {
      var p = R.programs.scene.use();
      var s = R.s, T = R.targets, cam = R.camera;
      p.setInt('uView', s.view | 0);
      p.set('uDebugMix', s.debugMix);
      for (var i = 0; i < 9; i++) {
        var loc = p.u['uStage'] || gl.getUniformLocation(p.raw, 'uStage[' + i + ']');
        if (loc) gl.uniform1f(loc, s.stages[i]);
      }
      p.set('uRenderRes', [T.w, T.h]);
      p.set('uFrameJitter', (R.frame * 0.6180339887) % 1.0);
      p.set('uTime', s.time);
      p.set('uQuality', R.params.quality);
      p.set('uQualityShadowSteps', Math.round(8 + 26 * R.params.quality));
      p.set('uTerrainSize', R.params.terrainSize);
      p.set('uCamPos', cam.pos);
      p.set('uCamFwd', cam.fwd);
      p.set('uCamUp', cam.up);
      p.set('uCamRight', cam.right);
      p.set('uTanHalfFov', Math.tan(cam.fov * Math.PI / 360));
      p.set('uPixAngle', 2.0 * Math.tan(cam.fov * Math.PI / 360) / Math.max(1, T.h));
      p.set('uSunElev', s.sunElev * Math.PI / 180);
      p.set('uSunAzi', s.sunAzi * Math.PI / 180);
      p.set('uSunDir', R.sunDir(s.sunElev, s.sunAzi));
      p.set('uBetaR', s.betaR); p.set('uBetaM', R.mieBeta(s)); p.set('uMieG', s.mieG);
      p.set('uMieTint', s.mieTint);
      p.set('uHr', s.hr); p.set('uHm', s.hm); p.set('uOzone', s.ozone);
      p.set('uSkyQuality', Math.min(1.0, R.params.quality + 0.2));
      for (var k = 0; k < R.uniformTable.length; k++) {
        var name = R.uniformTable[k][0], key = R.uniformTable[k][1];
        var v = s[key];
        if (v === undefined || v === null) {
          // A missing state key used to be skipped in silence, which is how uWeatherTile
          // stayed at zero and made the whole cloud layer invisible. Say so, once.
          if (!R.warnedMissing) R.warnedMissing = {};
          if (!R.warnedMissing[name]) {
            R.warnedMissing[name] = 1;
            console.warn('[uniform] no state value for ' + name + ' (state key "' + key + '")');
          }
          continue;
        }
        p.set(name, v);
      }
      // textures
      p.setTex('uTerrain', R.gen.terrain.tex, 0);
      p.setTex('uHeightRaw', R.gen.heightRaw.tex, 1);
      p.setTex('uNoiseAtlas', R.gen.atlas, 2, gl.TEXTURE_3D);
      p.setTex('uSkyLUT', R.gen.sky.tex, 3);
      p.setTex('uSunTrans', R.gen.sunTrans.tex, 4);
      p.setTex('uNoise', R.gen.blueNoise, 5);
      p.setTex('uNoiseAtlasDetail', R.gen.atlasDetail, 6, gl.TEXTURE_3D);
      p.setTex('uWeather', R.gen.weather.tex, 7);
    }

    R.render = function (dt, force) {
      if (!R.ready) return;
      R.frame++;
      updateSky(force);
      if (dt) { R.s.time += dt; P.quality = R.s.quality !== undefined ? R.s.quality : P.quality; }
      api.bind(R.targets.scene);
      setSceneUniforms();
      api.drawQuad('scene');
      R.stats.passes = 1;

      // ---- auto exposure: average the frame, then let the eye adapt towards it
      var T = R.targets;
      var ex = R.s.exposureAuto ? R.autoExp : R.s.exposure;
      if (R.s.exposureAuto){
        api.bind(T.expo);
        R.programs.avg.use().setTex('uSrc', T.scene.tex, 0);
        api.drawQuad('avg');
        R.stats.passes++;
        // the readback (8x8 half floats) stalls the pipeline, so it only happens every
        // few frames; the adaptation is a slow filter anyway
        if ((R.frame < 10 || (R.frame % 5) === 0 || !dt) && R.api.readFloats){
          var buf = R.expoBuf || (R.expoBuf = new Float32Array(8 * 8 * 4));
          if (R.api.readFloats(0, 0, 8, 8, buf)){
            var ls = R.expoCells || (R.expoCells = new Float32Array(64));
            var n = 0;
            for (var bi = 0; bi < 64; bi++){
              var l = 0.2126 * buf[bi * 4] + 0.7152 * buf[bi * 4 + 1] + 0.0722 * buf[bi * 4 + 2];
              if (isFinite(l) && l >= 0){ ls[n++] = l; }
            }
            if (n > 8){
              /* A plain mean over the 64 cells is decided by whichever cell holds the sun or
                 the specular path: one cell reading 3000 pulls the average to 3, the target
                 becomes 1/20 of a stop and the whole frame goes black. Sunsets are exactly
                 that case. Trim the distribution instead: the trimmed mean is the same
                 number for an ordinary frame and ignores the point highlights. */
              var sub = Array.prototype.slice.call(ls, 0, n).sort(function (a, b) { return a - b; });
              var i0 = Math.floor(n * 0.25), i1 = Math.max(i0 + 1, Math.floor(n * 0.88));
              var sum = 0, m = 0;
              for (var ii = i0; ii < i1; ii++){ sum += sub[ii]; m++; }
              var avg = sum / Math.max(1, m);
              if (avg > 1e-5){
                var want = R.s.exposureKey * R.s.exposureBias / avg;
                want = Math.max(R.s.exposureMin, Math.min(R.s.exposureMax, want));
                // snap on the first frames, then adapt: a slow ramp from a cold start
                // would show up as a visible flicker when the page opens
                var rate = R.frame < 40 ? 1.0 : (dt ? Math.min(1, dt * R.s.exposureRate) : 1);
                R.autoExp += (want - R.autoExp) * rate;
              }
            }
          }
        }
        ex = R.autoExp;
      }
      R.lastExposure = ex;

      // ---- bloom
      var s = R.s;
      var down = T.bloomDown, up = T.bloomUp;
      var preExposure = Math.max(ex, 1e-3);
      R.programs.bloomDown.use().locate(['uSrcTexel', 'uThreshold', 'uKnee', 'uPreExposure']);
      for (var i = 0; i < T.levels; i++) {
        var src = i === 0 ? T.scene : down[i - 1];
        api.bind(down[i]);
        R.programs.bloomDown.use()
          .setTex('uSrc', src.tex, 0)
          .set('uSrcTexel', [1 / src.w, 1 / src.h])
          .set('uThreshold', i === 0 ? 1.05 : 0.0)
          .set('uKnee', 0.6)
          .set('uPreExposure', i === 0 ? preExposure : 1.0);
        api.drawQuad('bloomDown' + i);
        R.stats.passes++;
      }
      for (var j = T.levels - 1; j >= 0; j--) {
        var lower = j === T.levels - 1 ? down[j] : up[j + 1];
        api.bind(up[j]);
        R.programs.bloomUp.use().locate(['uSrcTexel', 'uRadius', 'uAdd'])
          .setTex('uSrc', down[j].tex, 0)
          .setTex('uLower', lower.tex, 1)
          .set('uSrcTexel', [1 / down[j].w, 1 / down[j].h])
          .set('uRadius', 1.0)
          .set('uAdd', j === T.levels - 1 ? 0.0 : 0.8);
        api.drawQuad('bloomUp' + j);
        R.stats.passes++;
      }

      // ---- composite
      api.bind(null);
      R.programs.composite.use()
        .locate(['uExposure', 'uBloomStrength', 'uVignette', 'uGrain', 'uChroma', 'uSplit', 'uTime', 'uStage8', 'uPostMix', 'uRes', 'uView'])
        .setTex('uScene', T.scene.tex, 0)
        .setTex('uBloom', up[0].tex, 1)
        .setTex('uNoise', R.gen.blueNoise, 2)
        .set('uRes', [canvas.width, canvas.height])
        .set('uExposure', ex)
        .set('uBloomStrength', s.bloom)
        .set('uVignette', s.vignette)
        .set('uGrain', s.grain)
        .set('uChroma', s.chroma)
        .set('uSplit', s.split)
        .set('uTime', s.time)
        .set('uStage8', s.stages[8])
        .set('uView', s.view | 0)
        .set('uPostMix', s.postMix);
      api.drawQuad('composite');
      R.stats.passes++;
    };

    // ---------------------------------------------------------------- adaptive resolution
    /* Adaptive internal resolution.
       The cooldown is counted in milliseconds, not frames: a frame-count cooldown is a
       function of how slow the machine is, so the slower the device the longer it stays wrong.
       A large miss (more than 3x the target frame time) takes a proportionally larger step,
       which is what gets a software rasteriser from its start scale to something it can
       actually draw in a handful of frames rather than a few hundred. */
    R.adapt = function (ms) {
      if (!P.adaptive) return;
      var st = R.stats;
      var now = performance.now();
      st.msAvg = st.msAvg === undefined ? ms : st.msAvg * 0.75 + ms * 0.25;
      if (st.nextAdj === undefined) st.nextAdj = 0;
      if (now < st.nextAdj) return;
      var want = P.targetMs;
      var lo = P.minScale, hi = Math.max(P.minScale, P.renderScale);
      if (st.msAvg > want * 1.35 && st.scale > lo) {
        // proportional step: how far off are we? (a frame time scales with pixels)
        var ratio = Math.min(0.75, want / Math.max(st.msAvg, 0.001));
        var step = Math.max(0.05, st.scale * (1 - Math.max(0.35, ratio)) * 0.75);
        st.scale = Math.max(lo, Math.round((st.scale - step) * 100) / 100);
        st.nextAdj = now + 220; R.resize();
      } else if (st.msAvg < want * 0.72 && st.scale < hi) {
        st.scale = Math.min(hi, Math.round((st.scale + 0.05) * 100) / 100);
        st.nextAdj = now + 600; R.resize();
      } else {
        st.nextAdj = now + 250;
      }
    };

    // ---------------------------------------------------------------- capture
    /** Final displayed pixel values (after tonemap + grade), for art checks. */
    R.canvasSample = function (pts) {
      var w = canvas.width, h = canvas.height;
      var px = new Uint8Array(w * h * 4);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
      var out = [];
      for (var i = 0; i < pts.length; i++) {
        var x = Math.max(0, Math.min(w - 1, Math.round(pts[i][0])));
        var y = Math.max(0, Math.min(h - 1, Math.round(pts[i][1])));
        var o = ((h - 1 - y) * w + x) * 4;
        out.push([px[o], px[o + 1], px[o + 2]]);
      }
      return out;
    };

    R.capturePNG = function () {
      var w = canvas.width, h = canvas.height;
      var px = new Uint8Array(w * h * 4);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
      var c2 = document.createElement('canvas');
      c2.width = w; c2.height = h;
      var ctx = c2.getContext('2d');
      var img = ctx.createImageData(w, h);
      for (var y = 0; y < h; y++) {
        var src = (h - 1 - y) * w * 4, dst = y * w * 4;
        for (var x = 0; x < w * 4; x++) img.data[dst + x] = px[src + x];
      }
      ctx.putImageData(img, 0, 0);
      return c2.toDataURL('image/png');
    };

    /** Render a generated texture into a 2D canvas (for the instrument panels). */
    // Accepts either a render target or a bare texture (the browser only lets us read
    // pixels from a framebuffer, so a texture is copied through a temporary target).
    var texCopyTarget = null;
    /* Copy a render target into a 2D canvas. `tint`, when given, is called with each
       pixel's (r, g, b) in 0..1 and returns the colour to write - which is how an
       instrument panel is put into the film's palette instead of showing the raw debug
       texture (a weather map in yellow-green does not belong in a sunset). */
    R.textureToCanvas = function (target, c2, mode, gamma, tint) {
      // Always copy through a separate RGBA8 target. Copying a render target into
      // itself is a framebuffer feedback loop: the read comes back as zeros, which is
      // how the histogram strip and the HDR dumps silently turned out black.
      var w = target.w || target.__w, h = target.h || target.__h;
      if (!w || !h) return c2;
      if (!texCopyTarget || texCopyTarget.w !== w || texCopyTarget.h !== h) {
        texCopyTarget = api.target(w, h, gl.RGBA8, gl.UNSIGNED_BYTE, gl.LINEAR);
      }
      api.bind(texCopyTarget);
      R.programs.view.use()
        .setTex('uSrc', target.tex || target, 0)
        .set('uRes', [w, h])
        .set('uMode', mode || 0)
        .set('uGamma', gamma === undefined ? 1.0 : gamma);
      api.drawQuad();
      var px = new Uint8Array(w * h * 4);
      gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      var ctx = c2.getContext('2d');
      var img = ctx.createImageData(w, h);
      for (var y = 0; y < h; y++) {
        var src = (h - 1 - y) * w * 4, dst = y * w * 4;
        if (!tint) {
          for (var x = 0; x < w * 4; x++) img.data[dst + x] = px[src + x];
        } else {
          for (var x2 = 0; x2 < w; x2++) {
            var o = src + x2 * 4, d = dst + x2 * 4;
            var c3 = tint(px[o] / 255, px[o + 1] / 255, px[o + 2] / 255);
            img.data[d] = Math.max(0, Math.min(255, Math.round(c3[0] * 255)));
            img.data[d + 1] = Math.max(0, Math.min(255, Math.round(c3[1] * 255)));
            img.data[d + 2] = Math.max(0, Math.min(255, Math.round(c3[2] * 255)));
            img.data[d + 3] = px[o + 3];
          }
        }
      }
      ctx.putImageData(img, 0, 0);
      return c2;
    };

    /** Linear HDR sample at a pixel of the scene target (screen coords, top-left origin). */
    R.sampleScene = function (x, y) {
      var T = R.targets;
      var gx = Math.max(0, Math.min(T.w - 1, Math.round(x)));
      var gy = Math.max(0, Math.min(T.h - 1, Math.round(y)));
      var out = [0, 0, 0];
      gl.bindFramebuffer(gl.FRAMEBUFFER, T.scene.fbo);
      if (R.hdrType === gl.HALF_FLOAT || R.hdrType === gl.FLOAT) {
        var px = new Float32Array(4);
        api.readFloats(gx, T.h - 1 - gy, 1, 1, px);
        for (var i = 0; i < 3; i++) out[i] = isFinite(px[i]) ? px[i] : 0;
      } else {
        var px8 = new Uint8Array(4);
        gl.readPixels(gx, T.h - 1 - gy, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px8);
        for (var j = 0; j < 3; j++) out[j] = px8[j] / 255;
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return out;
    };

    /** Statistics of the generated height field (for verification): reads the packed
        R+G height back at low resolution and decodes it. */
    R.terrainStats = function (n) {
      n = n || 128;
      if (!R.statsTarget || R.statsTarget.w !== n) R.statsTarget = api.target(n, n, gl.RGBA8, gl.UNSIGNED_BYTE, gl.LINEAR);
      api.bind(R.statsTarget);
      // uRes is the *output* size, so uv runs 0..1 across the whole height field and the
      // bilinear filter does the downsampling. (Passing the source size here makes uv
      // cover only the bottom-left corner of the map - which is how a stats readback
      // silently starts describing one eighth of the terrain.) Note that point-sampling a
      // high-resolution field does under-report peaks, so stats are only comparable
      // between runs at the same terrainRes.
      R.programs.copy.use().setTex('uSrc', R.gen.terrain.tex, 0).set('uRes', [n, n]);
      api.drawQuad('terrainStats');
      var px = new Uint8Array(n * n * 4);
      gl.readPixels(0, 0, n, n, gl.RGBA, gl.UNSIGNED_BYTE, px);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      var H_LO = -1600, H_HI = 4200, span = H_HI - H_LO;
      var vals = new Float32Array(n * n), ao = new Float32Array(n * n);
      var mn = 1e9, mx = -1e9, sum = 0, above = 0, aoSum = 0;
      for (var i = 0; i < n * n; i++) {
        var hv = (px[i * 4] / 255 + px[i * 4 + 1] / 65025) * span + H_LO;
        vals[i] = hv; ao[i] = px[i * 4 + 2] / 255;
        if (hv < mn) mn = hv; if (hv > mx) mx = hv;
        sum += hv; aoSum += ao[i];
        if (hv > 0) above++;
      }
      var sorted = Array.prototype.slice.call(vals).sort(function (a, b) { return a - b; });
      var pc = function (q) { return sorted[Math.min(n * n - 1, Math.max(0, Math.round(q * (n * n - 1))))]; };
      return { min: mn, max: mx, mean: sum / (n * n), landFraction: above / (n * n),
        p01: pc(0.01), p05: pc(0.05), p50: pc(0.5), p95: pc(0.95), p99: pc(0.99),
        aoMean: aoSum / (n * n) };
    };

    /** Bilinear lookup of the baked height field (metres) at a world xz. */
    R.groundHeight = function (x, z) {
      if (!R.heightRead) { R.heightRead = R.readTerrainBlock(96); }
      return R.heightRead(x, z);
    };

    /** Read the whole height field back once and return a sampler. */
    R.readTerrainBlock = function (n) {
      if (!R.statsTarget || R.statsTarget.w !== n) R.statsTarget = api.target(n, n, gl.RGBA8, gl.UNSIGNED_BYTE, gl.LINEAR);
      api.bind(R.statsTarget);
      R.programs.copy.use().setTex('uSrc', R.gen.terrain.tex, 0).set('uRes', [n, n]);
      api.drawQuad('terrainRead');
      var px = new Uint8Array(n * n * 4);
      gl.readPixels(0, 0, n, n, gl.RGBA, gl.UNSIGNED_BYTE, px);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      var H_LO = -1600, span = 5800;
      var TS = P.terrainSize;
      var grid = new Float32Array(n * n);
      for (var i = 0; i < n * n; i++) grid[i] = (px[i * 4] / 255 + px[i * 4 + 1] / 65025) * span + H_LO;
      return function (x, z) {
        var u = (x / TS + 0.5) * n, v = (z / TS + 0.5) * n;
        u = Math.max(0.5, Math.min(n - 1.5, u)); v = Math.max(0.5, Math.min(n - 1.5, v));
        var u0 = Math.floor(u), v0 = Math.floor(v), fu = u - u0, fv = v - v0;
        var a = grid[v0 * n + u0], b = grid[v0 * n + u0 + 1];
        var c = grid[(v0 + 1) * n + u0], d = grid[(v0 + 1) * n + u0 + 1];
        return (a * (1 - fu) + b * fu) * (1 - fv) + (c * (1 - fu) + d * fu) * fv;
      };
    };

    /** Read one column of a baked table back to the CPU - the motion graphics draw the
        real sky LUT and the real sun-transmittance table instead of re-deriving them. */
    R.lutColumn = function (target, u, out) {
      if (!target || !target.w) return null;
      var h = target.h;
      if (!out || out.length !== h * 4) out = new Float32Array(h * 4);
      var x = Math.max(0, Math.min(target.w - 1, Math.round(u * (target.w - 1))));
      api.bind(target);
      var ok = api.readFloats(x, 0, 1, h, out);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return ok ? out : null;
    };

    /** Bilinear read of the sun-transmittance table at (elevation rad, height m). */
    R.sunTransAt = function (elevRad, height, out) {
      var T = R.gen && R.gen.sunTrans;
      if (!T || !T.w) return null;
      var vx = Math.pow(Math.max(0, Math.min(1, (elevRad - (-0.06)) / (1.5707963 + 0.06))), 1 / 2.2);
      var vy = Math.sqrt(Math.max(0, Math.min(1, height / 4200)));
      var fx = vx * (T.w - 1), fy = vy * (T.h - 1);
      var x0 = Math.max(0, Math.min(T.w - 2, Math.floor(fx))), y0 = Math.max(0, Math.min(T.h - 2, Math.floor(fy)));
      var tx = fx - x0, ty = fy - y0;
      var buf = new Float32Array(4 * 4 * 4);
      api.bind(T);
      var ok = api.readFloats(x0, y0, 2, 2, buf);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      out = out || [0, 0, 0];
      if (!ok) return null;
      for (var c = 0; c < 3; c++) {
        var a = buf[c], b = buf[4 + c], d = buf[8 + c], e = buf[12 + c];
        out[c] = (a * (1 - tx) + b * tx) * (1 - ty) + (d * (1 - tx) + e * tx) * ty;
      }
      return out;
    };

    /** Read the scene target at low resolution and return a luminance histogram. */
    /* Luminance histogram of the frame after exposure.
       mode 'display' (default): bin the on-screen luminance, 0..1 - what the histogram panel
       shows. mode 'log2': bin log2 of the linear luminance over -14..+10 stops - what the
       tonemap chapter's curve is drawn against. The strip shader computes both; see post.js. */
    R.histogram = function (bins, mode) {
      var T = R.targets, st = T.strip;
      api.bind(st);
      R.programs.strip.use().locate(['uExposure']).setTex('uScene', T.scene.tex, 0).set('uRes', [st.w, st.h]).set('uExposure', R.lastExposure !== undefined ? R.lastExposure : R.s.exposure);
      api.drawQuad();
      var w = st.w, h = st.h;
      var log2mode = (mode === 'log2');
      var chan = log2mode ? 1 : 0;
      var px = new Float32Array(w * h * 4);
      var hist = new Float32Array(bins);
      if (R.hdrType === gl.HALF_FLOAT || R.hdrType === gl.FLOAT) {
        api.readFloats(0, 0, w, h, px);
        for (var i = 0; i < w * h; i++) {
          var l = px[i * 4 + chan];
          if (!isFinite(l) || l < 0) l = 0;
          hist[Math.min(bins - 1, Math.max(0, Math.floor(l * bins)))]++;
        }
        return { hist: hist, total: w * h };
      }
      var px8 = new Uint8Array(w * h * 4);
      gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px8);
      for (var j = 0; j < w * h; j++) {
        var l8 = Math.max(0, px8[j * 4 + chan]) / 255;
        hist[Math.min(bins - 1, Math.max(0, Math.floor(l8 * bins)))]++;
      }
      return { hist: hist, total: w * h };
    };

    R.autoExp = R.s.exposure;
    R.ready = true;
    R.buildInfo = {
      renderer: api.rendererName,
      hdr: R.hdrInternal === gl.RGBA16F ? 'RGBA16F' : (R.hdrInternal === gl.RGBA32F ? 'RGBA32F' : 'RGBA8'),
      terrainRes: P.terrainRes,
      genMs: Math.round(R.genMs),
      colorFloat: api.colorFloat,
      colorHalf: api.colorHalf
    };
    return R;
    } catch (glErr) {
      if (window.console && console.warn) console.warn('[Renderer] WebGL2 init error, falling back to CPU Raymarch:', glErr);
      return SS.FallbackRenderer(canvas, P, (glErr && glErr.message) || String(glErr));
    }
  };
})();
