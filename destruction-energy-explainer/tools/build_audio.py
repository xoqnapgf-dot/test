"""Score + sound effects + final mix.
usage: python3 tools/build_audio.py <voice-workdir>

Reads src/data/timeline.js (the same narration clock the visuals use), synthesises
  - an ambient score: one chord per chapter, detuned band-limited saw pads through a low-pass,
    a soft noise "air" bed and bell plucks on line starts;
  - sound effects placed on the same spoken-word cues as the animation (impacts on 打碎, the
    five specimens breaking on their values, the slash and the double impact in 斩陨, ...);
ducks music and effects under <voice-workdir>/narration.wav and writes assets/explainer.mp3.
Everything is generated here; no third-party audio is used."""
import json, os, subprocess, sys
import numpy as np
from scipy import signal
import soundfile as sf

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
work = sys.argv[1]
SR = 48000
rng = np.random.default_rng(7)

src = open(os.path.join(root, 'src', 'data', 'timeline.js'), encoding='utf-8').read()
TOTAL = float(src.split('TOTAL = ')[1].split(';')[0])
SCENES = json.loads(src.split('SCENES = ')[1].rstrip().rstrip(';'))
BY = {s['id']: s for s in SCENES}
N = int((TOTAL + 1) * SR)


# ---- cue lookup: identical logic to src/core/narr.js
def char_times(l):
    say = l['say']
    times = [None] * len(say)
    pos = 0
    W = l['words']
    for k, w in enumerate(W):
        at = say.find(w['w'], pos)
        if at < 0:
            continue
        nxt = W[k + 1]['t'] if k + 1 < len(W) else w['t'] + 0.25 * len(w['w'])
        for j in range(len(w['w'])):
            times[at + j] = w['t'] + (nxt - w['t']) * j / len(w['w'])
        pos = at + len(w['w'])
    last = l['t0']
    for j in range(len(times)):
        if times[j] is None:
            times[j] = last
        else:
            last = times[j]
    return times


for s in SCENES:
    for l in s['lines']:
        l['ct'] = char_times(l)


def line(sid, i):
    return BY[sid]['lines'][i]


def cue(sid, i, kw=None, off=0.0):
    l = line(sid, i)
    if not kw:
        return l['t0'] + off
    at = l['say'].find(kw)
    if at < 0:
        raise SystemExit(f'cue not found: {sid} {i} {kw}')
    return l['ct'][at] + off


# ---- helpers
def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR)).astype(np.float32)


def noise(n):
    return rng.standard_normal(n).astype(np.float32)


def filt(x, kind, f, order=2):
    sos = signal.butter(order, f, btype=kind, fs=SR, output='sos')
    return signal.sosfilt(sos, x).astype(np.float32)


def add(buf, t, x, gain=1.0, pan=0.0):
    i0 = int(t * SR)
    if i0 >= N:
        return
    if i0 < 0:
        x = x[-i0:]
        i0 = 0
    x = x[: N - i0]
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    buf[0, i0:i0 + len(x)] += x * gain * l * 1.414
    buf[1, i0:i0 + len(x)] += x * gain * r * 1.414


def sine_sweep(f0, f1, dur, tau):
    n = int(dur * SR)
    f = f1 + (f0 - f1) * np.exp(-np.arange(n) / (0.08 * SR))
    ph = np.cumsum(f) / SR * 2 * np.pi
    return (np.sin(ph) * env_exp(n, tau)).astype(np.float32)


# ---- sound effects
def thump(big=1.0):
    d = 1.6
    x = sine_sweep(140, 38, d, 0.35 * big) * 0.9
    n = int(d * SR)
    nb = filt(noise(n), 'lowpass', 900) * env_exp(n, 0.12 * big) * 0.6
    return x + nb


