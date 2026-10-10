import * as THREE from 'three';
import { FACE_LAYOUT, FAMILIES } from './data.js';

const ROUTE_ORDER = [0, 1, 2, 4, 5, 3];
const WORLD_RADIUS = 3.55;
const TAU = Math.PI * 2;
const DUST_COUNT = 8;

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(edge0, edge1, value) {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function hash2(x, y, seed) {
  let n = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 2246822519);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  n ^= n >>> 16;
  return (n >>> 0) / 4294967295;
}

function valueNoise(x, y, seed) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy, seed);
  const b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed);
  const d = hash2(ix + 1, iy + 1, seed);
  const ab = THREE.MathUtils.lerp(a, b, sx);
  const cd = THREE.MathUtils.lerp(c, d, sx);
  return THREE.MathUtils.lerp(ab, cd, sy);
}

function fbm(x, y, seed) {
  let sum = 0;
  let amplitude = 0.58;
  let frequency = 1;
  let normalizer = 0;
  for (let octave = 0; octave < 4; octave += 1) {
    sum += valueNoise(x * frequency, y * frequency, seed + octave * 31) * amplitude;
    normalizer += amplitude;
    frequency *= 2.02;
    amplitude *= 0.48;
  }
  return sum / normalizer;
}

function colorFrom(value) {
  return new THREE.Color(value);
}

function createTerrainGeometry(family) {
  const radialRings = 10;
  const segments = 48;
  const seed = family.id * 97 + 11;
  const positions = [0, 0.12, 0];
  const colors = [];
  const indices = [];
  const low = colorFrom('#1c2b35');
  const mid = colorFrom(family.palette.dark);
  const high = colorFrom(family.palette.base);
  const crest = colorFrom(family.palette.light);
  const centerColor = mid.clone().lerp(high, 0.28);
  colors.push(centerColor.r, centerColor.g, centerColor.b);

  for (let ring = 1; ring <= radialRings; ring += 1) {
    const t = ring / radialRings;
    for (let segment = 0; segment <= segments; segment += 1) {
      const angle = segment / segments * Math.PI * 2;
      const broad = fbm(Math.cos(angle) * 2.15 + seed, Math.sin(angle) * 2.15 - seed, seed);
      const fine = fbm(Math.cos(angle) * 5.8 + seed * 0.13, Math.sin(angle) * 5.8, seed + 13);
      const rough = 0.87 + (broad - 0.5) * 0.24 + (fine - 0.5) * 0.09;
      const radius = 0.76 * t * rough;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const ridge = Math.max(0, 1 - Math.abs(t - (0.35 + broad * 0.17)) * 4.6);
      const y = 0.085 + broad * 0.11 + ridge * 0.055 - t * 0.16 + Math.sin(angle * 5 + seed) * 0.025 * t;
      positions.push(x, y, z);
      const elevation = clamp01((y + 0.12) / 0.39);
      let vertexColor;
      if (elevation < 0.43) vertexColor = low.clone().lerp(mid, elevation / 0.43);
      else if (elevation < 0.83) vertexColor = mid.clone().lerp(high, (elevation - 0.43) / 0.4);
      else vertexColor = high.clone().lerp(crest, (elevation - 0.83) / 0.17);
      const mottling = 0.94 + fine * 0.11;
      vertexColor.multiplyScalar(mottling);
      colors.push(vertexColor.r, vertexColor.g, vertexColor.b);
    }
  }

  for (let segment = 0; segment < segments; segment += 1) {
    indices.push(0, 2 + segment, 1 + segment);
  }
  for (let ring = 0; ring < radialRings - 1; ring += 1) {
    const first = 1 + ring * (segments + 1);
    const next = first + segments + 1;
    for (let segment = 0; segment < segments; segment += 1) {
      const a = first + segment;
      const b = a + 1;
      const c = next + segment;
      const d = c + 1;
      indices.push(a, b, c, b, d, c);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function lineTube(scene, points, color, radius = 0.009, opacity = 0.3, tubularSegments = 28) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => point.clone()));
  const mesh = new THREE.Mesh(
    new THREE.TubeGeometry(curve, tubularSegments, radius, 5, false),
    new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, depthWrite: false, toneMapped: false }),
  );
  scene.add(mesh);
  return mesh;
}

