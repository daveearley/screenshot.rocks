import {store} from '@risingstack/react-easy-state';
import {BackgroundType, BrowserThemes, browserThemes} from "../components/common/Frames/Browser/styles";
import {ImageFormats} from "../types";

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

export interface IBrowserSettings {
    backgroundType: BackgroundType;
    showWindowControls: boolean;
    showAddressBar: boolean;
    showAddressBarUrl: boolean;
    addressBarUrlProtocol: string;
    addressBarUrl: string;
    showNavigationButtons: boolean;
    showSettingsButton: boolean;
    reduceImageQualityOnUpload: boolean;
    showBoxShadow: boolean;
}

export interface IBrowserStore {
    settings: IBrowserSettings,
    customStyles?: IBrowserStyles;
    styles: IBrowserStyles;
    defaultImageFormat: ImageFormats;
    activeTheme: BrowserThemes

    setImageData(imageData: string): void,

    setBrowserTheme(browserTheme: BrowserThemes): void,
}

export let browserStore = store({
    activeTheme: BrowserThemes.Default,
    setBrowserTheme(browserTheme: BrowserThemes) {
        browserStore.activeTheme = browserTheme;
    },

    get styles(): IBrowserStyles {
        if (browserStore.activeTheme === BrowserThemes.Custom) {
            return browserStore.customStyles;
        }

        return (browserThemes as any)[browserStore.activeTheme];
    },

    customStyles: {
        browserChromeBgColor: '#ffffff',
        browserControlsBgColor: '#dddddd',
        browserControlsTextColor: '#b5b5b5',
        closeButtonColor: '#FF8585',
        minimizeButtonColor: '#FFD071',
        maximizeButtonColor: '#74ED94',
        browserBorderRadius: 10,
        controlsBorderRadius: 10,
        controlsHeight: 30,
        chromeHeight: 60,
    },

    settings: {
        backgroundType: BackgroundType.Color,
        reduceImageQualityOnUpload: false,
        showWindowControls: true,
        showAddressBar: true,
        showAddressBarUrl: true,
        addressBarUrlProtocol: 'https://',
        addressBarUrl: 'screenshot.rocks/edit-me',
        showNavigationButtons: true,
        showSettingsButton: true,
        showBoxShadow: true
    }
} as IBrowserStore);