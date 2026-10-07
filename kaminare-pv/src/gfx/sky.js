// Storm sky rendered as a fullscreen pass from the 3D camera's rays: domain-warped
// clouds on a dome, a twirl warp ("空までゆがませて"), lightning-lit undersides.
import * as THREE from 'three';
import { Pass } from '../core/gl.js';

const FRAG = /* glsl */ `
uniform mat4 uInvProj, uCamWorld; uniform float uTime, uWarp, uFlash, uHue, uDark;
uniform vec3 uFlashDir, uTop, uMid, uLow, uRim;
uniform vec2 uSwirl;
varying vec2 vUv;
vec3 rayDir(vec2 uv){
  vec4 c = uInvProj * vec4(uv*2.-1., 1., 1.);
  c /= c.w;
  return normalize((uCamWorld * vec4(normalize(c.xyz), 0.)).xyz);
}
void main(){
  vec3 d = rayDir(vUv);
  // twirl in screen space around uSwirl
  vec2 sp = (vUv - uSwirl) * vec2(16./9., 1.);
  float r = length(sp);
  float tw = uWarp * 5.5 * exp(-r*1.4);
  d.xy = rot(tw*0.35) * d.xy;
  float h = d.y;
  vec2 q = d.xz / (max(h, 0.0) + 0.18) * 1.6;
  q = rot(tw) * q;
  q += vec2(uTime*0.05, -uTime*0.11);
  vec2 w1 = vec2(fbm(q*0.6 + uTime*0.03), fbm(q*0.6 + 5.2 - uTime*0.02));
  vec2 w2 = vec2(fbm(q*1.1 + w1*2.4 + 1.7), fbm(q*1.1 + w1*2.4 + 9.2));
  float cl = fbm(q*0.9 + w2*2.2);
  float dense = smoothstep(0.25, 0.85, cl);
  vec3 c = mix(uLow, uMid, smoothstep(-0.1, 0.35, h));
  c = mix(c, uTop, smoothstep(0.3, 0.95, h));
  // cloud mass darker, rims lit by uRim (city/stage glow from below)
  c = mix(c, c*0.35, dense);
  float rim = smoothstep(0.45, 0.55, cl) * (1. - smoothstep(0.55, 0.8, cl));
  c += uRim * rim * 0.35 * smoothstep(0.6, -0.1, h);
  // lightning illumination: bright inside clouds near the flash direction
  float fd = max(dot(d, normalize(uFlashDir)), 0.);
  float glow = pow(fd, 6.) * uFlash;
  c += vec3(.75,.8,1.)* glow * (0.4 + 1.6*dense) ;
  c += vec3(.6,.65,1.) * uFlash * 0.12 * dense;
  // horizon haze
  c += uRim * exp(-abs(h)*9.) * 0.25;
  // twirl streaks
  c += uRim * uWarp * 0.25 * smoothstep(0.6, 0.0, r) * (0.5+0.5*sin(atan(sp.y,sp.x)*12. + tw*3.));
  c *= 1. - uDark;
  gl_FragColor = vec4(c, 1.);
}`;

export class Sky {
  constructor() {
    this.pass = new Pass(FRAG, {
      uInvProj: { value: new THREE.Matrix4() }, uCamWorld: { value: new THREE.Matrix4() }, uTime: { value: 0 },
      uWarp: { value: 0 }, uFlash: { value: 0 }, uHue: { value: 0 }, uDark: { value: 0 },
      uFlashDir: { value: new THREE.Vector3(0.2, 0.6, -1) },
      uTop: { value: new THREE.Color(0.02, 0.02, 0.06) }, uMid: { value: new THREE.Color(0.09, 0.04, 0.16) },
      uLow: { value: new THREE.Color(0.32, 0.07, 0.1) }, uRim: { value: new THREE.Color(1.0, 0.35, 0.18) },
      uSwirl: { value: new THREE.Vector2(0.5, 0.65) },
    });
  }
  draw(renderer, target, camera, o = {}) {
    const u = this.pass.u;
    camera.updateMatrixWorld();
    u.uInvProj.value.copy(camera.projectionMatrixInverse);
    u.uCamWorld.value.copy(camera.matrixWorld);
    u.uTime.value = o.time ?? 0;
    u.uWarp.value = o.warp ?? 0;
    u.uFlash.value = o.flash ?? 0;
    u.uDark.value = o.dark ?? 0;
    if (o.flashDir) u.uFlashDir.value.copy(o.flashDir);
    if (o.swirl) u.uSwirl.value.set(o.swirl[0], o.swirl[1]);
    if (o.pal) {
      u.uTop.value.setRGB(...o.pal.top);
      u.uMid.value.setRGB(...o.pal.mid);
      u.uLow.value.setRGB(...o.pal.low);
      u.uRim.value.setRGB(...o.pal.rim);
    }
    this.pass.render(renderer, target, false);
  }
}
