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

    // If we are downloading the image we double the widths etc. so the exported image doesn't look stretched
    const determineWidth = (measurement: number): number => {
        return props.isDownloadMode ? measurement * 2 : measurement;
    }

    const transform = `scale(${app.isDownloadMode ? (app.canvasStyles.size/100)*.99 : app.canvasStyles.size/100}) perspective(${determineWidth(800)}px) rotateX(${app.canvasStyles.rotateX}deg) rotateY(${app.canvasStyles.rotateY}deg)`;

    return css`
       border-radius: ${props.borderRadius}px;
       overflow: hidden;
       box-shadow: ${props.showBoxShadow ? `0 2px ${app.canvasStyles.shadowSize}px -1px rgba(0, 0, 0, .4)` : 'none'};
       transform: ${app.imageData ? transform : ''};
       min-width: ${props.imageData ? '600px' : 'none'};

      img {
        max-width: 100%;
        min-width: 100%;
        border-radius: ${determineWidth(5)}px;
      }
`
};