// Regenerates the homepage and guide example images by driving the real editor.
// Usage: yarn build && node e2e/server.js & node scripts/homepage-examples.js
// Requires macOS `sips` to compress the exports.
const {chromium} = require('playwright');
const {execFileSync} = require('child_process');
const path = require('path');

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5055';
const OUT = path.join(__dirname, '../public/images/home');
const IMAGES = path.join(__dirname, '../public/images');

const examples = [
    {
        name: 'browser', width: 1400, image: 'demo-image.png', look: 'Iris',
        setup: async page => {
            await page.getByLabel('Address', {exact: true}).fill('dribbble.com');
        },
    },
    {
        name: 'iphone', width: 900, demo: 'Mobile', look: 'Phone',
        setup: async () => {},
    },
    {
        name: 'markup', width: 1400, image: 'demo-image.png', look: 'Launch',
        setup: async page => {
            // Applying a look re-renders the inspector; retry if a field is replaced while being filled.
            const setField = async (label, value) => {
                const field = page.getByLabel(label, {exact: true});
                for (let attempt = 1; ; attempt++) {
                    await field.fill(String(value));
                    await field.press('Enter');
                    if (await field.inputValue() === String(value)) return;
                    if (attempt === 3) throw new Error(`Could not set ${label} to ${value}`);
                    await page.waitForTimeout(300);
                }
            };
            await setField('Canvas height', 1000);
            await setField('Scale value', 92);
            await setField('Offset X value', 22);
            await setField('Offset Y value', 24);
            await setField('Tilt value', 0);

            const drag = async (from, to) => {
                await page.mouse.move(...from);
                await page.mouse.down();
                await page.mouse.move(...to, {steps: 8});
                await page.mouse.up();
            };
            const tool = name => page.getByRole('button', {name, exact: true}).click();
            const color = async hex => {
                await page.getByRole('button', {name: 'Markup color'}).click();
                await page.getByRole('button', {name: 'Custom markup color'}).click();
                const field = page.getByRole('dialog', {name: 'Custom markup color'}).getByLabel('Hex');
                await field.fill(hex);
                await field.press('Enter');
                await page.keyboard.press('Escape');
                await page.keyboard.press('Escape');
            };
            const text = async ({at, value, font, size, bold, hex}) => {
                await tool('Text');
                await color(hex);
                await tool('Text');
                await page.getByRole('button', {name: /^Font:/}).click();
                await page.getByRole('menuitemradio', {name: font}).click();
                await setField('Font size', size);
                const boldButton = page.getByRole('button', {name: 'Bold', exact: true});
                if ((await boldButton.getAttribute('aria-pressed')) !== String(bold)) await boldButton.click();
                await page.mouse.click(...point(...at));
                const editor = page.getByRole('textbox', {name: 'Annotation text'});
                await editor.waitFor();
                await editor.fill(value); // typing elsewhere would trigger tool shortcuts
                await editor.press('Enter');
                await page.keyboard.press('Escape'); // deselect so the next colour change doesn't restyle it
            };

            await page.getByRole('button', {name: 'Markup', exact: true}).click();
            // Measure after opening Markup: the markup bar moves the canvas down.
            const canvas = await page.locator('#canvas').boundingBox();
            const ratio = canvas.width / 1600;
            const point = (x, y) => [canvas.x + x * ratio, canvas.y + y * ratio];
            await text({at: [110, 96], value: 'Find your next hire.', font: 'Playfair Display', size: 72, bold: true, hex: '#1d2433'});
            await text({at: [114, 196], value: 'Browse portfolios from the world’s best designers.', font: 'Inter', size: 28, bold: false, hex: '#56607a'});

            await color('#5e5ce6');
            await tool('Rectangle');
            await drag(point(821, 529), point(1144, 810));
            await page.keyboard.press('Escape');
            await tool('Numbered step');
            await page.mouse.click(...point(1144, 529));
            await page.keyboard.press('Escape');
            await page.keyboard.press('Escape');
            await page.waitForTimeout(1500); // let the web fonts land before exporting
        },
    },
    {
        name: 'redact', dir: 'guides', width: 1400, image: 'demo-image.png', look: 'Paper',
        setup: async page => {
            await page.getByRole('button', {name: 'Markup', exact: true}).click();
            // Measure after opening Markup: the markup bar moves the canvas down.
            const box = await page.locator('#canvas').getByRole('img', {name: 'Screenshot'}).boundingBox();
            const at = (x, y) => [box.x + box.width * x, box.y + box.height * y];
            const blur = async (from, to) => {
                await page.getByRole('button', {name: 'Blur', exact: true}).click();
                await page.mouse.move(...at(...from));
                await page.mouse.down();
                await page.mouse.move(...at(...to), {steps: 8});
                await page.mouse.up();
                await page.keyboard.press('Escape');
            };
            await blur([.69, .005], [.93, .085]);  // search box and account avatar
            await blur([.738, .215], [.955, .56]); // one card and its author
            await page.keyboard.press('Escape');
        },
    },
];

(async () => {
    const browser = await chromium.launch();
    for (const example of examples) {
        const page = await browser.newPage({viewport: {width: 1440, height: 900}, deviceScaleFactor: 1});
        await page.route('https://cdn.usefathom.com/**', route => route.abort());
        await page.goto(`${BASE}/app`);
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        if (example.demo) await page.getByRole('button', {name: example.demo, exact: true}).click();
        else await page.locator('#main input[type=file][accept*=".png"]').setInputFiles(path.join(IMAGES, example.image));
        await page.locator('#canvas').waitFor();
        await page.getByRole('button', {name: `Apply ${example.look} look`}).click();
        await page.waitForTimeout(300); // let the look settle before editing fields
        await example.setup(page);
        await page.waitForTimeout(500);

        const download = page.waitForEvent('download');
        await page.getByRole('button', {name: 'Export PNG'}).click();
        const file = path.join(example.dir ? path.join(OUT, '..', example.dir) : OUT, `example-${example.name}.png`);
        await (await download).saveAs(file);
        const jpeg = file.replace(/\.png$/, '.jpg');
        execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', '--resampleWidth', String(example.width), file, '--out', jpeg], {stdio: 'ignore'});
        execFileSync('rm', [file]);
        const size = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', jpeg]).toString().match(/\d+/g).slice(-2).join('×');
        console.log(`wrote ${path.relative(process.cwd(), jpeg)} (${size})`);
        await page.close();
    }
    await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
