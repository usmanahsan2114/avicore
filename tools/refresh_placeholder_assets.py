from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS = ROOT / "assets" / "images" / "products"

mapping = {
    "assets/images/section/service-1.jpg": "usb-flight-controls.png",
    "assets/images/section/service-2.jpg": "custom-joystick.png",
    "assets/images/section/service-3.jpg": "simulator-panel.png",
    "assets/images/section/service-4.jpg": "ios-console.png",
    "assets/images/section/service-5.jpg": "printed-cockpit-parts.png",
    "assets/images/section/service-6.jpg": "avionics-bezel.png",
    "assets/images/section/service-7.jpg": "soft-gauges.png",
    "assets/images/section/service-8.jpg": "ios-console.png",
    "assets/images/section/service-single-1.jpg": "printed-cockpit-parts.png",
    "assets/images/section/service-single-2.jpg": "avionics-bezel.png",
    "assets/images/section/service-single-3.jpg": "simulator-panel.png",
    "assets/images/section/service-single-4.jpg": "soft-gauges.png",
    "assets/images/section/work-single-1.jpg": "usb-flight-controls.png",
    "assets/images/section/work-single-2.jpg": "simulator-panel.png",
    "assets/images/section/work-single-3.jpg": "avionics-bezel.png",
    "assets/images/section/work-single-4.jpg": "ios-console.png",
    "assets/images/section/quotes-1.jpg": "custom-joystick.png",
    "assets/images/section/tes-1.jpg": "usb-flight-controls.png",
    "assets/images/section/tes-2.jpg": "avionics-bezel.png",
    "assets/images/section/tes-3.jpg": "soft-gauges.png",
    "assets/images/team/team-1.jpg": "custom-joystick.png",
    "assets/images/team/team-2.jpg": "usb-flight-controls.png",
    "assets/images/team/team-3.jpg": "printed-cockpit-parts.png",
    "assets/images/team/team-4.jpg": "avionics-bezel.png",
    "assets/images/team/team-5.jpg": "ios-console.png",
    "assets/images/item/earth.png": "ios-console.png",
}

def backdrop(w, h):
    im = Image.new("RGB", (w, h))
    px = im.load()
    for y in range(h):
        for x in range(w):
            t = y / max(1, h - 1)
            glow = max(0.0, 1.0 - (((x - w * .55) / (w * .75)) ** 2 + ((y - h * .40) / (h * .85)) ** 2))
            px[x, y] = (int(7 + 7 * glow), int(15 + 22 * glow), int(26 + 32 * glow + 8 * (1 - t)))
    draw = ImageDraw.Draw(im, "RGBA")
    step = max(32, min(w, h) // 12)
    for x in range(0, w, step): draw.line((x, 0, x, h), fill=(42, 198, 248, 18), width=1)
    for y in range(0, h, step): draw.line((0, y, w, y), fill=(42, 198, 248, 18), width=1)
    return im

for relative, product_name in mapping.items():
    target = ROOT / relative
    product = PRODUCTS / product_name
    if not target.exists() or not product.exists():
        continue
    with Image.open(target) as old:
        w, h = old.size
    with Image.open(product).convert("RGBA") as subject:
        stage = backdrop(w, h)
        max_w, max_h = int(w * .82), int(h * .78)
        scale = min(max_w / subject.width, max_h / subject.height)
        cutout = subject.resize((max(1, int(subject.width * scale)), max(1, int(subject.height * scale))), Image.Resampling.LANCZOS)
        shadow = Image.new("RGBA", cutout.size, (0, 0, 0, 0))
        alpha = cutout.getchannel("A").filter(ImageFilter.GaussianBlur(max(4, int(min(w, h) * .018))))
        shadow.paste((0, 0, 0, 170), (int(w * .01), int(h * .03)), alpha)
        pos = ((w - cutout.width) // 2, (h - cutout.height) // 2)
        stage.paste(shadow, (pos[0] + int(w * .01), pos[1] + int(h * .03)), shadow)
        stage.paste(cutout, pos, cutout)
        stage.save(target, quality=90, optimize=True)

print(f"Refreshed {len(mapping)} former flat-blue section assets with aviation product composites.")
