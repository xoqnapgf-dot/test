// ─── shot list + per-section overlays ─────────────────────────────────────────
// SHOTLIST[section] = [[lineIndex, (word,) spec], …]; a shot runs until the next one starts.
// spec: { img, kind: 'duo'|'contain'|'logos', img2, fx, fy, out, z0, z1, flip, filter, pw: [[line, word], …] (zoom punches) }

const SHOTLIST = {
  intro: [
    [0, { img: 'misaki_card', fy: 0.4 }], [0, '老邦', { img: 'arisa_card', fy: 0.3 }], [0, '这期', { img: 'am_stage' }],
  ],
  misaki: [
    [0, { img: 'misaki_card', fy: 0.35, pw: [[0, '美咲']] }],
    [1, { img: 'misaki_michelle', fx: 0.65, fy: 0.35, out: true, filter: 'saturate(.55) brightness(.9)' }],
    [2, { kind: 'duo', img: 'kokoro_card', fx: 0.5, fy: 0.35, img2: 'misaki_card2', fx2: 0.28, fy2: 0.4 }],
    [3, { img: 'misaki_card2', fx: 0.4, fy: 0.4 }],
    [4, { img: 'arisa_card', fx: 0.55, fy: 0.3 }],
    [5, { kind: 'duo', img: 'arisa_card', fx: 0.56, fy: 0.3, img2: 'misaki_michelle', fx2: 0.68, fy2: 0.3 }],
    [6, { img: 'misaki_card2', fx: 0.3, fy: 0.4, out: true }],
    [7, { img: 'misaki_michelle', fx: 0.68, fy: 0.3, z0: 1.05, z1: 1.25 }],
    [8, { img: 'misaki_card', fy: 0.35, pw: [[8, '挺身而出']] }],
    [9, { kind: 'contain', img: 'misaki_chibi2' }],
    [10, { kind: 'duo', img: 'misaki_michelle', fx: 0.66, fy: 0.3, img2: 'misaki_michelle', fx2: 0.34, fy2: 0.3, flip2: true }],
    [12, { img: 'kokoro_card', fy: 0.35, z0: 1.0, z1: 1.18 }],
    [14, { img: 'kokoro_card', fy: 0.3, z0: 1.18, z1: 1.32, pw: [[14, '疯狂吐槽']] }],
    [15, { kind: 'duo', img: 'misaki_card2', fx: 0.28, fy: 0.4, img2: 'arisa_card', fx2: 0.56, fy2: 0.3 }],
    [16, { kind: 'contain', img: 'misaki_chibi' }],
  ],
  'morfo-ras': [
    [0, { kind: 'logos', img: 'lock_card', logos: ['logo21', 'logo18'] }],
    [1, { img: 'lock_card2', fy: 0.35 }], [1, 'LOCK', { img: 'lock_card', fy: 0.35, pw: [[1, '可爱']] }],
  ],
  anon: [
    [0, { img: 'anon_card', fy: 0.3 }],
    [1, { img: 'anon_ep1', z0: 1.0, z1: 1.04 }],
    [2, { img: 'anon_heart', pw: [[2, '虚荣']] }],
    [3, { img: 'anon_happy', fy: 0.4 }],
    [4, { img: 'anon_idea', out: true }],
    [5, { img: 'anon_tomori', fx: 0.6 }],
    [7, { img: 'anon_happy', z0: 1.15, z1: 1.3, fy: 0.35 }],
    [8, { img: 'anon_tomori2', fx: 0.4 }],
    [9, { img: 'mygo_group', out: true }],
    [10, { img: 'anon_shock', fx: 0.6, pw: [[10, '幼稚']] }],
    [11, { img: 'anon_back', fx: 0.6 }],
    [12, { img: 'anon_stage', fy: 0.4 }],
    [13, { img: 'anon_stage', fy: 0.35, z0: 1.15, z1: 1.35 }],
    [14, { img: 'anon_idea', fx: 0.55, z0: 1.1, z1: 1.2 }],
  ],
  soyo: [
    [0, { img: 'soyo_card', fy: 0.3 }], [0, '一直很不喜欢', { img: 'soyo_glare', fx: 0.42, pw: [[0, '不喜欢']] }],
    [1, { img: 'soyo_smile', out: true }],
    [2, { kind: 'duo', img: 'soyo_smile', fx: 0.5, fy: 0.35, img2: 'soyo_glare', fx2: 0.42, fy2: 0.45 }],
    [3, { img: 'soyo_silh', fx: 0.75 }],
    [4, { img: 'mygo_group', z0: 1.0, z1: 1.12 }],
    [5, { img: 'soyo_sad', out: true }],
    [6, { img: 'soyo_ep9' }],
    [7, { img: 'soyo_break', fx: 0.45 }],
    [8, { img: 'soyo_glare', fx: 0.42, z0: 1.12, z1: 1.3, pw: [[8, '底线']] }],
  ],
  taki: [
    [0, { img: 'taki_card', fy: 0.3 }],
    [1, { img: 'taki_shout', fy: 0.4, pw: [[1, '凶']] }],
    [2, { img: 'taki_ep2', out: true }],
    [3, { kind: 'duo', img: 'taki_drum', fx: 0.45, fy: 0.45, img2: 'tomori_sing', fx2: 0.45, fy2: 0.4 }],
    [4, { img: 'soyo_taki', fx: 0.5 }],
    [5, { img: 'anon_shock', fx: 0.6 }], [5, 'Taki', { img: 'soyo_taki', fx: 0.6, z0: 1.12, z1: 1.25, pw: [[5, '点破']] }],
    [6, { img: 'taki_drum', fx: 0.45 }],
  ],
  uika: [
    [0, { img: 'am_stage' }], [0, '初华', { img: 'uika_cap', fx: 0.4, fy: 0.4 }],
    [1, { img: 'saki_close', fx: 0.55 }],
    [2, { img: 'saki_smile', fx: 0.5, filter: 'saturate(.7)' }],
    [3, { img: 'uika_dress', fy: 0.35 }],
    [5, { img: 'uika_saki_park', fx: 0.5 }],
    [7, { img: 'uika_ep11', filter: 'brightness(.45) saturate(.6)', z0: 1.0, z1: 1.06 }],
    [9, { img: 'uika_ep11', filter: 'brightness(.8) saturate(.8)', z0: 1.06, z1: 1.14 }],
    [11, { img: 'saki_close', fx: 0.55, filter: 'blur(14px) brightness(1.15)', z0: 1.1, z1: 1.15 }],
    [13, { img: 'saki_close', fx: 0.55, filter: 'blur(3px) brightness(1.05)', z0: 1.15, z1: 1.22 }],
    [14, { img: 'am_stage', fx: 0.5, fy: 0.4, z0: 1.0, z1: 1.25 }],
    [16, { img: 'uika_dress', fy: 0.35, z0: 1.05, z1: 1.2 }],
    [17, { img: 'uika_ep11', filter: 'brightness(.6) saturate(.7)', z0: 1.04, z1: 1.12 }],
    [19, { img: 'uika_ep11', filter: 'brightness(.25) saturate(.3)', out: true }],
    [21, { img: 'uika_saki_park', fx: 0.4 }],
    [23, { img: 'saki_smile', fx: 0.5, z0: 1.0, z1: 1.12 }],
    [27, { img: 'uika_cap', fx: 0.4, fy: 0.4, out: true }],
    [29, { img: 'uika_nyamu', fx: 0.35 }],
    [31, { kind: 'duo', img: 'uika_dress', fx: 0.5, fy: 0.3, img2: 'saki_close', fx2: 0.55, fy2: 0.45 }],
    [34, { kind: 'duo', img: 'uika_ep11', fx: 0.5, fy: 0.45, img2: 'uika_ep11', fx2: 0.5, fy2: 0.45, flip2: true }],
    [35, { kind: 'contain', img: 'chara_uika' }],
    [36, { img: 'am_stage' }],
    [37, { img: 'uika_ep11', z0: 1.0, z1: 1.18 }],
    [38, { img: 'uika_cap', fx: 0.4, fy: 0.4, out: true }],
  ],
  outro: [
    [0, { img: 'mygo_group' }], [1, { img: 'am_group', out: true }],
  ],
};

