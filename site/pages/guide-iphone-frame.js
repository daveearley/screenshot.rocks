const {figure, steps, cta, note} = require('../lib');

module.exports = {
    order: 12,
    path: '/guides/put-screenshot-in-iphone-frame/',
    type: 'article',
    published: '2026-09-24',
    breadcrumbs: [{name: 'Guides', path: '/guides/'}],
    breadcrumb: 'iPhone frame',
    title: 'How to Put a Screenshot in an iPhone Frame',
    description: 'Turn a phone screenshot into a clean iPhone mockup in your browser. Pick the finish, show or hide the Dynamic Island, and export for social posts or slides.',
    h1: 'How to put a screenshot in an iPhone frame',
    navTitle: 'Put a screenshot in an iPhone frame',
    summary: 'Turn a phone screenshot into an iPhone mockup, with tips for a clean status bar.',
    lede: 'An iPhone frame makes it obvious a screenshot is from an app or mobile site. Below: the steps, plus a few tricks for a clean status bar.',
    image: '/images/home/example-iphone.jpg',
    related: ['/mobile-website-screenshot/', '/guides/screenshot-sizes/', '/guides/beautiful-screenshots/', '/screenshot-mockup-generator/'],
    howTo: {
        name: 'Put a screenshot in an iPhone frame',
        totalTime: 'PT2M',
        steps: [
            {name: 'Take the screenshot', text: 'Take a screenshot on the phone, or capture a website’s mobile view from your computer.'},
            {name: 'Move it to your computer', text: 'Use AirDrop, Quick Share, Photos or email.'},
            {name: 'Add it to the editor', text: 'Open screenshot.rocks/app and drop the screenshot in. Portrait screenshots go into the iPhone frame automatically.'},
            {name: 'Pick the finish and options', text: 'Choose a finish, turn the Dynamic Island on or off, and choose whether the top or middle of the screenshot shows.'},
            {name: 'Size and export', text: 'Pick a canvas size such as 4:5 or 9:16 and export.'},
        ],
    },
    body: `
${figure('/images/home/example-iphone.jpg', 'A mobile app screenshot in a black iPhone frame on a light gray background', 'A portrait screenshot in the iPhone frame, on a 1080 × 1440 canvas.', {width: 900, height: 1200, eager: true})}

<h2>Step by step</h2>
${steps([
    `<strong>Take the screenshot.</strong> On an iPhone press the side button and volume up together; on most Android phones press power and volume down. For a website you can also <a href="/mobile-website-screenshot/">capture the mobile view from your computer</a>.`,
    `<strong>Move it to your computer</strong> with AirDrop, Quick Share, your photo library or email.`,
    `<strong>Add it to <a href="/app">the editor</a>.</strong> Portrait screenshots go straight into the iPhone frame. If yours doesn’t, click <strong>iPhone</strong> under Frame.`,
    `<strong>Choose the finish:</strong> Space Black, Silver, Gold, Blue or Deep Purple. A dark finish stands out on a light background, and a light one on a dark background.`,
    `<strong>Decide on the Dynamic Island.</strong> Leave it on for a current iPhone look, or turn it off if it covers something important at the top of the screen.`,
    `<strong>Size it and export.</strong> Use 4:5 for Instagram and LinkedIn posts, 9:16 for stories, or 1:1 for a square.`,
])}

${cta()}

<h2>Get a clean status bar</h2>
<p>A low battery, a stray notification icon or 3:47 am in the corner is distracting. A few ways to tidy it:</p>
<ul>
  <li><strong>iOS Simulator:</strong> developers can set a clean status bar with <code>xcrun simctl status_bar booted override --time 9:41 --batteryLevel 100</code>. 9:41 is the time Apple uses in its own product shots.</li>
  <li><strong>Android:</strong> turn on <strong>System UI demo mode</strong> in Developer options. It shows a full battery, full signal and a fixed time.</li>
  <li><strong>On any phone:</strong> charge it, turn on Do Not Disturb so notification icons don’t appear, and take the screenshot on Wi-Fi.</li>
</ul>

<h2>Tall screenshots and scrolling pages</h2>
<p>The frame’s screen has the shape of a modern iPhone. A screenshot that is taller than that is trimmed to fit. Use <strong>Align screenshot</strong> to choose whether the top or the middle stays visible. If you want to show a whole long page, a phone frame isn’t the right tool; use the <strong>Image</strong> frame on a 9:16 canvas instead.</p>
${note('The frame is iPhone-shaped, but Android screenshots work too. Most have a similar shape, so only a thin strip is trimmed.')}
`,
    faq: [
        {q: 'Can I use an Android screenshot?', a: '<p>Yes. Android and iPhone screens have similar proportions, so the screenshot fills the frame with little or no trimming.</p>'},
        {q: 'Can I make App Store screenshots with it?', a: '<p>It’s built for marketing and social images. Apple’s required iPhone screenshot sizes are larger than the editor’s 2300 px maximum, so use a dedicated tool for store listings.</p>'},
        {q: 'Can I put a website in the iPhone frame?', a: '<p>Yes. Capture the site’s mobile view with the <a href="/mobile-website-screenshot/">mobile screenshot tool</a>, and it opens in the iPhone frame.</p>'},
        {q: 'Can I change the iPhone’s color?', a: '<p>Yes. Pick Space Black, Silver, Gold, Blue or Deep Purple under Frame.</p>'},
    ],
};
