import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import CubeState from '../vendor/cubejs/index.js';
import { FACE_LAYOUT, FAMILIES } from './data.js';
import { parseMove, parseAlgorithm, physicalTurnToNotation, rotateGridVector } from './moves.js';
import { makeAbilityTexture, makeFaceTexture } from './textures.js';

const SPACING = 1.025;
const CUBIE_SIZE = 0.975;
const TILE_SIZE = 0.86;
const AXIS_INDEX = { x: 0, y: 1, z: 2 };
const FACE_NORMALS = FACE_LAYOUT.map((layout) => new THREE.Vector3(...layout.normal));
const OUTWARD = new THREE.Vector3(0, 0, 1);
const TEMP_VECTOR = new THREE.Vector3();
const TEMP_VECTOR_2 = new THREE.Vector3();
const TEMP_VECTOR_3 = new THREE.Vector3();
const TEMP_MATRIX = new THREE.Matrix4();
const TEMP_MATRIX_2 = new THREE.Matrix4();
const TEMP_MATRIX_3 = new THREE.Matrix4();
const TEMP_POSITION = new THREE.Vector3();
const TEMP_QUATERNION = new THREE.Quaternion();
const TEMP_SCALE = new THREE.Vector3();
const SNAP_MATRIX = new THREE.Matrix4();

function easeInOutCubic(value) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function faceIndexForNormal(normal) {
  let bestIndex = -1;
  let bestDot = 0.85;
  for (let index = 0; index < FACE_NORMALS.length; index += 1) {
    const dot = normal.dot(FACE_NORMALS[index]);
    if (dot > bestDot) {
      bestDot = dot;
      bestIndex = index;
    }
  }
  return bestIndex;
}

function snapQuaternion(quaternion, target) {
  const matrix = TEMP_MATRIX.makeRotationFromQuaternion(quaternion);
  const elements = matrix.elements;
  SNAP_MATRIX.set(
    Math.round(elements[0]), Math.round(elements[4]), Math.round(elements[8]), 0,
    Math.round(elements[1]), Math.round(elements[5]), Math.round(elements[9]), 0,
    Math.round(elements[2]), Math.round(elements[6]), Math.round(elements[10]), 0,
    0, 0, 0, 1,
  );
  target.setFromRotationMatrix(SNAP_MATRIX).normalize();
  return target;
}

function makeStickerMaterial(texture) {
  return new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.94,
    depthWrite: false,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
}

export class CubeRig {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.root.name = 'rubiks-cube';
    scene.add(this.root);
    this.cubelets = [];
    this.stickers = [];
    this.moveQueue = [];
    this.activeTurn = null;
    this.model = new CubeState();
    this.onCommit = () => {};
    this.moveCount = 0;
    this.disposed = false;

