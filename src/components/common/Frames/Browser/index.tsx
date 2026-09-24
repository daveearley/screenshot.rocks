import React from "react";
import {IoIosArrowBack, IoIosArrowForward, IoIosOptions} from "react-icons/io";
import {ICanvasProps} from "../../Canvas";
import {styles} from "./styles";
import {view} from "@risingstack/react-easy-state";
import {browserStore} from "../../../../stores/browserStore";
import {app} from "../../../../stores/appStore";

export const BrowserFrame = view((props: ICanvasProps) => {
    const settings = browserStore.settings;
    const theme = props.styles;
    return <div className={styles(props)}>
        <div className="mock-browser-toolbar">
            {settings.showWindowControls && <div className="mock-browser-dots" aria-hidden="true">
                {[theme.closeButtonColor, theme.minimizeButtonColor, theme.maximizeButtonColor].map((color, index) => <i key={index} style={{background: color}} />)}
            </div>}
            {settings.showNavigationButtons && <div className="mock-browser-navigation" aria-hidden="true"><IoIosArrowBack/><IoIosArrowForward/></div>}
            <div className="mock-browser-address" style={{visibility: settings.showAddressBar && !props.hideAddressBarOverride ? 'visible' : 'hidden'}}>
                {settings.showAddressBarUrl && <input aria-label="Frame website address" value={settings.addressBarUrl} onChange={e => settings.addressBarUrl = e.target.value} />}
            </div>
            {settings.showSettingsButton && <span className="mock-browser-menu" aria-hidden="true"><IoIosOptions/></span>}
        </div>
        {!props.showControlsOnly && <img className="mock-browser-image" alt="Screenshot" draggable={false} src={app.croppedImageData || app.imageData}/>}
    </div>;
});
