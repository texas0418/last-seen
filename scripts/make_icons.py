#!/usr/bin/env python3
"""Generate the Last Seen icon set: the presence line, "last seen / 6 days ago",
in white over a faded nautical chart (a bay, two islands, contour rings, depth
arcs, soundings, a dashed route, a compass). Chosen 2026-10-24 to replace the
contact-avatar glyph, which read as a system app.

Needs Pillow:  ~/.venvs/jarvis/bin/python scripts/make_icons.py
Writes assets/icon.png (1024, opaque), assets/adaptive-icon.png (1024, art
scaled to 900 so the words sit inside Android's safe zone), and
assets/splash-icon.png (512, wordmark only, transparent).
"""
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

S = 1024
ASSETS = Path(__file__).resolve().parent.parent / 'assets'
WHITE = (255, 255, 255)
DIM = (168, 174, 184)
PRESENCE = (150, 168, 154)
PIN = (208, 101, 79)
CHART_STRENGTH = 0.48


def font(size, bold=False):
    for p in ['/System/Library/Fonts/Supplemental/Avenir Next.ttc',
              '/System/Library/Fonts/HelveticaNeue.ttc',
              '/System/Library/Fonts/Supplemental/Arial.ttf']:
        try:
            return ImageFont.truetype(p, size, index=(2 if bold and p.endswith('.ttc') else 0))
        except OSError:
            continue
    return ImageFont.load_default()


def blob(cx, cy, radius, seed, n=140, k=(3, 5, 7), amp=(0.28, 0.14, 0.08)):
    random.seed(seed)
    phases = [random.random() * 6.28 for _ in k]
    pts = []
    for i in range(n):
        t = 2 * math.pi * i / n
        r = radius * (1 + sum(a * math.sin(kk * t + p) for kk, a, p in zip(k, amp, phases)))
        pts.append((cx + r * math.cos(t), cy + r * math.sin(t)))
    return pts


def scaled(pts, cx, cy, f):
    return [(cx + (x - cx) * f, cy + (y - cy) * f) for x, y in pts]


def chart(strength):
    m = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(m)
    a = lambda v: int(255 * strength * v)  # noqa: E731
    ink, sea, land = (170, 176, 186), (60, 70, 86), (96, 100, 104)
    for g in range(64, S, 160):
        d.line([(g, 0), (g, S)], fill=ink + (a(0.22),), width=2)
        d.line([(0, g), (S, g)], fill=ink + (a(0.22),), width=2)
    for i in range(9):
        r = 420 + i * 95
        d.arc((-r + 260, -r + 760, r + 260, r + 760), 200, 340, fill=sea + (a(0.55),), width=3)
    main = blob(900, 860, 520, 3, k=(2, 4, 6, 9), amp=(0.22, 0.12, 0.08, 0.04))
    d.polygon(main, fill=land + (a(0.55),), outline=ink + (a(0.95),), width=5)
    for f in (0.86, 0.72, 0.58, 0.44):
        ring = scaled(main, 900, 860, f)
        d.line(ring + [ring[0]], fill=ink + (a(0.5),), width=2)
    for cx, cy, radius, seed in [(250, 250, 120, 11), (430, 150, 70, 5)]:
        isl = blob(cx, cy, radius, seed)
        d.polygon(isl, fill=land + (a(0.55),), outline=ink + (a(0.95),), width=4)
        for f in (0.65, 0.35):
            ring = scaled(isl, cx, cy, f)
            d.line(ring + [ring[0]], fill=ink + (a(0.5),), width=2)
    route = [(60, 980), (220, 760), (360, 640), (520, 560), (640, 470), (720, 380)]
    for (x0, y0), (x1, y1) in zip(route, route[1:]):
        for s in range(0, 10, 2):
            t0, t1 = s / 10, (s + 1) / 10
            d.line([(x0 + (x1 - x0) * t0, y0 + (y1 - y0) * t0), (x0 + (x1 - x0) * t1, y0 + (y1 - y0) * t1)],
                   fill=ink + (a(0.9),), width=4)
    small = font(26)
    random.seed(2)
    for _ in range(26):
        d.text((random.randint(40, 700), random.randint(80, 980)),
               str(random.choice([4, 6, 7, 9, 11, 12, 14, 18, 22, 27])), font=small, fill=ink + (a(0.75),))
    cx, cy = 150, 560
    d.ellipse((cx - 44, cy - 44, cx + 44, cy + 44), outline=ink + (a(0.8),), width=3)
    d.line([(cx, cy - 60), (cx, cy + 60)], fill=ink + (a(0.8),), width=3)
    d.line([(cx - 60, cy), (cx + 60, cy)], fill=ink + (a(0.8),), width=3)
    d.ellipse((700 - 18, 392 - 18, 700 + 18, 392 + 18), outline=PIN + (255,), width=5)
    return m


def ground():
    im = Image.new('RGB', (S, S))
    px = im.load()
    for y in range(S):
        t = y / S
        c = tuple(int(p + (q - p) * t) for p, q in zip((30, 28, 32), (14, 13, 16)))
        for x in range(S):
            px[x, y] = c
    return im.convert('RGBA')


def words(d, scale=1.0, cx=S / 2, top=300):
    f1, f2 = font(int(190 * scale), True), font(int(112 * scale))
    w1 = d.textlength('last seen', font=f1)
    d.text((cx - w1 / 2, top), 'last seen', font=f1, fill=WHITE)
    w2 = d.textlength('6 days ago', font=f2)
    d.text((cx - w2 / 2, top + 240 * scale), '6 days ago', font=f2, fill=DIM)
    r = 26 * scale
    d.ellipse((cx - r, top - 80 * scale, cx + r, top - 80 * scale + 2 * r), fill=PRESENCE)


def main():
    im = ground()
    im.alpha_composite(chart(CHART_STRENGTH))
    band = Image.new('L', (S, S), 0)
    ImageDraw.Draw(band).rounded_rectangle((90, 270, 934, 700), radius=140, fill=150)
    band = band.filter(ImageFilter.GaussianBlur(70))
    im = Image.composite(Image.new('RGBA', (S, S), (16, 15, 18, 255)), im, band)
    words(ImageDraw.Draw(im))
    icon = im.convert('RGB')
    icon.save(ASSETS / 'icon.png')
    adaptive = ground()
    adaptive.paste(icon.resize((900, 900)), (62, 62))
    adaptive.save(ASSETS / 'adaptive-icon.png')
    splash = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    words(ImageDraw.Draw(splash), scale=0.5, cx=256, top=150)
    splash.save(ASSETS / 'splash-icon.png')
    print('wrote icon.png, adaptive-icon.png, splash-icon.png')


if __name__ == '__main__':
    main()
