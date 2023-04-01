import React, {useEffect} from "react";
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
    const scaleCanvasOnWindowResize = () => {
        const canvas = document.querySelector<HTMLElement>('.canvas');
        const mainContent = document.querySelector<HTMLElement>('.main-content');
        const maxWidth = mainContent.offsetWidth;
        const maxHeight = window.innerHeight;
        const height = canvas.clientHeight;
        const width = canvas.clientWidth;
        const minScale = .35;
        const maxScale = 1;
        const scale = Math.min(Math.max(Math.min(maxWidth / width, maxHeight / height), minScale), maxScale) * .75;

        canvas.style.transform = 'scale(' + scale + ')';
    };

    useEffect(() => {
        window.addEventListener('resize', scaleCanvasOnWindowResize);
        scaleCanvasOnWindowResize()
        return () => {
            window.removeEventListener('resize', scaleCanvasOnWindowResize);
        }
    });

    return (
        <div className={styles(props) + ' canvas'} id="canvas">
            {(props.frameType === ScreenshotType.Browser || !props.frameType) && <BrowserFrame {...props} />}
            {props.frameType === ScreenshotType.Device && <PhoneFrame {...props} />}
            {props.frameType === ScreenshotType.None && <NoFrameFrame {...props} />}
            {props.frameType === ScreenshotType.Twitter && <TwitterFrame {...props} />}
        </div>
    );
});