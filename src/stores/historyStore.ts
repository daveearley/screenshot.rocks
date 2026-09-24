import {browserStore, IBrowserSettings, IBrowserStyles} from './browserStore';
import {IPhoneSettings, phoneStore, PhoneThemes} from './phoneStore';
import {INoFrameSettings, noFrameStore} from './noFrameStore';
import {annotationStore} from './annotationStore';
import {IAnnotation} from '../types/annotations';
import { store } from '@risingstack/react-easy-state';
import { app, ICanvasStyles } from './appStore';
import { Dimensions } from '../values/dimensions';

interface HistoryState {
    browserSettings: IBrowserSettings;
    browserCustomStyles: IBrowserStyles;
    phoneTheme: PhoneThemes;
    phoneSettings: IPhoneSettings;
    noFrameSettings: INoFrameSettings;
    annotations: IAnnotation[];
    nextCalloutNumber: number;
    canvasStyles: ICanvasStyles;
    frameType: string;
    canvasSizeMap: Map<string, number>;
    canvasDimensionsMap: Map<string, Dimensions>;
}

const MAX_HISTORY_SIZE = 50;

function cloneCanvasStyles(styles: ICanvasStyles): ICanvasStyles {
    return { ...styles };
}

function cloneSizeMap(map: Map<string, number>): Map<string, number> {
    return new Map(map);
}

function cloneDimensionsMap(map: Map<string, Dimensions>): Map<string, Dimensions> {
    const clone = new Map<string, Dimensions>();
    map.forEach((dims, key) => {
        clone.set(key, new Dimensions(dims.width, dims.height));
    });
    return clone;
}

function createSnapshot(): HistoryState {
    return {
        browserSettings: {...browserStore.settings},
        browserCustomStyles: {...browserStore.customStyles},
        phoneTheme: phoneStore.activeTheme,
        phoneSettings: {...phoneStore.settings},
        noFrameSettings: {...noFrameStore.settings},
        annotations: annotationStore.annotations.map(annotation => ({...annotation})),
        nextCalloutNumber: annotationStore.nextCalloutNumber,
        canvasStyles: cloneCanvasStyles(app.canvasStyles),
        frameType: app.frameType,
        canvasSizeMap: cloneSizeMap(app.canvasSizeMap as Map<string, number>),
        canvasDimensionsMap: cloneDimensionsMap(app.canvasDimensionsMap as Map<string, Dimensions>),
    };
}

function applySnapshot(snapshot: HistoryState) {
    browserStore.settings = {...snapshot.browserSettings};
    browserStore.customStyles = {...snapshot.browserCustomStyles};
    phoneStore.activeTheme = snapshot.phoneTheme;
    phoneStore.settings = {...snapshot.phoneSettings};
    noFrameStore.settings = {...snapshot.noFrameSettings};
    annotationStore.annotations = snapshot.annotations.map(annotation => ({...annotation}));
    annotationStore.nextCalloutNumber = snapshot.nextCalloutNumber;
    if (!annotationStore.annotations.some(a => a.id === annotationStore.selectedAnnotationId)) {
        annotationStore.selectedAnnotationId = null;
    }
    annotationStore.editingText = null;
    app.canvasStyles = cloneCanvasStyles(snapshot.canvasStyles);
    app.frameType = snapshot.frameType as any;
    app.canvasSizeMap = cloneSizeMap(snapshot.canvasSizeMap) as any;
    app.canvasDimensionsMap = cloneDimensionsMap(snapshot.canvasDimensionsMap) as any;
}

export interface IHistoryStore {
    undoStack: HistoryState[];
    redoStack: HistoryState[];
    isRecording: boolean;
    canUndo: boolean;
    canRedo: boolean;

    saveState(): void;
    undo(): void;
    redo(): void;
    clear(): void;
    pauseRecording(): void;
    resumeRecording(): void;
}

export const historyStore = store({
    undoStack: [] as HistoryState[],
    redoStack: [] as HistoryState[],
    isRecording: true,

    get canUndo(): boolean {
        return historyStore.undoStack.length > 0;
    },

    get canRedo(): boolean {
        return historyStore.redoStack.length > 0;
    },

    saveState() {
        if (!historyStore.isRecording) return;

        const snapshot = createSnapshot();
        historyStore.undoStack.push(snapshot);

        // Limit stack size
        if (historyStore.undoStack.length > MAX_HISTORY_SIZE) {
            historyStore.undoStack.shift();
        }

        // Clear redo stack on new action
        historyStore.redoStack = [];
    },

    undo() {
        if (historyStore.undoStack.length === 0) return;

        // Save current state to redo stack
        const currentState = createSnapshot();
        historyStore.redoStack.push(currentState);

        // Pop and apply previous state
        const previousState = historyStore.undoStack.pop()!;
        historyStore.isRecording = false;
        applySnapshot(previousState);
        historyStore.isRecording = true;
    },

    redo() {
        if (historyStore.redoStack.length === 0) return;

        // Save current state to undo stack
        const currentState = createSnapshot();
        historyStore.undoStack.push(currentState);

        // Pop and apply redo state
        const redoState = historyStore.redoStack.pop()!;
        historyStore.isRecording = false;
        applySnapshot(redoState);
        historyStore.isRecording = true;
    },

    clear() {
        historyStore.undoStack = [];
        historyStore.redoStack = [];
    },

    pauseRecording() {
        historyStore.isRecording = false;
    },

    resumeRecording() {
        historyStore.isRecording = true;
    },
} as IHistoryStore);
