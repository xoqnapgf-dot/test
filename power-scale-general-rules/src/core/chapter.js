// Chapter card drawn over the first seconds of each chapter (before its first line).
import { smooth, ease, clamp } from './util.js';
import { W, H, withAlpha } from './draw2d.js';

export function drawChapterCard(g, sc, t) {
  const s = sc.c.s;
  if (!s || s.id === 'open') return;
  const t0 = s.t0;
  const t1 = s.lines[0].t0;
  const lt = t - t0;
  const dur = t1 - t0;
  if (lt < 0 || lt > dur + 0.3) return;
  const inK = smooth((lt - 0.35) / 0.9);
  const outK = smooth((lt - (dur - 0.75)) / 0.85);
  const a = inK * (1 - outK);
  if (a <= 0.002) return;
  const [num0, name] = s.title;
  const CN = { 一: '01', 二: '02', 三: '03', 四: '04', 五: '05', 终: '终' };
  const num = CN[num0] || num0;
  const isRule = /^0\./.test(num);
  const cx = W / 2;
  const cy = H / 2 - 20;
  const c = g.x;
  // legibility wash
  const wash = c.createRadialGradient(cx, cy, 0, cx, cy, 720);
  const bg = g.p.bg;
  wash.addColorStop(0, withAlpha(bg, 0.82 * a));
  wash.addColorStop(0.55, withAlpha(bg, 0.55 * a));
  wash.addColorStop(1, withAlpha(bg, 0));
  c.fillStyle = wash;
  c.fillRect(0, 0, W, H);
  const drift = -outK * 26;
  g.text(isRule ? '第零部分 · 判定通则' : '战力量级体系', cx, cy - 150 + drift, { kind: 'serif', size: 26, weight: 500, color: 'ink3', align: 'center', alpha: a, track: 10 * (1 + outK) });
  g.text(num, cx, cy + 10 + drift, {
    kind: isRule || /^\d/.test(num) ? 'math' : 'serif',
    size: isRule ? 150 : 140,
    weight: 600,
    color: 'gold',
    align: 'center',
    alpha: a,
    reveal: ease.out3((lt - 0.3) / 1.0),
    rise: 30,
    glow: 24,
    track: 4,
  });
  const rw = 380 * ease.inOut3((lt - 0.7) / 1.0);
  g.seg(cx - rw, cy + 52 + drift, cx + rw, cy + 52 + drift, { color: 'gold', w: 1.5, alpha: a * 0.8 });
  g.circle(cx, cy + 52 + drift, 4, { fill: 'gold', alpha: a * smooth((lt - 1.2) / 0.4) });
  g.text(name, cx, cy + 130 + drift, { kind: 'serif', size: 64, weight: 700, color: 'ink', align: 'center', alpha: a, reveal: ease.out2((lt - 0.95) / 1.1), rise: 16, track: 6 });
}
