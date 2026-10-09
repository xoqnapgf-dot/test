// 08 SLASHING A METEOR — cutting breaks the structure, not the momentum. The rock is split along
// its own flight line; both halves keep the same velocity vector and hit the ground anyway.
// Then: a moving rock and a resting one cost the same to cut. Only stopping it takes the ½mv².
import { Background, Layer2D, Stage, THREE } from './base.js';
import { rockPoly, fracture } from '../gfx/fracture.js';
import { Shatter } from '../gfx/shatter.js';
import { specimenMaterial } from '../gfx/specimen.js';
import { cue, line } from '../core/narr.js';
import { F, font, tracking } from '../core/type.js';
import { C, LEDGER, rgba } from '../core/style.js';
import { line as ln, arrow, tag, polyline } from '../gfx/draw.js';
import { clamp, ease, ep, lerp, TAU, hash1 } from '../core/util.js';

const AMB = LEDGER[1].col;
const GROUND = 800;
const P0 = [1640, 120], P1 = [760, GROUND - 40];

export class Meteor {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.bg = new Background();
    this.st = new Stage(30);
    this.st.look(0, 0, 9, 0, 0, 0, 30);
    // flight direction (screen → world, roughly) and the cut plane containing it
    this.v = new THREE.Vector3(P1[0] - P0[0], -(P1[1] - P0[1]), 0).normalize();
    this.n = new THREE.Vector3(-this.v.y, this.v.x, 0);
    const base = rockPoly(1, 17, 0.2);
    this.mat = specimenMaterial(1, { scale: 1.5 });
    this.rock = new Shatter(fracture(base, 2, 3, { points: [this.n.clone().multiplyScalar(0.3), this.n.clone().multiplyScalar(-0.3)] }), this.mat, {});
    this.matB = specimenMaterial(1, { scale: 1.5 });
    this.rockA = new Shatter(fracture(rockPoly(1, 17, 0.2), 1, 3, {}), this.matB, {});
    this.rockB = new Shatter(fracture(rockPoly(1, 29, 0.2), 1, 3, {}), this.matB, {});
    this.matC = specimenMaterial(1, { scale: 1.5 });
    this.rockC = new Shatter(fracture(rockPoly(1, 17, 0.2), 1, 3, {}), this.matC, {});
    this.st.scene.add(this.rock.group, this.rockA.group, this.rockB.group, this.rockC.group);
    this.q = new THREE.Quaternion();
    this.l = new Layer2D(0);
    this.g = new Layer2D(1);
  }
  render(t, rt) {
    const r = this.app.renderer;
    const st = this.st;
    const L = (i) => line('meteor', i);
    const l0 = L(0), l1 = L(1), l2 = L(2), l3 = L(3);
    const cut = cue('meteor', 1, '切开'), hit = cue('meteor', 1, '往下砸') + 0.15;
    this.bg.draw(r, rt, t, { poolX: 0.55, poolY: 0.4, grid: 0.6, warm: 0.3 });
    const u = st.unit(9);
    const R = 118 * u;

    // ---- part 1: flight, cut, impact (lines 0–1)
    const flightA = ep(l0.t0 - 0.4, l0.t0 + 0.4, t) * (1 - ep(l2.t0 - 0.5, l2.t0 + 0.1, t));
    const s = (t - (l0.t0 - 0.4)) / (hit - (l0.t0 - 0.4));
    const sc = Math.min(s, 1);
    const sx = lerp(P0[0], P1[0], sc), sy = lerp(P0[1], P1[1], sc);
    this.rock.group.visible = flightA > 0.001 && s < 1.0;
    this.rock.group.position.copy(st.place(sx, sy, 9));
    this.rock.group.scale.setScalar(R);
    this.q.setFromAxisAngle(this.v, t * 0.8);
    this.rock.group.quaternion.copy(this.q);
    this.rock.set((t - cut) * 1.0, { mode: 'fly', power: 0.55, drag: 2.0, zs: 0.1 });
    const mu = this.mat.uniforms;
    mu.uHeat.value = 0.22;
    mu.uTime.value = t;
    mu.uCrack.value = t > cut ? Math.exp(-(t - cut) * 3) * 0.6 : 0;
    mu.uAlpha.value = flightA;

    // ---- part 2: moving vs resting (line 2)
    const cmpA = ep(l2.t0 - 0.3, l2.t0 + 0.6, t) * (1 - ep(l3.t0 - 0.4, l3.t0 + 0.2, t));
    this.rockA.group.visible = this.rockB.group.visible = cmpA > 0.001;
    this.rockA.group.position.copy(st.place(600, 430, 9));
    this.rockB.group.position.copy(st.place(1320, 430, 9));
    this.rockA.group.scale.setScalar(R * 1.15 * lerp(0.8, 1, cmpA));
    this.rockB.group.scale.setScalar(R * 1.15 * lerp(0.8, 1, cmpA));
    this.rockA.group.rotation.set(0.3, t * 0.4, 0.2);
    this.rockB.group.rotation.set(0.3, 1.5 + t * 0.05, 0.2);
    this.rockA.set(-1, {});
    this.rockB.set(-1, {});
    this.matB.uniforms.uAlpha.value = cmpA;
    this.matB.uniforms.uTime.value = t;

    // ---- part 3: stopped by a barrier (line 3)
    const stop = cue('meteor', 3, '拦停');
    const stA = ep(l3.t0 - 0.3, l3.t0 + 0.4, t);
    const sp = ep(l3.t0 - 0.3, stop + 0.5, t, ease.outCubic); // decelerating approach
    const cx = lerp(1700, 760, sp);
    this.rockC.group.visible = stA > 0.001;
    this.rockC.group.position.copy(st.place(cx, 470, 9));
    this.rockC.group.scale.setScalar(R);
    this.rockC.group.rotation.set(0.3, t * 0.2, (1 - sp) * 6);
    this.rockC.set(-1, {});
    this.matC.uniforms.uAlpha.value = stA;
    this.matC.uniforms.uHeat.value = 0.22 * (1 - sp);
    this.matC.uniforms.uTime.value = t;
    st.syncCam();
    st.render(r, rt);

    const c = this.l.begin();
    const g = this.g.begin();
    if (flightA > 0.001) this.flight(c, g, t, flightA, s, sx, sy, cut, hit);
    if (cmpA > 0.001) this.compare(c, g, t, cmpA);
    if (stA > 0.001) this.barrier(c, g, t, stA, sp, cx, stop);
    this.g.draw(r, rt, { boost: 1.8 });
    this.l.draw(r, rt);
    const imp = t > hit && t < hit + 0.8 ? 1 - (t - hit) / 0.8 : 0;
    return { ledger: [0, 1], bloom: 0.75, vig: 0.62, grain: 0.04, ca: 0.002 + imp * 0.006, flash: imp * 0.1 };
  }

  flight(c, g, t, a, s, sx, sy, cut, hit) {
    const dx = P1[0] - P0[0], dy = P1[1] - P0[1];
    const len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    const nx = -uy, ny = ux;
    // ground
    c.save();
    c.globalAlpha = a;
    c.strokeStyle = rgba(C.ink, 0.5);
    c.lineWidth = 1.5;
    ln(c, 80, GROUND, 1840, GROUND, 1);
    const gr = c.createLinearGradient(0, GROUND, 0, GROUND + 120);
    gr.addColorStop(0, 'rgba(60,52,44,0.55)');
    gr.addColorStop(1, 'rgba(60,52,44,0)');
    c.fillStyle = gr;
    c.fillRect(80, GROUND, 1760, 120);
    c.restore();
    // halves' screen positions (offset sideways after the cut)
    const sep = t > cut ? 0.55 / 2.0 * (1 - Math.exp(-2 * (t - cut))) * 118 * 0.75 : 0;
    const halves = t > cut ? [[sx + nx * sep, sy + ny * sep], [sx - nx * sep, sy - ny * sep]] : [[sx, sy]];
    if (s < 1) {
      // fiery trail
      for (const [hx, hy] of halves) {
        const tl = 420;
        const grd = g.createLinearGradient(hx, hy, hx - ux * tl, hy - uy * tl);
        grd.addColorStop(0, `rgba(255,170,90,${0.55 * a})`);
        grd.addColorStop(1, 'rgba(255,120,60,0)');
        g.strokeStyle = grd;
        g.lineWidth = halves.length > 1 ? 40 : 70;
        g.lineCap = 'round';
        g.beginPath();
        g.moveTo(hx - ux * 40, hy - uy * 40);
        g.lineTo(hx - ux * tl, hy - uy * tl);
        g.stroke();
      }
      // velocity arrows (same length before and after)
      const va = ep(cue('meteor', 1, '跟它飞得') - 0.2, cue('meteor', 1, '跟它飞得') + 0.4, t) || 0;
      const vshow = Math.max(va, t > cut ? 1 : 0) * a;
      if (vshow > 0) {
        c.save();
        c.globalAlpha = vshow;
        c.strokeStyle = c.fillStyle = AMB;
        c.lineWidth = 3;
        halves.forEach(([hx, hy], k) => {
          const ox = hx + ux * 110 + nx * (k ? -40 : 40) * (halves.length > 1 ? 1 : 0);
          const oy = hy + uy * 110 + ny * (k ? -40 : 40) * (halves.length > 1 ? 1 : 0);
          arrow(c, ox, oy, ox + ux * 120, oy + uy * 120, 1, 14);
          tag(c, 'v', ox + ux * 60 + 16, oy + uy * 60 - 12, AMB, 20, 'left', 0);
        });
        c.restore();
      }
    }
    // the slash
    if (t > cut - 0.25 && t < cut + 0.7) {
      const p = clamp((t - cut + 0.25) / 0.3);
      const fade = 1 - clamp((t - cut - 0.1) / 0.6);
      const L = 330;
      g.save();
      g.strokeStyle = `rgba(255,248,235,${fade})`;
      g.lineWidth = 5 * fade + 1;
      g.lineCap = 'round';
      const x0 = sx - ux * L, y0 = sy - uy * L;
      ln(g, x0, y0, lerp(x0, sx + ux * L, ease.outCubic(p)), lerp(y0, sy + uy * L, ease.outCubic(p)), 1);
      g.restore();
    }
    // labels
    c.save();
    c.globalAlpha = a * ep(cue('meteor', 1, '动能还在') - 0.1, cue('meteor', 1, '动能还在') + 0.5, t) * (s < 1 ? 1 : 0);
    c.font = font(F.sansB, 28);
    c.fillStyle = C.ink;
    c.fillText('½ m v²  还在', sx + 150, sy - 40);
    c.restore();
    c.save();
    c.globalAlpha = a * ep(cue('meteor', 1, '只需要') - 0.1, cue('meteor', 1, '只需要') + 0.5, t) * (1 - ep(hit, hit + 0.5, t));
    c.font = font(F.sansM, 24);
    c.fillStyle = C.dim;
    c.fillText('切开 = 打断结构', 140, 240);
    c.fillText('≠ 带走动能', 140, 280);
    c.restore();
    // impact: two hits, craters, dust
    if (t > hit) {
      const k = t - hit;
      const pts = [[P1[0] + nx * 70, GROUND], [P1[0] - nx * 70, GROUND]];
      pts.forEach(([x, y], i) => {
        const fl = Math.exp(-k * 3);
        const gg = g.createRadialGradient(x, y, 0, x, y, 200);
        gg.addColorStop(0, `rgba(255,220,170,${fl * 0.8})`);
        gg.addColorStop(1, 'rgba(255,140,60,0)');
        g.fillStyle = gg;
        g.fillRect(x - 200, y - 200, 400, 400);
        c.save();
        c.globalAlpha = a;
        c.strokeStyle = `rgba(233,228,216,${0.6 * Math.exp(-k * 0.8)})`;
        c.lineWidth = 2;
        c.beginPath();
        c.ellipse(x, y, 30 + k * 260, 8 + k * 50, 0, 0, TAU);
        c.stroke();
        c.fillStyle = 'rgba(20,16,12,0.9)';
        c.beginPath();
        c.ellipse(x, y + 4, 64 * clamp(k * 4), 14 * clamp(k * 4), 0, 0, Math.PI);
        c.fill();
        // debris specks
        for (let j = 0; j < 22; j++) {
          const ang = Math.PI + hash1(j + i * 50) * Math.PI;
          const sp = 200 + hash1(j * 7 + i) * 380;
          const px = x + Math.cos(ang) * sp * k, py = y + Math.sin(ang) * sp * k + 500 * k * k;
          if (py > GROUND + 4) continue;
          c.fillStyle = 'rgba(200,180,150,0.85)';
          c.fillRect(px, py, 4, 4);
        }
        c.restore();
      });
      c.save();
      c.globalAlpha = a * ep(cue('meteor', 1, '威力') - 0.1, cue('meteor', 1, '威力') + 0.5, t);
      c.font = font(F.serifH, 50);
      c.fillStyle = C.ink;
      c.textAlign = 'center';
      c.fillText('威力一点没少', 1300, 420);
      c.restore();
    }
  }

  compare(c, g, t, a) {
    const eq = ep(cue('meteor', 2, '约等于') - 0.1, cue('meteor', 2, '约等于') + 0.5, t);
    const rest = ep(cue('meteor', 2, '静止') - 0.1, cue('meteor', 2, '静止') + 0.5, t);
    c.save();
    c.globalAlpha = a;
    c.textAlign = 'center';
    c.font = font(F.sansB, 28);
    c.fillStyle = C.ink;
    c.fillText('飞行中的陨石', 600, 650);
    // speed lines and v
    c.strokeStyle = rgba(C.ink, 0.35);
    c.lineWidth = 2;
    for (let k = 0; k < 6; k++) {
      const y = 360 + k * 28;
      const off = ((t * 300 + k * 70) % 200);
      ln(c, 760 + off, y, 860 + off, y, 1);
    }
    c.fillStyle = c.strokeStyle = AMB;
    c.lineWidth = 3;
    arrow(c, 470, 560, 330, 560, 1, 14);
    tag(c, 'v', 400, 535, AMB, 20, 'center', 0);
    c.globalAlpha = a * rest;
    c.fillStyle = C.ink;
    c.font = font(F.sansB, 28);
    c.fillText('同样大小、静止的石头', 1320, 650);
    tag(c, 'v = 0', 1320, 560, AMB, 18, 'center', 1);
    // cut lines through both
    c.globalAlpha = a;
    c.setLineDash([7, 6]);
    c.strokeStyle = 'rgba(255,240,220,0.75)';
    c.lineWidth = 2;
    ln(c, 600 - 40, 270, 600 + 40, 600, ep(cue('meteor', 2, '斩开') - 0.1, cue('meteor', 2, '斩开') + 0.6, t));
    ln(c, 1320 - 40, 270, 1320 + 40, 600, rest);
    c.setLineDash([]);
    if (eq > 0) {
      c.globalAlpha = a * eq;
      c.font = font(F.serifH, 120);
      c.fillStyle = C.ink;
      c.fillText('≈', 960, 470);
    }
    c.globalAlpha = a * rest;
    c.font = font(F.sansM, 26);
    c.fillStyle = C.ink;
    c.fillText('切开所需 ≈ 断面面积 × 材料的断裂能', 960, 760);
    tag(c, '与速度 v 无关', 960, 800, AMB, 17, 'center', 3);
    c.restore();
  }

  barrier(c, g, t, a, sp, cx, stop) {
    c.save();
    c.globalAlpha = a;
    // barrier
    c.fillStyle = 'rgba(92,200,232,0.18)';
    c.fillRect(560, 260, 40, 440);
    c.strokeStyle = LEDGER[0].col;
    c.lineWidth = 2;
    c.strokeRect(560, 260, 40, 440);
    // kinetic energy meter: KE ∝ v², v = d(sp)/dt shape → (1 − sp)² is a fair picture of the drain
    const ke = (1 - sp) * (1 - sp);
    c.font = font(F.sansM, 22);
    c.fillStyle = C.ink;
    c.fillText('动能  ½ m v²', 1180, 250);
    c.strokeStyle = C.faint;
    c.strokeRect(1180, 270, 520, 26);
    c.fillStyle = AMB;
    c.fillRect(1180, 270, 520 * ke, 26);
    if (t > stop) {
      const f = Math.exp(-(t - stop) * 3);
      g.fillStyle = `rgba(150,220,255,${0.6 * f})`;
      g.fillRect(560, 260, 40, 440);
    }
    const words = [['拦停', '拦停'], ['弹开', '弹开'], ['彻底化解', '化解']];
    words.forEach(([kw, s], k) => {
      const at = cue('meteor', 3, kw);
      const p = ep(at - 0.1, at + 0.4, t);
      c.globalAlpha = a * p;
      c.font = font(F.serifH, 44);
      c.fillStyle = C.ink;
      c.fillText(s, 1180 + k * 190, 400);
    });
    const tk = ep(cue('meteor', 3, '接下了') - 0.1, cue('meteor', 3, '接下了') + 0.5, t);
    c.globalAlpha = a * tk;
    tag(c, '→ 才算接下了它的动能', 1180, 450, AMB, 18, 'left', 2);
    const gd = ep(cue('meteor', 3, '格挡') - 0.1, cue('meteor', 3, '格挡') + 0.5, t);
    c.globalAlpha = a * gd;
    c.font = font(F.sansB, 30);
    c.fillStyle = C.ink;
    c.fillText('格挡攻击，同理：', 1180, 560);
    c.font = font(F.sans, 22);
    c.fillStyle = C.dim;
    c.fillText('挡停、卸开，才是接住；只是切断，不算', 1180, 600);
    c.restore();
  }
}
