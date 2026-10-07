import sys, json, soundfile as sf
from faster_whisper import WhisperModel
model = WhisperModel(sys.argv[2], device="cpu", compute_type="int8", cpu_threads=4)
aud,sr=sf.read(sys.argv[1],dtype='float32')
res=[]
for a,b in [(float(x.split(':')[0]),float(x.split(':')[1])) for x in sys.argv[4:]]:
    seg=aud[int(a*sr):int(b*sr)]
    segs,_=model.transcribe(seg, language="ja", word_timestamps=True, beam_size=5, condition_on_previous_text=False)
    for s in segs:
        print(f"[{s.start+a:7.2f}-{s.end+a:7.2f}] {s.text}", flush=True)
        res.append({"start":s.start+a,"end":s.end+a,"text":s.text,"words":[{"s":w.start+a,"e":w.end+a,"w":w.word} for w in s.words]})
json.dump(res, open(sys.argv[3],"w"), ensure_ascii=False, indent=1)
