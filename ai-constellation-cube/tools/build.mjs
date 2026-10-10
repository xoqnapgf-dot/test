import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';

await build({
  entryPoints: ['src/main.js'],
  outfile: 'app.bundle.js',
  bundle: true,
  format: 'iife',
  target: ['es2020'],
  minify: true,
  legalComments: 'eof',
  sourcemap: false,
  treeShaking: true,
  logLevel: 'info',
});

// esbuild preserves whitespace inside bundled GLSL template literals. Strip only
// insignificant trailing/indentation whitespace so generated artifacts pass Git's
// whitespace checks without changing shader tokens.
const bundle = await readFile('app.bundle.js', 'utf8');
const normalizedBundle = bundle.replace(/[ \t]+$/gm, '').replace(/^ +(?=\t)/gm, '');
await writeFile('app.bundle.js', normalizedBundle);
