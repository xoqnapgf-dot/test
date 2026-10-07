// Raiko — Raijin's ring of drums (as in Sōtatsu's Fūjin Raijin screens) drawn as a
// gilded mandorla: flame halo, ring, eight taiko with mitsudomoe, pulsing with kicks.
import { SYMBOLS, drawSym } from './symbols.js';
import { TAU, clamp } from '../core/util.js';

export function drawRaiko(c, x, y, R, o = {}) {
  const t = o.time ?? 0;
  const pulse = o.pulse ?? 0; // 0..1 kick
  const a = o.alpha ?? 1;
  const spin = o.spin ?? 0;
  const n = o.n ?? 8;
  const gold = o.gold ?? ['#fff1c4', '#f2c766', '#b07a26'];
  c.save();
  c.translate(x, y);
  c.globalAlpha = a;
  // flame halo rays
  c.save();
  c.globalCompositeOperation = 'lighter';
  const rays = 72;
  for (let i = 0; i < rays; i++) {
    const ang = (i / rays) * TAU + spin * 0.3;
    const len = R * (1.25 + 0.35 * Math.sin(i * 7.3 + t * 3) + (i % 2 ? 0.1 : 0.32) + pulse * 0.3);
    c.save();
    c.rotate(ang);
    const g = c.createLinearGradient(0, R * 0.55, 0, len);
    g.addColorStop(0, 'rgba(255,200,110,0.0)');
    g.addColorStop(0.25, `rgba(255,190,90,${0.12 + pulse * 0.14})`);
    g.addColorStop(1, 'rgba(255,120,40,0)');
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(-R * 0.018, R * 0.55);
    c.quadraticCurveTo(R * 0.03, (R * 0.55 + len) / 2, 0, len);
    c.quadraticCurveTo(-R * 0.03, (R * 0.55 + len) / 2, R * 0.018, R * 0.55);
    c.fill();
    c.restore();
  }
  c.restore();
  // double ring
  const ringG = c.createRadialGradient(0, 0, R * 0.9, 0, 0, R * 1.08);
  ringG.addColorStop(0, gold[2]);
  ringG.addColorStop(0.5, gold[0]);
  ringG.addColorStop(1, gold[2]);
  c.strokeStyle = ringG;
  c.lineWidth = R * 0.05;
  c.beginPath();
  c.arc(0, 0, R, 0, TAU);
  c.stroke();
  c.lineWidth = R * 0.012;
  c.beginPath();
  c.arc(0, 0, R * 1.09, 0, TAU);
  c.stroke();
  c.beginPath();
  c.arc(0, 0, R * 0.9, 0, TAU);
  c.stroke();
  // drums
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * TAU + spin - Math.PI / 2;
    const dx = Math.cos(ang) * R, dy = Math.sin(ang) * R;
    const hit = clamp(pulse * (i % 2 ? 0.7 : 1));
    const dr = R * 0.15 * (1 + hit * 0.12);
    c.save();
    c.translate(dx, dy);
    // drum body (side) + head
    const bg = c.createRadialGradient(-dr * 0.3, -dr * 0.3, dr * 0.1, 0, 0, dr * 1.15);
    bg.addColorStop(0, '#ffefc0');
    bg.addColorStop(0.55, gold[1]);
    bg.addColorStop(1, '#6b3d12');
    c.fillStyle = bg;
    c.beginPath();
    c.arc(0, 0, dr * 1.12, 0, TAU);
    c.fill();
    // studs
    c.fillStyle = '#3a210c';
    for (let k = 0; k < 16; k++) {
      const sa = (k / 16) * TAU;
      c.beginPath();
      c.arc(Math.cos(sa) * dr * 1.02, Math.sin(sa) * dr * 1.02, dr * 0.045, 0, TAU);
      c.fill();
    }
    c.fillStyle = `rgba(${200 + hit * 55 | 0},${40 + hit * 60 | 0},${30},1)`;
    c.beginPath();
    c.arc(0, 0, dr * 0.88, 0, TAU);
    c.fill();
    c.fillStyle = hit > 0.3 ? '#fff6d8' : '#1a0f08';
    drawSym(c, SYMBOLS.tomoe, 0, 0, dr * 0.72, t * 0.5 + i);
    c.restore();
  }
  c.restore();
}
