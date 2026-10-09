// Reusable 3D props: planet, star, galaxy, cosmic web, city blocks, a brick that shatters.
import * as THREE from 'three';
import { NOISE } from './glsl.js';
import { starMaterial, glowQuad, dotsMaterial, lin } from './materials.js';
import { rng } from '../core/util.js';

// ------------------------------------------------------------------ planet
export function planetMaterial(o = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uLight: { value: new THREE.Vector3(...(o.light || [-1, 0.35, 0.6])).normalize() },
      uSeed: { value: o.seed || 1.7 },
      uOcean: { value: lin(o.ocean || '#0B2A4A') },
      uLand: { value: lin(o.land || '#5A6B3A') },
      uLand2: { value: lin(o.land2 || '#9C7B4E') },
      uSea: { value: o.sea == null ? 0.02 : o.sea },
      uCloud: { value: o.clouds == null ? 0.8 : o.clouds },
      uCity: { value: o.city == null ? 1 : o.city },
      uI: { value: o.intensity || 1.6 },
      uHeat: { value: 0 }, // 0..1 surface glowing from heat
      uCrack: { value: 0 }, // 0..1 glowing fault lines
    },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vW; varying vec3 vO;
      void main(){ vO = position; vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uLight; uniform float uSeed; uniform vec3 uOcean; uniform vec3 uLand; uniform vec3 uLand2;
      uniform float uSea; uniform float uCloud; uniform float uCity; uniform float uI; uniform float uHeat; uniform float uCrack;
      varying vec3 vN; varying vec3 vW; varying vec3 vO;
      ${NOISE}
      void main(){
        vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vW);
        vec3 p = normalize(vO);
        float h = fbm3(p * 1.5 + uSeed) + 0.45 * fbm3(p * 4.2 + uSeed * 2.0);
        float land = smoothstep(uSea, uSea + 0.05, h);
        float lat = abs(p.y);
        vec3 lc = mix(uLand, uLand2, smoothstep(-0.1, 0.4, fbm3(p * 3.0 + 7.0)) * (1.0 - lat * 0.6));
        vec3 oc = uOcean * (0.6 + 0.6 * smoothstep(-0.4, uSea, h));
        vec3 base = mix(oc, lc, land);
        float ice = smoothstep(0.78, 0.9, lat + 0.08 * fbm3(p * 6.0));
        base = mix(base, vec3(0.85, 0.88, 0.92), ice);
        float cl = smoothstep(0.05, 0.6, fbm3(p * 2.6 + vec3(uTime * 0.01, 0.0, uSeed))) * uCloud;
        float ndl = dot(N, uLight);
        float day = smoothstep(-0.12, 0.25, ndl);
        vec3 col = base * (0.04 + 1.1 * max(ndl, 0.0));
        // ocean glint
        vec3 H = normalize(uLight + V);
        col += (1.0 - land) * (1.0 - ice) * pow(max(dot(N, H), 0.0), 60.0) * 0.6 * day;
        col = mix(col, vec3(0.95) * (0.05 + 1.05 * max(ndl, 0.0)), cl * 0.85);
        // night lights
        float city = land * (1.0 - ice) * step(0.78, hash13(floor(p * 160.0))) * smoothstep(0.1, 0.5, fbm3(p * 8.0 + 2.0));
        col += vec3(1.0, 0.62, 0.3) * city * (1.0 - day) * (1.0 - cl) * 2.2 * uCity;
        // atmosphere rim
        float f = pow(1.0 - max(dot(N, V), 0.0), 3.0);
        col += vec3(0.25, 0.5, 1.0) * f * (0.15 + 0.85 * smoothstep(-0.2, 0.5, ndl)) * 1.2;
        // heat & fault glow
        vec3 hot = mix(vec3(1.0, 0.25, 0.05), vec3(1.0, 0.8, 0.45), smoothstep(0.0, 0.6, fbm3(p * 5.0 + uTime * 0.05)));
        col = mix(col, hot * 3.0 * (0.6 + 0.4 * fbm3(p * 9.0)), uHeat);
        float cr = smoothstep(0.045, 0.0, abs(snoise(p * 3.2 + uSeed))) + smoothstep(0.03, 0.0, abs(snoise(p * 7.0 + uSeed * 3.0))) * 0.6;
        col += vec3(1.0, 0.55, 0.2) * cr * uCrack * 6.0;
        gl_FragColor = vec4(col * uI, 1.0);
      }`,
  });
}
export function makePlanet(r = 1, o = {}) {
  const g = new THREE.Group();
  const mat = planetMaterial(o);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(r, 96, 64), mat);
  g.add(ball);
  const atmo = new THREE.Mesh(
    new THREE.SphereGeometry(r * 1.035, 64, 48),
    new THREE.ShaderMaterial({
      uniforms: { uLight: mat.uniforms.uLight, uA: { value: o.atmo == null ? 1 : o.atmo } },
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      vertexShader: `varying vec3 vN; varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW=w.xyz; vN=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*viewMatrix*w; }`,
      fragmentShader: `uniform vec3 uLight; uniform float uA; varying vec3 vN; varying vec3 vW;
        void main(){ vec3 N=normalize(vN); vec3 V=normalize(cameraPosition-vW); float f=pow(clamp(1.0+dot(N,V)*1.0,0.0,1.0),4.0);
          float lit=smoothstep(-0.3,0.6,dot(-N,uLight)*-1.0+0.2); gl_FragColor=vec4(vec3(0.3,0.55,1.0)*f*lit*1.6*uA,1.0);} `,
    })
  );
  g.add(atmo);
  g.userData = { mat, ball, atmo };
  return g;
}

// -------------------------------------------------------------------- star
export function makeStar(r = 1, o = {}) {
  const g = new THREE.Group();
  const mat = starMaterial(o);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(r, 96, 64), mat);
  g.add(ball);
  const corona = glowQuad({ color: o.glow || o.color || '#FFB45A', intensity: o.glowI || 1.6, size: r * (o.corona || 3.2), rays: o.rays == null ? 0.8 : o.rays, falloff: 1.6 });
  g.add(corona);
  g.userData = { mat, ball, corona };
  return g;
}

// ------------------------------------------------------------------ galaxy
export function makeGalaxy(R = 10, n = 26000, o = {}) {
  const r = rng(o.seed || 11);
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const sz = new Float32Array(n);
  const ang = new Float32Array(n);
  const arms = o.arms || 2;
  const warm = lin('#FFD39A');
  const cool = lin('#9CC4FF');
  const pink = lin('#FF8FA6');
  const gauss = () => (r() + r() + r() - 1.5) / 1.5;
  for (let i = 0; i < n; i++) {
    const kind = r();
    const core = kind < 0.16;
    const disk = !core && kind < 0.5;
    let rad, a, th;
    if (core) {
      rad = Math.pow(r(), 2.2) * R * 0.28;
      a = r() * Math.PI * 2;
      th = gauss() * R * 0.07 * (1 - rad / (R * 0.3));
    } else if (disk) {
      rad = -Math.log(1 - r() * 0.95) * R * 0.3;
      a = r() * Math.PI * 2;
      th = gauss() * R * 0.02;
    } else {
      rad = R * (0.12 + 0.88 * Math.pow(r(), 0.85));
      const arm = Math.floor(r() * arms);
      a = (arm / arms) * Math.PI * 2 + Math.log(rad / (R * 0.1)) * 2.1 + gauss() * 0.28 * (0.6 + rad / R);
      th = gauss() * R * 0.018;
    }
    rad = Math.min(rad, R * 1.05);
    pos[i * 3] = Math.cos(a) * rad;
    pos[i * 3 + 1] = th;
    pos[i * 3 + 2] = Math.sin(a) * rad;
    ang[i] = a;
    const k = rad / R;
    const c = core ? warm : r() < 0.05 && !disk ? pink : warm.clone().lerp(cool, Math.min(1, k * (disk ? 0.8 : 1.4)));
    const b = (core ? 1.5 : disk ? 0.45 : 1.0) * (0.5 + r());
    col[i * 3] = c.r * b;
    col[i * 3 + 1] = c.g * b;
    col[i * 3 + 2] = c.b * b;
    sz[i] = R * 0.0045 * (0.5 + r() * r() * 2.2) * (core ? 1.3 : 1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aCol', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sz, 1));
  const mat = dotsMaterial({
    uniforms: { uSpin: { value: 0 }, uI: { value: o.intensity || 1 }, uR: { value: R }, uFade: { value: 1 }, uBlast: { value: 0 }, uCutC: { value: new THREE.Vector3() }, uCutR: { value: -1 }, uCutR2: { value: -1 } },
    attrs: 'attribute vec3 aCol; attribute float aSize;',
    body: `
      float rad = length(position.xz);
      float a = uSpin * (1.0 / (0.25 + rad / uR));
      float c = cos(a), s = sin(a);
      P = vec3(c * position.x - s * position.z, position.y, s * position.x + c * position.z);
      P += normalize(P + vec3(0.0001)) * uBlast * (0.4 + 0.6 * fract(sin(dot(position, vec3(12.9, 78.2, 37.7))) * 4375.85)) * uR;
      // burn region: a sphere (uCutC, uCutR) erases what it covers; a second radius uCutR2
      // spares a core (used to show a strike that skips the core)
      float dc = length(P - uCutC);
      float burnt = uCutR > 0.0 ? 1.0 - smoothstep(uCutR * 0.86, uCutR, dc) : 0.0;
      float edge = uCutR > 0.0 ? smoothstep(uCutR * 0.8, uCutR, dc) * (1.0 - smoothstep(uCutR, uCutR * 1.06, dc)) : 0.0;
      float spared = uCutR2 > 0.0 ? 1.0 - smoothstep(uCutR2 * 0.8, uCutR2, length(P)) : 0.0;
      burnt *= 1.0 - spared;
      P = (modelMatrix * vec4(P, 1.0)).xyz;
      S = aSize * (1.0 + edge * 1.5); C = aCol * uI + vec3(1.0, 0.45, 0.15) * edge * 2.5 * (1.0 - spared); A = uFade * (1.0 - burnt);`,
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  const g = new THREE.Group();
  g.add(pts);
  const core = glowQuad({ color: '#FFD9A0', intensity: (o.coreI || 1.2) * (o.intensity || 1), size: R * 0.35, falloff: 1.4 });
  g.add(core);
  g.userData = { mat, pts, core };
  return g;
}

// -------------------------------------------------------------- cosmic web
export function makeCosmicWeb(R = 10, o = {}) {
  const r = rng(o.seed || 21);
  const nodes = [];
  for (let i = 0; i < (o.nodes || 70); i++) {
    const v = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize().multiplyScalar(R * Math.cbrt(r()));
    nodes.push(v);
  }
  const P = [];
  const Cc = [];
  const push = (v, b, c) => {
    P.push(v.x, v.y, v.z);
    Cc.push(c.r * b, c.g * b, c.b * b);
  };
  const warm = lin('#FFC890');
  const cool = lin('#8FB8FF');
  for (const a of nodes) {
    // cluster at node
    for (let k = 0; k < 160; k++) {
      const d = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).multiplyScalar(R * 0.06 * Math.pow(r(), 2));
      push(a.clone().add(d), 0.55, warm);
    }
    // filaments to 3 nearest
    const near = nodes.filter((b) => b !== a).sort((x, y) => x.distanceTo(a) - y.distanceTo(a)).slice(0, 3);
    for (const b of near) {
      const L = a.distanceTo(b);
      const m = Math.floor(L * 26);
      for (let k = 0; k < m; k++) {
        const t = r();
        const v = a.clone().lerp(b, t);
        v.add(new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).multiplyScalar(R * 0.025 * (0.4 + Math.sin(Math.PI * t))));
        push(v, 0.5 + r() * 0.6, cool.clone().lerp(warm, r() * 0.4));
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  geo.setAttribute('aCol', new THREE.Float32BufferAttribute(Cc, 3));
  const mat = dotsMaterial({
    uniforms: { uI: { value: o.intensity || 1 }, uSize: { value: o.size || R * 0.012 }, uFade: { value: 1 } },
    attrs: 'attribute vec3 aCol;',
    body: `P = (modelMatrix * vec4(position, 1.0)).xyz; S = uSize; C = aCol * uI; A = uFade;`,
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  const g = new THREE.Group();
  g.add(pts);
  g.userData = { mat, pts };
  return g;
}

// ------------------------------------------------------- lit window blocks
export function windowMaterial(o = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { uBody: { value: lin(o.body || '#141823') }, uLit: { value: lin(o.lit || '#FFC77A') }, uI: { value: o.intensity || 2.2 }, uLight: { value: new THREE.Vector3(-0.5, 0.7, 0.5).normalize() }, uFade: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vP; varying float vId;
      void main(){
        vec4 w = modelMatrix * ${o.instanced ? 'instanceMatrix *' : ''} vec4(position, 1.0);
        vP = position * vec3(${o.instanced ? 'length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz)' : '1.0, 1.0, 1.0'});
        vN = normalize(mat3(modelMatrix) * ${o.instanced ? 'mat3(instanceMatrix) *' : ''} normal);
        vId = ${o.instanced ? 'float(gl_InstanceID)' : '0.0'};
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uBody; uniform vec3 uLit; uniform float uI; uniform vec3 uLight; uniform float uFade;
      varying vec3 vN; varying vec3 vP; varying float vId;
      ${NOISE}
      void main(){
        vec3 N = normalize(vN);
        float l = 0.35 + 0.65 * max(dot(N, uLight), 0.0);
        vec3 col = uBody * l;
        if (abs(N.y) < 0.5) {
          vec2 q = vec2(abs(N.x) > 0.5 ? vP.z : vP.x, vP.y) * vec2(${o.wx || 9.0}, ${o.wy || 14.0});
          vec2 f = fract(q); vec2 id = floor(q);
          float win = step(0.2, f.x) * step(f.x, 0.8) * step(0.25, f.y) * step(f.y, 0.75);
          float on = step(0.45, hash13(vec3(id, vId)));
          col += uLit * win * on * uI * (0.6 + 0.4 * hash13(vec3(id.yx, vId + 3.0)));
        }
        gl_FragColor = vec4(col * uFade, 1.0);
      }`,
  });
}
export function makeCity(n = 220, size = 4, o = {}) {
  const r = rng(o.seed || 5);
  const geo = new THREE.BoxGeometry(1, 1, 1);
  geo.translate(0, 0.5, 0);
  const mat = windowMaterial({ instanced: true, wx: 6, wy: 10, intensity: 2.4 });
  const im = new THREE.InstancedMesh(geo, mat, n);
  const m = new THREE.Matrix4();
  const grid = Math.ceil(Math.sqrt(n));
  let k = 0;
  for (let i = 0; i < grid && k < n; i++)
    for (let j = 0; j < grid && k < n; j++) {
      const x = (i / grid - 0.5) * size + (r() - 0.5) * 0.05 * size;
      const z = (j / grid - 0.5) * size + (r() - 0.5) * 0.05 * size;
      const d = Math.hypot(x, z) / (size * 0.7);
      const h = (0.05 + Math.pow(r(), 3) * 0.45 * (1 - d)) * size * 0.5 + 0.02 * size;
      const w = (size / grid) * (0.45 + r() * 0.3);
      m.makeScale(w, h, w).setPosition(x, 0, z);
      im.setMatrixAt(k++, m);
    }
  im.frustumCulled = false;
  return im;
}

