"""Normalize AviCore product cutouts and build responsive WebP variants."""

from __future__ import annotations

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PRODUCT_DIR = ROOT / "assets" / "images" / "products"
PRODUCTS = (
    "custom-joystick",
    "usb-flight-controls",
    "printed-cockpit-parts",
    "avionics-bezel",
    "joystick-configurator",
    "simulator-panel",
    "ios-console",
    "soft-gauges",
)
MASTER_SIZE = 1200
RESPONSIVE_SIZES = (480, 800, 1200)
SUBJECT_FILL = 0.88


def normalize_product(name: str) -> dict[str, object]:
    source = PRODUCT_DIR / f"{name}.png"
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        raise ValueError(f"{source.name} contains no visible pixels")

    corners = (
        alpha.getpixel((0, 0)),
        alpha.getpixel((image.width - 1, 0)),
        alpha.getpixel((0, image.height - 1)),
        alpha.getpixel((image.width - 1, image.height - 1)),
    )
    if any(value > 8 for value in corners):
        raise ValueError(f"{source.name} has non-transparent corners: {corners}")

    subject = image.crop(bbox)
    max_subject = round(MASTER_SIZE * SUBJECT_FILL)
    scale = min(max_subject / subject.width, max_subject / subject.height, 1.0)
    target = (
        max(1, round(subject.width * scale)),
        max(1, round(subject.height * scale)),
    )
    subject = subject.resize(target, Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (MASTER_SIZE, MASTER_SIZE), (0, 0, 0, 0))
    position = (
        (MASTER_SIZE - subject.width) // 2,
        (MASTER_SIZE - subject.height) // 2,
    )
    canvas.alpha_composite(subject, position)
    canvas.save(source, optimize=True)

    for size in RESPONSIVE_SIZES:
        variant = canvas if size == MASTER_SIZE else canvas.resize(
            (size, size), Image.Resampling.LANCZOS
        )
        variant.save(
            PRODUCT_DIR / f"{name}-{size}.webp",
            "WEBP",
            quality=88,
            method=6,
            exact=True,
        )

    visible = sum(1 for value in canvas.getchannel("A").getdata() if value > 8)
    return {
        "name": name,
        "master": f"{MASTER_SIZE}x{MASTER_SIZE}",
        "visible_percent": round(visible / (MASTER_SIZE * MASTER_SIZE) * 100, 1),
        "variants": [f"{size}w" for size in RESPONSIVE_SIZES],
    }


if __name__ == "__main__":
    for product_name in PRODUCTS:
        print(normalize_product(product_name))
