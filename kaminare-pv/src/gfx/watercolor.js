// Watercolour / natural-media plates via p5.brush (standalone WebGL2 build).
// Painted once at load into an offscreen canvas, then copied to a 2D canvas for use as textures.
import * as brush from 'p5.brush/standalone';

let canvas = null;
let ready = false;
function ensure(w, h) {
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    brush.load(canvas);
    ready = true;
  } else if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    brush.load(canvas);
  }
}

// fn(brush, w, h) draws in top-left coordinates. Returns a 2D canvas with the result.
export function paint(w, h, seed, fn) {
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  try {
    ensure(w, h);
    brush.seed(seed);
    brush.noiseSeed(seed);
    brush.clear();
    brush.push();
    brush.translate(-w / 2, -h / 2);
    fn(brush, w, h);
    brush.pop();
    brush.render();
    out.getContext('2d').drawImage(canvas, 0, 0);
  } catch (e) {
    console.warn('p5.brush unavailable, skipping plate', e);
  }
  return out;
}
export const brushReady = () => ready;
