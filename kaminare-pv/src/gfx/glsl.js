// Shared GLSL chunks. Kept as JS strings so the bundle stays a single classic script.

export const NOISE = /* glsl */ `
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 hash22(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx+33.33); return fract((p3.xx+p3.yz)*p3.zy); }
float hash13(vec3 p3){ p3 = fract(p3 * .1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash12(i),hash12(i+vec2(1,0)),u.x), mix(hash12(i+vec2(0,1)),hash12(i+vec2(1,1)),u.x), u.y); }
float vnoise3(vec3 p){ vec3 i=floor(p), f=fract(p); vec3 u=f*f*(3.-2.*f);
  float a=hash13(i), b=hash13(i+vec3(1,0,0)), c=hash13(i+vec3(0,1,0)), d=hash13(i+vec3(1,1,0));
  float e=hash13(i+vec3(0,0,1)), f1=hash13(i+vec3(1,0,1)), g=hash13(i+vec3(0,1,1)), h=hash13(i+vec3(1,1,1));
  return mix(mix(mix(a,b,u.x),mix(c,d,u.x),u.y), mix(mix(e,f1,u.x),mix(g,h,u.x),u.y), u.z); }
float fbm(vec2 p){ float s=0., a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<5;i++){ s+=a*vnoise(p); p=m*p; a*=.5;} return s; }
float fbm3(vec3 p){ float s=0., a=.5; for(int i=0;i<5;i++){ s+=a*vnoise3(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=.5;} return s; }
float ridge(vec2 p){ float s=0., a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<5;i++){ s+=a*(1.-abs(vnoise(p)*2.-1.)); p=m*p; a*=.5;} return s; }
mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
float luma(vec3 c){ return dot(c, vec3(.299,.587,.114)); }
`;

// Washi paper: warm base, cloudy mottling, kozo fibres and bark flecks.
// p: paper-space coords in "design pixels" (1920 wide). returns rgb & a height for lighting.
export const PAPER = /* glsl */ `
float fibres(vec2 p, float seed){
  float s = 0.;
  for(int i=0;i<4;i++){
    float fi = float(i);
    float ang = hash12(vec2(seed, fi))*6.2831;
    vec2 q = rot(ang) * p * (0.010 + fi*0.004);
    q.x *= 0.12;                                   // stretch => long fibres
    float n = vnoise(q*vec2(1.,14.) + fi*17.);
    s += smoothstep(0.80, 0.98, n) * (0.55 - fi*0.08);
  }
  return s;
}
vec3 washi(vec2 p, vec3 base, out float h){
  float m = fbm(p*0.0022) ;                         // big cloudy density
  float m2 = fbm(p*0.011 + 7.);
  float fb = fibres(p, 3.) + fibres(p*1.7+31., 9.)*0.6;
  float fleck = smoothstep(0.985, 1.0, hash12(floor(p*0.5))) * step(0.6, vnoise(p*0.02));
  float grain = hash12(floor(p)) - .5;
  h = m*0.6 + m2*0.3 + fb*0.5 + grain*0.15;
  vec3 c = base;
  c *= 0.93 + 0.10*m + 0.05*m2;                    // density mottling
  c = mix(c, c*vec3(1.04,1.02,0.97), fb*0.8);       // fibres catch light
  c *= 1. - fleck*0.35;
  c += grain*0.025;
  return c;
}
`;

export const FULLSCREEN_VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }
`;
