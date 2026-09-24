const {figure, steps, cta, table, keys} = require('../lib');

module.exports = {
    order: 1,
    path: '/screenshot-mockup-generator/',
    type: 'tool',
    published: '2026-09-24',
    title: 'Screenshot Mockup Generator: Browser & iPhone Frames (Free)',
    description: 'Put a screenshot in a browser window or iPhone frame, add a background and export a PNG. Free, no sign-up, and your images are processed in your browser.',
    h1: 'Screenshot mockup generator',
    navTitle: 'Screenshot mockup generator',
    summary: 'Put a screenshot in a browser window or iPhone, add a background, export.',
    image: '/images/home/example-browser.jpg',
    related: ['/guides/add-browser-frame-to-screenshot/', '/guides/put-screenshot-in-iphone-frame/', '/guides/beautiful-screenshots/', '/guides/screenshot-sizes/'],
    body: `
<div class="hero">
  <div>
    <p class="lede">Drop in a screenshot and get a finished mockup: a browser window or an iPhone, a background, a soft shadow, and an image at the size you need. The device frame is an iPhone; there are no Android, iPad or laptop frames.</p>
    <div class="actions">
      <a class="button primary" href="/app">Open the editor</a>
      <span>Free · No account · No watermark</span>
    </div>
  </div>
  ${figure('/images/home/example-browser.jpg', 'A website screenshot in a light browser window on a lilac gradient background', '', {width: 1400, height: 875, eager: true})}
</div>

<h2>What you can make</h2>
<ul class="cards">
  <li><h3><a href="/guides/add-browser-frame-to-screenshot/">Browser window</a></h3><p>Six styles (Light, Dark, Black, Soft, Square, Plum) or your own colors. Type any address into the address bar, or hide it.</p></li>
  <li><h3><a href="/guides/put-screenshot-in-iphone-frame/">iPhone</a></h3><p>Five finishes, the Dynamic Island on or off, and a choice of which part of a tall screenshot shows on the screen.</p></li>
  <li><h3>Just the image</h3><p>No device at all: rounded corners, a shadow and an optional hairline outline, for components and cropped details.</p></li>
</ul>

<h2>How it works</h2>
${steps([
    `<strong>Add your screenshot.</strong> Drop it on the editor, choose a file, or paste it with ${keys('⌘', 'V')} (${keys('Ctrl', 'V')} on Windows). You can also <a href="/website-screenshot/">capture a website from its URL</a>.`,
    `<strong>Pick a frame.</strong> Landscape screenshots go into a browser window and portrait ones into an iPhone automatically. Switch any time.`,
    `<strong>Choose a background.</strong> A solid color, a gradient, one of the background images or your own, or nothing at all for a transparent PNG.`,
    `<strong>Set the canvas.</strong> One click for 16:9, 4:3, 1:1, 4:5 or 9:16, or type an exact width and height up to 2300 px. Drag the screenshot to move it, drag a corner to resize it, and tilt it if you like.`,
    `<strong>Export.</strong> Download a PNG, JPEG, WebP or SVG, or copy the image straight to your clipboard.`,
])}

${cta()}

<h2>Export formats</h2>
${table(['Format', 'Best for', 'Transparent background'], [
    ['PNG', 'Docs, slides and anything with small text. Lossless, so text stays sharp.', 'Yes'],
    ['JPEG', 'Small files, for social posts and email.', 'No (white)'],
    ['WebP', 'Websites. Smaller than PNG at similar quality.', 'Yes'],
    ['SVG', 'Places that require an SVG file. It contains the finished image, so it won’t get sharper when scaled up.', 'Yes'],
])}
<p>The exported image is exactly the canvas size you set, so a 1600 × 900 canvas gives you a 1600 × 900 file. See <a href="/guides/screenshot-sizes/">screenshot sizes for each platform</a> for which size to pick.</p>

<h2>Add notes, arrows and blur</h2>
<p>Turn on <strong>Markup</strong> to draw boxes, ellipses and arrows, add numbered steps, write text in one of ten fonts, or <a href="/guides/redact-screenshots/">blur anything private</a>. Markup is part of the exported image.</p>
${figure('/images/home/example-markup.jpg', 'A marketing image with a serif headline and a website screenshot with one card highlighted and numbered', 'A headline, a highlighted card and a numbered step, all made in the editor.', {width: 1400, height: 875})}

<h2>Where your images go</h2>
<p>Screenshots you add are processed in your browser and are not uploaded or stored. Two features do use the server: <a href="/website-screenshot/">capturing a website</a> sends the URL to be rendered, and <a href="/screenshot-extension/">the browser extension</a> passes the captured tab to the editor. Neither keeps a copy. The code is <a href="https://github.com/daveearley/screenshot.rocks">open source</a> if you want to check.</p>
`,
    faq: [
        {q: 'Is the screenshot mockup generator free?', a: '<p>Yes. There is no account, no watermark and no limit on exports.</p>'},
        {q: 'Are my screenshots uploaded to a server?', a: '<p>No. Images you drop, choose or paste are processed in your browser. Only the optional website capture and the browser extension send a web address or a screenshot to our server, and neither is stored.</p>'},
        {q: 'Can I make a mockup with a transparent background?', a: '<p>Yes. Set the background to <strong>None</strong> and export a PNG or WebP. JPEG doesn’t support transparency, so it uses white.</p>'},
        {q: 'What size should my mockup be?', a: '<p>Use the size the image will be shown at: 1600 × 900 for X, 1080 × 1350 for a portrait LinkedIn or Instagram post, 1200 × 630 for link previews. The <a href="/guides/screenshot-sizes/">sizes guide</a> lists more.</p>'},
        {q: 'Can I use it for App Store or Google Play screenshots?', a: '<p>For Google Play, yes: a 1080 × 1920 canvas works for phone screenshots. Apple requires iPhone screenshots larger than the editor’s 2300 px maximum, so it can’t make App Store screenshots.</p>'},
    ],
};
