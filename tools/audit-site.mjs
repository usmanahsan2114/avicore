import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = fs.readdirSync(root).filter((file) => file.endsWith(".html"));
const failures = [];
const core = files.filter((file) => !["404.html"].includes(file));
const htmlCache = new Map(
  files.map((file) => [file, fs.readFileSync(path.join(root, file), "utf8")]),
);

function exists(relative) {
  return fs.existsSync(path.join(root, relative.replaceAll("/", path.sep)));
}

for (const file of files) {
  const html = htmlCache.get(file);
  const noindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html);
  const images = html.match(/<img\b[^>]*>/gi) || [];
  for (const image of images) {
    if (!/\bwidth=["']\d+["']/i.test(image) || !/\bheight=["']\d+["']/i.test(image)) failures.push(`${file}: image is missing intrinsic width/height`);
    if (!/\balt=["'][^"']+["']/i.test(image)) failures.push(`${file}: image is missing alt text`);
  }
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    const raw = match[1];
    const value = raw.split("#")[0].split("?")[0];
    if (!value || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(value)) continue;
    if (value.startsWith("/")) continue;
    if (!exists(value)) failures.push(`${file}: missing local reference ${value}`);
  }
  for (const match of html.matchAll(/\bhref=["']([^"']*#[^"']+)["']/gi)) {
    const raw = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(raw)) continue;
    const [targetPath, hashWithQuery = ""] = raw.split("#");
    const hash = decodeURIComponent(hashWithQuery.split("?")[0]);
    if (!hash || hash === "top") continue;
    const targetFile = (targetPath || file).split("?")[0];
    if (!targetFile.endsWith(".html") || !htmlCache.has(targetFile)) continue;
    const targetHtml = htmlCache.get(targetFile);
    const escaped = hash.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!new RegExp(`\\bid=["']${escaped}["']`, "i").test(targetHtml)) {
      failures.push(`${file}: missing anchor target ${raw}`);
    }
  }
  for (const match of html.matchAll(/srcset=["']([^"']+)["']/gi)) {
    for (const candidate of match[1].split(",")) {
      const value = candidate.trim().split(/\s+/)[0];
      if (value && !exists(value)) failures.push(`${file}: missing srcset reference ${value}`);
    }
  }
  if (!noindex) {
    if ((html.match(/<h1\b/gi) || []).length !== 1) failures.push(`${file}: expected exactly one h1`);
    if ((html.match(/<nav\b/gi) || []).length < 1) failures.push(`${file}: missing nav landmark`);
  }
  if (html.includes('href="#"') || html.includes("href='#'")) failures.push(`${file}: dead hash link`);
  if (html.includes("avicore-vectors") || html.includes("info@avicoresim.com")) failures.push(`${file}: stale template reference`);
  if (/<div class=["']box-navigation["'][^>]*(?:role=["']navigation["'][^>]*){2,}/i.test(html)) {
    failures.push(`${file}: duplicate navigation attributes`);
  }
  if ((html.match(/<\/body>/gi) || []).length !== 1 || (html.match(/<\/html>/gi) || []).length !== 1) {
    failures.push(`${file}: duplicate or missing document closing tags`);
  }
  for (const script of ["assets/js/main.js", "assets/js/avicore.js", "assets/js/storefront.js"]) {
    if ((html.match(new RegExp(`src=["']${script.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?[^"']*)?["']`, "gi")) || []).length > 1) {
      failures.push(`${file}: duplicate script ${script}`);
    }
  }
}

for (const product of ["custom-joystick", "usb-flight-controls", "printed-cockpit-parts", "avionics-bezel", "joystick-configurator", "simulator-panel", "ios-console", "soft-gauges"]) {
  for (const size of [480, 800, 1200]) {
    if (!exists(`assets/images/products/${product}-${size}.webp`)) failures.push(`missing product variant ${product}-${size}.webp`);
  }
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapCount = (sitemap.match(/<url>/g) || []).length;
console.log(`Audited ${files.length} root HTML pages, ${sitemapCount} sitemap URLs and 8 product image families.`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS: local references, intrinsic image sizing, navigation landmarks, headings and stale-template checks are clean.");
}
