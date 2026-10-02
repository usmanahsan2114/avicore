import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pages = fs.readdirSync(root).filter((name) => name.endsWith(".html")).sort();
const uses = new Map();
const withinPageDuplicates = [];
let total = 0;

for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  const pageUses = new Map();
  for (const match of html.matchAll(/<img\b[^>]*?\bsrc=["']([^"']+)["']/gi)) {
    const src = match[1];
    total += 1;
    if (!uses.has(src)) uses.set(src, []);
    uses.get(src).push(page);
    pageUses.set(src, (pageUses.get(src) ?? 0) + 1);
  }
  for (const [src, count] of pageUses) {
    if (count > 1) withinPageDuplicates.push({ page, src, count });
  }
}

const duplicates = [...uses.entries()]
  .filter(([, locations]) => locations.length > 1)
  .sort((a, b) => b[1].length - a[1].length);

const missing = [...uses.keys()].filter((src) => {
  if (/^(?:https?:|data:)/i.test(src)) return false;
  const clean = src.split(/[?#]/, 1)[0];
  return !fs.existsSync(path.join(root, clean));
});

console.log(JSON.stringify({
  pages: pages.length,
  totalImageOccurrences: total,
  uniqueImageSources: uses.size,
  duplicateSourceCount: duplicates.length,
  missing,
  withinPageDuplicates,
  duplicates: duplicates.map(([src, locations]) => ({
    src,
    count: locations.length,
    pages: locations,
  })),
}, null, 2));
