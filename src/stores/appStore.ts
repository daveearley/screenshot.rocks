import {autoEffect, store} from '@risingstack/react-easy-state';
import {CanvasBackgroundTypes, ImageFormats, ScreenshotType} from "../types";
import {getImageDimensions} from "../utils/image";
import {Routes, routeStore} from "./routeStore";
import {observe} from '@nx-js/observer-util'
import {Crop} from "react-image-crop";
import {Dimensions} from "../values/dimensions";
import {deviceAspectRatioMap, phoneStore} from "./phoneStore";

export const bgImages: string[] = [
    '1.jpg',
    '2.jpg',
    '3.png',
    '4.jpg',
].map(img => `/images/backgrounds/${img}`);

export const defaultCanvasBgColor: string = '#a090c1';

export const defaultCanvasSize: number = 75;

export const defaultResettableCanvasStyles: object = {
    verticalPosition: 0,
    horizontalPosition: 0,
    gradientAngle: 45,
    shadowSize: 4,
    rotateX: 0,
    rotateY: 0,
    borderRadius: 10,
    size: 75,
    width: 2300,
    height: 1200,
}

export const defaultCanvasSizeMap = new Map<ScreenshotType, number>([
    [ScreenshotType.Browser, 75],
    [ScreenshotType.Device, 120],
    [ScreenshotType.Twitter, 80],
    [ScreenshotType.None, 90],
    [ScreenshotType.Code, 90],
]);

export interface ICanvasStyles {
    bgColor: string;
    bgImage?: string;
    verticalPosition: number;
    horizontalPosition: number;
    backgroundType: CanvasBackgroundTypes;
    gradientColorOne: string;
    gradientColorTwo: string;
    gradientAngle: number;
    shadowSize: number;
    rotateX: number;
    rotateY: number;
    borderRadius: number;
    height: number;
    width: number;
    size: number;
}

export interface IStore {
    frameType: ScreenshotType;
    imageData?: string;
    croppedImageData?: string;
    previousCroppedImageData?: string;
    cropData?: Crop;
    previousCropData?: Crop;
    cropScale?: number;
    originalImageData?: string;
    canvasStyles: ICanvasStyles;
    isDownloadMode: boolean;
    defaultImageFormat: ImageFormats;
    canvasBgColor: string;
    isAutoRotateActive: boolean;
    disableAutoRotate: boolean;
    hasDownloaded: boolean;
    shouldShowRatingPrompt: boolean;
    cssTransformString: string;
    cropIsActive: boolean;
    canvasSizeMap?: Map<ScreenshotType, number>;
    canvasDimensionsMap?: Map<ScreenshotType, Dimensions>;

    setImageData(imageData: string): void;

    setCanvasSize(size: number): void;

    getCanvasSize(): number;

    getDefaultCanvasSize(): number;

    getCanvasDimensions(): Dimensions;

    setCanvasWidth(width: number): void;

    setCanvasHeight(height: number): void;

    adjustMeasurementForDownload(width: number): number;

    getAspectRatio(): number;

    resetImage(): void;
}

