// 03 FRAGMENTATION — five specimens, each breaks the moment its number is spoken and its bar
// grows on a linear scale (so the 1 200 J/cc of steel-fibre concrete towers over the rest).
// Then the axis bends into a log scale to make room for the honest part: field values float
// by several times, so every bar grows a band.
import { Background, Layer2D, Stage, THREE } from './base.js';
import { cubePoly, fracture } from '../gfx/fracture.js';
import { Shatter } from '../gfx/shatter.js';
import { specimenMaterial } from '../gfx/specimen.js';
import { cue, line } from '../core/narr.js';
import { F, font, tracking } from '../core/type.js';
import { C, LEDGER, rgba } from '../core/style.js';
import { line as ln, tag, strike } from '../gfx/draw.js';
import { clamp, ease, ep, lerp } from '../core/util.js';

const AMB = LEDGER[1].col;
const ROWS = [
  { kind: 0, name: '普通混凝土', sub: 'C25–C30', v: 40, txt: '≈ 40', kw: '四十焦' },
  { kind: 1, name: '一般岩石', sub: '石灰岩 · 砂岩', v: 60, txt: '≈ 60', kw: '六十焦' },
  { kind: 2, name: '花岗岩', sub: '致密结晶岩', v: 100, txt: '≥ 100', kw: '一百焦' },
  { kind: 4, name: '高强混凝土', sub: '70 MPa', v: 300, txt: '≥ 300', kw: '三百焦' },
  { kind: 5, name: '钢纤维混凝土', sub: '军用防护', v: 1200, txt: '≈ 1 200', kw: '一千二百焦' },
];
const Y0 = 296, DY = 116, BX = 720, BW = 1060;
const yOf = (k) => Y0 + k * DY;
// x position of a value: linear (m=0) → log 10…10 000 (m=1)
const xOf = (v, m) => BX + lerp((v / 1300) * BW, ((Math.log10(Math.max(v, 1)) - 1) / 3) * BW, m);

