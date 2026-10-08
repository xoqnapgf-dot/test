// 02 TWO AXES — the verbs (碎 爆 粉碎 湮灭) answer two independent questions.
// Axis 1 (does the debris escape gravity?) is shown with two moons: one cracks in place, one is
// thrown apart. Axis 2 (how fine, which phase?) is a row of specimens from chunks to vapour.
// The last line returns to the matrix and adds up the bill for two examples.
import { Background, Layer2D, Stage, THREE } from './base.js';
import { cubePoly, spherePoly, fracture } from '../gfx/fracture.js';
import { Shatter } from '../gfx/shatter.js';
import { specimenMaterial } from '../gfx/specimen.js';
import { planetMaterial, KIND } from '../gfx/planet.js';
import { cue, line } from '../core/narr.js';
import { F, font, tracking } from '../core/type.js';
import { C, LEDGER, rgba } from '../core/style.js';
import { line as ln, arrow, bracket, polyline, tag } from '../gfx/draw.js';
import { clamp, ease, ep, lerp, hash1, TAU } from '../core/util.js';

const MX = 600, CW = 430, MY = 318, RH = 122;
const COLS = ['原地堆着', '抛散'];
const ROWS = ['大块', '粉末', '熔化', '汽化'];
// verb → matrix cell [col,row]
const VERBS = [['碎', 0, 0], ['爆', 1, 0], ['粉碎', 0, 1], ['湮灭', 1, 3]];
const cellX = (col) => MX + CW / 2 + col * CW;
const cellY = (row) => MY + RH / 2 + row * RH;
const STAGE_X = [420, 793, 1166, 1540];

