import * as THREE from 'three';

const TAU = Math.PI * 2;
const ICON_SIZE = 192;

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function randomFrom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function drawFamilySigil(context, family, x, y, scale = 1) {
  const { pattern, palette } = family;
  context.save();
  context.translate(x, y);
  context.scale(scale, scale);
  context.lineWidth = 2.3;
  context.strokeStyle = palette.accent;
  context.fillStyle = `${palette.accent}aa`;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  if (pattern === 'orbit') {
    for (let index = 0; index < 3; index += 1) {
      context.save();
      context.rotate(index * Math.PI / 3);
      context.beginPath();
      context.ellipse(0, 0, 11, 5.5, 0, 0, TAU);
      context.stroke();
      context.restore();
    }
    context.beginPath(); context.arc(0, 0, 2.2, 0, TAU); context.fill();
  } else if (pattern === 'folio') {
    context.beginPath(); context.arc(0, 0, 6.5, 0, TAU); context.stroke();
    for (let index = 0; index < 8; index += 1) {
      const angle = index * TAU / 8;
      context.beginPath();
      context.moveTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
      context.lineTo(Math.cos(angle) * 13, Math.sin(angle) * 13);
      context.stroke();
    }
  } else if (pattern === 'prism') {
    context.beginPath(); context.moveTo(0, -14); context.lineTo(12, 0); context.lineTo(0, 14); context.lineTo(-12, 0); context.closePath(); context.stroke();
    context.beginPath(); context.moveTo(-6, 0); context.lineTo(0, -7); context.lineTo(6, 0); context.lineTo(0, 7); context.closePath(); context.stroke();
  } else if (pattern === 'current') {
    for (let index = -1; index <= 1; index += 1) {
      context.beginPath();
      context.moveTo(-14, index * 5);
      context.bezierCurveTo(-7, index * 5 - 5, 4, index * 5 + 5, 14, index * 5);
      context.stroke();
    }
  } else if (pattern === 'braid') {
    context.beginPath(); context.ellipse(-4, 0, 8, 5.5, Math.PI / 4, 0, TAU); context.stroke();
    context.beginPath(); context.ellipse(4, 0, 8, 5.5, -Math.PI / 4, 0, TAU); context.stroke();
  } else {
    context.strokeRect(-11, -11, 22, 22);
    context.beginPath(); context.moveTo(-4, -11); context.lineTo(-4, 11); context.moveTo(4, -11); context.lineTo(4, 11);
    context.moveTo(-11, -4); context.lineTo(11, -4); context.moveTo(-11, 4); context.lineTo(11, 4); context.stroke();
    context.beginPath(); context.arc(0, 0, 2.5, 0, TAU); context.fill();
  }
  context.restore();
}

function drawStroke(context, points, color, width = 3.2) {
  context.beginPath();
  context.moveTo(points[0][0], points[0][1]);
  for (let index = 1; index < points.length; index += 1) {
    context.lineTo(points[index][0], points[index][1]);
  }
  context.strokeStyle = color;
  context.lineWidth = width;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.stroke();
}

