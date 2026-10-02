/**
 * AviCore — add the Enterprise hand-off page.
 *
 * Run:  node tools/add-enterprise-page.mjs
 *
 * AviCore is the compact end of the business: desk-scale controls, printed
 * parts, panels, instructor software and scenery, quoted in weeks. Full-motion
 * simulator programmes belong to the parent, FSDC Aerosolutions.
 *
 * This page makes that boundary explicit rather than letting an enterprise
 * enquiry die in a hobbyist quote form. It is hosted on the AviCore site (so
 * the visitor keeps their context) and hands off to fsdcpak.com.
 *
 * Note on claims: FSDC publishes satisfaction/accuracy percentages on its own
 * site. Those are deliberately NOT reproduced here — this site had fabricated
 * statistics removed on 2026-07-29 and should not carry unverified numbers,
 * even a sister company's. Only capabilities and product families are stated.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SHELL = 'airport-scenery-design.html';   // structurally identical storefront page
const OUT = 'enterprise.html';

const src = fs.readFileSync(path.join(ROOT, SHELL), 'utf8');

const TITLE = 'Enterprise Simulators &mdash; FSDC Aerosolutions | AviCore';
const DESC = 'AviCore covers desk-scale simulator hardware. Full-motion, multi-crew and mission-specific simulator programmes are delivered by our parent company, FSDC Aerosolutions.';
const URL = 'https://www.fsdcpak.com/avicore/enterprise.html';
const IMG = 'https://www.fsdcpak.com/avicore/assets/images/generated/professional-procedure-training.jpg';
const FSDC = 'https://www.fsdcpak.com/';

const MAIN = `<main id="main-content"><section class="detail-hero surface-dark"><div class="container"><div class="detail-hero-grid"><div class="hero-copy"><div class="eyebrow">Enterprise / FSDC Aerosolutions</div><h1>When the project is bigger than a desk</h1><p class="lead">AviCore builds the compact end &mdash; controls, panels, printed parts, instructor software and scenery for single-seat rigs and small training benches. Full-motion, multi-crew and mission-specific simulator programmes are delivered by our parent company, <strong>FSDC Aerosolutions</strong>.</p><div class="chip-row"><span class="chip chip-accent">Full-motion 6-DOF</span><span class="chip">Fixed &amp; rotary wing</span><span class="chip">Academies &amp; defence</span></div><div class="button-row"><a class="btn btn-primary" href="${FSDC}" target="_blank" rel="noopener noreferrer">Visit FSDC Aerosolutions</a><a class="btn btn-secondary" href="contact.html">Not sure which you need?</a></div><div class="spec-strip"><div><strong>Rawalpindi, PK</strong><span>Engineering base</span></div><div><strong>Fixed &amp; rotary</strong><span>Airframe coverage</span></div><div><strong>Simulation only</strong><span>Use</span></div></div></div><div class="product-stage"><picture><img src="assets/images/generated/professional-procedure-training.jpg" width="1200" height="800" loading="eager" decoding="async" fetchpriority="high" alt="Multi-crew simulator training session at an instructor station"></picture><span class="image-note">Illustrative configuration</span></div></div></div></section>

<section class="section surface surface-light"><div class="container"><div class="section-heading"><div><div class="eyebrow">Where the line sits</div><h2>Which side is your project on?</h2></div><p>Both sides are quoted in writing. If you start on the wrong one we will say so and route you.</p></div><div class="split-compare"><article class="compare-card compare-card--avicore"><div class="card-kicker">AviCore</div><h3>Compact builds</h3><p class="compare-lead">Desk rigs, home cockpits, single training benches and classroom stations.</p><ul class="list-check"><li>USB flight controls and custom joysticks</li><li>3D-printed cockpit parts, knobs and guards</li><li>Avionics bezels and switch panels</li><li>Soft gauges and instructor software</li><li>Custom airport and scenery packages</li></ul><div class="compare-meta"><div><strong>Weeks</strong><span>Typical delivery</span></div><div><strong>Component to bench</strong><span>Scope</span></div></div><a class="btn btn-primary" href="quote.html">Request a quote</a></article><article class="compare-card compare-card--fsdc"><div class="card-kicker">FSDC Aerosolutions</div><h3>Full simulator programmes</h3><p class="compare-lead">Complete training devices for aviation academies, training centres and defence operators.</p><ul class="list-check"><li>Full-motion simulators with 6-DOF motion</li><li>Control loading and cockpit fidelity</li><li>Mixed-reality and VR simulators</li><li>Multi-crew and single-pilot airframe series</li><li>Custom solutions built around a specific mission</li></ul><div class="compare-meta"><div><strong>Months</strong><span>Programme length</span></div><div><strong>Complete device</strong><span>Scope</span></div></div><a class="btn btn-secondary" href="${FSDC}" target="_blank" rel="noopener noreferrer">Go to FSDC</a></article></div></div></section>

<section class="section surface-dark"><div class="container"><div class="section-heading"><div><div class="eyebrow">FSDC capability</div><h2>What the parent company builds.</h2></div><p>Summarised from FSDC Aerosolutions. Specifications and availability are confirmed by their team.</p></div><div class="feature-grid"><article class="info-card"><div class="card-icon" aria-hidden="true">01</div><h3>Full-motion simulators</h3><p>Six-degree-of-freedom motion platforms with control loading and cockpit fidelity for type-specific training.</p></article><article class="info-card"><div class="card-icon" aria-hidden="true">02</div><h3>Mixed-reality &amp; VR</h3><p>Photoreal visual systems and headset-based training environments, integrated with motion where the task needs it.</p></article><article class="info-card"><div class="card-icon" aria-hidden="true">03</div><h3>Custom programmes</h3><p>Bespoke development around a specific aircraft and mission profile, including the instructor operating station.</p></article></div><div class="callout-grid"><div class="callout"><div class="card-kicker">Multi-crew series</div><h3>AeroMix</h3><p>Multi-crew training devices, including Super Mushshak and Enstrom 280-FX configurations.</p></div><div class="callout"><div class="card-kicker">Single-pilot series</div><h3>AeroSim Pro</h3><p>Single-pilot devices covering Mushshak MFI-17, Mi-17 and AS-350 / H125 configurations.</p></div></div></div></section>

<section class="section section-tight-top surface-light"><div class="container narrow"><div class="note-box"><strong>Important:</strong> AviCore products are for simulation, training, cockpit familiarisation, prototyping and enthusiast use only. They are not certified aircraft parts, are not official OEM products and are not for installation in a real aircraft. Training-device qualification, where it applies, is handled by FSDC Aerosolutions as part of the relevant programme.</div></div></section>

<section class="section surface surface-dark"><div class="container narrow"><div class="section-heading"><div><div class="eyebrow">Questions</div><h2>Before you choose</h2></div></div><div class="faq-list"><details class="faq-item"><summary>I run a flight school &mdash; which one do I talk to?</summary><div class="faq-answer"><p>Both, potentially. If you want procedure trainers, panel stations or a classroom bench, that is AviCore. If you need a qualified training device for logged hours, that is FSDC. Send the enquiry either way and we will point it to the right team.</p></div></details><details class="faq-item"><summary>Can AviCore parts go into an FSDC simulator?</summary><div class="faq-answer"><p>Yes &mdash; the two share an engineering base in Rawalpindi. Panels, bezels, printed parts and instructor software built by AviCore are regularly specified into larger programmes.</p></div></details><details class="faq-item"><summary>Do you handle export and international delivery?</summary><div class="faq-answer"><p>Yes. Shipping terms, lead time and any documentation required for your destination are confirmed in writing with the quote before anything is built.</p></div></details></div></div></section>

<section class="section surface-light"><div class="container"><div class="split"><div><div class="eyebrow">Next step</div><h2>Tell us the scale and we will route it.</h2><p class="lead">Describe the training task, the number of seats and whether logged credit matters. That is usually enough to tell which side of the line you are on.</p></div><div class="info-card"><div class="card-kicker">Either direction</div><h3>One enquiry, right team.</h3><p>Send it to AviCore and we will pass anything programme-scale to FSDC Aerosolutions with your details, or go direct if you already know.</p><div class="button-row"><a class="btn btn-primary" href="quote.html">Send a brief</a><a class="text-link" href="${FSDC}" target="_blank" rel="noopener noreferrer">Visit FSDC</a></div></div></div></div></section></main>`;

/* ---- assemble from the storefront shell --------------------------------- */
let page = src;