export class Axes {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.bg = new Background();
    this.st = new Stage(30);
    this.st.look(0, 0, 9, 0, 0, 0, 30);
    // axis 1: two moons
    this.moonMat = planetMaterial(KIND.moon);
    this.moonMat.uniforms.uCore.value = 0.12;
    const mk = (seed) => new Shatter(fracture(spherePoly(1, 3), 34, seed, { radius: 0.95, sphere: true }), this.moonMat, {});
    this.moonA = mk(11);
    this.moonB = mk(23);
    this.st.scene.add(this.moonA.group, this.moonB.group);
    // axis 2: chunks → powder → melt → vapour
    this.sMats = [specimenMaterial(2, { scale: 1.4 }), specimenMaterial(2, { scale: 1.4 }), specimenMaterial(6, { scale: 1.6 }), specimenMaterial(6, { scale: 1.6 })];
    this.chunks = new Shatter(fracture(cubePoly(1), 7, 5, { radius: 0.5 }), this.sMats[0], {});
    this.powder = new Shatter(fracture(cubePoly(1), 90, 9, { radius: 0.5 }), this.sMats[1], {});
    this.meltGeo = new THREE.BoxGeometry(1, 1, 1, 24, 24, 24);
    this.prepBox(this.meltGeo);
    this.melt = new THREE.Mesh(this.meltGeo, this.sMats[2]);
    this.vapour = new THREE.Mesh(this.meltGeo, this.sMats[3]);
    this.sMats[3].side = THREE.DoubleSide;
    this.stageObjs = [this.chunks.group, this.powder.group, this.melt, this.vapour];
    for (const o of this.stageObjs) this.st.scene.add(o);
    this.l = new Layer2D(0);
    this.g = new Layer2D(1);
  }
  prepBox(g) {
    const pos = g.attributes.position;
    g.setAttribute('aP0', new THREE.Float32BufferAttribute(pos.array.slice(), 3));
    g.setAttribute('aInner', new THREE.Float32BufferAttribute(new Float32Array(pos.count), 1));
  }

  render(t, rt) {
    const r = this.app.renderer;
    const st = this.st;
    const L = (i) => line('axes', i);
    const l1 = L(1).t0, l2 = L(2).t0, l4 = L(4).t0, l5 = L(5).t0;
    this.bg.draw(r, rt, t, { poolX: 0.5, poolY: 0.48, grid: 0.9 });

    // ---- 3D: which group is on stage
    const moonsIn = ep(l2 - 0.3, l2 + 1.0, t) * (1 - ep(l4 - 0.5, l4 + 0.3, t));
    const stagesIn = ep(l4 - 0.2, l4 + 0.6, t) * (1 - ep(l5 - 0.4, l5 + 0.4, t));
    const crack = cue('axes', 2, '碎和裂'), boom = cue('axes', 2, '爆和毁');
    const u = st.unit(9);
    const pa = st.place(560, 440, 9), pb = st.place(1360, 440, 9);
    const R = 175 * u;
    this.moonA.group.visible = this.moonB.group.visible = moonsIn > 0.001;
    if (moonsIn > 0.001) {
      this.moonA.group.position.copy(pa);
      this.moonB.group.position.copy(pb);
      this.moonA.group.scale.setScalar(R * lerp(0.85, 1, moonsIn));
      this.moonB.group.scale.setScalar(R * lerp(0.85, 1, moonsIn));
      this.moonA.group.rotation.set(0.2, t * 0.05, 0);
      this.moonB.group.rotation.set(0.2, t * 0.05 + 2, 0);
      this.moonA.set(t - crack, { mode: 'crumble', open: 0.045 });
      this.moonB.set(t - boom, { mode: 'fly', power: 0.55, drag: 0.6, zs: 0.15 });
      const mu = this.moonMat.uniforms;
      mu.uSun.value.set(-0.6, 0.45, 0.7);
      mu.uTint.value.setScalar(moonsIn);
      mu.uAlpha.value = 1;
    }
    // axis-2 specimens
    const sCue = ['大块', '粉末', '熔化', '汽化'].map((k) => cue('axes', 4, k));
    const su = st.unit(9) * 150;
    this.stageObjs.forEach((o, k) => {
      const a = stagesIn * ep(sCue[k] - 0.25, sCue[k] + 0.5, t);
      o.visible = a > 0.001;
      if (!o.visible) return;
      o.position.copy(st.place(STAGE_X[k], 430, 9));
      o.rotation.set(0.45, -0.7 + t * 0.15, 0.1);
      o.scale.setScalar(su * lerp(0.7, 1, a));
      const m = this.sMats[k].uniforms;
      m.uTime.value = t;
      m.uAlpha.value = a;
    });
    const tk = t - sCue[0];
    this.chunks.set(tk + 0.3, { mode: 'crumble', open: 0.09 });
    this.powder.set(t - sCue[1] + 0.3, { mode: 'crumble', open: 0.22 });
    // melt: slumps and spreads while glowing
    const mt = clamp((t - sCue[2]) / 3);
    this.melt.scale.y *= lerp(1, 0.55, ease.inOutCubic(mt));
    this.melt.scale.x *= lerp(1, 1.18, mt);
    this.melt.scale.z *= lerp(1, 1.18, mt);
    this.sMats[2].uniforms.uHeat.value = 0.15 + 0.27 * mt;
    const vt = clamp((t - sCue[3]) / 3.5);
    this.sMats[3].uniforms.uHeat.value = 0.4;
    this.sMats[3].uniforms.uDissolve.value = 0.15 + 0.55 * vt;
    st.syncCam();
    st.render(r, rt);

    // ---- 2D
    const c = this.l.begin();
    const g = this.g.begin();
    // line 0: the verbs, then they fly into the matrix
    const toM = ep(l1 - 0.1, l1 + 1.0, t, ease.inOutCubic);
    const mA = clamp(ep(l1 - 0.2, l1 + 0.6, t) - ep(l2 - 0.4, l2 + 0.2, t)) + ep(l5 - 0.2, l5 + 0.6, t);
    const verbsA = 1 - ep(l2 - 0.4, l2 + 0.2, t) + ep(l5 - 0.2, l5 + 0.6, t) * 0.45;
    if (mA > 0.001) this.matrix(c, clamp(mA), t, l1);
    VERBS.forEach(([w, col, row], k) => {
      const at = cue('axes', 0, w);
      const a = ep(at - 0.05, at + 0.35, t) * clamp(verbsA);
      if (a <= 0) return;
      const x0 = 480 + k * 320, y0 = 480;
      const x = lerp(x0, cellX(col), toM), y = lerp(y0, cellY(row), toM);
      const size = lerp(118, 54, toM);
      c.save();
      c.globalAlpha = a;
      c.font = font(F.serifH, size);
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillStyle = C.ink;
      const pop = 1 + 0.12 * Math.exp(-Math.max(t - at, 0) * 6) * (t > at ? 1 : 0);
      c.translate(x, y + (1 - ep(at - 0.05, at + 0.35, t)) * 20);
      c.scale(pop, pop);
      c.fillText(w, 0, 0);
      c.restore();
    });

    // axis 1 captions under the moons
    if (moonsIn > 0.001) {
      c.save();
      c.globalAlpha = moonsIn;
      tag(c, '轴一 · 碎片有没有逃出引力', 960, 168, rgba(LEDGER[3].col, 0.95), 18, 'center', 4);
      const capA = ep(crack - 0.1, crack + 0.6, t), capB = ep(boom - 0.1, boom + 0.6, t);
      this.caption(c, 560, 690, '碎 · 裂', '断开，碎块还堆在原地', capA, C.ink);
      this.caption(c, 1360, 690, '爆 · 毁', '抛散，再也聚不回来', capB, C.ink);
      // the original outline of the exploded moon, for scale
      if (capB > 0) {
        c.strokeStyle = rgba(C.ink, 0.3 * capB);
        c.setLineDash([5, 7]);
        c.lineWidth = 1.2;
        c.beginPath();
        c.arc(1360, 440, 175, 0, TAU);
        c.stroke();
        c.setLineDash([]);
        c.fillStyle = rgba(LEDGER[3].col, 0.9 * capB);
        c.strokeStyle = rgba(LEDGER[3].col, 0.9 * capB);
        c.lineWidth = 2;
        for (let k = 0; k < 6; k++) {
          const ang = (k / 6) * TAU + 0.4;
          const d0 = 200 + ease.outCubic(clamp((t - boom) / 2)) * 40;
          arrow(c, 1360 + Math.cos(ang) * d0, 440 + Math.sin(ang) * d0, 1360 + Math.cos(ang) * (d0 + 50), 440 + Math.sin(ang) * (d0 + 50), capB, 10);
        }
      }
      // line 3: only meaningful at planetary scale; the gap between the two bills
      const sz = ep(cue('axes', 3, '六千公里') - 0.1, cue('axes', 3, '六千公里') + 0.6, t);
      if (sz > 0) {
        c.strokeStyle = rgba(C.ink, 0.6 * sz);
        c.lineWidth = 1.2;
        bracket(c, 385, 735, 250, -1, sz, 10);
        tag(c, 'Ø 6 000 km', 560, 228, rgba(C.ink, 0.8 * sz), 15, 'center', 2);
      }
      const gap = ep(cue('axes', 3, '碎它和爆它') - 0.1, cue('axes', 3, '碎它和爆它') + 0.9, t);
      if (gap > 0) {
        const y = 830;
        c.globalAlpha = moonsIn * gap;
        c.fillStyle = rgba(LEDGER[1].col, 0.9);
        c.fillRect(470, y - 9, 180 * ease.outCubic(gap), 18);
        c.fillStyle = rgba(LEDGER[3].col, 0.9);
        c.fillRect(1010, y - 9, 700 * ease.outCubic(gap), 18);
        tag(c, '断开结构', 470, y - 30, rgba(LEDGER[1].col, 1), 14, 'left', 2);
        tag(c, '克服整颗星球的引力', 1010, y - 30, rgba(LEDGER[3].col, 1), 14, 'left', 2);
        c.font = font(F.sansB, 26);
        c.fillStyle = C.ink;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText('≪', 830, y);
        tag(c, '差好几个数量级（示意）', 830, y + 34, C.dim, 13, 'center', 1);
      }
      c.restore();
    }

    // axis 2 row of specimens + cost staircase
    if (stagesIn > 0.001) {
      c.save();
      c.globalAlpha = stagesIn;
      tag(c, '轴二 · 碎得多细，有没有变成别的状态', 960, 168, rgba(LEDGER[2].col, 0.95), 18, 'center', 4);
      const stairs = ep(cue('axes', 4, '一级比一级贵') - 0.1, cue('axes', 4, '一级比一级贵') + 1.2, t);
      // four empty slots wait for the four states
      c.save();
      c.setLineDash([6, 8]);
      c.strokeStyle = rgba(C.ink, 0.45);
      c.lineWidth = 1.2;
      STAGE_X.forEach((x, k) => {
        const e = 1 - ep(sCue[k] - 0.3, sCue[k] + 0.3, t);
        if (e <= 0) return;
        c.globalAlpha = stagesIn * e;
        c.strokeRect(x - 110, 320, 220, 220);
        c.font = font(F.sansM, 24);
        c.fillStyle = rgba(C.ink, 0.5);
        c.textAlign = 'center';
        c.fillText(ROWS[k], x, 640);
      });
      c.restore();
      ROWS.forEach((name, k) => {
        const a = ep(sCue[k] - 0.1, sCue[k] + 0.5, t);
        if (a <= 0) return;
        c.globalAlpha = stagesIn * a;
        c.font = font(F.sansB, 30);
        c.fillStyle = C.ink;
        c.textAlign = 'center';
        c.fillText(name, STAGE_X[k], 640);
        if (k < 3) {
          c.fillStyle = C.dim;
          arrow(c, STAGE_X[k] + 120, 430, STAGE_X[k + 1] - 120, 430, ep(sCue[k + 1] - 0.4, sCue[k + 1] + 0.1, t), 10);
        }
        // the step: cost rises a grade each time
        const col = k < 2 ? LEDGER[1].col : LEDGER[2].col;
        const hgt = [26, 62, 112, 176][k];
        const p = clamp(stairs * 4 - k);
        if (p > 0) {
          c.fillStyle = rgba(col, 0.85);
          c.fillRect(STAGE_X[k] - 150, 860 - hgt * ease.outCubic(p), 300, hgt * ease.outCubic(p));
        }
      });
      c.globalAlpha = stagesIn * stairs;
      tag(c, '破碎比能', STAGE_X[0] - 150, 878, LEDGER[1].col, 13, 'left', 2);
      tag(c, '相变能量', STAGE_X[2] - 150, 878, LEDGER[2].col, 13, 'left', 2);
      tag(c, '贵 ↑', STAGE_X[3] + 160, 690, C.dim, 15, 'left', 2);
      c.restore();
      // vapour wisps off the last specimen
      const vt = clamp((t - sCue[3]) / 3.5);
      if (vt > 0) {
        g.save();
        g.globalAlpha = stagesIn * vt;
        g.strokeStyle = 'rgba(255,170,110,0.55)';
        g.lineWidth = 2;
        for (let k = 0; k < 6; k++) {
          const pts = [];
          const bx = STAGE_X[3] - 60 + k * 24;
          for (let j = 0; j < 16; j++) pts.push([bx + Math.sin(j * 0.7 + t * 3 + k) * (4 + j), 360 - j * 9 - ((t * 30 + k * 17) % 20)]);
          polyline(g, pts, 1);
        }
        g.restore();
      }
    }

    // line 5: add up the bill on the matrix
    if (t > l5 - 0.2) this.examples(c, t);

    this.g.draw(r, rt, { boost: 1.6 });
    this.l.draw(r, rt);
    let led = -1;
    if (t >= l2 - 0.3) led = 3;
    if (t >= l4 - 0.3) led = [1, 2];
    if (t >= l5 - 0.3) led = [1, 2, 3];
    return { ledger: led, bloom: 0.7, vig: 0.65, grain: 0.035, ca: 0.002 };
  }

  caption(c, x, y, big, small, a, col) {
    if (a <= 0) return;
    c.save();
    c.globalAlpha *= a;
    c.textAlign = 'center';
    c.font = font(F.serifH, 46);
    c.fillStyle = col;
    c.fillText(big, x, y + (1 - a) * 14);
    c.font = font(F.sans, 22);
    c.fillStyle = C.dim;
    c.fillText(small, x, y + 40);
    c.restore();
  }

  matrix(c, a, t, t0) {
    c.save();
    c.globalAlpha = a;
    const p = ep(t0 - 0.1, t0 + 0.9, t, ease.inOutCubic);
    c.strokeStyle = C.faint;
    c.lineWidth = 1;
    for (let k = 0; k <= 4; k++) ln(c, MX, MY + k * RH, MX + 2 * CW, MY + k * RH, p);
    for (let k = 0; k <= 2; k++) ln(c, MX + k * CW, MY, MX + k * CW, MY + 4 * RH, p);
    // axis headings
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = font(F.sansM, 22);
    c.fillStyle = LEDGER[3].col;
    COLS.forEach((s, k) => c.fillText(s, cellX(k), MY - 28));
    tag(c, '轴一 · 碎片逃出引力了吗 →', MX + CW, MY - 72, rgba(LEDGER[3].col, 0.8), 15, 'center', 3);
    c.font = font(F.sansM, 22);
    ROWS.forEach((s, k) => {
      c.fillStyle = k < 2 ? LEDGER[1].col : LEDGER[2].col;
      c.textAlign = 'right';
      c.fillText(s, MX - 24, cellY(k));
    });
    c.save();
    c.translate(MX - 130, MY + 2 * RH);
    c.rotate(-Math.PI / 2);
    tag(c, '轴二 · 碎得多细 →', 0, 0, rgba(LEDGER[2].col, 0.8), 15, 'center', 3);
    c.restore();
    c.restore();
  }

  examples(c, t) {
    const eA = cue('axes', 5, '爆炸并且'), eB = cue('axes', 5, '原地碎成粉');
    const pA = ep(eA - 0.1, eA + 1.2, t, ease.inOutCubic), pB = ep(eB - 0.1, eB + 1.0, t, ease.inOutCubic);
    const fadeA = 1 - ep(eB - 0.3, eB + 0.3, t) * 0.65;
    const sum = ep(line('axes', 5).t0 - 0.1, line('axes', 5).t0 + 0.8, t);
    c.save();
    c.globalAlpha = sum;
    c.font = font(F.serif, 30);
    c.fillStyle = C.ink;
    c.textAlign = 'center';
    c.fillText('两轴分开判断，再相加', 960, 200);
    c.restore();
    const ox = cellX(0) - 150, oy = cellY(0) + 44;
    // example A: thrown apart AND ground to dust — both bills
    if (pA > 0) {
      c.save();
      c.globalAlpha = fadeA;
      c.lineWidth = 3;
      c.strokeStyle = c.fillStyle = LEDGER[3].col;
      arrow(c, ox, oy, cellX(1) - 60, oy, clamp(pA * 2), 14);
      c.strokeStyle = c.fillStyle = LEDGER[1].col;
      arrow(c, cellX(1) - 60, oy, cellX(1) - 60, cellY(1) + 10, clamp(pA * 2 - 1), 14);
      this.chip(c, cellX(1) + 70, cellY(1) + 2, '爆炸 + 粉碎成尘', '第一笔 + 第二笔', clamp(pA * 2 - 1.2), LEDGER[3].col);
      c.restore();
    }
    // example B: crumbled to powder where it stands — only the second bill
    if (pB > 0) {
      c.save();
      c.lineWidth = 3;
      c.strokeStyle = c.fillStyle = LEDGER[1].col;
      arrow(c, ox, oy, ox, cellY(1) + 20, pB, 14);
      this.chip(c, cellX(0) + 40, cellY(1) + 2, '原地碎成粉', '只算第二笔', clamp(pB * 1.6 - 0.5), LEDGER[1].col);
      c.restore();
    }
  }

  chip(c, x, y, a1, a2, p, col) {
    if (p <= 0) return;
    c.save();
    c.globalAlpha *= p;
    c.fillStyle = 'rgba(12,14,19,0.92)';
    c.fillRect(x - 120, y - 40, 240, 80);
    c.strokeStyle = rgba(col, 0.8);
    c.lineWidth = 1.5;
    c.strokeRect(x - 120, y - 40, 240, 80);
    c.textAlign = 'center';
    c.font = font(F.sansB, 24);
    c.fillStyle = C.ink;
    c.fillText(a1, x, y - 6);
    tag(c, a2, x, y + 22, col, 14, 'center', 2);
    c.restore();
  }
}
