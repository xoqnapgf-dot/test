import sys, json
from faster_whisper import WhisperModel
model = WhisperModel(sys.argv[2], device="cpu", compute_type="int8", cpu_threads=4)
import soundfile as sf, numpy as np
aud,_=sf.read(sys.argv[1],dtype='float32')
segs, info = model.transcribe(aud, language="ja", word_timestamps=True, vad_filter=False, beam_size=5, condition_on_previous_text=False,
    initial_prompt=None)
out=[]
for s in segs:
    print(f"[{s.start:7.2f}-{s.end:7.2f}] {s.text}", flush=True)
    out.append({"start":s.start,"end":s.end,"text":s.text,"words":[{"s":w.start,"e":w.end,"w":w.word,"p":w.probability} for w in (s.words or [])]})
json.dump(out, open(sys.argv[3],"w"), ensure_ascii=False, indent=1)