page = page.replace(/<title>[\s\S]*?<\/title>/, `<title>${TITLE}</title>`);
page = page.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${DESC}">`);
page = page.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${URL}">`);
page = page.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${TITLE}">`);
page = page.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${DESC}">`);
page = page.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${URL}">`);
page = page.replace(/<meta property="og:image" content="[^"]*">/g, `<meta property="og:image" content="${IMG}">`);
page = page.replace(/<meta property="og:image:alt" content="[^"]*">/, `<meta property="og:image:alt" content="Multi-crew simulator training session">`);
page = page.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${TITLE}">`);
page = page.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${DESC}">`);
page = page.replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${IMG}">`);
page = page.replace(/<body data-page="[^"]*"/, '<body data-page="enterprise"');

// drop the shell's JSON-LD; a fresh one is generated by add-structured-data.mjs
page = page.replace(/[ \t]*<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/, '');

// swap the body content
page = page.replace(/<main id="main-content">[\s\S]*?<\/main>/, MAIN);

fs.writeFileSync(path.join(ROOT, OUT), page, 'utf8');
console.log(`created ${OUT} (${page.length} bytes)`);

/* ---- nav: add Enterprise as a top-level item ---------------------------- */
const NAV_DESKTOP = `<li class="menu-item">
                            <a href="enterprise.html" class="item-link link1">Enterprise</a>
                        </li>
                        `;
