import { CanvasBackgroundTypes, ScreenshotType } from '../types';

export enum PresetCategory {
    SocialMedia = 'Social Media',
    Style = 'Style',
    Presentation = 'Presentation',
    Custom = 'Custom',
}

export interface ICanvasPresetSettings {
    width: number;
    height: number;
    size: number;
    borderRadius: number;
    shadowSize: number;
    rotateX: number;
    rotateY: number;
    horizontalPosition?: number;
    verticalPosition?: number;
}

export interface IBackgroundPresetSettings {
    backgroundType: CanvasBackgroundTypes;
    bgColor?: string;
    gradientColorOne?: string;
    gradientColorTwo?: string;
    gradientAngle?: number;
    bgImage?: string;
}

export interface IFramePresetSettings {
    frameType?: ScreenshotType;
    browserTheme?: string;
    phoneTheme?: string;
}

export interface IPreset {
    id: string;
    name: string;
    category: PresetCategory;
    isBuiltIn: boolean;
    canvasSettings: ICanvasPresetSettings;
    backgroundSettings: IBackgroundPresetSettings;
    frameSettings?: IFramePresetSettings;
    thumbnail?: string;
}