def crack(bright=1.0, dur=0.9):
    n = int(dur * SR)
    x = np.zeros(n, np.float32)
    # a burst of tiny fractures
    for k in range(int(26 * bright)):
        i = int(abs(rng.normal(0, 0.12)) * SR)
        if i >= n - 2000:
            continue
        m = int(rng.uniform(0.004, 0.02) * SR)
        x[i:i + m] += noise(m) * env_exp(m, 0.004) * rng.uniform(0.3, 1)
    x = filt(x, 'highpass', 700) + filt(x, 'bandpass', [180, 900]) * 0.6
    return x * env_exp(n, 0.25)


def impact(big=1.0):
    return thump(big) * 0.9 + np.pad(crack(big), (0, int(1.6 * SR) - int(0.9 * SR))) * 0.8


def whoosh(dur=1.2, lo=300, hi=2500, peak=0.6):
    n = int(dur * SR)
    t = np.linspace(0, 1, n, dtype=np.float32)
    a = filt(noise(n), 'bandpass', [lo, lo * 3])
    b = filt(noise(n), 'bandpass', [hi / 3, hi])
    mix = t / max(peak, 1e-3)
    mix = np.clip(mix, 0, 1)
    shape = np.where(t < peak, (t / peak) ** 2, ((1 - t) / (1 - peak)) ** 1.5).astype(np.float32)
    return (a * (1 - mix) + b * mix) * shape * 0.8


def boom(big=1.0):
    d = 4.0
    n = int(d * SR)
    rum = filt(noise(n), 'lowpass', 160, 4) * env_exp(n, 1.1 * big) * 2.2
    return rum + np.pad(impact(big), (0, n - int(1.6 * SR)))


def slash():
    d = 0.9
    n = int(d * SR)
    w = whoosh(0.35, 800, 6000, 0.85)
    t = np.arange(n) / SR
    ring = (np.sin(2 * np.pi * 2650 * t) * 0.5 + np.sin(2 * np.pi * 3990 * t) * 0.35 + np.sin(2 * np.pi * 5300 * t) * 0.2)
    ring = (ring * env_exp(n, 0.22)).astype(np.float32)
    out = np.zeros(n + len(w), np.float32)
    out[: len(w)] += w
    out[len(w) - int(0.02 * SR): len(w) - int(0.02 * SR) + n] += ring * 0.5 + filt(noise(n), 'highpass', 3000) * env_exp(n, 0.05) * 0.5
    return out


def tick(f=1400, amp=1.0):
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) * env_exp(n, 0.018) * amp).astype(np.float32)


def bell(f, dur=3.0, amp=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    parts = [(1, 1, 1.0), (2.76, 0.45, 0.6), (5.4, 0.25, 0.35), (8.93, 0.12, 0.2)]
    x = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / (dur * d)) for r, a, d in parts)
    att = np.clip(t / 0.004, 0, 1)
    return (x * att * amp).astype(np.float32)


def hiss(dur=2.5, f=3000):
    n = int(dur * SR)
    t = np.linspace(0, 1, n, dtype=np.float32)
    shape = np.clip(np.sin(np.pi * t), 0, None) ** 0.7
    return filt(noise(n), 'highpass', f) * shape * 0.5


def rumble(dur, rise=True):
    n = int(dur * SR)
    t = np.linspace(0, 1, n, dtype=np.float32)
    shape = (t ** 1.6 if rise else np.clip(np.sin(np.pi * t), 0, None)) * (1 - np.clip((t - 0.97) / 0.03, 0, 1))
    return filt(noise(n), 'lowpass', 220, 4) * shape * 2.0


def stamp():
    return thump(0.5) * 0.8 + np.pad(tick(420, 0.8), (0, int(1.6 * SR) - int(0.12 * SR)))


sfx = np.zeros((2, N), np.float32)
S = sfx

# transitions: a soft whoosh into every chapter
for s in SCENES[1:]:
    add(S, s['t0'] - 0.55, whoosh(1.1, 250, 2000, 0.55), 0.22)

# cold
add(S, cue('cold', 0, '打碎') - 0.03, impact(1.2), 0.42)
add(S, cue('cold', 0, '星球') - 0.4, whoosh(1.6, 120, 900, 0.6), 0.45)
add(S, line('cold', 2)['t0'] + 0.25, bell(146.8, 5, 0.5), 0.5)
add(S, line('cold', 2)['t0'] + 0.25, thump(0.7), 0.35)
# five ledgers
for k in range(1, 6):
    add(S, line('five', k)['t0'] - 0.3, tick(900 + k * 120), 0.28, -0.6 + k * 0.24)
