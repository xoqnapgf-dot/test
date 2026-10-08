// 04 STRENGTH — a threshold, not a price. Two granite blocks: one squeezed (holds to ~175 MPa),
// one pulled (snaps after a couple of tens of MPa). Then a log ladder of tensile strength up to
// the 2019 diamond nanoneedle (125 GPa) and graphene (~130 GPa), and the blank region beyond.
import { Background, Layer2D, Stage, THREE } from './base.js';
import { cubePoly, fracture } from '../gfx/fracture.js';
import { Shatter } from '../gfx/shatter.js';
import { specimenMaterial, diamondGeometry } from '../gfx/specimen.js';
import { cue, line } from '../core/narr.js';
import { F, font, tracking } from '../core/type.js';
import { C, LEDGER, rgba } from '../core/style.js';
import { line as ln, arrow, tag, polyline } from '../gfx/draw.js';
import { clamp, ease, ep, lerp, TAU } from '../core/util.js';

const CY = LEDGER[0].col;
// tensile-strength ladder (MPa); [lo, hi] spans are drawn as bands
const LADDER = [
  { name: '混凝土', v: [2, 5], at: 0 },
  { name: '花岗岩', v: [5, 25], at: 0 },
  { name: '结构钢', v: [400, 630], at: 0 },
  { name: '高强钢丝', v: [1800, 3000], at: 0 },
  { name: '碳纤维', v: [3500, 7000], at: 0 },
  { name: '金刚石纳米针', v: [125000, 125000], at: 1, big: '125 GPa' },
  { name: '石墨烯', v: [130000, 130000], at: 2, big: '≈130 GPa' },
];
const AX0 = 200, AX1 = 1720, E0 = 0, E1 = 6;
const xOfE = (e) => lerp(AX0, AX1, (e - E0) / (E1 - E0));
const xOf = (v) => xOfE(Math.log10(v));
const AY = 640;

