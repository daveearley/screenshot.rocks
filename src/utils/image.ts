import domtoimage from "dom-to-image";
import {RGBColor} from "react-color";

export enum ImageFormats {
    PNG = 'png',
    JPEG = 'jpeg',
}

export const hex2rgba = (hex: string, alpha: number = 1): RGBColor => {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return {
        r: r,
        g: g,
        b: b,
        a: alpha
    }
};

export const rgba2hexa = (color: RGBColor) => {
    let r = color.r.toString(16);
    let g = color.g.toString(16);
    let b = color.b.toString(16);
    let a = Math.round(color.a * 255).toString(16);

    if (r.length === 1) {
        r = "0" + r;
    }
    if (g.length === 1) {
        g = "0" + g;
    }
    if (b.length === 1) {
        b = "0" + b;
    }
    if (a.length === 1) {
        a = "0" + a;
    }

    return "#" + r + g + b + a;
};

export const downloadImage = (elementToDownload: HTMLElement, imageFormat: ImageFormats, quality: number = 1) => {
    const handleDownload = (dataUrl: string, extension: ImageFormats) => {
        let link = document.createElement('a');
        link.download = `screenshot-rocks.${extension}`;
        link.href = dataUrl;
        link.click();
    };

    switch (imageFormat) {
        default:
        case ImageFormats.JPEG:
            return domtoimage.toJpeg(elementToDownload, {quality: quality})
                .then((data: string) => handleDownload(data, ImageFormats.JPEG));
        case ImageFormats.PNG:
            return domtoimage.toPng(elementToDownload)
                .then((data: string) => handleDownload(data, ImageFormats.PNG));
    }
};

export const resizeImage = (
    base64Str: string,
    maxWidth: number = 3200,
    maxHeight: number = 3200
): Promise<string> => {
    return new Promise((resolve) => {
        let img = new Image()
        img.src = base64Str
        img.onload = () => {
            let canvas = document.createElement('canvas')
            let width = img.width
            let height = img.height

            if ((width > height) && (width > maxWidth)) {
                height *= maxWidth / width
                width = maxWidth
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height
                    height = maxHeight
                }
            }
            canvas.width = width
            canvas.height = height
            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)
            resolve(canvas.toDataURL())
        }
    })
}

export const retrieveImageFromClipboardAsBase64 = (pasteEvent: ClipboardEvent | Event, onSuccess: (data: string) => void) => {
    const items = (pasteEvent as ClipboardEvent).clipboardData.items;

    if (!items) {
        return;
    }

    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") === -1) {
            continue;
        }

        const blob = items[i].getAsFile();
        const canvasElement = document.createElement("canvas");
        const ctx = canvasElement.getContext('2d');
        const img = new Image();

        img.onload = function () {
            canvasElement.width = img.width;
            canvasElement.height = img.height;
            ctx.drawImage(img, 0, 0);
            onSuccess(canvasElement.toDataURL("image/jpg"))
        };

        const URLObj = window.URL || window.webkitURL;
        img.src = URLObj.createObjectURL(blob);
    }
};

