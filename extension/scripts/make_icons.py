import struct
import zlib
import os

def chunk(tag, data):
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

def make_png(path, size, rgb, accent):
    width = height = size
    raw = bytearray()
    cx = cy = size / 2
    r = size * 0.38
    for y in range(height):
        raw.append(0)
        for x in range(width):
            dx, dy = x - cx, y - cy
            if dx * dx + dy * dy <= r * r:
                raw.extend(accent)
            else:
                raw.extend(rgb)
            raw.append(255)
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw), 9)
    png = sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")
    with open(path, "wb") as f:
        f.write(png)

out_dir = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
os.makedirs(out_dir, exist_ok=True)
base = (16, 24, 48)
accent = (88, 196, 220)
for size in (16, 48, 128):
    make_png(os.path.join(out_dir, f"icon{size}.png"), size, base, accent)

print("icons written to", out_dir)
