from pathlib import Path
from html.parser import HTMLParser
from PIL import Image
import re

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.glob("*.html"))

class ImageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.tags = []
        self.images = []
    def handle_starttag(self, tag, attrs):
        if tag.lower() == "img":
            self.images.append((self.get_starttag_text(), attrs))

def local_size(src):
    if not src or re.match(r"^(?:https?:|data:|//)", src):
        return None
    src = src.split("?", 1)[0].split("#", 1)[0]
    file = (ROOT / src.replace("/", "\\")).resolve()
    try:
        file.relative_to(ROOT.resolve())
    except ValueError:
        return None
    if not file.exists():
        return None
    try:
        with Image.open(file) as im:
            return im.size
    except Exception:
        if file.suffix.lower() == ".svg":
            text = file.read_text(encoding="utf-8", errors="ignore")[:4000]
            m = re.search(r'<svg[^>]*?(?:width="([0-9.]+)"[^>]*height="([0-9.]+)"|viewBox="[-0-9. ]+ ([0-9.]+) ([0-9.]+)")', text, re.I)
            if m:
                return (int(float(m.group(1) or m.group(3))), int(float(m.group(2) or m.group(4))))
        return None

def fallback_alt(src):
    stem = Path(src.split("?", 1)[0]).stem.replace("-", " ").replace("_", " ")
    return stem.title() or "AviCore simulation visual"

for file in HTML_FILES:
    html = file.read_text(encoding="utf-8", errors="replace")
    parser = ImageParser()
    parser.feed(html)
    for original, attrs in reversed(parser.images):
        data = dict(attrs)
        src = data.get("src")
        size = local_size(src)
        replacement = original
        if size:
            if re.search(r"\bwidth\s*=", replacement, re.I):
                replacement = re.sub(r'\bwidth\s*=\s*(["\']).*?\1', f'width="{size[0]}"', replacement, count=1, flags=re.I)
            else:
                replacement = replacement[:-1] + f' width="{size[0]}">'
            if re.search(r"\bheight\s*=", replacement, re.I):
                replacement = re.sub(r'\bheight\s*=\s*(["\']).*?\1', f'height="{size[1]}"', replacement, count=1, flags=re.I)
            else:
                replacement = replacement[:-1] + f' height="{size[1]}">'
        if not re.search(r"\balt\s*=", replacement, re.I) or re.search(r'\balt\s*=\s*(["\'])\s*\1', replacement, re.I):
            alt = fallback_alt(src).replace('"', "&quot;")
            if re.search(r"\balt\s*=", replacement, re.I):
                replacement = re.sub(r'\balt\s*=\s*(["\']).*?\1', f'alt="{alt}"', replacement, count=1, flags=re.I)
            else:
                replacement = replacement[:-1] + f' alt="{alt}">'
        html = html.replace(original, replacement, 1)
    html = re.sub(
        r'<div class="box-navigation"[^>]*>',
        r'<div class="box-navigation" role="navigation" aria-label="Primary navigation">',
        html,
        count=1,
    )
    if "<nav" not in html.lower():
        if '<a class="skip-link" href="#main-content">Skip to content</a>' in html:
            html = html.replace('<a class="skip-link" href="#main-content">Skip to content</a>', '<a class="skip-link" href="#main-content">Skip to content</a><nav class="sr-only" aria-label="Primary navigation"><a href="index.html">Home</a></nav>', 1)
        else:
            html = re.sub(r'(<main id="wrapper">)', r'\1<nav class="sr-only" aria-label="Primary navigation"><a href="index.html">Home</a></nav>', html, count=1)
    if '<h1' not in html.lower() and '<main id="wrapper">' in html:
        title = re.search(r"<title>(.*?)</title>", html, re.I | re.S)
        text = re.sub(r"\s+", " ", title.group(1)).strip() if title else "AviCore Simulation Technologies"
        html = html.replace('<main id="wrapper">', f'<main id="wrapper"><h1 class="sr-only">{text}</h1>', 1)
    html = html.replace('hello@youraiagency.com', 'info@fsdcpak.com').replace('aigocy@gmail.com', 'info@fsdcpak.com').replace('mail:info@fsdcpak.com', 'mailto:info@fsdcpak.com')
    html = html.replace('href="#"', 'href="index.html"')
    file.write_text(html, encoding="utf-8")

print(f"Normalized local image dimensions, alt text and navigation landmarks in {len(HTML_FILES)} pages.")
