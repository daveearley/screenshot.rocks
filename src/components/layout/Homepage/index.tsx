import {view} from "@risingstack/react-easy-state";
import React, {useEffect} from "react";
import {Logo, LogoStyle} from "../../common/Logo";
import {styles} from "./styles";
import {BrowserThemes, browserThemes} from "../../common/Frames/Browser/styles";
import {BrowserFrame} from "../../common/Frames/Browser";
import {FaWhatsapp, GiShamrock, RiFacebookCircleLine, RiTwitterLine} from "react-icons/all";
import {checkForImageFromLocalstorageUrlOrPaste} from "../../../utils/image";
import {browserStore} from "../../../stores/browserStore";
import {BrowserExtensionBanner} from "../../common/BrowserExtensionBanner";

enum SocialProviders {
    Facebook,
    Twitter,
    WhatsApp,
}

export const Homepage = view(() => {
    useEffect(() => checkForImageFromLocalstorageUrlOrPaste(), []);
    browserStore.settings.addressBarUrl = 'screenshot.rocks';


    const handleContactClick = () => {
        window.location.href = `mailto:dave+screenshot.rocks@earley.email`;
    };

    const handleShareClick = (provider: SocialProviders) => {
        switch (provider) {
            case SocialProviders.WhatsApp:
                window.location.href = 'whatsapp://send?text=Create%20beautiful%20browser%20mockups%20in%20seconds+https%3A%2F%2Fscreenshot.rocks';
                break
            case SocialProviders.Facebook:
                window.open('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fscreenshot.rocks%20');
                break;
            case SocialProviders.Twitter:
                window.open('https://twitter.com/intent/tweet?url=https%3A%2F%2Fscreenshot.rocks%20&text=Create%20beautiful%20browser%20mockups%20in%20seconds');
                break;
        }
    }

    return (
        <>
            <BrowserExtensionBanner/>
            <div className={styles()}>
                <Logo style={LogoStyle.Light}/>
                <h1>Create <span>beautiful</span> browser & mobile mockups in seconds</h1>
                <div className="m-5">
                    <BrowserFrame
                        showControlsOnly={false}
                        styles={(browserThemes as any)[BrowserThemes.Default]}
                        isDownloadMode={false}
                        showBoxShadow={browserStore.settings.showBoxShadow}
                        urlTextOverride="screenshot.rocks"
                        isAutoRotateActive={false}
                    />
                </div>
                <div className="share">
                    <button onClick={() => handleShareClick(SocialProviders.Facebook)}>
                        <RiFacebookCircleLine/>
                    </button>
                    <button onClick={() => handleShareClick(SocialProviders.Twitter)}>
                        <RiTwitterLine/>
                    </button>
                    <button onClick={() => handleShareClick(SocialProviders.WhatsApp)}>
                        <FaWhatsapp/>
                    </button>
                </div>
                <div className="footer">
                    <button className="btn btn-link">
                        &copy; 2020 Dave Earley
                    </button>
                    <button className="btn btn-link" onClick={handleContactClick}>
                        Contact
                    </button>
                    <button className="btn btn-link">
                        Made In Dublin <GiShamrock/>
                    </button>
                </div>
            </div>
        </>
    );
});