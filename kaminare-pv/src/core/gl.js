// Thin helpers around three.js for fullscreen passes and render targets.
import * as THREE from 'three';
import { FULLSCREEN_VERT, NOISE } from '../gfx/glsl.js';

const quadGeo = new THREE.PlaneGeometry(2, 2);
const orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

export class Pass {
  constructor(frag, uniforms = {}, opts = {}) {
    this.material = new THREE.ShaderMaterial({
      vertexShader: opts.vert || FULLSCREEN_VERT,
      fragmentShader: (opts.noNoise ? '' : NOISE) + frag,
      uniforms,
      depthTest: false,
      depthWrite: false,
      transparent: !!opts.transparent,
      blending: opts.blending ?? THREE.NormalBlending,
    });
    this.u = this.material.uniforms;
    this.mesh = new THREE.Mesh(quadGeo, this.material);
    this.mesh.frustumCulled = false;
    this.scene = new THREE.Scene();
    this.scene.add(this.mesh);
  }
  render(renderer, target = null, clear = true) {
    renderer.setRenderTarget(target);
    if (clear) renderer.clear();
    renderer.render(this.scene, orthoCam);
  }
}

// set once the renderer exists: HDR targets need a colour-buffer-float extension
export const caps = { hdr: true };
export function detectCaps(renderer) {
  const gl = renderer.getContext();
  caps.hdr = !!(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'));
  return caps;
}

export function makeRT(w, h, opts = {}) {
  const rt = new THREE.WebGLRenderTarget(w, h, {
    type: opts.type ?? (caps.hdr ? THREE.HalfFloatType : THREE.UnsignedByteType),
    format: THREE.RGBAFormat,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: opts.depth ?? false,
    samples: opts.samples ?? 0,
    generateMipmaps: false,
  });
  rt.texture.colorSpace = THREE.NoColorSpace;
  return rt;
}

// A 2D canvas that is uploaded as a texture once per frame (only when drawn).
export class CanvasLayer {
  constructor(w, h) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext('2d');
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.colorSpace = THREE.NoColorSpace;
    this.tex.minFilter = THREE.LinearFilter;
    this.tex.magFilter = THREE.LinearFilter;
    this.tex.generateMipmaps = false;
    this.w = w;
    this.h = h;
  }
  resize(w, h) {
    if (w === this.w && h === this.h) return;
    this.canvas.width = this.w = w;
    this.canvas.height = this.h = h;
    this.tex.dispose();
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.colorSpace = THREE.NoColorSpace;
    this.tex.minFilter = THREE.LinearFilter;
    this.tex.generateMipmaps = false;
  }
  // begin drawing in design space (1920x1080)
  begin(clear = true) {
    const c = this.ctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    // the context is reused every frame: reset all drawing state so nothing leaks between frames
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'source-over';
    c.filter = 'none';
    c.shadowBlur = 0;
    c.shadowColor = 'rgba(0,0,0,0)';
    c.lineWidth = 1;
    c.lineCap = 'butt';
    c.lineJoin = 'miter';
    c.textAlign = 'start';
    c.textBaseline = 'alphabetic';
    if ('letterSpacing' in c) c.letterSpacing = '0px';
    if (clear) {
      c.clearRect(0, 0, this.w, this.h);
      // Touch one pixel so the canvas always counts as modified: Chrome may otherwise hand
      // WebGL a stale snapshot when a frame only cleared the canvas.
      c.fillStyle = 'rgba(0,0,0,0.004)';
      c.fillRect(0, 0, 1, 1);
    }
    c.fillStyle = '#000';
    c.strokeStyle = '#000';
    c.setTransform(this.w / 1920, 0, 0, this.h / 1080, 0, 0);
    return c;
  }
  end() {
    this.tex.needsUpdate = true;
  }
}

// Scenes draw and composite their 2D layers immediately, one scene at a time, so every
// scene can share the same few full-size canvases (slot 0 = type, 1 = glow, 2 = spare).
const POOL = [];
export function sharedLayer(slot) {
  if (!POOL[slot]) POOL[slot] = new CanvasLayer(1920, 1080);
  return POOL[slot];
}

export function canvasTexture(canvas, srgb = true) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.NoColorSpace; void srgb;
  t.minFilter = THREE.LinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  return t;
}

export { THREE };
