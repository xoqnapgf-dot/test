import {
  ABILITIES,
  BRAND_FACE_NORMAL,
  BRANDS,
  FACE_BASIS,
  ORIGINAL_FACE_BY_NORMAL,
} from './data.js';

export const AXES = ['x', 'y', 'z'];
const AXIS_INDEX = Object.freeze({ x: 0, y: 1, z: 2 });
const IDENTITY = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);

export const vectorKey = (vector) => vector.join(',');
export const faceBrandAtRest = (normal) => ORIGINAL_FACE_BY_NORMAL[vectorKey(normal)] ?? null;

function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function rotateVector(vector, axis, turns = 1) {
  const count = ((Math.trunc(turns) % 4) + 4) % 4;
  let result = [...vector];
  for (let i = 0; i < count; i += 1) {
    const [x, y, z] = result;
    if (axis === 'x') result = [x, -z, y];
    else if (axis === 'y') result = [z, y, -x];
    else if (axis === 'z') result = [-y, x, z];
    else throw new RangeError(`Unknown cube axis: ${axis}`);
  }
  return result;
}

function quarterMatrix(axis) {
  if (axis === 'x') return [1, 0, 0, 0, 0, -1, 0, 1, 0];
  if (axis === 'y') return [0, 0, 1, 0, 1, 0, -1, 0, 0];
  if (axis === 'z') return [0, -1, 0, 1, 0, 0, 0, 0, 1];
  throw new RangeError(`Unknown cube axis: ${axis}`);
}

function multiplyMatrices(a, b) {
  const result = new Array(9).fill(0);
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      for (let k = 0; k < 3; k += 1) result[row * 3 + col] += a[row * 3 + k] * b[k * 3 + col];
    }
  }
  return result;
}

function multiplyVector(matrix, vector) {
  return [
    matrix[0] * vector[0] + matrix[1] * vector[1] + matrix[2] * vector[2],
    matrix[3] * vector[0] + matrix[4] * vector[1] + matrix[5] * vector[2],
    matrix[6] * vector[0] + matrix[7] * vector[1] + matrix[8] * vector[2],
  ];
}

function blankCubies() {
  const cubies = [];
  for (let x = -1; x <= 1; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      for (let z = -1; z <= 1; z += 1) {
        cubies.push({
          id: `cubie-${x + 1}${y + 1}${z + 1}`,
          pos: [x, y, z],
          orientation: [...IDENTITY],
          stickers: [],
        });
      }
    }
  }
  return cubies;
}

export function createSolvedCube() {
  const cubies = blankCubies();
  const byPosition = new Map(cubies.map((cubie) => [vectorKey(cubie.pos), cubie]));
  const abilityByBrandIndex = new Map();
  for (const ability of ABILITIES) {
    const list = abilityByBrandIndex.get(ability.brandId) ?? [];
    list[ability.indexInBrand] = ability;
    abilityByBrandIndex.set(ability.brandId, list);
  }

  for (const brand of BRANDS) {
    const normal = BRAND_FACE_NORMAL[brand.id];
    const normalKey = vectorKey(normal);
    const { right, up } = FACE_BASIS[normalKey];
    const faceAbilities = abilityByBrandIndex.get(brand.id);
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        const index = row * 3 + col;
        const pos = normal.map((component, axis) => (
          component + right[axis] * (col - 1) + up[axis] * (1 - row)
        ));
        const cubie = byPosition.get(vectorKey(pos));
        const ability = faceAbilities[index];
        cubie.stickers.push({
          id: ability.id,
          abilityId: ability.id,
          brandId: brand.id,
          originalFace: normalKey,
          localNormal: [...normal],
          normal: [...normal],
          isAnchor: index === 4,
        });
      }
    }
  }
  return cubies;
}

export function normalizeMove(move) {
  if (!move || !AXES.includes(move.axis)) throw new TypeError('Move axis must be x, y, or z.');
  if (![-1, 0, 1].includes(move.layer)) throw new RangeError('Move layer must be -1, 0, or 1.');
  const turns = ((Math.trunc(move.turns ?? 1) % 4) + 4) % 4;
  if (turns === 0) throw new RangeError('A move must rotate at least one quarter-turn.');
  return { axis: move.axis, layer: move.layer, turns };
}

