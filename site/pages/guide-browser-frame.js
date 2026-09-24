const {figure, steps, cta, keys} = require('../lib');

module.exports = {
    order: 11,
    path: '/guides/add-browser-frame-to-screenshot/',
    type: 'article',
    published: '2026-09-24',
    breadcrumbs: [{name: 'Guides', path: '/guides/'}],
    breadcrumb: 'Browser frame',
    title: 'How to Put a Screenshot in a Browser Window Frame',
    description: 'Wrap a screenshot in a clean browser window with your own address in the address bar. How to capture it, pick a frame style and export, in about a minute.',
    h1: 'How to put a screenshot in a browser window',
    navTitle: 'Put a screenshot in a browser window',
    summary: 'Add a clean browser frame with your own URL, and pick a style that suits the screenshot.',
    lede: 'A browser frame tells people at a glance that they’re looking at a website. This guide covers adding one, choosing a style that suits the page, and what to put in the address bar.',
    image: '/images/home/example-browser.jpg',
    related: ['/screenshot-mockup-generator/', '/guides/put-screenshot-in-iphone-frame/', '/guides/beautiful-screenshots/', '/screenshot-extension/'],
    howTo: {
        name: 'Put a screenshot in a browser window',
        totalTime: 'PT1M',
        steps: [
            {name: 'Capture the page without browser toolbars', text: 'Take a screenshot of the page content only, or use the browser extension.'},
            {name: 'Add it to the editor', text: 'Open screenshot.rocks/app and drop, choose or paste the screenshot.'},
            {name: 'Choose a frame style', text: 'In the Frame section pick Browser, then a style such as Light or Dark.'},
            {name: 'Set the address', text: 'Type the address you want in the Address field, or turn the address bar off.'},
            {name: 'Export', text: 'Choose a background and export as PNG, JPEG, WebP or SVG.'},
        ],
    },
    body: `
<div class="pair">
  ${figure('/images/guides/raw-screenshot.jpg', 'A plain website screenshot with no frame', 'Before: a plain screenshot.', {width: 1400, height: 778, eager: true})}
  ${figure('/images/home/example-browser.jpg', 'The same screenshot in a light browser window on a lilac gradient', 'After: in a browser window, on a background.', {width: 1400, height: 875, eager: true})}
</div>

<h2>Step by step</h2>
${steps([
    `<strong>Capture just the page.</strong> Leave out your own browser’s tabs and toolbars, because the frame adds its own. On a Mac press ${keys('⌘', '⇧', '4')} and drag over the page; on Windows press ${keys('Win', 'Shift', 'S')}. The <a href="/screenshot-extension/">extension</a> does this for you in one click.`,
    `<strong>Add it to the editor.</strong> Open <a href="/app">the editor</a> and drop, choose or paste the screenshot. Wide screenshots go into a browser window automatically.`,
    `<strong>Pick a style.</strong> Under <strong>Frame</strong>, choose Light, Dark, Black, Soft, Square or Plum, or <strong>Custom</strong> to set every color yourself.`,
    `<strong>Set the address.</strong> Type into the <strong>Address</strong> field, or click the address bar on the frame and type there.`,
    `<strong>Choose the buttons.</strong> Toggle <strong>Window buttons</strong>, <strong>Back &amp; forward</strong> and <strong>Menu button</strong> to match how much detail you want.`,
    `<strong>Finish and export.</strong> Pick a background, set the canvas size, and export.`,
])}

${cta()}

<h2>Choosing a frame style</h2>
<ul>
  <li><strong>Match the page’s brightness.</strong> A light site looks best in the Light or Soft frame; a dark interface in Dark or Black. A light frame around a dark app draws a hard edge that pulls attention away from the content.</li>
  <li><strong>Square corners suit dense, technical screenshots</strong>; rounded corners suit marketing images.</li>
  <li><strong>Keep the same style across a set.</strong> If a blog post or deck has several screenshots, give them all the same frame, background and size. Save it once with <strong>Looks → +</strong> and apply it to the rest.</li>
</ul>

<h2>What to put in the address bar</h2>
<ul>
  <li><strong>The real domain</strong> for anything public, so people can find it.</li>
  <li><strong>A short, clean path.</strong> <code>acme.com/pricing</code> reads better than a URL full of tracking parameters.</li>
  <li><strong>Nothing, for unreleased products.</strong> Turn the address bar off rather than showing a staging or localhost address.</li>
</ul>

<h2>If your screenshot already has a browser toolbar</h2>
<p>Crop it off first, or you’ll have a browser inside a browser. Click <strong>Crop</strong> in the editor, choose <strong>Freeform</strong>, and drag the top edge down past the toolbar.</p>
`,
    faq: [
        {q: 'Can I type my own URL in the browser frame?', a: '<p>Yes. Type it in the Address field under Frame, or click the address bar on the frame itself.</p>'},
        {q: 'Can I remove the address bar?', a: '<p>Yes. Turn off <strong>Address bar</strong> under Frame. You can also turn off the window buttons, navigation arrows and menu button.</p>'},
        {q: 'Is there a dark browser frame?', a: '<p>Yes: Dark and Black. Custom lets you pick any colors, including the window buttons.</p>'},
        {q: 'Is it free?', a: '<p>Yes, with no account or watermark.</p>'},
    ],
};
