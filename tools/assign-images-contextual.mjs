/**
 * AviCore — assign every image slot the image that actually belongs there.
 *
 * Run:  node tools/assign-images-contextual.mjs
 *
 * The previous pass filled slots from a topically-ordered pool, which left
 * products.html showing a workbench photo under alt text reading "USB flight
 * control set". This pass scores every candidate against the slot's own
 * context — its alt text, nearest heading and kicker — so the picture matches
 * the words next to it.
 *
 * Precedence:
 *   1. Product identity. A slot whose context names a product line gets that
 *      line's transparent cutout or its purpose-made AviCore render. Product
 *      identity images are exempt from the no-repeat rule: a catalogue card
 *      and the matching detail page SHOULD show the same product.
 *   2. AviCore's own generated/ renders, which were made for this site.
 *   3. Stock photography, scored by keyword overlap, unique per page.
 *
 * Any slot that ends up on stock gets its alt rewritten to describe the photo
 * actually used, so alt text never lies.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const slots = JSON.parse(fs.readFileSync('tmp/imgwork/slots.json', 'utf8'));

/* ---------------------------------------------------- product identity map */
const PRODUCTS = [
  { id: 'usb-flight-controls', cutout: 'usb-flight-controls',
    words: ['usb flight control', 'flight control set', 'yoke', 'throttle quadrant', 'usb hid'],
    alt: 'AviCore USB flight control set — yoke, side-stick and throttle quadrant' },
  { id: 'custom-joystick', cutout: 'custom-joystick',
    words: ['custom joystick', 'joystick grip', 'simulator joystick', 'cyclic'],
    alt: 'AviCore custom simulator joystick with configurable grip and base' },
  { id: 'printed-cockpit-parts', cutout: 'printed-cockpit-parts',
    words: ['3d printed', 'printed cockpit', 'knob', 'switch guard', 'bracket', 'housing'],
    alt: 'AviCore 3D-printed cockpit knobs, switch guards, brackets and housings' },
  { id: 'avionics-bezel', cutout: 'avionics-bezel',
    words: ['bezel', 'display surround', 'soft key', 'soft-key'],
    alt: 'AviCore avionics display bezel with soft keys and encoders' },
  { id: 'simulator-panel', cutout: 'simulator-panel',
    words: ['simulator panel', 'switch and annunciator', 'annunciator', 'switch panel', 'autopilot panel'],
    alt: 'AviCore simulator switch and annunciator panel with USB interface' },
  { id: 'ios-console', cutout: 'ios-console',
    words: ['instructor', 'ios ', 'operating station', 'console'],
    alt: 'AviCore instructor operating station console' },
  { id: 'soft-gauges', cutout: 'soft-gauges',
    words: ['soft gauge', 'soft-gauge', 'pfd', 'mfd', 'round gauge', 'engine bar'],
    alt: 'AviCore soft-gauge display with attitude, tapes and round instruments' },
  { id: 'joystick-configurator', cutout: 'joystick-configurator',
    words: ['configurator', 'configuration interface', 'configure'],
    alt: 'AviCore joystick configurator interface' },
];

