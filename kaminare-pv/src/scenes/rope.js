// INTERLUDE — bass × keys duet. A shimenawa (sacred twisted rope) made of two strands:
// the bass (lacquer-black / vermilion) and the keys (gold). The camera rides along the rope
// through a night of floating lanterns while paper shide flutter on every beat.
import * as THREE from 'three';
import { Layer2D } from './base.js';
import { Sky } from '../gfx/sky.js';
import { NOISE } from '../gfx/glsl.js';
import { SEC, bass, kickHit, beatF, beatPulse, hats, loud, snareHit } from '../core/music.js';
import { F, font, caption, layoutV, REVEAL } from '../core/type.js';
import { EMBLEMS, drawSym } from '../gfx/symbols.js';
import { clamp, lerp, ease, ep, rng, TAU } from '../core/util.js';

const LEN = 420;
// rope axis: gentle sagging curve along -z
const axis = (s) => new THREE.Vector3(Math.sin(s * 0.012) * 6, 6 + Math.sin(s * 0.03) * 1.5 - Math.cos(s * 0.006) * 2, -s);

class StrandCurve extends THREE.Curve {
  constructor(phase, radius, turns) {
    super();
    this.phase = phase;
    this.radius = radius;
    this.turns = turns;
  }
  getPoint(u, target = new THREE.Vector3()) {
    const s = u * LEN;
    const a = axis(s);
    const ang = this.phase + s * this.turns;
    return target.set(a.x + Math.cos(ang) * this.radius, a.y + Math.sin(ang) * this.radius, a.z);
  }
}

const STRAND_VERT = /* glsl */ `
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main(){ vUv = uv; vN = normalize(mat3(modelMatrix)*normal); vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`;
const STRAND_FRAG = /* glsl */ `
${NOISE}
uniform vec3 uCol, uGlowCol, uCam; uniform float uGlow, uTime, uPulseZ, uKind;
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main(){
  vec3 n = normalize(vN);
  // twisted straw fibres: diagonal stripes around the tube
  float fib = sin((vUv.x*2600. + vUv.y*6.2831*4.) ) * 0.5 + 0.5;
  float grain = fbm(vec2(vUv.x*2400., vUv.y*20.));
  vec3 L = normalize(vec3(0.3, 1., 0.4));
  float dif = 0.25 + 0.75*max(dot(n, L), 0.);
  vec3 V = normalize(uCam - vW);
  float rim = pow(1. - max(dot(n, V), 0.), 2.5);
  vec3 c = uCol * dif * (0.75 + 0.25*fib) * (0.8 + 0.4*grain);
  float pz = exp(-abs(vW.z - uPulseZ)*0.15);
  c += uGlowCol * (rim*0.6 + pz*uGlow*1.6) ;
  if(uKind > 0.5){ // keys strand: running sparkles
    float sp = step(0.985, hash12(floor(vec2(vUv.x*3000. - uTime*40., vUv.y*8.))));
    c += uGlowCol * sp * 3.;
  }
  float fog = 1. - exp(-pow(length(vW - uCam)*0.012, 1.5));
  c = mix(c, vec3(0.02,0.015,0.04), fog);
  gl_FragColor = vec4(c, 1.);
}`;
const SHIDE_VERT = /* glsl */ `
attribute vec3 aOff; attribute float aSeed;
uniform float uTime, uBeat;
varying float vShade; varying vec3 vW;
void main(){
  vec3 p = position;
  float hang = -p.y; // 0 at top .. 1.8 at bottom
  float sw = sin(uTime*3. + aSeed*20. + hang*1.5) * 0.25 * hang + uBeat * 0.35 * hang * sin(aSeed*9.);
  p.x += sw; p.z += cos(uTime*2. + aSeed*13.) * 0.15 * hang;
  vShade = 0.75 + 0.25*sin(sw*4. + p.x);
  vec4 w = modelMatrix*vec4(p + aOff, 1.);
  vW = w.xyz;
  gl_Position = projectionMatrix*viewMatrix*w;
}`;
const SHIDE_FRAG = /* glsl */ `
uniform vec3 uCam; uniform float uFlash;
varying float vShade; varying vec3 vW;
void main(){
  float dn = length(vW - uCam);
  if(dn < 7.) discard;
  vec3 c = vec3(0.96,0.93,0.86) * vShade * (0.55 + uFlash*0.8) * smoothstep(7., 12., dn);
  float fog = 1. - exp(-pow(length(vW - uCam)*0.012, 1.5));
  c = mix(c, vec3(0.02,0.015,0.04), fog);
  gl_FragColor = vec4(c, 1.);
}`;
const LANTERN_VERT = /* glsl */ `
attribute float aSeed; uniform float uTime; varying float vS; varying float vD;
void main(){ vec3 p = position; p.y += sin(uTime*0.6 + aSeed*30.)*0.8;
  vec4 mv = viewMatrix*modelMatrix*vec4(p,1.); vD = -mv.z; vS = aSeed;
  gl_PointSize = min((2.5 + aSeed*4.) * 300. / vD, 46.); gl_Position = projectionMatrix*mv; }`;
