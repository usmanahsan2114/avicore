import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SITE_URL = "https://www.fsdcpak.com/avicore";
const YEAR = new Date().getFullYear();

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const productImage = (name, alt, options = {}) => {
  const loading = options.eager ? "eager" : "lazy";
  const fetchPriority = options.eager ? ' fetchpriority="high"' : "";
  const sizes = options.sizes || "(max-width: 620px) 90vw, (max-width: 1050px) 45vw, 360px";
  return `<picture>
    <source type="image/webp" srcset="assets/images/products/${name}-480.webp 480w, assets/images/products/${name}-800.webp 800w, assets/images/products/${name}-1200.webp 1200w" sizes="${sizes}">
    <img src="assets/images/products/${name}.png" width="1200" height="1200" loading="${loading}" decoding="async"${fetchPriority} alt="${esc(alt)}">
  </picture>`;
};

const productData = [
  {
    slug: "usb-flight-controls",
    name: "USB Flight Controls",
    kicker: "Controls / HID",
    category: "controls",
    image: "usb-flight-controls",
    alt: "Illustrative USB flight control set with yoke, cyclic and throttle quadrant",
    description: "Aircraft-inspired joysticks, yokes, cyclics and throttle quadrants that map as standard USB HID devices.",
    title: "USB flight controls for desktop rigs and training devices",
    meta: "AviCore USB flight controls are configurable simulation inputs for hobby cockpits, labs and instructor-led training setups.",
    chips: ["USB HID", "MSFS / P3D / X-Plane", "Made to order"],
    features: [
      ["Control types", "Joystick grips, yokes, side-sticks, cyclics and throttle quadrants."],
      ["Inputs", "Axes, triggers, hats, push-to-talk and switch counts specified per build."],
      ["Mounting", "Desk, panel or custom bracket mounting with cable routing planned around your rig."],
    ],
    configurable: ["Grip or control type", "Axis count and sensor choice", "Buttons, hats and PTT", "Mounting and cable exit", "Simulator mapping brief"],
    bestFor: "Home cockpit builders, training benches and compact simulator modules.",
    faqs: [
      ["Will it work with my simulator?", "The electronics present as USB HID. Final mapping and compatibility are confirmed against your simulator and requested functions before the build is approved."],
      ["Can I order only one control?", "Yes. Single controls and small batches are both scoped through a quote so the mounting and wiring match your setup."],
    ],
  },
  {
    slug: "custom-joystick",
    name: "Custom Joystick",
    kicker: "Controls / Custom",
    category: "controls",
    image: "custom-joystick",
    alt: "Illustrative aircraft-inspired custom USB simulator joystick",
    description: "A configurable grip and base built around the reach, axes and switch layout your aircraft reference calls for.",
    title: "A custom simulator joystick built around your aircraft reference",
    meta: "Specify the grip, axes, buttons and mount; AviCore turns the brief into a simulation-ready control for review and quote.",
    chips: ["Aircraft-specific", "USB HID", "Quote only"],
    features: [
      ["Ergonomics", "Grip geometry, trigger placement and hat positions follow the reach and workflow you describe."],
      ["Electronics", "Hall-effect or other sensor options, button matrix and cable plan are confirmed per design."],
      ["Finish", "Material, colour, labels and mounting are agreed before prototype or production work starts."],
    ],
    configurable: ["Aircraft / control reference", "Grip style and handedness", "Axes and sensors", "Buttons, hats, trim and PTT", "Mount, finish and labels"],
    bestFor: "Home cockpit builders, procedure trainers and integrators needing a control that generic hardware cannot match.",
    faqs: [
      ["Do you need a drawing?", "A drawing helps, but clear photos, measurements and a button-layout sketch are enough to begin a design review."],
      ["Is this an aircraft-certified part?", "No. It is simulation, training and prototyping hardware only, never for installation in a real aircraft."],
    ],
  },
  {
    slug: "printed-parts",
    name: "3D Printed Cockpit Parts",
    kicker: "Components / Small batch",
    category: "components",
    image: "printed-cockpit-parts",
    alt: "Illustrative 3D printed cockpit knobs, switch guards, brackets and housings",
    description: "Small-batch knobs, handles, guards, housings and mounts produced from your dimensions, drawings or reference photos.",
    title: "3D printed cockpit parts for small builds and prototypes",
    meta: "AviCore produces simulation-focused FDM and resin components for hobby rigs, teaching aids and integration prototypes.",
    chips: ["FDM / resin", "Small batch", "Reference-led"],
    features: [
      ["Part families", "Knobs, levers, switch guards, housings, bezels, brackets, mounts and cable clips."],
      ["Materials", "Material choice is matched to geometry, finish, heat exposure and the intended simulation environment."],
      ["Reference-led", "Send dimensions, photos, sketches or an existing part for a feasibility review."],
    ],
    configurable: ["Part type and quantity", "Reference photos or CAD", "Material and finish", "Fasteners and mounting", "Colour and labels"],
    bestFor: "Home cockpit builders, student projects, training aids and low-volume integration work.",
    faqs: [
      ["Can you reproduce an existing knob?", "We can review a reference and create a simulation-use equivalent. Final geometry and trademarked markings are confirmed with you."],
      ["Do you sell individual parts?", "Yes. Small quantities are welcome; quote the part count and any shared tooling or finishing needs."],
    ],
  },
  {
    slug: "avionics-bezels",
    name: "Avionics Bezels",
    kicker: "Avionics / Display fit",
    category: "components",
    image: "avionics-bezel",
    alt: "Illustrative generic glass-cockpit avionics display bezel with soft keys",
    description: "Training-focused display surrounds sized to your screen, with soft-key and encoder placement agreed around the target layout.",
    title: "Display bezels that make a simulator screen feel like a panel",
    meta: "AviCore makes generic and aircraft-style training bezels for PFD/MFD displays. Final dimensions follow your screen and mounting plan.",
    chips: ["PFD / MFD", "Screen fit", "Training use"],
    features: [
      ["Screen fit", "7 to 12 inch class displays and custom dimensions can be reviewed against your actual hardware."],
      ["Controls", "Soft keys, encoders, mounting tabs and cable openings are added only when your brief calls for them."],
      ["Style", "G1000-style and IDU-680-style references are treated as training-layout inspiration, not official OEM parts."],
    ],
    configurable: ["Display make and dimensions", "Button / encoder count", "Mounting and rear clearance", "Material and finish", "Optional HID wiring"],
    bestFor: "Glass-cockpit trainers, home panels, educational labs and integrators building compact display modules.",
    faqs: [
      ["Can you match my screen opening exactly?", "Yes. Share the screen model or measured opening, plus the panel thickness and mounting constraints."],
      ["Is it a Garmin or Genesys product?", "No. AviCore products are independent simulation hardware. Brand names are used only to describe a training-style reference."],
    ],
  },
  {
    slug: "cockpit-panels",
    name: "Simulator Panels",
    kicker: "Panels / Switches",
    category: "components",
    image: "simulator-panel",
    alt: "Illustrative simulator switch and annunciator panel with USB cable",
    description: "Aircraft-layout switch, autopilot, radio and annunciator panels with backlighting and USB or interface wiring scoped per build.",
    title: "Compact simulator panels for switches, radios and annunciators",
    meta: "Build a focused panel for a desk rig, classroom trainer or larger cockpit integration without ordering a complete simulator shell.",
    chips: ["Switch panels", "Backlit options", "Panel mount"],
    features: [
      ["Panel types", "Switch, autopilot, radio, annunciator and custom fascia layouts."],
      ["Interfaces", "USB HID, MIDI or a project-specific interface can be evaluated against your simulator stack."],
      ["Build details", "Face material, labels, backlight colour, connector access and rear clearance are designed together."],
    ],
    configurable: ["Aircraft layout / panel area", "Switch and encoder count", "Backlight and labels", "Interface requirement", "Mounting and harness"],
    bestFor: "Simulator builders, training departments, university labs and advanced hobby cockpits.",
    faqs: [
      ["Can you build one small panel?", "Yes. Small panels are a core use case; the quote will make the interface and mounting assumptions explicit."],
      ["Do panels include simulator software?", "Hardware and software can be scoped together, but the final interface depends on your simulator platform and integration brief."],
    ],
  },
  {
    slug: "ios-software",
    name: "IOS Software",
    kicker: "Software / Instructor",
    category: "software",
    image: "ios-console",
    alt: "Illustrative instructor operating station console with map, weather and failure controls",
    description: "A focused instructor operating station for scenario setup, repositioning, monitored sessions and scoped failure controls.",
    title: "An instructor station sized to the training workflow you actually use",
    meta: "AviCore IOS work is scoped to the simulator interface, instructor workflow and platform integration available in your programme.",
    chips: ["Scenario control", "Failure workflows", "Integration scoped"],
    features: [
      ["Session control", "Scenario setup, aircraft repositioning, weather and time-of-day controls where the platform exposes them."],
      ["Failure workflows", "Normal and abnormal training controls are defined with the instructor team, not assumed from a template."],
      ["Debrief support", "Session logging and export requirements can be included in the integration plan."],
    ],
    configurable: ["Simulator engine and version", "Instructor roles", "Scenario and failure list", "Network / tablet target", "Logging and export needs"],
    bestFor: "Flight schools, simulator builders and professional training teams that need a compact control surface.",
    faqs: [
      ["Is this an off-the-shelf app?", "No. IOS is quoted around the simulator interface and training workflow, then demonstrated against the agreed scope."],
      ["Can it run on a browser tablet?", "A browser or local-app target can be reviewed, depending on the simulator integration and network constraints."],
    ],
  },
  {
    slug: "soft-gauges",
    name: "Soft Gauges",
    kicker: "Software / Displays",
    category: "software",
    image: "soft-gauges",
    alt: "Illustrative soft-gauge monitor with attitude, tapes, engine bars and round instruments",
    description: "Software-rendered PFD, MFD, engine and round-gauge layouts for compact panels and teaching displays.",
    title: "Soft gauges for compact panels and simulator displays",
    meta: "AviCore soft-gauge layouts are designed around your screen, simulator data source and the instrument set your training scenario needs.",
    chips: ["PFD / MFD", "Engine gauges", "Layout scoped"],
    features: [
      ["Display families", "PFD, MFD, engine indications, six-pack, EFIS-style and custom instrument groupings."],
      ["Data path", "Air Manager, SimConnect or another project interface can be evaluated during scoping."],
      ["Screen fit", "Resolution, aspect ratio, bezel opening and touch or non-touch use shape the final layout."],
    ],
    configurable: ["Screen size and resolution", "Instrument set", "Data source and simulator", "Theme and colour", "Touch / non-touch workflow"],
    bestFor: "Home cockpits, procedure trainers, classroom displays and simulator integrators.",
    faqs: [
      ["Are these real instrument screenshots?", "The image on this page is an illustrative configuration. Final gauge visuals are produced and reviewed as part of the scoped software work."],
      ["Can I use a small HDMI display?", "Yes, the display size and resolution are part of the brief; compatibility is confirmed before implementation."],
    ],
  },
];

