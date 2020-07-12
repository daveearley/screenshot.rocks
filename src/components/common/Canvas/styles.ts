import {css} from "emotion";
import {IBrowserCanvasProps} from "./index";
import {app} from "../../../stores/appStore";
import {FrameType} from "../../../types";

export const styles = (props: IBrowserCanvasProps): string => {
    // todo - this is duplicated
    const determineWidth = (measurement: number): number => {
        return props.isDownloadMode ? measurement * 2 : measurement;
    }

    const getDownloadCanvasWidth = (): number => {
        switch (app.frameType) {
            case FrameType.Browser:
                return 2300;
            case FrameType.Phone:
                return 1200;
            case FrameType.Tablet:
                return 1800;
        }
    }

    return css`
      .canvas {
        width: ${props.isDownloadMode ? `${getDownloadCanvasWidth()}px` : 'auto'};
        background-color: ${props.canvasBgColor};
        padding-top: ${determineWidth(props.canvasVerticalPadding)}px;
        padding-bottom: ${determineWidth(props.canvasVerticalPadding)}px;
        padding-left: ${determineWidth(props.canvasHorizontalPadding)}px;
        padding-right: ${determineWidth(props.canvasHorizontalPadding)}px;
        margin: ${props.isDownloadMode ? '0' : '20px'};
      }
`
};