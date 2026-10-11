#!/usr/bin/env python3
"""Create the three PNG icons used by the Infinite Monkey Lab PWA.

Requires Pillow: python3 -m pip install Pillow
Run from any directory: python3 tools/make_icons.py
"""
from pathlib import Path

from PIL import Image, ImageDraw

OUTPUT_DIR = Path(__file__).resolve().parent.parent
SIZES = (180, 192, 512)
BACKGROUND = "#10131e"
PANEL = "#171b2b"
PANEL_EDGE = "#292d43"

# A fixed, hand-chosen pixel field keeps the icon reproducible. Each nonzero
# digit selects a color from the same 3-3-2 palette used by the experiment.
GRID = (
    "0000012000",
    "0001234500",
    "0012456300",
    "0123564200",
    "1236542100",
    "2345623100",
    "0234512000",
    "0024631000",
    "0002310000",
    "0000000000",
)
COLOR_INDICES = (0x00, 0x4F, 0xB6, 0x1C, 0xE3, 0xCF, 0xF8, 0xE0)


def palette_rgb(index: int) -> tuple[int, int, int]:
    red = (index >> 5) & 7
    green = (index >> 2) & 7
    blue = index & 3
    return (
        round(red * 255 / 7),
        round(green * 255 / 7),
        round(blue * 255 / 3),
    )


def make_icon(size: int) -> Image.Image:
    image = Image.new("RGB", (size, size), BACKGROUND)
    draw = ImageDraw.Draw(image)

    inset = round(size * 0.075)
    panel_radius = round(size * 0.19)
    draw.rounded_rectangle(
        (inset, inset, size - inset - 1, size - inset - 1),
        radius=panel_radius,
        fill=PANEL,
        outline=PANEL_EDGE,
        width=max(1, round(size * 0.006)),
    )

    rows = len(GRID)
    columns = len(GRID[0])
    unit = round(size * 0.066)
    gap = max(2, round(size * 0.014))
    field_width = columns * unit + (columns - 1) * gap
    field_height = rows * unit + (rows - 1) * gap
    origin_x = (size - field_width) // 2
    origin_y = (size - field_height) // 2
    radius = max(1, round(unit * 0.12))

    for y, row in enumerate(GRID):
        for x, digit in enumerate(row):
            value = int(digit)
            if value == 0:
                continue
            x0 = origin_x + x * (unit + gap)
            y0 = origin_y + y * (unit + gap)
            x1 = x0 + unit - 1
            y1 = y0 + unit - 1
            draw.rounded_rectangle(
                (x0, y0, x1, y1),
                radius=radius,
                fill=palette_rgb(COLOR_INDICES[value]),
            )

    return image


def main() -> None:
    for size in SIZES:
        output = OUTPUT_DIR / f"icon-{size}.png"
        make_icon(size).save(output, format="PNG", optimize=True)
        print(f"Wrote {output} ({size}×{size})")


if __name__ == "__main__":
    main()
