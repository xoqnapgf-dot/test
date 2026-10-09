"""Generate the narration line by line with edge-tts (Yunyang) and record durations + word timings.
usage: python3 tools/make_voice.py <workdir>"""
import json, os, sys, subprocess
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
work = sys.argv[1]
os.makedirs(work, exist_ok=True)
S = json.load(open(os.path.join(root, 'tools', 'script.json')))
out = []
for si, sc in enumerate(S['scenes']):
    for li, ln in enumerate(sc['lines']):
        base = os.path.join(work, f'{si:02d}_{li:02d}')
        if not os.path.exists(base + '.mp3') or os.path.getsize(base + '.mp3') == 0:
            subprocess.run([sys.executable, os.path.join(root, 'tools', 'tts.py'), S['voice'], S['rate'], base, ln['say']], check=True)
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', base + '.mp3'], capture_output=True, text=True).stdout)
        out.append({'scene': sc['id'], 'si': si, 'li': li, 'file': base + '.mp3', 'dur': dur, 'words': json.load(open(base + '.json'))})
        print(sc['id'], li, round(dur, 2), flush=True)
json.dump(out, open(os.path.join(work, 'lines.json'), 'w'), ensure_ascii=False)
print('total', round(sum(o['dur'] for o in out), 1))
