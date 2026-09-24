export enum AnnotationType {
    Text = 'text',
    Rectangle = 'rectangle',
    Circle = 'circle',
    Arrow = 'arrow',
    Blur = 'blur',
    Callout = 'callout',
}

export interface IAnnotation {
    id: string;
    type: AnnotationType;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    strokeWidth: number;
    // Text
    text?: string;
    fontSize?: number;
    fontId?: string;
    bold?: boolean;
    // Callout
    calloutNumber?: number;
    // Blur
    blurAmount?: number;
    // Arrow end point (x/y is the start)
    endX?: number;
    endY?: number;
}

export interface ITextEditing {
    id: string | null;
    x: number;
    y: number;
}
