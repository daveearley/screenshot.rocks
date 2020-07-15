import {autoEffect, store} from '@risingstack/react-easy-state';
import {CanvasBackgroundTypes, FrameType, ImageFormats} from "../types";
import {getImageDimensions} from "../utils/image";
import {phoneStore} from "./phoneStore";

export const bgImages = [
    '1.jpg',
    '2.jpg',
    '3.png',
    '4.jpg'
].map(img => `/images/backgrounds/${img}`);

export const defaultCanvasBgColor = '#a090c1';

export interface ICanvasStyles {
    bgColor: string;
    bgImage?: string;
    verticalPadding: number;
    horizontalPadding: number;
    backgroundType: CanvasBackgroundTypes;
    gradientColorOne: string;
    gradientColorTwo: string;
    gradientAngle: number
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

    setImageData(imageData: string): void;
}

export let app = store({
    frameType: FrameType.Browser,
    defaultImageFormat: ImageFormats.PNG,
    isDownloadMode: false,
    imageData: null,
    originalImageData: null,
    isAutoRotateActive: false,
    disableAutoRotate: false,
    setImageData(imageData: string) {
        app.imageData = imageData;
        app.originalImageData = imageData;

        // switch to mobile for portrait screenshots
        getImageDimensions(imageData).then(({width, height}) => {
            app.frameType = height > width ? FrameType.Phone : FrameType.Browser;
        });
    },

    get canvasBgColor(): string {
        switch (app.canvasStyles.backgroundType) {
            case CanvasBackgroundTypes.Gradient:
                return `linear-gradient(-${app.canvasStyles.gradientAngle}deg, ${app.canvasStyles.gradientColorOne}, ${app.canvasStyles.gradientColorTwo})`;
            case CanvasBackgroundTypes.Image:
                return `url(${app.canvasStyles.bgImage})`;
            case CanvasBackgroundTypes.None:
                return 'transparent';
            case CanvasBackgroundTypes.Solid:
                return app.canvasStyles.bgColor;
        }
    },

    canvasStyles: {
        bgColor: defaultCanvasBgColor,
        bgImage: '/images/backgrounds/1.jpg',
        verticalPadding: 40,
        horizontalPadding: 60,
        backgroundType: CanvasBackgroundTypes.Image,
        gradientColorOne: '#7e349c',
        gradientColorTwo: '#968bbd',
        gradientAngle: 45,
    },
} as IStore);

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