export class Frag {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.bg = new Background();
    this.st = new Stage(30);
    this.st.look(0, 0, 9, 0, 0, 0, 30);
    this.items = ROWS.map((row, k) => {
      const mat = specimenMaterial(row.kind, { scale: 1.5 });
      const sh = new Shatter(fracture(cubePoly(1), 16, 31 + k * 7, { radius: 0.5, impact: new THREE.Vector3(0.5, 0.4, 0.5) }), mat, {
        impact: new THREE.Vector3(0.6, 0.5, 0.6),
      });
      this.st.scene.add(sh.group);
      return { mat, sh };
    });
    this.l = new Layer2D(0);
    this.g = new Layer2D(1);
  }
  render(t, rt) {
    const r = this.app.renderer;
    const st = this.st;
    const l0 = line('frag', 0), l1 = line('frag', 1), l2 = line('frag', 2);
    this.bg.draw(r, rt, t, { poolX: 0.32, poolY: 0.5, grid: 0.85, warm: 0.25 });
    const hits = ROWS.map((row) => cue('frag', 1, row.kw));
    const u = st.unit(9);
    this.items.forEach((it, k) => {
      const a = ep(l0.t0 - 0.2 + k * 0.12, l0.t0 + 0.8 + k * 0.12, t);
      it.sh.group.visible = a > 0.001;
      it.sh.group.position.copy(st.place(232, yOf(k), 9));
      it.sh.group.scale.setScalar(u * 76 * lerp(0.6, 1, a));
      it.sh.group.rotation.set(0.5, -0.6 + t * 0.2 + k, 0.12);
      const tau = t - hits[k];
      it.sh.set(tau, { mode: 'fly', power: 0.32, drag: 2.6, zs: 0.3, shake: tau > -0.3 && tau < 0 ? 0.006 : 0 });
      const m = it.mat.uniforms;
      m.uCrack.value = tau > 0 ? Math.exp(-tau * 3.5) * 0.5 : 0;
      m.uTime.value = t;
      m.uAlpha.value = a;
    });
    st.syncCam();
    st.render(r, rt);

    const c = this.l.begin();
    const g = this.g.begin();
    const head = ep(l0.t0 - 0.2, l0.t0 + 0.6, t);
    c.save();
    c.globalAlpha = head;
    c.font = font(F.serif, 44);
    c.fillStyle = C.ink;
    c.fillText('破碎比能', 120, 178);
    c.font = font(F.monoB, 26);
    c.fillStyle = AMB;
    c.fillText('J/cc', 330, 178);
    c.font = font(F.sans, 20);
    c.fillStyle = C.dim;
    c.fillText('把 1 cm³ 材料打碎所需的能量（爆破经验值）', 120, 216);
    c.restore();

    const m = ep(l2.t0 - 0.1, l2.t0 + 1.4, t, ease.inOutCubic);
    // axis
    const ax = ep(l1.t0 - 0.3, l1.t0 + 0.6, t);
    if (ax > 0) {
      const yA = yOf(4) + 72;
      c.save();
      c.globalAlpha = ax;
      c.strokeStyle = C.faint;
      c.lineWidth = 1;
      ln(c, BX, yA, BX + BW, yA, ax);
      c.font = font(F.mono, 14);
      c.textAlign = 'center';
      c.fillStyle = C.dim;
      for (const v of [0, 300, 600, 900, 1200]) {
        c.globalAlpha = ax * (1 - m);
        const x = BX + (v / 1300) * BW;
        ln(c, x, yA, x, yA + 8, 1);
        c.fillText(String(v), x, yA + 24);
      }
      for (const v of [10, 100, 1000, 10000]) {
        c.globalAlpha = ax * m;
        const x = xOf(v, 1);
        ln(c, x, yA, x, yA + 8, 1);
        c.fillText(v.toLocaleString('en-US'), x, yA + 24);
      }
      c.globalAlpha = ax;
      c.textAlign = 'right';
      c.fillText(m > 0.5 ? 'J/cc · 对数刻度' : 'J/cc · 线性刻度', BX + BW, yA + 50);
      // gridlines
      c.strokeStyle = C.grid;
      for (const v of [10, 100, 1000, 10000]) {
        c.globalAlpha = ax * m;
        const x = xOf(v, 1);
        ln(c, x, Y0 - 50, x, yA, 1);
      }
      c.restore();
    }

    ROWS.forEach((row, k) => {
      const y = yOf(k);
      const a = ep(l0.t0 + k * 0.12, l0.t0 + 0.8 + k * 0.12, t);
      if (a <= 0) return;
      const hit = hits[k];
      const live = t >= hit - 0.2 && t < (k < 4 ? hits[k + 1] - 0.2 : l2.t0);
      c.save();
      c.globalAlpha = a;
      c.font = font(F.sansB, 26);
      c.fillStyle = live ? C.ink : rgba(C.ink, 0.82);
      c.textBaseline = 'middle';
      c.fillText(row.name, 330, y - 12);
      tag(c, row.sub, 330, y + 20, C.dim, 14, 'left', 1);
      // bar
      const p = ep(hit, hit + 0.9, t, ease.outQuart);
      if (p > 0) {
        const x1 = xOf(row.v, m);
        const w = (x1 - BX) * p;
        c.fillStyle = rgba(AMB, live ? 1 : 0.78);
        c.fillRect(BX, y - 14, Math.max(w, 2), 28);
        if (live) {
          g.fillStyle = rgba(AMB, 0.5);
          g.fillRect(BX, y - 14, Math.max(w, 2), 28);
        }
        // value counts up with the bar
        const shown = Math.round(row.v * p);
        c.font = font(F.monoB, 24);
        c.fillStyle = C.ink;
        const label = p < 1 ? String(shown) : row.txt;
        c.fillText(label, BX + Math.max(w, 2) + 16, y + 1);
        // uncertainty band (line 2): several-fold spread either way
        const band = ep(cue('frag', 2, '浮动好几倍') - 0.3 + k * 0.08, cue('frag', 2, '浮动好几倍') + 0.6 + k * 0.08, t);
        if (band > 0) {
          const xa = xOf(row.v / 3, 1), xb = xOf(row.v * 3, 1);
          const xm = xOf(row.v, 1);
          c.globalAlpha = a * band;
          c.fillStyle = rgba(AMB, 0.18);
          c.fillRect(lerp(xm, xa, band), y - 24, lerp(0, xb - xa, band), 48);
          c.strokeStyle = rgba(AMB, 0.9);
          c.lineWidth = 1.5;
          ln(c, lerp(xm, xa, band), y - 24, lerp(xm, xa, band), y + 24, 1);
          ln(c, lerp(xm, xb, band), y - 24, lerp(xm, xb, band), y + 24, 1);
        }
      }
      c.restore();
    });

    // line 2: what moves the number, and the verdict
    const why = ep(cue('frag', 2, '裂隙') - 0.2, cue('frag', 2, '裂隙') + 0.5, t);
    if (why > 0) {
      const words = ['裂隙', '炸药耦合', '自由面'];
      words.forEach((w, k) => {
        const at = cue('frag', 2, w);
        const a = ep(at - 0.1, at + 0.4, t);
        c.save();
        c.globalAlpha = a * (1 - ep(cue('frag', 2, '它是参照') - 0.4, cue('frag', 2, '它是参照'), t));
        c.font = font(F.sansM, 22);
        c.fillStyle = C.ink;
        c.textAlign = 'left';
        const x = 1180 + k * 190;
        c.fillText(w, x, 196);
        c.fillStyle = AMB;
        c.fillRect(x, 208, c.measureText(w).width * a, 2);
        c.restore();
      });
      tag(c, '× ⅓ … × 3', 1180, 238, rgba(AMB, why * (1 - ep(cue('frag', 2, '它是参照') - 0.4, cue('frag', 2, '它是参照'), t))), 15, 'left', 2);
    }
    const verdict = ep(cue('frag', 2, '它是参照') - 0.1, cue('frag', 2, '它是参照') + 0.6, t);
    if (verdict > 0) {
      c.save();
      c.globalAlpha = verdict;
      c.translate(1450, 214);
      c.rotate(-0.04);
      c.strokeStyle = rgba(C.warn, 0.9);
      c.lineWidth = 2.5;
      const s = lerp(1.3, 1, ease.outBack(verdict));
      c.scale(s, s);
      c.strokeRect(-230, -34, 460, 68);
      c.font = font(F.sansB, 30);
      c.fillStyle = C.warn;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      tracking(c, 4);
      c.fillText('参照  ≠  物理常数', 0, 2);
      c.restore();
    }
    this.g.draw(r, rt, { boost: 1.6 });
    this.l.draw(r, rt);
    return { ledger: 1, bloom: 0.75, vig: 0.65, grain: 0.035, ca: 0.002 };
  }
}
