// 07 A LOWER BOUND — binding energy assumes a perfectly efficient, silent disassembly.
// Ideal vs real side by side; then the one calibration the universe offers (a type Ia supernova,
// Tycho's remnant as the backdrop): kinetic output ≈ 2 × the binding energy. Finally two cases
// that never reach the bound at all: tearing along a plane, and shaking the surface.
import { Background, Layer2D, Stage, THREE } from './base.js';
import { spherePoly, fracture } from '../gfx/fracture.js';
import { Shatter } from '../gfx/shatter.js';
import { planetMaterial, glowSprite, KIND } from '../gfx/planet.js';
import { cue, line } from '../core/narr.js';
import { F, font, tracking } from '../core/type.js';
import { C, LEDGER, rgba } from '../core/style.js';
import { line as ln, arrow, tag, strike } from '../gfx/draw.js';
import { clamp, ease, ep, lerp, TAU, hash1 } from '../core/util.js';

const VI = LEDGER[3].col;

export class Bound {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.bg = new Background();
    this.st = new Stage(30);
    this.st.look(0, 0, 9, 0, 0, 0, 30);
    const cells = (seed, n) => fracture(spherePoly(1, 3), n, seed, { radius: 0.96, sphere: true });
    this.idealMat = planetMaterial(KIND.mars);
    this.idealMat.uniforms.uCore.value = 0;
    this.realMat = planetMaterial(KIND.mars);
    this.realMat.uniforms.uCore.value = 2.6;
    this.ideal = new Shatter(cells(41, 30), this.idealMat, {});
    this.real = new Shatter(cells(43, 30), this.realMat, {});
    this.flash = glowSprite([1.6, 1.0, 0.6], 0, 1.8);
    this.real.group.add(this.flash);
    this.tearMat = planetMaterial(KIND.moon);
    this.tearMat.uniforms.uCore.value = 0.8;
    this.tear = new Shatter(
      fracture(spherePoly(1, 3), 2, 3, { points: [new THREE.Vector3(-0.3, 0.05, 0), new THREE.Vector3(0.3, -0.05, 0)] }),
      this.tearMat, {}
    );
    this.st.scene.add(this.ideal.group, this.real.group, this.tear.group);
    // Tycho's supernova remnant (ESA/Hubble heic0415c) for line 2
    this.img = new Image();
    this.img.src = (window.EXPLAINER_TEX || {}).tycho || '';
    this.l = new Layer2D(0);
    this.g = new Layer2D(1);
  }
  render(t, rt) {
    const r = this.app.renderer;
    const st = this.st;
    const L = (i) => line('bound', i);
    const l0 = L(0), l1 = L(1), l2 = L(2), l3 = L(3), l4 = L(4);
    const boom = cue('bound', 1, '真正的爆炸');
    this.bg.draw(r, rt, t, { poolX: 0.5, poolY: 0.5, grid: 0.7, warm: 0.4 * ep(boom, boom + 1, t) * (1 - ep(l2.t0, l2.t0 + 1, t)) });
    const u = st.unit(9);

    const duo = ep(l1.t0 - 0.3, l1.t0 + 0.8, t) * (1 - ep(l2.t0 - 0.5, l2.t0 + 0.3, t));
    this.ideal.group.visible = this.real.group.visible = duo > 0.001;
    if (duo > 0.001) {
      this.ideal.group.position.copy(st.place(560, 450, 9));
      this.real.group.position.copy(st.place(1360, 450, 9));
      for (const s of [this.ideal, this.real]) {
        s.group.scale.setScalar(150 * u * lerp(0.8, 1, duo));
        s.group.rotation.set(0.25, 0.4 + t * 0.04, 0);
      }
      const drift = cue('bound', 1, '碎片刚好飘走') - 0.6;
      this.ideal.set(t - drift, { mode: 'fly', power: 0.1, drag: 0.02, zs: 0.05 });
      this.real.set(t - boom, { mode: 'fly', power: 0.85, drag: 0.7, zs: 0.04 });
      for (const m of [this.idealMat, this.realMat]) {
        m.uniforms.uSun.value.set(-0.8, 0.4, 0.7);
        m.uniforms.uTint.value.setScalar(duo);
      }
      const fl = t > boom ? Math.exp(-(t - boom) * 2.2) : 0;
      this.flash.material.uniforms.uK.value = fl * 3;
      this.flash.scale.setScalar(1.5 + (t - boom) * 2);
      this.realMat.uniforms.uCore.value = 0.6 + 2.6 * Math.exp(-Math.max(t - boom, 0) * 0.6);
    }
    const tearA = ep(l4.t0 - 0.2, l4.t0 + 0.8, t);
    this.tear.group.visible = tearA > 0.001;
    if (tearA > 0.001) {
      this.tear.group.position.copy(st.place(560, 430, 9));
      this.tear.group.scale.setScalar(150 * u * lerp(0.8, 1, tearA));
      this.tear.group.rotation.set(0.2, -0.5, 0.05);
      const tt = cue('bound', 4, '撕开');
      this.tear.set(t - tt, { mode: 'fly', power: 0.25, drag: 1.2, zs: 0.1 });
      this.tearMat.uniforms.uSun.value.set(-0.8, 0.4, 0.7);
      this.tearMat.uniforms.uTint.value.setScalar(tearA);
    }
    st.syncCam();
    st.render(r, rt);

    const c = this.l.begin();
    const g = this.g.begin();
    // line 0: the floor
    const fl0 = ep(l0.t0 - 0.2, l0.t0 + 0.8, t) * (1 - ep(l1.t0 - 0.4, l1.t0 + 0.2, t));
    if (fl0 > 0) {
      c.save();
      c.globalAlpha = fl0;
      const y = 560;
      // everything above the floor is allowed; nothing below it is
      const hgt = 300 * ease.outCubic(fl0);
      const gr = c.createLinearGradient(0, y, 0, y - hgt);
      gr.addColorStop(0, rgba(VI, 0.28));
      gr.addColorStop(1, rgba(VI, 0));
      c.fillStyle = gr;
      c.fillRect(360, y - hgt, 1200, hgt);
      c.strokeStyle = rgba(VI, 0.35);
      c.lineWidth = 1;
      for (let k = 0; k < 24; k++) ln(c, 380 + k * 50, y + 14, 380 + k * 50 - 30, y + 44, fl0);
      c.strokeStyle = VI;
      c.lineWidth = 3;
      ln(c, 360, y, 1560, y, ep(l0.t0 - 0.2, l0.t0 + 0.9, t, ease.inOutCubic));
      c.font = font(F.serifH, 64);
      c.fillStyle = C.ink;
      c.textAlign = 'center';
      c.fillText('束缚能 = 下限', 960, 450);
      tag(c, '真实所需 ≥ U', 960, 520, VI, 18, 'center', 4);
      tag(c, 'U', 340, y, VI, 22, 'right', 0);
      c.restore();
    }
    // line 1: ideal vs real
    if (duo > 0.001) {
      c.save();
      c.globalAlpha = duo;
      c.textAlign = 'center';
      c.font = font(F.serifH, 40);
      c.fillStyle = C.ink;
      c.fillText('理想', 560, 205);
      c.fillText('真实爆炸', 1360, 205);
      tag(c, '能量 100% 用于拆散', 560, 245, VI, 15, 'center', 2);
      const items = ['没有光', '没有热', '碎片刚好飘走'];
      items.forEach((s, k) => {
        const at = cue('bound', 1, s);
        const a = ep(at - 0.1, at + 0.4, t);
        c.globalAlpha = duo * a;
        c.font = font(F.sansM, 22);
        c.fillStyle = C.ink;
        c.fillText(s, 420 + k * 140, 700);
      });
      const ra = ep(boom - 0.1, boom + 0.6, t);
      c.globalAlpha = duo * ra;
      ['闪光', '辐射', '高温', '碎片高速飞散'].forEach((s, k) => {
        c.font = font(F.sansM, 22);
        c.fillStyle = k < 3 ? '#ffb98a' : C.ink;
        c.fillText(s, 1150 + k * 130 + (k === 3 ? 30 : 0), 700);
      });
      c.restore();
      if (t > boom) {
        const a = Math.exp(-(t - boom) * 1.5) * duo;
        g.save();
        g.strokeStyle = `rgba(255,200,150,${a})`;
        g.lineWidth = 3;
        g.beginPath();
        g.arc(1360, 450, 160 + (t - boom) * 500, 0, TAU);
        g.stroke();
        g.restore();
      }
    }
    // lines 2–3: Ia supernova calibration
    const sn = ep(l2.t0 - 0.2, l2.t0 + 1.0, t) * (1 - ep(l4.t0 - 0.5, l4.t0 + 0.2, t));
    if (sn > 0) this.supernova(c, g, t, sn);
    // line 4: tear and shake
    if (tearA > 0.001) this.below(c, g, t, tearA);

    this.g.draw(r, rt, { boost: 1.6 });
    this.l.draw(r, rt);
    const shake = t > boom && t < boom + 0.6 ? 1 - (t - boom) / 0.6 : 0;
    return { ledger: 3, bloom: 0.9, vig: 0.62, grain: 0.035, ca: 0.002 + shake * 0.006, flash: shake * 0.25 };
  }

  supernova(c, g, t, a) {
    const imgOK = this.img.complete && this.img.naturalWidth > 0;
    // remnant image, circular vignette
    if (imgOK) {
      c.save();
      c.globalAlpha = a * 0.95;
      const cx = 1380, cy = 470, R = 330;
      c.beginPath();
      c.arc(cx, cy, R, 0, TAU);
      c.clip();
      const sc = (2 * R) / Math.min(this.img.naturalWidth, this.img.naturalHeight);
      const w = this.img.naturalWidth * sc * (1.05 + (t - line('bound', 2).t0) * 0.004);
      const h = this.img.naturalHeight * sc * (1.05 + (t - line('bound', 2).t0) * 0.004);
      c.drawImage(this.img, cx - w / 2, cy - h / 2, w, h);
      const gr = c.createRadialGradient(cx, cy, R * 0.6, cx, cy, R);
      gr.addColorStop(0, 'rgba(10,12,16,0)');
      gr.addColorStop(1, 'rgba(10,12,16,1)');
      c.fillStyle = gr;
      c.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      c.restore();
      tag(c, 'Tycho 超新星遗迹（1572 年，Ia 型）· 图：NASA/ESA, Chandra, P. Ruiz-Lapuente', 1380, 830, rgba(C.ink, 0.45 * a), 12, 'center', 1);
    }
    c.save();
    c.globalAlpha = a;
    c.font = font(F.serif, 40);
    c.fillStyle = C.ink;
    c.fillText('校准：Ia 型超新星', 140, 230);
    tag(c, '一颗白矮星被整个炸散', 140, 270, C.dim, 16, 'left', 2);
    // bars (linear, 10⁴⁴ J = 520 px)
    const S = 520;
    const b1 = ep(cue('bound', 2, '束缚能') - 0.1, cue('bound', 2, '束缚能') + 0.8, t, ease.outQuart);
    const b2 = ep(cue('bound', 2, '动能') - 0.1, cue('bound', 2, '动能') + 0.9, t, ease.outQuart);
    const rows = [
      ['束缚能 U', '≈ 5×10⁴³ J', 0.5, b1, VI],
      ['抛射物动能', '≈ 1×10⁴⁴ J', 1.0, b2, '#ffb98a'],
    ];
    rows.forEach(([n, v, f, p, col], k) => {
      if (p <= 0) return;
      const y = 400 + k * 120;
      c.globalAlpha = a * clamp(p * 3);
      c.font = font(F.sansM, 22);
      c.fillStyle = C.ink;
      c.fillText(n, 140, y - 22);
      c.fillStyle = col;
      c.fillRect(140, y - 4, S * f * p, 36);
      c.font = font(F.sansB, 24);
      c.fillStyle = C.ink;
      c.fillText(v, 140 + S * f * p + 16, y + 22);
    });
    // ×2 and the caveat
    const x2 = ep(line('bound', 3).t0 - 0.1, line('bound', 3).t0 + 0.7, t);
    if (x2 > 0) {
      c.globalAlpha = a * x2;
      c.strokeStyle = C.ink;
      c.lineWidth = 1.5;
      c.setLineDash([4, 5]);
      ln(c, 140 + S * 0.5, 370, 140 + S * 0.5, 660, 1);
      ln(c, 140 + S, 370, 140 + S, 660, 1);
      c.setLineDash([]);
      c.font = font(F.serifH, 64);
      c.fillStyle = C.ink;
      c.textAlign = 'center';
      c.fillText('× 2', 140 + S * 0.75, 730);
      tag(c, '实际输出 ≈ 下限 × 2', 140 + S * 0.75, 770, C.dim, 15, 'center', 2);
    }
    const cav = ep(cue('bound', 3, '参考点') - 0.1, cue('bound', 3, '参考点') + 0.6, t);
    if (cav > 0) {
      c.globalAlpha = a * cav;
      c.textAlign = 'left';
      c.font = font(F.sansB, 24);
      c.fillStyle = C.warn;
      c.fillText('一个参考点，不是万能系数', 140, 850);
    }
    c.restore();
  }

  below(c, g, t, a) {
    const tt = cue('bound', 4, '撕开'), sh = cue('bound', 4, '震动起来');
    const shA = ep(sh - 0.2, sh + 0.6, t);
    c.save();
    c.globalAlpha = a;
    // cut plane through the torn planet
    const cutP = ep(tt - 0.4, tt + 0.4, t);
    c.strokeStyle = rgba('#ffd2a8', 0.8 * cutP);
    c.lineWidth = 2;
    c.setLineDash([8, 6]);
    ln(c, 560 - 20, 230, 560 + 20, 640, cutP);
    c.setLineDash([]);
    c.font = font(F.sansB, 26);
    c.fillStyle = C.ink;
    c.textAlign = 'center';
    c.fillText('沿截面撕开', 560, 700);
    tag(c, '只克服截面两侧之间的引力', 560, 736, C.dim, 15, 'center', 1);
    // shaking planet: an elastic ring wave on a disc
    if (shA > 0) {
      c.globalAlpha = a * shA;
      const cx = 1360, cy = 430, R = 150;
      c.fillStyle = 'rgba(120,118,112,0.35)';
      c.strokeStyle = 'rgba(233,228,216,0.8)';
      c.lineWidth = 2;
      c.beginPath();
      for (let k = 0; k <= 160; k++) {
        const th = (k / 160) * TAU;
        const rr = R + Math.sin(th * 6 + t * 9) * 7 * Math.sin(t * 3) + Math.sin(th * 3 - t * 5) * 4;
        const x = cx + Math.cos(th) * rr, y = cy + Math.sin(th) * rr;
        k ? c.lineTo(x, y) : c.moveTo(x, y);
      }
      c.closePath();
      c.fill();
      c.stroke();
      for (let k = 1; k < 4; k++) {
        c.strokeStyle = `rgba(233,228,216,${0.18 * (1 - k / 4)})`;
        c.beginPath();
        c.arc(cx, cy, ((t * 60 + k * 50) % 150), 0, TAU);
        c.stroke();
      }
      c.font = font(F.sansB, 26);
      c.fillStyle = C.ink;
      c.fillText('表面震动', cx, 700);
      tag(c, '只涉及弹性，不涉及拆散', cx, 736, C.dim, 15, 'center', 1);
    }
    // both far below the bound
    const lo = ep(cue('bound', 4, '不涉及拆散') - 0.2, cue('bound', 4, '不涉及拆散') + 0.6, t);
    if (lo > 0) {
      c.globalAlpha = a * lo;
      const y = 820;
      c.strokeStyle = VI;
      c.lineWidth = 2;
      ln(c, 360, y, 1560, y, lo);
      tag(c, '束缚能 U', 1580, y, VI, 15, 'left', 1);
      c.fillStyle = rgba(C.ink, 0.6);
      c.fillRect(500, y + 24, 120, 10);
      c.fillRect(1300, y + 24, 120, 10);
      tag(c, '≪ U', 640, y + 30, C.ink, 15, 'left', 1);
      tag(c, '≪ U', 1440, y + 30, C.ink, 15, 'left', 1);
    }
    c.restore();
  }
}
