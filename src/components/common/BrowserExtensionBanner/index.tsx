import React from "react";
import {styles} from "./styles";
import {getBrowserExtensionInfo} from "../../../utils/misc";

export const BrowserExtensionBanner = () => {
    const extensionInfo = getBrowserExtensionInfo();
    if (!extensionInfo) {
        return null;
    }

    const {link, name} = extensionInfo;

    return (
        <div className={styles()}>
            <span role="img">🚀</span> Try our <a target="_blank" href={link}><span>{name}</span></a> for one-click
            screenshot mockups from any page
        </div>
    );
}