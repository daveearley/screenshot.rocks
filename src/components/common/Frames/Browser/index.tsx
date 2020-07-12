import {IoIosArrowBack, IoIosArrowForward, IoIosOptions} from "react-icons/io";
import {FiLock} from "react-icons/all";
import React from "react";
import {ICanvasProps} from "../../Canvas";
import {styles} from "./styles";
import {ImageSelector} from "../../ImageSelector";
import {view} from "@risingstack/react-easy-state";
import {browserStore} from "../../../../stores/browserStore";

export const BrowserFrame = view((props: ICanvasProps) => {
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
                <div className={`window-controls ${!browserStore.settings.showWindowControls ? 'hide' : ''}`}>
                    <span className="close"/>
                    <span className="minimise"/>
                    <span className="maximise"/>
                </div>
                <div className={`page-controls ${!browserStore.settings.showNavigationButtons ? 'hide' : ''}`}>
                    <span className="back browser-container">
                        <IoIosArrowBack/>
                    </span>
                    <span className="forward browser-container">
                        <IoIosArrowForward/>
                    </span>
                </div>
                <span className={`url-bar browser-container ${!browserStore.settings.showAddressBar ? 'hide' : ''}`}>
                    <span className="lock">
                        <FiLock/>
                    </span>
                    <span className={`url-text ${!browserStore.settings.showAddressBarUrl ? 'hide' : ''}`}>
                        <span className="text-success" contentEditable suppressContentEditableWarning>
                            {browserStore.settings.addressBarUrlProtocol}
                        </span>
                        <span contentEditable suppressContentEditableWarning>
                            {props.urlTextOverride || browserStore.settings.addressBarUrl}
                        </span>
                    </span>
                    </span>
                <span className={`browser-container ${!browserStore.settings.showSettingsButton ? 'hide' : ''}`}>
                    <span className="settings">
                        <IoIosOptions/>
                    </span>
                </span>
            </div>
            {browserContent}
        </div>
    );
});