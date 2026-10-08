// END — the numbers come from five fields with no shared table; next time, ask which quantity.
// The cold-open block reassembles behind the final question, then the end card with credits.
import { Background, Layer2D, Stage, THREE } from './base.js';
import { cubePoly, fracture } from '../gfx/fracture.js';
import { Shatter } from '../gfx/shatter.js';
import { specimenMaterial } from '../gfx/specimen.js';
import { planetMaterial, atmosphereMaterial, sphereGeometry, KIND } from '../gfx/planet.js';
import { cue, line, TOTAL } from '../core/narr.js';
import { F, font, tracking } from '../core/type.js';
import { C, LEDGER, rgba } from '../core/style.js';
import { line as ln, tag } from '../gfx/draw.js';
import { clamp, ease, ep, lerp, hash1, TAU } from '../core/util.js';

const FIELDS = [
  { kw: '爆破工程', name: '爆破工程', x: 380, y: 360, led: 1 },
  { kw: '材料科学', name: '材料科学', x: 820, y: 300, led: 0 },
  { kw: '热力学', name: '热力学', x: 1280, y: 380, led: 2 },
  { kw: '天体物理', name: '天体物理', x: 600, y: 640, led: 3 },
  { kw: '行星撞击', name: '行星撞击研究', x: 1180, y: 660, led: 4 },
];
const VERBS = [['打碎', [0, 1]], ['蒸发', [2]], ['毁灭', [3, 4]]];
const CREDITS = [
  '数据　Wikipedia「Gravitational binding energy」（PREM 积分）· Nie et al., Nat. Commun. 10, 5533 (2019) · Goldblatt et al., Nat. Geosci. (2013)',
  '　　　GBU-57：美国空军 · Janes（经 BBC）· GlobalSecurity.org　·　破碎比能为爆破工程经验值',
  '图像　行星纹理 Solar System Scope（CC BY 4.0）· Tycho 遗迹 NASA/ESA, Chandra, P. Ruiz-Lapuente',
  '声音　配音 Microsoft Edge 神经语音（云扬）· 配乐与音效为程序生成',
  '字体　Noto Sans SC / Noto Serif SC · JetBrains Mono · Space Grotesk（OFL）· 实时渲染 three.js',
];

