import test from 'node:test';
import assert from 'node:assert/strict';
import { fitCameraDistance } from '../src/layout.js';

test('camera fit keeps the constellation within portrait, square, and landscape perspective frusta', () => {
  for (const aspect of [0.35, 0.4, 0.48, 0.75, 1, 1.6, 2.4]) {
    const fov = 39;
    const halfExtent = 6.2;
    const distance = fitCameraDistance(aspect, fov, halfExtent, 15.1);
    const halfVerticalAngle = (fov * Math.PI) / 360;
    const halfHorizontalAngle = Math.atan(Math.tan(halfVerticalAngle) * aspect);
    assert.ok(distance * Math.tan(halfVerticalAngle) >= halfExtent - 1e-9, `vertical fit at aspect ${aspect}`);
    assert.ok(distance * Math.tan(halfHorizontalAngle) >= halfExtent - 1e-9, `horizontal fit at aspect ${aspect}`);
    assert.ok(distance <= 52, `the full map remains within the camera distance cap at aspect ${aspect}`);
  }
});
