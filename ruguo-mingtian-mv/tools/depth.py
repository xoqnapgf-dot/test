"""Estimate a depth map for the cover with Depth Anything V2 (ONNX, CPU).

    python3 tools/depth.py /path/to/depth-anything-v2-base/model.onnx

Model: https://huggingface.co/onnx-community/depth-anything-v2-base (onnx/model.onnx).
Writes assets/cover-depth.png: 1024x1024 greyscale, white = near, black = far.

The network output is relative inverse depth. It is run at 518 px and also at 770 px on a
horizontally flipped copy; the two are averaged (test-time augmentation, steadier edges),
normalised with robust percentiles, and upsampled with a joint bilateral step guided by the
cover so depth edges follow the real silhouettes (the walker, the guitar neck).
"""
import os
import sys

import numpy as np
import onnxruntime as ort
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MEAN = np.array([0.485, 0.456, 0.406], np.float32)
STD = np.array([0.229, 0.224, 0.225], np.float32)


def run(sess, img, size, flip=False):
    im = img.transpose(Image.FLIP_LEFT_RIGHT) if flip else img
    im = im.resize((size, size), Image.BICUBIC)
    x = (np.asarray(im, np.float32) / 255.0 - MEAN) / STD
    x = x.transpose(2, 0, 1)[None]
    name = sess.get_inputs()[0].name
    d = sess.run(None, {name: x})[0][0]
    d = np.asarray(Image.fromarray(d.astype(np.float32)).resize((1024, 1024), Image.BICUBIC))
    return d[:, ::-1] if flip else d


def joint_bilateral(depth, guide, radius=6, sigma_s=4.0, sigma_r=0.08):
    """Edge-aware smoothing of depth, guided by the cover's luminance."""
    g = guide.astype(np.float32)
    out = np.zeros_like(depth)
    wsum = np.zeros_like(depth)
    pad = radius
    dp = np.pad(depth, pad, mode="edge")
    gp = np.pad(g, pad, mode="edge")
    H, W = depth.shape
    for dy in range(-radius, radius + 1, 2):
        for dx in range(-radius, radius + 1, 2):
            ws = np.exp(-(dx * dx + dy * dy) / (2 * sigma_s ** 2))
            gs = gp[pad + dy:pad + dy + H, pad + dx:pad + dx + W]
            ds = dp[pad + dy:pad + dy + H, pad + dx:pad + dx + W]
            w = ws * np.exp(-((gs - g) ** 2) / (2 * sigma_r ** 2))
            out += w * ds
            wsum += w
    return out / wsum


def main():
    model = sys.argv[1]
    img = Image.open(os.path.join(ROOT, "assets", "cover.jpg")).convert("RGB")
    sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
    ds = [run(sess, img, 518), run(sess, img, 518, True), run(sess, img, 770), run(sess, img, 770, True)]
    d = np.mean(ds, axis=0)
    lo, hi = np.percentile(d, 1), np.percentile(d, 99.5)
    d = np.clip((d - lo) / (hi - lo), 0, 1)
    lum = np.asarray(img.convert("L"), np.float32) / 255.0
    d = joint_bilateral(d, lum)
    d = np.clip(d, 0, 1)
    out = Image.fromarray((d * 255).round().astype(np.uint8), "L")
    out = out.filter(ImageFilter.MedianFilter(3))
    path = os.path.join(ROOT, "assets", "cover-depth.png")
    out.save(path, optimize=True)
    print("wrote", path, os.path.getsize(path), "bytes")


if __name__ == "__main__":
    main()
