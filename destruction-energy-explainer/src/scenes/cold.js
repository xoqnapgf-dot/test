// COLD OPEN — a concrete block breaks on the word 打碎; pull back, a planet slides in;
// two objects, two different questions; the title is ruled like a ledger.
import { Background, Layer2D, Stage, THREE } from './base.js';
import { cubePoly, fracture } from '../gfx/fracture.js';
import { Shatter } from '../gfx/shatter.js';
import { specimenMaterial } from '../gfx/specimen.js';
import { planetMaterial, atmosphereMaterial, sphereGeometry, KIND } from '../gfx/planet.js';
import { cue, line, scene } from '../core/narr.js';
import { F, font, tracking } from '../core/type.js';
import { C, LEDGER, rgba } from '../core/style.js';
import { line as ln, tag } from '../gfx/draw.js';
import { clamp, ease, ep, lerp } from '../core/util.js';

export class Cold {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.bg = new Background();
    this.st = new Stage(30);
    this.mat = specimenMaterial(0, { scale: 1.6 });
    const cells = fracture(cubePoly(1), 38, 7, { radius: 0.5, impact: new THREE.Vector3(0.45, 0.35, 0.45) });
    this.block = new Shatter(cells, this.mat, { impact: new THREE.Vector3(0.6, 0.45, 0.6) });
    this.blockRoot = new THREE.Group();
    this.blockRoot.add(this.block.group);
    this.st.scene.add(this.blockRoot);
    this.earthMat = planetMaterial(KIND.earth);
    this.earth = new THREE.Mesh(sphereGeometry(1, 128), this.earthMat);
    this.atm = new THREE.Mesh(sphereGeometry(1.06, 64), atmosphereMaterial());
    this.earthRoot = new THREE.Group();
    this.earthRoot.add(this.earth, this.atm);
    this.st.scene.add(this.earthRoot);
    this.l = new Layer2D(0);
    this.g = new Layer2D(1);
  }
  render(t, rt) {
    const r = this.app.renderer;
    const S = scene('cold');
    const hit = cue('cold', 0, '打碎');
    const planet = cue('cold', 0, '星球');
    const q2 = line('cold', 1).t0;
    const titleT = line('cold', 2).t0;
    const tau = t - hit;
    this.bg.draw(r, rt, t, { poolX: 0.5, poolY: 0.5, grid: ep(0.5, 3, t) * 0.8, warm: 0.4 });

    // block: slow turn, break, debris cloud drifts left as the planet arrives
    const split = ep(planet - 0.2, planet + 1.4, t, ease.inOutCubic);
    const recede = ep(titleT - 0.2, titleT + 1.2, t, ease.inOutCubic);
    this.blockRoot.rotation.set(0.42, -0.6 + t * 0.12, 0.08);
    this.blockRoot.position.set(lerp(0, -1.75, split) - recede * 1.6, lerp(0, 0.28, split), -recede * 2.5);
    this.blockRoot.scale.setScalar(lerp(1, 0.78, split));
    this.block.set(tau, { mode: 'fly', power: 0.9, drag: 2.4, gravity: 0, shake: tau > -0.4 && tau < 0 ? 0.003 : 0 });
    const mu = this.mat.uniforms;
    mu.uCrack.value = tau > 0 ? Math.exp(-tau * 3) * 0.55 : 0;
    mu.uTime.value = t;
    mu.uAlpha.value = 1 - recede * 0.7;

    const ein = ep(planet - 0.3, planet + 1.6, t, ease.outCubic);
    this.earthRoot.position.set(lerp(6.5, 1.75, ein) + recede * 1.6, 0.28, -recede * 2.5);
    this.earthRoot.scale.setScalar(lerp(1.4, 0.95, ein) * (ein > 0 ? 1 : 0.0001));
    this.earthMat.uniforms.uTint.value.setScalar(1 - recede * 0.75);
    this.atm.material.uniforms.uK.value = 1 - recede * 0.75;
    this.earth.rotation.y = t * 0.04;
    this.earthMat.uniforms.uSpin.value = 0;
    this.earthMat.uniforms.uCloudSpin.value = t * 0.006;
    this.earthMat.uniforms.uSun.value.set(-1, 0.25, 0.75);
    this.atm.material.uniforms.uSun.value.set(-1, 0.25, 0.75);
    const cz = lerp(5.4, 7.2, split);
    this.st.look(0, 0.25, cz, 0, 0, 0, 30);
    this.st.syncCam();
    this.st.render(r, rt);

    // 2D
    const c = this.l.begin();
    const g = this.g.begin();
    // impact flash + shock ring at the hit point
    if (tau > -0.05 && tau < 1.2) {
      const [sx, sy] = this.st.toScreen(new THREE.Vector3(0.5, 0.42, 0.5).applyMatrix4(this.blockRoot.matrixWorld));
      g.save();
      g.globalCompositeOperation = 'lighter';
      const a = Math.exp(-Math.max(tau, 0) * 4);
      const gr = g.createRadialGradient(sx, sy, 0, sx, sy, 160);
      gr.addColorStop(0, `rgba(255,220,170,${a})`);
      gr.addColorStop(1, 'rgba(255,140,60,0)');
      g.fillStyle = gr;
      g.fillRect(sx - 160, sy - 160, 320, 320);
      g.strokeStyle = `rgba(255,230,200,${a * 0.8})`;
      g.lineWidth = 2;
      g.beginPath();
      g.arc(sx, sy, 20 + Math.max(tau, 0) * 700, 0, Math.PI * 2);
      g.stroke();
      g.restore();
    }
    // two questions under the two objects
    const lab = ep(q2 - 0.1, q2 + 0.7, t) * (1 - recede);
    if (lab > 0) {
      const amber = LEDGER[1].col, violet = LEDGER[3].col;
      c.save();
      c.globalAlpha = lab;
      c.textAlign = 'center';
      c.font = font(F.serif, 40);
      c.fillStyle = C.ink;
      c.fillText('打碎它，要多少能量？', 610, 812);
      c.fillText('拆散它，要多少能量？', 1310, 812);
      tag(c, '单位体积 · J/cc', 610, 858, amber, 18, 'center', 3);
      tag(c, '整颗天体 · J', 1310, 858, violet, 18, 'center', 3);
      c.strokeStyle = C.faint;
      c.lineWidth = 1;
      ln(c, 960, 300, 960, 860, ep(q2 - 0.2, q2 + 0.6, t));
      c.restore();
    }
    // title, ruled like a ledger page
    const tp = ep(titleT + 0.2, titleT + 1.2, t, ease.outCubic);
    if (tp > 0) {
      c.save();
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.globalAlpha = tp;
      c.font = font(F.serifH, 120);
      c.fillStyle = C.ink;
      tracking(c, 10);
      c.fillText('破坏的账本', 966, 470 + (1 - tp) * 24);
      tracking(c, 0);
      c.font = font(F.mono, 18);
      c.fillStyle = C.dim;
      tracking(c, 8);
      c.fillText('MATERIALS · ENERGY · FIVE LEDGERS', 966, 560);
      c.restore();
      for (let k = 0; k < 5; k++) {
        c.strokeStyle = rgba(LEDGER[k].col, 0.9);
        c.lineWidth = 2;
        const y = 610 + k * 14;
        ln(c, 960 - 330, y, 960 + 330, y, ep(titleT + 0.5 + k * 0.12, titleT + 1.4 + k * 0.12, t, ease.inOutCubic));
      }
    }
    this.g.draw(r, rt, { boost: 2.2 });
    this.l.draw(r, rt);
    const fade = clamp(t / 0.8);
    return { hud: ep(titleT + 1.5, S.t1, t), ledger: -1, bloom: 0.9, exposure: fade, vig: 0.7, grain: 0.04, ca: 0.0025 };
  }
}
