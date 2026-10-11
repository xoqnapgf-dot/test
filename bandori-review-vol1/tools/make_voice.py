"""Synthesize every script line with VoxCPM2 + the 曼波 LoRA (CPU is fine, ~16x slower than real time).

usage: python make_voice.py <script.txt> <workdir> <voxcpm2_dir> <lora_dir> [only_keys...]
Writes <workdir>/voice/<key>.wav per line (cached by the spoken text) and prints progress.
"""
import sys, os, json, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from script_parse import parse
import torch, soundfile as sf
from voxcpm import VoxCPM
from voxcpm.model.voxcpm import LoRAConfig

script, work, base, lora = sys.argv[1:5]
only = set(sys.argv[5:])
os.makedirs(f'{work}/voice', exist_ok=True)
torch.set_num_threads(os.cpu_count())
cfg = json.load(open(f'{lora}/lora_config.json'))['lora_config']
lc = LoRAConfig(**{k: v for k, v in cfg.items() if k in LoRAConfig.model_fields})
model = VoxCPM(base, zipenhancer_model_path=None, enable_denoiser=False, optimize=False,
               device='cpu', lora_config=lc, lora_weights_path=lora)
sr = model.tts_model.sample_rate
lines = [l for s in parse(script) for l in s['lines']]
for i, l in enumerate(lines):
    out = f"{work}/voice/{l['key']}.wav"
    if (only and l['key'] not in only) or (not only and os.path.exists(out)):
        continue
    t = time.time()
    wav = model.generate(text=l['say'], cfg_value=2.0, inference_timesteps=10)
    sf.write(out, wav, sr)
    print(f"[{i + 1}/{len(lines)}] {len(wav) / sr:.1f}s in {time.time() - t:.0f}s  {l['say']}", flush=True)
print('DONE', flush=True)
