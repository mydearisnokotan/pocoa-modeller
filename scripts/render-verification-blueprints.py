import json
from pathlib import Path
from PIL import Image, ImageDraw

base = Path("/home/ubuntu/pocoa-modeller/verification-results")
payload = json.loads((base / "project-1-design.json").read_text(encoding="utf-8"))
two_d = payload["blueprint2d"]
three_d = payload["blueprint3d"]

def rgb(hex_color, fallback=(148, 163, 184)):
    value = (hex_color or "").lstrip("#")
    if len(value) != 6:
        return fallback
    return tuple(int(value[index:index + 2], 16) for index in (0, 2, 4))

def lighten(color, amount):
    return tuple(min(255, channel + amount) for channel in color)

def darken(color, amount):
    return tuple(max(0, channel - amount) for channel in color)

# 2D blueprint
cells = two_d["cells"]
max_x = max(cell["x"] for cell in cells)
max_y = max(cell["y"] for cell in cells)
tile = 26
margin = 90
image_2d = Image.new("RGB", ((max_x + 1) * tile + margin * 2, (max_y + 1) * tile + margin * 2), "#090d20")
draw_2d = ImageDraw.Draw(image_2d)
draw_2d.text((margin, 30), "POCOA MODELLER / 2D BLUEPRINT", fill="#c8ff00")
for cell in cells:
    x = margin + cell["x"] * tile
    y = margin + cell["y"] * tile
    fill = rgb(cell.get("colorHex"))
    draw_2d.rectangle((x, y, x + tile - 1, y + tile - 1), fill=fill, outline="#121b35", width=1)
for item in two_d.get("legend", []):
    pass
image_2d.save(base / "project-1-2d.png")

# Isometric 3D preview
voxels = three_d["voxels"]
scale = 14
origin_x = 440
origin_y = 120
image_3d = Image.new("RGB", (880, 720), "#090d20")
draw_3d = ImageDraw.Draw(image_3d)
draw_3d.text((40, 35), "POCOA MODELLER / 3D BUILD PREVIEW", fill="#ff3dba")
for voxel in sorted(voxels, key=lambda item: (item.get("x", 0) + item.get("y", 0) + item.get("z", 0), item.get("z", 0))):
    x, y, z = voxel.get("x", 0), voxel.get("y", 0), voxel.get("z", 0)
    sx = origin_x + (x - y) * scale
    sy = origin_y + (x + y) * (scale // 2) - z * scale
    color = rgb(voxel.get("colorHex"))
    top = [(sx, sy), (sx + scale, sy + scale // 2), (sx, sy + scale), (sx - scale, sy + scale // 2)]
    left = [(sx - scale, sy + scale // 2), (sx, sy + scale), (sx, sy + scale * 2), (sx - scale, sy + scale + scale // 2)]
    right = [(sx, sy + scale), (sx + scale, sy + scale // 2), (sx + scale, sy + scale + scale // 2), (sx, sy + scale * 2)]
    draw_3d.polygon(top, fill=lighten(color, 26), outline="#18213e")
    draw_3d.polygon(left, fill=darken(color, 42), outline="#18213e")
    draw_3d.polygon(right, fill=darken(color, 20), outline="#18213e")
draw_3d.text((40, 670), "rotate / zoom available in the web preview", fill="#29f4ff")
image_3d.save(base / "project-1-3d.png")
