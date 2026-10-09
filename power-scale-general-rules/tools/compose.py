"""Write the three score cues as XSXB-Band projects (JSON). Rendered with the XSXB-Band studio
(real CC0 instrument recordings), see README. usage: python3 tools/compose.py <outdir>

Cues share one harmonic world (D minor) so chapter crossfades never clash:
  axis   64 BPM  cello pedal, string chords, harp arpeggios, tubular bells, timpani swells
  night  58 BPM  tremolo string pad, harp, sparse flute, low cello
  ledger 76 BPM  soft piano broken chords, pizzicato strings, vibraphone glints
"""
import json, os, random, sys

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
random.seed(7)

N = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def m(name):  # 'D3' -> 50, 'Bb2' -> 46
    acc = 0
    n = name[0]
    rest = name[1:]
    if rest.startswith('b'):
        acc, rest = -1, rest[1:]
    elif rest.startswith('#'):
        acc, rest = 1, rest[1:]
    return 12 * (int(rest) + 1) + N[n] + acc


class Track:
    def __init__(self, tid, name, inst, vol, pan=0.0, reverb=0.35, art=None, color='#7C5BA6', humanize=0.25, release=None):
        self.d = {'id': tid, 'name': name, 'instrumentId': inst, 'color': color, 'volume': vol, 'pan': pan,
                  'muted': False, 'solo': False, 'reverb': reverb, 'humanize': humanize, 'notes': []}
        if art:
            self.d['articulation'] = art
        if release:
            self.d['release'] = release
        self.k = 0

    def n(self, midi, start, dur, vel, art=None):
        self.k += 1
        note = {'id': f'n{self.k}', 'midi': int(midi), 'start': round(start, 4), 'duration': round(max(0.0625, dur), 4), 'velocity': round(max(0.05, min(1, vel)), 3)}
        if art:
            note['articulation'] = art
        self.d['notes'].append(note)


def project(pid, title, bpm, bars, tracks, key='D minor'):
    for t in tracks:
        lim = bars * 4
        t.d['notes'] = [x for x in t.d['notes'] if x['start'] < lim]
        for x in t.d['notes']:
            x['duration'] = round(min(x['duration'], lim - x['start']), 4)
    return {'schemaVersion': 1, 'id': pid, 'title': title, 'bpm': bpm, 'key': key, 'bars': bars, 'timeSignature': [4, 4],
            'updatedAt': '2026-10-09T00:00:00.000Z', 'tracks': [t.d for t in tracks]}


# chord voicings (low, mid stack, top)
CH = {
    'Dm9': (['D2', 'A2'], ['F3', 'A3', 'C4', 'E4'], 'A4'),
    'Bbmaj7': (['Bb1', 'F2'], ['D3', 'F3', 'A3', 'C4'], 'F4'),
    'Gm9': (['G1', 'D2'], ['Bb2', 'D3', 'F3', 'A3'], 'D4'),
    'Fmaj7': (['F2', 'C3'], ['A3', 'C4', 'E4', 'G4'], 'C5'),
    'Asus': (['A1', 'E2'], ['D3', 'E3', 'G3', 'A3'], 'E4'),
    'A7': (['A1', 'E2'], ['C#3', 'E3', 'G3', 'A3'], 'E4'),
    'C6': (['C2', 'G2'], ['E3', 'G3', 'A3', 'D4'], 'G4'),
    'Ebmaj7': (['Eb2', 'Bb2'], ['G3', 'Bb3', 'D4', 'F4'], 'Bb4'),
}


