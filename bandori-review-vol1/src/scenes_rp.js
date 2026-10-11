// ─── scenes: 萝团, Pastel*Palettes, 结尾 ──────────────────────────────────────

function petal(c, x, y, s, rot, color) {
  c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = color; c.beginPath();
  c.moveTo(0, -s); c.bezierCurveTo(s * 0.9, -s * 0.6, s * 0.7, s * 0.7, 0, s); c.bezierCurveTo(-s * 0.7, s * 0.7, -s * 0.9, -s * 0.6, 0, -s); c.fill(); c.restore();
}
// dial gauge (0..1), needle eased
function dial(c, x, y, r, v, label, t) {
  c.save(); c.translate(x, y);
  c.lineWidth = r * 0.16; c.lineCap = 'round';
  [['#3fd18b', -Math.PI, -Math.PI * 0.62], ['#ffd36b', -Math.PI * 0.62, -Math.PI * 0.34], ['#ff4058', -Math.PI * 0.34, 0]].forEach(([col, a0, a1]) => { c.strokeStyle = col; c.beginPath(); c.arc(0, 0, r, a0 + 0.04, a1 - 0.04); c.stroke(); });
  const a = -Math.PI + v * Math.PI + Math.sin(t * 30) * 0.02 * v;
  c.strokeStyle = '#fff'; c.lineWidth = 12; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85); c.stroke();
  c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, 22, 0, TAU); c.fill();
  txt(c, label, 0, 70, { size: 48, fam: F.black, color: '#fff' });
  c.restore();
}

