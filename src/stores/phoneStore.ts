import {store} from "@risingstack/react-easy-state";
import {PhoneThemes, phoneThemeStyles} from "../components/common/Frames/Phone/styles";
import {observe} from "@nx-js/observer-util";

export interface IPhoneSettings {
    activeTheme: PhoneThemes;
    showSpeaker: boolean;
    showCamera: boolean;
    showShadow: boolean;
    showVolumeRocker: boolean;
}

export interface IPhoneStyles {
    frameColor: string;
}

export interface IPhoneStore {
    settings: IPhoneSettings;
    customStyles: IPhoneStyles;
    styles: IPhoneStyles;
}

export let phoneStore = store({
    settings: {
        activeTheme: PhoneThemes.Default,
        showSpeaker: true,
        showCamera: true,
        showShadow: true,
        showVolumeRocker: true,
    },

    get styles(): IPhoneStyles {
        if (phoneStore.settings.activeTheme === PhoneThemes.Custom) {
            return phoneStore.customStyles;
        }

        return (phoneThemeStyles as any)[phoneStore.settings.activeTheme];
    },

    customStyles: {
        frameColor: '#000000'
    }
} as IPhoneStore);

if (localStorage.getItem('phoneStore')) {
    const localStore = JSON.parse(localStorage.getItem('phoneStore'));
    phoneStore.settings = localStore.settings;
    phoneStore.customStyles = localStore.styles;
}

observe(() => {
    localStorage.setItem('phoneStore', JSON.stringify({
        settings: phoneStore.settings,
        styles: phoneStore.styles,
    }))
});