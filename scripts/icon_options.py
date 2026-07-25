#!/usr/bin/env python3
"""Icon explorations for LAST SEEN — five alternates to the shipping mark.

Same ground and palette as make_icons.py so the options compare fairly.
Outputs 1024px PNGs to the directory given as argv[1] (default: ./icon-options).

  a-status    contact avatar, offline dot         — "last seen 6 days ago"
  b-seen      double read-receipt check           — the message was SEEN
  c-pin       map pin with an empty center        — last seen HERE; no one there
  d-envelope  the padded envelope, postmarked     — how every case begins
  e-dark      signal bars, tallest one hollow     — the phone went dark
"""

import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from make_icons import (  # noqa: E402
    BADGE, BG_BOT, BG_TOP, DOTS, PANEL, STROKE,
    aa, circle_sdf, in_tri, mix, rounded_rect_sdf, write_png,
)

DIM = (107, 117, 131)  # textDim — postmarks, secondary strokes
FILL_BLUE = mix(PANEL, DOTS, 0.55)


def seg_sdf(x, y, ax, ay, bx, by, w):
    """Distance to segment minus half-width -> thick round-capped line."""
    px, py = x - ax, y - ay
    dx, dy = bx - ax, by - ay
    h = max(0.0, min(1.0, (px * dx + py * dy) / (dx * dx + dy * dy)))
    return math.hypot(px - dx * h, py - dy * h) - w


def paint(base, alpha, color, cov):
    if cov <= 0:
        return base, alpha
    return mix(base, color, cov), max(alpha, cov)


def bg_at(j, size):
    return mix(BG_TOP, BG_BOT, j / size)


def render(size, shapes):
    """shapes: list of (color, coverage_fn(x, y))  painted in order."""
    px = bytearray()
    for j in range(size):
        for i in range(size):
            x, y = (i + 0.5) * 1024 / size, (j + 0.5) * 1024 / size
            base, alpha = bg_at(j, size), 1.0
            for color, cov_fn in shapes:
                base, alpha = paint(base, alpha, color, cov_fn(x, y))
            px.extend((*(int(round(c)) for c in base), 255))
    return bytes(px)


def outlined(outer_fn, inset, fill, stroke):
    """A filled shape with a stroke: sdf-based outer edge + inner fill."""
    return [
        (stroke, lambda x, y: aa(outer_fn(x, y))),
        (fill, lambda x, y: aa(outer_fn(x, y) + inset)),
    ]


# ——— a. status: contact avatar, offline dot ———
def option_a():
    avatar = lambda x, y: circle_sdf(x, y, 512, 512, 330)
    def glyph(x, y):
        if avatar(x, y) > -12:
            return 0.0
        head = aa(circle_sdf(x, y, 512, 415, 118))
        body = aa(circle_sdf(x, y, 512, 815, 252))
        return max(head, body)
    return [
        *outlined(avatar, 15, PANEL, STROKE),
        (FILL_BLUE, glyph),
        (BG_BOT, lambda x, y: aa(circle_sdf(x, y, 762, 762, 138))),  # cut ring
        (BADGE, lambda x, y: aa(circle_sdf(x, y, 762, 762, 100))),
    ]


# ——— b. seen: double read-receipt check ———
def option_b():
    def check(pts, w):
        (a, b, c) = pts
        return lambda x, y: max(
            aa(seg_sdf(x, y, *a, *b, w)), aa(seg_sdf(x, y, *b, *c, w)),
        )
    back = check([(218, 500), (364, 646), (612, 320)], 54)
    front = check([(412, 560), (558, 706), (806, 380)], 54)
    return [(FILL_BLUE, back), (STROKE, front)]


# ——— c. pin: map pin, empty center ———
def option_c():
    tri_o = [(310, 580), (714, 580), (512, 872)]
    tri_i = [(338, 566), (686, 566), (512, 838)]
    # union coverage: circle head + triangle tail
    outer = lambda x, y: max(aa(circle_sdf(x, y, 512, 460, 244)), 1.0 if in_tri(x, y, *tri_o) else 0.0)
    inner = lambda x, y: max(aa(circle_sdf(x, y, 512, 460, 228)), 1.0 if in_tri(x, y, *tri_i) else 0.0)
    def ground(x, y):  # faint ellipse where she is not
        d = math.hypot(x - 512, (y - 912) * 4.2) - 150
        return aa(abs(d) - 9) * 0.6
    return [
        (DIM, ground),
        (STROKE, outer),
        (PANEL, inner),
        (BG_BOT, lambda x, y: aa(circle_sdf(x, y, 512, 460, 106))),
        (DIM, lambda x, y: aa(abs(circle_sdf(x, y, 512, 460, 106)) - 7)),
    ]


# ——— d. envelope: how every case begins ———
def option_d():
    body = lambda x, y: rounded_rect_sdf(x, y, 512, 576, 300, 198, 42)
    def flap(x, y):
        l = aa(seg_sdf(x, y, 226, 396, 512, 610, 13))
        r = aa(seg_sdf(x, y, 798, 396, 512, 610, 13))
        return max(l, r) if body(x, y) < 0 else 0.0
    def postmark(x, y):
        ring = aa(abs(circle_sdf(x, y, 748, 368, 118)) - 9)
        bars = max(
            aa(seg_sdf(x, y, 706, 320, 916, 320, 8)),
            aa(seg_sdf(x, y, 748, 368, 958, 368, 8)),
            aa(seg_sdf(x, y, 706, 416, 916, 416, 8)),
        )
        return max(ring, bars) * 0.85  # smudged, like the rain got it
    return [*outlined(body, 15, PANEL, STROKE), (STROKE, flap), (DIM, postmark)]


# ——— e. dark: signal bars, the tallest hollow ———
def option_e():
    bars = [(316, 128), (448, 226), (580, 336), (712, 464)]
    shapes = []
    for cx, h in bars[:3]:
        shapes.append((
            FILL_BLUE,
            (lambda cx, h: lambda x, y: aa(
                rounded_rect_sdf(x, y, cx, 744 - h / 2, 46, h / 2, 22)
            ))(cx, h),
        ))
    cx, h = bars[3]
    hollow = lambda x, y: aa(abs(rounded_rect_sdf(x, y, cx, 744 - h / 2, 46, h / 2, 22)) - 8)
    shapes.append((STROKE, hollow))
    shapes.append((BADGE, lambda x, y: aa(circle_sdf(x, y, 712, 210, 48))))
    return shapes


OPTIONS = {
    'a-status': option_a,
    'b-seen': option_b,
    'c-pin': option_c,
    'd-envelope': option_d,
    'e-dark': option_e,
}

if __name__ == '__main__':
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('icon-options')
    out.mkdir(parents=True, exist_ok=True)
    for name, fn in OPTIONS.items():
        write_png(out / f'{name}.png', 1024, render(1024, fn()))
