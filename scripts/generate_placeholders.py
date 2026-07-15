#!/usr/bin/env python3
"""Generate premium-looking placeholder product images (PNG) with no deps.

Creates a dark charcoal gradient with a thin gold frame and a centered
geometric emblem (diamond for cards, portrait rectangle for posters). Each
image gets a distinct accent hue so the seeded shop looks varied.
"""
import math
import os
import struct
import zlib

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "placeholders")
os.makedirs(OUT, exist_ok=True)

W, H = 900, 1100


def clamp(v):
    return max(0, min(255, int(v)))


def png(path, pixels):
    raw = bytearray()
    for y in range(H):
        raw.append(0)  # filter type 0
        row = pixels[y]
        for x in range(W):
            r, g, b = row[x]
            raw += bytes((clamp(r), clamp(g), clamp(b)))
    compressor = zlib.compressobj(9)
    data = compressor.compress(bytes(raw)) + compressor.flush()

    def chunk(tag, payload):
        c = tag + payload
        return struct.pack(">I", len(payload)) + c + struct.pack(
            ">I", zlib.crc32(c) & 0xFFFFFFFF
        )

    with open(path, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n")
        f.write(chunk(b"IHDR", struct.pack(">IIBBBBB", W, H, 8, 2, 0, 0, 0)))
        f.write(chunk(b"IDAT", data))
        f.write(chunk(b"IEND", b""))


def make(path, accent, kind):
    ar, ag, ab = accent
    cx, cy = W / 2, H / 2
    maxd = math.hypot(cx, cy)
    px = []
    for y in range(H):
        row = []
        for x in range(W):
            # radial gradient base (charcoal), warmer toward accent near center
            d = math.hypot(x - cx, y - cy) / maxd
            base = 26 - d * 12
            r = base + ar * 0.05 * (1 - d)
            g = base + ag * 0.05 * (1 - d)
            b = base + ab * 0.05 * (1 - d)

            # thin gold frame
            m = 60
            fr = 3
            near = (
                (m - fr <= x <= m + fr and m <= y <= H - m)
                or (W - m - fr <= x <= W - m + fr and m <= y <= H - m)
                or (m - fr <= y <= m + fr and m <= x <= W - m)
                or (H - m - fr <= y <= H - m + fr and m <= x <= W - m)
            )
            if near:
                r, g, b = 200, 162, 74

            # centered emblem
            if kind == "card":
                # diamond
                dd = abs(x - cx) / 220 + abs(y - cy) / 300
                if 0.82 <= dd <= 0.9:
                    r, g, b = ar, ag, ab
                elif dd < 0.82:
                    t = 1 - dd
                    r = r + (ar - r) * 0.18 * t
                    g = g + (ag - g) * 0.18 * t
                    b = b + (ab - b) * 0.18 * t
            else:
                # portrait rectangle outline
                rw, rh = 210, 300
                on_edge = (
                    (abs(x - cx) <= rw and abs(abs(y - cy) - rh) <= 4)
                    or (abs(y - cy) <= rh and abs(abs(x - cx) - rw) <= 4)
                )
                if on_edge:
                    r, g, b = ar, ag, ab
                elif abs(x - cx) <= rw and abs(y - cy) <= rh:
                    r += ar * 0.06
                    g += ag * 0.06
                    b += ab * 0.06

            row.append((r, g, b))
        px.append(row)
    png(path, px)
    print("wrote", os.path.basename(path))


ACCENTS = {
    "poster-1": (200, 162, 74),   # gold
    "poster-2": (176, 58, 46),    # deep red
    "poster-3": (70, 110, 150),   # steel blue
    "card-1": (200, 162, 74),     # gold
    "card-2": (120, 160, 120),    # green
    "card-3": (150, 120, 190),    # violet
}

for name, accent in ACCENTS.items():
    kind = "card" if name.startswith("card") else "poster"
    make(os.path.join(OUT, f"{name}.png"), accent, kind)

# generic fallback
make(os.path.join(OUT, "placeholder.png"), (120, 120, 120), "poster")
print("done")
