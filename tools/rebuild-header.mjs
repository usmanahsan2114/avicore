/**
 * AviCore — rebuild the site header.
 *
 * Run:  node tools/rebuild-header.mjs
 *
 * Changes, applied to every page and to _partials/:
 *   1. Adds a slim utility strip above the header carrying the real phone and
 *      email (both were previously only in the footer) plus the simulation-use
 *      note. Small vendors asking for budget need contact detail visible.
 *   2. Drops the "Home" nav item — the logo already links home — so the bar
 *      leads with the catalogue instead of a redundant link.
 *   3. Renames "Works" to "Projects" (plainer) and puts Products first.
 *
 * Deliberately NOT added: search, cart, account. There is no search index, no
 * checkout and no accounts — quoting is by written brief — so those controls
 * would be decorative at best and misleading at worst.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const UTILITY_BAR = `<div class="avicore-utility-bar">
            <div class="avicore-utility-inner">
                <div class="avicore-utility-contact">
                    <a href="tel:+92515177639">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 2h3a1 1 0 0 1 1 .8l.8 3.6a1 1 0 0 1-.5 1.1L9.2 8.6a13.5 13.5 0 0 0 6.2 6.2l1.1-1.7a1 1 0 0 1 1.1-.5l3.6.8a1 1 0 0 1 .8 1v3a2 2 0 0 1-2.2 2A18.6 18.6 0 0 1 2.6 4.2 2 2 0 0 1 4.6 2h2Z"/></svg>
                        +92 51 5177639
                    </a>
                    <a href="mailto:info@fsdcpak.com">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13Zm2.2.5 7.8 5.9L19.8 6H4.2ZM20 7.7l-7.4 5.6a1 1 0 0 1-1.2 0L4 7.7V18h16V7.7Z"/></svg>
                        info@fsdcpak.com
                    </a>
                </div>
                <div class="avicore-utility-note">Simulation and training use only &mdash; not certified aircraft parts</div>
            </div>
        </div>
        `;

const targets = [
  ...fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).map(f => path.join(ROOT, f)),
  path.join(ROOT, '_partials', 'header.html'),
].filter(p => fs.existsSync(p));

let changed = 0;

for (const full of targets) {
  let html = fs.readFileSync(full, 'utf8');
  const before = html;
  const notes = [];

  /* ---- 1. utility strip ------------------------------------------------- */
  if (!html.includes('avicore-utility-bar')) {
    // insert immediately before the opening <header ...>
    html = html.replace(/([ \t]*)(<header class="tf-header)/, (m, indent, tag) => {
      return indent + UTILITY_BAR.trimEnd() + '\n' + indent + tag;
    });
    if (html !== before) notes.push('utility strip');
  }

  /* ---- 2. drop the redundant Home item ---------------------------------- */
  const homeItem = /[ \t]*<li class="menu-item">\s*<a href="index\.html" class="item-link link1[^"]*">Home<\/a>\s*<\/li>\n?/;
  if (homeItem.test(html)) {
    html = html.replace(homeItem, '');
    notes.push('removed Home nav item');
  }

  /* ---- 3. Works -> Projects --------------------------------------------- */
  if (/<a href="work\.html" class="item-link link1">Works<\/a>/.test(html)) {
    html = html.replace(/(<a href="work\.html" class="item-link link1">)Works(<\/a>)/g, '$1Projects$2');
    notes.push('Works -> Projects');
  }

  /* ---- 4. mobile menu: mirror the same two changes ---------------------- */
  const mobHome = /[ \t]*<li><a href="index\.html" class="nav-link text-white">Home<\/a><\/li>\n?/;
  if (mobHome.test(html)) {
    html = html.replace(mobHome, '');
    notes.push('mobile: removed Home');
  }
  if (/>Works</.test(html)) {
    html = html.replace(/(<a href="work\.html"[^>]*>)Works(<\/a>)/g, '$1Projects$2');
  }

  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    changed++;
    if (notes.length) console.log(`${path.basename(full)}: ${notes.join(', ')}`);
  }
}

console.log(`\nUpdated ${changed} files.`);
