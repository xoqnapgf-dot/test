import * as THREE from 'three';
import './style.css';
import { FAMILIES, EASTER_EGGS } from './data.js';
import { CubeRig } from './cube.js';
import { CubeControls } from './controls.js';
import { createStarfield, createWorldNetwork } from './worlds.js';
import { inverseAlgorithm, parseMove } from './moves.js';
import { SolverClient } from './solver-client.js';

const experience = document.querySelector('#experience');
const canvas = document.querySelector('#world-canvas');
const helpTrigger = document.querySelector('#help-trigger');
const helpDialog = document.querySelector('#help-dialog');
const helpClose = document.querySelector('#help-close');
const helpCloseFooter = document.querySelector('#help-close-footer');
const familyCatalog = document.querySelector('#family-catalog');
const solveButton = document.querySelector('#solve-button');
const shuffleButton = document.querySelector('#shuffle-button');
const cameraButton = document.querySelector('#camera-button');
const solverStatus = document.querySelector('#solver-status');
const announcer = document.querySelector('#announcer');
const sceneFallback = document.querySelector('#scene-fallback');

const AUTO_IDLE_MS = 72_000;
const AUTO_HOLD_MS = 17_000;
const DEMO_HOLD_MS = 12_000;
const CELL_TURN_TOKENS = ['U', 'R', 'F', 'D', 'L', 'B', 'M', 'E', 'S'];
let lastActivity = performance.now();
let elapsed = 0;
let previousFrame = 0;
let automation = null;
const deferredUserTurns = [];
let reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
let disposed = false;

function textElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function buildGuide() {
  for (const family of FAMILIES) {
    const card = document.createElement('details');
    card.className = 'family-card';
    card.style.setProperty('--family-accent', family.palette.accent);
    card.style.setProperty('--family-color', family.palette.dark);

    const summary = document.createElement('summary');
    const swatch = textElement('span', 'family-swatch');
    swatch.setAttribute('aria-hidden', 'true');
    const name = textElement('span', 'family-name', family.name);
    const maker = textElement('span', 'family-maker', family.maker);
    const snapshot = textElement('span', 'family-snapshot', family.snapshot);
    const worldLine = textElement('p', 'family-worldline', family.worldLine);
    const pips = textElement('span', 'cell-pips');
    pips.setAttribute('aria-label', 'Nine distinct capability cells');
    for (let index = 0; index < family.abilities.length; index += 1) {
      const pip = document.createElement('i');
      pip.setAttribute('aria-hidden', 'true');
      pips.append(pip);
    }
    summary.append(swatch, name, maker, snapshot, worldLine, pips);
    card.append(summary);

    const list = document.createElement('ol');
    list.className = 'ability-list';
    family.abilities.forEach((ability, index) => {
      const item = document.createElement('li');
      item.className = 'ability-item';
      const itemIndex = textElement('span', 'ability-index', String(index + 1).padStart(2, '0'));
      const title = document.createElement('h3');
      title.className = 'ability-title';
      title.append(document.createTextNode(ability.name));
      const translation = textElement('span', 'ability-zh', ability.zh);
      title.append(translation);
      const detail = textElement('p', 'ability-detail', ability.detail);
      item.append(itemIndex, title, detail);
      list.append(item);
    });
    card.append(list);
    familyCatalog.append(card);
  }

  const eggs = document.createElement('details');
  eggs.className = 'easter-egg-card';
  const summary = document.createElement('summary');
  summary.textContent = 'Three small details, with context';
  const list = document.createElement('ul');
  list.className = 'easter-egg-list';
  for (const egg of EASTER_EGGS) {
    const item = document.createElement('li');
    item.append(textElement('strong', '', egg.name), document.createTextNode(` — ${egg.detail}`));
    list.append(item);
  }
  eggs.append(summary, list);
  familyCatalog.after(eggs);
}

buildGuide();

let renderer;
let scene;
let camera;
let cube;
let network;
let stars;
let controls;
let solver;
let resizeObserver;