b = line('five', 6)['t0']
for k in range(4):
    add(S, b + 0.4 + k * 0.18, crack(0.35, 0.5), 0.45, -0.5 + k * 0.33)
# axes
for k, w in enumerate(['碎', '爆', '粉碎', '湮灭']):
    add(S, cue('axes', 0, w) - 0.02, thump(0.45), 0.35, -0.45 + k * 0.3)
add(S, cue('axes', 2, '碎和裂'), crack(1.0), 0.6, -0.4)
add(S, cue('axes', 2, '爆和毁'), boom(0.8), 0.55, 0.4)
for k, w in enumerate(['大块', '粉末']):
    add(S, cue('axes', 4, w), crack(0.5 + 0.4 * k, 0.6), 0.4, -0.6 + 0.3 * k)
add(S, cue('axes', 4, '熔化'), hiss(2.2, 1800), 0.35, 0.1)
add(S, cue('axes', 4, '汽化'), hiss(3, 3500), 0.4, 0.5)
# fragmentation: five specimens break on their spoken values
for k, kw in enumerate(['四十焦', '六十焦', '一百焦', '三百焦', '一千二百焦']):
    add(S, cue('frag', 1, kw) - 0.02, impact(0.55 + k * 0.14), 0.45 + k * 0.06, -0.3 + k * 0.15)
add(S, cue('frag', 2, '它是参照'), stamp(), 0.55)
# strength
add(S, cue('strength', 0, '一百七十') - 0.3, rumble(2.4, True), 0.35, -0.4)
add(S, cue('strength', 0, '断了'), crack(1.1), 0.7, 0.4)
add(S, cue('strength', 0, '断了'), thump(0.5), 0.4, 0.4)
d0 = cue('strength', 2, '金刚石')
for k, f in enumerate([1760, 2349, 2637, 3520]):
    add(S, d0 + 0.1 + k * 0.09, bell(f, 1.6, 0.25), 0.3, -0.3 + k * 0.2)
add(S, cue('strength', 3, '多少倍'), tick(600, 0.9), 0.3)
# phase
add(S, cue('phase', 1, '烧干'), hiss(3.0, 2500), 0.4, -0.4)
add(S, line('phase', 2)['t0'], rumble(2.8, True), 0.3, -0.4)
add(S, line('phase', 2)['t0'] + 2.4, hiss(5, 1500), 0.45, -0.3)
# binding energy
add(S, cue('gbe', 1, '全部搬到') - 0.3, whoosh(4.0, 80, 700, 0.3), 0.5)
add(S, cue('gbe', 1, '全部搬到') - 0.3, crack(0.8, 1.0), 0.4)
add(S, line('gbe', 2)['t0'] - 0.4, whoosh(1.6, 150, 1500, 0.85), 0.35)
add(S, cue('gbe', 3, '真实的') - 0.3, crack(0.5, 0.7), 0.35, -0.4)
for sid, i, kw in [('gbe', 4, '火星'), ('gbe', 4, '木星'), ('gbe', 4, '太阳'), ('gbe', 5, '半个太阳'), ('gbe', 5, '标准中子星')]:
    add(S, cue(sid, i, kw), bell(440 * 2 ** ((len(kw) * 3) / 12), 2.0, 0.3), 0.25)
