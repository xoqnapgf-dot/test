// 序 · 一条能量轴
// One energy axis, one decade per world unit. The camera rides it from a mosquito bite to the
// observable universe, pulls back to see all eighty-odd decades, then the axis is cut into the
// three segments of the system and the film's title forms.
import * as THREE from 'three';
import { makeScene } from './base.js';
import { makePlanet, makeStar, makeGalaxy, makeCosmicWeb, makeCity, makeShatterBrick, windowMaterial } from '../gfx/objects.js';
import { glowQuad, emissive, lin, dotsMaterial } from '../gfx/materials.js';
import { clamp, lerp, smooth, ease, win, env, spline, keys, rng, sup, pulse } from '../core/util.js';
import { W, H } from '../core/draw2d.js';

const X = (E) => Math.log10(E);
const AX0 = -6.2;
const AX1 = 86;
const SEG_A = X(2.28e42); // end of the inherited zone (超恒星)
const SEG_B = X(3.69e49); // start of the coverage system (弱恒星系)

// first energy of each tier; used for the inherited / coverage tier labels
const TIERS_A = [
  ['昆虫', 5e-5], ['凡人', 50], ['爆砖', 600], ['爆墙', 1.25e5], ['爆屋', 1.673e7], ['爆楼', 1.255e9], ['爆街', 2.092e11],
  ['爆城', 4.184e15], ['爆国', 6.276e19], ['爆大陆', 2.092e23], ['爆地表', 5.02e25], ['爆行星', 4.865e30], ['爆褐矮星', 3.49e38], ['爆恒星', 2.4e40],
];
const TIERS_C = [['恒星系', 3.69e49], ['星团', 3.7e58], ['星系', 1.15e61], ['星系团', 9.2e69], ['宇宙结构', 3.7e72], ['宇宙', 3.7e76]];

