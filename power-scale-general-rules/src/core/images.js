// Reference photographs embedded as data URIs (assets/images.js), decoded once at boot.
import * as THREE from 'three';

const imgs = {};
const texs = {};
export async function loadImages() {
  const src = window.__IMAGES || {};
  await Promise.all(
    Object.entries(src).map(
      ([k, uri]) =>
        new Promise((res) => {
          const im = new Image();
          im.onload = () => {
            imgs[k] = im;
            res();
          };
          im.onerror = res;
          im.src = uri;
        })
    )
  );
}
export const image = (k) => imgs[k];
export function texture(k) {
  if (!texs[k] && imgs[k]) {
    const t = new THREE.Texture(imgs[k]);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    t.needsUpdate = true;
    texs[k] = t;
  }
  return texs[k];
}
