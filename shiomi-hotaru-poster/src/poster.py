"""Character layout poster for 汐見 蛍 (millsage, BanG Dream! Our Notes) - fan art, non-commercial.

usage: python3 src/poster.py <direction> <width> <out.png> [--rev N] [--psd out.psd]
  direction  A | B | C | D   (D = second pass after feedback, closer to the genre)
  --rev N    self-review round baked in (0 = first draft); later rounds keep earlier fixes
  width      output width in px; height is always 1.5x (2:3)

Everything is laid out in a 1000x1500 unit space and scaled by k = width / 1000.
The character comes from tools/matte.py (build/fg-x2.png + alphas, 2x source px).
Each design returns named RGBA layers bottom-to-top, so the same code writes the
flat PNG and the layered PSD.
"""
import math
import os
import random
import sys

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, "fonts")
BUILD = os.path.join(ROOT, "build")

# palette sampled from the source art
IVORY = (243, 238, 228)
INK = (52, 56, 70)          # slate of the shawl shadows
VIOLET = (111, 104, 168)    # iris shadow
PERIWINKLE = (147, 157, 239)
LAVENDER = (208, 203, 229)  # hair
DRESS = (163, 178, 210)
GOLD = (246, 227, 184)      # the afternoon light
OLIVE = (140, 143, 94)      # hairpin stripe
NIGHT = (19, 19, 38)

# ---------------------------------------------------------------- text ------


def font(name, size, axes=None):
    f = ImageFont.truetype(os.path.join(FONTS, name), max(1, round(size)))
    if axes:
        f.set_variation_by_axes(axes)
    return f


class Poster:
    def __init__(self, width):
        self.k = width / 1000
        self.W, self.H = width, round(width * 1.5)
        self.layers = []

    def u(self, v):
        return v * self.k

    def layer(self, name):
        im = Image.new("RGBA", (self.W, self.H), (0, 0, 0, 0))
        self.layers.append((name, im))
        return im

    def text(self, im, xy, s, fname, size, fill, axes=None, tracking=0, anchor="ls", features=None):
        """Horizontal text; tracking in 1/1000 em, applied between glyphs."""
        f = font(fname, self.u(size), axes)
        d = ImageDraw.Draw(im)
        x, y = self.u(xy[0]), self.u(xy[1])
        if not tracking:
            d.text((x, y), s, font=f, fill=fill, anchor=anchor, features=features)
            return f.getlength(s, features=features)
        extra = tracking / 1000 * self.u(size)
        total = sum(f.getlength(c) for c in s) + extra * (len(s) - 1)
        if anchor[0] == "m":
            x -= total / 2
        elif anchor[0] == "r":
            x -= total
        for c in s:
            d.text((x, y), c, font=f, fill=fill, anchor="l" + anchor[1])
            x += f.getlength(c) + extra
        return total

    def vtext(self, im, xy, s, fname, size, fill, gap=0.0):
        """Vertical CJK text, one glyph per em box, top-centre anchored at xy."""
        f = font(fname, self.u(size))
        d = ImageDraw.Draw(im)
        x, y = self.u(xy[0]), self.u(xy[1])
        step = self.u(size) * (1 + gap)
        for c in s:
            if c == " ":
                y += step * 0.5
                continue
            d.text((x, y + step / 2), c, font=f, fill=fill, anchor="mm")
            y += step
        return y / self.k

    def flatten(self):
        out = Image.new("RGBA", (self.W, self.H), (0, 0, 0, 255))
        for _, im in self.layers:
            out.alpha_composite(im)
        return out.convert("RGB")


# ------------------------------------------------------------ helpers -------


def rgba(c, a=255):
    return tuple(c[:3]) + (int(a),)


def vgrad(w, h, stops):
    """Vertical gradient; stops = [(t, (r,g,b,a)), ...] with t in 0..1."""
    t = np.linspace(0, 1, h)[:, None]
    ts = [s[0] for s in stops]
    out = np.zeros((h, 1, 4))
    for ch in range(4):
        out[:, 0, ch] = np.interp(t[:, 0], ts, [s[1][ch] for s in stops])
    return Image.fromarray(np.repeat(out, w, axis=1).astype(np.uint8), "RGBA")


