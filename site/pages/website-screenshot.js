const {figure, steps, cta, table, note} = require('../lib');

module.exports = {
    order: 3,
    path: '/website-screenshot/',
    type: 'tool',
    published: '2026-09-24',
    title: 'Website Screenshot Generator: Capture Any URL Online (Free)',
    description: 'Enter a web address and get a high-resolution screenshot of the page in a browser frame, ready to export. Desktop or mobile layout. Free, no sign-up.',
    h1: 'Website screenshot generator',
    navTitle: 'Website screenshot',
    summary: 'Type a URL and get a sharp screenshot in a browser frame.',
    image: '/images/home/example-browser.jpg',
    related: ['/guides/full-page-screenshot/', '/mobile-website-screenshot/', '/screenshot-extension/', '/guides/add-browser-frame-to-screenshot/'],
    body: `
<div class="hero">
  <div>
    <p class="lede">Type a URL and get a sharp screenshot of the first screen of the page, already in a browser window with the address filled in. Choose a background and export it. For the whole scrolling page, see <a href="/guides/full-page-screenshot/">full-page screenshots</a>.</p>
    <div class="actions">
      <a class="button primary" href="/app">Capture a website</a>
      <span>Free · No account</span>
    </div>
  </div>
  ${figure('/images/home/example-browser.jpg', 'A captured website shown in a light browser window on a lilac gradient', '', {width: 1400, height: 875, eager: true})}
</div>

<h2>How to capture a website</h2>
${steps([
    `Open <a href="/app">the editor</a>.`,
    `Under <strong>Or capture a website</strong>, type the address. You can leave out <code>https://</code>.`,
    `Tick <strong>Mobile</strong> if you want the phone layout. Otherwise you get the desktop layout.`,
    `Press <strong>Capture</strong>. The page opens in a browser frame with its address in the address bar.`,
    `Choose a frame style and background, then export.`,
])}

${cta('Capture a website')}

<h2>What the capture includes</h2>
${table(['Layout', 'Browser window', 'Image size'], [
    ['Desktop', '1440 × 800, at 2× density', '2880 × 1600 px'],
    ['Mobile', '375 × 812 (an iPhone), at 3× density', '1125 × 2436 px'],
])}
<p>The capture is the first screen of the page, the part a visitor sees before scrolling. That is usually what you want for a mockup; a full-length page is very tall and shrinks to unreadable when framed.</p>
${note('The capture runs on a server that loads the page as a first-time visitor, so it can’t see anything behind a login, local addresses like <code>localhost</code>, or sites that block automated browsers.')}

<h2>When to capture the page yourself</h2>
<p>Your own browser can capture things the online tool can’t. Take the screenshot yourself, then drop it into the editor, when you need:</p>
<ul>
  <li><strong>The whole page.</strong> Every major browser can do this without an extension. See <a href="/guides/full-page-screenshot/">how to take a full-page screenshot</a>.</li>
  <li><strong>A logged-in page</strong>, like a dashboard or settings screen. The <a href="/screenshot-extension/">browser extension</a> captures the tab you’re on in one click.</li>
  <li><strong>A particular state</strong>, such as an open menu, a filled-in form or a hover effect.</li>
  <li><strong>A local or staging site</strong> that isn’t public.</li>
</ul>

<h2>Common uses</h2>
<ul>
  <li><strong>Launch posts and changelogs.</strong> A framed screenshot on a soft background reads as a finished image in a feed.</li>
  <li><strong>Portfolios and case studies.</strong> Keep every project in the same frame and background so the set looks consistent.</li>
  <li><strong>Proposals and pitch decks.</strong> Export at 1920 × 1080 for a full-width slide.</li>
  <li><strong>Documentation.</strong> A browser frame makes it obvious the image is a web page, not part of the docs themselves.</li>
</ul>
`,
    faq: [
        {q: 'Does it capture the full page?', a: '<p>No, it captures the first screen. For the full length, use your browser’s built-in capture; the <a href="/guides/full-page-screenshot/">full-page screenshot guide</a> shows where it is in Chrome, Firefox, Edge and Safari.</p>'},
        {q: 'Can I capture localhost or a staging site?', a: '<p>Not with the online capture, because the server can’t reach it. Use the <a href="/screenshot-extension/">browser extension</a> or take a screenshot and drop it into the editor.</p>'},
        {q: 'Why did the capture fail?', a: '<p>Usually the address is mistyped, the site took too long to load, or it blocks automated browsers. Check the address and try again, or capture it yourself.</p>'},
        {q: 'Is the captured page saved anywhere?', a: '<p>No. The screenshot is sent back to your browser and isn’t stored on the server.</p>'},
    ],
};
