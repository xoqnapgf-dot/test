"""Turn the ISNet masks into a clean 2x cut-out of the character and the keys she plays.

usage: python3 tools/matte.py
reads  build/mask-full.png, build/mask-crop.png, build/source-x2.png
writes build/fg-x2.png          de-spilled colours (RGB, 3840x2160)
       build/alpha-girl-x2.png  character alpha
       build/alpha-keys-x2.png  the keyboard strip under her hands (no fade)

Light hair on a light room defeats closed-form matting (it leaves a white fog
round the hair), so the network mask itself is snapped to the line art with a
guided filter and tightened. Hand-placed polygons then fix what the network
gets wrong, and the keyboard is cut as a straight strip so her hands keep the
keys they are playing.
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from pymatting import estimate_foreground_ml

X0 = 560  # the character never reaches left of this column (hands start ~600)
S = 2     # working scale over the 1920x1080 source

# Background the network calls "character", in source pixels (from gridded crops).
BG_POLYS = [
    # fallboard and keys left of the left hair lock
    [(890, 370), (962, 380), (958, 470), (950, 560), (920, 610), (890, 610)],
    # piano bench end behind her right shoulder
    [(1494, 234), (1552, 248), (1578, 290), (1580, 458), (1548, 472), (1525, 420), (1505, 380), (1492, 300)],
    # bench side and lit floor between the skirt outline, the shawl and the hair ends
    [(1381, 996), (1391, 975), (1400, 973), (1408, 974), (1412, 987), (1440, 990), (1458, 998), (1520, 1004),
     (1600, 966), (1700, 955), (1700, 1080), (1419, 1080)],
    # bench top showing between the two lowest hair tips
    [(1399, 973), (1426, 971), (1411, 982)],
]

# Gap between the left hair lock and the face: cream fallboard shows between the
# strands. Hair is lavender (blue >= red), the lit wood is cream (blue < red), so a
# chroma key separates them here (the face and shawl stay outside this zone).
CHROMA_ZONE = [(1008, 300), (1050, 300), (1056, 392), (1080, 420), (1090, 440), (1072, 452), (1072, 600), (1028, 600), (1008, 480)]
# Right of the shawl the room behind the hair ends is dark and the hair is light;
# only solid dark patches go (an opening keeps the thin dark line art of the hair).
LUMA_ZONE = [(1452, 560), (1920, 560), (1920, 1080), (1405, 1080), (1405, 960), (1450, 900)]

# Keyboard strip: back edge (where the keys meet the key slip) and front edge of the
# white keys are parallel in the source, slope -0.494. It runs on behind her, so the
# keys show through the gap by her neck as they do in the original.
SLOPE = -0.494
KEYS_BACK = (210, 870)
KEYS_FRONT = (340, 1048)
KEYS_X = (300, 1100)


def load(path):
    return np.asarray(Image.open(path), np.float64) / 255.0


def box(a, r):
    """Mean filter with radius r via integral images."""
    pad = np.pad(a, ((r + 1, r), (r + 1, r)), mode="edge")
    c = pad.cumsum(0).cumsum(1)
    s = c[2 * r + 1:, 2 * r + 1:] - c[:-2 * r - 1, 2 * r + 1:] - c[2 * r + 1:, :-2 * r - 1] + c[:-2 * r - 1, :-2 * r - 1]
    return s / (2 * r + 1) ** 2


def guided(I, p, r, eps):
    mI, mp = box(I, r), box(p, r)
    a = (box(I * p, r) - mI * mp) / (box(I * I, r) - mI * mI + eps)
    b = mp - a * mI
    return box(a, r) * I + box(b, r)


def poly_mask(polys, size, feather):
    m = Image.new("L", size)
    d = ImageDraw.Draw(m)
    for p in polys:
        d.polygon([(x * S, y * S) for x, y in p], fill=255)
    return np.asarray(m.filter(ImageFilter.GaussianBlur(feather)), np.float64) / 255


def keys_strip(size):
    w, h = size
    def edge(p, x):
        return p[1] + SLOPE * (x - p[0])
    x0, x1 = KEYS_X
    poly = [(x0, edge(KEYS_BACK, x0)), (x1, edge(KEYS_BACK, x1)),
            (x1, edge(KEYS_FRONT, x1)), (x0, edge(KEYS_FRONT, x0))]
    return poly_mask([poly], size, 1.0)


def main():
    full, crop = load("build/mask-full.png"), load("build/mask-crop.png")
    coarse = crop.copy()
    bench = (slice(0, 520), slice(1420, 1920))
    coarse[bench] = np.minimum(full[bench], crop[bench])
    coarse[:, :X0] = 0

    img = load("build/source-x2.png")
    h, w, _ = img.shape
    gray = img @ np.array([0.299, 0.587, 0.114])
    up = np.asarray(Image.fromarray((coarse * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), np.float64) / 255
    a = ((guided(gray, up, 3, 2e-3) - 0.25) / 0.5).clip(0, 1)
    a *= 1 - poly_mask(BG_POLYS, (w, h), 1.2)

    chroma = ((img[..., 2] - img[..., 0] + 0.03) / 0.06).clip(0, 1)
    zone = poly_mask([CHROMA_ZONE], (w, h), 2)
    a = a * (1 - zone) + np.minimum(a, chroma) * zone
    luma = ((gray - 0.42) / 0.2).clip(0, 1)
    zone = poly_mask([LUMA_ZONE], (w, h), 6)
    dark = Image.fromarray(((gray < 0.55) * 255).astype(np.uint8))
    solid = dark.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.MaxFilter(11)).filter(ImageFilter.GaussianBlur(1.5))
    solid = np.asarray(solid, np.float64) / 255
    a = a * (1 - zone) + a * luma * (1 - solid) * zone * (a < 0.95) + a * (1 - solid) * zone * (a >= 0.95)

    keys = keys_strip((w, h))
    both = np.maximum(a, keys)
    fg = img.copy()
    x2 = S * 300
    fg[:, x2:] = estimate_foreground_ml(img[:, x2:], both[:, x2:])

    Image.fromarray((fg * 255 + 0.5).astype(np.uint8)).save("build/fg-x2.png")
    Image.fromarray((a * 255 + 0.5).astype(np.uint8)).save("build/alpha-girl-x2.png")
    Image.fromarray((keys * 255 + 0.5).astype(np.uint8)).save("build/alpha-keys-x2.png")


if __name__ == "__main__":
    main()
