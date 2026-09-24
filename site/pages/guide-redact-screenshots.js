const {figure, steps, cta, table, keys, note} = require('../lib');

module.exports = {
    order: 15,
    path: '/guides/redact-screenshots/',
    type: 'article',
    published: '2026-09-24',
    breadcrumbs: [{name: 'Guides', path: '/guides/'}],
    breadcrumb: 'Hide sensitive information',
    title: 'How to Hide Sensitive Information in a Screenshot (Safely)',
    description: 'Blur, pixelate, cover or crop private details before sharing a screenshot, and why light pixelation can be reversed. Includes a checklist of what to look for.',
    h1: 'How to hide sensitive information in a screenshot',
    navTitle: 'Hide sensitive information in screenshots',
    summary: 'Which redaction methods are safe, which can be undone, and what people forget to check.',
    lede: 'Before you share a screenshot, check it for anything private and remove it properly. A crop or a solid box can’t be undone. A light blur or small pixelation sometimes can.',
    image: '/images/guides/example-redact.jpg',
    related: ['/guides/beautiful-screenshots/', '/guides/full-page-screenshot/', '/screenshot-extension/', '/screenshot-mockup-generator/'],
    howTo: {
        name: 'Blur part of a screenshot',
        totalTime: 'PT1M',
        steps: [
            {name: 'Add the screenshot', text: 'Open screenshot.rocks/app and drop or paste the screenshot.'},
            {name: 'Open Markup', text: 'Click Markup in the toolbar.'},
            {name: 'Choose Blur', text: 'Click the Blur tool or press B.'},
            {name: 'Drag over the details', text: 'Drag a box over each area to hide. Resize it with the handles if needed.'},
            {name: 'Export', text: 'Export the image. The blur is flattened into the pixels.'},
        ],
    },
    body: `
${figure('/images/guides/example-redact.jpg', 'A website screenshot with the account area and one card blurred out', 'Blurred regions are pixelated and blurred, then flattened into the exported image.', {width: 1400, height: 875, eager: true})}

<h2>What to check before you share</h2>
<p>The obvious details are easy to spot. These are the ones people miss:</p>
<ul>
  <li><strong>Your name, email and avatar</strong> in an account menu or corner of the page.</li>
  <li><strong>Other people’s data</strong>: customer names, emails and amounts in tables, lists and search results.</li>
  <li><strong>Secrets</strong>: API keys, tokens, passwords, recovery codes and one-time codes.</li>
  <li><strong>The address bar.</strong> URLs often contain account IDs, email addresses or access tokens.</li>
  <li><strong>Browser tabs and bookmarks</strong>, which can reveal clients, projects and internal tools.</li>
  <li><strong>Notifications</strong> that arrived while you were capturing.</li>
  <li><strong>Codes that can be scanned</strong>: QR codes, barcodes, boarding passes and tickets.</li>
  <li><strong>Anything else on screen</strong>, like other windows, your desktop and the dock or taskbar.</li>
</ul>

<h2>Choose the right method</h2>
${table(['Method', 'Can it be undone?', 'Use it for'], [
    ['Crop it out', 'No', 'Anything near an edge. The safest option.'],
    ['Solid box', 'No, once flattened into the image', 'Passwords, keys, account numbers.'],
    ['Replace with fake data', 'No', 'Marketing and documentation screenshots.'],
    ['Strong blur or large pixelation', 'Very unlikely', 'Names, emails, faces and background details.'],
    ['Light blur or small pixelation', 'Sometimes', 'Nothing sensitive.'],
])}
<p>Pixelation and blur work by averaging nearby pixels. When the effect is light, the average still carries enough of the original shape to be matched. In 2020 a tool called Depix showed this by recovering passwords from pixelated screenshots, by comparing the blocks with pixelated versions of known text. Heavy blur over a generous area leaves too little to match. A crop or a solid box leaves nothing at all.</p>
${note('Be careful with apps that keep boxes and shapes as separate layers, such as PDF editors and some markup tools. If the box can be moved or deleted, so can yours. Export a flattened image before you share it.')}

<h2>How to blur part of a screenshot</h2>
${steps([
    `Open <a href="/app">the editor</a> and drop or paste your screenshot.`,
    `Click <strong>Markup</strong> in the toolbar.`,
    `Choose the <strong>Blur</strong> tool (or press ${keys('B')}) and drag over each area to hide.`,
    `Drag a blurred box to move it, or use its handles to resize it.`,
    `Export. The blur is flattened into the image.`,
])}
<p>The blur tool pixelates and blurs the pixels underneath, then draws them over a solid base, so nothing shows through. It has one fixed strength, and there is no filled-box tool yet, so for passwords, keys and account numbers crop them out instead with <strong>Crop</strong> in the toolbar.</p>

${cta('Open the editor', 'Blur or crop private details before you share. Your screenshot isn’t uploaded.')}

<h2>Better still: don’t capture it</h2>
<ul>
  <li><strong>Use a demo account</strong> with made-up names and data. It makes every future screenshot safe by default.</li>
  <li><strong>Edit the page before capturing.</strong> Right-click text, choose <strong>Inspect</strong>, and double-click the text in the Elements panel to change it. Or run <code>document.designMode = 'on'</code> in the console and type straight onto the page. Changes disappear when you reload.</li>
  <li><strong>Capture only the part you need</strong> with a region screenshot (${keys('⌘', '⇧', '4')} on a Mac, ${keys('Win', 'Shift', 'S')} on Windows) rather than the whole screen.</li>
  <li><strong>Use a clean browser profile</strong> for screenshots, with no bookmarks bar and no personal extensions.</li>
</ul>

<h2>What about hidden information in the file?</h2>
<p>Photos taken on a phone can include location and camera details. Screenshots usually carry less, but can still include the device and the time they were taken. Images exported from Screenshot.Rocks are drawn fresh in the browser, so none of the original file’s metadata is copied into them.</p>
`,
    faq: [
        {q: 'Is blurring safe for passwords?', a: '<p>Not reliably. Crop passwords, keys and account numbers out, cover them with an opaque box, or change them before capturing.</p>'},
        {q: 'Can pixelated text be read?', a: '<p>Sometimes. Light pixelation of text can be reversed by comparing it with pixelated samples of known text. Use large blocks or heavy blur over a generous area, or remove the text entirely.</p>'},
        {q: 'Does exporting from Screenshot.Rocks remove metadata?', a: '<p>Yes. The exported image is drawn fresh in the browser, so metadata from the original file is not included.</p>'},
        {q: 'Are my screenshots uploaded when I blur them?', a: '<p>No. Editing happens in your browser. The screenshot isn’t sent anywhere unless you share the exported file yourself.</p>'},
    ],
};
