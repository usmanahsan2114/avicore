/**
 * AviCore — restore each product page's own transparent cutout, fix the last
 * duplicate visuals, and give every page its own og:image.
 *
 * Run:  node tools/fix-product-cutouts.mjs
 *
 * dedupe-images.mjs kept a product cutout only when the page already pointed
 * at assets/images/products/. The product pages actually referenced hashed
 * copies under assets/images/unique/, so the keep-rule never matched and the
 * cutouts were replaced with stock photography. This puts them back.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const CUTOUT = {
  'usb-flight-controls.html': ['usb-flight-controls', 'Illustrative USB flight control set with yoke, cyclic and throttle quadrant'],
  'custom-joystick.html':     ['custom-joystick', 'Illustrative custom simulator joystick with configurable grip and base'],
  'printed-parts.html':       ['printed-cockpit-parts', 'Illustrative set of 3D-printed cockpit knobs, guards and brackets'],
  'avionics-bezels.html':     ['avionics-bezel', 'Illustrative glass-cockpit avionics display bezel with soft keys'],
  'cockpit-panels.html':      ['simulator-panel', 'Illustrative simulator switch and annunciator panel with USB cable'],
  'ios-software.html':        ['ios-console', 'Illustrative instructor operating station console'],
  'soft-gauges.html':         ['soft-gauges', 'Illustrative soft-gauge display with attitude, tapes and round instruments'],
  'configure-joystick.html':  ['joystick-configurator', 'Illustrative joystick configuration interface'],
};

/* ---- 1. put the cutout back in each product page's .product-stage -------- */
let fixed = 0;
for (const [page, [base, alt]] of Object.entries(CUTOUT)) {
  const full = path.join(ROOT, page);
  if (!fs.existsSync(full)) continue;
  let html = fs.readFileSync(full, 'utf8');
  const before = html;

  const img = `<img src="assets/images/products/${base}-1200.webp" srcset="assets/images/products/${base}-480.webp 480w, assets/images/products/${base}-800.webp 800w, assets/images/products/${base}-1200.webp 1200w" sizes="(max-width: 700px) 92vw, 560px" width="1200" height="1200" loading="eager" decoding="async" fetchpriority="high" alt="${alt}">`;

  // replace whatever <img> currently sits inside the hero .product-stage
  html = html.replace(
    /(<div class="product-stage"[^>]*>\s*<picture>\s*)<img\b[^>]*>/,
    `$1${img}`
  );

  if (html !== before) { fs.writeFileSync(full, html, 'utf8'); fixed++; console.log(`  ${page}: cutout restored (${base})`); }
  else console.log(`  ${page}: no .product-stage <img> matched`);
}

/* ---- 2. last duplicate visuals: same base name, different extension ------ */
const DUPE_FIX = {
  // page -> [oldSrcFragment, newSrc]
  'service-single.html':      ['home-cockpit-build', 'assets/images/stock/flight-deck-photo-1436491865332-.jpg'],
  'simulator-builders.html':  ['printed-parts-workshop', 'assets/images/stock/workbench-tools-photo-1581092160562-.jpg'],
  'usb-flight-controls.html': ['training-bench', 'assets/images/stock/aviation-headset-photo-1583991576885-.jpg'],
};

const stockAvailable = fs.readdirSync(path.join(ROOT, 'assets', 'images', 'stock'));
function anyUnused(usedSet) {
  for (const f of stockAvailable) {
    const p = `assets/images/stock/${f}`;
    if (!usedSet.has(p)) return p;
  }
  return null;
}

// recompute what is in use so the replacements stay unique
const inUse = new Set();
for (const p of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const h = fs.readFileSync(path.join(ROOT, p), 'utf8');
  for (const m of h.matchAll(/src="(assets\/images\/[^"]+)"/g)) inUse.add(m[1]);
}

for (const [page, [frag]] of Object.entries(DUPE_FIX)) {
  const full = path.join(ROOT, page);
  if (!fs.existsSync(full)) continue;
  let html = fs.readFileSync(full, 'utf8');
  const before = html;
  const replacement = anyUnused(inUse);
  if (!replacement) { console.log('  no unused stock left for ' + page); continue; }

  html = html.replace(new RegExp(`src="assets/images/[^"]*${frag}[^"]*"`), `src="${replacement}"`);
  if (html !== before) {
    inUse.add(replacement);
    fs.writeFileSync(full, html, 'utf8');
    console.log(`  ${page}: ${frag} -> ${replacement.split('/').pop()}`);
  }
}

/* ---- 3. per-page og:image so social cards are not all identical ---------- */
const SITE = 'https://www.fsdcpak.com/avicore/';
let og = 0;
for (const p of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const full = path.join(ROOT, p);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;

  // first real content image on the page becomes its social card
  const first = (html.match(/<main[\s\S]*?<img[^>]*\ssrc="(assets\/images\/[^"]+)"/) || [])[1];
  if (!first) continue;

  html = html.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${SITE}${first}$2`);
  html = html.replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${SITE}${first}$2`);

  if (html !== before) { fs.writeFileSync(full, html, 'utf8'); og++; }
}
console.log(`\n${fixed} cutouts restored, og:image set per page on ${og} pages.`);
