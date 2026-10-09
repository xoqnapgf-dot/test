// Design tokens. Five ledgers, five colours; everything else is ink, paper and one warning red.
export const C = {
  bg: '#0a0c10',
  ink: '#e9e4d8', // primary text (warm paper white)
  dim: 'rgba(233,228,216,0.68)',
  faint: 'rgba(233,228,216,0.24)',
  grid: 'rgba(233,228,216,0.07)',
  warn: '#ff4d5e',
  ok: '#7fe0a8',
};
// ledger colours (sRGB for canvas)
export const LEDGER = [
  { key: 'strength', name: '强度', unit: 'MPa', col: '#5cc8e8' },
  { key: 'frag', name: '破碎比能', unit: 'J/cc', col: '#f2a43c' },
  { key: 'phase', name: '相变能量', unit: 'J/cc', col: '#ff6a45' },
  { key: 'gbe', name: '引力束缚能', unit: 'J', col: '#a98bff' },
  { key: 'flux', name: '持续通量', unit: 'W/m²', col: '#ecd35f' },
];
export const rgba = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
