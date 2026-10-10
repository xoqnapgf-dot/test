import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import chromiumBinary, { inflate, setupLambdaEnvironment } from '@sparticuz/chromium';
import { chromium as playwright } from 'playwright-core';
import CubeState from '../vendor/cubejs/index.js';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const port = 5200 + (process.pid % 600);
const origin = `http://127.0.0.1:${port}`;
let server;
let browser;
let page;
const pageErrors = [];
const externalRequests = [];

async function waitForServer(url, child) {
  const deadline = Date.now() + 30_000;
  let lastError;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Vite exited early (${child.exitCode}).`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await delay(120);
  }
  throw new Error(`Vite did not become ready: ${lastError?.message ?? 'timeout'}`);
}

before(async () => {
  const chromiumArchive = join(projectRoot, 'node_modules/@sparticuz/chromium/bin/al2023.tar.br');
  await inflate(chromiumArchive);
  setupLambdaEnvironment('/tmp/al2023/lib');
  const executablePath = await chromiumBinary.executablePath();
  browser = await playwright.launch({ args: chromiumBinary.args, executablePath, headless: true });

  const viteEntry = join(projectRoot, 'node_modules/vite/bin/vite.js');
  server = spawn(process.execPath, [viteEntry, '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: projectRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, CI: '1' },
  });
  let serverOutput = '';
  server.stdout.on('data', (chunk) => { serverOutput += chunk.toString(); });
  server.stderr.on('data', (chunk) => { serverOutput += chunk.toString(); });
  server.on('exit', (code) => {
    if (code && code !== 0) pageErrors.push(new Error(`Vite exited with ${code}: ${serverOutput}`));
  });
  await waitForServer(origin, server);

  const context = await browser.newContext({ viewport: { width: 1365, height: 900 }, deviceScaleFactor: 1 });
  page = await context.newPage();
  page.on('pageerror', (error) => pageErrors.push(error));
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.protocol.startsWith('http') && url.origin !== origin) externalRequests.push(request.url());
  });
  await page.goto(`${origin}/?test=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.__ORBIT_TEST__?.cube), { timeout: 30_000 });
  await page.waitForFunction(() => window.__ORBIT_TEST__.renderer?.info.render.calls > 0, { timeout: 30_000 });
  await page.waitForFunction(() => window.__ORBIT_TEST__.solver?.ready, { timeout: 20_000 });
});

after(async () => {
  await browser?.close();
  if (server && server.exitCode === null) {
    server.kill('SIGTERM');
    await Promise.race([once(server, 'exit'), delay(2_000)]);
  }
});

test('the actual WebGL scene boots with the complete cube and world network', async () => {
  const stats = await page.evaluate(() => ({
    fallbackHidden: document.querySelector('#scene-fallback').hidden,
    stickerCount: window.__ORBIT_TEST__.cube.stickers.length,
    cubeletCount: window.__ORBIT_TEST__.cube.cubelets.length,
    worldCount: window.__ORBIT_TEST__.network.worlds.length,
    routeCount: window.__ORBIT_TEST__.routeCount,
    drawCalls: window.__ORBIT_TEST__.renderer.info.render.calls,
    webgl2: window.__ORBIT_TEST__.renderer.capabilities.isWebGL2,
    width: document.querySelector('#world-canvas').clientWidth,
    height: document.querySelector('#world-canvas').clientHeight,
  }));
  assert.equal(stats.fallbackHidden, true, 'WebGL fallback should stay hidden');
  assert.equal(stats.stickerCount, 54);
  assert.equal(stats.cubeletCount, 27);
  assert.equal(stats.worldCount, 6);
  assert.equal(stats.routeCount, 6);
  assert.ok(stats.drawCalls > 0 && stats.drawCalls < 800, `reasonable draw-call count (${stats.drawCalls})`);
  assert.equal(stats.webgl2, true);
  assert.ok(stats.width > 500 && stats.height > 500);
  assert.equal(pageErrors.length, 0, pageErrors.map(String).join('\n'));
  assert.deepEqual(externalRequests, [], 'the page should not fetch fonts, images, or APIs from external hosts');
});

test('the offline classic-script entry and inlined solver work directly from file://', async () => {
  const errorsBefore = pageErrors.length;
  await page.goto(`${pathToFileURL(join(projectRoot, 'index.html')).href}?test=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.__ORBIT_TEST__?.cube), { timeout: 30_000 });
  await page.waitForFunction(() => window.__ORBIT_TEST__.renderer?.info.render.calls > 0, { timeout: 30_000 });
  await page.waitForFunction(() => window.__ORBIT_TEST__.solver?.ready, { timeout: 30_000 });

  const result = await page.evaluate(() => ({
    stickers: window.__ORBIT_TEST__.cube.stickers.length,
    cubelets: window.__ORBIT_TEST__.cube.cubelets.length,
    webgl2: window.__ORBIT_TEST__.renderer.capabilities.isWebGL2,
    stylesheet: document.querySelector('link[rel="stylesheet"]').href,
    scriptType: document.querySelector('script[defer]').type || 'classic',
    fallbackHidden: document.querySelector('#scene-fallback').hidden,
  }));
  assert.equal(result.stickers, 54);
  assert.equal(result.cubelets, 27);
  assert.equal(result.webgl2, true);
  assert.equal(result.fallbackHidden, true);
  assert.equal(result.scriptType, 'classic');
  assert.ok(result.stylesheet.startsWith('file://'));
  assert.deepEqual(externalRequests, [], 'the file:// page must not request any network resources');
  assert.equal(pageErrors.length, errorsBefore, pageErrors.slice(errorsBefore).map(String).join('\n'));

  await page.goto(`${origin}/?test=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.__ORBIT_TEST__?.cube), { timeout: 30_000 });
  await page.waitForFunction(() => window.__ORBIT_TEST__.solver?.ready, { timeout: 30_000 });
});

