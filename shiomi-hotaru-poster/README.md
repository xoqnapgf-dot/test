# 汐見 蛍 角色排版图（shiomi-hotaru-poster）

BanG Dream! Our Notes 中 millsage 的 Key.&Vo. 汐見 蛍（Hotaru Shiomi）的同人角色排版图。仅供个人使用，不商用。
人物原画版权归 BanG Dream! 项目（Bushiroad）所有，这里只是二次排版。

打开 `index.html` 可以看全部成品和过程稿。

## 成品（`输出/`）

| 文件 | 内容 |
| --- | --- |
| `设计说明.md` | 角色理解、风格、配色、版式、字体 |
| `方向A.png` `方向B.png` `方向C.png` | 三个方向小图（800×1200）：A 月白淡紫 / B 乐谱拼贴 / C 蛍火夜色 |
| `大图-v1.png` → `大图-v2.png` → `大图-v3.png` | 选定方向 A 后的大图（2400×3600），每轮自查修改后的版本 |
| `最终-汐見蛍.png` | 最终图（= v3） |
| `最终-汐見蛍-分层.psd` | 分层文件，10 个图层（底色、装饰、错位投影、贴纸白边、人物、底栏、弹琴特写、大字、文字装饰、琴键条）。文字已栅格化 |
| `人物抠图-透明底.png` | 单独的人物 + 琴键抠图（3840 宽工作尺寸） |
| `_弃用-第一次理解（常规海报）/` | 第一次把需求误解成常规演奏会海报时做的图，只作过程记录 |

## 文字依据

画面上的设定都来自官方角色页（bang-dream.com / bang-dream-on.bushimo.jp）：
名字「汐見 蛍」/ Hotaru Shiomi、Key.&Vo.、millsage、「楽壇の天使」、「心優しき音楽の天才。」、芸術学院中学校 音楽科 3年、生日 3月12日。

## 怎么重建

需要 Python 3 和 `pillow numpy pymatting psd-tools`。抠图与超分另需 `onnxruntime torch`。

```sh
# 1. 4x 动漫超分（权重不入库：RealESRGAN_x4plus_anime_6B.pth，17 MB，Real-ESRGAN 官方发布的模型）
python3 tools/upscale.py RealESRGAN_x4plus_anime_6B.pth 素材/source-hotaru-piano.jpg build/source-x4.png
python3 -c "from PIL import Image; Image.open('build/source-x4.png').resize((3840,2160), Image.LANCZOS).save('build/source-x2.png')"

# 2. 粗遮罩（skytnt/anime-seg 的 isnetis.onnx，不入库）
python3 tools/segment.py isnetis.onnx 素材/source-hotaru-piano.jpg build/mask-full.png
python3 tools/segment.py isnetis.onnx 素材/source-hotaru-piano.jpg build/mask-crop.png 500 0 1920 1080

# 3. 精修抠图 -> build/fg-x2.png, build/alpha-girl-x2.png, build/alpha-keys-x2.png
python3 tools/matte.py

# 4. 出图（--rev 0/1/2 对应 v1/v2/v3）
python3 src/poster.py A 800  输出/方向A.png
python3 src/poster.py B 800  输出/方向B.png
python3 src/poster.py C 800  输出/方向C.png
python3 src/poster.py A 2400 输出/最终-汐見蛍.png --rev 2 --psd 输出/最终-汐見蛍-分层.psd
```

第 1–3 步的结果已经存在 `build/` 里，所以只想重新出图的话，直接从第 4 步开始即可，不需要模型。

## 结构

- `素材/` 原图（不改动）
- `src/poster.py` 排版与渲染（1000×1500 单位坐标，按输出宽度缩放；每个方向输出命名图层，同一份代码出 PNG 和 PSD）
- `tools/` 超分、分割、精修抠图、PSD 导出
- `build/` 抠图中间结果（`look/` 和 `source-x4.png` 是本地检查和超分原始输出，不入库）
- `fonts/` 全部字体文件（SIL Open Font License，许可证在 `fonts/licenses/`）：Anton、Bebas Neue、Dela Gothic One、Zen Kaku Gothic New、Shippori Mincho、Cormorant Garamond、Space Grotesk、IBM Plex Mono
