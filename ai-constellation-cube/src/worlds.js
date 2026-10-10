import * as THREE from 'three';
import { ABILITY_BY_ID, BRAND_BY_ID, BRANDS } from './data.js';
import { getWorldFaces, isFaceSolvedForBrand } from './cube-state.js';
import { analyzeComposition, neighborFit } from './world-model.js';

const ISLAND_RADIUS = 4.15;
const ISLAND_Y = -1.88;
const PATH_Y = -1.77;
const TRACK_RADIUS = 5.28;
const NODE_SPACING = 0.31;
const NODE_BASE_Y = 0.085;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function hash(text) {
  let value = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    value ^= text.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function lineFromPoints(points, material) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points.map((point) => (
    point.isVector3 ? point : new THREE.Vector3(point[0], point[1], point[2])
  )));
  return new THREE.Line(geometry, material);
}

function addCylinder(parent, radiusTop, radiusBottom, height, color, y, options = {}) {
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.66,
    metalness: options.metalness ?? 0.08,
    transparent: options.opacity !== undefined && options.opacity < 1,
    opacity: options.opacity ?? 1,
  });
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, options.segments ?? 24), material);
  mesh.position.y = y;
  parent.add(mesh);
  return mesh;
}

function makeResidentsMaterial(color) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.04 });
}

function collectResources(root, geometries, materials) {
  root.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    if (Array.isArray(object.material)) object.material.forEach((material) => materials.add(material));
    else if (object.material) materials.add(object.material);
  });
}

function makeResident(scene, id, color) {
  const root = new THREE.Group();
  root.name = `traveler-${id}`;
  const bodyMaterial = makeResidentsMaterial(color);
  const faceMaterial = new THREE.MeshStandardMaterial({ color: '#d8c7a4', roughness: 0.55 });
  const limbMaterial = new THREE.MeshStandardMaterial({ color: '#353b35', roughness: 0.82 });

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.055, 3, 5), bodyMaterial);
  body.position.y = 0.068;
  root.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 6), faceMaterial);
  head.position.set(0, 0.132, 0.003);
  root.add(head);
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.043, 0.024), limbMaterial);
  pack.position.set(0, 0.064, -0.034);
  root.add(pack);
  const feet = new THREE.Mesh(new THREE.CylinderGeometry(0.031, 0.037, 0.018, 6), limbMaterial);
  feet.position.y = 0.009;
  root.add(feet);
  scene.add(root);
  return { root, id, bodyMaterial, faceMaterial, limbMaterial };
}

function makeCapabilityNode(worldRoot, brandMaterials, shapes, ability, index, brandId) {
  const row = Math.floor(index / 3);
  const col = index % 3;
  const x = (col - 1) * NODE_SPACING;
  const z = (row - 1) * NODE_SPACING;
  const root = new THREE.Group();
  root.position.set(x, 0, z);
  worldRoot.add(root);

  const pad = new THREE.Mesh(new THREE.BoxGeometry(0.275, 0.025, 0.275), brandMaterials.get(brandId));
  pad.position.y = 0.071;
  root.add(pad);

  const seed = hash(ability.id);
  const geometryIndex = seed % shapes.length;
  const height = 0.06 + ((seed >>> 4) % 6) * 0.012;
  const towerGeometry = new THREE.BoxGeometry(0.065, 1, 0.065);
  const tower = new THREE.Mesh(towerGeometry, brandMaterials.get(brandId));
  tower.scale.y = height;
  tower.position.y = NODE_BASE_Y + height * 0.5;
  root.add(tower);

  const signal = new THREE.Mesh(shapes[geometryIndex], brandMaterials.get(brandId));
  signal.scale.setScalar(0.038 + (seed % 4) * 0.004);
  signal.position.set(0, NODE_BASE_Y + height + 0.035, 0);
  signal.rotation.set((seed % 3) * 0.16, ((seed >>> 3) % 8) * 0.3, (seed % 5) * 0.08);
  root.add(signal);

  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(0.036 + (seed % 3) * 0.006, 0.003, 4, 18),
    brandMaterials.get(brandId),
  );
  orbit.rotation.x = Math.PI / 2;
  orbit.position.y = NODE_BASE_Y + height + 0.034;
  root.add(orbit);

  return {
    root, pad, tower, signal, orbit, index, baseHeight: height, targetHeight: height,
    phase: (seed % 1000) / 1000 * Math.PI * 2,
    brandId,
    abilityId: ability.id,
    ability,
  };
}

