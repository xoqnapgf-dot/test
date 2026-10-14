"""Parse tools/script.txt into sections and lines.

Each line carries `sub` (what the subtitle shows), `say` (what the TTS reads) and `pause`
(seconds of silence after it). `[A|B]` shows A and says B.
"""
import re, hashlib

TOKEN = re.compile(r'\[([^|\]]+)\|([^\]]+)\]')
PAUSE = re.compile(r'\{p=([\d.]+)\}\s*$')


def parse(path):
    sections, cur = [], None
    for raw in open(path, encoding='utf-8'):
        s = raw.strip()
        if not s or (s.startswith('#') and not s.startswith('## ')):
            continue
        if s.startswith('## '):
            sid, _, title = s[3:].partition(' ')
            cur = {'id': sid, 'title': title.strip(), 'lines': []}
            sections.append(cur)
            continue
        pause = 0.3
        m = PAUSE.search(s)
        if m:
            pause = float(m.group(1))
            s = s[:m.start()].rstrip()
        sub = TOKEN.sub(lambda m: m.group(1), s)
        say = TOKEN.sub(lambda m: m.group(2), s)
        say = say.replace('（', '').replace('）', '').replace('「', '').replace('」', '')
        cur['lines'].append({'sub': sub, 'say': say, 'pause': pause,
                             'key': hashlib.sha1(say.encode()).hexdigest()[:12]})
    return sections


if __name__ == '__main__':
    import sys
    secs = parse(sys.argv[1])
    n = sum(len(s['lines']) for s in secs)
    chars = sum(len(l['say']) for s in secs for l in s['lines'])
    print(len(secs), 'sections', n, 'lines', chars, 'chars')
    for s in secs:
        for l in s['lines']:
            if l['sub'] != l['say']:
                print(' ', l['sub'], '=>', l['say'])