function makeHaloMaterial(family) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTint: { value: new THREE.Color(family.palette.accent) },
      uBase: { value: new THREE.Color(family.palette.base) },
      uPurity: { value: 1 },
      uArrival: { value: 0 },
      uRate: { value: 0.4 + family.id * 0.06 },
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
      uniform float uPurity;
      uniform float uArrival;
      uniform float uRate;
      uniform vec3 uTint;
      uniform vec3 uBase;
      varying vec2 vUv;
      const float PI = 3.141592653589793;
      void main() {
        vec2 p = (vUv - 0.5) * 2.0;
        float radius = length(p);
        float angle = atan(p.y, p.x);
        float rim = exp(-pow((radius - 0.79) * 16.0, 2.0));
        float inner = exp(-pow((radius - 0.64) * 22.0, 2.0));
        float drift = 0.5 + 0.5 * sin(angle * (3.0 + uPurity * 3.0) - uTime * (0.18 + uRate * 0.08));
        float seam = 0.5 + 0.5 * sin(angle * 6.0 + radius * 13.0 + uTime * 0.16);
        float edge = (1.0 - smoothstep(0.78, 1.02, radius)) * smoothstep(0.35, 0.56, radius);
        float purityLift = 0.45 + 0.55 * uPurity;
        float alpha = edge * (rim * (0.025 + 0.042 * drift) + inner * (0.012 + 0.023 * seam));
        alpha *= purityLift + uArrival * 0.12;
        vec3 color = mix(uBase, uTint, 0.35 + drift * 0.22 + uArrival * 0.16);
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
}

function addFlatMesh(parent, geometry, material, position, rotation = null, scale = null) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  if (rotation) mesh.rotation.set(rotation.x, rotation.y, rotation.z);
  if (scale) mesh.scale.copy(scale);
  parent.add(mesh);
  return mesh;
}

