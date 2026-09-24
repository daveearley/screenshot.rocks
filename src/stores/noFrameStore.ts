import {store} from "@risingstack/react-easy-state";
import {observe} from "@nx-js/observer-util";

export interface INoFrameSettings {
    showOutline: boolean;
}

export interface INoFrameStore {
    settings: INoFrameSettings;
}

export const noFrameStore = store({
    settings: {
        showOutline: false,
    },
} as INoFrameStore);

try {
    const saved = JSON.parse(localStorage.getItem('noFrameSettings') || 'null');
    if (saved && typeof saved === 'object') noFrameStore.settings = {...noFrameStore.settings, ...saved};
} catch (_) { /* Ignore invalid saved preferences. */ }

observe(() => {
    try { localStorage.setItem('noFrameSettings', JSON.stringify(noFrameStore.settings)); } catch (_) { /* optional */ }
});
