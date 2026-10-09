"""Mix narration + score cues + a few synthesised effects into assets/soundtrack.mp3.
usage: python3 tools/build_audio.py <voice-workdir> <music-dir>

<voice-workdir>/narration.wav comes from build_timeline.py; <music-dir>/out-{axis,night,ledger}/mix.wav
are the XSXB-Band renders of tools/compose.py. Each cue loops on a fixed global grid (so two chapters
in a row with the same cue continue seamlessly), cues crossfade at chapter changes, and the music is
ducked under the voice with a smoothed side-chain envelope."""
import json, os, re, subprocess, sys, wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE, MUSIC = sys.argv[1], sys.argv[2]
SR = 48000

tl = open(os.path.join(ROOT, 'src', 'data', 'timeline.js'), encoding='utf-8').read()
TOTAL = float(re.search(r'TOTAL = ([\d.]+)', tl).group(1))
SCENES = json.loads(re.search(r'SCENES = (\[.*\]);', tl, re.S).group(1))
BYID = {s['id']: s for s in SCENES}


def cue(sid, i, kw='', off=0.0):
    """time at which `kw` starts being spoken (same mapping as src/core/time.js, word-level)"""
    ln = BYID[sid]['lines'][i]
    if not kw:
        return ln['t0'] + off
    at = ln['say'].index(kw)
    pos = 0
    best = ln['t0']
    for t, w in ln['w']:
        j = ln['say'].find(w, pos)
        if j < 0:
            continue
        if j > at:
            break
        best = t
        pos = j + len(w)
    return best + off


def load(path, sr=SR, ch=2):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', str(ch), '-ar', str(sr), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, ch).copy()


n = int((TOTAL + 1) * SR)
voice = load(os.path.join(VOICE, 'narration.wav'), ch=1)[:, 0]
voice = np.pad(voice, (0, max(0, n - len(voice))))[:n]

# ---------------------------------------------------------------- score bed
CUES = {k: load(os.path.join(MUSIC, f'out-{k}', 'mix.wav')) for k in ('axis', 'night', 'ledger')}
LEN = {'axis': 32 * 4 * 60 / 64, 'night': 32 * 4 * 60 / 58, 'ledger': 32 * 4 * 60 / 76}
CHAPTER_CUE = {'open': 'axis', 'end': 'axis', 'use': 'night', 'r02': 'night', 'r03': 'night', 'r06': 'night', 'r07': 'night', 'r10': 'night', 'r13': 'night', 'r15': 'night'}


def looped(name):
    """the cue repeated over the whole film on a global grid, tails overlapped into the next pass"""
    src = CUES[name]
    L = int(LEN[name] * SR)
    out = np.zeros((n, 2), dtype=np.float32)
    k = 0
    while k * L < n:
        a = k * L
        seg = src[: min(len(src), n - a)]
        out[a : a + len(seg)] += seg
        k += 1
    return out


beds = {k: looped(k) for k in CUES}
music = np.zeros((n, 2), dtype=np.float32)
XF = 3.0
wts = {k: np.zeros(n, dtype=np.float32) for k in CUES}
for i, s in enumerate(SCENES):
    name = CHAPTER_CUE.get(s['id'], 'ledger')
    a = int(max(0, s['t0'] - (XF / 2 if i else 0)) * SR)
    b = int(min(TOTAL + 1, s['t1'] + (XF / 2 if i + 1 < len(SCENES) else 1)) * SR)
    w = np.ones(b - a, dtype=np.float32)
    f = int(XF * SR)
    if i:
        w[:f] = np.sin(np.linspace(0, np.pi / 2, f)) ** 2
    if i + 1 < len(SCENES):
        w[-f:] = np.minimum(w[-f:], np.cos(np.linspace(0, np.pi / 2, f)) ** 2)
    wts[name][a:b] = np.maximum(wts[name][a:b], w)
for k in CUES:
    music += beds[k] * wts[k][:, None]

# side-chain ducking from the voice envelope
env = np.abs(voice)
blk = int(0.02 * SR)
m = len(env) // blk
e = env[: m * blk].reshape(m, blk).max(axis=1)
sm = np.zeros_like(e)
att, rel = np.exp(-1 / (0.12 / 0.02)), np.exp(-1 / (0.9 / 0.02))
for i in range(1, m):
    c = att if e[i] > sm[i - 1] else rel
    sm[i] = c * sm[i - 1] + (1 - c) * e[i]
talk = np.clip(sm / 0.08, 0, 1)
gain_db = -9.0 - 7.0 * talk  # -9 dB in gaps, -16 dB under speech
gain = np.repeat(10 ** (gain_db / 20), blk)
gain = np.pad(gain, (0, n - len(gain)), mode='edge')
music *= gain[:, None]
# overall fades
fi = int(4 * SR)
music[:fi] *= np.linspace(0, 1, fi)[:, None]
fo = int(7 * SR)
music[n - fo :] *= np.linspace(1, 0, fo)[:, None]

# ---------------------------------------------------------------- effects
rng = np.random.default_rng(3)
fx = np.zeros((n, 2), dtype=np.float32)


def place(sig, t, pan=0.0, g=1.0):
    a = int(t * SR)
    if a < 0 or a >= n:
        return
    sig = sig[: n - a]
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    fx[a : a + len(sig), 0] += sig * l * g
    fx[a : a + len(sig), 1] += sig * r * g


