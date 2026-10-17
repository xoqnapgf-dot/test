"""4x anime upscale of the source art with Real-ESRGAN x4plus_anime_6B (CPU, tiled).

usage: python3 tools/upscale.py <weights.pth> <in.jpg> <out.png>
The weights are not committed (17 MB); see README.md for where they come from.
"""
import sys

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image


class RDB(nn.Module):
    def __init__(self, nf=64, gc=32):
        super().__init__()
        self.conv1 = nn.Conv2d(nf, gc, 3, 1, 1)
        self.conv2 = nn.Conv2d(nf + gc, gc, 3, 1, 1)
        self.conv3 = nn.Conv2d(nf + 2 * gc, gc, 3, 1, 1)
        self.conv4 = nn.Conv2d(nf + 3 * gc, gc, 3, 1, 1)
        self.conv5 = nn.Conv2d(nf + 4 * gc, nf, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(0.2, True)

    def forward(self, x):
        x1 = self.lrelu(self.conv1(x))
        x2 = self.lrelu(self.conv2(torch.cat((x, x1), 1)))
        x3 = self.lrelu(self.conv3(torch.cat((x, x1, x2), 1)))
        x4 = self.lrelu(self.conv4(torch.cat((x, x1, x2, x3), 1)))
        x5 = self.conv5(torch.cat((x, x1, x2, x3, x4), 1))
        return x5 * 0.2 + x


class RRDB(nn.Module):
    def __init__(self, nf=64, gc=32):
        super().__init__()
        self.rdb1, self.rdb2, self.rdb3 = RDB(nf, gc), RDB(nf, gc), RDB(nf, gc)

    def forward(self, x):
        return self.rdb3(self.rdb2(self.rdb1(x))) * 0.2 + x


class RRDBNet(nn.Module):
    def __init__(self, nb=6, nf=64, gc=32):
        super().__init__()
        self.conv_first = nn.Conv2d(3, nf, 3, 1, 1)
        self.body = nn.Sequential(*[RRDB(nf, gc) for _ in range(nb)])
        self.conv_body = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_up1 = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_up2 = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_hr = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_last = nn.Conv2d(nf, 3, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(0.2, True)

    def forward(self, x):
        feat = self.conv_first(x)
        feat = feat + self.conv_body(self.body(feat))
        feat = self.lrelu(self.conv_up1(F.interpolate(feat, scale_factor=2, mode="nearest")))
        feat = self.lrelu(self.conv_up2(F.interpolate(feat, scale_factor=2, mode="nearest")))
        return self.conv_last(self.lrelu(self.conv_hr(feat)))


def main(weights, src, dst, tile=240, pad=16):
    net = RRDBNet()
    sd = torch.load(weights, map_location="cpu", weights_only=True)
    net.load_state_dict(sd.get("params_ema", sd.get("params", sd)))
    net.eval()
    torch.set_num_threads(4)

    img = np.asarray(Image.open(src).convert("RGB"), dtype=np.float32) / 255.0
    h, w, _ = img.shape
    x = torch.from_numpy(img).permute(2, 0, 1)[None]
    out = torch.zeros(1, 3, h * 4, w * 4)
    tiles = [(ty, tx) for ty in range(0, h, tile) for tx in range(0, w, tile)]
    with torch.no_grad():
        for i, (ty, tx) in enumerate(tiles):
            y0, x0 = max(ty - pad, 0), max(tx - pad, 0)
            y1, x1 = min(ty + tile + pad, h), min(tx + tile + pad, w)
            res = net(x[:, :, y0:y1, x0:x1])
            ey, ex = min(ty + tile, h), min(tx + tile, w)
            out[:, :, ty * 4:ey * 4, tx * 4:ex * 4] = res[
                :, :, (ty - y0) * 4:(ey - y0) * 4, (tx - x0) * 4:(ex - x0) * 4]
            print(f"tile {i + 1}/{len(tiles)}", flush=True)
    arr = (out[0].clamp(0, 1).permute(1, 2, 0).numpy() * 255 + 0.5).astype(np.uint8)
    Image.fromarray(arr).save(dst)


if __name__ == "__main__":
    main(*sys.argv[1:4])