const navItems = [
  ["home", "Home", "index.html"],
  ["products", "Shop", "products.html"],
  ["solutions", "For professionals", "solutions.html"],
  ["about", "About", "about.html"],
  ["support", "Support", "support.html"],
];

function currentNav(key, pageKey) {
  if (key === "products" && ["products", "configure", ...productData.map((p) => p.slug)].includes(pageKey)) return true;
  if (key === "support" && ["support", "faq", "downloads"].includes(pageKey)) return true;
  return key === pageKey;
}

function header(pageKey) {
  const links = navItems.map(([key, label, href]) => `<a href="${href}"${currentNav(key, pageKey) ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  return `<a class="skip-link" href="#main-content">Skip to content</a>
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="index.html" aria-label="AviCore home">
      <span class="brand-symbol" aria-hidden="true">A</span>
      <span class="brand-copy"><span class="brand-name">Avi<span>Core</span></span><span class="brand-tagline">Compact flight simulation systems</span></span>
    </a>
    <nav class="desktop-nav" aria-label="Primary navigation">${links}<a class="btn btn-primary btn-small" href="quote.html">Get a quote</a></nav>
    <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-nav" aria-label="Open navigation"><span class="menu-toggle-lines" aria-hidden="true"></span></button>
  </div>
  <nav class="mobile-nav" id="mobile-nav" data-mobile-nav aria-label="Mobile navigation">${links}<a class="btn btn-primary" href="quote.html">Get a quote</a></nav>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-intro"><a class="brand" href="index.html" aria-label="AviCore home"><span class="brand-symbol" aria-hidden="true">A</span><span class="brand-copy"><span class="brand-name">Avi<span>Core</span></span><span class="brand-tagline">Compact flight simulation systems</span></span></a><p>Smaller aviation and flight-simulation hardware for hobbyists, educators, training teams and integrators.</p></div>
    <div><div class="footer-title">Shop</div><ul class="footer-links"><li><a href="products.html">All product lines</a></li><li><a href="custom-joystick.html">Custom joystick</a></li><li><a href="configure-joystick.html">Configure a control</a></li><li><a href="quote.html">Request a quote</a></li></ul></div>
    <div><div class="footer-title">Explore</div><ul class="footer-links"><li><a href="solutions.html">For professionals</a></li><li><a href="about.html">About AviCore</a></li><li><a href="support.html">Support</a></li><li><a href="downloads.html">Downloads</a></li></ul></div>
    <div><div class="footer-title">Contact</div><ul class="footer-links"><li><a href="mailto:info@fsdcpak.com">info@fsdcpak.com</a></li><li><a href="tel:+92515177639">+92 51 5177639</a></li><li>Rawalpindi, Pakistan</li><li>Mon–Fri, 9:00–16:00 PKT</li></ul></div>
  </div>
  <div class="container footer-bottom"><div class="footer-bottom-links"><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="disclaimer.html">Disclaimer</a><a href="sitemap.html">Sitemap</a></div><span>© <span data-current-year>${YEAR}</span> AviCore. Built with FSDC Aerosolutions.</span></div>
</footer>`;
}

function head({ title, description, pageKey, image = "custom-joystick", noindex = false, schema = null }) {
  const file = pageKey === "home" ? "" : `${pageKey}.html`;
  const canonical = `${SITE_URL}/${file}`.replace(/\/$/, pageKey === "home" ? "/" : "");
  const imageUrl = `${SITE_URL}/assets/images/products/${image}-1200.webp`;
  const graph = schema || { "@context": "https://schema.org", "@type": "WebPage", name: title, url: canonical, description };
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#07111f">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${imageUrl}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${imageUrl}">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : `<link rel="canonical" href="${canonical}">`}
<link rel="icon" href="assets/images/logo/avicore-favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/css/storefront.css"><link rel="stylesheet" href="assets/css/legacy-avicore.css">
<script type="application/ld+json">${JSON.stringify(graph)}</script></head><body data-page="${pageKey}">${header(pageKey)}
`;
}

function layout(options, main) {
  return `${head(options)}<main id="main-content">${main}</main>${footer()}<script src="assets/js/storefront.js?v=20260728-2" defer></script></body></html>`;
}

function partnerBar() {
  return `<div class="partner-bar"><div class="container partner-inner"><span class="partner-label">In partnership with</span><span class="partner-divider" aria-hidden="true"></span><a class="partner-name" href="https://www.fsdcpak.com/" target="_blank" rel="noopener noreferrer">FSDC <span>Aerosolutions</span></a><span class="partner-label">Flight-simulator engineering division</span></div></div>`;
}

function chips(items) { return `<div class="chip-row">${items.map((item, i) => `<span class="chip${i === 0 ? " chip-accent" : ""}">${esc(item)}</span>`).join("")}</div>`; }

function productCard(p) {
  return `<article class="product-card" data-category="${p.category}"><div class="product-media">${productImage(p.image, p.alt)}<span class="image-note">Illustrative configuration</span></div><div class="product-body"><div class="card-kicker">${esc(p.kicker)}</div><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p>${chips(p.chips)}<a class="text-link" href="${p.slug}.html">View product line</a></div></article>`;
}

function featureCards(items) { return `<div class="feature-grid">${items.map(([title, text], i) => `<article class="info-card"><div class="card-icon" aria-hidden="true">${String(i + 1).padStart(2, "0")}</div><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join("")}</div>`; }

function faqList(items) { return `<div class="faq-list">${items.map(([question, answer]) => `<details class="faq-item"><summary>${esc(question)}</summary><div class="faq-answer"><p>${esc(answer)}</p></div></details>`).join("")}</div>`; }

function inquiryForm(type = "Quote request", configurator = false) {
  const controlFields = configurator ? `<div class="field"><label for="control-type">Control type</label><select id="control-type" name="control_type" required><option value="">Choose one</option><option>Joystick grip</option><option>Yoke</option><option>Side-stick</option><option>Helicopter cyclic</option><option>Throttle quadrant</option><option>Other</option></select></div><div class="field"><label for="mounting">Mounting</label><select id="mounting" name="mounting"><option value="">Choose one</option><option>Desk / clamp</option><option>Panel mount</option><option>Custom bracket</option><option>Not sure yet</option></select></div><div class="field"><label for="axes">Axes and sensors</label><input id="axes" name="axes" placeholder="e.g. pitch, roll, yaw; sensor preference"></div><div class="field"><label for="buttons">Buttons and hats</label><input id="buttons" name="buttons" placeholder="e.g. trigger, trim hat, PTT"></div>` : "";
  return `<form class="form-card form-grid" action="api/submit-inquiry.php" method="post" enctype="multipart/form-data" data-avicore-form><input type="hidden" name="form_type" value="${esc(type)}"><input type="hidden" name="form_started_at" value=""><div class="honeypot"><label>Company website<input name="company_website" tabindex="-1" autocomplete="off"></label></div><div class="field"><label for="inquiry-name">Name *</label><input id="inquiry-name" name="name" autocomplete="name" required placeholder="Your name"></div><div class="field"><label for="inquiry-email">Email *</label><input id="inquiry-email" name="email" type="email" autocomplete="email" required placeholder="you@example.com"></div><div class="field"><label for="inquiry-phone">Phone / WhatsApp</label><input id="inquiry-phone" name="phone" autocomplete="tel" placeholder="Optional"></div><div class="field"><label for="inquiry-organization">Organisation</label><input id="inquiry-organization" name="organization" autocomplete="organization" placeholder="Optional"></div>${controlFields}<div class="field"><label for="inquiry-platform">Simulator platform</label><select id="inquiry-platform" name="platform"><option value="">Choose one</option><option>MSFS</option><option>Prepar3D</option><option>X-Plane</option><option>DCS</option><option>Other / custom</option></select></div><div class="field"><label for="inquiry-aircraft">Aircraft / project</label><input id="inquiry-aircraft" name="aircraft" placeholder="Aircraft type or project name"></div><div class="field field-full"><label for="inquiry-message">What should we build? *</label><textarea id="inquiry-message" name="message" required placeholder="Share the product line, dimensions, functions, quantity and timing you have in mind."></textarea></div><div class="field field-full"><label for="inquiry-attachment">Reference file</label><input id="inquiry-attachment" name="attachment" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.dxf,.dwg"><div class="field-hint" data-file-hint>PDF, JPG, PNG, WebP, DOCX, DXF or DWG up to 8 MB.</div></div><div class="field field-full field-checkbox"><input id="inquiry-consent" name="consent" type="checkbox" value="yes" required><label for="inquiry-consent">I agree that AviCore may use these details to reply to this enquiry. See the <a class="text-link" href="privacy.html">privacy notice</a>.</label></div><div class="form-actions"><button class="btn btn-primary" type="submit">Send enquiry</button><p class="form-status" data-form-status aria-live="polite"></p></div></form>`;
}

