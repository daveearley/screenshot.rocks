import React from "react";
import {styles} from "./styles";
import {BrowserFrame} from "../Frames/Browser";
import {BackgroundType} from "../Frames/Browser/styles";
import {IBrowserStyles} from "../../../stores/browserStore";
import {FrameType} from "../../../types";
import {PhoneFrame} from "../Frames/Phone";
import {IPhoneStyles} from "../../../stores/phoneStore";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../stores/appStore";

export interface ICanvasProps {
    showControlsOnly?: boolean;
    imageData?: string;
    canvasBgColor?: string;
    canvasBgImage?: string;
    canvasBgType?: BackgroundType;
    canvasVerticalPadding?: number;
    canvasHorizontalPadding?: number;
    styles: IBrowserStyles | IPhoneStyles;
    isDownloadMode: boolean;
    isAutoRotateActive: boolean;
    showBoxShadow: boolean;
    frameType?: FrameType;
    hideAddressBarOverride?: boolean;
}

export const Canvas = view((props: ICanvasProps) => {
    const handleAutoRotateClick = () => {
        app.disableAutoRotate = true;
        app.imageData = app.originalImageData;
        app.isAutoRotateActive = false;
    }

    return (
        <div className={styles(props)}>
            {app.isAutoRotateActive && <div className="rotate-alert">
                Image was auto-rotated to suit mobile view - <a onClick={handleAutoRotateClick} href={'/#'}>Disable Auto-rotation</a>
            </div>}
            <div className="canvas" id="canvas">
                {(props.frameType === FrameType.Browser || !props.frameType) && <BrowserFrame {...props} />}
                {props.frameType === FrameType.Phone && <PhoneFrame {...props} />}
            </div>
        </div>
    );
});