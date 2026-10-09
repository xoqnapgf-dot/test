// Celestial bodies. One shader handles textured planets (with night lights, clouds, a
// "runaway greenhouse" heat term), procedural stars, white dwarfs and neutron stars, and the
// layered interior shown on fracture faces (crust → mantle → outer core → inner core).
import * as THREE from 'three';
import { NOISE } from './glsl.js';

const VERT = /* glsl */ `
attribute vec3 aP0; attribute float aInner;
varying vec3 vP0; varying vec3 vN; varying vec3 vW; varying float vInner;
void main(){
  vP0 = aP0; vInner = aInner;
  vec4 w = modelMatrix * vec4(position, 1.);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const FRAG = /* glsl */ `
${NOISE}
uniform sampler2D tMap, tNight, tClouds;
uniform float uKind, uTime, uSpin, uHeat, uSteam, uCloudSpin, uGlow, uAlpha, uCore;
uniform vec3 uSun, uCam, uTint;
varying vec3 vP0; varying vec3 vN; varying vec3 vW; varying float vInner;
const float PI = 3.14159265;
vec2 sphUV(vec3 d, float spin){
  float lon = atan(d.z, d.x) + spin;
  float lat = asin(clamp(d.y, -1., 1.));
  return vec2(fract(0.5 - lon/(2.*PI)), 0.5 + lat/PI);
}
vec3 bb(float t){
  vec3 c = vec3(1.0, 0.12, 0.01) * smoothstep(0.0, 0.35, t);
  c = mix(c, vec3(1.0, 0.45, 0.06), smoothstep(0.3, 0.7, t));
  c = mix(c, vec3(1.0, 0.85, 0.55), smoothstep(0.7, 1.1, t));
  return c * (0.6 + 6.0*t*t);
}
void main(){
  vec3 d = normalize(vP0);
  float rr = length(vP0);
  vec3 n = normalize(vN);
  vec3 v = normalize(uCam - vW);
  float ndl = dot(n, normalize(uSun));
  vec3 col;
  if(vInner > 0.5){
    // interior layers by radius (normalised to the body radius = 1)
    vec3 crust = vec3(0.32,0.26,0.22), mantle = vec3(0.55,0.2,0.08), outer = vec3(1.0,0.45,0.1), inner = vec3(1.0,0.85,0.5);
    col = rr > 0.92 ? crust : rr > 0.55 ? mix(mantle*1.4, mantle, (rr-0.55)/0.37) : rr > 0.2 ? outer : inner;
    col *= 0.6 + 0.4*fbm(vP0.xy*14. + vP0.z*3.);
    float glow = rr < 0.92 ? (1. - rr) * 2.2 * uCore : 0.;
    col = col * (0.15 + 0.85*max(ndl,0.)) + col * glow;
    gl_FragColor = vec4(col*uAlpha, uAlpha);
    return;
  }
  if(uKind < 3.5){
    vec2 uv = sphUV(d, uSpin);
    vec3 alb = texture2D(tMap, uv).rgb;
    float day = smoothstep(-0.12, 0.25, ndl);
    float lit = max(ndl, 0.);
    if(uKind < 0.5){
      // Earth: oceans glint, night lights, clouds, atmosphere rim
      float ocean = smoothstep(0.12, 0.04, abs(alb.b - alb.g*0.9) ) * step(alb.r, alb.b);
      float cl = texture2D(tClouds, sphUV(d, uSpin + uCloudSpin)).r;
      cl = clamp(cl + uSteam * (0.55 + 0.45*fbm(uv*vec2(20.,10.) + uTime*0.05)), 0., 1.);
      vec3 base = mix(alb, vec3(1.0), cl*0.9);
      col = base * lit * 1.6;
      vec3 h = normalize(normalize(uSun) + v);
      col += vec3(1.,0.95,0.85) * pow(max(dot(n,h),0.), 60.) * ocean * (1.-cl) * 0.9 * lit;
      col += texture2D(tNight, uv).rgb * (1. - day) * (1.-cl) * 1.6 * (1. - uHeat);
      // runaway greenhouse: crust glows through, oceans gone
      if(uHeat > 0.001){
        float m = fbm(uv*vec2(24.,12.) + uTime*0.03);
        float h2 = uHeat * (0.6 + 0.6*m);
        col = mix(col, col*vec3(0.5,0.35,0.3), uHeat*0.8);
        col += bb(clamp(h2,0.,1.2)) * smoothstep(0.35, 0.9, h2) * 0.6 * (1.-cl*0.7);
      }
    } else {
      col = alb * lit * 1.7;
    }
    col += alb * 0.012;
    // atmosphere-ish rim
    float fr = pow(1. - max(dot(n, v), 0.), 3.);
    vec3 atm = uKind < 0.5 ? mix(vec3(0.3,0.55,1.0), vec3(1.0,0.5,0.25), uHeat) : uKind < 1.5 ? vec3(0.9,0.55,0.35) : vec3(0.9,0.8,0.6);
    col += atm * fr * smoothstep(-0.25, 0.4, ndl) * (uKind < 0.5 ? 1.4 : 0.5);
  } else if(uKind < 4.5){
    // the Sun: granulation + limb darkening
    float mu = max(dot(n, v), 0.);
    float gran = fbm(d.xy*40. + d.z*13. + uTime*0.05) * 0.6 + fbm(d.yz*90. - uTime*0.08)*0.4;
    float spots = smoothstep(0.78, 0.82, fbm(d.xz*6. + 3.)) * 0.6;
    col = vec3(1.0, 0.62, 0.22) * (0.55 + 0.6*gran) * (0.35 + 0.65*pow(mu, 0.5)) * (1. - spots) * 3.2;
  } else if(uKind < 5.5){
    // white dwarf: tiny, blue-white, almost featureless
    float mu = max(dot(n, v), 0.);
    col = vec3(0.75, 0.85, 1.0) * (0.6 + 0.4*pow(mu, 0.4)) * 4.0;
  } else {
    // neutron star: hot surface with magnetic hotspots
    float mu = max(dot(n, v), 0.);
    float spot = pow(max(abs(dot(d, normalize(vec3(0.3, 1., 0.2)))), 0.), 30.);
    col = vec3(0.6, 0.75, 1.0) * (0.5 + 0.5*mu) * 3. + vec3(1.,1.,1.) * spot * 8.;
  }
  col *= uTint;
  gl_FragColor = vec4(col * uAlpha, uAlpha);
}`;

const ATM_FRAG = /* glsl */ `
uniform vec3 uSun, uCam, uCol; uniform float uK;
varying vec3 vP0; varying vec3 vN; varying vec3 vW; varying float vInner;
void main(){
  vec3 n = normalize(vN); vec3 v = normalize(uCam - vW);
  float fr = pow(1. - max(dot(n, v), 0.), 2.5);
  float lit = smoothstep(-0.35, 0.5, dot(n, normalize(uSun)));
  gl_FragColor = vec4(uCol * fr * lit * uK, 1.);
}`;

const loader = new THREE.TextureLoader();
const texCache = {};
export function tex(key) {
  if (texCache[key]) return texCache[key];
  const src = (window.EXPLAINER_TEX || {})[key];
  const t = src ? loader.load(src) : new THREE.Texture();
  t.colorSpace = key === 'clouds' ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.wrapS = THREE.RepeatWrapping;
  texCache[key] = t;
  return t;
}

export const KIND = { earth: 0, mars: 1, jupiter: 2, moon: 3, sun: 4, wd: 5, ns: 6 };

export function planetMaterial(kind, opts = {}) {
  const mapKey = { 0: 'earth', 1: 'mars', 2: 'jupiter', 3: 'moon' }[kind];
  return new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      tMap: { value: mapKey ? tex(mapKey) : null }, tNight: { value: tex('earthNight') }, tClouds: { value: tex('clouds') },
      uKind: { value: kind }, uTime: { value: 0 }, uSpin: { value: 0 }, uHeat: { value: 0 }, uSteam: { value: 0 },
      uCloudSpin: { value: 0 }, uGlow: { value: 0 }, uAlpha: { value: 1 }, uCore: { value: 1 },
      uSun: { value: new THREE.Vector3(-1, 0.3, 0.6) }, uCam: { value: new THREE.Vector3() }, uTint: { value: new THREE.Color(1, 1, 1) },
    },
    transparent: !!opts.transparent,
    side: opts.side ?? THREE.FrontSide,
  });
}

export function atmosphereMaterial(col = [0.35, 0.6, 1.2]) {
  return new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: ATM_FRAG,
    uniforms: { uSun: { value: new THREE.Vector3(-1, 0.3, 0.6) }, uCam: { value: new THREE.Vector3() }, uCol: { value: new THREE.Vector3(...col) }, uK: { value: 1 } },
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide,
  });
}

export function sphereGeometry(r = 1, seg = 96) {
  const g = new THREE.SphereGeometry(r, seg, seg / 2).toNonIndexed();
  const pos = g.attributes.position;
  g.setAttribute('aP0', new THREE.Float32BufferAttribute(pos.array.slice(), 3));
  g.setAttribute('aInner', new THREE.Float32BufferAttribute(new Float32Array(pos.count), 1));
  return g;
}

// soft additive glow sprite (corona / bloom halo) as a camera-facing quad
const GLOW_FRAG = /* glsl */ `
uniform vec3 uCol; uniform float uK, uPow; varying vec2 vUv;
void main(){ float r = length(vUv - .5)*2.; float a = pow(max(1. - r, 0.), uPow) * uK; gl_FragColor = vec4(uCol*a, 1.); }`;
export function glowSprite(col, k = 1, pow = 2.5) {
  const m = new THREE.ShaderMaterial({
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(0.,0.,0.,1.); vec2 s = vec2(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz)); mv.xy += position.xy * s; gl_Position = projectionMatrix * mv; }',
    fragmentShader: GLOW_FRAG,
    uniforms: { uCol: { value: new THREE.Vector3(...col) }, uK: { value: k }, uPow: { value: pow } },
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), m);
  mesh.frustumCulled = false;
  return mesh;
}
