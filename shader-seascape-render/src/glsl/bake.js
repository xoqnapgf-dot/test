/* GLSL: the two atmosphere bakes. They run once at load and again whenever the sun
   moves (the sky is in the sun's frame, so only the tables need rebuilding). */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});
  var GLSL = (SS.GLSL = SS.GLSL || {});

  GLSL.skyLUTShader = `
uniform vec2 uRes;
uniform float uSunElev, uSunAzi, uCameraHeight;
out vec4 outColor;
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec3 dir = lutDirection(uv.x, uv.y, uSunAzi);
  // Rows below the horizon all stand for the same direction: straight at the horizon.
  // A ray that points down ends on the ground a few kilometres away, so its own row of
  // the table would be a noisy function of how far away the ground happens to be, and
  // that noise shows up as banding in the haze. What the table is for is the light the
  // air adds along a line of sight, and for a downward sight line that is the horizon's
  // value - so the sub-horizon rows are baked as the horizon row.
  dir = normalize(vec3(dir.x, max(dir.y, 0.0), dir.z));
  vec3 sunT;
  vec3 L = scatteringIntegral(dir, max(uCameraHeight, 1.0), sunT);
  outColor = max(vec4(L, 1.0), vec4(0.0));
}
`;

  GLSL.sunTransShader = `
uniform vec2 uRes;
uniform float uSunElev, uSunAzi, uCameraHeight;
out vec4 outColor;
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float el = vToElev(uv.x);
  float h0 = vToHeight(uv.y);
  float s = sin(el);
  // Same slant paths as the sky bake, so the direct beam and the sky agree by construction.
  float R = expSlant(s, h0, uHr);
  float M = expSlant(s, h0, uHm);
  float O = ozoneSlant(s, h0);
  vec3 tau = uBetaR * R + uBetaM * MIE_EXTINCTION * M + BETA_OZONE * O;
  outColor = vec4(exp(-tau), 1.0);
}
`;
})();
