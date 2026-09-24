const {steps, cta, keys} = require('../lib');

const STORES = [
    {name: 'Chrome', store: 'Chrome Web Store', logo: '/images/browsers/chrome.svg', href: 'https://chromewebstore.google.com/detail/screenshotrocks-one-click/oolmphedpohnagciifbnfpemadolahki'},
    {name: 'Firefox', store: 'Firefox Add-ons', logo: '/images/browsers/firefox.svg', href: 'https://addons.mozilla.org/en-US/firefox/addon/one-click-design-mockups'},
    {name: 'Edge', store: 'Edge Add-ons', logo: '/images/browsers/edge.svg', href: 'https://microsoftedge.microsoft.com/addons/detail/clennbaklmghlnlamipjmfikdnlhiaem'},
];

module.exports = {
    order: 4,
    path: '/screenshot-extension/',
    type: 'tool',
    appName: 'Screenshot.Rocks browser extension',
    published: '2026-09-24',
    title: 'Screenshot Extension for Chrome, Firefox & Edge (Free)',
    description: 'Capture the tab you’re on and open it in a browser-frame mockup with one click. Works on pages behind a login. Free for Chrome, Firefox and Edge.',
    h1: 'Screenshot extension for Chrome, Firefox and Edge',
    navTitle: 'Browser extension',
    summary: 'One click captures the current tab and opens it in the editor.',
    image: '/images/home/example-browser.jpg',
    related: ['/website-screenshot/', '/guides/add-browser-frame-to-screenshot/', '/guides/full-page-screenshot/', '/guides/redact-screenshots/'],
    body: `
<p class="lede">Click the toolbar button on any page and the visible part of the tab opens in the editor, already in a browser frame. Because it runs in your own browser, it works on dashboards and other pages behind a login.</p>

<ul class="stores" aria-label="Get the extension">
  ${STORES.map(s => `<li><a href="${s.href}"><img src="${s.logo}" alt="" width="40" height="40"><div><strong>Add to ${s.name}</strong><span>${s.store}</span></div></a></li>`).join('')}
</ul>

<h2>How it works</h2>
${steps([
    `Install the extension for your browser from one of the stores above.`,
    `Pin it so the button is always visible. In Chrome and Edge, click the puzzle-piece Extensions icon and then the pin next to Screenshot.Rocks. In Firefox, open the Extensions menu and choose <strong>Pin to Toolbar</strong>.`,
    `Open the page you want and click the Screenshot.Rocks button.`,
    `The editor opens in a new tab with your screenshot in a browser frame. Pick a style and background, then export.`,
])}

<h2>What it captures</h2>
<p>The extension captures the visible part of the current tab, at your screen’s full resolution. On a Retina or high-DPI display that means a 2× image with crisp text.</p>
<p>It can’t capture the browser’s own pages, such as settings, the new tab page or the extension stores. The button shows a <strong>!</strong> if you try. For the full length of a page, use your browser’s <a href="/guides/full-page-screenshot/">full-page screenshot</a> and drop the file into the editor.</p>

<h2>Permissions and privacy</h2>
<p>The Chrome and Edge extensions only ask for the <code>activeTab</code> permission. It can see a tab only when you click its button, and only that tab. It doesn’t read your browsing history or run on pages in the background.</p>
<p>When you click the button, the screenshot is sent to screenshot.rocks so it can open in the editor tab. It is not stored. The <a href="https://github.com/daveearley/screenshot.rocks/tree/master/browser-extension">extension’s source code</a> is public.</p>

${cta('Open the editor', 'No extension? Drop or paste a screenshot straight into the editor.')}

<h2>Using Safari?</h2>
<p>There isn’t a Safari version. Press ${keys('⌘', '⇧', '4')}, then ${keys('Space')}, and click the Safari window to capture it. Then drop the file into the editor and crop off the browser toolbar, or use the <a href="/website-screenshot/">website capture</a> for public pages.</p>
`,
    faq: [
        {q: 'Is the extension free?', a: '<p>Yes, and so is the editor. There is no account or watermark.</p>'},
        {q: 'Does it take full-page screenshots?', a: '<p>No, it captures what’s visible in the tab. Every major browser has a built-in full-page capture; see the <a href="/guides/full-page-screenshot/">full-page screenshot guide</a>.</p>'},
        {q: 'Why does the button show a “!”?', a: '<p>The page can’t be captured. Browsers don’t let extensions capture their own pages, like settings or the extension store. Try it on a normal website.</p>'},
        {q: 'Does it work in Brave, Vivaldi or Opera?', a: '<p>Brave and Vivaldi can install extensions from the Chrome Web Store directly, so the Chrome version works. Opera needs its <strong>Install Chrome Extensions</strong> add-on first.</p>'},
    ],
};