function addGridNetwork(parent, brand, mechanism) {
  const points = [];
  const pointAt = (row, col, y = 0.112) => new THREE.Vector3((col - 1) * NODE_SPACING, y, (row - 1) * NODE_SPACING);
  const push = (a, b) => { points.push(a, b); };
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      if (col < 2) push(pointAt(row, col), pointAt(row, col + 1));
      if (row < 2) push(pointAt(row, col), pointAt(row + 1, col));
      if (mechanism === 'weave' && row < 2 && col < 2) {
        push(pointAt(row, col, 0.118), pointAt(row + 1, col + 1, 0.118));
        push(pointAt(row, col + 1, 0.118), pointAt(row + 1, col, 0.118));
      }
      if (mechanism === 'market' && row === 1 && col === 1) {
        push(pointAt(row, col, 0.122), pointAt(0, 0, 0.122));
        push(pointAt(row, col, 0.122), pointAt(0, 2, 0.122));
        push(pointAt(row, col, 0.122), pointAt(2, 0, 0.122));
        push(pointAt(row, col, 0.122), pointAt(2, 2, 0.122));
      }
    }
  }
  if (mechanism === 'workshop') {
    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < 2; col += 1) {
        push(pointAt(row, col, 0.132), pointAt(row + 1, col + 1, 0.132));
        push(pointAt(row, col + 1, 0.132), pointAt(row + 1, col, 0.132));
      }
    }
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: brand.colors.accent, transparent: true, opacity: 0.22 });
  const network = new THREE.LineSegments(geometry, material);
  parent.add(network);
  return network;
}

