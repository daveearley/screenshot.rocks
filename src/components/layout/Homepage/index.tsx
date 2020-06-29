import {view} from "@risingstack/react-easy-state";
import React from "react";
import {Logo, LogoStyle} from "../../common/Logo/index.";
import {styles} from "./styles";
import {app} from "../../../stores/appStore";
import {BrowserThemes, browserThemes} from "../../common/Browser/styles";
import {Browser} from "../../common/Browser";
import {GiShamrock} from "react-icons/all";

export const Homepage = view(() => {
    app.browserSettings.addressBarUrl = 'screenshot.rocks';

    const handleContactClick = () => {
        window.location.href = `mailto:dave+screenshot.rocks@earley.email`;
    };

    return (
        <div className={styles()}>
            <Logo style={LogoStyle.Light}/>
            <h1>Create beautiful browser mockups in seconds</h1>
            <div className="m-5">
                <Browser showControlsOnly={false}
                         styles={(browserThemes as any)[BrowserThemes.Default]}
                         isDownloadMode={false}
                         showBoxShadow={app.browserSettings.showBoxShadow}
                />
            </div>
            <div className="footer">
                <button className="btn btn-link">
                    &copy; 2020 Dave Earley
                </button>
                <button className="btn btn-link" onClick={handleContactClick}>
                    Contact
                </button>
                <button className="btn btn-link">
                    Made In Dublin <GiShamrock />
                </button>
            </div>
        </div>
    );
});