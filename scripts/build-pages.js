// Writes the static pages, sitemap and llms.txt files into the build. Usage: node scripts/build-pages.js [outDir]
const fs = require('fs');
const path = require('path');
const {renderSite} = require('../site/render');

const ROOT = path.join(__dirname, '..');
const OUT = path.resolve(ROOT, process.argv[2] || 'build');

const {files, pages, warnings} = renderSite();
warnings.forEach(warning => console.warn(`warning: ${warning}`));

for (const [urlPath, {body}] of Object.entries(files)) {
    // "/guides/" becomes build/guides/index.html so static hosts serve it at the clean URL.
    const file = path.join(OUT, urlPath.endsWith('/') ? `${urlPath}index.html` : urlPath);
    fs.mkdirSync(path.dirname(file), {recursive: true});
    fs.writeFileSync(file, body);
}

console.log(`Built ${pages.length} pages, sitemap.xml and llms.txt into ${path.relative(ROOT, OUT) || '.'}`);
