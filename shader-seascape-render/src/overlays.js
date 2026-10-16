/* Overlays: the annotation cards, the leader lines and the step meter.
 *
 * The step meter is the film's spine: nine dots, one per step of the pipeline, filling as
 * the film passes them. The cards and the leaders are plain DOM/SVG; everything that moves
 * with the numbers - the distance rail, the chapter diagrams - is drawn by src/mg.js on the
 * canvas that sits under every panel.
 */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});

  var NS = 'http://www.w3.org/2000/svg';
  var svg = null, cardsEl = null, subEl = null;
  var W = 1280, H = 720;
  var cards = [], annots = [], cardNodes = [], leaderNodes = [], dots = [];
  var built = false;

  function mk(name, attrs, parent, text) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); }

  // ---------------------------------------------------------------- build
  function buildCards(list) {
    cardsEl.innerHTML = '';
    cardNodes = [];
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      var d = document.createElement('div');
      d.className = 'card';
      d.style.left = (c.at[0] * 100) + '%';
      d.style.top = (c.at[1] * 100) + '%';
      var body = c.body || '';
      // <num> and <unit> inside the body become the two classes the sheet defines
      body = body.replace(/<num>/g, '<span class="num">').replace(/<\/num>/g, '</span>')
                 .replace(/<unit>/g, '<span class="unit">').replace(/<\/unit>/g, '</span>');
      d.innerHTML = '<div class="h">' + c.h + '</div><div class="b">' + body + '</div>' +
        (c.formula ? '<div class="formula">' + c.formula + '</div>' : '') +
        (c.src ? '<div class="src">' + c.src + '</div>' : '');
      cardsEl.appendChild(d);
      cardNodes.push({ el: d, c: c });
    }
  }

  function buildLeaders(list) {
    clear(svg);
    leaderNodes = [];
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      var g = mk('g', { class: 'lead', opacity: 0 }, svg);
      var path = mk('path', { class: 'leader', 'vector-effect': 'non-scaling-stroke' }, g);
      var dot = mk('circle', { class: 'anchor', r: 2.6 }, g);
      var label = mk('text', { class: 'tl' }, g);
      g.__path = path; g.__dot = dot; g.__label = label;
      g.__annot = a;
      leaderNodes.push(g);
    }
    // the step meter: nine dots under the title
    var meter = mk('g', { class: 'meter' }, svg);
    dots = [];
    for (var j = 0; j < 9; j++) {
      dots.push(mk('circle', { r: 2.2, cx: 0, cy: 0 }, meter));
    }
  }

  // ---------------------------------------------------------------- positions
  function layout() {
    W = window.innerWidth; H = window.innerHeight;
    if (!svg) return;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    var block = document.getElementById('titleBlock');
    var by = block ? block.getBoundingClientRect().bottom + 14 : H * 0.12;
    var bx = block ? block.getBoundingClientRect().left : 20;
    for (var i = 0; i < dots.length; i++) {
      dots[i].setAttribute('cx', (bx + 3 + i * 11).toFixed(1));
      dots[i].setAttribute('cy', by.toFixed(1));
    }
    for (var j = 0; j < leaderNodes.length; j++) {
      var g = leaderNodes[j], a = g.__annot;
      var card = cardNodes[a.chapter];
      var cardX = (card ? card.el.getBoundingClientRect() : { left: W * 0.7, top: H * 0.1, right: W * 0.9, bottom: H * 0.3 });
      var fromLeft = a.from[0] < 0.5;
      var x0 = fromLeft ? Math.max(cardX.right, W * 0.12) : Math.min(cardX.left, W * 0.88);
      var y0 = cardX.top + (cardX.bottom - cardX.top) * 0.5;
      var x1 = a.at[0] * W, y1 = a.at[1] * H;
      var elbowX = x0 + (fromLeft ? 1 : -1) * Math.min(120, Math.max(40, Math.abs(x1 - x0) * 0.45));
      g.__path.setAttribute('d', 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) +
        ' L' + elbowX.toFixed(1) + ' ' + y0.toFixed(1) + ' L' + x1.toFixed(1) + ' ' + y1.toFixed(1));
      g.__dot.setAttribute('cx', x1.toFixed(1));
      g.__dot.setAttribute('cy', y1.toFixed(1));
      g.__label.setAttribute('x', (fromLeft ? x0 + 8 : x0 - 8).toFixed(1));
      g.__label.setAttribute('y', (y0 - 5).toFixed(1));
      g.__label.setAttribute('text-anchor', fromLeft ? 'start' : 'end');
      g.__label.textContent = a.label || '';
      g.__len = g.__path.getTotalLength ? g.__path.getTotalLength() : 200;
    }
  }

  SS.overlays = {
    enter: function (cardList, annotList, app) {
      svg = document.getElementById('annot');
      cardsEl = document.getElementById('cards');
      subEl = document.getElementById('captionSub');
      if (!svg || !cardsEl) return false;
      cards = cardList || [];
      annots = annotList || [];
      buildCards(cards);
      buildLeaders(annots);
      built = true;
      layout();
      return true;
    },

    setChapter: function (ch, u, app, R, force) {
      if (!built) return false;
      for (var i = 0; i < cardNodes.length; i++) {
        var on = cardNodes[i].c.chapter === ch;
        if (on !== cardNodes[i].el.classList.contains('on')) cardNodes[i].el.classList.toggle('on', on);
      }
      for (var j = 0; j < leaderNodes.length; j++) {
        var g = leaderNodes[j], a = g.__annot;
        // in over the first fifth of the chapter, out over the last eighth
        var k = a.chapter === ch ? Math.min(1, Math.max(0, (u - 0.05) / 0.18)) * Math.min(1, Math.max(0, (1 - u) / 0.10)) : 0;
        g.setAttribute('opacity', k.toFixed(3));
        if (k > 0.02 && g.__len !== undefined) {
          g.__path.setAttribute('stroke-dasharray', g.__len);
          g.__path.setAttribute('stroke-dashoffset', (g.__len * (1 - Math.min(1, k * 1.4))).toFixed(1));
          g.__label.classList.toggle('on', k > 0.55);
        } else {
          g.__label.classList.remove('on');
        }
      }
      for (var m = 0; m < dots.length; m++) {
        dots[m].setAttribute('class', m === ch ? 'dot now' : (m < ch ? 'dot done' : 'dot'));
      }
      this.tick(R, app, true);
      return true;
    },

    tick: function (R, app, force) {
      if (!built || !R) return false;
      // the ruler, the per-chapter numbers and the chapter graphics all belong to the
      // motion-graphics layer, which owns the one canvas that sits under every panel
      if (SS.mg) SS.mg.tick(R, app);
      return true;
    },

    resize: function () {
      if (built) layout();
      if (SS.mg && SS.mg.resize) SS.mg.resize();
    },
    clear: function () {
      if (cardsEl) cardsEl.innerHTML = '';
      if (svg) svg.innerHTML = '';
      if (SS.mg && SS.mg.clear) SS.mg.clear();
      cardNodes = []; leaderNodes = []; dots = []; built = false;
      return true;
    },
    // for the verification tools
    state: function () {
      return {
        cards: cardNodes.filter(function (c) { return c.el.classList.contains('on'); })
          .map(function (c) { return { h: c.c.h, cls: c.el.className }; }),
        leaders: leaderNodes.filter(function (g) { return +g.getAttribute('opacity') > 0.01; }).length
      };
    }
  };
})();
