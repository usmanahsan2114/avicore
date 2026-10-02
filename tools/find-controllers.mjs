import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = fs.readdirSync(root).filter((f) => f.endsWith(".html"));
const results = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(root, file), "utf8");
  for (const match of content.matchAll(/src=["']([^"']+)["']/g)) {
    const src = match[1];
    if (/controller|game|xbox/i.test(src)) {
      results.push({ file, src });
    }
  }
}

console.log(JSON.stringify(results, null, 2));
