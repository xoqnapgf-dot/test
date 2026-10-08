// Scene building blocks: background, 3D stage, shared 2D layers.
import * as THREE from 'three';
import { Pass, sharedLayer } from '../core/gl.js';

// Background: deep blue-black with a soft key pool, faint measurement grid and dust.
const BG_FRAG = /* glsl */ `
uniform float uTime, uGrid, uWarm; uniform vec2 uPool; uniform vec3 uTint;
varying vec2 vUv;
void main(){
  vec2 p = vUv * vec2(1920., 1080.);
  vec2 q = (vUv - uPool) * vec2(1.78, 1.);
  float pool = exp(-dot(q,q)*2.2);
  vec3 c = vec3(0.0035,0.0042,0.006) + vec3(0.02,0.022,0.028)*pool + vec3(0.03,0.015,0.004)*pool*uWarm;
  c *= uTint;
  // grid (major every 120px, minor every 24px)
  vec2 g1 = abs(fract(p/120. + .5) - .5) * 120.;
  vec2 g2 = abs(fract(p/24. + .5) - .5) * 24.;
  float gl = (exp(-min(g1.x,g1.y)*1.4)*0.6 + exp(-min(g2.x,g2.y)*2.2)*0.18) * uGrid;
  c += vec3(0.02,0.022,0.026) * gl * (0.4 + pool);
  // drifting dust motes
  float d = 0.;
  for(int i=0;i<3;i++){
    vec2 s = p/(140. + float(i)*90.) + vec2(uTime*0.02*(1.+float(i)), -uTime*0.012);
    vec2 id = floor(s); vec2 f = fract(s) - .5;
    vec2 o = (hash22(id + float(i)*17.) - .5)*0.7;
    d += smoothstep(0.035, 0., length(f - o)) * step(0.82, hash12(id*1.3 + float(i)));
  }
  c += vec3(0.05,0.05,0.055) * d;
  c += (hash12(p + fract(uTime)*91.) - .5) * 0.002;
  gl_FragColor = vec4(c, 1.);
}`;
export class Background {
  constructor() {
    this.pass = new Pass(BG_FRAG, {
      uTime: { value: 0 }, uGrid: { value: 1 }, uWarm: { value: 0 }, uPool: { value: new THREE.Vector2(0.5, 0.55) },
      uTint: { value: new THREE.Color(1, 1, 1) },
    });
  }
  draw(r, rt, t, o = {}) {
    const u = this.pass.u;
    u.uTime.value = t;
    u.uGrid.value = o.grid ?? 1;
    u.uWarm.value = o.warm ?? 0;
    u.uPool.value.set(o.poolX ?? 0.5, o.poolY ?? 0.55);
    if (o.tint) u.uTint.value.setRGB(...o.tint);
    else u.uTint.value.setRGB(1, 1, 1);
    this.pass.render(r, rt, false);
  }
}

// Composite a shared canvas layer (sRGB texture) over the target. The scene is linear, but the
// canvas was designed with sRGB blending in mind (a 15 % tint should look like 15 %), so emulate
// sRGB "over": premultiplied colour scaled by a^2.2, destination kept by (1-a)^2.2.
export const OVER_SRGB = /* glsl */ `
vec4 overSRGB(vec3 lin, float a){ return vec4(lin * pow(a, 2.2), 1. - pow(1. - a, 2.2)); }`;
const LAYER_FRAG = /* glsl */ `
uniform sampler2D tTex; uniform float uA, uBoost; varying vec2 vUv;
${OVER_SRGB}
void main(){ vec4 c = texture2D(tTex, vUv); gl_FragColor = overSRGB(c.rgb * uBoost, c.a * uA); }`;
export const PREMUL = {
  blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
  blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
};
export class Layer2D {
  constructor(slot = 0) {
    this.cl = sharedLayer(slot);
    this.pass = new Pass(LAYER_FRAG, { tTex: { value: this.cl.tex }, uA: { value: 1 }, uBoost: { value: 1 } }, { transparent: true, noNoise: true });
    Object.assign(this.pass.material, PREMUL);
  }
  begin() {
    return this.cl.begin(true);
  }
  draw(r, rt, o = {}) {
    this.cl.end();
    this.pass.u.tTex.value = this.cl.tex;
    this.pass.u.uA.value = o.alpha ?? 1;
    this.pass.u.uBoost.value = o.boost ?? 1;
    this.pass.render(r, rt, false);
  }
}

// A 3D stage: scene + camera; render on top of whatever is already in the target.
export class Stage {
  constructor(fov = 35) {
    this.scene = new THREE.Scene();
    this.cam = new THREE.PerspectiveCamera(fov, 16 / 9, 0.05, 5000);
  }
  look(px, py, pz, tx, ty, tz, fov) {
    this.cam.position.set(px, py, pz);
    this.cam.lookAt(tx, ty, tz);
    if (fov) this.cam.fov = fov;
    this.cam.updateProjectionMatrix();
  }
  render(r, rt) {
    r.setRenderTarget(rt);
    r.clearDepth();
    r.render(this.scene, this.cam);
  }
  // project a world point to design pixels (1920×1080)
  toScreen(v) {
    const p = v.clone().project(this.cam);
    return [(p.x * 0.5 + 0.5) * 1920, (0.5 - p.y * 0.5) * 1080];
  }
  // world point at design pixel (sx, sy), `dist` units in front of the camera
  place(sx, sy, dist, out = new THREE.Vector3()) {
    this.cam.updateMatrixWorld();
    out.set((sx / 1920) * 2 - 1, 1 - (sy / 1080) * 2, 0.5).unproject(this.cam).sub(this.cam.position).normalize();
    return out.multiplyScalar(dist).add(this.cam.position);
  }
  // world-units per design pixel at distance `dist` (for sizing objects to a layout)
  unit(dist) {
    return (2 * dist * Math.tan((this.cam.fov * Math.PI) / 360)) / 1080;
  }
  // set the camera-position uniform on every material that has one
  syncCam() {
    this.scene.traverse((o) => {
      const u = o.material?.uniforms;
      if (u?.uCam) u.uCam.value.copy(this.cam.position);
    });
  }
}

export { THREE };
