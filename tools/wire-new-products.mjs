/**
 * AviCore — wire the two shipping lines into nav, catalogue and sitemaps.
 *
 * Run:  node tools/wire-new-products.mjs
 *
 *   - Custom Airport & Scenery Design  (airport-scenery-design.html, new)
 *   - IOS Instructor Operating Station (ios-software.html, renamed + shipping)
 *
 * Touches the desktop nav and mobile menu on every page, the products.html
 * catalogue grid and its filter counter, sitemap.xml, sitemap.html and the
 * _partials/ source of truth.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const NAV_ITEM_DESKTOP =
  '<li class="sub-menu-item"><a href="airport-scenery-design.html" class="item-link link1">Airport &amp; Scenery Design</a></li>';

const NAV_ITEM_MOBILE =
  '<li><a href="airport-scenery-design.html" class="sub-nav-link text-white">Airport &amp; Scenery Design</a></li>';

/* ---- 1. desktop nav + mobile menu on every page + the partials ----------- */
const targets = [
  ...fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).map(f => path.join(ROOT, f)),
  path.join(ROOT, '_partials', 'header.html'),
  path.join(ROOT, '_partials', 'mobile-menu.html'),
].filter(p => fs.existsSync(p));

let navCount = 0;
for (const full of targets) {
  let html = fs.readFileSync(full, 'utf8');
  const before = html;

  // rename the IOS entry wherever it appears in a nav list
  html = html.replace(
    /(<a href="ios-software\.html"[^>]*>)IOS Software(<\/a>)/g,
    '$1IOS &amp; Instructor Station$2'
  );

  // insert the scenery entry after Soft Gauges (last product in each menu)
  if (!html.includes('airport-scenery-design.html')) {
    html = html.replace(
      /(<li class="sub-menu-item"><a href="soft-gauges\.html" class="item-link link1">Soft Gauges<\/a><\/li>)/,
      `$1${NAV_ITEM_DESKTOP}`
    );
    html = html.replace(
      /(<li><a href="soft-gauges\.html" class="sub-nav-link text-white">Soft Gauges<\/a><\/li>)/,
      `$1${NAV_ITEM_MOBILE}`
    );
  }

  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    navCount++;
  }
}
console.log(`nav updated on ${navCount} files`);

/* ---- 2. products.html catalogue ------------------------------------------ */
const prodPath = path.join(ROOT, 'products.html');
let prod = fs.readFileSync(prodPath, 'utf8');

// promote the IOS card
prod = prod
  .replace(
    /(<article class="product-card" data-category="software">\s*)<span class="product-status-badge">Coming Soon<\/span>([\s\S]*?<h3>)IOS Software(<\/h3>)/,
    '$1<span class="product-status-badge is-available">Available now</span>$2IOS &amp; Instructor Station$3'
  );

// the IOS card's chip row
prod = prod.replace(
  /(<h3>IOS &amp; Instructor Station<\/h3>[\s\S]*?<div class="chip-row">[\s\S]*?)<span class="chip">Coming Soon<\/span>/,
  '$1<span class="chip chip-accent">Available now</span>'
);

const SCENERY_CARD = `<article class="product-card" data-category="software">
<span class="product-status-badge is-available">Available now</span>
<div class="product-media">
<picture>
    <img src="assets/images/generated/avionics-panel-project.webp" width="1200" height="1200" loading="lazy" decoding="async" alt="Custom simulator airport scenery rendered from chart and imagery data">
  </picture>
<span class="image-note">Illustrative configuration</span>
</div>
<div class="product-body">
<div class="card-kicker">Software / Scenery</div>
<h3>Custom Airport &amp; Scenery Design</h3>
<p>Aerodromes, terrain and lighting modelled from published charts and imagery for MSFS, X-Plane and Prepar3D.</p>
<div class="chip-row">
<span class="chip chip-accent">Available now</span>
<span class="chip">MSFS / X-Plane / P3D</span>
<span class="chip">Any ICAO</span>
</div>
<a class="text-link" href="airport-scenery-design.html">View product line</a>
</div>
</article>`;

if (!prod.includes('airport-scenery-design.html')) {
  // append after the final product card in the grid
  const lastClose = prod.lastIndexOf('</article>');
  prod = prod.slice(0, lastClose + 10) + SCENERY_CARD + prod.slice(lastClose + 10);
}

// the catalogue advertises its own count
prod = prod.replace(/Seven focused product lines/g, 'Eight focused product lines');
prod = prod.replace(/7 product lines shown/g, '8 product lines shown');
prod = prod.replace(/>7<\/(strong|span)>/g, '>8</$1>');

fs.writeFileSync(prodPath, prod, 'utf8');
console.log('products.html catalogue updated');

/* ---- 3. sitemap.xml ------------------------------------------------------ */
const smPath = path.join(ROOT, 'sitemap.xml');
let sm = fs.readFileSync(smPath, 'utf8');
if (!sm.includes('airport-scenery-design.html')) {
  sm = sm.replace(
    /(\s*)<\/urlset>/,
    '$1  <url><loc>https://www.fsdcpak.com/avicore/airport-scenery-design.html</loc></url>$1</urlset>'
  );
  fs.writeFileSync(smPath, sm, 'utf8');
  console.log('sitemap.xml updated');
}

/* ---- 4. sitemap.html ----------------------------------------------------- */
const shPath = path.join(ROOT, 'sitemap.html');
let sh = fs.readFileSync(shPath, 'utf8');
const shBefore = sh;
sh = sh.replace(/(<a href="ios-software\.html"[^>]*>)IOS Software(<\/a>)/g, '$1IOS &amp; Instructor Station$2');
if (!sh.includes('airport-scenery-design.html')) {
  sh = sh.replace(
    /(<li><a href="soft-gauges\.html"[^>]*>Soft Gauges<\/a><\/li>)/,
    '$1<li><a href="airport-scenery-design.html">Custom Airport &amp; Scenery Design</a></li>'
  );
}
if (sh !== shBefore) {
  fs.writeFileSync(shPath, sh, 'utf8');
  console.log('sitemap.html updated');
}

console.log('\nDone.');
