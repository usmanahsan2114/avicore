# DO NOT RUN THESE

These seven scripts regenerate pages from their own hardcoded data or from the
original Aigocy template. The live site has been hand-edited well past what they
know about, so running any of them **destroys work that nothing can rebuild**.

They were moved here on 2026-07-29 after a static review.

## Why each one is quarantined

### `build-site.mjs`
`:374` overwrites every file in its internal `pages` object; `:332` emits
`<meta http-equiv="refresh">` redirect stubs (~700 bytes) for pages it does not
model. `index.html` would drop from ~100 KB to a stub.

It cannot regenerate the three best sections on the homepage. Verified: the
strings `section-build-paths`, `section-compatibility-lab` and
`section-launch-roadmap` appear in **0** files under `tools/`.

### `restore-custom-pages-shell.mjs`
`:25` replaces the entire `<head>` with `oldHead()` from `:16`, which hardcodes:

- `maximum-scale=1` in the viewport (blocks pinch-zoom — a WCAG failure)
- `theme-color` `#EDECEC`
- a `legacy-avicore.css` link

and contains no `ld+json` and no Open Graph tags. **This script is why the site
shipped with zero structured data and zero social metadata** — it silently
strips them from every page it touches. Running it now would also undo the
surface-band stylesheet wiring.

### `restore-legacy-theme.mjs`
`:6` reads from `tmp/theme-zip/aigocy/aigocy` — the raw, unconverted template —
and `:108` writes those pages over the live ones. It reintroduces the original
red `#FD3A25` theme and the AI-agency copy.

### `finalize-site-structure.mjs`, `finalize-site-content.mjs`, `build-audience-pages.mjs`, `replace-legacy-placeholders.mjs`
Same family: they rewrite whole pages from generator data that predates the
current content. Not individually re-verified, quarantined as a precaution
because they share the same overwrite pattern.

## What to use instead

The scripts left in `tools/` are additive — they patch existing markup rather
than regenerating it, and each is idempotent:

| Script | Purpose |
|---|---|
| `apply-surface-bands.mjs` | surface band classes, viewport/theme-color, OG tags |
| `add-structured-data.mjs` | JSON-LD (skips pages that already have it) |
| `remove-fabricated-proof.mjs` | deletes the fake testimonial/award/stat blocks |
| `fix-link-graph.mjs` | repairs mis-pointed internal links |
| `fix-hero-and-copy.mjs` | hero copy + residual AI-agency copy |
| `add-product-lines.mjs` / `wire-new-products.mjs` | the two shipping product lines |
| `audit-*.mjs`, `audit-*.php` | read-only |
| `build-production-package.mjs` | read-only w.r.t. the web root; writes only into `dist/` |

## If you ever do need one

1. Take a full copy of the web root first — there is no version control in this
   directory.
2. Run it against that copy, not the live tree.
3. Diff before promoting anything.

The single most valuable fix here is putting this directory under git.
