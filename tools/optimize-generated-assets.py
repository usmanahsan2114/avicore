from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "images" / "generated"


def main() -> None:
    for source in sorted(SOURCE_DIR.glob("*.png")):
        with Image.open(source) as image:
            image = image.convert("RGB")
            if image.width > 1600:
                height = round(image.height * 1600 / image.width)
                image = image.resize((1600, height), Image.Resampling.LANCZOS)
            output = source.with_suffix(".webp")
            image.save(output, "WEBP", quality=86, method=6)
            print(f"{output.name}: {image.width}x{image.height}")


if __name__ == "__main__":
    main()
