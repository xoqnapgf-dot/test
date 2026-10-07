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

export function makeRT(w, h, opts = {}) {
  const rt = new THREE.WebGLRenderTarget(w, h, {
    type: opts.type ?? THREE.HalfFloatType,
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
    if (clear) c.clearRect(0, 0, this.w, this.h);
    c.setTransform(this.w / 1920, 0, 0, this.h / 1080, 0, 0);
    return c;
  }
  end() {
    this.tex.needsUpdate = true;
  }
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
