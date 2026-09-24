import {FrameInteraction} from "../FrameInteraction";
import React from "react";
import {styles} from "./styles";
import {BrowserFrame} from "../Frames/Browser";
import {IBrowserStyles} from "../../../stores/browserStore";
import {CanvasBackgroundTypes, ScreenshotType} from "../../../types";
import {PhoneFrame} from "../Frames/Phone";
import {view} from "@risingstack/react-easy-state";
import {NoFrameFrame} from "../Frames/NoFrame";
import {TwitterFrame} from "../Frames/Twitter";

export interface ICanvasProps {
    showControlsOnly?: boolean;
    previewScale?: number;
    children?: React.ReactNode;
    imageData?: string;
    canvasBgColor?: string;
    canvasBgImage?: string;
    canvasBgType?: CanvasBackgroundTypes;
    canvasVerticalPadding?: number;
    canvasHorizontalPadding?: number;
    styles: IBrowserStyles;
    isDownloadMode: boolean;
    isAutoRotateActive: boolean;
    frameType?: ScreenshotType;
    hideAddressBarOverride?: boolean;
    borderRadius: number;
}

export const Canvas = view((props: ICanvasProps) => {
    return (
        <div className={styles(props) + ' canvas'} id="canvas" style={{position: 'absolute', top: 0, left: 0, transformOrigin: 'top left', transform: `scale(${props.previewScale || 1})`}}>
            <FrameInteraction previewScale={props.previewScale}>
            {(props.frameType === ScreenshotType.Browser || !props.frameType) && <BrowserFrame {...props} />}
            {props.frameType === ScreenshotType.Device && <PhoneFrame {...props} />}
            {props.frameType === ScreenshotType.None && <NoFrameFrame {...props} />}
            {props.frameType === ScreenshotType.Twitter && <TwitterFrame {...props} />}
            </FrameInteraction>
            {props.children}
        </div>
    );
});