export function inverseMove(move) {
  const normalized = normalizeMove(move);
  return { ...normalized, turns: (4 - normalized.turns) % 4 || 4 };
}

export function applyMove(cubies, move) {
  const normalized = normalizeMove(move);
  const axisIndex = AXIS_INDEX[normalized.axis];
  const rotation = quarterMatrix(normalized.axis);
  return cubies.map((source) => {
    const cubie = {
      ...source,
      pos: [...source.pos],
      orientation: [...source.orientation],
      stickers: source.stickers.map((sticker) => ({
        ...sticker,
        localNormal: [...sticker.localNormal],
        normal: [...sticker.normal],
      })),
    };
    if (source.pos[axisIndex] !== normalized.layer) return cubie;

    for (let turn = 0; turn < normalized.turns; turn += 1) {
      cubie.pos = rotateVector(cubie.pos, normalized.axis, 1);
      cubie.orientation = multiplyMatrices(rotation, cubie.orientation);
    }
    for (const sticker of cubie.stickers) sticker.normal = multiplyVector(cubie.orientation, sticker.localNormal);
    return cubie;
  });
}

export function getFaceCells(cubies, normal) {
  const normalKey = vectorKey(normal);
  const basis = FACE_BASIS[normalKey];
  if (!basis) throw new RangeError(`Not a unit face normal: ${normalKey}`);
  const cells = new Array(9).fill(null);
  for (const cubie of cubies) {
    for (const sticker of cubie.stickers) {
      if (vectorKey(sticker.normal) !== normalKey) continue;
      const col = dot(cubie.pos, basis.right) + 1;
      const row = 1 - dot(cubie.pos, basis.up);
      if (row >= 0 && row < 3 && col >= 0 && col < 3) cells[row * 3 + col] = { cubie, sticker };
    }
  }
  return cells;
}

export function getBrandAnchors(cubies) {
  const anchors = {};
  for (const cubie of cubies) {
    for (const sticker of cubie.stickers) {
      if (sticker.isAnchor) anchors[sticker.brandId] = { normal: [...sticker.normal], pos: [...cubie.pos] };
    }
  }
  return anchors;
}

export function getWorldFaces(cubies) {
  const anchors = getBrandAnchors(cubies);
  return Object.fromEntries(BRANDS.map((brand) => {
    const anchor = anchors[brand.id];
    return [brand.id, anchor ? { normal: anchor.normal, cells: getFaceCells(cubies, anchor.normal) } : null];
  }));
}

export function isFaceSolvedForBrand(cubies, brandId) {
  const anchor = getBrandAnchors(cubies)[brandId];
  if (!anchor) return false;
  const cells = getFaceCells(cubies, anchor.normal);
  return cells.length === 9 && cells.every((cell) => cell?.sticker.brandId === brandId);
}

export function isSolved(cubies) {
  return BRANDS.every((brand) => isFaceSolvedForBrand(cubies, brand.id));
}

export function stateKey(cubies) {
  return [...cubies]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((cubie) => `${cubie.id}:${cubie.pos.join(',')}:${JSON.stringify(cubie.orientation)}`)
    .join('|');
}

export function facePopulation(cubies, normal) {
  const cells = getFaceCells(cubies, normal);
  const counts = Object.fromEntries(BRANDS.map((brand) => [brand.id, 0]));
  for (const cell of cells) if (cell) counts[cell.sticker.brandId] += 1;
  return { cells, counts, complete: cells.every(Boolean) };
}

export function faceNormalForBrand(cubies, brandId) {
  return getBrandAnchors(cubies)[brandId]?.normal ?? null;
}

export function faceBrandAtNormal(normal) {
  return faceBrandAtRest(normal);
}

export function getCubieOrientation3(cubie) {
  return [...cubie.orientation];
}

export function vectorCross(a, b) {
  return cross(a, b);
}
