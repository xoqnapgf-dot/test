import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root,
  base: './',
  build: {
    outDir: resolve(root, 'standalone'),
    emptyOutDir: true,
    sourcemap: false,
    lib: {
      entry: resolve(root, 'src/main.js'),
      name: 'AIOrbitCube',
      formats: ['iife'],
      fileName: () => 'orbit-cube.js',
      cssFileName: 'orbit-cube',
    },
  },
});
