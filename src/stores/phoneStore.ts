import {store} from "@risingstack/react-easy-state";
import {PhoneThemes, phoneThemeStyles} from "../components/common/Frames/Phone/styles";

export interface IPhoneSettings {
    showSpeaker: boolean;
    showCamera: boolean;
    showShadow: boolean;
    showVolumeRocker: boolean;
}

export interface IPhoneStyles {
    frameColor: string;
}

export interface IPhoneStore {
    activeTheme: PhoneThemes;
    settings: IPhoneSettings;
    customStyles: IPhoneStyles;
    styles: IPhoneStyles;
}

export let phoneStore = store({
    activeTheme: PhoneThemes.Default,
    settings: {
        showSpeaker: true,
        showCamera: true,
        showShadow: false,
        showVolumeRocker: true,
    },

    get styles(): IPhoneStyles {
        if (phoneStore.activeTheme === PhoneThemes.Custom) {
            return phoneStore.customStyles;
        }

        return (phoneThemeStyles as any)[phoneStore.activeTheme];
    },

    customStyles: {
        frameColor: '#000000'
    }
} as IPhoneStore);