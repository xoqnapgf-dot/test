# 无限猴子 · 纯随机像素实验

一个手机竖屏优先、可添加到 iPhone 主屏幕的离线网页应用。它**不是原生软件，也不是 AI 图像生成器**：每张 320×180 图中的 57,600 个像素，都是由设定主种子和序号得到的 xoshiro128** 伪随机流直接填入 0–255 的色号，再按固定 3-3-2 调色板绘制。没有图像模型、扩散模型或 AI 推理。

图片不会写入本地存储。进度、种子、保存项、备注、时间和历史最小压缩比保存在 `localStorage`；保存的图片需要用 `(masterSeed, k)` 重新生成。每次「抽一张」会先把 `nextK` 加一并写入本地，再生成图像，因此刷新不会重抽同一序号。整个实验没有连续、自动或批量抽图功能。

## 文件清单

将以下文件放在**同一个目录**。如果把项目放进独立 GitHub 仓库，上传本项目目录里的内容到仓库最外层；不要只上传 `index.html`。

```text
infinite-monkey-lab/
├── index.html              中文界面、iPhone 主屏幕网页应用入口
├── manifest.webmanifest    standalone PWA 清单，所有网址均为相对路径
├── sw.js                   版本化离线缓存、缓存优先、旧缓存清理
├── styles.css              手机优先布局、浅色/深色模式与安全区适配
├── core.js                 种子派生、xoshiro128**、像素色号与指标逻辑
├── app.js                  手动抽样、保存、复现、统计、导入导出
├── icon-180.png            iPhone 主屏幕图标
├── icon-192.png            PWA 图标
├── icon-512.png            PWA 图标
├── README.md               本说明与部署步骤
├── tools/
│   └── make_icons.py       用 Pillow 重建三种 PNG 图标
└── tests/
    └── core.test.cjs       PRNG、调色板和相邻像素指标测试
```

本仓库的项目文件位于 `infinite-monkey-lab/` 子目录中。若将**整个本仓库**发布到 GitHub Pages，应用路径会是 `https://用户名.github.io/仓库名/infinite-monkey-lab/`；若按下方步骤新建一个专用仓库并把本目录中的文件放到仓库根目录，应用路径会是 `https://用户名.github.io/仓库名/`。两种方式都使用相对路径，项目站点子目录可正常工作。

## 功能

- 128 位 `masterSeed` 由 `crypto.getRandomValues` 首次生成，显示为 32 位十六进制；每个 `k` 通过确定性混合函数派生 128 位 PRNG 状态。
- PRNG 使用 xoshiro128**。每次 32 位输出按低字节到高字节拆为四个像素色号，不做取模。
- 「忽略／保存」在生成后的约 1.5 秒倒计时内不可点；忽略后 10 秒内可以撤销。保存前可添加备注。
- 「重现任意一张」只预览指定的种子与 `k`，不改变抽取统计或 `nextK`。保存列表的缩略图也由种子和序号重新生成。
- 每张样本显示 Deflate 压缩比与横向相邻同色比例；若 `CompressionStream` 不可用，会提示并跳过压缩比。
- PNG 导出提供原图 320×180，以及最近邻放大 4 倍的 1280×720 版本。
- JSON 备份包括 `records`、历史最小压缩比和导出时间，不包含图像。导入按主种子合并：`nextK` 取较大值，保存项按 `k` 去重取并集；导入后可选择继续使用的主种子，默认选 `nextK` 最大者。
- 清空记录须经过两次确认。首次打开时会尽力调用 `navigator.storage.persist()`；若本地存储不可用，页面仍可运行，但会明确提示「记录无法保存」。
- Service Worker 预缓存应用文件；后续可离线打开。程序生成图片不需要网络。

## 一、在 GitHub 建仓库并上传文件