# bound
add(S, cue('bound', 1, '真正的爆炸') - 0.02, boom(1.3), 0.75, 0.35)
add(S, line('bound', 2)['t0'] + 0.2, bell(110, 6, 0.6), 0.35)
add(S, cue('bound', 4, '撕开'), rumble(1.8, False), 0.5, -0.4)
add(S, cue('bound', 4, '震动起来'), rumble(2.2, False), 0.3, 0.4)
# meteor
m0 = line('meteor', 0)['t0'] - 0.4
hit = cue('meteor', 1, '往下砸') + 0.15
add(S, m0, rumble(hit - m0, True), 0.55, 0.3)
add(S, cue('meteor', 1, '切开') - 0.3, slash(), 0.7, 0.2)
add(S, hit, boom(1.2), 0.8, -0.25)
add(S, hit + 0.07, impact(1.0), 0.6, 0.25)
add(S, cue('meteor', 3, '拦停'), thump(0.8), 0.55, -0.5)
add(S, cue('meteor', 3, '拦停'), tick(260, 1.0), 0.3, -0.5)
# GBU-57
add(S, cue('gbu', 1, '实际查下来') + 0.6, whoosh(0.5, 900, 5000, 0.8), 0.35)
for kw in ['土层', '十八米', '两米多']:
    t = cue('gbu', 1, kw) - 0.2
    add(S, t, whoosh(0.7, 200, 2000, 0.9), 0.3)
    add(S, t + 0.6, thump(0.55), 0.4)
add(S, line('gbu', 2)['t0'] + 2.6, tick(700, 1.0), 0.3)
# tools
add(S, cue('tools', 1, '只要'), tick(1200, 0.8), 0.25)
add(S, cue('tools', 1, '物理上成立'), bell(587, 2.5, 0.35), 0.3)
add(S, cue('tools', 2, '对面的山'), whoosh(1.2, 150, 1200, 0.7), 0.25)
# flux
add(S, cue('flux', 2, '两百八十二') - 0.5, rumble(6.0, True), 0.35)
add(S, cue('flux', 2, '水汽'), hiss(5, 1200), 0.35)
add(S, cue('flux', 3, '烤了多久'), tick(1500, 0.6), 0.25)
# end
for k, w in enumerate(['打碎', '蒸发', '毁灭']):
    add(S, cue('end', 1, w), thump(0.4), 0.3, -0.4 + 0.4 * k)
card = line('end', 1)['t1'] + 0.6
for k, f in enumerate([293.7, 440, 587.3, 740]):
    add(S, card + k * 0.12, bell(f, 6, 0.4), 0.14, -0.4 + k * 0.25)

# ---- score
TAB = 4096
ph = np.arange(TAB) / TAB
SAW = sum(np.sin(2 * np.pi * k * ph) / k for k in range(1, 25)).astype(np.float32)
SAW /= np.abs(SAW).max()

CHORDS = {
    'cold': [38, 45, 52, 53], 'five': [38, 45, 50, 53, 60], 'axes': [34, 41, 50, 57], 'frag': [31, 38, 46, 53],
    'strength': [33, 40, 55, 60], 'phase': [29, 36, 45, 52], 'gbe': [26, 33, 40, 45, 53], 'bound': [34, 41, 48, 50],
    'meteor': [36, 43, 50, 51], 'gbu': [31, 38, 45, 46], 'tools': [41, 48, 55, 57], 'flux': [38, 45, 53, 55],
    'end': [38, 45, 50, 54, 57],
}
CUT = {'gbe': 500, 'meteor': 650, 'bound': 600, 'flux': 700, 'end': 900}
mf = lambda m: 440 * 2 ** ((m - 69) / 12)
music = np.zeros((2, N), np.float32)
XF = 3.0
for si, s in enumerate(SCENES):
    t0 = max(0.0, s['t0'] - XF / 2)
    t1 = min(TOTAL + 1, s['t1'] + XF / 2)
    n = int((t1 - t0) * SR)
    tt = np.arange(n, dtype=np.float32) / SR
    for ch in range(2):
        acc = np.zeros(n, np.float32)
        for vi, m in enumerate(CHORDS[s['id']]):
            for d in (-1, 1):
                det = (1 + d * (0.0023 + 0.0011 * vi)) * (1 + (0.0007 if ch else -0.0007))
                f = mf(m) * det
                p = (f * tt + rng.random()) % 1.0
                lfo = 0.75 + 0.25 * np.sin(2 * np.pi * (0.05 + 0.013 * vi) * tt + vi + ch)
                acc += SAW[(p * TAB).astype(np.int32)] * lfo * (0.9 if m < 40 else 0.55)
        acc = filt(acc, 'lowpass', CUT.get(s['id'], 800))
        fade = np.minimum(np.clip(tt / XF, 0, 1), np.clip((t1 - t0 - tt) / XF, 0, 1))
        if si == 0:
            fade = np.clip(tt / 4.0, 0, 1) * np.clip((t1 - t0 - tt) / XF, 0, 1)
        i0 = int(t0 * SR)
        music[ch, i0:i0 + n] += acc * fade * 0.05