export function build() {
  const sc = makeScene('open', 'cosmos', { fov: 38, backdrop: { stars: 1, nebula: 0.8, tint: '#7a3418' } });
  const { three, camera, c } = sc;

  // --- props along the axis
  const brick = makeShatterBrick(0.48, 0.23, 0.11, { seed: 4, spread: 1 });
  brick.scale.setScalar(1.25);
  brick.position.set(X(2000), 0.42, 0);
  brick.rotation.set(0.25, -0.5, 0.05);
  three.add(brick);

  const towerMat = windowMaterial({ wx: 10, wy: 26, intensity: 2.6 });
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.7, 0.55), towerMat);
  tower.position.set(X(4.184e9), 0.9, 0);
  tower.rotation.y = 0.5;
  three.add(tower);

  const city = makeCity(240, 2.6, { seed: 3 });
  city.position.set(X(3.03e16), 0.05, -0.6);
  city.rotation.y = 0.35;
  three.add(city);

  const land = makeLand();
  land.position.set(X(2.092e21), 0.08, -0.4);
  three.add(land);

  const planet = makePlanet(1.15, { seed: 2.3, light: [-1, 0.3, 0.7] });
  planet.position.set(X(2.24e32), 1.55, 0);
  three.add(planet);

  const sun = makeStar(1.7, { color: '#FF8A2A', hot: '#FFE2A0', intensity: 1.9, glow: '#FF9A40', glowI: 0.42, corona: 2.6, rays: 0.7, scale: 2.4 });
  sun.position.set(X(2.28e41), 2.3, 0);
  three.add(sun);

  const system = makeSystem();
  system.position.set(SEG_B, 1.9, 0);
  three.add(system);

  const galaxy = makeGalaxy(3.6, 40000, { seed: 7, intensity: 0.8, coreI: 0.8 });
  galaxy.position.set(X(4.6e63), 2.6, 0);
  galaxy.rotation.set(1.05, 0.0, 0.25);
  three.add(galaxy);

  const cluster = makeCluster();
  cluster.position.set(X(9.2e70), 2.8, 0);
  three.add(cluster);

  const web = makeCosmicWeb(4.2, { seed: 5, nodes: 60, intensity: 0.75 });
  web.position.set(X(8e77), 3.4, 0);
  three.add(web);

  // a faint glowing rail under the axis so it reads in 3D, plus a light at the mosquito
  const spark = glowQuad({ color: '#FFD08A', intensity: 1.2, size: 0.12, falloff: 2.4 });
  three.add(spark);

  // --- camera track: [t, [cx, cy, cz, lx, ly, lz]]
  const T = (i, kw, off = 0) => c(i, kw, off);
  const camK = [
    [0, [-5.2, 0.55, 2.6, -3.8, 0.15, 0]],
    [T(0, '五乘'), [-5.0, 0.6, 2.35, -3.75, 0.15, 0]],
    [T(1, '普通人', -0.2), [0.9, 0.8, 3.0, 2.3, 0.35, 0]],
    [T(1, '打碎', -0.1), [2.15, 0.95, 2.55, 3.2, 0.42, 0]],
    [T(1, '两千焦', 0.6), [2.4, 1.0, 2.9, 3.4, 0.45, 0]],
    [T(2, '一栋楼'), [8.1, 1.5, 4.8, 9.6, 1.0, 0]],
    [T(2, '一座城'), [14.6, 2.6, 5.4, 16.5, 0.6, 0]],
    [T(2, '一个国家'), [19.3, 3.1, 6.0, 21.3, 0.4, 0]],
    [T(2, '一颗行星'), [29.9, 2.2, 6.6, 32.4, 1.5, 0]],
    [T(2, '一颗恒星', 0.4), [38.2, 2.7, 9.2, 41.4, 2.3, 0]],
    [T(3, '打爆太阳'), [38.9, 2.5, 8.0, 41.4, 2.3, 0]],
    [T(3, '焦耳', 0.5), [39.3, 2.45, 7.4, 41.4, 2.3, 0]],
    [T(4, '恒星系'), [46.8, 3.0, 9.0, 49.6, 1.9, 0]],
    [T(4, '星系、'), [59.6, 3.6, 11.0, 63.7, 2.6, 0]],
    [T(4, '星系团'), [67.0, 3.6, 12.0, 71.0, 2.8, 0]],
    [T(4, '可观测宇宙'), [73.5, 4.6, 14.0, 78.0, 3.3, 0]],
    [T(4, '宇宙', 1.6), [68, 7, 36, 64, 2.5, 0]],
    [T(5, '刻刻度'), [40, 5.4, 82, 40, 2.0, 0]],
    [T(5, '位置', 0.4), [40, 5.0, 84, 40, 2.0, 0]],
  ];
  // after the ride: framing for segments
  const camK2 = [
    [c.end(5), [40, 5.0, 84, 40, 2.0, 0]],
    [T(6, '三段', 0.6), [40, 3.6, 80, 40, 1.4, 0]],
    [T(7, '继承区'), [18, 2.6, 52, 18, 0.6, 0]],
    [T(7, '复算', 0.4), [19, 2.6, 50, 19, 0.6, 0]],
    [T(8, '覆盖体系'), [67, 3.2, 44, 67, 1.0, 0]],
    [T(8, '原创', 0.4), [67.5, 3.2, 43, 67.5, 1.0, 0]],
    [T(9, '命名空白', -0.6), [46, 2.6, 24, 46, 0.6, 0]],
    [c.end(9), [46, 2.6, 23, 46, 0.6, 0]],
    [T(10, '三段'), [40, 3.6, 82, 40, 1.2, 0]],
    [T(11, '这一部分', 0.4), [40, 3.6, 82, 40, 1.2, 0]],
    [T(11, '这一部分', 3.0), [40, 16, 92, 40, 12.5, 0]],
    [c.end(11, 3), [40, 16.5, 94, 40, 12.8, 0]],
  ];

  const mosq = [X(5e-5), 0, 0];
  const markers = (() => {
    const r = rng(42);
    return Array.from({ length: 16 }, (_, i) => ({ x: lerp(-2, 80, r()), d: r() * 0.9 + i * 0.12, h: 0.3 + r() * 0.5 }));
  })();

  sc.update = (t) => {
    const k = t < camK2[0][0] ? spline(t, camK) : keys(t, camK2, ease.inOut3);
    camera.position.set(k[0], k[1], k[2]);
    camera.lookAt(k[3], k[4], k[5]);
    camera.updateMatrixWorld();
    // props
    brick.userData.update(t - T(1, '打碎', 0.15));
    brick.rotation.y = -0.5 + t * 0.05;
    tower.rotation.y = 0.5 + t * 0.04;
    city.rotation.y = 0.35 + t * 0.02;
    land.rotation.y = t * 0.015;
    planet.rotation.y = t * 0.06;
    planet.userData.mat.uniforms.uTime.value = t;
    sun.userData.mat.uniforms.uTime.value = t;
    sun.userData.corona.material.uniforms.uTime.value = t;
    sun.rotation.y = t * 0.03;
    // the sun flares as its number is read
    const flare = pulse(t, T(3, '二点'), 3.5);
    sun.userData.mat.uniforms.uI.value = 1.9 + flare * 1.2;
    sun.userData.mat.uniforms.uCrack.value = flare * 0.8;
    system.userData.update(t);
    galaxy.userData.mat.uniforms.uSpin.value = t * 0.05;
    galaxy.userData.mat.uniforms.uTime.value = t;
    cluster.rotation.y = t * 0.02;
    web.rotation.y = t * 0.012;
    spark.position.set(mosq[0], 0.04, 0.02);
    spark.material.uniforms.uI.value = 1.4 * win(t, 1.5, 2.0) * (1 - smooth((t - T(1, '普通人')) / 2));
    // dim the far props during the title so the type can breathe
    const dim = 1 - 0.65 * smooth((t - T(11, '这一部分')) / 2.5);
    for (const o of [galaxy, web]) o.userData.mat.uniforms.uFade.value = dim;
    cluster.userData.mat.uniforms.uFade.value = dim;
  };

  const P = [];
  sc.draw = (g, t) => {
    const ax = (x, y = 0, z = 0) => sc.p3(x, y, z);
    const intro = win(t, 0.6, 3.5, ease.inOut3);
    // ---------------------------------------------------------------- axis
    const ride = t < c.end(5);
    const reach = lerp(AX0 + 0.5, AX1, intro); // the axis draws itself in at the start
    const pts = [];
    for (let x = AX0; x <= reach; x += 0.25) {
      const p = ax(x);
      if (p[3]) pts.push([p[0], p[1]]);
    }
    if (pts.length > 1) {
      g.line(pts, { color: 'energy', w: 7, alpha: 0.12, glow: 30 });
      g.line(pts, { color: 'energyLite', w: 2.2, alpha: 0.95, glow: 10 });
    }
    // arrowhead beyond the universe: the axis keeps going
    if (!ride || t > T(4, '可观测')) {
      const a = ax(AX1 - 0.6);
      const b = ax(AX1 + 1.2);
      if (a[3] && b[3]) g.arrow([a[0], a[1]], [b[0], b[1]], { color: 'energyLite', w: 2, head: 12, alpha: 0.8 });
    }
    // decade ticks; during the engraving pass a spark runs along and lights them up
    const engrave0 = T(5, '刻刻度', -0.2);
    const engraveX = lerp(AX0, AX1, ease.inOut2((t - engrave0) / 3.2));
    for (let d = -5; d <= 85; d++) {
      const base = ax(d);
      if (!base[3]) continue;
      const top = ax(d, d % 10 === 0 ? 0.45 : d % 5 === 0 ? 0.3 : 0.18);
      const lit = t > engrave0 ? clamp((engraveX - d) * 2) : 0;
      const a = (0.35 + 0.65 * lit) * intro * clamp((reach - d) * 2);
      g.seg(base[0], base[1], top[0], top[1], { color: 'energyLite', w: d % 10 === 0 ? 2 : 1.2, alpha: a });
      const ppu = Math.hypot(top[0] - base[0], top[1] - base[1]) / 0.3;
      // labels: every decade when close, every ten when far
      const every = ppu > 70 ? 1 : ppu > 30 ? 5 : 10;
      if (d % every === 0) {
        const size = clamp(ppu * 0.32, 13, 24);
        const la = a * (d % 10 === 0 ? 1 : 0.7);
        const yb = base[1] + size * 1.5;
        g.text('10', base[0] - size * 0.35, yb, { kind: 'mono', size, color: 'ink2', align: 'center', alpha: la });
        g.text(String(d).replace('-', '−'), base[0] + size * 0.35, yb - size * 0.45, { kind: 'mono', size: size * 0.62, color: 'ink2', alpha: la });
      }
    }
    if (t > engrave0 && t < engrave0 + 3.6) {
      const s = ax(engraveX, 0.05);
      g.glow(s[0], s[1], 40, 'energyLite', 0.9);
      g.circle(s[0], s[1], 3, { fill: '#FFFFFF' });
    }
    // unit
    {
      const u = ax(AX0 + 0.2, -0.55);
      if (u[3]) g.text('能量 / 焦耳', u[0], u[1], { kind: 'sans', size: 18, color: 'ink3', alpha: intro * 0.9 });
    }

    // ------------------------------------------------------------- labels
    const lab = (x, y, name, val, t0, t1, o = {}) => {
      const a = env(t, t0, 0.6, t1, 0.8);
      if (a <= 0) return;
      const anchor = ax(x, y);
      if (!anchor[3]) return;
      const lx = anchor[0] + (o.dx || 0);
      const ly = anchor[1] + (o.dy || -70);
      g.seg(anchor[0], anchor[1], lx, ly + 12, { color: 'ink3', w: 1.2, alpha: a * 0.8, p: win(t, t0, 0.5) });
      g.text(name, lx, ly - 40, { kind: 'serif', size: o.size || 36, weight: 700, color: 'ink', align: 'center', alpha: a, reveal: win(t, t0 + 0.1, 0.5) });
      if (val) g.sci(val, lx, ly, { size: (o.size || 36) * 0.82, color: 'energy', align: 'center', unit: 'J', alpha: a, reveal: win(t, t0 + 0.25, 0.6), glow: 8 });
    };
    // mosquito
    {
      const a = win(t, 1.6, 1.4) * (1 - win(t, T(1, '普通人', 0.3), 0.8));
      const p = ax(mosq[0], 0.18);
      if (a > 0 && p[3]) g.icon('bug', p[0], p[1] - 40, 64, { color: 'ink', w: 1.6, p: win(t, 1.8, 1.6), alpha: a, glow: 8 });
      lab(mosq[0], 0.02, '蚊子叮咬', [5, -5], T(0, '五乘'), T(1, '普通人', 0.3), { dy: -150, dx: 150 });
    }
    // punch & brick
    {
      const p = ax(X(100), 0.2);
      const a = env(t, T(1, '普通人'), 0.5, T(2, '再往上'), 0.6);
      if (a > 0 && p[3]) g.icon('karate', p[0], p[1] - 46, 84, { color: 'ink', w: 1.5, p: win(t, T(1, '普通人'), 1.0), alpha: a, glow: 6 });
      lab(X(100), 0.02, '全力一拳', [1, 2], T(1, '一百'), T(2, '再往上', 0.2), { dy: -170, dx: -40, size: 36 });
      lab(X(2000), 0.62, '打碎红砖', [2, 3], T(1, '两千'), T(2, '再往上', 0.2), { dy: -150, dx: 60, size: 36 });
    }
    lab(X(4.184e9), 1.8, '一栋楼', [4.18, 9], T(2, '一栋楼'), T(2, '一座城', 0.3), { dy: -60, size: 36 });
    lab(X(3.03e16), 0.8, '一座城', [3.03, 16], T(2, '一座城'), T(2, '一个国家', 0.3), { dy: -80, size: 36 });
    lab(X(2.092e21), 0.4, '一个国家', [2.09, 21], T(2, '一个国家'), T(2, '一颗行星', 0.3), { dy: -90, size: 36 });
    lab(X(2.24e32), 2.8, '一颗行星', [2.24, 32], T(2, '一颗行星'), T(2, '一颗恒星', 0.3), { dy: -50, size: 36 });
    // the sun: big number
    {
      const a = env(t, T(3, '二点'), 0.6, T(4, '这条轴', 0.6), 0.8);
      if (a > 0) {
        const p = [670, 0];
        const wash = g.x.createLinearGradient(0, 0, W * 0.55, 0);
        wash.addColorStop(0, `rgba(3,4,9,${0.75 * a})`);
        wash.addColorStop(1, 'rgba(3,4,9,0)');
        g.x.fillStyle = wash;
        g.x.fillRect(0, 0, W * 0.55, H);
        g.text('打爆太阳 · 引力束缚能', p[0] - 520, H * 0.42, { kind: 'serif', size: 34, weight: 700, color: 'ink', alpha: a, reveal: win(t, T(3, '打爆'), 0.8) });
        g.sci([2.28, 41], p[0] - 520, H * 0.42 + 92, { size: 82, weight: 600, color: 'energy', unit: 'J', alpha: a, reveal: win(t, T(3, '二点'), 1.4), glow: 22 });
        g.text('至少', p[0] - 520, H * 0.42 + 150, { kind: 'sans', size: 24, color: 'ink2', alpha: a * win(t, T(3, '至少'), 0.5) });
      }
    }
    lab(SEG_B, 4.4, '恒星系', null, T(4, '恒星系', -0.1), T(4, '宇宙', 1.8), { dy: -30, size: 30 });
    lab(X(4.6e63), 5.6, '星系', null, T(4, '星系、', -0.1), T(4, '宇宙', 1.8), { dy: -30, size: 30 });
    lab(X(9.2e70), 6.2, '星系团', null, T(4, '星系团', -0.1), T(4, '宇宙', 1.8), { dy: -30, size: 30 });
    lab(X(8e77), 7.8, '可观测宇宙', null, T(4, '可观测'), T(4, '宇宙', 2.2), { dy: -30, size: 30 });

    // ------------------------------------------- every feat finds its place
    {
      const t0 = T(5, '每一次');
      for (const m of markers) {
        const k = (t - t0 - m.d) / 0.7;
        if (k <= 0) continue;
        const fade = 1 - win(t, T(6, '整条'), 1.0);
        if (fade <= 0) continue;
        const land = ax(m.x, 0);
        const from = ax(m.x, m.h + 3);
        if (!land[3]) continue;
        const y = lerp(from[1], land[1] - 8, ease.out3(k));
        g.x.save();
        g.x.globalAlpha = smooth(k * 2) * fade;
        g.x.fillStyle = g.col('red');
        g.x.beginPath();
        g.x.moveTo(land[0], y);
        g.x.lineTo(land[0] - 6, y - 12);
        g.x.lineTo(land[0] + 6, y - 12);
        g.x.closePath();
        g.x.fill();
        g.x.restore();
        if (k > 1) g.circle(land[0], land[1], 6 + (k - 1) * 30, { color: 'red', w: 1.5, alpha: (1 - clamp((k - 1) / 1.2)) * fade });
      }
    }

    // ------------------------------------------------------- three segments
    const segIn = win(t, T(6, '三段', -0.2), 1.0);
    if (segIn > 0) {
      const mk = (x0, x1, yOff) => {
        const out = [];
        for (let x = x0; x <= x1 + 1e-6; x += 0.25) {
          const p = ax(Math.min(x, x1), yOff);
          if (p[3]) out.push([p[0], p[1]]);
        }
        return out;
      };
      // cut marks at the two boundaries
      for (const bx of [SEG_A, SEG_B]) {
        const a = ax(bx, 0.9);
        const b = ax(bx, -0.9);
        if (a[3] && b[3]) g.seg(a[0], a[1], b[0], b[1], { color: 'ink', w: 2, alpha: segIn, p: segIn });
      }
      const titleK = 1 - 0.9 * win(t, T(11, '这一部分'), 2);
      // inherited zone
      const aA = win(t, T(7, '继承区', -0.3), 1.2);
      if (aA > 0) {
        const band = mk(-5.2, SEG_A - 0.15, -0.55);
        g.line(band, { color: 'energy', w: 10, alpha: 0.85 * titleK, p: aA, glow: 14 });
        const mid = ax(18, -1.35);
        g.text('继承区', mid[0], mid[1] + 18, { kind: 'serif', size: 40, weight: 700, color: 'energy', align: 'center', alpha: aA * titleK, reveal: aA });
        g.text('爆恒星及以下 · 沿用汪吧标准', mid[0], mid[1] + 62, { kind: 'sans', size: 22, color: 'ink2', align: 'center', alpha: win(t, T(7, '沿用'), 0.8) * titleK });
        // tier names, rechecked one by one
        const chk0 = T(7, '逐级复算', -0.4);
        const lblA = env(t, T(7, '汪吧'), 0.8, T(8, '覆盖体系', 0.2), 0.8);
        TIERS_A.forEach(([nm, e], i) => {
          const xx = X(e);
          const p = ax(xx, 0);
          if (!p[3]) return;
          const row = i % 3;
          const ly = p[1] - 50 - row * 34;
          g.seg(p[0], p[1] - 6, p[0], ly + 8, { color: 'ink3', w: 1, alpha: lblA * 0.6 });
          g.text(nm, p[0], ly, { kind: 'sans', size: 21, weight: 500, color: 'ink', align: 'center', alpha: lblA });
          const ck = win(t, chk0 + i * 0.32, 0.35);
          if (ck > 0) g.line([[p[0] - 7, ly - 30], [p[0] - 2, ly - 24], [p[0] + 8, ly - 38]], { color: 'ok', w: 2.4, p: ck, alpha: lblA });
        });
      }
      // coverage system
      const aC = win(t, T(8, '覆盖体系', -0.3), 1.2);
      if (aC > 0) {
        const band = mk(SEG_B + 0.15, AX1 - 0.6, -0.55);
        g.line(band, { color: 'range', w: 10, alpha: 0.85 * titleK, p: aC, glow: 14 });
        const mid = ax(68, -1.35);
        g.text('覆盖体系', mid[0], mid[1] + 18, { kind: 'serif', size: 40, weight: 700, color: 'range', align: 'center', alpha: aC * titleK, reveal: aC });
        g.text('爆恒星之上 · 本体系原创', mid[0], mid[1] + 62, { kind: 'sans', size: 22, color: 'ink2', align: 'center', alpha: win(t, T(8, '原创'), 0.8) * titleK });
        const lblC = env(t, T(8, '覆盖体系', 0.5), 0.8, T(9, '两者'), 0.8);
        TIERS_C.forEach(([nm, e], i) => {
          const p = ax(X(e), 0);
          if (!p[3]) return;
          const ly = p[1] - 46 - (i % 2) * 30;
          g.seg(p[0], p[1] - 6, p[0], ly + 8, { color: 'ink3', w: 1, alpha: lblC * 0.6 });
          g.text(nm, p[0], ly, { kind: 'sans', size: 21, weight: 500, color: 'ink', align: 'center', alpha: lblC * win(t, T(8, '覆盖体系') + i * 0.2, 0.4) });
        });
      }
      // transition band: hatched naming gap
      const aB = win(t, T(9, '命名空白', -0.4), 1.0);
      if (aB > 0) {
        const a0 = ax(SEG_A + 0.1, -0.55);
        const a1 = ax(SEG_B - 0.1, -0.55);
        const yy = a0[1];
        const len = (a1[0] - a0[0]) * aB;
        g.x.save();
        g.x.beginPath();
        g.x.rect(a0[0], yy - 7, len, 14);
        g.x.clip();
        for (let x = a0[0] - 20; x < a0[0] + len + 20; x += 9) g.seg(x, yy + 8, x + 12, yy - 8, { color: 'ink2', w: 1.6, alpha: 0.8 * titleK });
        g.x.restore();
        g.rect(a0[0], yy - 7, len, 14, { color: 'ink2', w: 1, alpha: 0.7 * titleK });
        const mid = ax((SEG_A + SEG_B) / 2, -1.35);
        const near = env(t, T(9, '命名空白', -0.4), 0.8, T(10, '三段', -0.2), 0.8);
        g.text('过渡带', mid[0], mid[1] + 30, { kind: 'serif', size: 40 + 10 * near, weight: 700, color: 'ink', align: 'center', alpha: aB * titleK, reveal: aB });
        g.text('两套体系之间的命名空白', mid[0], mid[1] + 80, { kind: 'sans', size: 22, color: 'ink2', align: 'center', alpha: aB * titleK * near });
        // the two ends it sits between
        if (near > 0) {
          const pa = ax(SEG_A, 0.7);
          const pb = ax(SEG_B, 0.7);
          g.text('超恒星', pa[0], pa[1] - 40, { kind: 'sans', size: 20, color: 'energy', align: 'center', alpha: near });
          g.sci([2.28, 42], pa[0], pa[1] - 10, { size: 20, color: 'energy', align: 'center', unit: 'J', alpha: near });
          g.text('弱恒星系', pb[0], pb[1] - 40, { kind: 'sans', size: 20, color: 'range', align: 'center', alpha: near });
          g.sci([3.69, 49], pb[0], pb[1] - 10, { size: 20, color: 'range', align: 'center', unit: 'J', alpha: near });
        }
      }
      // shared rules: one bracket under all three
      const aR = win(t, T(10, '判定通则', -0.8), 1.2);
      if (aR > 0) {
        const l = ax(-5.2, -4.2);
        const r = ax(AX1 - 1, -4.2);
        const yb = l[1] + 30;
        const xm = (l[0] + r[0]) / 2;
        const w = (r[0] - l[0]) / 2;
        const pts2 = [[l[0], yb - 16], [l[0], yb], [xm - 16, yb], [xm, yb + 14], [xm + 16, yb], [r[0], yb], [r[0], yb - 16]];
        const k = ease.inOut3(aR);
        g.line(pts2.map(([x, y]) => [xm + (x - xm) * k, y]), { color: 'gold', w: 2, alpha: aR * titleK });
        g.text('判定通则', xm, yb + 66, { kind: 'serif', size: 36, weight: 700, color: 'gold', align: 'center', alpha: aR * titleK * (1 - win(t, T(11, '这一部分'), 1)), glow: 12, track: 8 });
      }
    }

    // ---------------------------------------------------------- the title
    const tt = win(t, T(11, '这一部分', 0.2), 1.6);
    if (tt > 0) {
      const out = 1 - win(t, c.end(11, 0.8), 1.5);
      const cx = W / 2;
      const cy = H * 0.3;
      const wash = g.x.createRadialGradient(cx, cy + 40, 10, cx, cy + 40, 900);
      wash.addColorStop(0, `rgba(4,6,12,${0.78 * tt * out})`);
      wash.addColorStop(1, 'rgba(4,6,12,0)');
      g.x.fillStyle = wash;
      g.x.fillRect(0, 0, W, H);
      g.text('战力量级体系', cx, cy - 70, { kind: 'serif', size: 30, weight: 500, color: 'gold', align: 'center', alpha: tt * out, track: 18 });
      g.text('判定通则', cx, cy + 60, { kind: 'serif', size: 132, weight: 900, color: 'ink', align: 'center', alpha: tt * out, reveal: tt, rise: 40, track: 20, glow: 26 });
      const items = [
        ['一', '用途', '定级与证伪', T(11, '做什么')],
        ['二', '使用流程', '分批与执行顺序', T(11, '顺序用')],
        ['三', '十六条通则', '第零部分 0.1 – 0.16', T(11, '十六条')],
      ];
      items.forEach(([n, a, b, tc], i) => {
        const k = win(t, tc - 0.2, 0.9);
        const x = cx + (i - 1) * 440;
        const y = cy + 210;
        g.text(n, x, y, { kind: 'serif', size: 30, weight: 700, color: 'gold', align: 'center', alpha: k * out });
        g.seg(x - 60 * k, y + 22, x + 60 * k, y + 22, { color: 'gold', w: 1.2, alpha: k * out * 0.8 });
        g.text(a, x, y + 76, { kind: 'serif', size: 38, weight: 700, color: 'ink', align: 'center', alpha: k * out, reveal: k });
        g.text(b, x, y + 118, { kind: 'sans', size: 22, color: 'ink2', align: 'center', alpha: k * out });
      });
    }
  };
  return sc;
}