function homePage() {
  const schema = { "@context": "https://schema.org", "@type": "Organization", name: "AviCore Simulation Technologies", url: SITE_URL, description: "Compact aviation simulation hardware and software for hobbyists, educators, training teams and integrators.", contactPoint: { "@type": "ContactPoint", email: "info@fsdcpak.com", telephone: "+92 51 5177639", contactType: "customer service" }, sameAs: ["https://www.fsdcpak.com/"] };
  return layout({ pageKey: "home", title: "AviCore | Compact Flight Simulation Hardware & Software", description: "AviCore builds smaller aviation simulation hardware and software for hobbyists, educators, training teams and integrators, in partnership with FSDC Aerosolutions.", image: "custom-joystick", schema }, `<section class="hero"><div class="container hero-grid"><div class="hero-copy"><div class="eyebrow">Compact systems / serious simulation</div><h1>Flight-sim hardware, sized for real-world setups.</h1><p class="lead">AviCore makes smaller aviation and flight-simulation products that fit a desk rig, teaching bench or professional training module—from USB controls and cockpit parts to displays and instructor software.</p><div class="button-row"><a class="btn btn-primary" href="products.html">Shop the range</a><a class="btn btn-secondary" href="configure-joystick.html">Configure a control</a></div><div class="chip-row"><span class="chip chip-accent">Simulation use only</span><span class="chip">Made to order</span><span class="chip">Quote-led custom builds</span></div><div class="proof-grid"><div class="proof-item"><strong>USB HID</strong><span>Simple mapping for compatible sims</span></div><div class="proof-item"><strong>Small-batch</strong><span>Parts and panels without full-system scale</span></div><div class="proof-item"><strong>Engineer-reviewed</strong><span>Every custom brief starts with a real spec</span></div></div></div><div class="hero-art">${productImage("custom-joystick", "Illustrative custom USB simulator joystick", { eager: true, sizes: "(max-width: 860px) 92vw, 44vw" })}<span class="image-note">Illustrative configuration · final build follows approved spec</span></div></div></section>${partnerBar()}<section class="section"><div class="container"><div class="section-heading"><div><div class="eyebrow">The AviCore range</div><h2>Small products. Serious cockpit detail.</h2></div><div><p>Choose a focused product line for your next build, then use the quote flow to pin down dimensions, interfaces, quantity and finish.</p><a class="text-link" href="products.html">See all product lines</a></div></div><div class="product-grid">${productData.map(productCard).join("")}</div></div></section><section class="section surface"><div class="container split"><div><div class="eyebrow">For builders and professionals</div><h2>From a single bracket to a complete instructor module.</h2><p class="lead">AviCore sits between generic hobby hardware and a full-flight-simulator programme. That means you can buy the missing component, ask for a custom control, or scope an integrated panel with the engineering team.</p><ul class="list-check"><li>Home cockpit builders who need a specific fit</li><li>Schools and universities building focused training stations</li><li>Integrators and simulator builders adding a compact module</li></ul><div class="button-row"><a class="btn btn-secondary" href="solutions.html">Explore professional use</a><a class="text-link" href="https://www.fsdcpak.com/" target="_blank" rel="noopener noreferrer">Meet our FSDC partner</a></div></div><div class="product-stage">${productImage("simulator-panel", "Illustrative compact simulator panel", { sizes: "(max-width: 860px) 92vw, 42vw" })}<span class="image-note">Panel, labels and interface are scoped per project</span></div></div></section><section class="section"><div class="container"><div class="section-heading"><div><div class="eyebrow">How it works</div><h2>Clear from first message to final fit.</h2></div><p>Every quote is based on a brief you can review. No invented stock status, no mystery subscription tier and no claim that a concept render is a finished production unit.</p></div><div class="process-grid"><article class="process-card"><div class="step-number">01</div><h3>Brief</h3><p>Share the aircraft reference, simulator platform, functions, dimensions and quantity.</p></article><article class="process-card"><div class="step-number">02</div><h3>Design review</h3><p>We confirm feasibility, interfaces, materials, mounting and the information still needed.</p></article><article class="process-card"><div class="step-number">03</div><h3>Prototype or quote</h3><p>Choose a prototype route or approve a quote for the agreed build and delivery scope.</p></article><article class="process-card"><div class="step-number">04</div><h3>Build and support</h3><p>Receive the hardware or software package with the mapping and support notes agreed in writing.</p></article></div></div></section><section class="section section-tight-top"><div class="container callout"><div class="callout-grid"><div><div class="eyebrow">Have a reference photo?</div><h2>Tell us what your simulator is missing.</h2><p>Send a sketch, measurement, photo or simple description. The team will reply with the right product path or a custom-build recommendation.</p></div><div class="button-row"><a class="btn btn-primary" href="quote.html">Start a quote</a><a class="btn btn-secondary" href="contact.html">Contact the team</a></div></div></div></section>`);
}

