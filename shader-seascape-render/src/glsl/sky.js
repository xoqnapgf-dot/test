/* GLSL chunk: atmosphere. Flat-atmosphere single scattering with a cheap second-order
   term, baked into two lookups:
     uSkyLUT   256 x 128  radiance of the sky for (azimuth relative to the sun, elevation)
     uSunTrans  64 x  32  transmittance along the sun ray for (elevation, height above sea)
   Rayleigh / Mie / ozone constants are the standard sea-level values used in real-time
   atmospheric rendering (beta_R after Bruneton; ozone as a Gaussian slab near 25 km). */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});
  var GLSL = (SS.GLSL = SS.GLSL || {});

  GLSL.atmoParams = `
uniform vec3  uBetaR;          // Rayleigh scattering coefficient, 1/m
uniform vec3  uBetaM;          // Mie scattering coefficient per channel, 1/m
uniform float uMieTint;        // 0 = grey aerosol, 1 = full angstrom wavelength dependence
uniform float uMieG;           // Henyey-Greenstein asymmetry (aerosols)
uniform float uHr;             // Rayleigh scale height, m
uniform float uHm;             // Mie scale height, m
uniform float uOzone;          // ozone absorption multiplier
uniform vec3  uSunDir;         // unit vector towards the sun
uniform float uSunIrradiance;  // irradiance of the direct sun on a perpendicular surface
uniform float uSunDiskIntensity; // radiance of the solar disk (aesthetic: HDR headroom)
uniform float uSkyScale;       // multiplier on the baked sky radiance
uniform float uMultiScatter;   // second-order in-scatter strength
uniform float uSkyQuality;
uniform sampler2D uSkyLUT;
uniform sampler2D uSunTrans;
// Ozone (Chappuis band): absorption peaks in the green-orange. The real zenith optical
// depth is only ~0.03, and it is what keeps a twilight sky blue instead of cream. Units
// here are per metre of "unit density" integrated over the slab below.
const vec3 BETA_OZONE = vec3(0.650, 1.881, 0.085) * 0.22e-6;
const float MIE_EXTINCTION = 1.11;
const float SUN_SOLID_ANGLE = 6.8e-5;   // sr, the solar disk
`;

  GLSL.atmo = `
float ozoneDensity(float y){
  float d = (y - 25000.0) / 15000.0;
  return exp(-d*d) * uOzone;
}

// Length of the path through an exponential layer of scale height H, along a ray that
// leaves a point at height h0 with vertical direction sinAlt.
//
//   plane parallel:  H * exp(-h0/H) / sinAlt        (exact, but it diverges at the horizon)
//   curvature cap :  Kasten & Young (1989) relative airmass
//                    m = 1 / (sin h + 0.50572 (h_deg + 6.07995)^-1.6364)
//
// The plane-parallel form is what the earlier version was trying to march towards with a
// handful of exponentially-growing steps, and it fell ~2.5x short at low sun angles, so
// the direct beam never reddened and every sunset came out grey. This is exact for the
// vertical case, matches Kasten-Young near the horizon, and costs nothing.
float expSlant(float sinAlt, float h0, float H){
  float s = max(sinAlt, 2.0e-4);
  float hdeg = degrees(asin(clamp(sinAlt, -1.0, 1.0)));
  float m = 1.0 / (s + 0.50572 * pow(max(hdeg + 6.07995, 0.05), -1.6364));
  m = min(m, 1.0 / s);                       // never longer than the plane-parallel path
  m = clamp(m, 1.0, 40.0);                   // Kasten-Young leaves its range under h < -6
  return H * exp(-max(h0, 0.0) / H) * m;
}

// Ozone is a gaussian shell at 25 km rather than an exponential, so it does need a march -
// but the march only has to cover the shell, not the whole column.
float ozoneSlant(float sinAlt, float h0){
  float s = max(sinAlt, 2.0e-4);
  float c = 0.0, dt = 1200.0, sum = 0.0;
  for (int i = 0; i < 18; i++){
    float y = max(h0 + s * (c + dt * 0.5), 0.0);
    sum += ozoneDensity(y) * dt;
    c += dt; dt *= 1.32;
    if (c > 900000.0) break;
  }
  // the marching path leaves the shell quickly; scale the remainder with the same
  // airmass factor the exponential species use
  float hdeg = degrees(asin(clamp(sinAlt, -1.0, 1.0)));
  float m = 1.0 / (max(s, 0.02) + 0.50572 * pow(max(hdeg + 6.07995, 0.05), -1.6364));
  return sum * clamp(m, 1.0, 40.0);
}
float rayleighPhase(float mu){ return (3.0 / (16.0 * PI)) * (1.0 + mu*mu); }
float henyeyGreenstein(float mu, float g){
  float g2 = g*g;
  return (1.0 - g2) / (4.0 * PI * pow(max(1.0 + g2 - 2.0*g*mu, 1e-4), 1.5));
}

// In-scatter along one ray starting at height y0. Light rays are integrated with a
// handful of exponentially spaced samples (dense near the sample point, which is where
// the density still matters).
// Debug channel for view 26: the multiple-scattering term on its own.
vec3 msAccumulator = vec3(0.0);

vec3 scatteringIntegral(vec3 rd, float y0, out vec3 sunTransmittanceOut){
  msAccumulator = vec3(0.0);
  const int MAX_STEPS = 48;
  int steps = int(mix(14.0, 44.0, uSkyQuality));
  const float tMax = 110000.0;
  float dt0 = 140.0;
  float growth = pow(tMax / dt0, 1.0 / float(steps));
  float mu = dot(rd, uSunDir);
  float pR = rayleighPhase(mu);
  float pM = henyeyGreenstein(mu, uMieG);
  const float ISO = 0.0795774715;      // 1/(4 pi)

  vec3 L = vec3(0.0);
  vec3 L1 = vec3(0.0);
  vec3 sunT = vec3(1.0);
  // Optical depth gathered along the view ray up to the last sample. A sample's
  // transmittance is exp(-(tauView + tauSun)): with only the local step's density in
  // there, a horizon ray - whose air path is tens of scale heights long - would keep
  // collecting light it should have lost, and the low sky washed out.
  float accR = 0.0, accM = 0.0, accO = 0.0;
  // The air stops at the ground: a ray that points down ends on it.
  float tEnd = tMax;
  if (rd.y < -1.0e-5) tEnd = min(tMax, max(-y0 / rd.y, 0.0));
  float t = 0.0;
  for (int i = 0; i < MAX_STEPS; i++){
    if (i >= steps) break;
    float dt = min(min(dt0 * pow(growth, float(i)), 5000.0), tEnd - t);
    if (dt <= 0.0) break;
    float y = max(y0 + rd.y * (t + dt * 0.5), 1.0);
    float dR = exp(-y / uHr) * dt;
    float dM = exp(-y / uHm) * dt;
    float dO = ozoneDensity(y) * dt;
    float lR = expSlant(uSunDir.y, y, uHr);
    float lM = expSlant(uSunDir.y, y, uHm);
    float lO = ozoneSlant(uSunDir.y, y);
    vec3 tau = uBetaR * (accR + lR) + uBetaM * MIE_EXTINCTION * (accM + lM) + BETA_OZONE * (accO + lO);
    vec3 T = exp(-tau);
    // The irradiance of the direct sun is what the air scatters, so this term carries
    // uSunIrradiance: without it the sky sits on a scale of 1 while every surface, the
    // sun disk and the water glitter sit on the scale of uSunIrradiance (11), and the
    // whole sky reads as a dark brown smear against them.
    vec3 s1 = T * (uBetaR * dR * pR + uBetaM * dM * pM) * uSunIrradiance;
    L += s1;
    L1 += s1;

    // ---- multiple scattering, second order only ------------------------------------
    // The single-scatter integral above assumes the sun is the only light source. In
    // reality the light scattered once near the horizon lights up the rest of the sky,
    // which is why a sunset is not black at the zenith and why shadowed ground still
    // reads as blue. Model it as: the direct beam that reaches this height (E_sun times
    // the transmittance *along the sun path at this height*) is scattered a second time
    // by the local air density, and one part in ~4pi reaches the eye.
    //   - T_light reddens with the path length, so the term is warm near the horizon and
    //     blue overhead, on its own, without a fudge colour
    //   - it is scaled by the sun's height, so it cannot glow under the horizon
    //   - it is bounded by the light that was actually there, so it cannot blow out
    vec3 Tlight = exp(-(uBetaR * lR + uBetaM * MIE_EXTINCTION * lM + BETA_OZONE * lO));
    vec3 sourceE = uSunIrradiance * Tlight * max(uSunDir.y, 0.0);
    float phase2 = ISO * uMultiScatter;
    vec3 ms = T * (uBetaR * dR + uBetaM * dM) * sourceE * phase2;
    L += ms;
    msAccumulator += ms;
    if (i == 0) sunT = T;
    accR += dR; accM += dM; accO += dO;
    t += dt;
    if (t > tMax) break;
  }
  sunTransmittanceOut = sunT;
  return L;
}

// --- LUT layouts -----------------------------------------------------------
#define SKY_EL_MIN (-0.06)
#define SKY_EL_MAX 1.5707963
#define SKY_EL_GAMMA 2.2
float elevToV(float el){
  return pow(saturate((el - SKY_EL_MIN) / (SKY_EL_MAX - SKY_EL_MIN)), 1.0 / SKY_EL_GAMMA);
}
float vToElev(float v){
  return SKY_EL_MIN + (SKY_EL_MAX - SKY_EL_MIN) * pow(saturate(v), SKY_EL_GAMMA);
}
vec3 lutDirection(float u, float v, float sunAzi){
  float el = vToElev(v);
  float azi = sunAzi + (u * TAU - PI);
  return vec3(cos(el) * sin(azi), sin(el), cos(el) * cos(azi));
}
vec2 directionToLut(vec3 dir, float sunElev, float sunAzi){
  float el = clamp(asin(clamp(dir.y, -1.0, 1.0)), SKY_EL_MIN, SKY_EL_MAX);
  float rel = mod(atan(dir.x, dir.z) - sunAzi + PI, TAU);
  return vec2(rel / TAU, elevToV(el));
}
// The sun transmittance table is indexed by (elevation, height above sea level):
// standing on a mountain puts you above part of the air column.
vec3 sampleSkyLUT(sampler2D lut, vec3 dir, float sunElev, float sunAzi){
  return texture(lut, directionToLut(dir, sunElev, sunAzi)).rgb;
}
float heightToV(float h){ return sqrt(saturate(h / 4200.0)); }
float vToHeight(float v){ return v * v * 4200.0; }
`;
})();