1. 登录 GitHub，点右上角 **＋ → New repository**。
2. 输入仓库名，例如 `infinite-monkey-lab`。免费账号要使用 GitHub Pages，请把仓库设为 **Public（公开）**。
3. 创建仓库后，上传本项目目录中的**全部文件和文件夹**到仓库最外层：点击 **Add file → Upload files**，拖入 `index.html`、`manifest.webmanifest`、`sw.js`、三个 PNG 图标、`core.js`、`app.js`、`styles.css`、`README.md`、`tools/` 和 `tests/`，然后提交到 `main` 分支。目录结构需保持不变。
4. 也可以用 Git 上传；下面命令假设当前目录就是已复制到专用仓库根目录的这些文件：

   ```sh
   git add .
   git commit -m "Add Infinite Monkey Lab PWA"
   git push origin main
   ```

## 二、开启 GitHub Pages

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 中，**Source** 选 `Deploy from a branch`。
3. **Branch** 选 `main`，目录选 `/(root)`，点 **Save**。如果你提交到 `master`，就选 `master`；若页面里提供 GitHub Actions 发布方式，也不需要改用 Actions。
4. 等待 Pages 构建发布。通常数分钟；首次发布或 GitHub 队列繁忙时可能更久。回到 **Settings → Pages**，页面会显示站点网址，形式为：

   ```text
   https://<你的GitHub用户名>.github.io/<仓库名>/
   ```

   例如用户名为 `monkey-fan`、仓库名为 `infinite-monkey-lab`，网址就是 `https://monkey-fan.github.io/infinite-monkey-lab/`。使用 HTTPS 地址。不要把 `index.html` 单独上传，也不要删除 `manifest.webmanifest`、Service Worker 或图标文件。

## 三、在 iPhone 添加到主屏幕

1. 在 iPhone 上用 **Safari** 打开 GitHub Pages 的 HTTPS 网址；不要从其他 App 的内置浏览器打开。
2. 等页面完整载入，保持联网片刻，让 Service Worker 完成安装和预缓存。
3. 点 Safari 的**分享**按钮（方框向上箭头），选择 **添加到主屏幕**。如果出现 **作为网页 App 打开 / Open as Web App** 开关，请打开；然后点 **添加**。
4. 从 iPhone 主屏幕点新图标启动。应用会以 `standalone` 全屏样式运行，不显示 Safari 地址栏。若页面顶部仍显示提示条，请确认是从主屏幕图标启动，而不是回到 Safari 标签页。
5. 先在线启动一次并确认页面已正常载入，再试着断网启动。若尚未预缓存完成，首次断网测试可能暂时打不开；重新联网启动并稍候后再试。

Safari 浏览器和主屏幕网页 App 的本地存储可能互相独立。因此页面在非 standalone 模式会显示提示；如果已在 Safari 中做过实验，需要在该环境导出 JSON，再从主屏幕 App 导入，记录不会自动跨环境同步。

## 四、更新版本

1. 修改 `sw.js` 中的 `APP_VERSION`，例如从 `"1.0.0"` 改为 `"1.0.1"`。这会创建新的缓存名称，并在激活时清理旧版本缓存。
2. 同时把 `app.js` 顶部的 `FALLBACK_VERSION` 改成相同版本号（Service Worker 激活后，页面角落会读取 Worker 中的版本号；这个备用值用于 Worker 尚未就绪或不支持的环境）。
3. 上传修改后的文件并提交到 Pages 发布分支，等待发布完成。
4. 手机联网时，从主屏幕打开应用，让新 Service Worker 安装；完全关闭网页 App（从 iPhone 多任务切换器上划掉），再重新点主屏幕图标打开。更新完成后可断网测试。

## 图标重建

已提交的三个 PNG 可直接使用。如修改图案后需要重建，在 Python 3 环境安装 Pillow 并运行：

```sh
python3 -m pip install Pillow
python3 tools/make_icons.py
```

脚本会在项目根目录生成 `icon-180.png`、`icon-192.png`、`icon-512.png`。

## 本地校验

需要 Node.js 18 或更高版本，不需要安装 npm 依赖：

```sh
node --check app.js
node --check core.js
node --test tests/core.test.cjs
```

页面内的「校验可复现性」按钮会用同一 `(masterSeed, k)` 生成两次并逐字节比较；通过会显示一致。这个检查不会递增 `nextK`，不会保存图像，也不会创建实验记录。
