/* GLSL chunk: volumetric clouds. Density is carved out of a baked 3D noise atlas
   (inverted Worley puffs + two fbm layers); light is single scattering with a
   three-lobe phase function and a powder term, plus a coarse shadow probe that also
   darkens the terrain and the sea. Atlas layout: 8x8 slices of 66x66 (64 + a
   1-texel wrapped border, so the hardware bilinear filter is exact across the wrap). */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});
  var GLSL = (SS.GLSL = SS.GLSL || {});

  GLSL.cloudParams = `
uniform sampler3D uNoiseAtlas;        // shape volume (128^3)
uniform sampler3D uNoiseAtlasDetail;  // erosion volume
uniform sampler2D uWeather;           // baked cloud weather map, wraps every uWeatherTile
uniform float uWeatherTile;           // world metres across the weather map
uniform float uCloudBase;             // bottom of the cloud layer, m
uniform float uCloudTop;              // top of the layer, m
uniform float uCloudCover;            // 0 clear .. 1 overcast
uniform float uCloudUnit;             // world metres per lattice unit of the shape volume
uniform float uCloudDetailUnit;       // ... and of the erosion volume
uniform float uCloudContrast;
uniform float uCloudErosion;
uniform float uCloudVert;             // vertical compression of the shape noise
uniform float uCloudFadeNear;         // distance where the slab starts to fade out
uniform float uCloudSteps;            // march step budget, 0 .. 1
uniform float uCloudDensityScale;     // extinction per unit density
uniform float uCloudSunScale;
uniform float uCloudAmbient;
uniform float uWind;                  // wind speed, m/s
`;

  GLSL.clouds = `
// p in lattice units; the volume holds 64 cells across and wraps in every axis
vec4 noiseAt(sampler3D at, vec3 p){ return textureLod(at, p * (1.0 / 64.0), 0.0); }

float verticalProfile(float h){
  float base = smoothstep(0.0, 0.045, h);
  float top = 1.0 - smoothstep(0.55, 1.0, h);
  float bulge = 0.80 + 0.20 * sin(h * PI);
  return base * top * bulge;
}
// Large scale cloud organisation ("weather"). One texture fetch, wrap-around, drifting
// with the wind: a ray that travels 20 km no longer samples the wrong weather.
// The smoothstep is what separates the sky into clear air and cloud fields; without it
// every direction ends up looking overcast.
vec2 cloudWeather2(vec2 xz, float t){
  vec2 p = xz + vec2(t * uWind * 3.0, t * uWind * 1.4);
  return textureLod(uWeather, p / uWeatherTile, 0.0).rg;
}
float cloudWeather(vec2 xz, float t){
  float w = cloudWeather2(xz, t).x;
  return smoothstep(0.34, 0.62, w);
}
// Density of the cloud medium at a world point. Two volumes: a low frequency one that
// decides where there is a cloud at all, and a high frequency one that erodes its edges
// (which is what gives the cauliflower silhouette).
float cloudDensity(vec3 p, float weather, float quality){
  float thick = max(uCloudTop - uCloudBase, 50.0);
  float h = (p.y - uCloudBase) / thick;
  if (h <= 0.0 || h >= 1.0) return 0.0;
  vec3 drift = vec3(uTime * uWind * 2.2, uTime * uWind * 0.25, uTime * uWind * 0.9);

  // shape: the noise is vertically compressed (uCloudVert), which is what makes
  // convective towers instead of a horizontal curtain
  vec3 pb = vec3(p.x, (p.y - uCloudBase) * uCloudVert, p.z) / uCloudUnit + drift / uCloudUnit * 0.03;
  vec4 nb = noiseAt(uNoiseAtlas, pb);
  // normalise the noise to 0..1 over its practical range: fbm sits in a narrow band
  // around 0.5, and forgetting to stretch it is how a cloud layer silently disappears
  float shape = saturate((nb.g * 0.70 + nb.a * 0.30 - 0.26) / 0.44);
  float cover = saturate(uCloudCover * (0.10 + 1.75 * weather));
  // The coverage remap is what decides whether this reads as a cloud or as fog: the
  // transition band must be a small slice of the noise, otherwise the field comes out
  // as a uniform dune (which is exactly what the first version did).
  float thresh = mix(0.92, 0.30, cover);
  float band = mix(0.34, 0.22, cover);
  float base = smoothstep(thresh, thresh + band, shape);
  base = pow(saturate(base), uCloudContrast);
  if (base <= 0.0) return 0.0;
  float d = base * verticalProfile(h);
  if (quality > 0.02){
    // the erosion eats into the outer shell of the shape only, which is what carves a
    // billowing edge. Real cloud renderers do exactly this with a high frequency Worley.
    vec3 pd = vec3(p.x, (p.y - uCloudBase) * uCloudVert * 1.4, p.z) / uCloudDetailUnit
            + drift / uCloudDetailUnit * 0.06;
    vec4 nd = noiseAt(uNoiseAtlasDetail, pd);
    float det = mix(nd.b * 0.6 + nd.r * 0.4, 1.0 - nd.b * 0.5 - nd.r * 0.5, saturate(h * 1.8));
    // the erosion is strongest where the shape is fainter: it eats the outer shell and
    // leaves the cores, which is what gives a billowing silhouette
    float shell = smoothstep(0.02, 0.55, d);
    d = max(d - det * uCloudErosion * (1.0 - shell) * smoothstep(0.0, 0.25, quality), 0.0);
    d *= 1.0 - uCloudErosion * 0.25 * (1.0 - det);
  }
  return saturate(d);
}

bool slabIntersect(vec3 ro, vec3 rd, float lo, float hi, out float t0, out float t1){
  if (abs(rd.y) < 1e-5) return false;
  float a = (lo - ro.y) / rd.y;
  float b = (hi - ro.y) / rd.y;
  t0 = min(a, b); t1 = max(a, b);
  return t1 > 0.0;
}

// Coarse probe used for the shadows clouds cast on the ground and on the sea.
float cloudShadow(vec3 p, vec3 sunDir){
  if (sunDir.y <= 0.02 || uStage[7] < 0.02) return 1.0;
  float t0, t1;
  if (!slabIntersect(p, sunDir, uCloudBase, uCloudTop, t0, t1)) return 1.0;
  t0 = max(t0, 0.0);
  if (t1 <= t0) return 1.0;
  float weather = cloudWeather(p.xz, uTime);
  float dt = (t1 - t0) / 6.0;
  float tau = 0.0;
  for (int i = 0; i < 6; i++){
    vec3 q = p + sunDir * (t0 + dt * (float(i) + 0.5));
    tau += cloudDensity(q, weather, 0.0) * dt * uCloudDensityScale;
  }
  return exp(-tau * 0.7);
}

vec3 cloudRadiance(vec3 ro, vec3 rd, float jitter, float quality, out float alpha){
  alpha = 0.0;
  if (uStage[7] < 0.004) return vec3(0.0);
  float t0, t1;
  if (!slabIntersect(ro, rd, uCloudBase, uCloudTop, t0, t1)) return vec3(0.0);
  t0 = max(t0, 0.0);
  t1 = min(t1, 46000.0);
  if (t1 <= t0) return vec3(0.0);
  // clouds seen almost edge-on at 40+ km would alias into radial streaks: fade the
  // whole slab out with distance instead (real ones are hidden by the horizon anyway)
  float distFade = 1.0 - smoothstep(uCloudFadeNear, uCloudFadeNear * 1.6, t0);
  // grazing rays would cross tens of kilometres of slab, where the marcher aliases into
  // moire. Those clouds are inside the haze anyway, and the atmosphere hides them: fade
  // the layer out as the ray approaches the horizon.
  distFade *= smoothstep(-0.004, 0.055, rd.y);
  if (distFade <= 0.002) return vec3(0.0);

  float mu = dot(rd, uSunDir);
  // three lobes: a forward Mie lobe for the silver lining, a weak backward lobe, and an
  // isotropic term so cloud faces turned away from the sun are not pitch black.
  float phase = henyeyGreenstein(mu, 0.72) * 0.70
              + henyeyGreenstein(mu, -0.30) * 0.18
              + (1.0 / (4.0 * PI)) * 0.16;
  float weather = cloudWeather(ro.xz + rd.xz * max(t0, 0.0) * 0.5, uTime);
  // The light a cloud sits in is the sky dome around it, not the horizon band: the band is
  // the brightest thing in the sky but it is a sliver, and taking 40 % of it made every
  // cloud a pink smear. The cosine-weighted dome average is the honest version of
  // "how much light is up here".
  vec3 ambUp;
  skyIrradiance(vec3(0.0, 1.0, 0.0), 1.0, ambUp);
  vec3 amb = ambUp;

  // grazing rays cross much more medium: give them more samples
  float span = t1 - t0;
  int maxSteps = int(clamp(16.0 + uCloudSteps * 56.0 + span / 90.0, 16.0, 88.0));
  float t = t0 + jitter * mix(24.0, 90.0, saturate(span / 6000.0));
  vec3 L = vec3(0.0);
  float trans = 1.0;
  for (int i = 0; i < 100; i++){
    if (i >= maxSteps || t > t1) break;
    float dt = mix(42.0, 22.0, quality) + min(t * 0.012, 140.0) + span * 0.004;
    vec3 p = ro + rd * t;
    float d = cloudDensity(p, weather, quality);
    if (d > 0.002){
      float sigma = d * uCloudDensityScale;
      float stepT = exp(-sigma * dt);
      float lt = 26.0, ldt = 26.0, ltau = 0.0;
      int lightSteps = 2 + int(quality * 3.0);
      for (int j = 0; j < 8; j++){
        if (j >= lightSteps) break;
        vec3 q = p + uSunDir * (lt + ldt * 0.5);
        ltau += cloudDensity(q, weather, 0.0) * ldt * uCloudDensityScale;
        lt += ldt; ldt *= 1.75;
      }
      float powder = mix(1.0, 1.0 - exp(-sigma * 12.0) * 2.2, saturate(-mu * 0.6 + 0.5));
      vec3 sunT = sunTransmittanceAt(p.y);
      vec3 sunCol = sunT * exp(-ltau) * phase * uSunIrradiance * uCloudSunScale * powder;
      vec3 scat = sunCol + amb * uCloudAmbient * 0.32;
      float sInt = (1.0 - stepT) / max(sigma, 1e-5);
      L += trans * scat * (1.0 - stepT);
      trans *= stepT;
    }
    t += dt;
  }
  alpha = (1.0 - trans) * distFade;
  // aerial perspective on the cloud itself: the air between the camera and the slab
  vec3 Tair = exp(-(uBetaR * max(t0, 0.0) * 0.2 + uBetaM * MIE_EXTINCTION * max(t0, 0.0) * 0.35));
  vec3 haze = sampleSkyLUT(uSkyLUT, rd, uSunElev, uSunAzi) * uSkyScale * (1.0 - Tair) * uHazeStrength;
  return L * Tair + haze * (1.0 - trans) * distFade;
}
`;
})();
