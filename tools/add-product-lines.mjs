/**
 * AviCore — add two SHIPPING product lines.
 *
 * Run:  node tools/add-product-lines.mjs
 *
 *   1. airport-scenery-design.html  (new)  — Custom Airport & Scenery Design
 *   2. ios-software.html            (edit) — promoted to Instructor Operating
 *                                            Station & Software, marked available
 *
 * Everything else on the site is "Coming Soon"; these two are the first lines
 * presented as orderable, so their badges, spec strips and CTAs differ from
 * the pre-launch pages.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TEMPLATE = 'usb-flight-controls.html';
const NEW_PAGE = 'airport-scenery-design.html';

const src = fs.readFileSync(path.join(ROOT, TEMPLATE), 'utf8');

/* ========================================================================== */
/* 1. Build airport-scenery-design.html                                       */
/* ========================================================================== */

const TITLE = 'Custom Airport &amp; Scenery Design | AviCore Simulation Hardware &amp; Software';
const DESC = 'AviCore builds custom airport and scenery packages for MSFS, X-Plane and Prepar3D, modelled from charts and imagery for training and familiarisation.';
const URL = 'https://www.fsdcpak.com/avicore/airport-scenery-design.html';
const IMG = 'https://www.fsdcpak.com/avicore/assets/images/generated/avionics-panel-project.webp';

let page = src;

/* ---- head ---------------------------------------------------------------- */
page = page.replace(/<title>[\s\S]*?<\/title>/, `<title>${TITLE}</title>`);
page = page.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${DESC}">`);
page = page.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${URL}">`);
page = page.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${TITLE}">`);
page = page.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${DESC}">`);
page = page.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${URL}">`);
page = page.replace(/<meta property="og:image" content="[^"]*">/g, `<meta property="og:image" content="${IMG}">`);
page = page.replace(/<meta property="og:image:alt" content="[^"]*">/, `<meta property="og:image:alt" content="Custom simulator airport scenery modelled from charts and imagery">`);
page = page.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${TITLE}">`);
page = page.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${DESC}">`);
page = page.replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${IMG}">`);
page = page.replace(/<body data-page="[^"]*"/, '<body data-page="airport-scenery-design"');

/* ---- hero ---------------------------------------------------------------- */
page = page.replace(
  /<div class="eyebrow">Controls \/ HID<\/div>/,
  '<div class="eyebrow">Software / Scenery</div>'
);
page = page.replace(
  /<h1>USB flight controls for desktop rigs and training devices<\/h1>/,
  '<h1>Custom airport and scenery for the field you actually fly</h1>'
);
page = page.replace(
  /<p class="lead">AviCore USB flight controls are configurable simulation inputs for hobby cockpits, labs and instructor-led training setups\.<\/p>/,
  '<p class="lead">Airport and terrain packages modelled from charts, survey data and imagery for Microsoft Flight Simulator, X-Plane and Prepar3D &mdash; so crews brief and fly the aerodrome they operate into, not a generic stand-in.</p>'
);

/* hero chips */
page = page.replace(
  /<div class="chip-row">[\s\S]*?<\/div>\s*(?=<div class="button-row">)/,
  `<div class="chip-row"><span class="chip chip-accent">Available now</span><span class="chip">MSFS / X-Plane / P3D</span><span class="chip">Any ICAO</span></div>`
);

/* hero buttons — this line ships, so it takes orders rather than sign-ups */
page = page.replace(
  /<a class="btn btn-primary" href="[^"]*">Join launch updates<\/a>/g,
  '<a class="btn btn-primary" href="quote.html">Request a quote</a>'
);
page = page.replace(
  /<a class="btn btn-secondary" href="products\.html">Back to products<\/a>/,
  '<a class="btn btn-secondary" href="products.html">Back to products</a>'
);

/* hero spec strip */
page = page.replace(
  /<div class="spec-strip">[\s\S]*?<\/div>\s*(?=<\/div>\s*<div class="product-stage")/,
  `<div class="spec-strip"><div><strong>Available now</strong><span>Launch status</span></div><div><strong>3&ndash;6 weeks</strong><span>Typical delivery</span></div><div><strong>Simulation only</strong><span>Use</span></div></div>`
);

/* product stage image + badge */
page = page.replace(/data-status="Coming Soon"/g, 'data-status="Available"');
page = page.replace(
  /<img src="assets\/images\/unique\/usb-flight-controls[^"]*"([^>]*)alt="[^"]*">/,
  '<img src="assets/images/generated/avionics-panel-project.webp"$1alt="Custom simulator airport scenery rendered from chart and imagery data">'
);
page = page.replace(
  /<source[^>]*srcset="assets\/images\/(?:products|unique)\/usb-flight-controls[^"]*"[^>]*>/g,
  ''
);

/* ---- section 1: what this line covers ------------------------------------ */
page = page.replace(
  /<h2>Scope the right detail\.<\/h2>/,
  '<h2>What a scenery package includes.</h2>'
);
page = page.replace(
  /<p>Home cockpit builders, training benches and compact simulator modules\.<\/p>/,
  '<p>Flight schools, type-familiarisation programmes and home cockpit builders.</p>'
);
page = page.replace(
  /<h3>Control types<\/h3>\s*<p>Joystick grips, yokes, side-sticks, cyclics and throttle quadrants\.<\/p>/,
  '<h3>Aerodrome modelling</h3><p>Runways, taxiways, aprons, stands and buildings modelled to published chart geometry.</p>'
);
page = page.replace(
  /<h3>Inputs<\/h3>\s*<p>Axes, triggers, hats, push-to-talk and switch counts specified per build\.<\/p>/,
  '<h3>Terrain &amp; imagery</h3><p>Elevation mesh and orthoimagery tuned for approach realism without wrecking frame rates.</p>'
);
page = page.replace(
  /<h3>Mounting<\/h3>\s*<p>Desk, panel or custom bracket mounting with cable routing planned around your rig\.<\/p>/,
  '<h3>Lighting &amp; markings</h3><p>Approach lighting, runway and taxiway markings, signage and night configuration.</p>'
);

