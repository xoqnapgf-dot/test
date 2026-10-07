// PRE-CHORUS ×2 — the build. Washi dyed through (vermilion in I, indigo in II).
// I : the bass crawls as a black ribbon carrying prayers in many scripts; jewels swing
//     (tamayura) to a racing heartbeat; five emblems orbit and fuse into one sound.
// II: different names / different prayers in parallel strips meet in one chorus; a bowed
//     crowd lifts its heads on the claps; six strings carry every symbol into the chorus.
import { Paper, Layer2D } from './base.js';
import { lines, SEC, bass, kickHit, snareHit, beatF, beatPulse, B, sinceKick, env } from '../core/music.js';
import { F, font, layoutH, layoutV, REVEAL, caption } from '../core/type.js';
import { gloss } from '../core/lyrics-meta.js';
import { SYMBOLS, SYMBOL_KEYS, EMBLEMS, MEMBERS, drawSym } from '../gfx/symbols.js';
import { MEMBER_COLORS } from './intro.js';
import { clamp, lerp, ease, ep, rng, TAU, hash1, fbm1, win, noise1 } from '../core/util.js';

const PRAYERS = ['AVE MARIA GRATIA PLENA', '南無阿弥陀仏', 'KYRIE ELEISON', '祓え給い 清め給え', 'HALLELUJAH', '南無妙法蓮華経', 'GLORIA IN EXCELSIS', 'OM MANI PADME HUM', 'AMEN', '六根清浄', 'SANCTUS SANCTUS', 'ĀMĪN'];
const NAMES = [['NOMEN', 'Latin'], ['名', '日本語'], ['ISM', 'ʿarabī'], ['NĀMA', 'saṃskṛta'], ['NAME', 'English']];
const PRAYS = [['ŌRĀTIŌ', 'Latin'], ['祝詞', 'norito'], ['DUʿĀʾ', 'ʿarabī'], ['PŪJĀ', 'saṃskṛta'], ['念仏', 'nembutsu']];

