// Voronoi fracture of a convex polyhedron (cube or sphere hull) by half-space clipping.
// Each cell becomes a BufferGeometry with:
//   position (relative to the cell centroid), normal, aP0 (original object-space position),
//   aInner (1 on freshly broken faces, 0 on the original surface).
import * as THREE from 'three';
import { rng } from '../core/util.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

export function cubePoly(s = 1) {
  const h = s / 2;
  const p = [V(-h, -h, -h), V(h, -h, -h), V(h, h, -h), V(-h, h, -h), V(-h, -h, h), V(h, -h, h), V(h, h, h), V(-h, h, h)];
  const F = [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [1, 2, 6, 5], [0, 4, 7, 3]];
  return F.map((f) => ({ pts: f.map((i) => p[i].clone()), inner: false }));
}

export function spherePoly(r = 1, detail = 3) {
  const g = new THREE.IcosahedronGeometry(r, detail);
  const pos = g.attributes.position;
  const faces = [];
  for (let i = 0; i < pos.count; i += 3) {
    faces.push({ pts: [0, 1, 2].map((k) => V(pos.getX(i + k), pos.getY(i + k), pos.getZ(i + k))), inner: false });
  }
  return faces;
}

// irregular rock: an icosphere whose vertices are pushed in/out (consistently per vertex)
export function rockPoly(r = 1, seed = 1, rough = 0.18) {
  const g = new THREE.IcosahedronGeometry(r, 1);
  const pos = g.attributes.position;
  const R = rng(seed);
  const cache = new Map();
  const jit = (v) => {
    const k = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`;
    if (!cache.has(k)) cache.set(k, 1 + (R() * 2 - 1) * rough);
    return v.multiplyScalar(cache.get(k));
  };
  const faces = [];
  for (let i = 0; i < pos.count; i += 3) {
    faces.push({ pts: [0, 1, 2].map((k) => jit(V(pos.getX(i + k), pos.getY(i + k), pos.getZ(i + k)))), inner: false });
  }
  return faces;
}

function clipPoly(faces, n, d) {
  const out = [];
  const cap = [];
  for (const f of faces) {
    const res = [];
    const P = f.pts;
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length];
      const da = n.dot(a) - d, db = n.dot(b) - d;
      if (da <= 0) res.push(a);
      if ((da < 0 && db > 0) || (da > 0 && db < 0)) {
        const t = da / (da - db);
        const q = a.clone().lerp(b, t);
        res.push(q);
        cap.push(q);
      }
    }
    if (res.length >= 3) out.push({ pts: res, inner: f.inner });
  }
  if (cap.length >= 3) {
    // order cap points around their centroid in the clipping plane
    const c = cap.reduce((s, p) => s.add(p), V(0, 0, 0)).multiplyScalar(1 / cap.length);
    const u = V(1, 0, 0);
    if (Math.abs(n.x) > 0.9) u.set(0, 1, 0);
    const e1 = u.clone().cross(n).normalize(), e2 = n.clone().cross(e1);
    const uniq = [];
    for (const p of cap) if (!uniq.some((q) => q.distanceToSquared(p) < 1e-10)) uniq.push(p);
    uniq.sort((a, b) => {
      const pa = a.clone().sub(c), pb = b.clone().sub(c);
      return Math.atan2(pa.dot(e2), pa.dot(e1)) - Math.atan2(pb.dot(e2), pb.dot(e1));
    });
    // ensure outward (along n) winding
    if (uniq.length >= 3) {
      const nn = uniq[1].clone().sub(uniq[0]).cross(uniq[2].clone().sub(uniq[0]));
      if (nn.dot(n) < 0) uniq.reverse();
      out.push({ pts: uniq, inner: true });
    }
  }
  return out;
}

function toGeometry(faces) {
  const pos = [], nor = [], p0 = [], inner = [];
  const c = V(0, 0, 0);
  let cnt = 0;
  for (const f of faces) for (const p of f.pts) { c.add(p); cnt++; }
  c.multiplyScalar(1 / Math.max(1, cnt));
  for (const f of faces) {
    const P = f.pts;
    const n = P[1].clone().sub(P[0]).cross(P[2].clone().sub(P[0])).normalize();
    for (let i = 1; i < P.length - 1; i++) {
      for (const q of [P[0], P[i], P[i + 1]]) {
        pos.push(q.x - c.x, q.y - c.y, q.z - c.z);
        p0.push(q.x, q.y, q.z);
        // surface faces of a sphere get smooth normals; broken faces stay flat
        const sn = f.inner ? n : q.clone().normalize();
        nor.push(sn.x, sn.y, sn.z);
        inner.push(f.inner ? 1 : 0);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('aP0', new THREE.Float32BufferAttribute(p0, 3));
  g.setAttribute('aInner', new THREE.Float32BufferAttribute(inner, 1));
  return { geo: g, center: c };
}

// seeds: number of cells; base: faces; bias toward a point (impact) for denser cells there;
// opts.points: explicit seed points (used first), e.g. two seeds for a clean split
export function fracture(base, seeds, seed = 1, opts = {}) {
  const R = rng(seed);
  const S = [];
  const rad = opts.radius ?? 0.5;
  const imp = opts.impact;
  if (opts.points) for (const q of opts.points) S.push(q.clone());
  while (S.length < seeds) {
    const p = V((R() * 2 - 1) * rad, (R() * 2 - 1) * rad, (R() * 2 - 1) * rad);
    if (opts.sphere && p.length() > rad) continue;
    if (imp && R() < 0.45) p.lerp(imp, 0.55 + R() * 0.35);
    S.push(p);
  }
  const cells = [];
  for (let i = 0; i < S.length; i++) {
    let faces = base.map((f) => ({ pts: f.pts.map((p) => p.clone()), inner: f.inner }));
    for (let j = 0; j < S.length && faces.length; j++) {
      if (i === j) continue;
      const n = S[j].clone().sub(S[i]);
      const len = n.length();
      if (len < 1e-6) continue;
      n.multiplyScalar(1 / len);
      const m = S[i].clone().add(S[j]).multiplyScalar(0.5);
      faces = clipPoly(faces, n, n.dot(m));
    }
    if (faces.length < 4) continue;
    const { geo, center } = toGeometry(faces);
    cells.push({ geo, center, seed: R() });
  }
  return cells;
}
