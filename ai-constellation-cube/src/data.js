export const TRAIT_NAMES = [
  '推演', '感知', '执行', '记忆', '连接', '适配',
];

export const BRANDS = [
  {
    id: 'gpt',
    name: 'OpenAI / GPT',
    family: 'GPT',
    colors: { tile: '#3e887d', shade: '#285d57', accent: '#b6c8a7', light: '#d6d9c1' },
    weights: [0.27, 0.12, 0.25, 0.10, 0.18, 0.08],
    mechanism: 'relay',
    flourish: 'relay',
  },
  {
    id: 'claude',
    name: 'Anthropic / Claude',
    family: 'Claude',
    colors: { tile: '#b17458', shade: '#794b3b', accent: '#e2c09a', light: '#e9d8ba' },
    weights: [0.22, 0.07, 0.16, 0.25, 0.20, 0.10],
    mechanism: 'weave',
    flourish: 'weave',
  },
  {
    id: 'gemini',
    name: 'Google / Gemini',
    family: 'Gemini',
    colors: { tile: '#687ca7', shade: '#455578', accent: '#d7bd82', light: '#d1d6d4' },
    weights: [0.17, 0.28, 0.14, 0.10, 0.22, 0.09],
    mechanism: 'observatory',
    flourish: 'observatory',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    family: 'DeepSeek',
    colors: { tile: '#47818b', shade: '#305b62', accent: '#b2c9bd', light: '#d0d9c8' },
    weights: [0.35, 0.08, 0.20, 0.16, 0.08, 0.13],
    mechanism: 'stream',
    flourish: 'stream',
  },
  {
    id: 'qwen',
    name: 'Alibaba / Qwen',
    family: 'Qwen',
    colors: { tile: '#7c9162', shade: '#536444', accent: '#d5ae6c', light: '#d8d3b0' },
    weights: [0.12, 0.16, 0.20, 0.12, 0.16, 0.24],
    mechanism: 'market',
    flourish: 'market',
  },
  {
    id: 'glm',
    name: 'Z.ai / GLM',
    family: 'GLM',
    colors: { tile: '#856f8f', shade: '#5a4e65', accent: '#c5ae92', light: '#d6cbb5' },
    weights: [0.25, 0.08, 0.25, 0.16, 0.18, 0.08],
    mechanism: 'workshop',
    flourish: 'workshop',
  },
];

