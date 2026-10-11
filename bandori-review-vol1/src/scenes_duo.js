// ─── scenes: ars · 傲娇永动机, otae · 电波克傲娇, 摩卡, 兰 ────────────────────────

function gear(c, x, y, r, teeth, rot, color) {
  c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = color; c.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const a0 = (i / (teeth * 2)) * TAU, a1 = ((i + 1) / (teeth * 2)) * TAU, rr = i % 2 ? r : r * 1.16;
    c.lineTo(Math.cos(a0) * rr, Math.sin(a0) * rr); c.lineTo(Math.cos(a1) * rr, Math.sin(a1) * rr);
  }
  c.closePath(); c.fill(); c.globalCompositeOperation = 'destination-out'; c.beginPath(); c.arc(0, 0, r * 0.38, 0, TAU); c.fill(); c.restore();
}

SCENES.ars = (c, t, S) => {
  bg(c, t, '#f3e8ff', '#b993f0', { blobs: [[250, 500, 600, 'rgba(255,200,230,.6)'], [850, 1300, 600, 'rgba(170,120,255,.35)']], dots: 'rgba(120,70,190,.12)', stripes: '#aa66dd', stripeAlpha: 0.05 });
  // line 0: ksm ⇄ ars
  const k0 = live(t, S.t0 + 0.05, S.L(2) - 0.1, 0.5, 0.4);
  if (k0 > 0) {
    chara(c, 'ars_b', 680 + (1 - ez(t, S.at(0, 'ars') - 0.2, 0.6, ease.back)) * 600, 620, 1400, { alpha: k0 });
    img(c, st(1), 230, 760, 300 * ease.back(clamp(k0 * 1.2)), { alpha: k0, rot: -0.1 });
    if (t > S.at(0, 'ars')) { arrowLine(c, 360, 820, 520, 820, { color: '#aa66dd', lw: 10, k: ez(t, S.at(0, 'ars'), 0.3), alpha: k0 }); arrowLine(c, 520, 870, 360, 870, { color: '#ff5522', lw: 10, k: ez(t, S.at(0, 'ars') + 0.15, 0.3), alpha: k0 }); }
    namePlate(c, 60, 1050, ez(t, S.at(0, 'ars'), 0.5) * k0 * (1 - ez(t, S.L(1) - 0.2, 0.3)), '市谷有咲 · ars', "Poppin'Party · 键盘", '#aa66dd');
  }
  // line 1: 傲娇学教科书
  const k1 = live(t, S.L(1) - 0.1, S.L(2) + 0.3, 0.5, 0.4);
  if (k1 > 0) {
    withT(c, 540, 760, -0.06 + Math.sin(t * 1.5) * 0.01, ease.back(clamp(k1 * 1.1)), () => {
      c.fillStyle = 'rgba(0,0,0,.25)'; rrect(c, -290, -380, 600, 780, 18); c.fill();
      c.fillStyle = '#6b3fb0'; rrect(c, -300, -390, 600, 780, 18); c.fill();
      c.fillStyle = '#4e2a8a'; c.fillRect(-300, -390, 46, 780);
      c.strokeStyle = '#f6d36b'; c.lineWidth = 6; rrect(c, -230, -330, 480, 660, 10); c.stroke();
      txt(c, '傲娇学', 10, -200, { size: 120, fam: F.punch, color: '#fff' });
      txt(c, '标准教科书', 10, -80, { size: 64, fam: F.black, color: '#f6d36b' });
      img(c, 'st0005', 10, 120, 260);
      txt(c, '范例：市谷有咲', 10, 290, { size: 44, fam: F.bold, color: '#fff' });
    });
    seal(c, '必考', 820, 520, 70, t, S.at(1, '教科书') + 0.2);
  }
  // lines 2–6: 条件反射永动机 (cycle)
  const kM = live(t, S.L(2) - 0.1, S.L(7) + 0.2, 0.5, 0.5);
  if (kM > 0) {
    c.save(); c.globalAlpha *= kM;
    const cx = 540, cy = 820, R = 330;
    const speed = 0.6 + 6 * ez(t, S.L(6), 2.5, ease.in);
    const spin = (t - S.L(2)) * speed;
    gear(c, cx, cy, 120, 12, spin * 0.5, '#7a4cc4'); gear(c, cx + 150, cy - 120, 62, 9, -spin, '#c79bff');
    txt(c, '永动机', cx, cy, { size: 46, fam: F.black, color: '#fff' });
    chip(c, '条件反射永动机', cx, 360, { size: 60, bg: '#2a1846', color: '#f6d36b', scale: ease.back(kM) });
    const nodes = [
      ['怪发言', 1, S.at(3, '一个满嘴')], ['吐槽', 5, S.at(3, '一个负责')], ['偷偷帮忙', 5, S.at(4, '一个偷偷')],
      ['发现 · 点破', 1, S.at(4, '一个无意')], ['脸红否认', 5, S.at(5, '脸红')],
    ];
    nodes.forEach(([lab, who, tn], i) => {
      const a = -Math.PI / 2 + (i / nodes.length) * TAU, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
      const on = ez(t, tn - 0.15, 0.35, ease.back), act = t > tn - 0.15 && (i === nodes.length - 1 || t < nodes[i + 1][2] - 0.15) && t < S.L(6);
      // arc to next
      const a2 = -Math.PI / 2 + ((i + 1) / nodes.length) * TAU;
      c.strokeStyle = hexA('#7a4cc4', 0.5); c.lineWidth = 6; c.setLineDash([12, 12]); c.lineDashOffset = -t * 40 * speed;
      c.beginPath(); c.arc(cx, cy, R, a + 0.32, a2 - 0.32); c.stroke(); c.setLineDash([]);
      const s = (act ? 1.12 + Math.sin(t * 10) * 0.03 : 1) * Math.max(on, 0.0001);
      withT(c, x, y, 0, s, () => {
        c.fillStyle = who === 1 ? '#ff7a45' : '#aa66dd'; c.beginPath(); c.arc(0, 0, 112, 0, TAU); c.fill();
        c.strokeStyle = '#fff'; c.lineWidth = 8; c.stroke();
        img(c, st(who), 0, -18, 150);
        chip(c, lab, 0, 92, { size: 34, bg: '#fff', color: '#2a1846', shadow: false });
      });
      if (i === 4 && on > 0) { c.fillStyle = hexA('#ff6b8a', 0.6 * on); [[-40, 0], [40, 0]].forEach(([dx]) => { c.beginPath(); c.ellipse(x + dx, y - 6, 20, 10, 0, 0, TAU); c.fill(); }); }
    });
    // runner dot + counter (line 6)
    const k6 = ez(t, S.L(6) - 0.2, 0.4);
    if (k6 > 0) {
      const ang = -Math.PI / 2 + spin * 1.2;
      for (let j = 0; j < 8; j++) { c.fillStyle = hexA('#f6d36b', (1 - j / 8) * k6); c.beginPath(); c.arc(cx + Math.cos(ang - j * 0.06) * R, cy + Math.sin(ang - j * 0.06) * R, 22 - j * 2, 0, TAU); c.fill(); }
      const n = Math.floor(Math.pow(ez(t, S.L(6), 2.2, ease.in), 2) * 9999);
      chip(c, '循环次数 ' + (n >= 9999 ? '9999+' : n), cx, 1330, { size: 54, bg: '#2a1846', color: '#f6d36b', scale: k6 });
    }
    c.restore();
  }
  // lines 7–8: 被戳穿 → 才不是 / 内心得意
  const kE = ez(t, S.L(7) - 0.1, 0.6);
  if (kE > 0) {
    const [sx, sy] = shake(t, S.at(7, '戳穿'), 16, 0.4);
    chara(c, 'ars_b', 560 + sx, 600 + sy, 1500, { alpha: kE, shadow: 'rgba(60,20,90,.3)' });
    if (t > S.at(7, '戳穿') - 0.1 && t < S.L(8) + 0.2) {
      focusLines(c, 560, 600, t, 0.5 * (1 - ramp(t, S.L(8) - 0.2, 0.4)), '#fff');
      chip(c, '被发现了！', 760, 380, { size: 64, bg: '#ff3b6b', color: '#fff', scale: pop(t, S.at(7, '戳穿') - 0.1), rot: 0.08 });
    }
    // blush
    const bl = ez(t, S.at(7, '戳穿'), 0.5) * (0.6 + 0.2 * Math.sin(t * 5));
    c.fillStyle = hexA('#ff5c8a', 0.45 * bl * kE); [[505, 668], [612, 668]].forEach(([x, y]) => { c.beginPath(); c.ellipse(x + sx, y + sy, 36, 16, 0, 0, TAU); c.fill(); });
    const k8 = ez(t, S.at(8, '才不是') - 0.2, 0.4, ease.back);
    if (k8 > 0) bubble(c, '才、才不是！', 300, 1040, { size: 66, scale: k8, rot: -0.06, tail: [120, -120] });
    const kT = ez(t, S.at(8, '心里') - 0.1, 0.45, ease.back);
    if (kT > 0) {
      bubble(c, '（嘿嘿……被发现了~）', 640, 300, { size: 50, scale: kT, think: true, bg: '#fff6fb', border: '#aa66dd', color: '#7a3cc4', tail: [-120, 170] });
      const v = ez(t, S.at(8, '得意'), 0.9);
      meter(c, 140, 1290, 640, '内心得意度', v, '#ff5c8a', { value: v > 0.98 ? 'MAX!' : Math.round(v * 100) + '%', stroke: '#2a1846' });
      stamp(c, 'st0005', 900, 1110, 260, t, S.at(8, '要命') - 0.1);
    }
  }
};

