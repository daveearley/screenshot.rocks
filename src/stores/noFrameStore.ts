import {store} from "@risingstack/react-easy-state";
import {observe} from "@nx-js/observer-util";
import {NoFrameThemes, noFrameThemeStyles} from "../components/common/Frames/NoFrame/styles";

export interface INoFrameSettings {
    activeTheme: NoFrameThemes;
    showShadow: boolean;
    roundedCorners: boolean;
}

export interface INoFrameStyles {
    frameColor: string;
    borderRadius: number;
}

export interface INoFrameStore {
    settings: INoFrameSettings;
    customStyles: INoFrameStyles;
    styles: INoFrameStyles;
}

export let noFrameStore = store({
    settings: {
        activeTheme: NoFrameThemes.Default,
        showShadow: true,
        roundedCorners: true,
    },

    get styles(): INoFrameStyles {
        if (noFrameStore.settings.activeTheme === NoFrameThemes.Custom) {
            return noFrameStore.customStyles;
        }

        return (noFrameThemeStyles as any)[noFrameStore.settings.activeTheme];
    },

    customStyles: {
        frameColor: '#000000',
        borderRadius: 10,
    }
} as INoFrameStore);

if (localStorage.getItem('noFrameStore')) {
    const localStore = JSON.parse(localStorage.getItem('noFrameStore'));
    noFrameStore.settings = localStore.settings;
    noFrameStore.customStyles = localStore.styles;
}

observe(() => {
    localStorage.setItem('noFrameStore', JSON.stringify({
        settings: noFrameStore.settings,
        styles: noFrameStore.styles,
    }))
});