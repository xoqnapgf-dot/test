// Procedural rose window: polar tracery, lancet petals, quatrefoil ring, outer lancets,
// lead came, mottled glass with seeds (bubbles) and HDR transmission for bloom.
// A centre rondel shows a symbol from an atlas (crossfade between two indices).
import * as THREE from 'three';
import { NOISE } from './glsl.js';

const VERT = /* glsl */ `
varying vec2 vUv; varying vec3 vN; varying vec3 vView;
void main(){ vUv = uv; vec4 wp = modelMatrix*vec4(position,1.); vN = normalize(mat3(modelMatrix)*normal);
  vView = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix*viewMatrix*wp; }`;

const FRAG = /* glsl */ `
${NOISE}
uniform float uTime, uGlow, uFlash, uRot1, uRot2, uRot3, uKal, uSymA, uSymB, uSymMix, uSymN, uHue, uBeat, uOn;
uniform sampler2D tSym; uniform vec3 uTintA, uTintB;
varying vec2 vUv; varying vec3 vN; varying vec3 vView;
const float PI = 3.14159265;
vec3 glassPal(float h){
  h = fract(h);
  if(h < .26) return vec3(.86,.06,.10);   // ruby
  if(h < .50) return vec3(.06,.20,.85);   // cobalt
  if(h < .64) return vec3(1.0,.70,.18);   // gold
  if(h < .76) return vec3(.05,.55,.30);   // emerald
  if(h < .90) return vec3(.42,.12,.70);   // violet
  return vec3(.95,.88,.74);               // clear amber
}
// glass body for a cell: id seeds colour & mottling; q local coords
vec3 glass(float id, vec2 q, float bright){
  vec3 base = glassPal(hash12(vec2(id, 7.1)) + uHue);
  float m = fbm(q*6. + id*3.1);
  float streak = vnoise(vec2(q.x*30., q.y*2.) + id);
  float seed = smoothstep(.96, .99, hash12(floor(q*80.) + id)) ;
  vec3 c = base * (0.55 + 0.9*m) * (0.85 + 0.3*streak);
  c += seed * 0.6;
  // hot spot transmission (light behind the glass)
  return c * bright;
}
void main(){
  vec2 p = (vUv - .5) * 2.;
  float r = length(p);
  if(r > 1.0) discard;
  float a = atan(p.y, p.x);
  float lead = 1.0;           // 1 = glass, 0 = lead/stone
  vec3 col = vec3(0.);
  float stone = 0.;
  float bright = uGlow * (0.75 + 0.5*fbm(p*2.+uTime*.05)) + uFlash*2.5;
  float aa = 0.006;

  if(r < 0.205){
    // centre rondel: symbol on ruby/gold ground
    float id = 1.;
    vec2 q = p / 0.17;
    // rotate symbol slowly when kaleidoscoping
    q = rot(uRot2*0.5) * q;
    vec2 su = q*0.5 + .5;
    float sA = texture2D(tSym, vec2((uSymA + su.x)/uSymN, 1.-su.y)).a;
    float sB = texture2D(tSym, vec2((uSymB + su.x)/uSymN, 1.-su.y)).a;
    float s = mix(sA, sB, uSymMix) * step(abs(q.x),1.) * step(abs(q.y),1.);
    vec3 ground = mix(vec3(.75,.05,.08), vec3(.08,.12,.6), .3+.3*sin(uTime*.3)) ;
    col = mix(glass(id, p*2., bright)*0.7 + ground*bright*0.35, vec3(1.,.88,.62)*(0.9+bright*0.7), s);
    // ring of small cells around symbol
    lead *= smoothstep(0.0, aa, abs(r - 0.195) - 0.008);
  } else if(r < 0.575){
    // 12 lancet petals
    float N = 12.;
    float aa1 = a + uRot1;
    float sec = floor((aa1 + PI) / (2.*PI/N));
    float th = mod(aa1 + PI, 2.*PI/N) - PI/N;             // -pi/N .. pi/N
    if(uKal > 0.5) th = abs(th);                           // mirror fold
    float rr = (r - 0.22) / 0.34;                          // 0..1 along petal
    float hw = 0.115 * pow(max(sin(PI*clamp(rr*0.92,0.,1.)),0.), 0.55) * (1. - smoothstep(.8,1.,rr)*0.0);
    float x = th * r;                                      // arc-length across
    float f = abs(x) - hw*r*2.0;
    if(f < 0. && rr > 0. && rr < 1.){
      // inside petal: 2 panes split by mullion + horizontal saddle bars
      float pane = step(0., x);
      float bar = floor(rr*4.);
      float id = sec*10. + pane*3. + bar + 20.;
      col = glass(id, vec2(x, rr)*3., bright);
      lead *= smoothstep(0., aa, abs(x) - 0.004);
      lead *= smoothstep(0., aa, (0.5 - abs(fract(rr*4.)-.5))*0.085 - 0.003);
      lead *= smoothstep(0., aa, -f - 0.006);
    } else {
      // tracery between petals with a small trefoil hole
      vec2 tc = vec2((th - sign(th)*PI/N*0.0) * r, r - 0.47);
      float tre = length(vec2(abs(th)-PI/N, 0.)*r*1.0 + vec2(0., r-0.5));
      float hole = smoothstep(0.028, 0.024, length(vec2((abs(th)-PI/N)*r, r - 0.505)));
      if(hole > 0.){
        col = glass(sec + 200., p*3., bright*0.9);
        lead = hole;
      } else { lead = 0.; stone = 1.; }
    }
  } else if(r < 0.64){
    // band of quatrefoil roundels
    float N = 24.;
    float aa2 = a - uRot2;
    float th = mod(aa2 + PI, 2.*PI/N) - PI/N;
    float sec = floor((aa2 + PI)/(2.*PI/N));
    vec2 q = vec2(th * r, r - 0.6075);
    float d = length(q);
    // quatrefoil = min of 4 offset circles
    float qf = min(min(length(q-vec2(.012,0.)), length(q+vec2(.012,0.))), min(length(q-vec2(0.,.012)), length(q+vec2(0.,.012))));
    if(qf < 0.017){
      col = glass(sec + 400., q*40., bright);
      lead = smoothstep(0., aa, 0.017 - qf - 0.003);
    } else { lead = 0.; stone = 1.; }
  } else if(r < 0.925){
    // 24 outer lancets with trefoil heads
    float N = 24.;
    float aa3 = a + uRot3;
    float sec = floor((aa3 + PI)/(2.*PI/N));
    float th = mod(aa3 + PI, 2.*PI/N) - PI/N;
    if(uKal > 0.5) th = abs(th);
    float rr = (r - 0.655)/0.255;
    float hw = 0.118 * pow(max(sin(PI*clamp(rr*0.9+0.05,0.,1.)),0.), 0.4);
    float x = th * r;
    float f = abs(x) - hw * r * 1.25;
    if(f < 0. && rr > 0. && rr < 1.){
      float bar = floor(rr*3.);
      float id = sec*5. + bar + 600.;
      col = glass(id, vec2(x, rr)*4., bright);
      lead *= smoothstep(0., aa, (0.5 - abs(fract(rr*3.)-.5))*0.085 - 0.003);
      lead *= smoothstep(0., aa, -f - 0.005);
      lead *= smoothstep(0., aa, abs(x) - 0.0035);
    } else { lead = 0.; stone = 1.; }
  } else {
    lead = 0.; stone = 1.;
  }
  // stone tracery: dark carved stone, rim-lit, mouldings
  vec3 stoneCol = vec3(.055,.05,.06) * (0.7 + 0.6*fbm(p*20.));
  float mould = smoothstep(.0, .01, abs(r-.95)-.012) ;
  stoneCol *= 0.6 + 0.4*mould;
  stoneCol += vec3(1.,.75,.4) * uFlash * 0.25;
  // gold edge line on outer ring and tracery rims
  float rim = exp(-abs(r - .925)*260.) + exp(-abs(r - .64)*300.)*.6 + exp(-abs(r - .575)*300.)*.6;
  vec3 c = mix(stoneCol, col, lead);
  c += vec3(1.,.72,.35) * rim * (0.35 + uBeat*0.8) * uGlow;
  // global tint (variant grading)
  c *= mix(uTintA, uTintB, smoothstep(-0.4, 0.4, p.y));
  c *= uOn;
  gl_FragColor = vec4(c, 1.);
}`;

export function makeRoseMaterial(symTex, nSym) {
  return new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTime: { value: 0 }, uGlow: { value: 1.2 }, uFlash: { value: 0 }, uRot1: { value: 0 }, uRot2: { value: 0 }, uRot3: { value: 0 },
      uKal: { value: 0 }, uSymA: { value: 0 }, uSymB: { value: 0 }, uSymMix: { value: 0 }, uSymN: { value: nSym }, uHue: { value: 0 },
      uBeat: { value: 0 }, uOn: { value: 1 }, tSym: { value: symTex },
      uTintA: { value: new THREE.Color(1, 1, 1) }, uTintB: { value: new THREE.Color(1, 1, 1) },
    },
    side: THREE.DoubleSide,
  });
}
