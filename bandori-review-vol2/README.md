# 邦多利角色个人向点评 · 下

[`bandori-review-vol1/`](../bandori-review-vol1/) 的第二期，竖屏 9:16，全长 5′25″，曼波音色配音，点评五组角色：
奥泽美咲、蝶团与 RAS、千早爱音、长崎爽世与椎名立希、三角初华。
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
- **配乐**：美咲段和爱音段用官方 Lo-Fi，素世段放《春日影》钢琴版（圈内梗），
  初华段放《Imprisoned XII》钢琴版（Ave Mujica 第十集插曲）。

## 配音

- **模型**：VoxCPM2 加曼波 LoRA，在 CPU 上逐句合成。
- **固定参考音**：每句都带上上期一句音色标准的配音作为参考，这句是从上期 81 句里挑出音高和音色最接近平均值的一句。
- **逐句自动质检**（`tools/make_voice_qc.py`）：
  - 用 Whisper 回读，按无声调拼音与原文比对，同音字算对，因为字幕直接来自文案；
  - 再检查音高、音色（与上期 MFCC 统计的距离）、语速、有没有多读或重复；
  - 不合格的自动重新合成，每句最多 5 次，保留得分最好的一版；结果写在工作目录的 `qc.json`。
- **逐句加严复查**（`tools/regen_lines.py`）：拼音比对管不到英文词，所以带 MyGO、LOCK 的句子
  另加了要求，回读里必须听得出「my go / 麦够」「Lock」，不满足就重录；
  一句「立希」被回读成「立即」，也按同样的办法要求必须读出 li xi。
  比如「然后是 MyGO」有两版被听成了「Michael」，最后换成了能清楚听出「麦够」的一版。
- **结果**：93 句全部通过。其中两句是人工判定的，理由写在 `qc.json` 里：
  - 「素世」：Whisper 对任何 sù shì 都会写成「宿舍」，故意改读「素式」也一样；提示词里给出「长崎素世」后，回读一字不差。
  - 「然后是 MyGO」：多出来的两个字就是「麦够」本身，读音没有问题。
- **读音修正**：「咲」会被读成接近「赛」的音，所以美咲、有咲的配音按「美笑」「有笑」读，字幕仍显示原字。
  RAS、LOCK、MyGO 按字母或英文读。

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
不同的是配音这一步换成 `make_voice_qc.py`，需要一个参考音和上期的配音目录（用来做音色基准）：

```sh
python tools/make_voice_qc.py tools/script.txt <work> <VoxCPM2 dir> <LoRA step dir> <ref.wav> <vol1 voice dir>
python tools/regen_lines.py   tools/script.txt <work> <VoxCPM2 dir> <LoRA step dir> <ref.wav> <vol1 voice dir> <rules.json>   # 可选
python tools/align.py <work>
python tools/build_timeline.py <work> <work>/align.json
python tools/build_fonts.py <ttf dir>
python tools/bundle.py
python tools/build_audio.py <work> <music>                    # <music>: lofi_p7, lofi_p9, haruhikage, imprisoned (48 kHz wav)
node tools/render.mjs cues <work>/sfx.json
python tools/build_audio.py <work> <music> <work>/sfx.json    # → assets/audio.mp3
```