function productsPage() {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "AviCore product lines", url: `${SITE_URL}/products.html`, description: "AviCore compact flight-simulation hardware and software product lines." };
  return layout({ pageKey: "products", title: "Product Lines | AviCore Compact Flight Simulation Hardware", description: "Browse AviCore USB controls, custom joysticks, 3D printed cockpit parts, avionics bezels, simulator panels, IOS software and soft gauges.", image: "usb-flight-controls", schema }, `<section class="detail-hero"><div class="container detail-hero-grid"><div class="hero-copy"><div class="eyebrow">Product lines</div><h1>Build the part of the cockpit you actually need.</h1><p class="lead">Seven focused product lines cover the hardware and software most smaller simulator projects need. Images are illustrative configurations; dimensions, interface and finish are confirmed in the quote.</p><div class="button-row"><a class="btn btn-primary" href="quote.html">Request a quote</a><a class="btn btn-secondary" href="configure-joystick.html">Configure a joystick</a></div></div><div class="product-stage">${productImage("usb-flight-controls", "Illustrative USB flight control set", { eager: true, sizes: "(max-width: 860px) 92vw, 38vw" })}<span class="image-note">Illustrative configuration</span></div></div></section><section class="section surface"><div class="container"><div class="section-heading"><div><div class="eyebrow">Browse by use</div><h2>Shop the range</h2></div><p>Filter the catalogue without losing the context of what each line is for.</p></div><div class="filter-bar" data-product-filters role="group" aria-label="Filter product lines"><button class="filter-button" type="button" data-filter="all" aria-pressed="true">All</button><button class="filter-button" type="button" data-filter="controls" aria-pressed="false">Controls</button><button class="filter-button" type="button" data-filter="components" aria-pressed="false">Components</button><button class="filter-button" type="button" data-filter="software" aria-pressed="false">Software</button></div><p class="filter-status" data-filter-status aria-live="polite">7 product lines shown</p><div class="product-grid" data-product-grid>${productData.map(productCard).join("")}</div></div></section><section class="section"><div class="container split"><div><div class="eyebrow">Custom control builder</div><h2>Need a control with your grip, axes and mounting?</h2><p class="lead">Use the configurator to give the engineering team a useful first brief. It is not a checkout; it creates a build request that can be reviewed and quoted.</p><div class="button-row"><a class="btn btn-primary" href="configure-joystick.html">Open configurator</a><a class="text-link" href="custom-joystick.html">See custom joystick details</a></div></div><div class="product-stage">${productImage("joystick-configurator", "Illustrative joystick configuration interface", { sizes: "(max-width: 860px) 92vw, 42vw" })}<span class="image-note">Illustrative interface concept</span></div></div></section>`);
}