export class End {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.bg = new Background();
    this.st = new Stage(30);
    this.mat = specimenMaterial(0, { scale: 1.6 });
    this.block = new Shatter(fracture(cubePoly(1), 38, 7, { radius: 0.5, impact: new THREE.Vector3(0.45, 0.35, 0.45) }), this.mat, {
      impact: new THREE.Vector3(0.6, 0.45, 0.6),
    });
    this.blockRoot = new THREE.Group();
    this.blockRoot.add(this.block.group);
    this.earthMat = planetMaterial(KIND.earth);
    this.earth = new THREE.Mesh(sphereGeometry(1, 96), this.earthMat);
    this.atm = new THREE.Mesh(sphereGeometry(1.06, 64), atmosphereMaterial());
    this.earthRoot = new THREE.Group();
    this.earthRoot.add(this.earth, this.atm);
    this.st.scene.add(this.blockRoot, this.earthRoot);
    this.l = new Layer2D(0);
    this.g = new Layer2D(1);
  }
  render(t, rt) {
    const r = this.app.renderer;
    const st = this.st;
    const l0 = line('end', 0), l1 = line('end', 1);
    const card = l1.t1 + 0.6;
    this.bg.draw(r, rt, t, { poolX: 0.5, poolY: 0.5, grid: lerp(0.8, 0.3, ep(card, card + 2, t)) });
    // 3D bookend: the block reassembles, the Earth turns
    const show = ep(l1.t0 - 0.3, l1.t0 + 1.5, t) * (1 - ep(card - 0.2, card + 1.2, t) * 0.8);
    this.blockRoot.visible = this.earthRoot.visible = show > 0.001;
    st.look(0, 0.25, 7.2, 0, 0, 0, 30);
    const back = ep(l1.t0, l1.t0 + 5, t, ease.inOutCubic);
    this.blockRoot.position.set(-2.9, 0.15, -1);
    this.blockRoot.rotation.set(0.42, -0.6 + t * 0.12, 0.08);
    this.blockRoot.scale.setScalar(0.8);
    this.block.set(2.5 * (1 - back), { mode: 'fly', power: 0.9, drag: 2.4 });
    this.mat.uniforms.uAlpha.value = show * 0.4;
    this.earthRoot.position.set(2.9, 0.15, -1);
    this.earthRoot.scale.setScalar(1.0);
    this.earth.rotation.y = t * 0.04;
    this.earthMat.uniforms.uTint.value.setScalar(show * 0.3);
    this.earthMat.uniforms.uCloudSpin.value = t * 0.006;
    this.atm.material.uniforms.uK.value = show * 0.3;
    st.syncCam();
    st.render(r, rt);

    const c = this.l.begin();
    const g = this.g.begin();
    // line 0: five fields, no common table
    const fa = 1 - ep(l1.t0 - 0.4, l1.t0 + 0.3, t);
    if (fa > 0) {
      FIELDS.forEach((f, k) => {
        const at = cue('end', 0, f.kw);
        const p = ep(at - 0.1, at + 0.6, t);
        if (p <= 0) return;
        const col = LEDGER[f.led].col;
        const dx = Math.sin(t * 0.4 + k * 1.7) * 10, dy = Math.cos(t * 0.33 + k) * 8;
        c.save();
        c.globalAlpha = p * fa;
        c.translate(f.x + dx, f.y + dy);
        c.fillStyle = 'rgba(14,16,21,0.85)';
        c.fillRect(-150, -50, 300, 100);
        c.strokeStyle = rgba(col, 0.7);
        c.strokeRect(-150, -50, 300, 100);
        c.fillStyle = col;
        c.fillRect(-150, -50, 4, 100);
        c.font = font(F.sansB, 28);
        c.fillStyle = C.ink;
        c.textAlign = 'center';
        c.fillText(f.name, 0, 4);
        // its own error bars
        const eb = ep(cue('end', 0, '各有误差') - 0.1, cue('end', 0, '各有误差') + 0.5, t);
        if (eb > 0) {
          c.globalAlpha = p * fa * eb;
          c.strokeStyle = col;
          c.lineWidth = 2;
          const w = 40 + hash1(k * 5) * 70;
          ln(c, -w, 32, w, 32, 1);
          ln(c, -w, 24, -w, 40, 1);
          ln(c, w, 24, w, 40, 1);
        }
        c.restore();
      });
      const nt = ep(cue('end', 0, '没有一张表') - 0.2, cue('end', 0, '没有一张表') + 0.6, t);
      if (nt > 0) {
        c.save();
        c.globalAlpha = nt * fa;
        c.setLineDash([8, 8]);
        c.strokeStyle = rgba(C.ink, 0.35);
        c.lineWidth = 1.5;
        c.strokeRect(1460, 470, 300, 200);
        for (let k = 1; k < 4; k++) ln(c, 1460, 470 + k * 50, 1760, 470 + k * 50, 1);
        c.setLineDash([]);
        c.font = font(F.serifH, 80);
        c.fillStyle = C.warn;
        c.textAlign = 'center';
        c.fillText('?', 1610, 600);
        tag(c, '没有一张总表', 1610, 700, C.dim, 15, 'center', 3);
        c.restore();
      }
    }
    // line 1: the verbs map onto ledgers, then the question
    const q = ep(cue('end', 1, '先问清楚') - 0.1, cue('end', 1, '先问清楚') + 0.8, t) * (1 - ep(card - 0.2, card + 0.8, t));
    const va = ep(l1.t0 - 0.1, l1.t0 + 0.4, t) * (1 - ep(card - 0.2, card + 0.8, t));
    if (va > 0) {
      VERBS.forEach(([w, leds], k) => {
        const at = cue('end', 1, w);
        const p = ep(at - 0.1, at + 0.5, t);
        if (p <= 0) return;
        const x = 660 + k * 300;
        c.save();
        c.globalAlpha = p * va * (1 - q * 0.6);
        c.font = font(F.serifH, 84);
        c.fillStyle = C.ink;
        c.textAlign = 'center';
        c.fillText(w, x, 380);
        // which ledgers this word might mean
        leds.forEach((li, j) => {
          const L = LEDGER[li];
          const pp = ep(at + 0.3 + j * 0.15, at + 0.9 + j * 0.15, t);
          c.globalAlpha = p * va * pp * (1 - q * 0.6);
          tag(c, `${L.name} ${L.unit}`, x, 432 + j * 30, L.col, 16, 'center', 2);
        });
        c.restore();
      });
    }
    if (q > 0) {
      c.save();
      c.globalAlpha = q;
      c.textAlign = 'center';
      c.font = font(F.serifH, 72);
      c.fillStyle = C.ink;
      c.fillText('问的是哪一种量？', 960, 640);
      for (let k = 0; k < 5; k++) {
        c.strokeStyle = LEDGER[k].col;
        c.lineWidth = 3;
        const p = ep(cue('end', 1, '先问清楚') + 0.3 + k * 0.1, cue('end', 1, '先问清楚') + 1.0 + k * 0.1, t, ease.inOutCubic);
        ln(c, 960 - 300 + k * 124, 690, 960 - 300 + k * 124 + 104, 690, p);
      }
      c.restore();
    }
    // end card
    const ec = ep(card, card + 1.2, t);
    if (ec > 0) {
      c.save();
      c.globalAlpha = ec;
      c.textAlign = 'center';
      c.font = font(F.serifH, 110);
      c.fillStyle = C.ink;
      tracking(c, 10);
      c.fillText('破坏的账本', 966, 400);
      tracking(c, 0);
      for (let k = 0; k < 5; k++) {
        const L = LEDGER[k];
        const x = 960 - 440 + k * 176;
        c.fillStyle = L.col;
        c.fillRect(x, 450, 156, 3);
        c.font = font(F.sansM, 18);
        c.fillText(L.name, x + 78, 486);
        tag(c, L.unit, x + 78, 512, rgba(L.col, 0.8), 13, 'center', 1);
      }
      c.textAlign = 'left';
      CREDITS.forEach((s, k) => {
        c.globalAlpha = ec * ep(card + 0.6 + k * 0.15, card + 1.4 + k * 0.15, t);
        c.font = font(F.sans, 16);
        c.fillStyle = rgba(C.ink, 0.5);
        c.fillText(s, 230, 640 + k * 34);
      });
      c.restore();
    }
    this.g.draw(r, rt, { boost: 1.5 });
    this.l.draw(r, rt);
    const out = ep(TOTAL - 1.2, TOTAL, t);
    return { ledger: t > card ? [0, 1, 2, 3, 4] : -1, hud: 1 - ec, subs: 1, bloom: 0.7, vig: 0.65, grain: 0.035, ca: 0.0015, exposure: 1 - out };
  }
}
