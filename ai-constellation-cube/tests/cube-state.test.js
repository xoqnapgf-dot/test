import test from 'node:test';
import assert from 'node:assert/strict';
import { ABILITIES, BRAND_FACE_NORMAL, BRANDS } from '../src/data.js';
import {
  applyMove,
  createSolvedCube,
  getBrandAnchors,
  getFaceCells,
  getWorldFaces,
  inverseMove,
  isFaceSolvedForBrand,
  isSolved,
  stateKey,
  vectorKey,
} from '../src/cube-state.js';
import { analyzeComposition, describeFacePopulation } from '../src/world-model.js';

function applySequence(state, moves) {
  return moves.reduce((next, move) => applyMove(next, move), state);
}

test('the solved model contains 27 cubies and 54 globally unique capability stickers', () => {
  const cube = createSolvedCube();
  assert.equal(cube.length, 27);
  assert.equal(cube.reduce((sum, cubie) => sum + cubie.stickers.length, 0), 54);
  assert.equal(new Set(ABILITIES.map((ability) => ability.id)).size, 54);
  assert.equal(new Set(ABILITIES.map((ability) => ability.name)).size, 54);
  assert.equal(new Set(ABILITIES.map((ability) => ability.glyph)).size, 54);
  assert.ok(ABILITIES.every((ability) => ability.traits.length === 6 && ability.traits.every((value) => value >= 0 && value <= 1)));
});

test('each initial face owns nine unique skills from its own family', () => {
  const cube = createSolvedCube();
  for (const brand of BRANDS) {
    const cells = getFaceCells(cube, BRAND_FACE_NORMAL[brand.id]);
    assert.equal(cells.length, 9);
    assert.ok(cells.every(Boolean));
    assert.equal(new Set(cells.map((cell) => cell.sticker.abilityId)).size, 9);
    assert.ok(cells.every((cell) => cell.sticker.brandId === brand.id));
    assert.equal(isFaceSolvedForBrand(cube, brand.id), true);
  }
  assert.equal(isSolved(cube), true);
});

test('every layer turn preserves 27 cubies, six complete faces, and six distinct world anchors', () => {
  let cube = createSolvedCube();
  const moves = [
    { axis: 'x', layer: 1, turns: 1 },
    { axis: 'y', layer: 0, turns: 3 },
    { axis: 'z', layer: -1, turns: 2 },
    { axis: 'x', layer: 0, turns: 1 },
    { axis: 'y', layer: -1, turns: 1 },
  ];
  cube = applySequence(cube, moves);
  assert.equal(cube.length, 27);
  assert.equal(cube.reduce((sum, cubie) => sum + cubie.stickers.length, 0), 54);
  const anchors = getBrandAnchors(cube);
  assert.equal(Object.keys(anchors).length, 6);
  assert.equal(new Set(Object.values(anchors).map((anchor) => vectorKey(anchor.normal))).size, 6);
  const worlds = getWorldFaces(cube);
  for (const brand of BRANDS) {
    assert.equal(worlds[brand.id].cells.length, 9);
    assert.ok(worlds[brand.id].cells.every(Boolean));
  }
});

test('four quarter turns and move followed by its inverse return exactly to the starting orientation', () => {
  const solved = createSolvedCube();
  const startKey = stateKey(solved);
  for (const axis of ['x', 'y', 'z']) {
    for (const layer of [-1, 0, 1]) {
      let cube = solved;
      for (let i = 0; i < 4; i += 1) cube = applyMove(cube, { axis, layer, turns: 1 });
      assert.equal(stateKey(cube), startKey, `${axis} layer ${layer} after four turns`);
      cube = applyMove(applyMove(solved, { axis, layer, turns: 1 }), inverseMove({ axis, layer, turns: 1 }));
      assert.equal(stateKey(cube), startKey, `${axis} layer ${layer} inverse`);
    }
  }
});

test('a mixed slice sequence can be reversed from last move to first', () => {
  const solved = createSolvedCube();
  const moves = [
    { axis: 'x', layer: 1, turns: 1 },
    { axis: 'z', layer: 0, turns: 3 },
    { axis: 'y', layer: -1, turns: 2 },
    { axis: 'x', layer: 0, turns: 3 },
    { axis: 'z', layer: 1, turns: 1 },
  ];
  let cube = applySequence(solved, moves);
  assert.notEqual(stateKey(cube), stateKey(solved));
  cube = applySequence(cube, [...moves].reverse().map(inverseMove));
  assert.equal(stateKey(cube), stateKey(solved));
  assert.equal(isSolved(cube), true);
});

test('world analysis is bounded, deterministic, and responds to a mixed composition', () => {
  const cube = createSolvedCube();
  for (const brand of BRANDS) {
    const cells = getFaceCells(cube, BRAND_FACE_NORMAL[brand.id]);
    const profile = analyzeComposition(brand, cells);
    assert.equal(profile.brandId, brand.id);
    assert.ok(profile.signature >= 0 && profile.signature <= 1);
    assert.ok(profile.activity >= 0 && profile.activity <= 1);
    assert.ok(profile.heights.length === 9 && profile.heights.every((height) => height >= 0.035 && height <= 0.2));
    assert.deepEqual(analyzeComposition(brand.id, cells), profile);
  }
  const mixed = applyMove(cube, { axis: 'z', layer: 0, turns: 1 });
  const gptFace = getWorldFaces(mixed).gpt.cells;
  const counts = describeFacePopulation(gptFace);
  assert.ok(Object.values(counts).filter(Boolean).length > 1);
  assert.notDeepEqual(analyzeComposition('gpt', getFaceCells(cube, BRAND_FACE_NORMAL.gpt)), analyzeComposition('gpt', gptFace));
});
