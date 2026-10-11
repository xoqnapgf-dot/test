// ─── scenes: intro, ksm · 声音, ksm · 距离 ────────────────────────────────────

const PICKED = [1, 2, 5, 6, 7, 18, 19, 20, 21, 22, 23];
const st = (n) => 'st' + String(n).padStart(4, '0');

SCENES.intro = (c, t, S) => {
  bg(c, t, '#ff8fb1', '#7b5cff', { blobs: [[200, 400, 600, 'rgba(255,240,150,.55)'], [900, 1300, 700, 'rgba(90,220,255,.4)']], dots: 'rgba(255,255,255,.22)', stripes: '#fff' });
  const t0 = S.t0;
  // title
  const kt = ez(t, t0 + 0.1, 0.6, ease.back);
  withT(c, W / 2, 400, Math.sin(t * 1.3) * 0.015, kt, () => {
    txt(c, '邦多利', -60, -70, { size: 170, fam: F.black, ls: 10, color: '#fff', stroke: '#2a1846', sw: 26, shadow: '#ff3b6b', sy: 14 });
    txt(c, '角色个人向点评', 0, 95, { size: 100, fam: F.black, color: '#fff7c2', stroke: '#2a1846', sw: 20, ls: 4 });
  });
  // seal 上
  if (t > t0 + 0.6) {
    const k = ez(t, t0 + 0.6, 0.35, ease.back);
    withT(c, 840, 300, -0.2, lerp(2.2, 1, k), () => {
      c.globalAlpha *= clamp(k * 2);
      c.fillStyle = '#e8202f'; c.beginPath(); c.arc(0, 0, 82, 0, TAU); c.fill();
      c.strokeStyle = '#fff'; c.lineWidth = 6; c.beginPath(); c.arc(0, 0, 66, 0, TAU); c.stroke();
      txt(c, '上', 0, 4, { size: 100, fam: F.punch, color: '#fff' });
    });
  }
  // 25 chibis of the five bands → the 11 this episode talks about
  const g0 = S.L(0) + 0.1, gSel = S.at(0, '印象');
  for (let i = 0; i < 25; i++) {
    const col = i % 5, row = Math.floor(i / 5), id = i + 1;
    const x = 160 + col * 190, y = 700 + row * 150 - (1 - ez(t, g0 + i * 0.03, 0.4)) * 60;
    const k = pop(t, g0 + i * 0.03, 0.4); if (k <= 0) continue;
    const chosen = PICKED.includes(id), sel = ez(t, gSel + (chosen ? PICKED.indexOf(id) * 0.07 : 0), 0.35);
    const size = 150 * k * (chosen ? 1 + sel * 0.12 : 1 - sel * 0.25);
    const filter = !chosen && sel > 0 ? `grayscale(${sel}) brightness(${1 + sel * 0.15})` : undefined;
    const al = !chosen ? 1 - sel * 0.55 : 1;
    if (chosen && sel > 0) { c.save(); c.globalAlpha = al * sel * 0.8; c.fillStyle = '#fff7a8'; c.beginPath(); c.arc(x, y, 78, 0, TAU); c.fill(); c.restore(); }
    img(c, st(id), x, y + Math.sin(t * 3 + i) * (chosen ? sel * 6 : 0), size, { alpha: al, filter });
  }
};

