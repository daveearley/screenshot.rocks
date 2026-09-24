import {css} from "emotion";
import {ICanvasProps} from "../../Canvas";
import {app} from "../../../../stores/appStore";
import {noFrameStore} from "../../../../stores/noFrameStore";

export const styles = (props: ICanvasProps): string => {
    return css`
       border-radius: ${props.borderRadius}px;
       overflow: hidden;
       box-shadow: ${noFrameStore.settings.showOutline ? '0 0 0 1px rgba(128, 128, 128, .35), ' : ''}0 2px ${app.canvasStyles.shadowSize}px -1px rgba(0, 0, 0, .4);
       transform: ${app.imageData ? app.cssTransformString : ''};
       min-width: ${props.imageData ? '600px' : 'none'};
       translate: ${app.canvasStyles.horizontalPosition}% ${app.canvasStyles.verticalPosition}%;

      img {
        max-width: 100%;
        min-width: 100%;
        border-radius: ${app.adjustMeasurementForDownload(5)}px;
      }
`
};