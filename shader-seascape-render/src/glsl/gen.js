/* GLSL chunk: the one-off generation passes — the height field, its erosion
   relaxation, the baked sky occlusion, the 3D noise atlas and the sky lookup table.
   These run at load time (and again when the sun moves for the LUT). */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});
  var GLSL = (SS.GLSL = SS.GLSL || {});

  GLSL.heightPack = `
const float H_LO = -1600.0;
const float H_HI = 4200.0;
vec2 packH(float h){
  float v = saturate((h - H_LO) / (H_HI - H_LO));
  float r = floor(v * 255.0) / 255.0;
  float g = v * 255.0 - floor(v * 255.0);
  return vec2(r, g);
}
float unpackH(vec4 t){ return (t.r + t.g * (1.0/255.0)) * (H_HI - H_LO) + H_LO; }
`;

  GLSL.terrainBaseShader = GLSL.common + GLSL.heightPack + `
uniform vec2 uRes;
uniform float uTerrainSize;
uniform float uPlainH;       // height of the coastal plain, metres
uniform float uSeaDepth;     // depth just off the shore, metres
uniform float uRelief;       // vertical scale of the mountains
uniform float uRidgeGain;
uniform float uRidgeMix;
uniform float uCliff;        // height of the rocky step at the waterline
uniform float uIslandH;      // how tall islands may grow offshore
uniform float uMassifBias;
uniform float uSeed;
uniform float uSink;         // global drop; this is the knob the sea-level rise turns
out vec4 outColor;

// Ridged fbm on a rotating lattice: a range grows along one direction instead of
// becoming isotropic blobs. Two systems at different angles are blended later.
/* A ridge field with a slope budget. The steepest thing a fractal can make is its
   highest octave, so the amplitude of each octave has to fall faster than its frequency
   rises: four octaves at gain 0.42 leaves the 1 km wavelengths carrying a fifth of the
   amplitude of the 8 km ones, which erodes into ridges instead of needles. */
float ridgeSystem(vec2 q, float seed, float period){
  float r = 0.0, a = 0.5, norm = 0.0;
  for (int i = 0; i < 4; i++){
    r += a * ridged2(q, 1, 2.0, 0.5, period);
    norm += a;
    q = rot2(0.7 + seed) * q * 2.03 + 17.3;
    a *= 0.42;
  }
  return r / max(norm, 1e-5);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (uv - 0.5) * uTerrainSize;
  vec2 q = p * 0.00042 + uSeed;

  // ---- the coastline -------------------------------------------------------
  // Everything is expressed as a function of the signed distance to one smooth curve, so
  // the result reads as a coast instead of a noise field. The line runs from a cape in the
  // west, north around a wide bay, out to a second cape in the east: land to the north,
  // open water to the south, and a bay that puts water deep into the mountains.
  float wig = fbm2(vec2(p.x * 0.00019, 7.3), 3, 2.0, 0.5, 4096.0) * 0.5 + 0.5;
  float shore = -520.0 + p.x * 0.14 + (wig - 0.5) * 1300.0
              + 2300.0 * exp(-pow((p.x - 1500.0) / 2300.0, 2.0))     // the bay
              - 1300.0 * exp(-pow((p.x + 3400.0) / 1500.0, 2.0))     // west cape
              - 1050.0 * exp(-pow((p.x - 6300.0) / 1600.0, 2.0));    // east cape
  float d = p.y - shore;                 // + inland, - offshore

  // ---- land ---------------------------------------------------------------
  float ridgeA = ridgeSystem(q, uSeed, 4096.0);
  float ridgeB = ridgeSystem(q * 0.63 + 5.1, uSeed + 2.6, 4096.0);
  float ridge = mix(ridgeA, max(ridgeA, ridgeB * 0.93), uRidgeMix);
  float macro = fbm2(q * 0.30 + 3.3, 3, 2.02, 0.5, 4096.0);
  float baseT = fbm2(q * 1.25 + 11.7, 4, 2.05, 0.5, 4096.0);
  float massif = smoothstep(uMassifBias, uMassifBias + 0.42, macro * 0.5 + 0.5);
  // ranges rise a little way inland and keep growing away from the coast, so the coast is
  // a strip of plain with cliffs rather than a wall of mountain
  float inland = smoothstep(500.0, 3200.0, d);
  // ridge^2 doubles the contrast of an already creased field, which turns every ridge into
  // a needle once it is drawn at a distance. 1.35 keeps the creases and the peaks.
  float mountain = pow(ridge, 1.35) * uRidgeGain * uRelief * massif * inland;
  float rolling = (baseT - 0.45) * 0.16 * uRelief * (0.35 + 0.65 * inland)
                + (fbm2(q * 3.4 + 61.7, 2, 2.0, 0.42, 4096.0) - 0.5) * 0.035 * uRelief * (0.3 + 0.7 * inland);

  // ---- river valleys ------------------------------------------------------
  // The low lines between the ridges are where water collects, so they are cut down; the
  // cut deepens towards the coast because that is where a river reaches its base level.
  // A rising sea level floods the coastal ends of these valleys first, which is what makes
  // the bays and the peninsulas.
  float lowLine = 1.0 - smoothstep(0.34, 0.68, ridgeA * 0.35 + ridgeB * 0.25
                                  + (fbm2(q * 0.85 + 77.1, 3, 2.0, 0.45, 4096.0) * 0.5 + 0.5) * 0.55);
  float downcut = lowLine * smoothstep(5200.0, -600.0, d)
                * (0.55 * (mountain + rolling * 0.6) + 70.0 * (1.0 - smoothstep(0.0, 4200.0, d)));

  // beach, then shore platform, then the plain. The blend from sea to land happens inside
  // +/- 150 m of the coast line, which is what makes the waterline crisp.
  float land = uPlainH
             + smoothstep(-150.0, 200.0, d) * 12.0
             + uCliff * smoothstep(-40.0, 420.0, d) * (0.35 + 0.65 * baseT)
             + (fbm2(q * 6.5 + 51.3, 3, 2.0, 0.5, 4096.0) - 0.5) * 7.0 * smoothstep(0.0, 3000.0, d)
             + rolling + mountain - downcut;
  land += (fbm2(q * 4.2 + 41.1, 3, 2.0, 0.5, 4096.0) - 0.5) * 5.0 * smoothstep(450.0, 0.0, abs(d - 250.0));

  // ---- sea floor ----------------------------------------------------------
  // A shelf out to about 3 km, then the slope, then the deep basin. The drowned valley
  // lines stay low, so they read as channels running out of the bay.
  float offshore = saturate(-d / 12000.0);
  float seabed = -uSeaDepth - smoothstep(200.0, 3000.0, -d) * 90.0
               - offshore * offshore * 1400.0
               + (fbm2(q * 2.6 + 21.3, 3, 2.0, 0.5, 4096.0) - 0.5) * 14.0
               - lowLine * 45.0 * smoothstep(9000.0, 1200.0, -d);

  // ---- islands ------------------------------------------------------------
  // Only well offshore, and only where a broad massif says so: an island field tied to the
  // coast turns the whole shelf into a rash of pinnacles, which is what it used to do.
  float islandField = smoothstep(0.55, 0.78, macro * 0.5 + 0.5) * smoothstep(0.40, 0.70, ridgeA);
  float islandBand = smoothstep(1800.0, 4200.0, -d) * (1.0 - smoothstep(8000.0, 11500.0, -d));
  seabed += (islandField * uIslandH - uSeaDepth * 1.2) * islandBand;

  float h = mix(seabed, land, smoothstep(-160.0, 150.0, d));
  h -= uSink;

  if (uv.x < 0.0015 || uv.y < 0.0015 || uv.x > 0.9985 || uv.y > 0.9985) h = -2400.0;
  outColor = vec4(packH(h), 0.0, 1.0);
}
`;

  GLSL.erodeShader = GLSL.common + GLSL.heightPack + `
uniform vec2 uRes;
uniform sampler2D uSrc;
uniform float uTalus;          // max slope before a cliff is considered unstable (m per m)
uniform float uTalusAmount;
uniform float uBlur;
uniform float uCarve;
uniform float uTalusRef;
uniform float uFirstPass;      // 1 on the first relaxation pass only
uniform float uTerrainSize;
out vec4 outColor;
float hAt(vec2 uv){ return unpackH(texture(uSrc, uv)); }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 texel = 1.0 / uRes;
  float dx = uTerrainSize / uRes.x;
  float h = hAt(uv);
  float hn[8];
  vec2 offs[8];
  offs[0] = vec2( 1.0, 0.0); offs[1] = vec2(-1.0, 0.0); offs[2] = vec2(0.0,  1.0); offs[3] = vec2(0.0, -1.0);
  offs[4] = vec2( 1.0, 1.0); offs[5] = vec2(-1.0, 1.0); offs[6] = vec2(1.0, -1.0); offs[7] = vec2(-1.0, -1.0);
  float mean = 0.0;
  float drop = 0.0;      // how much material this texel owes its lower neighbours
  float gain = 0.0;      // and how much its higher neighbours owe it back
  for (int i = 0; i < 8; i++){
    hn[i] = hAt(uv + offs[i] * texel);
    mean += hn[i];
    float dist = length(offs[i]) * dx;
    // metres of height above the angle-of-repose line, for each side of the pair
    float dn = max(0.0, (h - hn[i]) / dist - uTalus) * dist;
    float up = max(0.0, (hn[i] - h) / dist - uTalus) * dist;
    drop += dn;
    gain += up;
  }
  mean /= 8.0;
  // Every term below is written so that one pass does the same thing to the *shape* at any
  // tile resolution. That is not automatic: mean is a difference over one texel, so a
  // fixed diffusion weight smooths four times as much ground at 512 as at 2048 - which is
  // how this pass used to turn the same height field into rolling hills at one resolution
  // and a field of needles at the other.
  float ref = uTalusRef / 32.0;                 // 1.0 when a texel is 32 m
  // 1. thermal: scree piles up until the slope reaches the angle of repose, then it runs
  // off. This has to be a *transfer*. An earlier version subtracted the excess from every
  // texel that had a steep neighbour in either direction, which is a mass sink: it lowers
  // peaks and valley floors alike, and twenty-six passes of it deleted the whole range and
  // left a plain. Both sides of each pair now move by the same number of metres, so what
  // leaves a peak arrives at its neighbour. Removing excess*dx metres lowers the slope by
  // exactly excess, which is resolution-free.
  // Half of each gap closes from this side, and only a fraction of that per pass: anything
  // larger overshoots, and an overshooting thermal pass does not smooth the field, it
  // churns it - the material ends up on the shelf and the sea disappears.
  float newH = h - 0.5 * (drop - gain) * uTalusAmount;
  // 2. a touch of diffusion kills the high frequency spikes the noise left behind.
  // A Laplacian step scales with the texel area, so the weight goes as 1/dx^2.
  newH = mix(newH, mean, clamp(uBlur / max(ref * ref, 1e-4), 0.0, 0.4));
  // 3. fluvial incision: concave spots (valleys) deepen, convex ridges are left alone.
  // Applied every pass this is a runaway - carving a valley increases the concavity it is
  // read from, so twenty-six passes of it levelled the whole range to a few metres above
  // the sea and left only the convex ridge lines poking out, which is exactly the field of
  // needles this terrain used to render. It is an incision on the raw field: one pass,
  // capped, then the thermal pass shapes what it left behind.
  if (uFirstPass > 0.5) {
    float concavity = max(mean - h, 0.0);
    float cut = min(concavity * uCarve / max(ref, 1e-3), 0.25 * (drop + gain));
    newH -= cut;
  }
  newH = clamp(newH, H_LO, H_HI);
  outColor = vec4(packH(newH), texture(uSrc, uv).b, texture(uSrc, uv).a);
}
`;

  GLSL.aoBakeShader = GLSL.common + GLSL.heightPack + `
uniform vec2 uRes;
uniform sampler2D uSrc;
uniform float uTerrainSize;
uniform float uAoStrength;
out vec4 outColor;
float hAt(vec2 uv){ return unpackH(texture(uSrc, uv)); }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 texel = 1.0 / uRes;
  float h0 = hAt(uv);
  float occl = 0.0;
  // 6 directions x 3 radii: the classic height-field horizon estimate
  for (int i = 0; i < 6; i++){
    float a = (float(i) + 0.5) * (6.2831853 / 6.0);
    vec2 dir = vec2(cos(a), sin(a)) * texel;
    float maxTan = 0.0;
    for (int j = 0; j < 3; j++){
      float r = exp2(float(j)) * 3.0;
      float dh = hAt(uv + dir * r) - h0;
      maxTan = max(maxTan, dh / (r * uTerrainSize / uRes.x));
    }
    occl += saturate(maxTan * uAoStrength);
  }
  occl = 1.0 - occl / 6.0;
  float h = h0;
  float hardness = texture(uSrc, uv).a;
  vec4 src = texture(uSrc, uv);
  outColor = vec4(src.rg, saturate(occl), src.a);
}
`;

  // One 128^3 noise volume, written slice by slice into a 3D texture. Every lattice
  // period divides 64, so the volume wraps seamlessly in all three axes and the
  // hardware's trilinear filtering does the rest.
  //   R  inverted Worley  -> rounded cauliflower puffs
  //   G  base fbm         -> the cloud shape
  //   B  detail fbm       -> the erosion that eats the edges
  //   A  billow           -> soft lumps for the anvil tops
  GLSL.volumeShader = GLSL.common + `
uniform vec2 uRes;
uniform float uZ;        // lattice z of this slice
uniform float uSeed;
out vec4 outColor;
void main(){
  vec3 q = vec3(gl_FragCoord.xy / uRes * 64.0, uZ) + uSeed;
  if (uSeed < 1.0){
    float base = tileFbm3(q, 16.0, 4, 0.5, 64.0);
    float billow = (1.0 - abs(tileFbm3(q, 8.0, 3, 0.5, 64.0) * 2.0 - 1.0)) * 0.7 + 0.15;
    outColor = vec4(base, base, billow, billow);
  } else {
    float worley = saturate(1.0 - worley3(q * (1.0 / 8.0), 0.9, 8.0) * 1.3);
    float detail = tileFbm3(q, 4.0, 3, 0.55, 64.0);
    outColor = vec4(worley, detail, detail, worley);
  }
}
`;

  // The cloud "weather": how much cloud the sky wants to make, over a 160 km square.
  // Baking it into a texture instead of evaluating fbm per march step is both faster and
  // more correct: the field no longer moves with the ray.
  GLSL.weatherShader = GLSL.common + `
uniform vec2 uRes;
uniform float uWeatherTile;   // world metres across the texture
out vec4 outColor;
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (uv - 0.5) * uWeatherTile;
  vec2 q = p / 26000.0;
  float a = fbm2(q, 4, 2.02, 0.5, 4096.0) * 0.5 + 0.5;
  float b = fbm2(q * 0.31 + 4.7, 3, 2.0, 0.5, 4096.0) * 0.5 + 0.5;
  float w = mix(a, b, 0.4);
  // a second, coarser channel drives the anvil/tower height
  float t = fbm2(q * 0.62 - 9.1, 3, 2.0, 0.5, 4096.0) * 0.5 + 0.5;
  outColor = vec4(w, t, 0.0, 1.0);
}
`;

  GLSL.blueNoiseShader = GLSL.common + `
uniform vec2 uRes;
uniform sampler2D uSrc;
out vec4 outColor;
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  outColor = vec4(texture(uSrc, uv).r, 0.0, 0.0, 1.0);
}
`;
})();
