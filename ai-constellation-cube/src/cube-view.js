import * as THREE from 'three';
import { ABILITY_BY_ID, BRAND_BY_ID } from './data.js';
import { getCubieOrientation3 } from './cube-state.js';

const PITCH = 1;
const CUBIE_SIZE = 0.96;
const STICKER_OFFSET = 0.483;
const AXIS_VECTOR = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
};
const AXIS_INDEX = { x: 0, y: 1, z: 2 };

function quaternionFromMatrix(values) {
  const matrix = new THREE.Matrix4().set(
    values[0], values[1], values[2], 0,
    values[3], values[4], values[5], 0,
    values[6], values[7], values[8], 0,
    0, 0, 0, 1,
  );
  return new THREE.Quaternion().setFromRotationMatrix(matrix);
}

export class CubeView {
  constructor(scene, glyphTextures, initialState) {
    this.scene = scene;
    this.glyphTextures = glyphTextures;
    this.root = new THREE.Group();
    this.root.name = 'cubie assembly';
    this.scene.add(this.root);
    this.turnRoot = new THREE.Group();
    this.turnRoot.name = 'temporary slice pivot';
    this.root.add(this.turnRoot);
    this.visuals = new Map();
    this.pickTargets = [];
    this.tileMaterials = new Map();
    this.glyphMaterials = new Map();
    this.activeSelection = null;

    this.bodyGeometry = new THREE.BoxGeometry(CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE);
    this.tileGeometry = new THREE.BoxGeometry(0.88, 0.88, 0.032);
    this.edgeGeometry = new THREE.EdgesGeometry(this.tileGeometry);
    this.iconGeometry = new THREE.PlaneGeometry(0.49, 0.49);
    this.pickGeometry = new THREE.PlaneGeometry(0.875, 0.875);
    this.bodyMaterial = new THREE.MeshStandardMaterial({
      color: '#171b19', roughness: 0.72, metalness: 0.18,
    });
    this.edgeMaterial = new THREE.LineBasicMaterial({ color: '#2b302b', transparent: true, opacity: 0.74 });

    this.buildInitial(initialState);
  }

  buildInitial(initialState) {
    if (!initialState) throw new Error('CubeView requires the initial cube state.');
    for (const cubie of initialState) this.addCubie(cubie);
    this.sync(initialState);
  }

  materialForTile(brandId) {
    if (!this.tileMaterials.has(brandId)) {
      const brand = BRAND_BY_ID[brandId];
      this.tileMaterials.set(brandId, new THREE.MeshStandardMaterial({
        color: brand.colors.tile,
        roughness: 0.53,
        metalness: 0.12,
      }));
    }
    return this.tileMaterials.get(brandId);
  }

  materialForGlyph(abilityId, brandId) {
    if (!this.glyphMaterials.has(abilityId)) {
      const brand = BRAND_BY_ID[brandId];
      this.glyphMaterials.set(abilityId, new THREE.MeshBasicMaterial({
        color: brand.colors.light,
        map: this.glyphTextures.get(abilityId),
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        side: THREE.DoubleSide,
      }));
    }
    return this.glyphMaterials.get(abilityId);
  }

  addCubie(cubie) {
    const group = new THREE.Group();
    group.name = cubie.id;
    group.userData.cubieId = cubie.id;
    const body = new THREE.Mesh(this.bodyGeometry, this.bodyMaterial);
    body.castShadow = false;
    body.receiveShadow = false;
    group.add(body);
    const stickerViews = new Map();

    for (const sticker of cubie.stickers) {
      const ability = ABILITY_BY_ID[sticker.abilityId];
      const brand = BRAND_BY_ID[sticker.brandId];
      const stickerRoot = new THREE.Group();
      stickerRoot.position.set(
        sticker.localNormal[0] * STICKER_OFFSET,
        sticker.localNormal[1] * STICKER_OFFSET,
        sticker.localNormal[2] * STICKER_OFFSET,
      );
      stickerRoot.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(...sticker.localNormal),
      );
      stickerRoot.userData.stickerId = sticker.id;
      stickerRoot.userData.cubieId = cubie.id;

      const base = new THREE.Mesh(this.tileGeometry, this.materialForTile(brand.id));
      base.position.z = 0;
      base.userData.cubieId = cubie.id;
      base.userData.stickerId = sticker.id;
      stickerRoot.add(base);

      const edges = new THREE.LineSegments(this.edgeGeometry, this.edgeMaterial);
      edges.position.z = 0.018;
      stickerRoot.add(edges);

      const glyph = new THREE.Mesh(this.iconGeometry, this.materialForGlyph(ability.id, brand.id));
      glyph.position.z = 0.0185;
      glyph.renderOrder = 2;
      stickerRoot.add(glyph);

      const pickMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        colorWrite: false,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const pickPlane = new THREE.Mesh(this.pickGeometry, pickMaterial);
      pickPlane.position.z = 0.027;
      pickPlane.layers.set(1);
      pickPlane.userData.cubieId = cubie.id;
      pickPlane.userData.stickerId = sticker.id;
      pickPlane.userData.localNormal = [...sticker.localNormal];
      pickPlane.userData.abilityId = sticker.abilityId;
      stickerRoot.add(pickPlane);
      this.pickTargets.push(pickPlane);

      group.add(stickerRoot);
      stickerViews.set(sticker.id, { root: stickerRoot, base, glyph, pickPlane });
    }

