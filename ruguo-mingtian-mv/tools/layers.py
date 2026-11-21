"""Split the cover into two parallax layers: the walker, and the scene behind him.

    python3 tools/layers.py

Reads  assets/cover.jpg, assets/cover-depth.png (tools/depth.py)
Writes assets/walker-mask.png  soft alpha of the walker (+ guitar, backpack)
       assets/plate.jpg        the cover with the walker removed (inpainted)
       assets/plate-depth.png  depth of the plate (walker removed, white = near)
       assets/walker.jpg       the walker's colours, bled outwards past his outline
       tools/layers.json       walker depth and bounding box, used by build_images.py
       tools/layers_check.jpg  a contact sheet to eyeball the result

The walker is found from depth (he stands well in front of the road behind him) and the
edges are refined with GrabCut on colour, so the alpha follows hair, guitar neck and hands.
The plate only has to hold up where the camera moves reveal it (a few percent of the walker's
width), so a diffusion-style inpaint is enough; it is done coarse-to-fine to avoid smears.
"""
import json
import os

import cv2
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
A = lambda *p: os.path.join(ROOT, "assets", *p)


def main():
    img = cv2.imread(A("cover.jpg"))
    d = cv2.imread(A("cover-depth.png"), cv2.IMREAD_GRAYSCALE).astype(np.float32) / 255.0
    H, W = d.shape
    yy, xx = np.mgrid[0:H, 0:W]

    # background depth per row, measured away from the walker's columns
    side = (xx < 0.40 * W) | (xx > 0.78 * W)
    rowbg = np.array([np.median(d[y][side[y]]) for y in range(H)], np.float32)[:, None]
    cand = ((d - rowbg) > 0.16) & (yy < 0.935 * H) & (xx > 0.36 * W) & (xx < 0.80 * W) & (yy > 0.12 * H)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(cand.astype(np.uint8), 8)
    seed = lab[int(0.50 * H), int(0.58 * W)]
    fg0 = (lab == seed).astype(np.uint8)
    # the shoes stand on the road at the road's own depth, so depth alone misses them:
    # extend the seed straight down under the legs as "probably walker" for GrabCut
    legs = np.zeros_like(fg0)
    cols = np.nonzero(fg0[int(0.80 * H)])[0]
    x0, x1 = int(cols.min()) - 6, int(cols.max()) + 6
    legs[int(0.78 * H):int(0.925 * H), x0:x1] = 1

    # GrabCut refinement on colour
    gc = np.full((H, W), cv2.GC_BGD, np.uint8)
    near = cv2.dilate(fg0, np.ones((31, 31), np.uint8))
    near[int(0.76 * H):int(0.95 * H), x0 - 24:x1 + 24] = 1
    gc[near > 0] = cv2.GC_PR_BGD
    gc[fg0 > 0] = cv2.GC_PR_FGD
    gc[(legs > 0) & (fg0 == 0)] = cv2.GC_PR_FGD
    near[legs > 0] = 1
    core = cv2.erode(fg0, np.ones((15, 15), np.uint8))
    gc[core > 0] = cv2.GC_FGD
    bgm = np.zeros((1, 65), np.float64)
    fgm = np.zeros((1, 65), np.float64)
    cv2.grabCut(img, gc, None, bgm, fgm, 6, cv2.GC_INIT_WITH_MASK)
    fg = ((gc == cv2.GC_FGD) | (gc == cv2.GC_PR_FGD)).astype(np.uint8)
    # keep the main component, fill small holes
    n, lab, stats, _ = cv2.connectedComponentsWithStats(fg, 8)
    big = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    fg = (lab == big).astype(np.uint8)
    inv = 1 - fg
    n2, lab2, st2, _ = cv2.connectedComponentsWithStats(inv, 4)
    for i in range(1, n2):
        if st2[i, cv2.CC_STAT_AREA] < 400:
            fg[lab2 == i] = 1
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))

    # soft alpha: slight feather; let the feet melt into the road (contact, no hard cut)
    # pull the edge in by a pixel (the outermost pixels carry background colour) and feather
    # smooth the contour itself first: GrabCut's outline has 1-2 px stair steps that show
    # when the camera magnifies the artwork 3-4x
    fg = (cv2.GaussianBlur(fg.astype(np.float32), (0, 0), 2.2) > 0.5).astype(np.uint8)
    fg_in = cv2.erode(fg, np.ones((3, 3), np.uint8))
    alpha = cv2.GaussianBlur(fg_in.astype(np.float32), (0, 0), 1.3)
    cv2.imwrite(A("walker-mask.png"), (alpha * 255).round().astype(np.uint8))

    # plate: remove the walker. The scene behind him is made of horizontal bands (horizon,
    # ridges, cloud sea, road), and camera moves only ever reveal a narrow strip along his
    # outline, so each row of the hole is filled by blending the colours just left and right
    # of it. That keeps every band continuous; a light vertical smoothing and matched grain
    # stop it reading as streaks. (Texture-synthesis inpainting was tried: ShiftMap copied
    # the sun into the hole and FSR left colour blocks.)
    # only the walker and a thin ring around him are replaced: gaps between his arm and body
    # keep the real background from the artwork
    hole = cv2.dilate(fg, np.ones((11, 11), np.uint8))
    hs = cv2.resize(hole, (W // 4, H // 4), interpolation=cv2.INTER_NEAREST)
    src = cv2.GaussianBlur(img, (0, 0), 1.0).astype(np.float32)
    fill = img.astype(np.float32).copy()
    for y in range(H):
        row = hole[y]
        if not row.any():
            continue
        x = 0
        while x < W:
            if row[x]:
                x0 = x
                while x < W and row[x]:
                    x += 1
                x1 = x  # hole is [x0, x1)
                # sample a few pixels away from the hole: the pixels right at its edge still
                # carry some of the walker's colour and would leave a dark ring
                l = src[y, max(0, x0 - 14):max(1, x0 - 5)].mean(0) if x0 > 5 else None
                r = src[y, min(W - 1, x1 + 5):min(W, x1 + 14)].mean(0) if x1 < W - 5 else None
                if l is None: l = r
                if r is None: r = l
                u = (np.arange(x0, x1) - x0 + 0.5) / max(1, x1 - x0)
                u = u * u * (3 - 2 * u)
                fill[y, x0:x1] = l[None] * (1 - u[:, None]) + r[None] * u[:, None]
            else:
                x += 1
    sm = cv2.GaussianBlur(fill, (0, 0), sigmaX=0.1, sigmaY=4.0)
    fill[hole > 0] = sm[hole > 0]
    rng = np.random.default_rng(3)
    grain = rng.normal(0, 5.0, (H, W, 1)).astype(np.float32)
    fill[hole > 0] += grain[hole > 0]
    plate = np.clip(fill, 0, 255).astype(np.uint8)
    cv2.imwrite(A("plate.jpg"), plate, [cv2.IMWRITE_JPEG_QUALITY, 90])

    # plate depth: replace the walker by the surrounding road / scene depth. The depth
    # network smears his depth a few pixels past his outline, so a wide ring is replaced too;
    # any step left along his old outline would make the per-pixel parallax flip there and
    # draw a seam in the background.
    d8 = (d * 255).astype(np.uint8)
    dhole = cv2.dilate(fg, np.ones((31, 31), np.uint8))
    ds = cv2.resize(d8, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
    dhs = cv2.resize(dhole, (W // 4, H // 4), interpolation=cv2.INTER_NEAREST)
    ds = cv2.inpaint(ds, dhs, 12, cv2.INPAINT_NS)
    dup = cv2.resize(ds, (W, H), interpolation=cv2.INTER_CUBIC)
    pd = d8.copy()
    pd[dhole > 0] = dup[dhole > 0]
    soft = cv2.GaussianBlur(pd, (0, 0), 6.0)
    ring = cv2.dilate(fg, np.ones((61, 61), np.uint8)) > 0
    pd[ring] = soft[ring]
    pd = cv2.GaussianBlur(pd, (0, 0), 1.5)
    cv2.imwrite(A("plate-depth.png"), pd)

    # walker colour: the artwork inside his outline, and outside it his own edge colours
    # bled outwards. The layer's soft edge then carries only walker colour; with the raw
    # artwork it carried the sky that was next to him, which shows as a pale ghost outline
    # once parallax moves the background away.
    known = cv2.erode(fg, np.ones((3, 3), np.uint8)).astype(np.float32)
    acc = img.astype(np.float32) * known[..., None]
    wsum = known.copy()
    bled = img.astype(np.float32) * known[..., None]
    have = known.copy()
    for sigma in (1.5, 3, 6, 12, 24):
        num = cv2.GaussianBlur(acc, (0, 0), sigma)
        den = cv2.GaussianBlur(wsum, (0, 0), sigma)[..., None]
        est = num / np.maximum(den, 1e-6)
        fillm = (have < 0.5) & (den[..., 0] > 1e-3)
        bled[fillm] = est[fillm]
        have[fillm] = 1.0
    bled[have < 0.5] = img.astype(np.float32)[have < 0.5]
    cv2.imwrite(A("walker.jpg"), np.clip(bled, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 90])

    ys, xs = np.nonzero(fg)
    info = {
        "walkerDepth": float(np.median(d[core > 0])),
        "bbox": [float(xs.min() / W), float(ys.min() / H), float(xs.max() / W), float(ys.max() / H)],
        "feetY": float(ys.max() / H),
    }
    json.dump(info, open(os.path.join(HERE, "layers.json"), "w"), indent=1)
    print(info)

    # contact sheet
    a3 = cv2.cvtColor((alpha * 255).astype(np.uint8), cv2.COLOR_GRAY2BGR)
    comp = (img.astype(np.float32) * alpha[..., None] + np.array([60, 200, 60], np.float32) * (1 - alpha[..., None])).astype(np.uint8)
    sheet = np.concatenate([np.concatenate([img, comp], 1), np.concatenate([plate, cv2.cvtColor(pd, cv2.COLOR_GRAY2BGR)], 1)], 0)
    cv2.imwrite(os.path.join(HERE, "layers_check.jpg"), cv2.resize(sheet, (1024, 1024)), [cv2.IMWRITE_JPEG_QUALITY, 85])


if __name__ == "__main__":
    main()
