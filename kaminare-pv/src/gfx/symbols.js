// Vector emblems drawn with Canvas2D paths in a unit box ([-1,1]², y down).
// Sacred symbols are treated with equal weight and size — the song's point is equality.
// Each fn(c) only builds/fills on the given context; caller sets fillStyle/transform.
const TAU = Math.PI * 2;

function star(c, n, step, r) {
  c.beginPath();
  for (let i = 0; i <= n; i++) {
    const a = ((i * step) / n) * TAU - Math.PI / 2;
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    if (i === 0) c.moveTo(x, y);
    else c.lineTo(x, y);
  }
  c.closePath();
}

export const SYMBOLS = {
  cross(c) {
    c.beginPath();
    c.rect(-0.14, -0.95, 0.28, 1.9);
    c.rect(-0.62, -0.5, 1.24, 0.28);
    c.fill('nonzero');
  },
  torii(c) {
    c.beginPath();
    // kasagi with upturned ends
    c.moveTo(-1, -0.72);
    c.quadraticCurveTo(0, -0.58, 1, -0.72);
    c.lineTo(0.92, -0.52);
    c.quadraticCurveTo(0, -0.42, -0.92, -0.52);
    c.closePath();
    c.rect(-0.78, -0.42, 1.56, 0.1); // shimaki
    c.rect(-0.82, -0.18, 1.64, 0.12); // nuki
    c.rect(-0.62, -0.45, 0.14, 1.4); // pillars
    c.rect(0.48, -0.45, 0.14, 1.4);
    c.rect(-0.05, -0.42, 0.1, 0.26); // gakuzuka
    c.fill('nonzero');
  },
  wheel(c) {
    // dharma wheel: rim, hub, 8 spokes
    c.beginPath();
    c.arc(0, 0, 0.92, 0, TAU);
    c.arc(0, 0, 0.74, 0, TAU, true);
    c.fill();
    c.beginPath();
    c.arc(0, 0, 0.2, 0, TAU);
    c.fill();
    for (let i = 0; i < 8; i++) {
      c.save();
      c.rotate((i / 8) * TAU);
      c.beginPath();
      c.moveTo(-0.05, -0.2);
      c.lineTo(0.05, -0.2);
      c.lineTo(0.03, -0.76);
      c.lineTo(-0.03, -0.76);
      c.closePath();
      c.fill();
      c.beginPath();
      c.arc(0, -0.98, 0.08, 0, TAU);
      c.fill();
      c.restore();
    }
  },
  crescent(c) {
    c.beginPath();
    c.arc(-0.1, 0, 0.86, 0, TAU);
    c.arc(0.24, -0.06, 0.72, 0, TAU, true);
    c.fill('nonzero');
    c.save();
    c.translate(0.5, -0.04);
    star(c, 5, 2, 0.28);
    c.fill('nonzero');
    c.restore();
  },
  hexagram(c) {
    c.lineWidth = 0.12;
    c.lineJoin = 'miter';
    c.beginPath();
    for (const off of [0, Math.PI]) {
      for (let i = 0; i <= 3; i++) {
        const a = (i / 3) * TAU - Math.PI / 2 + off;
        const x = Math.cos(a) * 0.86, y = Math.sin(a) * 0.86;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.closePath();
    }
    c.stroke();
  },
  octagram(c) {
    // two overlapping squares (eight-pointed star)
    c.beginPath();
    for (const off of [0, Math.PI / 4]) {
      for (let i = 0; i <= 4; i++) {
        const a = (i / 4) * TAU + off - Math.PI / 4;
        const x = Math.cos(a) * 0.9, y = Math.sin(a) * 0.9;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.closePath();
    }
    c.fill('nonzero');
    c.save();
    c.globalCompositeOperation = 'destination-out';
    c.beginPath();
    c.arc(0, 0, 0.26, 0, TAU);
    c.fill();
    c.restore();
  },
  yinyang(c) {
    c.beginPath();
    c.arc(0, 0, 0.9, -Math.PI / 2, Math.PI / 2);
    c.arc(0, 0.45, 0.45, Math.PI / 2, -Math.PI / 2, true);
    c.arc(0, -0.45, 0.45, Math.PI / 2, -Math.PI / 2, false);
    c.closePath();
    c.fill();
    c.lineWidth = 0.06;
    c.beginPath();
    c.arc(0, 0, 0.9, 0, TAU);
    c.stroke();
    c.beginPath();
    c.arc(0, -0.45, 0.13, 0, TAU);
    c.fill();
    c.save();
    c.globalCompositeOperation = 'destination-out';
    c.beginPath();
    c.arc(0, 0.45, 0.13, 0, TAU);
    c.fill();
    c.restore();
  },
  lotus(c) {
    const petal = (a, len, wid) => {
      c.save();
      c.rotate(a);
      c.beginPath();
      c.moveTo(0, 0.5);
      c.bezierCurveTo(wid, 0.2, wid * 0.8, 0.5 - len * 0.7, 0, 0.5 - len);
      c.bezierCurveTo(-wid * 0.8, 0.5 - len * 0.7, -wid, 0.2, 0, 0.5);
      c.fill();
      c.restore();
    };
    for (const [a, l, w] of [[0, 1.35, 0.36], [-0.55, 1.15, 0.32], [0.55, 1.15, 0.32], [-1.05, 0.85, 0.28], [1.05, 0.85, 0.28]]) petal(a, l, w);
    c.fillRect(-0.85, 0.52, 1.7, 0.08);
  },
  tomoe(c) {
    // mitsudomoe — three comma shapes (the mark on Raijin's drums)
    for (let i = 0; i < 3; i++) {
      c.save();
      c.rotate((i / 3) * TAU);
      c.beginPath();
      c.arc(0, -0.42, 0.32, 0, TAU);
      c.fill();
      c.beginPath();
      c.moveTo(0.32, -0.42);
      c.bezierCurveTo(0.34, -0.05, 0.1, 0.25, -0.35, 0.42);
      c.bezierCurveTo(-0.05, 0.12, -0.02, -0.15, -0.3, -0.36);
      c.closePath();
      c.fill();
      c.restore();
    }
  },
};
export const SYMBOL_KEYS = ['cross', 'torii', 'wheel', 'crescent', 'hexagram', 'octagram', 'yinyang', 'lotus'];

// ---- band emblems (the five names)
export const EMBLEMS = {
  rosary(c) {
    // beads loop + cross
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * TAU * 0.86 + Math.PI * 0.57;
      const x = Math.cos(a) * 0.62, y = Math.sin(a) * 0.5 - 0.22;
      c.beginPath();
      c.arc(x, y, i % 9 === 0 ? 0.07 : 0.045, 0, TAU);
      c.fill();
    }
    for (let i = 0; i < 4; i++) {
      c.beginPath();
      c.arc(0, 0.32 + i * 0.1, 0.045, 0, TAU);
      c.fill();
    }
    c.fillRect(-0.04, 0.68, 0.08, 0.34);
    c.fillRect(-0.14, 0.77, 0.28, 0.07);
  },
  dove(c) {
    c.beginPath();
    c.moveTo(-0.95, 0.1);
    c.bezierCurveTo(-0.6, 0.0, -0.4, 0.05, -0.2, 0.12);
    c.bezierCurveTo(-0.35, -0.3, -0.15, -0.75, 0.25, -0.92); // upper wing
    c.bezierCurveTo(0.15, -0.55, 0.2, -0.25, 0.25, 0.02);
    c.bezierCurveTo(0.45, -0.05, 0.62, -0.12, 0.75, -0.08); // head
    c.bezierCurveTo(0.86, -0.1, 0.94, -0.04, 0.98, 0.0);
    c.lineTo(0.85, 0.05);
    c.bezierCurveTo(0.7, 0.2, 0.45, 0.36, 0.15, 0.42);
    c.bezierCurveTo(-0.1, 0.48, -0.4, 0.5, -0.62, 0.62); // tail
    c.lineTo(-0.7, 0.42);
    c.bezierCurveTo(-0.75, 0.3, -0.85, 0.2, -0.95, 0.1);
    c.closePath();
    c.fill();
  },
  rope(c) {
    // shimenawa: twisted rope with three shide
    c.save();
    for (let i = -6; i <= 6; i++) {
      c.beginPath();
      c.ellipse(i * 0.14, -0.35 + Math.abs(i) * Math.abs(i) * 0.006, 0.12, 0.2, 0.7, 0, TAU);
      c.fill();
    }
    for (const x of [-0.5, 0, 0.5]) {
      c.beginPath();
      c.moveTo(x - 0.08, -0.15);
      c.lineTo(x + 0.08, -0.15);
      c.lineTo(x + 0.08, 0.1);
      c.lineTo(x - 0.06, 0.1);
      c.lineTo(x - 0.06, 0.35);
      c.lineTo(x + 0.1, 0.35);
      c.lineTo(x + 0.1, 0.6);
      c.lineTo(x - 0.04, 0.6);
      c.lineTo(x - 0.04, 0.85);
      c.lineTo(x - 0.12, 0.85);
      c.lineTo(x - 0.12, 0.6);
      c.lineTo(x, 0.6);
      c.lineTo(x, 0.42);
      c.lineTo(x - 0.14, 0.42);
      c.lineTo(x - 0.14, 0.17);
      c.lineTo(x, 0.17);
      c.lineTo(x, 0.02);
      c.lineTo(x - 0.08, 0.02);
      c.closePath();
      c.fill();
    }
    c.restore();
  },
  star8(c) {
    SYMBOLS.octagram(c);
  },
  bell(c) {
    // bonsho (temple bell)
    c.beginPath();
    c.moveTo(-0.12, -0.95);
    c.lineTo(0.12, -0.95);
    c.lineTo(0.12, -0.8);
    c.bezierCurveTo(0.45, -0.8, 0.55, -0.65, 0.56, -0.4);
    c.lineTo(0.6, 0.62);
    c.lineTo(0.7, 0.75);
    c.lineTo(-0.7, 0.75);
    c.lineTo(-0.6, 0.62);
    c.lineTo(-0.56, -0.4);
    c.bezierCurveTo(-0.55, -0.65, -0.45, -0.8, -0.12, -0.8);
    c.closePath();
    c.fill();
    c.save();
    c.globalCompositeOperation = 'destination-out';
    c.lineWidth = 0.05;
    for (const y of [-0.45, 0.1, 0.5]) {
      c.beginPath();
      c.moveTo(-0.6, y);
      c.lineTo(0.6, y);
      c.stroke();
    }
    c.beginPath();
    c.moveTo(0, -0.45);
    c.lineTo(0, 0.1);
    c.stroke();
    for (let i = 0; i < 9; i++) {
      c.beginPath();
      c.arc(-0.42 + (i % 3) * 0.12, -0.33 + Math.floor(i / 3) * 0.13, 0.035, 0, TAU);
      c.arc(0.18 + (i % 3) * 0.12, -0.33 + Math.floor(i / 3) * 0.13, 0.035, 0, TAU);
      c.fill();
    }
    c.beginPath();
    c.arc(-0.3, 0.32, 0.09, 0, TAU);
    c.fill();
    c.restore();
  },
};
export const MEMBERS = [
  { key: 'rosary', name: 'ロザリオ', role: 'VOCAL · GUITAR', faith: 'ROSARIO' },
  { key: 'dove', name: 'ハト', role: 'LEAD GUITAR', faith: 'COLUMBA' },
  { key: 'rope', name: 'ナワ', role: 'BASS', faith: 'SHIMENAWA' },
  { key: 'star8', name: 'ホシ', role: 'DRUMS', faith: 'OCTAGRAM' },
  { key: 'bell', name: 'カネ', role: 'KEYS', faith: 'BONSHO' },
];

// Draw a symbol into a canvas at (x,y) with radius r
export function drawSym(c, fn, x, y, r, rot = 0) {
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.scale(r, r);
  fn(c);
  c.restore();
}

// Build a horizontal atlas canvas of symbols (white on transparent), size px per cell
export function symbolAtlas(keys, size = 256, set = SYMBOLS) {
  const cv = document.createElement('canvas');
  cv.width = size * keys.length;
  cv.height = size;
  const c = cv.getContext('2d');
  c.fillStyle = '#fff';
  c.strokeStyle = '#fff';
  keys.forEach((k, i) => drawSym(c, set[k], size * i + size / 2, size / 2, size * 0.4));
  return cv;
}

// A flying dove in side/three-quarter view with articulated wings.
// flap: phase in radians; facing: 1 = flying right, -1 = left. Unit size ≈ wingspan.
export function drawBird(c, x, y, size, flap, facing = 1) {
  const w = Math.sin(flap); // -1 (down) .. 1 (up)
  c.save();
  c.translate(x, y);
  c.scale(size * facing, size);
  // far wing (behind body)
  const wing = (side, lift) => {
    c.save();
    c.translate(0.02, -0.02);
    c.scale(1, side);
    const tipY = -0.5 * lift - 0.05;
    c.beginPath();
    c.moveTo(-0.12, 0);
    c.bezierCurveTo(-0.1, tipY * 0.6, -0.2, tipY, -0.42, tipY * 1.05 - 0.02);
    c.lineTo(-0.34, tipY * 0.9 + 0.02);
    c.lineTo(-0.38, tipY * 0.82 + 0.05);
    c.lineTo(-0.28, tipY * 0.7 + 0.06);
    c.lineTo(-0.3, tipY * 0.6 + 0.09);
    c.bezierCurveTo(-0.16, tipY * 0.35 + 0.05, -0.02, 0.06, 0.12, 0.02);
    c.closePath();
    c.fill();
    c.restore();
  };
  c.globalAlpha *= 0.75;
  wing(1, w * 0.8 + 0.1);
  c.globalAlpha /= 0.75;
  // body
  c.beginPath();
  c.ellipse(0, 0.02, 0.24, 0.075, -0.08, 0, TAU);
  c.fill();
  // head & beak
  c.beginPath();
  c.arc(0.24, -0.03, 0.06, 0, TAU);
  c.fill();
  c.beginPath();
  c.moveTo(0.29, -0.04);
  c.lineTo(0.36, -0.015);
  c.lineTo(0.29, 0.0);
  c.fill();
  // tail fan
  c.beginPath();
  c.moveTo(-0.2, 0.0);
  c.lineTo(-0.42, -0.05);
  c.lineTo(-0.44, 0.06);
  c.lineTo(-0.2, 0.06);
  c.fill();
  // near wing (in front)
  wing(1, w + 0.15);
  c.restore();
}
