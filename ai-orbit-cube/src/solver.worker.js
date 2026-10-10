import CubeState from '../vendor/cubejs/index.js';
import { solveExactly } from './solver.js';

let initialized = false;

try {
  CubeState.initSolver();
  initialized = true;
  self.postMessage({ type: 'ready' });
} catch (error) {
  self.postMessage({ type: 'initialization-error', message: error?.message ?? String(error) });
}

self.addEventListener('message', (event) => {
  const { id, state } = event.data ?? {};
  if (event.data?.type !== 'solve') return;
  if (!initialized) {
    self.postMessage({ type: 'solve-error', id, message: 'The solver tables did not initialize.' });
    return;
  }
  try {
    const algorithm = solveExactly(state);
    self.postMessage({ type: 'solution', id, algorithm });
  } catch (error) {
    self.postMessage({ type: 'solve-error', id, message: error?.message ?? String(error) });
  }
});
