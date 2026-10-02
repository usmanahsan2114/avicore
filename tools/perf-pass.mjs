/**
 * AviCore — performance pass.
 *
 * Run:  node tools/perf-pass.mjs
 *
 * Three measured problems:
 *   1. ~908 KB of render-blocking JS on every page (16 files, no defer/async).
 *   2. 8 product <img> still point at 1 MB PNGs even though 480/800/1200 WebP
 *      sets were generated for each — 0 of 172 images used srcset.
 *   3. 24 MB of generated PNGs are referenced by nothing (WebP twins are used).
 *      Moved aside rather than deleted so the change is reversible.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

/* ========================================================================== */
/* 1. defer the JS                                                            */
/* ========================================================================== */
/* jQuery plugins register against $ at parse time and main.js expects the DOM,
   but `defer` preserves execution ORDER and runs everything after parsing, so
   the existing sequence still holds. GSAP/ScrollTrigger self-initialise on
   DOMContentLoaded. Nothing here uses document.write. */

let jsPages = 0;
for (const file of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const full = path.join(ROOT, file);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;

  html = html.replace(/<script src="(assets\/js\/[^"]+)"(?![^>]*\bdefer\b)([^>]*)><\/script>/g,
    (m, src, rest) => `<script src="${src}"${rest} defer></script>`);

  if (html !== before) { fs.writeFileSync(full, html, 'utf8'); jsPages++; }
}
console.log(`1. defer added to scripts on ${jsPages} pages`);

/* ========================================================================== */
/* 2. product images -> responsive WebP                                       */
/* ========================================================================== */

const SIZES = '(max-width: 700px) 92vw, 560px';
let imgCount = 0, imgPages = 0;

for (const file of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const full = path.join(ROOT, file);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;

  html = html.replace(
    /<img src="assets\/images\/products\/([a-z0-9-]+)\.png"([^>]*)>/g,
    (match, base, rest) => {
      const v = n => path.join(ROOT, 'assets', 'images', 'products', `${base}-${n}.webp`);
      if (![480, 800, 1200].every(n => fs.existsSync(v(n)))) return match;   // no set, leave alone
      if (/srcset=/.test(rest)) return match;
      imgCount++;
      const p = n => `assets/images/products/${base}-${n}.webp`;
      return `<img src="${p(1200)}" srcset="${p(480)} 480w, ${p(800)} 800w, ${p(1200)} 1200w" sizes="${SIZES}"${rest}>`;
    }
  );

  if (html !== before) { fs.writeFileSync(full, html, 'utf8'); imgPages++; }
}
console.log(`2. ${imgCount} product images -> WebP + srcset across ${imgPages} pages`);

/* ========================================================================== */
/* 3. quarantine unreferenced PNGs                                            */
/* ========================================================================== */

const allHtml = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))
  .map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
const allCss = fs.readdirSync(path.join(ROOT, 'assets', 'css'))
  .filter(f => f.endsWith('.css'))
  .map(f => fs.readFileSync(path.join(ROOT, 'assets', 'css', f), 'utf8')).join('\n');
const haystack = allHtml + allCss;

const quarantine = path.join(ROOT, '_unused-assets', 'images');
let moved = 0, bytes = 0;

for (const dir of ['generated', 'products']) {
  const abs = path.join(ROOT, 'assets', 'images', dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs).filter(f => f.endsWith('.png'))) {
    if (haystack.includes(f)) continue;                    // still referenced
    const webpTwin = path.join(abs, f.replace(/\.png$/, '.webp'));
    const hasWebp = fs.existsSync(webpTwin);
    const hasSet = [480, 800, 1200].every(n =>
      fs.existsSync(path.join(abs, f.replace(/\.png$/, `-${n}.webp`))));
    if (!hasWebp && !hasSet) continue;                     // no replacement, keep it

    const dest = path.join(quarantine, dir);
    fs.mkdirSync(dest, { recursive: true });
    const size = fs.statSync(path.join(abs, f)).size;
    fs.renameSync(path.join(abs, f), path.join(dest, f));
    moved++; bytes += size;
  }
}
console.log(`3. quarantined ${moved} unreferenced PNGs (${(bytes / 1048576).toFixed(1)} MB) -> _unused-assets/images/`);
console.log('   (nothing deleted — move them back if anything turns out to need them)');
