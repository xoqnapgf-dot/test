# 邦多利角色个人向点评 · 下

[`bandori-review-vol1/`](../bandori-review-vol1/) 的第二期，竖屏 9:16，全长 5′24″，曼波音色配音，点评五组角色：
奥泽美咲、蝶团与 RAS、千早爱音、MyGO 的 Soyo 和 Taki、三角初华。
它是一个实时渲染的网页，不是视频文件。

**打开 `index.html`，点「播放」就能看。** 直接用 `file://` 打开或放到任何静态服务器上都可以，播放时不需要联网。
点击画面暂停，空格键播放/暂停，←/→ 快退/快进 5 秒。

## 和上期的区别

上期的画面大多是代码画出来的图形（爱心、齿轮、仪表、标签），看起来「AI 味」很重。
这期先下载了 B 站 4 个高播放的同类点评视频，每 2.5 秒抽一帧逐张看过，然后照着真人 up 主的做法重做了画面：

- **画面主体是真实素材**：官方动画剧照、游戏卡面、梗图。版式是竖屏常见的做法，16:9 的图放在中间，
  背后铺一层同一张图的模糊放大版。
- **字幕**：干净的白字加细黑描边，不给名字上色，也不把旁白再写一遍做成标签。
- **只用 up 主常用的少量手法**：镜头慢推、关键字上快速推近一下、手绘红圈、梗图带白边弹出、
  对比用左右分屏、跳过用快进。初华段加了暗场、遮幅和光晕，配合「黑暗中的一缕光」。
- **配乐**：美咲段和爱音段用官方 Lo-Fi，Soyo 段和 Taki 段放《春日影》钢琴版（圈内梗），
  初华段放《Imprisoned XII》钢琴版（Ave Mujica 第十集插曲）。

## 配音

- **模型**：VoxCPM2 加曼波 LoRA，在 CPU 上逐句合成。
- **固定参考音**：每句都带上同一句参考音。最初用的是上期里音高和音色最接近平均值的一句；
  改版重录时工作目录已经不在了，改用本期成品开头「上期聊了老邦的一部分」那一句（那里背景音乐压到了约 -50 dB）。
- **逐句自动质检**（`tools/make_voice_qc.py`）：
  - 用 Whisper 回读，按无声调拼音与原文比对，同音字算对，因为字幕直接来自文案；
  - 再检查音高、音色（MFCC 统计与基准的距离）、语速、有没有多读或重复；
    音色基准可以是上期的配音目录，也可以传 `-`，先给每句合成一版，再用这一期自己的全部句子做基准；
  - 不合格的自动重新合成，每句最多 5 次，保留得分最好的一版；结果写在工作目录的 `qc.json`。
- **逐句加严复查**（`tools/regen_lines.py`）：拼音比对管不到英文词，所以带 MyGO、LOCK、Taki 的句子
  另加了要求，回读里必须听得出「my go / 麦够」「Lock」「Taki」，不满足就重录。
  同样的办法也用来卡住拼音比对放过的个别字：「爱音」读成「艾依」、「蝶团」读成「别团」、「缕」读成「李」，都要求重录到读对为止。
  比如「然后是 MyGO」常被读成「Michael」，最后换成了能清楚听出「麦够」的一版。
- **结果**：93 句全部通过。只有一句是人工判定的，理由写在 `qc.json` 里：
  「不过，我可没有美咲那么主动」每一版都一字不差，但 21 版的音色得分都偏高（2.4–5.8），说明是这句本身的特点，不是哪一版有问题。
- **读音修正**：「咲」会被读成接近「赛」的音，所以美咲、有咲的配音按「美笑」「有笑」读，字幕仍显示原字。
  RAS、LOCK、MyGO 按字母或英文读。Soyo、Taki 按日语罗马音读：「Soyo」直接读会变成「所有」，
  所以配音文本写成「So yo」，回读是「Soyou」，也就是 so-yo；「Taki」直接读就对。

## 名字的写法

第一版用的是「素世」「立希」，素世段和立希段放在同一节，标题是「长崎爽世 · 椎名立希」。
现在这版两人都按日语罗马音写成 Soyo 和 Taki，标题、字幕和配音都不再出现中文名，
原来的一节也拆成了 Soyo、Taki 两节。开场和结尾那张 MyGO 咖啡馆合照也换掉了，
开场改用市谷有咲的卡面，结尾改用 MyGO 四人的剧照。第一版在 git 历史里。

## 字幕

超过 15 个字的字幕分两行，优先在离中间最近的标点处断开。
没有合适标点时，用 jieba 分词，只在词与词之间断开（例如不会把「独白」拆到两行），
而且不会让一行以「的、了」开头，也不会以「和、把、对」之类的介词结尾。断点由 `build_timeline.py` 算好，写进时间轴。

## 素材来源

- **动画剧照**：《BanG Dream! It's MyGO!!!!!》《BanG Dream! Ave Mujica》官网的每集剧照，以及萌娘百科角色页里的动画截图。
- **游戏卡面**：Bestdori。
- **官方角色立绘**：两部动画官网。

每张图在用之前，我都对照官网带名字的立绘确认过是谁。
比如 Ave Mujica 第十三集那张红光里弹吉他的剧照，戴红色贝雷帽，其实是睦（Mortis），不是初华，所以没有用。
版权说明见 [`assets/LICENSES.md`](assets/LICENSES.md)。

## 重新生成

流程和上期一样，脚本也是同一套，复制了一份以便两期互不影响。
不同的是配音这一步换成 `make_voice_qc.py`，需要一个参考音，以及上期的配音目录或 `-`（音色基准，见上文）：

```sh
python tools/make_voice_qc.py tools/script.txt <work> <VoxCPM2 dir> <LoRA step dir> <ref.wav> <vol1 voice dir | ->
python tools/regen_lines.py   tools/script.txt <work> <VoxCPM2 dir> <LoRA step dir> <ref.wav> <vol1 voice dir | -> <rules.json>   # 可选
python tools/align.py <work>
python tools/build_timeline.py <work> <work>/align.json
python tools/build_fonts.py <ttf dir>
python tools/bundle.py
python tools/build_audio.py <work> <music>                    # <music>: lofi_p7, lofi_p9, haruhikage, imprisoned (48 kHz wav)
node tools/render.mjs cues <work>/sfx.json
python tools/build_audio.py <work> <music> <work>/sfx.json    # → assets/audio.mp3
bash tools/render_video.sh <outdir> 720 25                     # 可选：渲染 720×1280 的 MP4（默认 1080×1920）
```
