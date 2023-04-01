import {store} from '@risingstack/react-easy-state';
import {BackgroundType, BrowserThemes, browserThemes} from "../components/common/Frames/Browser/styles";
import {ImageFormats} from "../types";
import {observe} from "@nx-js/observer-util";

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
    activeTheme: BrowserThemes;
    backgroundType: BackgroundType;
    showWindowControls: boolean;
    showAddressBar: boolean;
    showAddressBarUrl: boolean;
    addressBarUrlProtocol: string;
    addressBarUrl: string;
    showNavigationButtons: boolean;
    showSettingsButton: boolean;
    reduceImageQualityOnUpload: boolean;
}

export interface IBrowserStore {
    settings: IBrowserSettings,
    customStyles?: IBrowserStyles;
    styles: IBrowserStyles;
    defaultImageFormat: ImageFormats;

    setImageData(imageData: string): void,

    setBrowserTheme(browserTheme: BrowserThemes): void,
}

export let browserStore = store({
    setBrowserTheme(browserTheme: BrowserThemes) {
        browserStore.settings.activeTheme = browserTheme;
    },

    get styles(): IBrowserStyles {
        if (browserStore.settings.activeTheme === BrowserThemes.Custom) {
            return browserStore.customStyles;
        }

        return (browserThemes as any)[browserStore.settings.activeTheme];
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
        activeTheme: BrowserThemes.Default,
        backgroundType: BackgroundType.Color,
        reduceImageQualityOnUpload: false,
        showWindowControls: true,
        showAddressBar: true,
        showAddressBarUrl: true,
        addressBarUrlProtocol: 'https://',
        addressBarUrl: 'edit-me.com',
        showNavigationButtons: true,
        showSettingsButton: true,
    }
} as IBrowserStore);

if (localStorage.getItem('browserStoreSettings')) {
    const localStore = JSON.parse(localStorage.getItem('browserStoreSettings'));
    browserStore.settings = localStore.settings;
    browserStore.customStyles = localStore.styles;
}

observe(() => {
    localStorage.setItem('browserStoreSettings', JSON.stringify({
        settings: browserStore.settings,
        styles: browserStore.styles,
    }))
});