function addLandmark(world) {
  const { family, root, materials, shared } = world;
  const accent = materials.accent;
  const pale = materials.pale;
  const dark = materials.dark;
  const center = new THREE.Vector3(0, 0.22, 0);
  const add = (geometry, material, position, rotation = null, scale = null) => addFlatMesh(root, geometry, material, position, rotation, scale);

  if (family.key === 'gpt') {
    add(shared.torus, accent, new THREE.Vector3(0, 0.42, 0), new THREE.Vector3(Math.PI / 2, 0, 0), new THREE.Vector3(0.39, 0.39, 0.39));
    const ring2 = add(shared.torus, pale, new THREE.Vector3(0, 0.43, 0), new THREE.Vector3(Math.PI / 2.8, 0.2, 0.6), new THREE.Vector3(0.27, 0.27, 0.27));
    ring2.rotation.z += 0.2;
    add(shared.icosahedron, materials.core, center, null, new THREE.Vector3(0.15, 0.15, 0.15));
    for (let index = 0; index < 3; index += 1) {
      const angle = index * Math.PI * 2 / 3;
      const x = Math.cos(angle) * 0.39;
      const z = Math.sin(angle) * 0.39;
      add(shared.pillar, dark, new THREE.Vector3(x, 0.18, z), new THREE.Vector3(0, 0, angle), new THREE.Vector3(0.035, 0.25, 0.035));
      add(shared.sphere, pale, new THREE.Vector3(x, 0.44, z), null, new THREE.Vector3(0.04, 0.04, 0.04));
    }
  } else if (family.key === 'claude') {
    for (let shelf = 0; shelf < 3; shelf += 1) {
      const y = 0.12 + shelf * 0.075;
      add(shared.book, shelf === 1 ? pale : accent, new THREE.Vector3(-0.21 + shelf * 0.2, y, 0.03), new THREE.Vector3(0, (shelf - 1) * 0.18, 0), new THREE.Vector3(0.22, 0.034, 0.16));
    }
    for (let arch = 0; arch < 2; arch += 1) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.43 + arch * 0.12, 0.18, -0.24),
        new THREE.Vector3(-0.27 + arch * 0.12, 0.43, -0.08),
        new THREE.Vector3(0.08 + arch * 0.12, 0.47, 0.04),
        new THREE.Vector3(0.39 + arch * 0.12, 0.2, 0.2),
      ]);
      const archMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.009, 4, false), arch ? pale : accent);
      root.add(archMesh);
    }
  } else if (family.key === 'gemini') {
    add(shared.octahedron, materials.core, new THREE.Vector3(0, 0.38, 0), new THREE.Vector3(0.14, 0.28, 0.08), new THREE.Vector3(0.22, 0.34, 0.22));
    for (let index = 0; index < 4; index += 1) {
      const angle = index * Math.PI / 2 + Math.PI / 4;
      const position = new THREE.Vector3(Math.cos(angle) * 0.42, 0.2 + (index % 2) * 0.08, Math.sin(angle) * 0.42);
      add(shared.octahedron, index % 2 ? accent : pale, position, new THREE.Vector3(0, angle, 0), new THREE.Vector3(0.08, 0.1, 0.08));
      const rail = new THREE.Mesh(shared.pillar, accent);
      rail.position.set(position.x * 0.48, 0.22, position.z * 0.48);
      rail.rotation.z = -Math.atan2(position.x, position.z);
      rail.scale.set(0.012, 0.25, 0.012);
      root.add(rail);
    }
    // A tiny non-edible ceramic allusion; the amber point is sealed.
    add(shared.plate, materials.plate, new THREE.Vector3(0.48, 0.19, -0.34), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.13, 1, 0.13));
    add(shared.sphere, materials.sealedDrop, new THREE.Vector3(0.48, 0.208, -0.34), null, new THREE.Vector3(0.024, 0.012, 0.024));
    add(shared.lineBar, materials.plateMark, new THREE.Vector3(0.48, 0.22, -0.34), new THREE.Vector3(0, 0, 0.5), new THREE.Vector3(0.12, 0.007, 0.008));
  } else if (family.key === 'deepseek') {
    for (let index = 0; index < 3; index += 1) {
      const ring = add(shared.torus, index === 1 ? pale : accent, new THREE.Vector3(0, 0.14 + index * 0.075, 0), new THREE.Vector3(Math.PI / 2, 0, index * 0.32), new THREE.Vector3(0.34 + index * 0.09, 0.34 + index * 0.09, 0.34 + index * 0.09));
      ring.rotation.y += index * 0.18;
    }
    add(shared.octahedron, materials.core, new THREE.Vector3(0, 0.37, 0), new THREE.Vector3(0, 0.3, 0), new THREE.Vector3(0.12, 0.22, 0.12));
  } else if (family.key === 'qwen') {
    const paths = [
      [new THREE.Vector3(0, 0.17, 0), new THREE.Vector3(-0.16, 0.25, -0.1), new THREE.Vector3(-0.37, 0.19, -0.32)],
      [new THREE.Vector3(0, 0.17, 0), new THREE.Vector3(0.08, 0.38, 0.05), new THREE.Vector3(0.29, 0.3, 0.25)],
      [new THREE.Vector3(0, 0.17, 0), new THREE.Vector3(0.22, 0.21, -0.08), new THREE.Vector3(0.42, 0.17, -0.22)],
      [new THREE.Vector3(0, 0.17, 0), new THREE.Vector3(-0.08, 0.31, 0.2), new THREE.Vector3(-0.34, 0.22, 0.36)],
    ];
    paths.forEach((points, index) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const branch = new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.013, 4, false), index % 2 ? pale : accent);
      root.add(branch);
      const endpoint = points[points.length - 1];
      add(shared.sphere, index % 2 ? accent : pale, endpoint, null, new THREE.Vector3(0.035, 0.035, 0.035));
    });
  } else {
    for (let index = 0; index < 3; index += 1) {
      const angle = index * TAU / 3 - Math.PI / 2;
      const x = Math.cos(angle) * 0.31;
      const z = Math.sin(angle) * 0.31;
      add(shared.hexTower, index === 1 ? pale : accent, new THREE.Vector3(x, 0.34, z), new THREE.Vector3(0, angle, 0), new THREE.Vector3(1, 1 + (index % 2) * 0.23, 1));
      add(shared.plate, dark, new THREE.Vector3(x, 0.47 + (index % 2) * 0.08, z), new THREE.Vector3(Math.PI / 2, 0, angle), new THREE.Vector3(0.12, 1, 0.12));
    }
    const gear = add(shared.torus, pale, new THREE.Vector3(0, 0.18, 0), new THREE.Vector3(Math.PI / 2, 0, 0), new THREE.Vector3(0.46, 0.46, 0.46));
    gear.rotation.z = 0.18;
  }
}

