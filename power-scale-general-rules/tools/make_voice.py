"""Voice every narration line with edge-tts and record word boundaries.
usage: python3 tools/make_voice.py <workdir>
Writes <workdir>/<scene>_<line>.mp3 + .json (word timings) and <workdir>/lines.json."""
import asyncio, json, os, subprocess, sys

import ssl

import edge_tts
import edge_tts.communicate

# Honour a custom CA bundle / HTTPS proxy when one is configured (edge-tts pins certifi otherwise).
if os.environ.get('SSL_CERT_FILE'):
    edge_tts.communicate._SSL_CTX = ssl.create_default_context(cafile=os.environ['SSL_CERT_FILE'])
PROXY = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = sys.argv[1]
os.makedirs(WORK, exist_ok=True)
S = json.load(open(os.path.join(ROOT, 'tools', 'script.json'), encoding='utf-8'))


async def speak(text, base):
    for attempt in range(5):
        try:
            com = edge_tts.Communicate(text, S['voice'], rate=S['rate'], boundary='WordBoundary', proxy=PROXY)
            words, audio = [], bytearray()
            async for ch in com.stream():
                if ch['type'] == 'audio':
                    audio += ch['data']
                elif ch['type'] == 'WordBoundary':
                    words.append({'t': ch['offset'] / 1e7, 'd': ch['duration'] / 1e7, 'w': ch['text']})
            if not audio:
                raise RuntimeError('empty audio')
            open(base + '.mp3', 'wb').write(audio)
            json.dump(words, open(base + '.json', 'w'), ensure_ascii=False)
            return
        except Exception as e:  # network hiccups: back off and retry
            print('retry', base, e, flush=True)
            await asyncio.sleep(2 ** attempt)
    raise SystemExit('tts failed: ' + base)


def duration(f):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f],
                         capture_output=True, text=True).stdout
    return float(out)


async def main():
    out = []
    for sc in S['scenes']:
        for li, ln in enumerate(sc['lines']):
            base = os.path.join(WORK, f"{sc['id']}_{li:02d}")
            stamp = base + '.txt'
            key = S['voice'] + '|' + S['rate'] + '|' + ln['say']
            if not (os.path.exists(stamp) and open(stamp, encoding='utf-8').read() == key and os.path.exists(base + '.mp3')):
                await speak(ln['say'], base)
                open(stamp, 'w', encoding='utf-8').write(key)
            out.append({'scene': sc['id'], 'li': li, 'file': base + '.mp3', 'dur': duration(base + '.mp3'),
                        'words': json.load(open(base + '.json', encoding='utf-8'))})
            print(sc['id'], li, round(out[-1]['dur'], 2), flush=True)
    json.dump(out, open(os.path.join(WORK, 'lines.json'), 'w'), ensure_ascii=False)
    print('total', round(sum(o['dur'] for o in out), 1))


asyncio.run(main())
