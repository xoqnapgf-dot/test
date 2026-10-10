# 第三方许可说明

## three.js（运行时）

本项目在构建期使用 `three@0.186.1`，并将其打入 `app.bundle.js` 供本地运行。three.js 上游项目：<https://github.com/mrdoob/three.js>。bundle 末尾保留 SPDX/MIT 许可注记；完整许可如下。

```text
The MIT License

Copyright © 2010-2026 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

## esbuild（仅构建期）

`esbuild@0.25.12` 是开发依赖，不会作为运行时资源加载。项目没有复制它的代码；其上游许可为 MIT：<https://github.com/evanw/esbuild>。

本项目的应用代码与程序化图案为原创。参考资料仅用于技术研究；The Book of Shaders 的内容、图片、代码与截图均未复制或再分发。
