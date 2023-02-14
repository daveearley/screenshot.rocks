import {css} from "emotion";
import {ICanvasProps} from "./index";
import {app} from "../../../stores/appStore";
import {CanvasBackgroundTypes, FrameType} from "../../../types";
import {darken} from "polished";

export const styles = (props: ICanvasProps): string => {
    // todo - this is duplicated
    const determineWidth = (measurement: number): number => {
        return props.isDownloadMode ? measurement * 2 : measurement;
    }

    const getDownloadCanvasWidth = (): number => {
        switch (app.frameType) {
            case FrameType.Browser:
            case FrameType.None:
                return 2300;
            case FrameType.Phone:
                return 1200;
        }
    }

    return css`
      position: sticky;
      top: 0;

      .rotate-alert {
        padding: 20px;
        text-align: center;
        color: #ffffff;

        a {
          color: #fe79ed;

          &:hover {
            color: ${darken(.1, '#fe79ed')};
          }
        }
      }

      .canvas {
        width: ${props.isDownloadMode ? `${getDownloadCanvasWidth()}px` : 'auto'};
        background: ${props.canvasBgColor};
        background-color: ${props.canvasBgType === CanvasBackgroundTypes.None && !app.isDownloadMode ? '#fff' : ''};
        padding-top: ${determineWidth(props.canvasVerticalPadding)}px;
        padding-bottom: ${determineWidth(props.canvasVerticalPadding)}px;
        padding-left: ${determineWidth(props.canvasHorizontalPadding)}px;
        padding-right: ${determineWidth(props.canvasHorizontalPadding)}px;
        margin: ${props.isDownloadMode ? '0' : '20px'};
        transform: scale(${props.isDownloadMode ? `1` : '.8'}) ${props.isAutoRotateActive ? ' rotate(270deg)' : ''};
        transform-origin: center;
        background-size: ${props.canvasBgType !== CanvasBackgroundTypes.None ? 'cover' : ''};
        overflow: hidden;
      }
    `
};