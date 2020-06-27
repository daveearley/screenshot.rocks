import {store} from '@risingstack/react-easy-state';
import {browserThemes} from "../components/common/Browser/styles";
import {ImageFormats} from "../utils/image";

export const defaultCanvasBgColor = '#a090c1';

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

export interface IBrowserStyles {
    browserChromeBgColor: string;
    browserControlsBgColor: string;
    browserControlsTextColor: string;
    closeButtonColor: string;
    minimizeButtonColor: string;
    maximizeButtonColor: string;
    browserBorderRadius: number;
    controlsBorderRadius: number;
    controlsHeight: number;
    chromeHeight: number;
}

export interface ICanvasStyles {
    bgColor: string;
    bgImage?: string;
    verticalPadding: number;
    horizontalPadding: number;
}

export interface IBrowserSettings {
    backgroundType: BackgroundType;
    showWindowControls: boolean;
    showAddressBar: boolean;
    showNavigationButtons: boolean;
    showSettingsButton: boolean;
    reduceImageQualityOnUpload: boolean;
    showBoxShadow: boolean;
}

export interface IStore {
    imageData?: string,
    browserSettings: IBrowserSettings,
    customBrowserStyles?: IBrowserStyles;
    browserStyles: IBrowserStyles;
    canvasStyles: ICanvasStyles;
    isDownloadMode: boolean;
    defaultImageFormat: ImageFormats;

    setImageData(imageData: string): void,

    browserTheme: BrowserThemes

    setBrowserTheme(browserTheme: BrowserThemes): void,
}

export const app = store({
    isDownloadMode: false,

    // Image Data
    imageData: null,
    setImageData(imageData: string) {
        app.imageData = imageData;
    },

    defaultImageFormat: ImageFormats.PNG,

    // Browser Theme
    browserTheme: BrowserThemes.Default,
    setBrowserTheme(browserTheme: BrowserThemes) {
        app.browserTheme = browserTheme;
    },

    // Get browser style settings - can either be custom or pre-defined theme
    get browserStyles(): IBrowserStyles {
        if (app.browserTheme === BrowserThemes.Custom) {
            return app.customBrowserStyles;
        }

        return (browserThemes as any)[app.browserTheme];
    },

    customBrowserStyles: {
        browserChromeBgColor: '#ffffff',
        browserControlsBgColor: '#000000',
        browserControlsTextColor: '#b5b5b5',
        closeButtonColor: '#FF8585',
        minimizeButtonColor: '#FFD071',
        maximizeButtonColor: '#74ED94',
        browserBorderRadius: 10,
        controlsBorderRadius: 10,
        controlsHeight: 30,
        chromeHeight: 60,
    },

    canvasStyles: {
        bgColor: defaultCanvasBgColor,
        bgImage: null,
        verticalPadding: 20,
        horizontalPadding: 20,
    },

    browserSettings: {
        backgroundType: BackgroundType.Color,
        reduceImageQualityOnUpload: false,
        showWindowControls: true,
        showAddressBar: true,
        showNavigationButtons: true,
        showSettingsButton: true,
        showBoxShadow: true
    }
} as IStore)