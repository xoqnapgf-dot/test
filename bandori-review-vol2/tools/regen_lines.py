"""Re-synthesize chosen lines with a stricter, line-specific check (after make_voice_qc.py).

usage: python regen_lines.py <script.txt> <workdir> <voxcpm2_dir> <lora_dir> <reference.wav> <timbre_ref_dir> <rules.json>

rules.json: {"<substring of the subtitle>": {"need": ["<regex>", …], "py": ["<toneless pinyin>", …], "tries": 8}, …}
The general checks of make_voice_qc.py still apply; the Whisper read-back must also match every `need` regex
(case-insensitive) and contain every `py` syllable run (e.g. "li xi" for 立希, whatever characters Whisper picks). Used for English/romaji names, where pinyin comparison can't tell a good take from a bad one.
"""
import sys, os, json, re, time
sys.argv, rules_path = sys.argv[:7], sys.argv[7]
os.environ['QC_IMPORT_ONLY'] = '1'
import make_voice_qc as Q  # noqa: E402  (loads models, skips its main loop)
import soundfile as sf

rules = json.load(open(rules_path))
qc = json.load(open(f'{Q.work}/qc.json'))
lines = [l for s in Q.parse(Q.script) for l in s['lines']]
for key_text, rule in rules.items():
    l = next(l for l in lines if key_text in l['sub'])
    out, best = f"{Q.work}/voice/{l['key']}.wav", None
    for k in range(rule.get('tries', 8)):
        t = time.time()
        wav = Q.model.generate(text=l['say'], reference_wav_path=Q.ref_wav, cfg_value=2.0, inference_timesteps=10)
        tmp = f"{Q.work}/voice/{l['key']}.re{k}.wav"; sf.write(tmp, wav, Q.sr_out)
        ok, score, info = Q.check(Q.load(tmp), l['say'])
        hp = ' '.join(Q.lazy_pinyin(c)[0] for c in info['hyp'] if Q.CJK.match(c))
        hit = all(re.search(p, info['hyp'], re.I) for p in rule.get('need', [])) and all(f' {p} ' in f' {hp} ' for p in rule.get('py', []))
        ok = ok and hit
        score += 0 if hit else 5
        print(f"[{l['key']}] re{k} {'OK ' if ok else 'BAD'} {info} {time.time() - t:.0f}s  {l['say']}", flush=True)
        if best is None or (not ok, score) < (not best[2], best[0]): best = (score, tmp, ok, info)  # a passing take always wins
        if ok: break
    os.replace(best[1], out)
    for f in os.listdir(f'{Q.work}/voice'):
        if f.startswith(l['key'] + '.re'): os.remove(f'{Q.work}/voice/{f}')
    qc[l['key']] = dict(ok=best[2], say=l['say'], **best[3])
    json.dump(qc, open(f'{Q.work}/qc.json', 'w'), ensure_ascii=False, indent=1)
print('DONE')
