import React, {useEffect, useState} from "react";
import {view} from "@risingstack/react-easy-state";
import {useDropzone} from "react-dropzone";
import {checkForImageFromLocalstorageUrlOrPaste} from "../../../utils/image";
import {getBrowserType} from "../../../utils/misc";
import {ACCEPTED_IMAGES, useImageInput} from "../../../hooks/useImageInput";
import {Routes, routeStore} from "../../../stores/routeStore";
import {Browsers} from "../../../types";
import {fieldStyles} from "../../ui/controls";
import {Toast} from "../../ui/Toast";
import {styles} from "./styles";

const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform);
const GITHUB = 'https://github.com/daveearley/screenshot.rocks';

const EXTENSIONS = [
    {browser: Browsers.Chrome, name: 'Chrome', store: 'Chrome Web Store', logo: '/images/browsers/chrome.svg',
        href: 'https://chromewebstore.google.com/detail/screenshotrocks-one-click/oolmphedpohnagciifbnfpemadolahki'},
    {browser: Browsers.Firefox, name: 'Firefox', store: 'Firefox Add-ons', logo: '/images/browsers/firefox.svg',
        href: 'https://addons.mozilla.org/en-US/firefox/addon/one-click-design-mockups'},
    {browser: Browsers.Edge, name: 'Edge', store: 'Edge Add-ons', logo: '/images/browsers/edge.svg',
        href: 'https://microsoftedge.microsoft.com/addons/detail/clennbaklmghlnlamipjmfikdnlhiaem'},
];

// Keep in sync with the footer in site/lib.js.
const TOOL_LINKS = [
    {href: '/screenshot-mockup-generator/', label: 'Screenshot mockup generator'},
    {href: '/mobile-website-screenshot/', label: 'Mobile website screenshot'},
    {href: '/website-screenshot/', label: 'Website screenshot'},
    {href: '/screenshot-extension/', label: 'Browser extension'},
];
const GUIDE_LINKS = [
    {href: '/guides/full-page-screenshot/', label: 'Full-page screenshots in any browser'},
    {href: '/guides/add-browser-frame-to-screenshot/', label: 'Put a screenshot in a browser window'},
    {href: '/guides/put-screenshot-in-iphone-frame/', label: 'Put a screenshot in an iPhone frame'},
    {href: '/guides/beautiful-screenshots/', label: 'Make beautiful screenshots'},
    {href: '/guides/screenshot-sizes/', label: 'Screenshot sizes for every platform'},
    {href: '/guides/redact-screenshots/', label: 'Hide sensitive information in screenshots'},
];

const SHARE_TEXT = encodeURIComponent('Frame your screenshots in a browser window or iPhone');
const SHARE_URL = encodeURIComponent('https://screenshot.rocks');

