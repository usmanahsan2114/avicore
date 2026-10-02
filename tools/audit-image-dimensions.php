<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$pages = glob($root . DIRECTORY_SEPARATOR . '*.html') ?: [];
$failures = [];
$checked = 0;

foreach ($pages as $page) {
    $html = file_get_contents($page);
    if (!is_string($html)) {
        $failures[] = basename($page) . ': unable to read page';
        continue;
    }

    preg_match_all('/<img\b[^>]*>/i', $html, $tags);
    foreach ($tags[0] as $tag) {
        if (!preg_match('/\bsrc=["\']([^"\']+)["\']/i', $tag, $srcMatch)) continue;
        if (!preg_match('/\bwidth=["\'](\d+)["\']/i', $tag, $widthMatch)) continue;
        if (!preg_match('/\bheight=["\'](\d+)["\']/i', $tag, $heightMatch)) continue;
        if (preg_match('/^(?:https?:|data:)/i', $srcMatch[1])) continue;

        $source = $root . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, preg_replace('/[?#].*$/', '', $srcMatch[1]));
        $dimensions = @getimagesize($source);
        if ($dimensions === false && preg_match('/\.svg$/i', $source)) {
            $svg = @file_get_contents($source);
            if (
                is_string($svg)
                && preg_match('/<svg\b[^>]*\bwidth=["\'](\d+(?:\.\d+)?)["\'][^>]*\bheight=["\'](\d+(?:\.\d+)?)["\']/i', $svg, $svgSize)
            ) {
                $dimensions = [(int) round((float) $svgSize[1]), (int) round((float) $svgSize[2])];
            }
        }
        if ($dimensions === false) {
            $failures[] = basename($page) . ': unreadable image ' . $srcMatch[1];
            continue;
        }

        $checked++;
        $declaredWidth = (int) $widthMatch[1];
        $declaredHeight = (int) $heightMatch[1];
        if ($declaredWidth !== $dimensions[0] || $declaredHeight !== $dimensions[1]) {
            $failures[] = sprintf(
                '%s: %s declares %dx%d but is %dx%d',
                basename($page),
                $srcMatch[1],
                $declaredWidth,
                $declaredHeight,
                $dimensions[0],
                $dimensions[1],
            );
        }
    }
}

echo sprintf("Checked intrinsic dimensions for %d image occurrences.\n", $checked);
if ($failures !== []) {
    fwrite(STDERR, implode(PHP_EOL, $failures) . PHP_EOL);
    exit(1);
}

echo "PASS: every declared image size matches the source asset.\n";
