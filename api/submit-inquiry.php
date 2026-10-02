<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, max-age=0');

const MAX_REQUEST_BYTES = 10_000_000;
const MAX_ATTACHMENT_BYTES = 8_000_000;
const RATE_LIMIT_WINDOW = 600;
const RATE_LIMIT_MAX = 5;

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function clean_text(mixed $value, int $maxLength = 500): string
{
    if (!is_string($value)) {
        return '';
    }

    $value = trim(str_replace("\0", '', $value));
    $value = preg_replace('/[ \t]+/', ' ', $value) ?? $value;
    return mb_substr($value, 0, $maxLength);
}

/**
 * Collapse ALL vertical whitespace to a single space.
 *
 * clean_text() only squeezes spaces and tabs, so CR/LF survive it. Any value
 * that ends up in a mail header (the subject is built from form_type) must be
 * stripped of line breaks first, or an attacker can append their own headers
 * — e.g. form_type = "Quote\r\nBcc: attacker@example.com" — and turn the
 * inquiry endpoint into an open relay.
 */
function header_safe(string $value, int $maxLength = 200): string
{
    $value = preg_replace('/[\r\n\x0B\x0C\x{2028}\x{2029}]+/u', ' ', $value) ?? $value;
    $value = preg_replace('/\s+/u', ' ', $value) ?? $value;
    return mb_substr(trim($value), 0, $maxLength);
}

function request_ip(): string
{
    return clean_text($_SERVER['REMOTE_ADDR'] ?? 'unknown', 64);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'message' => 'Use POST for inquiry submissions.']);
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > MAX_REQUEST_BYTES) {
    respond(413, ['ok' => false, 'message' => 'The submission is too large.']);
}

$origin = clean_text($_SERVER['HTTP_ORIGIN'] ?? '', 300);
$requestHost = strtolower(explode(':', clean_text($_SERVER['HTTP_HOST'] ?? '', 200))[0]);
if ($origin !== '') {
    $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
    if ($originHost === '' || $requestHost === '' || !hash_equals($requestHost, $originHost)) {
        respond(403, ['ok' => false, 'message' => 'Cross-site submissions are not accepted.']);
    }
}

// Honeypot: return a normal-looking response without storing bot content.
if (clean_text($_POST['company_website'] ?? '', 200) !== '') {
    respond(200, ['ok' => true, 'reference' => 'AV-' . gmdate('Ymd') . '-RECEIVED']);
}

$startedAt = (int) ($_POST['form_started_at'] ?? 0);
if ($startedAt > 0 && (time() - $startedAt) < 1) {
    respond(429, ['ok' => false, 'message' => 'Please wait a moment and submit again.']);
}

$storageRoot = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'storage';
$rateDir = $storageRoot . DIRECTORY_SEPARATOR . 'rate';
$monthDir = $storageRoot . DIRECTORY_SEPARATOR . 'inquiries' . DIRECTORY_SEPARATOR . gmdate('Y-m');
$attachmentDir = $monthDir . DIRECTORY_SEPARATOR . 'attachments';

foreach ([$rateDir, $monthDir, $attachmentDir] as $directory) {
    if (!is_dir($directory) && !mkdir($directory, 0750, true) && !is_dir($directory)) {
        respond(500, ['ok' => false, 'message' => 'The inquiry service is temporarily unavailable.']);
    }
}

$ip = request_ip();
$rateFile = $rateDir . DIRECTORY_SEPARATOR . hash('sha256', $ip) . '.json';
$now = time();
$attempts = [];
if (is_file($rateFile)) {
    $decoded = json_decode((string) file_get_contents($rateFile), true);
    if (is_array($decoded)) {
        $attempts = array_values(array_filter(
            $decoded,
            static fn (mixed $timestamp): bool => is_int($timestamp) && $timestamp > ($now - RATE_LIMIT_WINDOW)
        ));
    }
}
if (count($attempts) >= RATE_LIMIT_MAX) {
    respond(429, ['ok' => false, 'message' => 'Too many requests. Please try again in ten minutes.']);
}
$attempts[] = $now;
file_put_contents($rateFile, json_encode($attempts), LOCK_EX);

$name = clean_text($_POST['name'] ?? '', 120);
$email = clean_text($_POST['email'] ?? '', 180);
$message = clean_text($_POST['message'] ?? '', 6000);
if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'message' => 'Enter your name, a valid email, and a project message.']);
}

$allowedFields = [
    'form_type',
    'name',
    'email',
    'phone',
    'organization',
    'country',
    'interest',
    'platform',
    'aircraft',
    'quantity',
    'budget',
    'timeline',
    'control_type',
    'mounting',
    'axes',
    'sensors',
    'buttons',
    'finish',
    'shipping_country',
    'message',
    'page_url',
];

