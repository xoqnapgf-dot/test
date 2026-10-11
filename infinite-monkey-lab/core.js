(function attachMonkeyCore(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MonkeyCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createMonkeyCore() {
  "use strict";

  const WIDTH = 320;
  const HEIGHT = 180;
  const PIXEL_COUNT = WIDTH * HEIGHT;
  const MAX_K = Number.MAX_SAFE_INTEGER;

  function normalizeSeed(value) {
    if (typeof value !== "string") throw new TypeError("主种子必须是 32 位十六进制字符串。");
    const seed = value.trim().toLowerCase();
    if (!/^[0-9a-f]{32}$/.test(seed)) throw new TypeError("主种子必须是 32 位十六进制字符串。");
    return seed;
  }

  function createMasterSeed(cryptoObject) {
    if (!cryptoObject || typeof cryptoObject.getRandomValues !== "function") {
      throw new Error("当前环境不支持 crypto.getRandomValues，无法安全生成主种子。请通过 HTTPS 打开本应用。");
    }
    const words = cryptoObject.getRandomValues(new Uint32Array(4));
    return Array.from(words, (word) => (word >>> 0).toString(16).padStart(8, "0")).join("");
  }

  function rotateLeft(value, count) {
    return (value << count) | (value >>> (32 - count));
  }

  // MurmurHash3-style 32-bit avalanche. Separate, cross-mixed lanes derive
  // xoshiro128**'s 128-bit state from the 128-bit master seed and image index.
  function avalanche32(value) {
    let x = value >>> 0;
    x ^= x >>> 16;
    x = Math.imul(x, 0x85ebca6b);
    x ^= x >>> 13;
    x = Math.imul(x, 0xc2b2ae35);
    x ^= x >>> 16;
    return x >>> 0;
  }

  function deriveState(masterSeed, k) {
    const seed = normalizeSeed(masterSeed);
    if (!Number.isSafeInteger(k) || k < 0 || k > MAX_K) {
      throw new RangeError("图像序号 k 必须是 0 到安全整数上限之间的整数。");
    }

    const words = [0, 1, 2, 3].map((index) => Number.parseInt(seed.slice(index * 8, index * 8 + 8), 16) >>> 0);
    const kLow = k >>> 0;
    const kHigh = Math.floor(k / 0x100000000) >>> 0;

    let a = (words[0] ^ kLow ^ 0x9e3779b9) >>> 0;
    let b = (words[1] ^ kHigh ^ 0x243f6a88) >>> 0;
    let c = (words[2] ^ Math.imul(kLow, 0x85ebca6b) ^ Math.imul(kHigh, 0xc2b2ae35) ^ 0xb7e15162) >>> 0;
    let d = (words[3] ^ Math.imul(kLow, 0xc2b2ae35) ^ Math.imul(kHigh, 0x27d4eb2f) ^ 0x165667b1) >>> 0;

    for (let round = 0; round < 4; round += 1) {
      const oldA = a;
      const oldB = b;
      const oldC = c;
      const oldD = d;
      a = avalanche32((oldA + rotateLeft(oldB, 7) + Math.imul(oldD ^ 0x9e3779b9, 0x85ebca6b) + round) >>> 0);
      b = avalanche32((oldB + rotateLeft(oldC, 11) + Math.imul(oldA ^ 0x243f6a88, 0xc2b2ae35) + round) >>> 0);
      c = avalanche32((oldC + rotateLeft(oldD, 17) + Math.imul(oldB ^ 0xb7e15162, 0x27d4eb2f) + round) >>> 0);
      d = avalanche32((oldD + rotateLeft(oldA, 23) + Math.imul(oldC ^ 0x165667b1, 0x85ebca6b) + round) >>> 0);
    }

    const state = new Uint32Array([a, b, c, d]);
    // xoshiro128** forbids an all-zero state. Keep this deterministic edge case valid.
    if ((state[0] | state[1] | state[2] | state[3]) === 0) state[0] = 0x6d2b79f5;
    return state;
  }

  function makeXoshiro128ss(state) {
    let s0 = state[0] >>> 0;
    let s1 = state[1] >>> 0;
    let s2 = state[2] >>> 0;
    let s3 = state[3] >>> 0;

    return function nextUint32() {
      const result = Math.imul(rotateLeft(Math.imul(s1, 5) >>> 0, 7), 9) >>> 0;
      const t = (s1 << 9) >>> 0;

      s2 = (s2 ^ s0) >>> 0;
      s3 = (s3 ^ s1) >>> 0;
      s1 = (s1 ^ s2) >>> 0;
      s0 = (s0 ^ s3) >>> 0;
      s2 = (s2 ^ t) >>> 0;
      s3 = rotateLeft(s3, 11) >>> 0;
      return result;
    };
  }

  function generateIndices(masterSeed, k) {
    const nextUint32 = makeXoshiro128ss(deriveState(masterSeed, k));
    const indices = new Uint8Array(PIXEL_COUNT);
    for (let offset = 0; offset < PIXEL_COUNT; offset += 4) {
      const value = nextUint32();
      // One 32-bit output supplies four pixel color indices, low byte first.
      indices[offset] = value & 0xff;
      indices[offset + 1] = (value >>> 8) & 0xff;
      indices[offset + 2] = (value >>> 16) & 0xff;
      indices[offset + 3] = (value >>> 24) & 0xff;
    }
    return indices;
  }

  function colorForIndex(index) {
    const color = index & 0xff;
    return [
      Math.round(((color >>> 5) & 7) * 255 / 7),
      Math.round(((color >>> 2) & 7) * 255 / 7),
      Math.round((color & 3) * 255 / 3),
    ];
  }

  function horizontalMatchRatio(indices) {
    if (!(indices instanceof Uint8Array) || indices.length !== PIXEL_COUNT) {
      throw new TypeError("像素数据必须是 320×180 的 Uint8Array。");
    }
    let matches = 0;
    const comparisons = (WIDTH - 1) * HEIGHT;
    for (let y = 0; y < HEIGHT; y += 1) {
      const row = y * WIDTH;
      for (let x = 0; x < WIDTH - 1; x += 1) {
        if (indices[row + x] === indices[row + x + 1]) matches += 1;
      }
    }
    return matches / comparisons;
  }

  function equalBytes(left, right) {
    if (!left || !right || left.length !== right.length) return false;
    for (let index = 0; index < left.length; index += 1) {
      if (left[index] !== right[index]) return false;
    }
    return true;
  }

  return Object.freeze({
    WIDTH,
    HEIGHT,
    PIXEL_COUNT,
    MAX_K,
    normalizeSeed,
    createMasterSeed,
    deriveState,
    generateIndices,
    colorForIndex,
    horizontalMatchRatio,
    equalBytes,
  });
});