SCENES.otae = (c, t, S) => {
  const dark = ez(t, S.L(3) - 0.2, 0.6) * (1 - ez(t, S.at(5, '电波') - 0.3, 0.4));
  bg(c, t, mix('#bfe3ff', '#2a1d4a', dark), mix('#2b7bd9', '#120c24', dark), { blobs: [[700, 600, 600, `rgba(255,255,255,${0.35 * (1 - dark)})`], [300, 1300, 500, 'rgba(120,180,255,.3)']], dots: 'rgba(255,255,255,.12)' });
  const cx = 600, fy = 520;
  // silhouette → colour (lines 0–2)
  const reveal = ez(t, S.at(2, '手游') - 0.2, 1.6, ease.io);
  const kO = ez(t, S.t0 + 0.1, 0.6) * (1 - ez(t, S.L(7) - 0.2, 0.5));
  const radio = ez(t, S.at(5, '电波') - 0.2, 0.5);
  if (kO > 0) {
    // radio waves (line 5+)
    if (radio > 0) for (let j = 0; j < 5; j++) { const r = ((t * 220 + j * 120) % 600); c.strokeStyle = hexA('#9fd8ff', radio * kO * (1 - r / 600)); c.lineWidth = 10; c.beginPath(); c.arc(cx, fy - 40, 120 + r, -2.6, -0.5); c.stroke(); }
    c.save(); c.globalAlpha *= kO;
    if (reveal < 1) drawCanvas(c, silhouette('otae', '#1b1530'), cx - FACE.otae[0] * 1500 + 750, fy - FACE.otae[1] * 1500 + 750, 1500, { alpha: 1 - reveal });
    if (reveal > 0) {
      c.save(); c.beginPath(); c.rect(0, lerp(H, -100, reveal), W, H); c.clip(); chara(c, 'otae', cx, fy, 1500, { filter: dark > 0 ? `brightness(${1 - dark * 0.45}) saturate(${1 - dark * 0.3})` : undefined }); c.restore();
    }
    if (reveal < 0.3) txt(c, '？？？', cx, fy + 40, { size: 140, fam: F.punch, color: '#fff', alpha: (1 - reveal * 3) * ez(t, S.t0, 0.5) });
    // evil glint while 腹黑
    if (dark > 0.3) { const g = (Math.sin(t * 3) + 1) / 2; star(c, cx + 50, fy - 10, 30 + g * 16, 4, 0.2, t); c.fillStyle = hexA('#fff', dark); c.fill(); }
    c.restore();
    namePlate(c, 60, 1060, ez(t, S.at(0, 'otae'), 0.5) * (1 - ez(t, S.L(3), 0.4)), '花园多惠 · otae', "Poppin'Party · 吉他", '#0077dd');
  }
  // line 1–2: 印象值
  const kV = live(t, S.L(1), S.L(3) + 0.2, 0.4, 0.4);
  if (kV > 0) {
    c.save(); c.globalAlpha *= kV;
    const v = lerp(0.08, 1, ez(t, S.at(2, '手游'), 2.2));
    meter(c, 120, 1330, 600, '印象值', v, '#ffd36b', { value: Math.round(v * 100), stroke: '#0b2a55' });
    ['手游', '主线', '活动剧情'].forEach((w, i) => { const ta = S.at(2, w); chip(c, w, 260 + i * 260, 300, { size: 46, bg: '#fff', color: '#0b4a9a', scale: pop(t, ta), alpha: t > ta ? 1 : 0, rot: (i - 1) * 0.06 }); });
    c.restore();
  }
  // lines 3–4: 腹黑? radar over other chibis
  const kR = live(t, S.L(3), S.at(5, '后来') + 0.3, 0.5, 0.4);
  if (kR > 0) {
    c.save(); c.globalAlpha *= kR;
    chip(c, '腹黑？', 300, 380, { size: 70, bg: '#2a1846', color: '#ff6b8a', scale: pop(t, S.at(3, '腹黑') - 0.1), rot: -0.08 });
    const ppl = [[1, 170, 980], [3, 900, 950], [4, 880, 1250], [5, 190, 1260]];
    const sweep = (t * 2.2) % TAU;
    if (t > S.L(4) - 0.2) {
      c.save(); c.translate(cx, 800); c.rotate(sweep); const g = c.createLinearGradient(0, 0, 700, 0); g.addColorStop(0, 'rgba(120,255,200,.4)'); g.addColorStop(1, 'rgba(120,255,200,0)');
      c.fillStyle = g; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 700, -0.25, 0.25); c.closePath(); c.fill(); c.restore();
      ppl.forEach(([id, x, y], i) => { img(c, st(id), x, y, 190 * pop(t, S.L(4) + i * 0.12)); const a = Math.atan2(y - 800, x - cx); const d = Math.abs(((sweep - a) % TAU + TAU) % TAU); if (d < 0.5) { c.strokeStyle = 'rgba(120,255,200,.9)'; c.lineWidth = 6; c.strokeRect(x - 100, y - 100, 200, 200); } });
      chip(c, '观察中…', 760, 380, { size: 48, bg: '#78ffc8', color: '#123', alpha: 0.6 + 0.4 * Math.sin(t * 6) });
      if (t > S.at(4, '坏主意') - 0.2) bubble(c, '（……）', 860, 640, { size: 56, scale: pop(t, S.at(4, '坏主意') - 0.2), think: true, tail: [-120, 80] });
    }
    c.restore();
  }
  // line 5: 腹黑 ✗ → 天然电波
  const k5 = live(t, S.at(5, '不是腹黑') - 0.1, S.L(7), 0.3, 0.4);
  if (k5 > 0) {
    chip(c, '腹黑', 260, 300, { size: 66, bg: '#2a1846', color: '#ff6b8a', alpha: k5, rot: -0.08 });
    cross(c, 260, 300, 150, ez(t, S.at(5, '不是腹黑'), 0.3));
    chip(c, '天然电波 · 呆', 680, 300, { size: 66, bg: '#9fd8ff', color: '#0b2a55', alpha: k5 * (t > S.at(5, '电波') ? 1 : 0), scale: pop(t, S.at(5, '电波')), rot: 0.05 });
  }
  // line 6: decoder
  const k6 = live(t, S.L(6), S.L(7) + 0.1, 0.4, 0.3);
  if (k6 > 0) {
    c.save(); c.globalAlpha *= k6; c.fillStyle = 'rgba(8,20,50,.85)'; rrect(c, 90, 1100, 900, 240, 26); c.fill();
    txt(c, '语言系统 · 解码中', 130, 1150, { size: 38, fam: F.bold, color: '#78ffc8', align: 'left' });
    const glyphs = '兔◇☆兔？♪○兔△！兔…♡兔', n = Math.floor((t - S.L(6)) * 14);
    let s = ''; for (let i = 0; i < 14; i++) s += glyphs[(i * 7 + n + (i % 3) * n) % glyphs.length];
    txt(c, s, 540, 1230, { size: 64, fam: F.black, color: '#fff' });
    if (t > S.at(6, '听不懂')) chip(c, '解码失败', 820, 1150, { size: 38, bg: '#ff4058', color: '#fff', scale: pop(t, S.at(6, '听不懂')) });
    c.restore();
  }
  // lines 7–8: 电波 → 傲娇 type chart
  const kV7 = live(t, S.L(7) - 0.2, S.L(9) - 0.1, 0.4, 0.4);
  if (kV7 > 0) {
    c.save(); c.globalAlpha *= kV7;
    const [sx, sy] = shake(t, S.at(7, '克制'), 22, 0.5);
    img(c, st(2), 250, 760, 380 * ease.back(clamp(kV7 * 1.3)));
    img(c, st(5), 830 + sx, 760 + sy, 380 * ease.back(clamp(kV7 * 1.3)), { filter: t > S.at(7, '克制') ? 'brightness(1.1)' : undefined });
    chip(c, '电波', 250, 520, { size: 56, bg: '#0077dd', color: '#fff' }); chip(c, '傲娇', 830, 520, { size: 56, bg: '#aa66dd', color: '#fff' });
    if (t > S.at(7, '克制') - 0.2) {
      arrowLine(c, 420, 760, 650, 760, { color: '#ffd36b', lw: 18, k: ez(t, S.at(7, '克制') - 0.2, 0.25) });
      txt(c, '效果拔群！', 540, 990, { size: 96, fam: F.punch, color: '#ffd36b', stroke: '#0b2a55', sw: 16, alpha: ez(t, S.at(7, '克制'), 0.2) });
      txt(c, '-999', 900 + sx, 600 - (t - S.at(7, '克制')) * 60, { size: 70, fam: F.round, color: '#ff4058', stroke: '#fff', sw: 10, alpha: 1 - ramp(t, S.at(7, '克制') + 0.8, 0.5) });
      meter(c, 700, 1080, 260, 'HP', 1 - ez(t, S.at(7, '克制'), 0.6) * 0.9, '#ff4058', { size: 34, stroke: '#0b2a55' });
    }
    if (t > S.L(8) - 0.1) {
      txt(c, '电波  >  傲娇', 540, 1200, { size: 100, fam: F.punch, color: '#fff', stroke: '#0b2a55', sw: 16, alpha: ez(t, S.L(8) - 0.1, 0.3) });
      seal(c, '天经地义', 790, 1300, 64, t, S.at(8, '天经地义'));
    }
    c.restore();
  }
  // line 9: favourite pair
  const k9 = ez(t, S.L(9) - 0.2, 0.6);
  if (k9 > 0) {
    chara(c, 'otae', 330 - (1 - k9) * 300, 640, 1150, { alpha: k9 });
    chara(c, 'ars_b', 760 + (1 - k9) * 300, 640, 1150, { alpha: k9, flip: true });
    const hb = 1 + Math.sin(t * 8) * 0.06; c.fillStyle = '#ff5c8a'; heart(c, 545, 960, 90 * hb * ease.back(k9)); c.fill();
    chip(c, '老邦 · 最爱组合之一', 540, 1180, { size: 58, bg: '#fff', color: '#0b4a9a', scale: ease.back(k9), border: '#ff5c8a' });
  }
};

