/* Why are the text layers empty? Boot with the film's own entry point under a
 * try/catch and report what each layer did. */
import { launch } from './_browser.mjs';
import path from 'node:path';

const root = path.resolve('.');
const { browser, page } = await launch({ width: 960, height: 540 });
const logs = [];
page.on('console', (m) => logs.push(m.type() + ': ' + m.text().slice(0, 200)));
page.on('pageerror', (e) => logs.push('PAGEERROR: ' + (e.stack || e.message).split('\n').slice(0, 4).join(' | ')));

await page.goto('file://' + root + '/index.html?probe=1&loop=0&quality=0.2&terrainRes=256&scale=0.3',
  { waitUntil: 'domcontentloaded' });
await page.waitForFunction('window.__probe && window.__probe.booted === true', { timeout: 300000 });

const out = await page.evaluate(() => {
  const p = window.__probe, R = p.renderer, app = p.app;
  const probe = {
    hasTimeline: !!window.SS.timeline,
    hasCaptions: !!window.SS.captions,
    chapters: window.SS.timeline ? window.SS.timeline.chapters.length : -1,
    cues: window.SS.timeline ? window.SS.timeline.cues.length : -1,
    marks: document.querySelectorAll('#chapterMarks .mark').length,
    chapterButtons: document.querySelectorAll('#chapterList button').length,
    captionHTML: (document.getElementById('caption') || {}).innerHTML,
    captionSub: !!document.getElementById('captionSub')
  };
  try { window.SS.timeline.enter(30, R, app); probe.enterOk = true; }
  catch (e) { probe.enterErr = e.message + ' @ ' + (e.stack || '').split('\n')[1]; }
  probe.captionHTML2 = (document.getElementById('caption') || {}).innerHTML.slice(0, 120);
  probe.tokens = document.querySelectorAll('#caption .w').length;
  probe.marks2 = document.querySelectorAll('#chapterMarks .mark').length;
  probe.buttons2 = document.querySelectorAll('#chapterList button').length;
  try { p.frameAt(30); } catch (e) { probe.frameErr = e.message; }
  probe.cards = document.querySelectorAll('#cards .card').length;
  probe.cardsOn = document.querySelectorAll('#cards .card.on').length;
  probe.instruments = document.querySelectorAll('.instrument').length;
  probe.instrumentsOn = document.querySelectorAll('.instrument.on').length;
  probe.svgChildren = (document.getElementById('annot') || { children: [] }).children.length;
  probe.leads = document.querySelectorAll('#annot .lead').length;
  probe.done = true;
  return probe;
});
console.log(JSON.stringify(out, null, 1));
console.log('LOGS', JSON.stringify(logs.slice(0, 12), null, 1));
await browser.close();
