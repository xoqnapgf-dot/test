#!/usr/bin/env node
/*
 * Build + validate the Suno v6 remaster pack.
 *
 *   node tools/build.js --check   validate only (limits, tag syntax, lyric-text integrity)
 *   node tools/build.js           validate, then write data/songs.js and the encrypted zip
 *
 * Song sources live in src/songs/*.txt (see README for the format).
 * The original lyric files live in src/originals/. Every remastered lyric is compared
 * with the original line range it was made from: after removing [tags], punctuation and
 * whitespace, the two character streams must be identical, so the lyrics themselves are
 * never altered - only tags, punctuation, line breaks and blank lines are added.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const os = require('os');

const ROOT = path.join(__dirname, '..');
const SONG_DIR = path.join(ROOT, 'src', 'songs');
const ORIG = {
  f1: fs.readFileSync(path.join(ROOT, 'src', 'originals', 'lyrics-file1.txt'), 'utf8').split(/\r?\n/),
  f2: fs.readFileSync(path.join(ROOT, 'src', 'originals', 'lyrics-file2.txt'), 'utf8').split(/\r?\n/),
};
const LIMIT = { style: 1000, lyrics: 5000, title: 100, exclude: 1000 };
const ZIP_NAME = 'suno-v6-all-songs.zip';
const TXT_NAME = 'suno-v6-all-songs.txt';
const ZIP_PASSWORD = 'test';

const VOCAL_TAGS = /^(Verse|Pre-Chorus|Chorus|Final Chorus|Post-Chorus|Bridge|Hook|Rap|Spoken|Spoken Word|Refrain)\b/i;
const KNOWN_TAGS = /^(This is a \w+ song|Intro|Verse|Pre-Chorus|Chorus|Final Chorus|Post-Chorus|Bridge|Hook|Rap|Spoken|Spoken Word|Interlude|Instrumental Break|Instrumental|Solo|Guitar Solo|Bass Solo|Break|Drop|Build|Breakdown|Outro|End|Silence|Refrain)\b/i;

function parseSong(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const lines = raw.split('\n');
  const meta = { notes: [] };
  const sections = {};
  let cur = null;
  for (const line of lines) {
    const sec = line.match(/^--- (STYLE|EXCLUDE|LYRICS)\s*$/);
    if (sec) { cur = sec[1].toLowerCase(); sections[cur] = []; continue; }
    if (cur) { sections[cur].push(line); continue; }
    const m = line.match(/^#([a-z-]+):\s*(.*)$/);
    if (m) {
      if (m[1] === 'note') meta.notes.push(m[2]);
      else meta[m[1]] = m[2];
    }
  }
  const trim = (arr) => arr.join('\n').replace(/^\n+|\n+$/g, '');
  return {
    file: path.basename(file),
    id: meta.id, slug: meta.slug, title: meta.title, album: meta.album || '',
    lang: meta.lang, orig: meta.orig, vocal: meta.vocal || 'Any', model: meta.model || 'v6',
    weirdness: meta.weirdness, influence: meta.influence, variety: meta.variety || 'Off',
    max: meta.max || 'Off', bpm: meta.bpm || '', length: meta.length || '', dropped: meta.dropped || '',
    titleNote: meta['title-note'] || '', notes: meta.notes,
    style: trim(sections.style || []), exclude: trim(sections.exclude || []), lyrics: trim(sections.lyrics || []),
  };
}

function origText(spec, dropped) {
  const m = /^(f1|f2):(\d+)-(\d+)$/.exec(spec || '');
  if (!m) return null;
  const arr = ORIG[m[1]].slice(+m[2] - 1, +m[3]);
  let t = arr.join('\n');
  if (dropped) for (const d of dropped.split('|').map((s) => s.trim()).filter(Boolean)) {
    if (!t.includes(d)) throw new Error('dropped text not found in original: ' + d);
    t = t.split(d).join('');
  }
  return t;
}
const strip = (s) => s.replace(/\[[^\]\n]*\]|［[^］\n]*］/g, '');
const norm = (s) => strip(s).replace(/[\p{P}\p{S}\p{Z}\s]/gu, '').toLowerCase();

function firstDiff(a, b) {
  const n = Math.min(a.length, b.length);
  let i = 0;
  while (i < n && a[i] === b[i]) i++;
  return i;
}

function validate(s) {
  const errs = [];
  const warns = [];
  const E = (m) => errs.push(m);
  const W = (m) => warns.push(m);
  for (const k of ['id', 'slug', 'title', 'lang', 'orig', 'weirdness', 'influence']) if (!s[k]) E('missing #' + k);
  if (s.model !== 'v6') E('model must be v6 (not v6-mini / v6-wild)');
  if (s.title.length > LIMIT.title) E('title too long');
  if (s.style.length > LIMIT.style) E(`style ${s.style.length} > ${LIMIT.style}`);
  if (s.lyrics.length > LIMIT.lyrics) E(`lyrics ${s.lyrics.length} > ${LIMIT.lyrics}`);
  if (s.exclude.length > LIMIT.exclude) E(`exclude ${s.exclude.length} > ${LIMIT.exclude}`);
  if (!s.style) E('empty style');
  if (!s.exclude) E('empty exclude');
  if (/\b(no|not|without|never|don't|avoid|non)\b/i.test(s.style)) E('style contains a negation word (put it in Exclude): ' + (s.style.match(/\b(no|not|without|never|don't|avoid|non)\b/i) || [])[0]);
  if (/[　-鿿＀-￯]/.test(s.style)) W('style contains CJK characters');
  if (/[　-鿿＀-￯]/.test(s.exclude)) W('exclude contains CJK characters');

  const ls = s.lyrics.split('\n');
  ls.forEach((line, i) => {
    const at = `lyrics line ${i + 1}`;
    if (/　/.test(line)) E(at + ': full-width space');
    if (/^\s|\s$/.test(line) && line.length) W(at + ': leading/trailing whitespace');
    const tag = line.match(/^\[([^\]]*)\]$/);
    if (tag) {
      const body = tag[1];
      if (!/^[\x20-\x7E]+$/.test(body)) E(at + ': tag is not plain ASCII/English: ' + line);
      if (/\b(no|not|without|never|don't)\b/i.test(body)) E(at + ': tag contains a negation word: ' + line.slice(0, 80));
      const words = body.split(/\s+/).length;
      if (words > 50) E(at + `: tag has ${words} words (>50)`);
      if (!KNOWN_TAGS.test(body)) W(at + ': unknown tag name ' + line);
      if (VOCAL_TAGS.test(body)) {
        const next = ls[i + 1];
        if (next === undefined || next.trim() === '') E(at + ': vocal tag not directly followed by lyrics');
      }
      return;
    }
    if (line.includes('[')) {
      if (!/\[Silence\]$/.test(line)) E(at + ': bracket inside a lyric line: ' + line);
    }
    const t = line.trim();
    if (t && !t.endsWith('[Silence]') && !/[，。、,.!?！？…～~)）”"—―–•]$/.test(t)) W(at + ': no ending punctuation: ' + t.slice(-12));
  });
  const tagsOnly = ls.filter((l) => l.trim() && !/^\[This is a \w+ song\]$/.test(l));
  const first = tagsOnly[0];
  if (!first || !/^\[(Intro|Verse|Spoken|Rap)/i.test(first)) W('lyrics should open with an [Intro ...] or section tag');
  if (!/\[End\]\s*$/.test(s.lyrics)) W('lyrics do not finish with [End]');

  try {
    const o = origText(s.orig, s.dropped);
    if (o == null) E('bad #orig ' + s.orig);
    else {
      const a = norm(o);
      const b = norm(s.lyrics);
      if (a !== b) {
        const i = firstDiff(a, b);
        E(`lyric text differs from original at normalized index ${i} (orig ${a.length} / new ${b.length}):\n      orig: …${a.slice(Math.max(0, i - 15), i + 25)}…\n      new : …${b.slice(Math.max(0, i - 15), i + 25)}…`);
      }
    }
  } catch (e) { E(e.message); }
  return { errs, warns };
}

function songBlock(s, idx) {
  const rule = '='.repeat(72);
  const sub = '-'.repeat(72);
  const out = [];
  out.push(rule);
  out.push(`#${s.id}  ${s.title}${s.album ? '   ' + s.album : ''}`);
  out.push(rule);
  out.push(`Source / 出处   : ${s.srcLabel}`);
  out.push(`Language / 语言 : ${s.lang}`);
  out.push(`Model / 模型    : ${s.model}  (v6 flagship - not v6-mini, not v6-wild)`);
  out.push(`Vocal Gender    : ${s.vocal}`);
  out.push(`Weirdness       : ${s.weirdness}%`);
  out.push(`Style Influence : ${s.influence}%`);
  out.push(`Variety         : ${s.variety}`);
  out.push(`Max Mode        : ${s.max}`);
  if (s.bpm) out.push(`Tempo           : ${s.bpm} BPM (also written inside Style)`);
  if (s.length) out.push(`Expected length : ${s.length}`);
  if (s.titleNote) out.push(`Title note      : ${s.titleNote}`);
  out.push('');
  out.push(`[TITLE]  (${s.title.length}/${LIMIT.title})`);
  out.push(s.title);
  out.push('');
  out.push(`[STYLE OF MUSIC]  (${s.style.length}/${LIMIT.style})`);
  out.push(s.style);
  out.push('');
  out.push(`[EXCLUDE STYLES]  (${s.exclude.length}/${LIMIT.exclude})`);
  out.push(s.exclude);
  out.push('');
  out.push(`[LYRICS]  (${s.lyrics.length}/${LIMIT.lyrics})`);
  out.push(sub);
  out.push(s.lyrics);
  out.push(sub);
  if (s.notes.length) {
    out.push('');
    out.push('[NOTES / 制作说明]');
    s.notes.forEach((n) => out.push('- ' + n));
  }
  out.push('');
  return out.join('\n');
}

function main() {
  const check = process.argv.includes('--check');
  const files = fs.readdirSync(SONG_DIR).filter((f) => f.endsWith('.txt')).sort();
  const songs = files.map((f) => parseSong(path.join(SONG_DIR, f)));
  let bad = 0;
  let warnCount = 0;
  const ids = new Set();
  songs.forEach((s) => {
    if (ids.has(s.id)) { console.log(`✗ duplicate id ${s.id} (${s.file})`); bad++; }
    ids.add(s.id);
    const { errs, warns } = validate(s);
    const head = `${s.id} ${s.title}`;
    if (errs.length) {
      bad++;
      console.log(`✗ ${head}  [${s.file}]`);
      errs.forEach((e) => console.log('    ERROR ' + e));
    }
    warns.forEach((w) => { warnCount++; console.log(`  ! ${head}: ${w}`); });
    const m = /^(f1|f2):(\d+)-(\d+)$/.exec(s.orig || '');
    s.srcLabel = m ? `${m[1] === 'f1' ? 'lyrics file 1 (歌词)' : 'lyrics file 2 (歌词2)'}, lines ${m[2]}-${m[3]}` : s.orig;
  });
  console.log(`\n${songs.length} songs, ${bad} with errors, ${warnCount} warnings`);
  if (bad) process.exit(1);
  if (check) return;

  // 1) data for the viewer (classic script, works from file://)
  const data = songs.map((s) => ({
    id: s.id, slug: s.slug, title: s.title, titleNote: s.titleNote, album: s.album, lang: s.lang,
    src: s.srcLabel, model: s.model, vocal: s.vocal, weirdness: s.weirdness, influence: s.influence,
    variety: s.variety, max: s.max, bpm: s.bpm, length: s.length,
    style: s.style, exclude: s.exclude, lyrics: s.lyrics, notes: s.notes,
  }));
  fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'data', 'songs.js'), '/* generated by tools/build.js - do not edit */\nwindow.SUNO_SONGS = ' + JSON.stringify(data) + ';\n');

  // 2) one big txt, zipped with a password
  const skipped = fs.readFileSync(path.join(ROOT, 'src', 'skipped.txt'), 'utf8').trim();
  const header = [
    'SUNO v6 REMASTER PACK / Suno v6 リマスター・パック / Suno v6 重制合集',
    `Songs: ${songs.length}   Model: v6 (flagship)   Built: ${new Date().toISOString().slice(0, 10)}`,
    '',
    'HOW TO USE / 使い方 / 用法',
    '  1. Suno > Create > Custom (Advanced). Pick model "v6" (NOT v6-mini, NOT v6-wild).',
    '  2. Paste TITLE, STYLE OF MUSIC, LYRICS and EXCLUDE STYLES (More Options) exactly as shown.',
    '  3. Set Vocal Gender / Weirdness / Style Influence / Variety / Max Mode as listed.',
    '  4. Generate 2-4 takes. Lyric wording is identical to your originals; only tags, punctuation and',
    '     line breaks were added. Each tag sits alone on its own line. Parentheses are sung backing vocals.',
    '',
    'INDEX / 目次 / 目录',
    ...songs.map((s) => `  ${s.id}  ${s.title}${s.album ? '  ' + s.album : ''}  [${s.lang}]`),
    '',
    'NOT PROCESSED (unfinished templates or raw scraps) / 未处理:',
    skipped,
    '',
    '',
  ].join('\n');
  const body = songs.map(songBlock).join('\n\n');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'suno-v6-'));
  const txtPath = path.join(tmp, TXT_NAME);
  fs.writeFileSync(txtPath, header + body + '\n');
  const zipPath = path.join(ROOT, ZIP_NAME);
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
  cp.execFileSync('zip', ['-j', '-9', '-q', '-P', ZIP_PASSWORD, zipPath, txtPath]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`wrote data/songs.js and ${ZIP_NAME} (password: ${ZIP_PASSWORD})`);
}

main();
