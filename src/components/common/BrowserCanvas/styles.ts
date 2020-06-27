import {css} from "emotion";
import {IBrowserCanvasProps} from "./index";

export const styles = (props: IBrowserCanvasProps): string => {
    return css`
      .canvas {
        width: ${props.isDownloadMode ? '2300px' : 'auto'};
        background-color: ${props.canvasBgColor};
        padding-top: ${props.canvasVerticalPadding}px;
        padding-bottom: ${props.canvasVerticalPadding}px;
        padding-left: ${props.canvasHorizontalPadding}px;
        padding-right: ${props.canvasHorizontalPadding}px;
        margin: ${props.isDownloadMode ? '0' : '20px'};
      }
`
};