    this.root.add(group);
    this.visuals.set(cubie.id, { group, stickerViews });
  }

  sync(cubies) {
    for (const cubie of cubies) {
      const visual = this.visuals.get(cubie.id);
      if (!visual) continue;
      visual.group.position.set(cubie.pos[0] * PITCH, cubie.pos[1] * PITCH, cubie.pos[2] * PITCH);
      visual.group.quaternion.copy(quaternionFromMatrix(getCubieOrientation3(cubie)));
    }
    this.root.updateMatrixWorld(true);
  }

  beginTurn(move, cubies) {
    if (this.activeSelection) throw new Error('A cube layer is already animating.');
    const axisIndex = AXIS_INDEX[move.axis];
    const selected = cubies.filter((cubie) => cubie.pos[axisIndex] === move.layer);
    if (!selected.length) throw new Error(`No cubies found for ${move.axis} layer ${move.layer}.`);
    this.turnRoot.position.set(0, 0, 0);
    this.turnRoot.quaternion.identity();
    this.turnRoot.scale.set(1, 1, 1);
    this.root.updateMatrixWorld(true);
    const selectedVisuals = selected.map((cubie) => this.visuals.get(cubie.id));
    for (const visual of selectedVisuals) this.turnRoot.attach(visual.group);
    this.activeSelection = { selectedVisuals, selectedIds: new Set(selected.map((cubie) => cubie.id)) };
    return AXIS_VECTOR[move.axis].clone();
  }

  setTurnAngle(axisVector, angle) {
    if (!this.activeSelection) return;
    this.turnRoot.quaternion.setFromAxisAngle(axisVector, angle);
    this.root.updateMatrixWorld(true);
  }

  finishTurn(nextState) {
    if (this.activeSelection) {
      for (const visual of this.activeSelection.selectedVisuals) this.root.attach(visual.group);
      this.activeSelection = null;
    }
    this.turnRoot.position.set(0, 0, 0);
    this.turnRoot.quaternion.identity();
    this.sync(nextState);
  }

  hitTest(raycaster) {
    this.root.updateMatrixWorld(true);
    const hits = raycaster.intersectObjects(this.pickTargets, false);
    return hits[0] ?? null;
  }

  currentLayerForHit(hit, cubies) {
    const cubieId = hit?.object?.userData?.cubieId;
    return cubies.find((cubie) => cubie.id === cubieId) ?? null;
  }

  tileForSticker(stickerId) {
    for (const visual of this.visuals.values()) {
      const view = visual.stickerViews.get(stickerId);
      if (view) return view;
    }
    return null;
  }

  dispose() {
    for (const visual of this.visuals.values()) {
      for (const { pickPlane } of visual.stickerViews.values()) pickPlane.material.dispose();
    }
    this.bodyGeometry.dispose();
    this.tileGeometry.dispose();
    this.edgeGeometry.dispose();
    this.iconGeometry.dispose();
    this.pickGeometry.dispose();
    this.bodyMaterial.dispose();
    this.edgeMaterial.dispose();
    for (const material of this.tileMaterials.values()) material.dispose();
    for (const material of this.glyphMaterials.values()) material.dispose();
    this.scene.remove(this.root);
  }
}
