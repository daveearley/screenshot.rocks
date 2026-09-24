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
        browserChromeBgColor: '#f8f9fb',
        browserControlsBgColor: 'transparent',
        browserControlsTextColor: '#7b808c',
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
        browserControlsTextColor: '#7b808c',
        closeButtonColor: '#201d1d',
        minimizeButtonColor: '#201d1d',
        maximizeButtonColor: '#201d1d',
        browserBorderRadius: 10,
        controlsBorderRadius: 3,
        controlsHeight: 30,
        chromeHeight: 50,
    },
    [BrowserThemes.Dark]: {
        browserChromeBgColor: '#202126',
        browserControlsBgColor: 'transparent',
        browserControlsTextColor: '#7b808c',
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
        browserControlsBgColor: 'transparent',
        browserControlsTextColor: '#7b808c',
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
        browserControlsBgColor: 'transparent',
        browserControlsTextColor: '#7b808c',
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
        browserControlsTextColor: '#7b808c',
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
    const theme = props.styles as IBrowserStyles;
    return css`
        width: 100%; overflow: hidden; box-sizing: border-box;
        border-radius: ${props.borderRadius}px;
        box-shadow: 0 16px ${Number(app.canvasStyles.shadowSize) * 2}px -10px #11182740;
        .mock-browser-toolbar { box-sizing: border-box; height: ${theme.chromeHeight}px; padding: 0 18px; display: flex; align-items: center; gap: 16px; background: ${theme.browserChromeBgColor}; color: ${theme.browserControlsTextColor}; }
        .mock-browser-dots { display: flex; gap: 8px; flex-shrink: 0; }
        .mock-browser-dots i { width: 10px; height: 10px; border-radius: 50%; }
        .mock-browser-navigation { display: flex; gap: 8px; flex-shrink: 0; }
        .mock-browser-address { min-width: 0; flex: 1; display: flex; align-items: center; justify-content: center; border-radius: ${theme.controlsBorderRadius}px; background: ${theme.browserControlsBgColor}; height: ${theme.controlsHeight}px; }
        .mock-browser-address input { width: 100%; min-width: 0; border: 0; padding: 0 8px; background: transparent; color: inherit; box-shadow: none; font: 14px system-ui, sans-serif; text-align: center; }
        .mock-browser-menu { display: flex; flex-shrink: 0; }
        .mock-browser-image { width: 100%; height: auto; display: block; }
    `;
};
