"""Coarse character mask with the anime-seg ISNet model (skytnt/anime-seg, isnetis.onnx).

usage: python3 tools/segment.py <isnetis.onnx> <in.jpg> <out_mask.png> [x0 y0 x1 y1]
The optional box crops the image first so the 1024px network input spends its
resolution on the character instead of the empty room.
"""
import sys

import numpy as np
import onnxruntime as ort
from PIL import Image


def run(sess, rgb):
    h, w, _ = rgb.shape
    s = max(h, w)
    pad = np.zeros((s, s, 3), np.float32)
    py, px = (s - h) // 2, (s - w) // 2
    pad[py:py + h, px:px + w] = rgb
    inp = np.asarray(Image.fromarray((pad * 255).astype(np.uint8)).resize((1024, 1024), Image.BICUBIC),
                     np.float32) / 255.0
    m = sess.run(None, {"img": inp.transpose(2, 0, 1)[None]})[0][0, 0]
    m = np.asarray(Image.fromarray((m * 255).clip(0, 255).astype(np.uint8)).resize((s, s), Image.BICUBIC))
    return m[py:py + h, px:px + w]


def main(model, src, dst, *box):
    sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
    img = np.asarray(Image.open(src).convert("RGB"), np.float32) / 255.0
    out = np.zeros(img.shape[:2], np.uint8)
    x0, y0, x1, y1 = map(int, box) if box else (0, 0, img.shape[1], img.shape[0])
    out[y0:y1, x0:x1] = run(sess, img[y0:y1, x0:x1])
    Image.fromarray(out).save(dst)


if __name__ == "__main__":
    main(*sys.argv[1:])