/* --------------------------------------- AviCore's own scene renders */
const GENERATED = [
  ['joystick-assembly-workbench', ['assembly', 'workbench', 'build', 'bench', 'prototype'], 'Joystick assembly in progress on an AviCore workbench'],
  ['avionics-panel-project', ['panel project', 'avionics project', 'panel build', 'scenery', 'airport'], 'Avionics panel project on an AviCore bench'],
  ['instructor-console-session', ['session', 'instructor-led', 'monitored', 'scenario'], 'Instructor running a monitored simulator session'],
  ['printed-cockpit-parts-flatlay', ['flatlay', 'parts laid out', 'component set', 'small parts'], '3D-printed cockpit parts laid out for inspection'],
  ['custom-joystick-studio', ['studio', 'product shot', 'render'], 'Custom joystick studio render'],
  ['services-control-ecosystem', ['ecosystem', 'range', 'product line', 'all products', 'controls arranged'], 'AviCore control and display products arranged together'],
  ['calibration-support-desk', ['calibration', 'support', 'setup', 'reset'], 'Calibration and support desk with a simulator control under test'],
  ['display-calibration', ['display calibration', 'screen fit', 'alignment', 'viewing angle'], 'Display alignment and screen-fit check'],
  ['flight-school-training', ['flight school', 'student', 'lesson', 'ab-initio'], 'Flight school training session at a simulator station'],
  ['training-bench', ['training bench', 'repeatable', 'classroom station'], 'Repeatable training bench built around one lesson'],
  ['professional-procedure-training', ['procedure', 'professional', 'multi-crew', 'defence', 'defense'], 'Procedure training on a multi-seat simulator'],
  ['university-aviation-lab', ['university', 'lab', 'department', 'research', 'institute'], 'University aviation laboratory with simulator stations'],
  ['maintenance-training-bench', ['maintenance', 'systems trainer', 'panel-level'], 'Maintenance training bench with a systems panel'],
  ['hobbyist-cockpit-room', ['hobby', 'enthusiast', 'home cockpit room', 'desk rig'], 'Home cockpit room built by an enthusiast'],
  ['home-cockpit-build', ['home cockpit', 'desk', 'home build'], 'Home cockpit build with controls and displays'],
  ['integration-kit', ['integration', 'wiring', 'interface kit', 'cable'], 'Integration kit with wiring and interface boards'],
  ['simulator-builder-integration', ['builder', 'module', 'integrator'], 'Simulator builder integrating a control module'],
  ['printed-parts-workshop', ['workshop', 'printing', 'production'], '3D printing workshop producing cockpit parts'],
  ['capabilities-engineering', ['capability', 'engineering', 'design review', 'drawing'], 'Engineering review of a simulator hardware design'],
  ['hardware-launch-preview', ['launch', 'preview', 'roadmap', 'release'], 'Hardware launch preview'],
];

const inv = JSON.parse(fs.readFileSync('tmp/imgwork/inventory.json', 'utf8'));
const genFiles = new Set(inv.generated || []);
const stockFiles = (inv.stock || []).map(f => 'assets/images/stock/' + f);

function genPath(base) {
  for (const ext of ['.webp', '.jpg', '.png']) {
    if (genFiles.has(base + ext)) return 'assets/images/generated/' + base + ext;
  }
  return null;
}

/* ---------------------------------------------------------------- scoring */
const ctxOf = s => `${s.alt} ${s.heading} ${s.kicker} ${s.page}`.toLowerCase();

function stockScore(file, ctx) {
  const q = file.split('/').pop().replace(/-photo-.*$/, '').replace(/-/g, ' ');
  const terms = q.split(' ').filter(t => t.length > 3);
  let score = 0;
  for (const t of terms) if (ctx.includes(t)) score += 3;
  // soft synonyms
  const SYN = {
    cockpit: ['cockpit', 'panel', 'instrument', 'flight deck'],
    training: ['training', 'student', 'lesson', 'school', 'class', 'instructor'],
    simulator: ['simulator', 'sim ', 'rig', 'station'],
    aircraft: ['aircraft', 'aeroplane', 'airplane', 'plane', 'aerodrome', 'airport'],
    printing: ['printed', 'print', '3d'],
    workshop: ['workshop', 'bench', 'assembly', 'build', 'production'],
    circuit: ['electronics', 'wiring', 'board', 'interface', 'usb'],
    joystick: ['joystick', 'grip', 'stick', 'control'],
    runway: ['airport', 'scenery', 'aerodrome', 'runway'],
    maintenance: ['maintenance', 'service', 'repair'],
    headset: ['headset', 'radio', 'comm'],
  };
  for (const [k, words] of Object.entries(SYN)) {
    if (q.includes(k) && words.some(w => ctx.includes(w))) score += 2;
  }
  return score;
}

/* ------------------------------------------------------------- assignment */
const usedStock = new Set();
const usedGen = new Set();
const assignments = {};      // page -> [{idx, src, alt}]
let stats = { product: 0, generated: 0, stock: 0 };

/* A product render may appear on its catalogue card and its own detail page,
   but never twice on the SAME page — that just reads as a mistake. */
const usedOnPage = {};
const claimedOnPage = (page, key) => {
  (usedOnPage[page] = usedOnPage[page] || new Set()).add(key);
};
const takenOnPage = (page, key) => (usedOnPage[page] || new Set()).has(key);

/* Hero slots are pinned. Left to the scorer, products.html's hero grabbed the
   USB cutout and every catalogue card below it shifted by one. */
const PINNED = {
  'products.html:0': ['assets/images/generated/services-control-ecosystem.webp',
    'AviCore control, panel and display products arranged together'],
  'index.html:0': ['assets/images/generated/hardware-launch-preview.jpg',
    'AviCore simulator controls and panels prepared for launch'],
};

