import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pages = fs.readdirSync(root).filter((name) => name.endsWith(".html")).sort();
const cache = new Map(pages.map((page) => [page, fs.readFileSync(path.join(root, page), "utf8")]));
const failures = [];
const external = new Set();
let internalLinks = 0;
let buttons = 0;

for (const [page, html] of cache) {
  for (const match of html.matchAll(/<a\b([^>]*)>/gi)) {
    const attributes = match[1];
    const href = attributes.match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (/\b(?:btn|tf-btn|text-link|item-link|link1)\b/i.test(attributes)) buttons += 1;
    if (!href) {
      failures.push(`${page}: anchor without href`);
      continue;
    }
    if (/^https?:/i.test(href)) {
      external.add(href);
      continue;
    }
    if (/^(?:mailto:|tel:|javascript:)/i.test(href)) continue;

    internalLinks += 1;
    const [targetWithQuery, rawHash = ""] = href.split("#");
    const target = (targetWithQuery || page).split("?")[0];
    if (target.startsWith("/")) continue;
    if (target && !fs.existsSync(path.join(root, target))) {
      failures.push(`${page}: missing destination ${href}`);
      continue;
    }
    if (rawHash && target.endsWith(".html") && cache.has(target)) {
      const id = decodeURIComponent(rawHash.split("?")[0]);
      const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (!new RegExp(`\\bid=["']${escaped}["']`, "i").test(cache.get(target))) {
        failures.push(`${page}: missing fragment ${href}`);
      }
    }
  }

  for (const match of html.matchAll(/<form\b([^>]*)>/gi)) {
    const action = match[1].match(/\baction=["']([^"']+)["']/i)?.[1];
    if (!action || /^(?:https?:|mailto:)/i.test(action)) continue;
    const target = action.split(/[?#]/)[0];
    if (!fs.existsSync(path.join(root, target))) failures.push(`${page}: missing form action ${action}`);
  }
}

if (process.argv.includes("--external")) {
  for (const url of external) {
    try {
      let response = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
        headers: { "user-agent": "AviCore-site-audit/1.0" },
      });
      if (response.status === 403 || response.status === 405) {
        response = await fetch(url, {
          method: "GET",
          redirect: "follow",
          signal: AbortSignal.timeout(15000),
          headers: { "user-agent": "AviCore-site-audit/1.0" },
        });
      }
      if (response.status >= 400) failures.push(`external ${url}: HTTP ${response.status}`);
    } catch (error) {
      failures.push(`external ${url}: ${error.message}`);
    }
  }
}

console.log(`Checked ${pages.length} pages, ${internalLinks} internal links, ${buttons} linked controls and ${external.size} external URLs.`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS: all checked links, fragments, linked controls and form actions resolve.");
}
