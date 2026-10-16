/* Captions. One sentence at a time, and every token gets its own slice of the sentence's
 * time: the line lights up as it is read. A token is one Chinese character (punctuation
 * rides with the character before it) or one Latin word, so both scripts keep their
 * natural rhythm.
 *
 * Markup inside a cue: <em> emphasised · <num> a number (mono) · <unit> a unit ·
 * <caveat> a caveat. They map onto #caption .em / .num / .unit / .caveat in the sheet.
 *
 * The token timings come from the character count, which is how a reader's eye moves:
 * ratios rather than a fixed wpm, so a short line and a long line both feel read aloud.
 */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});

  var el = null, subEl = null;
  var cues = [];
  var current = -1;
  var tokens = [];

  // ---------------------------------------------------------------- tokenizer
  function tokenize(src) {
    var out = [], buf = '', tag = '';
    function flush() {
      if (!buf) return;
      if (/^\s+$/.test(buf)) { buf = ''; return; }
      out.push({ text: buf, tag: tag });
      buf = '';
    }
    for (var i = 0; i < src.length; i++) {
      var ch = src[i];
      if (ch === '<') {
        var close = src.indexOf('>', i);
        if (close > i) {
          flush();
          var name = src.slice(i + 1, close).replace('/', '');
          tag = (src[i + 1] === '/') ? '' : name;
          i = close;
          continue;
        }
      }
      if (ch === ' ' || ch === '\n' || ch === '\t') {
        // a space inside a Latin run belongs to the TokenLane; between CJK it separates
        if (/[A-Za-z0-9]$/.test(buf)) { out.push({ text: buf, tag: tag }); buf = ''; }
        else flush();
        continue;
      }
      var isCJK = /[\u3000-\u9fff\uff00-\uffef]/.test(ch);
      if (isCJK) {
        flush();
        // closing punctuation joins the character before it, opening punctuation the one after
        if (/[，。、；：？！）」』】》…—]/.test(ch) && out.length) { out[out.length - 1].text += ch; continue; }
        if (/^[（「『【《]$/.test(ch)) { buf = ch; continue; }
        out.push({ text: ch, tag: tag });
        continue;
      }
      // Latin: a word is a run of letters/digits with . , % ° × - inside
      if (/[A-Za-z0-9]/.test(ch) || (buf && /[A-Za-z0-9]/.test(buf.slice(-1)) && /[.,'%°×+\-]/.test(ch))) {
        buf += ch;
        continue;
      }
      flush();
      out.push({ text: ch, tag: tag });
    }
    flush();
    return out;
  }

  // weight a token by how long it takes to read
  function weight(t) {
    var n = t.text.length;
    if (/[\u3000-\u9fff]/.test(t.text)) return n;
    return Math.max(1.4, n * 0.55);
  }

  function cls(tag) {
    return 'w' + (tag ? ' ' + tag : '');
  }

  // ---------------------------------------------------------------- build
  function build(cue) {
    if (!el) return;
    tokens = tokenize(cue.text || '');
    var total = 0, i;
    for (i = 0; i < tokens.length; i++) { tokens[i].w = weight(tokens[i]); total += tokens[i].w; }
    // leave a beat at each end so the finished line is read before it leaves
    var t0 = cue.t0 + Math.min(0.30, (cue.t1 - cue.t0) * 0.12);
    var span = Math.max(0.2, (cue.t1 - cue.t0) * 0.80);
    var acc = 0;
    var frag = document.createDocumentFragment();
    for (i = 0; i < tokens.length; i++) {
      var tk = tokens[i];
      tk.tOn = t0 + span * (acc / total);
      acc += tk.w;
      var span2 = document.createElement('span');
      span2.className = cls(tk.tag);
      span2.textContent = tk.text;
      frag.appendChild(span2);
      tk.node = span2;
    }
    el.innerHTML = '';
    el.appendChild(frag);
    if (subEl) {
      subEl.textContent = cue.sub || '';
      subEl.style.opacity = cue.sub ? '1' : '0';
    }
    el.style.opacity = '1';
  }

  function indexAt(t) {
    for (var i = 0; i < cues.length; i++) if (t >= cues[i].t0 && t <= cues[i].t1) return i;
    return -1;
  }

  function hide() {
    if (el) el.style.opacity = '0';
    if (subEl) subEl.style.opacity = '0';
  }

  SS.captions = {
    enter: function (list, app) {
      cues = list || [];
      el = document.getElementById('caption');
      subEl = document.getElementById('captionSub');
      if (!subEl && el && el.parentNode) {              // the sheet keeps them stacked
        subEl = document.createElement('div');
        subEl.id = 'captionSub';
        el.parentNode.insertBefore(subEl, el);
      }
      if (el) el.innerHTML = '';
      current = -1;
      hide();
      this.tick(app ? app.time : 0, app);
      return true;
    },

    tick: function (t, app) {
      if (!el) return;
      if (app && app.captions === false) { if (current !== -2) { current = -2; hide(); } return; }
      var idx = indexAt(t);
      if (idx !== current) {
        current = idx;
        if (idx < 0) { tokens = []; if (el) el.innerHTML = ''; hide(); return; }
        build(cues[idx]);
      }
      if (idx < 0) return;
      for (var i = 0; i < tokens.length; i++) {
        var on = t >= tokens[i].tOn;
        if (tokens[i].on !== on) { tokens[i].on = on; tokens[i].node.classList.toggle('on', on); }
      }
    },

    clear: function () {
      current = -1; tokens = [];
      hide();
      if (el) el.innerHTML = '';
      return true;
    },

    // what the line is doing right now, for the verification tools
    state: function () {
      var c = current >= 0 ? cues[current] : null;
      var lit = 0, txt = '';
      for (var i = 0; i < tokens.length; i++) if (tokens[i].on) { lit++; txt += tokens[i].text; }
      return {
        index: current, text: el ? el.textContent : '', lit: lit, total: tokens.length,
        t0: c ? c.t0 : -1, t1: c ? c.t1 : -1,
        tOn: tokens.length ? tokens[0].tOn : -1
      };
    },

    // the tokens currently lit, for the verification tools
    lit: function () {
      var s = '';
      for (var i = 0; i < tokens.length; i++) if (tokens[i].on) s += tokens[i].text;
      return s;
    }
  };
})();
