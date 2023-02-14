import React from "react";
import {styles} from "./styles";
import {BrowserFrame} from "../Frames/Browser";
import {IBrowserStyles} from "../../../stores/browserStore";
import {CanvasBackgroundTypes, FrameType} from "../../../types";
import {PhoneFrame} from "../Frames/Phone";
import {IPhoneStyles} from "../../../stores/phoneStore";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../stores/appStore";
import {NoFrameFrame} from "../Frames/NoFrame";
import {INoFrameStyles} from "../../../stores/noFrameStore";

export interface ICanvasProps {
    showControlsOnly?: boolean;
    imageData?: string;
    canvasBgColor?: string;
    canvasBgImage?: string;
    canvasBgType?: CanvasBackgroundTypes;
    canvasVerticalPadding?: number;
    canvasHorizontalPadding?: number;
    styles: IBrowserStyles | IPhoneStyles | INoFrameStyles;
    isDownloadMode: boolean;
    isAutoRotateActive: boolean;
    showBoxShadow: boolean;
    frameType?: FrameType;
    hideAddressBarOverride?: boolean;
    borderRadius: number;
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
                {props.frameType === FrameType.None && <NoFrameFrame {...props} />}
            </div>
        </div>
    );
});