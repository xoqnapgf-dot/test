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
  // line 0: a heart that drains to grey and cracks
  const k0 = live(t, S.t0 + 0.1, S.L(2), 0.5, 0.4);
  if (k0 > 0) {
    const grey = ez(t, S.at(0, '无感'), 0.8), crack = ez(t, S.at(0, '抵触'), 0.4);
    c.save(); c.globalAlpha *= k0;
    withT(c, 540, 680, 0, 1 + Math.sin(t * 4) * 0.02 * (1 - grey), () => {
      c.fillStyle = mix('#ff5c8a', '#6a6780', grey); heart(c, 0, 0, 130); c.fill();
      if (crack > 0) { c.strokeStyle = '#1b1840'; c.lineWidth = 10; c.lineJoin = 'round'; c.beginPath(); c.moveTo(0, -60); c.lineTo(-22, -20 * crack); c.lineTo(18, 10 * crack); c.lineTo(-10, 45 * crack); c.stroke(); }
    });
    c.restore();
    // line 1: pressure dial
    const k1 = ez(t, S.L(1) - 0.2, 0.5);
    if (k1 > 0) { c.save(); c.globalAlpha *= k1; dial(c, 540, 1060, 230, lerp(0.15, 0.93, ez(t, S.at(1, '高压'), 0.8, ease.back)), '团内气压', t); c.restore(); if (t > S.at(1, '高压')) for (let j = 0; j < 3; j++) { const r = ((t - S.at(1, '高压')) * 160 + j * 50) % 150; c.fillStyle = `rgba(255,255,255,${0.4 * (1 - r / 150)})`; c.beginPath(); c.arc(760 + j * 40, 860 - r, 26 + r * 0.2, 0, TAU); c.fill(); } }
  }
  // lines 2–4: ykn & sayo
  const kY = live(t, S.L(2) - 0.2, S.L(5) - 0.1, 0.5, 0.4);
  if (kY > 0) {
    c.save(); c.globalAlpha *= kY;
    chara(c, 'ykn', 330, 560, 1050, { filter: 'saturate(.8)' }); chara(c, 'sayo', 770, 600, 1050, { filter: 'saturate(.8)' });
    chip(c, '凑友希那 · ykn', 300, 940, { size: 40, bg: '#881188', color: '#fff' }); chip(c, '冰川纱夜 · sayo', 780, 940, { size: 40, bg: '#00aabb', color: '#fff' });
    // line 3: a brief soft sparkle around them (their kind side)
    const k3 = live(t, S.L(3), S.L(4) + 0.2, 0.4, 0.4);
    if (k3 > 0) particles(c, t, 16, 61, (a, b, d) => { const tw = Math.abs(Math.sin(t * (2 + d * 2) + a * 30)); star(c, 140 + a * 800, 350 + b * 600, (10 + d * 16) * tw, 4, 0.3, 0); c.fillStyle = hexA('#fff6c2', k3 * tw); c.fill(); });
    // line 4: bands formed by friendship and fun float up with hearts
    const k4 = ez(t, S.L(4) - 0.1, 0.5);
    if (k4 > 0) {
      c.fillStyle = 'rgba(10,8,30,.6)'; c.fillRect(0, 1090, W, 260 * k4);
      [1, 2, 3].forEach((b, i) => {
        const kk = ez(t, S.L(4) + i * 0.25, 0.5, ease.back), x = 220 + i * 320, y = 1230 - kk * 20 + Math.sin(t * 2 + i) * 8;
        c.fillStyle = 'rgba(255,255,255,.92)'; rrect(c, x - 140, y - 60, 280, 120, 20); c.fill(); img(c, 'logo' + b, x, y, 90 * kk);
        c.fillStyle = '#ff5c8a'; heart(c, x + 120, y - 60, 30 * kk); c.fill();
      });
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
    if (kU > 0) { arrowLine(c, 400, 700, 520, 700, { color: '#ffd36b', lw: 14, k: ez(t, S.at(5, '强化版'), 0.3) }); txt(c, 'Lv.UP', 460, 620, { size: 50, fam: F.round, color: '#ffd36b', alpha: kU }); }
    // line 6: eye-line to ykn
    const k6 = live(t, S.L(6) - 0.1, S.L(7) + 0.4, 0.3, 0.4);
    if (k6 > 0) {
      img(c, st(21), 220, 1150, 220 * ease.back(k6));
      c.strokeStyle = hexA('#ff5c8a', k6); c.lineWidth = 6; c.setLineDash([16, 12]); c.lineDashOffset = -t * 60; c.beginPath(); c.moveTo(600, 470); c.quadraticCurveTo(400, 900, 260, 1060); c.stroke(); c.setLineDash([]);
      c.strokeStyle = hexA('#ff5c8a', k6); c.lineWidth = 6; const rr = 130 + Math.sin(t * 6) * 8; c.beginPath(); c.arc(220, 1150, rr, 0, TAU); c.stroke();
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; c.beginPath(); c.moveTo(220 + Math.cos(a) * (rr - 20), 1150 + Math.sin(a) * (rr - 20)); c.lineTo(220 + Math.cos(a) * (rr + 20), 1150 + Math.sin(a) * (rr + 20)); c.stroke(); }
    }
    // line 7: lisa sends hearts to the other members
    const k7 = ez(t, S.L(7) - 0.1, 0.4);
    if (k7 > 0) {
      [[24, 200, 1180], [25, 540, 1240], [22, 880, 1180]].forEach(([id, x, y], i) => {
        const ki = ez(t, S.L(7) + i * 0.35, 0.4, ease.back); img(c, st(id), x, y, 200 * ki);
        const f = clamp((t - S.L(7) - i * 0.35) % 1.4 / 1.4);
        c.fillStyle = hexA('#ff5c8a', ki * (1 - f)); heart(c, lerp(620, x, f), lerp(560, y - 110, f), 26); c.fill();
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
      meter(c, 140, 660, 700, 'Loading…', v, '#ff88bb', { value: Math.round(v * 100) + '%', labelColor: ink, track: 'rgba(122,42,85,.15)' });
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
    const k7 = ez(t, S.L(7) - 0.1, 0.5, ease.back);
    if (k7 > 0) withT(c, 300, 1120, 0.04, k7, () => {
      c.fillStyle = '#2a2a3a'; rrect(c, -230, -170, 460, 330, 30); c.fill(); c.fillStyle = '#9fe0ff'; rrect(c, -200, -140, 400, 270, 14); c.fill();
      c.fillStyle = '#5aa05a'; c.beginPath(); c.moveTo(-200, 130); c.lineTo(-80, -40); c.lineTo(20, 60); c.lineTo(90, -10); c.lineTo(200, 130); c.closePath(); c.fill();
      c.fillStyle = '#ff9a4a'; c.beginPath(); c.moveTo(60, 130); c.lineTo(120, 40); c.lineTo(180, 130); c.closePath(); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(140, -80, 28, 0, TAU); c.fill();
      chip(c, 'ON AIR', 0, -175, { size: 40, fam: F.round, bg: '#ff4058', color: '#fff' });
    });
    c.restore();
  }
  // lines 8–10: eve
  const kE = live(t, S.L(8) - 0.2, S.L(11) - 0.1, 0.5, 0.4);
  if (kE > 0) {
    c.save(); c.globalAlpha *= kE;
    chara(c, 'eve', 640, 560, 1350);
    chip(c, '若宫伊芙', 740, 300, { size: 50, bg: '#ddbbff', color: '#3a1a5a', scale: ease.back(kE) });
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
    txt(c, 'To be continued…', W / 2, 1335, { size: 96 * k1, fam: F.round, color: '#fff', stroke: '#2a1846', sw: 18, shadow: '#ff3b6b', sy: 12 });
  }
};