function showSceneFallback(error) {
  console.error('AI Orbit Cube could not start the WebGL scene.', error);
  sceneFallback.hidden = false;
  canvas.setAttribute('aria-hidden', 'true');
}

try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
  });
  renderer.setClearColor('#0c1119', 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(experience.clientWidth, experience.clientHeight, false);

  scene = new THREE.Scene();
  scene.background = new THREE.Color('#0c1119');
  scene.fog = new THREE.FogExp2('#0c1119', 0.0038);
  camera = new THREE.PerspectiveCamera(44, experience.clientWidth / Math.max(1, experience.clientHeight), 0.08, 80);

  const ambient = new THREE.HemisphereLight('#c6d4e2', '#1b222c', 1.14);
  scene.add(ambient);
  const key = new THREE.DirectionalLight('#fff0d9', 2.25);
  key.position.set(6.5, 8.5, 8.2);
  scene.add(key);
  const fill = new THREE.DirectionalLight('#91a9cf', 0.76);
  fill.position.set(-7, 2.5, -5);
  scene.add(fill);
  const softRim = new THREE.PointLight('#8ba1ad', 1.0, 17, 1.7);
  softRim.position.set(2, -4.4, 5.8);
  scene.add(softRim);

  stars = createStarfield(scene);
  cube = new CubeRig(scene);
  network = createWorldNetwork(scene);
  network.updateComposition(cube.faceCompositions);
  controls = new CubeControls({
    canvas,
    camera,
    cube,
    helpDialog,
    onActivity: noteActivity,
    onTurn: (token, options = {}) => {
      if (automation && ['cancel-pending', 'cancel-return', 'restore'].includes(automation.phase)) {
        deferredUserTurns.push({ token, options });
        announcer.textContent = `Turn ${token} will follow the quiet return.`;
        return;
      }
      cube.queueMove(token, options);
      announcer.textContent = `Turn ${token} queued.`;
    },
  });
  controls.handleResize();
  resizeObserver = new ResizeObserver(resizeScene);
  resizeObserver.observe(experience);

  cube.onCommit = ({ token, source }) => {
    network.updateComposition(cube.faceCompositions);
    if (token && source !== 'idle-shuffle' && source !== 'idle-restore' && source !== 'demo-shuffle' && source !== 'demo-restore' && source !== 'idle-cancel' && source !== 'demo-cancel') {
      announcer.textContent = `Turn ${token} complete.`;
    }
    handleAutomationCommit(token, source);
    if (pendingSolve && !cube.isBusy) {
      pendingSolve = false;
      runExactSolve();
    }
  };

  solver = new SolverClient((ready, error) => {
    if (ready) {
      solverStatus.textContent = 'Local exact-state solver ready.';
      solverStatus.dataset.state = 'ready';
    } else {
      solverStatus.textContent = 'The local solver could not initialize.';
      solverStatus.dataset.state = 'error';
      console.error('Local solver worker failed.', error);
    }
  });
  requestAnimationFrame(frame);
} catch (error) {
  showSceneFallback(error);
}

let pendingSolve = false;