function createSignature(world) {
  const { root, brand, brandMaterials } = world;
  const group = new THREE.Group();
  group.name = `${brand.id} mechanism`;
  root.add(group);
  const dark = brand.colors.shade;
  const accent = brand.colors.accent;
  const warm = brand.colors.light;
  const sharedMat = (color, metalness = 0.18, roughness = 0.58) => new THREE.MeshStandardMaterial({ color, metalness, roughness });

  if (brand.mechanism === 'relay') {
    const hub = addCylinder(group, 0.115, 0.145, 0.045, dark, 0.17, { metalness: 0.18 });
    hub.rotation.y = Math.PI / 6;
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.017, 0.24, 7), sharedMat(accent, 0.2));
    mast.position.set(0.68, 0.19, -0.55);
    group.add(mast);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 6), sharedMat(warm, 0.12));
    cap.position.set(0.68, 0.315, -0.55);
    group.add(cap);
  } else if (brand.mechanism === 'weave') {
    const frame = new THREE.Group();
    const edgeMaterial = sharedMat(accent, 0.1, 0.72);
    for (const sign of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.014, 0.018), edgeMaterial);
      rail.position.set(0, 0.14, sign * 0.72);
      frame.add(rail);
      const side = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.014, 1.48), edgeMaterial);
      side.position.set(sign * 0.72, 0.14, 0);
      frame.add(side);
    }
    group.add(frame);
  } else if (brand.mechanism === 'observatory') {
    const ringMaterial = sharedMat(accent, 0.24, 0.48);
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.012, 6, 64), ringMaterial);
    ringA.rotation.x = Math.PI / 2;
    ringA.position.y = 0.1;
    group.add(ringA);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(0.57, 0.009, 5, 56), sharedMat(warm, 0.18, 0.55));
    ringB.rotation.set(Math.PI / 2 + 0.17, 0.26, 0.12);
    ringB.position.y = 0.14;
    group.add(ringB);
    world.orbitingRings = [ringA, ringB];
  } else if (brand.mechanism === 'stream') {
    const streamPoints = [
      new THREE.Vector3(-0.70, 0.117, -0.42),
      new THREE.Vector3(-0.34, 0.121, -0.18),
      new THREE.Vector3(0.10, 0.118, -0.23),
      new THREE.Vector3(0.42, 0.12, 0.04),
      new THREE.Vector3(0.18, 0.121, 0.34),
      new THREE.Vector3(0.58, 0.118, 0.52),
    ];
    const curve = new THREE.CatmullRomCurve3(streamPoints, false, 'centripetal');
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.021, 5, false), sharedMat('#527c79', 0.08, 0.4));
    group.add(tube);
    const flow = new THREE.Mesh(new THREE.SphereGeometry(0.025, 7, 5), sharedMat(brand.colors.accent, 0.05, 0.4));
    group.add(flow);
    world.flowCurve = curve;
    world.flowMarker = flow;
  } else if (brand.mechanism === 'market') {
    const stalls = new THREE.Group();
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const x = sx * 0.66;
        const z = sz * 0.66;
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.13, 0.07), sharedMat(dark, 0.08, 0.75));
        post.position.set(x, 0.16, z);
        stalls.add(post);
        const roof = new THREE.Mesh(new THREE.ConeGeometry(0.082, 0.06, 4), sharedMat(accent, 0.12, 0.65));
        roof.position.set(x, 0.255, z);
        roof.rotation.y = Math.PI / 4;
        stalls.add(roof);
      }
    }
    group.add(stalls);
    world.stalls = stalls;
  } else if (brand.mechanism === 'workshop') {
    const truss = new THREE.Group();
    const beamMaterial = sharedMat(accent, 0.28, 0.54);
    const makeBeam = (a, b, radius = 0.012) => {
      const start = new THREE.Vector3(...a);
      const end = new THREE.Vector3(...b);
      const direction = end.clone().sub(start);
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 5), beamMaterial);
      beam.position.copy(start).add(end).multiplyScalar(0.5);
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
      truss.add(beam);
    };
    for (const x of [-0.73, 0.73]) {
      for (const z of [-0.73, 0.73]) makeBeam([x, 0.12, z], [x, 0.40, z]);
    }
    for (const y of [0.14, 0.38]) {
      makeBeam([-0.73, y, -0.73], [0.73, y, -0.73], 0.01);
      makeBeam([-0.73, y, 0.73], [0.73, y, 0.73], 0.01);
      makeBeam([-0.73, y, -0.73], [-0.73, y, 0.73], 0.01);
      makeBeam([0.73, y, -0.73], [0.73, y, 0.73], 0.01);
    }
    makeBeam([-0.73, 0.14, -0.73], [0.73, 0.38, 0.73], 0.009);
    makeBeam([0.73, 0.14, -0.73], [-0.73, 0.38, 0.73], 0.009);
    group.add(truss);
    world.truss = truss;
  }
  world.signatureRoot = group;
  return group;
}

function createCompletionForm(world) {
  const { root, brand } = world;
  const group = new THREE.Group();
  group.name = `${brand.id} solved form`;
  root.add(group);
  const material = new THREE.MeshStandardMaterial({ color: brand.colors.accent, roughness: 0.53, metalness: 0.18 });
  const lightMaterial = new THREE.MeshStandardMaterial({ color: brand.colors.light, roughness: 0.58, metalness: 0.12 });

  if (brand.flourish === 'relay') {
    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.012, 6, 40), material);
    loop.position.set(0, 0.29, 0);
    group.add(loop);
    for (let i = 0; i < 3; i += 1) {
      const angle = (i / 3) * Math.PI * 2;
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.11, 5), lightMaterial);
      rod.position.set(Math.cos(angle) * 0.13, 0.26, Math.sin(angle) * 0.13);
      group.add(rod);
    }
  } else if (brand.flourish === 'weave') {
    for (let i = -1; i <= 1; i += 1) {
      const strand = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.009, 0.012), material);
      strand.position.set(0, 0.235 + i * 0.035, i * 0.08);
      strand.rotation.y = i * 0.3;
      group.add(strand);
    }
  } else if (brand.flourish === 'observatory') {
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.011, 6, 40), lightMaterial);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 0.31;
    group.add(halo);
    const vertical = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.009, 5, 36), material);
    vertical.position.y = 0.31;
    group.add(vertical);
  } else if (brand.flourish === 'stream') {
    const basin = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.028, 6, 32), material);
    basin.rotation.x = Math.PI / 2;
    basin.position.y = 0.15;
    group.add(basin);
    const pool = new THREE.Mesh(new THREE.CircleGeometry(0.16, 32), lightMaterial);
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = 0.145;
    group.add(pool);
  } else if (brand.flourish === 'market') {
    for (let i = 0; i < 3; i += 1) {
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.67, 0.017, 0.025), material);
      bridge.position.set(0, 0.25 + i * 0.035, (i - 1) * 0.13);
      bridge.rotation.y = i % 2 ? 0.18 : -0.18;
      group.add(bridge);
    }
  } else if (brand.flourish === 'workshop') {
    const beamA = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.018, 0.02), material);
    beamA.position.set(0, 0.27, 0);
    beamA.rotation.z = Math.PI / 4;
    const beamB = beamA.clone();
    beamB.rotation.z = -Math.PI / 4;
    group.add(beamA, beamB);
  }
  group.scale.setScalar(0.001);
  world.completionForm = group;
}

