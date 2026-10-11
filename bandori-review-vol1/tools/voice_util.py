"""Shared voice-clip loading (48 kHz mono, silence-trimmed)."""
import numpy as np, soundfile as sf
SR = 48000

def load(path):
    y, sr = sf.read(path, dtype='float32')
    if y.ndim > 1: y = y.mean(1)
    if sr != SR:
        import librosa
        y = librosa.resample(y, orig_sr=sr, target_sr=SR)
    # trim leading/trailing silence (-42 dBFS), keep 30 ms
    a = np.abs(y); thr = 10 ** (-42 / 20) * a.max()
    idx = np.where(a > thr)[0]
    s, e = max(0, idx[0] - int(0.03 * SR)), min(len(y), idx[-1] + int(0.05 * SR))
    return y[s:e]
