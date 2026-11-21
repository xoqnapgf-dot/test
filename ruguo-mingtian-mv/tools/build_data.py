"""Build src/data.js: lyric lines with per-character times, beats and a pre-computed spectrum.

    python3 tools/build_data.py

Inputs (all inside this folder):
  tools/align_large-v3.json  per-character forced alignment (tools/align.py)
  tools/clip.wav             the faded clip (tools/cut_audio.sh)

Every time in data.js is SONG time (seconds from the start of the full song). The page
converts clip time -> song time with CLIP["start"].

The spectrum is computed offline because a Web Audio analyser returns silence for media
loaded from file:// in Chrome, and a pre-computed table keeps every frame deterministic
(the same t always draws the same picture, which the video export relies on).
"""
import base64
import json
import os

import librosa
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

CLIP = {"start": 46.49, "end": 93.10, "fadeIn": 2.61, "fadeOut": 3.40}
SONG = {
    "title": "如果明天我会离开",
    "artist": "AI 演唱 · Suno v6",
    "total": 242.79,          # full song length; the player shows real song time
    "bpm": 92.0,
}

# Display text. Chorus lines are exactly as the user wrote them.
# "br" = preferred wrap position (character index) if a line is too wide for the column.
VERSE1_TAIL = [  # context above the clip (already sung) + the lead-in bar
    ("让梦醒后的风 带走脸上每滴思念", None),
    ("和很多陌生的面孔 互相分享彼此的秘密", None),
    ("珍惜陌生的友谊 陌生的没有顾忌", None),
    ("奋力拥抱在一起 没人会担心分离", None),
    ("天亮后不辞而别 把对方留在梦里", None),
]
CHORUS = [
    ("如果明天我会离开没有任何原因", 8),
    ("你能看到我的眼睛看不见我的心", 8),
    ("别问我要去何处为了寻找何物", 7),
    ("当我放下所有包袱也就不会再哭", 8),
    ("我不知道下一站的旅程会在哪里出现", 10),
    ("如果你有思念就把它送给大雁", 6),
    ("别问我是否疲惫就这样喝醉", 7),
    ("留下我最后的爱 是你看不到的泪", None),
]
VERSE2_HEAD = [  # shown dimmed below the interlude, as a player would
    ("只带着一场梦 走遍白天和黑夜", None),
    ("只带着一支笔 描绘花开和花谢", None),
]
# Approximate starts for the context lines that end before the clip begins (from the
# Whisper-small transcript); they are never highlighted inside the clip.
CONTEXT_STARTS = [36.14, 41.24]


def load_alignment():
    al = json.load(open(os.path.join(HERE, "align_large-v3.json")))
    # group 0 covers 44-67 s, group 1 covers 60.5-84.5 s, group 3 covers 92-99 s.
    # Characters at the left edge of a window absorb the silence before them, so each
    # group is used only away from its left edge.
    g0 = [c for c in al[0]["chars"] if c[1] < 66.9]
    g1 = [c for c in al[1]["chars"] if c[1] >= 66.9]
    g3 = al[3]["chars"]
    return g0 + g1, g3


def explode(tokens):
    """Whisper tokens can hold several characters ("如果", "我不知道"); split evenly."""
    out = []
    for w, s, e, _p in tokens:
        w = w.strip()
        n = len(w)
        for i, ch in enumerate(w):
            out.append((ch, s + (e - s) * i / n, s + (e - s) * (i + 1) / n))
    return out


def attach(lines, chars, first_start_fix=None):
    """Walk the display lines and consume aligned characters in order."""
    res = []
    k = 0
    for text, br in lines:
        times = []
        for ch in text:
            if ch == " ":
                times.append(None)
                continue
            got, s, e = chars[k]
            assert got == ch, f"alignment mismatch: expected {ch!r} got {got!r} in {text}"
            times.append([round(s, 3), round(e, 3)])
            k += 1
        res.append({"text": text, "br": br, "t": times})
    return res, k


def fill_spaces(line):
    """A space takes the time between its neighbours, so the sweep pauses there."""
    t = line["t"]
    for i, v in enumerate(t):
        if v is None:
            a = t[i - 1][1]
            b = t[i + 1][0]
            t[i] = [a, b]
    line["start"] = t[0][0]
    line["end"] = t[-1][1]


