/* GLSL chunk: the scene shader — one fullscreen pass that builds the ray, marches the
   land, puts the sea in front of it, drops clouds into the sky, and can be pulled apart
   into its nine stages (uStage) or inspected through the debug views (uView).

   Radiometry, so that every number in here means something:
     - the sky lookup holds *radiance* (W·sr⁻¹·m⁻², arbitrary scale)
     - uSunIrradiance is the irradiance the direct sun delivers to a surface facing it
     - surfaces are Lambertian: radiance = albedo/pi * (E_sun*cos + E_sky)
     - clouds carry a phase function, water carries a microfacet BRDF */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});
  var GLSL = (SS.GLSL = SS.GLSL || {});

  GLSL.cameraParams = `
uniform vec3  uCamPos;
uniform vec3  uCamRight;
uniform vec3  uCamUp;
uniform vec3  uCamFwd;
uniform float uTanHalfFov;
uniform float uSunElev;
uniform float uSunAzi;
`;

  GLSL.scene = `
// ---------------------------------------------------------------- sky
vec3 sunTransmittanceAt(float height){
  float el = asin(clamp(uSunDir.y, -1.0, 1.0));
  return texture(uSunTrans, vec2(elevToV(el), heightToV(height))).rgb;
}
vec3 sunTransmittance(){ return sunTransmittanceAt(0.0); }

vec3 skyRadiance(vec3 dir){
  vec3 s = sampleSkyLUT(uSkyLUT, dir, uSunElev, uSunAzi) * uSkyScale;
  float ang = acos(clamp(dot(dir, uSunDir), -1.0, 1.0));
  // The disk is drawn with an aesthetic radiance, not the physical ~1e5, because the
  // frame is half-float and nothing on screen needs the true value: it only has to blow
  // out. The glow around it comes from the baked scattering.
  float disk = 1.0 - smoothstep(0.00465 * 0.62, 0.00465, ang);
  vec3 sunT = sunTransmittance();
  s += sunT * uSunDiskIntensity * disk;
  s += sunT * uSunIrradiance * 0.055 * pow(saturate(dot(dir, uSunDir)), 900.0);
  return s;
}
// A ring direction that dips under the horizon is not sky any more: lift it back to the
// horizon band. Without this a wall, whose rings point sideways, reads the sub-horizon
// table - light that has already been through the ground's own extinction - and comes out
// near black despite a bright sky.
vec3 skyward(vec3 d){ return normalize(vec3(d.x, max(d.y, 0.035), d.z)); }
// Diffuse irradiance from the sky dome. What the light actually is, is the cosine-weighted
// integral of the sky radiance over the hemisphere, so it is evaluated as one: three
// elevation rings around the surface normal carrying the shares sin^2 gives them
// (0.25 / 0.50 / 0.25), the two lower rings split toward and away from the sun. The old
// flat 0.35/0.45/0.20 average put a large weight on the horizon band, which is exactly
// where a low sun makes the sky brightest and the cosine factor smallest - it lit the land
// with light the surface never sees.
//
// The baked occlusion re-weights the rings as well as dimming them: an occluded point sees
// less of the low sky and relatively more of the zenith, which is why shade under a ridge
// goes blue rather than merely dark.
vec3 skyIrradiance(vec3 n, float ao, out vec3 radianceOut){
  float sunA = atan(uSunDir.x, uSunDir.z);
  vec3 sunH = vec3(sin(sunA), 0.0, cos(sunA));
  vec3 tv = sunH - n * dot(n, sunH);
  vec3 t = length(tv) > 1e-3 ? normalize(tv) : normalize(cross(vec3(0.0, 1.0, 0.0), n));
  float a = saturate(ao);
  // Ring representatives: the elevation at which a ring's share of a cosine-weighted
  // hemisphere is split in half, i.e. sin^2 = 0.125 / 0.5 / 0.875 -> 20.7 / 45 / 69.3 deg.
  // A surface never sees sky under the horizon, so the low rings are lifted back to it:
  // what is actually down there is the ground, and the baked occlusion already accounts
  // for that part of the hemisphere.
  float m0 = mix(0.80, 1.0, a), m1 = mix(0.42, 1.0, a), m2 = mix(0.18, 1.0, a);
  vec3 r0 = skyRadiance(skyward(n * 0.936 + t * 0.352)) * 0.25 * m0;
  vec3 r1 = (skyRadiance(skyward(n * 0.7071 + t * 0.7071))
           + skyRadiance(skyward(n * 0.7071 - t * 0.7071))) * 0.25 * m1;
  vec3 r2 = (skyRadiance(skyward(n * 0.354 + t * 0.935))
           + skyRadiance(skyward(n * 0.354 - t * 0.935))) * 0.125 * m2;
  vec3 avg = (r0 + r1 + r2) / (0.25 * m0 + 0.5 * m1 + 0.25 * m2);
  avg *= mix(0.32, 1.0, a);
  radianceOut = avg;
  return PI * avg;
}
// Flat-atmosphere aerial perspective: the density falls off exponentially, so the
// optical depth of a straight segment has a closed form and needs no marching.
vec3 aerial(vec3 color, vec3 ro, vec3 rd, float dist, float quality){
  if (dist <= 0.0) return color;
  float dy = rd.y;
  float y0 = max(ro.y, 0.0);
  float y1 = max(ro.y + dy * dist, 0.0);
  float intR, intM;
  if (abs(dy) < 1e-4){
    intR = dist * exp(-y0 / uHr);
    intM = dist * exp(-y0 / uHm);
  } else {
    intR = uHr / abs(dy) * abs(exp(-y0 / uHr) - exp(-y1 / uHr));
    intM = uHm / abs(dy) * abs(exp(-y0 / uHm) - exp(-y1 / uHm));
  }
  vec3 tau = uBetaR * intR + uBetaM * MIE_EXTINCTION * intM;
  vec3 T = exp(-tau);
  vec3 inscat = sampleSkyLUT(uSkyLUT, rd, uSunElev, uSunAzi) * uSkyScale * (1.0 - T) * uHazeStrength;
  // the sun's glow bleeding through the air in front of the land
  float mu = dot(rd, uSunDir);
  inscat += sunTransmittance() * uSunIrradiance * 0.03 * pow(saturate(mu), 20.0) * (1.0 - T) * uHazeStrength;
  return color * T + inscat;
}
vec3 skyNoAtmosphere(vec3 rd){
  float t = saturate(rd.y * 0.5 + 0.5);
  return mix(vec3(0.55, 0.60, 0.66), vec3(0.14, 0.22, 0.36), pow(t, 0.8));
}
vec3 rayDirection(vec2 uv, vec2 res){
  vec2 p = (uv * res * 2.0 - res) / res.y;
  return normalize(uCamFwd + uCamRight * (p.x * uTanHalfFov) + uCamUp * (p.y * uTanHalfFov));
}

// ---------------------------------------------------------------- land
vec3 shadeTerrain(vec3 p, vec3 rd, float dist, float quality){
  float aoBaked = texture(uTerrain, clamp(p.xz / uTerrainSize + 0.5, 0.0, 1.0)).b;
  vec3 n = terrainNormal(p, dist);
  if (uStage[2] < 1.0){
    n = normalize(mix(vec3(0.0, 1.0, 0.0), n, smoothstep(0.0, 0.35, uStage[2])));
  }
  float matId;
  Material m = materialAt(p, n, dist, matId);
  if (uStage[3] < 1.0){
    float w = smoothstep(0.0, 0.5, uStage[3]);
    m.albedo = mix(srgbToLinear(vec3(0.42, 0.40, 0.37)), m.albedo, w);
    m.roughness = mix(0.85, m.roughness, w);
  }
  float ndl = saturate(dot(n, uSunDir));
  vec3 sunE = sunTransmittanceAt(p.y) * uSunIrradiance;
  float sh = 1.0, cs = 1.0;
  if (uStage[3] > 0.001){
    sh = mix(1.0, shadowTerrain(p, uSunDir), smoothstep(0.0, 0.6, uStage[3]));
    cs = mix(1.0, cloudShadow(p, uSunDir), smoothstep(0.0, 0.6, uStage[3]));
  }
  vec3 ambRad;
  float ao = mix(1.0, aoBaked, smoothstep(0.0, 0.5, uStage[3]));
  vec3 skyE = skyIrradiance(n, ao, ambRad);
  if (uStage[3] < 1.0) skyE *= mix(0.06, 1.0, smoothstep(0.0, 0.45, uStage[3]));
  vec3 col = m.albedo / PI * (sunE * ndl * sh * cs + skyE);
  // a specular sheen: snow, wet rock and smooth stone should not read as paint.
  // F0 = 0.04 (dielectric), raised where the material is wet or icy.
  vec3 f0 = vec3(mix(0.012, 0.05, saturate(m.spec * 4.0)));
  float rough = max(m.roughness, 0.06);
  vec3 spec = specularGGX(n, uSunDir, -rd, rough, f0);
  col += sunE * spec * sh * cs * ndl;
  return col;
}

// ---------------------------------------------------------------- debug
vec3 ramp(float t){
  t = saturate(t);
  vec3 a = vec3(0.05, 0.07, 0.12);
  vec3 b = vec3(0.16, 0.46, 0.86);
  vec3 c = vec3(0.92, 0.78, 0.32);
  vec3 d = vec3(0.98, 0.34, 0.24);
  return t < 0.5 ? mix(a, b, t * 2.0) : mix(c, d, saturate((t - 0.5) * 2.0));
}
vec3 normalColor(vec3 n){ return n * 0.5 + 0.5; }
vec3 sampleSkyLUTRaw(vec2 uv){ return texture(uSkyLUT, uv).rgb * uSkyScale; }

// ---------------------------------------------------------------- main
void main(){
  vec2 uv = gl_FragCoord.xy / uRenderRes;
  vec2 screen = gl_FragCoord.xy;
  vec3 rd = rayDirection(uv, uRenderRes);
  vec3 ro = uCamPos;
  float quality = uQuality;
  // blue-noise jitter: the same cost as a hash but it turns marcher banding into
  // fine-grained noise that vanishes under the tonemap and the temporal wobble
  float jitter = texture(uNoise, screen / 64.0 + vec2(uFrameJitter, 0.0)).r;

  bool showSky = uStage[4] > 0.001;
  bool showTerrain = uStage[1] > 0.001;
  bool showWater = uStage[5] > 0.001;
  bool showClouds = uStage[7] > 0.001;

  vec3 skyCol = showSky ? skyRadiance(rd) : skyNoAtmosphere(rd);
  if (showSky && uStage[4] < 1.0) skyCol = mix(skyNoAtmosphere(rd), skyCol, smoothstep(0.0, 0.4, uStage[4]));

  vec3 cloudCol = vec3(0.0);
  float cloudAlpha = 0.0;
  if (showClouds && rd.y > -0.02){
    cloudCol = cloudRadiance(ro, rd, jitter, quality, cloudAlpha);
  }
  vec3 skyWithClouds = skyCol * (1.0 - cloudAlpha) + cloudCol;

  // ---------- land
  float tTerrain = -1.0;
  vec3 pTerrain = vec3(0.0);
  if (showTerrain) marchTerrain(ro, rd, 26000.0, quality, tTerrain, pTerrain);
  bool landVisible = tTerrain > 0.0 && pTerrain.y > uSeaLevel;

  // ---------- sea
  float tWater = -1.0;
  if (showWater && rd.y < -1e-5){
    float tw = (uSeaLevel - ro.y) / rd.y;
    if (tw > 0.0) tWater = tw;
  }
  bool waterVisible = tWater > 0.0 && (!(tTerrain > 0.0) || tWater < tTerrain ||
                                       (tTerrain > 0.0 && pTerrain.y <= uSeaLevel));

  vec3 col = skyWithClouds;
  float depth = 1e9;
  if (landVisible){
    vec3 landCol = aerial(shadeTerrain(pTerrain, rd, tTerrain, quality), ro, rd, tTerrain, quality);
    col = landCol; depth = tTerrain;
  }
  if (waterVisible && tWater < depth){
    vec3 wcol = waterShade(ro, rd, tWater, tWater, quality);
    col = aerial(wcol, ro, rd, tWater, quality);
    depth = tWater;
  }

  // ---------- debug views
  if (uView > 0){
    vec3 dbg = col;
    bool isWater = waterVisible && tWater <= (landVisible ? tTerrain : 1e9);
    bool isLand = landVisible && !isWater;
    if (uView == 1) dbg = rd * 0.5 + 0.5;
    else if (uView == 2){
      float d = min(depth, 14000.0);
      dbg = depth > 1e8 ? vec3(0.012) : mix(vec3(0.95, 0.88, 0.72), vec3(0.06, 0.09, 0.16), d / 14000.0);
    }
    else if (uView == 3){
      if (isLand) dbg = normalColor(terrainNormal(pTerrain, tTerrain));
      else if (isWater) dbg = normalColor(waterNormal(ro + rd * tWater, tWater, uWind, tWater, quality));
      else dbg = vec3(0.04, 0.05, 0.07);
    }
    else if (uView == 4){
      if (isLand){
        vec3 n = terrainNormal(pTerrain, tTerrain);
        float slope = 1.0 - n.y;
        float matId;
        materialAt(pTerrain, n, tTerrain, matId);
        dbg = saturate(vec3(1.0 - slope * 4.5, saturate(1.0 - (pTerrain.y - uSeaLevel) / 1600.0), matId * 0.32));
      } else dbg = vec3(0.03);
    }
    else if (uView == 5){
      if (isLand) dbg = vec3(shadowTerrain(pTerrain, uSunDir) * cloudShadow(pTerrain, uSunDir));
      else if (isWater) dbg = vec3(shadowTerrain(ro + rd * tWater, uSunDir) * cloudShadow(ro + rd * tWater, uSunDir));
      else dbg = vec3(0.05);
    }
    else if (uView == 6){
      float d = min(depth, 60000.0);
      float y1 = max(ro.y + rd.y * d, 0.0);
      float intR = abs(rd.y) < 1e-4 ? d * exp(-ro.y / uHr)
                 : uHr / abs(rd.y) * abs(exp(-max(ro.y, 0.0) / uHr) - exp(-y1 / uHr));
      dbg = ramp(intR / 9000.0);
    }
    else if (uView == 7){
      if (isWater){
        float d = max(uSeaLevel - terrainHeight((ro + rd * tWater).xz), 0.0);
        dbg = ramp(1.0 - d / 60.0);
      } else dbg = vec3(0.03);
    }
    else if (uView == 8){
      if (isWater){
        vec3 p = ro + rd * tWater;
        vec3 n = waterNormal(p, tWater, uWind, tWater, quality);
        float f0 = 0.0204;
        float cosT = saturate(dot(n, -rd));
        dbg = vec3(f0 + (1.0 - f0) * pow5(1.0 - cosT));
      } else dbg = vec3(0.03);
    }
    else if (uView == 9){
      vec3 q = vec3(ro.x, (uCloudBase + uCloudTop) * 0.5, ro.z) + rd * 9000.0;
      float d = cloudDensity(q, cloudWeather(q.xz, uTime), 1.0);
      dbg = vec3(d) * vec3(1.0, 1.08, 1.22);
      if (!showClouds) dbg = vec3(0.03);
    }
    else if (uView == 10){
      if (isWater){
        vec3 p = ro + rd * tWater;
        float depth2 = max(uSeaLevel - terrainHeight(p.xz), 0.0);
        float depthMask = smoothstep(3.0, 0.2, depth2);
        dbg = vec3(smoothstep(0.3, 0.8, fbmv2(p.xz * 0.32, 3, 2.1, 0.5)) * depthMask);
      } else dbg = vec3(0.03);
    }
    else if (uView == 11){
      // stage stack readout
      float x = gl_FragCoord.x / uRenderRes.x;
      float y = 1.0 - gl_FragCoord.y / uRenderRes.y;
      int idx = int(floor(x * 9.0));
      float on = uStage[idx];
      dbg = mix(vec3(0.05, 0.05, 0.07), vec3(0.95, 0.72, 0.35), step(y, 0.14 + 0.66 * on));
    }
    else if (uView == 22){
      // how far the march's hit point sits above (white) or below (black) the height
      // field it is supposed to be on: 0.5 means exactly on the surface
      if (isLand) dbg = vec3(saturate((pTerrain.y - terrainHeight(pTerrain.xz)) / 60.0 + 0.5));
      else dbg = vec3(0.05);
    }
    else if (uView == 23){
      // first shadow sample: height clearance at 8 m along the sun ray
      if (isLand){
        vec3 q = pTerrain + uSunDir * 8.0;
        dbg = vec3(saturate((q.y - terrainHeight(q.xz)) / 40.0 + 0.5));
      } else dbg = vec3(0.05);
    }
    else if (uView == 24){
      // the sky exactly as the view ray sees it: no clouds, no haze. Sky tuning needs
      // this, because with clouds or haze on it is impossible to tell which term moved.
      dbg = skyRadiance(rd);
    }
    else if (uView == 25){
      // cloud-only: what the cloud march contributes on this ray (0 = no cloud)
      dbg = cloudCol;
    }
    else if (uView == 26){
      // multiple-scattering term on its own, so its magnitude can be judged directly
      dbg = msAccumulator;
    }
    else if (uView == 32){
      // the ambient integrator, pulled apart: R = skyIrradiance(n)/pi in the red channel,
      // G = skyRadiance(up), B = the baked sky occlusion. These three numbers are what the
      // land is lit by in shadow, and reading them apart is the only way to tell a dark
      // material from a broken integrator.
      vec3 n2 = isLand ? terrainNormal(pTerrain, tTerrain) : vec3(0.0, 1.0, 0.0);
      vec3 amb3;
      vec3 E3 = skyIrradiance(n2, 1.0, amb3);
      float ao3 = isLand ? texture(uTerrain, clamp(pTerrain.xz / uTerrainSize + 0.5, 0.0, 1.0)).b : 1.0;
      dbg = vec3(E3.r / PI, skyRadiance(vec3(0.0, 1.0, 0.0)).g, ao3);
    }
    else if (uView == 30){
      // the cloud weather map, sampled exactly as the cloud march samples it: R is the raw
      // field, G the coverage remap. Flat grey means the map or the tile size is wrong.
      vec2 wp = screen / uRenderRes;
      vec2 xz = ro.xz + (wp - 0.5) * 120000.0;
      vec2 w = cloudWeather2(xz, uTime);
      float cov = cloudWeather(xz, uTime);
      dbg = vec3(w.x, cov, w.y);
    }
    else if (uView == 31){
      // the 3D shape volume sampled at the cloud layer, straight: R = g channel,
      // G = a channel, B = 0. A flat colour means the volume bake or the sampler is dead.
      vec2 wp = screen / uRenderRes;
      vec3 q = vec3(ro.x + (wp.x - 0.5) * 30000.0, (uCloudBase + uCloudTop) * 0.5, ro.z + (wp.y - 0.5) * 30000.0);
      vec3 pl = q / uCloudUnit;
      vec4 nb = noiseAt(uNoiseAtlas, pl);
      vec4 nd = noiseAt(uNoiseAtlasDetail, pl * (uCloudUnit / uCloudDetailUnit));
      dbg = vec3(nb.g, nb.a, nd.b);
    }
    else if (uView == 28){
      // the water's reflection term on its own (what the surface mirrors)
      dbg = isWater ? waterDbgRefl : vec3(0.03);
    }
    else if (uView == 29){
      // the water's body term (what comes up from under the surface) and F in B
      dbg = isWater ? vec3(waterDbgBody.r, waterDbgBody.g, waterDbgF) : vec3(0.03);
    }
    else if (uView == 27){
      // live values: R = tWater/2000, G = tTerrain/2000, B = -rd.y. A black channel means
      // "no hit at all", which tells apart a missing plane from a plane that is shaded dark.
      dbg = vec3(saturate(tWater / 2000.0), saturate(tTerrain / 2000.0), saturate(-rd.y));
    }
    else if (uView == 21){
      // raw sky samples used by the ambient: zenith in R, horizon in G, opposite in B
      vec3 n2 = isLand ? terrainNormal(pTerrain, tTerrain) : vec3(0.0, 1.0, 0.0);
      dbg = vec3(skyRadiance(vec3(0.0, 1.0, 0.0)).r,
                 skyRadiance(normalize(vec3(max(n2.x, 0.001), 0.07, max(n2.z, 0.001)))).g,
                 skyRadiance(vec3(0.0, 1.0, 0.0)).b);
    }
    else if (uView == 19){
      // shadow term at the hit point (1 = fully lit)
      if (isLand) dbg = vec3(shadowTerrain(pTerrain, uSunDir) * cloudShadow(pTerrain, uSunDir));
      else if (isWater) dbg = vec3(shadowTerrain(ro + rd * tWater, uSunDir) * cloudShadow(ro + rd * tWater, uSunDir));
      else dbg = vec3(0.05);
    }
    else if (uView == 20){
      // sky irradiance at the hit point, over pi, and N.L in the second channel
      if (isLand || isWater){
        vec3 n2 = isLand ? terrainNormal(pTerrain, tTerrain) : waterNormal(ro + rd * tWater, tWater, uWind, tWater, quality);
        vec3 amb2;
        vec3 E2 = skyIrradiance(n2, 1.0, amb2);
        dbg = vec3(E2.r / PI, E2.g / PI, saturate(dot(n2, uSunDir)));
      } else dbg = vec3(0.05);
    }
    else if (uView == 17){
      // albedo of whatever the ray hit: the quickest way to see whether the materials
      // are being chosen as intended
      if (isLand){
        vec3 n = terrainNormal(pTerrain, tTerrain);
        float mid;
        Material mm = materialAt(pTerrain, n, tTerrain, mid);
        dbg = mm.albedo * 2.2;
      } else if (isWater){
        vec3 pw = ro + rd * tWater;
        float mid;
        Material bm = materialAt(pw + vec3(0.0, -6.0, 0.0), vec3(0.0, 1.0, 0.0), 60.0, mid);
        dbg = bm.albedo * 2.2;
      } else dbg = vec3(0.03);
    }
    else if (uView == 18){
      // slope ramp: 0 = flat (dark), 0.5 = 45 degrees (red)
      if (isLand){
        vec3 n = terrainNormal(pTerrain, tTerrain);
        dbg = ramp((1.0 - n.y) * 2.0);
      } else dbg = vec3(0.03);
    }
    else if (uView == 16){
      // Top-down map of the whole tile: shaded relief with the sea in blue. Used to
      // choose camera positions, and to check the coastline at a glance.
      vec2 f = screen / uRenderRes;
      vec2 wp = (f - 0.5) * uTerrainSize;
      // relief shading must span more than one texel or the map shows the mesh instead of
      // the mountain
      float e2 = 2.0 * uTerrainTexel;
      float h0 = terrainHeight(wp);
      float hx = terrainHeight(wp + vec2(e2, 0.0));
      float hz = terrainHeight(wp + vec2(0.0, e2));
      vec3 nn = normalize(vec3(h0 - hx, e2 * 1.2, h0 - hz));
      vec3 ld = normalize(vec3(-0.55, 0.7, -0.45));
      float lam = saturate(dot(nn, ld)) * 0.75 + 0.25;
      vec3 landCol;
      if (h0 > 900.0) landCol = mix(vec3(0.45, 0.42, 0.40), vec3(0.92, 0.93, 0.95), smoothstep(900.0, 1500.0, h0));
      else if (h0 > 120.0) landCol = mix(vec3(0.20, 0.24, 0.14), vec3(0.45, 0.40, 0.32), smoothstep(120.0, 900.0, h0));
      else landCol = mix(vec3(0.72, 0.66, 0.50), vec3(0.28, 0.34, 0.20), smoothstep(3.0, 60.0, h0));
      if (h0 < uSeaLevel){
        float dep = uSeaLevel - h0;
        landCol = mix(vec3(0.35, 0.62, 0.70), vec3(0.02, 0.05, 0.22), smoothstep(0.0, 500.0, dep));
      }
      dbg = landCol * lam * 1.25;
      // thin grid every km for orientation
      vec2 g = abs(fract(wp / 1000.0 + 0.5) - 0.5) / (e2 / 1000.0);
      dbg *= mix(1.0, 0.75, saturate(1.0 - min(g.x, g.y)));
    }
    else if (uView == 15){
      // vertical cross-section through the cloud layer: 6 km wide, 3.2 km tall, centred
      // on the camera. This is the view that shows whether the shape reads as cumulus.
      vec2 f = screen / uRenderRes;
      float x = (f.x - 0.5) * 6000.0 + ro.x;
      float y = 900.0 + (f.y - 0.5) * 3200.0;
      float d = cloudDensity(vec3(x, y, ro.z), cloudWeather(vec2(ro.x, ro.z), uTime), 1.0);
      dbg = vec3(d) * vec3(1.0, 1.05, 1.15);
    }
    else if (uView == 13){
      // optical thickness of the cloud slab along the view ray (diagnostic)
      float alpha2 = 0.0;
      vec3 cl = cloudRadiance(ro, rd, jitter, quality * 0.4, alpha2);
      dbg = vec3(-log(max(1.0 - alpha2, 1e-4)) * 0.22);
    }
    else if (uView == 14){
      // a horizontal slice through the slab, mapped from world coordinates:
      // 1 km per 64 px, centred on the camera. Tileable, so seams would show here.
      vec2 wp = ro.xz + (screen / uRenderRes - 0.5) * 6000.0;
      float d = cloudDensity(vec3(wp.x, (uCloudBase + uCloudTop) * 0.45, wp.y), cloudWeather(wp, uTime), 1.0);
      dbg = vec3(d);
    }
    else if (uView == 12){
      // the sky lookup itself, drawn in its own coordinates
      vec2 lutUv = vec2(fract(screen.x / uRenderRes.x * 2.0), fract(screen.y / uRenderRes.y * 2.0));
      dbg = sampleSkyLUTRaw(lutUv);
    }
    col = mix(col, dbg, uDebugMix);
  }
  outColor = vec4(max(col, vec3(0.0)), 1.0);
}
`;
})();
