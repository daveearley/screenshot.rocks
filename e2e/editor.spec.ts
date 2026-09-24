import fs from 'fs';
import {Page} from '@playwright/test';
import {test, expect, demoImagePath, pngSize} from './fixtures';

const inspector = (page: Page) => page.getByRole('complementary', {name: 'Inspector'});
const frameButton = (page: Page, name: 'Browser' | 'iPhone' | 'Image') =>
    page.getByRole('group', {name: 'Frame type'}).getByRole('button', {name, exact: true});
const backgroundButton = (page: Page, name: 'Color' | 'Gradient' | 'Image' | 'None') =>
    page.getByRole('group', {name: 'Background type'}).getByRole('button', {name, exact: true});
// Browser/Image frames label the screenshot "Screenshot"; the iPhone frame labels it "iPhone mockup".
const screenshot = (page: Page) => page.locator('#canvas').getByRole('img', {name: /^(Screenshot|iPhone mockup)$/});
const uploader = (page: Page) => page.locator('#main input[type=file][accept*=".png"]');
const toolbarButton = (page: Page, name: string) => page.getByRole('banner').getByRole('button', {name, exact: true});
const markupTool = (page: Page, name: string) => page.getByRole('toolbar', {name: 'Markup tools'}).getByRole('button', {name, exact: true});
const canvasBackground = (page: Page) => page.locator('#canvas').evaluate(el => getComputedStyle(el).background);

const openEditorWithUpload = async (page: Page) => {
    await page.goto('/');
    await page.locator('input[type=file]').setInputFiles(demoImagePath);
    await expect(page).toHaveURL(/\/app$/);
    await expect(screenshot(page)).toBeVisible();
};

const paintedAnnotationPixels = (page: Page) => page.locator('#canvas canvas').evaluateAll(canvases =>
    canvases.reduce((total, canvas) => {
        const {width, height} = canvas as HTMLCanvasElement;
        if (!width || !height) return total;
        const data = (canvas as HTMLCanvasElement).getContext('2d')!.getImageData(0, 0, width, height).data;
        let painted = 0;
        for (let i = 3; i < data.length; i += 4) if (data[i] > 0) painted++;
        return total + painted;
    }, 0));

const dragOnScreenshot = async (page: Page, from: [number, number], to: [number, number]) => {
    const box = (await screenshot(page).boundingBox())!;
    await page.mouse.move(box.x + box.width * from[0], box.y + box.height * from[1]);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * to[0], box.y + box.height * to[1], {steps: 10});
    await page.mouse.up();
};

const drawRectangle = async (page: Page) => {
    await toolbarButton(page, 'Markup').click();
    await expect(toolbarButton(page, 'Markup')).toHaveAttribute('aria-pressed', 'true');
    await markupTool(page, 'Rectangle').click();
    const before = await paintedAnnotationPixels(page);
    await dragOnScreenshot(page, [.2, .3], [.6, .7]);
    await expect.poll(() => paintedAnnotationPixels(page)).toBeGreaterThan(before);
    return before;
};

const exportAs = async (page: Page, label: 'PNG' | 'JPEG' | 'WebP' | 'SVG') => {
    const downloadPromise = page.waitForEvent('download');
    if (label === 'PNG') {
        await page.getByRole('button', {name: 'Export PNG'}).click();
    } else {
        await page.getByRole('button', {name: 'Choose export format'}).click();
        await page.getByRole('menuitemradio', {name: new RegExp(`Export as ${label}`)}).click();
    }
    const download = await downloadPromise;
    return {name: download.suggestedFilename(), file: fs.readFileSync((await download.path())!)};
};

const pixelAt = (page: Page, file: Buffer, mime: string, x: number, y: number) => page.evaluate(async ({src, x, y}) => {
    const image = new Image();
    image.src = src;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0);
    return Array.from(context.getImageData(x, y, 1, 1).data);
}, {src: `data:${mime};base64,${file.toString('base64')}`, x, y});