$fields = [];
foreach ($allowedFields as $field) {
    $maxLength = $field === 'message' ? 6000 : 500;
    $value = clean_text($_POST[$field] ?? '', $maxLength);
    if ($value !== '') {
        $fields[$field] = $value;
    }
}

try {
    $reference = 'AV-' . gmdate('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
} catch (Throwable) {
    $reference = 'AV-' . gmdate('Ymd-His');
}

$attachment = null;
if (isset($_FILES['attachment']) && is_array($_FILES['attachment'])) {
    $upload = $_FILES['attachment'];
    $error = (int) ($upload['error'] ?? UPLOAD_ERR_NO_FILE);

    if ($error !== UPLOAD_ERR_NO_FILE) {
        if ($error !== UPLOAD_ERR_OK) {
            respond(422, ['ok' => false, 'message' => 'The attachment could not be uploaded.']);
        }

        $size = (int) ($upload['size'] ?? 0);
        $temporaryPath = (string) ($upload['tmp_name'] ?? '');
        if ($size < 1 || $size > MAX_ATTACHMENT_BYTES || !is_uploaded_file($temporaryPath)) {
            respond(422, ['ok' => false, 'message' => 'Attachments must be no larger than 8 MB.']);
        }

        $originalName = clean_text($upload['name'] ?? 'attachment', 180);
        $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        $allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx', 'dxf', 'dwg'];
        if (!in_array($extension, $allowedExtensions, true)) {
            respond(422, ['ok' => false, 'message' => 'That attachment type is not supported.']);
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = (string) $finfo->file($temporaryPath);
        $blockedMimes = [
            'application/x-httpd-php',
            'application/x-php',
            'text/html',
            'application/javascript',
            'text/javascript',
            'application/x-sh',
        ];
        if (in_array($mime, $blockedMimes, true)) {
            respond(422, ['ok' => false, 'message' => 'That attachment type is not supported.']);
        }

        $storedName = $reference . '.' . $extension;
        $destination = $attachmentDir . DIRECTORY_SEPARATOR . $storedName;
        if (!move_uploaded_file($temporaryPath, $destination)) {
            respond(500, ['ok' => false, 'message' => 'The attachment could not be stored.']);
        }

        $attachment = [
            'original_name' => $originalName,
            'stored_name' => $storedName,
            'mime' => $mime,
            'bytes' => $size,
        ];
    }
}

$record = [
    'reference' => $reference,
    'received_at_utc' => gmdate(DATE_ATOM),
    'ip_hash' => hash('sha256', $ip),
    'user_agent' => clean_text($_SERVER['HTTP_USER_AGENT'] ?? '', 500),
    'fields' => $fields,
    'attachment' => $attachment,
];

$recordFile = $monthDir . DIRECTORY_SEPARATOR . $reference . '.json';
if (file_put_contents(
    $recordFile,
    json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
    LOCK_EX
) === false) {
    respond(500, ['ok' => false, 'message' => 'The inquiry could not be stored.']);
}

$recipient = getenv('AVICORE_INQUIRY_EMAIL') ?: 'info@fsdcpak.com';
$subjectType = header_safe(clean_text($fields['form_type'] ?? 'Website inquiry', 80), 80);
if ($subjectType === '') {
    $subjectType = 'Website inquiry';
}
$subject = '[AviCore] ' . $subjectType . ' ' . $reference;
$lines = [
    'A new AviCore website inquiry was received.',
    '',
    'Reference: ' . $reference,
    'Received (UTC): ' . $record['received_at_utc'],
];
foreach ($fields as $key => $value) {
    $lines[] = ucwords(str_replace('_', ' ', $key)) . ': ' . $value;
}
if ($attachment !== null) {
    $lines[] = 'Stored attachment: ' . $attachment['stored_name'];
}
$host = preg_replace('/[^a-z0-9.-]/i', '', $requestHost) ?: 'fsdcpak.com';
$headers = [
    'Content-Type: text/plain; charset=UTF-8',
    'From: AviCore Website <noreply@' . $host . '>',
    'Reply-To: ' . header_safe($email, 180),
    'X-Mailer: PHP/' . PHP_VERSION,
];
$mailSent = @mail($recipient, $subject, implode(PHP_EOL, $lines), implode("\r\n", $headers));

$record['email_delivery_attempted'] = true;
$record['email_delivery_succeeded'] = $mailSent;
file_put_contents(
    $recordFile,
    json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
    LOCK_EX
);

respond(200, ['ok' => true, 'reference' => $reference]);
