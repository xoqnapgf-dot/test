// The edit: which scene plays when, and how shots hand over to each other.
// tin = transition into the shot: {type, pre, post, angle}
//   types: 0 crossfade · 1 blade slash · 2 ink bleed · 3 white flash · 4 iris · 5 shutter · 6 glitch
import { SEC } from './core/music.js';
import { Chorus } from './scenes/chorus.js';
import { Intro } from './scenes/intro.js';
import { Emaki } from './scenes/emaki.js';
import { Pre } from './scenes/pre.js';
import { Post } from './scenes/post.js';
import { Verse2 } from './scenes/verse2.js';
import { Rope } from './scenes/rope.js';
import { Solo } from './scenes/solo.js';
import { Bridge } from './scenes/bridge.js';
import { Outro } from './scenes/outro.js';

const S = (k) => SEC[k][0];
export const SHOTS = [
  { scene: 'intro', t0: 0 },
  { scene: 'emaki', t0: S('v1'), tin: { type: 3, pre: 0.3, post: 0.45 } },
  { scene: 'pre', t0: S('pre1'), tin: { type: 5, pre: 0.0, post: 0.42 } },
  { scene: 'chorus', t0: S('ch1'), tin: { type: 3, pre: 0.08, post: 0.3 } },
  { scene: 'post', t0: S('post'), tin: { type: 1, pre: 0.05, post: 0.5, angle: 0.42 } },
  { scene: 'verse2', t0: S('v2'), tin: { type: 6, pre: 0.12, post: 0.22 } },
  { scene: 'pre', t0: S('pre2'), tin: { type: 5, pre: 0.0, post: 0.42 } },
  { scene: 'chorus', t0: S('ch2'), tin: { type: 3, pre: 0.08, post: 0.3 } },
  { scene: 'rope', t0: S('inter'), tin: { type: 1, pre: 0.05, post: 0.6, angle: -0.35 } },
  { scene: 'solo', t0: S('solo'), tin: { type: 4, pre: 0.1, post: 0.5 } },
  { scene: 'bridge', t0: S('bridge'), tin: { type: 0, pre: 0.0, post: 0.12 } },
  { scene: 'chorus', t0: S('fc'), tin: { type: 3, pre: 0.04, post: 0.35 } },
  { scene: 'outro', t0: S('outro'), tin: { type: 2, pre: 0.2, post: 1.1 } },
];
for (let i = 0; i < SHOTS.length; i++) SHOTS[i].t1 = SHOTS[i + 1] ? SHOTS[i + 1].t0 : 999;

export const SCENES = {
  intro: Intro,
  emaki: Emaki,
  pre: Pre,
  chorus: Chorus,
  post: Post,
  verse2: Verse2,
  rope: Rope,
  solo: Solo,
  bridge: Bridge,
  outro: Outro,
};
