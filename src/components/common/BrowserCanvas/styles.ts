import {css} from "emotion";
import {IBrowserCanvasProps} from "./index";

export const styles = (props: IBrowserCanvasProps): string => {
    // todo - this is duplicated
    const determineWidth = (measurement: number): number => {
        return props.isDownloadMode ? measurement * 2 : measurement;
    }
    return css`
      .canvas {
        width: ${props.isDownloadMode ? '2300px' : 'auto'};
        background-color: ${props.canvasBgColor};
        padding-top: ${determineWidth(props.canvasVerticalPadding)}px;
        padding-bottom: ${determineWidth(props.canvasVerticalPadding)}px;
        padding-left: ${determineWidth(props.canvasHorizontalPadding)}px;
        padding-right: ${determineWidth(props.canvasHorizontalPadding)}px;
        margin: ${props.isDownloadMode ? '0' : '20px'};
      }
`
};