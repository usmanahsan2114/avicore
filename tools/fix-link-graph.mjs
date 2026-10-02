/**
 * AviCore — repair the internal link graph and strip leftover AI-agency copy.
 *
 * Run:  node tools/fix-link-graph.mjs
 *
 * Measured before this ran: index.html had 38 in-body internal links, 25 of
 * them (66%) pointing at faq.html, while products.html, quote.html and
 * configure-joystick.html each appeared ZERO times. A find/replace during the
 * template conversion repointed every decorative template link at the FAQ:
 *   - "social" icons on workstream cards (there are no per-role profiles)
 *   - workstream name links
 *   - the "Back to top" control
 *   - three service tags still carrying AI-agency labels
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

/* Aviation replacements for the three AI-agency service tags that survived
   conversion (the adjacent accordion was converted correctly; this one was
   missed). */
const AI_TAGS = [
  [/<a href="faq\.html" class="tags-item fw-semibold">Multi-step planning<\/a>/g,
   '<a href="cockpit-panels.html" class="tags-item fw-semibold">Panel layout planning</a>'],
  [/<a href="faq\.html" class="tags-item fw-semibold">Function calling &(?:amp;)? toolchains<\/a>/g,
   '<a href="avionics-bezels.html" class="tags-item fw-semibold">Bezel &amp; display fit</a>'],
  [/<a href="faq\.html" class="tags-item fw-semibold">Guardrails and audit trails<\/a>/g,
   '<a href="printed-parts.html" class="tags-item fw-semibold">Switch &amp; backlighting</a>'],
];

/* Copy still describing an AI product rather than simulator hardware. */
const AI_COPY = [
  [/We measure what matters - accuracy, latency, safety, and <br> cost - so every sprint ships business value, not just features\./g,
   'We measure what matters — control accuracy, input latency, build tolerance and cost — so every kit ships to the spec you signed off.'],
  [/We design, build, and evaluate with a modern simulator stack[^<]*?so your features are fast, reliable, and secure\./g,
   'We design, build and test against your simulator platform — USB HID mapping, panel wiring, display fit and calibration — so the hardware behaves predictably on the rig you actually fly.'],
  [/Domain-specific simulator modules and agents that plan, execute, and report\. These intelligent systems/g,
   'Instructor-facing simulator modules that set up, run and log a training session. These stations'],
];

let total = 0;

for (const file of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const full = path.join(ROOT, file);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;
  const notes = [];

  /* ---- 1. workstream cards: drop the fake per-role social icons --------- */
  const socialBlocks = html.match(/<div class="tf-social[^"]*">[\s\S]*?<\/div>\s*(?=<\/div>)/g) || [];
  let socialDropped = 0;
  html = html.replace(/[ \t]*<div class="tf-social[^"]*">[\s\S]*?<\/div>\n?(?=\s*<\/div>)/g, (m) => {
    // only drop blocks whose links are the mis-pointed faq.html ones
    if (!/href="faq\.html"/.test(m)) return m;
    socialDropped++;
    return '';
  });
  if (socialDropped) notes.push(`removed ${socialDropped} fake social-icon rows`);

  /* ---- 2. workstream name links -> plain text -------------------------- */
  const nameHits = (html.match(/<a href="faq\.html" class="name ([^"]*)">([^<]*)<\/a>/g) || []).length;
  if (nameHits) {
    html = html.replace(/<a href="faq\.html" class="name ([^"]*)">([^<]*)<\/a>/g, '<div class="name $1">$2</div>');
    notes.push(`${nameHits} workstream names -> non-links`);
  }

  /* ---- 3. back to top -------------------------------------------------- */
  if (/href="faq\.html"(\s+class="action-go-top)/.test(html)) {
    html = html.replace(/href="faq\.html"(\s+class="action-go-top)/g, 'href="#top"$1');
    notes.push('back-to-top -> #top');
  }

  /* ---- 4. AI-agency service tags --------------------------------------- */
  let tagHits = 0;
  for (const [re, rep] of AI_TAGS) {
    html = html.replace(re, () => { tagHits++; return rep; });
  }
  if (tagHits) notes.push(`${tagHits} AI-agency tags -> product links`);

  /* ---- 5. AI-agency body copy ------------------------------------------ */
  let copyHits = 0;
  for (const [re, rep] of AI_COPY) {
    html = html.replace(re, () => { copyHits++; return rep; });
  }
  if (copyHits) notes.push(`${copyHits} AI-agency copy blocks rewritten`);

  /* ---- 6. template alt text -------------------------------------------- */
  if (html.includes('alt="Earth"')) {
    html = html.replace(/alt="Earth"/g, 'alt="AviCore instructor operating station console"');
    notes.push('fixed alt="Earth"');
  }

  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    total++;
    console.log(`${file}\n    ${notes.join('\n    ')}`);
  }
}

console.log(`\nUpdated ${total} files.`);
