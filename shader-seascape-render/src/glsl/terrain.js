/* GLSL chunk: terrain. The height field lives in a baked texture (see gen.js);
   here we sample it, march it, take its derivatives and turn slope + altitude into
   materials. All distances are metres. */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});
  var GLSL = (SS.GLSL = SS.GLSL || {});

  GLSL.prototypes = `
float terrainHeight(vec2 p);
float terrainHeightD(vec2 p, float dist);
vec3  terrainNormal(vec3 p, float dist);
float shadowTerrain(vec3 p, vec3 sunDir);
float cloudShadow(vec3 p, vec3 sunDir);
vec3  cloudRadiance(vec3 ro, vec3 rd, float jitter, float quality, out float alpha);
vec3  skyRadiance(vec3 dir);
vec3  sunTransmittance();
vec3  sunTransmittanceAt(float height);
vec3  skyIrradiance(vec3 n, float ao, out vec3 radianceOut);
float cloudWeather(vec2 xz, float t);
vec3  aerial(vec3 color, vec3 ro, vec3 rd, float dist, float quality);
bool  marchTerrain(vec3 ro, vec3 rd, float tMax, float quality, out float tHit, out vec3 pHit);
bool  slabIntersect(vec3 ro, vec3 rd, float lo, float hi, out float t0, out float t1);
float cloudDensity(vec3 p, float weather, float quality);
float waterSlopeVar(float wind);
vec3  waterShade(vec3 ro, vec3 rd, float t, float dist, float quality);
vec3  waterNormalFoot(vec3 p, float t, float footprint);
`;

  GLSL.terrainParams = `
uniform sampler2D uTerrain;
uniform sampler2D uNoise;      // R+G packed height, B baked sky-occlusion, A hardness
uniform sampler2D uHeightRaw;    // R+G packed height before the erosion passes
uniform float uTerrainSize;      // world size of the tile, metres
uniform float uTerrainHeight;    // world height stored in the texture (sea level -> altitude)
uniform float uSeaLevel;         // metres
uniform float uTerrainTexel;     // metres between height-field samples
uniform float uTerrainRelief;    // metres of vertical range represented by 0..1
uniform float uErosionAmount;
uniform float uDetailAmp;
uniform float uTerrainMid;
`;

  GLSL.terrain = `
#define TERRAIN_H_LO (-1600.0)
#define TERRAIN_H_HI 4200.0

float unpackHeight(vec4 t){ return (t.r + t.g * (1.0/255.0)) * (TERRAIN_H_HI - TERRAIN_H_LO) + TERRAIN_H_LO; }

// Low-frequency land beyond the tile: the same statistical character, cheap.
// Beyond the baked tile: the same landform statistics evaluated procedurally. The
// north/south split matters here — if the far field were mountains everywhere the open
// sea would run into a wall at the tile boundary.
float farTerrain(vec2 p){
  vec2 q = p * 0.000055;
  float northness = smoothstep(-5000.0, 900.0, p.y);
  float offshore = smoothstep(600.0, 7000.0, -p.y);
  float rA = ridged2(q, 4, 2.0, 0.5, 4096.0);
  float rB = ridged2(rot2(1.1) * q * 0.72 + 13.7, 4, 2.0, 0.5, 4096.0);
  float ridge = mix(rA, max(rA, rB * 0.92), 0.5);
  float base = fbm2(q * 1.3 + 7.7, 4, 2.03, 0.5, 4096.0);
  float h = 26.0 - 0.135 * 1650.0 + (base - 0.45) * 0.30 * 1650.0
          + ridge * ridge * 1.35 * 1650.0 * northness * 0.9;
  float shelf = -30.0 - offshore * offshore * 900.0;
  h = mix(h, min(h, shelf), offshore * 0.9);
  return h;
}

float terrainHeight(vec2 p){
  vec2 uv = p / uTerrainSize + 0.5;
  float m = 0.0; // blend factor outside the tile
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) m = 1.0;
  else {
    vec2 d = min(uv, 1.0 - uv);
    m = 1.0 - smoothstep(0.0, 0.055, min(d.x, d.y));
  }
  float h;
  if (m >= 1.0) h = farTerrain(p);
  else {
    h = unpackHeight(texture(uTerrain, clamp(uv, 0.0, 1.0)));
    if (m > 0.0) h = mix(h, farTerrain(p), m);
  }
  return h;
}
// Near-field detail: not part of the silhouette (the march ignores it), it only
// perturbs normals and materials, which is where it reads.
float terrainDetail(vec2 p, float dist){
  float amp = uDetailAmp * (1.0 - smoothstep(30.0, 900.0, dist));
  if (amp <= 0.001) return 0.0;
  float n = fbmv2(p * 0.055, 3, 2.03, 0.5);
  float n2 = fbmv2(p * 0.011, 2, 2.11, 0.55);
  return (n - 0.5) * 3.2 * amp + (n2 - 0.5) * 12.0 * amp;
}
float terrainHeightD(vec2 p, float dist){ return terrainHeight(p) + terrainDetail(p, dist); }

vec3 terrainNormal(vec3 p, float dist){
  // A central difference is only meaningful if the offset spans more than one texel:
  // below that the field is a triangle mesh and the normal picks up its facets, which is
  // what a mountain range drawn in needles actually is. The floor is 1.6 texels.
  float eps = max(mix(1.6, 26.0, saturate(dist / 2600.0)), 1.6 * uTerrainTexel);
  float hL = terrainHeightD(p.xz - vec2(eps, 0.0), dist);
  float hR = terrainHeightD(p.xz + vec2(eps, 0.0), dist);
  float hD = terrainHeightD(p.xz - vec2(0.0, eps), dist);
  float hU = terrainHeightD(p.xz + vec2(0.0, eps), dist);
  return normalize(vec3(hL - hR, 2.0 * eps, hD - hU));
}

// ---------------------------------------------------------------- marching
// Classic height-field ray marching with a conservative step (the largest step that
// cannot pass through the surface) and a linear refinement at the hit.
// Height-field ray march (after the standard terrain-marching formulation): the step
// grows with the clearance above the surface, and the hit is refined by bisection so
// the result sits on the surface rather than tens of metres inside it. That precision
// is what the shadow rays and the water's depth test depend on.
bool marchTerrain(vec3 ro, vec3 rd, float tMax, float quality, out float tHit, out vec3 pHit){
  tHit = -1.0; pHit = vec3(0.0);
  float t = 0.0;
  const float CEIL = TERRAIN_H_HI;
  if (ro.y > CEIL){
    if (rd.y >= -1e-4) return false;
    t = (CEIL - ro.y) / rd.y;
    if (t > tMax) return false;
  }
  t = max(t, 0.0);
  float prevD = 1e9; float prevT = t;
  int maxSteps = 40 + int(quality * 120.0);
  for (int i = 0; i < 220; i++){
    if (i >= maxSteps) break;
    vec3 p = ro + rd * t;
    float diff = p.y - terrainHeight(p.xz);
    if (diff < 0.0){
      // linear estimate, then bisection: with steps up to a kilometre long the linear
      // estimate alone can be far off
      float f = saturate(prevD / max(prevD - diff, 1e-6));
      float ta = prevT, tb = t;
      float tm = mix(ta, tb, f);
      for (int k = 0; k < 8; k++){
        float dm = (ro + rd * tm).y - terrainHeight((ro + rd * tm).xz);
        if (dm > 0.0){ ta = tm; } else { tb = tm; }
        tm = (ta + tb) * 0.5;
      }
      tHit = tm;
      pHit = ro + rd * tHit;
      return true;
    }
    prevD = diff; prevT = t;
    float minStep = mix(0.45, 7.0, saturate(t / 1800.0));
    float dt = clamp(0.6 * diff / max(abs(rd.y), 0.02), minStep, mix(1000.0, 220.0, saturate(t / 4000.0)));
    t += dt;
    if (t > tMax) break;
  }
  return false;
}

// ---------------------------------------------------------------- materials
struct Material { vec3 albedo; float roughness; float spec; };

Material materialAt(vec3 p, vec3 n, float dist, out float matId){
  float slope = 1.0 - n.y;                       // 0 flat ... 1 vertical
  float height = p.y;
  vec4 t = texture(uTerrain, clamp(p.xz / uTerrainSize + 0.5, 0.0, 1.0));
  float hardness = t.a;
  float ao = t.b;

  float grain = fbmv2(p.xz * 0.09, 3, 2.07, 0.5);
  float strata = fbm2(p.xz * 0.004 + vec2(0.0, p.y * 0.02), 3, 2.2, 0.5, 4096.0);
  float patchN = fbm2(p.xz * 0.0016 + 11.0, 3, 2.0, 0.5, 4096.0);

  // Colours are picked from a cold-coast palette: wet sand, gravel, moss, strata rock, snow.
  vec3 sand   = srgbToLinear(vec3(0.66, 0.58, 0.45)) * (0.86 + 0.3 * grain);
  vec3 gravel = srgbToLinear(vec3(0.50, 0.46, 0.41)) * (0.8 + 0.45 * grain);
  vec3 moss   = srgbToLinear(vec3(0.28, 0.36, 0.18)) * (0.75 + 0.5 * grain);
  vec3 rockA  = srgbToLinear(vec3(0.40, 0.38, 0.36)) * (0.75 + 0.5 * strata);
  vec3 rockB  = srgbToLinear(vec3(0.52, 0.46, 0.41)) * (0.8 + 0.4 * strata);
  vec3 rock   = mix(rockA, rockB, saturate(strata * 1.4));
  vec3 snow   = srgbToLinear(vec3(0.93, 0.95, 0.98)) * (0.92 + 0.2 * grain);

  float roughness = 0.9;
  float spec = 0.02;

  // 1. under water: sediment where it is flat, rock where it is steep
  float wet = 1.0 - smoothstep(-2.0, 6.0, height - uSeaLevel);
  // 2. base: rock on steep slopes (the angle of repose is what makes mountains look real)
  vec3 c = mix(gravel, rock, smoothstep(0.025, 0.10, slope));
  c = mix(c, mix(moss, rock, smoothstep(0.05, 0.16, slope)), smoothstep(0.06, 0.0, slope) * 0.9);
  // 3. sand: the beach is the strip within a few metres of sea level, not every flat
  // place on the map. Vegetation covers the rest of the lowlands.
  float aboveSea = height - uSeaLevel;
  float beach = smoothstep(13.0, 3.0, aboveSea) * smoothstep(0.09, 0.0, slope);
  float sandMask = beach * (0.5 + 0.5 * patchN);
  c = mix(c, sand, saturate(sandMask) * 0.9);
  // grass and scrub on the flats: a slightly desaturated green, broken up by patch noise
  vec3 grass = srgbToLinear(mix(vec3(0.24, 0.30, 0.15), vec3(0.34, 0.36, 0.20), patchN));
  vec3 scrub = srgbToLinear(mix(vec3(0.28, 0.31, 0.18), vec3(0.20, 0.24, 0.13), grain));
  float vegMask = smoothstep(0.12, 0.02, slope) * smoothstep(11.0, 26.0, aboveSea)
                * (1.0 - smoothstep(700.0, 1200.0, height));
  c = mix(c, mix(grass, scrub, patchN), saturate(vegMask) * 0.92);
  // 4. exposed rock where the baked hardness says the crust is broken
  c = mix(c, rockB, saturate(hardness - 0.45) * 1.2);
  // 5. snow line, noisy and sloped, only on the upper mountains
  float snowLine = 1450.0 + 520.0 * (patchN - 0.5);
  float snowMask = smoothstep(snowLine - 180.0, snowLine + 220.0, height) * smoothstep(0.42, 0.20, slope);
  c = mix(c, snow, saturate(snowMask));
  roughness = mix(0.92, 0.72, snowMask);
  spec = mix(0.02, 0.045, snowMask);

  // sea-floor sediment: brighter, smoother
  vec3 sediment = srgbToLinear(vec3(0.55, 0.50, 0.42)) * (0.85 + 0.3 * grain);
  c = mix(c, sediment, wet * smoothstep(0.05, 0.0, slope));
  roughness = mix(roughness, 0.75, wet);
  // baked sky occlusion darkens crevices
  c *= mix(0.45, 1.0, saturate(ao * 0.8 + 0.35));

  matId = 0.0;
  matId += step(0.02, sandMask) * 1.0;
  matId += step(0.5, saturate(snowMask)) * 1.0;
  matId += step(0.05, hardness) * 1.0;
  Material m;
  m.albedo = c; m.roughness = roughness; m.spec = spec;
  return m;
}

// ---------------------------------------------------------------- shadows
// penumbra from the sun being 0.53 degrees wide
// Soft shadows from the sun. The march skips empty space with a distance-proportional
// step (the heightfield trick) and keeps a bias that grows with distance, so the
// surface's own micro-relief cannot shadow itself.
float shadowTerrain(vec3 p, vec3 sunDir){
  if (sunDir.y <= 0.01) return 0.0;
  // begin on the surface, whatever the march reported
  p.y = max(p.y, terrainHeight(p.xz) + 0.5);
  float t = 8.0;
  float soft = 1.0;
  int steps = 12 + int(uQualityShadowSteps);
  for (int i = 0; i < 64; i++){
    if (i >= steps) break;
    vec3 q = p + sunDir * t;
    float diff = q.y - terrainHeight(q.xz);
    float bias = 3.0 + 0.25 * t;
    if (diff < -bias) return 0.0;
    soft = min(soft, smoothstep(-bias, bias * 2.5, diff));
    t += max(10.0, 0.4 * max(diff, 0.0) / max(sunDir.y, 0.06));
    if (t > 14000.0) break;
  }
  return saturate(soft);
}

`;

  // The scene shader references uQualityShadowSteps; declare it centrally.
  GLSL.qualityParams = `
uniform float uQualityShadowSteps;
uniform float uQuality;         // 0 .. 1 master knob
uniform int   uView;            // debug view id
uniform float uStage[12];       // stage weights
uniform float uHazeStrength;
uniform float uTime;
uniform vec3  uCameraPos;
uniform float uDebugMix;
uniform vec2  uRenderRes;
uniform float uFrameJitter;
out vec4 outColor;
`;
})();