function createResident(world, index, bodyGeometry, headGeometry, eyeGeometry, finGeometry) {
  const { family, root, materials } = world;
  const group = new THREE.Group();
  const body = new THREE.Mesh(bodyGeometry, materials.creature);
  body.scale.set(1, 0.82 + (index % 2) * 0.16, 1.08);
  group.add(body);
  const head = new THREE.Mesh(headGeometry, materials.creatureLight);
  head.position.set(0.014 * (index % 2 ? 1 : -1), 0.025, 0.057);
  head.scale.setScalar(0.76 + (index % 3) * 0.08);
  group.add(head);
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(eyeGeometry, materials.eye);
    eye.position.set(side * 0.021, 0.033, 0.093);
    group.add(eye);
  }
  const fin = new THREE.Mesh(finGeometry, materials.accent);
  fin.position.set(0, 0.018, -0.063);
  fin.rotation.x = Math.PI / 2;
  fin.rotation.z = index * 0.5;
  group.add(fin);
  const angle = (index * 2.399963229728653 + family.id * 0.71) % (Math.PI * 2);
  const radius = 0.19 + ((index * 7 + family.id * 3) % 5) * 0.052;
  const home = new THREE.Vector3(Math.cos(angle) * radius, 0.22 + (index % 2) * 0.035, Math.sin(angle) * radius);
  root.add(group);
  return {
    group,
    home,
    phase: family.id * 1.7 + index * 2.31,
    speed: 0.32 + index * 0.055 + family.id * 0.014,
    amplitude: 0.022 + (index % 3) * 0.006,
  };
}

function createDust(world, sharedGeometry) {
  const material = new THREE.MeshStandardMaterial({ color: world.family.palette.light, roughness: 0.54, metalness: 0.14 });
  const dust = new THREE.InstancedMesh(sharedGeometry, material, DUST_COUNT);
  dust.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  dust.userData.orbits = [];
  const dummy = new THREE.Object3D();
  for (let index = 0; index < DUST_COUNT; index += 1) {
    const angle = index * TAU / DUST_COUNT + world.family.id * 0.23;
    const radius = 0.48 + (index % 3) * 0.085;
    dust.userData.orbits.push({ angle, radius, phase: index * 1.61 + world.family.id, height: 0.26 + (index % 4) * 0.075, speed: 0.13 + (index % 3) * 0.025 });
    dummy.position.set(Math.cos(angle) * radius, 0.3, Math.sin(angle) * radius);
    dummy.scale.setScalar(0.8 + (index % 3) * 0.25);
    dummy.updateMatrix();
    dust.setMatrixAt(index, dummy.matrix);
  }
  world.root.add(dust);
  world.dust = dust;
}

function makeWorldPosition(layout, index) {
  const normal = new THREE.Vector3(...layout.normal);
  const tangent = new THREE.Vector3(...layout.tangent);
  return normal.multiplyScalar(WORLD_RADIUS).addScaledVector(tangent, layout.worldOffset);
}

