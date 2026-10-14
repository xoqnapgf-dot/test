"""Procedural sound effects (no samples). Each entry: SR -> mono float32 array, peak ≈ 1."""
import numpy as np

rng = np.random.default_rng(7)

def _t(sr, d): return np.arange(int(sr * d)) / sr
def _env(n, a, sr, curve=4):
    t = np.arange(n) / sr; e = np.exp(-t * curve); k = int(a * sr)
    if k: e[:k] *= np.linspace(0, 1, k)
    return e
def _norm(x): return (x / (np.abs(x).max() + 1e-9)).astype(np.float32)
def _noise(n): return rng.standard_normal(n)
def _lp(x, k):  # one-pole low-pass, k in (0,1]
    y = np.empty_like(x); s = 0.0
    for i, v in enumerate(x): s += k * (v - s); y[i] = s
    return y

def pop(sr):
    t = _t(sr, 0.14); f = 900 * np.exp(-t * 30) + 250
    return _norm(np.sin(2 * np.pi * np.cumsum(f) / sr) * _env(len(t), 0.002, sr, 35))
def tick(sr):
    t = _t(sr, 0.08); return _norm(np.sin(2 * np.pi * 1800 * t) * _env(len(t), 0.001, sr, 70) + 0.3 * _noise(len(t)) * _env(len(t), 0, sr, 150))
def ding(sr):
    t = _t(sr, 1.2); x = sum(np.sin(2 * np.pi * f * t) * a for f, a in [(1320, 1), (2640, .35), (3960, .15)])
    return _norm(x * _env(len(t), 0.003, sr, 4.5))
def chime(sr):
    t = _t(sr, 1.6); x = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * (3 + i)) for i, f in enumerate([880, 1108.7, 1318.5, 1760]))
    return _norm(x)
def sparkle(sr):
    out = np.zeros(int(sr * 0.9))
    for i, f in enumerate([1568, 2093, 2637, 3136, 3951]):
        t = _t(sr, 0.5); s = np.sin(2 * np.pi * f * t) * _env(len(t), 0.002, sr, 9); j = int(i * 0.07 * sr); out[j:j + len(s)] += s
    return _norm(out)
def whoosh(sr):
    n = int(sr * 0.5); x = _noise(n); t = np.arange(n) / n
    x = _lp(x, 0.08 + 0.25 * np.sin(np.pi * t).mean()) * np.sin(np.pi * t) ** 2
    return _norm(x) * 0.8
def stamp(sr):
    t = _t(sr, 0.35); f = 140 * np.exp(-t * 12) + 55
    x = np.sin(2 * np.pi * np.cumsum(f) / sr) * _env(len(t), 0.001, sr, 14) + 0.5 * _lp(_noise(len(t)), 0.2) * _env(len(t), 0, sr, 40)
    return _norm(x)
def thud(sr): return stamp(sr)
def hit(sr):
    t = _t(sr, 0.5); x = np.sin(2 * np.pi * np.cumsum(120 * np.exp(-t * 8) + 40) / sr) * _env(len(t), 0, sr, 8) + 0.6 * _noise(len(t)) * _env(len(t), 0, sr, 30)
    return _norm(x)
def boing(sr):
    t = _t(sr, 0.5); f = 220 + 160 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 4)
    return _norm(np.sin(2 * np.pi * np.cumsum(f) / sr) * _env(len(t), 0.005, sr, 6))
def buzz(sr):
    t = _t(sr, 0.32); x = np.sign(np.sin(2 * np.pi * 150 * t)) * 0.5 + np.sign(np.sin(2 * np.pi * 155 * t)) * 0.5
    return _norm(_lp(x, 0.2) * _env(len(t), 0.005, sr, 6)) * 0.7
def scratch(sr):
    t = _t(sr, 0.45); f = 600 + 900 * np.sin(2 * np.pi * 3 * t)
    x = _lp(_noise(len(t)), 0.3) * (0.5 + 0.5 * np.sin(2 * np.pi * np.cumsum(f) / sr))
    return _norm(x * _env(len(t), 0.01, sr, 5))
