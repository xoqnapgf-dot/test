// OUTRO — back to paper. The last note falls into a pool of ink; the keys drip after it;
// a temple bell is brushed in and only its echo remains, as rings on the water.
import { Paper, PlateView, Layer2D } from './base.js';
import { InkPlate } from '../gfx/ink.js';
import { KEYS } from '../data/keys.js';
import { SEC, lines, DURATION, kickHit } from '../core/music.js';
import { F, font, layoutV, layoutH, REVEAL, caption } from '../core/type.js';
import { gloss } from '../core/lyrics-meta.js';
import { clamp, lerp, ease, ep, TAU, rng } from '../core/util.js';

const POOL_Y = 770;
const LAST_HIT = 177.3;

function bellPlate() {
  const p = new InkPlate(760, 1000, { seed: 71 });
  // beam & hook
  p.stroke([[30, 90], [380, 82], [730, 96]], { w: 46, dry: 0.7, t0: 0.0, t1: 0.16, spatter: 0.6 });
  p.stroke([[380, 110], [384, 190]], { w: 18, dry: 0.3, t0: 0.16, t1: 0.22 });
  // bell profile
  const L = [[330, 200], [250, 230], [215, 330], [208, 560], [200, 760], [168, 800]];
  const R = L.map(([x, y]) => [760 - x, y]);
  p.stroke(L, { w: 26, dry: 0.5, t0: 0.22, t1: 0.46 });
  p.stroke(R, { w: 20, dry: 0.65, t0: 0.26, t1: 0.5 });
  p.stroke([[168, 800], [380, 812], [592, 800]], { w: 18, dry: 0.5, t0: 0.5, t1: 0.58 });
  p.stroke([[330, 200], [380, 192], [430, 200]], { w: 16, dry: 0.4, t0: 0.2, t1: 0.24 });
  // bands
  for (const [y, k] of [[360, 0], [600, 1], [720, 2]]) p.stroke([[214, y], [380, y + 4], [546, y]], { w: 10, dry: 0.75, t0: 0.58 + k * 0.04, t1: 0.64 + k * 0.04, bristles: 8 });
  p.stroke([[380, 360], [380, 600]], { w: 9, dry: 0.7, t0: 0.7, t1: 0.74, bristles: 8 });
  // nipples (chi) grid
  const Rr = rng(4);
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 3; j++)
      for (const ox of [262, 410]) {
        const x = ox + j * 30, y = 230 + i * 30;
        p.fill((c) => {
          c.beginPath();
          c.arc(x, y + 0, 8 + Rr() * 2, 0, TAU);
          c.fill();
        }, { t0: 0.74 + i * 0.02, t1: 0.76 + i * 0.02, bounds: [x - 10, y - 10, 20, 20], from: 'center' });
      }
  // striking seat (lotus disc)
  p.fill((c) => {
    c.beginPath();
    c.arc(300, 670, 28, 0, TAU);
    c.arc(300, 670, 16, 0, TAU, true);
    c.fill('evenodd');
  }, { t0: 0.86, t1: 0.9, bounds: [270, 640, 60, 60], from: 'center' });
  // pale wash inside the bell
  p.fill((c) => {
    c.globalAlpha = 0.18;
    c.beginPath();
    c.moveTo(250, 230);
    c.lineTo(510, 230);
    c.lineTo(560, 790);
    c.lineTo(200, 790);
    c.closePath();
    c.fill();
  }, { t0: 0.6, t1: 0.95, bounds: [200, 220, 360, 580], from: 'top', blur: 16 });
  return p.bake();
}

function noteSprite() {
  const p = new InkPlate(200, 300, { seed: 13 });
  p.fill((c) => {
    c.save();
    c.translate(70, 240);
    c.rotate(-0.4);
    c.beginPath();
    c.ellipse(0, 0, 48, 33, 0, 0, TAU);
    c.fill();
    c.restore();
  }, { t0: 0, t1: 0.1 });
  p.stroke([[112, 230], [116, 40]], { w: 14, dry: 0.3, t0: 0, t1: 0.1 });
  p.stroke([[116, 40], [150, 90], [178, 120], [164, 190]], { w: 18, dry: 0.6, t0: 0, t1: 0.1 });
  return p.bake().color;
}

