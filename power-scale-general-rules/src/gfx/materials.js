// Materials: two backdrops (night sky, ivory paper), an engraving/hatching shader for 3D
// objects on paper, a stellar surface, glow billboards, soft particles and shock shells.
import * as THREE from 'three';
import { NOISE } from './glsl.js';

export const lin = (hex) => new THREE.Color(hex); // three converts sRGB hex to linear working space

// ---------------------------------------------------------------- backdrops
const BD_VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 1.0, 1.0); }`;
const COSMOS_FRAG = /* glsl */ `
uniform mat4 uInvProj; uniform mat4 uCamWorld; uniform float uTime; uniform float uStars; uniform float uNebula;
uniform vec3 uTint; uniform float uFade;
varying vec2 vUv;
${NOISE}
void main(){
  vec2 ndc = vUv * 2.0 - 1.0;
  vec4 v = uInvProj * vec4(ndc, 1.0, 1.0); v /= v.w;
  vec3 dir = normalize((uCamWorld * vec4(v.xyz, 0.0)).xyz);
  vec3 col = mix(vec3(0.0025, 0.0035, 0.008), vec3(0.008, 0.011, 0.022), smoothstep(-0.7, 0.9, dir.y + 0.2 * dir.x));
  float n = fbm3(dir * 1.8 + vec3(3.0, 1.0, uTime * 0.003));
  float n2 = fbm3(dir * 4.3 + vec3(7.1, 2.0, -uTime * 0.002));
  col += uNebula * (uTint * 0.05 * smoothstep(0.05, 0.85, n) * (0.6 + 0.6 * n2) + vec3(0.006, 0.014, 0.03) * smoothstep(-0.1, 0.8, n2));
  for (int L = 0; L < 3; L++) {
    float fl = float(L);
    float sc = 70.0 * pow(2.3, fl);
    vec3 p = dir * sc;
    vec3 id = floor(p);
    vec3 f = fract(p) - 0.5;
    float h = hash13(id + fl * 17.0);
    float thr = 0.9 - fl * 0.02;
    if (h > thr) {
      vec3 off = vec3(hash13(id + 1.0), hash13(id + 2.0), hash13(id + 3.0)) - 0.5;
      float d = length(f - off * 0.7);
      float b = (h - thr) / (1.0 - thr);
      float size = 0.07 / (1.0 + fl * 0.6);
      float tw = 0.75 + 0.25 * sin(uTime * (1.0 + 3.0 * hash13(id + 9.0)) + h * 40.0);
      vec3 sc2 = mix(vec3(1.0, 0.82, 0.66), vec3(0.72, 0.84, 1.0), hash13(id + 5.0));
      col += uStars * pow(b, 2.6) * 2.4 * tw * exp(-d * d / (size * size)) * sc2 / (1.0 + fl);
    }
  }
  gl_FragColor = vec4(col * uFade, 1.0);
}`;
const PAPER_FRAG = /* glsl */ `
uniform vec3 uPaper; uniform float uTime; uniform vec2 uRes; uniform float uFade; uniform float uGrid;
varying vec2 vUv;
${NOISE}
void main(){
  vec2 p = vUv * vec2(16.0, 9.0);
  float mott = fbm3(vec3(p * 0.35, 1.3));
  float mott2 = fbm3(vec3(p * 1.7, 4.2));
  // fibres: long thin streaks at a few orientations
  float fib = 0.0;
  for (int i = 0; i < 3; i++) {
    float a = 0.4 + float(i) * 1.13;
    vec2 q = mat2(cos(a), -sin(a), sin(a), cos(a)) * p;
    fib += smoothstep(0.55, 0.95, snoise(vec3(q.x * 0.6, q.y * 26.0, float(i) * 3.0))) * 0.33;
  }
  float grain = hash12(vUv * uRes) - 0.5;
  vec3 col = uPaper * (1.0 + mott * 0.045 + mott2 * 0.018 - fib * 0.03 + grain * 0.025);
  // faint lab-book grid
  if (uGrid > 0.0) {
    vec2 g = abs(fract(p * 2.0) - 0.5);
    float gl = 1.0 - smoothstep(0.0, 0.012 * 2.0, min(g.x, g.y) - 0.0);
    col = mix(col, col * vec3(0.86, 0.9, 0.95), gl * uGrid * 0.25);
  }
  // light falls from upper left
  float l = 1.0 - 0.08 * length(vUv - vec2(0.3, 0.75));
  col *= l;
  gl_FragColor = vec4(col * uFade, 1.0);
}`;

export function makeBackdrop(mode, opts = {}) {
  const uniforms =
    mode === 'paper'
      ? { uPaper: { value: lin(opts.paper || '#ECE5D6') }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1920, 1080) }, uFade: { value: 1 }, uGrid: { value: opts.grid || 0 } }
      : {
          uInvProj: { value: new THREE.Matrix4() },
          uCamWorld: { value: new THREE.Matrix4() },
          uTime: { value: 0 },
          uStars: { value: opts.stars == null ? 1 : opts.stars },
          uNebula: { value: opts.nebula == null ? 1 : opts.nebula },
          uTint: { value: lin(opts.tint || '#8a3a1c') },
          uFade: { value: 1 },
        };
  const m = new THREE.ShaderMaterial({ vertexShader: BD_VERT, fragmentShader: mode === 'paper' ? PAPER_FRAG : COSMOS_FRAG, uniforms, depthWrite: false, depthTest: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), m);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1000;
  return {
    mesh,
    u: uniforms,
    sync(cam, t, pw, ph) {
      uniforms.uTime.value = t;
      if (uniforms.uRes) uniforms.uRes.value.set(pw, ph);
      if (uniforms.uInvProj) {
        cam.updateMatrixWorld();
        uniforms.uInvProj.value.copy(cam.projectionMatrixInverse);
        uniforms.uCamWorld.value.copy(cam.matrixWorld);
      }
    },
  };
}

// ------------------------------------------------------------- engraving
// Copper-plate look: contour lines that follow the form (object-space bands along `uAxis`),
// screen-space cross hatching in the shadows, stipple in the darkest core and an ink rim.
export function hatchMaterial(o = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uInk: { value: lin(o.ink || '#1C1A1F') },
      uPaper: { value: lin(o.paper || '#ECE5D6') },
      uTint: { value: lin(o.tint || o.paper || '#ECE5D6') },
      uLight: { value: new THREE.Vector3(...(o.light || [-0.5, 0.75, 0.6])).normalize() },
      uFreq: { value: o.freq || 26 },
      uAxis: { value: new THREE.Vector3(...(o.axis || [0, 1, 0])).normalize() },
      uPx: { value: 1 },
      uAlpha: { value: 1 },
      uReveal: { value: 1 },
      uGlow: { value: lin(o.glow || '#000000') },
      uGlowAmt: { value: 0 },
      uTime: { value: 0 },
      uBase: { value: o.base || 0 },
    },
    transparent: !!o.transparent,
    side: o.side || THREE.FrontSide,
    extensions: { derivatives: true },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vW; varying vec3 vO;
      void main(){
        vO = position;
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz;
        vN = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uInk; uniform vec3 uPaper; uniform vec3 uTint; uniform vec3 uLight; uniform float uFreq; uniform vec3 uAxis;
      uniform float uPx; uniform float uAlpha; uniform float uReveal; uniform vec3 uGlow; uniform float uGlowAmt; uniform float uTime; uniform float uBase;
      varying vec3 vN; varying vec3 vW; varying vec3 vO;
      ${NOISE}
      float band(float x, float th){ float f = abs(fract(x) - 0.5); float w = fwidth(x) * 0.9; return 1.0 - smoothstep(0.5 * th - w, 0.5 * th + w, f); }
      void main(){
        vec3 N = normalize(vN);
        if (!gl_FrontFacing) N = -N;
        vec3 V = normalize(cameraPosition - vW);
        float dif = max(dot(N, uLight), 0.0);
        float shade = clamp(dif * 0.9 + 0.12 + 0.1 * N.y, 0.0, 1.0);
        float dark = 1.0 - shade;
        // contour bands following the form
        float c1 = band(dot(vO, uAxis) * uFreq + 0.15 * snoise(vO * 3.0), clamp(dark * 1.25 + uBase, 0.0, 0.85));
        // screen-space cross hatch
        vec2 sp = gl_FragCoord.xy / uPx;
        float c2 = band((sp.x + sp.y) / 7.0, clamp((dark - 0.45) * 1.6, 0.0, 0.7));
        float c3 = band((sp.x - sp.y) / 7.0, clamp((dark - 0.68) * 2.2, 0.0, 0.7));
        float st = step(hash12(floor(sp / 2.0)), (dark - 0.8) * 2.5);
        float rim = smoothstep(0.62, 0.92, 1.0 - abs(dot(N, V)));
        float cov = clamp(max(max(c1, c2), max(c3, st)) + rim, 0.0, 1.0);
        vec3 col = mix(uTint, uInk, cov);
        col += uGlow * uGlowAmt;
        // reveal: engraving bites in along the axis
        float rv = smoothstep(uReveal - 0.05, uReveal + 0.05, (dot(vO, uAxis) + 1.0) * 0.5 + 0.1 * snoise(vO * 4.0));
        if (rv > 0.5) discard;
        gl_FragColor = vec4(col, uAlpha);
      }`,
  });
}

