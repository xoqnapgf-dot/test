import * as THREE from 'three';

const TURN_KEYS = new Set('URFDLBMESXYZ');

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export class CubeControls {
  constructor({ canvas, camera, cube, helpDialog, onActivity = () => {}, onTurn = () => {} }) {
    this.canvas = canvas;
    this.camera = camera;
    this.cube = cube;
    this.helpDialog = helpDialog;
    this.onActivity = onActivity;
    this.onTurn = onTurn;
    this.raycaster = new THREE.Raycaster();
    this.ndc = new THREE.Vector2();
    this.hitTargets = cube.stickers.flatMap((sticker) => [sticker.plate, sticker.icon]);
    this.pointerPositions = new Map();
    this.gesture = null;
    this.pinch = null;
    this.theta = 0;
    this.phi = 0;
    this.radius = 12.35;
    this.target = new THREE.Vector3(0, 0, 0);
    this.lastPointerKind = 'mouse';
    this.disposed = false;
    this.setDefaultCamera();

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handlePointerCancel = this.handlePointerCancel.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleContextMenu = (event) => event.preventDefault();
    this.handleDoubleClick = (event) => { event.preventDefault(); this.resetCamera(); this.onActivity(); };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleResize = this.handleResize.bind(this);

    canvas.addEventListener('pointerdown', this.handlePointerDown);
    canvas.addEventListener('pointermove', this.handlePointerMove);
    canvas.addEventListener('pointerup', this.handlePointerUp);
    canvas.addEventListener('pointercancel', this.handlePointerCancel);
    canvas.addEventListener('wheel', this.handleWheel, { passive: false });
    canvas.addEventListener('contextmenu', this.handleContextMenu);
    canvas.addEventListener('dblclick', this.handleDoubleClick);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('resize', this.handleResize);
  }

  setDefaultCamera() {
    const initial = new THREE.Vector3(7.8, 6.2, 9.2);
    this.radius = window.innerWidth / Math.max(1, window.innerHeight) < 0.78 ? 10.7 : initial.length();
    this.theta = Math.atan2(initial.x, initial.z);
    this.phi = Math.acos(clamp(initial.y / this.radius, -1, 1));
    this.applyCamera();
  }

  applyCamera() {
    this.phi = clamp(this.phi, 0.19, Math.PI - 0.19);
    this.radius = clamp(this.radius, 7.2, 17.5);
    const spherical = new THREE.Spherical(this.radius, this.phi, this.theta);
    this.camera.position.setFromSpherical(spherical).add(this.target);
    this.camera.lookAt(this.target);
    this.camera.updateMatrixWorld();
  }

  resetCamera() {
    this.setDefaultCamera();
    this.handleResize();
  }

  handleResize() {
    const aspect = this.canvas.clientWidth / Math.max(1, this.canvas.clientHeight);
    this.camera.fov = aspect < 0.78 ? 70 : aspect < 1.08 ? 55 : 44;
    this.camera.updateProjectionMatrix();
  }

  updatePointer(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  intersectCube(event) {
    this.updatePointer(event);
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const hits = this.raycaster.intersectObjects(this.hitTargets, false);
    return hits.length ? hits[0] : null;
  }

  handlePointerDown(event) {
    if (this.disposed) return;
    this.lastPointerKind = event.pointerType || 'mouse';
    this.canvas.focus({ preventScroll: true });
    this.onActivity();
    this.pointerPositions.set(event.pointerId, { x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY });
    try { this.canvas.setPointerCapture(event.pointerId); } catch { /* Some embedded browsers deny capture. */ }

    if (this.pointerPositions.size >= 2) {
      this.gesture = null;
      const points = [...this.pointerPositions.values()];
      this.pinch = {
        distance: Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y),
        radius: this.radius,
      };
      this.canvas.classList.add('is-zooming');
      return;
    }

    const forceOrbit = event.button === 2 || event.button === 1 || event.shiftKey;
    const hit = forceOrbit ? null : this.intersectCube(event);
    if (hit) {
      this.gesture = {
        kind: 'turn',
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        sticker: this.cube.getStickerFromHit(hit),
        point: hit.point.clone(),
      };
      this.canvas.classList.add('is-turning');
    } else {
      this.gesture = {
        kind: 'orbit',
        pointerId: event.pointerId,
        lastX: event.clientX,
        lastY: event.clientY,
      };
      this.canvas.classList.add('is-orbiting');
    }
  }

  handlePointerMove(event) {
    const pointer = this.pointerPositions.get(event.pointerId);
    if (!pointer) {
      if (this.pointerPositions.size === 0 && this.lastPointerKind === 'mouse') {
        const hit = this.intersectCube(event);
        this.canvas.classList.toggle('is-hovering-cell', Boolean(hit));
      }
      return;
    }
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    this.onActivity();

    if (this.pointerPositions.size >= 2) {
      const points = [...this.pointerPositions.values()];
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      if (this.pinch && this.pinch.distance > 0) {
        this.radius = clamp(this.pinch.radius * this.pinch.distance / Math.max(distance, 8), 7.2, 17.5);
        this.applyCamera();
      }
      return;
    }

    if (!this.gesture || this.gesture.pointerId !== event.pointerId) return;
    if (this.gesture.kind === 'orbit') {
      const dx = event.clientX - this.gesture.lastX;
      const dy = event.clientY - this.gesture.lastY;
      this.theta -= dx * 0.006;
      this.phi -= dy * 0.0055;
      this.gesture.lastX = event.clientX;
      this.gesture.lastY = event.clientY;
      this.applyCamera();
    }
  }

  handlePointerUp(event) {
    const pointer = this.pointerPositions.get(event.pointerId);
    if (!pointer) return;
    this.pointerPositions.delete(event.pointerId);
    try { this.canvas.releasePointerCapture(event.pointerId); } catch { /* Capture may already be released. */ }

    if (this.pointerPositions.size < 2) {
      this.pinch = null;
      this.canvas.classList.remove('is-zooming');
    }

    if (this.gesture?.pointerId === event.pointerId) {
      const gesture = this.gesture;
      this.gesture = null;
      if (gesture.kind === 'turn' && this.pointerPositions.size === 0) {
        const dx = event.clientX - gesture.startX;
        const dy = event.clientY - gesture.startY;
        const move = this.cube.getStickerMove(gesture.sticker, gesture.point, this.camera, dx, dy);
        if (move) this.onTurn(move.token, { source: 'pointer', ...move });
      }
    } else if (this.pointerPositions.size === 1) {
      // After a pinch, do not turn or orbit from the remaining finger.
      this.gesture = null;
    }

    if (this.pointerPositions.size === 0) {
      this.canvas.classList.remove('is-turning', 'is-orbiting');
      this.onActivity();
    }
  }

  handlePointerCancel(event) {
    this.pointerPositions.delete(event.pointerId);
    this.gesture = null;
    this.pinch = null;
    this.canvas.classList.remove('is-turning', 'is-orbiting', 'is-zooming');
  }

  handleWheel(event) {
    event.preventDefault();
    this.onActivity();
    const intensity = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 0.045 : 0.0012;
    this.radius = clamp(this.radius * Math.exp(event.deltaY * intensity), 7.2, 17.5);
    this.applyCamera();
  }

  handleKeyDown(event) {
    if (this.disposed || event.defaultPrevented || this.helpDialog?.open) return;
    if (event.ctrlKey || event.metaKey || event.repeat) return;
    const key = event.key.toUpperCase();
    if (TURN_KEYS.has(key) && key.length === 1) {
      event.preventDefault();
      const suffix = event.altKey ? '2' : event.shiftKey ? "'" : '';
      const face = 'XYZ'.includes(key) ? key.toLowerCase() : key;
      const token = `${face}${suffix}`;
      this.onActivity();
      this.onTurn(token, { source: 'keyboard' });
    } else if (event.key === 'Escape') {
      this.resetCamera();
      this.onActivity();
    }
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    this.canvas.removeEventListener('pointermove', this.handlePointerMove);
    this.canvas.removeEventListener('pointerup', this.handlePointerUp);
    this.canvas.removeEventListener('pointercancel', this.handlePointerCancel);
    this.canvas.removeEventListener('wheel', this.handleWheel);
    this.canvas.removeEventListener('contextmenu', this.handleContextMenu);
    this.canvas.removeEventListener('dblclick', this.handleDoubleClick);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('resize', this.handleResize);
  }
}
