/**
 * AviCore — add the FSDC hand-off band to enterprise-scale pages.
 *
 * Run:  node tools/add-enterprise-handoff.mjs
 *
 * AviCore sells desk-scale hardware. Four of the six audience pages —
 * flight schools, universities, defence and maintenance training — attract
 * visitors whose real requirement is a complete training device, which is
 * FSDC Aerosolutions' work, not AviCore's.
 *
 * Rather than let those enquiries die in a hobbyist quote form, each of those
 * pages gets a band pointing at enterprise.html. The two genuinely small-scale
 * audiences (hobbyists, simulator builders) are left alone.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const PAGES = {
  'flight-schools.html': 'Running a full ab-initio programme, or need a device that counts toward logged hours? That is a complete training device, and it is built by FSDC Aerosolutions.',
  'universities.html': 'If the department needs a full-motion research or training platform rather than lab benches, FSDC Aerosolutions builds at that scale.',
  'defense-training.html': 'Mission-specific and multi-crew training devices, including rotary-wing platforms, are delivered by FSDC Aerosolutions.',
  'maintenance-training.html': 'For complete maintenance training devices rather than panel-level trainers, FSDC Aerosolutions takes the programme.',
  'solutions.html': 'AviCore covers the compact end. Full-motion, multi-crew and mission-specific simulator programmes are delivered by our parent company.',
  'capabilities.html': 'Beyond component and bench scale, complete simulator programmes are engineered by FSDC Aerosolutions from the same base in Rawalpindi.',
};

function band(copy) {
  return `<section class="section section-tight-top"><div class="container"><div class="enterprise-handoff"><div><div class="card-kicker">Bigger programme?</div><h3>This may be one for FSDC Aerosolutions.</h3><p>${copy}</p></div><div class="button-row"><a class="btn btn-secondary" href="enterprise.html">See the split</a></div></div></div></section>`;
}

let done = 0;
for (const [file, copy] of Object.entries(PAGES)) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) { console.log(`skip ${file} (missing)`); continue; }

  let html = fs.readFileSync(full, 'utf8');
  if (html.includes('enterprise-handoff')) { console.log(`${file}: already present`); continue; }

  // insert before the final section of <main> so it sits above the closing CTA
  const lastSection = html.lastIndexOf('<section class="section');
  if (lastSection === -1) { console.log(`${file}: no section found`); continue; }

  html = html.slice(0, lastSection) + band(copy) + html.slice(lastSection);
  fs.writeFileSync(full, html, 'utf8');
  console.log(`${file}: hand-off band added`);
  done++;
}

console.log(`\n${done} pages updated. hobbyists.html and simulator-builders.html deliberately left alone — those are AviCore's core audience.`);
