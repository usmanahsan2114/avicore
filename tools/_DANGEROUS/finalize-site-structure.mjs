import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = fs.readdirSync(root).filter((name) => name.endsWith(".html"));
const sharedFiles = ["_partials/header.html", "_partials/footer.html"];
const scriptTail = `<!-- Javascript -->
<script src="assets/js/jquery.min.js"></script>
<script src="assets/js/bootstrap.min.js"></script>
<script src="assets/js/jquery.nice-select.min.js"></script>
<script src="assets/js/swiper-bundle.min.js"></script>
<script src="assets/js/slick.min.js"></script>
<script src="assets/js/countto.js"></script>
<script src="assets/js/carousel.js"></script>
<script src="assets/js/infinityslide.js"></script>
<script src="assets/js/ScrollSmooth.js"></script>
<script src="assets/js/gsap.min.js"></script>
<script src="assets/js/ScrollTrigger.min.js"></script>
<script src="assets/js/ScrollToPlugin.min.js"></script>
<script src="assets/js/gsapAnimation.js"></script>
<script src="assets/js/main.js"></script>
<script src="assets/js/avicore.js"></script>
<script src="assets/js/storefront.js?v=20260728-2" defer></script>
</body>
</html>
`;

for (const relative of [...files, ...sharedFiles]) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) continue;

  let html = fs.readFileSync(file, "utf8");

  // Keep generated output idempotent and accessible.
  html = html.replace(
    /<div\s+class=["']box-navigation["'][^>]*>/i,
    '<div class="box-navigation" role="navigation" aria-label="Primary navigation">',
  );
  html = html.replace(
    /<a\s+href=["']#wrapper["']\s+class=["']tf-btn open-mb-menu mobile-menu d-lg-none d-flex["']>\s*<i class=["']icon icon-grip-lines-solid["']><\/i>\s*<\/a>/gi,
    '<button type="button" class="tf-btn open-mb-menu mobile-menu d-lg-none d-flex" aria-expanded="false" aria-controls="avicore-mobile-navigation" aria-label="Open navigation"><i class="icon icon-grip-lines-solid" aria-hidden="true"></i></button>',
  );
  html = html.replace(
    /href=["']#["'](\s+class=["'][^"']*\baction-go-top\b)/gi,
    'href="#main-content"$1',
  );
  html = html.replace(
    /(<article class="product-card"[^>]*>)(?!<span class="product-status-badge">)/gi,
    '$1<span class="product-status-badge">Coming Soon</span>',
  );
  html = html.replace(/(?:\s*<!-- \/Header -->){2,}/gi, "\n        <!-- /Header -->");
  html = html.replace(
    "Get connected <br> with AviCore on social",
    "Connect with AviCore <br> through FSDC",
  );
  html = html.replace(
    /<div class="tf-social-1 justify-content-center">[\s\S]*?<\/div>\s*(?=<\/div>\s*<!-- Simulation-use disclaimer -->)/i,
    `<div class="tf-social-1 justify-content-center avicore-contact-links">
                        <a href="https://www.fsdcpak.com/" target="_blank" rel="noopener noreferrer" class="text-body-1 fw-semibold">
                            FSDC Website
                            <span class="social-item"><i class="icon icon-arrow-top-right" aria-hidden="true"></i></span>
                        </a>
                        <a href="mailto:info@fsdcpak.com" class="text-body-1 fw-semibold">
                            Email
                            <span class="social-item"><i class="icon icon-envelope" aria-hidden="true"></i></span>
                        </a>
                        <a href="tel:+92515177639" class="text-body-1 fw-semibold">
                            Call
                            <span class="social-item"><i class="icon icon-phone-solid" aria-hidden="true"></i></span>
                        </a>
                        <a href="contact.html" class="text-body-1 fw-semibold">
                            Contact
                            <span class="social-item"><i class="icon icon-arrow-top-right" aria-hidden="true"></i></span>
                        </a>
                    </div>`,
  );

  // Browsers otherwise select repeated shared srcset assets before the unique
  // page-specific image. The optimized unique img remains responsive via CSS.
  html = html.replace(/\s*<source\b[^>]*>/gi, "");

  const encodingRepairs = new Map([
    ["â€”", "—"],
    ["â€“", "–"],
    ["â€™", "’"],
    ["â€œ", "“"],
    ["â€", "”"],
    ["â€¦", "…"],
    ["Ã©", "é"],
  ]);
  for (const [broken, repaired] of encodingRepairs) {
    html = html.split(broken).join(repaired);
  }

  if (relative.endsWith(".html") && !relative.startsWith("_partials/")) {
    const footerMarker = "<!-- /footer -->";
    const footerIndex = html.indexOf(footerMarker);
    if (footerIndex !== -1) {
      html = html.slice(0, footerIndex + footerMarker.length) + "\n" + scriptTail;
    }
  }

  fs.writeFileSync(file, html);
}

console.log(`Normalized shared navigation, responsive image selection and encoding in ${files.length} pages.`);