// overlays drawn above the frame, per section
function overlays(c, t) {
  const s = sectionAt(t), S = s;
  if (s.id === 'misaki') {
    memePop(c, t, S.at(0, '美咲'), S.L(1) + 0.2, 'misaki_chibi', 860, 1630, 250, 0.07);
    sakura(c, t, live(t, S.L(4) - 0.2, S.E(5) + 0.4, 0.6, 0.6));
    redCircle(c, t, S.at(5, '傲娇'), 0.27, 0.36, 0.15, 0.26, S.L(6));
    redCircle(c, t, S.at(5, '傲娇') + 0.2, 0.72, 0.33, 0.15, 0.26, S.L(6));
    if (t > S.L(10) && t < S.L(12)) glow(c, W / 2, FRAME.y + FRAME.h / 2, 420, 0.25 + 0.1 * Math.sin(t * 2));
    memePop(c, t, S.at(12, '夹在'), S.L(14), 'misaki_chibi2', 840, 1640, 230, -0.06);
    memePop(c, t, S.at(14, '吐槽'), S.L(15), 'misaki_michelle', 300, 1640, 220, 0.05);
    redCircle(c, t, S.at(15, '同类') - 0.1, 0.25, 0.4, 0.14, 0.25, S.L(16));
    redCircle(c, t, S.at(15, '有咲'), 0.77, 0.32, 0.14, 0.25, S.L(16));
  }
  if (s.id === 'morfo-ras') {
    redCircle(c, t, S.at(1, 'LOCK') + 0.1, 0.5, 0.33, 0.13, 0.27, S.t1);
  }
  if (s.id === 'anon') {
    redCircle(c, t, S.at(1, '第一集'), 0.13, 0.78, 0.1, 0.17, S.L(2));
    memePop(c, t, S.at(9, '落井下石'), S.L(10), 'soyo_chibi', 850, 1640, 220, 0.06);
  }
  if (s.id === 'soyo') {
    redCircle(c, t, S.at(2, '表'), 0.26, 0.38, 0.14, 0.27, S.L(3));
    redCircle(c, t, S.at(2, '里') + 0.05, 0.71, 0.45, 0.14, 0.3, S.L(3));
    memePop(c, t, S.at(1, '动漫角色') - 0.3, S.L(2), 'soyo_chibi', 830, 1640, 240, 0.06);
  }
  if (s.id === 'taki') {
    flash(c, t, S.at(1, '凶'), '255,255,255', 0.3, 0.5);
  }
  if (s.id === 'uika') {
    fastForward(c, t, S.at(2, '跳过') - 0.3, S.L(3));
    memePop(c, t, S.at(4, '小姨'), S.L(5), 'uika_glasses', 820, 1650, 240, 0.07);
    // the light in the dark forest
    const lg = Math.max(live(t, S.at(8, '一缕光') - 0.2, S.L(11), 1.2, 0.8) * (0.6 + 0.5 * ez(t, S.L(9), 2.5)),
      live(t, S.L(17), S.L(19) + 0.3, 1.0, 1.0) * 0.8);
    glow(c, FRAME.x + FRAME.w * 0.62, FRAME.y + FRAME.h * 0.3, 360 + 260 * lg, 0.55 * lg);
    glow(c, FRAME.x + FRAME.w * 0.5, FRAME.y + FRAME.h * 0.45, 520, 0.35 * live(t, S.L(23), S.L(27), 1.2, 0.8), '255,246,220');
    memePop(c, t, S.at(36, '狗爬'), S.L(37), 'uika_face', 810, 1650, 230, -0.05);
    memePop(c, t, S.at(39, '小姨'), S.t1 - 0.1, 'uika_chibi', 840, 1640, 260, 0.06);
  }
}

// letterbox + darkening for the uika section's quietest beats
function moodBars(c, t) {
  const s = sectionAt(t); if (s.id !== 'uika') return;
  const k = live(t, s.L(7) - 0.4, s.L(21), 1.2, 1.0) * 0.55 + live(t, s.L(37) - 0.2, s.E(37) + 0.6, 0.8, 0.8) * 0.45;
  if (k <= 0) return;
  c.fillStyle = `rgba(0,0,0,${0.55 * k})`; c.fillRect(0, 0, W, FRAME.y); c.fillRect(0, FRAME.y + FRAME.h, W, H - FRAME.y - FRAME.h);
}
