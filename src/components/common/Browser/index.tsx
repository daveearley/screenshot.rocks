import {IoIosArrowBack, IoIosArrowForward, IoIosOptions} from "react-icons/io";
import {FiLock} from "react-icons/all";
import React from "react";
import {IBrowserCanvasProps} from "../BrowserCanvas";
import {styles} from "./styles";
import {ImageSelector} from "../ImageSelector";
import {app} from "../../../stores/appStore";
import {view} from "@risingstack/react-easy-state";

export const Browser = view((props: IBrowserCanvasProps) => {
    let browserContent;
    if (!props.showControlsOnly) {
        browserContent = props.imageData
            ? <img id="screenshot"
                   src={props.imageData}
                   alt="Screenshot.rocks browser mockup"/>
            : <ImageSelector/>
    }

    return (
        <div className={styles(props)}>
            <div className="browser-controls">
                <div className={`window-controls ${!app.browserSettings.showWindowControls ? 'hide' : ''}`}>
                    <span className="close"/>
                    <span className="minimise"/>
                    <span className="maximise"/>
                </div>
                <div className={`page-controls ${!app.browserSettings.showNavigationButtons ? 'hide' : ''}`}>
                    <span className="back browser-container">
                        <IoIosArrowBack/>
                    </span>
                    <span className="forward browser-container">
                        <IoIosArrowForward/>
                    </span>
                </div>
                <span className={`url-bar browser-container ${!app.browserSettings.showAddressBar ? 'hide' : ''}`}>
                    <span className="lock">
                        <FiLock/>
                    </span>
                    <span className={`url-text ${!app.browserSettings.showAddressBarUrl ? 'hide' : ''}`}>
                        <span className="text-success" contentEditable suppressContentEditableWarning>
                            {app.browserSettings.addressBarUrlProtocol}
                        </span>
                        <span contentEditable suppressContentEditableWarning>
                            {props.urlTextOverride || app.browserSettings.addressBarUrl}
                        </span>
                    </span>
                    </span>
                <span className={`browser-container ${!app.browserSettings.showSettingsButton ? 'hide' : ''}`}>
                    <span className="settings">
                        <IoIosOptions/>
                    </span>
                </span>
            </div>
            {browserContent}
        </div>
    );
});