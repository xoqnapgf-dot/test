/* GLSL chunk: math, hashing, noise, colour, tone mapping.
   Everything here is written for GLSL ES 3.00 (WebGL2) and is used by both the
   scene shader and the texture-generation passes. */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});
  var GLSL = (SS.GLSL = SS.GLSL || {});

  GLSL.common = `
#define PI 3.141592653589793
#define TAU 6.283185307179586
#define INV_PI 0.3183098861837907
#define DEG (PI/180.0)

float saturate(float x){ return clamp(x, 0.0, 1.0); }
vec2  saturate(vec2 x){ return clamp(x, 0.0, 1.0); }
vec3  saturate(vec3 x){ return clamp(x, 0.0, 1.0); }
float sqr(float x){ return x*x; }
float pow4(float x){ return (x*x)*(x*x); }
float pow5(float x){ float x2 = x*x; return x2*x2*x; }
float maxc(vec3 c){ return max(c.r, max(c.g, c.b)); }
float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
float remap(float v, float a, float b, float c, float d){ return c + (d-c) * saturate((v-a)/(b-a)); }
float remapC(float v, float a, float b, float c, float d){ return c + (d-c) * ((v-a)/(b-a)); }
mat2 rot2(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

// ---------------------------------------------------------------- hashing
uint pcg1(uint v){
  uint s = v * 747796405u + 2891336453u;
  uint w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u;
  return (w >> 22u) ^ w;
}
uint pcg2(uint x, uint y){ return pcg1(x ^ (pcg1(y) * 1664525u + 1013904223u)); }
uint pcg3(uint x, uint y, uint z){ return pcg2(pcg1(x ^ (z * 747796405u)) , y ^ (z * 2891336453u)); }

float u2f(uint u){ return float(u) * (1.0 / 4294967296.0); }
float hash11(float p){ return u2f(pcg1(uint(int(p) + 0x9E3779B9))); }
float hash12(vec2 p){ return u2f(pcg2(uint(int(p.x)), uint(int(p.y)))); }
float hash13(vec3 p){ return u2f(pcg3(uint(int(p.x)), uint(int(p.y)), uint(int(p.z)))); }
vec2  hash22(vec2 p){ uint h = pcg2(uint(int(p.x)), uint(int(p.y))); return vec2(u2f(h), u2f(pcg1(h))); }
vec3  hash32(vec2 p){ uint h = pcg2(uint(int(p.x)), uint(int(p.y))); return vec3(u2f(h), u2f(pcg1(h)), u2f(pcg1(pcg1(h)))); }

// IQ-style fract-hash kept for the cheap dithers where exactness does not matter.
float fracthash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

// ---------------------------------------------------------------- value noise (periodic lattice)
// period: lattice repeats every <period> cells, which lets the noise be stored in a
// 64^3 grid and wrapped without seams.
float vnoise2(vec2 x, float period){
  vec2 i = floor(x), f = fract(x);
  vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);
  float p = period;
  vec4 h = vec4(hash12(mod(i + vec2(0.0,0.0), p)), hash12(mod(i + vec2(1.0,0.0), p)),
                hash12(mod(i + vec2(0.0,1.0), p)), hash12(mod(i + vec2(1.0,1.0), p)));
  return mix(mix(h.x, h.y, u.x), mix(h.z, h.w, u.x), u.y);
}
float vnoise3(vec3 x, float period){
  vec3 i = floor(x), f = fract(x);
  vec3 u = f*f*f*(f*(f*6.0-15.0)+10.0);
  float p = period;
  float n000 = hash13(mod(i + vec3(0.0,0.0,0.0), p));
  float n100 = hash13(mod(i + vec3(1.0,0.0,0.0), p));
  float n010 = hash13(mod(i + vec3(0.0,1.0,0.0), p));
  float n110 = hash13(mod(i + vec3(1.0,1.0,0.0), p));
  float n001 = hash13(mod(i + vec3(0.0,0.0,1.0), p));
  float n101 = hash13(mod(i + vec3(1.0,0.0,1.0), p));
  float n011 = hash13(mod(i + vec3(0.0,1.0,1.0), p));
  float n111 = hash13(mod(i + vec3(1.0,1.0,1.0), p));
  return mix(mix(mix(n000,n100,u.x), mix(n010,n110,u.x), u.y),
             mix(mix(n001,n101,u.x), mix(n011,n111,u.x), u.y), u.z);
}
// Gradient (Perlin-style) noise — smoother crests for terrain and clouds.
float gnoise2(vec2 x, float period){
  vec2 i = floor(x), f = fract(x);
  vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);
  vec2 p = vec2(period);
  vec2 g00 = hash22(mod(i + vec2(0.0,0.0), p))*2.0-1.0;
  vec2 g10 = hash22(mod(i + vec2(1.0,0.0), p))*2.0-1.0;
  vec2 g01 = hash22(mod(i + vec2(0.0,1.0), p))*2.0-1.0;
  vec2 g11 = hash22(mod(i + vec2(1.0,1.0), p))*2.0-1.0;
  float a = dot(g00, f - vec2(0.0,0.0));
  float b = dot(g10, f - vec2(1.0,0.0));
  float c = dot(g01, f - vec2(0.0,1.0));
  float d = dot(g11, f - vec2(1.0,1.0));
  return (mix(mix(a,b,u.x), mix(c,d,u.x), u.y)) * 1.4;
}

// ---------------------------------------------------------------- fbm helpers
float fbm2(vec2 p, int oct, float lac, float gain, float period){
  float s = 0.0, a = 0.5, n = 0.0;
  for (int i = 0; i < 10; i++){
    if (i >= oct) break;
    s += a * gnoise2(p, period);
    n += a;
    p = rot2(0.7) * p * lac;
    a *= gain;
  }
  return s / max(n, 1e-5);
}
float fbmv2(vec2 p, int oct, float lac, float gain){
  float s = 0.0, a = 0.5, n = 0.0;
  for (int i = 0; i < 10; i++){
    if (i >= oct) break;
    s += a * vnoise2(p, 4096.0);
    n += a;
    p = rot2(0.9) * p * lac;
    a *= gain;
  }
  return s / max(n, 1e-5);
}
// ridged multifractal: sharp crests, the shape real mountain ridges have
float ridged2(vec2 p, int oct, float lac, float gain, float period){
  float s = 0.0, a = 0.5, n = 0.0, prev = 1.0;
  for (int i = 0; i < 10; i++){
    if (i >= oct) break;
    float v = 1.0 - abs(gnoise2(p, period));
    v *= v;
    s += a * v * prev;
    prev = saturate(v * 1.2);
    n += a;
    p = rot2(0.6) * p * lac;
    a *= gain;
  }
  return s / max(n, 1e-5);
}
float worley2(vec2 p, float jitter, out float f1){
  vec2 i = floor(p), f = fract(p);
  float d1 = 8.0, d2 = 8.0;
  for (int y = -1; y <= 1; y++){
    for (int x = -1; x <= 1; x++){
      vec2 g = vec2(float(x), float(y));
      vec2 o = hash22(mod(i + g, 64.0)) * jitter;
      float d = length(g + o - f);
      if (d < d1){ d2 = d1; d1 = d; } else if (d < d2){ d2 = d; }
    }
  }
  f1 = d1;
  return d2 - d1;
}
float worley3(vec3 p, float jitter, float period){
  vec3 i = floor(p), f = fract(p);
  float d1 = 8.0;
  for (int z = -1; z <= 1; z++)
  for (int y = -1; y <= 1; y++)
  for (int x = -1; x <= 1; x++){
    vec3 g = vec3(float(x), float(y), float(z));
    vec3 h3 = hash32(mod(i + g, period).xy);
    vec3 o = vec3(h3.xy, fract(h3.x * 7.13 + h3.y * 3.71)) * jitter;
    d1 = min(d1, length(g + o - f));
  }
  return d1;
}

// Tiling 3D fBm over a lattice that is exactly <tileSize> cells across, so a 64-cell
// box can be stored in an atlas and wrapped without seams.
float tileFbm3(vec3 q, float cell, int oct, float gain, float tileSize){
  float s = 0.0, a = 0.5, n = 0.0;
  for (int i = 0; i < 6; i++){
    if (i >= oct) break;
    s += a * vnoise3(q / cell, tileSize / cell);
    n += a;
    cell *= 0.5;
    a *= gain;
  }
  return s / max(n, 1e-5);
}

// ---------------------------------------------------------------- BRDF
// Trowbridge-Reitz (GGX) normal distribution. Roughness is perceptual (0 = mirror).
float D_GGX(float ndh, float roughness){
  float a = max(roughness * roughness, 1e-3);
  float a2 = a * a;
  float d = ndh * ndh * (a2 - 1.0) + 1.0;
  return a2 / max(PI * d * d, 1e-7);
}
// Smith height-correlated visibility (Heitz): the same term for both directions.
float V_SmithGGX(float ndv, float ndl, float roughness){
  float a = max(roughness * roughness, 1e-3);
  float a2 = a * a;
  float lv = ndl * sqrt(max(ndv * ndv * (1.0 - a2) + a2, 1e-6));
  float ll = ndv * sqrt(max(ndl * ndl * (1.0 - a2) + a2, 1e-6));
  return 0.5 / max(lv + ll, 1e-5);
}
// Full specular lobe: radiance = F * D * V * E_sun * (n.l). Never exceeds Fresnel.
vec3 specularGGX(vec3 n, vec3 l, vec3 v, float roughness, vec3 f0){
  vec3 h = normalize(l + v);
  float ndh = saturate(dot(n, h));
  float ndl = saturate(dot(n, l));
  float ndv = saturate(dot(n, v));
  if (ndl <= 0.0 || ndv <= 0.0) return vec3(0.0);
  vec3 F = f0 + (1.0 - f0) * pow5(1.0 - saturate(dot(h, v)));
  return F * (D_GGX(ndh, roughness) * V_SmithGGX(ndv, ndl, roughness));
}

// ---------------------------------------------------------------- colour
vec3 linearToSRGB(vec3 c){
  c = max(c, vec3(0.0));
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c));
}
vec3 srgbToLinear(vec3 c){
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
}
// ACES filmic (Stephen Hill's fit of the RRT+ODT, with the ACEScg -> sRGB matrices).
// This is a fitted approximation of the ACES output transform, not the reference transform.
const mat3 ACES_INPUT = mat3(
  0.59719, 0.07600, 0.02840,
  0.35458, 0.90834, 0.13383,
  0.04823, 0.01566, 0.83777);
const mat3 ACES_OUTPUT = mat3(
   1.60475, -0.10208, -0.00327,
  -0.53108,  1.10813, -0.07276,
  -0.07367, -0.00605,  1.07602);
vec3 rrtOdtFit(vec3 v){
  vec3 a = v * (v + 0.0245786) - 0.000090537;
  vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
  return a / b;
}
vec3 acesFitted(vec3 col){
  col = ACES_INPUT * col;
  col = rrtOdtFit(col);
  col = ACES_OUTPUT * col;
  return saturate(col);
}
// Ansel-style ;) — actually the Narkowicz single-curve fit, used for the graph overlay
vec3 acesNarkowicz(vec3 x){
  return saturate((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14));
}

// Hash-based dither to break up 8-bit banding in the final image.
float ditherAmount(vec2 px, float amount, float noisev){
  return (noisev - 0.5) * amount;
}
`;
})();
