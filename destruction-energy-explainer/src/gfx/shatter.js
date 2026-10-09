// Stateless fragment animation for a fractured body: every frame is a pure function of time.
//   mode 'fly'     — fragments thrown outward with drag (and optional gravity); zs squashes depth travel
//   mode 'crumble' — cracks open a little, pieces sag, nothing escapes (the "碎" case)
import * as THREE from 'three';
import { hash1, clamp } from '../core/util.js';

const Q = new THREE.Quaternion();
const AX = new THREE.Vector3();

export class Shatter {
  constructor(cells, material, opts = {}) {
    this.group = new THREE.Group();
    this.parts = cells.map((c, i) => {
      const m = new THREE.Mesh(c.geo, material);
      m.frustumCulled = false;
      const dir = c.center.clone();
      if (opts.impact) dir.sub(opts.impact);
      if (dir.lengthSq() < 1e-6) dir.set(hash1(i) - 0.5, hash1(i + 7) - 0.5, hash1(i + 9) - 0.5);
      dir.normalize();
      dir.x += (hash1(i * 3 + 1) - 0.5) * 0.5;
      dir.y += (hash1(i * 3 + 2) - 0.5) * 0.5;
      dir.z += (hash1(i * 3 + 3) - 0.5) * 0.5;
      dir.normalize();
      const axis = new THREE.Vector3(hash1(i * 5 + 1) - 0.5, hash1(i * 5 + 2) - 0.5, hash1(i * 5 + 3) - 0.5).normalize();
      this.group.add(m);
      return { m, c: c.center.clone(), dir, axis, sp: 0.6 + hash1(i * 11) * 0.8, spin: (hash1(i * 13) - 0.5) * 8 };
    });
    this.material = material;
  }
  // t: time since impact (s); negative = intact
  set(tau, o = {}) {
    const mode = o.mode || 'fly';
    const power = o.power ?? 1;
    const drag = o.drag ?? 1.6;
    const g = o.gravity ?? 0;
    const shake = o.shake ?? 0;
    for (let i = 0; i < this.parts.length; i++) {
      const P = this.parts[i];
      const m = P.m;
      if (tau <= 0) {
        m.position.copy(P.c);
        if (shake) m.position.addScalar(Math.sin(i * 7 + tau * 90) * shake);
        m.quaternion.identity();
        continue;
      }
      if (mode === 'fly') {
        const d = ((power * P.sp) / drag) * (1 - Math.exp(-drag * tau));
        m.position.copy(P.c).addScaledVector(P.dir, d);
        if (o.zs !== undefined) m.position.z = P.c.z + P.dir.z * d * o.zs;
        m.position.y -= 0.5 * g * tau * tau;
        AX.copy(P.axis);
        Q.setFromAxisAngle(AX, P.spin * (1 - Math.exp(-drag * 0.5 * tau)) * power);
        m.quaternion.copy(Q);
      } else {
        // crumble: open the cracks, then slump a touch
        const open = (o.open ?? 0.03) * clamp(tau * 3);
        m.position.copy(P.c).addScaledVector(P.dir, open * (0.6 + P.sp * 0.6));
        m.position.addScaledVector(P.c, open * 0.4);
        AX.copy(P.axis);
        Q.setFromAxisAngle(AX, P.spin * 0.012 * clamp(tau * 2));
        m.quaternion.copy(Q);
      }
    }
  }
}