function detailPage(p) {
  const schema = { "@context": "https://schema.org", "@type": "Product", name: `AviCore ${p.name}`, description: p.meta, brand: { "@type": "Brand", name: "AviCore" }, category: p.kicker, image: [`${SITE_URL}/assets/images/products/${p.image}-1200.webp`] };
  return layout({ pageKey: p.slug, title: `${p.name} | AviCore Simulation Hardware & Software`, description: p.meta, image: p.image, schema }, `<section class="detail-hero"><div class="container detail-hero-grid"><div class="hero-copy"><div class="eyebrow">${esc(p.kicker)}</div><h1>${esc(p.title)}</h1><p class="lead">${esc(p.meta)}</p>${chips(p.chips)}<div class="button-row"><a class="btn btn-primary" href="quote.html">Request a quote</a><a class="btn btn-secondary" href="products.html">Back to products</a></div><div class="spec-strip"><div><strong>Build path</strong><span>Quote confirmed</span></div><div><strong>Availability</strong><span>Made to order</span></div><div><strong>Use</strong><span>Simulation only</span></div></div></div><div class="product-stage">${productImage(p.image, p.alt, { eager: true, sizes: "(max-width: 860px) 92vw, 38vw" })}<span class="image-note">Illustrative configuration</span></div></div></section><section class="section surface"><div class="container"><div class="section-heading"><div><div class="eyebrow">What this line covers</div><h2>Scope the right detail.</h2></div><p>${esc(p.bestFor)}</p></div>${featureCards(p.features)}</div></section><section class="section"><div class="container split"><div><div class="eyebrow">Configuration checklist</div><h2>Start with the details that change the build.</h2><p class="lead">The more specific the brief, the faster the design review. If you are unsure about a field, say so and the team will help define it.</p><ul class="list-check">${p.configurable.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div><div class="info-card"><div class="card-kicker">Before you request a quote</div><h3>Send the reference you already have.</h3><p>Photos, sketches, screen dimensions, simulator version and the intended mounting location are all useful. You do not need a finished CAD model to begin.</p><div class="button-row"><a class="btn btn-primary" href="quote.html">Send a brief</a><a class="text-link" href="contact.html">Ask a question</a></div></div></div></section><section class="section section-tight-top"><div class="container narrow"><div class="note-box"><strong>Important:</strong> AviCore products are for simulation, training, cockpit familiarisation, prototyping and enthusiast use only. They are not certified aircraft parts, are not official OEM products and are not for installation in a real aircraft. Generated images on this site are illustrative configurations; the approved quote and drawings define the deliverable.</div></div></section><section class="section surface"><div class="container narrow"><div class="section-heading"><div><div class="eyebrow">Questions</div><h2>Before you start</h2></div></div>${faqList(p.faqs)}</div></section><section class="section section-tight-top"><div class="container callout"><div class="callout-grid"><div><div class="eyebrow">Next step</div><h2>Tell us about your simulator.</h2><p>We will reply through the FSDC contact channel with clarifying questions, feasibility notes and a quote path.</p></div><a class="btn btn-primary" href="quote.html">Request a quote</a></div></div></section>`);
}

function configurePage() {
  return layout({ pageKey: "configure", title: "Configure a Custom Joystick | AviCore", description: "Send AviCore an aircraft-specific joystick brief with control type, axes, buttons, mounting and simulator platform details.", image: "joystick-configurator" }, `<section class="detail-hero"><div class="container detail-hero-grid"><div class="hero-copy"><div class="eyebrow">Custom control builder</div><h1>Give us a useful first joystick brief.</h1><p class="lead">Choose the control style and list the functions you need. This form sends a build request to the engineering team; it does not charge you or promise stock.</p><div class="button-row"><a class="btn btn-secondary" href="custom-joystick.html">Read joystick details</a><a class="text-link" href="quote.html">Use a general quote form</a></div></div><div class="product-stage">${productImage("joystick-configurator", "Illustrative joystick configuration interface", { eager: true, sizes: "(max-width: 860px) 92vw, 38vw" })}<span class="image-note">Illustrative interface concept</span></div></div></section><section class="section surface"><div class="container form-layout"><div><div class="eyebrow">Step 1 / send the brief</div><h2>Configure the input, then let us validate the details.</h2><p class="lead">If a field does not apply, choose “not sure” or describe the decision in the message. Photos and drawings can be attached.</p><ul class="list-check"><li>Aircraft type or reference</li><li>Axes, sensors, hats and buttons</li><li>Mounting, cable exit and finish</li><li>Simulator platform and use case</li></ul></div>${inquiryForm("Custom joystick configuration", true)}</div></section><section class="section"><div class="container narrow"><div class="note-box"><strong>Simulation use only:</strong> the resulting joystick is a simulation control, not a certified flight control. Final scope, lead time and price are stated in the written quote.</div></div></section>`);
}

function solutionsPage() {
  return layout({ pageKey: "solutions", title: "For Professionals & Home Cockpit Builders | AviCore", description: "AviCore supports flight schools, simulator builders, universities, training teams and home cockpit builders with compact simulation hardware and software." }, `<section class="detail-hero"><div class="container detail-hero-grid"><div class="hero-copy"><div class="eyebrow">For professionals and builders</div><h1>Compact modules for the way your team trains.</h1><p class="lead">AviCore fills the gap between generic desktop hardware and a complete simulator programme. Pick the module, interface or part that makes your setup more useful.</p><div class="button-row"><a class="btn btn-primary" href="quote.html">Talk to engineering</a><a class="btn btn-secondary" href="products.html">Browse products</a></div></div><div class="product-stage">${productImage("ios-console", "Illustrative instructor operating station console", { eager: true, sizes: "(max-width: 860px) 92vw, 38vw" })}<span class="image-note">Illustrative software configuration</span></div></div></section><section class="section surface"><div class="container"><div class="section-heading"><div><div class="eyebrow">Who we help</div><h2>One small module can unblock a whole project.</h2></div></div><div class="audience-grid"><article class="audience-card"><div class="card-kicker">Home cockpit builders</div><h3>Make the desk rig feel intentional.</h3><p>Get the exact knob, bracket, bezel, control or panel your generic hardware cannot provide.</p><a class="text-link" href="products.html">Shop hardware</a></article><article class="audience-card"><div class="card-kicker">Schools and universities</div><h3>Build focused training stations.</h3><p>Keep a teaching bench affordable and modular with panels, controls, displays and scoped software.</p><a class="text-link" href="quote.html">Plan a station</a></article><article class="audience-card"><div class="card-kicker">Integrators and builders</div><h3>Add a module without reworking the system.</h3><p>Share the interface, mounting and data requirements early so the compact component fits the wider simulator.</p><a class="text-link" href="contact.html">Discuss integration</a></article></div></div></section><section class="section"><div class="container split"><div><div class="eyebrow">Working with FSDC Aerosolutions</div><h2>A compact product partner for a full-simulator engineering team.</h2><p class="lead">FSDC Aerosolutions designs and supports larger fixed-wing, rotary-wing and mixed-reality simulator programmes. AviCore is the smaller-product route for the parts, controls and software modules that sit around that work.</p><div class="button-row"><a class="btn btn-secondary" href="https://www.fsdcpak.com/" target="_blank" rel="noopener noreferrer">Visit FSDC Aerosolutions</a></div></div><div class="info-card"><div class="card-kicker">Project handoff</div><h3>Bring the constraints, not a perfect spec.</h3><p>Aircraft reference, platform, dimensions, quantity and target use are enough for a first conversation. The quote records what is confirmed and what still needs review.</p></div></div></section>`);
}

