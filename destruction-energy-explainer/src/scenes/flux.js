// 11 FLUX — the slow ledger. Earth absorbs ≈240 W/m² today; push past ≈282 W/m² (Simpson–
// Nakajima limit as revised by Goldblatt et al. 2013, earlier quoted near 310) and the oceans'
// vapour locks in the heat until the surface can melt rock. A rate is not an amount: W × s = J.
import { Background, Layer2D, Stage, THREE } from './base.js';
import { planetMaterial, atmosphereMaterial, sphereGeometry, KIND } from '../gfx/planet.js';
import { cue, line } from '../core/narr.js';
import { F, font, tracking } from '../core/type.js';
import { C, LEDGER, rgba } from '../core/style.js';
import { line as ln, arrow, tag } from '../gfx/draw.js';
import { clamp, ease, ep, lerp, hash1, TAU } from '../core/util.js';

const YL = LEDGER[4].col;
const GX0 = 160, GX1 = 880, GY = 640, V0 = 200, V1 = 340;
const gx = (v) => lerp(GX0, GX1, (v - V0) / (V1 - V0));

export class Flux {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.bg = new Background();
    this.st = new Stage(30);
    this.st.look(0, 0, 9, 0, 0, 0, 30);
    this.mat = planetMaterial(KIND.earth);
    this.earth = new THREE.Mesh(sphereGeometry(1, 128), this.mat);
    this.atm = new THREE.Mesh(sphereGeometry(1.06, 64), atmosphereMaterial());
    this.root = new THREE.Group();
    this.root.add(this.earth, this.atm);
    this.st.scene.add(this.root);
    this.l = new Layer2D(0);
    this.g = new Layer2D(1);
  }
  render(t, rt) {
    const r = this.app.renderer;
    const st = this.st;
    const L = (i) => line('flux', i);
    const l0 = L(0), l1 = L(1), l2 = L(2), l3 = L(3);
    const k240 = cue('flux', 1, '两百四十'), k282 = cue('flux', 2, '两百八十二');
    const kVap = cue('flux', 2, '水汽'), kMelt = cue('flux', 2, '熔化岩石'), k310 = cue('flux', 2, '三百一十');
    const steam = ep(kVap - 0.3, kVap + 3, t, ease.inOutQuad);
    const heat = ep(kMelt - 1.5, kMelt + 2.5, t, ease.inOutQuad);
    const cool = ep(l3.t0, l3.t0 + 2.5, t, ease.inOutCubic);
    this.bg.draw(r, rt, t, { poolX: 0.66, poolY: 0.45, grid: 0.6, warm: heat * (1 - cool) * 0.8 });
    const u = st.unit(9);
    const inA = ep(l0.t0 - 0.4, l0.t0 + 1.2, t, ease.outCubic);
    this.root.position.copy(st.place(lerp(1500, 1300, inA), 470, 9));
    this.root.scale.setScalar(260 * u * lerp(0.85, 1, inA));
    this.earth.rotation.y = t * 0.05;
    const mu = this.mat.uniforms;
    mu.uSun.value.set(-1, 0.25, 0.55);
    mu.uCloudSpin.value = t * 0.006;
    mu.uTime.value = t;
    mu.uSteam.value = steam * (1 - cool) * 0.9;
    mu.uHeat.value = 0.72 * heat * (1 - cool);
    mu.uTint.value.setScalar(inA);
    this.atm.material.uniforms.uSun.value.set(-1, 0.25, 0.55);
    this.atm.material.uniforms.uK.value = inA * (1 + steam * (1 - cool) * 0.8);
    st.syncCam();
    st.render(r, rt);

    const c = this.l.begin();
    const g = this.g.begin();
    c.save();
    c.globalAlpha = ep(l0.t0 - 0.2, l0.t0 + 0.6, t);
    c.font = font(F.serif, 44);
    c.fillStyle = C.ink;
    c.fillText('持续通量', 120, 178);
    c.font = font(F.monoB, 26);
    c.fillStyle = YL;
    c.fillText('W/m²', 330, 178);
    c.font = font(F.sans, 20);
    c.fillStyle = C.dim;
    c.fillText('不是一次性爆发，而是持续的烘烤：这是功率，不是能量', 120, 216);
    c.restore();
    // sunlight streaming in from the left toward the planet
    g.save();
    g.globalAlpha = inA * 0.9;
    for (let k = 0; k < 28; k++) {
      const y = 260 + hash1(k) * 420;
      const ph = (t * (0.35 + hash1(k + 9) * 0.25) + hash1(k + 3)) % 1;
      const x = lerp(-100, 1080, ph);
      const gr = g.createLinearGradient(x - 160, y, x, y);
      gr.addColorStop(0, 'rgba(236,211,95,0)');
      gr.addColorStop(1, `rgba(236,211,95,${0.45 * (1 - ph * 0.6)})`);
      g.strokeStyle = gr;
      g.lineWidth = 2;
      ln(g, x - 160, y, x, y, 1);
    }
    g.restore();

    // gauge
    const ga = ep(l1.t0 - 0.3, l1.t0 + 0.6, t) * (1 - ep(l3.t0 - 0.3, l3.t0 + 0.4, t));
    if (ga > 0) {
      c.save();
      c.globalAlpha = ga;
      // track coloured from safe to runaway
      const tr = c.createLinearGradient(GX0, 0, GX1, 0);
      tr.addColorStop(0, 'rgba(92,200,232,0.6)');
      tr.addColorStop((282 - V0) / (V1 - V0), 'rgba(236,211,95,0.8)');
      tr.addColorStop(1, 'rgba(255,77,94,0.9)');
      c.fillStyle = tr;
      c.fillRect(GX0, GY - 5, GX1 - GX0, 10);
      c.font = font(F.mono, 14);
      c.fillStyle = C.dim;
      c.textAlign = 'center';
      for (let v = V0; v <= V1; v += 20) {
        c.fillRect(gx(v) - 0.5, GY + 8, 1, 8);
        c.fillText(String(v), gx(v), GY + 34);
      }
      tag(c, 'W/m² · 地球吸收的太阳辐射', GX0, GY + 64, C.dim, 13, 'left', 2);
      // needle
      const v = lerp(lerp(V0, 240, ep(k240 - 0.3, k240 + 1.0, t, ease.outCubic)), 290, ep(k282 - 0.3, k282 + 1.6, t, ease.inOutCubic));
      c.fillStyle = C.ink;
      c.beginPath();
      c.moveTo(gx(v), GY - 10);
      c.lineTo(gx(v) - 10, GY - 30);
      c.lineTo(gx(v) + 10, GY - 30);
      c.closePath();
      c.fill();
      c.font = font(F.monoB, 54);
      c.textAlign = 'left';
      c.fillStyle = v > 282 ? C.warn : C.ink;
      c.fillText(`${Math.round(v)}`, GX0, 520);
      tag(c, 'W/m²', GX0 + 120, 506, C.dim, 16, 'left', 1);
      // marks: 240 now, 282 limit
      const m240 = ep(k240, k240 + 0.6, t);
      c.globalAlpha = ga * m240;
      tag(c, '今天 ≈240', gx(240), GY - 52, LEDGER[0].col, 14, 'center', 1);
      const m282 = ep(k282 - 0.1, k282 + 0.6, t);
      if (m282 > 0) {
        c.globalAlpha = ga * m282;
        c.strokeStyle = C.warn;
        c.lineWidth = 2;
        ln(c, gx(282), GY - 70, gx(282), GY + 12, 1);
        tag(c, '≈282 失控温室', gx(282), GY - 84, C.warn, 15, 'center', 1);
      }
      // the older 310 figure, revised down
      const m310 = ep(k310 - 0.2, k310 + 0.5, t);
      if (m310 > 0) {
        c.globalAlpha = ga * m310;
        c.strokeStyle = rgba(C.ink, 0.6);
        c.setLineDash([4, 4]);
        ln(c, gx(310), GY - 40, gx(310), GY + 12, 1);
        c.setLineDash([]);
        tag(c, '早年 ≈310', gx(310), GY - 120, C.dim, 14, 'center', 1);
        c.fillStyle = c.strokeStyle = C.dim;
        c.lineWidth = 1.5;
        arrow(c, gx(310), GY - 104, gx(286), GY - 104, ep(k310 + 0.3, k310 + 1.2, t), 9);
        tag(c, 'Goldblatt et al., Nature Geoscience (2013)', GX0, GY + 92, rgba(C.ink, 0.45), 12, 'left', 1);
      }
      // chain of events
      const steps = [['水汽', '海洋蒸发，水汽增多'], ['锁住热量', '水汽锁住热量'], ['失控', '温室效应失控'], ['熔化岩石', '地表热到熔化岩石']];
      steps.forEach(([kw, s], k) => {
        const at = cue('flux', 2, kw);
        const p = ep(at - 0.1, at + 0.5, t);
        if (p <= 0) return;
        c.globalAlpha = ga * p;
        c.font = font(F.sansM, 22);
        c.fillStyle = k === 3 ? C.warn : C.ink;
        c.textAlign = 'left';
        c.fillText(`${k ? '→ ' : ''}${s}`, GX0, 290 + k * 40);
      });
      c.restore();
    }

    // line 3: W × s = J
    const eq = ep(l3.t0 - 0.1, l3.t0 + 0.8, t);
    if (eq > 0) {
      c.save();
      c.globalAlpha = eq;
      c.font = font(F.serifH, 74);
      c.fillStyle = C.ink;
      c.fillText('瓦 × 秒 = 焦耳', 140, 420);
      const k2 = ep(cue('flux', 3, '烤了多久') - 0.2, cue('flux', 3, '烤了多久') + 0.6, t);
      // clock
      const cx = 260, cy = 600;
      c.globalAlpha = eq * k2;
      c.strokeStyle = C.ink;
      c.lineWidth = 2;
      c.beginPath();
      c.arc(cx, cy, 70, 0, TAU);
      c.stroke();
      const sp = (t - cue('flux', 3, '烤了多久')) * 3;
      ln(c, cx, cy, cx + Math.sin(sp) * 56, cy - Math.cos(sp) * 56, 1);
      ln(c, cx, cy, cx + Math.sin(sp / 12) * 36, cy - Math.cos(sp / 12) * 36, 1);
      const yrs = clamp((t - cue('flux', 3, '烤了多久')) / 4);
      c.font = font(F.mono, 20);
      c.fillStyle = C.dim;
      c.fillText('240 W/m² × 1 年', 380, 580);
      c.font = font(F.sansB, 40);
      c.fillStyle = YL;
      const val = 7.57 * yrs;
      c.fillText(`≈ ${val.toFixed(1)}×10⁹ J/m²`, 380, 632);
      c.restore();
    }
    this.g.draw(r, rt, { boost: 1.5 });
    this.l.draw(r, rt);
    return { ledger: 4, bloom: 0.95, vig: 0.6, grain: 0.035, ca: 0.002 };
  }
}
