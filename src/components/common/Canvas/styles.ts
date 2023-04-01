import {css} from "emotion";
import {ICanvasProps} from "./index";
import {app} from "../../../stores/appStore";
import {CanvasBackgroundTypes} from "../../../types";
import {clamp} from "../../../utils/misc";
import {CONFIG} from "../../../config";

export const styles = (props: ICanvasProps): string => {
    return css`
      min-width: ${clamp(app.getCanvasDimensions().width, CONFIG.minCanvasWidth, CONFIG.maxCanvasWidth)}px;
      min-height: ${clamp(app.getCanvasDimensions().height, CONFIG.minCanvasHeight, CONFIG.maxCanvasHeight)}px;
      max-width: ${clamp(app.getCanvasDimensions().width, CONFIG.minCanvasWidth, CONFIG.maxCanvasWidth)}px;
      max-height: ${clamp(app.getCanvasDimensions().height, CONFIG.minCanvasHeight, CONFIG.maxCanvasHeight)}px;
      background: ${props.canvasBgColor};
      background-color: ${props.canvasBgType === CanvasBackgroundTypes.None && !app.isDownloadMode ? '#fff' : ''};
      transform: scale(${props.isDownloadMode ? `1` : '.4'}) ${props.isDownloadMode ? ' !important' : ''};
      background-size: ${props.canvasBgType !== CanvasBackgroundTypes.None ? 'cover' : ''};
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    `
};