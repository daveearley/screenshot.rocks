import {css} from "emotion";
import {ICanvasProps} from "../../Canvas";
import {IPhoneStyles} from "../../../../stores/phoneStore";
import {lighten} from "polished";
import {INoFrameStyles} from "../../../../stores/noFrameStore";
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
    const styleVars = props.styles as INoFrameStyles;

    // If we are downloading the image we double the widths etc. so the exported image doesn't look stretched
    const determineWidth = (measurement: number): number => {
        return props.isDownloadMode ? measurement * 3 : measurement;
    }

    return css`
       border-radius: ${determineWidth(styleVars.borderRadius)}px;
       overflow: hidden;
       box-shadow: ${props.showBoxShadow ? `0 2px ${app.canvasStyles.shadowSize}px -1px rgba(0, 0, 0, .4)` : 'none'};
    
      img {
        max-width: 100%;
        min-width: 100%;
        border-radius: ${determineWidth(5)}px;
      }
`
};