export class Outro {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.paper = new Paper('#ebe1ce', '#cf3320');
    this.bell = new PlateView(bellPlate(), [1110, 40, 760, 1000], '#120d0b');
    this.note = noteSprite();
    this.layer = new Layer2D(0);
    this.ls = lines('out');
  }
  render(t, rt) {
    const r = this.app.renderer;
    const [l1, l2] = this.ls;
    const end = ep(178.4, 179.4, t, ease.inOutCubic);
    this.paper.draw(r, rt, { zoom: 1 + (t - SEC.outro[0]) * 0.006 });
    const bp = ep(l2.t0 - 0.2, LAST_HIT + 0.2, t, (x) => x);
    this.bell.draw(r, rt, bp, { alpha: 1 - end * 0.88 });
    const c = this.layer.begin();
    c.textAlign = 'center';
    c.textBaseline = 'middle';

    // the ink pool: a long horizontal wash line
    c.save();
    c.globalAlpha = 0.65 * (1 - end * 0.6);
    const pg = c.createLinearGradient(0, POOL_Y - 6, 0, POOL_Y + 40);
    pg.addColorStop(0, 'rgba(18,13,11,0.0)');
    pg.addColorStop(0.2, 'rgba(18,13,11,0.35)');
    pg.addColorStop(1, 'rgba(18,13,11,0)');
    c.fillStyle = pg;
    c.fillRect(120, POOL_Y - 6, 1680, 46);
    c.restore();

    // ripples: from the last note, every key drop and the bell's echo
    const ripples = [];
    const land = l1.c[l1.c.length - 1];
    ripples.push({ x: 640, t0: land, k: 1.4 });
    for (const [nt, m] of KEYS.outro) ripples.push({ x: 640 + (m - 66) * 22, t0: nt + 0.45, k: 0.45 });
    for (let i = 0; i < 6; i++) ripples.push({ x: 1490, t0: LAST_HIT + i * 0.85, k: 1.2 - i * 0.15 });
    c.save();
    c.strokeStyle = '#140f0d';
    for (const rp of ripples) {
      const a = t - rp.t0;
      if (a < 0 || a > 4) continue;
      for (let j = 0; j < 3; j++) {
        const aa = a - j * 0.18;
        if (aa < 0) continue;
        const rr = aa * 160 * rp.k + 6;
        c.globalAlpha = Math.max(0, 1 - aa / 3.4) * 0.7 * rp.k;
        c.lineWidth = 2.2 * (1 - aa / 4) + 0.4;
        c.beginPath();
        c.ellipse(rp.x, POOL_Y, rr, rr * 0.16, 0, 0, TAU);
        c.stroke();
      }
    }
    c.restore();

    // the last note falls
    {
      const a0 = l1.c[0] - 0.1;
      const p = ep(a0, land, t, ease.inQuad);
      if (t > a0 - 0.2 && t < land + 0.2) {
        const y = lerp(-120, POOL_Y - 200, p);
        c.save();
        c.globalAlpha = 1 - clamp((t - land) / 0.2);
        c.translate(640, y);
        c.rotate(Math.sin(t * 2) * 0.12);
        c.drawImage(this.note, -100, -150);
        c.restore();
      }
      // key drops
      c.save();
      c.fillStyle = '#140f0d';
      for (const [nt, m] of KEYS.outro) {
        const a = t - (nt - 0.0);
        if (a < 0 || a > 0.45) continue;
        const y = lerp(220, POOL_Y, ease.inQuad(a / 0.45));
        c.beginPath();
        c.ellipse(640 + (m - 66) * 22, y, 5, 9, 0, 0, TAU);
        c.fill();
      }
      c.restore();
    }

    // lyrics: vertical, quiet
    const col = '#16100d';
    c.fillStyle = col;
    [l1, l2].forEach((l, k) => {
      c.font = font(F.mincho, 64);
      const x = k ? 980 : 260;
      const gl = layoutV(l.text, x, 140, 64, 1.12);
      c.save();
      c.globalAlpha = 1 - end;
      gl.forEach((g) => REVEAL.ink(c, g, clamp((t - l.c[g.i] + 0.08) / 0.45), 64, true));
      c.globalAlpha = (1 - end) * 0.55 * clamp((t - l.t0) * 1.5);
      c.translate(x - 70, 150);
      c.rotate(Math.PI / 2);
      c.textAlign = 'left';
      c.font = font(F.serif, 22);
      if ('letterSpacing' in c) c.letterSpacing = '4px';
      c.fillText(gloss(l), 0, 0);
      c.restore();
    });

    // end card
    if (end > 0) {
      c.save();
      c.globalAlpha = end;
      c.fillStyle = '#c92a1c';
      c.font = font(F.brush, 170);
      c.fillText('カミナレ', 960, 470);
      c.fillStyle = col;
      c.font = font(F.mincho, 32);
      if ('letterSpacing' in c) c.letterSpacing = '22px';
      c.fillText('神鳴れ', 975, 600);
      c.font = font(F.black, 40);
      if ('letterSpacing' in c) c.letterSpacing = '2px';
      c.fillText('Kaminare', 960, 345);
      caption(c, 'A REAL-TIME MUSIC VIDEO  ·  WEBGL / GLSL / P5.BRUSH / CANVAS', 960, 690, 14, 'rgba(22,16,13,0.75)', 'center', 0.32);
      caption(c, 'EVERY FRAME IS DRAWN LIVE IN YOUR BROWSER', 960, 722, 12, 'rgba(22,16,13,0.5)', 'center', 0.32);
      // seal
      const sk = ease.outBack(clamp((t - 178.9) / 0.3));
      if (sk > 0) {
        c.save();
        c.translate(1400, 400);
        c.rotate(-0.08);
        c.scale(lerp(1.6, 1, sk), lerp(1.6, 1, sk));
        c.fillStyle = '#c92a1c';
        c.fillRect(-48, -48, 96, 96);
        c.globalCompositeOperation = 'destination-out';
        c.font = font(F.mincho, 40);
        c.fillText('神', 0, -20);
        c.fillText('鳴', 0, 22);
        c.restore();
      }
      c.restore();
    }
    this.layer.draw(r, rt, {});
    const fadeOut = ep(DURATION - 1.2, DURATION, t);
    return { hudInk: 'dark', hud: 1 - end, bloom: 0.3, bloomThresh: 0.95, grain: 0.04, vig: 0.5 + fadeOut * 0.4, ca: 0.001, hudShu: '#c92a1c', exposure: 1 - fadeOut * 0.15 };
  }
}
