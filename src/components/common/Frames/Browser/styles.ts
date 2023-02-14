import {css} from "emotion";
import {ICanvasProps} from "../../Canvas";
import {IBrowserStyles} from "../../../../stores/browserStore";
import {app} from "../../../../stores/appStore";

export enum BrowserThemes {
    Default,
    Dark,
    Square,
    Darker,
    Rounder,
    Weird,
    Custom,
}

export enum BackgroundType {
    Image,
    Color,
}

export const browserThemes = {
    [BrowserThemes.Default]: {
        browserChromeBgColor: '#e6ecefcf',
        browserControlsBgColor: '#ffffffa8',
        browserControlsTextColor: '#b5b5b5',
        closeButtonColor: '#FF8585',
        minimizeButtonColor: '#FFD071',
        maximizeButtonColor: '#74ED94',
        browserBorderRadius: 10,
        controlsBorderRadius: 3,
        controlsHeight: 30,
        chromeHeight: 50,
    },
    [BrowserThemes.Darker]: {
        browserChromeBgColor: '#000000',
        browserControlsBgColor: '#1f1c1c',
        browserControlsTextColor: '#b5b5b5',
        closeButtonColor: '#201d1d',
        minimizeButtonColor: '#201d1d',
        maximizeButtonColor: '#201d1d',
        browserBorderRadius: 10,
        controlsBorderRadius: 3,
        controlsHeight: 30,
        chromeHeight: 50,
    },
    [BrowserThemes.Dark]: {
        browserChromeBgColor: '#2d373b',
        browserControlsBgColor: '#ffffff',
        browserControlsTextColor: '#b5b5b5',
        closeButtonColor: '#FF8585',
        minimizeButtonColor: '#FFD071',
        maximizeButtonColor: '#74ED94',
        browserBorderRadius: 10,
        controlsBorderRadius: 3,
        controlsHeight: 30,
        chromeHeight: 50,
    },
    [BrowserThemes.Square]: {
        browserChromeBgColor: '#E6ECEF',
        browserControlsBgColor: '#ffffff',
        browserControlsTextColor: '#b5b5b5',
        closeButtonColor: '#FF8585',
        minimizeButtonColor: '#FFD071',
        maximizeButtonColor: '#74ED94',
        browserBorderRadius: 0,
        controlsBorderRadius: 0,
        controlsHeight: 30,
        chromeHeight: 50,
    },
    [BrowserThemes.Rounder]: {
        browserChromeBgColor: '#ffffff',
        browserControlsBgColor: '#ffffff',
        browserControlsTextColor: '#b5b5b5',
        closeButtonColor: '#FF8585',
        minimizeButtonColor: '#FFD071',
        maximizeButtonColor: '#74ED94',
        browserBorderRadius: 10,
        controlsBorderRadius: 10,
        controlsHeight: 30,
        chromeHeight: 60,
    },
    [BrowserThemes.Weird]: {
        browserChromeBgColor: '#550E40',
        browserControlsBgColor: '#822063',
        browserControlsTextColor: '#b5b5b5',
        closeButtonColor: '#822163',
        minimizeButtonColor: '#822163',
        maximizeButtonColor: '#822163',
        browserBorderRadius: 1,
        controlsBorderRadius: 4,
        controlsHeight: 30,
        chromeHeight: 60,
    },
}

export const styles = (props: ICanvasProps): string => {
    const styleVars = props.styles as IBrowserStyles;

    return css`
       border-radius: ${props.borderRadius}px;
       box-shadow: ${props.showBoxShadow ? `0 2px ${app.canvasStyles.shadowSize}px -1px rgba(0, 0, 0, .4)` : 'none'};
       overflow: hidden;
       min-width: ${props.imageData ? '400px' : 'none'};
       transform: ${app.imageData ? app.cssTransformString : ''};
    
      .hide {
        display: none !important;
      }
      
      .url-bar.hide {
        display: flex !important;
        opacity: 0;     
      }
      
      svg {
        height: 100%;
        margin: 0 auto;
      }
    
      img {
        max-width: 100%;
        min-width: 100%;
      }
    
      .browser-controls {
        height: ${app.adjustMeasurementForDownload(styleVars.chromeHeight)}px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        background: ${styleVars.browserChromeBgColor};
        color: ${styleVars.browserControlsTextColor};
      }
    
      .window-controls {
        flex: 0 0 ${app.adjustMeasurementForDownload(60)}px;
        margin: 0 2%;
        display: flex;
    
        span {
          display: inline-flex;
          width: ${app.adjustMeasurementForDownload(15)}px;
          height: ${app.adjustMeasurementForDownload(15)}px;
          border-radius: 50px;
          margin-right: ${app.adjustMeasurementForDownload(9)}px;
          &.close {
            background: ${styleVars.closeButtonColor};
            opacity: 1;
          }
    
          &.minimise {
            background: ${styleVars.minimizeButtonColor};
          }
    
          &.maximise {
            background: ${styleVars.maximizeButtonColor};
          }
        }
      }
    
      .page-controls {
        flex: 0 0 ${app.adjustMeasurementForDownload(70)}px;
        margin-left: 2%;
        height: ${app.adjustMeasurementForDownload(styleVars.controlsHeight)}px;
    
        span {
          display: inline-block;
          width: ${app.adjustMeasurementForDownload(30)}px;
          text-align: center;
          
          &.back {
            margin-right: 3px;
          }
        }
      }
    
      .url-bar {
        flex-grow: 1;
        margin-left: 2%;
        margin-right: 2%;
        font-family: monospace;
        overflow: hidden;
        height: ${app.adjustMeasurementForDownload(styleVars.controlsHeight)}px;
        line-height: ${app.adjustMeasurementForDownload(styleVars.controlsHeight)}px;
        font-size: ${app.adjustMeasurementForDownload(1)}em;
        
        .urlInput {
          border: none;
          outline: none;
          color: ${styleVars.browserControlsTextColor};
          background: transparent;
          display: inline;
          box-shadow: none;
          min-width: 90%;
        }
        
        .lock {
          height: 100%;
          display: flex;
          margin: 0 ${app.adjustMeasurementForDownload(5)}px;
        }
        
        .url-text {
          overflow: hidden;
          white-space: nowrap;
          min-width: 90%;
        }
      }
    
      .settings {
        display: flex;
        width: ${app.adjustMeasurementForDownload(styleVars.controlsHeight)}px;
        text-align: center;
      }
    
      .browser-container {
        display: flex;
        background-color: ${styleVars.browserControlsBgColor};
        align-items: center;
        height: ${app.adjustMeasurementForDownload(styleVars.controlsHeight)}px;
        border-radius: ${styleVars.controlsBorderRadius}px;
        font-size: ${app.adjustMeasurementForDownload(1)}em;
        
        :last-of-type {
          margin-right: 2%;
        }
      }
      
      .content-wrap {
        background-color: #ffffff;
      }
`
};