def grain(w, h, amount, seed=7):
    rng = np.random.default_rng(seed)
    n = rng.normal(0, 1, (h // 2 + 1, w // 2 + 1))
    n = np.asarray(Image.fromarray(((n * 40 + 128).clip(0, 255)).astype(np.uint8)).resize((w, h), Image.BICUBIC), float)
    a = (np.abs(n - 128) / 128 * amount * 255).clip(0, 255).astype(np.uint8)
    light = (n > 128)[..., None]
    rgb = np.where(light, 255, 0).astype(np.uint8).repeat(3, 2)
    return Image.fromarray(np.dstack([rgb, a]), "RGBA")


_CUT = {}


def cutout(keys_fade=(380, 600)):
    """Character + keyboard strip as one RGBA at 2x source scale."""
    if keys_fade not in _CUT:
        fg = Image.open(os.path.join(BUILD, "fg-x2.png")).convert("RGB")
        a = np.asarray(Image.open(os.path.join(BUILD, "alpha-girl-x2.png")), float) / 255
        kk = np.asarray(Image.open(os.path.join(BUILD, "alpha-keys-x2.png")), float) / 255
        xs = np.arange(a.shape[1])[None, :] / 2
        fade = np.clip((xs - keys_fade[0]) / (keys_fade[1] - keys_fade[0]), 0, 1)
        fade = fade * fade * (3 - 2 * fade)
        al = np.maximum(a, kk * fade)
        _CUT[keys_fade] = Image.fromarray(np.dstack([np.asarray(fg), (al * 255 + 0.5).astype(np.uint8)]), "RGBA")
    return _CUT[keys_fade]


def place(p, s, ox, oy, keys_fade=(380, 600), fade_y=None, grade=None):
    """Figure layer: poster_unit = o + source_px * s. fade_y=(y0, y1) fades out downwards."""
    src = cutout(keys_fade)
    scale = p.u(s) / 2
    im = src.resize((round(src.width * scale), round(src.height * scale)), Image.LANCZOS)
    if grade:
        im = grade(im)
    lay = Image.new("RGBA", (p.W, p.H), (0, 0, 0, 0))
    lay.paste(im, (round(p.u(ox)), round(p.u(oy))))
    if fade_y:
        ys = np.arange(p.H)[:, None] / p.k
        t = np.clip((ys - fade_y[0]) / (fade_y[1] - fade_y[0]), 0, 1)
        t = t * t * (3 - 2 * t)
        arr = np.asarray(lay).copy()
        arr[..., 3] = (arr[..., 3] * (1 - t)).astype(np.uint8)
        lay = Image.fromarray(arr, "RGBA")
    return lay


def fill(layer, color, mask, opacity=1.0):
    """Composite a flat colour through an L mask onto an RGBA layer."""
    c = Image.new("RGBA", layer.size, rgba(color))
    c.putalpha(mask.point(lambda v: int(v * opacity)))
    layer.alpha_composite(c)


def glow(layer, radius, color, strength=1.0):
    a = layer.getchannel("A").filter(ImageFilter.GaussianBlur(radius))
    a = a.point(lambda v: min(255, int(v * strength)))
    g = Image.new("RGBA", layer.size, rgba(color))
    g.putalpha(a)
    return g


# ------------------------------------------------------- graphic helpers ----


def lerp_rgb(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


_SRC = {}


def source_x2():
    if "img" not in _SRC:
        _SRC["img"] = Image.open(os.path.join(BUILD, "source-x2.png")).convert("RGB")
    return _SRC["img"]


def src_crop(box, size):
    """Crop the 2x source by a box in 1x source px and resize to `size` px."""
    x0, y0, x1, y1 = box
    return source_x2().crop((x0 * 2, y0 * 2, x1 * 2, y1 * 2)).resize(size, Image.LANCZOS)


def src_cover(src_box, box_units, p):
    """Crop of the source with the aspect of `box_units`, centred on `src_box`, at poster px."""
    x0, y0, x1, y1 = src_box
    bx0, by0, bx1, by1 = box_units
    want = (bx1 - bx0) / (by1 - by0)
    cx, cy, w, h = (x0 + x1) / 2, (y0 + y1) / 2, x1 - x0, y1 - y0
    if w / h > want:
        h = w / want
    else:
        w = h * want
    return src_crop((cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2),
                    (round(p.u(bx1 - bx0)), round(p.u(by1 - by0))))


def lineart(im):
    """Alpha of the dark line art: pixels clearly darker than their surroundings."""
    lum = np.asarray(im.convert("L"), float) / 255
    blur = np.asarray(im.convert("L").filter(ImageFilter.GaussianBlur(4)), float) / 255
    a = ((blur - lum - 0.025) * 7).clip(0, 1)
    return Image.fromarray((a * 255).astype(np.uint8))


def duotone(im, dark, light, gamma=1.0):
    t = (np.asarray(im.convert("L"), float) / 255) ** gamma
    d, l_ = np.array(dark, float), np.array(light, float)
    out = d + (l_ - d) * t[..., None]
    return Image.fromarray(out.clip(0, 255).astype(np.uint8)).convert("RGBA")


def sticker(fig, width_px, color, soft=False):
    """Flat outline behind a cut-out, like a die-cut sticker edge. soft=True dilates
    the alpha itself, so the edge fades wherever the figure fades (the keys)."""
    a = fig.getchannel("A")
    a = a.point(lambda v: min(255, v * 2)) if soft else a.point(lambda v: 255 if v > 40 else 0)
    size = int(width_px) * 2 + 1
    while size > 1:
        step = min(size, 9)
        a = a.filter(ImageFilter.MaxFilter(step))
        size -= step - 1
    a = a.filter(ImageFilter.GaussianBlur(0.8))
    out = Image.new("RGBA", fig.size, rgba(color))
    out.putalpha(a)
    return out


def offset(layer, dx, dy):
    out = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    out.paste(layer, (round(dx), round(dy)))
    return out


def tinted(layer, color, opacity):
    out = Image.new("RGBA", layer.size, rgba(color))
    out.putalpha(layer.getchannel("A").point(lambda v: int(v * opacity)))
    return out


def text_img(p, s, fname, size, fill_, axes=None, tracking=0, stroke=0, stroke_fill=None, outline_only=False):
    """Render a string to its own tight RGBA image (for rotation / masking)."""
    f = font(fname, p.u(size), axes)
    extra = tracking / 1000 * p.u(size)
    w = sum(f.getlength(c) for c in s) + extra * (len(s) - 1) + p.u(size) * 0.2 + stroke * 2
    asc, desc = f.getmetrics()
    im = Image.new("RGBA", (int(w) + 4, asc + desc + int(stroke * 2) + 4), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    x = stroke + 2
    for c in s:
        if outline_only:
            m = Image.new("L", im.size)
            ImageDraw.Draw(m).text((x, stroke + 2), c, font=f, fill=255, stroke_width=int(stroke), stroke_fill=255)
            inner = Image.new("L", im.size)
            ImageDraw.Draw(inner).text((x, stroke + 2), c, font=f, fill=255)
            ring = ImageChops.subtract(m, inner)
            col = Image.new("RGBA", im.size, fill_)
            col.putalpha(ring)
            im.alpha_composite(col)
        else:
            d.text((x, stroke + 2), c, font=f, fill=fill_, stroke_width=int(stroke), stroke_fill=stroke_fill)
        x += f.getlength(c) + extra
    return im.crop(im.getbbox()) if im.getbbox() else im


def paste_at(layer, im, xy_units, p, anchor="lt"):
    x, y = p.u(xy_units[0]), p.u(xy_units[1])
    if anchor[0] == "m":
        x -= im.width / 2
    elif anchor[0] == "r":
        x -= im.width
    if anchor[1] == "m":
        y -= im.height / 2
    elif anchor[1] == "b":
        y -= im.height
    layer.alpha_composite(im, (round(x), round(y)))


def fit_size(p, s, fname, width_units, axes=None, tracking=0):
    """Font size (units) at which `s` is `width_units` wide."""
    probe = 100
    f = font(fname, p.u(probe), axes)
    w = sum(f.getlength(c) for c in s) + tracking / 1000 * p.u(probe) * (len(s) - 1)
    bb = text_img(p, s, fname, probe, (0, 0, 0, 255), axes, tracking).width
    return probe * p.u(width_units) / bb


def spaced(s):
    return " ".join(s)


def chevrons(p, d, x, y, n, h, color, gap=0.8):
    for i in range(n):
        cx = x + i * h * gap
        d.line([(p.u(cx), p.u(y - h / 2)), (p.u(cx + h / 2), p.u(y)), (p.u(cx), p.u(y + h / 2))],
               fill=color, width=max(1, round(p.u(h * 0.22))), joint="curve")


def dotgrid(p, d, box, step, r, color):
    x0, y0, x1, y1 = box
    y = y0
    while y <= y1:
        x = x0
        while x <= x1:
            d.ellipse([p.u(x - r), p.u(y - r), p.u(x + r), p.u(y + r)], fill=color)
            x += step
        y += step


def star4(p, d, cx, cy, r, color, thin=0.18):
    pts = []
    for i in range(8):
        ang = math.pi / 4 * i - math.pi / 2
        rr = r if i % 2 == 0 else r * thin
        pts.append((p.u(cx + rr * math.cos(ang)), p.u(cy + rr * math.sin(ang))))
    d.polygon(pts, fill=color)


def corner_marks(p, d, box, size, color, w=1.2):
    x0, y0, x1, y1 = box
    lw = max(1, round(p.u(w)))
    for (x, y, sx, sy) in [(x0, y0, 1, 1), (x1, y0, -1, 1), (x0, y1, 1, -1), (x1, y1, -1, -1)]:
        d.line([(p.u(x), p.u(y + sy * size)), (p.u(x), p.u(y)), (p.u(x + sx * size), p.u(y))], fill=color, width=lw)


def key_strip(p, d, box, white, black, line, octaves=None, vertical=False):
    """A strip of piano keys seen from above; horizontal unless vertical=True."""
    x0, y0, x1, y1 = box
    length = (y1 - y0) if vertical else (x1 - x0)
    depth = (x1 - x0) if vertical else (y1 - y0)
    n_white = octaves * 7 if octaves else max(7, round(length / (depth * 0.32)))
    kw = length / n_white
    d.rectangle([p.u(x0), p.u(y0), p.u(x1), p.u(y1)], fill=white)
    lw = max(1, round(p.u(1)))
    for i in range(n_white + 1):
        t = i * kw
        if vertical:
            d.line([(p.u(x0), p.u(y0 + t)), (p.u(x1), p.u(y0 + t))], fill=line, width=lw)
        else:
            d.line([(p.u(x0 + t), p.u(y0)), (p.u(x0 + t), p.u(y1))], fill=line, width=lw)
    for i in range(n_white):
        if i % 7 in (0, 1, 3, 4, 5):  # black key after C, D, F, G, A
            c = (i + 1) * kw
            if vertical:
                d.rectangle([p.u(x0), p.u(y0 + c - kw * 0.3), p.u(x0 + depth * 0.62), p.u(y0 + c + kw * 0.3)], fill=black)
            else:
                d.rectangle([p.u(x0 + c - kw * 0.3), p.u(y0), p.u(x0 + c + kw * 0.3), p.u(y0 + depth * 0.62)], fill=black)


def torn_rect(p, box, seed, jag=6, angle=0):
    """L mask of a rectangle with torn, jittery edges, optionally rotated (degrees)."""
    rnd = random.Random(seed)
    x0, y0, x1, y1 = box
    pts = []
    def edge(ax, ay, bx, by):
        n = max(4, int(math.hypot(bx - ax, by - ay) / 9))
        for i in range(n):
            t = i / n
            pts.append((ax + (bx - ax) * t + rnd.uniform(-jag, jag) * (ay != by),
                        ay + (by - ay) * t + rnd.uniform(-jag, jag) * (ax != bx)))
    edge(x0, y0, x1, y0); edge(x1, y0, x1, y1); edge(x1, y1, x0, y1); edge(x0, y1, x0, y0)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    ca, sa = math.cos(math.radians(angle)), math.sin(math.radians(angle))
    pts = [(cx + (x - cx) * ca - (y - cy) * sa, cy + (x - cx) * sa + (y - cy) * ca) for x, y in pts]
    m = Image.new("L", (p.W, p.H))
    ImageDraw.Draw(m).polygon([(p.u(x), p.u(y)) for x, y in pts], fill=255)
    return m


def image_in_mask(p, img, box, mask):
    """Paste an image scaled to cover `box` (units) and clip it by an L mask."""
    x0, y0, x1, y1 = box
    lay = Image.new("RGBA", (p.W, p.H), (0, 0, 0, 0))
    lay.paste(img.resize((round(p.u(x1 - x0)), round(p.u(y1 - y0))), Image.LANCZOS), (round(p.u(x0)), round(p.u(y0))))
    lay.putalpha(ImageChops.multiply(lay.getchannel("A"), mask))
    return lay


def halftone(p, box, step, rmax, color, direction="down"):
    lay = Image.new("RGBA", (p.W, p.H), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    x0, y0, x1, y1 = box
    y = y0
    while y <= y1:
        t = (y - y0) / (y1 - y0)
        r = rmax * (t if direction == "down" else 1 - t)
        x = x0 + (step / 2 if int((y - y0) / step) % 2 else 0)
        while x <= x1 and r > 0.3:
            d.ellipse([p.u(x - r), p.u(y - r), p.u(x + r), p.u(y + r)], fill=color)
            x += step
        y += step
    return lay


FIG_S, FIG_OX = 0.82, 640 - 1250 * 0.82   # face centre at x=640, head bleeds off the top
FIG_BOTTOM = 1080 * FIG_S


# ------------------------------------------------------------ direction A ---

PALE = (240, 238, 248)
MIST = (205, 200, 232)
LILAC = (160, 152, 214)
DEEP = (92, 84, 158)
SLATE = (52, 56, 70)


def design_a(p, rev=0):
    """月白淡紫: monochrome lilac sheet, sticker-cut figure, giant name type."""
    W, H = p.W, p.H
    bg = p.layer("底色 background")
    bg.paste(vgrad(W, H, [(0, rgba((246, 245, 251))), (0.6, rgba((234, 231, 246))), (1, rgba((224, 220, 241)))]))
    bg.alpha_composite(grain(W, H, 0.04))

    # background echoes: enlarged line art of her face + a lilac duotone of the hands
    echo = p.layer("背景线稿 line-art echo")
    if rev < 1:
        face = src_crop((960, 0, 1560, 600), (round(p.u(980)), round(p.u(980))))
        la = lineart(face)
        paste_at(echo, tinted(Image.merge("RGBA", (la, la, la, la)), LILAC, 0.75), (-430, 330), p)


    deco = p.layer("底层装饰 back deco")
    d = ImageDraw.Draw(deco)
    dotgrid(p, d, (200, 350, 400, 450), 16, 2.2, rgba(LILAC))
    # SHIOMI, vertical along the right edge behind her hair
    vt = text_img(p, "SHIOMI", "Anton-Regular.ttf", 230, rgba(MIST))
    paste_at(deco, vt.rotate(-90, expand=True), (1000, 20), p, anchor="rt")

    fig = place(p, FIG_S, FIG_OX, 0, keys_fade=(450, 620))
    p.layers.append(("错位投影 offset shadow", offset(tinted(fig, LILAC, 0.55), p.u(18), p.u(12))))
    p.layers.append(("贴纸白边 sticker edge", sticker(fig, p.u(7), (255, 255, 255), soft=rev >= 1)))
    p.layers.append(("人物 character", fig))

    band = p.layer("底栏 band")
    db = ImageDraw.Draw(band)
    db.rectangle([0, p.u(FIG_BOTTOM), W, H], fill=rgba(MIST, 235))
    if rev >= 1:
        # the face again as pale line art, whole and recognisable, under the info text
        face = src_crop((1000, 60, 1520, 580), (round(p.u(640)), round(p.u(640))))
        la = lineart(face)
        echo_lines = tinted(Image.merge("RGBA", (la, la, la, la)), (255, 255, 255), 0.9 if rev < 2 else 0.6)
        clip = Image.new("L", (W, H))
        ImageDraw.Draw(clip).rectangle([0, p.u(FIG_BOTTOM), W, p.u(1400)], fill=255)
        tmp = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        paste_at(tmp, echo_lines, (-40, 900), p)
        tmp.putalpha(ImageChops.multiply(tmp.getchannel("A"), clip))
        band.alpha_composite(tmp)

    panel = p.layer("弹琴特写 hands panel")
    pb = (590, 1030, 960, 1316) if rev < 1 else (604, 1092, 960, 1334)
    m = Image.new("L", (W, H))
    ImageDraw.Draw(m).rectangle([p.u(v) for v in pb], fill=255)
    hands = duotone(src_cover((560, 560, 1000, 900), pb, p), DEEP, PALE, 0.9)
    panel.alpha_composite(image_in_mask(p, hands, pb, m))
    ImageDraw.Draw(panel).rectangle([p.u(v) for v in pb], outline=rgba(DEEP), width=max(1, round(p.u(1.5))))

    front = p.layer("大字 HOTARU")
    size = fit_size(p, "HOTARU", "Anton-Regular.ttf", 940, tracking=10)
    ht = text_img(p, "HOTARU", "Anton-Regular.ttf", size, rgba(DEEP), tracking=10)
    paste_at(front, offset(tinted(ht, (255, 255, 255), 1), p.u(5), p.u(5)), (30, FIG_BOTTOM - ht.height / p.k * 0.42), p)
    paste_at(front, ht, (30, FIG_BOTTOM - ht.height / p.k * 0.42), p)

    t = p.layer("文字与装饰 type & deco")
    d = ImageDraw.Draw(t)
    chevrons(p, d, 44, 64, 3, 16, rgba(DEEP))
    p.text(t, (100, 70), spaced("BanG Dream!") + "    " + spaced("Our Notes"), "IBMPlexMono-Medium.ttf", 14, rgba(DEEP))
    d.line([(p.u(44), p.u(92)), (p.u(390), p.u(92))], fill=rgba(DEEP, 160), width=max(1, round(p.u(1))))
    p.vtext(t, (100, 118), "汐見蛍", "DelaGothicOne-Regular.ttf", 104, rgba(DEEP), gap=0.02)
    p.text(t, (200, 150), "Key. & Vo.", "SpaceGrotesk[wght].ttf", 24, rgba(SLATE), axes=[600])
    p.text(t, (200, 186), "millsage", "CormorantGaramond-Italic[wght].ttf", 40, rgba(DEEP), axes=[600])
    for i in range(4):
        d.rectangle([p.u(200 + i * 18), p.u(214), p.u(210 + i * 18), p.u(224)], fill=rgba(DEEP if i < 3 else LILAC))
    p.text(t, (200, 300), "03.12", "Anton-Regular.ttf", 52, rgba(DEEP))
    p.text(t, (202, 322), "BIRTHDAY", "IBMPlexMono-Regular.ttf", 12, rgba(SLATE, 200), tracking=160)

    stars = [(905, 420, 22), (948, 470, 11), (360, 520, 14), (880, 760, 9)] if rev < 1 else \
        [(905, 420, 22), (948, 470, 11), (880, 760, 9), (468, 52, 12)]
    for (x, y, r) in stars:
        star4(p, d, x, y, r, rgba((255, 255, 255)))
        star4(p, d, x, y, r * 0.55, rgba(LILAC))

    yb = FIG_BOTTOM + (180 if rev < 2 else 200)
    p.text(t, (44, yb + 60), "楽壇の天使", "ShipporiMincho-ExtraBold.ttf", 54, rgba(SLATE), tracking=80)
    p.text(t, (46, yb + 100), spaced("HOTARU SHIOMI"), "IBMPlexMono-Medium.ttf", 14, rgba(DEEP), tracking=60)
    p.text(t, (46, yb + 150), "心優しき音楽の天才。", "ShipporiMincho-Medium.ttf", 22, rgba(SLATE))
    p.text(t, (46, yb + 182), "芸術学院中学校 音楽科 3年", "ShipporiMincho-Regular.ttf", 17, rgba(SLATE, 210), tracking=40)
    cm = (578, 1018, 972, 1328) if rev < 1 else (592, 1080, 972, 1346)
    corner_marks(p, d, cm, 14, rgba(DEEP), 2)
    p.text(t, (590, 1352) if rev < 1 else (cm[0] + 12, cm[3] + 26), spaced("PIANO") + "   ·   " + spaced("Key. & Vo."), "IBMPlexMono-Medium.ttf", 12, rgba(DEEP))

    keys = p.layer("琴键条 keys strip")
    key_strip(p, ImageDraw.Draw(keys), (0, 1400, 1000, 1452), rgba((250, 250, 253)), rgba(SLATE), rgba(LILAC), octaves=4)
    p.text(keys, (44, 1484), "FAN ART  ·  NON-COMMERCIAL", "IBMPlexMono-Regular.ttf", 11, rgba(DEEP, 200), tracking=200)
    chevrons(p, ImageDraw.Draw(keys), 920, 1480, 3, 12, rgba(DEEP))


# ------------------------------------------------------------ direction B ---

PAPER = (241, 236, 226)
INKB = (44, 46, 54)
RUST = (150, 108, 168)  # violet stamp ink (from her eyes), not a real red


def design_b(p, rev=0):
    """乐谱拼贴: scrapbook of torn paper, tape, staff lines and cut details."""
    W, H = p.W, p.H
    bg = p.layer("纸底 paper")
    bg.paste(Image.new("RGBA", (W, H), rgba(PAPER)))
    bg.alpha_composite(grain(W, H, 0.07, seed=3))

    staff = p.layer("五线谱 staves")
    d = ImageDraw.Draw(staff)
    for g, y0 in enumerate((150, 560, 1120)):
        for i in range(5):
            y = y0 + i * 14
            d.line([(0, p.u(y)), (W, p.u(y))], fill=rgba(INKB, 60), width=max(1, round(p.u(1))))

    def scrap(layer, box, src, ang, seed):
        m = torn_rect(p, box, seed, 5, ang)
        sh = Image.new("RGBA", (W, H), rgba(INKB))
        sh.putalpha(offset(Image.merge("RGBA", (m, m, m, m)), p.u(6), p.u(8)).getchannel("A").filter(ImageFilter.GaussianBlur(p.u(6))).point(lambda v: v // 4))
        layer.alpha_composite(sh)
        white = Image.new("RGBA", (W, H), (252, 250, 245, 255))
        white.putalpha(m)
        layer.alpha_composite(white)
        inner = torn_rect(p, (box[0] + 10, box[1] + 10, box[2] - 10, box[3] - 10), seed + 50, 1.5, ang)
        layer.alpha_composite(image_in_mask(p, src_cover(src, box, p), box, inner))

    scrap(p.layer("拼贴·眼睛 scrap eyes"), (40, 110, 390, 300), (1080, 230, 1420, 410), -4, 11)

    fig = place(p, FIG_S, FIG_OX, 0, keys_fade=(450, 620))
    p.layers.append(("投影 shadow", offset(tinted(fig, INKB, 0.25), p.u(10), p.u(12)).filter(ImageFilter.GaussianBlur(p.u(5)))))
    p.layers.append(("贴纸白边 sticker edge", sticker(fig, p.u(9), (252, 250, 245))))
    p.layers.append(("人物 character", fig))

    band = p.layer("底部纸条 bottom sheet")
    m = torn_rect(p, (-20, FIG_BOTTOM - 4, 1020, 1520), 21, 6, 0)
    fill(band, (252, 250, 245), m)
    scrap(p.layer("拼贴·双手 scrap hands"), (430, 1090, 830, 1340), (560, 560, 1000, 900), 3, 12)

    tape = p.layer("胶带 tape")
    for (cx, cy, w_, h_, ang) in [(60, 120, 130, 32, -30), (380, 300, 120, 30, 25), (800, 1100, 140, 32, 30), (440, 1340, 120, 30, -20)]:
        m = Image.new("L", (W, H))
        pts = [(-w_ / 2, -h_ / 2), (w_ / 2, -h_ / 2), (w_ / 2, h_ / 2), (-w_ / 2, h_ / 2)]
        ca, sa = math.cos(math.radians(ang)), math.sin(math.radians(ang))
        ImageDraw.Draw(m).polygon([(p.u(cx + x * ca - y * sa), p.u(cy + x * sa + y * ca)) for x, y in pts], fill=255)
        fill(tape, (226, 214, 180), m, 0.75)

    t = p.layer("文字 type")
    d = ImageDraw.Draw(t)
    big = text_img(p, "Hotaru", "CormorantGaramond-Italic[wght].ttf", 300, rgba(INKB), axes=[700])
    paste_at(t, big, (30, FIG_BOTTOM - 20), p, anchor="lm")
    p.vtext(t, (930, 980), "汐見蛍", "ShipporiMincho-ExtraBold.ttf", 96, rgba(INKB), gap=0.04)
    p.text(t, (40, 1080), "SHIOMI", "BebasNeue-Regular.ttf", 64, rgba(RUST), tracking=300)

    def label(x, y, s, ang, size=17):
        im = text_img(p, s, "IBMPlexMono-Medium.ttf", size, rgba(INKB))
        pad = p.u(10)
        lab = Image.new("RGBA", (int(im.width + pad * 2), int(im.height + pad * 1.4)), (255, 255, 255, 255))
        lab.alpha_composite(im, (int(pad), int(pad * 0.7)))
        lab = lab.rotate(ang, expand=True, resample=Image.BICUBIC)
        paste_at(t, lab, (x, y), p)

    label(440, 1030, "BanG Dream! Our Notes", 2)
    label(40, 330, "Key. & Vo.", -3, 22)
    label(40, 410, "millsage", 4, 22)

    # round stamp with the epithet and birthday
    cx, cy, r = 160, 1230, 92
    lw = max(1, round(p.u(3)))
    d.ellipse([p.u(cx - r), p.u(cy - r), p.u(cx + r), p.u(cy + r)], outline=rgba(RUST, 220), width=lw)
    d.ellipse([p.u(cx - r + 10), p.u(cy - r + 10), p.u(cx + r - 10), p.u(cy + r - 10)], outline=rgba(RUST, 220), width=max(1, round(p.u(1.2))))
    p.text(t, (cx, cy - 8), "楽壇の天使", "ShipporiMincho-Bold.ttf", 28, rgba(RUST, 230), anchor="ms")
    p.text(t, (cx, cy + 34), "03.12", "BebasNeue-Regular.ttf", 34, rgba(RUST, 230), tracking=120, anchor="ms")

    p.text(t, (440, 1410), "心優しき音楽の天才。", "ShipporiMincho-Medium.ttf", 26, rgba(INKB))
    p.text(t, (440, 1446), "芸術学院中学校 音楽科 3年", "ShipporiMincho-Regular.ttf", 18, rgba(INKB, 200), tracking=40)
    p.text(t, (960, 1476), "fan art · non-commercial", "IBMPlexMono-Regular.ttf", 11, rgba(INKB, 160), tracking=120, anchor="rs")


# ------------------------------------------------------------ direction C ---

NAVY = (16, 17, 44)
NEON = (214, 242, 106)   # firefly yellow-green
ICE = (176, 196, 255)


def design_c(p, rev=0):
    """蛍火夜色: night sheet, echoing outline type, firefly neon accents."""
    W, H = p.W, p.H
    bg = p.layer("夜色 night")
    bg.paste(vgrad(W, H, [(0, rgba((30, 28, 72))), (0.5, rgba(NAVY)), (1, rgba((10, 10, 28)))]))
    bg.alpha_composite(halftone(p, (0, 900, 1000, 1500), 14, 4.2, rgba((60, 58, 120), 200)))

    echo = p.layer("描边字 outline echo")
    for i in range(6):
        im = text_img(p, "HOTARU", "Anton-Regular.ttf", 250, rgba(ICE, int(150 - i * 22)), stroke=p.u(1.6), outline_only=True)
        paste_at(echo, im, (500, 40 + i * 170), p, anchor="mt")

    p.layers.append(("萤火·后 fireflies back", fireflies(p, 50, (0, 60, 1000, 1200), 5, size=(2, 5), color=NEON)))

    fig = place(p, FIG_S, FIG_OX, 0, keys_fade=(450, 620))
    p.layers.append(("色散投影 split ghost", offset(tinted(fig, (255, 80, 200), 0.35), -p.u(9), 0)))
    p.layers.append(("色散投影2 split ghost 2", offset(tinted(fig, (80, 220, 255), 0.35), p.u(9), 0)))
    p.layers.append(("荧光描边 neon edge", sticker(fig, p.u(5), NEON)))
    p.layers.append(("人物 character", fig))

    band = p.layer("底栏 band")
    ImageDraw.Draw(band).rectangle([0, p.u(FIG_BOTTOM), W, H], fill=rgba(NAVY, 245))
    ImageDraw.Draw(band).line([(0, p.u(FIG_BOTTOM)), (W, p.u(FIG_BOTTOM))], fill=rgba(NEON), width=max(1, round(p.u(3))))

    t = p.layer("文字 type")
    d = ImageDraw.Draw(t)
    size = fit_size(p, "HOTARU", "Anton-Regular.ttf", 600)
    p.text(t, (40, 1150), "HOTARU", "Anton-Regular.ttf", size, rgba(NEON))
    p.vtext(t, (920, FIG_BOTTOM + 40), "汐見蛍", "ZenKakuGothicNew-Black.ttf", 92, rgba((245, 245, 255)), gap=0.04)
    p.text(t, (44, 1215), spaced("SHIOMI"), "SpaceGrotesk[wght].ttf", 34, rgba(ICE), axes=[600], tracking=60)
    p.text(t, (44, 1290), "楽壇の天使", "ZenKakuGothicNew-Bold.ttf", 36, rgba((245, 245, 255)), tracking=200)
    rows = ["Key. & Vo.", "millsage", "03.12"]
    for i, r_ in enumerate(rows):
        x = 44 + i * 190
        d.rectangle([p.u(x), p.u(1340), p.u(x + 172), p.u(1384)], outline=rgba(ICE), width=max(1, round(p.u(1.4))))
        p.text(t, (x + 86, 1370), r_, "SpaceGrotesk[wght].ttf", 20, rgba(ICE), axes=[500], anchor="ms")
    p.text(t, (44, 1462), "BanG Dream! Our Notes  /  fan art, non-commercial", "IBMPlexMono-Regular.ttf", 11, rgba(ICE, 170), tracking=120)
    chevrons(p, d, 44, 60, 4, 18, rgba(NEON))
    p.text(t, (130, 68), spaced("millsage"), "IBMPlexMono-Medium.ttf", 16, rgba(NEON))
    for (x, y, r) in [(880, 120, 20), (930, 180, 10), (90, 380, 14)]:
        star4(p, d, x, y, r, rgba(NEON))

    scan = p.layer("扫描线 scanlines")
    ds = ImageDraw.Draw(scan)
    for y in range(0, H, max(2, round(p.u(4)))):
        ds.line([(0, y), (W, y)], fill=(0, 0, 0, 28))


def fireflies(p, n, box, seed, size=(2, 7), color=(244, 236, 170)):
    rnd = random.Random(seed)
    lay = Image.new("RGBA", (p.W, p.H), (0, 0, 0, 0))
    core = Image.new("RGBA", (p.W, p.H), (0, 0, 0, 0))
    dg, dc = ImageDraw.Draw(lay), ImageDraw.Draw(core)
    x0, y0, x1, y1 = box
    for _ in range(n):
        x, y = p.u(rnd.uniform(x0, x1)), p.u(rnd.uniform(y0, y1))
        r = p.u(rnd.uniform(*size))
        a = rnd.uniform(0.45, 1.0)
        dg.ellipse([x - r * 3, y - r * 3, x + r * 3, y + r * 3], fill=rgba(color, 120 * a))
        dc.ellipse([x - r * 0.6, y - r * 0.6, x + r * 0.6, y + r * 0.6], fill=rgba((255, 255, 235), 255 * a))
    lay = lay.filter(ImageFilter.GaussianBlur(p.u(size[1] * 1.6)))
    lay.alpha_composite(core)
    return lay


# ------------------------------------------------------------ direction D ---
# Second pass after feedback: closer to the fan "character layout" genre. The
# whole sheet is built from her own art (crops, close-ups, line art) washed into
# one lilac hue, light name type sits behind her, she is larger and lifted by a
# dark offset silhouette, and a haze ties the layers together.

D_BG = (228, 224, 242)
D_DARK = (157, 148, 210)    # duotone shadow for the background art
D_LIGHT = (244, 242, 251)
D_TYPE = (196, 188, 233)
D_DEEP = (110, 100, 180)
D_INK = (64, 60, 104)
WHITE = (255, 255, 255)


def art_panel(p, layer, src_box, box, seed=0, border=WHITE, bw=3, frame=None, lines=False, opacity=1.0, line_alpha=0.45):
    """A rectangle of her own art, duotoned into the sheet colour, with a border."""
    x0, y0, x1, y1 = box
    img = duotone(src_cover(src_box, box, p), D_DARK, D_LIGHT, 0.85)
    if lines:
        la = lineart(src_cover(src_box, box, p))
        img.alpha_composite(tinted(Image.merge("RGBA", (la, la, la, la)), D_DEEP, line_alpha))
    if opacity < 1:
        img.putalpha(int(255 * opacity))
    m = Image.new("L", (p.W, p.H))
    ImageDraw.Draw(m).rectangle([p.u(x0), p.u(y0), p.u(x1), p.u(y1)], fill=255)
    layer.alpha_composite(image_in_mask(p, img, box, m))
    d = ImageDraw.Draw(layer)
    if bw:
        d.rectangle([p.u(x0), p.u(y0), p.u(x1), p.u(y1)], outline=rgba(border), width=max(1, round(p.u(bw))))
    if frame:
        dx, dy, col = frame
        d.rectangle([p.u(x0 + dx), p.u(y0 + dy), p.u(x1 + dx), p.u(y1 + dy)], outline=rgba(col), width=max(1, round(p.u(1.4))))


def big_type(p, layer, s, size, xy, fill_, shadow, sh_off=(6, 6), rotate=0, anchor="lt", tracking=0):
    im = text_img(p, s, "Anton-Regular.ttf", size, rgba(fill_), tracking=tracking)
    sh = tinted(im, shadow[:3], shadow[3] / 255 if len(shadow) > 3 else 1)
    pad = round(p.u(max(abs(sh_off[0]), abs(sh_off[1])))) + 2
    both = Image.new("RGBA", (im.width + pad * 2, im.height + pad * 2), (0, 0, 0, 0))
    both.alpha_composite(sh, (pad + round(p.u(sh_off[0])), pad + round(p.u(sh_off[1]))))
    both.alpha_composite(im, (pad, pad))
    if rotate:
        both = both.rotate(rotate, expand=True, resample=Image.BICUBIC)
    paste_at(layer, both, xy, p, anchor)
    return both


def design_d(p, rev=0):
    W, H = p.W, p.H
    s, ox = 0.86, 640 - 1250 * 0.86
    fig_bottom = 1080 * s

    bg = p.layer("底色 background")
    bg.paste(Image.new("RGBA", (W, H), rgba(D_BG)))

    art = p.layer("背景复刻 art collage")
    art_panel(p, art, (0, 0, 1920, 1080), (-30, 70, 760, 514), frame=(14, 14, D_DEEP))       # the whole scene
    if rev < 1:
        art_panel(p, art, (1000, 40, 1520, 560), (-160, 900, 640, 1700), lines=True, bw=0)   # her face, huge
    else:
        dy = 0 if rev < 2 else 110  # rev 2: her mouth drops off the bottom edge, the eyes stay
        art_panel(p, art, (1000, 40, 1520, 560), (-160, 900 + dy, 640, 1700 + dy), lines=True, bw=4, line_alpha=0.32)
    art_panel(p, art, (1300, 120, 1760, 900), (812, 330, 1040, 980), frame=(-12, 12, WHITE))  # hair and hairpins
    wash = Image.new("RGBA", (W, H), rgba(D_BG, 70))
    art.alpha_composite(wash)

    deco = p.layer("底层装饰 back deco")
    d = ImageDraw.Draw(deco)
    d.rectangle([0, p.u(560), p.u(14), p.u(1000)], fill=rgba(D_DEEP))
    d.rectangle([p.u(780), 0, p.u(1000), p.u(16)], fill=rgba(D_DEEP))
    dotgrid(p, d, (30, 20, 250, 50), 15, 2, rgba(D_DEEP, 150))
    for i in range(30):
        y = 380 + i * 22
        d.rectangle([p.u(960), p.u(y), p.u(964), p.u(y + 8)], fill=rgba(WHITE, 220))

    typ = p.layer("大字 name type")
    big_type(p, typ, "HOTARU", fit_size(p, "HOTARU", "Anton-Regular.ttf", 990, tracking=20), (6, 66), D_TYPE, WHITE + (255,),
             sh_off=(-5, -5), tracking=20)
    big_type(p, typ, "SHIOMI", 210, (1004, 330), WHITE, D_TYPE + (255,) if rev < 1 else D_DEEP + (190,),
             sh_off=(7, 7), rotate=-90, anchor="rt")

    fig = place(p, s, ox, 0, keys_fade=(500, 620))
    p.layers.append(("错位剪影 offset silhouette", offset(tinted(fig, D_DEEP, 0.6), p.u(24), p.u(8))))
    p.layers.append(("柔光白边 soft edge", glow(sticker(fig, p.u(2), WHITE, soft=True), p.u(1.5), WHITE, 1.4)))
    p.layers.append(("人物 character", fig))

    strip = p.layer("前景横条 front strip")
    d = ImageDraw.Draw(strip)
    d.rectangle([0, p.u(fig_bottom - 30), W, p.u(fig_bottom + 54)], fill=rgba(WHITE, 150))
    d.line([(0, p.u(fig_bottom - 30)), (W, p.u(fig_bottom - 30))], fill=rgba(D_DEEP), width=max(1, round(p.u(2))))
    d.line([(0, p.u(fig_bottom + 54)), (W, p.u(fig_bottom + 54))], fill=rgba(D_DEEP), width=max(1, round(p.u(1))))
    if rev < 1:
        p.text(strip, (500, fig_bottom + 26), spaced("millsage") + "   ✦   " + spaced("Key.&Vo."), "CormorantGaramond[wght].ttf", 40,
               rgba(D_INK), axes=[500], anchor="ms")
    else:  # the star is drawn: Cormorant has no ✦ glyph
        p.text(strip, (470, fig_bottom + 26), spaced("millsage"), "CormorantGaramond[wght].ttf", 40, rgba(D_INK), axes=[500], anchor="rs")
        p.text(strip, (530, fig_bottom + 26), spaced("Key.&Vo."), "CormorantGaramond[wght].ttf", 40, rgba(D_INK), axes=[500], anchor="ls")
        star4(p, d, 500, fig_bottom + 13, 14, rgba(D_DEEP))

    panel = p.layer("弹琴特写 hands panel")
    art_panel(p, panel, (560, 560, 1000, 900), (600, 1046, 968, 1330), frame=(-12, -12, D_DEEP), bw=4)

    t = p.layer("文字与装饰 type & deco")
    d = ImageDraw.Draw(t)
    chevrons(p, d, 32, 112, 3, 18, rgba(D_DEEP))
    p.text(t, (96, 120), spaced("BanG Dream!") + "   " + spaced("Our Notes"), "CormorantGaramond[wght].ttf", 26, rgba(D_INK), axes=[600])
    d.line([(p.u(32), p.u(140)), (p.u(560), p.u(140))], fill=rgba(D_INK, 160), width=max(1, round(p.u(1))))

    # vertical: stack the glyphs, white offset behind like the big type
    col = Image.new("RGBA", (round(p.u(150)), round(p.u(400))), (0, 0, 0, 0))
    for i, c in enumerate("汐見蛍"):
        g = text_img(p, c, "DelaGothicOne-Regular.ttf", 118, rgba(D_DEEP))
        gs = tinted(g, WHITE, 1)
        col.alpha_composite(gs, (round(p.u(8)), round(p.u(i * 130 + 6))))
        col.alpha_composite(g, (round(p.u(2)), round(p.u(i * 130))))
    paste_at(t, col, (40, 1046), p)

    p.text(t, (200, 1100), "楽壇の天使", "ShipporiMincho-ExtraBold.ttf", 50, rgba(D_INK), tracking=60)
    p.text(t, (202, 1156), "Hotaru Shiomi", "CormorantGaramond-Italic[wght].ttf", 44, rgba(D_DEEP), axes=[600])
    for i in range(3):
        d.rectangle([p.u(204 + i * 20), p.u(1186), p.u(216 + i * 20), p.u(1198)], fill=rgba(D_DEEP))
    w = p.text(t, (202, 1262), "03.12", "Anton-Regular.ttf", 50, rgba(D_DEEP)) / p.k
    p.text(t, (300 if rev < 1 else 202 + w + 16, 1262), spaced("BIRTHDAY"), "CormorantGaramond[wght].ttf", 18, rgba(D_INK), axes=[600])
    p.text(t, (202, 1306), "心優しき音楽の天才。", "ShipporiMincho-Medium.ttf", 21, rgba(D_INK))
    p.text(t, (202, 1336), "芸術学院中学校 音楽科 3年", "ShipporiMincho-Regular.ttf", 16, rgba(D_INK, 220), tracking=40)
    dotgrid(p, d, (420, 1240, 560, 1290) if rev < 2 else (476, 1240, 560, 1290), 14, 2, rgba(D_DEEP, 170))
    corner_marks(p, d, (586, 1032, 982, 1344), 16, rgba(WHITE), 3)

    p.text(t, (500, 1440), spaced("SHIOMI HOTARU"), "CormorantGaramond[wght].ttf", 46,
           rgba(D_DEEP, 150), axes=[500], tracking=120, anchor="ms")
    d.line([(p.u(30), p.u(1462)), (p.u(970), p.u(1462))], fill=rgba(D_DEEP, 160), width=max(1, round(p.u(1))))
    p.text(t, (30, 1488), "fan art  ·  non-commercial", "CormorantGaramond-Italic[wght].ttf", 16, rgba(D_INK, 200), axes=[500])
    chevrons(p, d, 920, 1481, 3, 12, rgba(D_DEEP))

    for (x, y, r) in [(370, 210, 18), (880, 250, 24), (920, 300, 10), (300, 700, 12)]:
        star4(p, d, x, y, r, rgba(WHITE))
        star4(p, d, x, y, r * 0.5, rgba(D_TYPE))

    # haze: a soft copy of everything so far, like the bloom these sheets carry
    flat = p.flatten().convert("RGBA").filter(ImageFilter.GaussianBlur(p.u(5)))
    flat.putalpha(int(255 * 0.16))
    p.layers.append(("柔光 haze", flat))


DESIGNS = {"A": design_a, "B": design_b, "C": design_c, "D": design_d}


def main(argv):
    which, width, out = argv[0], int(argv[1]), argv[2]
    rev = int(argv[argv.index("--rev") + 1]) if "--rev" in argv else 0
    p = Poster(width)
    DESIGNS[which](p, rev)
    p.flatten().save(out)
    if "--psd" in argv:
        sys.path.insert(0, os.path.join(ROOT, "tools"))
        from export_psd import write_psd
        write_psd(p, argv[argv.index("--psd") + 1])


if __name__ == "__main__":
    main(sys.argv[1:])