SCENES['ksm-voice'] = (c, t, S) => {
  // palette: warm → autumn dusk → jacket blue for the song
  const autumn = ez(t, S.L(3), 1.2, ease.io), song = ez(t, S.L(6) - 0.3, 0.9, ease.io);
  const top = song > 0 ? mix('#f6b26b', '#1b3fae', song) : mix('#ffb37a', '#f6b26b', autumn);
  const bot = song > 0 ? mix('#7a3b55', '#5b2fb8', song) : mix('#ff6f61', '#7a3b55', autumn);
  bg(c, t, top, bot, { blobs: [[300, 500, 600, 'rgba(255,230,180,.35)'], [800, 1200, 650, song > 0 ? 'rgba(120,200,255,.35)' : 'rgba(255,140,90,.3)']], dots: 'rgba(255,255,255,.12)' });

  // ── part A: lines 0–5 (声线 / 笑着说再见 / 秋天 / 毕业 / 舍不得)
  const endA = S.L(6) - 0.2;
  if (t < endA + 0.6) {
    const outA = 1 - ez(t, endA, 0.5);
    c.save(); c.globalAlpha *= outA;
    // ksm cutout: energetic first, soft from line 2
    const kIn = ez(t, S.t0 + 0.05, 0.7, ease.back), soft = ez(t, S.L(2) - 0.1, 0.6);
    const sway = Math.sin(t * 0.9) * 10;
    if (soft < 1) chara(c, 'ksm_go', lerp(1300, 650, kIn), 640 + sway, 1500, { alpha: 1 - soft, shadow: 'rgba(80,20,0,.3)' });
    if (soft > 0) chara(c, 'ksm_soft', 640 - (1 - soft) * 80, 600 + sway, 1450 * (1 + (t - S.L(2)) * 0.004), { alpha: soft * (1 - ez(t, S.L(3) + 0.2, 0.8) * 0.55 * (1 - ez(t, S.L(5) - 0.2, 0.5))) });
    namePlate(c, 60, 860, ez(t, S.at(0, 'ksm'), 0.5) * (1 - ez(t, S.L(1) + 1.6, 0.5)), '户山香澄 · ksm', "Poppin'Party · 吉他 & 主唱", '#ff5522');
    // line 1: voice waves
    const wv = live(t, S.L(1) + 0.3, S.L(2), 0.6, 0.4);
    if (wv > 0) {
      c.save(); c.globalAlpha *= wv; c.lineWidth = 6; c.lineCap = 'round';
      for (let j = 0; j < 4; j++) {
        c.strokeStyle = hexA(['#ffffff', '#ffe39a', '#ffb38a', '#ff8a8a'][j], 0.8 - j * 0.15); c.beginPath();
        for (let x = 0; x <= W; x += 12) { const y = 1150 + j * 34 + Math.sin(x * 0.012 + t * 4 + j) * 40 * Math.sin(x / W * Math.PI) * (0.6 + 0.4 * Math.sin(t * 2 + j)); x ? c.lineTo(x, y) : c.moveTo(x, y); }
        c.stroke();
      }
      c.restore();
    }
    // line 2: a hand waving goodbye in warm backlight
    const k2 = live(t, S.L(2), S.L(3) + 0.4, 0.5, 0.5);
    if (k2 > 0) {
      const g = c.createRadialGradient(820, 420, 20, 820, 420, 520); g.addColorStop(0, `rgba(255,236,190,${0.55 * k2})`); g.addColorStop(1, 'rgba(255,236,190,0)');
      c.fillStyle = g; c.fillRect(300, -100, 1040, 1040);
      withT(c, 210, 1180, Math.sin((t - S.L(2)) * 5) * 0.32, 1, () => hand(c, 0, 0, 95, '#fff3e0', k2));
    }
    // lines 3–4: two polaroids (秋天 / 毕业)
    const p1 = ez(t, S.at(3, '秋天') - 0.25, 0.6, ease.back), p2 = ez(t, S.at(4, '毕业') - 0.3, 0.6, ease.back);
    const pOut = 1 - ez(t, S.L(5) + 0.1, 0.5);
    c.save(); c.globalAlpha *= pOut;
    polaroid(c, 310, 760, 430, 430, -0.09, p1, '', (x, y, w, h) => {
      const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#ffcf8a'); g.addColorStop(1, '#e8613c'); c.fillStyle = g; c.fillRect(x, y, w, h);
      c.fillStyle = '#ffeaa8'; c.beginPath(); c.arc(x + w * 0.7, y + h * 0.42, 60, 0, TAU); c.fill();
      c.fillStyle = '#5a2a2a'; c.fillRect(x, y + h * 0.78, w, h * 0.22);
      c.fillStyle = '#4a2020'; c.fillRect(x + w * 0.22, y + h * 0.35, 18, h * 0.45);
      for (let i = 0; i < 26; i++) leaf(c, x + w * 0.24 + Math.cos(i * 2.4) * (40 + (i % 5) * 18), y + h * 0.33 + Math.sin(i * 2.4) * (30 + (i % 4) * 12), 16, i, ['#d9452b', '#f0762a', '#f6c04a'][i % 3]);
      for (let i = 0; i < 6; i++) { const yy = ((t * 50 + i * 60) % h); leaf(c, x + 60 + i * 55 + Math.sin(t + i) * 15, y + yy, 12, t * 2 + i, '#f2a33a'); }
    });
    polaroid(c, 770, 840, 430, 430, 0.08, p2, '', (x, y, w, h) => {
      c.fillStyle = '#1f4d3a'; c.fillRect(x, y, w, h);
      c.fillStyle = '#7a5230'; c.fillRect(x, y + h - 26, w, 26);
      const s = '毕业快乐', kk = clamp((t - S.at(4, '毕业')) / 1.2);
      for (let i = 0; i < s.length; i++) txt(c, s[i], x + w / 2 - 120 + i * 80, y + h * 0.42, { size: 78, fam: F.hand, color: '#f4f1e6', alpha: clamp(kk * 4 - i) });
      txt(c, '✿', x + w * 0.82, y + h * 0.7, { size: 44, fam: F.black, color: '#f6b8c8', alpha: clamp(kk * 4 - 3) });
      c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(x + 20, y + h * 0.68, w * 0.5, 6);
    });
    c.restore();
    leaves(c, t, S.L(3) - 0.5, 22, autumn * (1 - song));
    // line 5: the smile above the water, a bluer, rippling reflection below
    const l5 = S.L(5), k5 = live(t, l5 - 0.1, endA + 0.2, 0.5, 0.4);
    if (k5 > 0) {
      const wy = 1060, fx = 640 + Math.sin(t * 0.9) * 10, fy = 600 + Math.sin(t * 0.9) * 10, size = 1450 * (1 + (t - S.L(2)) * 0.004);
      c.save(); c.globalAlpha *= k5;
      c.beginPath(); c.rect(0, wy, W, H - wy); c.clip();
      const wg = c.createLinearGradient(0, wy, 0, H); wg.addColorStop(0, 'rgba(40,60,120,.85)'); wg.addColorStop(1, 'rgba(20,20,60,.95)'); c.fillStyle = wg; c.fillRect(0, wy, W, H - wy);
      const kr = ez(t, S.at(5, '笑容底下') - 0.2, 1.0);
      for (let i = 0; i < 28; i++) {
        const y0 = wy + i * 18; c.save(); c.beginPath(); c.rect(0, y0, W, 18); c.clip();
        c.translate(Math.sin(t * 2.4 + i * 0.7) * (4 + i * 0.8), 2 * wy); c.scale(1, -1);
        chara(c, 'ksm_soft', fx, fy, size, { alpha: kr * (0.7 - i * 0.018), filter: 'saturate(.35) hue-rotate(185deg) brightness(.85)' });
        c.restore();
      }
      c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, wy); c.lineTo(W, wy); c.stroke();
      for (let i = 0; i < 5; i++) { const r = (Math.max(0, t - l5) * 90 + i * 70) % 340; c.strokeStyle = `rgba(255,255,255,${0.35 * (1 - r / 340)})`; c.lineWidth = 2; c.beginPath(); c.ellipse(560, wy + 40, r, r * 0.12, 0, 0, TAU); c.stroke(); }
      c.restore();
    }
    c.restore();
  }

  // ── part B: the song
  if (t > S.L(6) - 0.4) {
    const kB = ez(t, S.L(6) - 0.3, 0.7);
    c.save(); c.globalAlpha *= kB;
    // stars
    particles(c, t, 70, 5, (a, b, d) => { c.fillStyle = hexA('#ffffff', 0.25 + 0.6 * Math.abs(Math.sin(t * (1 + d * 2) + a * 20))); c.beginPath(); c.arc(a * W, b * 1300 + 150, 1.5 + d * 3, 0, TAU); c.fill(); });
    const lv = vizLevel(t), climax = ez(t, S.L(9) - 0.2, 0.5), pause = ez(t, S.E(12) + 0.1, 1.2);
    // disc + jacket
    const side = climax * (1 - pause);
    const cx = lerp(W / 2, 230, side), cy = lerp(lerp(700, 640, pause), 430, side), js = lerp(lerp(520, 600, pause), 300, side) * (1 + lv * 0.03);
    rays(c, cx, cy, 1100, t, '#ffffff', 16, 0.08 + 0.12 * climax);
    // radial visualizer
    c.save(); c.translate(cx, cy);
    for (let i = 0; i < 64; i++) {
      const b = vizLevel(t, i % 8), a = (i / 64) * TAU + t * 0.2, r0 = js * 0.62, len = 20 + b * (90 + 120 * climax);
      c.strokeStyle = hexA(i % 2 ? '#9fd8ff' : '#ffd36b', 0.85); c.lineWidth = 9; c.lineCap = 'round';
      c.beginPath(); c.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); c.lineTo(Math.cos(a) * (r0 + len), Math.sin(a) * (r0 + len)); c.stroke();
    }
    c.restore();
    // CD sliding out of jacket
    const cdK = ez(t, S.L(6) + 0.5, 1.0);
    withT(c, cx + cdK * js * 0.32, cy, t * 1.6, 1, () => {
      const r = js * 0.47; const g = c.createRadialGradient(0, 0, r * 0.1, 0, 0, r);
      g.addColorStop(0, '#eef4ff'); g.addColorStop(0.5, '#b9c7ff'); g.addColorStop(0.75, '#ffd6f2'); g.addColorStop(1, '#a7f0ff');
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
      c.fillStyle = '#ff5522'; c.beginPath(); c.arc(0, 0, r * 0.28, 0, TAU); c.fill();
      c.fillStyle = '#1b3fae'; c.beginPath(); c.arc(0, 0, r * 0.07, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, r * 0.8, -0.6, 0.4); c.stroke();
    });
    img(c, 'jk_mae', cx - cdK * js * 0.12, cy, js, { shadow: 'rgba(0,0,40,.45)', blur: 40 });
    txt(c, '前へススメ！', cx, cy + js / 2 + lerp(95, 50, side), { size: lerp(96, 50, side), fam: F.black, color: '#fff', stroke: '#1b2a7a', sw: lerp(18, 10, side), alpha: ez(t, S.at(6, '前へ'), 0.4) });
    txt(c, "Poppin'Party", cx, cy + js / 2 + lerp(175, 95, side), { size: lerp(46, 28, side), fam: F.round, color: '#ffd36b', alpha: ez(t, S.at(6, '前へ') + 0.3, 0.4), ls: 6 });

    // line 8: waving hands (the jacket's hand) — 毕业季
    const k8 = live(t, S.at(8, '笑着挥手') - 0.2, S.L(9), 0.4, 0.3);
    if (k8 > 0) {
      [[170, 330], [910, 330]].forEach(([x, y], i) => withT(c, x, y, Math.sin(t * 7 + i * 2) * 0.35, 1, () => hand(c, 0, 0, 60, '#ffe9a8', k8)));
    }
    // lines 9–11: ksm returns, determined
    const kK = live(t, S.L(9) + 0.2, S.E(12) - 0.2, 0.5, 0.6);
    if (kK > 0) {
      const [sx, sy] = shake(t, S.at(10, '嘶吼'), 18, 0.5);
      focusLines(c, 540, 700, t, kK * (0.25 + 0.35 * ez(t, S.at(10, '嘶吼'), 0.2) * (1 - ez(t, S.L(11), 0.5))));
      chara(c, 'ksm_go', 640 + sx + (1 - kK) * 300, 640 + sy, 1350, { alpha: kK, shadow: 'rgba(0,0,40,.5)' });
      // line 10: a shock ring and flash on the 嘶吼
      const tS = S.at(10, '嘶吼'), kS = ramp(t, tS - 0.05, 0.6);
      if (kS > 0 && kS < 1) {
        c.strokeStyle = `rgba(255,255,255,${0.8 * (1 - kS)})`; c.lineWidth = 18 * (1 - kS); c.beginPath(); c.arc(640, 640, 120 + kS * 700, 0, TAU); c.stroke();
        c.fillStyle = `rgba(255,255,255,${0.35 * (1 - kS) * (1 - kS)})`; c.fillRect(0, 0, W, H);
      }
    }
    // song timeline (lines 7–11), hidden during the final pause
    const tlK = live(t, S.L(7) - 0.2, S.L(12) + 0.2, 0.5, 0.4);
    if (tlK > 0 && window.VIZ) {
      const x0 = 90, x1 = W - 90, y = 1290, env = VIZ.song, dur = VIZ.songDur;
      c.save(); c.globalAlpha *= tlK;
      c.fillStyle = 'rgba(10,20,60,.45)'; rrect(c, 60, 1200, W - 120, 175, 28); c.fill();
      const ph = songPos(t);
      for (let i = 0; i < env.length; i++) {
        const x = lerp(x0, x1, i / (env.length - 1)), sec = (i / (env.length - 1)) * dur, h = 8 + env[i] / 255 * 62;
        c.fillStyle = sec < ph ? '#ffd36b' : 'rgba(255,255,255,.45)'; c.fillRect(x - 2, y - h / 2, 4, h);
      }
      // regions
      const reg = (s0, s1, label, col, k) => {
        if (k <= 0) return; const a = lerp(x0, x1, s0 / dur), b = lerp(x0, x1, s1 / dur);
        c.fillStyle = hexA(col, 0.35 * k); rrect(c, a, y - 46, b - a, 92, 12); c.fill();
        chip(c, label, clamp((a + b) / 2, 230, W - 230), 1170, { size: 40, bg: col, color: '#fff', scale: ease.back(k), shadow: false });
      };
      reg(0, 20, '0:00', '#ff7aa8', ez(t, S.L(7), 0.4) * (1 - ez(t, S.L(9), 0.4)));
      reg(261, 296, '4:21', '#ff5522', ez(t, S.L(9) + 0.1, 0.4));
      const px = lerp(x0, x1, clamp(ph / dur)); c.fillStyle = '#fff'; c.fillRect(px - 3, y - 50, 6, 100); c.beginPath(); c.arc(px, y - 52, 10, 0, TAU); c.fill();
      c.restore();
    }
    // line 11: 带着所有人往前走 — the band marches forward
    const k11 = live(t, S.L(11) - 0.1, S.L(12) + 0.15, 0.4, 0.4);
    if (k11 > 0) {
      const walk = (t - S.L(11)) * 140;
      [1, 2, 3, 4, 5].forEach((id, i) => img(c, st(id), 160 + i * 150 + walk * 0.3 - (1 - k11) * 200, 1060 + Math.abs(Math.sin(t * 7 + i)) * -26, 170, { alpha: k11 }));
      arrowLine(c, 120, 1180, 980, 1180, { color: '#ffd36b', lw: 14, k: ez(t, S.L(11), 0.8), alpha: k11 });
      txt(c, '前へ！', 900, 1040, { size: 90, fam: F.punch, color: '#ffd36b', stroke: '#1b2a7a', sw: 14, alpha: k11 });
    }
    // line 12: 被戳到了 — heart pierced by an arrow
    const k12 = live(t, S.at(12, '戳到'), S.E(12) + 0.4, 0.3, 0.4);
    if (k12 > 0) {
      const hx = 560, hy = 960, s = 120 * ease.back(clamp(k12 * 1.2));
      c.save(); c.fillStyle = '#ff3b6b'; heart(c, hx, hy, s); c.fill(); c.restore();
      arrowLine(c, hx - 300, hy - 170, hx + 160, hy + 80, { color: '#fff', lw: 10, k: ez(t, S.at(12, '戳到'), 0.25) });
    }
    // final pause: big title
    if (pause > 0) {
      txt(c, '♪', 160, 1200, { size: 110, fam: F.black, color: '#ffd36b', alpha: pause * (0.6 + 0.4 * Math.sin(t * 4)) });
      txt(c, '♪', 930, 1130, { size: 80, fam: F.black, color: '#9fd8ff', alpha: pause * (0.6 + 0.4 * Math.sin(t * 4 + 2)) });
    }
    c.restore();
  }
};

