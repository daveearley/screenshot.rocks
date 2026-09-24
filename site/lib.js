// Layout and helpers for the static content pages.

const SITE = 'https://screenshot.rocks';
const AUTHOR = {name: 'Dave Earley', url: 'https://github.com/daveearley'};
const GITHUB = 'https://github.com/daveearley/screenshot.rocks';

const escape = value => String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const plain = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const TOOLS = [
    {path: '/screenshot-mockup-generator/', label: 'Screenshot mockup generator'},
    {path: '/mobile-website-screenshot/', label: 'Mobile website screenshot'},
    {path: '/website-screenshot/', label: 'Website screenshot'},
    {path: '/screenshot-extension/', label: 'Browser extension'},
];

const figure = (src, alt, caption, {width, height, eager} = {}) => `
<figure>
  <img src="${src}" alt="${escape(alt)}"${width ? ` width="${width}" height="${height}"` : ''}${eager ? '' : ' loading="lazy"'} decoding="async">
  ${caption ? `<figcaption>${caption}</figcaption>` : ''}
</figure>`;

const steps = items => `<ol class="steps">${items.map(item => `<li>${item}</li>`).join('')}</ol>`;

const keys = (...combo) => combo.map(key => `<kbd>${key}</kbd>`).join('+');

const cta = (text = 'Open the editor', note = 'Free, no account, and your images stay in your browser.') => `
<aside class="cta">
  <div>
    <strong>Try it on your own screenshot</strong>
    <p>${note}</p>
  </div>
  <a class="button primary" href="/app">${text}</a>
</aside>`;

const note = html => `<p class="note">${html}</p>`;

const table = (headers, rows) => `
<div class="table-wrap"><table>
  <thead><tr>${headers.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead>
  <tbody>${rows.map(row => `<tr>${row.map((cell, i) => i === 0 ? `<th scope="row">${cell}</th>` : `<td data-label="${escape(plain(headers[i]))}">${cell}</td>`).join('')}</tr>`).join('')}</tbody>
</table></div>`;

const faqSection = faq => faq && faq.length ? `
<section class="faq" aria-labelledby="faq">
  <h2 id="faq">Frequently asked questions</h2>
  ${faq.map(({q, a}) => `<details><summary>${q}</summary><div>${a}</div></details>`).join('')}
</section>` : '';

const jsonLd = page => {
    const url = SITE + page.path;
    const graph = [];
    const crumbs = [{name: 'Screenshot.Rocks', path: '/'}, ...(page.breadcrumbs || []), {name: page.breadcrumb || page.h1, path: page.path}];
    graph.push({
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((crumb, index) => ({
            '@type': 'ListItem', position: index + 1, name: crumb.name, item: SITE + crumb.path,
        })),
    });
    if (page.type === 'article') {
        graph.push({
            '@type': 'Article',
            headline: page.h1,
            description: page.description,
            image: page.image ? SITE + page.image : undefined,
            datePublished: page.published,
            dateModified: page.updated || page.published,
            author: {'@type': 'Person', ...AUTHOR},
            publisher: {'@type': 'Organization', name: 'Screenshot.Rocks', url: SITE, logo: SITE + '/images/hand-logo-sqr-white.png'},
            mainEntityOfPage: url,
        });
    }
    if (page.type === 'tool') {
        graph.push({
            '@type': 'WebApplication',
            name: page.appName || 'Screenshot.Rocks',
            url: SITE + '/app',
            description: page.description,
            applicationCategory: 'DesignApplication',
            operatingSystem: 'Any (runs in the browser)',
            browserRequirements: 'Requires JavaScript',
            isAccessibleForFree: true,
            offers: {'@type': 'Offer', price: '0', priceCurrency: 'USD'},
            image: page.image ? SITE + page.image : undefined,
        });
    }
    if (page.howTo) {
        graph.push({
            '@type': 'HowTo',
            name: page.howTo.name,
            totalTime: page.howTo.totalTime,
            step: page.howTo.steps.map((step, index) => ({'@type': 'HowToStep', position: index + 1, name: step.name, text: plain(step.text)})),
        });
    }
    if (page.faq && page.faq.length) {
        graph.push({
            '@type': 'FAQPage',
            mainEntity: page.faq.map(({q, a}) => ({'@type': 'Question', name: plain(q), acceptedAnswer: {'@type': 'Answer', text: plain(a)}})),
        });
    }
    return JSON.stringify({'@context': 'https://schema.org', '@graph': graph}).replace(/</g, '\\u003c');
};

