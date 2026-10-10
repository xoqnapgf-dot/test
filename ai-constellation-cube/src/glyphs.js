import * as THREE from 'three';
import { ABILITIES, BRAND_BY_ID } from './data.js';

function hashCode(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  return function next() {
    let value = seed += 0x6d2b79f5;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function polygon(context, x, y, radius, sides, rotation) {
  context.beginPath();
  for (let i = 0; i < sides; i += 1) {
    const angle = rotation + (i / sides) * Math.PI * 2;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.closePath();
  context.stroke();
}

function createIconTexture(ability, brand) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d', { alpha: true });
  const random = mulberry32(hashCode(ability.id));
  const cx = 64;
  const cy = 64;
  const rotation = random() * Math.PI;
  const centerSides = 3 + Math.floor(random() * 6);
  const spokeCount = 3 + Math.floor(random() * 5);
  const accent = brand.colors.accent;

  context.clearRect(0, 0, 128, 128);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.strokeStyle = 'rgba(239, 235, 214, 0.88)';
  context.fillStyle = accent;
  context.lineWidth = 4.5;

  // Each capability gets a deterministic geometric signature, generated locally.
  const orbit = 35 + random() * 8;
  context.beginPath();
  context.arc(cx, cy, orbit, rotation, rotation + Math.PI * (1.05 + random() * 0.75));
  context.stroke();
  context.beginPath();
  context.arc(cx, cy, orbit, rotation + Math.PI * 1.18, rotation + Math.PI * 1.82);
  context.stroke();

  for (let i = 0; i < spokeCount; i += 1) {
    const angle = rotation + (i / spokeCount) * Math.PI * 2 + (random() - 0.5) * 0.28;
    const inner = 15 + random() * 7;
    const outer = 28 + random() * 10;
    const x1 = cx + Math.cos(angle) * inner;
    const y1 = cy + Math.sin(angle) * inner;
    const x2 = cx + Math.cos(angle) * outer;
    const y2 = cy + Math.sin(angle) * outer;
    context.beginPath();
    context.moveTo(x1, y1);
    if (random() > 0.52) {
      const bend = (random() - 0.5) * 11;
      context.quadraticCurveTo((x1 + x2) / 2 - Math.sin(angle) * bend, (y1 + y2) / 2 + Math.cos(angle) * bend, x2, y2);
    } else {
      context.lineTo(x2, y2);
    }
    context.stroke();
    context.beginPath();
    context.arc(x2, y2, 3.3 + random() * 1.5, 0, Math.PI * 2);
    context.fill();
  }

  const centerRadius = 10 + random() * 5;
  polygon(context, cx, cy, centerRadius, centerSides, rotation);
  context.fillStyle = accent;
  context.beginPath();
  context.arc(cx, cy, 3 + random() * 3, 0, Math.PI * 2);
  context.fill();

  const notchCount = 2 + Math.floor(random() * 3);
  for (let i = 0; i < notchCount; i += 1) {
    const angle = rotation + random() * Math.PI * 2;
    const radius = 48 + random() * 5;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    context.beginPath();
    context.arc(x, y, 1.8 + random() * 1.5, 0, Math.PI * 2);
    context.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 2;
  texture.needsUpdate = true;
  return texture;
}

export function createGlyphTextures() {
  const textures = new Map();
  for (const ability of ABILITIES) textures.set(ability.id, createIconTexture(ability, BRAND_BY_ID[ability.brandId]));
  return textures;
}
