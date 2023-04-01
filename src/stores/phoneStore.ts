import {store} from "@risingstack/react-easy-state";
import {observe} from "@nx-js/observer-util";
import {DeviceColour} from "../values/device-colour";

export enum PhoneThemes {
    IPhone14Pro,
    IPhone14,
    Pixel6Pro,
    AppleWatchUltra,
    AppleWatch8,
    IPadProp,
    MacBookPro,
    IMac,
    SurfaceBook,
}

export const deviceNamesMap = {
    [PhoneThemes.IPhone14Pro]: "iPhone 14 Pro",
    [PhoneThemes.IPhone14]: "iPhone 14",
    [PhoneThemes.Pixel6Pro]: "Google Pixel 6 Pro",
    [PhoneThemes.AppleWatch8]: "Apple Watch 8",
    [PhoneThemes.AppleWatchUltra]: "Apple Watch Ultra",
    [PhoneThemes.IPadProp]: "iPad Pro",
    [PhoneThemes.MacBookPro]: "MacBook Pro",
    [PhoneThemes.IMac]: "iMac",
    [PhoneThemes.SurfaceBook]: "Surface Book",
};

export const deviceIdMap = {
    [PhoneThemes.IPhone14Pro]: "iphone-14-pro",
    [PhoneThemes.IPhone14]: "iphone-14",
    [PhoneThemes.Pixel6Pro]: "google-pixel-6-pro",
    [PhoneThemes.AppleWatch8]: "apple-watch-s8",
    [PhoneThemes.AppleWatchUltra]: "apple-watch-ultra",
    [PhoneThemes.IPadProp]: "ipad-pro",
    [PhoneThemes.MacBookPro]: "macbook-pro",
    [PhoneThemes.IMac]: "imac",
    [PhoneThemes.SurfaceBook]: "surface-book",
};

export const deviceColourVariantMap = new Map<PhoneThemes, DeviceColour[]>([
        [PhoneThemes.IPhone14Pro, [
            new DeviceColour("purple", "#342C3F"),
            new DeviceColour("silver", "#e2e3e4"),
            new DeviceColour("black", "#76726F"),
            new DeviceColour("gold", "#F6EEDB"),
        ]],
        [PhoneThemes.IPhone14, [
            new DeviceColour("purple", "#342C3F"),
            new DeviceColour("silver", "#e2e3e4"),
            new DeviceColour("black", "#76726F"),
            new DeviceColour("gold", "#F6EEDB"),
        ]],
    ]
);

export const deviceAspectRatioMap = {
    [PhoneThemes.IPhone14Pro]: 9 / 19.5,
    [PhoneThemes.IPhone14]: 9 / 19.5,
    [PhoneThemes.Pixel6Pro]: 9 / 19.5,
    [PhoneThemes.AppleWatch8]: 4 / 5,
    [PhoneThemes.AppleWatchUltra]: 4 / 5,
    [PhoneThemes.IPadProp]: 7 / 10,
    [PhoneThemes.MacBookPro]: 16 / 10,
    [PhoneThemes.IMac]: 16 / 9,
    [PhoneThemes.SurfaceBook]: 3 / 2,
};

export const defaultColourVariantMap = {
    [PhoneThemes.IPhone14Pro]: 'purple',
};

export interface IPhoneStore {
    activeTheme: PhoneThemes;
    colourVariant: Map<PhoneThemes, string>;

    setColourVariant(colourVariant: string): void;

    getColourVariant(): string;

}

export let phoneStore = store({
    colourVariant: new Map<PhoneThemes, string>([
        [PhoneThemes.IPhone14Pro, 'purple'],
    ]),
    activeTheme: PhoneThemes.IPhone14Pro,
    setColourVariant(colourVariant: string): void {
        phoneStore.colourVariant.set(phoneStore.activeTheme, colourVariant);
    },
    getColourVariant(): string {
         return phoneStore.colourVariant.get(phoneStore.activeTheme);
    }
} as IPhoneStore);

if (localStorage.getItem('phoneStore')) {
    const store = JSON.parse(localStorage.getItem('phoneStore'));
    if (store.settings) {
        // if the old setting structure is stored in localstorage then wipe it or else the app will crash
        localStorage.clear();
    } else {
        phoneStore.activeTheme = store.activeTheme;
    }
}

observe(() => {
    localStorage.setItem('phoneStore', JSON.stringify(phoneStore))
});