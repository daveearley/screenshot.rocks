import {css} from "emotion";
import {ICanvasProps} from "../../Canvas";
import {app} from "../../../../stores/appStore";

export enum NoFrameThemes {
    Default,
    Custom,
    Lighter,
}

export const noFrameThemeStyles = {
    [NoFrameThemes.Default]: {
        frameColor: '#000000',
    },
    [NoFrameThemes.Lighter]: {
        frameColor: '#b6b6b6',
    }
}

export const styles = (props: ICanvasProps): string => {
    return css`
       border-radius: ${props.borderRadius}px;
       overflow: hidden;
       box-shadow: ${props.showBoxShadow ? `0 2px ${app.canvasStyles.shadowSize}px -1px rgba(0, 0, 0, .4)` : 'none'};
       transform: ${app.imageData ? app.cssTransformString : ''};
       min-width: ${props.imageData ? '600px' : 'none'};

      img {
        max-width: 100%;
        min-width: 100%;
        border-radius: ${app.adjustMeasurementForDownload(5)}px;
      }
`
};