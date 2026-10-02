import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const DIST = path.join(ROOT, "dist");
const STAGE = path.join(DIST, "avicore.fsdcpak.com");
const ZIP_NAME = "avicore-fsdcpak-com-upload-2026-07-28.zip";
const ZIP_PATH = path.join(DIST, ZIP_NAME);
const PRODUCTION_ORIGIN = "https://avicore.fsdcpak.com";
const OLD_SITE_PREFIX = "https://www.fsdcpak.com/avicore";

function assertInside(parent, target) {
    const relative = path.relative(parent, target);
    if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
        throw new Error(`Refusing to modify a path outside ${parent}: ${target}`);
    }
}

function copyDirectory(source, destination) {
    fs.cpSync(source, destination, {
        recursive: true,
        force: true,
        filter: (entry) => !["Thumbs.db", ".DS_Store"].includes(path.basename(entry)),
    });
}

function productionHtml(source) {
    return source
        .replaceAll(`${OLD_SITE_PREFIX}/`, `${PRODUCTION_ORIGIN}/`)
        .replaceAll(OLD_SITE_PREFIX, PRODUCTION_ORIGIN)
        .replaceAll(
            "https%3A%2F%2Fwww.fsdcpak.com%2Favicore%2F",
            "https%3A%2F%2Favicore.fsdcpak.com%2F"
        );
}

function writeText(relativePath, contents) {
    const destination = path.join(STAGE, relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, contents.replace(/\r?\n/g, "\r\n"), "utf8");
}

assertInside(DIST, STAGE);
assertInside(DIST, ZIP_PATH);
fs.mkdirSync(DIST, { recursive: true });
fs.rmSync(STAGE, { recursive: true, force: true });
fs.rmSync(ZIP_PATH, { force: true });
fs.mkdirSync(STAGE, { recursive: true });

const htmlFiles = fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => entry.name)
    .sort();

for (const fileName of htmlFiles) {
    const source = fs.readFileSync(path.join(ROOT, fileName), "utf8");
    writeText(fileName, productionHtml(source));
}

copyDirectory(path.join(ROOT, "assets"), path.join(STAGE, "assets"));
copyDirectory(path.join(ROOT, "api"), path.join(STAGE, "api"));

fs.mkdirSync(path.join(STAGE, "storage"), { recursive: true });
for (const fileName of [".htaccess", "index.html"]) {
    fs.copyFileSync(
        path.join(ROOT, "storage", fileName),
        path.join(STAGE, "storage", fileName)
    );
}

writeText(
    ".htaccess",
    `Options -Indexes
DirectoryIndex index.html
ErrorDocument 404 /404.html

<IfModule mod_headers.c>
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
    <FilesMatch "\\.(?:css|js|svg|webp|png|jpg|jpeg|woff2?)$">
        Header set Cache-Control "public, max-age=604800, stale-while-revalidate=86400"
    </FilesMatch>
</IfModule>

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css text/javascript application/javascript application/json application/xml image/svg+xml
</IfModule>

RewriteEngine On
RewriteRule ^(?:storage|aigocy|__MACOSX|_partials|tools|tmp|dist)(?:/|$) - [R=404,L]
RewriteRule ^(?:avicore-research\\.md|README-template\\.md)$ - [R=404,L]
RewriteRule ^index-v2\\.html$ /index.html [R=302,L,NE]
`
);

writeText(
    "robots.txt",
    `User-agent: *
Allow: /
Disallow: /api/
Disallow: /storage/
Sitemap: ${PRODUCTION_ORIGIN}/sitemap.xml
`
);

const sitemap = fs
    .readFileSync(path.join(ROOT, "sitemap.xml"), "utf8")
    .replaceAll(`${OLD_SITE_PREFIX}/`, `${PRODUCTION_ORIGIN}/`)
    .replaceAll(OLD_SITE_PREFIX, PRODUCTION_ORIGIN);
writeText("sitemap.xml", sitemap);

const deploymentNotes = `AviCore production upload package
=================================

Target: ${PRODUCTION_ORIGIN}/
Archive: ${ZIP_NAME}

Upload:
1. Open the document root configured for avicore.fsdcpak.com.
2. Extract the CONTENTS of the ZIP directly into that document root.
3. Confirm index.html, .htaccess, assets/, api/ and storage/ sit at the root.
4. Do not upload the containing dist/avicore.fsdcpak.com folder as an extra level.

Server requirements:
- Apache with .htaccess support (AllowOverride enabled).
- PHP 8.0 or newer.
- PHP fileinfo and mbstring extensions.
- PHP mail configured, or a host mail transport compatible with PHP mail().
- The PHP/web-server account must be able to write inside storage/.
- Optional: set AVICORE_INQUIRY_EMAIL to override info@fsdcpak.com.

Post-upload checks:
- Open ${PRODUCTION_ORIGIN}/
- Open ${PRODUCTION_ORIGIN}/about.html
- Open ${PRODUCTION_ORIGIN}/products.html
- Submit a real test request from the quote or contact form.
- Confirm the test email arrives and remove the test inquiry afterward if desired.
`;
fs.writeFileSync(path.join(DIST, "UPLOAD-INSTRUCTIONS.txt"), deploymentNotes, "utf8");

const manifest = {
    target: `${PRODUCTION_ORIGIN}/`,
    archive: ZIP_NAME,
    generatedAt: new Date().toISOString(),
    htmlFiles: htmlFiles.length,
    included: ["*.html", "assets/", "api/", "storage/.htaccess", "storage/index.html"],
    excluded: [
        "aigocy/",
        "__MACOSX/",
        "_partials/",
        "tools/",
        "tmp/",
        "dist/",
        "storage/rate/",
        "storage/inquiries/",
        "avicore-research.md",
        "README-template.md",
    ],
};
fs.writeFileSync(
    path.join(DIST, "production-package-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
);

console.log(`Staged ${htmlFiles.length} HTML pages at ${STAGE}`);
console.log(`Ready to create ${ZIP_PATH}`);
