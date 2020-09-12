import domtoimage from "dom-to-image";
import {RGBColor} from "react-color";
import {app} from "../stores/appStore";
import {ImageFormats} from "../types";
import {validURL} from "./url";

export const checkForImageFromLocalstorageUrlOrPaste = () => {
    const handlePaste = (e: ClipboardEvent | Event) => {
        retrieveImageFromClipboardAsBase64(e, (base64Data: string) => {
            app.imageData = base64Data;
        });
    };
    window.addEventListener("paste", handlePaste, false);

    // Allow passing an image URL as a query param
    const urlParams = new URLSearchParams(window.location.search);
    const imageUrl = urlParams.get('image');
    if (imageUrl && validURL(imageUrl)) {
        loadImageFromImageUrl(imageUrl).then(imageData => {
            app.setImageData(imageData as string);
        })
    }

    // If a user is coming from the Chrome extension the image is in localstorage
    if (sessionStorage.hasOwnProperty('imageFromPost')) {
        app.setImageData(sessionStorage.getItem('imageFromPost'));
        sessionStorage.removeItem('imageFromPost');
    }

    return () => window.removeEventListener("paste", handlePaste)
}

export const hex2rgba = (hex: string, alpha: number = 1): RGBColor => {
    const [r, g, b] = (hex.length === 3)
        ? hex.match(/\w/g).map(x => parseInt(x + x, 16))
        : hex.match(/\w\w/g).map(x => parseInt(x, 16))

    return {
        r: r,
        g: g,
        b: b,
        a: alpha
    }
};

export const rgba2hexa = (color: RGBColor) => {
    const r = color.r.toString(16);
    const g = color.g.toString(16);
    const b = color.b.toString(16);
    const a = Math.round(color.a * 255).toString(16);
    const pad = (str: string) => str.length === 1 ? '0' + str : str;

    return "#" + pad(r) + pad(g) + pad(b) + pad(a);
};

export const copyImageToClipboard = (elementToDownload: HTMLElement): Promise<any> => {
    const setToClipboard = async (blob: Blob) => {
        const data = [new ClipboardItem({[blob.type]: blob})]
        return navigator.clipboard.write(data)
    }

    return domtoimage.toBlob(elementToDownload)
        .then((data: Blob) => setToClipboard(data));
}

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
        fetch(url).then((res) => {
            return res.blob();
        }).then((blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.addEventListener("loadend", function () {
                resolve(reader.result)
            });
        }).catch((err) => {
            reject(err);
        })
    });
}