function createOneWorld(scene, family, layout, position, shared) {
  const root = new THREE.Group();
  root.position.copy(position);
  scene.add(root);
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.94, metalness: 0.015 });
  const terrain = new THREE.Mesh(createTerrainGeometry(family), material);
  terrain.receiveShadow = false;
  root.add(terrain);

  const base = new THREE.Mesh(shared.baseIsland, new THREE.MeshStandardMaterial({ color: family.palette.dark, roughness: 0.84, metalness: 0.1 }));
  base.position.set(0, -0.13, 0);
  base.scale.set(0.69, 0.34, 0.69);
  root.add(base);
  const rim = new THREE.Mesh(shared.torus, new THREE.MeshStandardMaterial({ color: family.palette.accent, roughness: 0.5, metalness: 0.48, transparent: true, opacity: 0.38 }));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.005;
  rim.scale.set(0.77, 0.77, 0.77);
  root.add(rim);

  const haloMaterial = makeHaloMaterial(family);
  const halo = new THREE.Mesh(shared.haloPlane, haloMaterial);
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = 0.012;
  halo.scale.setScalar(1.05);
  root.add(halo);

  const familyColor = new THREE.Color(family.palette.base);
  const materials = {
    dark: new THREE.MeshStandardMaterial({ color: family.palette.dark, roughness: 0.78, metalness: 0.24 }),
    accent: new THREE.MeshStandardMaterial({ color: family.palette.accent, roughness: 0.42, metalness: 0.32 }),
    pale: new THREE.MeshStandardMaterial({ color: family.palette.light, roughness: 0.52, metalness: 0.16 }),
    core: new THREE.MeshPhysicalMaterial({ color: family.palette.base, roughness: 0.26, metalness: 0.18, clearcoat: 0.5, clearcoatRoughness: 0.38 }),
    plate: new THREE.MeshStandardMaterial({ color: '#d3b87f', roughness: 0.45, metalness: 0.17 }),
    plateMark: new THREE.MeshStandardMaterial({ color: '#58483a', roughness: 0.64, metalness: 0.03 }),
    sealedDrop: new THREE.MeshPhysicalMaterial({ color: '#d4a46c', roughness: 0.3, metalness: 0.08, clearcoat: 0.55 }),
    creature: new THREE.MeshStandardMaterial({ color: family.palette.base, roughness: 0.58, metalness: 0.05 }),
    creatureLight: new THREE.MeshStandardMaterial({ color: family.palette.light, roughness: 0.52, metalness: 0.05 }),
    eye: new THREE.MeshStandardMaterial({ color: '#15202a', roughness: 0.52 }),
  };
  const world = {
    family,
    layout,
    position,
    root,
    haloMaterial,
    terrainMaterial: material,
    terrain,
    materials,
    shared,
    residents: [],
    dust: null,
    purity: 1,
    dominantFamily: family.id,
    incomingPulse: 0,
    surfaceColor: familyColor,
    ring: rim,
  };
  addLandmark(world);

  const bodyGeometry = shared.residentBody;
  const headGeometry = shared.residentHead;
  const eyeGeometry = shared.residentEye;
  const finGeometry = shared.residentFin;
  for (let index = 0; index < 3; index += 1) {
    world.residents.push(createResident(world, index, bodyGeometry, headGeometry, eyeGeometry, finGeometry));
  }
  createDust(world, shared.dust);
  return world;
}

function makeRoutePoints(start, end, startIndex, endIndex) {
  const startOuter = start.clone().multiplyScalar(1.13);
  const endOuter = end.clone().multiplyScalar(1.13);
  let outward = start.clone().add(end);
  if (outward.lengthSq() < 0.001) {
    outward = new THREE.Vector3(1, 0.15, 0);
  } else {
    outward.normalize();
  }
  if ((startIndex === 0 && endIndex === 1) || (startIndex === 1 && endIndex === 0)) {
    outward.add(new THREE.Vector3(0, 0.32, 0)).normalize();
  }
  const bow = outward.multiplyScalar(4.8 + ((startIndex + endIndex) % 2) * 0.22);
  bow.y += 0.12;
  const first = start.clone().lerp(end, 0.28).addScaledVector(bow.clone().normalize(), 0.48);
  const last = start.clone().lerp(end, 0.72).addScaledVector(bow.clone().normalize(), 0.48);
  return [start, startOuter, first, bow, last, endOuter, end];
}

