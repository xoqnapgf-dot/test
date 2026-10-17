/* Load-time generation: height field + erosion relaxation + baked occlusion,
   the 3D noise atlas, the sky lookup tables and a blue-noise mask.
   Everything here runs once (the sky LUT also rebuilds when the sun moves). */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});
  var GL = SS.GLSL;
  var assemble = SS.assembleFS;

  // ---------------------------------------------------------------- blue noise
  // Ranked dithering (void & cluster) on a 64x64 torus. Used for the ray jitter
  // inside the volumetric march, for grain, and for the final 1/255 dither.
  SS.blueNoise = function (size) {
    // Void-and-cluster (Ulichney 1993) on a torus, at 10% initial density.
    //   phase 1: random binary pattern of M ones, energy = sum of gaussian splats
    //   phase 2: repeatedly take the tightest cluster (max energy) out; the earlier a
    //            sample is removed the higher the density it belongs to, so it is ranked
    //            from the middle downwards
    //   phase 3: fill the largest voids (min energy) one at a time, ranking upwards
    // Every pixel gets exactly one rank, which is what makes the result a usable dither
    // mask. (The first version re-ranked pixels that already had a rank, so four fifths
    // of the texture came out as 0 - visible as blobs instead of dither.)
    var N = size * size;
    var R = size >> 1;
    var sigma = size / 6.0;
    var K = 2 * R + 1;
    var kernel = new Float32Array(K * K);
    var k = 0;
    for (var dy = -R; dy <= R; dy++)
      for (var dx = -R; dx <= R; dx++)
        kernel[k++] = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));

    var E = new Float32Array(N);
    function splat(p, sign) {
      var x = p % size, y = (p / size) | 0, ki = 0;
      for (var yy = -R; yy <= R; yy++) {
        var row = (((y + yy) % size) + size) % size * size;
        for (var xx = -R; xx <= R; xx++) {
          var col = (((x + xx) % size) + size) % size;
          E[row + col] += sign * kernel[ki++];
        }
      }
    }

    // deterministic RNG so the mask is identical on every load (the shots are
    // comparable, and nothing about the dither needs to change run to run)
    var seed = 0x9e3779b9 ^ (size * 2654435761);
    function rnd() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    }

    var M = Math.round(N * 0.1);
    var idx = new Int32Array(N);
    for (var i = 0; i < N; i++) idx[i] = i;
    for (i = N - 1; i > 0; i--) {                    // fisher-yates
      var r = (rnd() * (i + 1)) | 0;
      var t = idx[i]; idx[i] = idx[r]; idx[r] = t;
    }
    var rank = new Int32Array(N).fill(-1);
    var ones = Array.prototype.slice.call(idx, 0, M);   // Int32Array has no pop()
    for (i = 0; i < M; i++) splat(ones[i], 1);

    // phase 2: remove the tightest clusters, ranking downwards from M-1
    for (i = 0; i < M; i++) {
      var best = -1, bestE = -1e30;
      for (var q = 0; q < ones.length; q++) {
        var c = ones[q];
        if (E[c] > bestE) { bestE = E[c]; best = q; }
      }
      var p2 = ones[best];
      rank[p2] = M - 1 - i;
      splat(p2, -1);
      ones[best] = ones[ones.length - 1];
      ones.pop();
    }

    // phase 3: fill the largest voids, ranking upwards from M
    var next = M;
    while (next < N) {
      var v = -1, vE = 1e30;
      for (var b = 0; b < N; b++) {
        if (rank[b] < 0 && E[b] < vE) { vE = E[b]; v = b; }
      }
      if (v < 0) break;
      splat(v, 1);
      rank[v] = next++;
    }
    for (i = 0; i < N; i++) if (rank[i] < 0) rank[i] = 0;

    var out = new Uint8Array(N);
    for (i = 0; i < N; i++) out[i] = Math.round(255 * rank[i] / (N - 1));
    return out;
  };

  // ---------------------------------------------------------------- pass helper
  function makePass(api, fsSource, target) {
    var prog = api.program(assemble(null, [fsSource]));
    var warned = {};
    var located = ['uRes', 'uSrc', 'uSrcTexel', 'uTerrainSize', 'uTalus', 'uTalusAmount',
      'uTalusRef', 'uFirstPass', 'uBlur', 'uCarve', 'uAoStrength', 'uStride', 'uGrid', 'uSunElev', 'uSunAzi',
      'uPlainH', 'uSeaDepth', 'uCliff', 'uIslandH',
      'uCameraHeight', 'uLandBias', 'uRelief', 'uSeed', 'uRidgeGain', 'uRidgeMix', 'uMassifBias',
      'uSink', 'uWeatherTile', 'uBetaR', 'uBetaM', 'uMieG', 'uMieTint',
      'uHr', 'uHm', 'uOzone', 'uSunDir', 'uSunIntensity', 'uSkyQuality'];
    prog.locate(located);
    return function (uniforms, label) {
      api.bind(target);
      prog.use();
      prog.set('uRes', [target ? target.w : 1, target ? target.h : 1]);
      for (var k in uniforms) {
        var v = uniforms[k];
        if (typeof v === 'number') prog.set(k, v);
        else if (v && v.length) prog.set(k, v);
        else if (v && v.tex) prog.setTex(k, v.tex, v.unit || 0);
        // prog.set resolves the location on demand, so a name the curated list above does
        // not mention is still uploaded: what matters is whether the *shader* uses it. A
        // null location means it does not - a real no-op, and the only thing worth warning
        // about. (The previous check warned on anything outside the list, which is noise:
        // four atmosphere uniforms this pass sets for the scene's benefit are not read by
        // the bake shaders, and the warning buried the ones that matter.)
        if (prog.u[k] === null && !warned[k]) {
          warned[k] = 1;
          if (window.console && console.warn) console.warn('gen: ' + label + ' sets ' + k + ' but this shader does not use it');
        }
      }
      api.drawQuad(label);
    };
  }

  function hdrTarget(api, w, h) {
    var internal = api.colorFloat ? api.raw.RGBA16F : (api.colorHalf ? api.raw.RGBA16F : api.raw.RGBA8);
    var type = api.colorFloat ? api.raw.HALF_FLOAT : (api.colorHalf ? api.raw.HALF_FLOAT : api.raw.UNSIGNED_BYTE);
    return api.target(w, h, internal, type, api.raw.LINEAR);
  }

  SS.Generator = function (api, params) {
    var gl = api.raw;
    var gen = {};
    var P = params;

    // ---------------- terrain height field
    var TS = P.terrainSize;                      // world size in metres
    var TN = P.terrainRes;                       // texture resolution
    function rt() { return api.target(TN, TN, gl.RGBA8, gl.UNSIGNED_BYTE, gl.LINEAR); }
    var fboRaw = rt(), fboA = rt(), fboB = rt(), fboFinal = rt();

    var basePass = makePass(api, GL.terrainBaseShader, fboRaw);
    var erodePassA = makePass(api, GL.erodeShader, fboA);
    var erodePassB = makePass(api, GL.erodeShader, fboB);
    var aoPass = makePass(api, GL.aoBakeShader, fboFinal);

    // plainH/seaDepth/cliff/islandH were declared in the shader and present in the params
    // from the start but never actually sent, so the coast had no cliff step, the shelf
    // had no depth and nothing ever grew offshore as an island.
    basePass({ uTerrainSize: TS, uRelief: P.relief, uSeed: P.seed,
      uRidgeGain: P.ridgeGain, uMassifBias: P.massifBias, uSink: P.sink, uRidgeMix: P.ridgeMix,
      uPlainH: P.plainH, uSeaDepth: P.seaDepth, uCliff: P.cliff, uIslandH: P.islandH }, 'terrainBase');
    // Thermal + fluvial relaxation. Iterating on the height field is what turns white
    // noise into something that reads as mountains: scree stops at the repose angle.
    var src = fboRaw, dst = fboA, pass = erodePassA;
    var dxPerTexel = TS / TN;
    for (var i = 0; i < P.erodeIterations; i++) {
      pass({
        uSrc: { tex: src.tex, unit: 0 }, uTerrainSize: TS,
        uTalus: P.talus, uTalusAmount: P.talusAmount,
        uBlur: P.blur, uCarve: P.carve, uTalusRef: dxPerTexel, uFirstPass: i === 0 ? 1.0 : 0.0
      }, 'erode' + i);
      src = dst;                                   // the freshly written field
      if (pass === erodePassA) { pass = erodePassB; dst = fboB; } else { pass = erodePassA; dst = fboA; }
    }
    gen.heightRaw = fboRaw;                      // kept for the before/after strip
    gen.heightEroded = src;
    // bake sky occlusion into the final texture
    aoPass({ uSrc: { tex: src.tex, unit: 0 }, uTerrainSize: TS, uAoStrength: P.aoStrength }, 'aoBake');
    gen.terrain = fboFinal;

    // ---------------- 3D noise volumes (128^3, two of them)
    // Rendering 128 slices into a 3D texture is both simpler and sharper than packing
    // an atlas: the hardware interpolates the volume in all three axes.
    var VOL = 128;
    function buildVolume(seedVal, label) {
      var tex = api.texture3D({ internal: gl.RGBA8, width: VOL, height: VOL, depth: VOL,
        format: gl.RGBA, type: gl.UNSIGNED_BYTE, filter: gl.LINEAR, wrap: gl.REPEAT });
      var prog = api.program(assemble(null, [GL.volumeShader]));
      prog.locate(['uRes', 'uZ', 'uSeed']);
      var fbo = gl.createFramebuffer();
      api.clearUnits(8);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.viewport(0, 0, VOL, VOL);
      prog.use();
      prog.set('uRes', [VOL, VOL]);
      prog.set('uSeed', seedVal);
      for (var z = 0; z < VOL; z++) {
        gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, tex, 0, z);
        prog.set('uZ', (z + 0.5) / VOL * 64.0);
        api.drawQuad(label);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fbo);
      return tex;
    }
    gen.atlas = buildVolume(0.0, 'noiseVolShape');
    gen.atlasDetail = buildVolume(137.0, 'noiseVolDetail');
    gen.volumeSize = VOL;

    // ---------------- sky lookup tables
    var skyW = 256, skyH = 128;
    var skyTarget = hdrTarget(api, skyW, skyH);
    gen.sky = skyTarget;
    var sunTrans = hdrTarget(api, 64, 32);
    gen.sunTrans = sunTrans;
    var skyPass = makePass(api, GL.atmoParams + GL.common + GL.atmo + GL.skyLUTShader, skyTarget);
    var sunPass = makePass(api, GL.atmoParams + GL.common + GL.atmo + GL.sunTransShader, sunTrans);
    gen.skyTarget = skyTarget;
    gen.sunTransTarget = sunTrans;
    gen.skyW = skyW; gen.skyH = skyH;

    // ---------------- cloud weather map (160 km square, drifting with the wind)
    var weatherN = 256;
    var weatherFbo = api.target(weatherN, weatherN, gl.RGBA8, gl.UNSIGNED_BYTE, gl.LINEAR);
    var weatherPass = makePass(api, GL.weatherShader, weatherFbo);
    weatherPass({ uWeatherTile: 160000.0 }, 'weatherMap');
    gen.weather = weatherFbo;
    gen.weatherTile = 160000.0;

    // ---------------- blue noise
    var bn = SS.blueNoise(64);
    var bnTex = api.texture({
      internal: gl.R8, format: gl.RED, type: gl.UNSIGNED_BYTE,
      width: 64, height: 64, filter: gl.LINEAR, wrap: gl.REPEAT, data: bn
    });
    gen.blueNoise = bnTex;

    // ---------------- public
    gen.atmo = null;
    /* The two bakes want different things: the sky table is the full scattering integral
       (it needs the sun's irradiance, the disk, the sky scale and the second-order term),
       while the transmittance table is the extinction along one slant path per texel and
       uses only the coefficients and the two scale heights. Handing both the same dict made
       the transmittance pass set ten uniforms its shader never reads. */
    gen.updateSky = function (atmo, cameraHeight) {
      var multi = atmo.multiScatter === undefined ? 1.0 : atmo.multiScatter;
      /* What each table actually reads, checked against the compiled shader (the wrapper
         warns when a name is not a live uniform):
           sky    the scattering integral. The table lives in the sun's own frame, so it
                  takes the sun *direction*, not its elevation, and it is baked at unit sky
                  scale and unit disk strength - those two are applied where the table is
                  sampled (scene.js), so a change of exposure never needs a re-bake.
           sunTrans  extinction along one slant path per texel. The table is indexed by view
                  elevation and height, so the sun's position does not enter at all. */
      skyPass({
        uSunAzi: atmo.sunAzi, uBetaR: atmo.betaR, uBetaM: atmo.betaM, uMieG: atmo.mieG,
        uHr: atmo.hr, uHm: atmo.hm, uOzone: atmo.ozone,
        uSunDir: atmo.sunDir, uSunIrradiance: atmo.sunIrradiance, uMultiScatter: multi,
        uSkyQuality: atmo.quality, uCameraHeight: cameraHeight
      }, 'skyLUT');
      sunPass({
        uBetaR: atmo.betaR, uBetaM: atmo.betaM, uHr: atmo.hr, uHm: atmo.hm, uOzone: atmo.ozone
      }, 'sunTrans');
    };
    gen.renderInstrument = function (kind, target, uniforms) {
      // used by the UI panels: re-draw a small view of a generated texture
    };
    gen.size = { terrain: TS, terrainRes: TN, volume: VOL };
    return gen;
  };
})();
