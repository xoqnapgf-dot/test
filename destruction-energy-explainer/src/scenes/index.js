// Scene registry (narration section id → class) and the transitions into each section.
// Transition types (post.js): 0 crossfade · 1 blade · 2 ink · 3 flash · 4 iris · 5 shutter · 6 glitch
import { Cold } from './cold.js';
import { Five } from './five.js';
import { Axes } from './axes.js';
import { Frag } from './frag.js';
import { Strength } from './strength.js';
import { Phase } from './phase.js';
import { Gbe } from './gbe.js';
import { Bound } from './bound.js';
import { Meteor } from './meteor.js';
import { Gbu } from './gbu.js';
import { Tools } from './tools.js';
import { Flux } from './flux.js';
import { End } from './end.js';

export const SCENE_CLASSES = {
  cold: Cold, five: Five, axes: Axes, frag: Frag, strength: Strength, phase: Phase, gbe: Gbe,
  bound: Bound, meteor: Meteor, gbu: Gbu, tools: Tools, flux: Flux, end: End,
};

export const TRANSITIONS = {
  five: { type: 0, pre: 0.5, post: 0.7 },
  axes: { type: 2, pre: 0.6, post: 0.9 },
  frag: { type: 5, pre: 0.4, post: 0.6 },
  strength: { type: 1, pre: 0.3, post: 0.6, angle: 1.9 },
  phase: { type: 2, pre: 0.6, post: 0.9 },
  gbe: { type: 4, pre: 0.6, post: 0.8 },
  bound: { type: 0, pre: 0.6, post: 0.8 },
  meteor: { type: 1, pre: 0.3, post: 0.6, angle: 0.6 },
  gbu: { type: 6, pre: 0.3, post: 0.5 },
  tools: { type: 5, pre: 0.4, post: 0.6 },
  flux: { type: 4, pre: 0.6, post: 0.8 },
  end: { type: 2, pre: 0.7, post: 1.0 },
};
