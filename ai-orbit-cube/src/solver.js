import CubeState from '../vendor/cubejs/index.js';

export function solveExactly(state) {
  const original = state instanceof CubeState ? state.clone() : new CubeState(state);
  const upright = original.clone().upright();
  const solution = original.solve();
  const algorithm = [solution, upright].filter(Boolean).join(' ').trim();
  const solved = original.clone();
  if (algorithm) solved.move(algorithm);
  const canonical = new CubeState();
  if (solved.asString() !== canonical.asString()) {
    throw new Error('The generated solution did not restore the exact canonical facelet orientation.');
  }
  return algorithm;
}

export function verifyExactRestoration(state, algorithm) {
  const original = state instanceof CubeState ? state.clone() : new CubeState(state);
  const candidate = original.clone();
  if (algorithm) candidate.move(algorithm);
  return candidate.asString() === new CubeState().asString();
}