function createIsland(scene, brand, index, brandMaterials, shapes) {
  const angle = (index / BRANDS.length) * Math.PI * 2;
  const root = new THREE.Group();
  root.name = `${brand.id} micro-world`;
  root.position.set(Math.cos(angle) * ISLAND_RADIUS, ISLAND_Y, Math.sin(angle) * ISLAND_RADIUS);
  scene.add(root);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.21, 48),
    new THREE.MeshBasicMaterial({ color: '#060908', transparent: true, opacity: 0.4, depthWrite: false, side: THREE.DoubleSide }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.108;
  root.add(shadow);

  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(1.02, 1.09, 0.12, 48),
    new THREE.MeshStandardMaterial({ color: '#222824', roughness: 0.76, metalness: 0.15 }),
  );
  plate.position.y = 0;
  root.add(plate);
  const upperRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.91, 0.012, 5, 72),
    new THREE.MeshStandardMaterial({ color: brand.colors.shade, roughness: 0.55, metalness: 0.17 }),
  );
  upperRing.rotation.x = Math.PI / 2;
  upperRing.position.y = 0.067;
  root.add(upperRing);
  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.84, 0.0045, 4, 72),
    new THREE.MeshStandardMaterial({ color: brand.colors.accent, roughness: 0.65, metalness: 0.05, transparent: true, opacity: 0.44 }),
  );
  innerRing.rotation.x = Math.PI / 2;
  innerRing.position.y = 0.069;
  root.add(innerRing);

  const world = {
    brand,
    index,
    angle,
    root,
    plate,
    upperRing,
    innerRing,
    nodes: [],
    brandMaterials,
    signature: 0.5,
    targetSignature: 0.5,
    scale: 1,
    targetScale: 1,
    perfect: 1,
    targetPerfect: 1,
    profile: null,
    orbitingRings: null,
  };
  for (let cell = 0; cell < 9; cell += 1) {
    const placeholder = { id: `${brand.id}-initial-${cell}`, traits: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5] };
    world.nodes.push(makeCapabilityNode(root, brandMaterials, shapes, placeholder, cell, brand.id));
  }
  world.network = addGridNetwork(root, brand, brand.mechanism);
  createSignature(world);
  createCompletionForm(world);
  return world;
}

function createPortal(scene, world) {
  const angle = world.angle;
  const radial = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
  const tangent = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle));
  const center = new THREE.Vector3(
    world.root.position.x + radial.x * 1.07,
    PATH_Y,
    world.root.position.z + radial.z * 1.07,
  );
  const left = center.clone().addScaledVector(tangent, -0.17);
  const right = center.clone().addScaledVector(tangent, 0.17);
  const material = new THREE.MeshStandardMaterial({ color: world.brand.colors.shade, roughness: 0.55, metalness: 0.18 });
  const warmMaterial = new THREE.MeshStandardMaterial({ color: world.brand.colors.accent, roughness: 0.6, metalness: 0.12 });
  const gate = new THREE.Group();
  gate.name = `${world.brand.id} passage`;
  scene.add(gate);
  for (const point of [left, right]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.29, 0.042), material);
    post.position.set(point.x, PATH_Y + 0.145, point.z);
    gate.add(post);
  }
  const archPoints = [
    new THREE.Vector3(left.x, PATH_Y + 0.29, left.z),
    new THREE.Vector3(center.x, PATH_Y + 0.37, center.z),
    new THREE.Vector3(right.x, PATH_Y + 0.29, right.z),
  ];
  const archCurve = new THREE.CatmullRomCurve3(archPoints, false, 'centripetal');
  const arch = new THREE.Mesh(new THREE.TubeGeometry(archCurve, 12, 0.014, 5, false), warmMaterial);
  gate.add(arch);
  const threshold = lineFromPoints([
    [left.x, PATH_Y + 0.014, left.z],
    [right.x, PATH_Y + 0.014, right.z],
  ], new THREE.LineBasicMaterial({ color: world.brand.colors.accent, transparent: true, opacity: 0.5 }));
  gate.add(threshold);

  const inner = new THREE.Vector3(
    world.root.position.x + radial.x * 0.84,
    PATH_Y + 0.006,
    world.root.position.z + radial.z * 0.84,
  );
  const outer = center.clone();
  const footpath = lineFromPoints([inner, outer], new THREE.LineBasicMaterial({
    color: world.brand.colors.shade,
    transparent: true,
    opacity: 0.35,
  }));
  gate.add(footpath);
  return { center, radial, tangent, gate };
}