# meteor/flux tension: slow swell
for sid in ['meteor', 'flux']:
    s = BY[sid]
    n = int((s['t1'] - s['t0']) * SR)
    sw = filt(noise(n), 'bandpass', [80, 400]) * np.linspace(0, 1, n, dtype=np.float32) ** 2 * 0.25
    add(music, s['t0'], sw, 0.2)
# air bed
air = filt(filt(noise(N), 'lowpass', 1400), 'highpass', 180) * 0.012
music[0] += air
music[1] += np.roll(air, 977)
# bell plucks on line starts (from the chapter chord, two octaves up)
for s in SCENES:
    ch = CHORDS[s['id']]
    for i, l in enumerate(s['lines']):
        m = ch[(i * 2 + 1) % len(ch)] + 24
        add(music, l['t0'] - 0.05, bell(mf(m), 3.5, 0.18), 0.5, -0.5 + (i % 3) * 0.5)

# ---- reverb (shared send for score + effects)
def reverb(x, dur=2.6):
    n = int(dur * SR)
    ir = noise(n) * env_exp(n, dur / 6.5)
    ir = filt(ir, 'lowpass', 5000)
    ir /= np.sqrt((ir ** 2).sum())
    return signal.oaconvolve(x, ir)[: len(x)].astype(np.float32)


wet = np.stack([reverb(music[0] * 0.6 + sfx[0] * 0.35), reverb(music[1] * 0.6 + sfx[1] * 0.35, 2.75)])

# ---- narration + ducking
nar, sr = sf.read(os.path.join(work, 'narration.wav'), dtype='float32')
assert sr == SR
if nar.ndim > 1:
    nar = nar.mean(1)
nar = np.pad(nar, (0, max(0, N - len(nar))))[:N]
nar *= 0.7 / (np.abs(nar).max() + 1e-9)
envn = np.abs(nar)
envn = signal.sosfilt(signal.butter(1, 6, fs=SR, output='sos'), envn)
envn = np.clip(envn / (np.percentile(envn[envn > 1e-4], 90) + 1e-9), 0, 1)
# slow release: hold the duck for a moment after words
rel = np.exp(-1 / (0.45 * SR))
d = np.empty_like(envn)
acc = 0.0
step = 64
for i in range(0, N, step):
    v = envn[i:i + step].max()
    acc = v if v > acc else acc * rel ** step
    d[i:i + step] = acc
duck_m = 1 - 0.55 * d
duck_s = 1 - 0.25 * d
mixL = nar + (music[0] + wet[0] * 0.8) * duck_m + sfx[0] * duck_s * 0.75
mixR = nar + (music[1] + wet[1] * 0.8) * duck_m + sfx[1] * duck_s * 0.75
mix = np.stack([mixL, mixR])
# fade out the very end and limit
fo = int(1.5 * SR)
mix[:, -fo:] *= np.linspace(1, 0, fo)
peak = np.abs(mix).max()
# narration sits near 0.6 peak; bursts above that are soft-limited rather than lowering everything
mix = np.tanh(mix * 1.5) * 0.8
out_wav = os.path.join(work, 'mix.wav')
sf.write(out_wav, mix.T, SR, subtype='PCM_16')
dst = os.path.join(root, 'assets', 'explainer.mp3')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', out_wav, '-t', f'{TOTAL:.3f}', '-c:a', 'libmp3lame', '-b:a', '160k', '-ar', '48000', dst], check=True)
print('wrote', dst, os.path.getsize(dst) // 1024, 'KB', 'peak', round(float(peak), 3))
