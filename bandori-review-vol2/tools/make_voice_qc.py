"""Synthesize every line with VoxCPM2 + 曼波 LoRA, anchored to a reference clip, and check each take.

usage: python make_voice_qc.py <script.txt> <workdir> <voxcpm2_dir> <lora_dir> <reference.wav> <timbre_ref_dir>

Each take is read back with Whisper and compared by toneless pinyin (homophones are fine — the subtitle comes
from the script), and its pitch, timbre (MFCC distance to the reference set) and speaking rate are measured.
A take that fails is re-synthesized, up to MAX_TRIES; the best-scoring take is kept. Results → <workdir>/qc.json
"""
import sys, os, json, re, glob, time, difflib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from script_parse import parse
from voice_util import load, SR
import numpy as np, soundfile as sf, librosa, torch
from voxcpm import VoxCPM
from voxcpm.model.voxcpm import LoRAConfig
from faster_whisper import WhisperModel
from pypinyin import lazy_pinyin

script, work, base, lora, ref_wav, timbre_dir = sys.argv[1:7]
MAX_TRIES = 5
os.makedirs(f'{work}/voice', exist_ok=True)
torch.set_num_threads(os.cpu_count())
CJK = re.compile(r'[一-鿿]')

def feats(y):
    y16 = librosa.resample(y, orig_sr=SR, target_sr=16000)
    m = librosa.feature.mfcc(y=y16, sr=16000, n_mfcc=20)
    f0, _, _ = librosa.pyin(y16, fmin=80, fmax=700, sr=16000)
    return y16, np.concatenate([m.mean(1), m.std(1)]), float(np.nanmedian(f0))

# timbre reference: the previous episode's lines (mean/std of MFCC stats)
ref = np.array([feats(load(f))[1] for f in sorted(glob.glob(f'{timbre_dir}/*.wav'))[:60]])
mu, sd = ref.mean(0), ref.std(0) + 1e-9
ref_dist = np.linalg.norm((ref - mu) / sd, axis=1)
d_med, d_sd = np.median(ref_dist), ref_dist.std() + 1e-9

cfg = json.load(open(f'{lora}/lora_config.json'))['lora_config']
lc = LoRAConfig(**{k: v for k, v in cfg.items() if k in LoRAConfig.model_fields})
model = VoxCPM(base, zipenhancer_model_path=None, enable_denoiser=False, optimize=False, device='cpu', lora_config=lc, lora_weights_path=lora)
asr = WhisperModel('small', device='cpu', compute_type='int8')
sr_out = model.tts_model.sample_rate

def check(y, say):
    y16, f, f0 = feats(y)
    segs, _ = asr.transcribe(y16, language='zh', initial_prompt='以下是普通话的句子。')
    hyp = ''.join(s.text for s in segs)
    rp = [lazy_pinyin(c)[0] for c in say if CJK.match(c)]
    hp = [lazy_pinyin(c)[0] for c in hyp if CJK.match(c)]
    sm = difflib.SequenceMatcher(None, rp, hp, autojunk=False)
    err = 1 - sum(b.size for b in sm.get_matching_blocks()) / max(len(rp), 1)
    extra = max(0, len(hp) - len(rp)) / max(len(rp), 1)        # hallucinated / repeated words
    tz = (np.linalg.norm((f - mu) / sd) - d_med) / d_sd
    n = sum(1 for c in say if CJK.match(c)) + 0.4 * sum(1 for c in say if c.isascii() and c.isalnum())
    rate = n / (len(y) / SR)
    ok = err <= 0.06 and extra <= 0.1 and 285 <= f0 <= 372 and tz <= 1.6 and 3.6 <= rate <= 7.2
    score = err * 10 + extra * 10 + max(0, abs(f0 - 322) - 25) / 15 + max(0, tz - 1.0) + max(0, 3.8 - rate) + max(0, rate - 7)
    return ok, score, dict(err=round(err, 3), extra=round(extra, 3), f0=round(f0), timbre=round(float(tz), 2), rate=round(rate, 2), hyp=hyp)

def main():
    qc = json.load(open(f'{work}/qc.json')) if os.path.exists(f'{work}/qc.json') else {}
    lines = [l for s in parse(script) for l in s['lines']]
    for i, l in enumerate(lines):
        out = f"{work}/voice/{l['key']}.wav"
        if os.path.exists(out) and qc.get(l['key'], {}).get('ok'):
            continue
        best = None
        for k in range(MAX_TRIES):
            t = time.time()
            wav = model.generate(text=l['say'], reference_wav_path=ref_wav, cfg_value=2.0, inference_timesteps=10)
            tmp = f"{work}/voice/{l['key']}.try{k}.wav"; sf.write(tmp, wav, sr_out)
            ok, score, info = check(load(tmp), l['say'])
            print(f"[{i + 1}/{len(lines)}] try{k} {'OK ' if ok else 'BAD'} {info} {time.time() - t:.0f}s  {l['say']}", flush=True)
            if best is None or (not ok, score) < (not best[2], best[0]): best = (score, tmp, ok, info)  # a passing take always wins
            if ok: break
        os.replace(best[1], out)
        for f in glob.glob(f"{work}/voice/{l['key']}.try*.wav"): os.remove(f)
        qc[l['key']] = dict(ok=best[2], say=l['say'], **best[3])
        json.dump(qc, open(f'{work}/qc.json', 'w'), ensure_ascii=False, indent=1)
    bad = [v for v in qc.values() if not v['ok']]
    print('DONE', len(lines), 'lines;', len(bad), 'still flagged', flush=True)
    for v in bad: print('FLAG', v)


if not os.environ.get('QC_IMPORT_ONLY'):
    main()