function aboutPage() {
  return layout({ pageKey: "about", title: "About AviCore | Compact Simulation Systems", description: "AviCore is a compact-product partner of FSDC Aerosolutions, focused on smaller aviation simulation hardware and software for hobbyists and professionals." }, `<section class="detail-hero"><div class="container detail-hero-grid"><div class="hero-copy"><div class="eyebrow">About AviCore</div><h1>The useful middle ground in flight simulation.</h1><p class="lead">AviCore focuses on the smaller hardware and software pieces that make a simulator easier to build, teach with and maintain: controls, panels, bezels, printed parts, gauges and instructor tools.</p><div class="button-row"><a class="btn btn-primary" href="products.html">Explore products</a><a class="btn btn-secondary" href="https://www.fsdcpak.com/about/" target="_blank" rel="noopener noreferrer">About our FSDC partner</a></div></div><div class="product-stage">${productImage("printed-cockpit-parts", "Illustrative 3D printed cockpit components", { eager: true, sizes: "(max-width: 860px) 92vw, 38vw" })}<span class="image-note">Illustrative configuration</span></div></div></section><section class="section surface"><div class="container split"><div><div class="eyebrow">The relationship</div><h2>Built alongside a proven simulator engineering ecosystem.</h2><p class="lead">AviCore is a partner of FSDC Aerosolutions. The relationship gives smaller simulator projects a clear route to the same kind of engineering conversation used in larger training programmes—without pretending a hobby product is a certified aircraft component.</p></div><div class="info-card"><div class="card-kicker">FSDC Aerosolutions</div><h3>Full-motion, mixed-reality and custom simulator engineering.</h3><p>FSDC is based in Rawalpindi, Pakistan. For full simulator programmes, demos and professional training solutions, visit the official FSDC website.</p><a class="text-link" href="https://www.fsdcpak.com/" target="_blank" rel="noopener noreferrer">Open fsdcpak.com</a></div></div></section><section class="section"><div class="container"><div class="section-heading"><div><div class="eyebrow">What we value</div><h2>Specific, honest and easy to review.</h2></div></div>${featureCards([["Specific briefs", "We ask for the dimensions, interface and use case that actually change the product."],["Modular builds", "Small hardware and software modules can be ordered alone or scoped into a larger station."],["Clear boundaries", "Simulation, training and prototyping use only; certifications and aircraft installation are outside the product scope."]])}</div></section>`);
}

function contactPage() {
  return layout({ pageKey: "contact", title: "Contact AviCore | Flight Simulation Hardware Enquiries", description: "Contact AviCore through the FSDC Aerosolutions channel about compact flight simulation hardware, software, custom parts and training modules." }, `<section class="detail-hero"><div class="container narrow"><div class="hero-copy"><div class="eyebrow">Contact</div><h1>Start with the part of the setup you can describe.</h1><p class="lead">Send a product question, reference photo or integration brief. The team will reply through the FSDC Aerosolutions contact channel.</p></div></div></section><section class="section surface"><div class="container form-layout"><div><div class="eyebrow">Verified contact channel</div><h2>Talk to the team.</h2><p class="muted">AviCore enquiries are handled through FSDC Aerosolutions in Rawalpindi, Pakistan.</p><ul class="contact-list"><li><strong>Email</strong><br><a href="mailto:info@fsdcpak.com">info@fsdcpak.com</a></li><li><strong>Phone</strong><br><a href="tel:+92515177639">+92 51 5177639</a></li><li><strong>Hours</strong><br><span class="muted">Monday–Friday, 9:00–16:00 PKT</span></li><li><strong>Location</strong><br><span class="muted">Rawalpindi, Pakistan</span></li></ul></div>${inquiryForm("General contact enquiry")}</div></section>`);
}

function quotePage() {
  return layout({ pageKey: "quote", title: "Request a Quote | AviCore Simulation Hardware", description: "Request an AviCore quote for USB flight controls, printed cockpit parts, avionics bezels, simulator panels, IOS software or soft gauges." }, `<section class="detail-hero"><div class="container narrow"><div class="hero-copy"><div class="eyebrow">Quote request</div><h1>Give the build a clear starting point.</h1><p class="lead">The more useful the brief, the more useful the reply. Include dimensions, functions, platform, quantity, destination and any reference files you have.</p></div></div></section><section class="section surface"><div class="container form-layout"><div><div class="eyebrow">What happens next</div><h2>One secure form, one written response.</h2><ul class="list-check"><li>Your enquiry is stored with a reference number</li><li>Reference files stay attached to the enquiry</li><li>Feasibility, scope, lead time and price are confirmed in writing</li><li>No payment is taken through this form</li></ul></div>${inquiryForm("Quote request")}</div></section>`);
}