SCENES.roselia = (c, t, S) => {
  bg(c, t, '#1b1840', '#3a1d5c', { blobs: [[300, 500, 600, 'rgba(120,90,255,.25)'], [800, 1300, 600, 'rgba(60,140,255,.2)']], dots: 'rgba(255,255,255,.05)' });
  particles(c, t, 26, 31, (a, b, d, e, i) => { const sp = 60 + d * 70, life = (H + 200) / sp, tt = (t + e * life) % life; petal(c, a * W + Math.sin(tt + i) * 50, -100 + tt * sp, 16 + b * 14, tt * (0.6 + d), hexA(i % 2 ? '#6a5cff' : '#3b2a9a', 0.55)); });
  img(c, 'logo5', 540, 350, 150, { alpha: ez(t, S.t0, 0.5) * (1 - ez(t, S.L(5) - 0.2, 0.5)) });
  // line 0: 好感 scale
  const k0 = live(t, S.t0 + 0.1, S.L(2), 0.5, 0.4);
  if (k0 > 0) {
    c.save(); c.globalAlpha *= k0; const x0 = 140, x1 = 940, y = 620;
    const g = c.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, '#ff7aa8'); g.addColorStop(0.5, '#9a96b8'); g.addColorStop(1, '#3a3a5a');
    c.fillStyle = g; rrect(c, x0, y - 22, x1 - x0, 44, 22); c.fill();
    [['喜欢', 0], ['无感', 0.5], ['抵触', 1]].forEach(([s, p]) => txt(c, s, lerp(x0, x1, p), y + 80, { size: 44, fam: F.black, color: '#fff' }));
    const v = lerp(0.1, 0.5, ez(t, S.at(0, '无感'), 0.6)) + 0.2 * ez(t, S.at(0, '抵触'), 0.6);
    const px = lerp(x0, x1, v); c.fillStyle = '#fff'; c.beginPath(); c.moveTo(px, y - 34); c.lineTo(px - 24, y - 80); c.lineTo(px + 24, y - 80); c.closePath(); c.fill();
    txt(c, '我的感受', px, y - 120, { size: 38, fam: F.bold, color: '#fff' });
    c.restore();
    // line 1: pressure dial
    const k1 = ez(t, S.L(1) - 0.2, 0.5);
    if (k1 > 0) { c.save(); c.globalAlpha *= k1; dial(c, 540, 1060, 230, lerp(0.15, 0.93, ez(t, S.at(1, '高压'), 0.8, ease.back)), '团内气压', t); c.restore(); if (t > S.at(1, '高压')) chip(c, '高压', 800, 880, { size: 54, bg: '#ff4058', color: '#fff', scale: pop(t, S.at(1, '高压')), rot: 0.1 }); }
  }
  // lines 2–4: ykn & sayo
  const kY = live(t, S.L(2) - 0.2, S.L(5) - 0.1, 0.5, 0.4);
  if (kY > 0) {
    c.save(); c.globalAlpha *= kY;
    chara(c, 'ykn', 330, 560, 1050, { filter: 'saturate(.8)' }); chara(c, 'sayo', 770, 600, 1050, { filter: 'saturate(.8)' });
    chip(c, '凑友希那 · ykn', 300, 940, { size: 40, bg: '#881188', color: '#fff' }); chip(c, '冰川纱夜 · sayo', 780, 940, { size: 40, bg: '#00aabb', color: '#fff' });
    if (t > S.at(2, '不喜欢') - 0.1) chip(c, '个人口味 · 不太合', 540, 1060, { size: 54, bg: '#fff', color: '#3a1d5c', scale: pop(t, S.at(2, '不喜欢') - 0.1) });
    // line 3: 友善 ✓ 细心 ✓ / 人设 ≠ 我的菜
    const k3 = live(t, S.L(3), S.L(4) + 0.2, 0.3, 0.3);
    if (k3 > 0) {
      [['友善', S.at(3, '友善')], ['细心', S.at(3, '细心')]].forEach(([w, ta], i) => {
        const x = 200 + i * 270; chip(c, w + '    ', x, 1200, { size: 48, bg: '#fff', color: '#3a1d5c', scale: pop(t, ta), alpha: t > ta ? k3 : 0 });
        if (t > ta) check(c, x + 60, 1200, 50, ez(t, ta + 0.1, 0.3));
      });
      if (t > S.at(3, '人设')) chip(c, '人设 ≠ 我的菜', 800, 1200, { size: 48, bg: '#ff7aa8', color: '#fff', scale: pop(t, S.at(3, '人设')), alpha: k3, rot: 0.05 });
    }
    // line 4: 友情+爱好 vs 目标+实力
    const k4 = ez(t, S.L(4) - 0.1, 0.4);
    if (k4 > 0) {
      c.fillStyle = 'rgba(10,8,30,.75)'; c.fillRect(0, 1090, W, 260 * k4);
      chip(c, '友情 + 爱好', 290, 1220, { size: 58, bg: '#ff7aa8', color: '#fff', scale: ease.back(k4) * (1 + Math.sin(t * 5) * 0.03) });
      chip(c, '目标 + 实力', 790, 1220, { size: 58, bg: '#4a4a7a', color: '#ddd', scale: ease.back(k4) });
      c.fillStyle = '#ff5c8a'; heart(c, 290, 1110 + Math.sin(t * 4) * 8, 46 * ez(t, S.at(4, '友情'), 0.4, ease.back)); c.fill();
      txt(c, '更偏爱 ←', 540, 1220, { size: 40, fam: F.bold, color: '#fff', alpha: ez(t, S.at(4, '偏爱'), 0.3) });
    }
    c.restore();
  }
  // lines 5–7: lisa = 初华 Plus
  const kL = ez(t, S.L(5) - 0.2, 0.6);
  if (kL > 0) {
    c.save(); c.globalAlpha *= kL;
    chara(c, 'lisa', 690, 560, 1350, {});
    chip(c, '今井莉莎 · lisa', 760, 300, { size: 46, bg: '#dd2200', color: '#fff', scale: ease.back(kL) });
    // 初华 card → upgrade
    const kU = ez(t, S.at(5, '强化版') - 0.2, 0.5, ease.back);
    if (kU > 0) withT(c, 230, 700, -0.06, kU, () => {
      c.fillStyle = '#fff6dc'; rrect(c, -150, -190, 300, 380, 24); c.fill(); c.strokeStyle = '#d9a63a'; c.lineWidth = 8; c.stroke();
      txt(c, '三角初华', 0, -110, { size: 48, fam: F.black, color: '#3a2a10' }); txt(c, 'Ave Mujica', 0, -55, { size: 34, fam: F.round, color: '#8a6a2a' });
      c.fillStyle = '#e8d3a0'; c.beginPath(); c.arc(0, 50, 70, 0, TAU); c.fill(); txt(c, '?', 0, 54, { size: 90, fam: F.round, color: '#fff6dc' });
      txt(c, '眼里只有祥子', 0, 150, { size: 32, fam: F.bold, color: '#8a6a2a' });
    });
    if (kU > 0) { arrowLine(c, 400, 700, 520, 700, { color: '#ffd36b', lw: 14, k: ez(t, S.at(5, '强化版'), 0.3) }); txt(c, '强化版', 460, 620, { size: 46, fam: F.punch, color: '#ffd36b', alpha: kU }); }
    // line 6: eye-line to ykn
    const k6 = live(t, S.L(6) - 0.1, S.L(7) + 0.4, 0.3, 0.4);
    if (k6 > 0) {
      img(c, st(21), 220, 1150, 220 * ease.back(k6));
      c.strokeStyle = hexA('#ff5c8a', k6); c.lineWidth = 6; c.setLineDash([16, 12]); c.lineDashOffset = -t * 60; c.beginPath(); c.moveTo(600, 470); c.quadraticCurveTo(400, 900, 260, 1060); c.stroke(); c.setLineDash([]);
      c.strokeStyle = hexA('#ff5c8a', k6); c.lineWidth = 6; const rr = 130 + Math.sin(t * 6) * 8; c.beginPath(); c.arc(220, 1150, rr, 0, TAU); c.stroke();
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; c.beginPath(); c.moveTo(220 + Math.cos(a) * (rr - 20), 1150 + Math.sin(a) * (rr - 20)); c.lineTo(220 + Math.cos(a) * (rr + 20), 1150 + Math.sin(a) * (rr + 20)); c.stroke(); }
      chip(c, '视线锁定：ykn', 330, 960, { size: 40, bg: '#ff5c8a', color: '#fff', alpha: k6, scale: pop(t, S.L(6)) });
    }
    // line 7: stat bars
    const k7 = ez(t, S.L(7) - 0.1, 0.4);
    if (k7 > 0) {
      c.fillStyle = 'rgba(10,8,30,.78)'; rrect(c, 60, 940, 960, 420, 30); c.fill();
      txt(c, '初华', 330, 990, { size: 34, fam: F.bold, color: '#ffd36b', align: 'left' }); txt(c, 'lisa', 430, 990, { size: 34, fam: F.bold, color: '#ff6a3d', align: 'left' });
      [['关心其他成员', S.at(7, '关心'), 0.45, 0.85], ['主动性', S.at(7, '主动'), 0.4, 0.9], ['对乐队上心', S.at(7, '上心'), 0.5, 0.92]].forEach(([lab, ta, a, b], i) => {
        const y = 1080 + i * 95, k = ez(t, ta - 0.1, 0.6);
        txt(c, lab, 100, y, { size: 40, fam: F.black, color: '#fff', align: 'left' });
        c.fillStyle = 'rgba(255,255,255,.15)'; rrect(c, 400, y - 30, 560, 26, 13); c.fill(); rrect(c, 400, y + 4, 560, 26, 13); c.fill();
        c.fillStyle = '#ffd36b'; rrect(c, 400, y - 30, 560 * a * k, 26, 13); c.fill();
        c.fillStyle = '#ff6a3d'; rrect(c, 400, y + 4, 560 * b * k, 26, 13); c.fill();
      });
    }
    c.restore();
  }
};

