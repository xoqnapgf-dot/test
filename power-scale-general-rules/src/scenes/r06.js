// 0.6 · 能量与范围分开标注
// Energy (amber) and range (azure) as two separate readouts. The same energy spread as a
// hemisphere or focused into a beam; a big soft glow vs a small dense core; then a fight sealed
// inside an isolated sphere, where only leaks are visible: the tier is marked 未观测.
import * as THREE from 'three';
import { makeScene } from './base.js';
import { glowQuad, shellMaterial, lin, dotsMaterial } from '../gfx/materials.js';
import { clamp, lerp, smooth, ease, win, env, keys, rng, pulse } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { strike } from './common.js';

export function build() {
  const sc = makeScene('r06', 'cosmos', { fov: 36, backdrop: { stars: 0.7, nebula: 0.5, tint: '#1a3a5a' } });
  const { three, camera } = sc;
  const T = sc.c;

  // ground grids (two pads)
  const mkPad = (x) => {
    const g = new THREE.GridHelper(7, 28, lin('#6FC3FF').multiplyScalar(0.5), lin('#6FC3FF').multiplyScalar(0.18));
    g.material.transparent = true;
    g.material.depthWrite = false;
    g.position.set(x, 0, 0);
    three.add(g);
    return g;
  };
  const padL = mkPad(-4.2);
  const padR = mkPad(4.2);
  // hemisphere shell (left)
  const shellM = shellMaterial({ color: '#6FC3FF', edge: '#D8F0FF', intensity: 1.0, rings: 1 });
  const hemi = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2), shellM);
  hemi.position.set(-4.2, 0, 0);
  three.add(hemi);
  const srcL = glowQuad({ color: '#FFC56B', intensity: 2.5, size: 0.35 });
  srcL.position.set(-4.2, 0.05, 0);
  three.add(srcL);
  // beam (right)
  const beamM = new THREE.ShaderMaterial({
    uniforms: { uI: { value: 0 }, uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `uniform float uI; uniform float uTime; varying vec2 vUv;
      void main(){ float r = abs(vUv.x - 0.5) * 2.0; float core = exp(-r*r*18.0); float halo = exp(-r*r*3.0)*0.25;
        float flick = 0.85 + 0.15 * sin(vUv.y * 40.0 - uTime * 30.0);
        gl_FragColor = vec4(vec3(1.0, 0.82, 0.5) * (core * 2.4 + halo) * flick * uI, 1.0); }`,
  });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 6, 24, 1, true), beamM);
  beam.position.set(4.2, 3, 0);
  three.add(beam);
  const hit = glowQuad({ color: '#FFB060', intensity: 0, size: 0.5, rays: 0.6 });
  hit.position.set(4.2, 0.05, 0);
  three.add(hit);
  // density pair
  const soft = glowQuad({ color: '#9FD3FF', intensity: 0, size: 2.6, falloff: 0.7 });
  soft.position.set(-4.2, 2, 0);
  three.add(soft);
  const dense = glowQuad({ color: '#FFD08A', intensity: 0, size: 0.32, falloff: 4 });
  dense.position.set(4.2, 2, 0);
  three.add(dense);
  // sealed sphere with a fight inside
  const sealM = shellMaterial({ color: '#7FA8C8', edge: '#E8F4FF', intensity: 0, rings: 0 });
  const seal = new THREE.Mesh(new THREE.SphereGeometry(2.4, 96, 48), sealM);
  seal.position.set(-2.6, 2.2, 0);
  three.add(seal);
  const flashes = [];
  const r = rng(6);
  for (let i = 0; i < 7; i++) {
    const f = glowQuad({ color: i % 2 ? '#FFC56B' : '#FF7A4A', intensity: 0, size: 0.6 + r() * 0.5, rays: 0.5 });
    f.userData = { p: new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).multiplyScalar(2.4), ph: r() * 10, sp: 0.6 + r() };
    seal.add(f);
    flashes.push(f);
  }
  // leaks: a few sparks escaping
  const leakGeo = new THREE.BufferGeometry();
  const LP = [];
  const LS = [];
  for (let i = 0; i < 160; i++) {
    const d = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize();
    LP.push(d.x, d.y, d.z);
    LS.push(r());
  }
  leakGeo.setAttribute('position', new THREE.Float32BufferAttribute(LP, 3));
  leakGeo.setAttribute('aS', new THREE.Float32BufferAttribute(LS, 1));
  const leakM = dotsMaterial({
    uniforms: { uA: { value: 0 }, uC: { value: new THREE.Vector3(-2.6, 2.2, 0) } },
    attrs: 'attribute float aS;',
    body: `float ph = fract(uTime * (0.15 + aS * 0.2) + aS); float on = step(0.82, fract(aS * 7.31)); P = uC + position * (2.4 + ph * 2.2); S = 0.05; C = vec3(1.0, 0.7, 0.4) * 2.0 * on; A = uA * (1.0 - ph) * on;`,
  });
  const leaks = new THREE.Points(leakGeo, leakM);
  leaks.frustumCulled = false;
  three.add(leaks);

  const cam = [
    [T(0, '', -3), [0, 4.2, 15, 0, 1.2, 0]],
    [T(3, '', -0.4), [0, 4.2, 15, 0, 1.2, 0]],
    [T(3, '定向', 0), [3.0, 3.4, 10, 3.6, 1.0, 0]],
    [T(4, '', -0.4), [0, 4.0, 15.5, 0, 1.4, 0]],
    [T(6, '', -0.3), [0, 3.6, 13.5, 0, 2.0, 0]],
    [T(12, '', 2), [0, 3.4, 12.5, 0, 2.1, 0]],
  ];

  sc.update = (t) => {
    const k = keys(t, cam, ease.inOut3);
    camera.position.set(k[0], k[1], k[2]);
    camera.lookAt(k[3], k[4], k[5]);
    camera.updateMatrixWorld();
    for (const q of [srcL, hit, soft, dense, ...flashes]) q.material.uniforms.uTime.value = t;
    beamM.uniforms.uTime.value = t;
    shellM.uniforms.uTime.value = t;
    sealM.uniforms.uTime.value = t;
    leakM.uniforms.uTime.value = t;
    // pads visible during the energy/range demos
    const demo = env(t, T(3, '', -0.4), 0.8, T(5, '', -0.2), 0.8);
    padL.material.opacity = demo * (t > T(4, '', -0.4) || true ? 1 : 0);
    padR.material.opacity = demo;
    // left: hemisphere spread (only from line 4)
    const hk = env(t, T(4, '', 0), 0.5, T(5, '', -0.2), 0.6);
    const grow = win(t, T(4, '', 0), 2.5, ease.out3);
    hemi.scale.setScalar(0.2 + 3.0 * grow);
    shellM.uniforms.uI.value = 1.1 * hk;
    srcL.material.uniforms.uI.value = 2.5 * hk;
    // right: beam from line 3
    const bk = env(t, T(3, '定向', -0.4), 0.4, T(5, '', -0.2), 0.6);
    beamM.uniforms.uI.value = bk;
    hit.material.uniforms.uI.value = 2.4 * bk;
    // density
    const dk = env(t, T(5, '', -0.2), 0.6, T(6, '', -0.2), 0.6);
    soft.material.uniforms.uI.value = 0.55 * dk;
    dense.material.uniforms.uI.value = 9 * dk;
    // sealed fight
    const sk = win(t, T(6, '', -0.2), 1.0);
    sealM.uniforms.uI.value = 0.9 * sk;
    seal.rotation.y = t * 0.1;
    flashes.forEach((f, i) => {
      const ph = (t * f.userData.sp + f.userData.ph) % 2.2;
      f.position.copy(f.userData.p);
      f.material.uniforms.uI.value = sk * 3.2 * pulse(ph, 0, 0.5);
    });
    leakM.uniforms.uA.value = sk * win(t, T(9, '溢出', -0.4), 0.8);
  };

  sc.draw = (g, t) => {
    // -------------------------------------------- 0–2 two readouts
    {
      const a = env(t, T(0, '', -0.5), 0.8, T(3, '', -0.3), 0.7);
      if (a > 0) {
        const kE = win(t, T(0, '能量', -0.2), 0.8);
        const kR = win(t, T(0, '范围', -0.2), 0.8);
        // energy column
        g.text('能量', 620, 280, { kind: 'serif', size: 48, weight: 700, color: 'energy', align: 'center', alpha: a * kE });
        g.rect(580, 320, 80, 420, { r: 8, color: 'energy', w: 2, alpha: a * kE });
        g.rect(584, 324 + 412 * (1 - 0.78 * kE), 72, 412 * 0.78 * kE, { r: 6, fill: 'energy', alpha: a * 0.85 });
        g.text('E（焦耳）', 620, 800, { kind: 'mono', size: 26, color: 'energyLite', align: 'center', alpha: a * kE });
        // range ring
        g.text('范围', 1300, 280, { kind: 'serif', size: 48, weight: 700, color: 'range', align: 'center', alpha: a * kR });
        g.circle(1300, 530, 190 * ease.out3(kR), { color: 'range', w: 3, alpha: a, glow: 14 });
        g.circle(1300, 530, 6, { fill: 'range', alpha: a * kR });
        g.seg(1300, 530, 1300 + 190 * kR, 530, { color: 'range', w: 1.5, alpha: a });
        g.text('R（覆盖直径）', 1300, 800, { kind: 'mono', size: 26, color: 'rangeLite', align: 'center', alpha: a * kR });
        const ne = win(t, T(1, '混为一谈', -0.3), 0.5);
        g.text('≠', 960, 560, { kind: 'math', size: 120, color: 'red', align: 'center', alpha: a * ne, glow: 14 });
        const an = env(t, T(1, '耐力', -0.3), 0.5, T(2, '', 0), 0.6);
        g.text('就像 耐力 与 爆发速度', 960, 900, { kind: 'kai', size: 40, color: 'ink2', align: 'center', alpha: a * an });
        const ok = win(t, T(2, '直接标', -0.3), 0.6);
        if (ok > 0) {
          g.text('宏观上两者都达标', 960, 900, { kind: 'sans', size: 30, color: 'ink2', align: 'center', alpha: a * ok });
          g.tag('直接标量级名称', 960, 960, 'ok', { align: 'center', size: 30, p: ok });
        }
      }
    }
    // -------------------------------------------- 3 directed / compressed / stronger
    {
      const a = env(t, T(3, '', -0.3), 0.7, T(4, '', -0.3), 0.6);
      if (a > 0) {
        const tg = [['定向', T(3, '定向')], ['压缩', T(3, '压缩')], ['作用在更强的世界和材质上', T(3, '更强的世界')]];
        tg.forEach(([s, tc], i) => g.tag(s, 120, 240 + i * 74, 'energy', { size: 30, p: win(t, tc - 0.2, 0.5) }));
        const p = sc.p3(4.2, 0, 0);
        const ppu = sc.pxPerUnit(new THREE.Vector3(4.2, 0, 0));
        const big = win(t, T(3, '本来能造成', -0.4), 0.8);
        g.circle(p[0], p[1], 3.0 * ppu * ease.out3(big), { color: 'range', w: 2, dash: [10, 8], alpha: a * 0.9 });
        g.text('这份能量本来能造成的范围', p[0], p[1] - 3.0 * ppu - 20, { kind: 'sans', size: 26, color: 'rangeLite', align: 'center', alpha: a * big });
        g.circle(p[0], p[1], 0.32 * ppu, { color: 'energy', w: 3, alpha: a * win(t, T(3, '规模'), 0.5), glow: 12 });
        g.text('实际表现的规模', p[0] + 0.4 * ppu + 16, p[1] + 50, { kind: 'sans', size: 26, color: 'energy', alpha: a * win(t, T(3, '规模'), 0.5) });
        const note = win(t, T(3, '严格注明'), 0.6);
        g.card(110, 760, 640, 170, {
          p: note,
          alpha: a,
          fn: (g2, w) => {
            g2.text('必须严格注明', 30, 64, { kind: 'serif', size: 32, weight: 700 });
            g2.text('能量数据 · 能量水平', 30, 124, { kind: 'serif', size: 40, weight: 900, color: 'energy' });
          },
        });
      }
    }
    // -------------------------------------------- 4 same energy, different range
    {
      const a = env(t, T(4, '', -0.2), 0.7, T(5, '', -0.2), 0.6);
      if (a > 0) {
        const pl = sc.p3(-4.2, 3.6, 0);
        const pr = sc.p3(4.2, 3.6, 0);
        for (const [p, s] of [[pl, '半球扩散'], [pr, '定向光束']]) {
          g.sci([4.2, 21], p[0], p[1] - 70, { prefix: 'E = ', size: 40, color: 'energy', align: 'center', unit: 'J', alpha: a, glow: 10 });
          g.text(s, p[0], p[1] - 130, { kind: 'serif', size: 36, weight: 700, color: 'ink', align: 'center', alpha: a });
        }
        g.text('能量相同（示意值）', 960, 150, { kind: 'sans', size: 28, color: 'ink2', align: 'center', alpha: a * win(t, T(4, '能量不等于'), 0.5) });
        const k2 = win(t, T(4, '作用面积'), 0.6);
        const bl = sc.p3(-4.2, 0, 0);
        const br = sc.p3(4.2, 0, 0);
        g.text('范围：大', bl[0], bl[1] + 80, { kind: 'serif', size: 34, weight: 700, color: 'range', align: 'center', alpha: a * k2 });
        g.text('范围：小', br[0], br[1] + 80, { kind: 'serif', size: 34, weight: 700, color: 'range', align: 'center', alpha: a * k2 });
        const sk = ['覆盖', '延伸', '定向', '控制'];
        sk.forEach((s, i) => g.tag(s, 960 + (i - 1.5) * 150, 980, 'range', { align: 'center', size: 28, p: win(t, T(4, '覆盖') + i * 0.25, 0.4) }));
        g.text('范围分析的是能力与技巧', 960, 920, { kind: 'sans', size: 26, color: 'ink2', align: 'center', alpha: a * win(t, T(4, '能力与技巧', -0.5), 0.5) });
      }
    }
    // -------------------------------------------- 5 density
    {
      const a = env(t, T(5, '', -0.2), 0.6, T(6, '', -0.2), 0.6);
      if (a > 0) {
        g.text('别忽略能量密度', 960, 140, { kind: 'serif', size: 46, weight: 700, color: 'ink', align: 'center', alpha: a });
        const pl = sc.p3(-4.2, 2, 0);
        const pr = sc.p3(4.2, 2, 0);
        g.text('体积大 · 光效大', pl[0], pl[1] + 280, { kind: 'serif', size: 32, weight: 700, color: 'rangeLite', align: 'center', alpha: a });
        g.sci([3, 17], pl[0], pl[1] + 330, { prefix: 'E ≈ ', size: 30, color: 'energy', align: 'center', unit: 'J', alpha: a });
        g.text('体积小 · 能量密', pr[0], pr[1] + 280, { kind: 'serif', size: 32, weight: 700, color: 'energy', align: 'center', alpha: a });
        g.sci([5, 24], pr[0], pr[1] + 330, { prefix: 'E ≈ ', size: 30, color: 'energy', align: 'center', unit: 'J', alpha: a });
        g.text('视觉效果和体积 ≠ 对应尺度的能量输出（数值为示意）', 960, 980, { kind: 'sans', size: 28, color: 'red', align: 'center', alpha: a * win(t, T(5, '不等于'), 0.6) });
      }
    }
    // -------------------------------------------- 6–12 unobserved
    {
      const a = win(t, T(6, '', -0.3), 0.8);
      if (a > 0) {
        g.text('战斗被收束、隐藏或转移', 960, 110, { kind: 'serif', size: 46, weight: 700, color: 'ink', align: 'center', alpha: a });
        const ex = [['冲击波导去别处', T(7, '冲击波')], ['隔绝空间里交手', T(7, '隔绝')], ['法宝屏蔽波及', T(7, '法宝')]];
        ex.forEach(([s, tc], i) => g.tag(s, 1300, 300 + i * 74, 'unobserved', { size: 28, p: win(t, tc - 0.2, 0.5) * (1 - win(t, T(9, ''), 0.5)) }));
        const ps = sc.p3(-2.6, 2.2, 0);
        g.seal('未观测', ps[0] + 250, ps[1] + 290, { size: 140, color: '#B7B0A2', p: win(t, T(8, '未观测', -0.2), 0.5), rot: -0.12 });
        // two ways that are not allowed
        const no1 = win(t, T(9, '不以可见破坏'), 0.6);
        const no2 = win(t, T(10, '不以修辞'), 0.6);
        const fade2 = 1 - win(t, T(11, ''), 0.6);
        if (no1 > 0) {
          g.card(1300, 260, 520, 200, {
            p: no1,
            alpha: fade2,
            fn: (g2, w) => {
              g2.text('以可见破坏定值', 30, 70, { kind: 'serif', size: 34, weight: 700, color: 'ink2' });
              g2.text('只是被允许溢出的部分', 30, 126, { kind: 'sans', size: 26, color: 'ink3' });
              g2.text('不是实际输出上限', 30, 166, { kind: 'sans', size: 26, color: 'ink3' });
            },
          });
          strike(g, 1320, 330, 1640, 315, win(t, T(9, '不以可见破坏', 0.5), 0.4), { w: 9, alpha: fade2 });
        }
        if (no2 > 0) {
          g.card(1300, 500, 520, 200, {
            p: no2,
            alpha: fade2,
            fn: (g2, w) => {
              g2.text('以修辞定值', 30, 70, { kind: 'serif', size: 34, weight: 700, color: 'ink2' });
              g2.text('“堪比一片大宇宙”', 30, 126, { kind: 'kai', size: 30, color: 'ink2' });
              g2.text('不因收束获豁免，仍按 0.2', 30, 168, { kind: 'sans', size: 24, color: 'ink3' });
            },
          });
          strike(g, 1320, 570, 1560, 555, win(t, T(10, '不以修辞', 0.5), 0.4), { w: 9, alpha: fade2 });
        }
        // the right record
        const k11 = env(t, T(11, '', -0.2), 0.6, T(12, '', 0.2), 0.6);
        if (k11 > 0) {
          g.card(1240, 300, 600, 330, {
            p: k11,
            fn: (g2, w) => {
              g2.text('正确的记法', 30, 62, { kind: 'sans', size: 26, color: 'ink3' });
              g2.text('档位：未观测', 30, 126, { kind: 'serif', size: 38, weight: 900, color: 'ink2' });
              g2.text('收束方式：隔绝空间', 30, 186, { kind: 'serif', size: 32, weight: 700, alpha: win(t, T(11, '收束方式'), 0.5) });
              g2.text('之后出现未收束的同档表现', 30, 250, { kind: 'sans', size: 26, color: 'ink2', alpha: win(t, T(11, '以后'), 0.5) });
              g2.text('→ 再据此定值', 30, 296, { kind: 'sans', size: 28, color: 'energy', alpha: win(t, T(11, '定值'), 0.5) });
            },
          });
        }
        const k12 = win(t, T(12, '', -0.2), 0.6);
        if (k12 > 0) {
          g.text('记录规范，不是战力判据', 1500, 760, { kind: 'serif', size: 40, weight: 700, color: 'ink', align: 'center', alpha: k12 });
          g.text('不证明弱', 1360, 840, { kind: 'sans', size: 30, color: 'ink2', align: 'center', alpha: win(t, T(12, '这一档弱'), 0.5) });
          g.text('也不证明强', 1640, 840, { kind: 'sans', size: 30, color: 'ink2', align: 'center', alpha: win(t, T(12, '也不证明'), 0.5) });
          g.text('只说明：缺少观测', 1500, 920, { kind: 'serif', size: 34, weight: 700, color: 'gold', align: 'center', alpha: win(t, T(12, '缺少观测', -0.3), 0.5), glow: 10 });
        }
      }
    }
  };
  return sc;
}
