// 0.3–0.5 · 适用范围、暗物质、天体系统的核心
// A universe-type world vs a small dense one (energy sum, or plain joules). The Bullet Cluster:
// hot gas vs the lensing map of dark matter, kept out of the ordinary sum. A galaxy struck through
// its core: everything goes, black hole included; then the exception, a strike that spares the core.
import * as THREE from 'three';
import { makeScene } from './base.js';
import { makeGalaxy, makeCosmicWeb } from '../gfx/objects.js';
import { glowQuad, dotsMaterial, lin, emissive } from '../gfx/materials.js';
import { texture } from '../core/images.js';
import { clamp, lerp, smooth, ease, win, env, keys, rng } from '../core/util.js';
import { W, H } from '../core/draw2d.js';
import { strike } from './common.js';

const PPU = 98.1;
const wv = (px, py) => [(px - W / 2) / PPU, (H / 2 - py) / PPU, 0];

export function build() {
  const sc = makeScene('r03', 'cosmos', { fov: 38, backdrop: { stars: 0.8, nebula: 0.6, tint: '#5a2a40' } });
  const { three, camera } = sc;
  const T = sc.c;

  // --- A: universe vs compact world
  const web = makeCosmicWeb(2.3, { seed: 9, nodes: 40, intensity: 0.7 });
  web.position.set(...wv(560, 520));
  three.add(web);
  const crystal = new THREE.Group();
  const ico = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.0, 1)), new THREE.LineBasicMaterial({ color: lin('#FFD39A').multiplyScalar(1.6), transparent: true }));
  crystal.add(ico);
  {
    const r = rng(4);
    const P = [];
    for (let i = 0; i < 2500; i++) {
      const v = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize().multiplyScalar(0.85 * Math.cbrt(r()));
      P.push(v.x, v.y, v.z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    const m = dotsMaterial({ uniforms: { uA: { value: 1 } }, body: 'P = (modelMatrix*vec4(position,1.0)).xyz; S = 0.035; C = vec3(1.0,0.7,0.4) * 1.3; A = uA;' });
    const pts = new THREE.Points(g, m);
    pts.frustumCulled = false;
    crystal.add(pts);
    crystal.userData.m = m;
  }
  crystal.position.set(...wv(1360, 520));
  three.add(crystal);

  // --- B: the Bullet Cluster on a slightly tilted plate
  const tex = texture('bullet');
  const plateW = 12.4;
  const plateH = plateW * (1180 / 1920);
  const plateMat = new THREE.ShaderMaterial({
    uniforms: { map: { value: tex }, uA: { value: 0 }, uDim: { value: 0 } },
    transparent: true,
    depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `uniform sampler2D map; uniform float uA; uniform float uDim; varying vec2 vUv;
      void main(){ vec3 c = texture2D(map, vUv).rgb; float e = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x) * smoothstep(0.0, 0.08, vUv.y) * smoothstep(1.0, 0.92, vUv.y);
        // uDim greys out the blue (dark-matter) layer
        float blue = clamp((c.b - max(c.r, c.g) * 0.85) * 3.0, 0.0, 1.0);
        vec3 g = vec3(dot(c, vec3(0.3, 0.5, 0.2))) * 0.35;
        c = mix(c, g, blue * uDim);
        gl_FragColor = vec4(c * 1.25 * uA * e, uA * e); }`,
  });
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(plateW, plateH), plateMat);
  plate.position.set(0, -0.1, 0);
  three.add(plate);
  const imgToScreen = (px, py) => sc.p3(plate.position.x + (px / 1920 - 0.5) * plateW, plate.position.y + (0.5 - py / 1180) * plateH, 0);

  // --- C: galaxy with a black hole
  const gal = makeGalaxy(4.2, 42000, { seed: 13, intensity: 0.85, coreI: 0.9 });
  gal.rotation.set(1.1, 0, 0.18);
  three.add(gal);
  const bh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 16), emissive('#000000', 0));
  gal.add(bh);
  const ring = glowQuad({ color: '#FFB070', intensity: 1.2, size: 0.32, falloff: 3 });
  gal.add(ring);
  const GU = gal.userData.mat.uniforms;

  sc.update = (t) => {
    // A
    const aA = env(t, T(0, '', -2), 1.0, T(4, '', -0.6), 0.8);
    web.userData.mat.uniforms.uFade.value = aA * win(t, T(1, '宇宙类型', -0.4), 1.0);
    web.rotation.y = t * 0.08;
    const cA = aA * win(t, T(2, '不是宇宙', -0.3), 1.0);
    ico.material.opacity = cA;
    crystal.userData.m.uniforms.uA.value = cA;
    crystal.rotation.set(t * 0.2, t * 0.3, 0);
    // B
    const aB = env(t, T(4, '', -0.4), 1.0, T(6, '', -0.4), 0.8);
    plateMat.uniforms.uA.value = aB;
    plateMat.uniforms.uDim.value = win(t, T(4, '不纳入', -0.2), 1.2);
    plate.rotation.set(-0.05, 0.08 * Math.sin(t * 0.2), 0);
    plate.scale.setScalar(1 + 0.02 * (t - T(4, '')));
    // C
    const aC = win(t, T(6, '', -0.4), 1.2);
    GU.uFade.value = aC;
    GU.uSpin.value = (t - T(6, '', -0.4)) * 0.03;
    bh.visible = aC > 0.01;
    ring.visible = aC > 0.01;
    GU.uTime.value = t;
    gal.position.set(0, -0.3, 0);
    camera.position.set(0, 0, 16);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    // strike 1: through the core, everything goes
    const s1 = win(t, T(8, '摧毁范围', -1.2), 2.8, ease.inOut2);
    const back = win(t, T(9, '没说不行', 0.5), 1.0);
    // strike 2 (exception): sweeps past, sparing the core
    const s2 = win(t, T(10, '掠过', -0.6), 2.6, ease.inOut2);
    let cutR = -1;
    let cutR2 = -1;
    let coreGone = 0;
    GU.uCutC.value.set(-7.0, 0, 0);
    if (s2 > 0) {
      cutR = lerp(0.1, 9.5, s2);
      cutR2 = 1.25;
    } else if (s1 > 0 && back < 1) {
      cutR = lerp(0.1, 11.5, s1) * (1 - back);
      coreGone = smooth((cutR - 6.6) / 0.8);
    }
    GU.uCutR.value = cutR;
    GU.uCutR2.value = cutR2;
    gal.userData.core.material.uniforms.uI.value = 0.9 * 0.85 * (1 - coreGone) * aC;
    ring.material.uniforms.uI.value = 1.2 * (1 - coreGone) * aC;
  };

  sc.draw = (g, t) => {
    // ------------------------------------------------ A: scope of the table
    {
      const a = env(t, T(0, '', -0.5), 0.8, T(4, '', -0.6), 0.8);
      if (a > 0) {
        g.text('适用范围', 960, 130, { kind: 'serif', size: 52, weight: 700, color: 'ink', align: 'center', alpha: a });
        const k1 = win(t, T(1, '宇宙类型', -0.2), 0.7);
        g.text('宇宙类型的世界观', 560, 820, { kind: 'serif', size: 38, weight: 700, color: 'ink', align: 'center', alpha: a * k1 });
        g.tag('套用量级表', 560, 880, 'ok', { align: 'center', size: 28, p: win(t, T(1, '作品', -0.2), 0.6) });
        const k2 = win(t, T(2, '不是宇宙', -0.3), 0.7);
        g.text('非宇宙形式 · 更密集、体积更小', 1360, 820, { kind: 'serif', size: 34, weight: 700, color: 'ink', align: 'center', alpha: a * k2 });
        const k3 = win(t, T(2, '能量总和'), 0.8);
        if (k3 > 0) {
          g.text('E = Σ eᵢ', 1360, 900, { kind: 'math', size: 52, color: 'energy', align: 'center', alpha: a * k3, glow: 14 });
          // little sums flowing in
          for (let i = 0; i < 8; i++) {
            const ph = ((t - T(2, '能量总和')) * 0.6 + i / 8) % 1;
            const p = sc.p3(...wv(1360 + Math.cos(i * 0.8) * 230, 520 + Math.sin(i * 0.8) * 200));
            const x = lerp(p[0], 1360, ph);
            const y = lerp(p[1], 880, ph);
            g.text(`e${'₁₂₃₄₅₆₇₈'[i]}`, x, y, { kind: 'math', size: 26, color: 'energyLite', align: 'center', alpha: a * k3 * Math.sin(ph * Math.PI) });
          }
        }
        // plain joules
        const k4 = env(t, T(3, '', -0.2), 0.6, T(4, '', -0.6), 0.6);
        if (k4 > 0) {
          g.rect(0, 0, W, H, { fill: 'rgba(4,6,12,0.86)', alpha: k4 });
          g.text('实在对应不上具体量级', 960, 380, { kind: 'sans', size: 32, color: 'ink2', align: 'center', alpha: k4 });
          g.text('XX 级', 760, 520, { kind: 'serif', size: 60, weight: 700, color: 'ink3', align: 'center', alpha: k4 });
          strike(g, 650, 510, 870, 500, win(t, T(3, '直接'), 0.4), { w: 10 });
          g.arrow([900, 500], [1020, 500], { color: 'ink', w: 2.5, p: win(t, T(3, '直接'), 0.5), alpha: k4 });
          g.sci([2.6, 29], 1260, 520, { size: 64, color: 'energy', align: 'center', unit: 'J', alpha: k4 * win(t, T(3, '能量数据', -0.3), 0.6), glow: 16 });
          g.text('直接写能量数据（数值为示意）', 1260, 600, { kind: 'sans', size: 24, color: 'ink2', align: 'center', alpha: k4 * win(t, T(3, '能量数据'), 0.6) });
        }
      }
    }
    // ------------------------------------------------ B: dark matter
    {
      const a = env(t, T(4, '', -0.4), 0.8, T(6, '', -0.4), 0.8);
      if (a > 0) {
        g.text('暗物质 · 暗能量', 960, 90, { kind: 'serif', size: 46, weight: 700, color: 'ink', align: 'center', alpha: a });
        g.text('子弹星系团 1E 0657-56（NASA / CXC / STScI / ESO）', 1880, 1040, { kind: 'sans', size: 18, color: 'ink3', align: 'right', alpha: a });
        const lab = (px, py, text, col, tc, dx, dy) => {
          const k = win(t, tc, 0.7);
          const p = imgToScreen(px, py);
          g.circle(p[0], p[1], 8, { fill: col, alpha: a * k });
          g.line([[p[0], p[1]], [p[0] + dx, p[1] + dy]], { color: col, w: 2, p: k, alpha: a });
          g.text(text, p[0] + dx + (dx > 0 ? 12 : -12), p[1] + dy + 10, { kind: 'serif', size: 30, weight: 700, color: col, align: dx > 0 ? 'left' : 'right', alpha: a * k, glow: 10 });
        };
        lab(900, 600, '热气体：常规物质', '#FF8FB0', T(4, '暗物质', -0.6), -260, -260);
        lab(560, 760, '暗物质（引力透镜测得）', '#8FA8FF', T(4, '暗能量', -0.4), -120, 230);
        lab(1460, 560, '暗物质', '#8FA8FF', T(4, '暗能量', -0.2), 160, -230);
        const k = win(t, T(4, '不纳入', -0.1), 0.6);
        g.tag('不纳入常规能量摧毁计算', 960, 980, 'unobserved', { align: 'center', size: 30, p: k });
        const k5 = win(t, T(5, '单独标注'), 0.6);
        if (k5 > 0) {
          g.card(1300, 160, 560, 210, {
            p: k5,
            fn: (g2, w) => {
              g2.text('角色能与暗物质相互作用', 30, 60, { kind: 'serif', size: 30, weight: 700 });
              g2.text('→ 单独标注机制', 30, 116, { kind: 'sans', size: 28, color: 'energy' });
              g2.text('不因能量覆盖到了就自动生效', 30, 170, { kind: 'sans', size: 26, color: 'ink2', alpha: win(t, T(5, '自动生效', -0.3), 0.6) });
            },
          });
        }
      }
    }
    // ------------------------------------------------ C: system core
    {
      const a = win(t, T(6, '', -0.4), 1.0);
      if (a > 0) {
        g.text('天体系统的核心默认规则', 960, 100, { kind: 'serif', size: 46, weight: 700, color: 'ink', align: 'center', alpha: a });
        const sys = env(t, T(7, '恒星系', -0.3), 0.5, T(8, '', 0), 0.6);
        g.text('恒星系 · 星系 · 星系团', 960, 160, { kind: 'sans', size: 30, color: 'ink2', align: 'center', alpha: a * sys });
        const ck = win(t, T(7, '核心区域', -0.3), 0.6);
        const cp = sc.project(new THREE.Vector3().setFromMatrixPosition(gal.matrixWorld));
        if (ck > 0 && t < T(10, '', -0.4)) {
          g.circle(cp[0], cp[1], 70, { color: 'energy', w: 2, dash: [6, 5], p: ck, alpha: a * (1 - win(t, T(8, '', 0.5), 0.6)) });
          g.text('核心区域', cp[0] + 84, cp[1] - 50, { kind: 'serif', size: 28, weight: 700, color: 'energy', alpha: a * ck * (1 - win(t, T(8, '', 0.5), 0.6)) });
        }
        // components named on cue
        const comps = [['恒星', T(8, '恒星'), -500, -260], ['行星', T(8, '行星'), -560, 0], ['气体', T(8, '气体'), 480, -240], ['尘埃', T(8, '尘埃'), 520, 40], ['黑洞 · 中子星', T(8, '黑洞'), 120, 180]];
        const fadeC = 1 - win(t, T(9, '', 0), 0.6);
        comps.forEach(([nm, tc, dx, dy]) => {
          const k = win(t, tc - 0.2, 0.5) * fadeC;
          if (k <= 0) return;
          const x = cp[0] + dx;
          const y = cp[1] + dy;
          g.text(nm, x, y, { kind: 'serif', size: 30, weight: 700, color: 'ink', align: 'center', alpha: a * k });
          g.line([[x, y + 10], [lerp(x, cp[0], 0.55), lerp(y + 10, cp[1], 0.55)]], { color: 'ink3', w: 1.2, alpha: a * k * 0.7 });
        });
        g.seal('系统级认证', 1600, 820, { size: 150, shape: 'rect', p: win(t, T(8, '直接认证', -0.2), 0.5), color: 'gold', alpha: fadeC });
        const nk = env(t, T(9, '', -0.2), 0.6, T(10, '', -0.4), 0.6);
        g.text('没说不行，那就默认可以', 960, 960, { kind: 'kai', size: 46, color: 'gold', align: 'center', alpha: a * nk, glow: 12 });
        // exceptions
        const ex = win(t, T(10, '例外', -0.3), 0.6);
        if (ex > 0) {
          g.text('例外：作品明确表现或设定', 960, 160, { kind: 'sans', size: 30, color: 'red', align: 'center', alpha: a * ex });
          const tags = [['掠过核心', T(10, '掠过')], ['核心天体留存', T(10, '留存')], ['核心有免疫 / 规避机制', T(10, '免疫')]];
          tags.forEach(([s, tc], i) => g.tag(s, 330, 360 + i * 80, 'rejected', { size: 28, p: win(t, tc - 0.2, 0.5) }));
          g.circle(cp[0], cp[1], 60, { color: 'energy', w: 2.5, alpha: a * win(t, T(10, '留存'), 0.5), glow: 16 });
          const k11 = win(t, T(11, '降级'), 0.6);
          if (k11 > 0) {
            g.card(1340, 700, 480, 200, {
              p: k11,
              fn: (g2, w) => {
                g2.text('按实际覆盖范围', 30, 70, { kind: 'serif', size: 32, weight: 700 });
                g2.text('降级判定', 30, 130, { kind: 'serif', size: 44, weight: 900, color: 'red' });
                g2.arrow([w - 70, 50], [w - 70, 160], { color: 'red', w: 4, head: 16 });
              },
            });
          }
        }
      }
    }
  };
  return sc;
}
