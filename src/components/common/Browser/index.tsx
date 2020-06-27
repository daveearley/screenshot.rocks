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
                   src={props.imageData || "http://placehold.it/1000x700px"}
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
                    <span className="back white-container">
                        <IoIosArrowBack/>
                    </span>
                    <span className="forward white-container">
                        <IoIosArrowForward/>
                    </span>
                </div>

                <span className={`url-bar white-container ${!app.browserSettings.showAddressBar ? 'hide' : ''}`}>
                        <span className="lock">
                         <FiLock/>
                        </span>
                    <span contentEditable suppressContentEditableWarning><span className="text-success">https://</span>screenshot.rocks</span>
                </span>

                <span className={`settings white-container ${!app.browserSettings.showSettingsButton ? 'hide' : ''}`}>
                    <IoIosOptions/>
                </span>
            </div>
            {browserContent}

        </div>
    );
});