test('only the corner help affordance is exposed until the user asks for the guide', async () => {
  assert.equal(await page.locator('#help-trigger').isVisible(), true);
  assert.equal(await page.locator('#help-dialog').isVisible(), false);
  await page.locator('#help-trigger').click();
  assert.equal(await page.locator('#help-dialog').isVisible(), true);
  assert.equal(await page.locator('.family-card').count(), 6);
  assert.equal(await page.locator('.ability-item').count(), 54);
  assert.equal(await page.locator('.easter-egg-list li').count(), 3);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('#help-dialog').open
    && document.querySelector('#help-trigger').getAttribute('aria-expanded') === 'false');
  assert.equal(await page.locator('#help-trigger').getAttribute('aria-expanded'), 'false');
});

test('a straight pointer drag on a sticker commits a real layer turn', async () => {
  const start = await page.evaluate(() => {
    const { cube, camera, THREE } = window.__ORBIT_TEST__;
    cube.root.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    const sticker = cube.stickers.find((cell) => cell.familyIndex === 0 && cell.cellIndex === 4);
    const position = sticker.group.localToWorld(new THREE.Vector3(0, 0, 0.052));
    position.project(camera);
    return {
      x: (position.x + 1) * window.innerWidth / 2,
      y: (-position.y + 1) * window.innerHeight / 2,
      before: cube.getFacelets(),
      moveCount: cube.moveCount,
      stickerId: sticker.id,
    };
  });
  assert.ok(start.x > 100 && start.x < 1200 && start.y > 80 && start.y < 820, `visible sticker projected at ${start.x}, ${start.y}`);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + 72, start.y + 2, { steps: 6 });
  await page.mouse.up();
  await page.waitForFunction((previous) => window.__ORBIT_TEST__.cube.moveCount > previous, start.moveCount, { timeout: 5_000 });
  const result = await page.evaluate(() => ({
    facelets: window.__ORBIT_TEST__.cube.getFacelets(),
    counts: window.__ORBIT_TEST__.faceCompositions,
    moveCount: window.__ORBIT_TEST__.cube.moveCount,
  }));
  assert.notEqual(result.facelets, start.before, 'a pointer gesture changes the cube state');
  assert.equal(result.moveCount, start.moveCount + 1);
  assert.equal(result.counts.length, 6);
  assert.ok(result.counts.every((face) => face.reduce((sum, count) => sum + count, 0) === 9));
});

test('the keyboard turns a layer and a background drag orbits the camera', async () => {
  const beforeMove = await page.evaluate(() => window.__ORBIT_TEST__.cube.moveCount);
  await page.keyboard.press('Shift+r');
  await page.waitForFunction((previous) => window.__ORBIT_TEST__.cube.moveCount > previous, beforeMove, { timeout: 5_000 });
  const beforeTheta = await page.evaluate(() => window.__ORBIT_TEST__.controls.theta);
  await page.mouse.move(38, 38);
  await page.mouse.down();
  await page.mouse.move(97, 73, { steps: 5 });
  await page.mouse.up();
  const afterTheta = await page.evaluate(() => window.__ORBIT_TEST__.controls.theta);
  assert.notEqual(afterTheta, beforeTheta, 'dragging empty space changes the camera orbit');

  for (const key of ['x', 'y', 'z']) {
    const moveCount = await page.evaluate(() => window.__ORBIT_TEST__.cube.moveCount);
    await page.keyboard.press(key);
    await page.waitForFunction((previous) => window.__ORBIT_TEST__.cube.moveCount > previous, moveCount, { timeout: 5_000 });
  }
});