// a continent-like landmass with a glowing coast and scattered lights
function makeLand() {
  const g = new THREE.Group();
  const r = rng(77);
  const shape = new THREE.Shape();
  const N = 120;
  const pts = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const rad = 1.25 * (1 + 0.22 * Math.sin(a * 3 + 1) + 0.12 * Math.sin(a * 7 + 2) + 0.06 * Math.sin(a * 13));
    pts.push(new THREE.Vector2(Math.cos(a) * rad * 1.3, Math.sin(a) * rad));
  }
  shape.setFromPoints(pts);
  const geo = new THREE.ShapeGeometry(shape, 1);
  geo.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(geo, emissive('#1B2418', 1.0));
  g.add(m);
  const coast = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(p.x, 0.01, -p.y))), new THREE.LineBasicMaterial({ color: lin('#9FD7FF').multiplyScalar(2.2) }));
  g.add(coast);
  const P = [];
  for (let i = 0; i < 900; i++) {
    const a = r() * Math.PI * 2;
    const rr = Math.sqrt(r()) * 1.1;
    const x = Math.cos(a) * rr * 1.25;
    const y = Math.sin(a) * rr * 0.95;
    P.push(x, 0.03, -y);
  }
  const geoP = new THREE.BufferGeometry();
  geoP.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  const dm = dotsMaterial({ uniforms: { uI: { value: 2.2 } }, body: `P = (modelMatrix * vec4(position,1.0)).xyz; S = 0.035; C = vec3(1.0, 0.66, 0.32) * uI;` });
  const pp = new THREE.Points(geoP, dm);
  pp.frustumCulled = false;
  g.add(pp);
  return g;
}