SCENES.pasupare = (c, t, S) => {
  bg(c, t, '#ffe6f2', '#b8f0e0', { blobs: [[250, 450, 600, 'rgba(255,170,210,.55)'], [850, 1300, 600, 'rgba(140,230,255,.4)']], dots: 'rgba(255,120,180,.14)', stripes: '#ff88bb', stripeAlpha: 0.05 });
  particles(c, t, 30, 44, (a, b, d) => { const s = 8 + d * 14, tw = Math.abs(Math.sin(t * (1 + d * 2) + a * 40)); star(c, a * W, 150 + b * 1250, s * tw, 4, 0.35, 0); c.fillStyle = hexA('#ffffff', 0.8 * tw); c.fill(); });
  const ink = '#7a2a55';
  // lines 0–4: band intro, loading, spelling
  const kA = live(t, S.t0 + 0.05, S.L(5) - 0.1, 0.5, 0.4);
  if (kA > 0) {
    c.save(); c.globalAlpha *= kA;
    img(c, 'logo4', 540, 420, 230 * ease.back(clamp(ez(t, S.t0 + 0.05, 0.6) * 1.1)), { alpha: 1 - ez(t, S.L(4) - 0.2, 0.4) });
    // line 1: slow loading bar
    const k1 = live(t, S.L(1) - 0.1, S.L(4), 0.3, 0.4);
    if (k1 > 0) {
      const v = t < S.L(3) ? lerp(0, 0.12, ez(t, S.L(1), 2.5)) : lerp(0.12, 1, ez(t, S.at(3, '改观') - 0.4, 1.0));
      meter(c, 140, 660, 700, '认识进度', v, '#ff88bb', { value: Math.round(v * 100) + '%', labelColor: ink, track: 'rgba(122,42,85,.15)' });
      if (t < S.L(3)) txt(c, '加载最慢 · 认识最晚', 540, 740, { size: 40, fam: F.bold, color: ink, alpha: k1 * (0.5 + 0.5 * Math.sin(t * 5)) });
    }
    // line 2–3: members with name tags (??? → names)
    const k2 = ez(t, S.L(2) - 0.1, 0.5);
    if (k2 > 0) {
      const names = ['丸山彩', '冰川日菜', '白鹭千圣', '大和麻弥', '若宫伊芙'], fixed = t > S.at(3, '改观') - 0.2;
      [16, 17, 18, 19, 20].forEach((id, i) => {
        const x = 130 + i * 205, y = 980 + (i % 2) * 40;
        img(c, st(id), x, y, 190 * ease.back(clamp(k2 * 1.3 - i * 0.08)), { filter: fixed ? undefined : 'brightness(.35) saturate(.2)' });
        const lab = fixed ? names[i] : ['？？？', '彩？', '日菜？', '？？？', '麻…弥？'][(i + Math.floor(t * 3)) % 5];
        chip(c, lab, x, y + 120, { size: 32, bg: fixed ? '#ff88bb' : '#fff', color: fixed ? '#fff' : ink, alpha: k2, scale: fixed ? pop(t, S.at(3, '改观') - 0.2 + i * 0.08) : 1 });
      });
      // spelling attempts
      const k2b = live(t, S.at(2, '乐队名') - 0.2, S.L(3) + 0.2, 0.3, 0.3);
      if (k2b > 0) {
        const tries = ['Pastel Palette', 'Pastle*Pallets', 'Pasutel*Paretto'], tt = t - S.at(2, '乐队名');
        const i = clamp(Math.floor(tt / 0.9), 0, 2), part = tries[i].slice(0, Math.floor(clamp((tt - i * 0.9) / 0.5) * tries[i].length));
        c.save(); c.globalAlpha *= k2b; c.fillStyle = '#fff'; rrect(c, 120, 1180, 840, 140, 20); c.fill(); c.strokeStyle = ink; c.lineWidth = 5; c.stroke();
        txt(c, part + (Math.floor(t * 3) % 2 ? '|' : ''), 160, 1250, { size: 64, fam: F.round, color: '#2a1846', align: 'left' });
        if (part.length === tries[i].length) { c.strokeStyle = '#ff3344'; c.lineWidth = 5; c.beginPath(); const w = measure(c, part, 64, F.round); for (let x = 0; x < w; x += 16) c.lineTo(160 + x, 1290 + (x / 16 % 2 ? 6 : -2)); c.stroke(); }
        chip(c, '拼写错误 ×' + (i + 1), 820, 1150, { size: 36, bg: '#ff3344', color: '#fff', rot: 0.08 });
        c.restore();
      }
    }
    // line 4: band logos fanned
    const k4 = ez(t, S.L(4) - 0.1, 0.5);
    if (k4 > 0) {
      [1, 2, 3, 4, 5].forEach((b, i) => {
        const a = (i - 2) * 0.16 * k4; withT(c, 540 + Math.sin(a) * 900, 1500 - Math.cos(a) * 900 + (1 - k4) * 300 - 240, a, 1, () => {
          c.fillStyle = 'rgba(0,0,0,.18)'; rrect(c, -150, -70, 310, 150, 20); c.fill(); c.fillStyle = '#fff'; rrect(c, -160, -80, 310, 150, 20); c.fill(); img(c, 'logo' + b, -5, -5, 110);
        });
      });
    }
    c.restore();
  }
  // lines 5–7: maya
  const kM = live(t, S.L(5) - 0.2, S.L(8) - 0.1, 0.5, 0.4);
  if (kM > 0) {
    c.save(); c.globalAlpha *= kM;
    chara(c, 'maya', 700, 560, 1350);
    chip(c, '大和麻弥 · maya', 760, 300, { size: 46, bg: '#99dd88', color: '#1e3a1a', scale: ease.back(kM) });
    if (t > S.at(5, '口音') - 0.2) bubble(c, 'ジブン……\nがんばるっす！', 300, 650, { size: 58, scale: pop(t, S.at(5, '口音') - 0.2), tail: [120, 160] });
    stamp(c, 'st0019', 200, 1020, 260, t, S.at(5, '好玩'));
    const k6 = live(t, S.L(6) - 0.1, S.L(7), 0.4, 0.3);
    if (k6 > 0) withT(c, 300, 1150, -0.1, ease.back(k6), () => {
      c.fillStyle = '#c9925a'; rrect(c, -200, -95, 400, 190, 18); c.fill(); c.fillStyle = '#fff4dc'; rrect(c, -180, -75, 360, 150, 12); c.fill();
      c.fillStyle = '#c9925a'; c.beginPath(); c.arc(-150, 0, 14, 0, TAU); c.fill();
      txt(c, '外乡人', 20, -24, { size: 50, fam: F.black, color: '#5a3a1a' }); txt(c, '日语练习中', 20, 34, { size: 36, fam: F.bold, color: '#8a5a2a' });
    });
    const k7 = ez(t, S.L(7) - 0.1, 0.5, ease.back);
    if (k7 > 0) withT(c, 300, 1120, 0.04, k7, () => {
      c.fillStyle = '#2a2a3a'; rrect(c, -230, -170, 460, 330, 30); c.fill(); c.fillStyle = '#9fe0ff'; rrect(c, -200, -140, 400, 270, 14); c.fill();
      c.fillStyle = '#5aa05a'; c.beginPath(); c.moveTo(-200, 130); c.lineTo(-80, -40); c.lineTo(20, 60); c.lineTo(90, -10); c.lineTo(200, 130); c.closePath(); c.fill();
      c.fillStyle = '#ff9a4a'; c.beginPath(); c.moveTo(60, 130); c.lineTo(120, 40); c.lineTo(180, 130); c.closePath(); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(140, -80, 28, 0, TAU); c.fill();
      chip(c, '户外节目', 0, -175, { size: 40, bg: '#ff4058', color: '#fff' });
    });
    if (k7 > 0) chip(c, '粗中有细', 800, 1160, { size: 56, bg: '#fff', color: '#1e3a1a', scale: pop(t, S.at(7, '粗中有细')), alpha: t > S.at(7, '粗中有细') ? 1 : 0, rot: 0.06 });
    c.restore();
  }
  // lines 8–10: eve
  const kE = live(t, S.L(8) - 0.2, S.L(11) - 0.1, 0.5, 0.4);
  if (kE > 0) {
    c.save(); c.globalAlpha *= kE;
    chara(c, 'eve', 640, 560, 1350);
    chip(c, '若宫伊芙', 740, 300, { size: 50, bg: '#ddbbff', color: '#3a1a5a', scale: ease.back(kE) });
    const k9 = live(t, S.at(9, '电波系') - 0.1, S.L(10), 0.3, 0.3);
    if (k9 > 0) { chip(c, '电波系？', 260, 640, { size: 60, bg: '#9fd8ff', color: '#0b2a55', alpha: k9, rot: -0.06 }); cross(c, 260, 640, 140, ez(t, S.at(9, '不太对'), 0.3)); }
    const k10 = ez(t, S.at(10, '复读') - 0.2, 0.3);
    if (k10 > 0) {
      for (let i = 0; i < 6; i++) { const ti = S.at(10, '复读') + i * 0.22; if (t < ti) continue; const kk = pop(t, ti, 0.3); txt(c, 'ブシドー！', 260 + (i % 2) * 140 + i * 20, 560 + i * 95, { size: 70 - i * 4, fam: F.black, color: i % 2 ? '#c79bff' : '#fff', stroke: '#3a1a5a', sw: 12, alpha: kk * (1 - i * 0.08) }); }
      stamp(c, 'st0020', 870, 1000, 250, t, S.at(10, '武士道'));
    }
    const kP = ez(t, S.at(10, '宝可梦') - 0.25, 0.5, ease.back);
    if (kP > 0) withT(c, 540, 1160, -0.03, kP, () => {
      c.fillStyle = '#e8384f'; rrect(c, -440, -150, 880, 300, 34); c.fill(); c.fillStyle = '#fff'; rrect(c, -415, -125, 830, 250, 24); c.fill();
      img(c, 'st0020', -300, 0, 210);
      txt(c, 'No.020  若宫伊芙', -170, -70, { size: 46, fam: F.black, color: '#2a1846', align: 'left' });
      txt(c, '属性：武士道 / 可爱', -170, -5, { size: 38, fam: F.bold, color: '#5a4a6a', align: 'left' });
      txt(c, '叫声：ブシドー！', -170, 58, { size: 38, fam: F.bold, color: '#5a4a6a', align: 'left' });
    });
    c.restore();
  }
  // lines 11–14: 千圣
  const kC = ez(t, S.L(11) - 0.2, 0.5);
  if (kC > 0) {
    c.save(); c.globalAlpha *= kC;
    chara(c, 'chisato', 700, 540, 1300);
    chip(c, '白鹭千圣', 780, 300, { size: 50, bg: '#ffeeaa', color: '#5a4a10', scale: ease.back(kC) });
    // line 11: 好感 slider -1 → 0
    const k11 = live(t, S.L(11), S.L(12), 0.3, 0.3);
    if (k11 > 0) {
      const x0 = 120, x1 = 560, y = 720, v = lerp(0.18, 0.5, ez(t, S.at(11, '无感'), 0.8));
      c.fillStyle = 'rgba(122,42,85,.15)'; rrect(c, x0, y - 16, x1 - x0, 32, 16); c.fill(); c.globalAlpha *= k11;
      [['反感', 0], ['无感', 0.5], ['好感', 1]].forEach(([s, p]) => txt(c, s, lerp(x0, x1, p), y + 60, { size: 38, fam: F.black, color: ink }));
      c.fillStyle = '#ff88bb'; c.beginPath(); c.arc(lerp(x0, x1, v), y, 30, 0, TAU); c.fill(); c.globalAlpha /= k11 || 1;
    }
    // line 12–13: business card + 同事
    const kB = live(t, S.L(12) - 0.1, S.at(14, '改观') + 0.6, 0.4, 0.3);
    const flip = ez(t, S.at(14, '改观') - 0.3, 0.6, ease.io);
    if (kB > 0 || flip > 0) {
      const sx = Math.abs(Math.cos(flip * Math.PI)), back = flip > 0.5;
      withT(c, 330, 1060, -0.05, 1, () => {
        c.scale(Math.max(0.02, sx) * ease.back(clamp(kB * 1.2 + flip)), 1);
        c.fillStyle = 'rgba(0,0,0,.2)'; rrect(c, -270, -150, 560, 310, 16); c.fill();
        c.fillStyle = back ? '#fff0f6' : '#ffffff'; rrect(c, -280, -160, 560, 310, 16); c.fill(); c.strokeStyle = back ? '#ff88bb' : '#c9b26a'; c.lineWidth = 6; c.stroke();
        if (!back) {
          txt(c, '名片', 230, -125, { size: 28, fam: F.bold, color: '#a89a6a' });
          txt(c, '白鹭千圣', -240, -70, { size: 64, fam: F.serif, color: '#2a2210', align: 'left' });
          txt(c, '女演员 / Pastel*Palettes 贝斯', -240, 10, { size: 32, fam: F.bold, color: '#6a5a30', align: 'left' });
          c.fillStyle = '#c9b26a'; c.fillRect(-240, 50, 480, 4);
          txt(c, '合作愉快。', -240, 100, { size: 36, fam: F.bold, color: '#6a5a30', align: 'left' });
        } else {
          txt(c, '朋友', 0, -40, { size: 96, fam: F.hand, color: '#d6407a' });
          for (let i = 0; i < 5; i++) img(c, st(16 + i), -200 + i * 100, 80, 110);
        }
      });
      if (!back) stamp(c, 'st0018', 820, 1050, 250, t, S.at(12, '工作'), { t1: S.at(14, '改观') });
    }
    const k13 = live(t, S.L(13) - 0.1, S.at(14, '改观'), 0.3, 0.3);
    if (k13 > 0) {
      chip(c, '公事公办', 260, 600, { size: 54, bg: '#3a3a4a', color: '#fff', scale: pop(t, S.at(13, '公事公办')), alpha: t > S.at(13, '公事公办') ? k13 : 0, rot: -0.05 });
      chip(c, '同事关系', 290, 700, { size: 54, bg: '#3a3a4a', color: '#ffd36b', scale: pop(t, S.at(13, '同事')), alpha: t > S.at(13, '同事') ? k13 : 0, rot: 0.04 });
    }
    if (t > S.at(14, '改观') - 0.1) chip(c, '慢慢改观中', 300, 680, { size: 56, bg: '#ff88bb', color: '#fff', scale: pop(t, S.at(14, '改观')), rot: -0.04 });
    c.restore();
  }
};