/* ---- section 2: configuration checklist ---------------------------------- */
page = page.replace(
  /<h2>Start with the details that change the build\.<\/h2>/,
  '<h2>What we need to start a scenery build.</h2>'
);
page = page.replace(
  /<p class="lead">The more specific the brief, the faster the design review\. If you are unsure about a field, say so and the team will help define it\.<\/p>/,
  '<p class="lead">The more of this you can send up front, the faster the first preview comes back. If you only have the ICAO code, that is still enough to begin.</p>'
);
page = page.replace(
  /<ul class="list-check">[\s\S]*?<\/ul>/,
  `<ul class="list-check"><li>ICAO / IATA code and aerodrome name</li><li>Simulator platform and version</li><li>Chart set or AIP source to model from</li><li>Seasons, night lighting and weather variants needed</li><li>Performance target (VR, projector wall, single screen)</li><li>Any custom buildings, hangars or company stands</li></ul>`
);
page = page.replace(
  /<div class="card-kicker">Before launch<\/div>\s*<h3>Send the reference you already have\.<\/h3>/,
  '<div class="card-kicker">Getting started</div><h3>Send the charts you already use.</h3>'
);
page = page.replace(
  /<p>Photos, sketches, screen dimensions, simulator version and the intended mounting location are all useful\. You do not need a finished CAD model to begin\.<\/p>/,
  '<p>AIP charts, aerodrome diagrams, photographs and any survey data all help. We confirm scope, delivery window and price in writing before modelling starts.</p>'
);

/* ---- FAQ ----------------------------------------------------------------- */
page = page.replace(
  /<summary>Will it work with my simulator\?<\/summary>\s*<div class="faq-answer">\s*<p>[\s\S]*?<\/p>/,
  `<summary>Which simulators do you build for?</summary><div class="faq-answer"><p>Microsoft Flight Simulator (2020 and 2024), X-Plane 11/12 and Prepar3D v5/v6. The target platform and version are fixed at quote stage because the scenery format differs between them.</p>`
);
page = page.replace(
  /<summary>Can I order only one control\?<\/summary>\s*<div class="faq-answer">\s*<p>[\s\S]*?<\/p>/,
  `<summary>Can you build an airport that is not in the simulator?</summary><div class="faq-answer"><p>Yes. Most requests are for aerodromes that ship with poor default detail or none at all. We model from published charts and imagery; where a field is not publicly charted we will tell you before quoting.</p>`
);

/* ---- closing CTA --------------------------------------------------------- */
page = page.replace(
  /<h2>Tell us about your simulator\.<\/h2>/,
  '<h2>Tell us which airport you need.</h2>'
);
page = page.replace(
  /<p>We will reply through the FSDC contact channel with clarifying questions, feasibility notes and a quote path\.<\/p>/,
  '<p>Send the ICAO code and your simulator platform. We reply with scope, a delivery window and a fixed quote.</p>'
);

fs.writeFileSync(path.join(ROOT, NEW_PAGE), page, 'utf8');
console.log(`created ${NEW_PAGE} (${page.length} bytes)`);

/* ========================================================================== */
/* 2. Promote ios-software.html to a shipping line                            */
/* ========================================================================== */

const iosPath = path.join(ROOT, 'ios-software.html');
let ios = fs.readFileSync(iosPath, 'utf8');
const iosBefore = ios;

const IOS_TITLE = 'IOS &mdash; Instructor Operating Station &amp; Software | AviCore';
const IOS_DESC = 'AviCore Instructor Operating Station: scenario setup, failure injection, session monitoring and repositioning for flight training devices. Available now.';

ios = ios.replace(/<title>[\s\S]*?<\/title>/, `<title>${IOS_TITLE}</title>`);
ios = ios.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${IOS_DESC}">`);
ios = ios.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${IOS_TITLE}">`);
ios = ios.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${IOS_DESC}">`);
ios = ios.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${IOS_TITLE}">`);
ios = ios.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${IOS_DESC}">`);

ios = ios.replace(/data-status="Coming Soon"/g, 'data-status="Available"');
ios = ios.replace(/<a class="btn btn-primary" href="[^"]*">Join launch updates<\/a>/g,
  '<a class="btn btn-primary" href="quote.html">Request a quote</a>');
ios = ios.replace(/<span class="chip">Coming Soon<\/span>/g, '<span class="chip chip-accent">Available now</span>');

/* hero spec strip: swap the two "Coming Soon" cells for real values */
ios = ios.replace(
  /<div class="spec-strip">[\s\S]*?<\/div>\s*(?=<\/div>\s*<div class="product-stage")/,
  `<div class="spec-strip"><div><strong>Available now</strong><span>Launch status</span></div><div><strong>2&ndash;4 weeks</strong><span>Typical delivery</span></div><div><strong>Simulation only</strong><span>Use</span></div></div>`
);

if (ios !== iosBefore) {
  fs.writeFileSync(iosPath, ios, 'utf8');
  console.log('updated ios-software.html -> Available');
} else {
  console.log('ios-software.html unchanged (check selectors)');
}
