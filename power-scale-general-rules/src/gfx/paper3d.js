// Engraved props for the paper chapters: books, slabs. All use the hatching material.
import * as THREE from 'three';
import { hatchMaterial } from './materials.js';

// a closed book lying flat: cover boards + page block with fine page lines on its edges
export function makeBook(w = 1.4, t = 0.18, d = 2, o = {}) {
  const g = new THREE.Group();
  const cover = hatchMaterial({ tint: o.cover || '#B9A88A', freq: o.freq || 18, axis: [0, 0, 1], light: [-0.4, 0.9, 0.5] });
  const pages = hatchMaterial({ tint: '#F3EDE0', freq: 1 / 0.012, axis: [0, 1, 0], base: 0.18, light: [-0.4, 0.9, 0.5] });
  const board = 0.022 * (o.boardScale || 1);
  const top = new THREE.Mesh(new THREE.BoxGeometry(w, board, d), cover);
  top.position.y = t / 2 - board / 2;
  const bot = new THREE.Mesh(new THREE.BoxGeometry(w, board, d), cover);
  bot.position.y = -t / 2 + board / 2;
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.03, t, d), cover);
  spine.position.x = -w / 2 + 0.015;
  const block = new THREE.Mesh(new THREE.BoxGeometry(w - 0.05, t - board * 2, d - 0.05), pages);
  block.position.x = 0.01;
  g.add(top, bot, spine, block);
  g.userData.mats = [cover, pages];
  return g;
}
export function setMats(obj, key, v) {
  obj.traverse((o) => {
    const m = o.material;
    if (m && m.uniforms && m.uniforms[key]) {
      if (m.uniforms[key].value && m.uniforms[key].value.set && typeof v !== 'number') m.uniforms[key].value.set(...v);
      else m.uniforms[key].value = v;
    }
  });
}

// soft contact shadow lying on the desk (y = 0)
export function makeShadow(w = 1, d = 1, o = {}) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.ShaderMaterial({
      uniforms: { uA: { value: o.alpha || 0.28 } },
      transparent: true,
      depthWrite: false,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform float uA; varying vec2 vUv; void main(){ vec2 d = (vUv - 0.5) * 2.0; float r = length(d * vec2(1.0, 1.0)); float a = smoothstep(1.0, 0.35, r); gl_FragColor = vec4(0.11, 0.09, 0.07, a * uA); }',
    })
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.002;
  m.renderOrder = -10;
  return m;
}
