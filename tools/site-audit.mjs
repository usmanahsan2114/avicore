import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

console.log(`Auditing ${htmlFiles.length} HTML files...`);

let brokenImages = [];
let brokenLinks = [];
let brokenAssets = [];
let placeholderTexts = [];

for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
    
    // Check images
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
        let src = match[1];
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) continue;
        src = src.split('?')[0].split('#')[0];
        const fullPath = path.join(rootDir, src.replace(/\//g, path.sep));
        if (!fs.existsSync(fullPath)) {
            brokenImages.push({ file, src });
        }
    }

    // Check stylesheets & scripts
    const assetRegex = /<(?:link[^>]+href|script[^>]+src)=["']([^"']+)["']/gi;
    while ((match = assetRegex.exec(content)) !== null) {
        let src = match[1];
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) continue;
        if (src.endsWith('.css') || src.endsWith('.js')) {
            src = src.split('?')[0].split('#')[0];
            const fullPath = path.join(rootDir, src.replace(/\//g, path.sep));
            if (!fs.existsSync(fullPath)) {
                brokenAssets.push({ file, src });
            }
        }
    }

    // Check internal links
    const linkRegex = /<a[^>]+href=["']([^"'#:]+\.html)(?:#[^"']*)?["']/gi;
    while ((match = linkRegex.exec(content)) !== null) {
        const href = match[1];
        const fullPath = path.join(rootDir, href.replace(/\//g, path.sep));
        if (!fs.existsSync(fullPath)) {
            brokenLinks.push({ file, href });
        }
    }

    // Check placeholder texts
    if (/lorem ipsum/i.test(content)) {
        placeholderTexts.push(file);
    }
}

console.log('Broken Images count:', brokenImages.length);
if (brokenImages.length > 0) console.log(brokenImages.slice(0, 10));

console.log('Broken Assets (CSS/JS) count:', brokenAssets.length);
if (brokenAssets.length > 0) console.log(brokenAssets.slice(0, 10));

console.log('Broken Internal Links count:', brokenLinks.length);
if (brokenLinks.length > 0) console.log(brokenLinks.slice(0, 10));

console.log('Files with Lorem Ipsum count:', placeholderTexts.length);
if (placeholderTexts.length > 0) console.log(placeholderTexts);
