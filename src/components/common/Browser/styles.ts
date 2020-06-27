import {css} from "emotion";
import {BrowserThemes} from "../../../stores/appStore";
import {IBrowserCanvasProps} from "../BrowserCanvas";

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

export const styles = (props: IBrowserCanvasProps): string => {
    const styleVars = props.styles;

    // If we are downloading the image we double the widths etc. so the exported image doesn't look stretched
    const determineWidthForDownload = (measurement: number): number => {
        return props.isDownloadMode ? measurement * 2 : measurement;
    }

    return css`
       border-radius: ${styleVars.browserBorderRadius}px;
       box-shadow: ${props.showBoxShadow ? '0 2px 4px -1px rgba(0, 0, 0, .4)' : 'none'};
       overflow: hidden;
    
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
        height: ${determineWidthForDownload(styleVars.chromeHeight)}px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        background: ${styleVars.browserChromeBgColor};
        color: ${styleVars.browserControlsTextColor};
      }
    
      .window-controls {
        flex: 0 0 ${determineWidthForDownload(60)}px;
        margin: 0 2%;
        display: flex;
    
        span {
          display: inline-flex;
          width: ${determineWidthForDownload(15)}px;
          height: ${determineWidthForDownload(15)}px;
          border-radius: 50px;
          margin-right: ${determineWidthForDownload(3)}px;
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
        flex: 0 0 ${determineWidthForDownload(70)}px;
        margin-left: 2%;
        height: ${determineWidthForDownload(styleVars.controlsHeight)}px;
    
        span {
          display: inline-block;
          width: ${determineWidthForDownload(30)}px;
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
        height: ${determineWidthForDownload(styleVars.controlsHeight)}px;
        line-height: ${styleVars.controlsHeight}px;
        font-size: ${determineWidthForDownload(1)}em;
        
        .lock {
          height: 100%;
          display: flex;
          margin: 0 5px;
        }
      }
    
      .settings {
        width: ${determineWidthForDownload(styleVars.controlsHeight)}px;
        text-align: center;
        margin-right: 2%;
      }
    
      .white-container {
        display: flex;
        background-color: ${styleVars.browserControlsBgColor};
        align-items: center;
        height: ${determineWidthForDownload(styleVars.controlsHeight)}px;
        border-radius: ${styleVars.controlsBorderRadius}px;
        font-size: ${determineWidthForDownload(1)}em;
      }
`
};