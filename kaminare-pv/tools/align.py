import json, difflib, numpy as np
a=json.load(open('asr_clips.json')); b=json.load(open('asr_medium.json'))
words=[]
for s in a:
    if s['start']<30 or s['start']>=137: words+=s['words']
for s in b:
    if 30<=s['start']<137 or s['start']>=150.5: words+=s['words']
# char stream with times
chars=[]
words=sorted(words,key=lambda w:w['s'])
for i,w in enumerate(words):
    txt=w['w'].strip().replace('、','').replace(' ','')
    if not txt: continue
    e=w['e']
    n=len(txt)
    for j,c in enumerate(txt):
        chars.append((c, w['s']+(e-w['s'])*j/n))
# lyrics with windows [start,end] and section
L=[
("v1","ロザリオ 巻きつけたネック",11.1,13.45),
("v1","聖歌がゆがんで始まる",13.45,16.6),
("v1","ひょうたんに月をひとつ",16.6,19.4),
("v1","彼女は笑って歌い出す",19.45,22.25),
("pre1","ベースが下を這うように",22.25,25.2),
("pre1","祈りの言葉のように",25.3,27.55),
("pre1","揺れる玉響 高鳴る鼓動",27.55,30.05),
("pre1","五つの名前が ひとつの音になる",30.05,33.5),
("ch1","さあ カミナレ",33.6,35.95),
("ch1","空までゆがませて",35.95,38.35),
("ch1","誰の神だって構わない",38.35,40.85),
("ch1","サビでは宗派も要らない",40.85,44.0),
("ch1","さあ カミナレ",44.1,46.42),
("ch1","少女の声がヤイバになって",46.42,49.0),
("ch1","沈黙を切り裂いて",49.0,52.6),
("ch1","私たちが私たちの神",52.6,56.5),
("post","さあ さあ",57.5,59.9),
("post","四拍子の中 誰もが平等",60.1,65.2),
("v2","スティックは八芒星",65.8,68.95),
("v2","ツーバスで夜を砕いて",68.95,72.5),
("v2","リードは白い鳩になって",72.6,75.5),
("v2","祭壇から音の壁へ",75.5,78.05),
("v2","お経と弦を鳴らして",78.05,80.8),
("v2","同じ振動を信じてる",80.8,83.4),
("pre2","違う名前 違う祈り",83.4,86.4),
("pre2","同じサビで出会う",86.4,88.45),
("pre2","誰も頭を下げなくていい",88.45,91.4),
("pre2","弦はすべての信心を知ってる",91.4,94.65),
("ch2","さあ カミナレ",94.65,97.45),
("ch2","空までゆがませて",97.45,99.7),
("ch2","誰の神だって構わない",99.7,102.2),
("ch2","サビでは宗派も要らない",102.2,105.45),
("ch2","さあ カミナレ",105.45,107.75),
("ch2","少女の声がヤイバになって",107.75,110.4),
("ch2","沈黙を切り裂いて",110.4,114.1),
("ch2","私たちが私たちの神",114.1,117.6),
("br","もし明日 声を殺せと言われても",137.6,141.45),
("br","笑い声も 音量も",141.45,143.75),
("br","教会ごと 神殿ごと",143.75,146.85),
("br","丸ごとステージに乗せてやる",146.85,150.4),
("fc","さあ カミナレ",150.5,153.3),
("fc","空までゆがませて",153.3,155.5),
("fc","誰の神だって構わない",155.5,158.1),
("fc","この拍の上 誰もが平等",158.1,161.65),
("fc","さあ カミナレ",161.65,163.75),
("fc","少女の声がヤイバになって",163.75,166.25),
("fc","沈黙を切り裂いて",166.25,169.9),
("fc","私たちが私たちの神",169.9,173.3),
("out","最後の音符が落ちて",173.3,175.55),
("out","鐘の余韻だけが残る",175.55,178.6),
]
out=[]
for sec,txt,t0,t1 in L:
    cs=[c for c in chars if t0-0.05<=c[1]<t1]
    hyp=''.join(c[0] for c in cs)
    ref=txt
    times=[None]*len(ref)
    sm=difflib.SequenceMatcher(None,ref,hyp,autojunk=False)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size): times[blk.a+k]=cs[blk.b+k][1]
    # anchors: first char = first vocal char time
    if times[0] is None and cs: times[0]=cs[0][1]
    # end anchor
    last=cs[-1][1]+0.25 if cs else t1
    # interpolate None (skip spaces later)
    idx=[i for i,v in enumerate(times) if v is not None]
    for i in range(len(ref)):
        if times[i] is None:
            prev=max([j for j in idx if j<i],default=None); nxt=min([j for j in idx if j>i],default=None)
            if prev is None: times[i]=t0
            elif nxt is None: times[i]=times[prev]+(last-times[prev])*(i-prev)/(len(ref)-prev)
            else: times[i]=times[prev]+(times[nxt]-times[prev])*(i-prev)/(nxt-prev)
    # monotonic fix
    for i in range(1,len(times)): times[i]=max(times[i],times[i-1]+0.02)
    out.append({"sec":sec,"text":txt,"t0":round(t0,2),"t1":round(t1,2),"c":[round(x,2) for x in times]})
    print(f"{sec:5} {t0:6.2f} {txt:<20} | {hyp}\n      "+' '.join(f"{c}{x:.2f}" for c,x in zip(ref,times)))
json.dump(out,open('lyrics_aligned.json','w'),ensure_ascii=False)