// ------------------------------------------------------------------ star
export function starMaterial(o = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: lin(o.color || '#FFB45A') },
      uHot: { value: lin(o.hot || '#FFF1D2') },
      uI: { value: o.intensity || 6 },
      uTime: { value: 0 },
      uScale: { value: o.scale || 3 },
      uCrack: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vW; varying vec3 vO;
      void main(){ vO = position; vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform vec3 uHot; uniform float uI; uniform float uTime; uniform float uScale; uniform float uCrack;
      varying vec3 vN; varying vec3 vW; varying vec3 vO;
      ${NOISE}
      void main(){
        vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vW);
        float mu = clamp(dot(N, V), 0.0, 1.0);
        vec3 p = normalize(vO);
        float big = fbm3(p * uScale + vec3(0.0, uTime * 0.02, 0.0));
        float gran = snoise(p * uScale * 9.0 + vec3(uTime * 0.15));
        float spots = smoothstep(0.55, 0.75, fbm3(p * uScale * 0.7 + 11.0));
        float limb = 0.35 + 0.65 * pow(mu, 0.55);
        vec3 c = mix(uColor, uHot, clamp(0.45 + 0.6 * big + 0.15 * gran, 0.0, 1.0));
        c *= (1.0 - 0.55 * spots);
        // fissures of light when the star is about to break
        float cr = smoothstep(0.035, 0.0, abs(snoise(p * 4.0 + 3.0))) * uCrack;
        c += uHot * cr * 6.0;
        gl_FragColor = vec4(c * uI * limb, 1.0);
      }`,
  });
}

// --------------------------------------------------- billboarded glow quad
export function glowMaterial(o = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: lin(o.color || '#FFC27A') },
      uI: { value: o.intensity || 2 },
      uSize: { value: o.size || 1 },
      uRays: { value: o.rays || 0 },
      uTime: { value: 0 },
      uFall: { value: o.falloff || 2.2 },
    },
    transparent: true,
    depthWrite: false,
    depthTest: o.depthTest !== false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      uniform float uSize; varying vec2 vUv;
      void main(){
        vUv = uv * 2.0 - 1.0;
        vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        float s = length(vec3(modelMatrix[0].x, modelMatrix[0].y, modelMatrix[0].z));
        mv.xy += position.xy * uSize * s * 2.0;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uI; uniform float uRays; uniform float uTime; uniform float uFall;
      varying vec2 vUv;
      ${NOISE}
      void main(){
        float r = length(vUv);
        float g = exp(-r * r * 6.0 * uFall) + 0.18 * exp(-r * 3.2) ;
        float a = atan(vUv.y, vUv.x);
        float rays = pow(0.5 + 0.5 * snoise(vec3(cos(a) * 3.0, sin(a) * 3.0, uTime * 0.2)), 3.0) * exp(-r * 2.5) * uRays;
        float v = (g + rays) * smoothstep(1.0, 0.7, r);
        gl_FragColor = vec4(uColor * uI * v, 1.0);
      }`,
  });
}
export function glowQuad(o) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowMaterial(o));
  m.frustumCulled = false;
  m.renderOrder = o.order || 10;
  return m;
}