def lowpass(x, cut):
    a = np.exp(-2 * np.pi * cut / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


def whoosh(d=1.6):
    k = int(d * SR)
    t = np.linspace(0, 1, k)
    noise = rng.standard_normal(k).astype(np.float32)
    # moving one-pole lowpass sweep (vectorised in chunks)
    out = np.zeros(k, dtype=np.float32)
    acc = 0.0
    for i in range(0, k, 256):
        cut = 300 + 2600 * np.sin(np.pi * t[i]) ** 2
        a = np.exp(-2 * np.pi * cut / SR)
        seg = noise[i : i + 256]
        for j in range(len(seg)):
            acc = (1 - a) * seg[j] + a * acc
            out[i + j] = acc
    return out * np.sin(np.pi * t) ** 2 * 0.5


def boom(d=2.5, f0=55):
    k = int(d * SR)
    t = np.arange(k) / SR
    f = f0 * (1 + 0.8 * np.exp(-t * 6))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-t * 2.2) * 0.9 + lowpass(rng.standard_normal(k).astype(np.float32), 180) * np.exp(-t * 4) * 1.2).astype(np.float32)


def crack(d=0.9):
    k = int(d * SR)
    t = np.arange(k) / SR
    hi = rng.standard_normal(k).astype(np.float32) * np.exp(-t * 18)
    grit = np.zeros(k, dtype=np.float32)
    for _ in range(26):
        p = int(rng.uniform(0, 0.5) * SR)
        L = int(0.012 * SR)
        grit[p : p + L] += rng.standard_normal(min(L, k - p)).astype(np.float32) * rng.uniform(0.2, 0.7) * np.exp(-t[p] * 5)
    return (hi * 0.6 + grit * 0.7 + np.pad(boom(0.9, 70), (0, max(0, k - int(0.9 * SR))))[:k] * 0.5).astype(np.float32)


def swell(d=3.0, f=110):
    k = int(d * SR)
    t = np.arange(k) / SR
    s = sum(np.sin(2 * np.pi * f * h * t + h) / h for h in (1, 2, 3, 4.01))
    noise = lowpass(rng.standard_normal(k).astype(np.float32), 900)
    env_ = (t / d) ** 2 * np.exp(-((t - d) ** 2) / 0.02) + 0.0
    env_ = np.minimum(1, (t / d) ** 2.5) * (1 - np.clip((t - d + 0.25) / 0.25, 0, 1))
    return ((s * 0.25 + noise * 0.8) * env_).astype(np.float32)


def chime(f=880, d=2.4):
    k = int(d * SR)
    t = np.arange(k) / SR
    return (sum(np.sin(2 * np.pi * f * h * t) * np.exp(-t * (2 + h)) / h for h in (1, 2.76, 5.4)) * 0.35).astype(np.float32)


W = whoosh()
for i, s in enumerate(SCENES):
    if i:
        place(W, s['t0'] - 0.5, pan=-0.3 + 0.6 * (i % 2), g=0.22)
        if s['id'] != 'end':
            place(chime(587.33 if i % 2 else 440.0), s['t0'] + 0.9, pan=0.0, g=0.10)
# opening: the brick, the sun
place(crack(), cue('open', 1, '打碎', 0.15), pan=-0.2, g=0.5)
place(swell(2.6, 73.4), cue('open', 3, '二点', -1.6), g=0.35)
place(boom(3.2, 48), cue('open', 3, '二点', 1.0), g=0.25)
# 0.6 / 0.10 / 0.13 / 0.15.1 moments
place(swell(1.6, 98), cue('r10', 7, '打出', -0.4), g=0.2)
place(boom(3.0, 50), cue('r10', 7, '摧毁'), g=0.32)
place(boom(3.0, 46), cue('r10', 10, '扩散模型', -0.8), g=0.3)
place(boom(3.5, 42), cue('r13', 4, '爆炸', -0.2), g=0.45)
place(crack(1.2), cue('r13', 4, '爆炸', -0.15), g=0.35)
place(swell(1.4, 110), cue('r13', 11, '白矮星', 0.0), g=0.22)
place(boom(4.0, 40), cue('r13', 11, '白矮星', 1.4), g=0.45)
place(boom(2.5, 52), cue('r03', 8, '摧毁范围', -1.0), g=0.25)
place(crack(0.8), cue('use', 9, '实锤', 0), g=0.3)

# ---------------------------------------------------------------- mixdown
mix = music + fx
mix[:, 0] += voice
mix[:, 1] += voice
peak = np.abs(mix).max()
if peak > 0.98:
    mix *= 0.98 / peak
tmp = os.path.join(VOICE, 'mix.wav')
with wave.open(tmp, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.clip(mix, -1, 1) * 32767).astype('<i2').tobytes())
out = os.path.join(ROOT, 'assets', 'soundtrack.mp3')
# two-pass loudnorm in linear mode: one fixed gain for the whole film (single-pass would
# compress dynamics and lift the quiet music-only passages)
meas = subprocess.run(['ffmpeg', '-hide_banner', '-i', tmp, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=20:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
J = json.loads(meas[meas.rindex('{'):meas.rindex('}') + 1])
ln = ('loudnorm=I=-16:TP=-1.5:LRA=20:linear=true:measured_I={input_i}:measured_TP={input_tp}:measured_LRA={input_lra}:'
      'measured_thresh={input_thresh}:offset={target_offset}').format(**J)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', ln, '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '128k', out], check=True)
print('wrote', out, os.path.getsize(out) // 1024, 'KB', 'duration', TOTAL)
