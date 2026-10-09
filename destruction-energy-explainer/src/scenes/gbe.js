// 06 GRAVITATIONAL BINDING ENERGY — the planet-scale ledger. Earth comes apart and its pieces
// drift toward infinity; they rewind for the formula; a wedge opens to show the dense core next
// to the PREM density profile (+11 %); then a log ladder from Mars to a neutron star.
import { Background, Layer2D, Stage, THREE } from './base.js';
import { spherePoly, fracture } from '../gfx/fracture.js';
import { Shatter } from '../gfx/shatter.js';
import { planetMaterial, atmosphereMaterial, sphereGeometry, glowSprite, KIND } from '../gfx/planet.js';
import { cue, line } from '../core/narr.js';
import { F, font, tracking, sup } from '../core/type.js';
import { C, LEDGER, rgba } from '../core/style.js';
import { line as ln, arrow, polyline, tag, bracket } from '../gfx/draw.js';
import { clamp, ease, ep, lerp, TAU } from '../core/util.js';

const VI = LEDGER[3].col;
// PREM-like density profile (radius km, g/cm³), simplified
const PREM = [[0, 13.09], [1221, 12.76], [1221, 12.17], [3480, 9.9], [3480, 5.57], [5701, 4.38], [5701, 3.99], [5971, 3.54], [6151, 3.36], [6346, 3.38], [6346, 2.9], [6371, 2.6]];
// ladder: log10(J) positions
const LX0 = 190, LX1 = 1730, LE0 = 30, LE1 = 47;
const lx = (e) => lerp(LX0, LX1, (e - LE0) / (LE1 - LE0));
const LY = 700;
const BODIES = [
  { key: 'mars', kind: KIND.mars, name: '火星', e: Math.log10(4.9e30), val: '4.9×10³⁰', px: 34, cue: ['gbe', 4, '火星'] },
  { key: 'earth', name: '地球', e: Math.log10(2.49e32), val: '2.5×10³²', px: 44, cue: ['gbe', 4, '火星', -0.6] },
  { key: 'jup', kind: KIND.jupiter, name: '木星', e: Math.log10(2.1e36), val: '2.1×10³⁶', px: 70, cue: ['gbe', 4, '木星'] },
  { key: 'sun', kind: KIND.sun, name: '太阳', e: Math.log10(2.3e41), val: '2.3×10⁴¹', px: 84, cue: ['gbe', 4, '太阳'], glow: [1.6, 0.9, 0.4] },
  { key: 'wd', kind: KIND.wd, name: '白矮星 0.5 M☉', e: 43, val: '~10⁴³', px: 16, cue: ['gbe', 5, '半个太阳'], glow: [0.7, 0.85, 1.4] },
  { key: 'ns', kind: KIND.ns, name: '中子星', e: Math.log10(3e46), val: '~3×10⁴⁶', px: 10, cue: ['gbe', 5, '标准中子星'], glow: [0.6, 0.75, 1.6] },
];