def main():
    main_chars, v2_tokens = load_alignment()
    chars = explode(main_chars)
    # the first two context lines are before this alignment window
    lines_aligned, used = attach(VERSE1_TAIL[2:] + CHORUS, chars)
    assert used == len(chars), (used, len(chars))
    v2_chars = explode(v2_tokens)
    v2_lines, _ = attach(VERSE2_HEAD, v2_chars)

    # context lines: even spread, they are only ever shown as "already sung"
    ctx = []
    for (text, br), s0 in zip(VERSE1_TAIL[:2], CONTEXT_STARTS):
        n = len(text)
        times = [[round(s0 + i * 0.15, 3), round(s0 + (i + 1) * 0.15, 3)] for i in range(n)]
        ctx.append({"text": text, "br": br, "t": times})

    lines = []
    for ln in ctx:
        ln["kind"] = "lyric"
        fill_spaces(ln)
        lines.append(ln)
    for ln in lines_aligned:
        ln["kind"] = "lyric"
        fill_spaces(ln)
        lines.append(ln)
    # the 只 of verse 2 sits on its window's left edge and absorbed 1.5 s of harmonica;
    # the spectrogram shows the new vocal entering at ~93.25 s.
    v2_lines[0]["t"][0][0] = 93.25
    for ln in v2_lines:
        ln["kind"] = "lyric"
        fill_spaces(ln)
    last = lines[-1]
    interlude = {
        "kind": "interlude",
        "text": "",
        "start": round(last["end"] + 0.12, 3),
        "end": v2_lines[0]["start"],
        "label": "口琴间奏",
    }
    lines.append(interlude)
    lines.extend(v2_lines)

    # ---- audio features from the faded clip -------------------------------------------
    y, sr = librosa.load(os.path.join(HERE, "clip.wav"), sr=44100, mono=True)
    fps = 60
    hop = sr // fps  # 735
    S = np.abs(librosa.stft(y, n_fft=4096, hop_length=hop, center=True)) ** 2
    freqs = librosa.fft_frequencies(sr=sr, n_fft=4096)
    nb = 24
    edges = np.geomspace(45, 14000, nb + 1)
    bands = np.stack([S[(freqs >= a) & (freqs < b)].mean(0) for a, b in zip(edges[:-1], edges[1:])])
    db = 10 * np.log10(bands + 1e-12)
    # normalise per band against the loud part of the clip, map -50..0 dB -> 0..1
    ref = np.percentile(db[:, int(6 * fps):int(40 * fps)], 98, axis=1, keepdims=True)
    spec = np.clip((db - ref + 50) / 50, 0, 1)
    # low end (kick / bass) envelope with fast attack, slower release
    low = spec[:4].mean(0)
    env = np.zeros_like(low)
    a = 0.0
    for i, v in enumerate(low):
        a = v if v > a else a * 0.86 + v * 0.14
        env[i] = a
    rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=hop, center=True)[0]
    rms_db = 20 * np.log10(rms + 1e-9)
    loud = np.clip((rms_db + 40) / 32, 0, 1)
    n = min(spec.shape[1], len(env), len(loud))

    def b64(arr):
        return base64.b64encode((np.clip(arr, 0, 1) * 255).round().astype(np.uint8).tobytes()).decode()

    # beats (song time) from the full song analysis: 46.49 + k * 60/92.0 lines up with
    # librosa's tracked beats to within 20 ms across the clip.
    beat = 60.0 / SONG["bpm"]
    beats = [round(CLIP["start"] + k * beat, 3) for k in range(int((CLIP["end"] - CLIP["start"]) / beat) + 1)]

    data = {
        "song": SONG,
        "clip": CLIP,
        "lines": lines,
        "beats": beats,
        "geese": {"start": 74.6, "end": 82.6},  # 「就把它送给大雁」 at 76.5-77.7
        "audio": {
            "fps": fps,
            "frames": int(n),
            "bands": nb,
            "spec": b64(spec[:, :n].T.reshape(-1)),  # frame-major
            "low": b64(env[:n]),
            "loud": b64(loud[:n]),
        },
    }
    out = os.path.join(ROOT, "src", "data.js")
    with open(out, "w", encoding="utf-8") as f:
        f.write("// Generated by tools/build_data.py. Do not edit by hand.\n")
        f.write("window.MV_DATA = ")
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")
    print("wrote", out, os.path.getsize(out), "bytes")
    for ln in lines:
        print(f'{ln.get("start", 0):7.2f} {ln.get("end", 0):7.2f}  {ln["kind"]:9s} {ln["text"]}')


if __name__ == "__main__":
    main()
