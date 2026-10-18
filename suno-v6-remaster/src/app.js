/* Suno v6 Remaster - viewer. Classic script, no network, no fetch(): data comes from data/songs.js. */
(function () {
  'use strict';

  var SONGS = window.SUNO_SONGS || [];
  var UI = {
    en: {
      search: 'Search title, language, lyrics…',
      all: 'All',
      shown: function (a, b) { return a + ' of ' + b + ' songs shown'; },
      none: 'No song matches.',
      model: 'Model', vocal: 'Vocal Gender', weird: 'Weirdness', infl: 'Style Influence',
      variety: 'Variety', max: 'Max Mode', bpm: 'Tempo', len: 'Expected length', src: 'Source',
      title: 'Title', style: 'Style of Music', exclude: 'Exclude Styles', lyrics: 'Lyrics',
      copy: 'Copy', copied: 'Copied', copyAll: 'Copy everything', notes: 'Notes (Chinese)',
      chars: function (n, m) { return n + ' / ' + m + ' chars'; },
      titleNote: 'Working title'
    },
    ja: {
      search: 'タイトル・言語・歌詞で検索…',
      all: 'すべて',
      shown: function (a, b) { return b + ' 曲中 ' + a + ' 曲を表示'; },
      none: '該当する曲がありません。',
      model: 'モデル', vocal: 'ボーカル性別', weird: 'Weirdness', infl: 'Style Influence',
      variety: 'Variety', max: 'Max Mode', bpm: 'テンポ', len: '想定の長さ', src: '出典',
      title: 'タイトル', style: 'Style of Music', exclude: 'Exclude Styles', lyrics: '歌詞',
      copy: 'コピー', copied: 'コピーしました', copyAll: 'まとめてコピー', notes: 'メモ（中国語）',
      chars: function (n, m) { return n + ' / ' + m + ' 文字'; },
      titleNote: '仮タイトル'
    }
  };
  var LIMIT = { title: 100, style: 1000, exclude: 1000, lyrics: 5000 };
  var LANGS = ['Mandarin', 'Japanese', 'English', 'German'];

  var ui = 'en';
  try {
    var saved = localStorage.getItem('suno-v6-ui');
    if (saved === 'en' || saved === 'ja') ui = saved;
    else if ((navigator.language || '').toLowerCase().indexOf('ja') === 0) ui = 'ja';
  } catch (e) {
    if ((navigator.language || '').toLowerCase().indexOf('ja') === 0) ui = 'ja';
  }

  var state = { q: '', lang: 'all' };

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'class') n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }

  function copyText(text, btn, doneLabel, label) {
    function ok() {
      btn.classList.add('done');
      btn.textContent = doneLabel;
      setTimeout(function () { btn.classList.remove('done'); btn.textContent = label; }, 1400);
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); ok(); } catch (e) { /* ignore */ }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, fallback);
    } else fallback();
  }

  function fullBlock(s) {
    return [
      'TITLE: ' + s.title,
      'MODEL: ' + s.model + ' | Vocal Gender: ' + s.vocal + ' | Weirdness: ' + s.weirdness + '% | Style Influence: ' + s.influence + '% | Variety: ' + s.variety + ' | Max Mode: ' + s.max,
      '', '[STYLE OF MUSIC]', s.style, '', '[EXCLUDE STYLES]', s.exclude, '', '[LYRICS]', s.lyrics
    ].join('\n');
  }

  function field(label, text, limit, t) {
    var count = el('span', { class: 'count', text: t.chars(text.length, limit) });
    var btn = el('button', { class: 'copy', type: 'button', text: t.copy });
    btn.addEventListener('click', function () { copyText(text, btn, t.copied, t.copy); });
    var head = el('div', { class: 'head' }, [el('b', null, [label, count]), btn]);
    return el('div', { class: 'field' }, [head, el('pre', { class: 'box', text: text })]);
  }

  function card(s) {
    var t = UI[ui];
    var d = el('details', { class: 'song', 'data-id': s.id, 'data-lang': s.lang });
    var meta = el('div', { class: 'meta' }, [
      el('span', { class: 'tag', text: s.lang }),
      el('span', { class: 'tag', text: s.vocal }),
      s.bpm ? el('span', { class: 'tag', text: s.bpm + ' BPM' }) : null,
      el('span', { class: 'tag', text: s.album })
    ]);
    d.appendChild(el('summary', null, [
      el('span', { class: 'num', text: s.id }),
      el('span', { class: 'ttl', text: s.title }),
      meta
    ]));
    var body = el('div', { class: 'body' });
    var rows = [
      [t.model, s.model + ' (flagship)'], [t.vocal, s.vocal], [t.weird, s.weirdness + '%'],
      [t.infl, s.influence + '%'], [t.variety, s.variety], [t.max, s.max]
    ];
    if (s.bpm) rows.push([t.bpm, s.bpm + ' BPM']);
    if (s.length) rows.push([t.len, s.length]);
    rows.push([t.src, s.src]);
    if (s.titleNote) rows.push([t.titleNote, s.titleNote]);
    var tbody = el('tbody');
    rows.forEach(function (r) { tbody.appendChild(el('tr', null, [el('td', { text: r[0] }), el('td', { text: r[1] })])); });
    body.appendChild(el('table', { class: 'params' }, [tbody]));

    var allBtn = el('button', { class: 'copy all', type: 'button', text: t.copyAll });
    allBtn.addEventListener('click', function () { copyText(fullBlock(s), allBtn, t.copied, t.copyAll); });
    body.appendChild(el('div', null, [allBtn]));
    body.appendChild(field(t.title, s.title, LIMIT.title, t));
    body.appendChild(field(t.style, s.style, LIMIT.style, t));
    body.appendChild(field(t.exclude, s.exclude, LIMIT.exclude, t));
    body.appendChild(field(t.lyrics, s.lyrics, LIMIT.lyrics, t));
    if (s.notes && s.notes.length) {
      var ul = el('ul', { class: 'note' });
      s.notes.forEach(function (n) { ul.appendChild(el('li', { text: n })); });
      body.appendChild(el('div', { class: 'field' }, [el('div', { class: 'head' }, [el('b', { text: t.notes })]), ul]));
    }
    d.appendChild(body);
    d._hay = (s.id + ' ' + s.title + ' ' + s.album + ' ' + s.lang + ' ' + s.style + ' ' + s.lyrics).toLowerCase();
    return d;
  }

  var listEl, chipsEl, searchEl, countEl, cards = [];

  function applyFilter() {
    var q = state.q.trim().toLowerCase(), shown = 0;
    cards.forEach(function (c) {
      var okLang = state.lang === 'all' || c.getAttribute('data-lang') === state.lang;
      var okQ = !q || c._hay.indexOf(q) !== -1;
      c.hidden = !(okLang && okQ);
      if (!c.hidden) shown++;
    });
    countEl.textContent = UI[ui].shown(shown, cards.length);
    document.getElementById('empty').hidden = shown !== 0;
    document.getElementById('empty').textContent = UI[ui].none;
  }

  function renderChips() {
    var t = UI[ui];
    chipsEl.textContent = '';
    ['all'].concat(LANGS).forEach(function (l) {
      var n = l === 'all' ? SONGS.length : SONGS.filter(function (s) { return s.lang === l; }).length;
      if (!n) return;
      var b = el('button', { class: 'chip', type: 'button', 'aria-pressed': String(state.lang === l), text: (l === 'all' ? t.all : l) + ' · ' + n });
      b.addEventListener('click', function () { state.lang = l; renderChips(); applyFilter(); });
      chipsEl.appendChild(b);
    });
  }

  function renderAll() {
    document.documentElement.setAttribute('data-ui', ui);
    document.documentElement.lang = ui;
    searchEl.placeholder = UI[ui].search;
    var openIds = {};
    cards.forEach(function (c) { if (c.open) openIds[c.getAttribute('data-id')] = true; });
    listEl.textContent = '';
    cards = SONGS.map(card);
    cards.forEach(function (c) { if (openIds[c.getAttribute('data-id')]) c.open = true; listEl.appendChild(c); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-set-ui]'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-ui') === ui));
    });
    renderChips();
    applyFilter();
  }

  document.addEventListener('DOMContentLoaded', function () {
    listEl = document.getElementById('list');
    chipsEl = document.getElementById('chips');
    searchEl = document.getElementById('q');
    countEl = document.getElementById('count');
    searchEl.addEventListener('input', function () { state.q = searchEl.value; applyFilter(); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-set-ui]'), function (b) {
      b.addEventListener('click', function () {
        ui = b.getAttribute('data-set-ui');
        try { localStorage.setItem('suno-v6-ui', ui); } catch (e) { /* ignore */ }
        renderAll();
      });
    });
    var n = document.getElementById('total');
    if (n) n.textContent = String(SONGS.length);
    renderAll();
  });
})();
