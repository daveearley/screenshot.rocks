import {browserStore} from './browserStore';
import {phoneStore, PhoneThemes} from './phoneStore';
import {BrowserThemes} from '../components/common/Frames/Browser/styles';
import { store } from '@risingstack/react-easy-state';
import { IPreset, PresetCategory } from '../types/presets';
import { builtInPresets } from '../data/presets';
import { app } from './appStore';
import { historyStore } from './historyStore';

const CUSTOM_PRESETS_KEY = 'customPresets';

function loadCustomPresets(): IPreset[] {
    try {
        const stored = localStorage.getItem(CUSTOM_PRESETS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveCustomPresets(presets: IPreset[]) {
    try { localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(presets)); } catch (_) { /* full or unavailable */ }
}

function generatePresetId(): string {
    return `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface IPresetsStore {
    customPresets: IPreset[];
    selectedPresetId: string | null;
    activeCategory: PresetCategory | 'all';

    getAllPresets(): IPreset[];
    getPresetsByCategory(category: PresetCategory | 'all'): IPreset[];
    applyPreset(presetId: string): void;
    saveCurrentAsPreset(name: string): IPreset;
    deletePreset(presetId: string): void;
    setActiveCategory(category: PresetCategory | 'all'): void;
}

export const presetsStore = store({
    customPresets: loadCustomPresets(),
    selectedPresetId: null as string | null,
    activeCategory: 'all' as PresetCategory | 'all',

    getAllPresets(): IPreset[] {
        return [...builtInPresets, ...presetsStore.customPresets];
    },

    getPresetsByCategory(category: PresetCategory | 'all'): IPreset[] {
        const allPresets = presetsStore.getAllPresets();
        if (category === 'all') {
            return allPresets;
        }
        return allPresets.filter(p => p.category === category);
    },

    applyPreset(presetId: string) {
        const preset = presetsStore.getAllPresets().find(p => p.id === presetId);
        if (!preset) return;

        // Save current state for undo
        historyStore.saveState();

        const { canvasSettings, backgroundSettings, frameSettings } = preset;

        // IMPORTANT: Apply frame type FIRST, before other settings that depend on it
        // setCanvasSize and setCanvasWidth/Height use app.frameType internally
        if (frameSettings?.frameType) {
            app.frameType = frameSettings.frameType;
        }

        if (frameSettings && frameSettings.browserTheme !== undefined) {
            browserStore.setBrowserTheme(Number(frameSettings.browserTheme) as BrowserThemes);
            browserStore.settings.showNavigationButtons = false;
            browserStore.settings.showSettingsButton = false;
        }
        if (frameSettings && frameSettings.phoneTheme !== undefined) phoneStore.activeTheme = Number(frameSettings.phoneTheme) as PhoneThemes;

        // Now apply canvas settings (after frame type is set)
        app.setCanvasWidth(canvasSettings.width);
        app.setCanvasHeight(canvasSettings.height);
        app.setCanvasSize(canvasSettings.size);
        app.canvasStyles.borderRadius = canvasSettings.borderRadius;
        app.canvasStyles.shadowSize = canvasSettings.shadowSize;
        app.canvasStyles.rotateX = canvasSettings.rotateX;
        app.canvasStyles.rotateY = canvasSettings.rotateY;

        app.canvasStyles.horizontalPosition = canvasSettings.horizontalPosition || 0;
        app.canvasStyles.verticalPosition = canvasSettings.verticalPosition || 0;

        // Apply background settings
        app.canvasStyles.backgroundType = backgroundSettings.backgroundType;

        if (backgroundSettings.bgColor) {
            app.canvasStyles.bgColor = backgroundSettings.bgColor;
        }
        if (backgroundSettings.gradientColorOne) {
            app.canvasStyles.gradientColorOne = backgroundSettings.gradientColorOne;
        }
        if (backgroundSettings.gradientColorTwo) {
            app.canvasStyles.gradientColorTwo = backgroundSettings.gradientColorTwo;
        }
        if (backgroundSettings.gradientAngle !== undefined) {
            app.canvasStyles.gradientAngle = backgroundSettings.gradientAngle;
        }
        if (backgroundSettings.bgImage) {
            app.canvasStyles.bgImage = backgroundSettings.bgImage;
        }

        presetsStore.selectedPresetId = presetId;
    },

    saveCurrentAsPreset(name: string): IPreset {
        const newPreset: IPreset = {
            id: generatePresetId(),
            name,
            category: PresetCategory.Custom,
            isBuiltIn: false,
            canvasSettings: {
                width: app.getCanvasDimensions().width,
                height: app.getCanvasDimensions().height,
                size: app.getCanvasSize(),
                borderRadius: app.canvasStyles.borderRadius,
                shadowSize: app.canvasStyles.shadowSize,
                rotateX: app.canvasStyles.rotateX,
                rotateY: app.canvasStyles.rotateY,
                horizontalPosition: app.canvasStyles.horizontalPosition,
                verticalPosition: app.canvasStyles.verticalPosition,
            },
            backgroundSettings: {
                backgroundType: app.canvasStyles.backgroundType,
                bgColor: app.canvasStyles.bgColor,
                gradientColorOne: app.canvasStyles.gradientColorOne,
                gradientColorTwo: app.canvasStyles.gradientColorTwo,
                gradientAngle: app.canvasStyles.gradientAngle,
                bgImage: app.canvasStyles.bgImage,
            },
            frameSettings: {
                frameType: app.frameType,
                browserTheme: String(browserStore.settings.activeTheme),
                phoneTheme: String(phoneStore.activeTheme),
            },
        };

        presetsStore.customPresets.push(newPreset);
        saveCustomPresets(presetsStore.customPresets);

        return newPreset;
    },

    deletePreset(presetId: string) {
        const preset = presetsStore.customPresets.find(p => p.id === presetId);
        if (!preset || preset.isBuiltIn) return;

        presetsStore.customPresets = presetsStore.customPresets.filter(p => p.id !== presetId);
        saveCustomPresets(presetsStore.customPresets);

        if (presetsStore.selectedPresetId === presetId) {
            presetsStore.selectedPresetId = null;
        }
    },

    setActiveCategory(category: PresetCategory | 'all') {
        presetsStore.activeCategory = category;
    },
} as IPresetsStore);
