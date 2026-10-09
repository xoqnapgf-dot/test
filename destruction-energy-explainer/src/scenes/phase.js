// 05 PHASE — melting and boiling are a different mechanism from breaking: every bond in the
// volume has to be loosened, not just a few crack surfaces opened. An ice cube melts and boils
// off; a basalt block glows and evaporates. Right: a log chart that puts the numbers side by side.
import { Background, Layer2D, Stage, THREE } from './base.js';
import { specimenMaterial } from '../gfx/specimen.js';
import { cue, line } from '../core/narr.js';
import { F, font } from '../core/type.js';
import { C, LEDGER, rgba } from '../core/style.js';
import { line as ln, tag, polyline, bracket, vbracket } from '../gfx/draw.js';
import { clamp, ease, ep, lerp, hash1 } from '../core/util.js';

const RED = LEDGER[2].col, AMB = LEDGER[1].col;
const AX0 = 960, DEC = 205, E0 = 1, E1 = 5;
const xOf = (v) => AX0 + (Math.log10(v) - E0) * DEC;
const AY = 790;
const ROWS = [
  { name: '水 · 熔化', v: 334, txt: '334', col: RED, y: 330, cue: ['phase', 1, '三百三十四'] },
  { name: '水 · 汽化', v: 2257, txt: '≈2 257', col: RED, y: 410, cue: ['phase', 1, '两千两百'] },
  { name: '玄武岩 · 打碎', v: 100, txt: '≈100', col: AMB, y: 520, cue: ['phase', 2, '玄武岩'] },
  { name: '玄武岩 · 汽化', v: 25000, txt: '≈25 000', col: RED, y: 600, cue: ['phase', 2, '两万五千'] },
];

function boxGeo() {
  const g = new THREE.BoxGeometry(1, 1, 1, 20, 20, 20);
  const pos = g.attributes.position;
  g.setAttribute('aP0', new THREE.Float32BufferAttribute(pos.array.slice(), 3));
  g.setAttribute('aInner', new THREE.Float32BufferAttribute(new Float32Array(pos.count), 1));
  return g;
}

