// Renders the static content pages. Used by scripts/build-pages.js (production) and src/setupProxy.js (yarn start).
const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, 'pages');

// Fresh requires so edits show on reload in development.
const loadPages = () => {
    for (const id of Object.keys(require.cache)) {
        if (id.startsWith(__dirname + path.sep)) delete require.cache[id];
    }
    return fs.readdirSync(PAGES_DIR)
        .filter(file => file.endsWith('.js'))
        .map(file => require(path.join(PAGES_DIR, file)))
        .sort((a, b) => a.order - b.order);
};

const validate = pages => {
    const seen = new Set();
    const warnings = [];
    for (const page of pages) {
        for (const field of ['path', 'title', 'description', 'h1', 'body', 'published']) {
            if (!page[field]) throw new Error(`${page.path || 'page'} is missing "${field}"`);
        }
        // Clean URLs end in a slash; a few legacy URLs (like /privacy.html, linked from the extension stores) keep their name.
        if (!/^\/([a-z0-9-]+\/)*([a-z0-9-]+\.html)?$/.test(page.path)) throw new Error(`Bad path "${page.path}"; use lowercase and a trailing slash`);
        if (seen.has(page.path)) throw new Error(`Duplicate path ${page.path}`);
        seen.add(page.path);
        if (page.title.length > 70) warnings.push(`title over 70 characters on ${page.path}`);
        if (page.description.length > 165) warnings.push(`description over 165 characters on ${page.path}`);
        for (const target of page.related || []) {
            if (!pages.some(p => p.path === target)) throw new Error(`${page.path} links to unknown page ${target}`);
        }
    }
    return warnings;
};

const renderSite = () => {
    const pages = loadPages();
    const warnings = validate(pages);
    const {SITE, escape, layout} = require('./lib');
    const guides = pages.filter(page => page.path.startsWith('/guides/') && page.path !== '/guides/');
    const files = {};

    const guideList = `<ul class="guide-list">${guides.map(g =>
        `<li><a href="${g.path}"><strong>${escape(g.navTitle || g.h1)}</strong><span>${escape(g.summary || g.description)}</span></a></li>`).join('')}</ul>`;
    for (const page of pages) {
        const rendered = {...page, body: page.body.replace('<!--guide-list-->', guideList)};
        files[page.path] = {contentType: 'text/html; charset=utf-8', body: layout(rendered, pages)};
    }

    files['/site.css'] = {contentType: 'text/css; charset=utf-8', body: fs.readFileSync(path.join(__dirname, 'site.css'), 'utf8')};

    // No /app (nothing to index); no <priority> or <changefreq>, which Google ignores.
    const xml = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const updated = page => page.updated || page.published;
    const imagesIn = html => Array.from(new Set(Array.from(html.matchAll(/<img[^>]+src="(\/images\/[^"]+\.(?:jpe?g|png|webp))"/g)).map(m => m[1])));
    const HOMEPAGE_IMAGES = ['/images/home/example-browser.jpg', '/images/home/example-iphone.jpg', '/images/home/example-markup.jpg'];
    const urls = [
        {path: '/', updated: pages.map(updated).sort().pop(), images: HOMEPAGE_IMAGES},
        ...pages.map(p => ({path: p.path, updated: updated(p), images: imagesIn(p.body)})),
    ];
    files['/sitemap.xml'] = {contentType: 'application/xml; charset=utf-8', body: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(u => `  <url>
    <loc>${xml(SITE + u.path)}</loc>
    <lastmod>${u.updated}</lastmod>
${u.images.map(src => `    <image:image><image:loc>${xml(SITE + src)}</image:loc></image:image>`).join('\n')}
  </url>`.replace(/\n\n/g, '\n')).join('\n')}
</urlset>
`};

    // https://llmstxt.org
    const line = p => `- [${p.navTitle || p.h1}](${SITE}${p.path}): ${p.summary || p.description}`;
    files['/llms.txt'] = {contentType: 'text/plain; charset=utf-8', body: `# Screenshot.Rocks

> Free, open-source web app for turning screenshots into mockups. Put a screenshot in a browser window or an iPhone frame, add a background, mark it up (text, boxes, arrows, numbered steps, blur) and export PNG, JPEG, WebP or SVG. Images are processed in the browser and not stored. No account or watermark.

Key facts:
- Editor: ${SITE}/app
- Frames: browser window (six styles or custom colors, editable address bar), iPhone (five finishes, optional Dynamic Island), or no frame.
- Canvas sizes: presets for 16:9, 4:3, 1:1, 4:5 and 9:16, or any width and height from 500 to 2300 px. The export matches the canvas size.
- Website capture: enter a URL to capture the first screen of a page, desktop (1440 × 800 at 2×) or mobile (375 × 812 at 3×).
- Browser extensions for Chrome, Firefox and Edge capture the current tab and open it in the editor.
- Source code: https://github.com/daveearley/screenshot.rocks

## Tools

${pages.filter(p => p.type === 'tool').map(line).join('\n')}

## Guides

${guides.map(line).join('\n')}

## About

${pages.filter(p => p.type === 'legal').map(line).join('\n')}

## Optional

- [Full text of every page](${SITE}/llms-full.txt): all guides and tool pages as plain text.
`};

    // The full text of every page, for assistants that ingest whole sites.
    const text = html => html
        .replace(/<(script|style)[\s\S]*?<\/\1>/g, '')
        .replace(/<\/(p|li|h[1-6]|tr|figcaption|summary|details)>/g, '\n')
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<(td|th)[^>]*>/g, ' | ')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
        .replace(/[ \t]+/g, ' ').replace(/\n\s+/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    files['/llms-full.txt'] = {contentType: 'text/plain; charset=utf-8', body: `# Screenshot.Rocks: full text of guides and tool pages

${pages.filter(p => p.type !== 'index').map(p => {
        const body = p.body.replace('<!--guide-list-->', '');
        const faq = (p.faq || []).map(({q, a}) => `Q: ${text(q)}\nA: ${text(a)}`).join('\n\n');
        return `## ${text(p.h1)}\n\nURL: ${SITE}${p.path}\nUpdated: ${updated(p)}\n\n${p.lede ? text(p.lede) + '\n\n' : ''}${text(body)}${faq ? '\n\nFrequently asked questions\n\n' + faq : ''}`;
    }).join('\n\n---\n\n')}
`};

    return {files, pages, warnings};
};

module.exports = {renderSite};
