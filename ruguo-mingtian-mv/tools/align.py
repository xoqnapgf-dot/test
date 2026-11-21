"""Forced alignment of the known lyrics with Whisper (faster-whisper), per character.

    python3 tools/align.py /path/to/full-song.mov [large-v3|small]

Whisper is not asked to recognise anything: the known text is tokenised and handed to the
model's alignment heads (cross-attention + DTW) together with the audio window, which only
yields *when* each token is sung. Plain transcription was not usable here: with the lyrics
as a prompt, large-v3 repeated chorus lines that are not in the audio.

Each window starts a little before its first line; the first character of a window absorbs
the silence before it, so build_data.py only uses each window away from its left edge.
Output: tools/align_<model>.json (times are song seconds).
"""
import json
import os
import subprocess
import sys
import tempfile

import librosa
import numpy as np
from faster_whisper import WhisperModel
from faster_whisper.tokenizer import Tokenizer

HERE = os.path.dirname(os.path.abspath(__file__))

# (window start s, lines, window length s) - windows must stay under Whisper's 30 s
GROUPS = [
    (44.0, ["珍惜陌生的友谊 陌生的没有顾忌", "奋力拥抱在一起 没人会担心分离", "天亮后不辞而别 把对方留在梦里",
            "如果明天我会离开 没有任何原因", "你能看到我的眼睛 看不见我的心", "别问我要去何处 为了寻找何物"], 23.0),
    (60.5, ["别问我要去何处 为了寻找何物", "当我放下所有包袱 也就不会再哭", "我不知道下一站的旅程会在哪里出现",
            "如果你有思念 就把它送给大雁", "别问我是否疲惫 就这样喝醉", "留下我最后的爱 是你看不到的泪"], 24.0),
    (78.0, ["别问我是否疲惫 就这样喝醉", "留下我最后的爱 是你看不到的泪"], 6.2),
    (92.0, ["只带着一场梦 走遍白天和黑夜", "只带着一支笔 描绘花开和花谢"], 7.0),
]


def main():
    src = sys.argv[1]
    name = sys.argv[2] if len(sys.argv) > 2 else "large-v3"
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "song.wav")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vn", "-ac", "1", "-ar", "16000", wav], check=True)
        y, sr = librosa.load(wav, sr=16000, mono=True)
    m = WhisperModel(name, device="cpu", compute_type="int8")
    tok = Tokenizer(m.hf_tokenizer, m.model.is_multilingual, task="transcribe", language="zh")
    res = []
    for t0, lines, dur in GROUPS:
        a = y[int(t0 * sr):int((t0 + dur) * sr)]
        feats = m.feature_extractor(a)
        nf = feats.shape[-1]
        feats = np.pad(feats, ((0, 0), (0, max(0, 3000 - nf))))[:, :3000]
        enc = m.encode(feats)
        text = "，".join(l.replace(" ", "，") for l in lines)
        out = m.find_alignment(tok, [tok.encode(text)], enc, nf)[0]
        chars = [(w["word"], t0 + w["start"], t0 + w["end"], float(w["probability"])) for w in out if w["word"] not in "，"]
        res.append({"t0": t0, "lines": lines, "chars": chars})
        print("window %.1f s: %d tokens" % (t0, len(chars)))
    path = os.path.join(HERE, "align_%s.json" % name)
    json.dump(res, open(path, "w"), ensure_ascii=False, indent=0)
    print("wrote", path)


if __name__ == "__main__":
    main()
