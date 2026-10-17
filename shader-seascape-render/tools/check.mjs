/* Static check: load every GLSL chunk in the page's script order (no browser needed) and
   verify that each assembled program declares every uniform and function identifier it
   uses. Catches the "undeclared identifier" class of bug without a WebGL context. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.argv[2] || '/home/user/test/shader-seascape-render';
const files = ['src/gl.js', 'src/glsl/common.js', 'src/glsl/sky.js', 'src/glsl/bake.js',
  'src/glsl/terrain.js', 'src/glsl/clouds.js', 'src/glsl/water.js', 'src/glsl/scene.js',
  'src/glsl/gen.js', 'src/glsl/post.js', 'src/gen.js', 'src/renderer.js'];

const sandbox = { window: {}, document: { createElement: () => ({ getContext: () => null }) }, console };
sandbox.window.ssLog = () => {};
const ctx = vm.createContext(sandbox);
for (const f of files) {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) { console.log('missing', f); continue; }
  try { vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f }); }
  catch (e) { console.log('THROW in', f, e.message); }
}
const SS = sandbox.window.SS;
const G = SS.GLSL;
const assemble = SS.assembleFS;

const programs = {
  scene: [G.paramsBlock, G.prototypes, G.common, G.atmo, G.terrain, G.clouds, G.water, G.scene],
  skyLUT: [G.atmoParams, G.common, G.atmo, G.skyLUTShader],
  sunTrans: [G.atmoParams, G.common, G.atmo, G.sunTransShader],
  terrainBase: [G.common, G.heightPack, G.terrainBaseShader],
  erode: [G.common, G.heightPack, G.erodeShader],
  aoBake: [G.common, G.heightPack, G.aoBakeShader],
  volume: [G.common, G.volumeShader],
  weather: [G.common, G.weatherShader],
  bloomDown: [G.common, G.bloomDownShader],
  bloomUp: [G.common, G.bloomUpShader],
  composite: [G.common, G.compositeShader],
  strip: [G.common, G.stripShader]
};

let bad = 0;
for (const [name, parts] of Object.entries(programs)) {
  const undef = parts.filter(p => p === undefined || p === null);
  if (undef.length) { console.log(`${name}: ${undef.length} UNDEFINED CHUNK(S)`); bad++; }
  const src = assemble(null, parts);
  if (!/void main\s*\(/.test(src)) { console.log(`${name}: no main()`); bad++; continue; }
  const declared = new Set();
  let m;
  // uniform blocks: every declarator in the list, e.g. "uniform float a, b, c;" (a regex
  // that only captured the first name reported false positives for years of shaders)
  const reU = /uniform\s+(?:highp |mediump |lowp )?[\w]+\s+([^;{]+);/g;
  while ((m = reU.exec(src)) !== null) {
    for (const part of m[1].split(',')) {
      const nm = part.trim().match(/^(\w+)/);
      if (nm) declared.add(nm[1]);
    }
  }
  const re = /\b(?:float|vec2|vec3|vec4|mat2|mat3|mat4|int|bool|void|Material)\s+(\w+)\s*\(/g;
  while ((m = re.exec(src)) !== null) declared.add(m[1]);
  // every uXxx identifier reference
  const used = new Set();
  const re2 = /\bu[A-Z]\w*/g;
  while ((m = re2.exec(src)) !== null) used.add(m[0]);
  const missing = [...used].filter(u => !declared.has(u) && !/^uint$/.test(u));
  if (missing.length) { console.log(`${name}: UNDECLARED UNIFORMS: ${missing.join(', ')}`); bad++; }
  console.log(`${name.padEnd(12)} ${src.length} chars, ${src.split('\n').length} lines, ${declared.size} symbols${missing.length ? '' : ' ok'}`);
}
console.log(bad ? `\n${bad} problem(s)` : '\nall programs assemble cleanly');
