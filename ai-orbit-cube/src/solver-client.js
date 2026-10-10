import SolverWorker from './solver.worker.js?worker&inline';

export class SolverClient {
  constructor(onReady = () => {}) {
    this.onReady = onReady;
    this.worker = new SolverWorker();
    this.nextId = 1;
    this.pending = new Map();
    this.ready = false;
    this.failed = null;
    this.readyPromise = new Promise((resolve, reject) => {
      this.resolveReady = resolve;
      this.rejectReady = reject;
    });
    this.worker.addEventListener('message', (event) => this.handleMessage(event.data));
    this.worker.addEventListener('error', (event) => {
      const error = new Error(event.message || 'The solver worker failed to load.');
      this.failed = error;
      this.rejectReady(error);
      for (const job of this.pending.values()) job.reject(error);
      this.pending.clear();
    });
  }

  handleMessage(message) {
    if (message.type === 'ready') {
      this.ready = true;
      this.resolveReady();
      this.onReady(true);
      return;
    }
    if (message.type === 'initialization-error') {
      const error = new Error(message.message || 'Solver initialization failed.');
      this.failed = error;
      this.rejectReady(error);
      this.onReady(false, error);
      return;
    }
    const job = this.pending.get(message.id);
    if (!job) return;
    this.pending.delete(message.id);
    if (message.type === 'solution') job.resolve(message.algorithm);
    else job.reject(new Error(message.message || 'The solver could not produce a verified solution.'));
  }

  async solve(state) {
    await this.readyPromise;
    if (this.failed) throw this.failed;
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.worker.postMessage({ type: 'solve', id, state });
    });
  }

  dispose() {
    this.worker.terminate();
    const error = new Error('The solver worker was closed.');
    for (const job of this.pending.values()) job.reject(error);
    this.pending.clear();
  }
}
