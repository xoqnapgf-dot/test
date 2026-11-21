/* The living artwork, drawn with WebGL (version 1, for the widest support).
 *
 * Pass 1 (scene)  the artwork as two depth layers: the plate (artwork with the walker
 *                 removed) and the walker. Per-pixel parallax, depth of field, motion blur,
 *                 valley fog, road glints, a rim of sunset on the walker. Outside the picture
 *                 rectangle (player view): a blurred, slowly turning ambient copy and the
 *                 card's shadow.
 * Pass 2 (post)   lens drop and ripple, chromatic split and double vision, light shafts from
 *                 the sun, flare, light leak, grade, vignette, grain.
 */
(function () {
  "use strict";

  var VERT = [
    "attribute vec2 aPos;",
    "varying vec2 vUv;",
    "void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }"
  ].join("\n");

  var COMMON = [
    "#ifdef GL_FRAGMENT_PRECISION_HIGH",
    "precision highp float;",
    "#else",
    "precision mediump float;",
    "#endif",
    "varying vec2 vUv;",
    "float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }",
    "float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);",
    "  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }",
    "float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++){ s += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return s; }",
    "float lum(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }",
    "float sdRound(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }"
  ].join("\n");

  var SCENE = COMMON + "\n" + [
    "uniform vec2 uRes;",          // device px
    "uniform vec4 uRect;",         // picture rect, device px, top-left origin
    "uniform float uRadius;",
    "uniform float uScale;",       // device px per stage unit
    "uniform vec2 uCam;",
    "uniform vec2 uVis;",
    "uniform float uRoll;",
    "uniform vec2 uPar;",
    "uniform float uDolly;",
    "uniform float uD0;",
    "uniform float uFocus;",
    "uniform float uDof;",
    "uniform float uFog;",
    "uniform float uFogRise;",
    "uniform float uGlints;",
    "uniform float uRim;",
    "uniform float uTime;",
    "uniform float uLodBase;",    // log2(artwork texels per device pixel); negative when magnified
    "uniform vec2 uVel;",          // picture motion this frame, in s units
    "uniform vec2 uSun;",
    "uniform float uDebug;",
    "uniform sampler2D tPlate;",
    "uniform sampler2D tWalker;",  // rgb = artwork, a = walker alpha
    "uniform sampler2D tAux;",     // r = plate depth, g = artwork depth (reference), b = walker alpha
    "",
    "vec2 disk(int i){",
    "  if (i == 0) return vec2(0.0, 0.0);",
    "  if (i == 1) return vec2(0.527, -0.085);",
    "  if (i == 2) return vec2(-0.040, 0.536);",
    "  if (i == 3) return vec2(-0.670, -0.179);",
    "  if (i == 4) return vec2(-0.419, -0.616);",
    "  if (i == 5) return vec2(0.441, -0.674);",
    "  if (i == 6) return vec2(-0.866, 0.444);",
    "  if (i == 7) return vec2(0.537, 0.787);",
    "  if (i == 8) return vec2(0.939, 0.296);",
    "  if (i == 9) return vec2(-0.334, 0.932);",
    "  if (i == 10) return vec2(0.067, -0.986);",
    "  return vec2(-0.975, -0.218);",
    "}",
    "",
    "vec2 qOf(vec2 s){",
    "  vec2 r = (s - 0.5) * uVis;",
    "  float c = cos(uRoll), n = sin(uRoll);",
    "  return vec2(c * r.x + n * r.y, -n * r.x + c * r.y);",
    "}",
    "",
    "vec3 ambient(vec2 px){",
    "  vec2 p = (px - 0.5 * uRes) / max(uRes.x, uRes.y);",
    "  float a = uTime * 0.025;",
    "  vec2 r1 = mat2(cos(a), -sin(a), sin(a), cos(a)) * p * 0.62 + vec2(0.45, 0.46);",
    "  vec2 r2 = mat2(cos(-a * 1.4 + 1.7), -sin(-a * 1.4 + 1.7), sin(-a * 1.4 + 1.7), cos(-a * 1.4 + 1.7)) * p * 0.8 + vec2(0.55, 0.62);",
    "  vec3 c = texture2D(tPlate, r1, 6.5).rgb * 0.65 + texture2D(tPlate, r2, 7.0).rgb * 0.45;",
    "  c += texture2D(tPlate, r1 + vec2(0.07, -0.04), 6.0).rgb * 0.2;",
    "  c *= 0.62;",
    "  float g = exp(-length(p - vec2(-0.28, -0.22)) * 2.2);",
    "  c += vec3(1.0, 0.62, 0.32) * g * 0.16;",
    "  return c;",
    "}",
    "",
    "void main(){",
    "  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes;",
    "  vec2 half_ = uRect.zw * 0.5;",
    "  vec2 ctr = uRect.xy + half_;",
    "  float sd = sdRound(px - ctr, half_, uRadius);",
    "  float inside = 1.0 - smoothstep(-0.8, 0.8, sd);",
    "  vec3 outCol = vec3(0.0);",
    "  if (inside < 1.0) {",
    "    outCol = ambient(px);",
    "    float sh = sdRound(px - ctr - vec2(0.0, 26.0 * uScale), half_, uRadius);",
    "    outCol *= 1.0 - 0.6 * (1.0 - smoothstep(-24.0 * uScale, 80.0 * uScale, sh));",
    "  }",
    "  vec3 col = vec3(0.0);",
    "  if (inside > 0.0) {",
    "    vec2 s = (px - uRect.xy) / uRect.zw;",
    "    vec2 q = qOf(s);",
    "    vec2 velUV = uVel * uVis;",
    // ---- background plate with per-pixel parallax (fixed-point inversion)
    "    vec2 u = uCam + q; float d = 0.3;",
    "    for (int i = 0; i < 4; i++) { d = texture2D(tAux, u, 1.5).r; u = uCam + (q - uPar * (d - uD0)) / (1.0 + uDolly * (d - uD0)); }",
    "    float coc = uDof * abs(d - uFocus) * 0.011;",
    "    float lod = log2(max(coc * 1024.0 * 0.45, 1.0)) - min(uLodBase, 0.0);",
    "    vec3 bg = vec3(0.0);",
    "    for (int i = 0; i < 12; i++) {",
    "      vec2 o = disk(i) * coc + velUV * (float(i) / 11.0 - 0.5);",
    "      bg += texture2D(tPlate, u + o, lod).rgb;",
    "    }",
    "    bg /= 12.0;",
    // ---- valley fog, drifting, lit warm on the sun side
    "    float band = smoothstep(0.40, 0.47, u.y) * (1.0 - smoothstep(0.62, 0.70, u.y));",
    "    float far = 1.0 - smoothstep(0.04, 0.30, d);",
    "    float n1 = fbm(vec2(u.x * 3.2 - uTime * 0.014, u.y * 9.0 + uTime * 0.002));",
    "    float n2 = fbm(u * vec2(7.0, 15.0) + vec2(-uTime * 0.03, uTime * 0.006 - uFogRise * uTime * 0.01));",
    "    float fogA = band * far * smoothstep(0.38, 0.82, n1 * 0.62 + n2 * 0.48) * uFog * 0.62;",
    "    float sunN = exp(-length((u - uSun) * vec2(1.0, 1.6)) * 3.2);",
    "    vec3 fogC = mix(vec3(0.80, 0.80, 0.86), vec3(1.0, 0.74, 0.52), sunN);",
    "    bg = mix(bg, fogC, fogA);",
    // ---- glints on the wet road, travelling towards the camera
    "    float road = smoothstep(0.58, 0.68, u.y) * smoothstep(0.22, 0.45, d) * (1.0 - smoothstep(0.70, 0.85, u.x));",
    "    float gl = noise(u * vec2(110.0, 300.0) + vec2(0.0, uTime * 0.9));",
    "    gl = pow(max(gl - 0.80, 0.0) / 0.20, 4.0) * road * uGlints * smoothstep(0.18, 0.5, lum(bg));",
    "    bg += vec3(1.0, 0.82, 0.62) * gl * 1.4;",
    // ---- the walker layer, its own depth from the artwork's depth map
    // He is treated as a near-rigid figure whose depth depends only on height (measured
    // from the depth map: 0.62 at the shoulders to 0.82 at the feet, where he meets the
    // road). A depth that varies across his outline makes this inversion fold over at the
    // edge and draw his alpha twice (a ghost outline); a function of height alone cannot.
    "    vec2 uf = uCam + q; float df = uD0;",
    "    for (int i = 0; i < 3; i++) { df = 0.62 + 0.05 * smoothstep(0.30, 0.60, uf.y) + 0.15 * smoothstep(0.68, 0.92, uf.y); uf = uCam + (q - uPar * (df - uD0)) / (1.0 + uDolly * (df - uD0)); }",
    "    float cocf = uDof * abs(df - uFocus) * 0.011;",
    "    float lodf = log2(max(cocf * 1024.0 * 0.45, 1.0)) - min(uLodBase, 0.0);",
    "    float lodA = max(lodf, 0.9 - uLodBase);",
    "    vec4 fg = vec4(0.0);",
    "    for (int i = 0; i < 12; i++) {",
    "      vec2 o = disk(i) * cocf + velUV * (float(i) / 11.0 - 0.5);",
    "      vec3 w = texture2D(tWalker, uf + o, lodf).rgb;",
    "      float wa = texture2D(tAux, uf + o, lodA).b;",
    "      fg += vec4(w * wa, wa);",
    "    }",
    "    fg /= 12.0;",
    // rim of sunset light on his left (sun-facing) edges
    // (measured on the same softened alpha the layer uses, and only while he is in focus:
    // a crisp rim next to a defocused figure reads as a stray outline)
    "    float e = 0.004 + cocf * 0.5;",
    "    float ax = texture2D(tAux, uf + vec2(e, 0.0), lodA).b - texture2D(tAux, uf - vec2(e, 0.0), lodA).b;",
    "    float ay = texture2D(tAux, uf + vec2(0.0, e), lodA).b - texture2D(tAux, uf - vec2(0.0, e), lodA).b;",
    "    float rim = clamp(ax * 1.2 + ay * 0.5, 0.0, 1.0) * fg.a * uRim * (1.0 - smoothstep(0.0008, 0.003, cocf));",
    "    col = bg * (1.0 - fg.a) + fg.rgb + vec3(1.0, 0.62, 0.34) * rim * 0.22;",
    // ---- mist lifting off the road, in front of everything (line 4)
    "    float m = fbm(s * vec2(2.2, 3.0) + vec2(uTime * 0.012, uTime * 0.11));",
    "    float mist = smoothstep(0.45, 0.9, m) * uFogRise * (0.25 + 0.75 * smoothstep(0.2, 1.0, s.y)) * 0.42;",
    "    col = mix(col, vec3(0.92, 0.84, 0.80), mist);",
    "    if (uDebug > 0.5 && uDebug < 1.5) col = bg;",
    "    if (uDebug > 1.5 && uDebug < 2.5) col = fg.rgb / max(fg.a, 1e-3);",
    "    if (uDebug > 2.5) col = vec3(fg.a);",
    "  }",
    "  gl_FragColor = vec4(mix(outCol, col, inside), 1.0);",
    "}"
  ].join("\n");

  var POST = COMMON + "\n" + [
    "uniform vec2 uRes;",
    "uniform sampler2D tScene;",
    "uniform vec2 uSunPx;",        // sun on screen, device px (may be off screen)
    "uniform float uSunVis;",      // 0..1 sun inside the picture
    "uniform float uRays;",
    "uniform float uCA;",
    "uniform float uGhost;",
    "uniform vec4 uDrop;",         // x, y, r (device px), alpha
    "uniform vec4 uRipple;",       // x, y (px), t (s), on
    "uniform float uLeak;",
    "uniform float uWarm;",
    "uniform float uSat;",
    "uniform float uExposure;",
    "uniform float uTime;",
    "uniform float uFrame;",
    "uniform float uScale;",
    "uniform vec4 uRect;",
    "uniform float uMode;",
    "",
    "vec3 tex(vec2 px){ return texture2D(tScene, vec2(px.x, uRes.y - px.y) / uRes).rgb; }",
    "",
    "void main(){",
    "  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes;",
    "  vec2 sp = px;",
    // ---- a drop of light on the lens: an inverted little lens with a bright rim
    "  float dropMask = 0.0; vec2 dn = vec2(0.0);",
    "  if (uDrop.w > 0.0) {",
    "    vec2 dv = (px - uDrop.xy) / uDrop.z; dv.y *= 0.86;",
    "    float r = length(dv);",
    "    if (r < 1.0) { float h = sqrt(1.0 - r * r); dn = dv; sp = uDrop.xy - dv * uDrop.z * 0.55 * (0.4 + h); dropMask = (1.0 - smoothstep(0.86, 1.0, r)) * uDrop.w; }",
    "    // the wet trail it leaves",
    "    float tx = abs(px.x - uDrop.x) / (uDrop.z * 0.45);",
    "    float ty = (uDrop.y - px.y) / uDrop.z;",
    "    if (ty > 0.5 && tx < 1.0) { sp += vec2(0.0, 2.0 * uScale) * (1.0 - tx) * exp(-ty * 0.08) * uDrop.w; }",
    "  }",
    "  if (uRipple.w > 0.0) {",
    "    vec2 dv = px - uRipple.xy; float r = length(dv) / uScale;",
    "    float front = uRipple.z * 520.0;",
    "    float w = sin((r - front) * 0.09) * exp(-abs(r - front) * 0.012) * exp(-uRipple.z * 1.9);",
    "    sp += normalize(dv + 1e-4) * w * 11.0 * uScale;",
    "  }",
    // ---- chromatic split and double vision (line 7)
    "  vec2 cdir = (sp - 0.5 * uRes) / uRes.y;",
    "  vec2 off = cdir * uCA * 16.0 * uScale;",
    "  vec3 col = vec3(tex(sp + off).r, tex(sp).g, tex(sp - off).b);",
    "  if (uGhost > 0.001) {",
    "    vec2 go = vec2(22.0, 7.0) * uScale * uGhost;",
    "    col = mix(col, 0.5 * (tex(sp + go) + tex(sp - go * 0.6)), 0.42 * uGhost);",
    "  }",
    "  vec3 base = col;",
    // ---- light shafts: radial blur of the bright sky towards the sun
    "  if (uRays > 0.01) {",
    "    vec2 dir = (uSunPx - px) / 32.0;",
    "    vec2 p = px; float w = 1.0, acc = 0.0;",
    "    for (int i = 0; i < 32; i++) {",
    "      p += dir;",
    "      vec3 c = tex(clamp(p, vec2(1.0), uRes - 1.0));",
    "      float b = max(lum(c) - 0.58, 0.0) * smoothstep(0.0, 0.12, c.r - c.b);",
    "      acc += b * w; w *= 0.955;",
    "    }",
    "    float dist = length(uSunPx - px) / uRes.y;",
    "    col += vec3(1.0, 0.66, 0.40) * acc * 0.032 * uRays * exp(-dist * 0.9);",
    "  }",
    // ---- sun glow, anamorphic streak and ghosts
    "  if (uSunVis > 0.001) {",
    "    vec2 d = (px - uSunPx) / uRes.y;",
    "    float g = exp(-length(d) * 10.0) * 0.28 + exp(-length(d) * 34.0) * 0.35;",
    "    float streak = exp(-abs(d.y) * 220.0) * exp(-abs(d.x) * 5.0) * 0.10;",
    "    col += vec3(1.0, 0.70, 0.42) * (g + streak) * uSunVis * (0.6 + 0.4 * uRays);",
    "    vec2 ctr = 0.5 * uRes; vec2 axis = ctr - uSunPx;",
    "    for (int i = 0; i < 4; i++) {",
    "      float k = 0.45 + float(i) * 0.38;",
    "      vec2 gp = uSunPx + axis * k * 2.0;",
    "      float rr = (14.0 + float(i) * 18.0) * uScale;",
    "      float gg = smoothstep(rr, rr * 0.75, length(px - gp)) * (0.05 - float(i) * 0.008);",
    "      col += mix(vec3(1.0, 0.55, 0.3), vec3(0.4, 0.7, 1.0), float(i) / 3.0) * gg * uSunVis;",
    "    }",
    "  }",
    // ---- the drop: highlight, dark edge
    "  if (dropMask > 0.0) {",
    "    float r = length(dn);",
    "    float spec = exp(-length(dn - vec2(-0.35, -0.42)) * 9.0);",
    "    float edge = smoothstep(0.65, 0.98, r);",
    "    col = mix(col, col * 1.15 + vec3(0.10, 0.08, 0.06), dropMask * 0.6);",
    "    col = mix(col, col * 0.55, edge * dropMask * 0.6);",
    "    col += vec3(1.0, 0.95, 0.9) * spec * dropMask * 0.9;",
    "  }",
    // ---- light leak on the big moves
    "  if (uLeak > 0.001) {",
    "    float l = exp(-pow((px.x / uRes.x + 0.1 - uLeak * 0.25), 2.0) * 6.0) * (0.6 + 0.4 * fbm(px / uRes.y * 2.0 + uTime * 0.3));",
    "    col += vec3(1.0, 0.45, 0.18) * l * uLeak * 0.55;",
    "  }",
    // ---- grade: exposure, warmth, saturation, gentle filmic shoulder, split tone
    "  col *= uExposure;",
    "  col *= vec3(1.0 + uWarm * 0.5, 1.0 + uWarm * 0.1, 1.0 - uWarm * 0.6);",
    "  float L = lum(col);",
    "  col = mix(vec3(L), col, uSat);",
    "  float Lh = lum(col); float Lc = Lh < 0.8 ? Lh : 0.8 + 0.2 * (1.0 - exp(-(Lh - 0.8) / 0.2)); col *= Lc / max(Lh, 1e-4);",
    "  col += vec3(-0.010, 0.004, 0.022) * (1.0 - smoothstep(0.0, 0.35, L));",
    // ---- vignette inside the picture
    "  vec2 sr = (px - uRect.xy) / uRect.zw - 0.5;",
    "  float vig = smoothstep(0.85, 0.25, length(sr * vec2(1.0, 1.15)));",
    "  col *= mix(1.0, 0.55 + 0.45 * vig, uMode * 0.9 + 0.1);",
    // ---- grain and dither
    "  float gr = hash(px + fract(uFrame * 0.6180339) * 113.0) - 0.5;",
    "  col += gr * 0.03 * (0.6 + 0.4 * (1.0 - L));",
    "  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);",
    "}"
  ].join("\n");

  // ------------------------------------------------------------------ GL plumbing
  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(sh);
      throw new Error("shader: " + log);
    }
    return sh;
  }
  function program(gl, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, "aPos");
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error("link: " + gl.getProgramInfoLog(p));
    var u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) {
      var info = gl.getActiveUniform(p, i);
      u[info.name] = gl.getUniformLocation(p, info.name);
    }
    return { p: p, u: u };
  }
  function texFrom(gl, src, mip) {
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    if (mip) {
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    } else gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    return t;
  }

  function Scene(canvas, images) {
    var gl = canvas.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: true, premultipliedAlpha: false })
      || canvas.getContext("experimental-webgl", { preserveDrawingBuffer: true });
    if (!gl) throw new Error("WebGL is not available");
    this.gl = gl;
    this.sceneP = program(gl, SCENE);
    this.postP = program(gl, POST);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.tPlate = texFrom(gl, images.plate, true);
    this.tAux = texFrom(gl, images.aux, true);
    this.tWalker = texFrom(gl, images.walker, true);
    this.fbo = null;
    this.fw = this.fh = 0;
  }

  Scene.prototype.ensureFBO = function (w, h) {
    var gl = this.gl;
    if (this.fbo && this.fw === w && this.fh === h) return;
    if (this.fbo) { gl.deleteFramebuffer(this.fbo); gl.deleteTexture(this.ftex); }
    this.ftex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.ftex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ftex, 0);
    this.fw = w; this.fh = h;
  };

  /* f: everything the frame needs, computed by app.js from the timeline
   *   w, h        canvas size in device px
   *   k           device px per stage unit
   *   rect        picture rect in stage units {x,y,w,h,r}
   *   cam         MVTimeline.state(...)
   *   vel         picture motion this frame (s units)
   *   sunPx, sunVis, dropPx, ripplePx, t, st, frame */
  Scene.prototype.render = function (f) {
    var gl = this.gl, c = f.cam, k = f.k;
    this.ensureFBO(f.w, f.h);
    // pass 1
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.viewport(0, 0, f.w, f.h);
    var P = this.sceneP, u = P.u;
    gl.useProgram(P.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.tPlate); gl.uniform1i(u.tPlate, 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.tWalker); gl.uniform1i(u.tWalker, 1);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, this.tAux); gl.uniform1i(u.tAux, 2);
    gl.uniform2f(u.uRes, f.w, f.h);
    gl.uniform4f(u.uRect, f.rect.x * k, f.rect.y * k, f.rect.w * k, f.rect.h * k);
    gl.uniform1f(u.uRadius, Math.max(0.01, f.rect.r * k));
    gl.uniform1f(u.uScale, k);
    gl.uniform2f(u.uCam, c.cx, c.cy);
    gl.uniform2f(u.uVis, c.visW, c.visH);
    gl.uniform1f(u.uRoll, c.roll);
    gl.uniform2f(u.uPar, c.par[0], c.par[1]);
    gl.uniform1f(u.uDolly, c.dolly);
    gl.uniform1f(u.uD0, window.MVTimeline.D0);
    gl.uniform1f(u.uFocus, c.focus);
    gl.uniform1f(u.uDof, c.dof);
    gl.uniform1f(u.uFog, c.fog);
    gl.uniform1f(u.uFogRise, c.fogRise);
    gl.uniform1f(u.uGlints, c.glints);
    gl.uniform1f(u.uRim, 0.5 + 0.5 * c.rays);
    gl.uniform1f(u.uTime, f.st);
    gl.uniform1f(u.uLodBase, Math.log2(Math.max(1e-4, c.visH * 1024 / (f.rect.h * k))));
    gl.uniform2f(u.uVel, f.vel[0], f.vel[1]);
    gl.uniform2f(u.uSun, window.MVTimeline.SUN[0], window.MVTimeline.SUN[1]);
    gl.uniform1f(u.uDebug, f.debug || 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // pass 2
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, f.w, f.h);
    P = this.postP; u = P.u;
    gl.useProgram(P.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.ftex); gl.uniform1i(u.tScene, 0);
    gl.uniform2f(u.uRes, f.w, f.h);
    gl.uniform2f(u.uSunPx, f.sunPx[0], f.sunPx[1]);
    gl.uniform1f(u.uSunVis, f.sunVis);
    gl.uniform1f(u.uRays, c.rays);
    gl.uniform1f(u.uCA, c.ca);
    gl.uniform1f(u.uGhost, c.ghost);
    gl.uniform4f(u.uDrop, f.dropPx[0], f.dropPx[1], f.dropPx[2], f.dropPx[3]);
    gl.uniform4f(u.uRipple, f.ripplePx[0], f.ripplePx[1], f.ripplePx[2], f.ripplePx[3]);
    gl.uniform1f(u.uLeak, c.leak);
    gl.uniform1f(u.uWarm, c.warm);
    gl.uniform1f(u.uSat, c.sat);
    gl.uniform1f(u.uExposure, c.exposure);
    gl.uniform1f(u.uTime, f.st);
    gl.uniform1f(u.uFrame, f.frame);
    gl.uniform1f(u.uScale, k);
    gl.uniform4f(u.uRect, f.rect.x * k, f.rect.y * k, f.rect.w * k, f.rect.h * k);
    gl.uniform1f(u.uMode, c.mode);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  window.MVScene = Scene;
})();
