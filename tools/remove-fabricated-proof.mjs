/**
 * AviCore — remove fabricated social proof.
 *
 * Run:  node tools/remove-fabricated-proof.mjs
 *
 * The site is pre-launch ("Coming Soon" on 20 of 38 pages) yet publishes:
 *   - "Trusted by 120+ clients across 4 industries" beside a Trustpilot
 *     wordmark and five filled stars, with a counter animating to 120
 *   - a statistics band (230K growth / 95% uptime / 99% on-time delivery)
 *   - four 2024/2025 "awards" with no awarding body
 *   - three invented testimonials (Elena Ruiz / Marcus Tan / David Kim), one
 *     still praising "SSO/SAML and RBAC ... <300 ms on p95" from the original
 *     AI-agency template
 *
 * That is fabricated reviews plus unauthorised use of a third-party
 * trademark on a commercial site. All of it is deleted outright rather than
 * replaced with a placeholder.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

/** Remove `<!-- name -->  ...  <!-- /name -->` inclusive. */
function dropCommentSection(html, name) {
  const open = `<!-- ${name} -->`;
  const close = `<!-- /${name} -->`;
  const a = html.indexOf(open);
  if (a === -1) return { html, hit: false };
  const b = html.indexOf(close, a);
  if (b === -1) return { html, hit: false };
  // also swallow the leading indentation and the trailing newline
  let start = a;
  while (start > 0 && (html[start - 1] === ' ' || html[start - 1] === '\t')) start--;
  let end = b + close.length;
  if (html[end] === '\n') end++;
  return { html: html.slice(0, start) + html.slice(end), hit: true };
}

/**
 * Remove one element by its opening tag, tracking nesting so we cut at the
 * matching close rather than the first `</div>`.
 */
function dropElement(html, openTag, tagName = 'div') {
  const a = html.indexOf(openTag);
  if (a === -1) return { html, hit: false };

  const openRe = new RegExp(`<${tagName}\\b`, 'g');
  const closeRe = new RegExp(`</${tagName}>`, 'g');
  let depth = 0;
  let i = a;
  let end = -1;

  while (i < html.length) {
    openRe.lastIndex = i;
    closeRe.lastIndex = i;
    const o = openRe.exec(html);
    const c = closeRe.exec(html);
    if (!c) break;
    if (o && o.index < c.index) {
      depth++;
      i = o.index + 1;
    } else {
      depth--;
      i = c.index + 1;
      if (depth === 0) { end = c.index + `</${tagName}>`.length; break; }
    }
  }
  if (end === -1) return { html, hit: false };

  let start = a;
  while (start > 0 && (html[start - 1] === ' ' || html[start - 1] === '\t')) start--;
  if (html[end] === '\n') end++;
  return { html: html.slice(0, start) + html.slice(end), hit: true };
}

const TARGETS = {
  'index.html': {
    sections: ['section-statistic', 'section-awards', 'section-testimonials'],
    elements: ['<div class="review-box mb-24">'],
  },
  'about.html': {
    sections: ['section-statistic', 'section-awards', 'section-testimonials'],
    elements: [],
  },
  'index-v2.html': {
    sections: ['section-statistic', 'section-awards', 'section-testimonials'],
    elements: ['<div class="review-box mb-24">'],
  },
};

for (const [file, spec] of Object.entries(TARGETS)) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) { console.log(`skip ${file} (missing)`); continue; }

  let html = fs.readFileSync(full, 'utf8');
  const before = html.length;
  const done = [];

  for (const name of spec.sections) {
    const r = dropCommentSection(html, name);
    if (r.hit) { html = r.html; done.push(name); }
  }
  for (const tag of spec.elements) {
    const r = dropElement(html, tag);
    if (r.hit) { html = r.html; done.push(tag.match(/class="([^"]+)"/)[1].split(' ')[0]); }
  }

  fs.writeFileSync(full, html, 'utf8');
  console.log(`${file}: removed ${done.join(', ') || '(nothing)'}  — ${before - html.length} bytes`);
}

// Report anything fabricated that survived.
console.log('\nResidual checks:');
for (const file of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const h = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const hits = [];
  for (const pat of ['Trustpilot', '120+ clients', 'Elena Ruiz', 'Marcus Tan', 'David Kim', 'SSO/SAML', 'p95', 'RBAC', 'uptime']) {
    if (h.includes(pat)) hits.push(pat);
  }
  if (hits.length) console.log(`  ${file}: ${hits.join(', ')}`);
}
console.log('  (no output above = clean)');
