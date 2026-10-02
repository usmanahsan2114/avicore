/**
 * AviCore — fetch a pool of distinct aviation stock images.
 *
 * Run:  node tools/fetch-stock-images.mjs
 *
 * The site needs 116 image slots filled with no visual repeated on any two
 * pages. Only ~88 usable visuals exist on disk, and the 116 files in
 * assets/images/unique/ turned out to be re-encodes of just 10 source images,
 * so the apparent variety was fake.
 *
 * Downloads to assets/images/stock/, deduplicated by Unsplash photo ID so the
 * same photograph can never arrive twice under two names.
 *
 * Node's fetch() is served a 401 by Unsplash's bot check; curl gets a 200, so
 * every request shells out to curl.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'assets', 'images', 'stock');
fs.mkdirSync(OUT, { recursive: true });

const QUERIES = [
  'flight-simulator', 'aircraft-cockpit', 'avionics', 'airplane-instrument-panel',
  'flight-training', 'pilot-training', 'glass-cockpit', 'helicopter-cockpit',
  'aviation-headset', 'aircraft-hangar', 'airport-runway', 'small-airplane',
  '3d-printing', 'electronics-workshop', 'circuit-board', 'soldering-electronics',
  'cnc-machine', 'engineering-workshop', 'prototype-electronics', 'workbench-tools',
  'control-panel', 'switch-panel', 'flight-deck', 'aviation-classroom',
  'simulator-training', 'aerospace-engineering', 'cockpit-instruments', 'joystick-controller',
  'airplane-propeller', 'air-traffic-control', 'aviation-maintenance', 'technical-drawing',
  'flight-instructor', 'cessna', 'aviation-students', 'radio-equipment',
  'desk-setup-monitors', 'aircraft-parts', 'gauge-dial', 'rotary-switch',
];

const PER_QUERY = 4;

function curlText(url) {
  try {
    return execFileSync('curl', ['-s', '-L', '--max-time', '30', url], {
      encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    });
  } catch { return ''; }
}

function curlBinary(url, dest) {
  try {
    execFileSync('curl', ['-s', '-L', '--max-time', '45', '-o', dest, url], { maxBuffer: 4096 });
    return fs.existsSync(dest) ? fs.statSync(dest).size : 0;
  } catch { return 0; }
}

const ID_RE = /images\.unsplash\.com\/photo-([0-9a-f]{10,}-[0-9a-f]+)/g;

function scrape(q) {
  const html = curlText('https://unsplash.com/s/photos/' + q);
  if (!html) return [];
  return [...new Set([...html.matchAll(ID_RE)].map(m => m[1]))];
}

function download(id, name) {
  const url = 'https://images.unsplash.com/photo-' + id +
    '?w=1400&h=933&fit=crop&crop=entropy&q=72&fm=jpg';
  const dest = path.join(OUT, name);
  const size = curlBinary(url, dest);
  if (size < 12000) { try { fs.unlinkSync(dest); } catch {} return 0; }
  const head = fs.readFileSync(dest).subarray(0, 2);
  if (head[0] !== 0xff || head[1] !== 0xd8) { fs.unlinkSync(dest); return 0; }
  return size;
}

const seen = new Set(
  fs.readdirSync(OUT)
    .map(f => (f.match(/photo-([0-9a-f-]+)\.jpg$/) || [, ''])[1])
    .filter(Boolean)
);

let got = 0;
for (const q of QUERIES) {
  const ids = scrape(q);
  let taken = 0;
  for (const id of ids) {
    if (taken >= PER_QUERY) break;
    const short = id.slice(0, 14);
    if (seen.has(short)) continue;
    seen.add(short);
    const size = download(id, `${q}-photo-${short}.jpg`);
    if (size) {
      got++; taken++;
      console.log(`  ${String(Math.round(size / 1024)).padStart(4)} KB  ${q}-photo-${short}.jpg`);
    }
  }
  if (!ids.length) console.log(`  (no results) ${q}`);
}

const total = fs.readdirSync(OUT).filter(f => f.endsWith('.jpg')).length;
console.log(`\nfetched ${got} new — ${total} total in assets/images/stock/`);
