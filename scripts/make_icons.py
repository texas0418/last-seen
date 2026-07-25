#!/usr/bin/env python3
"""Generate Last Seen app icons (no deps — hand-rolled PNG writer).

Brand motif ("Status", chosen from scripts/icon_options.py explorations):
an OLED-dark tile, the contact-avatar glyph, and a presence dot gone red —
"last seen 6 days ago," made literal. Outputs: assets/icon.png (1024,
opaque), assets/adaptive-icon.png (1024, alpha, safe-zone scaled),
assets/splash-icon.png (512, alpha).
"""

import math
import struct
import zlib
from pathlib import Path

BG_TOP = (13, 17, 24)
BG_BOT = (7, 10, 14)
PANEL = (20, 24, 31)
STROKE = (147, 168, 154)  # ghost green — Quinn's color
DOTS = (110, 168, 216)  # BrineOS blue
BADGE = (208, 101, 79)
WHITE = (238, 244, 250)


def rounded_rect_sdf(x, y, cx, cy, hw, hh, r):
    qx = abs(x - cx) - (hw - r)
    qy = abs(y - cy) - (hh - r)
    ox, oy = max(qx, 0.0), max(qy, 0.0)
    return math.hypot(ox, oy) + min(max(qx, qy), 0.0) - r


def circle_sdf(x, y, cx, cy, r):
    return math.hypot(x - cx, y - cy) - r


def in_tri(x, y, a, b, c):
    def s(p1, p2):
        return (x - p2[0]) * (p1[1] - p2[1]) - (p1[0] - p2[0]) * (y - p2[1])

    d1, d2, d3 = s(a, b), s(b, c), s(c, a)
    neg = d1 < 0 or d2 < 0 or d3 < 0
    pos = d1 > 0 or d2 > 0 or d3 > 0
    return not (neg and pos)


def mix(c1, c2, t):
    return tuple(c1[i] + (c2[i] - c1[i]) * t for i in range(3))


def aa(sdf):
    """1 inside, 0 outside, ~2px smooth edge."""
    return max(0.0, min(1.0, 0.5 - sdf / 2.0))


def render(size, transparent, scale=1.0):
    px = bytearray()
    s = size / 1024.0 * scale
    off = (1024 * (1 - scale)) / 2 * (size / 1024.0)

    def T(v):
        return v * s + off

    # geometry (in 1024 space) — the "Status" mark
    glyph_fill = mix(PANEL, DOTS, 0.55)

    for j in range(size):
        for i in range(size):
            x, y = i + 0.5, j + 0.5
            if transparent:
                base, alpha = (0, 0, 0), 0.0
            else:
                t = j / size
                base, alpha = mix(BG_TOP, BG_BOT, t), 1.0

            # avatar circle: ghost stroke, panel fill
            d_av = circle_sdf(x, y, T(512), T(512), 330 * s)
            edge = aa(abs(d_av) - 7.5 * s)
            if edge > 0:
                base, alpha = mix(base, STROKE, edge), max(alpha, edge)
            fill = aa(d_av + 15 * s)
            if fill > 0:
                base, alpha = mix(base, PANEL, fill), max(alpha, fill)
            # the contact glyph (head + shoulders), clipped inside the avatar
            if d_av < -12 * s:
                head = aa(circle_sdf(x, y, T(512), T(415), 118 * s))
                body = aa(circle_sdf(x, y, T(512), T(815), 252 * s))
                v = max(head, body)
                if v > 0:
                    base, alpha = mix(base, glyph_fill, v), max(alpha, v)
            # cut ring separates the dot from the avatar edge (erases to
            # transparent on the adaptive/splash variants)
            cut = aa(circle_sdf(x, y, T(762), T(762), 138 * s))
            if cut > 0:
                base = mix(base, BG_BOT, cut)
                if transparent:
                    alpha = alpha * (1 - cut)
            # the presence dot, gone red
            v = aa(circle_sdf(x, y, T(762), T(762), 100 * s))
            if v > 0:
                base, alpha = mix(base, BADGE, v), max(alpha, v)

            r_, g_, b_ = (int(round(c)) for c in base)
            px.extend((r_, g_, b_, int(round(alpha * 255))))
    return bytes(px)


def write_png(path, size, rgba):
    def chunk(tag, data):
        c = tag + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c))

    raw = b''.join(b'\x00' + rgba[y * size * 4:(y + 1) * size * 4] for y in range(size))
    png = (b'\x89PNG\r\n\x1a\n'
           + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0))
           + chunk(b'IDAT', zlib.compress(raw, 9))
           + chunk(b'IEND', b''))
    Path(path).write_bytes(png)
    print(f'{path} ({len(png)} bytes)')


if __name__ == '__main__':
    root = Path(__file__).resolve().parent.parent / 'assets'
    root.mkdir(exist_ok=True)
    write_png(root / 'icon.png', 1024, render(1024, transparent=False))
    write_png(root / 'adaptive-icon.png', 1024, render(1024, transparent=True, scale=0.72))
    write_png(root / 'splash-icon.png', 512, render(512, transparent=True, scale=0.9))
