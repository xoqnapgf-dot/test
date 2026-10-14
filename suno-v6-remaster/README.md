# Suno v6 Remaster · Suno v6 リマスター

**English** · [日本語](#日本語)

---

## English

### What this is

75 finished songs from two lyric files, rebuilt as complete, paste-ready parameter sets for **Suno v6**
(the flagship model — not v6-mini, not v6-wild). Every song has:

- a **Title**,
- a **Style of Music** written as full sentences (v6 reads the style box literally),
- an **Exclude Styles** list (all “no X” wishes live here),
- **Lyrics** with detailed in-lyric performance directions (`[Verse 1 | …]`) and explicit interlude / pause content,
- the slider settings: **Vocal Gender, Weirdness, Style Influence, Variety, Max Mode**, plus BPM and expected length,
- short notes (in Chinese, the working language of the lyrics) explaining what was fixed and what to retry.

**The lyric wording is untouched.** Only tags, punctuation, line breaks and blank lines were added.
`tools/build.js` compares every remastered lyric with the original line range, after removing tags,
punctuation and whitespace, and fails on any difference. The only text removed from a lyric is a production
note that had been written inside parentheses (Suno would have sung it); each such case is declared in the
song file as `#dropped:` and moved into a tag.

### Open it

- **`index.html`** — offline viewer: search, filter by language, one card per song with copy buttons
  (Title / Style / Exclude / Lyrics / everything). English and Japanese UI.
- **`suno-v6-all-songs.zip`** — all songs in one text file, **password `test`** (standard ZIP encryption,
  opens in Windows Explorer, macOS Archive Utility, 7-Zip, `unzip -P test`).

### How to use a song in Suno

1. Create → **Custom (Advanced)** → model **v6**.
2. Paste Title, Style of Music, Lyrics; open **More Options** and paste **Exclude Styles**.
3. Set Vocal Gender, Weirdness, Style Influence, Variety, Max Mode as listed.
4. Generate 2–4 takes. Fix a single line with v6 Lyrics Precision Editing or one section with Section Editing
   instead of rerolling the whole song.

### Conventions used in every lyric

| Rule | Why |
| --- | --- |
| Each `[tag \| direction]` sits alone on its own line; lyrics start on the next line; one blank line between sections. | Bracket text is a direction only when it is on its own line; a bracket on a lyric line gets sung. |
| Directions are plain English, ≤ 50 words, positive wording only. | Mixed-language directions get sung; v6 reads literally. |
| Intros, interludes, drops, outros state **what plays and for how many bars**; `[Break]` / `[Drop]` state a **one-beat silence**. | Suno shortens vague interludes, and a rest gives the singer room to breathe. |
| Lines end with `，。` / `、。` / `, .`; very dense rap lines use an inline `[Silence]` instead (never both). | Community tests: punctuation before `[Silence]` made vocals speed up. |
| Long verses are split into `part 1 of N` tags and short groups separated by blank lines. | Shorter sections are finer edit boundaries and pace better. |
| Parentheses are **sung backing vocals only**. Overlapping echoes are merged onto the lead line; call-and-response answers keep their own line. | In v6, parentheses are always sung as a second layer. |
| Production notes hidden in parentheses or Chinese brackets, empty tags, stray `[]` were rewritten. | They would be sung or ignored. |
| Repeated choruses are word-for-word identical; the final one is tagged `[Final Chorus]`. | Identical text encourages a repeated melody. |
| Non-English songs start with `[This is a Mandarin / Japanese / German song]`. | Lowers the chance of the wrong language or dialect. |

### Settings policy

- **Model:** always `v6`. v6-mini is the free fast model; v6-wild is the exploratory one (less predictable).
- **Weirdness 35–75** (conventional songs low, experimental ones high), **Style Influence 60–70** (the
  default is 50; these styles are detailed sentences, so a little above default).
- **Variety: Off** (0). Suno states Variety rewrites your style prompt and that 0 keeps your tags intact.
  If vocals sound flat, try Normal.
- **Max Mode: On** for most songs (Suno recommends it for songs over two minutes and for vocal/style
  consistency; it costs extra credits), **Off** for short or comic pieces.

### What was verified, and what was not

Checked against Suno's own help page and community guides (October 2026):
the three model names and tiers ([Suno help](https://help.suno.com/en/articles/13924481)); Variety = 0 keeps style tags,
Max Mode recommended for songs over two minutes (same page); Style 1000 / Lyrics 5000 characters and Style Influence default 50%
([HookGenius v6 guide](https://hookgenius.app/learn/suno-v6-guide/)); negations in the style box backfire and the `[Silence]` / comma advice
([Replayed Studio](https://replayedstudio.com/blog/suno-v6-vocals-flat-rushed/)); parentheses are always sung, brackets never
([Songsmith](https://songsmith.studio/blog/suno-lyric-formatting-symbols), [Paddy Studio](https://paddystudio.com/blog/suno-song-structure-and-vocal-tags/)).

**Not officially documented** (community findings, treat as starting points): the exact effect of inline `[Silence]`;
whether a parenthetical echo works better inline or on its own line in v6; the 50-word limit on directions;
Tier 1–4 tag compliance. If an echo line is swallowed, move it back to its own line (the original layout).
Suno also filters explicit profanity and some political text at its own discretion — a few songs contain both and are
kept word-for-word.

### Not processed

Empty templates (section tags only) and unstructured rap scraps are listed in
[`src/skipped.txt`](src/skipped.txt). Tell me if you want any of them turned into songs.

### Layout and rebuild

```
index.html            offline viewer (classic scripts, relative paths)
data/songs.js         generated data for the viewer
src/songs/*.txt       one readable source file per song (edit these)
src/originals/        the two original lyric files, used by the integrity check
src/skipped.txt       what was not processed
src/app.js, style.css viewer code
tools/build.js        validator + generator
suno-v6-all-songs.zip generated, password: test
```

```
node tools/build.js --check   # limits, tag syntax, lyric integrity
node tools/build.js           # also writes data/songs.js and the zip (needs the `zip` command)
```

Song file format: header lines `#id #slug #title #album #lang #orig f1:5-39 #vocal #model #weirdness #influence
#variety #max #bpm #length #note …`, then `--- STYLE`, `--- EXCLUDE`, `--- LYRICS` sections.
Limits enforced: Style 1000, Lyrics 5000, Title 100, Exclude 1000 characters; no negation words in Style;
no non-ASCII text inside tags.

---

## 日本語

### これは何か

2 つの歌詞ファイルにある完成済みの **75 曲** を、**Suno v6**（フラッグシップ。v6-mini でも v6-wild でもありません）に
そのまま貼れる完全なパラメータ一式として作り直したものです。各曲には次が揃っています。

- **タイトル**
- 文章形式の **Style of Music**（v6 はスタイル欄を文字通りに読みます）
- **Exclude Styles**（「〜なし」の指定はすべてここ）
- 演出指示つきの **歌詞**（`[Verse 1 | …]`）と、間奏・間（ま）の具体的な内容
- スライダー設定：**Vocal Gender / Weirdness / Style Influence / Variety / Max Mode**、BPM と想定の長さ
- 何を直したか・どう再試行するかの短いメモ（歌詞の作業言語である中国語）

**歌詞の文言は一字も変えていません。** 追加したのはタグ・句読点・改行・空行だけです。`tools/build.js` が、タグ・句読点・空白を除いた
状態で元の行範囲と全曲を照合し、差があればエラーにします。歌詞から取り除いたのは「丸括弧の中に書かれた制作メモ」
（そのままだと Suno に歌われてしまう）だけで、曲ファイルの `#dropped:` に明記し、タグへ移しています。

### 開き方

- **`index.html`** — オフラインのビューア。検索・言語フィルタ・曲ごとのカードとコピーボタン（タイトル / Style / Exclude / 歌詞 / まとめて）。UI は英語と日本語。
- **`suno-v6-all-songs.zip`** — 全曲を 1 つのテキストにまとめたもの。**パスワードは `test`**（標準の ZIP 暗号化。Windows エクスプローラー、macOS、7-Zip、`unzip -P test` で開けます）。

### Suno での使い方

1. Create → **Custom (Advanced)** → モデル **v6**。
2. タイトル・Style of Music・歌詞を貼り、**More Options** を開いて **Exclude Styles** を貼ります。
3. Vocal Gender / Weirdness / Style Influence / Variety / Max Mode を記載どおりに設定。
4. 2〜4 テイク生成。1 行だけ直したいときは歌詞精密編集、1 セクションだけならセクション編集を使い、曲全体を引き直さないでください。

### すべての歌詞に共通するルール

| ルール | 理由 |
| --- | --- |
| `[タグ \| 指示]` は必ず単独の行。歌詞は次の行から。セクション間は 1 行空ける。 | 角括弧は単独行のときだけ指示になり、歌詞行に混ざると歌われる。 |
| 指示は英語のみ・50 語以内・肯定表現のみ。 | 言語が混ざると歌われる。v6 は文字通りに読む。 |
| イントロ・間奏・ドロップ・アウトロは**鳴っている内容と小節数**を明記。`[Break]` / `[Drop]` で**1 拍の無音**を指定。 | 曖昧な間奏は短縮される。休符で歌手が息を継げる。 |
| 行末は `，。` / `、。` / `, .`。詰まったラップ行だけ行末の `[Silence]` を使い、併用しない。 | コミュニティ検証で、`[Silence]` の前の句読点は逆に加速させた。 |
| 長い Verse は `part 1 of N` に分割し、短いまとまりごとに空行。 | 短いセクションは編集境界として細かく、走りも抑えられる。 |
| 丸括弧は**歌われるバックボーカルだけ**。重なる合いの手は主旋律の行へ、掛け合いの返事は独立行のまま。 | v6 では丸括弧は常に重ねて歌われる。 |
| 括弧や中国語の角括弧に隠れた制作メモ、空タグ、孤立した `[]` は書き換え。 | 歌われるか無視される。 |
| 繰り返しのサビは一字一句同じ、最後は `[Final Chorus]`。 | 同じ文面はメロディの反復を促す。 |
| 非英語曲の冒頭に `[This is a Mandarin / Japanese / German song]`。 | 言語・方言の取り違えを減らす。 |

### 設定の方針

- **モデル：** 常に `v6`。v6-mini は無料の高速版、v6-wild は実験用（予測しにくい）です。
- **Weirdness 35〜75**（普通の曲は低め、実験的な曲は高め）、**Style Influence 60〜70**（既定は 50。ここでは詳細な文章スタイルなので少し上げています）。
- **Variety：Off（0）。** Suno は「Variety はスタイル指定を書き換える。0 ならタグはそのまま」と説明しています。歌が平板なら Normal を試してください。
- **Max Mode：** 多くの曲で On（Suno は 2 分超の曲や声・スタイルの一貫性に推奨。クレジットを追加消費）。短い曲やコミカルな曲は Off。

### 何を確認し、何を確認していないか

Suno 公式ヘルプとコミュニティ記事で確認（2026 年 10 月）：3 つのモデル名と対象プラン（[Suno ヘルプ](https://help.suno.com/en/articles/13924481)）、
Variety 0 でタグが保たれること・Max Mode が 2 分超の曲に推奨されること（同ページ）、Style 1000 / Lyrics 5000 文字と Style Influence 既定 50%
（[HookGenius](https://hookgenius.app/learn/suno-v6-guide/)）、スタイル欄の否定語が逆効果であることと `[Silence]`・カンマの助言
（[Replayed Studio](https://replayedstudio.com/blog/suno-v6-vocals-flat-rushed/)）、丸括弧は常に歌われ角括弧は歌われないこと
（[Songsmith](https://songsmith.studio/blog/suno-lyric-formatting-symbols)、[Paddy Studio](https://paddystudio.com/blog/suno-song-structure-and-vocal-tags/)）。

**公式には未記載**（コミュニティの知見で、出発点として扱ってください）：行末 `[Silence]` の正確な効果、v6 で括弧の合いの手が同じ行と別行のどちらで効くか、
指示の 50 語制限、Tier 1〜4 のタグ遵守率。合いの手が消える場合は元の配置（独立行）に戻してください。
また Suno は露骨な罵倒語や一部の政治的表現を独自に検閲することがあります。該当する曲もありますが、歌詞は一字一句そのまま保持しています。

### 未処理のもの

空のテンプレートと、構造のないラップ草稿は [`src/skipped.txt`](src/skipped.txt) に一覧があります。曲にしたいものがあれば教えてください。

### 構成と再生成

```
index.html            オフラインビューア（クラシック script、相対パスのみ）
data/songs.js         ビューア用の生成データ
src/songs/*.txt       曲ごとの読みやすいソース（編集するのはここ）
src/originals/        照合に使う元の歌詞ファイル 2 つ
src/skipped.txt       未処理の一覧
src/app.js, style.css ビューアのコード
tools/build.js        検証 + 生成
suno-v6-all-songs.zip 生成物（パスワード: test）
```

```
node tools/build.js --check   # 文字数・タグ構文・歌詞の一致を検証
node tools/build.js           # data/songs.js と zip も生成（zip コマンドが必要）
```

曲ファイルの形式：ヘッダ行 `#id #slug #title #album #lang #orig f1:5-39 #vocal #model #weirdness #influence #variety #max #bpm #length #note …`、
続いて `--- STYLE`、`--- EXCLUDE`、`--- LYRICS`。制限は Style 1000 / Lyrics 5000 / Title 100 / Exclude 1000 文字。Style に否定語を書かない、タグ内に英語以外を入れない、も検証します。