test.beforeEach(async ({page}) => {
    // Start each test from a clean slate; the editor persists styles and looks in localStorage.
    await page.addInitScript(() => {
        if (!sessionStorage.getItem('__e2e_cleared')) {
            localStorage.clear();
            sessionStorage.setItem('__e2e_cleared', '1');
        }
    });
});

test('homepage upload opens the editor with a browser frame for landscape screenshots', async ({page}) => {
    await openEditorWithUpload(page);
    await expect(frameButton(page, 'Browser')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('textbox', {name: 'Frame website address'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Export PNG'})).toBeEnabled();
});

test('mobile demo picks the iPhone frame for portrait screenshots', async ({page}) => {
    await page.goto('/');
    await page.getByRole('button', {name: 'Mobile', exact: true}).click();
    await expect(page).toHaveURL(/\/app$/);
    await expect(frameButton(page, 'iPhone')).toHaveAttribute('aria-pressed', 'true');
});

test('editor without an image shows the uploader and disables editing controls', async ({page}) => {
    await page.goto('/app');
    await expect(uploader(page)).toBeAttached();
    await expect(page.getByRole('button', {name: 'Export PNG'})).toBeDisabled();
    await expect(toolbarButton(page, 'Markup')).toBeDisabled();
    await expect(toolbarButton(page, 'Crop')).toBeDisabled();
});

test('replace swaps the screenshot and resets markup and history', async ({page}) => {
    await openEditorWithUpload(page);
    await drawRectangle(page);
    const originalSrc = await screenshot(page).getAttribute('src');
    // Same pixels under a different MIME type, so FileReader yields a different data URL.
    await page.getByLabel('Replace screenshot file').setInputFiles({name: 'replacement.jpg', mimeType: 'image/jpeg', buffer: fs.readFileSync(demoImagePath)});
    await expect(screenshot(page)).not.toHaveAttribute('src', originalSrc!);
    await expect.poll(() => paintedAnnotationPixels(page)).toBe(0);
    await expect(toolbarButton(page, 'Undo')).toBeDisabled();
});

test('every frame type has its own options', async ({page}) => {
    await openEditorWithUpload(page);
    const frameSection = page.getByRole('region', {name: 'Frame'});

    await expect(frameSection.getByRole('group', {name: 'Browser style'})).toBeVisible();
    await expect(frameSection.getByRole('switch', {name: 'Address bar'})).toBeVisible();

    await frameButton(page, 'iPhone').click();
    await expect(frameButton(page, 'iPhone')).toHaveAttribute('aria-pressed', 'true');
    await expect(frameSection.getByRole('group', {name: 'iPhone finish'})).toBeVisible();
    await expect(frameSection.getByRole('switch', {name: 'Dynamic Island'})).toBeVisible();
    await expect(frameSection).not.toContainText('edge-to-edge');

    await frameButton(page, 'Image').click();
    await expect(frameSection.getByRole('switch', {name: 'Hairline outline'})).toBeVisible();
    await expect(frameSection.getByLabel('Corners', {exact: true})).toBeVisible();
    await expect(page.getByRole('textbox', {name: 'Frame website address'})).toHaveCount(0);
});

test('iPhone finish and Dynamic Island options change the frame', async ({page}) => {
    await openEditorWithUpload(page);
    await frameButton(page, 'iPhone').click();
    const phone = page.locator('#canvas .minimal-phone');
    const bodyColor = () => phone.evaluate(el => getComputedStyle(el).backgroundColor);
    const black = await bodyColor();

    await page.getByRole('button', {name: 'Silver', exact: true}).click();
    await expect.poll(bodyColor).not.toBe(black);
    await expect(page.getByRole('region', {name: 'Frame'})).toContainText('Silver');

    const islandCount = () => phone.locator(':scope > div').count();
    const withIsland = await islandCount();
    await page.getByRole('switch', {name: 'Dynamic Island'}).click();
    await expect.poll(islandCount).toBe(withIsland - 1);
});

test('browser frame address bar is editable on the canvas and in the inspector', async ({page}) => {
    await openEditorWithUpload(page);
    const onCanvas = page.getByRole('textbox', {name: 'Frame website address'});
    await page.getByLabel('Address', {exact: true}).fill('screenshot.rocks');
    await expect(onCanvas).toHaveValue('screenshot.rocks');
    await page.getByRole('switch', {name: 'Address bar'}).click();
    await expect(page.locator('#canvas .mock-browser-address')).toHaveCSS('visibility', 'hidden');
});

test('applying a look is undoable and redoable with buttons and shortcuts', async ({page}) => {
    await openEditorWithUpload(page);
    const undo = toolbarButton(page, 'Undo');
    const redo = toolbarButton(page, 'Redo');
    const before = await canvasBackground(page);

    await page.getByRole('button', {name: 'Apply Midnight look'}).click();
    await expect.poll(() => canvasBackground(page)).not.toBe(before);
    const midnight = await canvasBackground(page);
    await expect(undo).toBeEnabled();

    await undo.click();
    await expect.poll(() => canvasBackground(page)).toBe(before);
    await redo.click();
    await expect.poll(() => canvasBackground(page)).toBe(midnight);

    await page.keyboard.press('ControlOrMeta+z');
    await expect.poll(() => canvasBackground(page)).toBe(before);
    await page.keyboard.press('ControlOrMeta+Shift+z');
    await expect.poll(() => canvasBackground(page)).toBe(midnight);
});

test('Ctrl+Shift+Z redoes on Windows and Linux', async ({page}) => {
    // Ctrl+Shift+Z reports key "Z"; the shortcut handler must not be case-sensitive.
    await page.addInitScript(() => Object.defineProperty(Navigator.prototype, 'platform', {get: () => 'Win32'}));
    await openEditorWithUpload(page);
    await page.getByRole('button', {name: 'Apply Midnight look'}).click();
    const midnight = await canvasBackground(page);
    await page.keyboard.press('Control+z');
    await expect.poll(() => canvasBackground(page)).not.toBe(midnight);
    await page.keyboard.press('Control+Shift+Z');
    await expect.poll(() => canvasBackground(page)).toBe(midnight);
});

test('slider changes are undoable', async ({page}) => {
    await openEditorWithUpload(page);
    const shadow = page.getByLabel('Shadow value');
    await shadow.fill('40');
    await shadow.press('Enter');
    await expect(page.getByLabel('Shadow', {exact: true})).toHaveValue('40');
    await toolbarButton(page, 'Undo').click();
    await expect(page.getByLabel('Shadow', {exact: true})).toHaveValue('4');
});

test('saving a look adds it next to the built-in looks, and it can be deleted', async ({page}) => {
    await openEditorWithUpload(page);
    await backgroundButton(page, 'Gradient').click();
    await page.getByRole('button', {name: 'Save current look'}).click();
    await page.getByRole('textbox', {name: 'Look name'}).fill('Launch gradient');
    await page.getByRole('button', {name: 'Save', exact: true}).click();

    const saved = page.getByRole('button', {name: 'Apply Launch gradient look'});
    await expect(saved).toHaveAttribute('aria-pressed', 'true');
    await saved.hover();
    await page.getByRole('button', {name: 'Delete Launch gradient look'}).click();
    await expect(saved).toHaveCount(0);
    await expect(page.getByRole('region', {name: 'Looks'})).not.toContainText('No presets');
});

test('background types update the canvas', async ({page}) => {
    await openEditorWithUpload(page);
    const canvas = page.locator('#canvas');
    await backgroundButton(page, 'Gradient').click();
    await expect.poll(() => canvas.evaluate(el => getComputedStyle(el).backgroundImage)).toContain('gradient');
    await backgroundButton(page, 'Image').click();
    await expect.poll(() => canvas.evaluate(el => getComputedStyle(el).backgroundImage)).toContain('url(');
    await backgroundButton(page, 'Color').click();
    await page.getByRole('group', {name: 'Background colors'}).getByRole('button', {name: '#dbe5dc'}).click();
    await expect(canvas).toHaveCSS('background-color', 'rgb(219, 229, 220)');
});

test('color picker opens inside the viewport and edits the background', async ({page}) => {
    await openEditorWithUpload(page);
    await backgroundButton(page, 'Gradient').click();
    await page.getByRole('button', {name: 'Gradient end color'}).click();
    const picker = page.getByRole('dialog', {name: 'Gradient end color'});
    await expect(picker).toBeVisible();
    const box = (await picker.boundingBox())!;
    const viewport = page.viewportSize()!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);

    const hex = picker.getByLabel('Hex');
    await hex.fill('#ff0000');
    await hex.press('Enter');
    await expect.poll(() => page.locator('#canvas').evaluate(el => getComputedStyle(el).backgroundImage)).toContain('rgb(255, 0, 0)');
    await page.keyboard.press('Escape');
    await expect(picker).toHaveCount(0);
});

test('the inspector never scrolls sideways', async ({page}) => {
    await openEditorWithUpload(page);
    for (const frame of ['Browser', 'iPhone', 'Image'] as const) {
        await frameButton(page, frame).click();
        const overflow = await inspector(page).locator('.sections').evaluate(el => el.scrollWidth - el.clientWidth);
        expect(overflow, `${frame} inspector overflow`).toBeLessThanOrEqual(0);
    }
});

test('crop can be cancelled and applied', async ({page}) => {
    await openEditorWithUpload(page);
    const originalSrc = await screenshot(page).getAttribute('src');

    await toolbarButton(page, 'Crop').click();
    await expect(page.getByRole('dialog', {name: 'Crop'})).toBeVisible();
    await page.getByRole('button', {name: 'Cancel'}).click();
    await expect(page.getByRole('dialog', {name: 'Crop'})).toHaveCount(0);

    await toolbarButton(page, 'Crop').click();
    const cropImage = page.getByRole('img', {name: 'cropping canvas'});
    await page.getByRole('button', {name: 'Freeform'}).click();
    const box = (await cropImage.boundingBox())!;
    await page.mouse.move(box.x + 5, box.y + 5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {steps: 8});
    await page.mouse.up();
    await page.getByRole('button', {name: 'Apply Crop'}).click();
    await expect(cropImage).toHaveCount(0);
    await expect(screenshot(page)).not.toHaveAttribute('src', originalSrc!);
});

test('shapes can be drawn, deleted and undone', async ({page}) => {
    await openEditorWithUpload(page);
    const before = await drawRectangle(page);
    const drawn = await paintedAnnotationPixels(page);

    await page.keyboard.press('Delete');
    await expect.poll(() => paintedAnnotationPixels(page)).toBe(before);

    await page.keyboard.press('ControlOrMeta+z');
    await expect.poll(() => paintedAnnotationPixels(page)).toBeGreaterThan(before);

    await page.keyboard.press('ControlOrMeta+z');
    await expect.poll(() => paintedAnnotationPixels(page)).toBe(before);
    expect(drawn).toBeGreaterThan(before);
});

test('text is typed in place and fonts load lazily from Bunny Fonts', async ({page}) => {
    const fontRequests: string[] = [];
    await page.route('https://fonts.bunny.net/**', route => {
        fontRequests.push(route.request().url());
        return route.fulfill({contentType: 'text/css', body: '/* stubbed in tests */'});
    });
    await openEditorWithUpload(page);
    await toolbarButton(page, 'Markup').click();
    await markupTool(page, 'Text').click();
    expect(fontRequests, 'no fonts are fetched before they are needed').toEqual([]);

    const box = (await screenshot(page).boundingBox())!;
    await page.mouse.click(box.x + box.width * .2, box.y + box.height * .3);
    const editor = page.getByRole('textbox', {name: 'Annotation text'});
    await expect(editor).toBeFocused();
    await editor.fill('Launch day');
    const before = await paintedAnnotationPixels(page);
    await editor.press('Enter');
    await expect(editor).toHaveCount(0);
    await expect.poll(() => paintedAnnotationPixels(page)).toBeGreaterThan(before + 500);

    // The new text stays selected, so font changes apply to it.
    await page.getByRole('button', {name: 'Font: System'}).click();
    await expect.poll(() => fontRequests.length).toBe(1);
    expect(fontRequests[0]).toContain('fonts.bunny.net/css?family=');
    await page.getByRole('menuitemradio', {name: 'Playfair Display'}).click();
    await expect(page.getByRole('button', {name: 'Font: Playfair Display'})).toBeVisible();

    const textBox = (await screenshot(page).boundingBox())!;
    await page.mouse.dblclick(textBox.x + textBox.width * .2 + 10, textBox.y + textBox.height * .3 + 8);
    await expect(page.getByRole('textbox', {name: 'Annotation text'})).toHaveValue('Launch day');
    await page.keyboard.press('Escape');
});

test('blur hides the pixels underneath', async ({page}) => {
    await openEditorWithUpload(page);
    await toolbarButton(page, 'Markup').click();
    await markupTool(page, 'Blur').click();
    await dragOnScreenshot(page, [.05, .15], [.45, .45]);

    const box = (await screenshot(page).boundingBox())!;
    const canvasBox = (await page.locator('#canvas').boundingBox())!;
    const stats = await page.locator('#canvas canvas').first().evaluate((canvas: HTMLCanvasElement, r) => {
        const scale = canvas.width / r.canvasWidth;
        const x = Math.round(r.x * scale), y = Math.round(r.y * scale), w = Math.round(r.w * scale), h = Math.round(r.h * scale);
        const data = canvas.getContext('2d')!.getImageData(x, y, w, h).data;
        let opaque = 0, energy = 0, count = 0;
        for (let row = 0; row < h; row++) {
            for (let col = 0; col < w; col++) {
                const i = (row * w + col) * 4;
                if (data[i + 3] === 255) opaque++;
                if (col > 0) { energy += Math.abs(data[i] - data[i - 4]) + Math.abs(data[i + 1] - data[i - 3]) + Math.abs(data[i + 2] - data[i - 2]); count++; }
            }
        }
        return {opaqueRatio: opaque / (w * h), meanEdge: energy / count / 3};
    }, {
        canvasWidth: canvasBox.width,
        x: box.x - canvasBox.x + box.width * .1, y: box.y - canvasBox.y + box.height * .2,
        w: box.width * .3, h: box.height * .2,
    });
    // The old implementation drew an 80%-opaque grey box you could read through.
    expect(stats.opaqueRatio).toBeGreaterThan(.99);
    // Readable text has sharp edges; a real blur leaves only soft gradients.
    expect(stats.meanEdge).toBeLessThan(4);
});

test('PNG export respects the chosen aspect ratio', async ({page}) => {
    test.slow();
    await openEditorWithUpload(page);
    await page.getByRole('group', {name: 'Canvas aspect ratio'}).getByRole('button', {name: '1:1'}).click();
    const {name, file} = await exportAs(page, 'PNG');
    expect(name).toBe('screenshot-rocks.png');
    const {width, height} = pngSize(file);
    expect(width).toBeGreaterThan(0);
    expect(width).toBe(height);
});

const formats = [
    {label: 'PNG' as const, ext: 'png', magic: (b: Buffer) => b.subarray(1, 4).toString() === 'PNG'},
    {label: 'JPEG' as const, ext: 'jpeg', magic: (b: Buffer) => b[0] === 0xff && b[1] === 0xd8},
    {label: 'WebP' as const, ext: 'webp', magic: (b: Buffer) => b.subarray(8, 12).toString() === 'WEBP'},
    {label: 'SVG' as const, ext: 'svg', magic: (b: Buffer) => b.toString('utf8', 0, 200).includes('<svg')},
];
for (const format of formats) {
    test(`exports a valid ${format.label} file`, async ({page}) => {
        test.slow(); // dom-to-image rasterises the full-size canvas several times
        await openEditorWithUpload(page);
        const {name, file} = await exportAs(page, format.label);
        expect(name).toBe(`screenshot-rocks.${format.ext}`);
        expect(file.length).toBeGreaterThan(1000);
        expect(format.magic(file)).toBe(true);
    });
}

test('a transparent background exports as transparent PNG and white JPEG', async ({page}) => {
    test.slow();
    await openEditorWithUpload(page);
    await backgroundButton(page, 'None').click();
    const png = await exportAs(page, 'PNG');
    expect((await pixelAt(page, png.file, 'image/png', 2, 2))[3]).toBe(0);
    const jpeg = await exportAs(page, 'JPEG');
    expect((await pixelAt(page, jpeg.file, 'image/jpeg', 2, 2)).slice(0, 3).every(channel => channel > 245)).toBe(true);
});

test('exporting clears the markup selection so handles are not captured', async ({page}) => {
    test.slow();
    await openEditorWithUpload(page);
    await drawRectangle(page);
    await exportAs(page, 'PNG');
    await expect(page.getByRole('toolbar', {name: 'Markup tools'}).getByRole('button', {name: 'Delete selected markup'})).toBeDisabled();
});

test('nested popovers close one at a time and Escape does not leave markup', async ({page}) => {
    await openEditorWithUpload(page);
    await toolbarButton(page, 'Markup').click();
    await page.getByRole('button', {name: 'Markup color'}).click();
    const parent = page.getByRole('dialog', {name: 'Markup color', exact: true});
    await parent.getByRole('button', {name: 'Custom markup color'}).click();
    const child = page.getByRole('dialog', {name: 'Custom markup color'});

    await child.getByLabel('Hex').click();
    await expect(parent).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(child).toHaveCount(0);
    await expect(parent).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(parent).toHaveCount(0);
    await expect(toolbarButton(page, 'Markup')).toHaveAttribute('aria-pressed', 'true');
});

test('homepage links to every extension store with its browser logo', async ({page}) => {
    await page.goto('/');
    const stores = page.getByRole('list', {name: 'Get the extension'});
    const expected = [
        {name: 'Add to Chrome', host: 'chromewebstore.google.com', logo: 'chrome.svg'},
        {name: 'Add to Firefox', host: 'addons.mozilla.org', logo: 'firefox.svg'},
        {name: 'Add to Edge', host: 'microsoftedge.microsoft.com', logo: 'edge.svg'},
    ];
    for (const {name, host, logo} of expected) {
        const link = stores.getByRole('link', {name: new RegExp(name)});
        await expect(link).toHaveAttribute('href', new RegExp(`^https://${host}/`));
        await expect(link.locator('img')).toHaveAttribute('src', new RegExp(logo));
        expect(await link.locator('img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    }
    // The hero suggests the extension for the visitor's browser (Chromium here).
    await expect(page.locator('main').getByRole('link', {name: /Add to Chrome to capture any tab/})).toBeVisible();
});

test('SVG export contains a flattened image, not the live page with the original screenshot', async ({page}) => {
    test.slow();
    await openEditorWithUpload(page);
    const {file} = await exportAs(page, 'SVG');
    const svg = decodeURIComponent(file.toString('utf8'));
    expect(svg).toContain('<image');
    expect(svg).toContain('data:image/png;base64,');
    expect(svg).not.toContain('foreignObject');
});

test('resizing markup can be undone', async ({page}) => {
    await openEditorWithUpload(page);
    await drawRectangle(page);
    const before = await paintedAnnotationPixels(page);
    const box = (await screenshot(page).boundingBox())!;
    await page.mouse.move(box.x + box.width * .6, box.y + box.height * .7);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * .8, box.y + box.height * .9, {steps: 8});
    await page.mouse.up();
    await expect.poll(() => paintedAnnotationPixels(page)).not.toBe(before);
    await page.keyboard.press('ControlOrMeta+z');
    await expect.poll(() => paintedAnnotationPixels(page)).toBe(before);
});