// ------------------------------------------------------------ brick
export function brickMaterial(o = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { uLight: { value: new THREE.Vector3(-0.5, 0.8, 0.6).normalize() }, uI: { value: o.intensity || 1.4 }, uHeat: { value: 0 } },
    vertexShader: `varying vec3 vN; varying vec3 vO; void main(){ vO = position; vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
    fragmentShader: /* glsl */ `
      uniform vec3 uLight; uniform float uI; uniform float uHeat; varying vec3 vN; varying vec3 vO;
      ${NOISE}
      void main(){
        vec3 N = normalize(vN);
        float n = fbm3(vO * 9.0) * 0.5 + 0.5;
        float pits = step(0.93, hash13(floor(vO * 260.0)));
        vec3 clay = mix(vec3(0.36, 0.09, 0.045), vec3(0.58, 0.2, 0.1), n) * (1.0 - pits * 0.35);
        clay = mix(clay, vec3(0.55, 0.5, 0.44), smoothstep(0.62, 0.7, fbm3(vO * 30.0)) * 0.5);
        float l = 0.12 + 0.95 * max(dot(N, uLight), 0.0);
        vec3 col = clay * l + vec3(1.0, 0.5, 0.2) * uHeat;
        gl_FragColor = vec4(col * uI, 1.0);
      }`,
  });
}
// a brick split into chunks that fly apart: call update(k) with k = seconds since impact
export function makeShatterBrick(sx = 0.48, sy = 0.23, sz = 0.11, o = {}) {
  const g = new THREE.Group();
  const mat = brickMaterial(o);
  const r = rng(o.seed || 9);
  const nx = 4;
  const ny = 2;
  const nz = 2;
  const pieces = [];
  for (let i = 0; i < nx; i++)
    for (let j = 0; j < ny; j++)
      for (let k = 0; k < nz; k++) {
        const w = sx / nx;
        const h = sy / ny;
        const d = sz / nz;
        const geo = new THREE.BoxGeometry(w * (0.92 + r() * 0.08), h * (0.92 + r() * 0.08), d * (0.9 + r() * 0.1), 1, 1, 1);
        // keep object-space coords continuous across chunks for the procedural texture
        const c = new THREE.Vector3((i + 0.5) * w - sx / 2, (j + 0.5) * h - sy / 2, (k + 0.5) * d - sz / 2);
        geo.translate(c.x, c.y, c.z);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(c).negate();
        const m = new THREE.Group(); // pivot at the chunk centre
        m.add(mesh);
        m.position.copy(c);
        const v = c.clone().normalize().multiplyScalar(0.25 + r() * 0.35);
        v.y += 0.1 + r() * 0.15;
        pieces.push({ m, c, v, w: new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).multiplyScalar(4) });
        g.add(m);
      }
  g.userData = {
    mat,
    update(k) {
      for (const p of pieces) {
        const s = k <= 0 ? 0 : (1 - Math.exp(-k * 2.2)) / 2.2;
        p.m.position.copy(p.c).addScaledVector(p.v, s * (o.spread || 1));
        p.m.rotation.set(p.w.x * s, p.w.y * s, p.w.z * s);
      }
    },
  };
  return g;
}

// ---------------------------------------------------------------- infinity
// Particles flowing along a lemniscate. It can unroll into a straight segment (uMorph),
// drain from one end (uDrain), scatter into dust (uScatter) and change colour (uGrey).
export function makeInfinity(n = 9000, o = {}) {
  const r = rng(o.seed || 8);
  const aS = new Float32Array(n);
  const aOff = new Float32Array(n * 3);
  const aSeed = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    aS[i] = i / n;
    const rr = Math.pow(r(), 1.6);
    const th = r() * Math.PI * 2;
    const ph = Math.acos(2 * r() - 1);
    aOff[i * 3] = rr * Math.sin(ph) * Math.cos(th);
    aOff[i * 3 + 1] = rr * Math.sin(ph) * Math.sin(th);
    aOff[i * 3 + 2] = rr * Math.cos(ph);
    aSeed[i] = r();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  geo.setAttribute('aS', new THREE.BufferAttribute(aS, 1));
  geo.setAttribute('aOff', new THREE.BufferAttribute(aOff, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(aSeed, 1));
  const mat = dotsMaterial({
    uniforms: {
      uCenter: { value: new THREE.Vector3() },
      uScale: { value: o.scale || 2 },
      uRot: { value: 0 },
      uTilt: { value: 0 },
      uMorph: { value: 0 },
      uLineA: { value: new THREE.Vector3(-3, 0, 0) },
      uLineB: { value: new THREE.Vector3(3, 0, 0) },
      uScatter: { value: 0 },
      uDrain: { value: 0 },
      uGrey: { value: 0 },
      uI: { value: o.intensity || 1.6 },
      uThick: { value: o.thick || 0.07 },
      uSize: { value: o.size || 0.035 },
      uGather: { value: 1 },
      uColA: { value: lin(o.colA || '#FFC56B') },
      uColB: { value: lin(o.colB || '#FFF0CF') },
    },
    attrs: 'attribute float aS; attribute vec3 aOff; attribute float aSeed;',
    body: /* glsl */ `
      float s = fract(aS + uTime * 0.035);
      float th = s * 6.2831853;
      float d = 1.0 + sin(th) * sin(th);
      vec3 L = vec3(cos(th) / d, sin(th) * cos(th) / d, 0.0) * uScale;
      float cr = cos(uRot), sr = sin(uRot);
      L = vec3(cr * L.x + sr * L.z, L.y, -sr * L.x + cr * L.z);
      float ct = cos(uTilt), st = sin(uTilt);
      L = vec3(L.x, ct * L.y - st * L.z, st * L.y + ct * L.z);
      vec3 lem = uCenter + L + aOff * uThick * uScale;
      // unrolled: ordered along the segment, a lemniscate pulled straight from its crossing
      vec3 seg = mix(uLineA, uLineB, aS) + aOff * uThick * 0.35 * length(uLineB - uLineA) * 0.12;
      float m = smoothstep(0.0, 1.0, clamp(uMorph * 1.6 - aSeed * 0.6, 0.0, 1.0));
      P = mix(lem, seg, m);
      // dust: scatter outward and drift, then (uGather) come back
      vec3 dir = normalize(aOff + vec3(0.0001)) * (0.6 + aSeed * 1.8) + vec3(snoise(vec3(aSeed * 40.0, uTime * 0.1, 1.0)), snoise(vec3(aSeed * 33.0, 2.0, uTime * 0.1)), 0.0) * 0.6;
      P += dir * uScatter * uScale * 1.4;
      P = (modelMatrix * vec4(P, 1.0)).xyz;
      float lit = smoothstep(uDrain - 0.08, uDrain + 0.02, aS);   // drained part goes dark
      vec3 col = mix(uColA, uColB, smoothstep(0.6, 1.0, aSeed));
      col = mix(col, vec3(0.55, 0.52, 0.5) * 0.5, uGrey);
      C = col * uI * (0.25 + 0.75 * lit) * (0.6 + 0.8 * pow(aSeed, 3.0));
      S = uSize * (0.6 + aSeed * 0.9);
      A = 1.0 - uScatter * 0.55;`,
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  pts.userData.mat = mat;
  pts.userData.u = mat.uniforms;
  return pts;
}