// a star with orbit rings and planets
function makeSystem() {
  const g = new THREE.Group();
  const star = glowQuad({ color: '#FFC27A', intensity: 3.2, size: 0.55, falloff: 1.5 });
  g.add(star);
  const orbits = [0.5, 0.8, 1.15, 1.6, 2.2, 2.9];
  const planets = [];
  orbits.forEach((R, i) => {
    const pts = [];
    for (let k = 0; k <= 128; k++) {
      const a = (k / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * R, 0, Math.sin(a) * R));
    }
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: lin('#8FB9E0').multiplyScalar(0.9), transparent: true, opacity: 0.6 }));
    g.add(line);
    const p = glowQuad({ color: i % 2 ? '#9CC8FF' : '#FFD7A8', intensity: 2.0, size: 0.09 + 0.03 * (i % 3), falloff: 3 });
    g.add(p);
    planets.push({ p, R, w: 0.6 / Math.pow(R, 1.5), a0: i * 1.7 });
  });
  g.rotation.set(0.42, 0, 0.12);
  g.userData.update = (t) => {
    for (const q of planets) {
      const a = q.a0 + t * q.w;
      q.p.position.set(Math.cos(a) * q.R, 0, Math.sin(a) * q.R);
    }
  };
  return g;
}

// a loose ball of galaxies
function makeCluster() {
  const r = rng(31);
  const P = [];
  const C = [];
  for (let k = 0; k < 90; k++) {
    const c = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize().multiplyScalar(3.4 * Math.cbrt(r()));
    const n = 60 + Math.floor(r() * 140);
    const big = r() < 0.15 ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const d = new THREE.Vector3(r() - 0.5, (r() - 0.5) * 0.4, r() - 0.5).multiplyScalar(0.28 * big * Math.pow(r(), 1.5));
      P.push(c.x + d.x, c.y + d.y, c.z + d.z);
      const w = 0.6 + r() * 0.8;
      C.push(1.0 * w, 0.78 * w, 0.55 * w);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  geo.setAttribute('aCol', new THREE.Float32BufferAttribute(C, 3));
  const mat = dotsMaterial({ uniforms: { uFade: { value: 1 } }, attrs: 'attribute vec3 aCol;', body: `P = (modelMatrix*vec4(position,1.0)).xyz; S = 0.035; C = aCol * 0.45; A = uFade;` });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  const g = new THREE.Group();
  g.add(pts);
  g.userData.mat = mat;
  return g;
}
