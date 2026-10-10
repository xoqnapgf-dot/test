import * as THREE from 'three';
import { CubeView } from './cube-view.js';
import { createGlyphTextures } from './glyphs.js';
import { WorldsSystem } from './worlds.js';
import { fitCameraDistance } from './layout.js';
import {
  applyMove,
  createSolvedCube,
  inverseMove,
  normalizeMove,
} from './cube-state.js';

const canvas = document.querySelector('#scene');
const restoreButton = document.querySelector('#restore');
const fallback = document.querySelector('#fallback');
const hint = document.querySelector('#hint');

let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
  });
} catch (error) {
  fallback.hidden = false;
  canvas.hidden = true;
  restoreButton.hidden = true;
  hint.hidden = true;
  console.warn('WebGL2 scene could not be created.', error);
}

if (renderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#111615');
  scene.fog = new THREE.FogExp2('#111615', 0.01);

  const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 60);
  const target = new THREE.Vector3(0, -0.28, 0);
  const spherical = new THREE.Spherical(17.4, 0.84, 0.62);
  let fitRadius = spherical.radius;
  let zoomFactor = 1;
  const updateCamera = () => {
    camera.position.setFromSpherical(spherical).add(target);
    camera.lookAt(target);
    camera.updateMatrixWorld();
  };
  updateCamera();

  const ambient = new THREE.HemisphereLight('#d8d9c8', '#222925', 1.25);
  scene.add(ambient);
  const keyLight = new THREE.DirectionalLight('#e3d8bd', 2.05);
  keyLight.position.set(5, 8, 6);
  scene.add(keyLight);
  const coolFill = new THREE.DirectionalLight('#9eb5b3', 0.72);
  coolFill.position.set(-7, 3, -5);
  scene.add(coolFill);
  const lowFill = new THREE.PointLight('#c9a87e', 0.48, 13, 2);
  lowFill.position.set(0, -0.25, 0);
  scene.add(lowFill);

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.96;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  renderer.setClearColor('#111615', 1);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.domElement.setAttribute('aria-label', '空白处旋转视角，拖动方块贴片扭动切层，滚轮或双指缩放');

  const cubeState = createSolvedCube();
  const glyphTextures = createGlyphTextures();
  const cubeView = new CubeView(scene, glyphTextures, cubeState);
  const worlds = new WorldsSystem(scene, cubeState);
  const raycaster = new THREE.Raycaster();
  raycaster.layers.enable(1);
  const pointerNdc = new THREE.Vector2();
  const pointerPositions = new Map();
  const history = [];

  let activeTurn = null;
  let gesture = null;
  let pendingGesture = null;
  let lastFrame = performance.now();
  let randomSeed = 0x5f3759df;
  let restoreRequested = false;
  let restoreQueue = [];
  let restoreIndex = 0;

  const auto = {
    phase: 'waiting',
    timer: 2.6,
    cycleStart: null,
    moves: [],
    applied: 0,
    total: 7,
    previous: null,
  };

  const easeInOut = (value) => value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
  const angleForMove = (turns) => {
    const normalized = ((turns % 4) + 4) % 4;
    if (normalized === 1) return Math.PI / 2;
    if (normalized === 2) return Math.PI;
    return -Math.PI / 2;
  };
  const nextRandom = () => {
    randomSeed ^= randomSeed << 13;
    randomSeed ^= randomSeed >>> 17;
    randomSeed ^= randomSeed << 5;
    return (randomSeed >>> 0) / 4294967296;
  };

  function resize() {
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    fitRadius = fitCameraDistance(camera.aspect, camera.fov, 6.2, 15.1);
    zoomFactor = Math.min(zoomFactor, 52 / fitRadius);
    spherical.radius = Math.max(8.2, Math.min(52, fitRadius * zoomFactor));
    updateCamera();
  }

  function eventToNdc(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return new THREE.Vector2(
      ((clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1,
      -((clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1,
    );
  }

  function hitAt(clientX, clientY) {
    pointerNdc.copy(eventToNdc(clientX, clientY));
    raycaster.setFromCamera(pointerNdc, camera);
    scene.updateMatrixWorld(true);
    return cubeView.hitTest(raycaster);
  }

  function projectToClient(point) {
    const projected = point.clone().project(camera);
    const rect = canvas.getBoundingClientRect();
    return new THREE.Vector2(
      rect.left + (projected.x * 0.5 + 0.5) * rect.width,
      rect.top + (-projected.y * 0.5 + 0.5) * rect.height,
    );
  }

  function chooseSlice(hit, cubie, stickerId, dx, dy) {
    const delta = new THREE.Vector2(dx, dy);
    if (delta.length() < 0.001) return null;
    const direction = delta.clone().normalize();
    const sticker = cubie.stickers.find((candidate) => candidate.id === stickerId);
    if (!sticker) return null;
    let best = null;
    const axes = [
      ['x', new THREE.Vector3(1, 0, 0), 0],
      ['y', new THREE.Vector3(0, 1, 0), 1],
      ['z', new THREE.Vector3(0, 0, 1), 2],
    ];
    const faceNormal = new THREE.Vector3(...sticker.normal);
    for (const [axis, vector, index] of axes) {
      const tangentWorld = vector.clone().cross(hit.point);
      if (tangentWorld.lengthSq() < 0.0001) continue;
      const step = tangentWorld.clone().multiplyScalar(0.035);
      const a = projectToClient(hit.point);
      const b = projectToClient(hit.point.clone().add(step));
      const tangentScreen = b.sub(a).multiplyScalar(1 / 0.035);
      const pixelsPerRadian = tangentScreen.length();
      if (pixelsPerRadian < 1.5) continue;
      const tangentUnit = tangentScreen.normalize();
      const alignment = Math.abs(direction.dot(tangentUnit));
      const facePreference = Math.abs(faceNormal.dot(vector)) > 0.9 ? 0.075 : 0;
      const score = alignment + facePreference;
      if (!best || score > best.score) {
        best = {
          axis,
          layer: cubie.pos[index],
          axisVector: vector.clone(),
          tangentUnit,
          pixelsPerRadian,
          score,
        };
      }
    }
    if (!best || best.score < 0.2) return null;
    return best;
  }

  function computeAngle(slice, startX, startY, currentX, currentY) {
    const dx = currentX - startX;
    const dy = currentY - startY;
    const signedPixels = dx * slice.tangentUnit.x + dy * slice.tangentUnit.y;
    return signedPixels / slice.pixelsPerRadian;
  }

  function interruptAutomation() {
    if (activeTurn?.kind === 'button-restore') {
      // If a user takes over during a requested replay, finish this single legal turn as a manual move.
      activeTurn.kind = 'manual';
      restoreRequested = false;
      restoreQueue = [];
      restoreIndex = 0;
    } else if (restoreRequested) {
      restoreRequested = false;
      restoreQueue = [];
      restoreIndex = 0;
    }
    if (auto.phase === 'scramble' || auto.phase === 'breather' || auto.phase === 'auto-restore') {
      auto.phase = 'waiting';
      auto.timer = 16;
      auto.cycleStart = null;
      auto.moves = [];
      auto.applied = 0;
    } else {
      auto.phase = 'waiting';
      auto.timer = Math.max(auto.timer, 9);
    }
  }

  function startDragTurn(hit, startX, startY, currentX, currentY, pointerId) {
    const cubie = cubeView.currentLayerForHit(hit, currentCubeState);
    if (!cubie) return false;
    const slice = chooseSlice(hit, cubie, hit.object.userData.stickerId, currentX - startX, currentY - startY);
    if (!slice) return false;
    const move = { axis: slice.axis, layer: slice.layer, turns: 1 };
    const axisVector = cubeView.beginTurn(move, currentCubeState);
    activeTurn = {
      kind: 'manual-drag',
      move,
      axisVector,
      elapsed: 0,
      duration: 0,
      fromAngle: 0,
      toAngle: null,
      angle: 0,
      dragging: true,
    };
    gesture = {
      kind: 'cube', pointerId, startX, startY, lastX: currentX, lastY: currentY, slice,
    };
    canvas.classList.add('is-dragging');
    updateDragAngle(currentX, currentY);
    return true;
  }

  function currentCubeStateReference() {
    return cubeStateReference;
  }

  // The binding is replaced after every committed move so event handlers always read the live model.
  let cubeStateReference = cubeState;
  const currentCubeState = currentCubeStateReference;

  function beginPointerAt(pointerId, startX, startY, currentX = startX, currentY = startY) {
    const hit = hitAt(startX, startY);
    if (hit) {
      const state = currentCubeState();
      const cubie = cubeView.currentLayerForHit(hit, state);
      if (cubie) {
        interruptAutomation();
        gesture = { kind: 'candidate-cube', pointerId, startX, startY, lastX: startX, lastY: startY, hit };
        if (Math.hypot(currentX - startX, currentY - startY) > 1) movePointer(pointerId, currentX, currentY);
        return;
      }
    }
    gesture = { kind: 'view', pointerId, lastX: startX, lastY: startY, startX, startY, moved: false };
    if (Math.hypot(currentX - startX, currentY - startY) > 1) moveViewGesture(currentX, currentY);
  }

  function updateDragAngle(clientX, clientY) {
    if (!gesture || gesture.kind !== 'cube' || !activeTurn) return;
    const angle = computeAngle(gesture.slice, gesture.startX, gesture.startY, clientX, clientY);
    activeTurn.angle = Math.max(-Math.PI * 1.75, Math.min(Math.PI * 1.75, angle));
    cubeView.setTurnAngle(activeTurn.axisVector, activeTurn.angle);
    gesture.lastX = clientX;
    gesture.lastY = clientY;
  }

  function moveViewGesture(clientX, clientY) {
    if (!gesture || gesture.kind !== 'view') return;
    const dx = clientX - gesture.lastX;
    const dy = clientY - gesture.lastY;
    if (Math.abs(dx) + Math.abs(dy) > 0.2) gesture.moved = true;
    spherical.theta -= dx * 0.006;
    spherical.phi = Math.max(0.5, Math.min(1.42, spherical.phi + dy * 0.0055));
    updateCamera();
    gesture.lastX = clientX;
    gesture.lastY = clientY;
  }

  function movePointer(pointerId, clientX, clientY) {
    if (!gesture || gesture.pointerId !== pointerId) return;
    if (gesture.kind === 'view') moveViewGesture(clientX, clientY);
    else if (gesture.kind === 'candidate-cube') {
      const distance = Math.hypot(clientX - gesture.startX, clientY - gesture.startY);
      if (distance < 5) {
        gesture.lastX = clientX;
        gesture.lastY = clientY;
        return;
      }
      const candidate = gesture;
      const started = startDragTurn(candidate.hit, candidate.startX, candidate.startY, clientX, clientY, pointerId);
      if (!started) {
        gesture = { ...candidate, kind: 'view', lastX: clientX, lastY: clientY, moved: true };
        moveViewGesture(clientX, clientY);
      }
    } else if (gesture.kind === 'cube') updateDragAngle(clientX, clientY);
    else if (gesture.kind === 'pending') {
      gesture.currentX = clientX;
      gesture.currentY = clientY;
      if (pendingGesture) {
        pendingGesture.currentX = clientX;
        pendingGesture.currentY = clientY;
      }
    }
  }

  function commitTurn(active, { record = true } = {}) {
    const next = applyMove(cubeStateReference, active.move);
    cubeStateReference = next;
    cubeView.finishTurn(next);
    worlds.syncFromCube(next);
    if (record) history.push(normalizeMove(active.move));

    if (active.kind === 'auto-scramble') {
      if (auto.phase === 'scramble') {
        auto.moves.push(normalizeMove(active.move));
        auto.applied += 1;
      }
    } else if (active.kind === 'auto-reverse') {
      if (auto.phase === 'auto-restore') auto.moves.pop();
    } else if (active.kind === 'button-restore') {
      history.pop();
      restoreIndex += 1;
    }
  }

  function finishTurnAnimation() {
    if (!activeTurn) return;
    const finished = activeTurn;
    activeTurn = null;
    if (finished.cancelOnly) {
      cubeView.finishTurn(cubeStateReference);
    } else {
      commitTurn(finished, { record: finished.kind !== 'button-restore' });
    }

    if (finished.kind === 'button-restore') {
      if (restoreIndex >= restoreQueue.length) {
        history.length = 0;
        restoreQueue = [];
        restoreIndex = 0;
        restoreRequested = false;
        auto.phase = 'waiting';
        auto.timer = 4.5;
      } else {
        scheduleButtonRestoreStep();
      }
    } else if (pendingGesture && !restoreRequested) {
      activatePendingGesture();
    }

    if (restoreRequested && !activeTurn && finished.kind !== 'button-restore') startButtonRestore();
  }

  function animateSettling(kind, move, fromAngle, toAngle, axisVector, duration) {
    if (!activeTurn) return;
    activeTurn.kind = kind;
    activeTurn.move = move;
    activeTurn.axisVector = axisVector;
    activeTurn.elapsed = 0;
    activeTurn.duration = duration;
    activeTurn.fromAngle = fromAngle;
    activeTurn.toAngle = toAngle;
    activeTurn.dragging = false;
    activeTurn.cancelOnly = !move;
    if (move) activeTurn.move = normalizeMove(move);
  }

  function releaseCubeGesture() {
    if (!gesture || gesture.kind !== 'cube' || !activeTurn) return;
    const raw = activeTurn.angle;
    let turns = Math.round(raw / (Math.PI / 2));
    if (Math.abs(raw) < 0.23) turns = 0;
    turns = Math.max(-2, Math.min(2, turns));
    const toAngle = turns * Math.PI / 2;
    if (turns === 0) {
      animateSettling('manual-cancel', null, raw, 0, activeTurn.axisVector, 0.2);
    } else {
      const move = { ...activeTurn.move, turns };
      animateSettling('manual', move, raw, toAngle, activeTurn.axisVector, 0.22 + Math.min(0.16, Math.abs(toAngle - raw) * 0.09));
      interruptAutomation();
    }
    gesture = null;
    canvas.classList.remove('is-dragging');
  }

  function cancelGesture() {
    if (gesture?.kind === 'cube' && activeTurn) {
      animateSettling('manual-cancel', null, activeTurn.angle, 0, activeTurn.axisVector, 0.16);
    }
    gesture = null;
    pendingGesture = null;
    canvas.classList.remove('is-dragging');
  }

  function pointerEnd(pointerId, clientX, clientY) {
    if (!gesture || gesture.pointerId !== pointerId) return;
    if (gesture.kind === 'view') {
      gesture.lastX = clientX;
      gesture.lastY = clientY;
      gesture = null;
    } else if (gesture.kind === 'candidate-cube') {
      gesture = null;
    } else if (gesture.kind === 'cube') {
      updateDragAngle(clientX, clientY);
      releaseCubeGesture();
    } else if (gesture.kind === 'pending') {
      gesture.currentX = clientX;
      gesture.currentY = clientY;
      gesture.released = true;
      pointerPositions.delete(pointerId);
      return;
    }
    canvas.classList.remove('is-dragging');
  }

  function activatePendingGesture() {
    if (!pendingGesture || activeTurn) return;
    const pending = pendingGesture;
    pendingGesture = null;
    beginPointerAt(pending.pointerId, pending.startX, pending.startY, pending.currentX, pending.currentY);
    if (pending.released) pointerEnd(pending.pointerId, pending.currentX, pending.currentY);
  }

  function onPointerDown(event) {
    if (event.target !== canvas) return;
    event.preventDefault();
    const point = { x: event.clientX, y: event.clientY };
    pointerPositions.set(event.pointerId, point);
    try { canvas.setPointerCapture(event.pointerId); } catch { /* Pointer capture is optional in older embedded browsers. */ }

    if (pointerPositions.size >= 2) {
      if (gesture?.kind === 'cube' && activeTurn) {
        animateSettling('manual-cancel', null, activeTurn.angle, 0, activeTurn.axisVector, 0.15);
      }
      gesture = {
        kind: 'pinch',
        ids: [...pointerPositions.keys()].slice(0, 2),
        distance: 1,
        startZoom: zoomFactor,
      };
      const [a, b] = gesture.ids.map((id) => pointerPositions.get(id));
      gesture.distance = Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
      pendingGesture = null;
      canvas.classList.remove('is-dragging');
      return;
    }

    if (activeTurn) {
      const hit = hitAt(event.clientX, event.clientY);
      if (hit) {
        interruptAutomation();
        pendingGesture = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          currentX: event.clientX,
          currentY: event.clientY,
          released: false,
        };
        gesture = { kind: 'pending', ...pendingGesture };
      } else {
        gesture = { kind: 'view', pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastY: event.clientY, moved: false };
      }
      return;
    }
    beginPointerAt(event.pointerId, event.clientX, event.clientY);
  }

  function onPointerMove(event) {
    const point = pointerPositions.get(event.pointerId);
    if (!point) return;
    point.x = event.clientX;
    point.y = event.clientY;
    if (pointerPositions.size >= 2 && gesture?.kind === 'pinch') {
      const [a, b] = gesture.ids.map((id) => pointerPositions.get(id)).filter(Boolean);
      if (a && b) {
        const distance = Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
        zoomFactor = Math.max(0.25, Math.min(1.7, 52 / fitRadius, gesture.startZoom * gesture.distance / distance));
        spherical.radius = Math.max(8.2, Math.min(52, fitRadius * zoomFactor));
        updateCamera();
      }
      return;
    }
    movePointer(event.pointerId, event.clientX, event.clientY);
  }

  function onPointerUp(event) {
    const point = pointerPositions.get(event.pointerId);
    if (point) {
      point.x = event.clientX;
      point.y = event.clientY;
    }
    if (gesture?.kind === 'pending' && gesture.pointerId === event.pointerId) {
      gesture.currentX = event.clientX;
      gesture.currentY = event.clientY;
      gesture.released = true;
      if (pendingGesture) {
        pendingGesture.currentX = event.clientX;
        pendingGesture.currentY = event.clientY;
        pendingGesture.released = true;
      }
      pointerPositions.delete(event.pointerId);
      try { canvas.releasePointerCapture(event.pointerId); } catch { /* no-op */ }
      return;
    }

    pointerEnd(event.pointerId, event.clientX, event.clientY);
    pointerPositions.delete(event.pointerId);
    try { canvas.releasePointerCapture(event.pointerId); } catch { /* no-op */ }

    if (gesture?.kind === 'pinch') {
      gesture = null;
      if (pointerPositions.size === 1) {
        const [remainingId, remaining] = [...pointerPositions.entries()][0];
        gesture = { kind: 'view', pointerId: remainingId, startX: remaining.x, startY: remaining.y, lastX: remaining.x, lastY: remaining.y, moved: false };
      }
    }
  }

  function onPointerCancel(event) {
    pointerPositions.delete(event.pointerId);
    if (gesture?.pointerId === event.pointerId || gesture?.kind === 'pinch') cancelGesture();
  }

  function onWheel(event) {
    event.preventDefault();
    zoomFactor = Math.max(0.25, Math.min(1.7, 52 / fitRadius, zoomFactor * Math.exp(event.deltaY * 0.0011)));
    spherical.radius = Math.max(8.2, Math.min(52, fitRadius * zoomFactor));
    updateCamera();
  }

  function randomMove() {
    const axisList = ['x', 'y', 'z'];
    let move;
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const axis = axisList[Math.floor(nextRandom() * axisList.length)];
      const layer = Math.floor(nextRandom() * 3) - 1;
      const turns = nextRandom() < 0.23 ? 2 : (nextRandom() < 0.5 ? 1 : 3);
      move = { axis, layer, turns };
      if (!auto.previous || move.axis !== auto.previous.axis || move.layer !== auto.previous.layer) break;
    }
    auto.previous = move;
    return move;
  }

  function startAnimatedTurn(move, kind, duration, fromAngle = 0, toAngle = null) {
    if (activeTurn) return false;
    const normalized = normalizeMove(move);
    const axisVector = cubeView.beginTurn(normalized, cubeStateReference);
    activeTurn = {
      kind,
      move: normalized,
      axisVector,
      elapsed: 0,
      duration,
      fromAngle,
      toAngle: toAngle ?? angleForMove(normalized.turns),
      angle: fromAngle,
      dragging: false,
      cancelOnly: false,
    };
    return true;
  }

  function startButtonRestore() {
    if (activeTurn || !restoreRequested) return;
    if (!history.length) {
      restoreRequested = false;
      auto.phase = 'waiting';
      auto.timer = 3.5;
      return;
    }
    restoreQueue = [...history].reverse().map((move) => inverseMove(move));
    restoreIndex = 0;
    scheduleButtonRestoreStep();
  }

  function scheduleButtonRestoreStep() {
    if (activeTurn || !restoreRequested) return;
    if (restoreIndex >= restoreQueue.length) {
      history.length = 0;
      restoreQueue = [];
      restoreIndex = 0;
      restoreRequested = false;
      auto.phase = 'waiting';
      auto.timer = 4.5;
      return;
    }
    const move = restoreQueue[restoreIndex];
    startAnimatedTurn(move, 'button-restore', 0.72 + nextRandom() * 0.32);
  }

  function requestRestore() {
    restoreRequested = true;
    auto.phase = 'waiting';
    auto.timer = 60;
    auto.cycleStart = null;
    auto.moves = [];
    auto.applied = 0;
    if (gesture?.kind === 'cube' && activeTurn) {
      animateSettling('manual-cancel', null, activeTurn.angle, 0, activeTurn.axisVector, 0.17);
      gesture = null;
    } else if (gesture) {
      gesture = null;
    }
    pendingGesture = null;
    canvas.classList.remove('is-dragging');
    if (!activeTurn) startButtonRestore();
  }

  function updateAuto(delta) {
    if (activeTurn || restoreRequested || gesture?.kind === 'pending') return;
    auto.timer -= delta;
    if (auto.timer > 0) return;

    if (auto.phase === 'waiting') {
      auto.phase = 'scramble';
      auto.cycleStart = history.length;
      auto.moves = [];
      auto.applied = 0;
      auto.timer = 0.45;
      return;
    }
    if (auto.phase === 'scramble') {
      if (auto.applied < auto.total) {
        startAnimatedTurn(randomMove(), 'auto-scramble', 0.52 + nextRandom() * 0.12);
        auto.timer = 1.12;
      } else {
        auto.phase = 'breather';
        auto.timer = 2.3;
      }
      return;
    }
    if (auto.phase === 'breather') {
      auto.phase = 'auto-restore';
      auto.timer = 0.25;
      return;
    }
    if (auto.phase === 'auto-restore') {
      if (auto.moves.length) {
        const move = inverseMove(auto.moves[auto.moves.length - 1]);
        startAnimatedTurn(move, 'auto-reverse', 1.02 + nextRandom() * 0.28);
        auto.timer = 1.42;
      } else {
        if (auto.cycleStart !== null) history.splice(auto.cycleStart);
        auto.cycleStart = null;
        auto.phase = 'waiting';
        auto.timer = 3.5;
      }
    }
  }

  function tick(now) {
    requestAnimationFrame(tick);
    const delta = Math.max(0, Math.min(0.05, (now - lastFrame) / 1000));
    lastFrame = now;

    if (activeTurn && !activeTurn.dragging) {
      activeTurn.elapsed += delta;
      const progress = Math.min(1, activeTurn.elapsed / Math.max(0.001, activeTurn.duration));
      const eased = easeInOut(progress);
      const angle = activeTurn.fromAngle + (activeTurn.toAngle - activeTurn.fromAngle) * eased;
      cubeView.setTurnAngle(activeTurn.axisVector, angle);
      if (progress >= 1) {
        if (activeTurn.kind === 'button-restore') {
          const move = restoreQueue[restoreIndex];
          activeTurn.move = move;
        }
        finishTurnAnimation();
      }
    }

    if (!activeTurn && !restoreRequested) updateAuto(delta);
    worlds.update(delta);
    renderer.render(scene, camera);
  }

  canvas.addEventListener('pointerdown', onPointerDown, { passive: false });
  canvas.addEventListener('pointermove', onPointerMove, { passive: false });
  canvas.addEventListener('pointerup', onPointerUp, { passive: false });
  canvas.addEventListener('pointercancel', onPointerCancel, { passive: false });
  canvas.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('resize', resize, { passive: true });
  restoreButton.addEventListener('pointerdown', (event) => event.stopPropagation());
  restoreButton.addEventListener('click', requestRestore);
  document.addEventListener('visibilitychange', () => { lastFrame = performance.now(); });
  window.addEventListener('pagehide', () => {
    cubeView.dispose();
    worlds.dispose();
    for (const texture of glyphTextures.values()) texture.dispose();
    renderer.dispose();
  }, { once: true });
  resize();
  requestAnimationFrame(tick);
}
