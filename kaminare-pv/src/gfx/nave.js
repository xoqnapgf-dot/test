// The "thunder nave": gothic pointed arches alternating with vermilion torii down a long
// axis, a polished stage floor, candle rows and drifting gold leaf. Custom shaders give
// fog, lightning illumination and light pulses that run down the nave on every kick.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { NOISE } from './glsl.js';
import { rng } from '../core/util.js';

export const NAVE = { spacing: 9, count: 30, z0: -4, archA: 7.2, archH: 15, roseZ: -290, roseY: 30, roseR: 22 };

const COMMON_VERT = /* glsl */ `
varying vec3 vW; varying vec3 vN; varying vec2 vUv;
void main(){
  mat4 im = mat4(1.);
  #ifdef USE_INSTANCING
  im = instanceMatrix;
  #endif
  vec4 wp = modelMatrix * im * vec4(position,1.);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix*im)*normal); vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;
const LIGHTING = /* glsl */ `
uniform vec3 uFog; uniform float uFogD, uFlash, uPulseZ, uPulse, uGlowZ; uniform vec3 uFlashDir, uFlashCol, uWin;
uniform vec3 uCam;
float fogF(vec3 w){ float d = length(w - uCam); return 1. - exp(-pow(d*uFogD, 1.4)); }
vec3 light(vec3 base, vec3 w, vec3 n, float rimAmt, vec3 rimCol){
  vec3 V = normalize(uCam - w);
  float ndl = max(dot(n, normalize(uFlashDir)), 0.);
  vec3 c = base * (0.10 + 0.9*ndl*uFlash) * mix(vec3(1.), uFlashCol, uFlash*.6);
  // rose window light from far end
  float wl = max(dot(n, vec3(0.,0.,-1.)), 0.) ;
  c += base * uWin * (0.35 + 0.65*wl) * 0.5;
  // travelling pulse ring down the nave
  float pz = exp(-abs(w.z - uPulseZ)*0.35) * uPulse;
  float fr = pow(1. - max(dot(n, V), 0.), 3.);
  c += rimCol * (fr*rimAmt + pz*0.9);
  return c;
}`;

const STONE_FRAG = /* glsl */ `
${NOISE}
${LIGHTING}
uniform vec3 uBase, uRim; uniform float uRimAmt;
varying vec3 vW; varying vec3 vN; varying vec2 vUv;
void main(){
  vec3 n = normalize(vN);
  float tex = 0.75 + 0.5*fbm(vW.xy*0.6 + vW.z*0.13);
  vec3 c = light(uBase*tex, vW, n, uRimAmt, uRim);
  c = mix(c, uFog, fogF(vW));
  gl_FragColor = vec4(c, 1.);
}`;
const LINE_FRAG = /* glsl */ `
${LIGHTING}
uniform vec3 uCol; uniform float uA;
varying vec3 vW; varying vec3 vN; varying vec2 vUv;
void main(){
  float pz = exp(-abs(vW.z - uPulseZ)*0.25) * uPulse;
  vec3 c = uCol * (uA + pz*2.5 + uFlash*0.8);
  c = mix(c, uFog, fogF(vW));
  gl_FragColor = vec4(c, 1.);
}`;
const FLOOR_FRAG = /* glsl */ `
${NOISE}
${LIGHTING}
uniform vec3 uRim; uniform float uGrid;
varying vec3 vW; varying vec3 vN; varying vec2 vUv;
void main(){
  vec2 p = vW.xz;
  float stone = 0.6 + 0.4*fbm(p*0.35);
  vec3 c = vec3(.025,.022,.028) * stone;
  // reflection streak of rose window & candles (fake glossy)
  float streak = exp(-abs(p.x)*0.22) * smoothstep(40., -300., p.y) ;
  c += uWin * streak * 0.6 * (0.7+0.3*vnoise(vec2(p.x*3., p.y*0.15)));
  // inlaid gold lines (stage grid)
  vec2 g = abs(fract(p/vec2(4.5, 9.) + .5) - .5) * vec2(4.5, 9.);
  float gl = exp(-g.x*14.) * step(abs(p.x), 14.) + exp(-g.y*14.)*0.5;
  c += uRim * gl * uGrid;
  float pz = exp(-abs(vW.z - uPulseZ)*0.3) * uPulse;
  c += uRim * pz * 0.25 * exp(-abs(p.x)*0.1);
  c += uFlashCol * uFlash * 0.08;
  c = mix(c, uFog, fogF(vW));
  gl_FragColor = vec4(c, 1.);
}`;
const POINTS_VERT = /* glsl */ `
attribute float aSeed; attribute float aKind;
uniform float uTime, uSize, uPulseZ, uPulse; uniform vec3 uCam;
varying float vSeed; varying float vKind; varying float vFade; varying float vPz;
void main(){
  vec3 p = position;
  vSeed = aSeed; vKind = aKind;
  if(aKind > 0.5){
    // drifting gold leaf: slow fall & sway, wraps
    p.y = mod(p.y - uTime*(0.4+aSeed*0.6), 30.) ;
    p.x += sin(uTime*0.7 + aSeed*40.)*1.2;
    p.z += cos(uTime*0.5 + aSeed*20.)*1.2;
  }
  vec4 mv = viewMatrix * modelMatrix * vec4(p,1.);
  float d = -mv.z;
  vFade = smoothstep(260., 40., d) * smoothstep(0.5, 3., d);
  vPz = exp(-abs(p.z - uPulseZ)*0.3) * uPulse;
  gl_PointSize = uSize * (aKind > 0.5 ? 0.16 : 0.6) * (0.6 + aSeed*0.8) * 300. / d;
  gl_Position = projectionMatrix * mv;
}`;
const POINTS_FRAG = /* glsl */ `
uniform float uTime; uniform vec3 uCandle, uLeaf;
varying float vSeed; varying float vKind; varying float vFade; varying float vPz;
void main(){
  vec2 q = gl_PointCoord - .5;
  float r = length(q);
  vec3 c;
  float a;
  if(vKind > 0.5){
    // gold leaf flake: thin glinting quad
    float ang = uTime*2. + vSeed*30.;
    vec2 qq = mat2(cos(ang),-sin(ang),sin(ang),cos(ang))*q;
    a = step(abs(qq.x), .32) * step(abs(qq.y), .12+0.1*sin(ang*1.3));
    float glint = pow(max(sin(ang*1.7+vSeed*9.),0.), 8.);
    c = uLeaf * (0.5 + 2.5*glint);
  } else {
    float fl = 0.75 + 0.25*sin(uTime*13. + vSeed*80.) * sin(uTime*7.3 + vSeed*31.);
    a = exp(-r*r*28.) ;
    c = uCandle * fl * (1.2 + vPz*2.);
    a += exp(-r*r*180.)*0.6;
  }
  if(a < 0.01) discard;
  gl_FragColor = vec4(c * a * vFade, 1.);
}`;

function archShape(a, H, R, th) {
  // pointed (drop) arch: legs at ±a up to spring height H, arcs of radius R (centres at ±(R-a))
  const s = new THREE.Shape();
  const outerR = R + th, oa = a + th;
  const cxL = R - a; // centre for the left-hand curve
  const apexAng = (r, cx) => Math.acos(cx / r); // angle where x=0 for circle centred at cx
  s.moveTo(-oa, 0);
  s.lineTo(-oa, H);
  s.absarc(cxL, H, outerR, Math.PI, apexAng(outerR, cxL), true);
  s.absarc(-cxL, H, outerR, Math.PI - apexAng(outerR, cxL), 0, true);
  s.lineTo(oa, 0);
  s.lineTo(-oa, 0);
  const h = new THREE.Path();
  h.moveTo(-a, 0);
  h.lineTo(-a, H);
  h.absarc(cxL, H, R, Math.PI, apexAng(R, cxL), true);
  h.absarc(-cxL, H, R, Math.PI - apexAng(R, cxL), 0, true);
  h.lineTo(a, 0);
  h.lineTo(-a, 0);
  s.holes.push(h);
  return s;
}

function toriiGeometry() {
  const parts = [];
  const pil = new THREE.CylinderGeometry(0.42, 0.5, 11.5, 14);
  for (const x of [-4.6, 4.6]) {
    const g = pil.clone();
    g.rotateZ(x > 0 ? -0.03 : 0.03);
    g.translate(x, 5.75, 0);
    parts.push(g);
  }
  // kasagi: curved top beam (extruded side profile)
  const k = new THREE.Shape();
  k.moveTo(-7.4, 12.2);
  k.quadraticCurveTo(0, 11.2, 7.4, 12.2);
  k.lineTo(7.1, 11.5);
  k.quadraticCurveTo(0, 10.7, -7.1, 11.5);
  k.closePath();
  const kg = new THREE.ExtrudeGeometry(k, { depth: 1.3, bevelEnabled: false, curveSegments: 24 });
  kg.translate(0, 0, -0.65);
  parts.push(kg);
  const sh = new THREE.BoxGeometry(12.2, 0.6, 0.9);
  sh.translate(0, 10.6, 0);
  parts.push(sh);
  const nuki = new THREE.BoxGeometry(12.6, 0.55, 0.6);
  nuki.translate(0, 8.4, 0);
  parts.push(nuki);
  const gak = new THREE.BoxGeometry(0.8, 2.0, 0.5);
  gak.translate(0, 9.5, 0);
  parts.push(gak);
  return mergeGeometries(parts.map((g) => (g.index ? g.toNonIndexed() : g)));
}

export function buildNave(params = {}) {
  const P = { ...NAVE, ...params };
  const group = new THREE.Group();
  const shared = {
    uFog: { value: new THREE.Color(0.03, 0.02, 0.05) }, uFogD: { value: 0.006 }, uFlash: { value: 0 },
    uFlashDir: { value: new THREE.Vector3(0.3, 1, 0.2) }, uFlashCol: { value: new THREE.Color(0.75, 0.82, 1.0) },
    uPulseZ: { value: -1000 }, uPulse: { value: 0 }, uCam: { value: new THREE.Vector3() }, uGlowZ: { value: 0 },
    uWin: { value: new THREE.Color(0.25, 0.12, 0.2) },
  };
  const stoneMat = new THREE.ShaderMaterial({
    vertexShader: COMMON_VERT, fragmentShader: STONE_FRAG,
    uniforms: { ...shared, uBase: { value: new THREE.Color(0.16, 0.15, 0.17) }, uRim: { value: new THREE.Color(1.0, 0.7, 0.35) }, uRimAmt: { value: 0.4 } },
  });
  const shuMat = new THREE.ShaderMaterial({
    vertexShader: COMMON_VERT, fragmentShader: STONE_FRAG,
    uniforms: { ...shared, uBase: { value: new THREE.Color(0.9, 0.16, 0.08) }, uRim: { value: new THREE.Color(1.0, 0.45, 0.2) }, uRimAmt: { value: 0.6 } },
  });
  const lineMat = new THREE.ShaderMaterial({
    vertexShader: COMMON_VERT, fragmentShader: LINE_FRAG,
    uniforms: { ...shared, uCol: { value: new THREE.Color(1.0, 0.72, 0.36) }, uA: { value: 0.55 } },
  });
  const floorMat = new THREE.ShaderMaterial({
    vertexShader: COMMON_VERT, fragmentShader: FLOOR_FRAG,
    uniforms: { ...shared, uRim: { value: new THREE.Color(1.0, 0.7, 0.35) }, uGrid: { value: 0.5 } },
  });

  // arches (instanced) + edge lines (merged)
  const archGeo = new THREE.ExtrudeGeometry(archShape(P.archA, P.archH, P.archA * 1.32, 1.3), {
    depth: 1.8, bevelEnabled: true, bevelThickness: 0.15, bevelSize: 0.12, bevelSegments: 1, curveSegments: 28,
  });
  archGeo.translate(0, 0, -0.9);
  const nA = P.count;
  const arches = new THREE.InstancedMesh(archGeo, stoneMat, nA);
  const torii = new THREE.InstancedMesh(toriiGeometry(), shuMat, nA);
  const m = new THREE.Matrix4();
  const edgeBase = new THREE.EdgesGeometry(archGeo, 25);
  const edges = [];
  for (let i = 0; i < nA; i++) {
    const z = P.z0 - i * P.spacing * 2;
    m.makeTranslation(0, 0, z);
    arches.setMatrixAt(i, m);
    const e = edgeBase.clone();
    e.translate(0, 0, z);
    edges.push(e);
    m.makeTranslation(0, 0, z - P.spacing);
    torii.setMatrixAt(i, m);
  }
  arches.frustumCulled = false;
  torii.frustumCulled = false;
  const lines = new THREE.LineSegments(mergeGeometries(edges), lineMat);
  lines.frustumCulled = false;
  group.add(arches, torii, lines);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(240, 700), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, -300);
  group.add(floor);

  // candles along both sides + gold leaf flakes
  const rnd = rng(1234);
  const N1 = 260, N2 = 340;
  const pos = new Float32Array((N1 + N2) * 3);
  const seed = new Float32Array(N1 + N2);
  const kind = new Float32Array(N1 + N2);
  let k = 0;
  for (let i = 0; i < N1; i++, k++) {
    const side = i % 2 ? 1 : -1;
    const row = Math.floor(i / 2);
    pos.set([side * (9.5 + (row % 3) * 1.4 + rnd() * 0.4), 0.6 + (row % 4) * 0.45, -row * 2.3 - 2], k * 3);
    seed[k] = rnd();
    kind[k] = 0;
  }
  for (let i = 0; i < N2; i++, k++) {
    pos.set([(rnd() - 0.5) * 34, rnd() * 30, -rnd() * 300], k * 3);
    seed[k] = rnd();
    kind[k] = 1;
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pg.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  pg.setAttribute('aKind', new THREE.BufferAttribute(kind, 1));
  const pMat = new THREE.ShaderMaterial({
    vertexShader: POINTS_VERT, fragmentShader: POINTS_FRAG,
    uniforms: {
      uTime: { value: 0 }, uSize: { value: 3.2 }, uPulseZ: shared.uPulseZ, uPulse: shared.uPulse, uCam: shared.uCam,
      uCandle: { value: new THREE.Color(1.6, 0.85, 0.35) }, uLeaf: { value: new THREE.Color(1.0, 0.75, 0.3) },
    },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(pg, pMat);
  points.frustumCulled = false;
  group.add(points);

  return { group, shared, stoneMat, shuMat, lineMat, floorMat, pMat, P };
}
