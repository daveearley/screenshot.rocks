import domtoimage from "dom-to-image";
import {RGBColor} from "react-color";
import {app} from "../stores/appStore";
import {ImageFormats} from "../types";
import {validURL} from "./url";

export const listenForImagePaste = () => {
    const handlePaste = (e: ClipboardEvent | Event) => {
        retrieveImageFromClipboardAsBase64(e, (base64Data: string) => {
            app.imageData = base64Data;
        });
    };
    window.addEventListener("paste", handlePaste, false);


    const urlParams = new URLSearchParams(window.location.search);
    const imageUrl = urlParams.get('image');
    if (imageUrl && validURL(imageUrl)) {
        loadImageFromImageUrl(imageUrl).then(imageData => {
            app.imageData = imageData as string;
        })
    }

    return () => window.removeEventListener("paste", handlePaste)
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
        case ImageFormats.SVG:
            return domtoimage.toSvg(elementToDownload)
                .then((data: string) => handleDownload(data, ImageFormats.SVG));
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
            } else if (height > maxHeight) {
                width *= maxHeight / height
                height = maxHeight
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

export const getImageDimensions = (file: string): Promise<{ width: number, height: number }> => {
    return loadImageFromBase64(file).then(img => {
        return {
            width: img.width,
            height: img.height
        }
    })
};

export const loadImageFromBase64 = (imageData: string): Promise<HTMLImageElement> => {
    return new Promise((resolved) => {
        const image = new Image()
        image.onload = function () {
            resolved(image)
        };
        image.src = imageData
    });
}

export const rotateImage = (img: string): Promise<string> => {
    return loadImageFromBase64(img).then(image => {
        const degrees = 90;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = image.height;
        canvas.height = image.width;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(image.height / 2, image.width / 2);
        ctx.rotate(degrees * Math.PI / 180);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);

        return canvas.toDataURL();
    })
};

export const loadImageFromImageUrl = (url: string): Promise<string | ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
        xhr.addEventListener("load", function () {
            const reader = new FileReader();
            reader.readAsDataURL(xhr.response);
            reader.addEventListener("loadend", function () {
                resolve(reader.result);
            });
        });
        xhr.onerror = (e: ProgressEvent) => {
            reject(e);
        };
    });
}