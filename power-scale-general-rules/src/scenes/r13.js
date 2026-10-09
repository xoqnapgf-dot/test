// 0.13 · 束缚能只是下限
// A planet taken apart twice: once the ideal way (its matter drifts off, nothing glows: exactly
// U), once the way stories tell it (flash, heat, debris far faster than escape). A stacked bar
// grows past U and its top dissolves into "no formula". Calibration: a type Ia supernova,
// Kepler's remnant, U ≈ 5×10⁴³ J vs ejecta ≈ 1.3×10⁴⁴ J, about 2–3 ×.
import * as THREE from 'three';
import { makeScene } from './base.js';
import { makePlanet } from '../gfx/objects.js';
import { glowQuad, dotsMaterial, lin } from '../gfx/materials.js';
import { texture } from '../core/images.js';
import { clamp, lerp, smooth, ease, win, env, keys, rng } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { strike } from './common.js';

export function build() {
  const sc = makeScene('r13', 'cosmos', { fov: 38, backdrop: { stars: 0.9, nebula: 0.6, tint: '#6a2a14' } });
  const { three, camera } = sc;
  const T = sc.c;
  camera.position.set(0, 0, 16);
  camera.lookAt(0, 0, 0);

  const PC = new THREE.Vector3(-3.6, 0.2, 0);
  const planet = makePlanet(1.7, { seed: 6.2, light: [-0.6, 0.4, 0.7], clouds: 0.6 });
  planet.position.copy(PC);
  three.add(planet);
  const pU = planet.userData.mat.uniforms;

  // particle body of the same planet
  const r = rng(31);
  const N = 16000;
  const P = new Float32Array(N * 3);
  const S = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const v = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize().multiplyScalar(1.7 * Math.cbrt(r()));
    P.set([v.x, v.y, v.z], i * 3);
    S[i] = r();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(P, 3));
  geo.setAttribute('aS', new THREE.BufferAttribute(S, 1));
  const bodyM = dotsMaterial({
    uniforms: { uQuiet: { value: 0 }, uBoom: { value: 0 }, uA: { value: 0 }, uC: { value: PC.clone() } },
    attrs: 'attribute float aS;',
    body: /* glsl */ `
      vec3 d = normalize(position + vec3(0.0001));
      float rr = length(position) / 1.7;
      // quiet: everything drifts outward slowly and evenly, cold rock colour
      vec3 q = position * (1.0 + uQuiet * (1.2 + aS * 2.4));
      // boom: fast, uneven, hot
      float sp = (1.0 + aS * aS * 3.6) * (0.6 + rr);
      vec3 b = position + d * uBoom * sp + vec3(snoise(vec3(aS * 30.0, 1.0, 2.0)), snoise(vec3(3.0, aS * 30.0, 1.0)), 0.0) * uBoom * 0.8;
      P = uC + mix(q, b, step(0.001, uBoom));
      vec3 rock = mix(vec3(0.35, 0.3, 0.26), vec3(0.6, 0.55, 0.48), aS);
      vec3 hot = mix(vec3(1.0, 0.45, 0.12), vec3(1.0, 0.85, 0.55), aS) * (2.5 - uBoom * 1.4);
      C = mix(rock * 0.9, hot, step(0.001, uBoom));
      S = mix(0.06, 0.05 + 0.04 * (1.0 - uBoom), step(0.001, uBoom));
      A = uA * (1.0 - smoothstep(0.75, 1.0, uBoom));`,
  });
  const body = new THREE.Points(geo, bodyM);
  body.frustumCulled = false;
  three.add(body);
  const flash = glowQuad({ color: '#FFD8A0', intensity: 0, size: 4, rays: 1.2, falloff: 1.2 });
  flash.position.copy(PC);
  three.add(flash);

  // Ia: white dwarf + Kepler's remnant plate
  const wd = glowQuad({ color: '#E8F2FF', intensity: 0, size: 0.35, falloff: 3 });
  const KC = new THREE.Vector3(3.6, 0.6, 0);
  wd.position.copy(KC);
  three.add(wd);
  const kMat = new THREE.ShaderMaterial({
    uniforms: { map: { value: texture('kepler') }, uA: { value: 0 }, uR: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `uniform sampler2D map; uniform float uA; uniform float uR; varying vec2 vUv;
      void main(){ vec2 d = vUv - 0.5; float r = length(d) * 2.0; vec3 c = texture2D(map, 0.5 + d / max(uR, 0.001)).rgb;
        float inside = step(r, uR); float edge = smoothstep(uR * 0.85, uR, r) * inside;
        gl_FragColor = vec4((c * 1.6 + vec3(1.0, 0.8, 0.6) * edge * 0.4) * inside * uA, 1.0); }`,
  });
  const kPlate = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 6.4), kMat);
  kPlate.position.copy(KC);
  three.add(kPlate);

  sc.update = (t) => {
    pU.uTime.value = t;
    planet.rotation.y = t * 0.08;
    for (const q of [flash, wd]) q.material.uniforms.uTime.value = t;
    // quiet disassembly in line 2, held through 3
    const qk = win(t, T(2, '静悄悄', -0.4), 6.0, ease.inOut2);
    const qOn = env(t, T(2, '静悄悄', -0.6), 0.6, T(4, '', -0.5), 0.6);
    // explosive in line 4
    const bk = win(t, T(4, '爆炸', -0.2), 3.6, ease.out3);
    const bOn = env(t, T(4, '爆炸', -0.3), 0.2, T(10, '', -0.6), 0.8);
    const restore = env(t, T(3, '创作里', 0.4), 0.8, T(4, '爆炸', -0.3), 0.15);
    const show = clamp(qOn * (1 - restore) + bOn);
    bodyM.uniforms.uA.value = show;
    bodyM.uniforms.uQuiet.value = qk * (1 - restore);
    bodyM.uniforms.uBoom.value = bOn > 0 ? bk : 0;
    bodyM.uniforms.uTime.value = t;
    const planetOn = 1 - Math.max(qOn * (1 - restore), bOn > 0.05 ? 1 : 0);
    planet.visible = planetOn > 0.02 && t < T(10, '', 0);
    pU.uI.value = 1.6 * planetOn;
    pU.uHeat.value = 0;
    flash.material.uniforms.uI.value = 6 * Math.max(0, 1 - (t - T(4, '爆炸', -0.2)) / 1.2) * (t > T(4, '爆炸', -0.2) ? 1 : 0);
    // Ia: white dwarf then remnant
    const ia = win(t, T(10, '', -0.4), 0.8);
    const det = win(t, T(11, '白矮星', 1.4), 2.6, ease.out3);
    wd.material.uniforms.uI.value = ia * (det < 0.02 ? 3 : 0) + 12 * Math.max(0, 1 - (t - T(11, '白矮星', 1.4)) / 0.9) * (t > T(11, '白矮星', 1.4) ? 1 : 0);
    kMat.uniforms.uR.value = det;
    kMat.uniforms.uA.value = ia * (1 - win(t, 1e9, 1));
    camera.position.set(0, 0, 16 - 1.2 * win(t, T(10, ''), 4, ease.inOut2));
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
  };

  // stacked energy bar at the right during lines 1–9
  const BX = 1300;
  const BW = 150;
  const BY = 900; // bar floor
  const UH = 260; // height of U
  sc.draw = (g, t) => {
    {
      const a = env(t, T(0, '', -0.5), 0.8, T(10, '', -0.4), 0.7);
      if (a > 0) {
        g.text('束缚能：下限，且上限算不出', 960, 100, { kind: 'serif', size: 46, weight: 700, color: 'ink', align: 'center', alpha: a });
        const k1 = win(t, T(1, '引力束缚能', -0.4), 0.8);
        // U block
        g.rect(BX, BY - UH * k1, BW, UH * k1, { fill: 'rgba(120,200,255,0.25)', color: 'range', w: 2, alpha: a });
        g.text('U', BX + BW / 2, BY - UH / 2 + 18, { kind: 'math', size: 56, color: 'rangeLite', align: 'center', alpha: a * k1 });
        g.text('引力束缚能', BX + BW + 24, BY - UH + 30, { kind: 'serif', size: 30, weight: 700, color: 'range', alpha: a * k1 });
        g.text('爆行星 · 爆恒星各级的表内值', BX + BW + 24, BY - UH + 70, { kind: 'sans', size: 22, color: 'ink2', alpha: a * k1 });
        g.text('均匀球：U = 3GM² / 5R', BX + BW + 24, BY - UH + 110, { kind: 'math', size: 26, color: 'ink2', alpha: a * win(t, T(1, '数值'), 0.6) });
        // ideal process notes
        const k2 = env(t, T(2, '理想化', -0.2), 0.6, T(4, '', -0.3), 0.6);
        g.text('理想过程', 560, 200, { kind: 'serif', size: 40, weight: 700, color: 'range', align: 'center', alpha: a * k2 });
        g.text('缓慢解体 · 平稳飘散到无穷远', 560, 250, { kind: 'sans', size: 28, color: 'ink2', align: 'center', alpha: a * k2 * win(t, T(2, '缓慢解体'), 0.5) });
        const k3 = env(t, T(3, '百分之百', -0.3), 0.6, T(4, '', -0.3), 0.6);
        g.text('100% 转化为拆散的功 · 零耗散', 560, 300, { kind: 'sans', size: 28, color: 'rangeLite', align: 'center', alpha: a * k3 });
        g.seal('几乎没人这样写', 560, 860, { size: 120, shape: 'rect', color: '#B7B0A2', p: win(t, T(3, '几乎没有人', -0.2), 0.5), alpha: k3 });
        // real process
        const k4 = env(t, T(4, '', -0.2), 0.6, T(10, '', -0.4), 0.6);
        g.text('真实的表现', 560, 200, { kind: 'serif', size: 40, weight: 700, color: 'energy', align: 'center', alpha: a * k4 });
        g.text('爆炸 · 撞击 · 光爆 · 碎片高速抛飞', 560, 250, { kind: 'sans', size: 28, color: 'ink2', align: 'center', alpha: a * k4 * win(t, T(4, '爆炸'), 0.5) });
        // stacked extras
        const extras = [['热辐射', T(5, '热辐射'), 80, '#FF8A4A'], ['光辐射', T(5, '光辐射'), 70, '#FFD08A'], ['多余动能', T(5, '多余动能'), 110, '#FF5B3F']];
        let top = BY - UH;
        extras.forEach(([nm, tc, h, col]) => {
          const k = win(t, tc - 0.2, 0.7, ease.out3);
          if (k <= 0) return;
          const hh = h * k;
          g.rect(BX, top - hh, BW, hh, { fill: col, alpha: a * 0.75 });
          g.text(nm, BX - 20, top - hh / 2 + 10, { kind: 'sans', size: 26, weight: 500, color: col, align: 'right', alpha: a * k });
          top -= hh;
        });
        g.text('都不计入束缚能', BX - 20, BY - UH - 300, { kind: 'sans', size: 24, color: 'ink2', align: 'right', alpha: a * win(t, T(5, '不计入'), 0.5) });
        // necessarily higher
        const k6 = win(t, T(6, '必然超过', -0.3), 0.6);
        if (k6 > 0) {
          g.seg(BX - 40, BY - UH, BX + BW + 300, BY - UH, { color: 'range', w: 2, dash: [8, 6], alpha: a });
          g.text('实际输出 > U', BX + BW + 24, BY - UH - 70, { kind: 'math', size: 40, color: 'energy', alpha: a * k6, glow: 10 });
          g.text('“通常更高”', BX + BW + 40, BY - UH - 210, { kind: 'kai', size: 32, color: 'ink2', alpha: a * win(t, T(6, '通常更高'), 0.4) });
          strike(g, BX + BW + 30, BY - UH - 220, BX + BW + 230, BY - UH - 226, win(t, T(6, '必然更高', -0.4), 0.4), { w: 8 });
          g.text('必然更高', BX + BW + 40, BY - UH - 140, { kind: 'serif', size: 36, weight: 900, color: 'energy', alpha: a * win(t, T(6, '必然更高'), 0.4) });
        }
        // upper part dissolves: no formula
        const k7 = win(t, T(7, '上限', -0.2), 1.0);
        if (k7 > 0) {
          const y0 = BY - UH - 260;
          const grd = g.x.createLinearGradient(0, y0, 0, y0 - 240);
          grd.addColorStop(0, 'rgba(255,91,63,0.6)');
          grd.addColorStop(1, 'rgba(255,91,63,0)');
          g.x.save();
          g.x.globalAlpha = a * k7;
          g.x.fillStyle = grd;
          const wob = 30 * Math.sin(t * 2.2) + 20 * Math.sin(t * 3.7);
          g.x.fillRect(BX, y0 - 240 - wob, BW, 240 + wob);
          g.x.restore();
          g.text('?', BX + BW / 2, y0 - 120, { kind: 'math', size: 90, color: 'red', align: 'center', alpha: a * k7 });
          g.tag('没有统一比例，也没有公式', BX - 30, y0 - 220, 'rejected', { align: 'right', size: 26, p: win(t, T(7, '没有统一', -0.2), 0.5) });
        }
        // the rule
        const k8 = win(t, T(8, '只能当下限', -0.3), 0.6);
        if (k8 > 0) {
          g.card(200, 360, 720, 240, {
            p: k8,
            alpha: a * (1 - win(t, T(9, ''), 0.4)),
            border: 'gold',
            fn: (g2, w) => {
              g2.text('表内束缚能', 40, 70, { kind: 'sans', size: 28, color: 'ink2' });
              g2.text('只能当下限', 40, 140, { kind: 'serif', size: 52, weight: 900, color: 'gold' });
              g2.text('不能给角色的输出封顶', 40, 200, { kind: 'sans', size: 30, color: 'red', alpha: win(t, T(8, '封顶'), 0.5) });
            },
          });
        }
        const k9 = win(t, T(9, '', -0.2), 0.6);
        if (k9 > 0) {
          g.card(200, 360, 720, 280, {
            p: k9,
            fn: (g2, w) => {
              g2.text('上限没有公式解', 40, 70, { kind: 'serif', size: 40, weight: 900 });
              g2.text('→ 分析原文对攻击路径、覆盖范围的描写', 40, 140, { kind: 'sans', size: 28 });
              g2.text('→ 限定区间', 40, 196, { kind: 'sans', size: 28, color: 'energy', alpha: win(t, T(9, '限定区间'), 0.5) });
              g2.tag('正是第十条（0.10）存在的原因', 40, 246, 'range', { size: 24, p: win(t, T(9, '第十条'), 0.5) });
            },
          });
        }
      }
    }
    // ------------------------------------------------ Ia calibration
    {
      const a = win(t, T(10, '', -0.4), 0.8);
      if (a > 0) {
        g.text('校准案例：Ia 型超新星', 960, 100, { kind: 'serif', size: 46, weight: 700, color: 'ink', align: 'center', alpha: a });
        const kp = sc.project(KC);
        g.text('开普勒超新星遗迹（SN 1604）', kp[0], kp[1] + 400, { kind: 'sans', size: 22, color: 'ink3', align: 'center', alpha: a * win(t, T(12, ''), 0.6) });
        g.text('NASA / ESA / JHU / R. Sankrit & W. Blair', kp[0], kp[1] + 432, { kind: 'sans', size: 18, color: 'ink3', align: 'center', alpha: a * win(t, T(12, ''), 0.6) * 0.8 });
        const k11 = win(t, T(11, '白矮星', -0.4), 0.6);
        g.text('白矮星 · 约 1.4 倍太阳质量', 120, 280, { kind: 'serif', size: 34, weight: 700, color: 'rangeLite', alpha: a * k11 });
        // two bars: U and kinetic energy (linear scale, 1e43 J = 40 px)
        const ub = win(t, T(11, '束缚能', 0), 0.9, ease.out3);
        const kb = win(t, T(12, '动能', 0), 1.4, ease.out3);
        const y1 = 420;
        const y2 = 560;
        const s = 46;
        g.text('引力束缚能 U', 120, y1 - 20, { kind: 'sans', size: 28, color: 'range', alpha: a * ub });
        g.rect(120, y1, 5 * s * ub, 56, { r: 6, fill: 'range', alpha: a * 0.85 });
        g.sci([5, 43], 140 + 5 * s, y1 + 42, { prefix: '≈ ', size: 30, color: 'rangeLite', unit: 'J', alpha: a * ub });
        g.text('抛射物动能', 120, y2 - 20, { kind: 'sans', size: 28, color: 'energy', alpha: a * kb });
        g.rect(120, y2, 13 * s * kb, 56, { r: 6, fill: 'energy', alpha: a * 0.85 });
        g.sci([1.3, 44], 140 + 13 * s * kb, y2 + 42, { prefix: '≈ ', size: 30, color: 'energyLite', unit: 'J', alpha: a * kb });
        // ratio marks: 2U and 3U
        const rk = win(t, T(12, '两到三倍', -0.3), 0.6);
        for (const m of [1, 2, 3]) {
          g.seg(120 + 5 * s * m, y1 - 10, 120 + 5 * s * m, y2 + 76, { color: 'ink3', w: 1.5, dash: [5, 5], alpha: a * rk });
          g.text(`${m}U`, 120 + 5 * s * m, y2 + 110, { kind: 'math', size: 26, color: 'ink2', align: 'center', alpha: a * rk });
        }
        g.text('≈ 2.6 倍：理论下限的 2–3 倍', 120, y2 + 180, { kind: 'serif', size: 38, weight: 900, color: 'energy', alpha: a * rk, glow: 10 });
        const k13 = win(t, T(13, '保守估算', -0.3), 0.6);
        g.tag('找不到更好依据时：保守估算的起点', 120, y2 + 260, 'energy', { size: 28, p: k13 });
        g.text('比直接把下限当答案更负责', 120, y2 + 330, { kind: 'sans', size: 26, color: 'ink2', alpha: a * win(t, T(13, '更负责'), 0.5) });
        g.seal('非普适公式', 860, 900, { size: 130, shape: 'rect', p: win(t, T(14, '不是普适', -0.2), 0.5) });
      }
    }
  };
  return sc;
}