SCENES.moca = (c, t, S) => {
  bg(c, t, '#c9fff2', '#2aa58f', { blobs: [[300, 400, 600, 'rgba(255,255,255,.5)'], [800, 1300, 600, 'rgba(255,170,120,.25)']], dots: 'rgba(0,90,80,.1)', stripes: '#00ccaa', stripeAlpha: 0.06 });
  // lines 0–3: moca + 审美 checklist
  const kA = live(t, S.t0 + 0.05, S.L(4), 0.6, 0.4);
  if (kA > 0) {
    chara(c, 'moca', 720, 560 + Math.sin(t) * 8, 1450, { alpha: kA });
    namePlate(c, 60, 300, ez(t, S.at(0, '摩卡'), 0.5) * (1 - ez(t, S.L(2) - 0.3, 0.4)), '青叶摩卡', 'Afterglow · 吉他', '#00ccaa');
    // radar ping (line 1)
    const k1 = live(t, S.L(1), S.L(2) + 0.2, 0.3, 0.3);
    if (k1 > 0) for (let j = 0; j < 3; j++) { const r = ((t - S.L(1)) * 300 + j * 160) % 480; c.strokeStyle = hexA('#ff5c8a', k1 * (1 - r / 480)); c.lineWidth = 10; c.beginPath(); c.arc(700, 520, r, 0, TAU); c.stroke(); }
    if (k1 > 0) chip(c, '审美 · 完全命中', 330, 420, { size: 54, bg: '#ff5c8a', color: '#fff', scale: pop(t, S.at(1, '审美')), alpha: t > S.at(1, '审美') ? k1 : 0, rot: -0.07 });
    const k2 = ez(t, S.L(2) - 0.3, 0.5, ease.back);
    if (k2 > 0) {
      withT(c, 300, 1010, -0.05, k2, () => {
        c.fillStyle = 'rgba(0,0,0,.2)'; rrect(c, -230, -230, 480, 470, 26); c.fill();
        c.fillStyle = '#fffdf6'; rrect(c, -240, -240, 480, 470, 26); c.fill();
        txt(c, '我的审美清单', 0, -175, { size: 44, fam: F.black, color: '#1f6f62' });
        ['短发', '电波系', '吉他手'].forEach((w, i) => {
          const y = -80 + i * 110; c.strokeStyle = '#1f6f62'; c.lineWidth = 5; c.strokeRect(-190, y - 32, 64, 64);
          check(c, -158, y, 70, ez(t, S.at(2, w), 0.3));
          txt(c, w, -95, y, { size: 56, fam: F.black, color: '#2a1846', align: 'left' });
        });
      });
      seal(c, '命中率 100%', 780, 1250, 62, t, S.at(2, '吉他手') + 0.5);
    }
    // line 3: aside
    const k3 = live(t, S.L(3) - 0.1, S.L(4), 0.4, 0.3);
    if (k3 > 0) withT(c, 760, 820, 0.08, ease.back(k3), () => {
      c.fillStyle = '#fff59b'; c.fillRect(-200, -120, 400, 240); c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(-200, 100, 400, 20);
      txt(c, '（小声）', 0, -60, { size: 38, fam: F.hand, color: '#6b5b2a' });
      txt(c, '峰月律 = 电波？', 0, 10, { size: 50, fam: F.hand, color: '#2a1846' });
      txt(c, '……应该不算吧', 0, 72, { size: 40, fam: F.hand, color: '#6b5b2a' });
    });
  }
  // line 4–6: 摩卡 ≈ otae, 压制 傲娇
  const kB = live(t, S.L(4) - 0.1, S.L(7), 0.5, 0.4);
  if (kB > 0) {
    c.save(); c.globalAlpha *= kB;
    img(c, st(7), 280, 620, 300 * ease.back(clamp(kB * 1.3))); img(c, st(2), 800, 620, 300 * ease.back(clamp(kB * 1.3)));
    txt(c, '≈', 540, 620, { size: 160, fam: F.round, color: '#fff', stroke: '#1f6f62', sw: 14 });
    chip(c, '表面呆呆', 280, 820, { size: 42, bg: '#fff', color: '#1f6f62', scale: pop(t, S.at(4, '呆呆')), alpha: t > S.at(4, '呆呆') ? 1 : 0 });
    chip(c, '怪话连发', 800, 820, { size: 42, bg: '#fff', color: '#1f6f62', scale: pop(t, S.at(4, '奇怪')), alpha: t > S.at(4, '奇怪') ? 1 : 0 });
    if (t > S.L(5) - 0.1) {
      const k = ez(t, S.L(5) - 0.1, 0.4);
      img(c, st(5), 280, 1080, 250 * ease.back(k), { filter: 'brightness(.95)' }); img(c, st(6), 800, 1080, 250 * ease.back(k));
      arrowLine(c, 280, 780 + 0, 280, 950, { color: '#ff4058', lw: 12, k: ez(t, S.at(5, '压制'), 0.3) });
      arrowLine(c, 800, 780, 800, 950, { color: '#ff4058', lw: 12, k: ez(t, S.at(5, '压制'), 0.3) });
      if (t > S.at(5, '压制')) chip(c, '天生压制', 540, 1000, { size: 50, bg: '#ff4058', color: '#fff', scale: pop(t, S.at(5, '压制')) });
    }
    // combo meter
    if (t > S.L(6) - 0.1) {
      const v = ez(t, S.at(6, '一个表情'), 1.3);
      meter(c, 140, 1290, 640, '攻势', v, '#ff4058', { value: v > 0.98 ? 'MAX!!' : Math.round(v * 100) + '%', stroke: '#1f4f46' });
      if (v > 0.98) focusLines(c, 540, 1000, t, 0.3);
    }
    c.restore();
  }
  // lines 7–8: 呆呆 + comic strip
  const kC = ez(t, S.L(7) - 0.2, 0.5);
  if (kC > 0) {
    const k7 = 1 - ez(t, S.L(8) - 0.2, 0.4);
    if (k7 > 0) {
      chara(c, 'moca_b', 560, 560, 1450, { alpha: kC * k7 });
      for (let j = 0; j < 4; j++) txt(c, ['？', '♪', '～', '？'][j], 260 + j * 190, 330 + Math.sin(t * 3 + j) * 30, { size: 90, fam: F.punch, color: '#fff', stroke: '#1f6f62', sw: 12, alpha: kC * k7 });
      chip(c, '呆呆傻傻 认证', 540, 1120, { size: 56, bg: '#fff', color: '#1f6f62', scale: pop(t, S.at(7, '呆呆')), alpha: t > S.at(7, '呆呆') ? k7 : 0 });
    }
    const k8 = ez(t, S.L(8) - 0.2, 0.4);
    if (k8 > 0) {
      const panels = [S.at(8, '看到兰'), S.at(8, '撩了'), S.at(8, '凑上去')];
      panels.forEach((tp, i) => {
        const kp = ez(t, tp - 0.25, 0.35, ease.back); if (kp <= 0) return;
        const x = 190 + i * 350, y = 820;
        withT(c, x, y, (i - 1) * 0.03, kp, () => {
          c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(-150, -280, 316, 590); c.fillStyle = '#fffdf6'; c.fillRect(-160, -290, 316, 590);
          c.strokeStyle = '#1e1a2b'; c.lineWidth = 7; c.strokeRect(-160, -290, 316, 590);
          txt(c, String(i + 1), -125, -250, { size: 40, fam: F.round, color: '#1f6f62' });
          if (i === 0) { img(c, st(6), 0, 40, 240); drawCanvas(c, silhouette('st0001', '#555'), 0, 210, 160, { alpha: 0.7 }); bubble(c, '好帅！', 40, -170, { size: 40, tail: [-40, 300] }); }
          if (i === 1) { img(c, st(6), 0, 40, 260); c.fillStyle = 'rgba(255,90,130,.55)'; c.beginPath(); c.ellipse(-35, 40, 26, 11, 0, 0, TAU); c.ellipse(35, 40, 26, 11, 0, 0, TAU); c.fill(); bubble(c, '……', 0, -180, { size: 46 }); }
          if (i === 2) { img(c, st(6), -40, 60, 220); img(c, st(7), 60, -20, 220, { rot: 0.15 }); bubble(c, '兰~被撩了呢~', 0, -210, { size: 32, tail: [40, 90] }); }
        });
      });
    }
  }
};

