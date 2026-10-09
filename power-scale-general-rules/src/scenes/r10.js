// 0.10 · 远距离打击的交叉比对
// Attacker on the left, a sun-sized creature on the right, a belt of rocks along the way.
// Strongest destroyed object + distance -> real output. Things that should have been swept and
// were not -> directed. A portal -> spatial ability. Then the worked example: a thin tracking
// beam that leaves every rock alone vs a spreading front that grinds through them, and the
// diameter: smaller than the target, by an amount the text does not give -> median estimate.
import * as THREE from 'three';
import { makeScene } from './base.js';
import { makeStar } from '../gfx/objects.js';
import { glowQuad, shellMaterial, lin, dotsMaterial } from '../gfx/materials.js';
import { NOISE } from '../gfx/glsl.js';
import { clamp, lerp, smooth, ease, win, env, keys, rng } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { strike } from './common.js';

export function build() {
  const sc = makeScene('r10', 'cosmos', { fov: 40, backdrop: { stars: 1, nebula: 0.7, tint: '#5a2a18' } });
  const { three, camera } = sc;
  const T = sc.c;

  const A = new THREE.Vector3(-7.5, 0, 0);
  const atk = glowQuad({ color: '#BFE6FF', intensity: 0, size: 0.35, rays: 0.8 });
  atk.position.copy(A);
  three.add(atk);
  const target = makeStar(1.25, { color: '#FF6A2A', hot: '#FFD08A', intensity: 2.2, glow: '#FF7A3A', glowI: 0.5, corona: 3.6, rays: 1.4, scale: 3.5 });
  three.add(target);
  const tPos = (t) => new THREE.Vector3(7.2, Math.sin(t * 0.25) * 0.8, Math.cos(t * 0.21) * 0.6);

  // rock belt
  const r = rng(17);
  const N = 140;
  const rocks = [];
  const rockGeo = new THREE.IcosahedronGeometry(1, 1);
  const rockMat = new THREE.ShaderMaterial({
    uniforms: { uL: { value: new THREE.Vector3(-0.4, 0.8, 0.5).normalize() } },
    vertexShader: 'varying vec3 vN; varying vec3 vO; void main(){ vO = position; vN = normalize(mat3(modelMatrix * instanceMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform vec3 uL; varying vec3 vN; varying vec3 vO; ${NOISE}
      void main(){ float n = fbm3(vO * 3.0) * 0.5 + 0.5; vec3 c = mix(vec3(0.25,0.23,0.22), vec3(0.55,0.52,0.48), n); float l = 0.1 + 0.9 * max(dot(normalize(vN), uL), 0.0); gl_FragColor = vec4(c * l * 1.2, 1.0); }`,
  });
  const inst = new THREE.InstancedMesh(rockGeo, rockMat, N);
  inst.frustumCulled = false;
  for (let i = 0; i < N; i++) {
    const x = lerp(-5.5, 5.2, r());
    const rr = 0.25 + Math.sqrt(r()) * 2.2;
    const a = r() * Math.PI * 2;
    rocks.push({ p: new THREE.Vector3(x, Math.cos(a) * rr * 0.8, Math.sin(a) * rr), s: 0.05 + r() * r() * 0.14, rot: new THREE.Euler(r() * 6, r() * 6, r() * 6), seed: r() });
  }
  three.add(inst);
  const mtx = new THREE.Matrix4();
  const q = new THREE.Quaternion();

  // tracking beam (tube along a curve that follows the target)
  const beamMat = new THREE.ShaderMaterial({
    uniforms: { uP: { value: 0 }, uI: { value: 0 }, uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `uniform float uP; uniform float uI; uniform float uTime; varying vec2 vUv;
      void main(){ if (vUv.x > uP) discard; float head = smoothstep(uP - 0.04, uP, vUv.x); float r = abs(vUv.y - 0.5) * 2.0;
        float core = exp(-r * r * 6.0); float flow = 0.75 + 0.25 * sin(vUv.x * 120.0 - uTime * 20.0);
        gl_FragColor = vec4(vec3(0.75, 0.9, 1.0) * (core * flow * 1.6 + head * 3.0) * uI, 1.0); }`,
  });
  let beam = null;
  const buildBeam = (end) => {
    const pts = [A.clone(), new THREE.Vector3(-3, 1.4, 0.8), new THREE.Vector3(1.5, -1.2, -0.6), new THREE.Vector3(5, 0.6, 0.4), end.clone()];
    const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 180, 0.035, 8, false);
    if (beam) beam.geometry.dispose();
    else {
      beam = new THREE.Mesh(geo, beamMat);
      beam.frustumCulled = false;
      three.add(beam);
    }
    beam.geometry = geo;
  };
  buildBeam(tPos(0));
  const beamHead = glowQuad({ color: '#CDEBFF', intensity: 0, size: 0.25 });
  three.add(beamHead);

  // spreading front (case B)
  const frontM = shellMaterial({ color: '#FFB060', edge: '#FFF0D0', intensity: 0, rings: 0, core: 0.12 });
  const front = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 48), frontM);
  front.position.copy(A);
  three.add(front);
  // expected coverage (case 2), dashed in 2D
  // portals
  const pA = glowQuad({ color: '#B98CFF', intensity: 0, size: 0.8, rays: 1.2 });
  const pB = glowQuad({ color: '#B98CFF', intensity: 0, size: 0.8, rays: 1.2 });
  three.add(pA, pB);
  // sparks from destroyed rocks
  const SP = [];
  const SS = [];
  for (let i = 0; i < N; i++) for (let k = 0; k < 10; k++) {
    const d = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize();
    SP.push(rocks[i].p.x, rocks[i].p.y, rocks[i].p.z);
    SS.push(d.x, d.y, d.z);
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute('position', new THREE.Float32BufferAttribute(SP, 3));
  sg.setAttribute('aD', new THREE.Float32BufferAttribute(SS, 3));
  const sparkM = dotsMaterial({
    uniforms: { uR: { value: 0 }, uA: { value: 0 }, uC: { value: A.clone() } },
    attrs: 'attribute vec3 aD;',
    body: `float d = length(position - uC); float k = clamp((uR - d) / 1.2, 0.0, 1.0); P = position + aD * k * 0.6; S = 0.05; C = vec3(1.0, 0.6, 0.25) * 2.5; A = uA * k * (1.0 - k) * 4.0;`,
  });
  const sparks = new THREE.Points(sg, sparkM);
  sparks.frustumCulled = false;
  three.add(sparks);

  const cam = [
    [T(0, '', -3), [0, 4.5, 17, 0, 0, 0]],
    [T(7, '', -0.4), [0, 4.5, 17, 0, 0, 0]],
    [T(7, '追踪'), [-3, 3.0, 12, 0, 0, 0]],
    [T(9, '', 0), [1, 3.4, 13.5, 1, 0, 0]],
    [T(10, '如果', -0.3), [1, 3.4, 13.5, 1, 0, 0]],
    [T(10, '沿途', 0.2), [0, 7, 24, 0, 0, 0]],
    [T(11, '', -0.6), [0, 7, 24, 0, 0, 0]],
    [T(11, '', 0.6), [0, 4.5, 17, 0, 0, 0]],
  ];

  sc.update = (t) => {
    const k = keys(t, cam, ease.inOut3);
    camera.position.set(k[0], k[1], k[2]);
    camera.lookAt(k[3], k[4], k[5]);
    camera.updateMatrixWorld();
    const tp = tPos(t);
    target.position.copy(tp);
    target.userData.mat.uniforms.uTime.value = t;
    target.userData.corona.material.uniforms.uTime.value = t;
    target.rotation.y = t * 0.1;
    for (const g of [atk, beamHead, pA, pB]) g.material.uniforms.uTime.value = t;
    atk.material.uniforms.uI.value = 2.4 * win(t, T(0, '', -2), 1.2);
    // example A: tracking beam
    const bA = env(t, T(7, '打出', -0.2), 0.3, T(10, '如果', -0.2), 0.6);
    const bp = win(t, T(7, '打出'), 3.6, ease.inOut2);
    if (bA > 0) buildBeam(tp);
    beamMat.uniforms.uP.value = bp;
    beamMat.uniforms.uI.value = bA;
    beamMat.uniforms.uTime.value = t;
    // target destroyed at the end of the chase (then restored for case B)
    const kill = win(t, T(7, '摧毁'), 0.8) * (1 - win(t, T(8, ''), 0.6));
    const killB = win(t, T(10, '扩散模型', -0.8), 0.8) * (1 - win(t, T(11, ''), 0.6));
    const flash = Math.max(kill, killB);
    target.userData.mat.uniforms.uI.value = 2.2 + 6 * flash;
    target.userData.mat.uniforms.uCrack.value = flash;
    target.scale.setScalar(1 + 0.3 * flash);
    if (beam && bA > 0) {
      const curve = beam.geometry.parameters.path;
      beamHead.position.copy(curve.getPoint(Math.min(1, bp)));
      beamHead.material.uniforms.uI.value = 3 * bA * (bp < 1 ? 1 : 0.3);
    } else beamHead.material.uniforms.uI.value = 0;
    // case B: spreading front sweeps the belt
    const fB = env(t, T(10, '如果'), 0.4, T(10, '完全不同'), 0.8);
    const R = lerp(0.2, 16, win(t, T(10, '沿途'), 3.2, ease.in2));
    front.scale.setScalar(R);
    frontM.uniforms.uI.value = 0.55 * fB;
    frontM.uniforms.uTime.value = t;
    sparkM.uniforms.uR.value = fB > 0 ? R : 0;
    sparkM.uniforms.uA.value = fB;
    // portal (line 3)
    const po = env(t, T(3, '跨越了空间', -0.3), 0.5, T(4, '', 0), 0.6);
    pA.position.copy(A).add(new THREE.Vector3(0.8, 0, 0));
    pB.position.copy(tp).add(new THREE.Vector3(-1.9, 0, 0));
    pA.material.uniforms.uI.value = 2.5 * po;
    pB.material.uniforms.uI.value = 2.5 * po * win(t, T(3, '抵达', -0.3), 0.5);
    // rocks: hidden as the front passes in case B
    for (let i = 0; i < N; i++) {
      const rk = rocks[i];
      const d = rk.p.distanceTo(A);
      const gone = fB > 0 && R > d ? 1 : 0;
      q.setFromEuler(new THREE.Euler(rk.rot.x + t * 0.2 * rk.seed, rk.rot.y + t * 0.1, rk.rot.z));
      const s = rk.s * (1 - gone);
      mtx.compose(rk.p, q, new THREE.Vector3(s, s * 0.8, s));
      inst.setMatrixAt(i, mtx);
    }
    inst.instanceMatrix.needsUpdate = true;
  };

  sc.draw = (g, t) => {
    const ap = sc.project(A);
    const tp3 = tPos(t);
    const tp = sc.project(tp3);
    const ppu = sc.pxPerUnit(tp3);
    // ---------------------------------------- 0–1 strongest object + distance
    {
      const a = env(t, T(0, '', -0.5), 0.8, T(2, '', -0.2), 0.6);
      if (a > 0) {
        g.text('远距离打击的交叉比对', 960, 110, { kind: 'serif', size: 48, weight: 700, color: 'ink', align: 'center', alpha: a });
        const k1 = win(t, T(1, '最强物体', -0.2), 0.6);
        g.text('被摧毁的最强物体', tp[0], tp[1] - 1.8 * ppu - 30, { kind: 'serif', size: 30, weight: 700, color: 'energy', align: 'center', alpha: a * k1 });
        const k2 = win(t, T(1, '距离', -0.2), 0.8);
        g.arrow([ap[0] + 30, ap[1] + 120], [tp[0] - 1.3 * ppu, tp[1] + 120], { color: 'ink2', w: 2, p: k2, alpha: a });
        g.arrow([tp[0] - 1.3 * ppu, tp[1] + 120], [ap[0] + 30, ap[1] + 120], { color: 'ink2', w: 2, p: k2, alpha: a });
        g.text('距离 d', (ap[0] + tp[0]) / 2, ap[1] + 160, { kind: 'math', size: 34, color: 'ink', align: 'center', alpha: a * k2 });
        g.text('角色', ap[0], ap[1] - 50, { kind: 'serif', size: 30, weight: 700, color: 'rangeLite', align: 'center', alpha: a });
        const k3 = win(t, T(1, '求出'), 0.7);
        g.card(760, 820, 400, 120, { p: k3, alpha: a, fn: (g2, w) => g2.text('→ 实际输出的能量', w / 2, 74, { kind: 'serif', size: 34, weight: 700, color: 'energy', align: 'center' }) });
      }
    }
    // ---------------------------------------- 2 should have been swept but were not
    {
      const a = env(t, T(2, '', -0.2), 0.6, T(3, '', -0.2), 0.6);
      if (a > 0) {
        const d = Math.hypot(tp[0] - ap[0], tp[1] - ap[1]);
        g.circle(ap[0], ap[1], d * win(t, T(2, '理论上'), 1.2, ease.out3), { color: 'energy', w: 2, dash: [10, 8], alpha: a * 0.8 });
        g.text('理论上会被能量波覆盖的范围', 960, 170, { kind: 'sans', size: 30, color: 'energyLite', align: 'center', alpha: a * win(t, T(2, '理论上'), 0.6) });
        const k = win(t, T(2, '没有被摧毁', -0.2), 0.6);
        g.text('沿途物体完好', 960, 960, { kind: 'serif', size: 34, weight: 700, color: 'ok', align: 'center', alpha: a * k });
        g.tag('定向控制', 960, 1020, 'range', { align: 'center', size: 30, p: win(t, T(2, '定向控制', -0.2), 0.5) });
      }
    }
    // ---------------------------------------- 3 portal
    {
      const a = env(t, T(3, '', -0.2), 0.6, T(4, '', 0), 0.6);
      if (a > 0) {
        const pa = sc.project(A.clone().add(new THREE.Vector3(0.8, 0, 0)));
        const pb = sc.project(tp3.clone().add(new THREE.Vector3(-1.9, 0, 0)));
        g.line(g.curve([pa[0], pa[1]], [pb[0], pb[1]], -0.25), { color: '#B98CFF', w: 2, dash: [3, 10], p: win(t, T(3, '跨越', 0), 1.2), alpha: a });
        g.tag('跨越空间 · 其他介质 · 其他方式', 960, 170, 'range', { align: 'center', size: 28, p: win(t, T(3, '跨越', -0.2), 0.5) });
        g.text('空间能力和外界因素', 960, 980, { kind: 'serif', size: 40, weight: 700, color: '#C9A8FF', align: 'center', alpha: a * win(t, T(3, '空间能力'), 0.5), glow: 12 });
      }
    }
    // ---------------------------------------- 4–6 how to take path and coverage
    {
      const a = env(t, T(4, '', -0.2), 0.6, T(7, '', -0.3), 0.6);
      if (a > 0) {
        g.rect(0, 0, W, H, { fill: 'rgba(4,6,12,0.93)', alpha: a });
        g.text('能量路径和覆盖范围怎么取值', 960, 210, { kind: 'serif', size: 48, weight: 700, color: 'ink', align: 'center', alpha: a });
        g.card(560, 300, 800, 170, {
          p: win(t, T(5, '回读'), 0.6),
          alpha: a,
          border: 'gold',
          fn: (g2, w) => {
            g2.text('回读原文', 40, 72, { kind: 'serif', size: 40, weight: 900, color: 'gold' });
            g2.text('攻击路径沿途的具体描写', 40, 130, { kind: 'sans', size: 32 });
          },
        });
        const n1 = win(t, T(5, '不能直接套用'), 0.5);
        const n2 = win(t, T(5, '想当然'), 0.5);
        g.text('直接套用被摧毁目标的尺度', 760, 580, { kind: 'sans', size: 30, color: 'ink2', align: 'center', alpha: a * n1 });
        strike(g, 560, 570, 960, 562, win(t, T(5, '不能直接套用', 0.6), 0.4), { w: 8 });
        g.text('靠公式想当然', 1240, 580, { kind: 'sans', size: 30, color: 'ink2', align: 'center', alpha: a * n2 });
        strike(g, 1130, 570, 1350, 564, win(t, T(5, '想当然', 0.4), 0.4), { w: 8 });
        const k6 = win(t, T(6, '', -0.2), 0.6);
        g.text('上限类数据没有公式解', 960, 720, { kind: 'serif', size: 40, weight: 700, color: 'ink', align: 'center', alpha: a * k6 });
        g.text('只能贴着原文逐案分析', 960, 790, { kind: 'serif', size: 40, weight: 700, color: 'energy', align: 'center', alpha: a * win(t, T(6, '逐案'), 0.5) });
      }
    }
    // ---------------------------------------- 7–10 the tracking example
    {
      const a = env(t, T(7, '', -0.2), 0.6, T(11, '', -0.4), 0.6);
      if (a > 0) {
        g.text('例：追击一个太阳大小、太阳密度的生物', 960, 100, { kind: 'serif', size: 40, weight: 700, color: 'ink', align: 'center', alpha: a });
        const k8 = env(t, T(8, '沿途', -0.2), 0.5, T(10, '如果', -0.3), 0.5);
        g.tag('沿途：没有任何东西被摧毁', 140, 220, 'ok', { size: 30, p: k8 });
        const k9 = env(t, T(9, '定向追踪型', -0.3), 0.5, T(10, '如果', -0.3), 0.5);
        g.card(1300, 760, 520, 210, {
          p: k9,
          fn: (g2, w) => {
            g2.text('定向追踪型', 30, 74, { kind: 'serif', size: 40, weight: 900, color: 'rangeLite' });
            g2.text('有效直径较细', 30, 130, { kind: 'sans', size: 30 });
            g2.text('不是扩散型冲击波', 30, 180, { kind: 'sans', size: 26, color: 'ink2' });
          },
        });
        const k10 = win(t, T(10, '如果', -0.2), 0.5);
        g.tag('沿途摧毁了大量物体', 140, 220, 'rejected', { size: 30, p: k10 });
        g.card(1300, 760, 520, 210, {
          p: win(t, T(10, '扩散模型', -0.3), 0.5),
          fn: (g2, w) => {
            g2.text('改按扩散模型', 30, 80, { kind: 'serif', size: 40, weight: 900, color: 'energy' });
            g2.text('判定结果完全不同', 30, 150, { kind: 'sans', size: 30, alpha: win(t, T(10, '完全不同'), 0.5) });
          },
        });
      }
    }
    // ---------------------------------------- 11–12 diameter
    {
      const a = win(t, T(11, '', -0.3), 0.8);
      if (a > 0) {
        g.rect(0, 0, W, H, { fill: 'rgba(4,6,12,0.96)', alpha: a });
        g.text('有效直径怎么取', 960, 140, { kind: 'serif', size: 48, weight: 700, color: 'ink', align: 'center', alpha: a });
        const cx = 620;
        const cy = 520;
        const D = 300;
        g.circle(cx, cy, D / 2, { fill: 'rgba(255,120,60,0.12)', color: 'energy', w: 3, alpha: a, glow: 16 });
        g.seg(cx - D / 2, cy + D / 2 + 40, cx + D / 2, cy + D / 2 + 40, { color: 'energy', w: 2, alpha: a });
        g.text('目标直径 D', cx, cy + D / 2 + 84, { kind: 'math', size: 32, color: 'energy', align: 'center', alpha: a });
        const kb = win(t, T(11, '小于', -0.3), 0.8);
        const dd = D * lerp(0.98, 0.5, ease.inOut3(kb));
        g.circle(cx, cy, dd / 2, { color: 'range', w: 3, dash: [6, 5], alpha: a * kb, glow: 10 });
        g.text('d < D', cx, cy + 14, { kind: 'math', size: 44, color: 'rangeLite', align: 'center', alpha: a * kb });
        g.text('原文没写“覆盖 / 包裹了整体”', cx, 250, { kind: 'sans', size: 28, color: 'ink2', align: 'center', alpha: a * win(t, T(11, '没有写明'), 0.6) });
        // range of d, median estimate
        const kr = win(t, T(11, '小多少'), 0.8);
        const x0 = 1040;
        const x1 = 1760;
        const y = 560;
        g.line([[x0, y], [x1, y]], { color: 'ink2', w: 2, p: kr, alpha: a });
        g.text('0', x0, y + 44, { kind: 'math', size: 30, color: 'ink2', align: 'center', alpha: a * kr });
        g.text('D', x1, y + 44, { kind: 'math', size: 30, color: 'energy', align: 'center', alpha: a * kr });
        g.rect(x0, y - 18, (x1 - x0) * kr, 36, { r: 4, fill: 'rgba(120,200,255,0.16)', alpha: a });
        g.text('d 可能落在这一段：缺乏依据', (x0 + x1) / 2, y - 40, { kind: 'sans', size: 28, color: 'ink2', align: 'center', alpha: a * win(t, T(11, '缺乏依据'), 0.5) });
        const km = win(t, T(12, '中位数', -0.3), 0.6);
        g.circle((x0 + x1) / 2, y, 14, { fill: 'energy', alpha: a * km });
        g.text('取中位数 / 平均值估计', (x0 + x1) / 2, y + 100, { kind: 'serif', size: 36, weight: 700, color: 'energy', align: 'center', alpha: a * km });
        g.text('不擅自假设精确值', (x0 + x1) / 2, y + 156, { kind: 'sans', size: 28, color: 'red', align: 'center', alpha: a * win(t, T(12, '不擅自'), 0.5) });
        g.tag('通则 0.1', (x0 + x1) / 2, y + 220, 'energy', { align: 'center', size: 24, p: win(t, T(12, '零点一'), 0.5) });
      }
    }
  };
  return sc;
}
