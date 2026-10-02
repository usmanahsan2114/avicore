/**
 * AviCore — hero rewrite + remaining AI-agency copy cleanup.
 *
 * Run:  node tools/fix-hero-and-copy.mjs
 *
 * The hero sold a software consultancy ("we plug into your stack to
 * prototype, validate, and launch simulation experiences your users actually
 * love") and its CTAs pointed at service.html and a #pricing anchor, while
 * products.html and quote.html had ZERO in-body links on the homepage.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const EDITS = [
  /* ---- hero headline ---------------------------------------------------- */
  [/<span class="title1 fw-semibold text-gradient-1">Hardware and software for focused simulators<\/span>/g,
   '<span class="title1 fw-semibold text-gradient-1">Custom flight simulator hardware,</span>'],

  [/<span class="fw-semibold text-gradient-1">on Demand<\/span>/g,
   '<span class="fw-semibold text-gradient-1">built to your cockpit</span>'],

  /* ---- hero subhead ----------------------------------------------------- */
  [/From discovery to deployment, we plug into your stack to prototype, <br> validate, and launch simulation experiences your users actually love\./g,
   'USB flight controls, 3D-printed cockpit parts, avionics bezels, panels, scenery and instructor software &mdash; <br> designed and built to your dimensions, for simulation and training use only.'],

  /* ---- hero CTAs: route to the two pages that had no inbound links ------ */
  [/<a href="service\.html" class="tf-btn">\s*Explore Services\s*<\/a>/g,
   '<a href="quote.html" class="tf-btn">\n                            Request a Quote\n                        </a>'],

  [/<a href="#pricing" class="tf-btn-2">\s*View Product Availability\s*<\/a>/g,
   '<a href="products.html" class="tf-btn-2">\n                            Browse product lines\n                        </a>'],

  /* ---- remaining AI-agency copy (variants with <br> that earlier
          patterns missed) ------------------------------------------------- */
  [/We design, build, and evaluate with a modern simulator stack[\s\S]{0,220}?reliable, and secure\./g,
   'We design, build and test against your simulator platform &mdash; USB HID mapping, panel wiring, display fit and calibration &mdash; so the hardware behaves predictably on the rig you actually fly.'],

  [/We craft prompts, interfaces, and guardrails that feel intuitive - so adoption rises and support tickets fall\./g,
   'We design controls, panels and labelling that feel obvious in the seat &mdash; so students spend the session flying, not hunting for a switch.'],

  [/Turn repetitive tasks into autonomous flows[\s\S]{0,160}?clear handoff to humans\./g,
   'Turn repeatable training tasks into a scripted session &mdash; the instructor station sets up the scenario, injects failures, logs the run and hands a report back to the instructor.'],
];

let total = 0;
for (const file of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const full = path.join(ROOT, file);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;
  let hits = 0;
  for (const [re, rep] of EDITS) {
    html = html.replace(re, () => { hits++; return rep; });
  }
  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    total++;
    console.log(`${file}: ${hits} edit(s)`);
  }
}
console.log(`\nUpdated ${total} files.`);