const entries = [
  ['gpt', '意图拆解', 'intent-split', 'branch', [0.90, 0.12, 0.65, 0.55, 0.65, 0.35]],
  ['gpt', '代码构筑', 'code-build', 'bracket', [0.55, 0.05, 0.95, 0.35, 0.45, 0.55]],
  ['gpt', '工具编排', 'tool-orchestration', 'gear', [0.60, 0.25, 0.95, 0.40, 0.90, 0.65]],
  ['gpt', '视觉定位', 'visual-grounding', 'eye', [0.45, 0.95, 0.45, 0.20, 0.45, 0.50]],
  ['gpt', '语音往返', 'voice-roundtrip', 'wave', [0.35, 0.90, 0.40, 0.25, 0.80, 0.75]],
  ['gpt', '长文记忆', 'long-context', 'stack', [0.60, 0.20, 0.35, 0.95, 0.60, 0.40]],
  ['gpt', '格式约束', 'structured-format', 'grid', [0.55, 0.10, 0.65, 0.60, 0.45, 0.30]],
  ['gpt', '资料汇总', 'source-synthesis', 'link', [0.80, 0.50, 0.50, 0.70, 0.95, 0.40]],
  ['gpt', '创意变体', 'creative-variants', 'ribbon', [0.70, 0.45, 0.55, 0.35, 0.55, 0.95]],

  ['claude', '长卷压缩', 'long-document-synthesis', 'pages', [0.80, 0.20, 0.35, 0.95, 0.70, 0.35]],
  ['claude', '条件守恒', 'constraint-keeping', 'frame', [0.75, 0.10, 0.40, 0.65, 0.65, 0.20]],
  ['claude', '代码修整', 'code-refactor', 'scissors', [0.75, 0.15, 0.90, 0.55, 0.40, 0.45]],
  ['claude', '界面代办', 'computer-use', 'cursor', [0.50, 0.85, 0.80, 0.35, 0.55, 0.55]],
  ['claude', '不确定标注', 'uncertainty-marking', 'question', [0.65, 0.25, 0.45, 0.60, 0.60, 0.35]],
  ['claude', '跨语写作', 'multilingual-writing', 'script', [0.65, 0.75, 0.40, 0.40, 0.75, 0.80]],
  ['claude', '会话续接', 'context-continuity', 'loop', [0.60, 0.15, 0.40, 0.95, 0.75, 0.45]],
  ['claude', '安全分流', 'safety-routing', 'fork', [0.55, 0.10, 0.50, 0.40, 0.75, 0.30]],
  ['claude', '图文互读', 'image-text-reading', 'layers', [0.55, 0.95, 0.40, 0.35, 0.70, 0.45]],

  ['gemini', '多模态融合', 'multimodal-fusion', 'prism', [0.55, 0.95, 0.45, 0.45, 0.85, 0.65]],
  ['gemini', '检索锚定', 'search-grounding', 'pin', [0.65, 0.40, 0.45, 0.55, 0.95, 0.40]],
  ['gemini', '实时转写', 'live-transcription', 'wave-grid', [0.40, 0.90, 0.50, 0.30, 0.75, 0.75]],
  ['gemini', '协作空间', 'collaboration-space', 'shared-grid', [0.45, 0.45, 0.70, 0.65, 0.90, 0.70]],
  ['gemini', '符号求解', 'symbol-solving', 'equation', [0.90, 0.35, 0.75, 0.50, 0.50, 0.40]],
  ['gemini', '视频时序', 'video-timeline', 'frames', [0.50, 0.95, 0.45, 0.50, 0.60, 0.65]],
  ['gemini', '地理关联', 'geospatial-linking', 'compass', [0.40, 0.90, 0.55, 0.45, 0.85, 0.60]],
  ['gemini', '端侧感知', 'on-device-sensing', 'small-eye', [0.35, 0.75, 0.55, 0.30, 0.40, 0.80]],
  ['gemini', '并行代理', 'parallel-agents', 'orbit', [0.75, 0.30, 0.90, 0.55, 0.85, 0.65]],

  ['deepseek', '专家路由', 'expert-routing', 'switch', [0.75, 0.30, 0.90, 0.45, 0.60, 0.55]],
  ['deepseek', '递进推演', 'progressive-reasoning', 'steps', [0.98, 0.10, 0.35, 0.80, 0.55, 0.30]],
  ['deepseek', '程序合成', 'program-synthesis', 'brackets', [0.70, 0.15, 0.95, 0.45, 0.55, 0.45]],
  ['deepseek', '数值演算', 'numeric-calculation', 'abacus', [0.95, 0.10, 0.65, 0.40, 0.30, 0.20]],
  ['deepseek', '超长规划', 'long-horizon-planning', 'route', [0.85, 0.15, 0.70, 0.85, 0.65, 0.35]],
  ['deepseek', '中英切换', 'zh-en-switching', 'translate', [0.45, 0.80, 0.35, 0.45, 0.60, 0.95]],
  ['deepseek', '离线部署', 'local-deployment', 'server', [0.35, 0.10, 0.70, 0.55, 0.45, 0.80]],
  ['deepseek', '算力配额', 'compute-budget', 'meter', [0.40, 0.10, 0.85, 0.50, 0.65, 0.70]],
  ['deepseek', '自检回退', 'self-check-rollback', 'rewind', [0.90, 0.15, 0.55, 0.60, 0.70, 0.45]],

  ['qwen', '权重改造', 'weight-customization', 'custom-block', [0.45, 0.20, 0.75, 0.40, 0.55, 0.95]],
  ['qwen', '语音图像协同', 'speech-image-coordination', 'sound-eye', [0.45, 0.95, 0.50, 0.40, 0.80, 0.75]],
  ['qwen', '多语切换', 'multilingual-switching', 'language-bridge', [0.40, 0.75, 0.35, 0.40, 0.75, 0.90]],
  ['qwen', '函数调度', 'function-dispatch', 'function-node', [0.50, 0.20, 0.95, 0.45, 0.90, 0.65]],
  ['qwen', '长文索引', 'long-document-index', 'index-pages', [0.60, 0.35, 0.40, 0.90, 0.65, 0.45]],
  ['qwen', '表格抽取', 'table-extraction', 'table', [0.55, 0.95, 0.60, 0.55, 0.45, 0.40]],
  ['qwen', '界面构想', 'interface-ideation', 'layout', [0.55, 0.90, 0.80, 0.35, 0.70, 0.70]],
  ['qwen', '尺寸伸缩', 'scale-adaptation', 'nested-boxes', [0.35, 0.20, 0.75, 0.45, 0.65, 0.90]],
  ['qwen', '行业适配', 'industry-adaptation', 'modules', [0.50, 0.40, 0.75, 0.65, 0.70, 0.95]],

  ['glm', '终端编码', 'terminal-coding', 'terminal', [0.70, 0.20, 0.98, 0.55, 0.55, 0.45]],
  ['glm', '跨程记忆', 'cross-run-memory', 'memory-rail', [0.70, 0.25, 0.45, 0.95, 0.65, 0.40]],
  ['glm', '请求节流', 'request-shaping', 'valve', [0.40, 0.10, 0.80, 0.50, 0.65, 0.55]],
  ['glm', '视频语义', 'video-semantics', 'film-meaning', [0.50, 0.95, 0.45, 0.50, 0.65, 0.60]],
  ['glm', '因果梳理', 'causal-ordering', 'cause-chain', [0.95, 0.20, 0.55, 0.75, 0.65, 0.35]],
  ['glm', '缓存复用', 'cache-reuse', 'cache-stack', [0.45, 0.15, 0.80, 0.95, 0.70, 0.50]],
  ['glm', 'API 签名', 'api-signature', 'endpoint', [0.50, 0.20, 0.90, 0.55, 0.95, 0.35]],
  ['glm', '本地托管', 'local-hosting', 'home-server', [0.30, 0.10, 0.70, 0.55, 0.45, 0.80]],
  ['glm', '工作流回环', 'workflow-loop', 'cycle-check', [0.80, 0.25, 0.95, 0.75, 0.85, 0.60]],
];

