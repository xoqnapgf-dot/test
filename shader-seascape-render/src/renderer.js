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
    targetMs: 16.7
  };

  SS.Renderer = function (canvas, opts) {
    var P = {};
    for (var k in DEFAULTS) P[k] = DEFAULTS[k];
    // An undefined here means "the caller forgot", not "use zero": ignoring it keeps the
    // default and turns a silent flat terrain into a working one.
    if (opts) for (var k2 in opts) if (opts[k2] !== undefined) P[k2] = opts[k2];

    var api = SS.gl(canvas);
    if (!api) return { failed: 'webgl2', canvas: canvas };
    var gl = api.raw;

    var R = {
      api: api, params: P, canvas: canvas,
      ready: false, error: null,
      stats: { ms: 0, fps: 0, scale: P.adaptive ? 1 : Math.max(0.08, P.renderScale),
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
        if ((R.frame % 5) === 0 && R.api.readFloats){
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
        .locate(['uExposure', 'uBloomStrength', 'uVignette', 'uGrain', 'uChroma', 'uSplit', 'uTime', 'uStage8', 'uPostMix', 'uRes'])
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
        .set('uPostMix', s.postMix);
      api.drawQuad('composite');
      R.stats.passes++;
    };

    // ---------------------------------------------------------------- adaptive resolution
    R.adapt = function (ms) {
      if (!P.adaptive) return;
      var st = R.stats;
      st.msAvg = st.msAvg === undefined ? ms : st.msAvg * 0.9 + ms * 0.1;
      st.cool = (st.cool || 0) - 1;
      if (st.cool > 0) return;
      var want = P.targetMs;
      if (st.msAvg > want * 1.35 && st.scale > 0.45) { st.scale = Math.max(0.45, st.scale - 0.05); st.cool = 25; R.resize(); }
      else if (st.msAvg < want * 0.72 && st.scale < P.renderScale) { st.scale = Math.min(P.renderScale, st.scale + 0.05); st.cool = 40; R.resize(); }
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
    R.textureToCanvas = function (target, c2, mode, gamma) {
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
        for (var x = 0; x < w * 4; x++) img.data[dst + x] = px[src + x];
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
    R.histogram = function (bins) {
      var T = R.targets, st = T.strip;
      api.bind(st);
      R.programs.strip.use().locate(['uExposure']).setTex('uScene', T.scene.tex, 0).set('uRes', [st.w, st.h]).set('uExposure', R.lastExposure !== undefined ? R.lastExposure : R.s.exposure);
      api.drawQuad();
      var w = st.w, h = st.h;
      var px = new Float32Array(w * h * 4);
      var hist = new Float32Array(bins);
      if (R.hdrType === gl.HALF_FLOAT || R.hdrType === gl.FLOAT) {
        api.readFloats(0, 0, w, h, px);
        for (var i = 0; i < w * h; i++) {
          var lum = 0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2];
          if (!isFinite(lum) || lum < 0) lum = 0;
          var b = Math.min(bins - 1, Math.max(0, Math.floor(Math.log2(lum + 1e-5) * 4 + 16)));
          hist[b]++;
        }
        return { hist: hist, total: w * h };
      }
      var px8 = new Uint8Array(w * h * 4);
      gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px8);
      for (var j = 0; j < w * h; j++) {
        var l = Math.max(0, 0.2126 * px8[j * 4] + 0.7152 * px8[j * 4 + 1] + 0.0722 * px8[j * 4 + 2]) / 255;
        hist[Math.min(bins - 1, Math.max(0, Math.floor(l * bins)))]++;
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
  };
})();
