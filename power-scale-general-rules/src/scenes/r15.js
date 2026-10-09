// 0.15 · 有限资源与无限战力
// A sealed glass world with a finite amount of matter. A cultivator at its centre draws it in;
// the gauge runs into the world's total and the glass cracks: the conflict. Three ways stories
// explain it (purity, principle, outside injection), three verdicts, and the price tag on ∞.
import * as THREE from 'three';
import { makeScene } from './base.js';
import { glowQuad, shellMaterial, dotsMaterial, lin } from '../gfx/materials.js';
import { clamp, lerp, smooth, ease, win, env, keys, rng } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { strike } from './common.js';

export function build() {
  const sc = makeScene('r15', 'cosmos', { fov: 38, backdrop: { stars: 0.8, nebula: 0.6, tint: '#4a2a5a' } });
  const { three, camera } = sc;
  const T = sc.c;
  camera.position.set(0, 0.3, 16);
  camera.lookAt(0, 0, 0);

  const GC = new THREE.Vector3(-3.4, 0.2, 0);
  const glassM = shellMaterial({ color: '#9FC8E8', edge: '#F0F8FF', intensity: 0, rings: 0 });
  const glass = new THREE.Mesh(new THREE.SphereGeometry(2.6, 96, 64), glassM);
  glass.position.copy(GC);
  three.add(glass);
  const r = rng(51);
  const N = 7000;
  const P = new Float32Array(N * 3);
  const S = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const v = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize().multiplyScalar(2.45 * Math.cbrt(r()));
    P.set([v.x, v.y, v.z], i * 3);
    S[i] = r();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(P, 3));
  geo.setAttribute('aS', new THREE.BufferAttribute(S, 1));
  const dustM = dotsMaterial({
    uniforms: { uAbs: { value: 0 }, uA: { value: 0 }, uC: { value: GC.clone() }, uExt: { value: 0 } },
    attrs: 'attribute float aS;',
    body: /* glsl */ `
      float k = clamp(uAbs * 1.3 - aS * 0.3, 0.0, 1.0);
      float ang = k * 6.0 * (1.0 - aS * 0.5);
      float c = cos(ang), s = sin(ang);
      vec3 p = vec3(c * position.x - s * position.z, position.y, s * position.x + c * position.z) * (1.0 - k * 0.97);
      P = uC + p;
      C = mix(vec3(1.0, 0.75, 0.45), vec3(1.0, 0.95, 0.8), k) * (0.8 + 0.6 * aS);
      S = 0.05 * (1.0 - k * 0.6);
      A = uA * (1.0 - k * 0.85);`,
  });
  const dust = new THREE.Points(geo, dustM);
  dust.frustumCulled = false;
  three.add(dust);
  const core = glowQuad({ color: '#FFE2A8', intensity: 0, size: 0.6, rays: 1 });
  core.position.copy(GC);
  three.add(core);
  // outside injection beam
  const injM = new THREE.ShaderMaterial({
    uniforms: { uI: { value: 0 }, uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `uniform float uI; uniform float uTime; varying vec2 vUv; void main(){ float r = abs(vUv.x - 0.5) * 2.0; float f = exp(-r*r*10.0) * (0.7 + 0.3 * sin(vUv.y * 50.0 + uTime * 12.0)); gl_FragColor = vec4(vec3(0.75, 0.6, 1.0) * f * 2.0 * uI, 1.0); }`,
  });
  const inj = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 6, 16, 1, true), injM);
  inj.position.copy(GC).add(new THREE.Vector3(0, 5.6, 0));
  three.add(inj);

  sc.update = (t) => {
    for (const m of [glassM, dustM, injM]) m.uniforms.uTime.value = t;
    core.material.uniforms.uTime.value = t;
    const on = win(t, T(0, '', -2), 1.2);
    glassM.uniforms.uI.value = 0.6 * on;
    dustM.uniforms.uA.value = on;
    const abs = win(t, T(2, '修炼'), 9.0, ease.inOut2) * (1 - win(t, T(8, ''), 1.2));
    dustM.uniforms.uAbs.value = abs;
    core.material.uniforms.uI.value = (1 + 6 * abs) * on;
    // conflict: glass flickers red
    const conf = env(t, T(3, '', -0.2), 0.4, T(4, '', 0), 0.6);
    glassM.uniforms.uColor.value.copy(lin('#9FC8E8').lerp(lin('#FF5B3F'), conf));
    injM.uniforms.uI.value = env(t, T(7, '外部注入', -0.3), 0.5, T(8, '', 0), 0.6);
    glass.rotation.y = t * 0.1;
  };

  sc.draw = (g, t) => {
    const gp = sc.project(GC);
    const R = sc.pxPerUnit(GC) * 2.6;
    // --------------------------------------------- 0–3 the conflict
    {
      const a = env(t, T(0, '', -0.5), 0.8, T(4, '', -0.3), 0.6);
      if (a > 0) {
        g.text('有限资源与无限战力', 1300, 140, { kind: 'serif', size: 48, weight: 700, color: 'ink', align: 'center', alpha: a });
        const lim = [['物质总量有限', T(1, '物质总量')], ['能量储备有限', T(1, '能量储备')], ['位面规模有限', T(1, '位面规模')]];
        lim.forEach(([s, tc], i) => g.tag(s, 1060, 260 + i * 70, 'range', { size: 28, p: win(t, tc - 0.2, 0.5) }));
        g.text('有限的世界', gp[0], gp[1] + R + 50, { kind: 'serif', size: 32, weight: 700, color: 'rangeLite', align: 'center', alpha: a * win(t, T(1, ''), 0.6) });
        // gauge: power vs world total
        const k2 = win(t, T(2, '修炼', -0.3), 0.6);
        if (k2 > 0) {
          const x = 1060;
          const y0 = 900;
          const hh = 360;
          const total = 0.62;
          const val = Math.min(1.12, win(t, T(2, '修炼'), 9.0, ease.inOut2) * 1.12);
          g.rect(x, y0 - hh, 70, hh, { r: 8, color: 'ink3', w: 2, alpha: a * k2 });
          g.rect(x + 4, y0 - hh * Math.min(val, 1), 62, hh * Math.min(val, 1), { r: 6, fill: val > total ? 'red' : 'energy', alpha: a * 0.85 });
          g.seg(x - 20, y0 - hh * total, x + 520, y0 - hh * total, { color: 'rangeLite', w: 2, dash: [8, 6], alpha: a * k2 });
          g.text('世界总量', x + 90, y0 - hh * total - 14, { kind: 'sans', size: 26, color: 'rangeLite', alpha: a * k2 });
          g.text('角色战力', x + 35, y0 + 40, { kind: 'sans', size: 26, color: 'energy', align: 'center', alpha: a * k2 });
          g.text('修炼 · 积累 · 吞噬', x + 90, y0 - 30, { kind: 'sans', size: 26, color: 'ink2', alpha: a * k2 });
          const claim = win(t, T(2, '阿列夫零', -0.3), 0.6);
          g.text('被描述为：ℵ₀ 乃至不可计算', x + 90, y0 - hh - 20, { kind: 'serif', size: 30, weight: 700, color: 'gold', alpha: a * claim });
          const k3 = win(t, T(3, '', -0.2), 0.6);
          g.text('有限资源，理论上产出不了超过世界总量的战力', 960, 1000, { kind: 'serif', size: 34, weight: 700, color: 'red', align: 'center', alpha: a * k3 });
        }
      }
    }
    // --------------------------------------------- 4–7 three explanations
    {
      const a = env(t, T(4, '', -0.3), 0.7, T(8, '', -0.3), 0.6);
      if (a > 0) {
        g.text('作品常见的三类解释', 1300, 140, { kind: 'serif', size: 46, weight: 700, color: 'ink', align: 'center', alpha: a });
        const E = [
          ['diamond', '能量纯度 · 质变', '提升的是质，不是量', T(5, '一是')],
          ['settings', '功法 · 原理', '转化机制或法则跃迁，输出不受输入总量约束', T(6, '二是')],
          ['arrow-big-down-lines', '外部注入', '接入世界之外的能量源 / 外部赐予', T(7, '三是')],
        ];
        E.forEach(([ic, nm, sub, tc], i) => {
          const k = win(t, tc - 0.2, 0.6);
          const y = 270 + i * 230;
          g.card(900, y, 900, 190, {
            p: k,
            alpha: a,
            fn: (g2, w) => {
              g2.icon(ic, 80, 95, 80, { color: i === 2 ? '#C9A8FF' : 'gold', w: 1.6 });
              g2.text(nm, 150, 84, { kind: 'serif', size: 38, weight: 900 });
              g2.text(sub, 150, 140, { kind: 'sans', size: 26, color: 'ink2' });
            },
          });
        });
      }
    }
    // --------------------------------------------- 8–12 three verdicts
    {
      const a = env(t, T(8, '', -0.3), 0.7, T(13, '', -0.3), 0.6);
      if (a > 0) {
        g.rect(0, 0, W, H, { fill: 'rgba(4,6,12,0.9)', alpha: a });
        g.text('不构成强制降级理由，但要标注存疑', 960, 110, { kind: 'serif', size: 44, weight: 700, color: 'ink', align: 'center', alpha: a });
        const V = [
          ['给出明确机制', '如：确实接入外部无限源 / 世界观本就非有限', '不适用本条 · 正常定级', 'ok', T(9, '明确机制')],
          ['机制语焉不详', '只拿“纯度”“境界不同”一笔带过', '正常定级 ＋ 存疑标注', 'doubt', T(10, '语焉不详')],
          ['完全没有机制，世界又明确有限', '可信度显著下调', '优先按超大可计算处理', 'rejected', T(11, '完全没有')],
        ];
        V.forEach(([h, sub, verdict, kind, tc], i) => {
          const k = win(t, tc - 0.4, 0.6);
          const y = 200 + i * 250;
          g.card(160, y, 1600, 210, {
            p: k,
            alpha: a,
            fn: (g2, w) => {
              g2.text(h, 40, 76, { kind: 'serif', size: 40, weight: 900 });
              g2.text(sub, 40, 136, { kind: 'sans', size: 28, color: 'ink2' });
              g2.tag(verdict, w - 40, 104, kind, { align: 'right', size: 30, p: win(t, tc + 0.6, 0.5) });
            },
          });
        });
        const k12 = win(t, T(12, '不能直接采信', -0.2), 0.6);
        if (k12 > 0) {
          g.text('不可计算', 1180, 800 + 160, { kind: 'serif', size: 30, weight: 700, color: 'ink2', align: 'center', alpha: a * k12 });
          strike(g, 1100, 950, 1260, 944, win(t, T(12, '不可计算', 0.3), 0.4), { w: 7 });
          g.text('论外级', 1480, 800 + 160, { kind: 'serif', size: 30, weight: 700, color: 'ink2', align: 'center', alpha: a * win(t, T(12, '论外级', -0.3), 0.4) });
          strike(g, 1410, 950, 1550, 944, win(t, T(12, '论外级', 0.2), 0.4), { w: 7 });
        }
      }
    }
    // --------------------------------------------- 13–14 the price of infinity
    {
      const a = win(t, T(13, '', -0.3), 0.8);
      if (a > 0) {
        g.text('把能量守恒的直觉引入判定', 1300, 160, { kind: 'serif', size: 44, weight: 700, color: 'ink', align: 'center', alpha: a });
        g.text('∞', 1300, 520, { kind: 'math', size: 260, color: 'gold', align: 'center', alpha: a, glow: 24 });
        // price tag
        const k = win(t, T(14, '解释成本', -0.4), 0.8);
        g.x.save();
        g.x.globalAlpha = a * k;
        g.x.translate(1500, 560);
        g.x.rotate(0.18);
        g.x.fillStyle = g.col('card');
        g.x.strokeStyle = g.col('gold');
        g.x.lineWidth = 3;
        g.x.beginPath();
        g.x.moveTo(-20, -60);
        g.x.lineTo(240, -60);
        g.x.lineTo(240, 60);
        g.x.lineTo(-20, 60);
        g.x.lineTo(-70, 0);
        g.x.closePath();
        g.x.fill();
        g.x.stroke();
        g.x.restore();
        g.text('解释成本', 1600, 590, { kind: 'serif', size: 40, weight: 900, color: 'gold', align: 'center', alpha: a * k });
        g.text('不禁止作品设定无限', 1300, 780, { kind: 'sans', size: 30, color: 'ink2', align: 'center', alpha: a * win(t, T(14, '不禁止'), 0.5) });
        g.text('没有解释成本的无限 → 按 0.2 归入虚词', 1300, 850, { kind: 'serif', size: 34, weight: 700, color: 'red', align: 'center', alpha: a * win(t, T(14, '没有解释成本'), 0.5) });
      }
    }
  };
  return sc;
}
