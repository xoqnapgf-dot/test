import librosa, numpy as np, json, sys
y, sr = librosa.load(sys.argv[1], sr=22050, mono=True)
dur = len(y)/sr
tempo, beats = librosa.beat.beat_track(y=y, sr=sr, units='time')
print('dur', dur, 'tempo', tempo, 'nbeats', len(beats))
print('first beats', np.round(beats[:12],3))
# RMS per 0.5s
hop=512
rms = librosa.feature.rms(y=y, hop_length=hop)[0]
t = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=hop)
for s in np.arange(0, dur, 2.0):
    m = (t>=s)&(t<s+2)
    print(f"{s:6.1f} {'#'*int(rms[m].mean()*150)}")
