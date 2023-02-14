import {css} from "emotion";
import {ICanvasProps} from "../../Canvas";
import {IPhoneStyles} from "../../../../stores/phoneStore";
import {lighten} from "polished";
import {app} from "../../../../stores/appStore";

export enum PhoneThemes {
    Default,
    Custom,
    Lighter,
}

export const phoneThemeStyles = {
    [PhoneThemes.Default]: {
        frameColor: '#000000',
    },
    [PhoneThemes.Lighter]: {
        frameColor: '#b6b6b6',
    }
}

export const styles = (props: ICanvasProps): string => {
    const styleVars = props.styles as IPhoneStyles;
    return css`
       border-radius: ${app.adjustMeasurementForDownload(10)}px;
       max-width: ${props.isDownloadMode ? 'none' : '300px'};
       min-width: 200px;
       position: relative;
       display: flex;
       vertical-align: middle;
       justify-content: center;
       box-shadow: ${props.showBoxShadow ? `0 2px ${app.canvasStyles.shadowSize}px -1px rgba(0, 0, 0, .4)` : 'none'};
       transform: ${app.imageData ? app.cssTransformString : ''};


      .bezel {
        background-color: ${lighten(0.2, styleVars.frameColor)};
        border-radius: ${app.adjustMeasurementForDownload(5)}px;
        position: relative;
        box-shadow: 
          0px 0px 0px ${app.adjustMeasurementForDownload(6)}px ${lighten(0.2, styleVars.frameColor)},
          0px 0px 0px ${app.adjustMeasurementForDownload(8)}px ${lighten(0.15, styleVars.frameColor)},
          0px 0px 0px ${app.adjustMeasurementForDownload(9)}px ${lighten(0.1, styleVars.frameColor)};
          
        .volume-buttons {      
          width: ${app.adjustMeasurementForDownload(3)}px;
          height: ${app.adjustMeasurementForDownload(100)}px;
          display: flex;
          flex-direction: column;
          margin-top: 25%;
          position: absolute;
          left: -${app.adjustMeasurementForDownload(11)}px;
          
          div {
            height: ${app.adjustMeasurementForDownload(48)}px;
            background-color: ${lighten(0.2, styleVars.frameColor)};
            width: ${app.adjustMeasurementForDownload(2)}px;
            border-radius: ${app.adjustMeasurementForDownload(2)}px 0 0 ${app.adjustMeasurementForDownload(2)}px;
          }
          
          div:first-of-type {
            margin-bottom: ${app.adjustMeasurementForDownload(4)}px;
          }
        }
          
        .top {
            top: -${app.adjustMeasurementForDownload(4)}px;
            height: ${app.adjustMeasurementForDownload(10)}px;
            background: transparent;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
        
            .inner-top {
             width: 100%;
             display: flex;
             justify-content: center;
             align-items: center;
             top: ${app.adjustMeasurementForDownload(1)}px;
             position: relative;
             
             .camera {
                width: ${app.adjustMeasurementForDownload(12)}px;
                height: ${app.adjustMeasurementForDownload(12)}px;
                background-color: #101010;
                border-radius: ${app.adjustMeasurementForDownload(12)}px;
                box-shadow: inset 0px -3px 2px 0px rgba(256, 256, 256, 0.2);
                position: relative;
                display: block;
                margin-left: 2%;
                    &:after {
                      content: '';
                      position: absolute;
                      background-color: #2d4d76;
                      width: ${app.adjustMeasurementForDownload(6)}px;
                      height: ${app.adjustMeasurementForDownload(6)}px;
                      top: ${app.adjustMeasurementForDownload(3)}px;;
                      left: ${app.adjustMeasurementForDownload(3)}px;
                      display: block;
                      border-radius: ${app.adjustMeasurementForDownload(4)}px;
                      box-shadow: inset 0px -2px 2px rgba(0, 0, 0, 0.5);
                    }
             }
            .speaker {
                width: 15%;
                height: ${app.adjustMeasurementForDownload(4)}px;
                background-color: #101010;
                border-radius: ${app.adjustMeasurementForDownload(8)}px;
                box-shadow: inset 0px -3px 3px 0px rgba(256, 256, 256, 0.2);
                position: relative;
                display: block;
               }
    
            }
        }
    }
      
      svg {
        height: 100%;
        margin: 0 auto;
      }
    
      img {
        max-width: 100%;
        min-width: 100%;
        border-radius: ${app.adjustMeasurementForDownload(5)}px;
      }
`
};