// ------------------------------------------------------- shock / energy shell
export function shellMaterial(o = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: lin(o.color || '#FFC56B') },
      uEdge: { value: lin(o.edge || '#FFE9C4') },
      uI: { value: o.intensity || 2 },
      uTime: { value: 0 },
      uFade: { value: 1 },
      uRings: { value: o.rings == null ? 1 : o.rings },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vW; varying vec3 vO;
      void main(){ vO = position; vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform vec3 uEdge; uniform float uI; uniform float uTime; uniform float uFade; uniform float uRings;
      varying vec3 vN; varying vec3 vW; varying vec3 vO;
      ${NOISE}
      void main(){
        vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vW);
        float f = 1.0 - abs(dot(N, V));
        float fres = pow(f, 2.6);
        vec3 p = normalize(vO);
        float n = fbm3(p * 5.0 + vec3(0.0, uTime * 0.3, 0.0));
        float rings = uRings * smoothstep(0.82, 1.0, sin((p.y + n * 0.08) * 60.0)) * 0.35;
        vec3 c = mix(uColor, uEdge, fres) * (fres * 1.4 + 0.06 + 0.12 * n + rings);
        gl_FragColor = vec4(c * uI * uFade, 1.0);
      }`,
  });
}

// --------------------------------------------------------------- particles
// Soft round dots. `body` is GLSL that sets `vec3 P` (world pos), `float S` (size px @1080p),
// `vec3 C` (linear colour * intensity) and `float A` (alpha) from attributes/uniforms.
export function dotsMaterial({ uniforms = {}, attrs = '', body, additive = true, soft = 1.0, paper = false }) {
  return new THREE.ShaderMaterial({
    uniforms: { uPx: { value: 1 }, uTime: { value: 0 }, ...uniforms },
    transparent: true,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    vertexShader: /* glsl */ `
      uniform float uPx; uniform float uTime;
      ${Object.keys(uniforms)
        .map((k) => `uniform ${glslType(uniforms[k].value)} ${k};`)
        .join('\n')}
      ${attrs}
      varying vec3 vC; varying float vA;
      ${NOISE}
      void main(){
        vec3 P = position; float S = 2.0; vec3 C = vec3(1.0); float A = 1.0;
        ${body}
        vec4 mv = viewMatrix * vec4(P, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = max(S * uPx * (projectionMatrix[1][1] / max(-mv.z, 0.001)) , 0.0);
        vC = C; vA = A;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vC; varying float vA;
      void main(){
        vec2 d = gl_PointCoord * 2.0 - 1.0;
        float r = dot(d, d);
        if (r > 1.0) discard;
        float a = ${paper ? 'smoothstep(1.0, 0.6, r)' : `exp(-r * ${(3.0 * soft).toFixed(2)})`};
        gl_FragColor = vec4(vC * a * vA, ${paper ? 'a * vA' : '1.0'});
      }`,
  });
}
function glslType(v) {
  if (typeof v === 'number') return 'float';
  if (v.isVector2) return 'vec2';
  if (v.isVector3 || v.isColor) return 'vec3';
  if (v.isVector4) return 'vec4';
  if (v.isMatrix4) return 'mat4';
  if (v.isTexture) return 'sampler2D';
  return 'float';
}

// plain emissive (HDR) colour, optionally additive
export function emissive(hex, I = 1, o = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { uC: { value: lin(hex) }, uI: { value: I }, uA: { value: 1 } },
    transparent: !!o.transparent || !!o.additive,
    depthWrite: !o.additive,
    blending: o.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    side: o.side || THREE.FrontSide,
    vertexShader: `void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 uC; uniform float uI; uniform float uA; void main(){ gl_FragColor = vec4(uC * uI * (${o.additive ? 'uA' : '1.0'}), uA); }`,
  });
}