export let app = store({
    frameType: ScreenshotType.Browser,
    defaultImageFormat: ImageFormats.PNG,
    isDownloadMode: false,
    imageData: null,
    originalImageData: null,
    isAutoRotateActive: false,
    disableAutoRotate: false,
    hasDownloaded: false,
    cropIsActive: false,
    canvasSizeMap: new Map(defaultCanvasSizeMap),
    canvasDimensionsMap: new Map<ScreenshotType, Dimensions>([
        [ScreenshotType.Browser, new Dimensions(1920, 1200)],
        [ScreenshotType.Device, new Dimensions(1080, 1920)],
        [ScreenshotType.Twitter, new Dimensions(1040, 512)],
        [ScreenshotType.None, new Dimensions(1920, 1200)],
        [ScreenshotType.Code, new Dimensions(1920, 720)],
    ]),
    get shouldShowRatingPrompt(): boolean {
        return app.hasDownloaded
            && localStorage.getItem('hasReviewed') === null
            && window.location.href.includes('extension');
    },
    setImageData(imageData: string) {
        app.imageData = imageData;
        app.originalImageData = imageData;

        // switch to mobile for portrait screenshots
        getImageDimensions(imageData).then(({width, height}) => {
            app.frameType = height > width ? ScreenshotType.Device : ScreenshotType.Browser;
        });

        routeStore.goToRoute(Routes.App);
    },
    setCanvasSize(size: number): void {
        app.canvasSizeMap.set(app.frameType, size)
    },
    getCanvasSize(): number {
        return app.canvasSizeMap.get(app.frameType);
    },
    getCanvasDimensions(): Dimensions {
        return app.canvasDimensionsMap.get(app.frameType);
    },
    setCanvasWidth(width: number): void {
        app.canvasDimensionsMap.get(app.frameType).width = width
    },
    setCanvasHeight(height: number): void {
        app.canvasDimensionsMap.get(app.frameType).height = height
    },
    getAspectRatio(): number {
        if (app.frameType === ScreenshotType.Device) {
            return deviceAspectRatioMap[phoneStore.activeTheme];
        }
        return 16 / 9;
    },

    get canvasBgColor(): string {
        switch (app.canvasStyles.backgroundType) {
            case CanvasBackgroundTypes.Gradient:
                return `linear-gradient(-${app.canvasStyles.gradientAngle}deg, ${app.canvasStyles.gradientColorOne}, ${app.canvasStyles.gradientColorTwo})`;
            case CanvasBackgroundTypes.Image:
                return `url(${app.canvasStyles.bgImage})`;
            case CanvasBackgroundTypes.Solid:
                return app.canvasStyles.bgColor;
            case CanvasBackgroundTypes.None:
            default:
                return app.isDownloadMode ? 'transparent' : 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==")';
        }
    },

    // helper function which increases an element's width while in download mode
    adjustMeasurementForDownload(measurement: number): number {
        const multiplier = app.frameType === ScreenshotType.Device ? 3 : 2;
        return measurement * multiplier;
    },

    resetImage(): void {
        app.imageData = null;
        app.cropData = null;
        app.previousCropData = null;
        app.croppedImageData = null;
        app.previousCroppedImageData = null;
    },

    get cssTransformString(): string {
        return `scale(${app.isDownloadMode ? (app.getCanvasSize() / 100) * .99 : app.getCanvasSize() / 100}) perspective(${app.adjustMeasurementForDownload(800)}px) rotateX(${app.canvasStyles.rotateX}deg) rotateY(${app.canvasStyles.rotateY}deg)`;
    },

    canvasStyles: {
        ...defaultResettableCanvasStyles, ...{
            bgColor: defaultCanvasBgColor,
            bgImage: '/images/backgrounds/1.jpg',
            backgroundType: CanvasBackgroundTypes.Image,
            gradientColorOne: '#7e349c',
            gradientColorTwo: '#968bbd'
        }
    },
} as IStore);

if (localStorage.getItem('canvasStyles')) {
    app.canvasStyles = JSON.parse(localStorage.getItem('canvasStyles'))
}

autoEffect(() => {
    // This auto-rotates the image if the user switches to mobile and the image is landscape
    if (app.frameType && !app.disableAutoRotate) {
        getImageDimensions(app.imageData).then(({width, height}) => {
            if (app.frameType === ScreenshotType.Device && width > height) {
                // rotateImage(app.imageData).then((rotated) => {
                //     app.imageData = rotated
                //     app.isAutoRotateActive = true;
                // });
                // Disable the auto-rotate for now and just hide the volume rocker
            }
            if (app.frameType === ScreenshotType.Browser && width < height) {
                // app.imageData = app.originalImageData;
                // app.isAutoRotateActive = false;
            }
        })
    }
});

// Handle syncing some settings with localStorage
observe(() => localStorage.setItem('canvasStyles', JSON.stringify(app.canvasStyles)));
