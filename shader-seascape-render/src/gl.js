/* WebGL2 helpers: shader assembly, programs, render targets, fullscreen quad.
   No modules, no fetch — everything is loaded as classic scripts. */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});

  var GLSL = (SS.GLSL = SS.GLSL || {});

  /** Assemble a fragment shader: version line, precision, defines, chunks. */
  SS.assembleFS = function (defines, bodyParts) {
    var out = ['#version 300 es', 'precision highp float;', 'precision highp int;', 'precision highp sampler2D;', 'precision highp sampler3D;'];
    if (defines) {
      for (var k in defines) out.push('#define ' + k + ' ' + defines[k]);
    }
    for (var i = 0; i < bodyParts.length; i++) out.push(bodyParts[i]);
    return out.join('\n');
  };

  SS.VS_QUAD = [
    '#version 300 es',
    'precision highp float;',
    'out vec2 vUv;',
    'void main() {',
    '  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));',
    '  vUv = p;',
    '  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);',
    '}'
  ].join('\n');

  SS.gl = function (canvas) {
    var opts = {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
      desynchronized: false
    };
    var gl = canvas.getContext('webgl2', opts);
    if (!gl) return null;

    var api = {};
    api.raw = gl;

    api.float = null;
    api.halfFloat = false;
    api.maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    api.debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    api.rendererName = api.debugInfo ? gl.getParameter(api.debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);

    // Color-buffer float support decides the HDR path.
    var cbf = gl.getExtension('EXT_color_buffer_float');
    var cbhf = gl.getExtension('EXT_color_buffer_half_float');
    api.colorFloat = !!cbf;
    api.colorHalf = !!cbf || !!cbhf;
    if (api.colorFloat) {
      api.float = { internal: gl.RGBA32F, type: gl.FLOAT };
    } else if (api.colorHalf) {
      api.float = { internal: gl.RGBA16F, type: gl.HALF_FLOAT };
    }
    api.linFloat = null;
    if (cbf) api.linFloat = { R: gl.R32F, RG: gl.RG32F, RGBA: gl.RGBA32F };
    if (!api.linFloat && cbhf) api.linFloat = { R: gl.R16F, RG: gl.RG16F, RGBA: gl.RGBA16F };
    if (!api.linFloat) api.linFloat = { R: gl.RGBA8, RG: gl.RGBA8, RGBA: gl.RGBA8, packed8: true };
    api.hdrFormat = api.colorFloat ? gl.RGBA32F : (api.colorHalf ? gl.RGBA16F : gl.RGBA8);
    api.hdrType = api.colorFloat ? gl.FLOAT : (api.colorHalf ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE);

    api.hasTex3D = true;

    api.program = function (fsSource, vsSource) {
      var vs = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vs, vsSource || SS.VS_QUAD);
      gl.compileShader(vs);
      if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        throw new Error('vertex shader: ' + gl.getShaderInfoLog(vs));
      }
      var fs = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fs, fsSource);
      gl.compileShader(fs);
      if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        var log = gl.getShaderInfoLog(fs) || '';
        var lines = fsSource.split('\n');
        var m = /:(\d+):/.exec(log);
        var ctx = '';
        if (m) {
          var ln = parseInt(m[1], 10) - 1;
          for (var i = Math.max(0, ln - 4); i < Math.min(lines.length, ln + 4); i++) {
            ctx += (i + 1 === ln + 1 ? '>> ' : '   ') + (i + 1) + ': ' + lines[i] + '\n';
          }
        }
        throw new Error('fragment shader: ' + log + '\n' + ctx);
      }
      var p = gl.createProgram();
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        throw new Error('link: ' + gl.getProgramInfoLog(p));
      }
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      var wrap = { raw: p, u: {}, gl: gl };
      wrap.locate = function (names) {
        for (var i = 0; i < names.length; i++) {
          var n = names[i];
          if (wrap.u[n] === undefined) wrap.u[n] = gl.getUniformLocation(p, n);
        }
        return wrap;
      };
      wrap.use = function () {
        gl.useProgram(p);
        return wrap;
      };
      wrap.set = function (name, v) {
        var loc = wrap.u[name];
        if (loc === undefined) loc = wrap.u[name] = gl.getUniformLocation(p, name);
        if (loc === null || v === undefined || v === null) return wrap;
        if (typeof v === 'number') gl.uniform1f(loc, v);
        else if (v.length === 2) gl.uniform2f(loc, v[0], v[1]);
        else if (v.length === 3) gl.uniform3f(loc, v[0], v[1], v[2]);
        else if (v.length === 4) gl.uniform4f(loc, v[0], v[1], v[2], v[3]);
        return wrap;
      };
      wrap.setInt = function (name, v) {
        var loc = wrap.u[name];
        if (loc === undefined) loc = wrap.u[name] = gl.getUniformLocation(p, name);
        if (loc !== null) gl.uniform1i(loc, v);
        return wrap;
      };
      wrap.setTex = function (name, tex, unit, target) {
        var loc = wrap.u[name];
        if (loc === undefined) loc = wrap.u[name] = gl.getUniformLocation(p, name);
        if (loc === null) return wrap;
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(target || gl.TEXTURE_2D, tex);
        gl.uniform1i(loc, unit);
        return wrap;
      };
      wrap.setTex3D = function (name, tex, unit) {
        var loc = wrap.u[name];
        if (loc === undefined) loc = wrap.u[name] = gl.getUniformLocation(p, name);
        if (loc === null) return wrap;
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_3D, tex);
        gl.uniform1i(loc, unit);
        return wrap;
      };
      return wrap;
    };

    /** Create a 2D texture. opts: {internal, format, type, filter, wrap, data, width,height} */
    api.texture = function (opts) {
      var t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      var f = opts.filter === undefined ? gl.LINEAR : opts.filter;
      var w = opts.wrap === undefined ? gl.CLAMP_TO_EDGE : opts.wrap;
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, f);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, w);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, w);
      gl.texImage2D(gl.TEXTURE_2D, 0, opts.internal, opts.width, opts.height, 0,
        opts.format || gl.RGBA, opts.type || gl.UNSIGNED_BYTE, opts.data || null);
      t.__w = opts.width; t.__h = opts.height;
      return t;
    };

    api.texture3D = function (opts) {
      var t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_3D, t);
      var f = opts.filter === undefined ? gl.LINEAR : opts.filter;
      var w = opts.wrap === undefined ? gl.REPEAT : opts.wrap;
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, f);
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, f);
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, w);
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, w);
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, w);
      gl.texImage3D(gl.TEXTURE_3D, 0, opts.internal, opts.width, opts.height, opts.depth, 0,
        opts.format || gl.RGBA, opts.type || gl.UNSIGNED_BYTE, opts.data || null);
      t.__w = opts.width; t.__h = opts.height; t.__d = opts.depth;
      return t;
    };

    /** A framebuffer + its color texture. */
    /** A framebuffer that renders into one layer of a 3D texture (volume baking). */
    api.target3D = function (tex, layer) {
      var fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, tex, 0, layer);
      var ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      // The dimensions matter: api.bind() sets the viewport from them, and returning
      // w:0/h:0 here meant a 0x0 viewport, so every one of the 128 slices of the cloud
      // noise volume baked to pure black and the whole cloud layer evaluated to zero
      // density. Silent, because a black volume is a perfectly valid texture.
      return { fbo: fbo, tex: tex, w: tex.__w || 0, h: tex.__h || 0, ok: ok };
    };

    api.target = function (w, h, internal, type, filter) {
      var tex = api.texture({
        internal: internal, width: w, height: h,
        format: gl.RGBA, type: type, filter: filter === undefined ? gl.LINEAR : filter,
        wrap: gl.CLAMP_TO_EDGE
      });
      var fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      var ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { fbo: fbo, tex: tex, w: w, h: h, ok: ok };
    };

    api.resizeTarget = function (t, w, h) {
      if (t.w === w && t.h === h) return t;
      gl.deleteTexture(t.tex);
      gl.deleteFramebuffer(t.fbo);
      return api.target(w, h, t.internal || api.hdrFormat, t.type || api.hdrType, t.filter);
    };

    // Stale sampler bindings are the classic feedback-loop trap: clear the units
    // before every pass.
    api.clearUnits = function (n) {
      for (var i = 0; i < (n || 8); i++) {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindTexture(gl.TEXTURE_3D, null);
      }
    };

    api.bind = function (t) {
      api.clearUnits(8);
      if (t) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
        gl.viewport(0, 0, t.w, t.h);
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      }
    };

    // Float readback: the spec lets an implementation choose HALF_FLOAT or FLOAT for
    // half-float render targets, so probe both once and remember what works.
    api.readFloatType = null;
    api.readFloats = function (x, y, w, h, outArr) {
      var gl2 = gl;
      var types = api.readFloatType !== null ? [api.readFloatType] : [gl2.FLOAT, gl2.HALF_FLOAT];
      for (var i = 0; i < types.length; i++) {
        while (gl2.getError() !== 0) { /* drain */ }
        if (types[i] === gl2.FLOAT) {
          gl2.readPixels(x, y, w, h, gl2.RGBA, gl2.FLOAT, outArr);
        } else {
          var u16 = new Uint16Array(w * h * 4);
          gl2.readPixels(x, y, w, h, gl2.RGBA, gl2.HALF_FLOAT, u16);
          for (var j = 0; j < u16.length; j++) {
            var v = u16[j], sg = (v & 0x8000) ? -1 : 1, e = (v >> 10) & 0x1f, m = v & 0x3ff;
            outArr[j] = e === 0 ? sg * Math.pow(2, -14) * (m / 1024)
              : (e === 31 ? (m ? NaN : sg * Infinity) : sg * Math.pow(2, e - 15) * (1 + m / 1024));
          }
        }
        if (gl2.getError() === 0) { api.readFloatType = types[i]; return true; }
      }
      return false;
    };

    api.debugLabel = '';
    api.drawQuad = function (label) {
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      var e = gl.getError();
      if (e) {
        var msg = 'GL error 0x' + e.toString(16) + ' at pass "' + (label || api.debugLabel || '?') + '"';
        console.warn(msg);
        api.lastError = msg;
      }
    };

    return api;
  };
})();
