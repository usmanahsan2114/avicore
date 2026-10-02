# AviCore Page Build Kit

Canonical, **already-branded** chunks extracted from the finished `index.html`.
Every AviCore page must reuse these verbatim so the header, footer, mobile menu
and script order stay identical site-wide. This folder is a **build reference
only** — it is not served as pages (the `_` prefix keeps it out of the way).

## Files
| File | What it is | How to use |
|------|-----------|------------|
| `head-template.html` | `<head>` with `{{PLACEHOLDERS}}` | Copy in, replace TITLE / DESCRIPTION / KEYWORDS / SLUG, add per-page JSON-LD |
| `header.html` | Desktop header + mega-nav | Paste verbatim. Set `.active` on the current top-level `.item-link` |
| `mobile-menu.html` | Off-canvas mobile menu | Paste verbatim |
| `footer.html` | Footer + disclaimer + legal links | Paste verbatim |
| `scripts.html` | Bottom `<script>` block (jQuery→GSAP→main.js→avicore.js) | Paste verbatim right before `</body>` |

## Page skeleton (assemble in this order)
```
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-US" lang="en-US">
{{head-template.html — filled in}}
<body class="counter-scroll">
    <a href="#main-content" class="skip-link">Skip to content</a>
    <canvas class="cursor-trail" id="trail" style="display: none;"></canvas>
    <button id="goTop"><span class="border-progress"></span><span class="ic-wrap"><span class="icon icon-long-arrow-alt-up-solid"></span></span></button>
    <main id="wrapper">
        {{header.html}}
        {{PAGE HERO — see below, add id="main-content"}}
        {{PAGE SECTIONS — reuse template section markup, aviation content}}
        {{footer.html}}
    </main>
    {{mobile-menu.html}}
    <!-- Left Bar + Setting Color panels: copy verbatim from index.html lines ~"Left Bar" to "/Setting Color" -->
    {{scripts.html}}
</body>
</html>
```

## Inner-page hero (page title) — use on every non-home page
```html
<!-- Hero Banner -->
<div class="section-hero v1" id="main-content">
    <div class="hero-image"></div>
    <div class="container">
        <div class="content-wrap text-center">
            <div class="title text-display-2 effectFade fadeRotateX">
                <span class="title1 fw-semibold text-gradient-1">{{LINE 1}}</span>
                <br>
                <div class="title2 d-flex gap-20 justify-content-center flex-wrap">
                    <span class="fw-semibold text-gradient-1">{{LINE 2}}</span>
                </div>
            </div>
            <p class="text effectFade fadeUp">{{One-line intro}}</p>
        </div>
    </div>
</div>
<!-- /Hero Banner -->
```

## Reusable components (defined in assets/css/avicore.css)
- **Product/feature card** (reuse the home "features-item" or the services card markup). Add chips:
  ```html
  <div class="chips">
    <span class="chip chip-brand">USB HID</span>
    <span class="chip">MSFS</span><span class="chip">P3D</span><span class="chip">X-Plane</span>
  </div>
  ```
- **Answer box** (AEO "In short" block, put near top of product/solution pages):
  ```html
  <div class="answer-box"><p><strong>What is X?</strong> One-paragraph answer.</p></div>
  ```
- **Trust bar** under a hero: `<div class="trust-bar">…chips…</div>`

## Rules (from avicore-research.md)
1. **Reuse existing template sections first**; only build new markup when nothing fits.
2. Keep Bootstrap/GSAP/Swiper/Slick markup + the script order intact — never remove template scripts.
3. **Every page:** unique `<title>` + meta description + canonical + OG tags; one `<h1>`-level hero; Organization JSON-LD.
4. **Product pages:** include the simulation-use disclaimer (already in the footer; repeat near product specs) and add `Product` JSON-LD.
5. **Careful wording:** "G1000-style", "IDU-680-style", "simulation/training use only". Never "FAA/EASA approved", "certified", "real aircraft part", "official OEM".
6. Add `loading="lazy"` + `width`/`height` to non-hero images; meaningful `alt` (or `alt=""` if decorative). Mark placeholder assets with `<!-- TODO: … -->`.
7. Primary CTA on every important page → `quote.html` ("Request a Quote").
