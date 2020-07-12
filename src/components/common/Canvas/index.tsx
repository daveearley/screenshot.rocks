import React from "react";
import {styles} from "./styles";
import {BrowserFrame} from "../Frames/BrowserFrame";
import {BackgroundType} from "../Frames/BrowserFrame/styles";
import {IBrowserStyles} from "../../../stores/browserStore";
import {FrameType} from "../../../types";
import {PhoneFrame} from "../Frames/PhoneFrame";

export interface IBrowserCanvasProps {
    showControlsOnly?: boolean;
    imageData?: string;
    canvasBgColor?: string;
    canvasBgImage?: string;
    canvasBgType?: BackgroundType;
    canvasVerticalPadding?: number;
    canvasHorizontalPadding?: number;
    styles: IBrowserStyles;
    isDownloadMode: boolean;
    showBoxShadow: boolean;
    urlTextOverride?: string;
    frameType?: FrameType;
}

export const BrowserCanvas = (props: IBrowserCanvasProps) => {
    return (
        <div className={styles(props)}>
            <div className="canvas" id="canvas">
                {(props.frameType === FrameType.Browser || !props.frameType) && <BrowserFrame {...props} />}
                {props.frameType === FrameType.Phone && <PhoneFrame {...props} />}
            </div>
        </div>
    );
};