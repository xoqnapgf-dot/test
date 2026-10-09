// Chapter registry, in playback order (ids match tools/script.json).
import { SCENES } from '../core/time.js';
import * as open from './open.js';
import * as use from './use.js';
import * as scope from './scope.js';
import * as steps from './steps.js';
import * as long from './long.js';
import * as r01 from './r01.js';
import * as r02 from './r02.js';
import * as r03 from './r03.js';
import * as r06 from './r06.js';
import * as r07 from './r07.js';
import * as r10 from './r10.js';
import * as r11 from './r11.js';
import * as r12 from './r12.js';
import * as r13 from './r13.js';
import * as r14 from './r14.js';
import * as r15 from './r15.js';
import * as multi from './multi.js';
import * as r16 from './r16.js';
import * as end from './end.js';

const MODS = { open, use, scope, steps, long, r01, r02, r03, r06, r07, r10, r11, r12, r13, r14, r15, multi, r16, end };
export const SCENE_LIST = SCENES.map((s) => ({ id: s.id, build: MODS[s.id].build }));
