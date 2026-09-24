import {store} from '@risingstack/react-easy-state';
import {AnnotationType, IAnnotation, ITextEditing} from '../types/annotations';
import {DEFAULT_FONT_ID, loadFont} from '../utils/fonts';
import {historyStore} from './historyStore';

const generateId = () => `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const MARKUP_COLORS = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#007aff', '#af52de', '#ffffff', '#1c1c1e'];
export const STROKE_WIDTHS = [{width: 3, label: 'Thin'}, {width: 6, label: 'Regular'}, {width: 10, label: 'Bold'}, {width: 16, label: 'Heavy'}];
export const DEFAULT_FONT_SIZE = 48;
export const DEFAULT_BLUR = 14;

/** Shapes smaller than this (in canvas pixels) are treated as accidental clicks. */
const MIN_SHAPE_SIZE = 5;

export interface IAnnotationStore {
    annotations: IAnnotation[];
    selectedAnnotationId: string | null;
    activeTool: AnnotationType | null;
    activeColor: string;
    activeStrokeWidth: number;
    activeFontId: string;
    activeFontSize: number;
    activeBold: boolean;
    nextCalloutNumber: number;
    isDrawing: boolean;
    drawStartPoint: {x: number, y: number} | null;
    drawCurrentPoint: {x: number, y: number} | null;
    editingText: ITextEditing | null;
    markupMode: boolean;

    setMarkupMode(on: boolean): void;
    addAnnotation(annotation: Omit<IAnnotation, 'id'>): IAnnotation;
    /** Pass `record: false` for intermediate updates during a gesture that already recorded an undo step. */
    updateAnnotation(id: string, updates: Partial<IAnnotation>, record?: boolean): void;
    deleteAnnotation(id: string): void;
    clearAnnotations(record?: boolean): void;
    selectAnnotation(id: string | null): void;
    getSelectedAnnotation(): IAnnotation | null;

    setActiveTool(tool: AnnotationType | null): void;
    /** Pass `record: false` while dragging in a colour picker; the picker records one step when it opens. */
    setActiveColor(color: string, record?: boolean): void;
    setActiveStrokeWidth(width: number): void;
    setActiveFont(fontId: string): void;
    setActiveFontSize(size: number): void;
    setActiveBold(bold: boolean): void;

    startDrawing(x: number, y: number): void;
    updateDrawing(x: number, y: number): void;
    finishDrawing(): void;
    cancelDrawing(): void;

    startTextEditing(x: number, y: number): void;
    editText(id: string): void;
    commitText(text: string): void;
    cancelTextEditing(): void;
}

export const annotationStore: IAnnotationStore = store({
    annotations: [] as IAnnotation[],
    selectedAnnotationId: null,
    activeTool: null,
    activeColor: MARKUP_COLORS[0],
    activeStrokeWidth: STROKE_WIDTHS[1].width,
    activeFontId: DEFAULT_FONT_ID,
    activeFontSize: DEFAULT_FONT_SIZE,
    activeBold: true,
    nextCalloutNumber: 1,
    isDrawing: false,
    drawStartPoint: null,
    drawCurrentPoint: null,
    editingText: null,
    markupMode: false,

    setMarkupMode(on) {
        annotationStore.markupMode = on;
        annotationStore.activeTool = null;
        annotationStore.selectedAnnotationId = null;
        annotationStore.cancelDrawing();
    },

    addAnnotation(annotation) {
        historyStore.saveState();
        const created: IAnnotation = {...annotation, id: generateId()};
        if (created.type === AnnotationType.Callout && created.calloutNumber === undefined) {
            created.calloutNumber = annotationStore.nextCalloutNumber++;
        }
        annotationStore.annotations.push(created);
        return created;
    },

    updateAnnotation(id, updates, record = true) {
        const index = annotationStore.annotations.findIndex(a => a.id === id);
        if (index === -1) return;
        if (record) historyStore.saveState();
        annotationStore.annotations[index] = {...annotationStore.annotations[index], ...updates};
    },

    deleteAnnotation(id) {
        if (!annotationStore.annotations.some(a => a.id === id)) return;
        historyStore.saveState();
        annotationStore.annotations = annotationStore.annotations.filter(a => a.id !== id);
        if (annotationStore.selectedAnnotationId === id) annotationStore.selectedAnnotationId = null;
    },

    clearAnnotations(record = true) {
        if (record && annotationStore.annotations.length) historyStore.saveState();
        annotationStore.annotations = [];
        annotationStore.selectedAnnotationId = null;
        annotationStore.editingText = null;
        annotationStore.nextCalloutNumber = 1;
    },

    selectAnnotation(id) {
        annotationStore.selectedAnnotationId = id;
        const selected = annotationStore.getSelectedAnnotation();
        if (!selected) return;
        annotationStore.activeColor = selected.color;
        if (selected.type === AnnotationType.Text) {
            annotationStore.activeFontId = selected.fontId || DEFAULT_FONT_ID;
            annotationStore.activeFontSize = selected.fontSize || DEFAULT_FONT_SIZE;
            annotationStore.activeBold = selected.bold !== false;
        } else if (selected.type !== AnnotationType.Blur && selected.type !== AnnotationType.Callout) {
            annotationStore.activeStrokeWidth = selected.strokeWidth;
        }
    },

    getSelectedAnnotation() {
        return annotationStore.annotations.find(a => a.id === annotationStore.selectedAnnotationId) || null;
    },

    setActiveTool(tool) {
        annotationStore.activeTool = tool;
        if (tool !== null) annotationStore.selectedAnnotationId = null;
        if (tool === AnnotationType.Text) loadFont(annotationStore.activeFontId);
    },

    setActiveColor(color, record = true) {
        annotationStore.activeColor = color;
        const selected = annotationStore.getSelectedAnnotation();
        if (selected && selected.color !== color) annotationStore.updateAnnotation(selected.id, {color}, record);
    },

    setActiveStrokeWidth(width) {
        annotationStore.activeStrokeWidth = width;
        const selected = annotationStore.getSelectedAnnotation();
        if (selected && selected.strokeWidth !== width) annotationStore.updateAnnotation(selected.id, {strokeWidth: width});
    },

    setActiveFont(fontId) {
        annotationStore.activeFontId = fontId;
        loadFont(fontId);
        const selected = annotationStore.getSelectedAnnotation();
        if (selected?.type === AnnotationType.Text) annotationStore.updateAnnotation(selected.id, {fontId});
    },

    setActiveFontSize(size) {
        annotationStore.activeFontSize = size;
        const selected = annotationStore.getSelectedAnnotation();
        if (selected?.type === AnnotationType.Text && selected.fontSize !== size) annotationStore.updateAnnotation(selected.id, {fontSize: size});
    },

    setActiveBold(bold) {
        annotationStore.activeBold = bold;
        const selected = annotationStore.getSelectedAnnotation();
        if (selected?.type === AnnotationType.Text) annotationStore.updateAnnotation(selected.id, {bold});
    },

    startDrawing(x, y) {
        if (!annotationStore.activeTool) return;
        annotationStore.isDrawing = true;
        annotationStore.drawStartPoint = {x, y};
        annotationStore.drawCurrentPoint = {x, y};
    },

    updateDrawing(x, y) {
        if (annotationStore.isDrawing) annotationStore.drawCurrentPoint = {x, y};
    },

    finishDrawing() {
        const {drawStartPoint: start, drawCurrentPoint: end, activeTool: tool} = annotationStore;
        annotationStore.cancelDrawing();
        if (!start || !end || !tool) return;

        const x = Math.min(start.x, end.x), y = Math.min(start.y, end.y);
        const width = Math.abs(end.x - start.x), height = Math.abs(end.y - start.y);
        const color = annotationStore.activeColor, strokeWidth = annotationStore.activeStrokeWidth;
        let created: IAnnotation | null = null;

        switch (tool) {
            case AnnotationType.Text:
                annotationStore.startTextEditing(start.x, start.y);
                return;
            case AnnotationType.Callout:
                // Callouts are usually placed in sequence (1, 2, 3…), so the tool stays active.
                annotationStore.addAnnotation({type: tool, x: start.x, y: start.y, width: 48, height: 48, color, strokeWidth});
                return;
            case AnnotationType.Arrow:
                if (Math.hypot(width, height) < MIN_SHAPE_SIZE * 2) return;
                created = annotationStore.addAnnotation({type: tool, x: start.x, y: start.y, endX: end.x, endY: end.y, width: 0, height: 0, color, strokeWidth});
                break;
            default:
                if (width < MIN_SHAPE_SIZE || height < MIN_SHAPE_SIZE) return;
                created = annotationStore.addAnnotation({
                    type: tool, x, y, width, height, color, strokeWidth,
                    ...(tool === AnnotationType.Blur ? {blurAmount: DEFAULT_BLUR} : {}),
                });
        }
        // Like Preview: after drawing, select the new shape.
        annotationStore.activeTool = null;
        annotationStore.selectAnnotation(created.id);
    },

    cancelDrawing() {
        annotationStore.isDrawing = false;
        annotationStore.drawStartPoint = null;
        annotationStore.drawCurrentPoint = null;
    },

    startTextEditing(x, y) {
        loadFont(annotationStore.activeFontId);
        annotationStore.selectedAnnotationId = null;
        annotationStore.editingText = {id: null, x, y};
    },

    editText(id) {
        const annotation = annotationStore.annotations.find(a => a.id === id);
        if (!annotation || annotation.type !== AnnotationType.Text) return;
        annotationStore.selectAnnotation(id);
        annotationStore.editingText = {id, x: annotation.x, y: annotation.y};
    },

    commitText(text) {
        const editing = annotationStore.editingText;
        annotationStore.editingText = null;
        if (!editing) return;
        const value = text.replace(/\s+$/, '');

        if (editing.id) {
            const existing = annotationStore.annotations.find(a => a.id === editing.id);
            if (!value) annotationStore.deleteAnnotation(editing.id);
            else if (existing && existing.text !== value) annotationStore.updateAnnotation(editing.id, {text: value});
            return;
        }
        if (!value) return;
        const created = annotationStore.addAnnotation({
            type: AnnotationType.Text, x: editing.x, y: editing.y, width: 0, height: 0, text: value,
            color: annotationStore.activeColor, strokeWidth: annotationStore.activeStrokeWidth,
            fontId: annotationStore.activeFontId, fontSize: annotationStore.activeFontSize, bold: annotationStore.activeBold,
        });
        annotationStore.activeTool = null;
        annotationStore.selectAnnotation(created.id);
    },

    cancelTextEditing() {
        annotationStore.editingText = null;
    },
} as IAnnotationStore);
