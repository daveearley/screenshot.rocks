import {view} from "@risingstack/react-easy-state";
import React, {useEffect} from "react";
import {Logo, LogoStyle} from "../../common/Logo";
import {styles} from "./styles";
import {FaGithub, GiShamrock} from "react-icons/all";
import {checkForImageFromLocalstorageUrlOrPaste} from "../../../utils/image";
import {BrowserExtensionBanner} from "../../common/BrowserExtensionBanner";
import {ImageSelector} from "../../common/ImageSelector";
import {ShareButtons} from "../../common/ShareButtons";

export const Homepage = view(() => {
    useEffect(() => checkForImageFromLocalstorageUrlOrPaste(), []);

    const handleContactClick = () => {
        window.location.href = `mailto:dave+screenshot.rocks@earley.email`;
    };

    return (
        <>
            <BrowserExtensionBanner/>
            <div className={styles()}>
                <section className="aboveFold">
                    <Logo style={LogoStyle.Light}/>
                    <h1>Create <span>beautiful</span> mobile & browser screenshot mockups in seconds</h1>
                    <div className="m-5">
                        <ImageSelector/>
                    </div>
                </section>
                <section className="share mt-2">
                    <h2 className="text-white">Share</h2>
                    <ShareButtons/>
                </section>
                <section className="features">
                    <div className="row align-items-center justify-center text-white">
                        <div className="col-12 col-sm-6 text-center">
                            <img alt="browser screenshot & mockup features" className="img-fluid"
                                 src="/images/home/feature-features.png"/>
                        </div>
                        <div className="col-12 p-5 col-sm-6 text-center text-sm-left">
                            <h4>Create Eye-Catching Mockups</h4>
                            <p>With the ability to customize every aspect of your screenshot, Screenshot.rocks makes it easy
                                to
                                create a screenshot mockup that suits your brand's identity.</p>
                        </div>
                    </div>
                    <div className="row align-items-center justify-center text-white flex-row-reverse">
                        <div className="col-12 col-sm-6 text-center">
                            <img alt="browser screenshots & mockups browser extensions" className="img-fluid"
                                 src="/images/home/feature-browser-extensions.png"/>
                        </div>
                        <div className="col-12 p-5 col-sm-6 text-center text-sm-left">
                            <h4>Browser Extensions Available</h4>
                            <p>Use our browser extensions to create a mobile or browser screenshot from any tab in one-click.
                                Our extension is available for all major browsers.</p>
                            <p>
                                <a target="_blank" href="https://addons.mozilla.org/en-US/firefox/addon/one-click-design-mockups">Firefox</a>, <a target="_blank"
                                href="https://chrome.google.com/webstore/detail/screenshotrocks-one-click/oolmphedpohnagciifbnfpemadolahki">Chrome</a>, <a
                                target="_blank"
                                href="https://microsoftedge.microsoft.com/addons/detail/clennbaklmghlnlamipjmfikdnlhiaem">Edge</a>
                            </p>
                        </div>
                    </div>
                    <div className="row align-items-center justify-center text-white">
                        <div className="col-12 col-sm-6 text-center">
                            <img alt="open-source browser screenshot & mockup tool" className="img-fluid"
                                 src="/images/home/feature-open-source.png"/>
                        </div>
                        <div className="col-12 p-5 col-sm-6 text-center text-sm-left">
                            <h4>Open-Source</h4>
                            <p>
                                Screenshot.rocks is fully <a target="_blank" href="https://github.com/daveearley/screenshot.rocks">open-source</a>, so you can see exactly how we
                                process
                                your images. No image data is saved on our servers; all image processing occurs in the browser
                                or in memory.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="footer">
                    <button className="btn btn-link">
                        &copy; {(new Date()).getFullYear()} Dave Earley
                    </button>
                    <button className="btn btn-link" onClick={handleContactClick}>
                        Contact
                    </button>
                    <button className="btn btn-link">
                        Made In Dublin <GiShamrock/>
                    </button>
                    <button onClick={() => window.location.href = 'https://github.com/daveearley/screenshot.rocks'} className="btn btn-link github">
                        <FaGithub/>
                    </button>
                </section>
            </div>
        </>
    );
});