export const ABILITIES = entries.map(([brandId, name, id, glyph, traits], index) => ({
  id,
  brandId,
  name,
  glyph,
  traits,
  indexInBrand: index % 9,
  globalIndex: index,
}));

export const BRAND_BY_ID = Object.fromEntries(BRANDS.map((brand) => [brand.id, brand]));
export const ABILITY_BY_ID = Object.fromEntries(ABILITIES.map((ability) => [ability.id, ability]));

// Canonical face identity for the solved cube; local normals stay on the stickers.
export const ORIGINAL_FACE_BY_NORMAL = {
  '1,0,0': 'gpt',
  '-1,0,0': 'claude',
  '0,1,0': 'gemini',
  '0,-1,0': 'deepseek',
  '0,0,1': 'qwen',
  '0,0,-1': 'glm',
};

export const BRAND_FACE_NORMAL = {
  gpt: [1, 0, 0],
  claude: [-1, 0, 0],
  gemini: [0, 1, 0],
  deepseek: [0, -1, 0],
  qwen: [0, 0, 1],
  glm: [0, 0, -1],
};

// The right/up axes define how each face's 3x3 grid is read from outside.
export const FACE_BASIS = {
  '1,0,0': { right: [0, 0, -1], up: [0, 1, 0] },
  '-1,0,0': { right: [0, 0, 1], up: [0, 1, 0] },
  '0,1,0': { right: [1, 0, 0], up: [0, 0, -1] },
  '0,-1,0': { right: [1, 0, 0], up: [0, 0, 1] },
  '0,0,1': { right: [1, 0, 0], up: [0, 1, 0] },
  '0,0,-1': { right: [-1, 0, 0], up: [0, 1, 0] },
};