const NAV_MOBILE = `<li><a href="enterprise.html" class="nav-link text-white">Enterprise</a></li>`;

const targets = [
  ...fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).map(f => path.join(ROOT, f)),
  path.join(ROOT, '_partials', 'header.html'),
  path.join(ROOT, '_partials', 'mobile-menu.html'),
].filter(p => fs.existsSync(p));

let navCount = 0;
for (const full of targets) {
  let html = fs.readFileSync(full, 'utf8');
  const before = html;
  if (!html.includes('enterprise.html')) {
    // desktop: right after the Solutions group closes
    html = html.replace(
      /(<li class="menu-item has-child">\s*<a href="solutions\.html"[\s\S]*?<\/ul>\s*<\/li>\s*)/,
      `$1${NAV_DESKTOP}`
    );
    // mobile: after the Solutions block
    html = html.replace(
      /(<li><a href="hobbyists\.html" class="sub-nav-link text-white">Home Cockpit Builders<\/a><\/li>\s*<\/ul>\s*<\/li>)/,
      `$1${NAV_MOBILE}`
    );
  }
  if (html !== before) { fs.writeFileSync(full, html, 'utf8'); navCount++; }
}
console.log(`Enterprise nav item added on ${navCount} files`);

/* ---- sitemaps ----------------------------------------------------------- */
const smPath = path.join(ROOT, 'sitemap.xml');
let sm = fs.readFileSync(smPath, 'utf8');
if (!sm.includes('enterprise.html')) {
  sm = sm.replace(/(\s*)<\/urlset>/, '$1  <url><loc>https://www.fsdcpak.com/avicore/enterprise.html</loc></url>$1</urlset>');
  fs.writeFileSync(smPath, sm, 'utf8');
  console.log('sitemap.xml updated');
}

const shPath = path.join(ROOT, 'sitemap.html');
let sh = fs.readFileSync(shPath, 'utf8');
if (!sh.includes('enterprise.html')) {
  sh = sh.replace(/(<a href="solutions\.html"[^>]*>[^<]*<\/a>)/, '$1</li><li><a href="enterprise.html">Enterprise Solutions (FSDC)</a>');
  fs.writeFileSync(shPath, sh, 'utf8');
  console.log('sitemap.html updated');
}
