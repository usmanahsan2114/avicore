/**
 * AviCore — restore JSON-LD structured data.
 *
 * Run:  node tools/add-structured-data.mjs
 *
 * The site shipped with ZERO ld+json blocks and zero schema.org references
 * across all 39 pages. They existed earlier in the build; tools/restore-
 * custom-pages-shell.mjs rewrites <head> and drops them. This re-adds them
 * idempotently, keyed off the page type.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BASE = 'https://www.fsdcpak.com/avicore/';   // build rewrites the origin

const ORG = {
  '@type': 'Organization',
  '@id': BASE + '#organization',
  name: 'AviCore Simulation Technologies',
  url: BASE,
  description: 'Custom flight simulator hardware and software: USB flight controls, 3D-printed cockpit parts, avionics bezels, panels, instructor operating stations and custom airport scenery. For simulation and training use only.',
  parentOrganization: { '@type': 'Organization', name: 'FSDC Aerosolutions' },
  email: 'info@fsdcpak.com',
  telephone: '+92-51-5177639',
  address: { '@type': 'PostalAddress', addressCountry: 'PK' },
  sameAs: ['https://www.fsdcpak.com/'],
};

/** slug -> product schema */
const PRODUCTS = {
  'usb-flight-controls.html':   ['USB Flight Controls', 'Aircraft-inspired joysticks, yokes, cyclics and throttle quadrants that map as standard USB HID devices.', 'PreOrder'],
  'custom-joystick.html':       ['Custom Joystick', 'A configurable grip and base built around the reach, axes and switch layout your aircraft reference calls for.', 'PreOrder'],
  'printed-parts.html':         ['3D Printed Cockpit Parts', 'Small-batch knobs, handles, guards, housings and mounts produced from your dimensions, drawings or reference photos.', 'PreOrder'],
  'avionics-bezels.html':       ['Avionics Bezels', 'Training-focused display surrounds sized to your screen, with soft-key and encoder placement agreed around the target layout.', 'PreOrder'],
  'cockpit-panels.html':        ['Simulator Panels', 'Aircraft-layout switch, autopilot, radio and annunciator panels with backlighting and USB or interface wiring scoped per build.', 'PreOrder'],
  'soft-gauges.html':           ['Soft Gauges', 'Software-rendered PFD, MFD, engine and round-gauge layouts for compact panels and teaching displays.', 'PreOrder'],
  'ios-software.html':          ['IOS — Instructor Operating Station & Software', 'Instructor station for scenario setup, failure injection, session monitoring and repositioning on flight training devices.', 'InStock'],
  'airport-scenery-design.html':['Custom Airport & Scenery Design', 'Aerodromes, terrain, lighting and markings modelled from published charts and imagery for MSFS, X-Plane and Prepar3D.', 'InStock'],
};

const isFaqPage = html => /<details class="faq-item">/.test(html) || /section-faqs/.test(html);

function extractFaq(html) {
  const out = [];
  const re = /<summary>([\s\S]*?)<\/summary>\s*<div class="faq-answer">\s*<p>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(html)) && out.length < 10) {
    const q = strip(m[1]);
    const a = strip(m[2]);
    if (q && a) out.push({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } });
  }
  return out;
}

const strip = s => s.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&mdash;/g, '—')
  .replace(/&ndash;/g, '–').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

function breadcrumb(file, name) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Products', item: BASE + 'products.html' },
      { '@type': 'ListItem', position: 3, name, item: BASE + file },
    ],
  };
}

let count = 0;
for (const file of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const full = path.join(ROOT, file);
  let html = fs.readFileSync(full, 'utf8');
  if (html.includes('application/ld+json')) continue;   // idempotent

  const graph = [];
  const title = strip((html.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1]);
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1];
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [, BASE + file])[1];

  // Organization on the homepage; WebPage everywhere else
  if (file === 'index.html') {
    graph.push(ORG);
    graph.push({
      '@type': 'WebSite', '@id': BASE + '#website', url: BASE,
      name: 'AviCore Simulation Technologies', publisher: { '@id': BASE + '#organization' },
    });
  } else {
    graph.push({
      '@type': 'WebPage', url: canonical, name: title,
      description: strip(desc), isPartOf: { '@id': BASE + '#website' },
      publisher: { '@id': BASE + '#organization' },
    });
  }

  // Product pages
  if (PRODUCTS[file]) {
    const [name, description, availability] = PRODUCTS[file];
    graph.push({
      '@type': 'Product',
      name,
      description,
      brand: { '@type': 'Brand', name: 'AviCore Simulation Technologies' },
      manufacturer: { '@id': BASE + '#organization' },
      category: 'Flight simulation hardware and software',
      url: canonical,
      offers: {
        '@type': 'Offer',
        url: BASE + 'quote.html',
        availability: 'https://schema.org/' + availability,
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'PriceSpecification',
          valueAddedTaxIncluded: false,
          description: 'Quoted per build. Submit a brief for a fixed written quote.',
        },
        seller: { '@id': BASE + '#organization' },
      },
    });
    graph.push(breadcrumb(file, name));
  }

  // FAQ
  if (isFaqPage(html)) {
    const qs = extractFaq(html);
    if (qs.length) graph.push({ '@type': 'FAQPage', mainEntity: qs });
  }

  if (!graph.length) continue;

  const block = '    <script type="application/ld+json">\n' +
    JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2)
      .split('\n').map(l => '    ' + l).join('\n') +
    '\n    </script>\n';

  html = html.replace('</head>', block + '</head>');
  fs.writeFileSync(full, html, 'utf8');
  count++;
  console.log(`${file}: ${graph.map(g => g['@type']).join(' + ')}`);
}

console.log(`\nAdded structured data to ${count} pages.`);