def axis():
    bpm, bars = 64, 32
    prog = ['Dm9', 'Bbmaj7', 'Fmaj7', 'C6', 'Dm9', 'Gm9', 'Bbmaj7', 'Asus'] * 4
    cello = Track('cello', '大提琴 · 持续低音', 'cello-section', 0.42, -0.25, 0.4, 'sustain', '#6B4C8A', release=1.2)
    vio = Track('vln', '小提琴组 · 和声', 'strings', 0.22, 0.25, 0.45, 'sustain', '#7C5BA6', release=1.4)
    harp = Track('harp', '竖琴 · 琶音', 'harp', 0.3, 0.35, 0.45, 'pluck', '#8C6BB1')
    bell = Track('bell', '管钟', 'tubular-bells', 0.2, -0.1, 0.5, None, '#B8862E')
    timp = Track('timp', '定音鼓', 'timpani', 0.3, 0, 0.3, None, '#5E4A3A')
    flute = Track('fl', '长笛', 'flute', 0.2, 0.15, 0.45, 'sustain', '#C99A2E', release=0.8)
    for b, c in enumerate(prog):
        lo, mid, top = CH[c]
        s = b * 4
        cello.n(m(lo[0]) + 12, s, 4, 0.5 + 0.1 * (b % 8 == 0))
        if b >= 2:
            for i, nm in enumerate(mid[1:]):
                vio.n(m(nm) + 12, s, 4, 0.34 + 0.04 * (b // 8))
        # harp: rising arpeggio in eighths (after bar 4)
        if b >= 4:
            arp = [m(lo[0]) + 12, m(mid[0]), m(mid[1]), m(mid[2]), m(mid[3]), m(mid[2]) + 12, m(mid[3]), m(mid[1])]
            for i, p in enumerate(arp):
                harp.n(p, s + i * 0.5, 1.4, 0.32 + 0.12 * (i == 0) + random.uniform(-0.04, 0.04))
        if b % 4 == 0:
            bell.n(m(top) if m(top) >= 60 else m(top) + 12, s, 4, 0.42)
        if b % 8 == 7:
            for i in range(8):
                timp.n(m('D3') if c != 'Asus' else m('A2'), s + 2 + i * 0.25, 0.25, 0.12 + i * 0.05)
        if b >= 8 and b % 8 in (0, 4):
            line = [(m(top) + 12, 0, 1.5), (m(mid[3]) + 12, 1.5, 0.5), (m(mid[2]) + 12, 2, 2)]
            for p, o, d in line:
                if 60 <= p <= 96:
                    flute.n(p, s + o + 0.07, d, 0.42)
    return project('pv-axis', '能量轴', bpm, bars, [cello, vio, harp, bell, timp, flute])


def night():
    bpm, bars = 58, 32
    prog = ['Dm9', 'Bbmaj7', 'Gm9', 'Asus', 'Dm9', 'Ebmaj7', 'Gm9', 'A7'] * 4
    pad = Track('pad', '弦乐 · 震音铺底', 'strings', 0.16, 0.2, 0.5, 'tremolo', '#7C5BA6', humanize=0.2, release=1.5)
    cello = Track('cello', '大提琴', 'cello-section', 0.34, -0.25, 0.45, 'sustain', '#6B4C8A', release=1.5)
    harp = Track('harp', '竖琴', 'harp', 0.24, 0.3, 0.5, 'pluck', '#8C6BB1')
    flute = Track('fl', '长笛', 'flute', 0.16, -0.1, 0.5, 'sustain', '#C99A2E', release=1.0)
    vib = Track('vib', '颤音琴', 'vibraphone', 0.14, 0.4, 0.55, 'soft', '#A8822F')
    for b, c in enumerate(prog):
        lo, mid, top = CH[c]
        s = b * 4
        cello.n(m(lo[0]) + 12, s, 4, 0.42)
        for nm in mid[1:]:
            if m(nm) + 12 >= 55:
                pad.n(m(nm) + 12, s, 4, 0.28)
        for i, nm in enumerate([mid[0], mid[2], mid[3]]):
            harp.n(m(nm) + 12, s + 0.0 + i * 0.75 + (0.5 if b % 2 else 0), 2.5, 0.26 + random.uniform(-0.04, 0.04))
        if b % 4 == 2:
            vib.n(m(top) + 12, s + 2.5, 2, 0.3)
        if b >= 4 and b % 4 in (0, 1):
            notes = [m(top) + 12, m(mid[3]) + 12] if b % 4 == 0 else [m(mid[2]) + 12]
            for i, p in enumerate(notes):
                if 60 <= p <= 96:
                    flute.n(p, s + 1 + i * 2, 2.2 if i == 0 else 1.6, 0.36)
    return project('pv-night', '夜间判读', bpm, bars, [pad, cello, harp, flute, vib])


def ledger():
    bpm, bars = 76, 32
    prog = ['Dm9', 'Bbmaj7', 'Fmaj7', 'C6', 'Gm9', 'Bbmaj7', 'Fmaj7', 'Asus'] * 4
    pno = Track('pno', '钢琴 · 分解和弦', 'piano', 0.36, -0.05, 0.3, None, '#002FA7', humanize=0.3, release=0.8)
    pizz = Track('pizz', '弦乐 · 拨奏低音', 'cello-section', 0.3, -0.3, 0.3, 'pizzicato', '#6B4C8A')
    vib = Track('vib', '颤音琴', 'vibraphone', 0.16, 0.35, 0.45, 'soft', '#A8822F')
    vio = Track('vln', '小提琴组 · 长音', 'strings', 0.13, 0.3, 0.45, 'sustain', '#7C5BA6', release=1.2)
    for b, c in enumerate(prog):
        lo, mid, top = CH[c]
        s = b * 4
        # piano: broken chord pattern, sparse in the first bars
        pat = [m(lo[0]) + 12, m(mid[1]), m(mid[2]), m(mid[3]), m(mid[2]), m(mid[1])]
        times = [0, 1, 1.5, 2, 3, 3.5]
        for p, o in zip(pat, times):
            if b < 2 and o > 0:
                continue
            pno.n(p, s + o, 1.2, 0.3 + 0.1 * (o == 0) + random.uniform(-0.03, 0.03))
        if b >= 2:
            pizz.n(m(lo[0]) + 12, s, 1, 0.5)
            pizz.n(m(lo[1]) + 12, s + 2, 1, 0.38)
        if b % 2 == 1:
            vib.n(m(top) + 12 if m(top) + 12 <= 88 else m(top), s + 3, 1.5, 0.28)
        if b >= 8 and b % 4 == 0:
            vio.n(m(mid[3]) + 12, s, 8, 0.3)
    return project('pv-ledger', '卷宗', bpm, bars, [pno, pizz, vib, vio])


for f in (axis, night, ledger):
    p = f()
    json.dump(p, open(os.path.join(OUT, p['id'] + '.json'), 'w'), ensure_ascii=False)
    secs = p['bars'] * 4 * 60 / p['bpm']
    print(p['id'], p['bpm'], p['bars'], 'bars', round(secs, 1), 's', sum(len(t['notes']) for t in p['tracks']), 'notes')
