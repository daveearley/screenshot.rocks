const {steps, cta, table, keys, note} = require('../lib');

module.exports = {
    order: 10,
    path: '/guides/full-page-screenshot/',
    type: 'article',
    published: '2026-09-24',
    breadcrumbs: [{name: 'Guides', path: '/guides/'}],
    breadcrumb: 'Full-page screenshots',
    title: 'How to Take a Full-Page Screenshot in Any Browser',
    description: 'Capture a whole web page, not just what fits on screen, with tools built into your browser. Steps for Chrome, Firefox, Edge, Safari, iPhone and Android.',
    h1: 'How to take a full-page screenshot in any browser',
    navTitle: 'Full-page screenshots in any browser',
    summary: 'Built-in ways to capture a whole web page in Chrome, Firefox, Edge, Safari, iPhone and Android.',
    lede: 'Every major browser can capture a whole scrolling web page without installing anything. This guide shows where the option is in each one and how to fix the usual problems.',
    related: ['/mobile-website-screenshot/', '/website-screenshot/', '/guides/redact-screenshots/', '/guides/beautiful-screenshots/'],
    howTo: {
        name: 'Take a full-page screenshot in Chrome',
        totalTime: 'PT1M',
        steps: [
            {name: 'Open DevTools', text: 'Press F12, or Cmd+Option+I on a Mac.'},
            {name: 'Open the Command Menu', text: 'Press Cmd+Shift+P on a Mac or Ctrl+Shift+P on Windows.'},
            {name: 'Run the screenshot command', text: 'Type “screenshot” and choose Capture full size screenshot. Chrome saves a PNG to your Downloads folder.'},
        ],
    },
    body: `
<h2>Quick reference</h2>
${table(['Browser', 'Where to find it', 'Shortcut'], [
    ['Chrome', 'DevTools → Command Menu → <strong>Capture full size screenshot</strong>', `${keys('F12')}, then ${keys('Ctrl', 'Shift', 'P')} (${keys('⌘', '⇧', 'P')} on Mac)`],
    ['Firefox', 'Right-click → <strong>Take Screenshot</strong> → <strong>Save full page</strong>', `${keys('Ctrl', 'Shift', 'S')} (${keys('⌘', '⇧', 'S')} on Mac)`],
    ['Edge', '⋯ menu → <strong>Screenshot</strong> → <strong>Capture full page</strong>', `${keys('Ctrl', 'Shift', 'S')} (${keys('⌘', '⇧', 'S')} on Mac)`],
    ['Safari', 'Web Inspector → right-click <code>&lt;html&gt;</code> → <strong>Capture Screenshot</strong>', 'Developer features must be on'],
    ['iPhone', 'Take a screenshot → tap the preview → <strong>Full Page</strong>', 'Saves as a PDF'],
    ['Android', 'Take a screenshot → <strong>Capture more</strong> or <strong>Scroll capture</strong>', 'Name varies by phone'],
])}

<h2 id="chrome">Chrome</h2>
<p>Chrome hides its full-page capture inside the developer tools, but it takes a few seconds once you know where it is.</p>
${steps([
    `Open the page and press ${keys('F12')} (or ${keys('⌘', '⌥', 'I')} on a Mac) to open DevTools.`,
    `Press ${keys('Ctrl', 'Shift', 'P')} (${keys('⌘', '⇧', 'P')} on a Mac) to open the Command Menu.`,
    `Type <code>screenshot</code> and choose <strong>Capture full size screenshot</strong>.`,
])}
<p>Chrome saves a PNG to your Downloads folder. The same menu has <strong>Capture screenshot</strong> for just the visible area, <strong>Capture area screenshot</strong> to drag out a region, and <strong>Capture node screenshot</strong>, which captures the element selected in the Elements panel. That last one is handy for a single card or form without cropping afterwards.</p>

<h2 id="firefox">Firefox</h2>
${steps([
    `Right-click an empty part of the page and choose <strong>Take Screenshot</strong>, or press ${keys('Ctrl', 'Shift', 'S')} (${keys('⌘', '⇧', 'S')} on a Mac).`,
    `Click <strong>Save full page</strong> at the top right.`,
    `Choose <strong>Download</strong> or <strong>Copy</strong>.`,
])}
<p>Firefox can also capture a single element: hover over the page after starting a screenshot and click a highlighted block.</p>

<h2 id="edge">Microsoft Edge</h2>
${steps([
    `Press ${keys('Ctrl', 'Shift', 'S')} (${keys('⌘', '⇧', 'S')} on a Mac), or open the <strong>⋯</strong> menu and choose <strong>Screenshot</strong>.`,
    `Choose <strong>Capture full page</strong>.`,
    `Save or copy the result. You can draw on it first if you need to.`,
])}
<p>Edge is built on Chromium, so the Chrome DevTools method above works in Edge too.</p>

<h2 id="safari">Safari</h2>
<p>Safari has no single button for this, but its Web Inspector can capture the whole page as an image.</p>
${steps([
    `Choose <strong>Safari → Settings → Advanced</strong> and tick <strong>Show features for web developers</strong>. (Older versions of Safari call it <em>Show Develop menu in menu bar</em>.)`,
    `Open the page and press ${keys('⌘', '⌥', 'I')} to open the Web Inspector.`,
    `In the <strong>Elements</strong> tab, right-click the <code>&lt;html&gt;</code> line at the top and choose <strong>Capture Screenshot</strong>.`,
])}
<p>You can right-click any other element in the same way to capture just that part of the page.</p>

<h2 id="iphone">iPhone and iPad</h2>
${steps([
    `Open the page in Safari and take a screenshot: press the side button and volume up together. On an iPhone with a Home button, press the side button and Home; on an iPad, the top button and a volume button.`,
    `Tap the preview that appears in the corner.`,
    `Choose <strong>Full Page</strong> at the top, then <strong>Done</strong> and <strong>Save PDF to Files</strong>.`,
])}
${note('The iPhone saves full-page captures as a PDF, not an image. To get an image, capture the page from a desktop browser in device mode instead; the <a href="/mobile-website-screenshot/">mobile screenshot guide</a> shows how.')}

<h2 id="android">Android</h2>
<p>Most recent Android phones can capture a scrolling screenshot. Take a normal screenshot (usually power and volume down), then tap <strong>Capture more</strong> in the preview. Samsung calls it <strong>Scroll capture</strong>. Drag the handles to choose how far down the page to go.</p>

<h2>When the screenshot looks wrong</h2>
<h3>Images are missing or blank</h3>
<p>Many sites only load images as you scroll to them. Scroll slowly to the bottom of the page and back to the top, then take the screenshot.</p>
<h3>A cookie banner or sticky header is in the way</h3>
<p>Dismiss banners first. For elements that won’t go away, open the Elements panel in DevTools, select the element and press ${keys('Delete')}. It disappears until you reload, so you can capture a clean page.</p>
<h3>The text is blurry</h3>
<p>The screenshot is only as sharp as your screen. On a standard display, turn on device mode in Chrome DevTools (${keys('Ctrl', 'Shift', 'M')}), choose <strong>⋮ → Add device pixel ratio</strong>, and set <strong>DPR</strong> to 2 before capturing.</p>
<h3>The page is cut off or the capture fails</h3>
<p>Browsers have a limit on how tall a single image can be, and very long pages can hit it. Capture the page in sections, or capture the part you actually need.</p>

<h2>Showing a full-page screenshot</h2>
<p>A full-length page is often ten times taller than it is wide. Shrunk to fit a slide or a post, the text becomes unreadable. It usually works better to crop to the section that matters, then <a href="/guides/add-browser-frame-to-screenshot/">put it in a browser frame</a>. If you want to show the whole length, use the <strong>Image</strong> frame on a tall 9:16 canvas.</p>
<p>If you only need the part of a tab that’s on screen, the <a href="/screenshot-extension/">browser extension</a> captures it and opens it in the editor in one click.</p>

${cta('Frame your screenshot', 'Drop your full-page screenshot into the editor, crop it, and add a frame and background.')}
`,
    faq: [
        {q: 'Can I take a full-page screenshot without an extension?', a: '<p>Yes. Chrome, Firefox, Edge and Safari all have it built in. Firefox and Edge have it in the right-click menu; Chrome and Safari have it in their developer tools.</p>'},
        {q: 'Where does Chrome save full-page screenshots?', a: '<p>In your Downloads folder, as a PNG named after the page.</p>'},
        {q: 'Why is my iPhone full-page screenshot a PDF?', a: '<p>Apple only offers the Full Page option as a PDF. Use a desktop browser’s device mode if you need an image.</p>'},
        {q: 'How do I screenshot just one part of a page?', a: '<p>In Chrome, select the element in the Elements panel and run <strong>Capture node screenshot</strong> from the Command Menu. Firefox and Safari can capture single elements too.</p>'},
    ],
};
