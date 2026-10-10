const NOTATION = {
  U: { axis: 'y', layer: 1, direction: -1 },
  R: { axis: 'x', layer: 1, direction: -1 },
  F: { axis: 'z', layer: 1, direction: -1 },
  D: { axis: 'y', layer: -1, direction: 1 },
  L: { axis: 'x', layer: -1, direction: 1 },
  B: { axis: 'z', layer: -1, direction: 1 },
  M: { axis: 'x', layer: 0, direction: 1 },
  E: { axis: 'y', layer: 0, direction: 1 },
  S: { axis: 'z', layer: 0, direction: -1 },
  x: { axis: 'x', layer: null, direction: -1 },
  y: { axis: 'y', layer: null, direction: -1 },
  z: { axis: 'z', layer: null, direction: -1 },
};

const AXES = ['x', 'y', 'z'];

export function parseMove(token) {
  const match = /^([URFDLBMESxyz])([2']?)$/.exec(token);
  if (!match) throw new Error(`Unsupported cube move: ${token}`);
  const [, face, suffix] = match;
  const move = NOTATION[face];
  const direction = suffix === "'" ? -move.direction : move.direction;
  const quarters = suffix === '2' ? 2 : 1;
  return {
    token,
    axis: move.axis,
    layer: move.layer,
    direction,
    quarters,
    radians: direction * quarters * Math.PI / 2,
    whole: move.layer === null,
  };
}

export function parseAlgorithm(algorithm = '') {
  return algorithm.trim() ? algorithm.trim().split(/\s+/).map(parseMove) : [];
}

export function invertMove(token) {
  parseMove(token);
  if (token.endsWith('2')) return token;
  return token.endsWith("'") ? token.slice(0, -1) : `${token}'`;
}

export function inverseAlgorithm(algorithm = '') {
  return parseAlgorithm(algorithm).reverse().map((move) => invertMove(move.token)).join(' ');
}

export function physicalTurnToNotation(axis, layer, signedQuarters) {
  if (!AXES.includes(axis) || !Number.isInteger(signedQuarters) || signedQuarters === 0 || Math.abs(signedQuarters) > 2) {
    throw new Error(`Invalid physical turn: ${axis}/${layer}/${signedQuarters}`);
  }
  const move = Object.entries(NOTATION).find(([, candidate]) => candidate.axis === axis && candidate.layer === layer);
  if (!move) throw new Error(`No notation mapping for ${axis} layer ${layer} (${signedQuarters} quarter turn)`);
  const [face, base] = move;
  if (Math.abs(signedQuarters) === 2) return `${face}2`;
  return Math.sign(signedQuarters) === base.direction ? face : `${face}'`;
}

export function rotateGridVector(vector, axis, signedQuarters = 1) {
  const result = [...vector];
  const axisIndex = AXES.indexOf(axis);
  if (axisIndex < 0) throw new Error(`Unknown axis: ${axis}`);
  const turns = ((signedQuarters % 4) + 4) % 4;
  for (let turn = 0; turn < turns; turn += 1) {
    const [x, y, z] = result;
    if (axis === 'x') result.splice(0, 3, x, -z, y);
    if (axis === 'y') result.splice(0, 3, z, y, -x);
    if (axis === 'z') result.splice(0, 3, -y, x, z);
  }
  return result;
}

export { NOTATION };
