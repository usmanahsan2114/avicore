/**
 * AviCore — put FSDC's own photography on enterprise.html.
 *
 * Run:  node tools/enterprise-fsdc-images.mjs
 *
 * The page previously borrowed a generic training photo that was also in use
 * on three other pages. Since it describes the parent company's work it should
 * show the parent company's actual hardware. Images pulled from fsdcpak.com
 * into assets/images/fsdc/ and used nowhere else on the site.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const file = path.join(ROOT, 'enterprise.html');
let html = fs.readFileSync(file, 'utf8');
const before = html;

/* ---- hero: the MFI-17 full-motion device on its hexapod ------------------ */
html = html.replace(
  /<div class="product-stage"[^>]*><picture><img src="assets\/images\/generated\/professional-procedure-training\.jpg"[^>]*><\/picture>\s*<span class="image-note">[^<]*<\/span><\/div>/,
  `<div class="product-stage"><picture><img src="assets/images/fsdc/home-services1.webp" width="1200" height="820" loading="eager" decoding="async" fetchpriority="high" alt="FSDC Aerosolutions MFI-17 full-motion flight simulator on a six-degree-of-freedom motion platform"></picture><span class="image-note">FSDC Aerosolutions &mdash; MFI-17 full-motion simulator</span></div>`
);

/* ---- capability cards gain real photos ---------------------------------- */
const CAP = [
  ['Full-motion simulators', 'assets/images/fsdc/home-recap2025-fixed-wing.webp', 'Fixed-wing full-motion simulator built by FSDC Aerosolutions'],
  ['Mixed-reality &amp; VR', 'assets/images/fsdc/home-why.webp', 'Rotary-wing motion simulator with headset-based visuals at an FSDC exhibition stand'],
  ['Custom programmes', 'assets/images/fsdc/home-recap2025-ios.webp', 'FSDC instructor operating station software controlling a training session'],
];

for (const [title, src, alt] of CAP) {
  const re = new RegExp(`(<article class="info-card"><div class="card-icon" aria-hidden="true">\\d+</div><h3>${title}</h3>)`);
  html = html.replace(re, `<article class="info-card has-media"><div class="card-media"><img src="${src}" width="1200" height="800" loading="lazy" decoding="async" alt="${alt}"></div><h3>${title}</h3>`);
}
// drop the now-duplicated opening tags left by the replace
html = html.replace(/<article class="info-card"><div class="card-icon" aria-hidden="true">\d+<\/div><article class="info-card has-media">/g, '<article class="info-card has-media">');

/* ---- product family callouts -------------------------------------------- */
html = html.replace(
  /(<div class="callout"><div class="card-kicker">Multi-crew series<\/div>)/,
  `<div class="callout has-media"><div class="card-media"><img src="assets/images/fsdc/products-aeromix-clear-for-takeoff.webp" width="1200" height="800" loading="lazy" decoding="async" alt="FSDC AeroMix multi-crew simulator cleared for takeoff"></div><div class="card-kicker">Multi-crew series</div>`
);
html = html.replace(/<div class="callout"><div class="callout has-media">/, '<div class="callout has-media">');

html = html.replace(
  /(<div class="callout"><div class="card-kicker">Single-pilot series<\/div>)/,
  `<div class="callout has-media"><div class="card-media"><img src="assets/images/fsdc/home-recap2025-rotary-wing.webp" width="1200" height="800" loading="lazy" decoding="async" alt="Two FSDC Mushshak MFI-17 simulator pods installed in a training facility"></div><div class="card-kicker">Single-pilot series</div>`
);
html = html.replace(/<div class="callout"><div class="callout has-media">/, '<div class="callout has-media">');

/* ---- a short "seen at" strip using their event photography --------------- */
const STRIP = `<section class="section surface-dark"><div class="container"><div class="section-heading"><div><div class="eyebrow">In the field</div><h2>FSDC hardware, on the floor.</h2></div><p>Photography courtesy of FSDC Aerosolutions.</p></div><div class="fsdc-strip"><figure><img src="assets/images/fsdc/events-dubai-2025-g-stand-wide.webp" width="1200" height="800" loading="lazy" decoding="async" alt="FSDC Aerosolutions exhibition stand at the Dubai Air Show 2025"><figcaption>Dubai Air Show 2025</figcaption></figure><figure><img src="assets/images/fsdc/events-indus-2026-pm-at-controls.webp" width="1200" height="800" loading="lazy" decoding="async" alt="Visitor at the controls of an FSDC simulator during the Indus RAS Expo 2026"><figcaption>Indus RAS Expo 2026</figcaption></figure><figure><img src="assets/images/fsdc/home-recap2025-airport.webp" width="1200" height="800" loading="lazy" decoding="async" alt="Airport visual scene rendered in an FSDC simulator"><figcaption>Visual system</figcaption></figure></div></div></section>`;

if (!html.includes('fsdc-strip')) {
  html = html.replace(/(<section class="section section-tight-top[^"]*"><div class="container narrow"><div class="note-box">)/, STRIP + '$1');
}

if (html !== before) {
  fs.writeFileSync(file, html, 'utf8');
  console.log('enterprise.html updated with FSDC imagery');
  const imgs = [...html.matchAll(/src="(assets\/images\/[^"]+)"/g)].map(m => m[1]);
  console.log('  images now on the page:');
  [...new Set(imgs)].forEach(i => console.log('    ' + i));
} else {
  console.log('no changes — check selectors');
}