function makeStrawberry(parent) {
  const berry = new THREE.Group();
  berry.position.set(0.73, 0.095, 0.43);
  berry.scale.setScalar(0.5);
  const fruit = new THREE.Mesh(
    new THREE.ConeGeometry(0.105, 0.15, 7),
    new THREE.MeshStandardMaterial({ color: '#93564b', roughness: 0.74, metalness: 0.02 }),
  );
  fruit.rotation.x = Math.PI;
  fruit.position.y = 0.07;
  berry.add(fruit);
  const leafMaterial = new THREE.MeshStandardMaterial({ color: '#6d8060', roughness: 0.8 });
  for (let i = 0; i < 5; i += 1) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.065, 4), leafMaterial);
    const angle = (i / 5) * Math.PI * 2;
    leaf.position.set(Math.cos(angle) * 0.035, 0.144, Math.sin(angle) * 0.035);
    leaf.rotation.z = -Math.cos(angle) * 0.45;
    leaf.rotation.x = Math.sin(angle) * 0.45;
    berry.add(leaf);
  }
  const seedMaterial = new THREE.MeshBasicMaterial({ color: '#d7b987' });
  for (const [x, y, z] of [[0.02, 0.07, 0.065], [-0.035, 0.045, 0.05], [0.045, 0.025, 0.028]]) {
    const seed = new THREE.Mesh(new THREE.SphereGeometry(0.008, 4, 4), seedMaterial);
    seed.position.set(x, y, z);
    berry.add(seed);
  }
  parent.add(berry);
}

