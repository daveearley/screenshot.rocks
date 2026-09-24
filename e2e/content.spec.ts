import fs from 'fs';
import path from 'path';
import {test, expect} from './fixtures';

const build = path.join(__dirname, '../build');
const sitemap = () => fs.readFileSync(path.join(build, 'sitemap.xml'), 'utf8');
const sitemapPaths = () => Array.from(sitemap().matchAll(/<loc>https:\/\/screenshot\.rocks([^<]*)<\/loc>/g)).map(match => match[1]);
const contentPaths = () => sitemapPaths().filter(p => p !== '/');

/** True when the path is served by a real file rather than the app's catch-all fallback. */
const exists = (href: string) => {
    const {pathname} = new URL(href, 'http://localhost');
    if (pathname === '/' || pathname === '/app') return true;
    const file = path.join(build, decodeURIComponent(pathname));
    return fs.existsSync(pathname.endsWith('/') ? path.join(file, 'index.html') : file);
};

test('sitemap lists the homepage and every content page', () => {
    const paths = sitemapPaths();
    expect(paths[0]).toBe('/');
    expect(paths).toEqual(expect.arrayContaining(['/guides/', '/screenshot-mockup-generator/', '/guides/full-page-screenshot/']));
    for (const p of contentPaths()) expect(exists(p), `${p} has no file`).toBe(true);
});

test('sitemap is valid XML whose URLs, dates and images all check out', async ({page, request}) => {
    const response = await request.get('/sitemap.xml');
    expect(response.headers()['content-type']).toContain('xml');
    const xml = await response.text();
    await page.goto('/guides/');
    const parsed = await page.evaluate(source => {
        const doc = new DOMParser().parseFromString(source, 'application/xml');
        if (doc.querySelector('parsererror')) return {error: doc.querySelector('parsererror')!.textContent};
        return {
            urls: Array.from(doc.getElementsByTagName('url')).map(url => ({
                loc: url.getElementsByTagName('loc')[0].textContent!,
                lastmod: url.getElementsByTagName('lastmod')[0].textContent!,
                images: Array.from(url.getElementsByTagNameNS('http://www.google.com/schemas/sitemap-image/1.1', 'loc')).map(n => n.textContent!),
            })),
        };
    }, xml);
    expect(parsed.error).toBeUndefined();
    expect(parsed.urls!.length).toBeGreaterThan(5);
    expect(parsed.urls!.some(u => u.loc.endsWith('/app'))).toBe(false);

    for (const {loc, lastmod, images} of parsed.urls!) {
        const urlPath = new URL(loc).pathname;
        expect(lastmod, loc).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        const pageResponse = await request.get(urlPath);
        expect(pageResponse.status(), loc).toBe(200);
        if (urlPath !== '/') {
            // Each sitemap URL must be exactly the page's canonical URL.
            expect(await pageResponse.text(), loc).toContain(`<link rel="canonical" href="${loc}">`);
        }
        for (const image of images) {
            expect((await request.get(new URL(image).pathname)).headers()['content-type'], image).toMatch(/^image\//);
        }
    }
});

test('llms-full.txt contains the full text of the guides', async ({request}) => {
    const full = await (await request.get('/llms-full.txt')).text();
    expect(full).toContain('## How to take a full-page screenshot in any browser');
    expect(full).toContain('Capture full size screenshot');
    // No leftover markup (the Safari steps legitimately mention the <html> element as text).
    expect(full).not.toMatch(/<\/?(p|a|strong|em|li|ul|ol|h[1-6]|div|span|code|kbd|figure|img|table|td|th)[\s>]/);
});

test('robots.txt and llms.txt point to the content', async ({request}) => {
    expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap: https://screenshot.rocks/sitemap.xml');
    const llms = await (await request.get('/llms.txt')).text();
    expect(llms).toMatch(/^# Screenshot\.Rocks/);
    for (const p of contentPaths().filter(p => p !== '/guides/')) expect(llms).toContain(`https://screenshot.rocks${p}`);
});

test('every content page has unique, well-formed metadata', async ({page}) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const p of contentPaths()) {
        const response = await page.goto(p);
        expect(response!.status(), p).toBe(200);
        await expect(page.locator('h1'), p).toHaveCount(1);

        const title = await page.title();
        const description = await page.locator('meta[name="description"]').getAttribute('content');
        expect(title.length, `${p} title length`).toBeLessThanOrEqual(70);
        expect(description!.length, `${p} description length`).toBeGreaterThan(80);
        expect(description!.length, `${p} description length`).toBeLessThanOrEqual(165);
        expect(titles.has(title), `${p} duplicate title`).toBe(false);
        expect(descriptions.has(description!), `${p} duplicate description`).toBe(false);
        titles.add(title);
        descriptions.add(description!);

        await expect(page.locator('link[rel="canonical"]'), p).toHaveAttribute('href', `https://screenshot.rocks${p}`);
        await expect(page.locator('meta[property="og:image"]'), p).toHaveAttribute('content', /^https:\/\/screenshot\.rocks\/images\//);

        const jsonLd = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() || '{}');
        const types = jsonLd['@graph'].map((node: {'@type': string}) => node['@type']);
        expect(types, p).toContain('BreadcrumbList');
        if (p.startsWith('/guides/') && p !== '/guides/') expect(types, p).toContain('Article');
    }
});

test('every internal link and image on content pages resolves', async ({page}) => {
    const broken: string[] = [];
    for (const p of contentPaths()) {
        await page.goto(p);
        const hrefs = await page.locator('a[href^="/"]').evaluateAll(links => links.map(link => link.getAttribute('href')!));
        for (const href of hrefs) if (!exists(href)) broken.push(`${p} → ${href}`);
        const sources = await page.locator('img').evaluateAll(images => images.map(image => image.getAttribute('src')!));
        for (const src of sources) if (src.startsWith('/') && !exists(src)) broken.push(`${p} → image ${src}`);
    }
    expect(broken).toEqual([]);
});

test('the homepage links to the tools and guides', async ({page}) => {
    await page.goto('/');
    const footer = page.getByRole('contentinfo');
    for (const p of contentPaths().filter(p => p !== '/guides/')) {
        await expect(footer.locator(`a[href="${p}"]`), p).toHaveCount(1);
    }
    await expect(page.getByRole('navigation', {name: 'Main'}).getByRole('link', {name: 'Guides'})).toHaveAttribute('href', '/guides/');
});

test('the homepage has crawlable content before JavaScript runs', async ({request}) => {
    const html = await (await request.get('/')).text();
    expect(html).toMatch(/<link rel="canonical" href="https:\/\/screenshot\.rocks\/"\s*\/?>/);
    expect(html).toContain('Make beautiful screenshots.');
    expect(html).toContain('href="/guides/"');
});

test('a guide page links into the editor', async ({page}) => {
    await page.goto('/guides/beautiful-screenshots/');
    await page.getByRole('link', {name: 'Open the editor'}).first().click();
    await expect(page).toHaveURL(/\/app$/);
    await expect(page.locator('#main input[type=file][accept*=".png"]')).toBeAttached();
});
