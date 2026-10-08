// Specimen materials: procedural, object-space (so fragments of one block stay continuous).
// Kinds: 0 concrete · 1 rock · 2 granite · 3 reinforced concrete · 4 high-strength concrete
//        5 steel-fibre concrete · 6 basalt · 7 diamond · 8 steel · 9 water-ice
// uHeat warms the material through red → orange → white (blackbody), uCrack lights broken faces.
import * as THREE from 'three';
import { NOISE } from './glsl.js';

const VERT = /* glsl */ `
attribute vec3 aP0; attribute float aInner;
varying vec3 vP0; varying vec3 vN; varying vec3 vW; varying float vInner;
void main(){
  vP0 = aP0; vInner = aInner;
  vec4 w = modelMatrix * vec4(position, 1.);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

export const LIGHT_CHUNK = /* glsl */ `
vec3 envCol(vec3 d){
  // studio: dark floor, soft overhead box, warm key card on the left
  float up = d.y;
  vec3 c = mix(vec3(0.012,0.013,0.016), vec3(0.06,0.065,0.075), smoothstep(-0.3, 0.6, up));
  c += vec3(1.2,1.15,1.05) * smoothstep(0.75, 0.95, up) * 0.9;
  c += vec3(1.4,1.05,0.75) * smoothstep(0.86, 0.98, dot(d, normalize(vec3(-0.8,0.35,0.45)))) * 1.4;
  c += vec3(0.5,0.75,1.1) * smoothstep(0.9, 0.99, dot(d, normalize(vec3(0.9,0.15,-0.3)))) * 0.8;
  return c;
}
vec3 shade(vec3 base, vec3 n, vec3 v, float rough, float metal, float spec){
  vec3 L1 = normalize(vec3(-0.6, 0.75, 0.55)); vec3 c1 = vec3(1.25,1.12,0.98)*2.1;
  vec3 L2 = normalize(vec3(0.8, 0.2, -0.4));  vec3 c2 = vec3(0.45,0.6,0.9)*0.7;
  vec3 col = base * (0.04 + 0.02*n.y);
  for(int i=0;i<2;i++){
    vec3 L = i==0 ? L1 : L2; vec3 lc = i==0 ? c1 : c2;
    float ndl = max(dot(n, L), 0.);
    vec3 h = normalize(L + v);
    float ndh = max(dot(n, h), 0.);
    float a = rough*rough; float a2 = a*a;
    float D = a2 / (3.14159 * pow(ndh*ndh*(a2-1.)+1., 2.));
    vec3 F0 = mix(vec3(spec), base, metal);
    vec3 F = F0 + (1.-F0)*pow(1.-max(dot(h,v),0.), 5.);
    col += lc * ndl * ((1.-metal) * base / 3.14159 + D * F * 0.25);
  }
  vec3 r = reflect(-v, n);
  vec3 F0 = mix(vec3(spec), base, metal);
  vec3 Fr = F0 + (1.-F0)*pow(1.-max(dot(n,v),0.), 5.);
  col += envCol(r) * Fr * (1. - rough*0.85);
  // rim
  col += vec3(0.6,0.7,0.9) * pow(1. - max(dot(n,v),0.), 4.) * 0.08;
  return col;
}
vec3 blackbody(float t){ // t 0..1.5 → dull red to white-hot (linear, HDR)
  vec3 c = vec3(1.0, 0.12, 0.01) * smoothstep(0.0, 0.35, t);
  c = mix(c, vec3(1.0, 0.45, 0.06), smoothstep(0.3, 0.7, t));
  c = mix(c, vec3(1.0, 0.85, 0.55), smoothstep(0.7, 1.1, t));
  c = mix(c, vec3(0.9, 0.95, 1.0), smoothstep(1.1, 1.5, t));
  return c * (0.6 + 6.0 * t * t);
}
`;

const FRAG = /* glsl */ `
${NOISE}
${LIGHT_CHUNK}
uniform float uKind, uHeat, uCrack, uScale, uDissolve, uTime, uAlpha;
uniform vec3 uCam;
varying vec3 vP0; varying vec3 vN; varying vec3 vW; varying float vInner;
vec2 cell3(vec3 p){ // distance to nearest & id
  vec3 i = floor(p), f = fract(p); float d = 9.; float id = 0.;
  for(int x=-1;x<=1;x++) for(int y=-1;y<=1;y++) for(int z=-1;z<=1;z++){
    vec3 g = vec3(x,y,z); vec3 o = vec3(hash13(i+g), hash13(i+g+11.3), hash13(i+g+27.1));
    float dd = length(g + o - f);
    if(dd < d){ d = dd; id = hash13(i+g+5.7); }
  }
  return vec2(d, id);
}
void main(){
  vec3 p = vP0 * uScale;
  vec3 n = normalize(vN);
  if(!gl_FrontFacing) n = -n;
  vec3 v = normalize(uCam - vW);
  vec3 base; float rough = 0.85; float metal = 0.; float spec = 0.04;
  float k = uKind;
  float fine = vnoise3(p*42.) * 0.5 + vnoise3(p*90.) * 0.5;
  if(k < 0.5 || (k > 2.5 && k < 5.5)){
    // concrete family: cement paste + aggregate + pores
    vec2 ag = cell3(p*7.);
    float stone = smoothstep(0.42, 0.36, ag.x);
    vec3 paste = vec3(0.42,0.41,0.39) * (0.85 + 0.25*fine);
    vec3 agg = mix(vec3(0.33,0.31,0.29), vec3(0.58,0.55,0.5), ag.y);
    base = mix(paste, agg, stone * 0.9);
    float pore = smoothstep(0.93, 0.97, vnoise3(p*55.));
    base *= 1. - pore*0.6;
    if(k > 3.5 && k < 4.5){ base = mix(base, vec3(0.6,0.6,0.58), 0.35); rough = 0.6; }
    if(k > 2.5 && k < 3.5 && vInner > 0.5){
      // rebar cross-sections on broken faces
      vec2 q = fract(p.xy*1.6) - .5;
      float bar = smoothstep(0.09, 0.075, length(q));
      base = mix(base, vec3(0.32,0.18,0.1), bar); metal = bar*0.7; rough = mix(rough, 0.45, bar);
    }
    if(k > 4.5){
      // steel fibres glinting
      float fib = smoothstep(0.985, 1., vnoise3(p*vec3(80.,8.,80.))) + smoothstep(0.985, 1., vnoise3(p*vec3(8.,80.,80.)+4.));
      base = mix(base, vec3(0.7,0.72,0.75), clamp(fib,0.,1.)); metal = clamp(fib,0.,1.)*0.8;
    }
  } else if(k < 1.5){
    base = vec3(0.45,0.42,0.38) * (0.75 + 0.35*fbm3(p*6.)) * (0.9+0.2*fine);
  } else if(k < 2.5){
    // granite: feldspar (pink), quartz (light grey), biotite (black)
    vec2 c = cell3(p*16.);
    vec3 m = c.y < 0.45 ? vec3(0.78,0.55,0.48) : c.y < 0.8 ? vec3(0.72,0.72,0.72) : vec3(0.06,0.06,0.07);
    base = m * (0.8 + 0.3*fine);
    rough = c.y > 0.45 && c.y < 0.8 ? 0.35 : 0.7;
    spec = 0.05;
  } else if(k < 6.5){
    base = vec3(0.16,0.16,0.17) * (0.8 + 0.3*fbm3(p*9.));
    float ves = smoothstep(0.88, 0.92, vnoise3(p*30.));
    base *= 1. - ves*0.7;
    rough = 0.75;
  } else if(k < 7.5){
    // diamond: dispersion via three refracted env lookups
    vec3 rr = refract(-v, n, 1./2.40), rg = refract(-v, n, 1./2.42), rb = refract(-v, n, 1./2.45);
    vec3 t = vec3(envCol(rr*vec3(1.,-1.,1.)).r, envCol(rg*vec3(1.,-1.,1.)).g, envCol(rb*vec3(1.,-1.,1.)).b);
    vec3 fire = vec3(envCol(reflect(rr, vec3(0.,1.,0.))).r, envCol(reflect(rg, vec3(0.7,0.7,0.))).g, envCol(reflect(rb, vec3(-0.7,0.7,0.))).b);
    float fr = 0.17 + 0.83*pow(1.-max(dot(n,v),0.), 5.);
    vec3 col = mix(t*1.4 + fire*0.9, envCol(reflect(-v,n))*1.6, fr);
    col += vec3(2.5) * pow(max(dot(reflect(-v,n), normalize(vec3(-0.6,0.75,0.55))),0.), 120.);
    gl_FragColor = vec4(col * uAlpha, uAlpha);
    return;
  } else if(k < 8.5){
    base = vec3(0.62,0.63,0.66); metal = 1.; rough = 0.32 + 0.1*vnoise3(p*vec3(200.,4.,4.));
  } else {
    base = vec3(0.55,0.75,0.9); rough = 0.12; spec = 0.03;
  }
  // broken faces: slightly lighter, rougher, fresh
  if(vInner > 0.5 && k < 6.5){ base *= 1.12; rough = min(rough + 0.1, 1.); }
  vec3 col = shade(base, n, v, rough, metal, spec);
  // crack glow on broken faces (energy release at impact)
  col += vInner * uCrack * vec3(1.0,0.55,0.2) * 2.5;
  // heat: blackbody emission with mottled melt
  if(uHeat > 0.001){
    float h = uHeat + (fbm3(p*5. + uTime*0.2) - 0.5) * 0.35;
    col = mix(col, col*0.25, smoothstep(0.1, 0.6, h));
    col += blackbody(max(h, 0.)) * smoothstep(0.05, 0.3, h);
  }
  // dissolve into vapour
  if(uDissolve > 0.001){
    float dn = fbm3(p*3. + vec3(0., uTime*0.4, 0.));
    float edge = dn - uDissolve*1.2 + 0.1;
    if(edge < 0.) discard;
    col += blackbody(1.1) * smoothstep(0.08, 0., edge) * 0.35;
  }
  gl_FragColor = vec4(col * uAlpha, uAlpha);
}`;

export function specimenMaterial(kind, opts = {}) {
  return new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uKind: { value: kind }, uHeat: { value: 0 }, uCrack: { value: 0 }, uScale: { value: opts.scale ?? 1 },
      uDissolve: { value: 0 }, uTime: { value: 0 }, uAlpha: { value: 1 }, uCam: { value: new THREE.Vector3() },
    },
    side: opts.side ?? THREE.FrontSide,
    transparent: !!opts.transparent,
  });
}

// add aP0 / aInner to an ordinary geometry so it can use the specimen material
export function prepGeometry(g) {
  g = g.index ? g.toNonIndexed() : g;
  const pos = g.attributes.position;
  g.setAttribute('aP0', new THREE.Float32BufferAttribute(pos.array.slice(), 3));
  g.setAttribute('aInner', new THREE.Float32BufferAttribute(new Float32Array(pos.count), 1));
  if (!g.attributes.normal) g.computeVertexNormals();
  return g;
}

// brilliant-cut diamond (flat facets)
export function diamondGeometry(r = 1) {
  const pts = [new THREE.Vector2(0.0001, -1.05 * r), new THREE.Vector2(r, 0), new THREE.Vector2(r * 0.98, 0.1 * r), new THREE.Vector2(r * 0.56, 0.42 * r), new THREE.Vector2(0.0001, 0.42 * r)];
  const g = new THREE.LatheGeometry(pts, 16).toNonIndexed();
  g.computeVertexNormals();
  // flat shading
  const pos = g.attributes.position, nor = g.attributes.normal;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i);
    b.fromBufferAttribute(pos, i + 1);
    c.fromBufferAttribute(pos, i + 2);
    const n = b.clone().sub(a).cross(c.clone().sub(a)).normalize();
    for (let k = 0; k < 3; k++) nor.setXYZ(i + k, n.x, n.y, n.z);
  }
  return prepGeometry(g);
}