SCENES.outro = (c, t, S) => {
  bg(c, t, '#ff8fb1', '#5b3fd8', { blobs: [[300, 500, 600, 'rgba(255,240,150,.45)'], [800, 1300, 700, 'rgba(90,220,255,.35)']], dots: 'rgba(255,255,255,.2)', stripes: '#fff' });
  const cast = [['ksm_soft', '笑着说再见', '#ff5522'], ['ars_b', '傲娇永动机', '#aa66dd'], ['otae', '电波克傲娇', '#0077dd'], ['moca', '审美暴击', '#00ccaa'],
    ['ran_off', '反差', '#ee0022'], ['lisa', '强化版初华', '#dd2200'], ['maya', 'っす！', '#99dd88'], ['eve', 'ブシドー！', '#c79bff'], ['chisato', '改观中', '#e8c95a']];
  cast.forEach(([n, tag, col], i) => {
    const col3 = i % 3, row = Math.floor(i / 3), x = 200 + col3 * 340, y = 470 + row * 330;
    const k = ez(t, S.t0 + 0.1 + i * 0.08, 0.45, ease.back); if (k <= 0) return;
    withT(c, x, y, (hash(i) - 0.5) * 0.12, k, () => {
      c.fillStyle = 'rgba(0,0,0,.2)'; rrect(c, -142, -142, 296, 296, 30); c.fill();
      c.fillStyle = '#fffaf2'; rrect(c, -150, -150, 296, 296, 30); c.fill();
      c.save(); rrect(c, -138, -138, 272, 210, 22); c.clip(); c.fillStyle = hexA(col, 0.25); c.fillRect(-138, -138, 272, 210); chara(c, n, 0, -40, 620); c.restore();
      txt(c, tag, -2, 108, { size: 38, fam: F.black, color: col === '#e8c95a' ? '#8a6a10' : col });
    });
  });
  const k1 = ez(t, S.L(1) - 0.1, 0.5, ease.back);
  if (k1 > 0) {
    txt(c, '下期见！', W / 2, 1230, { size: 150 * k1, fam: F.punch, color: '#fff', stroke: '#2a1846', sw: 24, shadow: '#ff3b6b', sy: 14 });
  }
  txt(c, '上半部分 · 完', W / 2, 230, { size: 64, fam: F.black, color: '#fff', stroke: '#2a1846', sw: 14, alpha: ez(t, S.t0 + 0.2, 0.5) });
};