export class Strength {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.bg = new Background();
    this.st = new Stage(30);
    this.st.look(0, 0, 9, 0, 0, 0, 30);
    this.matA = specimenMaterial(2, { scale: 1.3 });
    this.matB = specimenMaterial(2, { scale: 1.3 });
    const box = cubePoly(1).map((f) => ({ pts: f.pts.map((p) => p.clone().multiply(new THREE.Vector3(0.8, 1.25, 0.8))), inner: false }));
    this.blockA = new Shatter(fracture(box, 1, 3, {}), this.matA, {});
    this.blockB = new Shatter(
      fracture(box, 2, 5, { points: [new THREE.Vector3(0.04, 0.2, 0), new THREE.Vector3(-0.05, -0.2, 0.03)] }),
      this.matB, {}
    );
    this.diamond = new THREE.Mesh(diamondGeometry(1), specimenMaterial(7));
    this.st.scene.add(this.blockA.group, this.blockB.group, this.diamond);
    this.l = new Layer2D(0);
    this.g = new Layer2D(1);
  }
  render(t, rt) {
    const r = this.app.renderer;
    const st = this.st;
    const L = (i) => line('strength', i);
    const l0 = L(0), l2 = L(2), l3 = L(3);
    this.bg.draw(r, rt, t, { poolX: 0.5, poolY: 0.45, grid: 0.9 });

    const blocks = ep(l0.t0 - 0.3, l0.t0 + 0.7, t) * (1 - ep(l2.t0 - 0.4, l2.t0 + 0.4, t));
    const press = cue('strength', 0, '一百七十'), pull = cue('strength', 0, '被拉扯'), snap = cue('strength', 0, '断了');
    const u = st.unit(9);
    const loadA = ep(press - 0.4, press + 2.2, t, ease.inOutCubic);
    this.blockA.group.visible = this.blockB.group.visible = blocks > 0.001;
    this.blockA.group.position.copy(st.place(600, 450, 9));
    this.blockB.group.position.copy(st.place(1320, 450, 9));
    for (const b of [this.blockA, this.blockB]) {
      b.group.scale.setScalar(u * 190);
      b.group.rotation.set(0.32, -0.55 + Math.sin(t * 0.3) * 0.08, 0);
    }
    this.blockA.group.scale.y *= 1 - loadA * 0.035;
    this.blockA.set(-1, {});
    this.blockB.set((t - snap) * 1.0, { mode: 'fly', power: 0.3, drag: 2.4, shake: t > pull && t < snap ? 0.004 : 0 });
    for (const m of [this.matA, this.matB]) {
      m.uniforms.uAlpha.value = blocks;
      m.uniforms.uTime.value = t;
    }
    this.matB.uniforms.uCrack.value = t > snap ? Math.exp(-(t - snap) * 3) * 0.6 : 0;
    // diamond
    const dIn = ep(cue('strength', 2, '金刚石') - 0.3, cue('strength', 2, '金刚石') + 1.0, t);
    this.diamond.visible = dIn > 0.001;
    this.diamond.position.copy(st.place(xOf(125000) - 60, 340, 9));
    this.diamond.scale.setScalar(u * 118 * lerp(0.5, 1, ease.outBack(dIn)));
    this.diamond.rotation.set(0.35 + Math.sin(t * 0.4) * 0.1, t * 0.5, 0.1);
    this.diamond.material.uniforms.uAlpha.value = dIn;
    st.syncCam();
    st.render(r, rt);

    const c = this.l.begin();
    const g = this.g.begin();
    // headline
    c.save();
    c.globalAlpha = ep(l0.t0 - 0.2, l0.t0 + 0.6, t);
    c.font = font(F.serif, 44);
    c.fillStyle = C.ink;
    c.fillText('强度', 120, 178);
    c.font = font(F.monoB, 26);
    c.fillStyle = CY;
    c.fillText('MPa', 222, 178);
    c.font = font(F.sans, 20);
    c.fillStyle = C.dim;
    c.fillText('应力到多大开始坏——门槛，不是价钱', 120, 216);
    c.restore();

    if (blocks > 0.001) {
      c.save();
      c.globalAlpha = blocks;
      // compression: plates + inward arrows, gauge to 175 MPa
      this.loadRig(c, 600, 450, -1, ep(l0.t0, l0.t0 + 0.8, t), loadA);
      this.gauge(c, 790, 450, loadA * 175, 175, false, '抗压', '≈175 MPa', ep(press - 0.2, press + 0.5, t));
      // tension: outward arrows, gauge snaps around 20 MPa
      const pullP = ep(pull - 0.2, snap, t, ease.inOutCubic);
      const broken = t > snap;
      this.loadRig(c, 1320, 450, 1, ep(pull - 0.3, pull + 0.4, t), pullP, broken ? ease.outCubic(clamp((t - snap) * 2)) * 30 : 0);
      this.gauge(c, 1510, 450, pullP * 18, 175, broken, '抗拉', '5–25 MPa', ep(pull - 0.2, pull + 0.5, t));
      if (broken) {
        const a = Math.exp(-(t - snap) * 5);
        g.fillStyle = `rgba(255,120,90,${a * 0.6})`;
        g.fillRect(1200, 440, 240, 16);
      }
      // line 1: the common pattern
      const l1 = L(1);
      const pat = ep(l1.t0 - 0.1, l1.t0 + 0.6, t);
      if (pat > 0) {
        c.globalAlpha = blocks * pat;
        c.textAlign = 'center';
        c.font = font(F.serifH, 54);
        c.fillStyle = C.ink;
        c.fillText('耐压，不耐拉', 960, 820);
        tag(c, '岩石 · 陶瓷 · 混凝土 · 玻璃', 960, 866, C.dim, 16, 'center', 4);
      }
      c.restore();
    }

    // log ladder of tensile strength
    const lad = ep(l2.t0 - 0.2, l2.t0 + 1.0, t);
    if (lad > 0) {
      c.save();
      c.globalAlpha = lad;
      c.strokeStyle = rgba(C.ink, 0.5);
      c.lineWidth = 1.5;
      ln(c, AX0, AY, AX1, AY, lad);
      c.font = font(F.mono, 15);
      c.fillStyle = C.dim;
      c.textAlign = 'center';
      const lbl = ['1 MPa', '10', '100', '1 GPa', '10', '100', '1 TPa'];
      for (let e = E0; e <= E1; e++) {
        const x = xOfE(e);
        ln(c, x, AY, x, AY + 10, 1);
        c.fillText(lbl[e], x, AY + 30);
        c.strokeStyle = C.grid;
        ln(c, x, 290, x, AY, 1);
        c.strokeStyle = rgba(C.ink, 0.5);
      }
      tag(c, '抗拉强度 · 对数刻度（每格 ×10）', AX0, AY + 64, C.dim, 14, 'left', 2);
      const tD = cue('strength', 2, '一百二十五'), tG = cue('strength', 2, '石墨烯');
      LADDER.forEach((it, k) => {
        const at = it.at === 0 ? l2.t0 + 0.6 + k * 0.25 : it.at === 1 ? tD : tG;
        const a = ep(at - 0.1, at + 0.6, t);
        if (a <= 0) return;
        const x0 = xOf(it.v[0]), x1 = xOf(it.v[1]);
        const lane = it.at ? (it.at === 1 ? 1 : 0) : k % 2;
        const y = AY - 50 - lane * 52 - (it.at ? 60 : 0);
        c.globalAlpha = lad * a;
        c.fillStyle = it.at ? CY : rgba(CY, 0.7);
        if (x1 - x0 > 3) c.fillRect(x0, AY - 9, x1 - x0, 18);
        else {
          c.beginPath();
          c.arc(x0, AY, 8, 0, TAU);
          c.fill();
          g.fillStyle = rgba(CY, 0.7 * a);
          g.beginPath();
          g.arc(x0, AY, 12, 0, TAU);
          g.fill();
        }
        const xm = (x0 + x1) / 2;
        c.strokeStyle = rgba(CY, 0.5);
        c.lineWidth = 1;
        ln(c, xm, AY - 10, xm, y + 10, a);
        c.textAlign = it.at ? 'right' : 'center';
        c.font = font(it.at ? F.sansB : F.sansM, it.at ? 30 : 23);
        c.fillStyle = C.ink;
        const tx = it.at ? xm - 16 : xm;
        c.fillText(it.name, tx, y);
        if (it.big) {
          const nw = c.measureText(it.name).width;
          c.font = font(F.monoB, 28);
          c.fillStyle = CY;
          c.fillText(it.big, tx - nw - 18, y);
        }
      });
      // citation for the needle
      const cite = ep(tD + 0.4, tD + 1.2, t);
      if (cite > 0) {
        c.globalAlpha = lad * cite;
        c.textAlign = 'left';
        c.font = font(F.sans, 17);
        c.fillStyle = C.dim;
        c.fillText('2019 · 直径约 60 nm 的金刚石针，拉伸至 125 GPa 断裂，接近理论极限', 200, 260);
        tag(c, 'Nie et al., Nature Communications 10, 5533 (2019)', 200, 290, rgba(CY, 0.8), 13, 'left', 1);
      }
      // line 3: past the last measured point there is nothing — name a multiple
      const q = ep(l3.t0 - 0.1, l3.t0 + 1.0, t, ease.inOutCubic);
      if (q > 0) {
        const xa = xOf(135000), xb = AX1 + 40;
        c.globalAlpha = lad * q;
        c.save();
        c.beginPath();
        c.rect(xa, 300, (xb - xa) * q, AY - 300);
        c.clip();
        c.strokeStyle = rgba(C.warn, 0.35);
        c.lineWidth = 1;
        for (let k = -20; k < 30; k++) ln(c, xa + k * 16, AY, xa + k * 16 + 340, 300, 1);
        c.restore();
        c.font = font(F.serifH, 64);
        c.fillStyle = C.warn;
        c.textAlign = 'center';
        c.fillText('?', (xa + xb) / 2, 470);
        const mult = ep(cue('strength', 3, '多少倍') - 0.2, cue('strength', 3, '多少倍') + 0.6, t);
        if (mult > 0) {
          c.globalAlpha = lad * mult;
          for (const [f, s] of [[2, '×2'], [10, '×10']]) {
            const x = xOf(125000 * f);
            c.strokeStyle = C.warn;
            c.lineWidth = 2;
            ln(c, x, AY - 26, x, AY + 26, 1);
            tag(c, s, x, AY + 96, C.warn, 18, 'center', 1);
          }
          c.font = font(F.sansB, 26);
          c.fillStyle = C.ink;
          c.textAlign = 'right';
          c.fillText('“比金刚石还硬”——硬多少倍？', AX1, 820);
        }
      }
      c.restore();
    }
    this.g.draw(r, rt, { boost: 1.6 });
    this.l.draw(r, rt);
    return { ledger: 0, bloom: 0.8, vig: 0.62, grain: 0.035, ca: 0.002 };
  }

  // load rig around a block: dir -1 compresses (arrows in), +1 pulls (arrows out)
  loadRig(c, x, y, dir, a, load, gap = 0) {
    if (a <= 0) return;
    c.save();
    c.globalAlpha *= a;
    const hh = 128 + gap;
    c.fillStyle = CY;
    c.strokeStyle = CY;
    c.lineWidth = 3;
    for (const s of [-1, 1]) {
      const py = y + s * hh;
      ln(c, x - 110, py, x + 110, py, 1);
      const len = 46 + load * 30;
      if (dir < 0) arrow(c, x, py + s * (len + 18), x, py + s * 8, 1, 14);
      else arrow(c, x, py + s * 8, x, py + s * (len + 18), 1, 14);
    }
    c.restore();
  }

  gauge(c, x, y, v, vmax, broken, name, val, a) {
    if (a <= 0) return;
    const h = 300, top = y - h / 2;
    c.save();
    c.globalAlpha *= a;
    c.strokeStyle = C.faint;
    c.lineWidth = 1;
    c.strokeRect(x - 7, top, 14, h);
    const f = clamp(v / vmax);
    c.fillStyle = broken ? C.warn : CY;
    c.fillRect(x - 7, top + h * (1 - f), 14, h * f);
    c.font = font(F.mono, 13);
    c.fillStyle = C.dim;
    for (const m of [0, 50, 100, 150]) {
      const yy = top + h * (1 - m / vmax);
      ln(c, x + 7, yy, x + 14, yy, 1);
      c.fillText(String(m), x + 20, yy + 4);
    }
    c.font = font(F.monoB, 26);
    c.fillStyle = broken ? C.warn : C.ink;
    c.fillText(`${v.toFixed(0)}`, x - 6, top - 46);
    tag(c, 'MPa', x + (v >= 100 ? 50 : v >= 10 ? 34 : 20), top - 54, C.dim, 13, 'left', 1);
    c.font = font(F.sansM, 22);
    c.fillStyle = C.ink;
    c.fillText(name, x - 6, top + h + 40);
    tag(c, val, x - 6, top + h + 66, CY, 14, 'left', 1);
    if (broken) tag(c, '断', x + 24, top + h * (1 - f) - 2, C.warn, 16, 'left', 0);
    c.restore();
  }
}