def radio(sr):
    t = _t(sr, 0.9); x = np.sin(2 * np.pi * np.cumsum(1200 + 500 * np.sin(2 * np.pi * 5 * t)) / sr) * 0.5 + 0.3 * _noise(len(t))
    return _norm(x * np.sin(np.pi * t / t[-1]) ** 2) * 0.6
def dark(sr):
    t = _t(sr, 1.2); x = sum(np.sin(2 * np.pi * f * t) for f in [55, 58.3, 110])
    return _norm(x * np.sin(np.pi * t / t[-1])) * 0.8
def rise(sr):
    t = _t(sr, 0.8); f = 300 * 2 ** (t * 3)
    return _norm(np.sin(2 * np.pi * np.cumsum(f) / sr) * np.sin(np.pi * t / t[-1]) ** 2) * 0.6
def spinup(sr):
    t = _t(sr, 2.0); f = 4 + 30 * t ** 2
    clicks = (np.sin(2 * np.pi * np.cumsum(f) / sr) > 0.97).astype(float)
    return _norm(_lp(clicks, 0.6) + 0.3 * np.sin(2 * np.pi * np.cumsum(80 + 200 * t) / sr) * t / 2)
def shock(sr):
    t = _t(sr, 0.6); x = sum(np.sin(2 * np.pi * f * t) for f in [1046, 1108, 1568]) * _env(len(t), 0.002, sr, 6)
    return _norm(x)
def pierce(sr):
    a = whoosh(sr)[: int(sr * 0.25)]; b = stamp(sr)
    return _norm(np.concatenate([a * 0.6, b]))
def alert(sr):
    t = _t(sr, 0.6); x = np.sign(np.sin(2 * np.pi * np.where(t % 0.3 < 0.15, 880, 660) * t)) * 0.4
    return _norm(_lp(x, 0.3) * _env(len(t), 0.005, sr, 3)) * 0.6
def steam(sr):
    t = _t(sr, 0.9); x = _noise(len(t)) - _lp(_noise(len(t)), 0.1)
    return _norm(x * np.sin(np.pi * t / t[-1]) ** 0.5) * 0.5
def lockon(sr):
    out = np.zeros(int(sr * 0.5))
    for i in range(3):
        t = _t(sr, 0.07); s = np.sin(2 * np.pi * 2200 * t) * _env(len(t), 0.001, sr, 40); j = int(i * 0.12 * sr); out[j:j + len(s)] += s
    return _norm(out)
def type_(sr):
    out = np.zeros(int(sr * 2.6))
    for i in range(22):
        t = _t(sr, 0.04); s = _lp(_noise(len(t)), 0.5) * _env(len(t), 0, sr, 90); j = int((i * 0.11 + (i % 3) * 0.013) * sr); out[j:j + len(s)] += s
    return _norm(out) * 0.6
def shutter(sr):
    a = tick(sr); b = _lp(_noise(int(sr * 0.06)), 0.4) * _env(int(sr * 0.06), 0, sr, 60)
    out = np.zeros(int(sr * 0.2)); out[:len(a)] += a; j = int(0.07 * sr); out[j:j + len(b)] += b * 0.8
    return _norm(out)
def sword(sr):
    t = _t(sr, 0.7); x = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, d in [(3400, 6), (5100, 9), (2200, 4)])
    w = whoosh(sr)[: int(sr * 0.2)]
    out = np.zeros(len(t) + len(w)); out[:len(w)] += w * 0.7; out[len(w):] += x * 0.6
    return _norm(out)

SOUNDS = {'pop': pop, 'tick': tick, 'ding': ding, 'chime': chime, 'sparkle': sparkle, 'whoosh': whoosh, 'stamp': stamp, 'thud': thud,
          'hit': hit, 'boing': boing, 'buzz': buzz, 'scratch': scratch, 'radio': radio, 'dark': dark, 'rise': rise, 'spinup': spinup,
          'shock': shock, 'pierce': pierce, 'alert': alert, 'steam': steam, 'lockon': lockon, 'type': type_, 'shutter': shutter, 'sword': sword}
