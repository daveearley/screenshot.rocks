import React from "react";
import {BackgroundType, IBrowserStyles} from "../../../stores/appStore";
import {styles} from "./styles";
import {Browser} from "../Browser";

export interface IBrowserCanvasProps {
    showControlsOnly?: boolean;
    imageData?: string;
    canvasBgColor: string;
    canvasBgImage: string;
    canvasBgType: BackgroundType;
    canvasVerticalPadding?: number;
    canvasHorizontalPadding?: number;
    styles: IBrowserStyles;
    isDownloadMode: boolean;
    showBoxShadow: boolean;
}

export const BrowserCanvas = (props: IBrowserCanvasProps) => {
    return (
        <div className={styles(props)}>
            <div className="canvas" id="canvas">
                <Browser {...props} />
            </div>
        </div>
    );
};