/**
 * AviCore — apply the surface band system + head/meta fixes across all pages.
 *
 * Run:  node tools/apply-surface-bands.mjs
 *
 * What it does, per page:
 *  1. Swaps the legacy-avicore.css link for avicore-surfaces.css, and adds
 *     avicore-surfaces.css to the template pages that never loaded it.
 *  2. Tags every top-level section with .surface-dark / .surface-light so the
 *     page reads as alternating bands. Heroes are always dark.
 *  3. Removes `maximum-scale=1` from the viewport (blocked pinch-zoom) and
 *     re-points theme-color at the dark shell.
 *  4. Adds Open Graph + Twitter card tags (the site had none).
 *  5. Points "Back to top" at #top instead of index.html.
 *  6. Gives .product-stage a data-status so the launch badge is per-product
 *     rather than a hardcoded "Coming Soon" in CSS.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE_URL = 'https://www.fsdcpak.com/avicore/';   // build rewrites to avicore.fsdcpak.com
const OG_IMAGE = 'assets/images/products/usb-flight-controls-1200.webp';

const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));

// Pages that ship as a real product line rather than "Coming Soon".
const AVAILABLE = new Set(['ios-software.html', 'airport-scenery-design.html']);

// Per-page social copy. Falls back to the page's own <title>/description.
const PAGE_TITLES = {};

let changed = 0;
const report = [];

for (const file of files) {
  const full = path.join(ROOT, file);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;
  const notes = [];

  /* ---- 1. stylesheet wiring -------------------------------------------- */
  const surfaceLink = '<link rel="stylesheet" href="assets/css/avicore-surfaces.css">';
  if (html.includes('legacy-avicore.css')) {
    html = html.replace(
      /[ \t]*<link rel="stylesheet" href="assets\/css\/legacy-avicore\.css">\n?/,
      ''
    );
    notes.push('dropped legacy-avicore.css');
  }
  if (!html.includes('avicore-surfaces.css')) {
    // insert after the last stylesheet link in <head>
    const lastCss = html.lastIndexOf('<link rel="stylesheet"');
    if (lastCss !== -1) {
      const lineEnd = html.indexOf('>', lastCss) + 1;
      const indent = (html.slice(0, lastCss).match(/\n([ \t]*)$/) || [, '    '])[1];
      html = html.slice(0, lineEnd) + '\n' + indent + surfaceLink + html.slice(lineEnd);
      notes.push('added avicore-surfaces.css');
    }
  }

  /* ---- 2. viewport + theme-color --------------------------------------- */
  if (html.includes('maximum-scale=1')) {
    html = html.replace(
      /<meta name="viewport" content="[^"]*">/,
      '<meta name="viewport" content="width=device-width, initial-scale=1">'
    );
    notes.push('viewport: removed maximum-scale');
  }
  if (html.includes('content="#EDECEC"')) {
    html = html.replace(/<meta name="theme-color" content="#EDECEC">/, '<meta name="theme-color" content="#0B1219">');
    notes.push('theme-color -> #0B1219');
  }

  /* ---- 3. Open Graph / Twitter ----------------------------------------- */
  if (!html.includes('property="og:')) {
    const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, 'AviCore Simulation Technologies'])[1]
      .replace(/\s+/g, ' ').trim();
    const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1];
    const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [, SITE_URL])[1];
    const og = [
      `<meta property="og:type" content="website">`,
      `<meta property="og:site_name" content="AviCore Simulation Technologies">`,
      `<meta property="og:title" content="${escapeAttr(title)}">`,
      `<meta property="og:description" content="${escapeAttr(desc)}">`,
      `<meta property="og:url" content="${canonical}">`,
      `<meta property="og:image" content="${SITE_URL}${OG_IMAGE}">`,
      `<meta property="og:image:alt" content="AviCore custom USB flight controls for simulation use">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${escapeAttr(title)}">`,
      `<meta name="twitter:description" content="${escapeAttr(desc)}">`,
      `<meta name="twitter:image" content="${SITE_URL}${OG_IMAGE}">`,
    ].map(l => '    ' + l).join('\n');
    html = html.replace('</head>', og + '\n</head>');
    notes.push('added OG + Twitter tags');
  }

  /* ---- 4. surface bands ------------------------------------------------ */
  const banded = applyBands(html);
  if (banded.count) {
    html = banded.html;
    notes.push(`banded ${banded.count} sections (${banded.pattern})`);
  }

  /* ---- 5. back to top -------------------------------------------------- */
  if (html.includes('href="index.html" class="action-go-top')) {
    html = html.replace(/href="index\.html"(\s+class="action-go-top)/g, 'href="#top"$1');
    notes.push('back-to-top -> #top');
  }
  // give the anchor a target
  if (html.includes('href="#top"') && !html.includes('id="top"')) {
    html = html.replace(/<body([^>]*)>/, '<body$1 id="top">');
  }

  /* ---- 6. product launch badge ----------------------------------------- */
  if (html.includes('class="product-stage"')) {
    const status = AVAILABLE.has(file) ? 'Available' : 'Coming Soon';
    html = html.replace(/class="product-stage"(?! data-status)/g, `class="product-stage" data-status="${status}"`);
    notes.push(`product-stage data-status="${status}"`);
  }

  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    changed++;
    report.push(`  ${file}\n      ${notes.join('\n      ')}`);
  }
}

console.log(`Updated ${changed}/${files.length} pages\n`);
console.log(report.join('\n'));

/* ========================================================================== */

function escapeAttr(s) {
  return String(s).replace(/&(?!\w+;|#\d+;)/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/**
 * Tag top-level sections with alternating surface classes.
 * Heroes are always dark; the rest alternate light/dark from there.
 */
function applyBands(html) {
  let count = 0;
  const isHero = cls => /\b(section-hero|detail-hero|hero)\b/.test(cls);

  // Class names that merely LOOK like sections but are inner elements or
  // modifiers. Banding these paints a stray dark box behind a heading.
  const NOT_A_BAND = /\b(section-heading|section-intro|section-sm|section-tight-top|section-title|section-sub|section-label|section-inner|section-content)\b/;

  // Storefront markup: <section class="...">
  // Template markup:   <div class="section-xxx ...">
  const pattern = /<(section|div)\s+class="([^"]*)"/g;
  let idx = 0;             // band counter, only advances for real bands
  let sawHero = false;

  const out = html.replace(pattern, (match, tag, cls) => {
    // already tagged
    if (/\bsurface-(dark|light)\b/.test(cls)) return match;

    // a band is a top-level wrapper, never an inner heading block
    const bare = cls.trim();
    const isSectionEl =
      (tag === 'section' && /\b(section|detail-hero|hero)\b/.test(cls) && !NOT_A_BAND.test(bare)) ||
      (tag === 'div' && /\bsection-[a-z]/.test(cls) && !NOT_A_BAND.test(bare));

    if (!isSectionEl) return match;

    let surface;
    if (isHero(cls)) {
      surface = 'surface-dark';       // heroes sit on cockpit imagery
      sawHero = true;
      idx = 0;                        // bands start counting after the hero
    } else {
      surface = idx % 2 === 0 ? 'surface-light' : 'surface-dark';
      idx++;
    }
    count++;
    return `<${tag} class="${cls} ${surface}"`;
  });

  return { html: out, count, pattern: sawHero ? 'hero-dark, then alternating' : 'alternating' };
}