for (const s of slots) {
  const ctx = ctxOf(s);
  let src = null, alt = null;

  const pin = PINNED[`${s.page}:${s.idx}`];
  if (pin) {
    [src, alt] = pin;
    claimedOnPage(s.page, src);
    (assignments[s.page] = assignments[s.page] || []).push({ idx: s.idx, src, alt });
    continue;
  }

  // 1. product identity — ONLY on the product's own detail page and on the
  //    catalogue. Letting it apply anywhere put the same joystick render on
  //    ten different pages, which reads as a stock-photo shortage.
  const CUTOUT_PAGES = new Set([
    'products.html',
    'usb-flight-controls.html', 'custom-joystick.html', 'printed-parts.html',
    'avionics-bezels.html', 'cockpit-panels.html', 'ios-software.html',
    'soft-gauges.html', 'configure-joystick.html',
  ]);

  if (CUTOUT_PAGES.has(s.page)) {
    for (const p of PRODUCTS) {
      if (!p.words.some(w => ctx.includes(w))) continue;
      if (takenOnPage(s.page, p.cutout)) continue;   // already shown on this page
      src = `assets/images/products/${p.cutout}-1200.webp`;
      alt = p.alt;
      claimedOnPage(s.page, p.cutout);
      stats.product++;
      break;
    }
  }

  // 2. AviCore scene render
  if (!src) {
    for (const [base, words, a] of GENERATED) {
      if (usedGen.has(base) || takenOnPage(s.page, base)) continue;
      if (words.some(w => ctx.includes(w))) {
        const g = genPath(base);
        if (g) { src = g; alt = a; usedGen.add(base); claimedOnPage(s.page, base); stats.generated++; break; }
      }
    }
  }

  // 3. best-scoring unused stock photo
  if (!src) {
    let best = null, bestScore = -1;
    for (const f of stockFiles) {
      if (usedStock.has(f) || takenOnPage(s.page, f)) continue;
      const sc = stockScore(f, ctx);
      if (sc > bestScore) { bestScore = sc; best = f; }
    }
    if (best) {
      usedStock.add(best); claimedOnPage(s.page, best);
      src = best;
      const subject = best.split('/').pop().replace(/-photo-.*$/, '').replace(/-/g, ' ');
      alt = subject.charAt(0).toUpperCase() + subject.slice(1) + ' — illustrative reference for simulation and training use';
      stats.stock++;
    }
  }

  if (src) (assignments[s.page] = assignments[s.page] || []).push({ idx: s.idx, src, alt });
}

/* --------------------------------------------------------------- rewrite */
let pagesChanged = 0;
for (const [page, list] of Object.entries(assignments)) {
  const full = path.join(ROOT, page);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;
  const byIdx = new Map(list.map(a => [a.idx, a]));

  let i = 0;
  html = html.replace(/<img\b[^>]*>/g, (tag) => {
    const src = (tag.match(/src="([^"]+)"/) || [])[1] || '';
    if (!src.startsWith('assets/images/') || src.includes('/logo/')) return tag;
    const a = byIdx.get(i++);
    if (!a) return tag;

    let out = tag.replace(/\ssrc="[^"]+"/, ` src="${a.src}"`);
    out = out.replace(/\salt="[^"]*"/, ` alt="${a.alt.replace(/"/g, '&quot;')}"`);
    if (!/\salt=/.test(out)) out = out.replace(/<img/, `<img alt="${a.alt}"`);

    // product cutouts keep their responsive set; everything else is single-source
    if (a.src.includes('/products/')) {
      const base = a.src.match(/products\/([a-z0-9-]+)-1200\.webp/)[1];
      const srcset = `assets/images/products/${base}-480.webp 480w, assets/images/products/${base}-800.webp 800w, assets/images/products/${base}-1200.webp 1200w`;
      out = out.replace(/\ssrcset="[^"]*"/, '');
      out = out.replace(/<img/, `<img srcset="${srcset}" sizes="(max-width: 700px) 92vw, 560px"`);
    } else {
      out = out.replace(/\ssrcset="[^"]*"/, '').replace(/\ssizes="[^"]*"/, '');
    }
    return out;
  });

  if (html !== before) { fs.writeFileSync(full, html, 'utf8'); pagesChanged++; }
}

console.log(`slots assigned: product=${stats.product} generated=${stats.generated} stock=${stats.stock}`);
console.log(`pages rewritten: ${pagesChanged}`);
console.log(`stock images consumed: ${usedStock.size} of ${stockFiles.length}`);
