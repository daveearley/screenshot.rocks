import {css} from "emotion";
import {ICanvasProps} from "../../Canvas";

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
        browserChromeBgColor: '#E6ECEF',
        browserControlsBgColor: '#fff',
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
        browserChromeBgColor: '#000',
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
        browserControlsBgColor: '#fff',
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
        browserControlsBgColor: '#fff',
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
        browserChromeBgColor: '#fff',
        browserControlsBgColor: '#fff',
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
        browserBorderRadius: 0,
        controlsBorderRadius: 4,
        controlsHeight: 30,
        chromeHeight: 60,
    },
}

export const styles = (props: ICanvasProps): string => {
    const styleVars = props.styles;

    // If we are downloading the image we double the widths etc. so the exported image doesn't look stretched
    const determineWidth = (measurement: number): number => {
        return props.isDownloadMode ? measurement * 2 : measurement;
    }

    return css`
       border-radius: ${styleVars.browserBorderRadius}px;
       box-shadow: ${props.showBoxShadow ? '0 2px 4px -1px rgba(0, 0, 0, .4)' : 'none'};
       overflow: hidden;
       background-color: #ffffff;
       min-width: ${props.imageData ? '400px' : 'none'};
    
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
        height: ${determineWidth(styleVars.chromeHeight)}px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        background: ${styleVars.browserChromeBgColor};
        color: ${styleVars.browserControlsTextColor};
      }
    
      .window-controls {
        flex: 0 0 ${determineWidth(60)}px;
        margin: 0 2%;
        display: flex;
    
        span {
          display: inline-flex;
          width: ${determineWidth(15)}px;
          height: ${determineWidth(15)}px;
          border-radius: 50px;
          margin-right: ${determineWidth(3)}px;
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
        flex: 0 0 ${determineWidth(70)}px;
        margin-left: 2%;
        height: ${determineWidth(styleVars.controlsHeight)}px;
    
        span {
          display: inline-block;
          width: ${determineWidth(30)}px;
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
        color: darken(${styleVars.browserControlsBgColor}, 20%);
        overflow: hidden;
        height: ${determineWidth(styleVars.controlsHeight)}px;
        line-height: ${determineWidth(styleVars.controlsHeight)}px;
        font-size: ${determineWidth(1)}em;
        
        .lock {
          height: 100%;
          display: flex;
          margin: 0 ${determineWidth(5)}px;
        }
        
        .url-text {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    
      .settings {
        display: flex;
        width: ${determineWidth(styleVars.controlsHeight)}px;
        text-align: center;
      }
    
      .browser-container {
        display: flex;
        background-color: ${styleVars.browserControlsBgColor};
        align-items: center;
        height: ${determineWidth(styleVars.controlsHeight)}px;
        border-radius: ${styleVars.controlsBorderRadius}px;
        font-size: ${determineWidth(1)}em;
        
        :last-of-type {
          margin-right: 2%;
        }
      }
`
};