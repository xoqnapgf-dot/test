import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

test('the local entry and runtime assets use only relative paths', () => {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  assert.match(html, /href="\.\/assets\/style\.css"/);
  assert.match(html, /src="\.\/app\.bundle\.js"/);
  assert.ok(existsSync(join(root, 'assets/style.css')));
  assert.ok(existsSync(join(root, 'app.bundle.js')));

  const runtimeFiles = [
    'index.html',
    'assets/style.css',
    ...['src/data.js', 'src/cube-state.js', 'src/cube-view.js', 'src/glyphs.js', 'src/world-model.js', 'src/worlds.js', 'src/layout.js', 'src/main.js'],
  ];
  for (const relativePath of runtimeFiles) {
    const content = readFileSync(join(root, relativePath), 'utf8');
    assert.doesNotMatch(content, /https?:\/\//i, `${relativePath} must not reference a remote asset`);
  }
});
