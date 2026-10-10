import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { ABILITIES, BRANDS } from '../src/data.js';
import { applyMove, createSolvedCube } from '../src/cube-state.js';
import { CubeView } from '../src/cube-view.js';
import { WorldsSystem } from '../src/worlds.js';

test('Three.js scene graph keeps worlds fixed, reuses objects, and animates migrations without WebGL', () => {
  const scene = new THREE.Scene();
  let cube = createSolvedCube();
  const glyphTextures = new Map(ABILITIES.map((ability) => [ability.id, null]));
  const cubeView = new CubeView(scene, glyphTextures, cube);
  const worlds = new WorldsSystem(scene, cube);
  const worldPositions = new Map([...worlds.worlds].map(([id, world]) => [id, world.root.position.clone()]));
  const childCount = scene.children.length;

  const move = { axis: 'z', layer: 0, turns: 1 };
  const axis = cubeView.beginTurn(move, cube);
  cubeView.setTurnAngle(axis, Math.PI / 2);
  cube = applyMove(cube, move);
  cubeView.finishTurn(cube);
  worlds.syncFromCube(cube);

  for (let frame = 0; frame < 18000; frame += 1) worlds.update(1 / 60);

  assert.equal(cubeView.visuals.size, 27);
  assert.equal(worlds.worlds.size, 6);
  assert.equal(worlds.residents.length, 12);
  assert.ok(worlds.residents.some((resident) => resident.cycle >= 1), 'at least one resident completes a cross-world trip');
  assert.equal(scene.children.length, childCount, 'the animation loop does not add scene objects');
  for (const brand of BRANDS) {
    const before = worldPositions.get(brand.id);
    const after = worlds.worlds.get(brand.id).root.position;
    assert.deepEqual(after.toArray(), before.toArray(), `${brand.id} world remains at its original coordinates`);
    assert.ok(Number.isFinite(worlds.profiles.get(brand.id).signature));
    for (const node of worlds.worlds.get(brand.id).nodes) {
      assert.ok(Number.isFinite(node.tower.scale.y));
      assert.ok(node.tower.scale.y >= 0.027 && node.tower.scale.y <= 0.21);
    }
  }
  for (const resident of worlds.residents) {
    assert.ok(Number.isFinite(resident.root.position.x));
    assert.ok(Number.isFinite(resident.root.position.y));
    assert.ok(Number.isFinite(resident.root.position.z));
  }

  worlds.dispose();
  cubeView.dispose();
  assert.equal(scene.children.length, 0);
});
