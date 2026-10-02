<?php
/**
 * AviCore — regenerate product WebPs as TRANSPARENT cutouts.
 *
 * Run:  php -d extension=gd tools/rebuild-transparent-webp.php
 *
 * The source PNGs in _unused-assets/images/products/ are true cutouts
 * (PNG colour type 6, RGBA, alpha actually used). The 480/800/1200 WebP
 * derivatives currently in assets/images/products/ were flattened onto WHITE
 * during an earlier conversion, which is why every product render shows as a
 * white box on the dark bands.
 *
 * This rebuilds each size from the PNG with alpha preserved.
 *
 * GD is shipped with XAMPP but disabled in php.ini. It is loaded per-invocation
 * with -d extension=gd so the server config is left alone.
 */

declare(strict_types=1);

if (!extension_loaded('gd')) {
    fwrite(STDERR, "GD not loaded. Run with:  php -d extension=gd " . basename(__FILE__) . "\n");
    exit(1);
}

$root   = dirname(__DIR__);
$srcDir = $root . '/_unused-assets/images/products';
$outDir = $root . '/assets/images/products';
$sizes  = [480, 800, 1200];

if (!is_dir($srcDir)) {
    fwrite(STDERR, "Source dir missing: $srcDir\n");
    exit(1);
}

$made = 0;
$bytesBefore = 0;
$bytesAfter = 0;

foreach (glob($srcDir . '/*.png') as $png) {
    $base = basename($png, '.png');

    $src = @imagecreatefrompng($png);
    if (!$src) { echo "  SKIP (unreadable) $base\n"; continue; }

    imagealphablending($src, false);
    imagesavealpha($src, true);

    $sw = imagesx($src);
    $sh = imagesy($src);

    foreach ($sizes as $w) {
        $h = (int) round($sh * ($w / $sw));

        $dst = imagecreatetruecolor($w, $h);
        // fully transparent canvas, and keep it that way through the resample
        imagealphablending($dst, false);
        imagesavealpha($dst, true);
        $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
        imagefilledrectangle($dst, 0, 0, $w, $h, $transparent);

        imagecopyresampled($dst, $src, 0, 0, 0, 0, $w, $h, $sw, $sh);

        $out = "$outDir/$base-$w.webp";
        if (is_file($out)) { $bytesBefore += filesize($out); }

        imagewebp($dst, $out, 82);
        imagedestroy($dst);

        clearstatcache(true, $out);
        $bytesAfter += filesize($out);
        $made++;
    }

    imagedestroy($src);
    echo "  rebuilt $base (3 sizes, alpha preserved)\n";
}

printf(
    "\n%d files rebuilt. %.1f KB -> %.1f KB\n",
    $made,
    $bytesBefore / 1024,
    $bytesAfter / 1024
);
