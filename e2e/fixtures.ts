import {test as base, expect, Page} from '@playwright/test';
import fs from 'fs';
import path from 'path';

export const demoImagePath = path.join(__dirname, '../public/images/demo-image.png');
export const demoImageDataUrl = `data:image/png;base64,${fs.readFileSync(demoImagePath).toString('base64')}`;

export const pngSize = (buffer: Buffer) => ({width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20)});

/** Submits a screenshot exactly as the browser extension's post.html does: a URL-encoded form POST. */
export const postLikeExtension = async (page: Page, image: string) => {
    await page.goto('about:blank');
    await page.setContent('<form method="post" enctype="application/x-www-form-urlencoded"><input type="hidden" name="image"></form>');
    await page.evaluate(({image, action}) => {
        const form = document.forms[0];
        form.action = action;
        (form.elements.namedItem('image') as HTMLInputElement).value = image;
        form.submit();
    }, {image, action: new URL('/api/setImage', process.env.E2E_BASE_URL || 'http://127.0.0.1:5055').href});
};

export const test = base.extend<{pageErrors: string[]}>({
    pageErrors: [async ({page}, use) => {
        const errors: string[] = [];
        const dialogs: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        // The editor should never fall back to browser prompt/confirm/alert dialogs.
        page.on('dialog', dialog => { dialogs.push(`${dialog.type()}: ${dialog.message()}`); dialog.dismiss().catch(() => undefined); });
        await page.route('https://cdn.usefathom.com/**', route => route.abort());
        await use(errors);
        expect(errors, 'uncaught errors in the page').toEqual([]);
        expect(dialogs, 'browser dialogs shown').toEqual([]);
    }, {auto: true}],
});

export {expect};
