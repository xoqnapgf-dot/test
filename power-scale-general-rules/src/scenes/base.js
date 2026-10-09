// Scene scaffolding: a three.js scene with a backdrop, a camera, and a projector that maps
// 3D points to the 1920x1080 overlay so 2D labels and strokes can ride on 3D objects.
import * as THREE from 'three';
import { makeBackdrop } from '../gfx/materials.js';
import { cues } from '../core/time.js';
import { W, H } from '../core/draw2d.js';

const tmp = new THREE.Vector3();

export function makeScene(id, mode, o = {}) {
  const three = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(o.fov || 40, 16 / 9, o.near || 0.1, o.far || 5000);
  camera.position.set(0, 0, 10);
  const backdrop = o.backdrop === false ? null : makeBackdrop(mode, o.backdrop || {});
  if (backdrop) three.add(backdrop.mesh);
  const c = cues(id);
  const sc = {
    id,
    mode,
    three,
    camera,
    backdrop,
    c,
    overlayGain: o.overlayGain || 1.6,
    update() {},
    draw() {},
    // world -> overlay coordinates; returns [x, y, depth, visible]
    project(v, out = []) {
      tmp.copy(v).project(camera);
      out[0] = (tmp.x * 0.5 + 0.5) * W;
      out[1] = (-tmp.y * 0.5 + 0.5) * H;
      out[2] = tmp.z;
      out[3] = tmp.z < 1 && tmp.z > -1;
      return out;
    },
    p3(x, y, z) {
      return sc.project(tmp.set(x, y, z), []);
    },
    // overlay pixels per world unit at a world point (for sizing 2D marks on 3D things)
    pxPerUnit(v) {
      const d = tmp.copy(v).applyMatrix4(camera.matrixWorldInverse).z;
      return (H / 2) * (camera.projectionMatrix.elements[5] / Math.max(-d, 1e-4));
    },
  };
  return sc;
}

export function lookAt(cam, pos, target, roll = 0) {
  cam.position.set(pos[0], pos[1], pos[2]);
  cam.up.set(Math.sin(roll), Math.cos(roll), 0);
  cam.lookAt(target[0], target[1], target[2]);
  cam.updateMatrixWorld();
}
