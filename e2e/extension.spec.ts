import path from 'path';
import {chromium, BrowserContext} from '@playwright/test';
import {test, expect, demoImageDataUrl, postLikeExtension} from './fixtures';

const extensionPath = path.join(__dirname, '../browser-extension');

test.describe('extension POST contract', () => {
    test('a posted screenshot opens in the editor exactly once', async ({page}) => {
        await postLikeExtension(page, demoImageDataUrl);
        await expect(page).toHaveURL(/\/app\?utm_source=extension$/);
        await expect(page.locator('#canvas').getByRole('img', {name: 'Screenshot'})).toHaveAttribute('src', demoImageDataUrl);
        expect(await page.evaluate(() => sessionStorage.getItem('imageFromPost'))).toBeNull();

        // The payload is single-use: reloading shows the uploader rather than re-importing.
        await page.reload();
        await expect(page.locator('#canvas')).toHaveCount(0);
        await expect(page.locator('#main input[type=file][accept*=".png"]')).toBeAttached();
    });

    test('an invalid payload is rejected with a helpful message', async ({page}) => {
        await postLikeExtension(page, 'not-an-image');
        await expect(page.getByText('The screenshot could not be read')).toBeVisible();
    });

    test('GET requests are rejected', async ({request}) => {
        const response = await request.get('/api/setImage');
        expect(response.status()).toBe(405);
        expect(response.headers()['allow']).toBe('POST');
    });
});

test.describe('installed browser extension', () => {
    let context: BrowserContext;

    test.beforeEach(async ({baseURL}) => {
        context = await chromium.launchPersistentContext('', {
            channel: 'chromium',
            args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
        });
        // The extension posts to production; send it to the local build instead.
        await context.route('https://screenshot.rocks/**', async route => {
            const url = new URL(route.request().url());
            const response = await route.fetch({url: `${baseURL}${url.pathname}${url.search}`});
            await route.fulfill({response});
        });
        await context.route('https://cdn.usefathom.com/**', route => route.abort());
    });

    test.afterEach(async () => context && context.close());

    test('transfer page hands the capture to the editor', async () => {
        const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');

        // captureVisibleTab needs a real toolbar click, which automation cannot perform. Stage the capture the same
        // way the click handler does (open post.html, then register the image for that tab) and let the real
        // post.html/screenshot.js handshake and form POST run from there.
        const editorPage = context.waitForEvent('page', page => page.url().includes('post.html'));
        await worker.evaluate(image => new Promise<void>(resolve => {
            chrome.tabs.create({url: chrome.runtime.getURL('post.html')}, tab => {
                // @ts-ignore - top-level const in the extension's background.js
                pendingCaptures.set(tab!.id, image);
                resolve();
            });
        }), demoImageDataUrl);

        const page = await editorPage;
        await page.waitForURL('https://screenshot.rocks/app?utm_source=extension');
        await expect(page.locator('#canvas').getByRole('img', {name: 'Screenshot'})).toHaveAttribute('src', demoImageDataUrl);
        await expect(page.getByRole('button', {name: 'Export PNG'})).toBeEnabled();
    });

    test('transfer page shows an error when no capture is waiting', async () => {
        test.setTimeout(20_000);
        const extensionId = new URL((context.serviceWorkers()[0] || await context.waitForEvent('serviceworker')).url()).host;
        const page = await context.newPage();
        await page.goto(`chrome-extension://${extensionId}/post.html`);
        await expect(page.getByText('Unable to open this screenshot')).toBeVisible({timeout: 10_000});
    });
});
