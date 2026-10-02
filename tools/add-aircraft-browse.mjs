/**
 * AviCore — add an aircraft-type browse axis, plus content fixes.
 *
 * Run:  node tools/add-aircraft-browse.mjs
 *
 * The catalogue is organised entirely by COMPONENT (joystick, bezel, panel).
 * Buyers don't think that way — they think "I fly a 172, what do I need?".
 * Comparable simulator-hardware storefronts lead with aircraft families for
 * exactly this reason. This adds that axis on the homepage and products page.
 *
 * Wording: every aircraft reference is "-style" / "layout" framing. AviCore
 * makes simulation parts, not OEM parts, and the footer disclaimer carries the
 * trademark notice. Nothing here claims approval, certification or affiliation.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const AIRCRAFT = [
  ['Single-engine trainer', 'C172 / PA-28-style layouts', 'Yoke, throttle quadrant, trim and a six-pack or glass panel sized to a trainer cockpit.', 'assets/images/generated/home-cockpit-build.jpg'],
  ['Glass-cockpit single', 'G1000-style panel builds', 'PFD/MFD surrounds, soft-key bezels and an autopilot panel matched to your screen sizes.', 'assets/images/generated/display-calibration.jpg'],
  ['Light twin', 'DA42 / Seneca-style layouts', 'Dual throttle quadrants, gear and flap selectors, annunciator and switch panels.', 'assets/images/generated/integration-kit.jpg'],
  ['Turboprop &amp; bizjet', 'King Air / light jet-style', 'Condition levers, pedestal panels, larger display surrounds and instructor controls.', 'assets/images/generated/professional-procedure-training.jpg'],
  ['Rotary wing', 'Cyclic, collective, pedals', 'Cyclic grip with hat switches, collective with throttle twist and matched pedal travel.', 'assets/images/generated/joystick-assembly-workbench.webp'],
  ['Procedure trainer', 'Fixed-base, task-focused', 'A single panel or bench built around one lesson — radio work, flows or failure drills.', 'assets/images/generated/training-bench.jpg'],
];

const cards = AIRCRAFT.map(([name, sub, desc, img]) => `
                    <article class="aircraft-card">
                        <div class="aircraft-media">
                            <img src="${img}" alt="${name.replace(/&amp;/g, 'and')} simulator build reference" width="1200" height="800" loading="lazy" decoding="async">
                        </div>
                        <div class="aircraft-body">
                            <div class="card-kicker">${sub}</div>
                            <h3>${name}</h3>
                            <p>${desc}</p>
                            <a class="text-link" href="quote.html">Scope this build</a>
                        </div>
                    </article>`).join('');

const SECTION = `        <!-- section-aircraft -->
        <section class="section-aircraft flat-spacing surface-light" aria-labelledby="aircraft-title">
            <div class="container">
                <div class="heading-section center mb-64">
                    <div class="heading-sub fw-semibold">Start from the aircraft</div>
                    <h2 id="aircraft-title" class="heading-title">What are you simulating?</h2>
                    <p class="section-intro">Tell us the cockpit you are recreating and we work back to the controls, panels and displays that fit it. Layout references only &mdash; AviCore parts are for simulation and training use, not certified aircraft parts.</p>
                </div>
                <div class="aircraft-grid">${cards}
                </div>
            </div>
        </section>
        <!-- /section-aircraft -->
`;

/* ---- inject after the build-paths section ------------------------------- */
let done = 0;
for (const file of ['index.html', 'products.html']) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) continue;
  let html = fs.readFileSync(full, 'utf8');
  if (html.includes('section-aircraft')) { console.log(`${file}: already present`); continue; }

  if (file === 'index.html') {
    html = html.replace('<!-- /section-build-paths -->', '<!-- /section-build-paths -->\n' + SECTION.trimEnd());
  } else {
    // products.html: after the catalogue grid section, before the configurator CTA
    const marker = '<section class="section surface-dark">';
    const i = html.lastIndexOf(marker);
    if (i !== -1) html = html.slice(0, i) + SECTION.trim() + html.slice(i);
  }
  fs.writeFileSync(full, html, 'utf8');
  console.log(`${file}: aircraft browse section added`);
  done++;
}

/* ---- leftover AI-agency benefit copy ------------------------------------ */
const COPY = [
  [/Eval-First Reliability/g, 'Tested Before It Ships'],
  [/From day one, we run offline\/online evals, canary tests, and tracing\. You see how models perform - and why\./g,
   'Every build is bench-tested against your simulator before it leaves us &mdash; axis travel, button mapping, panel fit and label legibility, with the results written down.'],
  [/Secure by Design/g, 'Documented Builds'],
];

let copyFiles = 0;
for (const file of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const full = path.join(ROOT, file);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;
  for (const [re, rep] of COPY) html = html.replace(re, rep);
  if (html !== before) { fs.writeFileSync(full, html, 'utf8'); copyFiles++; }
}
console.log(`AI-agency benefit copy rewritten on ${copyFiles} files`);
console.log(`\nDone (${done} pages got the aircraft section).`);
