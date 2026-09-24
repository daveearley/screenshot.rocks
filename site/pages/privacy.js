const {table} = require('../lib');

// Kept at /privacy.html because that URL is linked from the browser extension store listings.
module.exports = {
    order: 50,
    path: '/privacy.html',
    type: 'legal',
    published: '2020-07-20',
    updated: '2026-09-24',
    breadcrumb: 'Privacy',
    title: 'Privacy Policy | Screenshot.Rocks',
    description: 'What Screenshot.Rocks collects and why: your images stay in your browser, we use analytics to understand usage, and we don’t sell or share your data.',
    h1: 'Privacy policy',
    lede: 'Short version: images you edit stay in your browser and are never stored by us. We use analytics to see how the site is used. We don’t sell your data.',
    body: `
<p class="byline">Last updated <time datetime="2026-09-24">24 September 2026</time></p>

<h2>Your images</h2>
<p>Screenshots you drop, choose or paste into the editor are processed entirely in your browser. They are not uploaded to our servers, and exported images are created on your device.</p>
<p>Two optional features send data to our servers so they can work. Neither stores it:</p>
<ul>
  <li><strong>Website capture.</strong> When you enter a web address and press Capture, the address is sent to our screenshot service, which loads that page and returns an image of it to your browser.</li>
  <li><strong>Browser extension.</strong> When you click the extension’s button, the screenshot of your current tab is sent to screenshot.rocks so it can be opened in the editor. It is passed straight back to your browser and not kept. The extension only has access to a tab when you click its button.</li>
</ul>

<h2>Settings stored in your browser</h2>
<p>The editor remembers your preferences, such as your last frame, background and export format, and any looks you save, in your browser’s local storage. This stays on your device and isn’t sent to us. Clearing this site’s data in your browser removes it.</p>

<h2>Analytics</h2>
<p>We use Google Analytics and Fathom Analytics to understand how many people use the site and which pages they visit. Google Analytics may set cookies, and our Google tag also measures conversions from Google Ads. Fathom doesn’t use cookies. We use this information in aggregate to improve the site; we don’t use it to identify you.</p>

<h2>Other services we use</h2>
${table(['Service', 'What it’s for', 'What it receives'], [
    ['Our hosting provider', 'Serving the website', 'Standard request logs: IP address, browser type, pages requested, date and time'],
    ['Google Analytics and Google Ads', 'Usage statistics and ad conversion measurement', 'Pages visited, device and browser details, cookies'],
    ['Fathom Analytics', 'Cookie-free usage statistics', 'Pages visited and referrer, without cookies'],
    ['Bunny Fonts', 'Fonts for text in the editor', 'Your IP address when a font is loaded, which only happens when you open the font menu or use one of its fonts'],
])}

<h2>What we don’t do</h2>
<ul>
  <li>We don’t require an account, so we don’t hold your name, email address or password.</li>
  <li>We don’t sell or rent personal data.</li>
  <li>We don’t store the images you edit, capture or send from the extension.</li>
</ul>

<h2>Your rights</h2>
<p>If you’re in the UK or European Economic Area, you have rights under the GDPR:</p>
<ul>
  <li><strong>Access:</strong> ask for a copy of personal data we hold about you.</li>
  <li><strong>Rectification:</strong> ask us to correct data that’s inaccurate or incomplete.</li>
  <li><strong>Erasure:</strong> ask us to delete your personal data, in certain circumstances.</li>
  <li><strong>Restriction:</strong> ask us to limit how we use your data, in certain circumstances.</li>
  <li><strong>Objection:</strong> object to how we process your data, in certain circumstances.</li>
  <li><strong>Portability:</strong> ask us to transfer your data to you or another organization, in certain circumstances.</li>
</ul>
<p>We’ll respond within one month. Because we don’t have accounts, we usually hold very little that can be linked to you, but we’ll tell you what we find.</p>

<h2>Contact</h2>
<p>For questions about this policy or to make a request, email <a href="mailto:dave+screenshot.rocks@earley.email">dave+screenshot.rocks@earley.email</a>.</p>

<h2>Changes</h2>
<p>If this policy changes, we’ll update it here and change the date at the top.</p>
`,
};
