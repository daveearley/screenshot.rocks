const {table, cta, note} = require('../lib');

module.exports = {
    order: 14,
    path: '/guides/screenshot-sizes/',
    type: 'article',
    published: '2026-09-24',
    breadcrumbs: [{name: 'Guides', path: '/guides/'}],
    breadcrumb: 'Screenshot sizes',
    title: 'Screenshot Sizes for X, LinkedIn, Instagram & More',
    description: 'Image sizes that display without cropping on X, LinkedIn, Instagram, Product Hunt, Dribbble and link previews, and how to export screenshots at those sizes.',
    h1: 'The right screenshot size for every platform',
    navTitle: 'Screenshot sizes for every platform',
    summary: 'Pixel sizes for X, LinkedIn, Instagram, Product Hunt, Dribbble, link previews and slides.',
    lede: 'Upload a screenshot at the size a platform displays and it won’t be cropped, letterboxed or scaled twice. These are the sizes to use, checked in September 2026.',
    image: '/images/home/example-browser.jpg',
    related: ['/guides/beautiful-screenshots/', '/screenshot-mockup-generator/', '/guides/put-screenshot-in-iphone-frame/', '/mobile-website-screenshot/'],
    body: `
${table(['Where', 'Size (px)', 'Shape', 'Notes'], [
    ['X (Twitter) post', '1600 × 900', '16:9', 'Shows uncropped in the timeline. 1200 × 675 works too. Photos can be up to 5 MB.'],
    ['LinkedIn post, landscape', '1200 × 627', '1.91:1', 'The same shape LinkedIn uses for link previews.'],
    ['LinkedIn or Instagram post, portrait', '1080 × 1350', '4:5', 'Fills more of a phone feed than a square post.'],
    ['LinkedIn or Instagram post, square', '1080 × 1080', '1:1', 'Safe everywhere, but smaller in the feed than 4:5.'],
    ['Stories and Reels', '1080 × 1920', '9:16', 'Keep text away from the top and bottom, where the app draws its own controls.'],
    ['Link previews (Open Graph)', '1200 × 630', '1.91:1', 'Used when a link is shared in Slack, iMessage, LinkedIn, Facebook and most chat apps.'],
    ['Product Hunt gallery', '1270 × 760', 'about 5:3', 'The first image is also the preview card when the launch is shared. Keep each under 3 MB.'],
    ['Dribbble shot', '1600 × 1200', '4:3', 'Dribbble’s standard shot shape.'],
    ['Slides (Keynote, Google Slides, PowerPoint)', '1920 × 1080', '16:9', 'A full-bleed image on a widescreen slide.'],
    ['Blog posts and documentation', '2 × column width', 'Any', 'For a 720 px content column, export 1440 px wide so it stays sharp on high-resolution screens.'],
])}
${note('Platforms change their layouts every so often. If an image is cropped unexpectedly, check the platform’s own help pages for the latest size.')}

<h2>Why the shape matters more than the size</h2>
<p>Platforms scale images down to fit, so a 3200 × 1800 image and a 1600 × 900 one look the same on X. What they don’t forgive is the wrong shape. A 4:3 image in a 16:9 slot is cropped or gets bars; a very tall image is cut off in the feed. Get the shape right first, then make sure it’s at least as large as the size in the table.</p>

<h2>How to export at these sizes</h2>
<p>In <a href="/app">Screenshot.Rocks</a>, the exported image is exactly the size of the canvas.</p>
<ul>
  <li><strong>One click:</strong> the buttons under <strong>Layout</strong> set 16:9 (1920 × 1080), 4:3 (1600 × 1200), 1:1 (1200 × 1200), 4:5 (1080 × 1350) and 9:16 (1080 × 1920).</li>
  <li><strong>An exact size:</strong> type the width and height into the W and H fields, for example 1270 × 760 for Product Hunt. Each side can be from 500 to 2300 px.</li>
</ul>
<p>Changing the canvas doesn’t stretch the screenshot. Its frame keeps its proportions, and the background fills the rest. Use <strong>Scale</strong> to make it larger or smaller within the canvas. For phone screenshots on a 4:5 or 9:16 canvas, <a href="/guides/put-screenshot-in-iphone-frame/">put them in an iPhone frame</a> so they fill the space.</p>

${cta('Open the editor', 'Pick a size, drop in a screenshot and export at exactly those dimensions.')}

<h2>File format and file size</h2>
<ul>
  <li><strong>PNG</strong> keeps text and interface edges sharp. Use it by default for screenshots.</li>
  <li><strong>JPEG</strong> is usually smaller and is the safe choice when a platform has a low upload limit. Text edges get slightly soft.</li>
  <li><strong>WebP</strong> is smaller than PNG at similar quality and suits your own website and docs.</li>
</ul>

<h2>One image for everywhere</h2>
<p>If you can only make one version, 1600 × 900 (16:9) works well on X, in slides and in most feeds. Make a separate 1200 × 630 version for link previews if the page is going to be shared a lot, because 16:9 images are trimmed at the top and bottom in preview cards.</p>
`,
    faq: [
        {q: 'What is the best size for a screenshot on X (Twitter)?', a: '<p>1600 × 900 pixels (16:9). It shows without cropping in the timeline.</p>'},
        {q: 'What size should a LinkedIn screenshot be?', a: '<p>1200 × 627 for a landscape post, or 1080 × 1350 (4:5) for a portrait post, which takes up more of the feed on phones.</p>'},
        {q: 'What size are Product Hunt gallery images?', a: '<p>1270 × 760 pixels, under 3 MB each. The first image is used as the preview card.</p>'},
        {q: 'What size is an Open Graph (link preview) image?', a: '<p>1200 × 630 pixels.</p>'},
        {q: 'Why is my screenshot cropped when I post it?', a: '<p>Its shape doesn’t match the platform’s. Resize the canvas to the platform’s aspect ratio before exporting instead of relying on the platform to crop it.</p>'},
    ],
};