export class Pre {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.paper = new Paper('#ece2cf', '#cf3320');
    this.ink = new Layer2D();
    this.glow = new Layer2D();
    this.l1 = lines('pre1');
    this.l2 = lines('pre2');
    const R = rng(91);
    this.crowd = [];
    for (let row = 0; row < 4; row++)
      for (let i = 0; i < 16 + row * 2; i++)
        this.crowd.push({ row, x: (i + 0.5 + (R() - 0.5) * 0.4) / (16 + row * 2) * 2000 - 40, s: 1 - row * 0.16, ph: R() });
  }

  render(t, rt) {
    const second = t >= SEC.v2[0];
    const r = this.app.renderer;
    const sec = second ? SEC.pre2 : SEC.pre1;
    const kz = kickHit(t, 8);
    const zoom = 1 + kz * 0.012 + ep(sec[1] - 2.8, sec[1], t, ease.inCubic) * 0.08;
    this.paper.draw(r, rt, {
      zoom,
      dye: 1,
      dyeCol: second ? '#1b2d6b' : '#cf3320',
      panX: (t - sec[0]) * 18,
    });
    const c = this.ink.begin();
    const g = this.glow.begin();
    if (!second) this.drawPre1(c, g, t);
    else this.drawPre2(c, g, t);
    this.glow.draw(r, rt, { boost: 2.0, scale: zoom });
    this.ink.draw(r, rt, { scale: zoom });
    const riser = ep(sec[1] - 1.2, sec[1], t, ease.inExpo);
    return {
      hudInk: 'light', bloom: 0.7, bloomThresh: 0.9, grain: 0.07, vig: 0.7, ca: 0.002 + kz * 0.004,
      flash: riser * 0.85, contrast: 1.08, hudShu: second ? '#e3402a' : '#111',
    };
  }

  // ------------------------------------------------------------------ PRE I
  drawPre1(c, g, t) {
    const ls = this.l1;
    const ink = '#0f0b0a';
    const paperC = '#f3e9d7';
    this.watermark(c, t, ls, ['這', '祈', '響', '一'], '#2a0806');
    // --- bass serpent: a crawling ribbon whose height is the bass groove history
    const baseY = 760;
    const pts = [];
    const span = 2.2; // seconds of history across the screen
    for (let x = -40; x <= 1960; x += 12) {
      const tt = t - ((1960 - x) / 2000) * span;
      const b = Math.pow(bass(tt), 3) * 1.3;
      const k = kickHit(tt, 10);
      const y = baseY + Math.sin(x * 0.006 - t * 4) * 50 - b * 120 - k * 60;
      pts.push([x, y, 26 + b * 30 + k * 20]);
    }
    const crawl = ep(SEC.pre1[0] - 0.2, ls[0].t0 + 0.6, t, ease.outCubic);
    const serpA = 1 - ep(ls[3].t0 - 0.3, ls[3].t0 + 0.5, t) * 0.85;
    const visibleTo = lerp(1960, -40, crawl);
    // ribbon body (bristly black)
    c.save();
    c.globalAlpha = serpA;
    c.fillStyle = ink;
    c.beginPath();
    const up = [], dn = [];
    for (const [x, y, w] of pts) {
      if (x < visibleTo) continue;
      up.push([x, y - w]);
      dn.push([x, y + w]);
    }
    if (up.length > 1) {
      c.moveTo(up[0][0], up[0][1]);
      up.forEach(([x, y]) => c.lineTo(x, y + noise1(x * 0.05, 3) * 3));
      for (let i = dn.length - 1; i >= 0; i--) c.lineTo(dn[i][0], dn[i][1] + noise1(dn[i][0] * 0.05, 7) * 4);
      c.closePath();
      c.fill();
      // dry-brush streaks along the ribbon
      c.strokeStyle = paperC;
      c.globalAlpha = 0.35 * serpA;
      for (let k = 0; k < 6; k++) {
        c.lineWidth = 1 + (k % 3);
        c.beginPath();
        let on = false;
        pts.forEach(([x, y, w], i) => {
          if (x < visibleTo) return;
          const off = (k / 5 - 0.5) * w * 1.6;
          const vis = noise1(x * 0.012 + k * 7, k) > 0.25;
          if (vis && !on) {
            c.moveTo(x, y + off);
            on = true;
          } else if (vis) c.lineTo(x, y + off);
          else on = false;
        });
        c.stroke();
      }
      c.globalAlpha = 1;
    }
    c.restore();

    // --- prayers riding the serpent (from line 2)
    const pr = ep(ls[1].t0 - 0.3, ls[1].t0 + 0.8, t);
    if (pr > 0 && up.length > 4) {
      c.save();
      c.font = font(F.mono, 19);
      c.fillStyle = paperC;
      c.textBaseline = 'middle';
      const str = PRAYERS.join('  ·  ') + '  ·  ';
      const speed = 160;
      let s0 = (t * speed) % 3000;
      // walk along the centre line
      const cl = pts.filter(([x]) => x >= visibleTo);
      const arc = [0];
      for (let i = 1; i < cl.length; i++) arc[i] = arc[i - 1] + Math.hypot(cl[i][0] - cl[i - 1][0], cl[i][1] - cl[i - 1][1]);
      let pos = -s0;
      let ci = 0;
      const total = arc[arc.length - 1];
      c.globalAlpha = pr * serpA;
      while (pos < total) {
        const ch = str[ci % str.length];
        const w = c.measureText(ch).width + 3;
        if (pos > 0) {
          let j = 1;
          while (j < arc.length - 1 && arc[j] < pos) j++;
          const u = (pos - arc[j - 1]) / (arc[j] - arc[j - 1] || 1);
          const x = lerp(cl[j - 1][0], cl[j][0], u), y = lerp(cl[j - 1][1], cl[j][1], u);
          const ang = Math.atan2(cl[j][1] - cl[j - 1][1], cl[j][0] - cl[j - 1][0]);
          c.save();
          c.translate(x, y);
          c.rotate(ang);
          c.fillText(ch, 0, 0);
          c.restore();
        }
        pos += w;
        ci++;
        if (ci > 600) break;
      }
      c.restore();
    }

    // --- tamayura: jewels swinging on threads + heartbeat line
    const tj = ep(ls[2].t0 - 0.4, ls[2].t0 + 0.3, t, ease.outBack);
    const outJ = 1 - ep(ls[3].t0 - 0.2, ls[3].t0 + 0.4, t);
    if (tj > 0.001 && outJ > 0) {
      for (let i = 0; i < 5; i++) {
        const ax = 560 + i * 200, ay = -20;
        const len = 500 + (i % 2) * 60;
        const sw = Math.sin(beatF(t) * Math.PI * 0.5 + i * 0.9) * 0.45 * (1 + kickHit(t, 5));
        const jx = ax + Math.sin(sw) * len, jy = ay + Math.cos(sw) * len * tj;
        c.save();
        c.globalAlpha = outJ;
        c.strokeStyle = ink;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(ax, ay);
        c.lineTo(jx, jy);
        c.stroke();
        // magatama (comma-shaped jewel)
        c.translate(jx, jy);
        c.rotate(sw * 0.6);
        c.fillStyle = MEMBER_COLORS[i];
        c.beginPath();
        c.arc(0, 26, 26, 0, TAU);
        c.fill();
        c.beginPath();
        c.moveTo(26, 26);
        c.bezierCurveTo(28, 70, 0, 92, -26, 96);
        c.bezierCurveTo(-6, 76, -16, 54, -26, 26);
        c.fill();
        c.fillStyle = ink;
        c.beginPath();
        c.arc(0, 22, 6, 0, TAU);
        c.fill();
        c.restore();
        // clink ring on beats
        const ph = beatF(t) % 1;
        if (Math.floor(beatF(t)) % 5 === i) {
          g.save();
          g.globalAlpha = (1 - ph) * outJ;
          g.strokeStyle = '#ffd890';
          g.lineWidth = 2;
          g.beginPath();
          g.arc(jx, jy + 40, 30 + ph * 120, 0, TAU);
          g.stroke();
          g.restore();
        }
      }
      // ECG heartbeat across the frame, spiking on kicks
      g.save();
      g.globalAlpha = outJ;
      g.strokeStyle = '#ffe2a8';
      g.lineWidth = 3;
      g.beginPath();
      for (let x = 0; x <= 1920; x += 6) {
        const tt = t - ((1920 - x) / 1920) * 1.6;
        const k = kickHit(tt, 18);
        const y = 600 - k * 180 * Math.sin(((x * 0.15) % 6.28)) - snareHit(tt, 20) * 60;
        if (x === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
      g.restore();
    }

    // --- five names orbit and fuse into one sound
    const l8 = ls[3];
    const e5 = ep(l8.t0 - 0.5, l8.t0 + 0.4, t, ease.outCubic);
    if (e5 > 0) {
      const fuse = ep(l8.c[7] - 0.1, l8.c[14] + 0.1, t, ease.inCubic); // ひとつ…音になる
      const R0 = lerp(330, 0, fuse);
      const spin = beatF(t) * 0.1 + fuse * 3;
      MEMBERS.forEach((m, i) => {
        const p = ep(l8.c[0] + i * 0.15 - 0.2, l8.c[0] + i * 0.15 + 0.3, t, ease.outBack);
        if (p <= 0) return;
        const ang = (i / 5) * TAU - Math.PI / 2 + spin;
        const x = 960 + Math.cos(ang) * R0, y = 600 + Math.sin(ang) * R0 * 0.7;
        c.save();
        c.globalAlpha = clamp(p) * (1 - fuse * 0.9);
        // disc
        c.fillStyle = ink;
        c.beginPath();
        c.arc(x, y, 92 * p, 0, TAU);
        c.fill();
        c.fillStyle = MEMBER_COLORS[i];
        drawSym(c, EMBLEMS[m.key], x, y, 62 * p, 0);
        c.fillStyle = paperC;
        c.textAlign = 'center';
        c.font = font(F.mincho, 34);
        c.fillText(m.name, x, y + 140);
        caption(c, m.role, x, y + 175, 12, 'rgba(243,233,215,0.85)', 'center');
        c.restore();
      });
      // the fused point
      if (fuse > 0) {
        g.save();
        const rr = 30 + fuse * 220 + kickHit(t, 9) * 40;
        const gr = g.createRadialGradient(960, 600, 0, 960, 600, rr);
        gr.addColorStop(0, `rgba(255,250,235,${fuse})`);
        gr.addColorStop(0.3, `rgba(255,200,120,${fuse * 0.6})`);
        gr.addColorStop(1, 'rgba(255,120,40,0)');
        g.fillStyle = gr;
        g.beginPath();
        g.arc(960, 600, rr, 0, TAU);
        g.fill();
        g.restore();
      }
    }

    // --- lyrics (horizontal, mincho on vermilion; one line at a time)
    this.lyric(c, t, ls, '#f6eddc', 210);
  }

  watermark(c, t, ls, chars, col) {
    let k = -1;
    for (let i = 0; i < ls.length; i++) if (t >= ls[i].t0 - 0.4) k = i;
    if (k < 0) return;
    const l = ls[k];
    const a = ep(l.t0 - 0.4, l.t0 + 0.4, t) * (k < ls.length - 1 ? 1 - ep(ls[k + 1].t0 - 0.5, ls[k + 1].t0 - 0.3, t) : 1);
    c.save();
    c.globalAlpha = a * 0.13;
    c.fillStyle = col;
    c.font = font(F.brush, 900);
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    const s = 1 + (t - l.t0) * 0.03;
    c.translate(k % 2 ? 560 : 1360, 560);
    c.scale(s, s);
    c.fillText(chars[k], 0, 0);
    c.restore();
  }

  lyric(c, t, ls, col, y) {
    let cur = null;
    for (const l of ls) if (t >= l.t0 - 0.3) cur = l;
    if (!cur) return;
    const out = cur === ls[ls.length - 1] ? 1 : clamp(1 - (t - (ls[ls.indexOf(cur) + 1].t0 - 0.35)) / 0.2);
    c.save();
    c.globalAlpha = out;
    c.font = font(F.mincho, 92);
    c.fillStyle = col;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.shadowColor = 'rgba(0,0,0,0.35)';
    c.shadowBlur = 18;
    const gl = layoutH(c, cur.text, 960, y, 92, 10);
    gl.forEach((g) => REVEAL.rise(c, g, clamp((t - cur.c[g.i] + 0.05) / 0.22), 92));
    c.shadowBlur = 0;
    c.font = font(F.serif, 28);
    if ('letterSpacing' in c) c.letterSpacing = '7px';
    c.globalAlpha = out * 0.8 * clamp((t - cur.t0) * 2);
    c.fillText(gloss(cur).toUpperCase(), 960, y + 92);
    c.restore();
  }

  // ------------------------------------------------------------------ PRE II
  drawPre2(c, g, t) {
    const ls = this.l2;
    const paperC = '#f1e8d6';
    this.watermark(c, t, ls, ['名', '会', '頭', '弦'], '#050a24');
    const shu = '#e3402a';
    const gold = '#f2c766';
    // --- five strips: different names / different prayers
    const l0 = ls[0], l1 = ls[1];
    const meet = ep(l1.t0 - 0.2, l1.t0 + 0.9, t, ease.inOutCubic);
    const stripsOut = ep(ls[2].t0 - 0.3, ls[2].t0 + 0.2, t);
    if (stripsOut < 1) {
      for (let i = 0; i < 5; i++) {
        const w = 1920 / 5;
        const x0 = i * w;
        const cx = lerp(x0 + w / 2, 960, meet);
        const p = ep(l0.t0 + i * 0.1 - 0.3, l0.t0 + i * 0.1 + 0.2, t);
        if (p <= 0) continue;
        c.save();
        c.globalAlpha = 1 - stripsOut;
        // strip panel
        c.fillStyle = i % 2 ? 'rgba(10,14,40,0.35)' : 'rgba(255,255,255,0.04)';
        c.globalAlpha *= 1 - meet;
        c.fillRect(lerp(x0, 960 - w / 2, meet), 0, w, 1080 * p);
        c.fillStyle = MEMBER_COLORS[i];
        c.fillRect(lerp(x0, 960 - w / 2, meet), 0, w, 6);
        c.globalAlpha = 1 - stripsOut;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        // name (first half of line 1)
        const showPray = t > l0.c[5] - 0.1;
        const [word, lang] = showPray ? PRAYS[i] : NAMES[i];
        const big = /[a-zA-Zāīūʿʾ]/.test(word) ? font(F.black, 74) : font(F.mincho, 84);
        c.font = big;
        c.fillStyle = paperC;
        const flick = showPray ? ep(l0.c[5] + i * 0.08 - 0.1, l0.c[5] + i * 0.08 + 0.1, t) : 1;
        c.globalAlpha *= flick;
        const wy = lerp(520, 330 + i * 92, meet);
        if (meet > 0) c.font = /[a-zA-Zāīūʿʾ]/.test(word) ? font(F.black, lerp(74, 54, meet)) : font(F.mincho, lerp(84, 60, meet));
        c.fillText(word, cx, wy);
        caption(c, lang.toUpperCase(), cx + meet * 170, wy + lerp(70, 4, meet), 13, 'rgba(241,232,214,0.7)', meet > 0.5 ? 'left' : 'center');
        c.restore();
      }
      if (meet > 0) {
        // the meeting point: one circle, one chorus
        g.save();
        g.globalAlpha = meet * (1 - stripsOut);
        g.strokeStyle = gold;
        g.lineWidth = 3;
        g.beginPath();
        g.arc(960, 515, 290 + kickHit(t, 8) * 30, 0, TAU);
        g.stroke();
        g.restore();
      }
    }

    // --- bowed crowd lifts its heads (claps on beat)
    const l2 = ls[2];
    const cin = ep(l2.t0 - 0.4, l2.t0 + 0.2, t);
    const cout = ep(ls[3].t0 - 0.3, ls[3].t0 + 0.3, t);
    if (cin > 0 && cout < 1) {
      const lift0 = l2.c[8] - 0.2; // 下げ
      for (const p of this.crowd) {
        const lift = ep(lift0 + (p.x / 1920) * 0.6, lift0 + (p.x / 1920) * 0.6 + 0.5, t, ease.outBack);
        const y0 = 1080 - 40 - p.row * 120;
        const s = p.s * 1.2;
        c.save();
        c.globalAlpha = cin * (1 - cout) * (0.55 + p.s * 0.45);
        c.translate(p.x, y0 + (1 - cin) * 200);
        c.scale(s, s);
        c.fillStyle = '#0a0d1e';
        // body
        c.beginPath();
        c.moveTo(-46, 0);
        c.quadraticCurveTo(-40, -90, 0, -100 + lift * 10);
        c.quadraticCurveTo(40, -90, 46, 0);
        c.fill();
        // head: bowed forward → lifted
        const hy = lerp(-92, -142, lift), hx = lerp(14, 0, lift);
        c.beginPath();
        c.arc(hx, hy, 26, 0, TAU);
        c.fill();
        // arms raised & clapping on the beat after the lift
        if (lift > 0.5) {
          const clap = beatPulse(t, 1, 10);
          const spread = lerp(36, 6, clap);
          c.strokeStyle = '#0a0d1e';
          c.lineWidth = 12;
          c.lineCap = 'round';
          c.beginPath();
          c.moveTo(-30, -80);
          c.lineTo(-spread, -190 * lift);
          c.moveTo(30, -80);
          c.lineTo(spread, -190 * lift);
          c.stroke();
          if (clap > 0.6 && p.row < 2) {
            g.save();
            g.globalAlpha = (clap - 0.6) * 2 * (1 - cout);
            g.fillStyle = '#ffe9b0';
            g.beginPath();
            g.arc(p.x, y0 - 190 * s, 14 * s, 0, TAU);
            g.fill();
            g.restore();
          }
        }
        c.restore();
      }
    }

    // --- six strings carry every symbol into the chorus
    const l3 = ls[3];
    const sin_ = ep(l3.t0 - 0.4, l3.t0 + 0.2, t);
    if (sin_ > 0) {
      const riser = ep(l3.t0, SEC.pre2[1], t, ease.inCubic);
      for (let s = 0; s < 6; s++) {
        const y = 330 + s * 78;
        const amp = (6 + riser * 30) * (1 + kickHit(t, 9));
        const fq = 2 + s * 0.5 + riser * 6;
        g.save();
        g.strokeStyle = s < 3 ? '#f2e2c0' : gold;
        g.lineWidth = 1.2 + (5 - s) * 0.5;
        g.globalAlpha = sin_;
        g.beginPath();
        for (let x = 0; x <= 1920; x += 8) {
          const env_ = Math.sin((x / 1920) * Math.PI);
          const yy = y + Math.sin((x / 1920) * Math.PI * fq + t * (30 + s * 5)) * amp * env_ * Math.sin(t * 40 + s);
          if (x === 0) g.moveTo(x, yy);
          else g.lineTo(x, yy);
        }
        g.stroke();
        g.restore();
        // symbols threaded on the string, sliding toward centre
        for (let k = 0; k < 8; k++) {
          const u = ((k / 8 + t * 0.06 * (s % 2 ? 1 : -1)) % 1 + 1) % 1;
          const x = u * 1920;
          const env_ = Math.sin(u * Math.PI);
          const yy = y + Math.sin(u * Math.PI * fq + t * (30 + s * 5)) * amp * env_ * Math.sin(t * 40 + s);
          const key = SYMBOL_KEYS[(k + s * 3) % 8];
          c.save();
          c.globalAlpha = sin_ * ep(l3.c[2] + k * 0.03 + s * 0.05, l3.c[2] + k * 0.03 + s * 0.05 + 0.3, t);
          c.fillStyle = s % 2 ? shu : paperC;
          c.strokeStyle = c.fillStyle;
          drawSym(c, SYMBOLS[key], x, yy, 22, t * (s % 2 ? 1 : -1));
          c.restore();
        }
      }
    }
    this.lyric(c, t, ls, paperC, 150);
  }
}
