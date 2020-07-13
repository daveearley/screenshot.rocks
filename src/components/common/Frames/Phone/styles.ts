import {css} from "emotion";
import {ICanvasProps} from "../../Canvas";
import {IPhoneStyles} from "../../../../stores/phoneStore";
import {lighten} from "polished";

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

    // If we are downloading the image we double the widths etc. so the exported image doesn't look stretched
    const determineWidth = (measurement: number): number => {
        return props.isDownloadMode ? measurement * 3 : measurement;
    }

    return css`
       border-radius: ${determineWidth(10)}px;
       max-width: ${props.isDownloadMode ? 'none' : '300px'};
       min-width: 200px;
       position: relative;
       display: flex;
       vertical-align: middle;
       justify-content: center;
       // box-shadow: ${props.showBoxShadow ? '0px 6px 14px 2px #000000c2' : 'none'};
      
       .bezel {
        background-color: ${lighten(0.2, styleVars.frameColor)};
        border-radius: ${determineWidth(5)}px;
        position: relative;
        box-shadow: 
          0px 0px 0px ${determineWidth(6)}px ${lighten(0.2, styleVars.frameColor)},
          0px 0px 0px ${determineWidth(8)}px ${lighten(0.15, styleVars.frameColor)},
          0px 0px 0px ${determineWidth(9)}px ${lighten(0.1, styleVars.frameColor)};
          
        .volume-buttons {      
          width: ${determineWidth(3)}px;
          height: ${determineWidth(100)}px;
          display: flex;
          flex-direction: column;
          margin-top: 25%;
          position: absolute;
          left: -${determineWidth(11)}px;
          
          div {
            height: ${determineWidth(48)}px;
            background-color: ${lighten(0.2, styleVars.frameColor)};
            width: ${determineWidth(2)}px;
            border-radius: ${determineWidth(2)}px 0 0 ${determineWidth(2)}px;
          }
          
          div:first-of-type {
            margin-bottom: ${determineWidth(4)}px;
          }
        }
          
        .top {
            top: -${determineWidth(4)}px;
            height: ${determineWidth(10)}px;
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
             top: ${determineWidth(1)}px;
             position: relative;
             
             .camera {
                width: ${determineWidth(12)}px;
                height: ${determineWidth(12)}px;
                background-color: #101010;
                border-radius: ${determineWidth(12)}px;
                box-shadow: inset 0px -3px 2px 0px rgba(256, 256, 256, 0.2);
                position: relative;
                display: block;
                margin-left: 2%;
                    &:after {
                      content: '';
                      position: absolute;
                      background-color: #2d4d76;
                      width: ${determineWidth(6)}px;
                      height: ${determineWidth(6)}px;
                      top: ${determineWidth(3)}px;;
                      left: ${determineWidth(3)}px;
                      display: block;
                      border-radius: ${determineWidth(4)}px;
                      box-shadow: inset 0px -2px 2px rgba(0, 0, 0, 0.5);
                    }
             }
            .speaker {
                width: 15%;
                height: ${determineWidth(4)}px;
                background-color: #101010;
                border-radius: ${determineWidth(8)}px;
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
        border-radius: ${determineWidth(5)}px;
      }
`
};