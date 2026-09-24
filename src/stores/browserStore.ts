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
        browserStore.settings.activeTheme = Number(browserTheme);
    },

    get styles(): IBrowserStyles {
        if (browserStore.settings.activeTheme === BrowserThemes.Custom) {
            return browserStore.customStyles;
        }

        return (browserThemes as any)[browserStore.settings.activeTheme] || browserThemes[BrowserThemes.Default];
    },

    customStyles: {
        browserChromeBgColor: '#f8f9fb',
        browserControlsBgColor: '#eceef2',
        browserControlsTextColor: '#6b6f78',
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
        showNavigationButtons: false,
        showSettingsButton: false,
    }
} as IBrowserStore);

try {
    const saved = JSON.parse(localStorage.getItem('browserStoreSettings') || 'null');
    if (saved) {
        browserStore.settings = {...browserStore.settings, ...saved.settings};
        browserStore.settings.activeTheme = Number(browserStore.settings.activeTheme);
        browserStore.customStyles = {...browserStore.customStyles, ...saved.styles};
    }
} catch (_) { /* Ignore invalid legacy preferences. */ }

observe(() => {
    // `styles` holds the custom colors, which is how they're loaded above.
    const serialized = JSON.stringify({settings: browserStore.settings, styles: browserStore.customStyles});
    try { localStorage.setItem('browserStoreSettings', serialized); } catch (_) { /* full or unavailable */ }
});