function createRoutes(scene, worlds, shared) {
  const routes = [];
  for (let index = 0; index < ROUTE_ORDER.length; index += 1) {
    const from = ROUTE_ORDER[index];
    const to = ROUTE_ORDER[(index + 1) % ROUTE_ORDER.length];
    const source = worlds[from];
    const destination = worlds[to];
    const points = makeRoutePoints(source.position, destination.position, from, to);
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
    const routeColor = new THREE.Color(source.family.palette.accent).lerp(new THREE.Color(destination.family.palette.accent), 0.5);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 48, 0.008, 5, false),
      new THREE.MeshBasicMaterial({ color: routeColor, transparent: true, opacity: 0.2, depthWrite: false, toneMapped: false }),
    );
    scene.add(tube);
    const travelerRoot = new THREE.Group();
    const travelerMaterial = new THREE.MeshStandardMaterial({ color: source.family.palette.light, roughness: 0.36, metalness: 0.1, clearcoat: 0.2 });
    const core = new THREE.Mesh(shared.traveler, travelerMaterial);
    travelerRoot.add(core);
    const belly = new THREE.Mesh(shared.travelerBelly, new THREE.MeshStandardMaterial({ color: destination.family.palette.accent, roughness: 0.5 }));
    belly.position.set(0, -0.011, 0.024);
    travelerRoot.add(belly);
    scene.add(travelerRoot);
    const route = {
      from,
      to,
      source,
      destination,
      curve,
      tube,
      travelerRoot,
      travelerMaterial,
      bellyMaterial: belly.material,
      previousT: 0,
      phase: index * 0.137 + 0.04,
      point: new THREE.Vector3(),
      baseColor: new THREE.Color(source.family.palette.light),
      destinationColor: new THREE.Color(destination.family.palette.light),
      sourceAccent: new THREE.Color(source.family.palette.accent),
      destinationAccent: new THREE.Color(destination.family.palette.accent),
      sibling: null,
    };
    routes.push(route);
  }

  const rivalry = routes.find((route) => (route.from === 0 && route.to === 1) || (route.from === 1 && route.to === 0));
  if (rivalry) {
    const courierRoot = new THREE.Group();
    const courierA = new THREE.Mesh(shared.courier, new THREE.MeshStandardMaterial({ color: worlds[0].family.palette.light, roughness: 0.48, metalness: 0.12 }));
    const courierB = new THREE.Mesh(shared.courier, new THREE.MeshStandardMaterial({ color: worlds[1].family.palette.light, roughness: 0.48, metalness: 0.12 }));
    courierA.scale.setScalar(0.82);
    courierB.scale.setScalar(0.82);
    courierA.rotation.z = Math.PI * 0.25;
    courierB.rotation.z = -Math.PI * 0.25;
    courierRoot.add(courierA, courierB);
    scene.add(courierRoot);
    rivalry.sibling = { root: courierRoot, a: courierA, b: courierB, pointA: new THREE.Vector3(), pointB: new THREE.Vector3() };
  }

  const echo = routes.find((route) => (route.from === 0 && route.to === 3) || (route.from === 3 && route.to === 0));
  if (echo) {
    const echoRoot = new THREE.Group();
    const echoPrism = new THREE.Mesh(shared.echoPrism, new THREE.MeshPhysicalMaterial({ color: '#b5c5d3', metalness: 0.62, roughness: 0.28, clearcoat: 0.5, clearcoatRoughness: 0.26 }));
    echoPrism.scale.setScalar(0.82);
    echoRoot.add(echoPrism);
    const echoShadow = new THREE.Mesh(shared.echoPrism, new THREE.MeshStandardMaterial({ color: worlds[3].family.palette.base, roughness: 0.75, transparent: true, opacity: 0.42 }));
    echoShadow.scale.set(0.58, 0.58, 0.58);
    echoShadow.position.y = -0.095;
    echoRoot.add(echoShadow);
    scene.add(echoRoot);
    echo.echoRoot = echoRoot;
    echo.echoPrism = echoPrism;
  }

  return routes;
}

function createSharedGeometry() {
  return {
    baseIsland: new THREE.DodecahedronGeometry(0.7, 1),
    torus: new THREE.TorusGeometry(0.5, 0.012, 5, 40),
    icosahedron: new THREE.IcosahedronGeometry(0.14, 0),
    sphere: new THREE.SphereGeometry(0.05, 8, 6),
    pillar: new THREE.CylinderGeometry(0.5, 0.5, 1, 6),
    book: new THREE.BoxGeometry(1, 1, 1),
    octahedron: new THREE.OctahedronGeometry(0.15, 0),
    plate: new THREE.CylinderGeometry(0.5, 0.53, 0.12, 16),
    lineBar: new THREE.BoxGeometry(1, 1, 1),
    hexTower: new THREE.CylinderGeometry(0.34, 0.42, 0.56, 6, 1, false),
    haloPlane: new THREE.PlaneGeometry(2.2, 2.2, 1, 1),
    residentBody: new THREE.IcosahedronGeometry(0.062, 1),
    residentHead: new THREE.SphereGeometry(0.044, 9, 7),
    residentEye: new THREE.SphereGeometry(0.009, 6, 5),
    residentFin: new THREE.TorusGeometry(0.06, 0.006, 3, 12),
    dust: new THREE.DodecahedronGeometry(0.018, 0),
    traveler: new THREE.IcosahedronGeometry(0.048, 0),
    travelerBelly: new THREE.SphereGeometry(0.022, 8, 6),
    courier: new THREE.OctahedronGeometry(0.044, 0),
    echoPrism: new THREE.OctahedronGeometry(0.092, 0),
  };
}

