// 0.7–0.9 · 世界观强度换算、半球扩散为默认、空间能力与无范围摧毁
// A multiplier dial (×N, ×1/N). A point on a planet's surface spreading into a hemisphere, then a
// controlled fan that reaches the same targets with less. Finally a moon unmade cell by cell with
// no shock at all: count only the energy of the matter destroyed.
import * as THREE from 'three';
import { makeScene } from './base.js';
import { makePlanet } from '../gfx/objects.js';
import { glowQuad, shellMaterial, lin, dotsMaterial } from '../gfx/materials.js';
import { NOISE } from '../gfx/glsl.js';
import { clamp, lerp, smooth, ease, win, env, keys, rng } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { strike } from './common.js';

export function build() {
  const sc = makeScene('r07', 'cosmos', { fov: 36, backdrop: { stars: 0.9, nebula: 0.5, tint: '#2a4a3a' } });
  const { three, camera } = sc;
  const T = sc.c;

  // big planet surface for the hemisphere demo
  const planet = makePlanet(6, { seed: 4.1, light: [-0.7, 0.5, 0.5], city: 0.4, clouds: 0.3, intensity: 0.85 });
  planet.position.set(0, -6, 0);
  three.add(planet);
  const pU = planet.userData.mat.uniforms;
  const hemiM = shellMaterial({ color: '#FFC56B', edge: '#FFF0D0', intensity: 0, rings: 1 });
  const hemi = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2), hemiM);
  three.add(hemi);
  const fanM = shellMaterial({ color: '#78C8FF', edge: '#E0F4FF', intensity: 0, rings: 0 });
  const fan = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 24, Math.PI - 0.32, 0.64, Math.PI * 0.36, Math.PI * 0.14), fanM);
  fan.visible = false;
  three.add(fan);
  const src = glowQuad({ color: '#FFD08A', intensity: 0, size: 0.25 });
  three.add(src);
  // targets on the surface (in the fan's direction)
  const targets = [];
  const tr = rng(3);
  for (let i = 0; i < 9; i++) {
    const q = glowQuad({ color: '#FF8A5A', intensity: 0, size: 0.09 });
    q.userData.a = 0.18 + tr() * 0.35; // angle along surface
    q.userData.z = (tr() - 0.5) * 0.7;
    q.visible = false;
    three.add(q);
    targets.push(q);
  }
  const surf = (ang, z) => new THREE.Vector3(Math.sin(ang) * 6, -6 + Math.cos(ang) * 6, z);

  // moon dissolving into cells
  const moonM = new THREE.ShaderMaterial({
    uniforms: { uK: { value: 0 }, uLight: { value: new THREE.Vector3(-0.6, 0.5, 0.6).normalize() }, uA: { value: 0 } },
    transparent: true,
    vertexShader: 'varying vec3 vN; varying vec3 vO; void main(){ vO = position; vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `uniform float uK; uniform vec3 uLight; uniform float uA; varying vec3 vN; varying vec3 vO;
      ${NOISE}
      void main(){
        vec3 cell = floor(vO * 7.0);
        float h = hash13(cell);
        float gone = step(h, uK * 1.15 - 0.05);
        if (gone > 0.5) discard;
        float edge = smoothstep(uK * 1.15 - 0.2, uK * 1.15 - 0.05, h) * step(0.01, uK);
        vec3 f = abs(fract(vO * 7.0) - 0.5);
        float grid = smoothstep(0.47, 0.5, max(f.x, max(f.y, f.z))) * step(0.01, uK);
        float n = fbm3(vO * 3.0) * 0.5 + 0.5;
        float crater = smoothstep(0.6, 0.75, fbm3(vO * 6.0 + 2.0));
        vec3 base = mix(vec3(0.42, 0.4, 0.38), vec3(0.7, 0.68, 0.64), n) * (1.0 - crater * 0.25);
        float l = 0.05 + 1.0 * max(dot(normalize(vN), uLight), 0.0);
        vec3 c = base * l + vec3(0.5, 0.8, 1.0) * (grid * 0.8 + (1.0 - edge) * 0.0) + vec3(0.6, 0.85, 1.0) * edge * 0.0;
        c += vec3(0.4, 0.75, 1.0) * grid * 1.4;
        gl_FragColor = vec4(c * 1.2, uA);
      }`,
  });
  const moon = new THREE.Mesh(new THREE.SphereGeometry(1.5, 96, 64), moonM);
  moon.position.set(0, 30, 0);
  three.add(moon);
  // drifting rocks that stay untouched
  const rocks = [];
  for (let i = 0; i < 14; i++) {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.12 + tr() * 0.14, 1), moonM.clone());
    m.material.uniforms.uK.value = 0;
    const a = tr() * Math.PI * 2;
    const rr = 2.6 + tr() * 1.6;
    m.position.set(Math.cos(a) * rr, 30 + (tr() - 0.5) * 2.2, Math.sin(a) * rr * 0.5);
    three.add(m);
    rocks.push(m);
  }
  // the cells leaving: points scattering from the moon's surface, no shock
  const P = [];
  const S = [];
  for (let i = 0; i < 3000; i++) {
    const d = new THREE.Vector3(tr() - 0.5, tr() - 0.5, tr() - 0.5).normalize();
    P.push(d.x * 1.5, d.y * 1.5, d.z * 1.5);
    S.push(tr());
  }
  const cg = new THREE.BufferGeometry();
  cg.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  cg.setAttribute('aS', new THREE.Float32BufferAttribute(S, 1));
  const cellM = dotsMaterial({
    uniforms: { uK: { value: 0 }, uC: { value: new THREE.Vector3(0, 30, 0) } },
    attrs: 'attribute float aS;',
    body: `float k = clamp((uK * 1.15 - aS) * 4.0, 0.0, 1.0); P = uC + position * (1.0 - 0.0 * k); S = 0.05 * k * (1.0 - k) * 4.0; C = vec3(0.5, 0.85, 1.0) * 2.0; A = k * (1.0 - k) * 4.0;`,
  });
  const cells = new THREE.Points(cg, cellM);
  cells.frustumCulled = false;
  three.add(cells);

  const cam = [
    [T(0, '', -3), [0, 31.5, 9, 0, 30, 0]],
    [T(2, '', -0.6), [0, 31.5, 9, 0, 30, 0]],
    [T(2, '', 0.6), [0, 3.2, 15, 0, 0.6, 0]],
    [T(4, '', 0), [1.6, 7.5, 10.5, 1.6, -0.6, 0]],
    [T(6, '', -0.6), [1.6, 7.5, 10.5, 1.6, -0.6, 0]],
    [T(6, '', 0.6), [0, 31.0, 8, 0, 30, 0]],
    [T(7, '', 12), [0, 31.0, 7.2, 0, 30, 0]],
  ];

  sc.update = (t) => {
    const k = keys(t, cam, ease.inOut3);
    camera.position.set(k[0], k[1], k[2]);
    camera.lookAt(k[3], k[4], k[5]);
    camera.updateMatrixWorld();
    pU.uTime.value = t;
    planet.rotation.y = 0.2;
    // hemisphere from a point on the surface
    const top = surf(0, 0);
    hemi.position.copy(top);
    src.position.copy(top);
    fan.position.copy(top);
    const hk = env(t, T(3, '', -0.6), 0.6, T(4, '', 0.2), 0.8);
    const grow = win(t, T(3, '扩散模型', -0.8), 3.0, ease.out3);
    hemi.scale.setScalar(0.1 + 3.8 * grow);
    hemiM.uniforms.uI.value = 1.0 * hk;
    hemiM.uniforms.uTime.value = t;
    src.material.uniforms.uI.value = 3 * env(t, T(3, '', -0.6), 0.5, T(6, '', -0.3), 0.6);
    src.material.uniforms.uTime.value = t;
    // controlled fan towards the targets
    const fk = env(t, T(4, '控制', -0.4), 0.6, T(6, '', -0.3), 0.6);
    const fg = win(t, T(4, '控制', -0.4), 2.0, ease.out3);
    fan.scale.setScalar(0.1 + 3.6 * fg);
    fanM.uniforms.uI.value = 1.4 * fk;
    fanM.uniforms.uTime.value = t;
    targets.forEach((q, i) => {
      q.position.copy(surf(q.userData.a, q.userData.z)).add(new THREE.Vector3(0, 0.06, 0));
      const hitT = T(4, '摧毁了', -0.2) + i * 0.08;
      const alive = 1 - win(t, hitT, 0.3);
      q.material.uniforms.uI.value = env(t, T(3, '', -0.6), 0.6, T(6, '', -0.3), 0.6) * (1.8 * alive + 4 * (1 - alive) * (1 - win(t, hitT + 0.3, 0.8)));
      q.material.uniforms.uTime.value = t;
    });
    // moon
    const mk = win(t, T(6, '', 0), 1.0);
    moonM.uniforms.uA.value = mk;
    for (const r of rocks) r.material.uniforms.uA.value = mk;
    const dk = win(t, T(7, '摧毁了物质', -0.6), 5.0, ease.inOut2);
    moonM.uniforms.uK.value = dk;
    cellM.uniforms.uK.value = dk;
    moon.rotation.y = t * 0.05;
    rocks.forEach((r, i) => (r.rotation.y = t * 0.3 + i));
  };

  sc.draw = (g, t) => {
    // -------------------------------------------- 0–1 world strength multiplier
    {
      const a = env(t, T(0, '', -0.5), 0.8, T(2, '', -0.4), 0.6);
      if (a > 0) {
        g.rect(0, 0, W, H, { fill: 'rgba(4,6,12,0.55)', alpha: a });
        g.text('世界观强度换算', 960, 140, { kind: 'serif', size: 50, weight: 700, color: 'ink', align: 'center', alpha: a });
        // two worlds, same feat
        const k = win(t, T(1, '同样的表现'), 0.8);
        const box = (x, title, mult, col, tc) => {
          const kk = win(t, tc, 0.7);
          g.card(x - 300, 260, 600, 420, {
            p: kk,
            alpha: a,
            fn: (g2, w) => {
              g2.text(title, w / 2, 64, { kind: 'serif', size: 36, weight: 700, align: 'center' });
              g2.text('同样的表现', w / 2, 120, { kind: 'sans', size: 26, color: 'ink2', align: 'center' });
              g2.icon('bolt', w / 2, 210, 80, { color: 'energy', glow: 12 });
              g2.text(mult, w / 2, 340, { kind: 'math', size: 64, weight: 600, color: col, align: 'center' });
            },
          });
        };
        box(560, '现实世界', '× 1', 'ink2', T(1, '同样的表现'));
        box(1360, '世界观强度更高', '× N', 'energy', T(1, '更高的世界', -0.3));
        const lab = win(t, T(1, '几倍', -0.3), 0.7);
        g.text('标注为', 960, 790, { kind: 'sans', size: 28, color: 'ink2', align: 'center', alpha: a * lab });
        g.text('“N 倍 某某级”', 960, 870, { kind: 'kai', size: 64, color: 'energy', align: 'center', alpha: a * lab, glow: 14 });
        g.text('更弱的世界同理：1/N 倍', 960, 950, { kind: 'sans', size: 28, color: 'ink2', align: 'center', alpha: a * win(t, T(1, '更弱'), 0.6) });
      }
    }
    // -------------------------------------------- 2–5 hemisphere default
    {
      const a = env(t, T(2, '', 0.2), 0.8, T(6, '', -0.3), 0.6);
      if (a > 0) {
        g.text('半球扩散为默认', 960, 110, { kind: 'serif', size: 50, weight: 700, color: 'ink', align: 'center', alpha: a });
        const hk = env(t, T(3, '', -0.3), 0.6, T(4, '', 0.2), 0.6);
        const p = sc.p3(0, 0, 0);
        g.text('点', p[0] + 18, p[1] - 14, { kind: 'serif', size: 30, weight: 700, color: 'energy', alpha: a * hk });
        g.text('→ 球体（半球）', 960, 180, { kind: 'serif', size: 34, weight: 700, color: 'energy', align: 'center', alpha: a * hk * win(t, T(3, '点到球体'), 0.6) });
        g.text('所有按范围定级的量级', 960, 990, { kind: 'sans', size: 28, color: 'ink2', align: 'center', alpha: a * hk });
        // controlled fan hugging the surface toward the targets (projected onto the screen)
        const fanK = env(t, T(4, '控制', -0.4), 0.6, T(6, '', -0.3), 0.6);
        if (fanK > 0) {
          const grow = win(t, T(4, '控制', -0.4), 1.8, ease.out3);
          const amax = 0.62 * grow;
          const poly = [];
          for (let i = 0; i <= 24; i++) {
            const a = (amax * i) / 24;
            const p = sc.p3(Math.sin(a) * 6.02, -6 + Math.cos(a) * 6.02, -0.5 - a * 0.6);
            poly.push([p[0], p[1]]);
          }
          for (let i = 24; i >= 0; i--) {
            const a = (amax * i) / 24;
            const p = sc.p3(Math.sin(a) * 6.02, -6 + Math.cos(a) * 6.02, 0.5 + a * 0.6);
            poly.push([p[0], p[1]]);
          }
          const c = g.x;
          c.save();
          c.globalAlpha = 0.35 * fanK;
          c.fillStyle = g.col('range');
          c.beginPath();
          poly.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
          c.closePath();
          c.fill();
          c.restore();
          g.line(poly.concat([poly[0]]), { color: 'rangeLite', w: 2, alpha: fanK, glow: 14 });
          targets.forEach((q, i) => {
            const p = sc.p3(Math.sin(q.userData.a) * 6.03, -6 + Math.cos(q.userData.a) * 6.03, q.userData.z);
            const hitT = T(4, '摧毁了', -0.2) + i * 0.08;
            const gone = win(t, hitT, 0.4);
            g.circle(p[0], p[1], 7, { fill: 'red', alpha: fanK * (1 - gone) });
            g.circle(p[0], p[1], 7 + 26 * gone, { color: 'energyLite', w: 2, alpha: fanK * gone * (1 - win(t, hitT + 0.4, 0.6)) });
          });
          g.text('受控：只覆盖目标所在的扇区', 1500, 300, { kind: 'serif', size: 30, weight: 700, color: 'range', align: 'center', alpha: fanK });
        }
        const fk = win(t, T(4, '控制', -0.3), 0.6);
        if (fk > 0) {
          const tags = [['方向', T(4, '方向')], ['范围', T(4, '范围、')], ['角度', T(4, '角度')]];
          tags.forEach(([s, tc], i) => g.tag(s, 140, 300 + i * 74, 'range', { size: 30, p: win(t, tc - 0.2, 0.5) }));
          g.text('同样范围内的同样物质', 140, 560, { kind: 'sans', size: 28, color: 'ink2', alpha: a * win(t, T(4, '同样总量'), 0.5) });
          g.tag('广义讨论：可标对应量级名称', 140, 640, 'ok', { size: 28, p: win(t, T(4, '量级名称', -0.4), 0.5) });
        }
        const sep = win(t, T(5, '', -0.2), 0.6);
        if (sep > 0) {
          g.card(1240, 640, 580, 250, {
            p: sep,
            fn: (g2, w) => {
              g2.text('但必须区分', 30, 60, { kind: 'sans', size: 26, color: 'ink3' });
              g2.text('具体能量输出', 30, 124, { kind: 'serif', size: 38, weight: 900, color: 'energy' });
              g2.text('输出方式', 30, 196, { kind: 'serif', size: 38, weight: 900, color: 'range', alpha: win(t, T(5, '输出方式'), 0.5) });
            },
          });
        }
      }
    }
    // -------------------------------------------- 6–7 spatial ability
    {
      const a = win(t, T(6, '', 0.2), 0.8);
      if (a > 0) {
        g.text('空间能力与无范围摧毁', 960, 110, { kind: 'serif', size: 50, weight: 700, color: 'ink', align: 'center', alpha: a });
        const k1 = win(t, T(7, '摧毁了物质', -0.2), 0.6);
        g.tag('物质被抹去', 140, 300, 'range', { size: 30, p: k1 });
        g.tag('周围不受波及', 140, 380, 'ok', { size: 30, p: win(t, T(7, '没有任何范围'), 0.5) });
        g.tag('没有冲击波', 140, 460, 'unobserved', { size: 30, p: win(t, T(7, '没有任何范围', 0.6), 0.5) });
        const k2 = win(t, T(7, '只计算', -0.2), 0.7);
        g.card(1280, 720, 540, 220, {
          p: k2,
          fn: (g2, w) => {
            g2.text('只计算', 30, 64, { kind: 'sans', size: 28, color: 'ink3' });
            g2.text('E = Σ 被摧毁物质的能量', 30, 140, { kind: 'math', size: 38, weight: 600, color: 'energy' });
          },
        });
      }
    }
  };
  return sc;
}