export class WorldsSystem {
  constructor(scene, initialCubeState) {
    this.scene = scene;
    this.brandMaterials = new Map(BRANDS.map((brand) => [brand.id, new THREE.MeshStandardMaterial({
      color: brand.colors.tile,
      roughness: 0.62,
      metalness: 0.12,
    })]));
    this.shapes = [
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1, 0),
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.ConeGeometry(0.82, 1.3, 5),
      new THREE.CylinderGeometry(0.62, 0.82, 1.1, 6),
      new THREE.BoxGeometry(1, 1, 1),
    ];
    this.worlds = new Map();
    this.profiles = new Map();
    this.portals = new Map();
    this.residents = [];
    this.ownedRoots = [];
    this.time = 0;
    this.createGround();
    BRANDS.forEach((brand, index) => {
      const world = createIsland(scene, brand, index, this.brandMaterials, this.shapes);
      this.worlds.set(brand.id, world);
      this.ownedRoots.push(world.root);
    });
    for (const world of this.worlds.values()) {
      const portal = createPortal(scene, world);
      this.portals.set(world.brand.id, portal);
      this.ownedRoots.push(portal.gate);
    }
    this.createPassageRing();
    if (this.worlds.has('gpt')) makeStrawberry(this.worlds.get('gpt').root);
    this.createResidents();
    this.syncFromCube(initialCubeState);
  }

  createGround() {
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(7.05, 96),
      new THREE.MeshStandardMaterial({ color: '#151a18', roughness: 0.95, metalness: 0.02 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.035;
    this.scene.add(floor);
    this.ownedRoots.push(floor);
    this.floor = floor;

    const centerDeck = new THREE.Mesh(
      new THREE.CylinderGeometry(1.48, 1.57, 0.25, 64),
      new THREE.MeshStandardMaterial({ color: '#202522', roughness: 0.72, metalness: 0.2 }),
    );
    centerDeck.position.y = -1.66;
    this.scene.add(centerDeck);
    this.ownedRoots.push(centerDeck);
    const centerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.47, 0.018, 6, 96),
      new THREE.MeshStandardMaterial({ color: '#5d695e', roughness: 0.62, metalness: 0.14 }),
    );
    centerRing.rotation.x = Math.PI / 2;
    centerRing.position.y = -1.795;
    this.scene.add(centerRing);
    this.ownedRoots.push(centerRing);
    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.35, 0.006, 4, 96),
      new THREE.MeshBasicMaterial({ color: '#616859', transparent: true, opacity: 0.25 }),
    );
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = -1.531;
    this.scene.add(innerRing);
    this.ownedRoots.push(innerRing);
  }

  createPassageRing() {
    const trackMaterial = new THREE.MeshStandardMaterial({ color: '#38423c', roughness: 0.72, metalness: 0.06 });
    const track = new THREE.Mesh(new THREE.TorusGeometry(TRACK_RADIUS, 0.012, 4, 144), trackMaterial);
    track.rotation.x = Math.PI / 2;
    track.position.y = PATH_Y;
    this.scene.add(track);
    this.ownedRoots.push(track);
    this.track = track;

    const innerTrace = new THREE.Mesh(
      new THREE.TorusGeometry(TRACK_RADIUS - 0.075, 0.0035, 4, 144),
      new THREE.MeshBasicMaterial({ color: '#777864', transparent: true, opacity: 0.22 }),
    );
    innerTrace.rotation.x = Math.PI / 2;
    innerTrace.position.y = PATH_Y - 0.016;
    this.scene.add(innerTrace);
    this.ownedRoots.push(innerTrace);
  }

  createResidents() {
    for (const [worldIndex, brand] of BRANDS.entries()) {
      for (let localIndex = 0; localIndex < 2; localIndex += 1) {
        const id = worldIndex * 2 + localIndex;
        const resident = makeResident(this.scene, id, brand.colors.accent);
        const cellIndex = (worldIndex * 3 + localIndex * 4) % 9;
        resident.currentBrand = brand.id;
        resident.cellIndex = cellIndex;
        resident.cycle = 0;
        resident.wait = 1.8 + id * 1.73;
        resident.travelTime = 0;
        resident.duration = 9.5 + (id % 3) * 1.5;
        resident.curve = null;
        resident.phase = id * 1.91;
        resident.root.position.copy(this.nodeWorldPosition(brand.id, cellIndex));
        this.residents.push(resident);
        this.ownedRoots.push(resident.root);
      }
    }
  }

  nodeWorldPosition(brandId, cellIndex, y = PATH_Y) {
    const world = this.worlds.get(brandId);
    if (!world) return new THREE.Vector3(0, y, 0);
    const row = Math.floor(cellIndex / 3);
    const col = cellIndex % 3;
    return new THREE.Vector3(
      world.root.position.x + (col - 1) * NODE_SPACING,
      y,
      world.root.position.z + (row - 1) * NODE_SPACING,
    );
  }

  syncFromCube(cubies) {
    const faces = getWorldFaces(cubies);
    for (const brand of BRANDS) {
      const face = faces[brand.id];
      if (!face) continue;
      const world = this.worlds.get(brand.id);
      const profile = analyzeComposition(brand, face.cells);
      this.profiles.set(brand.id, profile);
      world.profile = profile;
      world.targetSignature = profile.signature;
      world.targetScale = profile.scale;
      world.targetPerfect = isFaceSolvedForBrand(cubies, brand.id) ? 1 : 0;
      world.perfect = world.perfect ?? world.targetPerfect;

      for (let index = 0; index < 9; index += 1) {
        const cell = face.cells[index];
        const ability = cell ? ABILITY_BY_ID[cell.sticker.abilityId] : null;
        if (!ability) continue;
        const node = world.nodes[index];
        const abilityBrand = BRAND_BY_ID[ability.brandId];
        node.abilityId = ability.id;
        node.ability = ability;
        node.brandId = ability.brandId;
        node.targetHeight = profile.heights[index];
        node.pad.material = this.brandMaterials.get(ability.brandId);
        node.tower.material = this.brandMaterials.get(ability.brandId);
        node.signal.material = this.brandMaterials.get(ability.brandId);
        node.orbit.material = this.brandMaterials.get(ability.brandId);
        const seed = hash(ability.id);
        node.signal.geometry = this.shapes[seed % this.shapes.length];
        const scale = 0.034 + ((seed >>> 4) % 5) * 0.004;
        node.signal.scale.set(scale, scale, scale);
        node.signal.rotation.set((seed % 4) * 0.12, ((seed >>> 3) % 8) * 0.28, (seed % 7) * 0.07);
        node.root.userData.abilityBrand = abilityBrand.id;
      }
      world.network.material.opacity = 0.14 + profile.signature * 0.22;
      if (world.stalls) world.stalls.scale.setScalar(0.86 + profile.signature * 0.18);
      if (world.truss) world.truss.scale.setScalar(0.9 + profile.signature * 0.16);
    }
  }

  chooseNeighbor(brandId, residentId) {
    const index = BRANDS.findIndex((brand) => brand.id === brandId);
    const source = this.profiles.get(brandId);
    const candidates = [
      { index: (index + 1) % BRANDS.length, direction: 1 },
      { index: (index + BRANDS.length - 1) % BRANDS.length, direction: -1 },
    ];
    let best = candidates[0];
    let bestScore = -Infinity;
    for (const candidate of candidates) {
      const brand = BRANDS[candidate.index];
      const profile = this.profiles.get(brand.id);
      const fit = neighborFit(source, profile, candidate.direction) + (residentId % 2 ? -candidate.direction : candidate.direction) * 0.001;
      if (fit > bestScore) {
        bestScore = fit;
        best = candidate;
      }
    }
    return { brandId: BRANDS[best.index].id, index: best.index };
  }

  startMigration(resident) {
    const fromIndex = BRANDS.findIndex((brand) => brand.id === resident.currentBrand);
    const target = this.chooseNeighbor(resident.currentBrand, resident.id);
    const sourceWorld = this.worlds.get(resident.currentBrand);
    const targetWorld = this.worlds.get(target.brandId);
    const sourceRadial = new THREE.Vector3(Math.cos(sourceWorld.angle), 0, Math.sin(sourceWorld.angle));
    const targetRadial = new THREE.Vector3(Math.cos(targetWorld.angle), 0, Math.sin(targetWorld.angle));
    const sourceNode = this.nodeWorldPosition(resident.currentBrand, resident.cellIndex, PATH_Y);
    const targetCell = (resident.id * 5 + resident.cycle * 2 + 1) % 9;
    const targetNode = this.nodeWorldPosition(target.brandId, targetCell, PATH_Y);
    const sourceGate = new THREE.Vector3(
      sourceWorld.root.position.x + sourceRadial.x * 1.07,
      PATH_Y,
      sourceWorld.root.position.z + sourceRadial.z * 1.07,
    );
    const targetGate = new THREE.Vector3(
      targetWorld.root.position.x + targetRadial.x * 1.07,
      PATH_Y,
      targetWorld.root.position.z + targetRadial.z * 1.07,
    );
    const direction = target.index === (fromIndex + 1) % BRANDS.length ? 1 : -1;
    const middleAngle = sourceWorld.angle + direction * Math.PI / BRANDS.length;
    const arcMid = new THREE.Vector3(Math.cos(middleAngle) * TRACK_RADIUS, PATH_Y, Math.sin(middleAngle) * TRACK_RADIUS);
    const sourceTrack = new THREE.Vector3(sourceRadial.x * TRACK_RADIUS, PATH_Y, sourceRadial.z * TRACK_RADIUS);
    const targetTrack = new THREE.Vector3(targetRadial.x * TRACK_RADIUS, PATH_Y, targetRadial.z * TRACK_RADIUS);
    const points = [
      sourceNode,
      sourceGate.clone().addScaledVector(sourceRadial, -0.12),
      sourceGate,
      sourceTrack,
      arcMid,
      targetTrack,
      targetGate,
      targetGate.clone().addScaledVector(targetRadial, -0.12),
      targetNode,
    ];
    resident.curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.3);
    resident.targetBrand = target.brandId;
    resident.targetCell = targetCell;
    resident.travelTime = 0;
    resident.duration = 8.2 + (resident.id % 4) * 1.05;
    resident.fromIndex = fromIndex;
  }

  updateResident(resident, delta) {
    if (resident.curve) {
      resident.travelTime += delta;
      const progress = clamp(resident.travelTime / resident.duration, 0, 1);
      const point = resident.curve.getPoint(progress);
      const tangent = resident.curve.getTangent(progress);
      resident.root.position.copy(point);
      resident.root.position.y += Math.sin(this.time * 6 + resident.phase) * 0.008;
      resident.root.rotation.y = Math.atan2(tangent.x, tangent.z);
      if (progress >= 1) {
        resident.currentBrand = resident.targetBrand;
        resident.cellIndex = resident.targetCell;
        resident.targetBrand = null;
        resident.curve = null;
        resident.cycle += 1;
        resident.wait = 7.5 + ((resident.id * 13 + resident.cycle * 7) % 80) / 10;
        resident.root.position.copy(this.nodeWorldPosition(resident.currentBrand, resident.cellIndex));
      }
      return;
    }

    resident.wait -= delta;
    const idlePosition = this.nodeWorldPosition(resident.currentBrand, resident.cellIndex);
    resident.root.position.copy(idlePosition);
    resident.root.position.y += 0.006 * Math.sin(this.time * 2.3 + resident.phase);
    resident.root.rotation.y = Math.sin(this.time * 0.55 + resident.phase) * 0.15;
    if (resident.wait <= 0) this.startMigration(resident);
  }

  update(delta) {
    this.time += delta;
    const alpha = 1 - Math.exp(-delta / 2.4);
    for (const world of this.worlds.values()) {
      world.signature += (world.targetSignature - world.signature) * alpha;
      world.scale += (world.targetScale - world.scale) * alpha;
      world.perfect += (world.targetPerfect - world.perfect) * (1 - Math.exp(-delta / 1.6));
      world.plate.scale.set(world.scale, 1, world.scale);
      world.upperRing.scale.setScalar(world.scale);
      world.innerRing.scale.setScalar(world.scale);
      world.signatureRoot.scale.setScalar(world.scale);
      world.completionForm.scale.setScalar(Math.max(0.001, world.perfect * world.scale));
      world.network.material.opacity = 0.11 + world.signature * 0.25;

      for (const node of world.nodes) {
        const nodeAlpha = 1 - Math.exp(-delta / 1.8);
        node.baseHeight += (node.targetHeight - node.baseHeight) * nodeAlpha;
        const pulse = Math.sin(this.time * (0.45 + world.profile.activity * 0.55) + node.phase) * 0.008;
        const height = clamp(node.baseHeight + pulse, 0.035, 0.2);
        node.tower.scale.y = height;
        node.tower.position.y = NODE_BASE_Y + height * 0.5;
        node.signal.position.y = NODE_BASE_Y + height + 0.035;
        node.orbit.position.y = NODE_BASE_Y + height + 0.034;
        node.signal.rotation.y += delta * (0.04 + world.profile.activity * 0.07);
        node.root.position.y = Math.sin(this.time * 0.7 + node.phase) * 0.004;
      }
      if (world.orbitingRings) {
        world.orbitingRings[0].rotation.z += delta * 0.025;
        world.orbitingRings[1].rotation.y -= delta * 0.018;
      }
      if (world.flowCurve && world.flowMarker) {
        const phase = (this.time * 0.06 + world.index * 0.13) % 1;
        world.flowMarker.position.copy(world.flowCurve.getPoint(phase));
      }
    }
    for (const resident of this.residents) this.updateResident(resident, delta);
  }

  dispose() {
    const geometries = new Set(this.shapes);
    const materials = new Set(this.brandMaterials.values());
    for (const root of this.ownedRoots) {
      collectResources(root, geometries, materials);
      this.scene.remove(root);
    }
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    this.ownedRoots.length = 0;
    this.residents.length = 0;
    this.worlds.clear();
    this.portals.clear();
  }
}
