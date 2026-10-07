// CHORUS — the thunder nave. Gothic arches and torii alternate down an endless aisle
// toward a rose window; lightning answers the kicks; each lyric line is its own shot.
// Variants: ch1 (indigo storm), ch2 (gilded), fc (key change: magenta/white, maximal).
import * as THREE from 'three';
import { Layer2D } from './base.js';
import { Sky } from '../gfx/sky.js';
import { buildNave } from '../gfx/nave.js';
import { makeRoseMaterial } from '../gfx/rosewindow.js';
import { symbolAtlas, SYMBOL_KEYS, EMBLEMS, drawSym } from '../gfx/symbols.js';
import { bolt, drawBolt, strikeI } from '../gfx/lightning.js';
import { drawRaiko } from '../gfx/raiko.js';
import { canvasTexture } from '../core/gl.js';
import { SEC, lines, beatF, B, kickHit, sinceKick, KICK_TIMES, beatPulse, loud } from '../core/music.js';
import { F, font, layoutH, layoutV, REVEAL, caption, glyphV } from '../core/type.js';
import { gloss } from '../core/lyrics-meta.js';
import { clamp, lerp, ease, ep, hash1, fbm1, smooth, win, TAU } from '../core/util.js';

const V = new THREE.Vector3();
const SYMBOL_NAMES = ['CRUX', 'TORII', 'DHARMACAKRA', 'HILĀL', 'MAGEN DAVID', 'KHATAM', 'TAIJITU', 'PADMA'];

const PAL = {
  ch1: { top: [0.02, 0.02, 0.07], mid: [0.1, 0.04, 0.18], low: [0.36, 0.07, 0.12], rim: [1.0, 0.36, 0.18], win: [0.3, 0.13, 0.22], fog: [0.03, 0.02, 0.06] },
  ch2: { top: [0.05, 0.02, 0.04], mid: [0.2, 0.06, 0.08], low: [0.55, 0.16, 0.06], rim: [1.0, 0.62, 0.22], win: [0.4, 0.22, 0.12], fog: [0.06, 0.025, 0.03] },
  fc: { top: [0.03, 0.01, 0.07], mid: [0.22, 0.03, 0.22], low: [0.62, 0.08, 0.32], rim: [1.0, 0.4, 0.62], win: [0.45, 0.16, 0.36], fog: [0.07, 0.015, 0.08] },
};