export class Phase {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.bg = new Background();
    this.st = new Stage(30);
    this.st.look(0, 0.6, 9, 0, 0, 0, 30);
    const g = boxGeo();
    this.iceMat = specimenMaterial(9, { scale: 1.2 });
    this.ice = new THREE.Mesh(g, this.iceMat);
    this.rockMat = specimenMaterial(6, { scale: 1.6, side: THREE.DoubleSide });
    this.rock = new THREE.Mesh(g, this.rockMat);
    this.st.scene.add(this.ice, this.rock);
    this.l = new Layer2D(0);
    this.g = new Layer2D(1);
  }
  render(t, rt) {
    const r = this.app.renderer;
    const st = this.st;
    const L = (i) => line('phase', i);
    const l0 = L(0), l1 = L(1), l2 = L(2), l3 = L(3);
    const melt = cue('phase', 1, '熔化要'), boil = cue('phase', 1, '烧干');
    const vap = cue('phase', 2, '汽化');
    this.bg.draw(r, rt, t, { poolX: 0.25, poolY: 0.5, grid: 0.85, warm: 0.5 * ep(l2.t0, vap + 2, t) });

    const u = st.unit(9);
    const home = st.place(450, 500, 9);
    // ice: melts into a puddle, then boils away
    const iceA = ep(l0.t0 - 0.2, l0.t0 + 0.8, t) * (1 - ep(l2.t0 - 0.5, l2.t0 + 0.2, t));
    const m = ep(melt, melt + 2.4, t, ease.inOutCubic);
    const b = ep(boil, boil + 2.6, t, ease.inOutCubic);
    this.ice.visible = iceA > 0.001 && b < 0.999;
    const s0 = u * 200;
    this.ice.scale.set(s0 * lerp(1, 1.5, m), s0 * lerp(1, 0.08, m) * (1 - b * 0.9), s0 * lerp(1, 1.5, m));
    this.ice.position.copy(home);
    this.ice.position.y -= (s0 - this.ice.scale.y) * 0.5;
    this.ice.rotation.set(0, -0.6 + t * 0.12, 0);
    this.iceMat.uniforms.uAlpha.value = iceA * (1 - b);
    // basalt: heats, glows, evaporates
    const rockA = ep(l2.t0 - 0.3, l2.t0 + 0.6, t);
    this.rock.visible = rockA > 0.001;
    this.rock.position.copy(home);
    this.rock.scale.setScalar(s0 * lerp(0.7, 1, rockA));
    this.rock.rotation.set(0.35, -0.6 + t * 0.12, 0.08);
    const ru = this.rockMat.uniforms;
    ru.uHeat.value = 0.48 * ep(l2.t0 - 0.2, l2.t0 + 2.6, t, ease.inOutQuad);
    ru.uDissolve.value = 0.72 * ep(l2.t0 + 2.4, l2.t0 + 10, t, ease.inOutQuad);
    ru.uTime.value = t;
    ru.uAlpha.value = rockA;
    st.syncCam();
    st.render(r, rt);

    const c = this.l.begin();
    const g = this.g.begin();
    c.save();
    c.globalAlpha = ep(l0.t0 - 0.2, l0.t0 + 0.6, t);
    c.font = font(F.serif, 44);
    c.fillStyle = C.ink;
    c.fillText('相变能量', 120, 178);
    c.font = font(F.monoB, 26);
    c.fillStyle = RED;
    c.fillText('J/cc', 330, 178);
    c.font = font(F.sans, 20);
    c.fillStyle = C.dim;
    c.fillText('打碎只开几道裂面；熔化、汽化要松开整块体积里的每一个键', 120, 216);
    c.restore();
    // labels under the specimen
    const lab = (txt, sub, a) => {
      if (a <= 0) return;
      c.save();
      c.globalAlpha = a;
      c.textAlign = 'center';
      c.font = font(F.sansB, 26);
      c.fillStyle = C.ink;
      c.fillText(txt, 450, 760);
      tag(c, sub, 450, 796, C.dim, 14, 'center', 2);
      c.restore();
    };
    const state = t < melt ? '冰' : t < boil ? '水' : '水蒸气';
    lab(`1 cm³ ${state}`, '0 °C → 100 °C', iceA * (1 - ep(boil + 2, boil + 2.6, t)));
    lab(t < l2.t0 + 2.4 ? '1 cm³ 玄武岩' : '1 cm³ 玄武岩 → 蒸气', t < l2.t0 + 2.4 ? '加热 → 熔融' : '≈ 2.5 万 J', rockA);
    // steam off the boiling water / rock vapour
    const steam = Math.max(clamp(b * 3) * (1 - ep(boil + 2.4, boil + 3.2, t)), ep(l2.t0 + 2.4, l2.t0 + 4, t) * 0.8);
    if (steam > 0.01) {
      g.save();
      g.globalAlpha = steam;
      g.strokeStyle = t > l2.t0 ? 'rgba(255,160,100,0.5)' : 'rgba(200,225,255,0.5)';
      g.lineWidth = 2;
      for (let k = 0; k < 7; k++) {
        const bx = 380 + k * 24;
        const pts = [];
        for (let j = 0; j < 18; j++) pts.push([bx + Math.sin(j * 0.6 + t * 2.6 + k * 1.7) * (3 + j * 0.9), 520 - j * 12 - ((t * 24 + hash1(k) * 30) % 24)]);
        polyline(g, pts, 1);
      }
      g.restore();
    }

    // log chart
    const ax = ep(l1.t0 - 0.3, l1.t0 + 0.7, t);
    if (ax > 0) {
      c.save();
      c.globalAlpha = ax;
      c.strokeStyle = rgba(C.ink, 0.5);
      c.lineWidth = 1.5;
      ln(c, AX0, AY, xOf(1e5), AY, ax);
      c.font = font(F.mono, 15);
      c.fillStyle = C.dim;
      c.textAlign = 'center';
      for (let e = E0; e <= E1; e++) {
        const x = xOf(10 ** e);
        c.strokeStyle = rgba(C.ink, 0.5);
        ln(c, x, AY, x, AY + 10, 1);
        c.fillText((10 ** e).toLocaleString('en-US'), x, AY + 30);
        c.strokeStyle = C.grid;
        ln(c, x, 290, x, AY, 1);
      }
      tag(c, 'J/cc · 对数刻度', xOf(1e5), AY + 58, C.dim, 14, 'right', 2);
      ROWS.forEach((row) => {
        const at = cue(...row.cue);
        const p = ep(at - 0.1, at + 0.9, t, ease.outQuart);
        if (p <= 0) return;
        c.globalAlpha = ax * clamp(p * 3);
        c.font = font(F.sansM, 21);
        c.fillStyle = C.ink;
        c.textAlign = 'right';
        c.textBaseline = 'middle';
        c.fillText(row.name, AX0 - 20, row.y);
        const w = (xOf(row.v) - AX0) * p;
        c.fillStyle = row.col;
        c.fillRect(AX0, row.y - 13, w, 26);
        c.textAlign = 'left';
        c.font = font(F.monoB, 21);
        c.fillStyle = C.ink;
        c.fillText(row.txt, AX0 + w + 14, row.y + 1);
      });
      tag(c, '水：仅潜热，不含升温', AX0 - 20, 450, rgba(C.ink, 0.45 * ep(boil, boil + 1, t)), 13, 'right', 1);
      // ratio for basalt
      const rat = ep(cue('phase', 2, '两百多倍') - 0.1, cue('phase', 2, '两百多倍') + 0.7, t);
      if (rat > 0) {
        const x0 = xOf(100), x1 = xOf(25000);
        c.globalAlpha = ax * rat;
        c.strokeStyle = C.ink;
        c.lineWidth = 1.5;
        bracket(c, x0, x1, 650, -1, rat, 12);
        c.font = font(F.monoB, 30);
        c.fillStyle = C.ink;
        c.textAlign = 'center';
        c.fillText('× 250', (x0 + x1) / 2, 690);
      }
      const gr = ep(cue('phase', 2, '花岗岩') - 0.1, cue('phase', 2, '花岗岩') + 0.7, t);
      if (gr > 0) {
        c.globalAlpha = ax * gr;
        c.textAlign = 'left';
        c.font = font(F.sansM, 21);
        c.fillStyle = C.ink;
        c.fillText('花岗岩：汽化 ÷ 粉碎', AX0, 290);
        c.font = font(F.monoB, 24);
        c.fillStyle = RED;
        c.fillText('≈ × 500 – 1 000', AX0 + 220, 290);
      }
      // line 3: two different shelves, 2–3 decades apart
      const q = ep(l3.t0 - 0.1, l3.t0 + 1.0, t, ease.inOutCubic);
      if (q > 0) {
        c.globalAlpha = ax * q;
        c.fillStyle = rgba(AMB, 0.1);
        c.fillRect(xOf(30), 300, (xOf(300) - xOf(30)) * q, AY - 300);
        c.fillStyle = rgba(RED, 0.1);
        c.fillRect(xOf(2000), 300, (xOf(30000) - xOf(2000)) * q, AY - 300);
        c.font = font(F.serifH, 34);
        c.textAlign = 'center';
        c.fillStyle = AMB;
        c.fillText('齑粉', (xOf(30) + xOf(300)) / 2, 860);
        c.fillStyle = RED;
        c.fillText('蒸发', (xOf(2000) + xOf(30000)) / 2, 860);
        c.fillStyle = C.ink;
        c.font = font(F.sansB, 22);
        c.fillText('← 两到三个数量级 →', (xOf(300) + xOf(2000)) / 2, 906);
      }
      c.restore();
    }
    this.g.draw(r, rt, { boost: 1.6 });
    this.l.draw(r, rt);
    return { ledger: 2, bloom: 0.85, vig: 0.62, grain: 0.035, ca: 0.002 };
  }
}
