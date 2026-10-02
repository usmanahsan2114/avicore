/**
 * AviCore — give every image slot on the site a globally unique visual.
 *
 * Run:  node tools/dedupe-images.mjs
 *
 * Before this ran, 18 visuals appeared on more than one page — one on ten
 * pages — and assets/images/unique/ was 116 files that were only re-encodes of
 * 10 source images, so the variety was cosmetic.
 *
 * Rules applied:
 *   - No visual appears on two pages. Ever.
 *   - Product pages keep their transparent product cutout (the product is the
 *     point of the page). The products.html catalogue therefore gets distinct
 *     in-context photography for its cards.
 *   - enterprise.html keeps FSDC's own photography and is not touched.
 *   - work.html / work-single.html are given first pick of the new imagery.
 *   - Pool order is topical, so a page about panels tends to get panel photos.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const rel = p => p.split(path.sep).join('/');

/* ------------------------------------------------------------------ pools */
const listDir = d => {
  const abs = path.join(ROOT, 'assets', 'images', d);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs)
    .filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f))
    .map(f => `assets/images/${d}/${f}`);
};

const stock = listDir('stock');
const generated = listDir('generated').filter(f => !/-(480|800|1200)\./.test(f));
const section = listDir('section');
const blogImgs = listDir('blog');

/** topical buckets so assignment is not random */
const topic = (f, words) => words.some(w => f.toLowerCase().includes(w));
const bucket = (words) => stock.filter(f => topic(f, words));

const POOLS = {
  cockpit: bucket(['cockpit', 'flight-deck', 'glass-cockpit', 'instrument']),
  training: bucket(['training', 'classroom', 'pilot', 'simulator']),
  workshop: bucket(['workshop', 'circuit', 'solder', '3d-printing', 'cnc', 'prototype', 'workbench', 'technical-drawing']),
  aircraft: bucket(['airplane', 'aircraft', 'hangar', 'runway', 'propeller', 'helicopter', 'air-traffic', 'maintenance', 'aerospace']),
  controls: bucket(['joystick', 'control-panel', 'switch-panel', 'headset', 'avionics']),
};

const used = new Set();
const claim = (f) => { used.add(f); return f; };

function take(order) {
  for (const name of order) {
    const pool = POOLS[name] || [];
    for (const f of pool) if (!used.has(f)) return claim(f);
  }
  for (const f of [...stock, ...generated, ...section, ...blogImgs]) {
    if (!used.has(f)) return claim(f);
  }
  return null;
}

/* --------------------------------------------------- reserved / untouched */
// enterprise.html uses FSDC photography; leave it alone entirely.
const SKIP_PAGES = new Set(['enterprise.html']);

// each product page keeps its own cutout
const PRODUCT_CUTOUT = {
  'usb-flight-controls.html': 'usb-flight-controls',
  'custom-joystick.html': 'custom-joystick',
  'printed-parts.html': 'printed-cockpit-parts',
  'avionics-bezels.html': 'avionics-bezel',
  'cockpit-panels.html': 'simulator-panel',
  'ios-software.html': 'ios-console',
  'soft-gauges.html': 'soft-gauges',
  'configure-joystick.html': 'joystick-configurator',
};
Object.values(PRODUCT_CUTOUT).forEach(base => {
  [480, 800, 1200].forEach(s => used.add(`assets/images/products/${base}-${s}.webp`));
});
// FSDC images are enterprise-only
listDir('fsdc').forEach(f => used.add(f));

/* topical preference per page */
const PREF = {
  'work.html':            ['training', 'cockpit', 'workshop', 'aircraft'],
  'work-single.html':     ['workshop', 'controls', 'cockpit', 'aircraft'],
  'index.html':           ['cockpit', 'controls', 'training', 'workshop'],
  'index-v2.html':        ['aircraft', 'workshop', 'training', 'cockpit'],
  'products.html':        ['controls', 'workshop', 'cockpit', 'aircraft'],
  'about.html':           ['workshop', 'aircraft', 'training', 'cockpit'],
  'service.html':         ['workshop', 'cockpit', 'controls', 'training'],
  'service-single.html':  ['controls', 'workshop', 'aircraft', 'cockpit'],
  'contact.html':         ['aircraft', 'training', 'cockpit', 'workshop'],
  'flight-schools.html':  ['training', 'aircraft', 'cockpit', 'workshop'],
  'universities.html':    ['training', 'workshop', 'aircraft', 'cockpit'],
  'defense-training.html':['aircraft', 'training', 'cockpit', 'controls'],
  'maintenance-training.html': ['maintenance', 'workshop', 'aircraft', 'training'],
  'hobbyists.html':       ['cockpit', 'controls', 'workshop', 'training'],
  'simulator-builders.html': ['workshop', 'controls', 'cockpit', 'aircraft'],
  'capabilities.html':    ['workshop', 'aircraft', 'controls', 'training'],
  'solutions.html':       ['training', 'aircraft', 'cockpit', 'controls'],
  'airport-scenery-design.html': ['aircraft', 'cockpit', 'training', 'workshop'],
};
const DEFAULT_PREF = ['aircraft', 'cockpit', 'training', 'workshop', 'controls'];

/* -------------------------------------------------------------- rewriting */
const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !SKIP_PAGES.has(f));
let slots = 0, changed = 0;
const report = [];

for (const page of pages) {
  const full = path.join(ROOT, page);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;
  const pref = PREF[page] || DEFAULT_PREF;
  const keepBase = PRODUCT_CUTOUT[page];
  let n = 0;

  html = html.replace(/<img\b[^>]*>/g, (tag) => {
    const srcM = tag.match(/\ssrc="([^"]+)"/);
    if (!srcM) return tag;
    const src = srcM[1];
    if (!src.startsWith('assets/images/')) return tag;
    if (src.includes('/logo/')) return tag;

    // this page's own product cutout stays
    if (keepBase && src.includes(`/products/${keepBase}-`)) { slots++; return tag; }

    const replacement = take(pref);
    if (!replacement) return tag;
    n++; slots++;

    let out = tag.replace(/\ssrc="[^"]+"/, ` src="${replacement}"`);
    out = out.replace(/\ssrcset="[^"]+"/, '');   // single source now
    out = out.replace(/\ssizes="[^"]+"/, '');
    return out;
  });

  // drop <source> entries that pointed at the old responsive sets
  html = html.replace(/<source[^>]*srcset="assets\/images\/[^"]*"[^>]*>\s*/g, '');

  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    changed++;
    report.push(`  ${page.padEnd(30)} ${n} image(s) reassigned`);
  }
}

console.log(report.join('\n'));
console.log(`\n${changed} pages updated, ${slots} slots processed, ${used.size} distinct visuals claimed.`);
console.log(`pool remaining: ${stock.filter(f => !used.has(f)).length} stock, ${generated.filter(f => !used.has(f)).length} generated`);
