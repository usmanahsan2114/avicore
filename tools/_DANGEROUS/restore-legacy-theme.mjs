import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
// Extracted from the user-provided template archive (the source-of-truth theme).
const source = path.join(root, "tmp", "theme-zip", "aigocy", "aigocy");
const pages = [
  "index.html", "index-v2.html", "about.html", "contact.html", "service.html",
  "service-single.html", "work.html", "work-single.html", "blog-standard.html",
  "blog-two-columns.html", "blog-three-columns.html", "blog-single.html", "404.html"
];
const partial = (name) => fs.readFileSync(path.join(root, "_partials", name), "utf8").trim();

const descriptions = {
  "index.html": "AviCore compact aviation simulation hardware and software for hobbyists, educators and training teams.",
  "index-v2.html": "AviCore compact aviation simulation hardware and software for hobbyists, educators and training teams.",
  "about.html": "About AviCore, a compact-product partner of FSDC Aerosolutions.",
  "contact.html": "Contact AviCore about aviation simulation hardware, controls, panels and software.",
  "service.html": "AviCore product lines for smaller flight-simulation builds.",
  "service-single.html": "AviCore product detail for compact flight-simulation hardware and software.",
  "work.html": "AviCore flight-simulation hardware and software project work.",
  "work-single.html": "AviCore flight-simulation project case study.",
  "blog-standard.html": "AviCore flight-simulation notes and resources.",
  "blog-two-columns.html": "AviCore flight-simulation notes and resources.",
  "blog-three-columns.html": "AviCore flight-simulation notes and resources.",
  "blog-single.html": "AviCore flight-simulation resource.",
  "404.html": "AviCore page not found."
};

function replaceBetween(html, start, end, replacement) {
  const a = html.indexOf(start);
  const b = html.indexOf(end, a + start.length);
  if (a < 0 || b < 0) return html;
  return html.slice(0, a) + replacement + html.slice(b + end.length);
}

function makeHead(file) {
  const title = file === "index.html" || file === "index-v2.html"
    ? "AviCore Simulation Technologies | Compact Flight Simulation Systems"
    : `AviCore Simulation Technologies | ${file.replace(/\.html$/, "")}`;
  const desc = descriptions[file] || descriptions["index.html"];
  return `<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="author" content="AviCore Simulation Technologies">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="description" content="${desc}">
    <meta name="theme-color" content="#EDECEC">
    <link rel="stylesheet" href="assets/fonts/fonts.css">
    <link rel="stylesheet" href="assets/icon/icomoon/style.css">
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/swiper-bundle.min.css">
    <link rel="stylesheet" href="assets/css/animate.css">
    <link rel="stylesheet" href="assets/css/slick.css">
    <link rel="stylesheet" href="assets/css/slick.theme.css">
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="stylesheet" href="assets/css/avicore.css">
    <link rel="shortcut icon" href="assets/images/logo/avicore-favicon.svg">
    <link rel="apple-touch-icon-precomposed" href="assets/images/logo/avicore-favicon.svg">
    <link rel="canonical" href="https://www.fsdcpak.com/avicore/${file === "index.html" ? "" : file}">
</head>`;
}

