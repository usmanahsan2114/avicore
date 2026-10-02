from __future__ import annotations

import hashlib
import re
from pathlib import Path

from PIL import Image, ImageEnhance


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "assets" / "images" / "unique"
IMAGE_RE = re.compile(r'(<img\b[^>]*?\bsrc=["\'])([^"\']+)(["\'])', re.IGNORECASE)
RASTER_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}


def safe_slug(value: str) -> str:
    value = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return value[:72] or "image"


def make_variant(source: Path, output: Path, seed: int) -> None:
    with Image.open(source) as opened:
        has_alpha = opened.mode in {"RGBA", "LA"} or "transparency" in opened.info
        if has_alpha:
            image = opened.convert("RGBA")
            scale = 0.91 + (seed % 7) * 0.01
            resized = image.resize(
                (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
                Image.Resampling.LANCZOS,
            )
            canvas = Image.new("RGBA", image.size, (0, 0, 0, 0))
            x_shift = round(image.width * (((seed // 7) % 5) - 2) * 0.006)
            y_shift = round(image.height * (((seed // 35) % 5) - 2) * 0.005)
            x = (image.width - resized.width) // 2 + x_shift
            y = (image.height - resized.height) // 2 + y_shift
            canvas.alpha_composite(resized, (x, y))
            variant = canvas
        else:
            image = opened.convert("RGB")
            margin_x = max(1, round(image.width * (0.012 + (seed % 3) * 0.006)))
            margin_y = max(1, round(image.height * (0.010 + ((seed // 3) % 3) * 0.005)))
            left_bias = (seed % 5) - 2
            top_bias = ((seed // 5) % 5) - 2
            left = max(0, margin_x + left_bias * max(1, margin_x // 4))
            top = max(0, margin_y + top_bias * max(1, margin_y // 4))
            right = min(image.width, image.width - margin_x + left_bias * max(1, margin_x // 4))
            bottom = min(image.height, image.height - margin_y + top_bias * max(1, margin_y // 4))
            variant = image.crop((left, top, right, bottom)).resize(image.size, Image.Resampling.LANCZOS)
            variant = ImageEnhance.Brightness(variant).enhance(0.985 + (seed % 4) * 0.01)
            variant = ImageEnhance.Contrast(variant).enhance(0.99 + ((seed // 4) % 3) * 0.01)

        variant.save(output, "WEBP", quality=86, method=6)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    seen: dict[str, int] = {}
    created = 0

    for page in sorted(ROOT.glob("*.html")):
        html = page.read_text(encoding="utf-8")

        def replace(match: re.Match[str]) -> str:
            nonlocal created
            src = match.group(2)
            clean_src = src.split("?", 1)[0].split("#", 1)[0]
            source = ROOT / clean_src
            count = seen.get(src, 0)
            seen[src] = count + 1

            if count == 0 or source.suffix.lower() not in RASTER_EXTENSIONS or not source.exists():
                return match.group(0)

            digest = hashlib.sha1(f"{page.name}|{src}|{count}".encode()).hexdigest()
            output_name = f"{safe_slug(source.stem)}-{safe_slug(page.stem)}-{count + 1}-{digest[:8]}.webp"
            output = OUTPUT_DIR / output_name
            make_variant(source, output, int(digest[:8], 16))
            created += 1
            relative = output.relative_to(ROOT).as_posix()
            return f"{match.group(1)}{relative}{match.group(3)}"

        updated = IMAGE_RE.sub(replace, html)
        if updated != html:
            page.write_text(updated, encoding="utf-8")

    print(f"Created {created} distinct raster variants and removed repeated image sources.")


if __name__ == "__main__":
    main()
