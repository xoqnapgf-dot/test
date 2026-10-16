/* GLSL chunk: the sea surface. A flat plane whose normal comes from a small wave
   spectrum with deep-water dispersion (omega = sqrt(g k)), shaded with Fresnel
   reflection, refraction into a short underwater march, wavelength-dependent
   absorption (Pope & Fry's pure-water coefficients), whitecap coverage from the
   Monahan & O Muircheartaigh wind relation, and Cox & Munk slope statistics for the
   sun glitter lobe. */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});
  var GLSL = (SS.GLSL = SS.GLSL || {});

  GLSL.waterParams = `
uniform float uWaveAmp;
uniform vec2  uWaveDir;
uniform float uWaterClarity;
uniform float uFoam;
uniform float uWaterIOR;
uniform float uWaveSpeed;
uniform float uSunGlitter;
uniform float uAbsorption;
uniform float uPixAngle;
uniform float uSeedW;
`;

  GLSL.water = `
// Cox & Munk (1954) clean-surface mean square slope, fitted over 1-14 m/s.
float waterSlopeVar(float wind){ return 0.003 + 0.00512 * max(wind, 1.0); }

// ---- the wave spectrum -----------------------------------------------------
// Sixteen components on a geometric wavenumber ladder, from open-ocean swell (18 m)
// down to wind chop (30 cm). Deep-water dispersion omega = sqrt(g k). Directions fan
// out around the wind. The amplitudes are set so the total mean-square slope matches
// Cox & Munk's clean-surface measurements for the current wind speed: that is what
// makes the glitter statistically right instead of hand-tuned.
#define WAVE_N 16
const float WG = 9.81;
// every component fades once its wavelength falls below ~2.5 screen pixels, and the
// remaining components are renormalised, so the far sea keeps its slope statistics
// without turning into moire.
vec2 waveGrad(vec2 p, float t, float wind, float footprint){
  vec2 d0 = normalize(uWaveDir);
  float U = max(wind, 1.0);
  float k0 = WG / (U * U) * 0.35;          // peak wavenumber of the wind sea
  float kMin = min(k0 * 0.35, 0.35);
  float mss = waterSlopeVar(U) - 0.005;    // target slope variance for the wind sea
  float amp2All = 0.0;                      // slope variance of the whole spectrum
  float amp2Kept = 0.0;                     // ... and of the part this footprint resolves
  vec2 grad = vec2(0.0);
  for (int i = 0; i < WAVE_N; i++){
    float fi = float(i);
    float k = kMin * pow(1.42, fi);
    // slope spectrum: slope^2 falls as 1/k, so the short waves carry most of the tilt
    float w = pow(k / kMin, -1.0);
    float ang = (hash11(fi * 12.9898 + uSeedW) * 2.0 - 1.0) * 0.85;
    vec2 d = rot2(ang) * d0;
    float lam = TAU / k;
    amp2All += w * w;
    // Screen-space level of detail. The footprint is the length of sea that one pixel
    // covers, so lam/footprint is how many pixels one wavelength spans: a wave shorter
    // than a couple of pixels cannot be drawn and is faded out.
    float px = lam / max(footprint, 1e-5);
    float fade = smoothstep(0.9, 2.6, px);
    if (fade <= 0.002) continue;
    float omega = sqrt(WG * k) * uWaveSpeed;
    float ph = k * dot(d, p) - omega * t + hash11(fi * 7.31 + 3.7) * TAU;
    float a = w * fade;                    // slope amplitude of this component
    amp2Kept += a * a;
    grad += (a * k) * cos(ph) * d;
  }
  // Nothing resolvable at this footprint means flat water - not, as the guard in the
  // first version implied, an infinitely steep surface.
  if (amp2Kept < 1e-9) return vec2(0.0);
  // Normalise against the *whole* spectrum, not against the surviving part. Renormalising
  // the survivors was redistributing the energy of every filtered-out wave onto the few
  // long waves that were left, which at a grazing view tilted the surface by the full
  // mean-square slope and threw the mirrored ray up into the dark part of the sky - the
  // reason the sea went black in a band just below the horizon. This way the distance
  // filter is a real low pass: fewer resolved waves, less slope, which is what a
  // filtered surface should look like.
  float sc = sqrt(max(mss, 1e-6) * 0.5 / amp2All) * uWaveAmp;
  return grad * sc;
}

// wave height of the long components only: what whitecaps and swash ride on
float waveHeightAt(vec2 p, float t, float wind, float ampScale){
  vec2 d0 = normalize(uWaveDir);
  float U = max(wind, 1.0);
  float kMin = min(WG / (U * U) * 0.35 * 0.35, 0.35);
  float h = 0.0;
  for (int i = 0; i < 5; i++){
    float fi = float(i);
    float k = kMin * pow(1.42, fi);
    float a = 0.06 * U * pow(k / kMin, -1.35);
    float ang = (hash11(fi * 12.9898 + uSeedW) * 2.0 - 1.0) * 0.85;
    vec2 d = rot2(ang) * d0;
    float omega = sqrt(WG * k) * uWaveSpeed;
    h += a * sin(k * dot(d, p) - omega * t + hash11(fi * 7.31 + 3.7) * TAU);
  }
  return h * ampScale;
}
vec3 waterNormalFoot(vec3 p, float t, float footprint){
  vec2 grad = waveGrad(p.xz, t, uWind, footprint);
  return normalize(vec3(-grad.x, 1.0, -grad.y));
}
vec3 waterNormalAt(vec3 p, float t, float dist, float pixAngle){
  return waterNormalFoot(p, t, max(pixAngle * max(dist, 1.0), 0.02));
}
vec3 waterNormal(vec3 p, float t, float wind, float dist, float quality){
  return waterNormalAt(p, t, dist, uPixAngle);
}
// Whitecap coverage after Monahan & O'Muircheartaigh (1980):
// W = 3.84e-6 U^3.41  — the fraction of the sea surface covered by foam.
float whitecapCoverage(float wind){ return 3.84e-6 * pow(max(wind, 0.5), 3.41); }

// Debug channels for the water: reflection, body and the factors that decide between
// them. Filled in by waterShade and read by the debug views, because "the sea is dark"
// has three completely different causes and only a direct read tells them apart.
vec3 waterDbgRefl = vec3(0.0);
vec3 waterDbgBody = vec3(0.0);
float waterDbgF = 0.0;
vec3 waterShade(vec3 ro, vec3 rd, float t, float dist, float quality){
  vec3 p = ro + rd * t;
  // Two-step footprint: the first pass uses the geometric footprint, the second the
  // footprint corrected by the surface tilt (1/cos of the local view angle).
  float foot0 = max(uPixAngle * max(t, 1.0), 0.02);
  vec3 n0 = waterNormalFoot(p, t, foot0);
  // The footprint stretches along a tilted surface by 1/cos, but letting that run away at
  // a grazing view (it reaches 16x) filters out the very waves that make the horizon
  // band glitter, so it is clamped.
  float cosTilt = clamp(abs(dot(-rd, n0)), 0.35, 1.0);
  vec3 n = waterNormalFoot(p, t, foot0 / cosTilt);
  vec3 up = vec3(0.0, 1.0, 0.0);

  // ---- reflection: sky, clouds, and mirrored cliffs
  vec3 R = reflect(rd, n);
  R.y = abs(R.y) + 1e-4;
  vec3 skyRefl = skyRadiance(R);
  float cloudAlpha = 0.0;
  vec3 cloudRefl = vec3(0.0);
  if (uStage[7] > 0.01){
    cloudRefl = cloudRadiance(p + n * 0.4, R, fract(sin((p.x + p.z) * 12.9898) * 43758.5453), quality * 0.5, cloudAlpha);
  }
  vec3 refl = skyRefl * (1.0 - cloudAlpha) + cloudRefl;
  float tRefl; vec3 pRefl;
  if (R.y > 0.03 && marchTerrain(p + n * 0.4, R, 5000.0, quality * 0.4, tRefl, pRefl)){
    float d2 = length(pRefl - p);
    vec3 rn = terrainNormal(pRefl, d2);
    float sh = shadowTerrain(pRefl, uSunDir) * cloudShadow(pRefl, uSunDir);
    float matId;
    Material m = materialAt(pRefl, rn, d2, matId);
    float ndl = saturate(dot(rn, uSunDir));
    vec3 skv;
    vec3 E = skyIrradiance(rn, 0.85, skv);
    vec3 c = m.albedo / PI * (sunTransmittanceAt(pRefl.y) * uSunIrradiance * ndl * sh + E * 0.35);
    c = aerial(c, p, R, d2, quality * 0.5);
    refl = mix(refl, c, saturate(1.0 - smoothstep(1500.0, 5000.0, d2)));
  }

  // ---- refraction: march under the surface for the sea floor
  vec3 T = refract(rd, n, 1.0 / uWaterIOR);
  if (dot(T, T) < 1e-6) T = rd;
  float seabedDepth = max(uSeaLevel - terrainHeight(p.xz), 0.0);
  float pathLen = max(seabedDepth, 0.0) / max(abs(T.y), 0.06);
  vec3 seabedCol = vec3(0.0);
  float tBed; vec3 pBed;
  if (marchTerrain(p + T * 0.4, T, clamp(pathLen * 1.5, 14.0, 1200.0), quality * 0.55, tBed, pBed)){
    vec3 bn = terrainNormal(pBed, tBed);
    float matId2;
    Material bm = materialAt(pBed, bn, tBed, matId2);
    float ndl = saturate(dot(bn, uSunDir));
    // approximate caustics: where the wave field is concave, light converges
    float lap = (waveHeightAt(pBed.xz + vec2(2.5, 0.0), t, uWind, 1.0)
               + waveHeightAt(pBed.xz - vec2(2.5, 0.0), t, uWind, 1.0)
               + waveHeightAt(pBed.xz + vec2(0.0, 2.5), t, uWind, 1.0)
               + waveHeightAt(pBed.xz - vec2(0.0, 2.5), t, uWind, 1.0)
               - 4.0 * waveHeightAt(pBed.xz, t, uWind, 1.0)) * 0.25;
    float caustic = saturate(1.0 - lap * 0.6) * 1.3;
    vec3 sk2;
    seabedCol = bm.albedo / PI * sunTransmittanceAt(pBed.y) * uSunIrradiance * ndl * shadowTerrain(pBed, uSunDir);
    seabedCol *= mix(1.0, caustic, 0.7);
    seabedCol += bm.albedo / PI * skyIrradiance(bn, 0.7, sk2) * 0.3;
  }
  // Absorption over the submerged path. Pure water at 650/550/450 nm: 0.34 / 0.065 / 0.009 per m.
  vec3 absCoeff = vec3(0.34, 0.065, 0.009) * uAbsorption / max(uWaterClarity, 0.05);
  vec3 atten = exp(-absCoeff * pathLen * 1.35);
  // what the water column itself sends back: sunlight scattered by the water and its
  // suspended matter, biased to blue because red is absorbed first.
  vec3 sk3;
  vec3 skyE3 = skyIrradiance(up, 1.0, sk3);
  vec3 backScatter = (sunTransmittanceAt(uSeaLevel) * uSunIrradiance * vec3(0.10, 0.42, 0.95) * 0.06
                   + skyE3 * vec3(0.25, 0.6, 1.0) * 0.05) * uWaterClarity;
  vec3 body = seabedCol * atten + backScatter * (1.0 - atten);

  // ---- Fresnel: F0 = ((1.333-1)/(1.333+1))^2 = 0.0204
  float f0 = 0.0204;
  float cosT = saturate(dot(n, -rd));
  float F = f0 + (1.0 - f0) * pow5(1.0 - cosT);
  vec3 col = mix(body, refl, F);
  waterDbgRefl = refl; waterDbgBody = body; waterDbgF = F;

  // ---- sun glitter. The wave normals already carry the slope statistics, so the
  // micro-lobe itself stays narrow (a sub-BRDF roughness): the width of the glitter
  // path then comes from the physics of the surface, not from a fudge factor.
  float ndl = saturate(dot(n, uSunDir));
  float ndv = saturate(dot(n, -rd));
  float rough = clamp(0.035 + 0.0011 * dist, 0.035, 0.16) * mix(1.25, 1.0, quality);
  vec3 spec = specularGGX(n, uSunDir, -rd, rough, vec3(f0));
  float shadowTerm = shadowTerrain(p, uSunDir) * cloudShadow(p, uSunDir);
  // The sun's irradiance (not its radiance) times the BRDF: this is what makes the
  // glitter a blown highlight instead of an arbitrary number.
  vec3 sunE = sunTransmittanceAt(p.y) * uSunIrradiance * uSunGlitter;
  col += sunE * spec * ndl * shadowTerm;

  // ---- foam: shoreline swash + wind whitecaps
  float depth = max(uSeaLevel - terrainHeight(p.xz), 0.0);
  float foamNoise = fbmv2(p.xz * 0.32 + vec2(t * 0.03, t * 0.012), 3, 2.1, 0.5);
  float crestPhase = saturate(0.5 + 0.5 * waveHeightAt(p.xz, t, uWind, uWaveAmp) / (0.06 + 0.010 * uWind * uWind));
  float foamShore = smoothstep(2.4, 0.10, depth) * smoothstep(0.30, 0.80, foamNoise * 0.55 + 0.55 * crestPhase);
  float W = whitecapCoverage(uWind);
  float crest = saturate(waveHeightAt(p.xz, t, uWind, uWaveAmp) / (0.10 + 0.020 * uWind * uWind));
  float streak = fbmv2(p.xz * 0.05 + vec2(0.0, t * 0.006), 3, 2.03, 0.5);
  float capMask = saturate(crest * 1.2 + streak * 0.95 - (1.45 - W * 30.0));
  float foamWind = smoothstep(0.18, 0.72, capMask) * smoothstep(3.0, 8.0, uWind) * mix(0.30, 1.0, foamNoise);
  float foam = saturate((foamShore * 0.95 + foamWind * 0.9) * uFoam);
  foam *= 1.0 - smoothstep(2000.0, 8000.0, dist) * 0.4;
  if (foam > 0.001){
    vec3 sk4;
    vec3 foamCol = srgbToLinear(vec3(0.87, 0.91, 0.94));
    float lit = saturate(dot(n, uSunDir));
    float skv;
    vec3 skyE4 = skyIrradiance(n, 1.0, sk4);
    vec3 fcol = foamCol / PI * (sunTransmittanceAt(p.y) * uSunIrradiance * lit * shadowTerm + skyE4);
    fcol = mix(fcol, col * 1.15, 0.16);
    col = mix(col, fcol, foam * mix(0.72, 0.94, quality));
  }
  return col;
}
`;
})();