export class Gbe {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.bg = new Background();
    this.st = new Stage(30);
    this.st.look(0, 0, 9, 0, 0, 0, 30);
    this.earthMat = planetMaterial(KIND.earth);
    this.earthMat.uniforms.uCore.value = 0.6;
    this.earth = new Shatter(fracture(spherePoly(1, 3), 46, 77, { radius: 0.97, sphere: true }), this.earthMat, {});
    this.atm = new THREE.Mesh(sphereGeometry(1.05, 64), atmosphereMaterial());
    this.earthRoot = new THREE.Group();
    this.earthRoot.add(this.earth.group, this.atm);
    this.st.scene.add(this.earthRoot);
    // wedge cells (front-right) for the cutaway
    this.wedge = this.earth.parts.map((P) => P.c.z > 0.12 && P.c.x > -0.05 && P.c.y > -0.35);
    this.icons = {};
    for (const b of BODIES) {
      if (b.key === 'earth') continue;
      const mat = planetMaterial(b.kind);
      const mesh = new THREE.Mesh(sphereGeometry(1, b.kind >= 4 ? 48 : 96), mat);
      const grp = new THREE.Group();
      grp.add(mesh);
      if (b.glow) {
        const gs = glowSprite(b.glow, 1, b.key === 'sun' ? 2.2 : 3.2);
        gs.scale.setScalar(b.key === 'sun' ? 1.7 : 4);
        grp.add(gs);
        b.gs = gs;
      }
      this.st.scene.add(grp);
      this.icons[b.key] = { grp, mesh, mat };
    }
    this.l = new Layer2D(0);
    this.g = new Layer2D(1);
  }
  render(t, rt) {
    const r = this.app.renderer;
    const st = this.st;
    const L = (i) => line('gbe', i);
    const l0 = L(0), l1 = L(1), l2 = L(2), l3 = L(3), l4 = L(4), l5 = L(5);
    this.bg.draw(r, rt, t, { poolX: 0.5, poolY: 0.5, grid: 0.7, tint: [0.92, 0.92, 1.08] });
    const u = st.unit(9);

    // ---- Earth: centre → drifts apart → rewinds (left) → cutaway → ladder slot
    const drift0 = cue('gbe', 1, '全部搬到') - 0.3;
    const rewind = ep(l2.t0 - 0.4, l2.t0 + 1.2, t, ease.inOutCubic);
    let tau = Math.max(0, t - drift0);
    tau = Math.min(tau, l2.t0 - 0.4 - drift0) * (1 - rewind);
    const toLadder = ep(l4.t0 - 0.6, l4.t0 + 0.8, t, ease.inOutCubic);
    const posA = st.place(960, 470, 9), posB = st.place(560, 480, 9), posC = st.place(lx(BODIES[1].e), 560, 9);
    const leftP = ep(l2.t0 - 0.3, l2.t0 + 1.2, t, ease.inOutCubic);
    const pos = posA.clone().lerp(posB, leftP).lerp(posC, toLadder);
    const rad = lerp(lerp(255, 230, leftP), BODIES[1].px, toLadder) * u;
    const inA = ep(l0.t0 - 0.4, l0.t0 + 1.4, t, ease.outCubic);
    this.earthRoot.position.copy(pos);
    this.earthRoot.position.z -= (1 - inA) * 8;
    this.earthRoot.scale.setScalar(rad);
    this.earthRoot.rotation.set(0.35, -0.5, 0);
    this.earth.set(tau, { mode: 'fly', power: 0.18, drag: 0.04, zs: 0.08 });
    // cutaway during line 3: lift the wedge cells outward
    const cut = ep(cue('gbe', 3, '真实的') - 0.5, cue('gbe', 3, '真实的') + 1.2, t, ease.inOutCubic) * (1 - toLadder);
    if (cut > 0) {
      this.earth.parts.forEach((P, i) => {
        if (!this.wedge[i]) return;
        P.m.position.addScaledVector(P.dir, cut * 0.5);
        P.m.visible = cut < 0.55;
      });
    } else this.earth.parts.forEach((P) => (P.m.visible = true));
    const eu = this.earthMat.uniforms;
    eu.uSpin.value = t * 0.03;
    eu.uCloudSpin.value = t * 0.004;
    eu.uSun.value.set(-1, 0.3, 0.7);
    eu.uTime.value = t;
    this.atm.material.uniforms.uSun.value.set(-1, 0.3, 0.7);
    this.atm.visible = tau < 0.05;
    this.atm.material.uniforms.uK.value = 1 - clamp(tau * 4);

    // ---- ladder icons
    const lad = ep(l4.t0 - 0.4, l4.t0 + 0.8, t);
    for (const b of BODIES) {
      if (b.key === 'earth') continue;
      const ic = this.icons[b.key];
      const at = cue(b.cue[0], b.cue[1], b.cue[2]) + (b.cue[3] || 0);
      const a = ep(at - 0.2, at + 0.7, t, ease.outBack) * lad;
      ic.grp.visible = a > 0.001;
      if (!ic.grp.visible) continue;
      ic.grp.position.copy(st.place(lx(b.e), 560, 9));
      ic.grp.scale.setScalar(b.px * u * Math.max(a, 0.001));
      ic.mesh.rotation.set(0.3, t * 0.2, 0);
      const mu = ic.mat.uniforms;
      mu.uSun.value.set(-1, 0.3, 0.7);
      mu.uTime.value = t;
      mu.uSpin.value = t * 0.05;
      mu.uAlpha.value = 1;
      if (b.gs) b.gs.material.uniforms.uK.value = clamp(a) * (b.key === 'sun' ? 0.45 : 1.2);
    }
    st.syncCam();
    st.render(r, rt);

    // ---- 2D
    const c = this.l.begin();
    const g = this.g.begin();
    c.save();
    c.globalAlpha = ep(l1.t0 - 0.2, l1.t0 + 0.6, t);
    c.font = font(F.serif, 44);
    c.fillStyle = C.ink;
    c.fillText('引力束缚能', 120, 178);
    c.font = font(F.monoB, 26);
    c.fillStyle = VI;
    c.fillText('J', 360, 178);
    c.font = font(F.sans, 20);
    c.fillStyle = C.dim;
    c.fillText('把一颗星球的全部物质搬到无穷远，至少要多少能量', 120, 216);
    c.restore();

    // line 1: arrows to infinity around the drifting Earth
    const inf = ep(drift0 + 0.3, drift0 + 1.6, t) * (1 - ep(l2.t0 - 0.6, l2.t0, t));
    if (inf > 0) {
      c.save();
      c.globalAlpha = inf;
      c.strokeStyle = c.fillStyle = rgba(VI, 0.9);
      c.lineWidth = 2;
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * TAU + 0.2;
        const d0 = 300 + ((t - drift0) * 40) % 60;
        arrow(c, 960 + Math.cos(a) * d0, 470 + Math.sin(a) * d0 * 0.8, 960 + Math.cos(a) * (d0 + 70), 470 + Math.sin(a) * (d0 + 70) * 0.8, 1, 11);
      }
      c.font = font(F.gro, 40);
      c.textAlign = 'center';
      c.fillText('∞', 1560, 300);
      c.fillText('∞', 360, 760);
      c.restore();
    }

    // line 2: the formula, term by term
    const fA = ep(l2.t0 + 0.2, l2.t0 + 1.0, t) * (1 - ep(l4.t0 - 0.6, l4.t0, t));
    if (fA > 0) this.formula(c, g, t, fA, ep(l3.t0 - 0.3, l3.t0 + 0.6, t, ease.inOutCubic));

    // line 3: numbers and the density profile
    const n1 = ep(cue('gbe', 3, '二点二四') - 0.1, cue('gbe', 3, '二点二四') + 0.6, t) * (1 - ep(l4.t0 - 0.6, l4.t0, t));
    if (n1 > 0) this.prem(c, t, n1);

    // lines 4–5: ladder
    if (lad > 0) this.ladder(c, g, t, lad);

    this.g.draw(r, rt, { boost: 1.6 });
    this.l.draw(r, rt);
    return { ledger: 3, bloom: 0.9, vig: 0.6, grain: 0.035, ca: 0.002 };
  }

  formula(c, g, t, a, up) {
    // typeset U = 3GM² / 5R ; terms light up as they are named
    const hl = (kw) => ep(cue('gbe', 2, kw) - 0.1, cue('gbe', 2, kw) + 0.4, t);
    const x = lerp(1080, 1080, up), y = lerp(470, 330, up);
    const s = lerp(1, 0.62, up);
    c.save();
    c.globalAlpha = a;
    c.translate(x, y);
    c.scale(s, s);
    c.textBaseline = 'alphabetic';
    c.font = font(F.serif, 96);
    c.fillStyle = C.ink;
    c.fillText('U =', 0, 30);
    const fx = 210;
    const term = (txt, px, py, k, size = 96, fam = F.serif) => {
      const h = k > 0 ? 1 : 0;
      c.font = font(fam, size);
      c.fillStyle = h ? (k > 0.01 ? VI : C.ink) : C.ink;
      c.fillText(txt, px, py);
      return c.measureText(txt).width;
    };
    // numerator 3 G M², denominator 5 R
    const k35 = hl('五分之三'), kG = hl('引力常数'), kM = hl('质量的平方'), kR = hl('半径');
    let px = fx + 10;
    px += term('3', px, -30, k35) + 18;
    px += term('G', px, -30, kG) + 8;
    const wm = term('M', px, -30, kM);
    term('2', px + wm + 4, -78, kM, 52);
    const numW = px + wm + 40 - fx;
    c.fillStyle = C.ink;
    c.fillRect(fx, 2, numW, 4);
    let dx = fx + numW / 2 - 70;
    dx += term('5', dx, 110, k35) + 18;
    term('R', dx, 110, kR);
    c.restore();
    // definitions under the formula
    const defs = [['G', '引力常数', kG], ['M', '质量', kM], ['R', '半径', kR]];
    c.save();
    c.globalAlpha = a * (1 - up);
    defs.forEach(([sym, txt, k], i) => {
      c.globalAlpha = a * (1 - up) * clamp(k * 2);
      tag(c, `${sym} · ${txt}`, 1090 + i * 190, 650, VI, 17, 'left', 2);
    });
    tag(c, '假设：均匀密度的球', 1090, 700, rgba(C.ink, 0.55 * clamp(k35 * 2) * (1 - up)), 15, 'left', 2);
    c.restore();
  }

  prem(c, t, a) {
    const v2 = ep(cue('gbe', 3, '是二点四九') - 0.1, cue('gbe', 3, '是二点四九') + 0.6, t);
    const pr = ep(cue('gbe', 3, '真实的') - 0.2, cue('gbe', 3, '真实的') + 1.6, t, ease.inOutCubic);
    c.save();
    c.globalAlpha = a;
    // the two numbers
    c.font = font(F.sansB, 40);
    c.fillStyle = C.ink;
    c.fillText('2.24×10³² J', 1080, 470);
    tag(c, '均匀球', 1080, 500, C.dim, 15, 'left', 2);
    if (v2 > 0) {
      c.globalAlpha = a * v2;
      c.fillStyle = VI;
      c.fillText('2.49×10³² J', 1420, 470);
      tag(c, '真实密度分布（PREM）', 1420, 500, VI, 15, 'left', 2);
      c.fillStyle = C.ink;
      arrow(c, 1340, 456, 1400, 456, v2, 10);
      c.font = font(F.sansB, 26);
      c.fillStyle = VI;
      c.fillText('+11 %', 1700, 430);
    }
    // density vs radius
    if (pr > 0) {
      const gx = 1080, gy = 860, gw = 640, gh = 300;
      const X = (km) => gx + (km / 6371) * gw, Y = (rho) => gy - (rho / 14) * gh;
      c.globalAlpha = a * pr;
      c.strokeStyle = C.faint;
      c.lineWidth = 1;
      ln(c, gx, gy, gx + gw, gy, 1);
      ln(c, gx, gy, gx, gy - gh, 1);
      tag(c, '密度 g/cm³', gx, gy - gh - 18, C.dim, 13, 'left', 1);
      tag(c, '半径 →', gx + gw, gy + 22, C.dim, 13, 'right', 1);
      for (const v of [5, 10]) tag(c, String(v), gx - 10, Y(v), C.dim, 12, 'right', 0);
      // uniform average
      c.setLineDash([5, 6]);
      c.strokeStyle = rgba(C.ink, 0.45);
      ln(c, gx, Y(5.51), gx + gw, Y(5.51), 1);
      c.setLineDash([]);
      tag(c, '均匀球 5.51', gx + gw - 4, Y(5.51) - 14, C.dim, 12, 'right', 1);
      c.strokeStyle = VI;
      c.lineWidth = 3;
      polyline(c, PREM.map(([km, rho]) => [X(km), Y(rho)]), pr);
      const lbl = [['内核', 600, 13.3], ['外核', 2350, 11.8], ['地幔', 4600, 5.6], ['壳', 6250, 3.6]];
      c.font = font(F.sans, 15);
      c.fillStyle = C.dim;
      c.textAlign = 'center';
      lbl.forEach(([s, km, rho]) => c.fillText(s, X(km), Y(rho) - 10));
    }
    c.restore();
  }

  ladder(c, g, t, a) {
    c.save();
    c.globalAlpha = a;
    c.strokeStyle = rgba(C.ink, 0.5);
    c.lineWidth = 1.5;
    ln(c, LX0, LY, LX1, LY, a);
    c.font = font(F.sans, 16);
    c.fillStyle = C.dim;
    c.textAlign = 'center';
    for (let e = LE0; e <= LE1; e++) {
      const x = lx(e);
      ln(c, x, LY, x, LY + (e % 5 === 0 ? 12 : 6), 1);
      if (e % 2 === 0 || e === LE1) c.fillText(`10${sup(e)}`, x, LY + 30);
    }
    tag(c, '焦耳 · 对数刻度（每格 ×10）· 图标不按比例', LX0, LY + 62, C.dim, 13, 'left', 2);
    for (const b of BODIES) {
      const at = cue(b.cue[0], b.cue[1], b.cue[2]) + (b.cue[3] || 0);
      const p = ep(at - 0.1, at + 0.6, t);
      if (p <= 0) continue;
      const x = lx(b.e);
      c.globalAlpha = a * p;
      c.fillStyle = VI;
      c.beginPath();
      c.arc(x, LY, 6, 0, TAU);
      c.fill();
      c.strokeStyle = rgba(VI, 0.5);
      c.lineWidth = 1;
      ln(c, x, LY - 8, x, 560 + b.px + 10, 1);
      c.font = font(F.sansB, 20);
      c.fillStyle = C.ink;
      c.textAlign = 'center';
      c.fillText(b.name, x, 560 - Math.max(b.px, 30) - 48);
      c.font = font(F.sansB, 18);
      c.fillStyle = VI;
      c.fillText(b.val, x, 560 - Math.max(b.px, 30) - 22);
    }
    // the Sun is centrally concentrated: the uniform sphere undercounts
    const sn = ep(cue('gbe', 4, '太阳') + 0.8, cue('gbe', 4, '太阳') + 1.6, t);
    if (sn > 0) tag(c, '均匀球估算', lx(Math.log10(2.3e41)), 800, rgba(C.ink, 0.5 * sn), 12, 'center', 1);
    // Sun → neutron star
    const k = ep(cue('gbe', 5, '十几万倍') - 0.2, cue('gbe', 5, '十几万倍') + 0.8, t);
    if (k > 0) {
      const x0 = lx(Math.log10(2.3e41)), x1 = lx(Math.log10(3e46));
      c.globalAlpha = a * k;
      c.strokeStyle = C.ink;
      c.lineWidth = 1.5;
      bracket(c, x0, x1, 360, -1, k, 12);
      c.font = font(F.serifH, 40);
      c.fillStyle = C.ink;
      c.textAlign = 'center';
      c.fillText('× 13 万', (x0 + x1) / 2, 336);
    }
    c.restore();
  }
}
