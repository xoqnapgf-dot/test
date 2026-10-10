import { cp, copyFile, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await copyFile(new URL('../index.html', import.meta.url), new URL('../dist/index.html', import.meta.url));
await cp(new URL('../standalone/', import.meta.url), new URL('../dist/standalone/', import.meta.url), { recursive: true });
await mkdir(new URL('../dist/vendor/three/', import.meta.url), { recursive: true });
await mkdir(new URL('../dist/vendor/cubejs/', import.meta.url), { recursive: true });
await copyFile(new URL('../vendor/three/LICENSE', import.meta.url), new URL('../dist/vendor/three/LICENSE', import.meta.url));
await copyFile(new URL('../vendor/cubejs/LICENSE', import.meta.url), new URL('../dist/vendor/cubejs/LICENSE', import.meta.url));
for (const name of ['README.md', 'SOURCES.md']) {
  await copyFile(new URL(`../${name}`, import.meta.url), new URL(`../dist/${name}`, import.meta.url));
}