SCENES.ran = (c, t, S) => {
  const split = 980;
  // OFF stage (bottom right) background
  bg(c, t, '#ffe1ea', '#ffb3c8', { dots: 'rgba(255,90,130,.12)' });
  // ON stage (top-left diagonal)
  const kOn = ez(t, S.t0 + 0.05, 0.5), kOff = ez(t, S.L(1) - 0.2, 0.6);
  c.save(); c.beginPath(); c.moveTo(0, 0); c.lineTo(W, 0); c.lineTo(W, lerp(H, split - 200, kOff)); c.lineTo(0, lerp(H, split + 200, kOff)); c.closePath(); c.clip();
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a0508'); g.addColorStop(1, '#5a0b16'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  for (let i = 0; i < 3; i++) { c.save(); c.translate(200 + i * 340, -40); c.rotate(Math.sin(t * 0.8 + i * 2) * 0.25); const lg = c.createLinearGradient(0, 0, 0, 1200); lg.addColorStop(0, 'rgba(255,220,200,.5)'); lg.addColorStop(1, 'rgba(255,220,200,0)'); c.fillStyle = lg; c.beginPath(); c.moveTo(-30, 0); c.lineTo(30, 0); c.lineTo(220, 1200); c.lineTo(-220, 1200); c.closePath(); c.fill(); c.restore(); }
  chara(c, 'ran_stage', 470, 600, 1300, { alpha: kOn });
  txt(c, 'ON STAGE', 760, 340, { size: 80, fam: F.round, color: '#ff4058', alpha: kOn, ls: 6 });
  meter(c, 600, 480, 360, '气场', ez(t, S.at(0, '气场'), 0.5), '#ff4058', { value: 'MAX', size: 36 });
  c.restore();
  if (kOff > 0) {
    c.save(); c.beginPath(); c.moveTo(0, split + 200); c.lineTo(W, split - 200); c.lineTo(W, H); c.lineTo(0, H); c.closePath(); c.clip();
    chara(c, 'ran_off', 720, 1080 + (1 - kOff) * 400, 1100, {});
    const bl = 0.5 + 0.3 * Math.sin(t * 5); c.fillStyle = hexA('#ff5c8a', bl * ez(t, S.at(1, '脸红'), 0.4)); [[688, 1086], [773, 1086]].forEach(([x, y]) => { c.beginPath(); c.ellipse(x, y, 26, 12, 0, 0, TAU); c.fill(); });
    txt(c, 'OFF STAGE', 300, 1235, { size: 62, fam: F.round, color: '#ff4f86', ls: 6 });
    meter(c, 90, 1345, 330, '脸红', ez(t, S.at(1, '脸红'), 0.5), '#ff5c8a', { value: 'MAX', size: 36, labelColor: '#7a1a3a' });
    c.restore();
    c.strokeStyle = '#fff'; c.lineWidth = 14; c.beginPath(); c.moveTo(0, split + 200); c.lineTo(W, split - 200); c.stroke();
  }
  if (t > S.at(2, '没什么') - 0.25) { bubble(c, '……没什么。', 380, 820, { size: 60, scale: pop(t, S.at(2, '没什么') - 0.25), tail: [140, 120] }); stamp(c, 'st0006', 160, 1000, 220, t, S.at(2, '没什么')); }
  if (t > S.L(3) - 0.1) chip(c, '反差感', 540, 980, { size: 90, fam: F.punch, bg: '#2a1846', color: '#ffd36b', scale: pop(t, S.at(3, '反差')), alpha: t > S.at(3, '反差') ? 1 : 0, rot: -0.1 });
};