function supportPage() {
  return layout({ pageKey: "support", title: "Support | AviCore Flight Simulation Products", description: "Support guidance for AviCore USB controls, cockpit parts, panels, displays and software modules." }, `<section class="detail-hero"><div class="container detail-hero-grid"><div class="hero-copy"><div class="eyebrow">Support</div><h1>Keep the simulator useful after the build.</h1><p class="lead">Most support questions start with a mapping, mounting, display or integration detail. Share the setup and the symptom so the reply can be specific.</p><div class="button-row"><a class="btn btn-primary" href="contact.html">Open a support enquiry</a><a class="btn btn-secondary" href="faq.html">Read FAQs</a></div></div><div class="product-stage">${productImage("soft-gauges", "Illustrative soft-gauge simulator display", { eager: true, sizes: "(max-width: 860px) 92vw, 38vw" })}<span class="image-note">Illustrative display configuration</span></div></div></section><section class="section surface"><div class="container"><div class="section-heading"><div><div class="eyebrow">Common starting points</div><h2>Find the right troubleshooting path.</h2></div></div>${featureCards([["USB mapping", "Check Windows game-controller detection first, then map axes and buttons in the simulator profile."],["Fit and mounting", "Send the screen or panel dimensions, fastener pattern and a photo of the current setup."],["Software integration", "Include simulator version, data interface, network layout and the action that is not behaving as expected."]])}</div></section><section class="section"><div class="container narrow"><div class="section-heading"><div><div class="eyebrow">Support questions</div><h2>Short answers</h2></div></div>${faqList([["What should I include in a support message?", "Product line, order or quote reference, simulator version, operating system, a short reproduction and any photos or logs that show the problem."],["Can you help with a third-party simulator?", "We can review a compatibility or integration question, but the final support scope depends on the platform and the interface available to the project."],["Where do I send a service question?", "Use the contact form or email info@fsdcpak.com with your reference number if you have one."]])}</div></section>`);
}

function faqPage() {
  return layout({ pageKey: "faq", title: "FAQ | AviCore Compact Flight Simulation Products", description: "Answers about AviCore product scope, quotes, compatibility, images, shipping, support and simulation-only use." }, `<section class="detail-hero"><div class="container narrow"><div class="hero-copy"><div class="eyebrow">FAQ</div><h1>Useful answers before you send a brief.</h1><p class="lead">If the answer you need is not here, contact the team with the product line and simulator platform you are considering.</p></div></div></section><section class="section surface"><div class="container narrow"><div class="faq-list">${faqList([["Are AviCore products certified aircraft parts?", "No. AviCore products are intended for simulation, training, cockpit familiarisation, prototyping and enthusiast use only. They are not for installation in real aircraft."],["Do you publish prices or stock status?", "Most products are made to order and quoted after the dimensions, interface, quantity and finish are understood. This site does not show invented prices or stock claims."],["Which simulator platforms are supported?", "USB HID hardware can be mapped in compatible Windows simulators. Software and display integrations are reviewed per platform, version and data interface."],["Can I order one small part?", "Yes. Small orders are welcome. Tell us the part, quantity, reference and destination so the team can confirm feasibility and shipping."],["Are the product images photographs of finished units?", "The product cutouts are clearly labelled illustrative configurations. The written quote and approved drawings define the actual deliverable."],["How long will a build take?", "Lead time depends on design review, material, electronics, quantity and any prototype step. It is confirmed in the written quote rather than promised as a blanket range."],["Where are enquiries handled?", "AviCore enquiries are handled through FSDC Aerosolutions in Rawalpindi, Pakistan: info@fsdcpak.com and +92 51 5177639."],["Can you ship outside Pakistan?", "Destination, courier and export requirements are confirmed in the quote. Share the country and any deadline so the team can respond accurately."]])}</div></div></section>`);
}

function downloadsPage() {
  return layout({ pageKey: "downloads", title: "Downloads & References | AviCore", description: "Official FSDC Aerosolutions brochures and reference links for larger simulator programmes, plus the AviCore quote path for compact modules." }, `<section class="detail-hero"><div class="container narrow"><div class="hero-copy"><div class="eyebrow">Downloads and references</div><h1>Use the right document for the right scope.</h1><p class="lead">AviCore compact-product specifications are confirmed in the quote. For full simulator brochures, use the official FSDC Aerosolutions library below.</p></div></div></section><section class="section surface"><div class="container card-grid"><article class="info-card"><div class="card-kicker">Official partner library</div><h3>FSDC brochures and technical references</h3><p>Full-motion, mixed-reality, IOS and custom-simulator documents are maintained on the official FSDC site.</p><a class="btn btn-primary btn-small" href="https://www.fsdcpak.com/downloads/" target="_blank" rel="noopener noreferrer">Open FSDC downloads</a></article><article class="info-card"><div class="card-kicker">AviCore product scope</div><h3>Request the spec that matches your module.</h3><p>Ask for the dimensions, connector map, materials, mounting drawing or software scope in your quote request.</p><a class="btn btn-secondary btn-small" href="quote.html">Request a product brief</a></article><article class="info-card"><div class="card-kicker">Partner context</div><h3>See the wider simulator engineering team.</h3><p>FSDC Aerosolutions supports larger fixed-wing, rotary-wing and mixed-reality simulator programmes.</p><a class="btn btn-secondary btn-small" href="https://www.fsdcpak.com/" target="_blank" rel="noopener noreferrer">Visit fsdcpak.com</a></article></div></section>`);
}

