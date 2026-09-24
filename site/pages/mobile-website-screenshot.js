const {figure, steps, cta, table, keys, note} = require('../lib');

module.exports = {
    order: 2,
    path: '/mobile-website-screenshot/',
    type: 'tool',
    published: '2026-09-24',
    title: 'Mobile Website Screenshot: Capture Any Site’s Mobile View',
    description: 'Capture a website’s phone layout as an image: enter a URL for an instant mobile screenshot, or use your browser’s device mode. Then frame it in an iPhone.',
    h1: 'Take a mobile screenshot of any website',
    navTitle: 'Mobile website screenshot',
    summary: 'Capture a site’s phone layout from your desktop, from a URL or with device mode.',
    image: '/images/home/example-iphone.jpg',
    related: ['/guides/put-screenshot-in-iphone-frame/', '/guides/full-page-screenshot/', '/website-screenshot/', '/guides/screenshot-sizes/'],
    howTo: {
        name: 'Take a mobile screenshot of a website in Chrome',
        totalTime: 'PT2M',
        steps: [
            {name: 'Open DevTools', text: 'Press F12, or Cmd+Option+I on a Mac.'},
            {name: 'Turn on device mode', text: 'Press Cmd+Shift+M (Ctrl+Shift+M on Windows) to show the device toolbar.'},
            {name: 'Pick a phone', text: 'Choose a device from the Dimensions list, then reload the page.'},
            {name: 'Capture', text: 'Open the device toolbar’s ⋮ menu and choose Capture screenshot or Capture full size screenshot.'},
        ],
    },
    body: `
<div class="hero">
  <div>
    <p class="lede">You don’t need a phone to capture a website’s mobile layout. Enter the address and get a phone-sized screenshot in an iPhone frame, or use your browser’s device mode for pages behind a login.</p>
    <div class="actions">
      <a class="button primary" href="/app">Capture a mobile screenshot</a>
      <span>Free · No account</span>
    </div>
  </div>
  ${figure('/images/home/example-iphone.jpg', 'A mobile web page shown in a black iPhone frame on a light background', '', {width: 900, height: 1200, eager: true})}
</div>

<h2>From a URL, in a few seconds</h2>
${steps([
    `Open <a href="/app">the editor</a>.`,
    `Under <strong>Or capture a website</strong>, type the address, for example <code>example.com</code>.`,
    `Tick <strong>Mobile</strong> and press <strong>Capture</strong>.`,
    `The screenshot opens in an iPhone frame. Pick a background and export.`,
])}
<p>The capture loads the page the way an iPhone would: a 375 × 812 point screen (the size of an iPhone X) at 3× pixel density, with an iPhone browser identity, so sites serve their mobile layout. The image is 1125 × 2436 pixels.</p>
${note('The online capture shows the first screen of the page, not the whole scrolling length. It can’t see pages behind a login, local sites like <code>localhost</code>, or sites that block automated browsers. Use one of the methods below for those.')}

${cta('Open the editor', 'Paste a URL, tick Mobile, and the result opens in an iPhone frame.')}

<h2>In Chrome or Edge, with device mode</h2>
<p>Device mode works on any page you can open, including ones behind a login, and can capture the full scrolling height.</p>
${steps([
    `Open DevTools with ${keys('F12')}, or ${keys('⌘', '⌥', 'I')} on a Mac.`,
    `Press ${keys('⌘', '⇧', 'M')} (${keys('Ctrl', 'Shift', 'M')} on Windows) to turn on the device toolbar.`,
    `Choose a phone from the <strong>Dimensions</strong> menu, such as an iPhone, or type a width. Reload the page so the site serves its mobile version.`,
    `Open the <strong>⋮</strong> menu at the right of the device toolbar and choose <strong>Capture screenshot</strong> for the visible screen or <strong>Capture full size screenshot</strong> for the whole page. The PNG goes to your Downloads folder.`,
])}
<p>The screenshot uses the device’s pixel ratio, so an iPhone preset gives a 3× image. If you typed a custom width, choose <strong>⋮ → Add device pixel ratio</strong> and set <strong>DPR</strong> to 2 or 3 to avoid a blurry result.</p>

<h2>In Firefox</h2>
${steps([
    `Press ${keys('⌘', '⌥', 'M')} on a Mac or ${keys('Ctrl', 'Shift', 'M')} on Windows to open Responsive Design Mode.`,
    `Pick a device from the menu at the top and reload the page.`,
    `Click the camera icon in the toolbar to save a screenshot of the phone-sized viewport.`,
])}

<h2>In Safari</h2>
${steps([
    `Turn on developer features: <strong>Safari → Settings → Advanced</strong>, then tick <strong>Show features for web developers</strong>.`,
    `Choose <strong>Develop → Enter Responsive Design Mode</strong> and pick an iPhone.`,
    `Press ${keys('⌘', '⇧', '4')} and drag over the phone preview to capture it.`,
])}

<h2>On the phone itself</h2>
<p>If you have the phone to hand, a real screenshot is the most accurate. On an iPhone press the side button and volume up together; on most Android phones press power and volume down. Send it to your computer with AirDrop, Quick Share or email, then drop it into the editor. The <a href="/guides/put-screenshot-in-iphone-frame/">iPhone frame guide</a> covers the rest.</p>

<h2>Tips for a better mobile screenshot</h2>
<ul>
  <li><strong>Dismiss cookie banners and app-install prompts</strong> before capturing. They cover a large part of a small screen.</li>
  <li><strong>Check dark mode too.</strong> In Chrome DevTools, open the Rendering panel and set <em>Emulate CSS media feature prefers-color-scheme</em> to dark.</li>
  <li><strong>Pick one part of the page.</strong> A mobile screen shows a lot less than a desktop one, so capture the section that matters rather than the top of the page by default.</li>
  <li><strong>Use a 4:5 or 9:16 canvas</strong> for social posts so the phone fills the frame. See <a href="/guides/screenshot-sizes/">screenshot sizes</a>.</li>
</ul>
`,
    faq: [
        {q: 'What screen size does the mobile capture use?', a: '<p>375 × 812 points at 3× density, the screen size of an iPhone X, which gives a 1125 × 2436 pixel image.</p>'},
        {q: 'Can I capture the full length of a page in its mobile layout?', a: '<p>Yes, with Chrome or Edge device mode: choose <strong>Capture full size screenshot</strong> from the device toolbar’s ⋮ menu. The online capture only takes the first screen.</p>'},
        {q: 'Why does the site still show its desktop layout?', a: '<p>Reload the page after turning on device mode; some sites only check the screen size when the page loads. If it still shows the desktop layout, the site may not have a mobile design.</p>'},
        {q: 'Can I capture a page that needs me to log in?', a: '<p>Use device mode in your own browser, or the <a href="/screenshot-extension/">browser extension</a>. The online capture runs on a server that isn’t logged in to your account.</p>'},
    ],
};