export const Homepage = view(() => {
    const {openFiles, capture, capturing, error, clearError, openDemo} = useImageInput();
    const [address, setAddress] = useState('');
    const [mobile, setMobile] = useState(false);
    const {getRootProps, getInputProps, isDragActive, open} = useDropzone({onDrop: openFiles, accept: ACCEPTED_IMAGES, noClick: true, noKeyboard: true});
    const currentBrowser = getBrowserType();
    // No Safari extension, so Safari and unknown browsers get Chrome.
    const suggested = EXTENSIONS.find(extension => extension.browser === currentBrowser) || EXTENSIONS[0];

    useEffect(() => checkForImageFromLocalstorageUrlOrPaste(), []);

    return (
        <div {...getRootProps({className: styles})}>
            <input {...getInputProps()}/>
            <Toast/>
            {isDragActive && <div className="drop-overlay" aria-hidden="true"><span>Drop to open in the editor</span></div>}

            <header className="nav">
                <a className="brand" href="/"><img src="/images/hand-logo-sqr-white.png" alt=""/>Screenshot.Rocks</a>
                <nav aria-label="Main">
                    <a href="/guides/">Guides</a>
                    <a href="#extension" className="nav-extension"><img src={suggested.logo} alt=""/>Extension</a>
                    <a href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a>
                    <button type="button" className="button" onClick={() => routeStore.goToRoute(Routes.App)}>Open editor</button>
                </nav>
            </header>

            <main>
                <section className="hero">
                    <div className="intro">
                        <h1>Make beautiful screenshots.</h1>
                        <p className="lede">
                            Put a screenshot in a browser window or an iPhone, pick a background, mark it up, and export it.
                            Images are processed in your browser and never stored on our servers.
                        </p>

                        <div className="start">
                            <button type="button" className="button primary" onClick={open}>Choose a screenshot…</button>
                            <span className="hint">or drop one anywhere on this page, or paste with {isMac ? '⌘V' : 'Ctrl+V'}</span>
                        </div>
                        <a className="hero-extension" href={suggested.href} target="_blank" rel="noopener noreferrer">
                            <img src={suggested.logo} alt=""/>
                            <span><strong>Add to {suggested.name}</strong> to capture any tab with one click</span>
                        </a>

                        <form className="capture" onSubmit={event => { event.preventDefault(); capture(address, mobile); }}>
                            <label htmlFor="home-capture">Capture a website instead</label>
                            <div className="capture-row">
                                <input id="home-capture" className={fieldStyles} aria-label="Website URL" placeholder="example.com"
                                       value={address} disabled={capturing} spellCheck={false} aria-invalid={!!error}
                                       onChange={event => { setAddress(event.target.value); if (error) clearError(); }}/>
                                <label className="mobile"><input type="checkbox" checked={mobile} onChange={() => setMobile(!mobile)}/>Mobile</label>
                                <button type="submit" className="button" disabled={capturing}>{capturing ? 'Capturing…' : 'Capture'}</button>
                            </div>
                            {error && <p className="error" role="alert">{error}</p>}
                        </form>

                        <p className="demo">
                            Or open the editor with a demo: <button type="button" onClick={() => openDemo(false)}>Browser</button>, <button
                            type="button" onClick={() => openDemo(true)}>Mobile</button>
                        </p>
                    </div>

                    <figure className="hero-image">
                        <img src="/images/home/example-browser.jpg" width={1400} height={875}
                             alt="A website screenshot in a light browser window on a soft lilac background"/>
                    </figure>
                </section>

                <section className="examples" aria-labelledby="examples-title">
                    <h2 id="examples-title">Made with the editor</h2>
                    <div className="example-grid">
                        <figure>
                            <img src="/images/home/example-iphone.jpg" width={900} height={1200} loading="lazy"
                                 alt="A mobile app screenshot in a black iPhone frame on a light gray background"/>
                            <figcaption>
                                <strong>iPhone frame.</strong> Portrait screenshots go into an iPhone automatically.
                                Choose the finish, and show or hide the Dynamic Island.
                            </figcaption>
                        </figure>
                        <figure>
                            <img src="/images/home/example-markup.jpg" width={1400} height={875} loading="lazy"
                                 alt="A serif headline and subtitle above a website screenshot, with one card highlighted and numbered"/>
                            <figcaption>
                                <strong>Markup.</strong> Add a headline in one of ten fonts, highlight what matters and
                                number the steps. Blur anything private before you share it.
                            </figcaption>
                        </figure>
                    </div>
                </section>

                <section className="extension" id="extension" aria-labelledby="extension-title">
                    <div className="extension-intro">
                        <h2 id="extension-title">Capture any tab in one click</h2>
                        <p>
                            The browser extension adds a button to your toolbar. Click it on any page and the page opens
                            in the editor, already in a browser frame.
                        </p>
                        <div className="toolbar-demo" aria-hidden="true">
                            <span className="dots"><i/><i/><i/></span>
                            <span className="address">yourproduct.com</span>
                            <span className="extensions">
                                <i/><i/>
                                <span className="ours"><img src="/images/hand-logo-sqr-white.png" alt=""/></span>
                            </span>
                            <span className="button-tip">Capture a screenshot</span>
                        </div>
                        <ol className="steps">
                            <li>Install the extension for your browser.</li>
                            <li>Open the page you want and click the Screenshot.Rocks button.</li>
                            <li>Choose a frame and background, then export.</li>
                        </ol>
                    </div>
                    <ul className="stores" aria-label="Get the extension">
                        {EXTENSIONS.map(extension => (
                            <li key={extension.name}>
                                <a className={`store ${extension === suggested ? 'suggested' : ''}`} href={extension.href}
                                   target="_blank" rel="noopener noreferrer">
                                    <img src={extension.logo} alt="" width={40} height={40}/>
                                    <span className="store-text">
                                        <strong>Add to {extension.name}</strong>
                                        <span>{extension === suggested && currentBrowser === extension.browser ? `Your browser · ${extension.store}` : extension.store}</span>
                                    </span>
                                    <svg className="chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>

            <footer className="footer">
                <div className="footer-links">
                    <nav aria-label="Tools">
                        <h2>Tools</h2>
                        <ul>{TOOL_LINKS.map(link => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul>
                    </nav>
                    <nav aria-label="Guides">
                        <h2><a href="/guides/">Guides</a></h2>
                        <ul>{GUIDE_LINKS.map(link => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul>
                    </nav>
                    <nav aria-label="About">
                        <h2>About</h2>
                        <ul>
                            <li><a href={GITHUB}>Source code on GitHub</a></li>
                            <li><a href="/privacy.html">Privacy</a></li>
                            <li><a href="mailto:dave+screenshot.rocks@earley.email">Contact</a></li>
                        </ul>
                    </nav>
                </div>
                <div className="footer-meta">
                    <p>
                        Screenshot.Rocks is <a href={GITHUB} target="_blank" rel="noopener noreferrer">open source</a>.
                        Made in Dublin by Dave Earley.
                    </p>
                    <p className="share">
                        Share:{' '}
                        <a href={`https://twitter.com/intent/tweet?url=${SHARE_URL}&text=${SHARE_TEXT}`} target="_blank" rel="noopener noreferrer">X</a>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${SHARE_URL}`} target="_blank" rel="noopener noreferrer">Facebook</a>
                        <a href={`https://wa.me/?text=${SHARE_TEXT}%20${SHARE_URL}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                    </p>
                </div>
            </footer>
        </div>
    );
});