function legalPage(type) {
  const common = `<p class="small muted">Last updated ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Karachi" })}.</p>`;
  if (type === "privacy") return layout({ pageKey: "privacy", title: "Privacy Notice | AviCore", description: "Privacy notice for AviCore enquiry forms and website use." }, `<section class="section"><div class="container legal"><div class="eyebrow">Privacy</div><h1>Privacy notice</h1>${common}<p>This notice explains what happens when you use the AviCore website and submit an enquiry. AviCore works with FSDC Aerosolutions, whose contact channel is used to review and reply to product requests.</p><h2>Information you submit</h2><p>We may receive your name, email, phone number, organisation, country, simulator platform, aircraft or project details, message, configuration choices and any file you attach. The form also records a reference number, the page that sent the request and limited technical information used for abuse prevention.</p><h2>How it is used</h2><p>Information is used to answer your enquiry, review feasibility, prepare a quote, provide support and maintain the business record needed to follow up. We do not sell enquiry data.</p><h2>Storage and access</h2><p>Submitted enquiries are stored on the website server and may be forwarded to the FSDC Aerosolutions contact channel at <a href="mailto:info@fsdcpak.com">info@fsdcpak.com</a>. Attachments are stored with the enquiry reference and are not intended to be public downloads.</p><h2>Retention and requests</h2><p>Records are kept only as long as reasonably needed for the enquiry, support and business record. To ask for access, correction or deletion, email <a href="mailto:info@fsdcpak.com">info@fsdcpak.com</a> and include your enquiry reference if you have one.</p><h2>Cookies and analytics</h2><p>The core site does not require advertising cookies or a login. Hosting, security and performance services may create necessary technical logs. Any future analytics or marketing tool should be documented here before it is enabled.</p></div></section>`);
  if (type === "terms") return layout({ pageKey: "terms", title: "Terms of Use | AviCore", description: "Terms for using the AviCore website and requesting compact aviation simulation products." }, `<section class="section"><div class="container legal"><div class="eyebrow">Terms</div><h1>Terms of use</h1>${common}<p>These terms apply to the AviCore website and its enquiry process. A quote, purchase order or invoice may add product-specific terms; where it does, the written commercial document controls.</p><h2>Product information</h2><p>Descriptions and images explain product families and possible configurations. Product cutouts are illustrative, not proof of a finished unit, certification or stock. Dimensions, materials, electronics, compatibility, lead time, shipping and price are confirmed in writing for each order.</p><h2>Quotes and orders</h2><p>Submitting a form is an enquiry, not an order and does not create a payment obligation. An order exists only when the supplier named in the written quote accepts it under the agreed commercial terms.</p><h2>Simulation-only use</h2><p>AviCore products are not certified aircraft parts, official OEM products or flight-critical equipment. Do not install them in a real aircraft or rely on them for real-world flight operations.</p><h2>Third-party links and marks</h2><p>Links to FSDC Aerosolutions and simulator platforms are provided for context. Third-party names and marks belong to their respective owners. AviCore does not claim OEM affiliation unless a written agreement says otherwise.</p><h2>Contact</h2><p>Questions about these terms can be sent to <a href="mailto:info@fsdcpak.com">info@fsdcpak.com</a>. The supplier, governing law and dispute venue for a purchase are identified in the applicable written quote or contract.</p></div></section>`);
  return layout({ pageKey: "disclaimer", title: "Simulation Use Disclaimer | AviCore", description: "AviCore simulation-use disclaimer for hardware, software, illustrations and third-party references." }, `<section class="section"><div class="container legal"><div class="eyebrow">Disclaimer</div><h1>Simulation use only</h1>${common}<h2>Not an aircraft part</h2><p>AviCore hardware and software are intended for simulation, training, cockpit familiarisation, prototyping and enthusiast use only. They are not certified aircraft parts and are not for installation in real aircraft.</p><h2>Illustrations and compatibility</h2><p>Product images on this site are illustrative configurations created to explain a product line. They may not show the exact material, finish, connector, layout or final dimensions you receive. Compatibility depends on the simulator platform, version, mapping and integration scope confirmed in your quote.</p><h2>Third-party references</h2><p>Aircraft, avionics and simulator names are used descriptively. All trademarks belong to their respective owners. AviCore is a compact-product partner of FSDC Aerosolutions and is not an OEM or certification authority.</p><h2>Final scope</h2><p>The written quote, approved drawing and purchase document are the source of truth for the deliverable. Do not use this website as a substitute for a technical or operational approval.</p></div></section>`);
}

function sitemapPage() {
  const pages = [["Home", "index.html"], ["Products", "products.html"], ...productData.map((p) => [p.name, `${p.slug}.html`]), ["Configure a joystick", "configure-joystick.html"], ["For professionals", "solutions.html"], ["About", "about.html"], ["Support", "support.html"], ["FAQ", "faq.html"], ["Downloads", "downloads.html"], ["Contact", "contact.html"], ["Request a quote", "quote.html"], ["Privacy", "privacy.html"], ["Terms", "terms.html"], ["Disclaimer", "disclaimer.html"]];
  return layout({ pageKey: "sitemap", title: "Sitemap | AviCore", description: "AviCore site map." }, `<section class="section"><div class="container narrow"><div class="eyebrow">Sitemap</div><h1>Find your way around.</h1><ul class="footer-links">${pages.map(([name, href]) => `<li><a class="text-link" href="${href}">${esc(name)}</a></li>`).join("")}</ul></div></section>`);
}

function notFoundPage() {
  return `${head({ pageKey: "404", title: "Page not found | AviCore", description: "The requested AviCore page could not be found.", noindex: true })}<main id="main-content"><section class="section"><div class="container empty-state"><div class="eyebrow">404</div><h1>That page is not in the flight plan.</h1><p class="lead" style="margin-inline:auto">The link may have moved. Start at the product range or send the team a question.</p><div class="button-row" style="justify-content:center"><a class="btn btn-primary" href="index.html">Go home</a><a class="btn btn-secondary" href="products.html">Browse products</a></div></div></section></main>${footer()}<script src="assets/js/storefront.js?v=20260728-2" defer></script></body></html>`;
}

function redirectPage(target, title) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><meta http-equiv="refresh" content="0;url=${target}"><title>${esc(title)}</title><link rel="canonical" href="${SITE_URL}/${target}"><link rel="stylesheet" href="assets/css/storefront.css"></head><body><main id="main-content"><section class="section"><div class="container empty-state"><div class="eyebrow">Moved</div><h1>This page has moved.</h1><p class="lead" style="margin-inline:auto"><a class="text-link" href="${target}">Continue to AviCore</a></p></div></section></main></body></html>`;
}

const pages = {
  "index.html": homePage(),
  "products.html": productsPage(),
  "configure-joystick.html": configurePage(),
  "solutions.html": solutionsPage(),
  "about.html": aboutPage(),
  "contact.html": contactPage(),
  "quote.html": quotePage(),
  "support.html": supportPage(),
  "faq.html": faqPage(),
  "downloads.html": downloadsPage(),
  "privacy.html": legalPage("privacy"),
  "terms.html": legalPage("terms"),
  "disclaimer.html": legalPage("disclaimer"),
  "sitemap.html": sitemapPage(),
  "404.html": notFoundPage(),
};
for (const product of productData) pages[`${product.slug}.html`] = detailPage(product);

const redirects = {
  "index-v2.html": "index.html",
  "capabilities.html": "about.html",
  "service.html": "products.html",
  "service-single.html": "products.html",
  "work.html": "about.html",
  "work-single.html": "about.html",
  "blog-standard.html": "support.html",
  "blog-two-columns.html": "support.html",
  "blog-three-columns.html": "support.html",
  "blog-single.html": "support.html",
  "flight-schools.html": "solutions.html",
  "simulator-builders.html": "solutions.html",
  "defense-training.html": "solutions.html",
  "universities.html": "solutions.html",
  "maintenance-training.html": "solutions.html",
  "hobbyists.html": "solutions.html",
};
for (const [file, target] of Object.entries(redirects)) pages[file] = redirectPage(target, `${file} moved`);

for (const [file, content] of Object.entries(pages)) fs.writeFileSync(path.join(ROOT, file), content, "utf8");

const urls = Object.keys(pages).filter((file) => !file.startsWith("404") && !file.includes("index-v2") && !Object.hasOwn(redirects, file)).map((file) => `${SITE_URL}/${file === "index.html" ? "" : file}`);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}\n</urlset>\n`, "utf8");
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /storage/\nDisallow: /tmp/\nDisallow: /tools/\nDisallow: /aigocy/\nDisallow: /__MACOSX/\nSitemap: ${SITE_URL}/sitemap.xml\n`, "utf8");
console.log(`Built ${Object.keys(pages).length} HTML pages and ${urls.length} sitemap URLs.`);