const LANTERN_FRAG = /* glsl */ `
uniform float uTime; varying float vS; varying float vD;
void main(){ vec2 q = gl_PointCoord - .5; float r = length(q);
  float a = exp(-r*r*14.) + exp(-r*r*120.)*0.8; float fl = 0.8 + 0.2*sin(uTime*5. + vS*40.);
  vec3 c = mix(vec3(1.4,0.55,0.2), vec3(1.6,1.1,0.5), vS) * fl * smoothstep(300., 30., vD);
  gl_FragColor = vec4(c*a, 1.); }`;

function shideGeometry() {
  // zig-zag paper streamer (4 folds), hanging down from y=0
  const s = new THREE.Shape();
  const w = 0.62, h = 0.85;
  s.moveTo(-w, 0);
  s.lineTo(w, 0);
  s.lineTo(w, -h);
  s.lineTo(-w * 0.2, -h);
  s.lineTo(-w * 0.2, -2 * h);
  s.lineTo(w * 1.2, -2 * h);
  s.lineTo(w * 1.2, -3 * h);
  s.lineTo(w * 0.2, -3 * h);
  s.lineTo(w * 0.2, -4 * h);
  s.lineTo(-w * 0.6, -4 * h);
  s.lineTo(-w * 0.6, -3.2 * h);
  s.lineTo(-w * 1.0 + 0.4, -3.2 * h);
  s.lineTo(-w * 1.0 + 0.4, -2.2 * h);
  s.lineTo(-w * 1.0, -2.2 * h);
  s.lineTo(-w * 1.0, -h * 1.2);
  s.lineTo(-w, -h * 1.2);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

export class Rope {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.scene = new THREE.Scene();
    this.cam = new THREE.PerspectiveCamera(55, 16 / 9, 0.1, 800);
    this.sky = new Sky();
    const mk = (col, glowCol, kind) =>
      new THREE.ShaderMaterial({
        vertexShader: STRAND_VERT, fragmentShader: STRAND_FRAG,
        uniforms: { uCol: { value: new THREE.Color(col) }, uGlowCol: { value: new THREE.Color(...glowCol) }, uCam: { value: new THREE.Vector3() }, uGlow: { value: 0 }, uTime: { value: 0 }, uPulseZ: { value: 0 }, uKind: { value: kind } },
      });
    this.mBass = mk('#2a0f0b', [1.6, 0.35, 0.15], 0);
    this.mKeys = mk('#b8892e', [1.6, 1.2, 0.6], 1);
    this.mStraw = mk('#8a7650', [0.9, 0.7, 0.4], 0);
    const tubes = [];
    for (let k = 0; k < 3; k++) {
      const geo = new THREE.TubeGeometry(new StrandCurve((k / 3) * TAU, 0.9, 0.62), 2600, 0.88, 12, false);
      const m = new THREE.Mesh(geo, k === 1 ? this.mKeys : k === 2 ? this.mStraw : this.mBass);
      m.frustumCulled = false;
      tubes.push(m);
      this.scene.add(m);
    }
    // shide hanging from the rope
    const base = shideGeometry();
    const N = 70;
    const offs = new Float32Array(N * 3), seeds = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const s = 8 + i * 5;
      const a = axis(s);
      offs.set([a.x, a.y - 1.6, a.z], i * 3);
      seeds[i] = (i * 0.618) % 1;
    }
    const ig = new THREE.InstancedBufferGeometry().copy(base);
    ig.instanceCount = N;
    ig.setAttribute('aOff', new THREE.InstancedBufferAttribute(offs, 3));
    ig.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
    this.shideMat = new THREE.ShaderMaterial({
      vertexShader: SHIDE_VERT, fragmentShader: SHIDE_FRAG, side: THREE.DoubleSide,
      uniforms: { uTime: { value: 0 }, uBeat: { value: 0 }, uCam: { value: new THREE.Vector3() }, uFlash: { value: 0 } },
    });
    const shide = new THREE.Mesh(ig, this.shideMat);
    shide.frustumCulled = false;
    this.scene.add(shide);
    // floating lanterns
    const R = rng(66);
    const NL = 420;
    const lp = new Float32Array(NL * 3), ls = new Float32Array(NL);
    for (let i = 0; i < NL; i++) {
      lp.set([(R() - 0.5) * 140, R() * 50 - 12, -R() * LEN], i * 3);
      ls[i] = R();
    }
    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.BufferAttribute(lp, 3));
    lg.setAttribute('aSeed', new THREE.BufferAttribute(ls, 1));
    this.lanMat = new THREE.ShaderMaterial({ vertexShader: LANTERN_VERT, fragmentShader: LANTERN_FRAG, uniforms: { uTime: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const lan = new THREE.Points(lg, this.lanMat);
    lan.frustumCulled = false;
    this.scene.add(lan);
    this.layer = new Layer2D(0);
  }

  render(t, rt) {
    const r = this.app.renderer;
    const [a, b] = SEC.inter;
    const u = clamp((t - a) / (b - a));
    // three movements: track alongside → from beneath, shide overhead → rush down the rope
    const s = 20 + u * 260 + ep(a + 7.5, b, t, ease.inCubic) * 60;
    const ax = axis(s);
    const camA = [ax.x + 15, ax.y - 1.5, ax.z + 4];
    const camB = [ax.x + 4, ax.y - 11, ax.z + 7];
    const camC = [ax.x + 5, ax.y + 3.5, ax.z + 9];
    const k1 = ep(a + 3.2, a + 4.6, t, ease.inOutCubic), k2 = ep(a + 7.3, a + 8.4, t, ease.inOutCubic);
    const P = camA.map((v, i) => lerp(lerp(v, camB[i], k1), camC[i], k2));
    this.cam.position.set(P[0] + Math.sin(t * 0.8) * 0.6, P[1] + Math.sin(t * 0.6) * 0.4, P[2]);
    const look = axis(s - lerp(9, 16, k2));
    this.cam.lookAt(look.x, look.y + lerp(0, 2.5, k1) * (1 - k2), look.z);
    this.cam.fov = lerp(50, 62, k2) - kickHit(t, 10) * 2;
    this.cam.updateProjectionMatrix();
    const kz = kickHit(t, 5);
    for (const m of [this.mBass, this.mKeys, this.mStraw]) {
      m.uniforms.uCam.value.copy(this.cam.position);
      m.uniforms.uTime.value = t;
    }
    this.mBass.uniforms.uGlow.value = Math.pow(bass(t), 4) * 1.4 + kz * 0.5;
    this.mBass.uniforms.uPulseZ.value = ax.z - 8 - (t % 0.7) * 60;
    this.mKeys.uniforms.uGlow.value = hats(t) * 0.6 + snareHit(t, 8) * 0.7;
    this.mKeys.uniforms.uPulseZ.value = ax.z - 20 + Math.sin(t * 3) * 10;
    this.shideMat.uniforms.uTime.value = t;
    this.shideMat.uniforms.uBeat.value = beatPulse(t, 1, 6);
    this.shideMat.uniforms.uCam.value.copy(this.cam.position);
    this.shideMat.uniforms.uFlash.value = snareHit(t, 10);
    this.lanMat.uniforms.uTime.value = t;
    this.sky.draw(r, rt, this.cam, {
      time: t, warp: 0, flash: snareHit(t, 14) * 0.2, dark: 0.45,
      pal: { top: [0.01, 0.01, 0.035], mid: [0.03, 0.02, 0.08], low: [0.09, 0.03, 0.08], rim: [0.6, 0.25, 0.15] },
    });
    r.setRenderTarget(rt);
    r.render(this.scene, this.cam);

    // type: section card + duet names
    const c = this.layer.begin();
    const fin = ep(a + 0.3, a + 1.2, t), fout = 1 - ep(b - 0.8, b, t);
    c.save();
    c.globalAlpha = fin * fout;
    c.fillStyle = '#f1e8da';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = font(F.mincho, 120);
    const gl = layoutV('間奏', 1700, 300, 120, 1.1);
    gl.forEach((g) => REVEAL.ink(c, g, ep(a + 0.3 + g.i * 0.2, a + 0.9 + g.i * 0.2, t), 120, true));
    caption(c, 'INTERLUDE  ·  BASS × KEYS', 1700, 640, 14, 'rgba(241,232,218,0.75)', 'center', 0.4);
    // two names joined by ×, pulsing with their instruments
    const pb = Math.pow(bass(t), 3), pk = hats(t);
    c.font = font(F.mincho, 54);
    c.fillStyle = '#ff6a45';
    c.globalAlpha = fin * fout * (0.6 + pb * 0.4);
    c.fillText('ナワ', 760, 960);
    c.fillStyle = '#ffd27a';
    c.globalAlpha = fin * fout * (0.6 + pk * 0.4);
    c.fillText('カネ', 1160, 960);
    c.globalAlpha = fin * fout;
    c.fillStyle = '#f1e8da';
    c.font = font(F.serif, 44);
    c.fillText('×', 960, 960);
    c.fillStyle = '#ff6a45';
    drawSym(c, EMBLEMS.rope, 760, 880, 34 + pb * 6);
    c.fillStyle = '#ffd27a';
    drawSym(c, EMBLEMS.bell, 1160, 880, 34 + pk * 6);
    c.restore();
    this.layer.draw(r, rt, {});
    return { hudInk: 'light', bloom: 1.1, bloomThresh: 0.85, grain: 0.06, vig: 0.75, ca: 0.003 + kz * 0.005, contrast: 1.05 };
  }
}
