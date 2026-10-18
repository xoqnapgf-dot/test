// ─── sound-effect cues: [time, name, gain] — exported by tools/render.mjs cues, mixed by build_audio.py ──
// kept sparse on purpose: a soft whoosh between sections, a pop for each meme, a tick when a circle is drawn
function sfxCues() {
  const out = [], add = (t, n, g = 1) => out.push([+t.toFixed(3), n, g]);
  TL.sections.forEach((s, i) => { if (i) add(s.t0 + 0.02, 'whoosh', 0.45); });
  const S = SEC;
  let s = S.misaki;
  add(s.at(0, '美咲'), 'pop', 0.6); add(s.at(5, '傲娇'), 'tick', 0.6); add(s.at(12, '夹在'), 'pop', 0.6); add(s.at(14, '吐槽'), 'pop', 0.6);
  add(s.at(15, '有咲'), 'tick', 0.6);
  s = S['morfo-ras']; add(s.at(1, 'LOCK') + 0.1, 'tick', 0.6);
  s = S.anon; add(s.at(1, '第一集'), 'tick', 0.6); add(s.at(9, '落井下石'), 'pop', 0.6); add(s.at(10, '幼稚'), 'boing', 0.5);
  s = S.soyo; add(s.at(1, '动漫角色') - 0.3, 'pop', 0.6); add(s.at(2, '表'), 'tick', 0.6);
  s = S.taki; add(s.at(1, '凶'), 'hit', 0.5);
  s = S.uika; add(s.at(2, '跳过') - 0.3, 'whoosh', 0.6); add(s.at(4, '小姨'), 'pop', 0.6); add(s.at(8, '一缕光') - 0.2, 'chime', 0.35);
  add(s.at(36, '狗爬'), 'pop', 0.5); add(s.at(39, '小姨'), 'pop', 0.6);
  return out.filter((x) => isFinite(x[0])).sort((a, b) => a[0] - b[0]);
}