function resizeScene() {
  if (!renderer || !camera) return;
  const width = Math.max(1, experience.clientWidth);
  const height = Math.max(1, experience.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  controls?.handleResize();
}

function noteActivity() {
  lastActivity = performance.now();
  if (automation) cancelAutomationForUser();
}

function randomScramble(length = 12) {
  const suffixes = ['', "'", '2'];
  const moves = [];
  let previousAxis = '';
  while (moves.length < length) {
    const token = CELL_TURN_TOKENS[Math.floor(Math.random() * CELL_TURN_TOKENS.length)];
    const move = parseMove(token);
    if (move.axis === previousAxis) continue;
    moves.push(`${token}${suffixes[Math.floor(Math.random() * suffixes.length)]}`);
    previousAxis = move.axis;
  }
  return moves.join(' ');
}

function startShuffle(source = 'demo', length = 12, holdMs = DEMO_HOLD_MS) {
  if (!cube || cube.isBusy || automation) return false;
  const names = source === 'idle' ? { shuffle: 'idle-shuffle', restore: 'idle-restore', cancel: 'idle-cancel' } : { shuffle: 'demo-shuffle', restore: 'demo-restore', cancel: 'demo-cancel' };
  const algorithm = randomScramble(length);
  automation = {
    phase: 'shuffle',
    source,
    shuffleSource: names.shuffle,
    restoreSource: names.restore,
    cancelSource: names.cancel,
    algorithm,
    applied: [],
    snapshot: cube.getFacelets(),
    holdMs,
    finishedAt: 0,
    cancelRequested: false,
  };
  cube.queueAlgorithm(algorithm, { source: names.shuffle });
  return true;
}

function beginAutomationReturn(cancelled = false) {
  if (!automation) return;
  const session = automation;
  const reverse = inverseAlgorithm(session.applied.join(' '));
  session.phase = cancelled ? 'cancel-return' : 'restore';
  if (!reverse) {
    finishAutomationReturn(session);
    return;
  }
  cube.queueAlgorithm(reverse, { source: cancelled ? session.cancelSource : session.restoreSource });
}

function finishAutomationReturn(session) {
  if (automation !== session) return;
  const exact = cube.getFacelets() === session.snapshot;
  if (!exact) {
    console.error('The automatic shuffle did not restore its exact saved state.');
    solverStatus.textContent = 'A return check failed; the current cube has been left untouched.';
  }
  automation = null;
  lastActivity = performance.now();
  const queuedTurns = deferredUserTurns.splice(0);
  for (const { token, options } of queuedTurns) cube.queueMove(token, options);
}

function cancelAutomationForUser() {
  if (!automation) return;
  if (automation.phase === 'shuffle') {
    automation.cancelRequested = true;
    automation.phase = 'cancel-pending';
    cube.clearQueue();
    if (!cube.activeTurn) beginAutomationReturn(true);
  } else if (automation.phase === 'hold') {
    beginAutomationReturn(true);
  }
  // If a return is already playing, let it finish; any user move is queued after it.
}

function handleAutomationCommit(token, source) {
  if (!automation) return;
  const session = automation;
  if (source === session.shuffleSource) {
    session.applied.push(token);
    if (session.cancelRequested || session.phase === 'cancel-pending') {
      beginAutomationReturn(true);
    } else if (!cube.isBusy) {
      session.phase = 'hold';
      session.finishedAt = performance.now();
    }
    return;
  }
  if (source === session.restoreSource || source === session.cancelSource) {
    if (!cube.isBusy) finishAutomationReturn(session);
  }
}

function runExactSolve() {
  if (!cube || !solver || solveButton.disabled) return;
  if (cube.isBusy) {
    pendingSolve = true;
    solverStatus.textContent = 'Finishing the current layer before solving…';
    return;
  }
  const snapshot = cube.getExactState();
  const facelets = cube.getFacelets();
  solveButton.disabled = true;
  solverStatus.textContent = 'Finding an exact, orientation-aware return…';
  solver.solve(snapshot).then((algorithm) => {
    if (cube.getFacelets() !== facelets || cube.isBusy) {
      solverStatus.textContent = 'The cube changed while the solver was working. Try again.';
      return;
    }
    const moves = cube.queueAlgorithm(algorithm, { source: 'solver' });
    solverStatus.textContent = moves ? `${moves} verified turns are on their way.` : 'The cube is already in the exact solved orientation.';
    if (moves && helpDialog.open) helpDialog.close();
    announcer.textContent = moves ? `Exact solve queued in ${moves} moves.` : 'Cube is already solved.';
  }).catch((error) => {
    solverStatus.textContent = error.message || 'The local solver could not complete this state.';
    console.error('Exact solve failed.', error);
  }).finally(() => {
    solveButton.disabled = false;
  });
}

function openGuide() {
  noteActivity();
  if (!helpDialog.open) helpDialog.showModal();
  helpTrigger.setAttribute('aria-expanded', 'true');
  helpClose.focus();
}

function closeGuide(restoreFocus = true) {
  if (helpDialog.open) helpDialog.close();
  helpTrigger.setAttribute('aria-expanded', 'false');
  if (restoreFocus) helpTrigger.focus({ preventScroll: true });
  noteActivity();
}

helpTrigger.addEventListener('click', openGuide);
helpClose.addEventListener('click', () => closeGuide());
helpCloseFooter.addEventListener('click', () => closeGuide());
helpDialog.addEventListener('close', () => {
  helpTrigger.setAttribute('aria-expanded', 'false');
});
helpDialog.addEventListener('click', (event) => {
  if (event.target === helpDialog) closeGuide();
});
solveButton.addEventListener('click', () => {
  noteActivity();
  runExactSolve();
});
shuffleButton.addEventListener('click', () => {
  noteActivity();
  const started = startShuffle('demo', 12, DEMO_HOLD_MS);
  if (started) {
    solverStatus.textContent = 'A brief scramble will return to the exact state it started from.';
    closeGuide();
  } else {
    solverStatus.textContent = 'Let the current turns settle, then try the short shuffle again.';
  }
});
cameraButton.addEventListener('click', () => {
  noteActivity();
  controls?.resetCamera();
});

window.addEventListener('keydown', (event) => {
  if (event.key === '?' && !helpDialog.open && !event.ctrlKey && !event.metaKey) {
    event.preventDefault();
    openGuide();
  }
});
window.addEventListener('pagehide', () => {
  disposed = true;
  resizeObserver?.disconnect();
  controls?.dispose();
  cube?.dispose();
  network?.dispose();
  stars?.dispose();
  solver?.dispose();
  renderer?.dispose();
});

function frame(timestamp) {
  if (disposed) return;
  requestAnimationFrame(frame);
  const dt = previousFrame ? Math.min((timestamp - previousFrame) / 1000, 0.04) : 0;
  previousFrame = timestamp;
  elapsed = (elapsed + dt) % 8192;
  const motionScale = reducedMotion ? 0.24 : 1;
  cube?.update(dt, elapsed * motionScale);
  network?.update(elapsed * motionScale, dt);
  if (renderer && scene && camera) renderer.render(scene, camera);
  updateIdleAutomation();
}

function updateIdleAutomation() {
  if (!cube || document.hidden || helpDialog.open || reducedMotion) return;
  const now = performance.now();
  if (automation?.phase === 'hold' && now - automation.finishedAt >= automation.holdMs) {
    beginAutomationReturn(false);
    return;
  }
  if (!automation && now - lastActivity >= AUTO_IDLE_MS && !cube.isBusy) {
    startShuffle('idle', 10, AUTO_HOLD_MS);
  }
}

const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
motionPreference?.addEventListener?.('change', (event) => {
  reducedMotion = event.matches;
});

// Opt-in inspection hooks keep the regular scene quiet; the browser suite uses ?test=1.
if (new URLSearchParams(window.location.search).has('test')) {
  window.__ORBIT_TEST__ = {
    cube,
    network,
    solver,
    controls,
    camera,
    renderer,
    scene,
    THREE,
    startShuffle: (length = 7, holdMs = 300) => startShuffle('demo', length, holdMs),
    restoreAutomation: () => automation && beginAutomationReturn(false),
    get automationPhase() { return automation?.phase ?? null; },
    get automationSource() { return automation?.source ?? null; },
    ageToIdle: (milliseconds = AUTO_IDLE_MS + 1) => { lastActivity = performance.now() - milliseconds; },
    get familyCatalogCount() { return FAMILIES.length; },
    get routeCount() { return network?.routes.length ?? 0; },
    get faceCompositions() { return cube?.faceCompositions; },
  };
}
