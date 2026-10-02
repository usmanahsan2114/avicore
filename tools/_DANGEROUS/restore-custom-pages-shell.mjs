import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pages = [
  "products.html", "usb-flight-controls.html", "custom-joystick.html", "printed-parts.html",
  "avionics-bezels.html", "cockpit-panels.html", "ios-software.html", "soft-gauges.html",
  "configure-joystick.html", "solutions.html", "support.html", "faq.html", "downloads.html",
  "quote.html", "privacy.html", "terms.html", "disclaimer.html", "sitemap.html"
];
const header = fs.readFileSync(path.join(root, "_partials", "header.html"), "utf8").trim();
const footer = fs.readFileSync(path.join(root, "_partials", "footer.html"), "utf8").trim();
const scripts = fs.readFileSync(path.join(root, "_partials", "scripts.html"), "utf8").trim();

function oldHead(file, oldTitle, oldDescription) {
  return `<head><meta charset="utf-8"><title>${oldTitle}</title><meta name="author" content="AviCore Simulation Technologies"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"><meta name="description" content="${oldDescription}"><meta name="theme-color" content="#EDECEC"><link rel="stylesheet" href="assets/fonts/fonts.css"><link rel="stylesheet" href="assets/icon/icomoon/style.css"><link rel="stylesheet" href="assets/css/bootstrap.min.css"><link rel="stylesheet" href="assets/css/swiper-bundle.min.css"><link rel="stylesheet" href="assets/css/animate.css"><link rel="stylesheet" href="assets/css/slick.css"><link rel="stylesheet" href="assets/css/slick.theme.css"><link rel="stylesheet" href="assets/css/styles.css"><link rel="stylesheet" href="assets/css/avicore.css"><link rel="stylesheet" href="assets/css/storefront.css"><link rel="stylesheet" href="assets/css/legacy-avicore.css"><link rel="shortcut icon" href="assets/images/logo/avicore-favicon.svg"><link rel="canonical" href="https://www.fsdcpak.com/avicore/${file}"></head>`;
}

for (const file of pages) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) continue;
  let html = fs.readFileSync(target, "utf8");
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "AviCore Simulation Technologies").replace(/\s+/g, " ").trim();
  const desc = html.match(/<meta name="description" content="([^"]*)"/i)?.[1] || "AviCore compact aviation simulation hardware and software.";
  html = html.replace(/<head>[\s\S]*?<\/head>/i, oldHead(file, title, desc));
  html = html.replace(/<a class="skip-link"[\s\S]*?<\/header>/i, `<a class="skip-link" href="#main-content">Skip to content</a>${header}`);
  html = html.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/i, footer);
  html = html.replace(/<script src="assets\/js\/storefront\.js(?:\?[^"]*)?" defer><\/script>/i, `${scripts}\n<script src="assets/js/storefront.js?v=20260728-2" defer></script>`);
  fs.writeFileSync(target, html, "utf8");
}
console.log(`Restored legacy shared shell on ${pages.length} product, support and legal pages.`);
