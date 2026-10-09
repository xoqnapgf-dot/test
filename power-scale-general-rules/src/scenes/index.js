// Chapter registry, in playback order.
import { SCENES } from '../core/time.js';
import { makeScene } from './base.js';
import * as open from './open.js';
import * as use from './use.js';
import * as scope from './scope.js';
import * as steps from './steps.js';
import * as long from './long.js';
import * as r01 from './r01.js';
import * as r02 from './r02.js';
import * as r03 from './r03.js';

const DONE = { open, use, scope, steps, long, r01, r02, r03 };

function placeholder(id) {
  return {
    id,
    build() {
      const sc = makeScene(id, 'paper');
      sc.draw = (g) => g.text(id, 960, 540, { kind: 'serif', size: 80, align: 'center', color: 'ink3' });
      return sc;
    },
  };
}
export const SCENE_LIST = SCENES.map((s) => (DONE[s.id] ? { id: s.id, build: DONE[s.id].build } : placeholder(s.id)));