function restore(file) {
  const sourcePath = path.join(source, file);
  if (!fs.existsSync(sourcePath)) return;
  let html = fs.readFileSync(sourcePath, "utf8");
  html = replaceBetween(html, "<head>", "</head>", makeHead(file));
  html = replaceBetween(html, "<!-- Header -->", "<!-- /Header -->", partial("header.html"));
  html = replaceBetween(html, "<!-- footer -->", "<!-- /footer -->", partial("footer.html"));
  const legacyScripts = partial("scripts.html").replace("</body>", '<script src="assets/js/storefront.js?v=20260728-2" defer></script>\n</body>');
  html = replaceBetween(html, "    <!-- Javascript -->", "</body>", legacyScripts + "\n");
  html = html.replace(/Aigocy/g, "AviCore").replace(/aigocy/gi, "avicore");
  html = html.replace(/AI Agency/g, "Simulation Technologies");
  html = html.replace(/<form class="form-contact[^>]*>[\s\S]*?<\/form>/gi, `<form class="form-contact effectFade fadeUp" action="api/submit-inquiry.php" method="post" enctype="multipart/form-data" data-avicore-form data-backend="true">
                                <input type="hidden" name="form_type" value="Legacy theme enquiry">
                                <input type="hidden" name="form_started_at" value="">
                                <h4 class="heading fw-semibold">Tell us about your simulator</h4>
                                <fieldset class="mb-21"><label class="fw-semibold text-body-3 mb-20">Your Name</label><input type="text" name="name" autocomplete="name" placeholder="Enter your full name" required></fieldset>
                                <fieldset class="mb-21"><label class="fw-semibold text-body-3 mb-20">Your Email</label><input type="email" name="email" autocomplete="email" placeholder="you@example.com" required></fieldset>
                                <fieldset class="mb-18"><label class="fw-semibold text-body-3 mb-0">More About The Project</label><textarea name="message" required placeholder="Product line, dimensions, simulator and intended use"></textarea></fieldset>
                                <fieldset class="mb-18"><label class="fw-semibold text-body-3 mb-0">Reference file</label><input type="file" name="attachment" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.dxf,.dwg"></fieldset>
                                <label class="d-flex gap-8 align-items-center mb-18"><input type="checkbox" name="consent" value="yes" required> I agree that AviCore may use these details to reply.</label>
                                <button type="submit" class="tf-btn w-100">Submit Message</button><p class="avicore-form-note" data-form-status aria-live="polite"></p>
                            </form>`);
  html = html.replace(/href="#"/g, 'href="faq.html"');
  if (file === "index.html" || file === "index-v2.html") {
    html = html.replace('<div class="hero-image"></div>', '<div class="hero-image"></div><img class="avicore-hero-product" src="assets/images/products/custom-joystick-1200.webp" width="1200" height="1200" alt="Illustrative custom simulator joystick">');
    html = html.replace(/Build Smarter with/g, "Compact flight simulation");
    html = html.replace(/Full-Stack AI/g, "Hardware & Software");
    html = html.replace(/Unlock growth with our full-stack AI services[^<]*/g, "Build a focused simulator with aircraft-inspired controls, panels, printed parts and instructor software");
  }
  const replacements = [
    ["assets/images/section/service-5.jpg", "assets/images/products/usb-flight-controls-1200.webp"],
    ["assets/images/section/service-6.jpg", "assets/images/products/custom-joystick-1200.webp"],
    ["assets/images/section/service-7.jpg", "assets/images/products/simulator-panel-1200.webp"],
    ["assets/images/section/service-8.jpg", "assets/images/products/ios-console-1200.webp"],
    ["assets/images/section/service-single-1.jpg", "assets/images/products/printed-cockpit-parts-1200.webp"],
    ["assets/images/section/service-single-2.jpg", "assets/images/products/avionics-bezel-1200.webp"],
    ["assets/images/section/service-single-3.jpg", "assets/images/products/simulator-panel-1200.webp"],
    ["assets/images/section/service-single-4.jpg", "assets/images/products/soft-gauges-1200.webp"],
    ["assets/images/section/featured-works-1.jpg", "assets/images/products/usb-flight-controls-1200.webp"],
    ["assets/images/section/featured-works-2.jpg", "assets/images/products/custom-joystick-1200.webp"],
    ["assets/images/section/featured-works-3.jpg", "assets/images/products/avionics-bezel-1200.webp"],
    ["assets/images/section/featured-works-4.jpg", "assets/images/products/ios-console-1200.webp"]
  ];
  for (const [from, to] of replacements) html = html.split(from).join(to);
  fs.writeFileSync(path.join(root, file), html, "utf8");
}

for (const page of pages) restore(page);
console.log(`Restored legacy theme shell on ${pages.length} pages.`);