export function createWorldNetwork(scene) {
  const shared = createSharedGeometry();
  const positions = FACE_LAYOUT.map((layout, index) => makeWorldPosition(layout, index));
  const worlds = FAMILIES.map((family, index) => createOneWorld(scene, family, FACE_LAYOUT[index], positions[index], shared));
  const routes = createRoutes(scene, worlds, shared);
  const dustDummy = new THREE.Object3D();
  const tempColor = new THREE.Color();
  const familyBaseColors = FAMILIES.map((family) => new THREE.Color(family.palette.base));
  const familyAccentColors = FAMILIES.map((family) => new THREE.Color(family.palette.accent));
  const tempPoint = new THREE.Vector3();

  function updateComposition(faceCounts = []) {
    for (let faceIndex = 0; faceIndex < worlds.length; faceIndex += 1) {
      const world = worlds[faceIndex];
      const counts = faceCounts[faceIndex] || [];
      let dominant = world.family.id;
      let highest = 0;
      for (let familyIndex = 0; familyIndex < FAMILIES.length; familyIndex += 1) {
        const count = counts[familyIndex] || 0;
        if (count > highest) {
          highest = count;
          dominant = familyIndex;
        }
      }
      world.dominantFamily = dominant;
      world.purity = highest / 9;
      const target = familyBaseColors[dominant];
      world.surfaceColor.lerp(target, 0.14);
      tempColor.set('#ffffff').lerp(world.surfaceColor, 0.08 + (1 - world.purity) * 0.14);
      world.terrainMaterial.color.copy(tempColor);
      world.ring.material.opacity = 0.18 + world.purity * 0.22;
      world.haloMaterial.uniforms.uPurity.value = world.purity;
      world.haloMaterial.uniforms.uBase.value.copy(world.surfaceColor);
      world.haloMaterial.uniforms.uTint.value.copy(familyAccentColors[dominant]);
      for (const resident of world.residents) {
        resident.group.userData.mix = 1 - world.purity;
      }
    }
  }

  function update(time, dt, faceCounts) {
    if (faceCounts) updateComposition(faceCounts);
    for (const world of worlds) {
      world.haloMaterial.uniforms.uTime.value = time;
      world.haloMaterial.uniforms.uArrival.value = world.incomingPulse;
      world.incomingPulse = Math.max(0, world.incomingPulse - dt * 0.62);
      for (let index = 0; index < world.residents.length; index += 1) {
        const resident = world.residents[index];
        const phase = time * resident.speed + resident.phase;
        resident.group.position.x = resident.home.x + Math.sin(phase) * resident.amplitude;
        resident.group.position.z = resident.home.z + Math.cos(phase * 0.77) * resident.amplitude;
        resident.group.position.y = resident.home.y + Math.sin(phase * 1.3) * 0.026;
        resident.group.rotation.y = Math.sin(phase * 0.55) * 0.18;
        const mix = (1 - world.purity) * 0.16;
        tempColor.set(world.family.palette.base).lerp(familyBaseColors[world.dominantFamily], mix);
        resident.group.children[0].material.color.copy(tempColor);
      }
      const dust = world.dust;
      for (let index = 0; index < DUST_COUNT; index += 1) {
        const orbit = dust.userData.orbits[index];
        const angle = orbit.angle + time * orbit.speed;
        dustDummy.position.set(Math.cos(angle) * orbit.radius, orbit.height + Math.sin(time * 0.5 + orbit.phase) * 0.045, Math.sin(angle) * orbit.radius);
        dustDummy.rotation.set(time * 0.12 + orbit.phase, angle, time * 0.09);
        dustDummy.scale.setScalar(0.62 + (index % 3) * 0.22);
        dustDummy.updateMatrix();
        dust.setMatrixAt(index, dustDummy.matrix);
      }
      dust.instanceMatrix.needsUpdate = true;
    }

    for (const route of routes) {
      const previous = route.previousT;
      const t = ((time * 0.022 + route.phase) % 1 + 1) % 1;
      route.curve.getPointAt(t, route.point);
      route.travelerRoot.position.copy(route.point);
      const blend = smoothstep(0.22, 0.83, t);
      route.travelerMaterial.color.copy(route.baseColor).lerp(route.destinationColor, blend);
      route.bellyMaterial.color.copy(route.sourceAccent).lerp(route.destinationAccent, blend);
      const swell = 1 + Math.sin(t * Math.PI) * 0.14;
      route.travelerRoot.scale.set(0.9 + blend * 0.12, swell, 0.9 + (1 - blend) * 0.12);
      route.travelerRoot.rotation.y = time * 0.48 + route.phase;
      if (t < previous) route.destination.incomingPulse = 1;
      route.previousT = t;

      if (route.sibling) {
        const pairPhase = (time * 0.018 + route.phase) % 1;
        const tA = pairPhase;
        const tB = (pairPhase + 0.5) % 1;
        route.curve.getPointAt(tA, route.sibling.pointA);
        route.curve.getPointAt(tB, route.sibling.pointB);
        route.sibling.a.position.copy(route.sibling.pointA);
        route.sibling.b.position.copy(route.sibling.pointB);
        route.sibling.a.rotation.y = time * 0.4;
        route.sibling.b.rotation.y = -time * 0.35;
      }
      if (route.echoRoot) {
        route.curve.getPointAt(0.5, tempPoint);
        route.echoRoot.position.copy(tempPoint);
        route.echoRoot.rotation.y = time * 0.11;
        route.echoPrism.rotation.x = Math.sin(time * 0.16) * 0.12;
      }
    }
  }

  function dispose() {
    for (const world of worlds) {
      world.root.traverse((object) => {
        if (object.geometry && object.geometry !== shared.baseIsland && object.geometry !== shared.torus && object.geometry !== shared.icosahedron && object.geometry !== shared.sphere && object.geometry !== shared.pillar && object.geometry !== shared.book && object.geometry !== shared.octahedron && object.geometry !== shared.plate && object.geometry !== shared.lineBar && object.geometry !== shared.hexTower && object.geometry !== shared.haloPlane && object.geometry !== shared.residentBody && object.geometry !== shared.residentHead && object.geometry !== shared.residentEye && object.geometry !== shared.residentFin && object.geometry !== shared.dust && object.geometry !== shared.traveler && object.geometry !== shared.travelerBelly && object.geometry !== shared.courier && object.geometry !== shared.echoPrism) object.geometry.dispose();
      });
    }
    for (const route of routes) {
      route.tube.geometry.dispose();
      route.tube.material.dispose();
      route.travelerMaterial.dispose();
      route.bellyMaterial.dispose();
    }
    Object.values(shared).forEach((geometry) => geometry.dispose());
  }

  return { worlds, routes, update, updateComposition, dispose };
}

export function createStarfield(scene) {
  const count = 470;
  const positions = new Float32Array(count * 3);
  const seed = 18473;
  for (let index = 0; index < count; index += 1) {
    const y = 2 * hash2(index, 1, seed) - 1;
    const angle = hash2(index, 2, seed) * Math.PI * 2;
    const radius = 16 + hash2(index, 3, seed) * 8;
    const planar = Math.sqrt(1 - y * y);
    positions[index * 3] = Math.cos(angle) * planar * radius;
    positions[index * 3 + 1] = y * radius;
    positions[index * 3 + 2] = Math.sin(angle) * planar * radius;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: '#8c9aa7', size: 0.018, transparent: true, opacity: 0.34, sizeAttenuation: true, depthWrite: false, toneMapped: false });
  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return { points, dispose() { geometry.dispose(); material.dispose(); } };
}