function drawGlyph(context, kind, variant, palette, random) {
  const centerX = ICON_SIZE / 2;
  const centerY = ICON_SIZE / 2 - 2;
  const radius = 43 + variant * 1.1;
  const line = palette.ink;
  const accent = palette.accent;
  context.save();
  context.translate(centerX, centerY);
  context.rotate((variant - 4) * 0.045);
  context.strokeStyle = line;
  context.fillStyle = line;
  context.lineWidth = 4;
  context.lineCap = 'round';
  context.lineJoin = 'round';

  switch (kind % 18) {
    case 0: {
      context.beginPath(); context.ellipse(0, 0, radius, radius * 0.48, 0.22, 0, TAU); context.stroke();
      context.beginPath(); context.ellipse(0, 0, radius * 0.48, radius, -0.2, 0, TAU); context.stroke();
      context.beginPath(); context.arc(radius * 0.74, -radius * 0.18, 5, 0, TAU); context.fillStyle = accent; context.fill();
      break;
    }
    case 1: {
      context.beginPath(); context.moveTo(-radius, -radius * 0.5); context.lineTo(0, -radius); context.lineTo(radius, -radius * 0.5); context.lineTo(radius * 0.58, radius); context.lineTo(-radius * 0.58, radius); context.closePath(); context.stroke();
      context.beginPath(); context.moveTo(-radius * 0.56, -radius * 0.23); context.lineTo(radius * 0.56, -radius * 0.23); context.moveTo(-radius * 0.42, radius * 0.24); context.lineTo(radius * 0.42, radius * 0.24); context.stroke();
      break;
    }
    case 2: {
      for (let strand = -1; strand <= 1; strand += 1) {
        context.beginPath();
        context.moveTo(-radius, strand * 14);
        context.bezierCurveTo(-radius * 0.48, strand * 4 - 23, radius * 0.22, strand * 3 + 24, radius, strand * 13);
        context.stroke();
      }
      break;
    }
    case 3: {
      context.beginPath(); context.moveTo(0, -radius); context.lineTo(radius * 0.82, 0); context.lineTo(0, radius); context.lineTo(-radius * 0.82, 0); context.closePath(); context.stroke();
      context.beginPath(); context.moveTo(-radius * 0.42, 0); context.lineTo(0, -radius * 0.45); context.lineTo(radius * 0.42, 0); context.lineTo(0, radius * 0.45); context.closePath(); context.stroke();
      break;
    }
    case 4: {
      for (let index = -1; index <= 1; index += 1) {
        context.beginPath(); context.moveTo(index * 22, -radius); context.lineTo(index * 22, radius); context.moveTo(-radius, index * 22); context.lineTo(radius, index * 22); context.stroke();
      }
      context.beginPath(); context.arc(0, 0, 5.5, 0, TAU); context.fillStyle = accent; context.fill();
      break;
    }
    case 5: {
      const bars = [0.42, 0.75, 1, 0.61];
      bars.forEach((height, index) => {
        const x = -radius * 0.72 + index * radius * 0.48;
        context.strokeRect(x, radius * 0.58 - height * radius * 1.16, radius * 0.28, height * radius * 1.16);
      });
      context.beginPath(); context.moveTo(-radius, radius * 0.7); context.lineTo(radius, radius * 0.7); context.stroke();
      break;
    }
    case 6: {
      const points = [];
      for (let index = 0; index < 12; index += 1) {
        const r = index % 2 ? radius * 0.45 : radius;
        const angle = -Math.PI / 2 + index * TAU / 12;
        points.push([Math.cos(angle) * r, Math.sin(angle) * r]);
      }
      drawStroke(context, [...points, points[0]], line, 3.5);
      context.beginPath(); context.arc(0, 0, 5, 0, TAU); context.fillStyle = accent; context.fill();
      break;
    }
    case 7: {
      const nodes = [[-radius * 0.68, -radius * 0.22], [0, -radius * 0.72], [radius * 0.7, -radius * 0.08], [-radius * 0.2, radius * 0.66]];
      drawStroke(context, [nodes[0], nodes[1], nodes[2], nodes[3], nodes[0]], line, 3.3);
      nodes.forEach((node, index) => { context.beginPath(); context.arc(node[0], node[1], index === variant % 4 ? 7 : 5, 0, TAU); context.fillStyle = index === variant % 4 ? accent : line; context.fill(); });
      break;
    }
    case 8: {
      context.beginPath(); context.moveTo(-radius, 0); context.lineTo(-radius * 0.3, 0); context.lineTo(0, -radius * 0.58); context.lineTo(radius, -radius * 0.58); context.moveTo(-radius * 0.3, 0); context.lineTo(0, radius * 0.58); context.lineTo(radius, radius * 0.58); context.stroke();
      [[radius, -radius * 0.58], [radius, radius * 0.58]].forEach(([x, y]) => { context.beginPath(); context.arc(x, y, 5, 0, TAU); context.fillStyle = accent; context.fill(); });
      break;
    }
    case 9: {
      context.beginPath(); context.moveTo(-radius * 0.85, -radius * 0.55); context.lineTo(-radius * 0.25, -radius * 0.55); context.lineTo(-radius * 0.25, radius * 0.58); context.lineTo(-radius * 0.85, radius * 0.58); context.stroke();
      context.beginPath(); context.moveTo(radius * 0.85, -radius * 0.55); context.lineTo(radius * 0.25, -radius * 0.55); context.lineTo(radius * 0.25, radius * 0.58); context.lineTo(radius * 0.85, radius * 0.58); context.stroke();
      for (let index = 0; index < 3; index += 1) {
        context.beginPath(); context.moveTo(-radius * 0.02, -radius * 0.42 + index * 28); context.lineTo(radius * 0.38, -radius * 0.42 + index * 28); context.stroke();
      }
      break;
    }
    case 10: {
      context.beginPath(); context.arc(0, 0, radius * 0.73, Math.PI * 0.12, Math.PI * 1.48); context.stroke();
      context.beginPath(); context.arc(0, 0, radius * 0.73, Math.PI * 1.63, Math.PI * 2.92); context.stroke();
      context.beginPath(); context.moveTo(radius * 0.72, -radius * 0.19); context.lineTo(radius * 0.97, -radius * 0.13); context.lineTo(radius * 0.79, radius * 0.07); context.stroke();
      context.beginPath(); context.moveTo(-radius * 0.72, radius * 0.19); context.lineTo(-radius * 0.97, radius * 0.13); context.lineTo(-radius * 0.79, -radius * 0.07); context.stroke();
      break;
    }
    case 11: {
      context.beginPath(); context.arc(0, 0, radius * 0.8, 0, TAU); context.stroke();
      context.beginPath(); context.arc(0, 0, radius * 0.42, 0, TAU); context.stroke();
      context.beginPath(); context.moveTo(0, -radius * 0.95); context.lineTo(0, radius * 0.95); context.moveTo(-radius * 0.95, 0); context.lineTo(radius * 0.95, 0); context.stroke();
      context.beginPath(); context.arc(0, 0, 5.5, 0, TAU); context.fillStyle = accent; context.fill();
      break;
    }
    case 12: {
      context.beginPath();
      for (let step = 0; step <= 72; step += 1) {
        const t = step / 72;
        const angle = t * TAU * (1.35 + variant * 0.035);
        const r = 2 + t * radius * 0.82;
        if (step === 0) context.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        else context.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      context.stroke();
      break;
    }
    case 13: {
      context.beginPath(); context.moveTo(-radius, -radius * 0.52); context.lineTo(radius * 0.35, -radius * 0.52); context.lineTo(radius * 0.1, -radius * 0.8); context.moveTo(radius * 0.35, -radius * 0.52); context.lineTo(radius * 0.1, -radius * 0.25); context.stroke();
      context.beginPath(); context.moveTo(radius, radius * 0.52); context.lineTo(-radius * 0.35, radius * 0.52); context.lineTo(-radius * 0.1, radius * 0.8); context.moveTo(-radius * 0.35, radius * 0.52); context.lineTo(-radius * 0.1, radius * 0.25); context.stroke();
      context.beginPath(); context.arc(-radius * 0.64, -radius * 0.52, 4, 0, TAU); context.arc(radius * 0.64, radius * 0.52, 4, 0, TAU); context.fillStyle = accent; context.fill();
      break;
    }
    case 14: {
      context.beginPath(); context.moveTo(-radius * 0.76, -radius * 0.58); context.lineTo(radius * 0.48, -radius * 0.58); context.lineTo(radius * 0.76, -radius * 0.3); context.lineTo(radius * 0.76, radius * 0.58); context.lineTo(-radius * 0.48, radius * 0.58); context.lineTo(-radius * 0.76, radius * 0.3); context.closePath(); context.stroke();
      context.beginPath(); context.moveTo(-radius * 0.44, -radius * 0.17); context.lineTo(radius * 0.44, -radius * 0.17); context.moveTo(-radius * 0.44, radius * 0.17); context.lineTo(radius * 0.18, radius * 0.17); context.stroke();
      break;
    }
    case 15: {
      context.beginPath(); context.moveTo(-radius * 0.88, -radius * 0.5); context.lineTo(-radius * 0.24, -radius * 0.5); context.lineTo(-radius * 0.24, radius * 0.5); context.lineTo(-radius * 0.88, radius * 0.5); context.stroke();
      context.beginPath(); context.moveTo(radius * 0.88, -radius * 0.5); context.lineTo(radius * 0.24, -radius * 0.5); context.lineTo(radius * 0.24, radius * 0.5); context.lineTo(radius * 0.88, radius * 0.5); context.stroke();
      context.beginPath(); context.moveTo(-radius * 0.2, 0); context.bezierCurveTo(-radius * 0.06, -radius * 0.47, radius * 0.06, radius * 0.47, radius * 0.2, 0); context.stroke();
      break;
    }
    case 16: {
      context.beginPath(); context.moveTo(0, -radius); context.lineTo(radius * 0.85, -radius * 0.36); context.lineTo(radius * 0.54, radius * 0.74); context.lineTo(-radius * 0.54, radius * 0.74); context.lineTo(-radius * 0.85, -radius * 0.36); context.closePath(); context.stroke();
      context.beginPath(); context.moveTo(0, -radius * 0.55); context.lineTo(0, radius * 0.38); context.moveTo(-radius * 0.3, 0); context.lineTo(radius * 0.3, 0); context.stroke();
      break;
    }
    default: {
      context.beginPath(); context.moveTo(-radius * 0.72, -radius * 0.7); context.lineTo(radius * 0.72, -radius * 0.7); context.lineTo(radius * 0.72, radius * 0.7); context.lineTo(-radius * 0.72, radius * 0.7); context.closePath(); context.stroke();
      for (let index = 0; index < 5; index += 1) {
        const y = -radius * 0.45 + index * radius * 0.22;
        context.beginPath(); context.moveTo(-radius * 0.42, y); context.lineTo(radius * (0.16 + random() * 0.25), y); context.stroke();
      }
    }
  }

  context.restore();
  context.save();
  context.translate(ICON_SIZE / 2, ICON_SIZE / 2);
  context.strokeStyle = accent;
  context.lineWidth = 2.2;
  const sparkAngle = variant * 0.37 + 0.4;
  const sparkX = Math.cos(sparkAngle) * 61;
  const sparkY = Math.sin(sparkAngle) * 61;
  context.beginPath(); context.arc(sparkX, sparkY, 4.1 + (variant % 3), 0, TAU); context.stroke();
  context.restore();
}

export function makeFaceTexture(family) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(size * 0.44, size * 0.36, 14, size * 0.52, size * 0.52, size * 0.78);
  gradient.addColorStop(0, family.palette.base);
  gradient.addColorStop(0.72, family.palette.dark);
  gradient.addColorStop(1, '#111923');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  context.strokeStyle = `${family.palette.light}25`;
  context.lineWidth = 1;
  for (let radius = 36; radius <= 122; radius += 22) {
    context.beginPath(); context.arc(size / 2, size / 2, radius, 0, TAU); context.stroke();
  }
  if (family.pattern === 'orbit') {
    for (let index = 0; index < 6; index += 1) {
      context.save(); context.translate(size / 2, size / 2); context.rotate(index * Math.PI / 3);
      context.beginPath(); context.ellipse(0, 0, 92, 24, 0, 0, TAU); context.stroke(); context.restore();
    }
  } else if (family.pattern === 'folio') {
    for (let index = 0; index < 8; index += 1) {
      const angle = index * TAU / 8;
      context.beginPath(); context.moveTo(size / 2, size / 2);
      context.quadraticCurveTo(size / 2 + Math.cos(angle + 0.22) * 118, size / 2 + Math.sin(angle + 0.22) * 118, size / 2 + Math.cos(angle) * 125, size / 2 + Math.sin(angle) * 125);
      context.stroke();
    }
  } else if (family.pattern === 'prism') {
    for (let index = 0; index < 4; index += 1) {
      context.save(); context.translate(size / 2, size / 2); context.rotate(index * Math.PI / 4);
      context.strokeRect(-70, -70, 140, 140); context.restore();
    }
  } else if (family.pattern === 'current') {
    for (let index = 0; index < 7; index += 1) {
      const y = 36 + index * 30;
      context.beginPath(); context.moveTo(8, y);
      context.bezierCurveTo(66, y - 28, 160, y + 27, 248, y - 2);
      context.stroke();
    }
  } else if (family.pattern === 'braid') {
    for (let index = -2; index <= 2; index += 1) {
      context.beginPath(); context.ellipse(size / 2 + index * 28, size / 2, 42, 116, index * 0.11, 0, TAU); context.stroke();
      context.beginPath(); context.ellipse(size / 2, size / 2 + index * 25, 116, 42, index * -0.11, 0, TAU); context.stroke();
    }
  } else {
    for (let index = 0; index <= size; index += 32) {
      context.beginPath(); context.moveTo(index, 0); context.lineTo(index, size); context.moveTo(0, index); context.lineTo(size, index); context.stroke();
    }
  }

  const random = randomFrom(hashString(family.key));
  context.fillStyle = `${family.palette.light}48`;
  for (let index = 0; index < 150; index += 1) {
    const x = 12 + random() * (size - 24);
    const y = 12 + random() * (size - 24);
    const radius = random() * 1.2 + 0.3;
    context.beginPath(); context.arc(x, y, radius, 0, TAU); context.fill();
  }
  roundRect(context, 8, 8, size - 16, size - 16, 24);
  context.strokeStyle = `${family.palette.accent}b0`;
  context.lineWidth = 2;
  context.stroke();
  drawFamilySigil(context, family, size - 35, size - 35, 0.72);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function makeAbilityTexture(family, ability, familyIndex, cellIndex) {
  const canvas = document.createElement('canvas');
  canvas.width = ICON_SIZE;
  canvas.height = ICON_SIZE;
  const context = canvas.getContext('2d');
  const random = randomFrom(hashString(`${family.key}:${ability.glyph}:${cellIndex}`));
  const center = ICON_SIZE / 2;
  const wash = context.createRadialGradient(center, center, 5, center, center, ICON_SIZE * 0.49);
  wash.addColorStop(0, `${family.palette.dark}00`);
  wash.addColorStop(0.84, `${family.palette.dark}08`);
  wash.addColorStop(1, `${family.palette.dark}00`);
  context.fillStyle = wash;
  context.fillRect(0, 0, ICON_SIZE, ICON_SIZE);

  context.save();
  context.translate(center, center);
  context.strokeStyle = `${family.palette.light}76`;
  context.lineWidth = 1.4;
  context.beginPath(); context.arc(0, 0, 77, 0, TAU); context.stroke();
  context.beginPath(); context.arc(0, 0, 68 + (cellIndex % 3) * 2, 0, TAU); context.stroke();
  context.restore();

  const kind = (cellIndex + familyIndex * 5) % 18;
  drawGlyph(context, kind, cellIndex + familyIndex * 3, family.palette, random);
  drawFamilySigil(context, family, ICON_SIZE - 30, ICON_SIZE - 29, 0.56);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export function makeQuietShaderMaterial(family, ability, phase) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPhase: { value: phase },
      uRate: { value: ability.tempo },
      uTint: { value: new THREE.Color(family.palette.accent) },
      uFamily: { value: family.id },
      uState: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uPhase;
      uniform float uRate;
      uniform float uFamily;
      uniform float uState;
      uniform vec3 uTint;
      varying vec2 vUv;
      const float PI = 3.141592653589793;
      void main() {
        vec2 p = vUv - 0.5;
        float radius = length(p);
        float angle = atan(p.y, p.x);
        float ringRadius = 0.365 + 0.012 * sin(uTime * 0.22 + uPhase);
        float ring = 1.0 - smoothstep(0.012, 0.024, abs(radius - ringRadius));
        float runnerAngle = uTime * (0.22 + uRate * 0.12) + uPhase;
        float angleDelta = abs(atan(sin(angle - runnerAngle), cos(angle - runnerAngle)));
        float runner = 1.0 - smoothstep(0.055, 0.16, angleDelta);
        float breath = 0.5 + 0.5 * sin(uTime * (0.32 + uRate * 0.08) + uPhase);
        float sweepY = 0.21 + 0.02 * sin(uTime * 0.19 + uPhase + uFamily);
        float sweep = 1.0 - smoothstep(0.004, 0.018, abs(vUv.y - sweepY));
        float mask = smoothstep(0.02, 0.11, radius) * (1.0 - smoothstep(0.455, 0.5, radius));
        float alpha = mask * (0.023 * ring * (0.38 + breath * 0.28) + 0.052 * runner * ring + 0.012 * sweep);
        alpha *= 1.0 - uState * 0.55;
        gl_FragColor = vec4(mix(uTint, vec3(1.0), runner * 0.24), alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    toneMapped: false,
  });
}