const breadcrumbNav = page => {
    const crumbs = [{name: 'Home', path: '/'}, ...(page.breadcrumbs || [])];
    return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${crumbs.map(c => `<li><a href="${c.path}">${c.name}</a></li>`).join('')}<li aria-current="page">${page.breadcrumb || page.h1}</li></ol></nav>`;
};

const related = (page, pages) => {
    const items = (page.related || []).map(path => pages.find(p => p.path === path)).filter(Boolean);
    if (!items.length) return '';
    return `
<section class="related" aria-labelledby="related">
  <h2 id="related">Related</h2>
  <ul>${items.map(p => `<li><a href="${p.path}"><strong>${p.navTitle || p.h1}</strong><span>${p.summary || p.description}</span></a></li>`).join('')}</ul>
</section>`;
};

const formatDate = iso => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'});

const layout = (page, pages) => {
    const url = SITE + page.path;
    const guides = pages.filter(p => p.path.startsWith('/guides/') && p.path !== '/guides/');
    const image = SITE + (page.image || '/images/home/example-browser.jpg');
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(page.title)}</title>
<meta name="description" content="${escape(page.description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${page.type === 'article' ? 'article' : 'website'}">
<meta property="og:site_name" content="Screenshot.Rocks">
<meta property="og:title" content="${escape(page.ogTitle || page.h1)}">
<meta property="og:description" content="${escape(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#121214">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/site.css">
<script type="application/ld+json">${jsonLd(page)}</script>
<script src="https://cdn.usefathom.com/script.js" data-site="TJAMQVTD" defer></script>
</head>
<body>
<a class="skip" href="#content">Skip to content</a>
<header class="nav">
  <a class="brand" href="/"><img src="/images/hand-logo-sqr-white.png" alt="" width="24" height="24">Screenshot.Rocks</a>
  <nav aria-label="Main">
    <a href="/guides/">Guides</a>
    <a href="/screenshot-extension/">Extension</a>
    <a class="button" href="/app">Open editor</a>
  </nav>
</header>
<main id="content" class="${page.type}">
  ${page.path === '/' ? '' : breadcrumbNav(page)}
  <article>
    <header class="page-header">
      <h1>${page.h1}</h1>
      ${page.lede ? `<p class="lede">${page.lede}</p>` : ''}
      ${page.type === 'article' ? `<p class="byline">By <a href="${AUTHOR.url}" rel="author">${AUTHOR.name}</a> · Updated <time datetime="${page.updated || page.published}">${formatDate(page.updated || page.published)}</time></p>` : ''}
    </header>
    ${page.body}
    ${faqSection(page.faq)}
  </article>
  ${related(page, pages)}
</main>
<footer class="footer">
  <div class="footer-columns">
    <div>
      <h2>Tools</h2>
      <ul><li><a href="/app">Editor</a></li>${TOOLS.map(t => `<li><a href="${t.path}">${t.label}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h2>Guides</h2>
      <ul>${guides.map(g => `<li><a href="${g.path}">${g.navTitle || g.h1}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h2>About</h2>
      <ul>
        <li><a href="${GITHUB}">Source code on GitHub</a></li>
        <li><a href="/privacy.html">Privacy</a></li>
        <li><a href="mailto:dave+screenshot.rocks@earley.email">Contact</a></li>
      </ul>
    </div>
  </div>
  <p class="colophon">Screenshot.Rocks is free and open source. Made in Dublin by Dave Earley.</p>
</footer>
</body>
</html>
`;
};

module.exports = {SITE, GITHUB, escape, plain, figure, steps, keys, cta, note, table, layout};
