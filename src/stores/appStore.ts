import {autoEffect, store} from '@risingstack/react-easy-state';
import {CanvasBackgroundTypes, FrameType, ImageFormats} from "../types";
import {getImageDimensions} from "../utils/image";
import {phoneStore} from "./phoneStore";
import {Routes, routeStore} from "./routeStore";
import {observe} from '@nx-js/observer-util'

export const bgImages = [
    '1.jpg',
    '2.jpg',
    '3.png',
    '4.jpg',
].map(img => `/images/backgrounds/${img}`);

export const defaultCanvasBgColor = '#a090c1';

export const defaultResettableCanvasStyles = {
    verticalPadding: 60,
    horizontalPadding: 80,
    gradientAngle: 45,
    shadowSize: 4,
    rotateX: 0,
    rotateY: 0,
    borderRadius: 10,
    size: 100,
}

export interface ICanvasStyles {
    bgColor: string;
    bgImage?: string;
    verticalPadding: number;
    horizontalPadding: number;
    backgroundType: CanvasBackgroundTypes;
    gradientColorOne: string;
    gradientColorTwo: string;
    gradientAngle: number;
    shadowSize: number;
    rotateX: number;
    rotateY: number;
    borderRadius: number;
    size: number;
}

export interface IStore {
    frameType: FrameType;
    imageData?: string;
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

    setImageData(imageData: string): void;
    adjustMeasurementForDownload(width: number): number;
}

export let app = store({
    frameType: FrameType.Browser,
    defaultImageFormat: ImageFormats.PNG,
    isDownloadMode: false,
    imageData: null,
    originalImageData: null,
    isAutoRotateActive: false,
    disableAutoRotate: false,
    hasDownloaded: false,
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
            app.frameType = height > width ? FrameType.Phone : FrameType.Browser;
        });

        routeStore.goToRoute(Routes.App);
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
        const multiplier = app.frameType === FrameType.Phone ? 3 : 2;
        return app.isDownloadMode ? measurement * multiplier : measurement;
    },

    get cssTransformString(): string {
         return `scale(${app.isDownloadMode ? (app.canvasStyles.size/100)*.99 : app.canvasStyles.size/100}) perspective(${app.adjustMeasurementForDownload(800)}px) rotateX(${app.canvasStyles.rotateX}deg) rotateY(${app.canvasStyles.rotateY}deg)`;
    },

    canvasStyles: {
        ...defaultResettableCanvasStyles, ...{
            bgColor: defaultCanvasBgColor,
            bgImage: '/images/backgrounds/1.jpg',
            backgroundType: CanvasBackgroundTypes.Image,
            gradientColorOne: '#7e349c',
            gradientColorTwo: '#968bbd',
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
            if (app.frameType === FrameType.Phone && width > height) {
                // rotateImage(app.imageData).then((rotated) => {
                //     app.imageData = rotated
                //     app.isAutoRotateActive = true;
                // });
                // Disable the auto-rotate for now and just hide the volume rocker
                phoneStore.settings.showVolumeRocker = false;
            }
            if (app.frameType === FrameType.Browser && width < height) {
                // app.imageData = app.originalImageData;
                // app.isAutoRotateActive = false;
            }
        })
    }
});

// Handle syncing some settings with localStorage
observe(() => localStorage.setItem('canvasStyles', JSON.stringify(app.canvasStyles)));