export class Chorus {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.scene = new THREE.Scene();
    this.cam = new THREE.PerspectiveCamera(60, 16 / 9, 0.1, 1500);
    this.sky = new Sky();
    this.nave = buildNave();
    this.scene.add(this.nave.group);
    const atlas = symbolAtlas(SYMBOL_KEYS, 256);
    this.symTex = canvasTexture(atlas);
    this.rose = new THREE.Mesh(new THREE.CircleGeometry(this.nave.P.roseR, 96), makeRoseMaterial(this.symTex, SYMBOL_KEYS.length));
    this.rose.position.set(0, this.nave.P.roseY, this.nave.P.roseZ);
    this.scene.add(this.rose);
    // stone ring frame with a gilded edge
    const R = this.nave.P.roseR;
    const frame = new THREE.Mesh(new THREE.RingGeometry(R * 0.995, R * 1.1, 128, 1), new THREE.MeshBasicMaterial({ color: 0x0b090c }));
    frame.position.copy(this.rose.position).add(new THREE.Vector3(0, 0, 0.05));
    this.scene.add(frame);
    const edgePts = [];
    for (let i = 0; i <= 256; i++) {
      const a = (i / 256) * Math.PI * 2;
      edgePts.push(new THREE.Vector3(Math.cos(a) * R * 1.1, Math.sin(a) * R * 1.1, 0));
    }
    this.ringLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(edgePts), new THREE.LineBasicMaterial({ color: new THREE.Color(2.2, 1.5, 0.7) }));
    this.ringLine.position.copy(frame.position);
    this.scene.add(this.ringLine);
    this.layer = new Layer2D(0);
    this.glow = new Layer2D(1);
    // a flock of doves (ch2 / fc) — billboards, stateless flight down the nave
    const dc = document.createElement('canvas');
    dc.width = dc.height = 256;
    const dctx = dc.getContext('2d');
    dctx.fillStyle = '#fff';
    drawSym(dctx, EMBLEMS.dove, 128, 128, 110);
    const NB = 90;
    const bg = new THREE.InstancedBufferGeometry().copy(new THREE.PlaneGeometry(1, 1));
    const seeds = new Float32Array(NB);
    for (let i = 0; i < NB; i++) seeds[i] = i / NB;
    bg.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
    bg.instanceCount = NB;
    this.birdMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uOn: { value: 0 }, uCamZ: { value: 0 }, tDove: { value: canvasTexture(dc) }, uFog: { value: new THREE.Color() } },
      vertexShader: /* glsl */ `
        attribute float aSeed; uniform float uTime, uCamZ; varying vec2 vUv; varying float vD;
        void main(){
          vUv = uv;
          float s = aSeed;
          float z = uCamZ - 6. - mod(uTime*(14. + s*10.) + s*260., 220.);
          vec3 c = vec3(sin(s*91.+uTime*0.8)*9., 6. + sin(s*47. + uTime*1.3)*4. + s*10., z);
          float flap = 0.35 + 0.65*abs(sin(uTime*(9.+s*6.) + s*30.));
          vec4 mv = viewMatrix * vec4(c, 1.);
          float sz = 1.4 + s*1.2;
          mv.xy += position.xy * vec2(sz, sz*flap);
          vD = -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D tDove; uniform float uOn; uniform vec3 uFog; varying vec2 vUv; varying float vD;
        void main(){
          float a = texture2D(tDove, vUv).a * uOn;
          if(a < 0.05) discard;
          float fog = 1. - exp(-pow(vD*0.006, 1.4));
          vec3 c = mix(vec3(1.6,1.5,1.4), uFog, fog);
          gl_FragColor = vec4(c, a*(1.-fog*0.8));
        }`,
      transparent: true, depthWrite: false,
    });
    this.birds = new THREE.Mesh(bg, this.birdMat);
    this.birds.frustumCulled = false;
    this.scene.add(this.birds);
    // per-variant line lists
    this.V = {};
    for (const k of ['ch1', 'ch2', 'fc']) {
      const ls = lines(k);
      const cuts = ls.map((l, i) => (i === 0 ? SEC[k][0] : B(Math.round(beatF(l.t0 - 0.1)))));
      this.V[k] = { key: k, t0: SEC[k][0], t1: SEC[k][1], ls, cuts };
    }
  }

  variant(t) {
    if (t < SEC.post[0] + 2) return this.V.ch1;
    if (t < SEC.inter[0] + 2) return this.V.ch2;
    return this.V.fc;
  }

  // ---------- camera per shot
  camera(v, si, u, t, lt) {
    const c = this.cam;
    const P = this.nave.P;
    const roseY = P.roseY, roseZ = P.roseZ;
    let pos = [0, 4, 0], look = [0, roseY, roseZ], fov = 60, roll = 0;
    const mirror = v.key === 'ch2' ? -1 : 1;
    switch (si) {
      case 0: {
        const e = ease.outQuart(u);
        if (v.key === 'ch2') {
          // crane down from above the arches into the aisle
          pos = [Math.sin(t * 0.7) * 0.6, lerp(34, 4.5, ease.inOutCubic(u)), lerp(-10, -70, e)];
          look = [0, lerp(0, roseY * 0.8, ease.inOutCubic(u)), roseZ];
          fov = lerp(70, 58, e);
        } else {
          pos = [Math.sin(t * 0.7) * 0.6, 4.2 + Math.sin(u * 3) * 0.4, lerp(v.key === 'fc' ? 40 : 14, -70, e)];
          look = [0, roseY * 0.8, roseZ];
          fov = lerp(v.key === 'fc' ? 92 : 78, 58, e);
          roll = (1 - e) * (v.key === 'fc' ? 0.35 : 0.12) * mirror;
        }
        break;
      }
      case 1: {
        const e = ease.inOutCubic(u);
        pos = [0, lerp(4, 7, e), lerp(-74, -96, u)];
        look = [0, lerp(roseY, 160, e), lerp(roseZ, -110, e)];
        fov = lerp(60, 82, e);
        roll = e * 0.25 * mirror;
        break;
      }
      case 2: {
        pos = [Math.sin(u * 2) * 1.5, 13.6, lerp(-170, -205, ease.outCubic(u))];
        look = [0, roseY, roseZ];
        fov = 52;
        break;
      }
      case 3: {
        if (v.key === 'fc') {
          // wide high view: the arches light up beat by beat
          pos = [lerp(-14, 14, u), 38, lerp(14, -24, u)];
          look = [0, 2, -150];
          fov = 62;
          roll = 0.05;
        } else {
          pos = [0, roseY, lerp(-258, -266, u)];
          look = [0, roseY, roseZ];
          fov = 58;
          roll = beatF(t) * 0.09 * mirror;
        }
        break;
      }
      case 4: {
        // lateral truck: arches rush past
        pos = [-4.8 * mirror, 2.2, lerp(-30, -150, u)];
        look = [9 * mirror, 5.5, lerp(-36, -156, u)];
        fov = 74;
        roll = -0.06 * mirror;
        break;
      }
      case 5: {
        if (v.key === 'ch2') {
          // high angle looking down the aisle
          pos = [lerp(-6, 6, u), 30, lerp(-110, -130, u)];
          look = [0, 3, -175];
          fov = 60;
        } else if (v.key === 'fc') {
          // orbit low around the aisle centre
          const a2 = lerp(-0.6, 0.6, u);
          pos = [Math.sin(a2) * 9, 2.2, -150 + Math.cos(a2) * 9];
          look = [0, 12, -175];
          fov = 72;
        } else {
          pos = [0, 1.4, lerp(-128, -140, u)];
          look = [0, 14, -168];
          fov = 70;
        }
        break;
      }
      case 6: {
        const cut = v.ls[6].c[3]; // 切
        const after = t > cut;
        pos = [0, after ? 5 : 3, after ? lerp(-150, -185, ep(cut, v.cuts[7] ?? cut + 2, t)) : lerp(-112, -120, u)];
        look = after ? [0, roseY, roseZ] : [0, 6, -200];
        fov = after ? 64 : 48;
        roll = after ? (1 - ep(cut, cut + 0.6, t)) * 0.4 : 0;
        break;
      }
      case 7: {
        const e = ease.inOutCubic(u);
        pos = [0, roseY - 3 + e * 1, lerp(-236, -205, e)];
        look = [0, roseY, roseZ];
        fov = lerp(48, 56, e);
        break;
      }
    }
    // kick shake
    const k = kickHit(t, 14) * (si === 3 ? 0.3 : 1);
    const sh = 0.18 * k;
    c.position.set(pos[0] + fbm1(t * 30, 1) * sh, pos[1] + fbm1(t * 30, 2) * sh, pos[2]);
    c.up.set(Math.sin(roll), Math.cos(roll), 0);
    c.lookAt(look[0], look[1], look[2]);
    c.fov = fov * (1 - k * 0.015);
    c.updateProjectionMatrix();
  }

  render(t, rt) {
    const r = this.app.renderer;
    const v = this.variant(t);
    const pal = PAL[v.key];
    // shot index
    let si = 0;
    for (let i = 0; i < v.cuts.length; i++) if (t >= v.cuts[i]) si = i;
    const s0 = v.cuts[si], s1 = v.cuts[si + 1] ?? v.t1;
    const u = clamp((t - s0) / (s1 - s0));
    const line = v.ls[si];
    this.camera(v, si, u, t, t - s0);

    // ---- lightning schedule: strikes on kicks (density by variant) + scripted on カミナレ
    const dens = v.key === 'fc' ? 0.6 : v.key === 'ch2' ? 0.45 : 0.36;
    const strikes = [];
    // binary-searchless scan over a short window
    for (let i = 0; i < KICK_TIMES.length; i++) {
      const kt = KICK_TIMES[i];
      if (kt > t) break;
      if (kt < t - 0.6 || kt < v.t0 - 0.05) continue;
      if (hash1(i * 7 + 3) < dens) strikes.push({ age: t - kt, seed: i });
    }
    if (si === 0 || si === 4) {
      line.c.forEach((ct, i) => {
        if (line.text[i] !== ' ' && i >= 3 && t >= ct - 0.04 && t < ct + 0.6) strikes.push({ age: t - ct + 0.04, seed: 900 + i + si * 10, char: i });
      });
    }
    let flash = 0;
    for (const s of strikes) flash = Math.max(flash, strikeI(s.age, s.seed));

    // ---- uniforms
    const sh = this.nave.shared;
    const kh = kickHit(t, 6);
    sh.uCam.value.copy(this.cam.position);
    sh.uFlash.value = flash * 0.9;
    sh.uPulse.value = Math.exp(-sinceKick(t) * 2.5) * (v.key === 'ch1' ? 0.8 : 1.1);
    sh.uPulseZ.value = this.cam.position.z - 6 - sinceKick(t) * 110;
    sh.uFog.value.setRGB(...pal.fog);
    sh.uWin.value.setRGB(...pal.win.map((x) => x * (1 + kh * 0.6)));
    this.nave.pMat.uniforms.uTime.value = t;
    const bu = this.birdMat.uniforms;
    bu.uTime.value = t;
    bu.uCamZ.value = this.cam.position.z;
    bu.uOn.value = v.key === 'ch1' ? 0 : 1;
    bu.uFog.value.setRGB(...pal.fog);
    if (v.key === 'fc' && si === 3) {
      // four-beat equality: the pulse becomes a 1-2-3-4 sweep down the aisle
      const b = beatF(t);
      sh.uPulseZ.value = -20 - (Math.floor(b) % 4) * 36 - (b % 1) * 20;
      sh.uPulse.value = 1.6 * Math.exp(-(b % 1) * 2);
    }
    const ru = this.rose.material.uniforms;
    ru.uTime.value = t;
    ru.uGlow.value = (v.key === 'fc' ? 1.45 : 1.25) * (1 + kh * 0.3) + (si === 7 ? ep(s0, s1, t) * (v.key === 'fc' ? 0.35 : 0.6) : 0);
    ru.uFlash.value = flash * 0.4;
    ru.uBeat.value = beatPulse(t, 1, 5);
    ru.uHue.value = v.key === 'fc' ? 0.12 : v.key === 'ch2' ? 0.35 : 0;
    const kal = si === 3 && v.key !== 'fc';
    ru.uKal.value = kal ? 1 : 0;
    const bf = beatF(t);
    ru.uRot1.value = kal ? bf * 0.18 : t * 0.02;
    ru.uRot2.value = kal ? -bf * 0.12 : -t * 0.015;
    ru.uRot3.value = kal ? bf * 0.09 : t * 0.01;
    const symI = Math.floor(bf);
    ru.uSymA.value = ((symI - 1) % 8 + 8) % 8;
    ru.uSymB.value = (symI % 8 + 8) % 8;
    ru.uSymMix.value = si === 2 || si === 3 ? clamp((bf % 1) * 5) : 1;
    if (si !== 2 && si !== 3) {
      ru.uSymA.value = ru.uSymB.value = 5; // octagram at rest
    }

    // ---- draw: sky, 3D, 2D
    const flashDir = V.set(Math.sin((strikes[0]?.seed ?? 0) * 1.7) * 0.8, 0.7, -1);
    this.sky.draw(r, rt, this.cam, {
      time: t, warp: si === 1 ? ep(s0, s1, t, ease.inOutCubic) * 1.1 : si === 3 && kal ? 0.15 : 0, flash, pal,
      flashDir, swirl: [0.5, 0.72], dark: si === 6 && t < line.c[3] ? 0.6 : 0,
    });
    r.setRenderTarget(rt);
    r.render(this.scene, this.cam);

    const c = this.layer.begin();
    const g = this.glow.begin();
    this.draw2D(c, g, t, v, si, u, s0, s1, line, strikes);
    this.glow.draw(r, rt, { boost: 2.6, time: t });
    this.layer.draw(r, rt, { warp: si === 1 ? ep(s0, s1, t) * 0.02 : 0, time: t });

    // ---- fx
    const fx = {
      hudInk: 'light', bloom: v.key === 'fc' ? (si === 7 ? 0.95 : 1.25) : si === 7 ? 0.95 : 1.1, ca: 0.0035 + kh * 0.006,
      bloomThresh: 0.95, grain: 0.055, vig: 0.65, flash: flash * 0.12, exposure: 1 + flash * 0.25,
      rays: si === 7 ? (v.key === 'fc' ? 0.3 : 0.4) : si === 2 || si === 3 ? 0.5 : 0.25, raysX: 0.5, raysY: si === 2 || si === 7 ? 0.5 : 0.62, raysLen: 0.5,
      hue: v.key === 'fc' ? -0.12 : 0,
      contrast: 1.06, sat: 1.08,
    };
    // 切 — slash moment
    if (si === 6) {
      const cut = line.c[3];
      const a = t - cut;
      if (a > -0.02 && a < 0.5) {
        fx.flash = Math.max(fx.flash, Math.exp(-Math.max(a, 0) * 9) * 0.9);
        fx.invert = a < 0.07 ? 1 : 0;
        fx.ca = 0.03 * Math.exp(-a * 6);
      }
      if (t < cut) {
        fx.sat = 0.15;
        fx.contrast = 1.2;
      }
    }
    if (si === 0 && u < 0.08) fx.flash = Math.max(fx.flash, (1 - u / 0.08) * 0.8);
    return fx;
  }

  // ---------- 2D: lightning + typography per shot
  draw2D(c, gc, t, v, si, u, s0, s1, line, strikes) {
    // lightning (behind type)
    for (const s of strikes) {
      const I = strikeI(s.age, s.seed);
      if (I <= 0) continue;
      let x0, y0, x1, y1;
      if (s.char !== undefined && this._charPos) {
        const p = this._charPos[s.char];
        if (!p) continue;
        x0 = p[0] + (hash1(s.seed) - 0.5) * 400;
        y0 = -20;
        x1 = p[0];
        y1 = p[1] - 60;
      } else {
        x0 = 200 + hash1(s.seed * 3) * 1520;
        y0 = -30;
        x1 = x0 + (hash1(s.seed * 5) - 0.5) * 700;
        y1 = 280 + hash1(s.seed * 11) * 420;
      }
      const segs = bolt(x0, y0, x1, y1, s.seed, { branch: 0.7, depth: 2, w: 3.2 });
      drawBolt(gc, segs, I, clamp(s.age / 0.05), v.key === 'fc' ? [255, 170, 235] : [190, 210, 255]);
    }
    this._charPos = null;
    const G = gloss(line);
    const ink = '#f1e8da';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    const shadow = (blur = 30, col = 'rgba(0,0,0,0.55)') => {
      c.shadowColor = col;
      c.shadowBlur = blur;
    };
    const noShadow = () => {
      c.shadowBlur = 0;
      c.shadowColor = 'transparent';
    };
    const sub = (y, a = 1) => {
      c.save();
      c.globalAlpha = a * clamp((t - line.t0) * 3);
      c.font = font(F.serif, 30);
      c.fillStyle = 'rgba(245,232,210,0.85)';
      if ('letterSpacing' in c) c.letterSpacing = '6px';
      c.fillText(G.toUpperCase(), 960, y);
      c.restore();
    };

    if (si === 0 || si === 4) {
      // さあ カミナレ
      const vertical = si === 4;
      const sz = vertical ? 200 : 290;
      c.font = font(F.gothic, sz);
      let gl;
      if (!vertical) {
        gl = layoutH(c, 'カミナレ', 960, 560, sz, -6);
      } else {
        gl = layoutV('カミナレ', 1450 * (v.key === 'ch2' ? 1 : 1), 120, sz, 1.02);
        if (v.key === 'ch2') gl.forEach((g) => (g.x = 470));
      }
      this._charPos = {};
      gl.forEach((g, k) => (this._charPos[k + 3] = [g.x, g.y]));
      // さあ
      c.save();
      c.font = font(F.mincho, 70);
      c.fillStyle = ink;
      const sa = layoutH(c, 'さあ', vertical ? (v.key === 'ch2' ? 760 : 1160) : 960, vertical ? 300 : 300, 70, 30);
      shadow(30);
      sa.forEach((g, k) => REVEAL.rise(c, g, clamp((t - line.c[k] + 0.05) / 0.25), 70));
      c.restore();
      // カミナレ slam with glow + red offset echo
      c.save();
      c.font = font(F.gothic, sz);
      gl.forEach((g, k) => {
        const ci = k + 3;
        const p = clamp((t - line.c[ci] + 0.04) / 0.22);
        if (p <= 0) return;
        const hit = Math.exp(-(t - line.c[ci]) * 6);
        c.save();
        c.globalCompositeOperation = 'lighter';
        c.fillStyle = `rgba(227,64,42,${0.55 * clamp(p * 3)})`;
        const off = 10 + hit * 26;
        const gg = { ...g, x: g.x + off, y: g.y + off * 0.4 };
        if (vertical) {
          c.save();
          c.translate(gg.x, gg.y);
          glyphV(c, g.ch, 0, 0, sz);
          c.restore();
        } else c.fillText(g.ch, gg.x, gg.y);
        c.restore();
        c.fillStyle = ink;
        shadow(40 + hit * 60, `rgba(255,220,180,${0.3 + hit * 0.6})`);
        REVEAL.slam(c, g, p, sz, vertical);
        noShadow();
      });
      c.restore();
      if (!vertical) {
        c.save();
        c.font = font(F.mincho, 34);
        c.fillStyle = 'rgba(242,213,138,0.9)';
        if ('letterSpacing' in c) c.letterSpacing = '22px';
        c.globalAlpha = clamp((t - line.c[6]) * 2);
        c.fillText('神 鳴 れ', 960, 760);
        c.restore();
        sub(820);
      } else {
        sub(1000);
      }
    } else if (si === 1) {
      // 空までゆがませて — set on a swirling arc
      const e = ep(s0, s1, t, ease.inOutCubic);
      c.save();
      c.font = font(F.gothic, 132);
      c.fillStyle = ink;
      shadow(30);
      const txt = line.text;
      const R0 = 520 - e * 120;
      const cx = 960, cy = 760;
      for (let i = 0; i < txt.length; i++) {
        const p = clamp((t - line.c[i] + 0.05) / 0.3);
        if (p <= 0) continue;
        const ang = -Math.PI / 2 + (i - (txt.length - 1) / 2) * (0.19 + e * 0.03) + e * 0.25 + Math.sin(t * 2 + i) * 0.02 * e;
        c.save();
        c.translate(cx + Math.cos(ang) * R0, cy + Math.sin(ang) * R0);
        c.rotate(ang + Math.PI / 2);
        c.globalAlpha = clamp(p * 2);
        const s = 1 + (1 - ease.outBack(p)) * 0.5;
        c.scale(s, s);
        c.fillText(txt[i], 0, 0);
        c.restore();
      }
      c.restore();
      sub(980);
    } else if (si === 2) {
      // 誰の神だって｜構わない flanking the window; symbol name ticker
      c.save();
      c.font = font(F.mincho, 96);
      c.fillStyle = ink;
      shadow(30);
      const a = layoutV('誰の神だって', 330, 180, 96, 1.06);
      const b = layoutV('構わない', 1590, 300, 96, 1.06);
      b.forEach((g) => (g.i += 6));
      for (const g of [...a, ...b]) REVEAL.ink(c, g, clamp((t - line.c[g.i] + 0.05) / 0.3), 96, true);
      noShadow();
      const bf = beatF(t);
      const k = ((Math.floor(bf) % 8) + 8) % 8;
      c.font = font(F.mono, 22);
      c.fillStyle = 'rgba(242,213,138,0.95)';
      if ('letterSpacing' in c) c.letterSpacing = '9px';
      c.globalAlpha = 0.9;
      c.fillText(`${String(k + 1).padStart(2, '0')} / 08 — ${SYMBOL_NAMES[k]}`, 960, 930);
      c.restore();
      sub(990);
    } else if (si === 3) {
      if (v.key === 'fc') {
        // この拍の上 / 誰もが平等 with 1·2·3·4 counter
        c.save();
        c.font = font(F.gothic, 120);
        c.fillStyle = ink;
        shadow(30);
        const a = layoutH(c, 'この拍の上', 960, 330, 120, 4);
        a.forEach((g) => REVEAL.rise(c, g, clamp((t - line.c[g.i] + 0.05) / 0.25), 120));
        const b = layoutH(c, '誰もが平等', 960, 620, 120, 4);
        b.forEach((g) => {
          g.i += 6;
          REVEAL.rise(c, g, clamp((t - line.c[g.i] + 0.05) / 0.25), 120);
        });
        noShadow();
        const bf = beatF(t);
        c.font = font(F.mono, 64);
        for (let i = 0; i < 4; i++) {
          const on = Math.floor(bf) % 4 === i;
          c.fillStyle = on ? '#ff5aa0' : 'rgba(255,255,255,0.25)';
          c.fillText(String(i + 1), 960 + (i - 1.5) * 150, 820);
        }
        c.restore();
        sub(930);
      } else {
        // サビでは (outline) 宗派も要らない (fill) — on a dark lens so it reads over the glass
        c.save();
        const lens = c.createRadialGradient(960, 520, 60, 960, 520, 760);
        lens.addColorStop(0, 'rgba(8,4,10,0.62)');
        lens.addColorStop(0.6, 'rgba(8,4,10,0.35)');
        lens.addColorStop(1, 'rgba(8,4,10,0)');
        c.fillStyle = lens;
        c.globalAlpha = clamp((t - s0) * 3);
        c.fillRect(0, 0, 1920, 1080);
        c.globalAlpha = 1;
        c.font = font(F.gothic, 230);
        c.lineWidth = 3;
        c.strokeStyle = 'rgba(255,240,220,0.95)';
        const a = layoutH(c, 'サビでは', 960, 380, 230, 0);
        for (const g of a) {
          const p = clamp((t - line.c[g.i] + 0.05) / 0.2);
          if (p <= 0) continue;
          c.save();
          c.translate(g.x, g.y);
          const s = 1 + (1 - ease.outExpo(p)) * 0.8;
          c.scale(s, s);
          c.strokeText(g.ch, 0, 0);
          c.restore();
        }
        c.font = font(F.mincho, 92);
        c.fillStyle = ink;
        shadow(24);
        const b = layoutH(c, '宗派も要らない', 960, 660, 92, 18);
        b.forEach((g) => {
          g.i += 4;
          REVEAL.ink(c, g, clamp((t - line.c[g.i] + 0.05) / 0.3), 92, false);
        });
        c.restore();
        sub(800);
      }
    } else if (si === 5) {
      // 少女の声が ヤイバ になって — a blade of light forms horizontally
      const yb = 560;
      const prog = ep(line.c[5] - 0.1, line.c[7] + 0.2, t, ease.outCubic);
      if (prog > 0) {
        gc.save();
        gc.globalCompositeOperation = 'lighter';
        const L = 1700 * prog;
        const g = gc.createLinearGradient(960 - L / 2, 0, 960 + L / 2, 0);
        g.addColorStop(0, 'rgba(160,190,255,0)');
        g.addColorStop(0.5, 'rgba(255,255,255,1)');
        g.addColorStop(1, 'rgba(160,190,255,0)');
        gc.fillStyle = g;
        gc.beginPath();
        gc.moveTo(960 - L / 2, yb);
        gc.quadraticCurveTo(960, yb - 14, 960 + L / 2, yb - 3);
        gc.quadraticCurveTo(960, yb + 6, 960 - L / 2, yb);
        gc.fill();
        // edge crackle bolts along the blade
        for (let k = 0; k < 6; k++) {
          const x = 960 - L / 2 + ((k + 0.5) / 6) * L;
          const segs = bolt(x, yb - 4, x + (hash1(k + 40) - 0.5) * 200, yb - 120 - hash1(k) * 160, 400 + k + Math.floor(t * 12), { branch: 0.3, depth: 1, w: 1.6 });
          drawBolt(gc, segs, 0.5 * prog, 1, [170, 200, 255]);
        }
        gc.restore();
      }
      c.save();
      c.font = font(F.mincho, 64);
      c.fillStyle = ink;
      shadow(20);
      const a = layoutH(c, '少女の声が', 960, 330, 64, 14);
      a.forEach((g) => REVEAL.ink(c, g, clamp((t - line.c[g.i] + 0.05) / 0.3), 64, false));
      c.font = font(F.gothic, 210);
      const b = layoutH(c, 'ヤイバ', 960, 560, 210, 30);
      b.forEach((g) => {
        g.i += 5;
        const p = clamp((t - line.c[g.i] + 0.04) / 0.2);
        c.save();
        c.globalCompositeOperation = 'source-over';
        shadow(50, 'rgba(160,200,255,0.9)');
        REVEAL.slam(c, g, p, 210, false);
        c.restore();
      });
      c.font = font(F.mincho, 64);
      const d = layoutH(c, 'になって', 960, 780, 64, 14);
      d.forEach((g) => {
        g.i += 8;
        REVEAL.ink(c, g, clamp((t - line.c[g.i] + 0.05) / 0.3), 64, false);
      });
      c.restore();
      sub(880);
    } else if (si === 6) {
      // 沈黙を → 切り裂いて ; the cut splits the type along a diagonal
      const cut = line.c[3];
      const a = t - cut;
      c.save();
      c.font = font(F.gothic, 250);
      const gl = layoutH(c, '沈黙を', 960, 470, 250, 10);
      const drawSilence = () => {
        c.fillStyle = a < 0 ? 'rgba(220,214,206,0.92)' : ink;
        gl.forEach((g) => REVEAL.rise(c, g, clamp((t - line.c[g.i] + 0.05) / 0.4), 250));
      };
      if (a < 0) drawSilence();
      else {
        // two halves sliding apart along the cut line
        const off = ease.outExpo(clamp(a / 0.5)) * 90;
        const ang = -0.38;
        for (const side of [-1, 1]) {
          c.save();
          c.beginPath();
          const nx = Math.sin(ang), ny = -Math.cos(ang);
          // half-plane through (960,470) with normal (nx,ny)
          const big = 4000;
          const px = 960, py = 470;
          const dx = Math.cos(ang) * big, dy = Math.sin(ang) * big;
          c.moveTo(px - dx, py - dy);
          c.lineTo(px + dx, py + dy);
          c.lineTo(px + dx + nx * big * side, py + dy + ny * big * side);
          c.lineTo(px - dx + nx * big * side, py - dy + ny * big * side);
          c.closePath();
          c.clip();
          c.translate(Math.cos(ang) * off * side, Math.sin(ang) * off * side);
          drawSilence();
          c.restore();
        }
        // the white cut line
        const lp = clamp(a / 0.12);
        gc.save();
        gc.globalCompositeOperation = 'lighter';
        gc.strokeStyle = `rgba(255,250,240,${Math.exp(-a * 3)})`;
        gc.lineWidth = 6 * Math.exp(-a * 2) + 1;
        gc.beginPath();
        const ang2 = -0.38;
        gc.moveTo(960 - Math.cos(ang2) * 1400 * lp, 470 - Math.sin(ang2) * 1400 * lp);
        gc.lineTo(960 + Math.cos(ang2) * 1400 * lp, 470 + Math.sin(ang2) * 1400 * lp);
        gc.stroke();
        gc.restore();
      }
      c.font = font(F.mincho, 96);
      c.fillStyle = ink;
      const b = layoutH(c, '切り裂いて', 960, 780, 96, 24);
      b.forEach((g) => {
        g.i += 3;
        REVEAL.slam(c, g, clamp((t - line.c[g.i] + 0.03) / 0.18), 96, false);
      });
      c.restore();
      sub(900);
    } else if (si === 7) {
      // 私たちが / 私たちの神 inside Raijin's drum ring
      const e = ep(s0, s0 + 1.2, t, ease.outCubic);
      // dark heart inside the ring so the words read against the glass
      c.save();
      const heart = c.createRadialGradient(960, 520, 0, 960, 520, 330);
      heart.addColorStop(0, 'rgba(10,4,8,0.72)');
      heart.addColorStop(0.75, 'rgba(10,4,8,0.5)');
      heart.addColorStop(1, 'rgba(10,4,8,0)');
      c.fillStyle = heart;
      c.globalAlpha = e;
      c.beginPath();
      c.arc(960, 520, 340, 0, TAU);
      c.fill();
      c.restore();
      drawRaiko(c, 960, 520, 330 + e * 40, { time: t, pulse: kickHit(t, 7), alpha: e, spin: beatF(t) * 0.08 + (1 - e) * -1.2 });
      c.save();
      c.font = font(F.mincho, 70);
      c.fillStyle = ink;
      shadow(30, 'rgba(0,0,0,0.8)');
      const a = layoutH(c, '私たちが', 960, 380, 70, 22);
      a.forEach((g) => REVEAL.ink(c, g, clamp((t - line.c[g.i] + 0.05) / 0.3), 70, false));
      c.font = font(F.mincho, 150);
      const g2 = c.createLinearGradient(0, 470, 0, 640);
      g2.addColorStop(0, '#fff6d6');
      g2.addColorStop(1, '#f0b54e');
      c.fillStyle = g2;
      shadow(50, 'rgba(255,170,60,0.75)');
      const b = layoutH(c, '私たちの神', 960, 560, 150, 6);
      b.forEach((g) => {
        g.i += 4;
        REVEAL.ink(c, g, clamp((t - line.c[g.i] + 0.05) / 0.35), 150, false);
      });
      c.restore();
      sub(930);
    }
  }
}
