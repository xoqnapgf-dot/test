// ─── sound-effect cues: [time, name, gain] — read by tools/build_audio.py via the page ──
// names map to synthesized sounds in tools/sfx.py
function sfxCues() {
  const out = [];
  const add = (t, n, g = 1) => out.push([+t.toFixed(3), n, g]);
  const S = SEC;
  TL.sections.forEach((s, i) => { if (i) add(s.t0 + 0.05, 'whoosh', 0.7); });
  let s = S.intro;
  add(s.t0 + 0.1, 'pop', 0.8); add(s.t0 + 0.6, 'stamp');
  add(s.at(0, '锐评') + 0.35, 'buzz', 0.6); add(s.at(0, '科普') + 0.3, 'buzz', 0.6); add(s.at(0, '纯个人向') - 0.1, 'ding');
  add(s.at(1, '只聊'), 'sparkle', 0.7);
  s = S['ksm-voice'];
  add(s.at(0, 'ksm'), 'pop'); add(s.L(2) + 0.15, 'chime', 0.5); add(s.at(3, '秋天') - 0.25, 'shutter', 0.7); add(s.at(4, '毕业') - 0.3, 'shutter', 0.7);
  add(s.at(10, '嘶吼'), 'thud', 0.7); add(s.at(12, '戳到'), 'pierce', 0.8);
  s = S['ksm-orbit'];
  add(s.L(0), 'alert', 0.5); add(s.at(4, '太多'), 'sparkle', 0.6); add(s.L(5), 'ding', 0.6);
  add(s.at(6, '挤进去') - 0.2, 'boing', 0.8); add(s.at(9, '这种尴尬') - 0.2, 'pop', 0.7);
  s = S.ars;
  add(s.at(0, 'ars') - 0.2, 'whoosh', 0.6); add(s.at(1, '教科书') + 0.2, 'stamp');
  ['一个满嘴', '一个负责'].forEach((w) => add(s.at(3, w) - 0.15, 'tick', 0.8));
  ['一个偷偷', '一个无意'].forEach((w) => add(s.at(4, w) - 0.15, 'tick', 0.8));
  add(s.at(5, '脸红') - 0.15, 'boing', 0.7); add(s.L(6), 'spinup', 0.7);
  add(s.at(7, '戳穿'), 'shock', 0.8); add(s.at(8, '才不是') - 0.2, 'pop'); add(s.at(8, '要命') - 0.1, 'sparkle', 0.7);
  s = S.otae;
  add(s.at(2, '手游') - 0.2, 'rise', 0.6); add(s.at(3, '腹黑') - 0.1, 'dark', 0.7);
  add(s.at(5, '不是腹黑'), 'scratch', 0.9); add(s.at(5, '电波') - 0.2, 'radio', 0.6);
  add(s.at(6, '听不懂'), 'buzz', 0.5); add(s.at(7, '克制'), 'hit'); add(s.at(8, '天经地义'), 'stamp'); add(s.L(9) - 0.1, 'sparkle', 0.7);
  s = S.moca;
  add(s.at(0, '摩卡'), 'pop'); ['短发', '电波系', '吉他手'].forEach((w) => add(s.at(2, w), 'tick'));
  add(s.at(2, '吉他手') + 0.5, 'stamp'); add(s.at(6, '一个表情') + 1.25, 'hit', 0.7);
  [s.at(8, '看到兰'), s.at(8, '撩了'), s.at(8, '凑上去')].forEach((x) => add(x - 0.25, 'pop', 0.7));
  s = S.ran;
  add(s.at(1, '脸红'), 'boing', 0.6); add(s.at(2, '没什么') - 0.25, 'pop', 0.7); add(s.at(3, '反差'), 'ding', 0.7);
  s = S.roselia;
  add(s.at(1, '高压'), 'steam', 0.6); add(s.at(5, '强化版') - 0.2, 'rise', 0.6); add(s.L(6), 'lockon', 0.6);
  s = S.pasupare;
  add(s.at(2, '乐队名'), 'type', 0.6); add(s.at(3, '改观') - 0.2, 'sparkle', 0.7);
  add(s.at(5, '口音') - 0.2, 'pop', 0.7); add(s.at(9, '不太对'), 'buzz', 0.5); add(s.at(10, '武士道'), 'sword', 0.8);
  add(s.at(10, '宝可梦') - 0.25, 'ding', 0.7); add(s.at(12, '工作'), 'stamp', 0.7); add(s.at(14, '改观') - 0.3, 'whoosh', 0.6);
  s = S.outro;
  add(s.L(1) - 0.1, 'stamp');
  return out.filter((x) => isFinite(x[0])).sort((a, b) => a[0] - b[0]);
}