    this.bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: '#171b25',
      roughness: 0.36,
      metalness: 0.12,
      clearcoat: 0.36,
      clearcoatRoughness: 0.46,
    });
    this.bodyGeometry = new RoundedBoxGeometry(CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE, 2, 0.055);
    this.tileGeometry = new RoundedBoxGeometry(TILE_SIZE, TILE_SIZE, 0.052, 2, 0.022);
    this.iconGeometry = new THREE.PlaneGeometry(TILE_SIZE * 0.93, TILE_SIZE * 0.93, 1, 1);
    this.moteGeometry = new THREE.SphereGeometry(1, 8, 6);
    this.moteMaterial = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false });
    this.faceTextures = FAMILIES.map(makeFaceTexture);
    this.faceMaterials = FAMILIES.map((family, index) => new THREE.MeshPhysicalMaterial({
      map: this.faceTextures[index],
      color: '#ffffff',
      roughness: 0.28,
      metalness: 0.16,
      clearcoat: 0.5,
      clearcoatRoughness: 0.37,
      side: THREE.FrontSide,
    }));

    const grid = [-1, 0, 1];
    let stickerId = 0;
    const familyCellIndex = FAMILIES.map(() => 0);
    for (const x of grid) {
      for (const y of grid) {
        for (const z of grid) {
          const cubie = new THREE.Mesh(this.bodyGeometry, this.bodyMaterial);
          cubie.position.set(x * SPACING, y * SPACING, z * SPACING);
          cubie.userData.grid = [x, y, z];
          cubie.userData.homeGrid = [x, y, z];
          cubie.userData.id = this.cubelets.length;
          cubie.name = `cubie-${x + 1}${y + 1}${z + 1}`;
          this.root.add(cubie);
          this.cubelets.push(cubie);

          for (let axis = 0; axis < 3; axis += 1) {
            if (cubie.userData.grid[axis] !== 1 && cubie.userData.grid[axis] !== -1) continue;
            const normal = new THREE.Vector3();
            normal.setComponent(axis, cubie.userData.grid[axis]);
            const faceIndex = faceIndexForNormal(normal);
            const family = FAMILIES[faceIndex];
            const cellIndex = familyCellIndex[faceIndex];
            familyCellIndex[faceIndex] += 1;
            const ability = family.abilities[cellIndex];
            const stickerGroup = new THREE.Group();
            stickerGroup.position.copy(normal).multiplyScalar(CUBIE_SIZE / 2 + 0.027);
            stickerGroup.quaternion.setFromUnitVectors(OUTWARD, normal);
            stickerGroup.name = `sticker-${family.key}-${cellIndex + 1}`;

            const plate = new THREE.Mesh(this.tileGeometry, this.faceMaterials[faceIndex]);
            plate.userData.stickerId = stickerId;
            stickerGroup.add(plate);

            const iconTexture = makeAbilityTexture(family, ability, faceIndex, cellIndex);
            const iconMaterial = makeStickerMaterial(iconTexture);
            const icon = new THREE.Mesh(this.iconGeometry, iconMaterial);
            icon.position.z = 0.0274;
            icon.userData.stickerId = stickerId;
            stickerGroup.add(icon);
            cubie.add(stickerGroup);

            const sticker = {
              id: stickerId,
              family,
              ability,
              familyIndex: faceIndex,
              cellIndex,
              cubie,
              normal: normal.clone(),
              group: stickerGroup,
              plate,
              icon,
              iconTexture,
              iconMaterial,
              phase: stickerId * 1.61803398875,
              speed: 0.19 + ability.tempo * 0.37,
              moteRadius: 0.325 + (cellIndex % 3) * 0.012,
            };
            plate.userData.sticker = sticker;
            icon.userData.sticker = sticker;
            this.stickers.push(sticker);
            stickerId += 1;
          }
        }
      }
    }

    if (stickerId !== 54 || familyCellIndex.some((count) => count !== 9)) {
      throw new Error(`Cube geometry expected 54 cells (received ${stickerId}).`);
    }

    this.motes = new THREE.InstancedMesh(this.moteGeometry, this.moteMaterial, this.stickers.length);
    this.motes.name = 'capability-cell-signal-motes';
    this.motes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.root.add(this.motes);
    this.stickers.forEach((sticker, index) => {
      this.motes.setColorAt(index, new THREE.Color(sticker.family.palette.accent));
    });
    this.mote = new THREE.Object3D();
    this.rootInverse = new THREE.Matrix4();
    this.cellMatrix = new THREE.Matrix4();
    this.moteMatrix = new THREE.Matrix4();
    this.faceCompositions = this.getFaceCompositions();
    this.root.updateMatrixWorld(true);
    this.updateCellMotes(0);
  }

  get isBusy() {
    return Boolean(this.activeTurn || this.moveQueue.length);
  }

  getStickerFromHit(hit) {
    return hit?.object?.userData?.sticker ?? null;
  }

  getFaceCompositions() {
    const counts = FAMILIES.map(() => FAMILIES.map(() => 0));
    for (const sticker of this.stickers) {
      TEMP_VECTOR.copy(sticker.normal).applyQuaternion(sticker.cubie.quaternion).normalize();
      const faceIndex = faceIndexForNormal(TEMP_VECTOR);
      if (faceIndex >= 0) counts[faceIndex][sticker.familyIndex] += 1;
    }
    this.faceCompositions = counts;
    return counts;
  }

  queueMove(token, options = {}) {
    parseMove(token);
    this.moveQueue.push({ token, source: options.source ?? 'user' });
    this.startNextMove();
  }

  queueAlgorithm(algorithm, options = {}) {
    const moves = parseAlgorithm(algorithm);
    if (!moves.length) return 0;
    for (const move of moves) this.moveQueue.push({ token: move.token, source: options.source ?? 'user' });
    this.startNextMove();
    return moves.length;
  }

  clearQueue() {
    this.moveQueue.length = 0;
  }

  startNextMove() {
    if (this.activeTurn || !this.moveQueue.length || this.disposed) return;
    const entry = this.moveQueue.shift();
    const move = parseMove(entry.token);
    const axisIndex = AXIS_INDEX[move.axis];
    const selected = this.cubelets.filter((cubie) => move.whole || cubie.userData.grid[axisIndex] === move.layer);
    if (!selected.length) throw new Error(`No cubies in ${move.axis} layer ${move.layer}.`);
    const pivot = new THREE.Group();
    pivot.name = `turn-${move.token}`;
    this.root.add(pivot);
    this.root.updateMatrixWorld(true);
    for (const cubie of selected) pivot.attach(cubie);
    this.activeTurn = {
      entry,
      move,
      pivot,
      cubies: selected,
      elapsed: 0,
      duration: move.quarters === 2 ? 0.45 : 0.34,
      targetAngle: move.radians,
    };
  }

  finishTurn() {
    const turn = this.activeTurn;
    if (!turn) return;
    this.root.updateMatrixWorld(true);
    this.rootInverse.copy(this.root.matrixWorld).invert();
    turn.pivot.updateMatrixWorld(true);
    for (const cubie of turn.cubies) {
      this.cellMatrix.multiplyMatrices(this.rootInverse, cubie.matrixWorld);
      this.cellMatrix.decompose(TEMP_POSITION, TEMP_QUATERNION, TEMP_SCALE);
      this.root.add(cubie);
      const grid = rotateGridVector(cubie.userData.grid, turn.move.axis, turn.move.direction * turn.move.quarters);
      cubie.position.set(grid[0] * SPACING, grid[1] * SPACING, grid[2] * SPACING);
      snapQuaternion(TEMP_QUATERNION, cubie.quaternion);
      cubie.scale.set(1, 1, 1);
      cubie.userData.grid = grid;
      cubie.updateMatrix();
    }
    turn.pivot.removeFromParent();
    this.model.move(turn.entry.token);
    this.moveCount += 1;
    this.activeTurn = null;
    this.faceCompositions = this.getFaceCompositions();
    this.onCommit({ token: turn.entry.token, source: turn.entry.source, model: this.model, moveCount: this.moveCount });
    this.startNextMove();
  }

  update(dt, time) {
    if (this.activeTurn) {
      const turn = this.activeTurn;
      turn.elapsed = Math.min(turn.duration, turn.elapsed + dt);
      const progress = easeInOutCubic(turn.elapsed / turn.duration);
      turn.pivot.rotation[turn.move.axis] = turn.targetAngle * progress;
      if (turn.elapsed >= turn.duration) this.finishTurn();
    } else if (this.moveQueue.length) {
      this.startNextMove();
    }
    this.root.updateMatrixWorld(true);
    this.updateCellMotes(time);
  }

  updateCellMotes(time) {
    this.root.updateMatrixWorld(true);
    this.rootInverse.copy(this.root.matrixWorld).invert();
    for (let index = 0; index < this.stickers.length; index += 1) {
      const sticker = this.stickers[index];
      const pulse = 0.5 + 0.5 * Math.sin(time * sticker.speed + sticker.phase);
      sticker.iconMaterial.opacity = 0.91 + pulse * 0.06;
      const glyphScale = 0.992 + pulse * 0.012;
      sticker.icon.scale.set(glyphScale, glyphScale, 1);
      sticker.icon.updateMatrix();

      const angle = time * sticker.speed + sticker.phase;
      this.mote.position.set(
        Math.cos(angle) * sticker.moteRadius,
        Math.sin(angle) * sticker.moteRadius,
        0.031,
      );
      const size = 0.012 + pulse * 0.004;
      this.mote.scale.set(size, size, size);
      this.mote.rotation.set(0, 0, angle + Math.PI / 2);
      this.mote.updateMatrix();
      this.cellMatrix.multiplyMatrices(this.rootInverse, sticker.group.matrixWorld);
      this.moteMatrix.multiplyMatrices(this.cellMatrix, this.mote.matrix);
      this.motes.setMatrixAt(index, this.moteMatrix);
    }
    this.motes.instanceMatrix.needsUpdate = true;
  }

  resetToSolved() {
    this.clearQueue();
    if (this.activeTurn) {
      const turn = this.activeTurn;
      // A caller requests a reset only after stopping/finishing the current gesture.
      this.activeTurn = null;
      for (const cubie of turn.cubies) this.root.attach(cubie);
      turn.pivot.removeFromParent();
    }
    this.model = new CubeState();
    for (const cubie of this.cubelets) {
      const [x, y, z] = cubie.userData.homeGrid;
      cubie.position.set(x * SPACING, y * SPACING, z * SPACING);
      cubie.quaternion.identity();
      cubie.userData.grid = [x, y, z];
    }
    this.moveCount = 0;
    this.faceCompositions = this.getFaceCompositions();
    this.onCommit({ token: null, source: 'reset', model: this.model, moveCount: this.moveCount });
  }

  getExactState() {
    return this.model.toJSON();
  }

  getFacelets() {
    return this.model.asString();
  }

  getModelClone() {
    return this.model.clone();
  }

  getStickerMove(sticker, hitPoint, camera, dragX, dragY, threshold = 18) {
    if (!sticker || Math.hypot(dragX, dragY) < threshold) return null;
    camera.updateMatrixWorld();
    const right = TEMP_VECTOR_2.setFromMatrixColumn(camera.matrixWorld, 0).normalize();
    const up = TEMP_VECTOR_3.setFromMatrixColumn(camera.matrixWorld, 1).normalize();
    const normal = sticker.group.getWorldDirection(TEMP_VECTOR).normalize();
    const tangent = right.multiplyScalar(dragX).addScaledVector(up, -dragY);
    tangent.addScaledVector(normal, -tangent.dot(normal));
    if (tangent.lengthSq() < 64) return null;
    const axis = new THREE.Vector3().crossVectors(normal, tangent).normalize();
    const values = [Math.abs(axis.x), Math.abs(axis.y), Math.abs(axis.z)];
    const axisIndex = values.indexOf(Math.max(...values));
    const axisName = ['x', 'y', 'z'][axisIndex];
    const axisSign = Math.sign(axis.getComponent(axisIndex));
    if (!axisSign) return null;
    const localPoint = this.root.worldToLocal(hitPoint.clone());
    const layer = Math.max(-1, Math.min(1, Math.round(localPoint.getComponent(axisIndex) / SPACING)));
    const token = physicalTurnToNotation(axisName, layer, axisSign);
    return { token, axis: axisName, layer, direction: axisSign };
  }

  dispose() {
    this.disposed = true;
    this.clearQueue();
    if (this.activeTurn) {
      this.activeTurn.pivot.removeFromParent();
      this.activeTurn = null;
    }
    this.root.removeFromParent();
    this.bodyGeometry.dispose();
    this.tileGeometry.dispose();
    this.iconGeometry.dispose();
    this.moteGeometry.dispose();
    this.bodyMaterial.dispose();
    this.moteMaterial.dispose();
    this.faceMaterials.forEach((material) => material.dispose());
    this.faceTextures.forEach((texture) => texture.dispose());
    for (const sticker of this.stickers) {
      sticker.iconMaterial.dispose();
      sticker.iconTexture.dispose();
    }
  }
}
