const {figure, cta, keys} = require('../lib');

module.exports = {
    order: 13,
    path: '/guides/beautiful-screenshots/',
    type: 'article',
    published: '2026-09-24',
    breadcrumbs: [{name: 'Guides', path: '/guides/'}],
    breadcrumb: 'Beautiful screenshots',
    title: 'How to Make Beautiful Screenshots: 12 Practical Tips',
    description: 'Specific ways to make screenshots look polished: capture at high resolution, crop with purpose, use tidy data, pick calm backgrounds and annotate sparingly.',
    h1: 'How to make beautiful screenshots: 12 practical tips',
    navTitle: 'Make beautiful screenshots',
    summary: 'Twelve specific fixes for blurry, cluttered or messy screenshots.',
    lede: 'Most screenshots look rough for the same few reasons: they’re low resolution, show too much, contain messy data, or sit on a loud background. Each of those has a simple fix.',
    image: '/images/home/example-markup.jpg',
    related: ['/guides/screenshot-sizes/', '/guides/redact-screenshots/', '/screenshot-mockup-generator/', '/guides/add-browser-frame-to-screenshot/'],
    body: `
${figure('/images/home/example-markup.jpg', 'A screenshot offset on a soft blue background with a serif headline and one highlighted card', 'One headline, one highlight, a calm background and plenty of space.', {width: 1400, height: 875, eager: true})}

<h2>Before you capture</h2>

<h3>1. Capture at 2× or higher</h3>
<p>Blurry text is the most common flaw, and nothing afterwards can fix it. On a Mac with a Retina display, screenshots are already 2×. On a standard display, use Chrome DevTools device mode (${keys('Ctrl', 'Shift', 'M')}), choose <strong>⋮ → Add device pixel ratio</strong>, set <strong>DPR</strong> to 2, and capture from the same ⋮ menu.</p>

<h3>2. Size the window on purpose</h3>
<p>A full-screen window on a large monitor produces a wide screenshot with a lot of empty margin. Around 1280 to 1440 pixels wide shows a desktop layout without the dead space. Device mode lets you set an exact width.</p>

<h3>3. Use tidy, realistic data</h3>
<p>“Test test”, lorem ipsum, a dashboard full of zeros and real customer names all look wrong for different reasons. Fill the screen with believable names, round numbers and a sensible amount of content. Setting up a demo account with sample data once saves cleaning up every screenshot after.</p>

<h3>4. Clear the clutter</h3>
<p>Close notifications, dismiss cookie banners and chat widgets, hide the bookmarks bar, and turn off debug toolbars. In a browser you can make any text editable by running <code>document.designMode = 'on'</code> in the console, which is quick for fixing a typo or swapping a name before you capture.</p>

<h3>5. Show one thing</h3>
<p>One open menu, one hover state, one notification. If you need to show three things, that’s three screenshots.</p>

<h2>Framing</h2>

<h3>6. Crop to the point</h3>
<p>Shrinking a whole desktop screen to fit a social post makes everything unreadable. Crop to the part people should look at, even if it’s a single panel. People can read a cropped screenshot; they can only squint at a full one.</p>

<h3>7. Frame it to give context</h3>
<p>A <a href="/guides/add-browser-frame-to-screenshot/">browser window</a> says “website”. A <a href="/guides/put-screenshot-in-iphone-frame/">phone</a> says “app”. For a single component, such as a button, a card or a chart, skip the device and just round the corners.</p>

<h3>8. Leave space around it</h3>
<p>A screenshot pressed against the edges of the image looks cramped. Leave roughly 10 to 15 percent of the width as space on each side. Alternatively, let it deliberately run off one edge, as in the image above.</p>

<h2>Style</h2>

<h3>9. Pick a calm background</h3>
<p>The background should make the screenshot stand out, not compete with it. Soft solid colors and gentle two-tone gradients work; busy photos and saturated rainbow gradients don’t. Contrast helps: put dark interfaces on light backgrounds and light interfaces on muted or dark ones.</p>

<h3>10. Keep shadows and corners subtle</h3>
<p>A soft, low shadow lifts the screenshot off the background. A heavy shadow looks dated. Match the corner radius to the product’s own style: sharp for dense tools, rounder for consumer apps.</p>

<h2>Annotation</h2>

<h3>11. Annotate sparingly</h3>
<p>One highlight, or two or three numbered steps, is usually enough. Use a single color that isn’t already in the interface, and save red for errors. A short headline in a good typeface often explains more than any arrow.</p>

<h3>12. Be consistent across a set</h3>
<p>Screenshots in the same post, deck or app listing should share a size, frame, background and position. In Screenshot.Rocks, set it up once and save it with <strong>Looks → +</strong>, then apply it to each screenshot.</p>

${cta()}

<h2>Choosing a file format</h2>
<p>Export PNG when the screenshot is mostly text and interface, because PNG keeps edges sharp. Use JPEG when a platform has a small upload limit or the image is mostly photos. For your own website, WebP is usually smaller than PNG at similar quality. Whatever the format, export at the size the platform displays; see <a href="/guides/screenshot-sizes/">screenshot sizes</a>.</p>
`,
    faq: [
        {q: 'What resolution should a screenshot be?', a: '<p>Capture at 2× pixel density or higher, then export at the size where it will be shown, for example 1600 × 900 for X or 1200 × 630 for a link preview.</p>'},
        {q: 'What’s the best background for a screenshot?', a: '<p>A soft solid color or a gentle gradient that contrasts with the screenshot: light and muted behind dark interfaces, darker behind light ones. Avoid busy photos.</p>'},
        {q: 'Why do my screenshots look blurry after I post them?', a: '<p>Either the original was captured at 1×, or the platform resized it. Capture at 2× and upload at the platform’s recommended size so it isn’t scaled again.</p>'},
        {q: 'How do I remove private details from a screenshot?', a: '<p>Crop them out, cover them with a solid box, or blur them heavily. The <a href="/guides/redact-screenshots/">redaction guide</a> explains which method to use when.</p>'},
    ],
};
