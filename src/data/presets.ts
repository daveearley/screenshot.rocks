import { IPreset, PresetCategory } from '../types/presets';
import { CanvasBackgroundTypes, ScreenshotType } from '../types';

// Purposeful compositions; each defines its position so a preset always produces the same layout.
const preset = (id: string, name: string, width: number, height: number, size: number, color: string, frame: ScreenshotType, second?: string, tilt = 0): IPreset => ({
    id, name, category: PresetCategory.Style, isBuiltIn: true,
    canvasSettings: {width, height, size, borderRadius: 18, shadowSize: 24, rotateX: 0, rotateY: tilt, horizontalPosition: 0, verticalPosition: 0},
    backgroundSettings: {backgroundType: second ? CanvasBackgroundTypes.Gradient : CanvasBackgroundTypes.Solid, bgColor: color, gradientColorOne: color, gradientColorTwo: second || color, gradientAngle: 135},
    frameSettings: {frameType: frame, browserTheme: color === '#15171b' ? '1' : '0', phoneTheme: '9'},
});
export const builtInPresets: IPreset[] = [
    preset('paper', 'Paper', 1600, 1000, 78, '#eae8e3', ScreenshotType.Browser),
    preset('midnight', 'Midnight', 1600, 1000, 76, '#15171b', ScreenshotType.Browser),
    preset('sage', 'Sage', 1600, 1000, 78, '#dbe5dc', ScreenshotType.None),
    preset('iris', 'Iris', 1600, 1000, 76, '#dcd9f4', ScreenshotType.Browser, '#f1e7e1'),
    {...preset('launch', 'Launch', 1600, 900, 76, '#e7edf4', ScreenshotType.Browser, '#cddce9', -8), category: PresetCategory.Presentation},
    {...preset('square', 'Square', 1200, 1200, 82, '#e9ddd3', ScreenshotType.None), category: PresetCategory.SocialMedia},
    preset('mobile-light', 'Phone', 1080, 1440, 112, '#eeede9', ScreenshotType.Device),
    preset('mobile-dark', 'Phone Dark', 1080, 1440, 112, '#15171b', ScreenshotType.Device),
];
