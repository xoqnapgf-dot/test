"""Check every synthesized line with Whisper and get per-character timings for the subtitles/cues.

usage: python align.py <workdir>   → <workdir>/align.json, prints lines whose reading looks wrong
Homophones are fine (the subtitle comes from the script, not from ASR), so lines are compared by
toneless pinyin; Latin name tokens (Kasumi, Arisa…) are skipped in the comparison.
"""
import sys, os, json, re, difflib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from script_parse import parse, TOKEN
from voice_util import load, SR
import numpy as np
from faster_whisper import WhisperModel
from pypinyin import lazy_pinyin
import librosa

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
work = sys.argv[1]
model = WhisperModel('small', device='cpu', compute_type='int8')
CJK = re.compile(r'[一-鿿]')

def raw_lines(path):
    out = []
    for raw in open(path, encoding='utf8'):
        s = raw.strip()
        if not s or s.startswith('#'): continue
        out.append(re.sub(r'\{p=[\d.]+\}\s*$', '', s).rstrip())
    return out

def sub_to_say_map(raw):
    """for each subtitle char: (say_index_start, say_index_end) span it corresponds to"""
    spans, sub_i, say_i, pos = [], 0, 0, 0
    say_clean = lambda s: s.replace('（', '').replace('）', '').replace('「', '').replace('」', '')
    for m in list(TOKEN.finditer(raw)) + [None]:
        seg = raw[pos:m.start()] if m else raw[pos:]
        for ch in seg:
            n = len(say_clean(ch)); spans.append((say_i, say_i + max(n, 0))); say_i += n
        if m:
            disp, say = m.group(1), say_clean(m.group(2))
            for k in range(len(disp)):
                a = say_i + len(say) * k / len(disp); b = say_i + len(say) * (k + 1) / len(disp); spans.append((a, b))
            say_i += len(say); pos = m.end()
    return spans

lines = [l for s in parse(os.path.join(root, 'tools', 'script.txt')) for l in s['lines']]
raws = raw_lines(os.path.join(root, 'tools', 'script.txt'))
assert len(raws) == len(lines)
result, bad = {}, []
for l, raw in zip(lines, raws):
    y = load(f"{work}/voice/{l['key']}.wav")
    y16 = librosa.resample(y, orig_sr=SR, target_sr=16000)
    segs, _ = model.transcribe(y16, language='zh', word_timestamps=True, initial_prompt='以下是普通话的句子。')
    chars = []  # (char, t)
    for sg in segs:
        for w in sg.words:
            txt = w.word.strip(); n = len(txt)
            for k, ch in enumerate(txt): chars.append((ch, w.start + (w.end - w.start) * k / max(n, 1)))
    hyp = ''.join(c for c, _ in chars)
    say = l['say']
    # compare by pinyin on CJK only
    ref_py = [lazy_pinyin(c)[0] for c in say if CJK.match(c)]
    hyp_py = [lazy_pinyin(c)[0] for c in hyp if CJK.match(c)]
    sm = difflib.SequenceMatcher(None, ref_py, hyp_py, autojunk=False)
    err = 1 - sum(b.size for b in sm.get_matching_blocks()) / max(len(ref_py), 1)
    if err > 0.08: bad.append((round(err, 2), l['key'], say, hyp))
    # align say chars → hyp char times
    say_t = [None] * len(say)
    sm2 = difflib.SequenceMatcher(None, say, hyp, autojunk=False)
    for blk in sm2.get_matching_blocks():
        for k in range(blk.size): say_t[blk.a + k] = chars[blk.b + k][1]
    d = len(y) / SR
    known = [(i, t) for i, t in enumerate(say_t) if t is not None]
    if len(known) < 2: continue
    xs, ts = zip(*known)
    allt = np.interp(np.arange(len(say) + 1), list(xs) + [len(say)], list(ts) + [d])
    allt = np.maximum.accumulate(allt)
    spans = sub_to_say_map(raw)
    assert len(spans) == len(l['sub']), (raw, len(spans), len(l['sub']))
    result[l['key']] = [round(float(np.interp(a, np.arange(len(allt)), allt)), 3) for a, _ in spans]
json.dump(result, open(f'{work}/align.json', 'w'))
print('aligned', len(result), 'of', len(lines))
for e in sorted(bad, reverse=True): print('CHECK', *e)