SCENES['ksm-orbit'] = (c, t, S) => {
  bg(c, t, '#1c1838', '#3d2b63', { blobs: [[540, 760, 700, 'rgba(255,120,80,.22)'], [200, 1500, 500, 'rgba(120,140,255,.18)']], dots: 'rgba(255,255,255,.06)' });
  particles(c, t, 60, 9, (a, b, d) => { c.fillStyle = hexA('#ffffff', 0.15 + 0.4 * Math.abs(Math.sin(t * (0.6 + d) + a * 30))); c.beginPath(); c.arc(a * W, b * H, 1 + d * 2.2, 0, TAU); c.fill(); });
  const cx = 540, cy = 780;
  // line 0: caution tape
  const k0 = live(t, S.L(0), S.L(1) + 0.6, 0.4, 0.5);
  if (k0 > 0) {
    withT(c, W / 2, 400, -0.12, 1, () => {
      c.globalAlpha *= k0; const w = 1500 * ez(t, S.L(0), 0.5);
      c.fillStyle = '#ffd400'; c.fillRect(-w / 2, -60, w, 120);
      c.save(); c.beginPath(); c.rect(-w / 2, -60, w, 120); c.clip(); c.fillStyle = '#1a1a1a';
      for (let x = -900 + ((t * 120) % 120); x < 900; x += 120) { c.beginPath(); c.moveTo(x, -60); c.lineTo(x + 60, -60); c.lineTo(x + 0, 60); c.lineTo(x - 60, 60); c.closePath(); c.fill(); }
      c.restore();
      [-330, 0, 330].forEach((x) => warnSign(c, x, 0, 70, '#1a1a1a', '#ffd400'));
    });
  }
  // orbit diagram from line 1 on
  const kD = ez(t, S.L(1) - 0.2, 0.7);
  if (kD > 0) {
    c.save(); c.globalAlpha *= kD;
    const nFriends = Math.floor(lerp(0, 46, ez(t, S.L(3), 3.5)) + lerp(0, 40, ez(t, S.at(4, '太多'), 1.2)));
    const rings = [200, 330, 450];
    rings.forEach((r, i) => { c.strokeStyle = i === 0 ? hexA('#ffb38a', 0.35 + 0.5 * ez(t, S.L(5), 0.5)) : 'rgba(255,255,255,.14)'; c.lineWidth = i === 0 ? 4 + 6 * ez(t, S.L(6), 0.5) : 2; c.setLineDash(i ? [8, 12] : []); c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke(); });
    c.setLineDash([]);
    // friend dots in the outer rings
    const cols = ['#ff7aa8', '#9fd8ff', '#ffd36b', '#8cffd9', '#c9a6ff', '#ff9b7a', '#b8f07a'];
    for (let i = 0; i < nFriends; i++) {
      const ring = 1 + (i % 2), r = rings[ring] + (hash(i) - 0.5) * 60, a = hash(i + 50) * TAU + t * (ring === 1 ? 0.08 : -0.05);
      const k = ez(t, S.L(3) + i * 0.06, 0.3, ease.back);
      c.fillStyle = cols[i % cols.length]; c.globalAlpha = kD * 0.85; c.beginPath(); c.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 14 * k, 0, TAU); c.fill();
    }
    c.globalAlpha = kD;
    if (nFriends > 0) chip(c, '朋友 × ' + (nFriends > 80 ? '99+' : nFriends), 830, 330, { size: 46, bg: '#ffd36b', color: '#2a1846', alpha: ez(t, S.L(3), 0.3), rot: 0.06 });
    // inner circle: PPP members
    const kI = ez(t, S.L(5) - 0.1, 0.6);
    [2, 3, 4, 5].forEach((id, i) => {
      const a = -Math.PI / 2 + i * (TAU / 4) + t * 0.12;
      if (kI > 0) img(c, st(id), cx + Math.cos(a) * 200, cy + Math.sin(a) * 200, 150 * ease.back(clamp(kI * 1.3 - i * 0.1)), {});
    });
    if (kI > 0) chip(c, '4 / 4', cx, cy + 300 + 10, { size: 44, bg: '#ff5522', color: '#fff', scale: ease.back(kI), alpha: kI });
    // ksm at the centre
    const glow = c.createRadialGradient(cx, cy, 10, cx, cy, 170); glow.addColorStop(0, 'rgba(255,170,120,.7)'); glow.addColorStop(1, 'rgba(255,170,120,0)');
    c.fillStyle = glow; c.fillRect(cx - 170, cy - 170, 340, 340);
    img(c, st(1), cx, cy, 220 * ease.back(clamp(kD * 1.2)));

    // "你": the grey dot
    const kY = ez(t, S.at(1, '你'), 0.5, ease.back);
    if (kY > 0) {
      // path: outer → tries to get in (line 6) → bounces back
      const tIn = S.at(6, '挤进去') - 0.9, bounce = ez(t, tIn, 0.7, ease.io) - ez(t, tIn + 0.7, 0.6, ease.out);
      const ra = 520 - 330 * clamp(bounce), aa = 0.75;
      const yx = cx + Math.cos(aa) * ra, yy = cy + Math.sin(aa) * ra;
      if (t > tIn + 0.55 && t < tIn + 1.6) { const kk = 1 - ramp(t, tIn + 0.7, 0.9); c.strokeStyle = hexA('#ff4058', kk); c.lineWidth = 12; c.beginPath(); c.arc(cx, cy, 200, aa - 0.4, aa + 0.4); c.stroke(); padlock(c, cx + Math.cos(aa) * 200 + 70, cy + Math.sin(aa) * 200 - 40, 56, '#ff4058', kk); }
      // line 7: occasional beam ksm → 你 (看机会、看场合)
      const k7 = live(t, S.L(7), S.L(8) + 0.2, 0.3, 0.3);
      if (k7 > 0 && Math.sin(t * 9) > 0.2) { c.strokeStyle = hexA('#ffd36b', k7 * 0.9); c.lineWidth = 5; c.setLineDash([14, 10]); c.lineDashOffset = -t * 60; c.beginPath(); c.moveTo(cx, cy); c.lineTo(yx, yy); c.stroke(); c.setLineDash([]); }
      // line 8: one-way arrows
      const k8 = ez(t, S.L(8), 0.8);
      if (k8 > 0) {
        const dx = cx - yx, dy = cy - yy, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
        arrowLine(c, yx + nx * 18, yy + ny * 18, cx + nx * 18 - dx / L * 120, cy + ny * 18 - dy / L * 120, { color: '#9fd8ff', lw: 6 + 10 * k8, k: k8 });
        c.globalAlpha = kD * (1 - k8 * 0.75);
        arrowLine(c, cx - nx * 18 + dx / L * -120, cy - ny * 18 + dy / L * -120, yx - nx * 18, yy - ny * 18, { color: '#ffd36b', lw: 4, dash: [10, 12] });
        c.globalAlpha = kD;
      }
      // line 9: magnifier
      const k9 = ez(t, S.at(9, '这种尴尬') - 0.2, 0.6, ease.back);
      c.fillStyle = '#c9c4d6'; c.beginPath(); c.arc(yx, yy, 34 * kY * (1 + k9 * 0.2), 0, TAU); c.fill();
      txt(c, '你', yx, yy + 2, { size: 40 * kY, fam: F.black, color: '#2a1846' });
      // line 2: a sweat drop on 你
      const k2 = live(t, S.at(2, '尴尬') - 0.1, S.L(3) + 0.3, 0.3, 0.3);
      if (k2 > 0) { c.fillStyle = hexA('#7fc8ff', k2); c.beginPath(); c.ellipse(yx + 40, yy - 34 + ((t * 30) % 16), 10, 16, 0, 0, TAU); c.fill(); }
      if (k9 > 0) {
        const mx = 760, my = 1180, mr = 150 * k9;
        c.strokeStyle = '#fff'; c.lineWidth = 14; c.beginPath(); c.arc(mx, my, mr, 0, TAU); c.stroke();
        c.lineWidth = 22; c.beginPath(); c.moveTo(mx + mr * 0.7, my + mr * 0.7); c.lineTo(mx + mr * 1.25, my + mr * 1.25); c.stroke();
        c.save(); c.beginPath(); c.arc(mx, my, mr - 7, 0, TAU); c.clip(); c.fillStyle = 'rgba(255,255,255,.92)'; c.fillRect(mx - mr, my - mr, mr * 2, mr * 2);
        const zoom = 1 + (t - S.at(9, '这种尴尬')) * 0.6;
        const zs = 70 * Math.min(zoom, 2.4);
        c.fillStyle = '#c9c4d6'; c.beginPath(); c.arc(mx, my + 10, zs, 0, TAU); c.fill();
        txt(c, '你', mx, my + 12, { size: zs * 1.1, fam: F.black, color: '#2a1846' });
        for (let j = 0; j < 3; j++) { const dy = ((t * 60 + j * 30) % 70); c.fillStyle = '#7fc8ff'; c.beginPath(); c.ellipse(mx + zs * 0.9 + j * 18, my - zs * 0.6 + dy, 10, 15, 0, 0, TAU); c.fill(); }
        c.restore();
        txt(c, '× ∞', mx + 170, my - 150, { size: 90, fam: F.round, color: '#ff4058', stroke: '#fff', sw: 10, alpha: ez(t, S.at(9, '无限'), 0.3) });
      }
    }
    c.restore();
  }
};
