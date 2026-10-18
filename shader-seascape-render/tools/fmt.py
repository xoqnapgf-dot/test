#!/usr/bin/env python3
"""Reads the JSON that shot.mjs/diag.mjs print and prints the measure table.

`__probe.sample()` returns display-referred floats in 0..1, so every previous print that
used %d silently collapsed them to 0. This helper always scales to bytes and also shows
the raw floats when asked for with -v.
"""
import json
import sys

raw = sys.stdin.read()
i = raw.find('{')
j = raw.rfind('}')
if i < 0 or j < 0:
    print(raw[-2000:])
    sys.exit(1)
try:
    d = json.loads(raw[i:j + 1])
except json.JSONDecodeError:
    # the tool sometimes prints a log line after the JSON
    for end in range(len(raw), i, -1):
        try:
            d = json.loads(raw[i:end])
            break
        except json.JSONDecodeError:
            continue
    else:
        print(raw[-2000:])
        sys.exit(1)

verbose = '-v' in sys.argv
for m in d.get('measures', []):
    vals = []
    for s in m['samples']:
        r, g, b = s['rgb']
        if verbose:
            vals.append('[%.3f %.3f %.3f]' % (r, g, b))
        else:
            vals.append('[%3d %3d %3d]' % (round(r * 255), round(g * 255), round(b * 255)))
    extra = ''
    if 'camera' in m:
        extra += '  cam ' + json.dumps(m['camera'])
    if 'stats' in m:
        st = m['stats']
        extra = '  luma min %.3f p50 %.3f max %.3f mean %.3f' % (st['min'], st['p50'], st['max'], st['mean'])
    print('%-14s %s%s' % (m['name'], ' '.join(vals), extra))
for s in (d.get('shots') if isinstance(d.get('shots'), list) else []):
    if isinstance(s, dict):
        print('shot %-14s %s' % (s.get('name', '?'), s.get('file', s.get('bytes', ''))))
print('info:', json.dumps(d.get('info', {})))
if 'terrain' in d:
    t = d['terrain']
    print('terrain:', json.dumps(t)[:400])
