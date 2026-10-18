/* GLSL chunk: post processing — a five level bloom pyramid (Jimenez dual filtering),
   exposure, ACES fitted tonemap, vignette, grain, a whisper of chromatic aberration,
   blue-noise dither, and an A/B divider so the tonemap can be shown against the raw
   HDR frame. */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});
  var GLSL = (SS.GLSL = SS.GLSL || {});


  // One declaration block for every shared uniform, assembled first so nothing is
  // declared twice and everything is visible to every function.
  GLSL.paramsBlock = [
    GLSL.qualityParams, GLSL.atmoParams, GLSL.terrainParams, GLSL.cloudParams,
    GLSL.waterParams, GLSL.cameraParams
  ].join('\n');

  GLSL.bloomDownShader = GLSL.common + `
uniform sampler2D uSrc;
uniform vec2 uSrcTexel;
uniform float uThreshold;
uniform float uKnee;
uniform float uPreExposure;
out vec4 outColor;
vec3 fetch(vec2 uv){ return max(texture(uSrc, uv).rgb, vec3(0.0)); }
void main(){
  vec2 uv = gl_FragCoord.xy * uSrcTexel * 2.0;
  vec2 t = uSrcTexel;
  // 13-tap downsample (Jimenez): a wide kernel that stays stable under motion
  vec3 a = fetch(uv + t * vec2(-2.0, 2.0)); vec3 b = fetch(uv + t * vec2(0.0, 2.0));
  vec3 c = fetch(uv + t * vec2(2.0, 2.0));  vec3 d = fetch(uv + t * vec2(-2.0, 0.0));
  vec3 e = fetch(uv);                        vec3 f = fetch(uv + t * vec2(2.0, 0.0));
  vec3 g = fetch(uv + t * vec2(-2.0, -2.0)); vec3 h = fetch(uv + t * vec2(0.0, -2.0));
  vec3 i = fetch(uv + t * vec2(2.0, -2.0));  vec3 j = fetch(uv + t * vec2(-1.0, 1.0));
  vec3 k = fetch(uv + t * vec2(1.0, 1.0));   vec3 l = fetch(uv + t * vec2(-1.0, -1.0));
  vec3 m = fetch(uv + t * vec2(1.0, -1.0));
  vec3 col = e * 0.125;
  col += (a + c + g + i) * 0.03125;
  col += (b + d + f + h) * 0.0625;
  col += (j + k + l + m) * 0.125;
  col *= uPreExposure;
  if (uThreshold > 0.0){
    float lum = luma(col);
    float soft = clamp(lum - uThreshold + uKnee, 0.0, 2.0 * uKnee);
    soft = soft * soft / (4.0 * uKnee + 1e-4);
    col *= max(soft, lum - uThreshold) / max(lum, 1e-4);
  }
  outColor = vec4(col, 1.0);
}
`;

  GLSL.bloomUpShader = GLSL.common + `
uniform sampler2D uSrc;      // the finer level
uniform sampler2D uLower;    // the accumulated coarser level
uniform vec2 uSrcTexel;
uniform float uRadius;
uniform float uAdd;
out vec4 outColor;
vec3 tent(sampler2D s, vec2 uv, vec2 t, float r){
  vec3 c = texture(s, uv).rgb * 4.0;
  c += texture(s, uv + vec2(t.x, 0.0) * r).rgb * 2.0;
  c += texture(s, uv - vec2(t.x, 0.0) * r).rgb * 2.0;
  c += texture(s, uv + vec2(0.0, t.y) * r).rgb * 2.0;
  c += texture(s, uv - vec2(0.0, t.y) * r).rgb * 2.0;
  c += texture(s, uv + t * r).rgb;
  c += texture(s, uv - t * r).rgb;
  c += texture(s, uv + vec2(t.x, -t.y) * r).rgb;
  c += texture(s, uv + vec2(-t.x, t.y) * r).rgb;
  return c / 16.0;
}
void main(){
  vec2 uv = gl_FragCoord.xy * uSrcTexel;
  vec3 col = tent(uSrc, uv, uSrcTexel, uRadius);
  col += texture(uLower, uv).rgb * uAdd;
  outColor = vec4(col, 1.0);
}
`;

  GLSL.compositeShader = GLSL.common + `
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform sampler2D uNoise;
uniform vec2 uRes;
uniform float uExposure;
uniform float uBloomStrength;
uniform float uVignette;
uniform float uGrain;
uniform float uChroma;
uniform float uSplit;
uniform float uTime;
uniform float uStage8;
uniform float uPostMix;
uniform float uView;
out vec4 outColor;

vec3 sampleScene(vec2 uv){ return max(texture(uScene, uv).rgb, vec3(0.0)); }

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 c = uv - 0.5;
  float r2 = dot(c, c);
  vec3 col;
  if (uChroma > 0.0){
    float k = uChroma * r2 * 0.02;
    col.r = sampleScene(uv + c * k).r;
    col.g = sampleScene(uv).g;
    col.b = sampleScene(uv - c * k).b;
  } else {
    col = sampleScene(uv);
  }
  vec3 hdr = col;

  /* A diagnostic view is a picture *of* a term, not a photograph: it has to show the number
     the shader computed, so the film must not tonemap it, bloom it, vignette it or grade it.
     With the grade on, every one of these views arrived as a washed-out pastel version of
     itself (ACES on a normal-colour image is a colour cast, not a display of the normal). */
  if (uView > 0.5){
    outColor = vec4(linearToSRGB(saturate(col * uExposure)), 1.0);
    return;
  }

  vec3 bloom = max(texture(uBloom, uv).rgb, vec3(0.0));
  col += bloom * uBloomStrength;
  col *= uExposure;

  // the raw frame: what the renderer produced before any of this
  vec3 raw = hdr * uExposure;
  vec3 rawDisplay = linearToSRGB(saturate(raw * 0.55));

  vec3 graded;
  if (uStage8 > 0.001){
    graded = acesFitted(col);
    // gentle film grade: cool the shadows, warm the highlights
    float l = luma(graded);
    graded = mix(graded * vec3(0.96, 0.99, 1.06), graded * vec3(1.05, 1.0, 0.94), smoothstep(0.25, 0.8, l));
    // vignette
    graded *= mix(1.0, saturate(1.0 - uVignette * smoothstep(0.18, 0.95, r2 * 1.6)), 1.0);
    // grain. The sampling offset has to land on texel *centres*: sampling on the texel
    // grid makes the linear filter blend the same two texels on neighbouring rows and
    // the blue noise stops being blue, which showed up as horizontal banding across the
    // dark sky. Offsetting by half a texel and animating in both axes keeps it grain.
    if (uGrain > 0.0){
      vec2 jit = vec2(fract(uTime * 0.4173), fract(uTime * 0.2791 + 0.5));
      vec2 nuv = (gl_FragCoord.xy + jit * 64.0 + 0.5) / 64.0;
      float n = texture(uNoise, nuv).r;
      float n2 = texture(uNoise, nuv * 1.0 + vec2(0.37, 0.61)).r;
      float g = (n * 0.72 + n2 * 0.28) - 0.5;
      graded += g * uGrain * (1.0 - smoothstep(0.0, 0.9, luma(graded)) * 0.65);
    }
    graded = linearToSRGB(saturate(graded));
    graded = mix(rawDisplay, graded, uStage8);
  } else {
    graded = rawDisplay;
  }

  // A/B divider: left of the line is the graded frame, right of it the raw HDR clamped
  if (uSplit >= 0.0){
    float line = uSplit;
    if (uv.x > line) graded = rawDisplay;
    float d = abs(uv.x - line);
    float px = 1.5 / uRes.x;
    graded = mix(vec3(0.95, 0.86, 0.72), graded, smoothstep(px * 0.5, px * 1.5, d));
  }

  // blue-noise dither, the last 1/255 of care (texel centres again, so neighbouring
  // pixels really do get decorrelated values)
  float dn = texture(uNoise, (gl_FragCoord.xy + 0.5 + vec2(fract(uTime * 0.613), fract(uTime * 0.291))) / 64.0).r;
  graded += (dn - 0.5) * (1.0 / 255.0);
  outColor = vec4(saturate(graded), 1.0);
}
`;

  // Average scene radiance, on the GPU: one output pixel per 8x8 block of the frame,
  // each one the box average of its block. The JS side reads 8x8 floats back and turns
  // them into an exposure, which is how the camera adapts as the sun goes down instead of
  // a fixed number that is right for exactly one time of day. (A fixed exposure measured
  // across sun elevations from 3 to 60 degrees needs a factor of 10 between the darkest
  // and the brightest frame, and the relationship is not monotonic, because the sky
  // reddens and dims again as the sun sets.)
  GLSL.avgShader = GLSL.common + `
uniform sampler2D uSrc;
out vec4 outColor;
void main(){
  vec2 block = floor(gl_FragCoord.xy);
  vec2 step = vec2(1.0 / 64.0);
  vec3 sum = vec3(0.0);
  for (int j = 0; j < 8; j++){
    for (int i = 0; i < 8; i++){
      vec2 uv = (block + vec2(float(i) + 0.5, float(j) + 0.5) * 8.0) * step;
      sum += max(texture(uSrc, uv).rgb, vec3(0.0));
    }
  }
  outColor = vec4(sum / 64.0, 1.0);
}
`;

  /* A tiny pass that writes a horizontal strip the histogram instruments read back.
     Two channels, because the two instruments want different things and both are already
     computed here:
       R  the *display* luminance - the same ACES fit and sRGB encode the screen shows, so the
          panel's bins sit where the eye sees the frame. (Binning the linear radiance straight
          out of the scene target was the bug: a sunset frame's linear luma is around 1e-3, and
          a mapping that assumes 0..1 put every pixel in the first bin. The panel looked
          empty while it was faithfully reporting a single spike.)
       G  log2 of the linear luminance after exposure, mapped over LUM_LO..LUM_HI stops - what
          the tonemap chapter's curve wants, since that chapter is about what happens across
          the exposure range. */
  GLSL.stripShader = GLSL.common + `
uniform sampler2D uScene;
uniform vec2 uRes;
uniform float uExposure;
out vec4 outColor;
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec3 c = max(texture(uScene, uv).rgb, vec3(0.0)) * uExposure;
  vec3 disp = linearToSRGB(saturate(acesFitted(c)));
  float lg = (log2(max(luma(c), 1e-6)) + 14.0) / 24.0;
  outColor = vec4(luma(disp), saturate(lg), 0.0, 1.0);
}
`;
})();
