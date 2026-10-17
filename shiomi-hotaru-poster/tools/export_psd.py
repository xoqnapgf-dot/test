"""Write a Poster's named RGBA layers to a layered PSD (bottom-to-top order).

Called by src/poster.py --psd <out.psd>. Each layer is cropped to its visible
bounds and RLE-compressed. Text is rasterised (no editable type layers).
"""
from psd_tools import PSDImage
from psd_tools.api.layers import PixelLayer
from psd_tools.constants import Compression, Tag


def write_psd(poster, path):
    psd = PSDImage.new("RGB", (poster.W, poster.H), color=(255, 255, 255))
    for name, im in poster.layers:
        box = im.getchannel("A").getbbox()
        if not box:
            continue
        ascii_name = "".join(c for c in name if ord(c) < 128).strip() or "layer"
        layer = PixelLayer.frompil(im.crop(box), psd, ascii_name, box[1], box[0], Compression.RLE)
        # the legacy Pascal name is Mac Roman only; Photoshop shows the Unicode block
        layer._record.tagged_blocks.set_data(Tag.UNICODE_LAYER_NAME, name)
        psd.append(layer)
    psd.save(path)


def check(path):
    psd = PSDImage.open(path)
    return [(layer.name, layer.bbox) for layer in psd]
