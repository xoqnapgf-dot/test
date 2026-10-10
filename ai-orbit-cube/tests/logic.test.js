import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import CubeState from '../vendor/cubejs/index.js';
import { FACE_LAYOUT, FAMILIES } from '../src/data.js';
import { invertMove, inverseAlgorithm, parseAlgorithm, parseMove, physicalTurnToNotation, rotateGridVector } from '../src/moves.js';
import { solveExactly, verifyExactRestoration } from '../src/solver.js';

const BASE_TOKENS = ['U', 'R', 'F', 'D', 'L', 'B', 'M', 'E', 'S', 'x', 'y', 'z'];
const FACELET_COLORS = ['F', 'R', 'U', 'B', 'L', 'D'];
const AXIS_INDEX = { x: 0, y: 1, z: 2 };

before(() => {
  CubeState.initSolver();
});

function geometricFacelets(algorithm) {
  const stickers = [];
  for (let x = -1; x <= 1; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      for (let z = -1; z <= 1; z += 1) {
        const position = [x, y, z];
        for (let axis = 0; axis < 3; axis += 1) {
          if (position[axis] === 0) continue;
          const normal = [0, 0, 0];
          normal[axis] = position[axis];
          const face = FACE_LAYOUT.findIndex((layout) => layout.normal.every((value, index) => value === normal[index]));
          stickers.push({ position: [...position], normal, color: FACELET_COLORS[face] });
        }
      }
    }
  }

  for (const move of parseAlgorithm(algorithm)) {
    const axisIndex = AXIS_INDEX[move.axis];
    for (const sticker of stickers) {
      if (!move.whole && sticker.position[axisIndex] !== move.layer) continue;
      const signedQuarters = move.direction * move.quarters;
      sticker.position = rotateGridVector(sticker.position, move.axis, signedQuarters);
      sticker.normal = rotateGridVector(sticker.normal, move.axis, signedQuarters);
    }
  }

  const output = Array(54).fill('?');
  for (const sticker of stickers) {
    const [x, y, z] = sticker.position;
    const [nx, ny, nz] = sticker.normal;
    let faceIndex;
    let row;
    let column;
    if (ny === 1) { faceIndex = 0; row = z + 1; column = x + 1; }
    else if (nx === 1) { faceIndex = 1; row = 1 - y; column = 1 - z; }
    else if (nz === 1) { faceIndex = 2; row = 1 - y; column = x + 1; }
    else if (ny === -1) { faceIndex = 3; row = 1 - z; column = x + 1; }
    else if (nx === -1) { faceIndex = 4; row = 1 - y; column = z + 1; }
    else if (nz === -1) { faceIndex = 5; row = 1 - y; column = 1 - x; }
    else throw new Error(`Non-cardinal normal: ${sticker.normal}`);
    const index = faceIndex * 9 + row * 3 + column;
    assert.equal(output[index], '?', `Two stickers mapped to facelet ${index}.`);
    output[index] = sticker.color;
  }
  assert.ok(output.every((facelet) => facelet !== '?'));
  return output.join('');
}

test('the visual catalogue contains six families and 54 unique, named capabilities', () => {
  assert.equal(FAMILIES.length, 6);
  assert.deepEqual(FAMILIES.map((family) => family.id), [0, 1, 2, 3, 4, 5]);
  const abilities = FAMILIES.flatMap((family) => family.abilities);
  assert.equal(abilities.length, 54);
  assert.equal(new Set(abilities.map((ability) => ability.name)).size, 54);
  assert.equal(new Set(abilities.map((ability) => ability.glyph)).size, 54);
  assert.ok(abilities.every((ability) => ability.detail.length > 25 && ability.tempo > 0));
});

test('notation maps all twelve physical turn axes and layers', () => {
  const expected = {
    U: ['y', 1, -1], R: ['x', 1, -1], F: ['z', 1, -1],
    D: ['y', -1, 1], L: ['x', -1, 1], B: ['z', -1, 1],
    M: ['x', 0, 1], E: ['y', 0, 1], S: ['z', 0, -1],
    x: ['x', null, -1], y: ['y', null, -1], z: ['z', null, -1],
  };
  for (const [token, [axis, layer, direction]] of Object.entries(expected)) {
    const move = parseMove(token);
    assert.equal(move.axis, axis, token);
    assert.equal(move.layer, layer, token);
    assert.equal(move.direction, direction, token);
    assert.equal(move.whole, layer === null, token);
    assert.equal(physicalTurnToNotation(axis, layer, direction), token, token);
    assert.equal(physicalTurnToNotation(axis, layer, direction * 2), `${token}2`, `${token} half turn`);
    assert.equal(physicalTurnToNotation(axis, layer, -direction), `${token}'`, `${token} inverse`);
  }
});

test('discrete grid rotations form the expected four-turn cycles', () => {
  const samples = [[1, 0, 1], [-1, 1, 0], [0, -1, -1], [1, 1, 1]];
  for (const axis of ['x', 'y', 'z']) {
    for (const sample of samples) {
      let rotated = [...sample];
      for (let turn = 0; turn < 4; turn += 1) rotated = rotateGridVector(rotated, axis, 1);
      assert.deepEqual(rotated, sample, `${axis} four quarter turns`);
      const clockwise = rotateGridVector(sample, axis, 1);
      assert.deepEqual(rotateGridVector(clockwise, axis, -1), sample, `${axis} inverse`);
      assert.deepEqual(rotateGridVector(sample, axis, 2), rotateGridVector(sample, axis, -2), `${axis} half-turn sign`);
    }
  }
});

test('the independent geometric sticker simulator agrees with cubejs on base, slice, and whole-cube moves', () => {
  const tokens = BASE_TOKENS.flatMap((token) => [token, `${token}'`, `${token}2`]);
  const algorithms = [
    ...tokens,
    'R U F D L B M E S x y z',
    "R U R' U' F2 M E' S x y2 z'",
    "x R U M' z F D2 E B' y L S2",
    "U2 R2 F2 D2 L2 B2 M2 E2 S2 x2 y2 z2",
  ];
  const solvedFacelets = new CubeState().asString();
  assert.equal(geometricFacelets(''), solvedFacelets, 'the facelet coordinate frame starts solved');
  for (const algorithm of algorithms) {
    const expected = new CubeState().move(algorithm).asString();
    assert.equal(geometricFacelets(algorithm), expected, `geometry versus cubejs: ${algorithm}`);
  }
});

test('inverse algorithms restore exact cubejs facelet states', () => {
  const algorithms = [
    'R U F2 M E S',
    "x R U' M2 z F D2 E' B y L S'",
    'U2 R2 F2 D2 L2 B2 x2 y2 z2',
  ];
  for (const algorithm of algorithms) {
    const state = new CubeState().move(algorithm);
    const inverse = inverseAlgorithm(algorithm);
    assert.equal(state.clone().move(inverse).asString(), new CubeState().asString(), algorithm);
    assert.equal(inverseAlgorithm(inverse), algorithm, `involution: ${algorithm}`);
  }
  assert.equal(invertMove('R'), "R'");
  assert.equal(invertMove("R'"), 'R');
  assert.equal(invertMove('R2'), 'R2');
});

test('solver output plus the captured upright orientation restores exact facelets', () => {
  const states = [
    new CubeState().move("R U F' L D2"),
    new CubeState().move("x R U M' z F"),
    new CubeState().move('R U F D L B M E S x y z'),
  ];
  for (const state of states) {
    const algorithm = solveExactly(state);
    assert.ok(verifyExactRestoration(state, algorithm));
    assert.equal(state.clone().move(algorithm).asString(), new CubeState().asString());
  }
});
