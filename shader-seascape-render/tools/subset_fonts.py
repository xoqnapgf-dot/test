#!/usr/bin/env python3
"""Subset the three self-hosted families down to the characters this page actually
uses, and write woff2 files into assets/fonts/.

The page must work from file:// with no network, so the fonts ship inside the
project; the full Noto Serif SC is 25 MB, the subset is a few hundred kB.

  python3 tools/subset_fonts.py            # rebuild the subsets
  python3 tools/subset_fonts.py --report   # show sizes and coverage only

Sources (staged by tools/fetch_fonts.sh into tools/tmp/fonts/):
  SpaceGrotesk[wght].ttf   JetBrainsMono[wght].ttf   NotoSerifSC[wght].ttf
All three are SIL Open Font License 1.1; OFL.txt files are fetched alongside and
concatenated into assets/fonts/OFL.txt.
"""
import os
import re
import sys
import glob
import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'tools' / 'tmp' / 'fonts'
OUT = ROOT / 'assets' / 'fonts'

# Text that is not in the source files yet, so a later edit does not turn into tofu.
# Kept deliberately short: everything in the film's script is already collected.
EXTRA = (
    '实时着色器解构从一条射线到一片海九个步骤地形大气云反射合成帧率曝光泛光暗角阴影'
    '高度场查找表直方图天气图分辨率太阳波浪菲涅耳米氏瑞利臭氧吸收材质岩石草沙雪'
    '海平面淹没海湾岛屿光路金边视点针孔方向交点步进邻居差分坡度视线剖面尺度'
    '每一步随机采样散射线生成烘焙表实时计算全部浏览器支持设备验证参数调节面板'
    '秒帧毫秒像素通道颜色范围亮度饱和对比曲线颗粒噪点抖动下采样金字塔卷积'
    '横坐标纵坐标单位米千米度角度百分比近似精确平均最大最小'
    '·—、。，；：？！「」『』（）《》〈〉×÷±≈≤≥∞←→↑↓°′″％'
)


def collect_chars():
    files = []
    for pat in ('index.html', 'assets/*.css', 'assets/**/*.css', 'src/*.js', 'src/**/*.js',
                'README.md', 'tools/*.mjs'):
        files += glob.glob(str(ROOT / pat), recursive=True)
    chars = set()
    for f in sorted(set(files)):
        try:
            chars |= set(pathlib.Path(f).read_text(encoding='utf-8', errors='ignore'))
        except OSError:
            pass
    # ASCII + the punctuation a film page needs, then the CJK safety list
    chars |= set(''.join(chr(c) for c in range(0x20, 0x7f)))
    chars |= set('·—…‘’“”「」『』《》〈〉（）【】《》，。、；：？！×÷±≈≤≥∞°′″①②③④⑤⑥⑦⑧⑨')
    chars |= set(EXTRA)
    chars -= set('\n\r\t')
    return ''.join(sorted(chars))


def run(cmd):
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode != 0:
        print('FAILED:', ' '.join(cmd))
        print(p.stdout[-4000:])
        print(p.stderr[-4000:])
        sys.exit(1)
    return p.stdout + p.stderr


def main():
    report_only = '--report' in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    text = collect_chars()
    cjk = [c for c in text if ord(c) > 0x2fff]
    print('charset: %d characters (%d CJK)' % (len(text), len(cjk)))
    textfile = ROOT / 'tools' / 'tmp' / 'charset.txt'
    textfile.parent.mkdir(parents=True, exist_ok=True)
    textfile.write_text(text, encoding='utf-8')

    jobs = [
        ('SpaceGrotesk[wght].ttf', 'SpaceGrotesk.woff2', 'latin'),
        ('JetBrainsMono[wght].ttf', 'JetBrainsMono.woff2', 'latin'),
        ('NotoSerifSC[wght].ttf', 'NotoSerifSC.woff2', 'all'),
        ('NotoSansSC[wght].ttf', 'NotoSansSC.woff2', 'all'),
    ]
    for src, dst, mode in jobs:
        sf = SRC / src
        if not sf.exists():
            print('missing source:', sf)
            continue
        of = OUT / dst
        if report_only:
            if of.exists():
                print('%-24s %8.1f kB' % (dst, of.stat().st_size / 1024))
            continue
        tf = textfile
        if mode == 'latin':
            lat = ROOT / 'tools' / 'tmp' / 'charset_latin.txt'
            lat.write_text(''.join(c for c in text if ord(c) < 0x2fff), encoding='utf-8')
            tf = lat
        cmd = [sys.executable, '-m', 'fontTools.subset', str(sf),
               '--text-file=%s' % tf,
               '--flavor=woff2',
               '--output-file=%s' % of,
               '--layout-features=kern,liga,calt,locl,ccmp,vert,vrt2,palt,halt',
               '--drop-tables+=DSIG',
               '--name-IDs=1,2,3,4,5,6',
               '--no-hinting',
               '--desubroutinize',
               '--recalc-bounds']
        # pyftsubset keeps the fvar axis by default, so the weight range survives
        out = run(cmd)
        err = [l for l in out.splitlines() if 'error' in l.lower()]
        print('%-24s %8.1f kB  %s' % (dst, of.stat().st_size / 1024, ('; '.join(err[:2]) if err else '')))

    (OUT / 'README.txt').write_text(
        'These are subsets of the three SIL Open Font License families the page uses.\n'
        'Rebuild them with:  python3 tools/subset_fonts.py\n'
        'Sources: google/fonts ofl/spacegrotesk, ofl/jetbrainsmono, ofl/notoserifsc\n'
        'License: see OFL.txt in this directory.\n', encoding='utf-8')
    print('done')


if __name__ == '__main__':
    main()
