const test = require("node:test");
const assert = require("node:assert/strict");
const Core = require("../core.js");

const SEED = "0123456789abcdef0123456789abcdef";

test("one image is exactly 320×180 one-byte palette indices", () => {
  const pixels = Core.generateIndices(SEED, 0);
  assert.ok(pixels instanceof Uint8Array);
  assert.equal(pixels.length, 57_600);
  for (const colorIndex of pixels) assert.ok(colorIndex >= 0 && colorIndex <= 255);
});

test("the same master seed and k reproduce a fixed byte-for-byte image", () => {
  const first = Core.generateIndices(SEED, 0);
  const second = Core.generateIndices(SEED, 0);
  assert.ok(Core.equalBytes(first, second));
  assert.equal(Buffer.from(first.subarray(0, 32)).toString("hex"), "204967bdc2e55ae5f7fdc630fa333c48cfb9f6e9167024246fe80c1e252b116f");
});

test("different image indices derive different deterministic streams", () => {
  const zero = Core.generateIndices(SEED, 0);
  const one = Core.generateIndices(SEED, 1);
  assert.notEqual(Buffer.from(zero.subarray(0, 64)).toString("hex"), Buffer.from(one.subarray(0, 64)).toString("hex"));
  assert.notDeepEqual(Array.from(Core.deriveState(SEED, 0)), Array.from(Core.deriveState(SEED, 1)));
});

test("the 3-3-2 palette uses the specified rounded channel mapping", () => {
  assert.deepEqual(Core.colorForIndex(0), [0, 0, 0]);
  assert.deepEqual(Core.colorForIndex(255), [255, 255, 255]);
  assert.deepEqual(Core.colorForIndex(0xe3), [255, 0, 255]);
  assert.deepEqual(Core.colorForIndex(0x1c), [0, 255, 0]);
});

test("master seeds are canonical 32-character hexadecimal strings", () => {
  assert.equal(Core.normalizeSeed(`  ${SEED.toUpperCase()}  `), SEED);
  assert.throws(() => Core.normalizeSeed("1234"), /32 位/);
  const fakeCrypto = {
    getRandomValues(words) {
      words.set([0, 1, 0xabcdef01, 0xffffffff]);
      return words;
    },
  };
  assert.equal(Core.createMasterSeed(fakeCrypto), "0000000000000001abcdef01ffffffff");
});

test("seed derivation supports safe indices above 32 bits and rejects invalid k", () => {
  const highIndex = 0x100000001;
  assert.ok(Core.deriveState(SEED, highIndex) instanceof Uint32Array);
  assert.notDeepEqual(Array.from(Core.deriveState(SEED, 1)), Array.from(Core.deriveState(SEED, highIndex)));
  assert.throws(() => Core.deriveState(SEED, -1), /序号/);
  assert.throws(() => Core.deriveState(SEED, 1.5), /序号/);
  assert.throws(() => Core.deriveState(SEED, Number.MAX_SAFE_INTEGER + 1), /序号/);
});

test("horizontal similarity compares only the 319 right-neighbour pairs per row", () => {
  const solid = new Uint8Array(Core.PIXEL_COUNT);
  assert.equal(Core.horizontalMatchRatio(solid), 1);
  const varied = new Uint8Array(Core.PIXEL_COUNT);
  for (let y = 0; y < Core.HEIGHT; y += 1) {
    for (let x = 0; x < Core.WIDTH; x += 1) varied[y * Core.WIDTH + x] = x & 1;
  }
  assert.equal(Core.horizontalMatchRatio(varied), 0);
  assert.throws(() => Core.horizontalMatchRatio(new Uint8Array(8)), /320×180/);
});