test('the touch-style pointer path turns a slice and pinch changes camera distance', async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(120);
  const gesture = await page.evaluate(() => {
    const { cube, camera, THREE, controls } = window.__ORBIT_TEST__;
    cube.root.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    const sticker = cube.stickers.find((cell) => cell.familyIndex === 2 && cell.cellIndex === 4);
    const point = sticker.group.localToWorld(new THREE.Vector3(0, 0, 0.052));
    point.project(camera);
    return {
      x: (point.x + 1) * window.innerWidth / 2,
      y: (-point.y + 1) * window.innerHeight / 2,
      moveCount: cube.moveCount,
      radius: controls.radius,
    };
  });
  await page.evaluate(({ x, y }) => {
    const canvas = document.querySelector('#world-canvas');
    const send = (type, clientX, clientY) => canvas.dispatchEvent(new PointerEvent(type, {
      pointerId: 71,
      pointerType: 'touch',
      isPrimary: true,
      button: 0,
      buttons: type === 'pointerup' ? 0 : 1,
      clientX,
      clientY,
      bubbles: true,
      cancelable: true,
    }));
    send('pointerdown', x, y);
    send('pointermove', x - 4, y + 63);
    send('pointerup', x - 4, y + 63);
  }, gesture);
  await page.waitForFunction((previous) => window.__ORBIT_TEST__.cube.moveCount > previous, gesture.moveCount, { timeout: 5_000 });
  const radiusBeforePinch = await page.evaluate(() => window.__ORBIT_TEST__.controls.radius);
  await page.evaluate(() => {
    const canvas = document.querySelector('#world-canvas');
    const dispatch = (type, pointerId, clientX, clientY) => canvas.dispatchEvent(new PointerEvent(type, {
      pointerId, pointerType: 'touch', isPrimary: pointerId === 81, button: 0,
      buttons: type === 'pointerup' ? 0 : 1, clientX, clientY, bubbles: true, cancelable: true,
    }));
    dispatch('pointerdown', 81, 100, 250);
    dispatch('pointerdown', 82, 190, 250);
    dispatch('pointermove', 82, 230, 250);
    dispatch('pointerup', 81, 100, 250);
    dispatch('pointerup', 82, 230, 250);
  });
  const radiusAfterPinch = await page.evaluate(() => window.__ORBIT_TEST__.controls.radius);
  assert.ok(radiusAfterPinch < radiusBeforePinch, 'pinching outward zooms in');
});

test('solver button restores the exact canonical facelet orientation', async () => {
  await page.locator('#help-trigger').click();
  await page.locator('#solve-button').click();
  const solvedFacelets = 'U'.repeat(9) + 'R'.repeat(9) + 'F'.repeat(9) + 'D'.repeat(9) + 'L'.repeat(9) + 'B'.repeat(9);
  await page.waitForFunction((solved) => window.__ORBIT_TEST__.cube.getFacelets() === solved, solvedFacelets, { timeout: 35_000 });
  assert.equal(await page.locator('#help-dialog').isVisible(), false);
});

test('the automatic demo shuffle restores a saved mixed state exactly', async () => {
  const initialMoveCount = await page.evaluate(() => window.__ORBIT_TEST__.cube.moveCount);
  await page.keyboard.press('R');
  await page.waitForFunction((previous) => window.__ORBIT_TEST__.cube.moveCount > previous
    && !window.__ORBIT_TEST__.cube.isBusy, initialMoveCount, { timeout: 5_000 });
  const { before, mixedFaces } = await page.evaluate(() => ({
    before: window.__ORBIT_TEST__.cube.getFacelets(),
    mixedFaces: window.__ORBIT_TEST__.cube.faceCompositions.filter((face) => face.filter((count) => count > 0).length > 1).length,
  }));
  assert.ok(mixedFaces > 0, 'the saved starting state must contain mixed-family faces');

  const started = await page.evaluate(() => window.__ORBIT_TEST__.startShuffle(6, 180));
  assert.equal(started, true);
  await page.waitForFunction(() => window.__ORBIT_TEST__.automationPhase === 'hold', { timeout: 12_000 });
  await page.waitForFunction(() => window.__ORBIT_TEST__.automationPhase === null, { timeout: 12_000 });
  const afterState = await page.evaluate(() => window.__ORBIT_TEST__.cube.getFacelets());
  assert.equal(afterState, before, 'the demo returns to the exact pre-shuffle mixed state');
  assert.equal(pageErrors.length, 0, pageErrors.map(String).join('\n'));
});

test('the idle timer starts its shuffle; a user turn waits for exact restoration, then applies once', async () => {
  const { before, moveCount, mixedFaces } = await page.evaluate(() => ({
    before: window.__ORBIT_TEST__.cube.getFacelets(),
    moveCount: window.__ORBIT_TEST__.cube.moveCount,
    mixedFaces: window.__ORBIT_TEST__.cube.faceCompositions.filter((face) => face.filter((count) => count > 0).length > 1).length,
  }));
  assert.ok(mixedFaces > 0, 'the idle cycle starts from a mixed cube');
  const expected = CubeState.fromString(before).move('R').asString();
  await page.evaluate(() => window.__ORBIT_TEST__.ageToIdle(73_000));
  await page.waitForFunction((initialCount) => window.__ORBIT_TEST__.automationPhase === 'shuffle'
    && window.__ORBIT_TEST__.automationSource === 'idle'
    && window.__ORBIT_TEST__.cube.moveCount > initialCount, moveCount, { timeout: 10_000 });
  await page.keyboard.press('R');
  await page.waitForFunction((facelets) => {
    const cube = window.__ORBIT_TEST__.cube;
    return window.__ORBIT_TEST__.automationPhase === null && !cube.isBusy && cube.getFacelets() === facelets;
  }, expected, { timeout: 12_000 });
});
