import domtoimage from "dom-to-image";
import {app} from "../stores/appStore";
import {ImageFormats} from "../types";
import {validURL} from "./url";

export const checkForImageFromLocalstorageUrlOrPaste = () => {
    const handlePaste = (e: ClipboardEvent | Event) => {
        const target = e.target as HTMLElement | null;
        if (target && (['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable)) return;
        retrieveImageFromClipboardAsBase64(e, (base64Data: string) => {
            app.setImageData(base64Data);
        });
    };
    window.addEventListener("paste", handlePaste, false);

    // Allow passing an image URL as a query param
    const urlParams = new URLSearchParams(window.location.search);
    const imageUrl = urlParams.get('image');
    if (imageUrl && validURL(imageUrl)) {
        loadImageFromImageUrl(imageUrl).then(imageData => {
            app.setImageData(imageData as string);
        }).catch(() => {
            window.alert('Unable to open that image. Please upload the file instead.');
        });
    }

    // If a user is coming from the Chrome extension the image is in localstorage
    const postedImage = sessionStorage.getItem('imageFromPost');
    if (postedImage) {
        sessionStorage.removeItem('imageFromPost');
        if (/^data:image\/(png|jpe?g|webp);base64,/i.test(postedImage)) {
            app.setImageData(postedImage);
        }
    }

    return () => window.removeEventListener("paste", handlePaste)
}

const exportFilter = (node: HTMLElement) => !node.hasAttribute || !node.hasAttribute('data-export-exclude');

const exportRootStyle = (background?: string) => ({
    transform: 'none', position: 'relative', top: '0', left: '0',
    ...(background ? {background} : {}),
});

export const renderPngBlob = (element: HTMLElement, background?: string): Promise<Blob> =>
    domtoimage.toBlob(element, {filter: exportFilter, style: exportRootStyle(background)});

/** Call synchronously from the click: Safari only allows clipboard writes that start inside the user gesture. */
export const copyImageToClipboard = (render: () => Promise<Blob>): Promise<void> => {
    const Item = (window as any).ClipboardItem;
    try {
        return navigator.clipboard.write([new Item({'image/png': render()})]);
    } catch (_) {
        // Older browsers only accept a finished Blob.
        return render().then(blob => navigator.clipboard.write([new Item({'image/png': blob})]));
    }
};

export const downloadImage = (
    elementToDownload: HTMLElement,
    imageFormat: ImageFormats,
    height: number,
    width: number,
    quality: number = 1,
    background?: string,
) => {
    const handleDownload = (dataUrl: string, extension: ImageFormats) => {
        let link = document.createElement('a');
        link.download = `screenshot-rocks.${extension}`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        link.remove();
        return dataUrl;
    };

    const settings = {quality, width, height, filter: exportFilter, style: exportRootStyle(background)};
    // Always start from a flattened raster so nothing under markup (like blurred text) survives in the file.
    const rasterize = () => domtoimage.toPng(elementToDownload, settings);

    switch (imageFormat) {
        default:
        case ImageFormats.JPEG:
            return domtoimage.toJpeg(elementToDownload, settings)
                .then((data: string) => handleDownload(data, ImageFormats.JPEG));
        case ImageFormats.PNG:
            return rasterize().then((data: string) => handleDownload(data, ImageFormats.PNG));
        case ImageFormats.WebP:
            return rasterize().then((data: string) => loadImageFromBase64(data)).then((image: HTMLImageElement) => {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(image, 0, 0);
                const webp = canvas.toDataURL('image/webp', quality);
                // Browsers without a WebP encoder silently return PNG data instead.
                if (!webp.startsWith('data:image/webp')) throw new Error('WebP export is not supported in this browser');
                return handleDownload(webp, ImageFormats.WebP);
            });
        case ImageFormats.SVG:
            // dom-to-image's own SVG embeds the original, unblurred screenshot as HTML; wrap the raster instead.
            return rasterize().then((png: string) => {
                const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`
                    + `<image width="${width}" height="${height}" href="${png}" xlink:href="${png}"/></svg>`;
                return handleDownload(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`, ImageFormats.SVG);
            });
    }
};

/** Safari can't always encode WebP from a canvas. */
export const supportsWebPExport = (): boolean => {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        return canvas.toDataURL('image/webp').startsWith('data:image/webp');
    } catch (_) {
        return false;
    }
};

export const retrieveImageFromClipboardAsBase64 = (pasteEvent: ClipboardEvent | Event, onSuccess: (data: string) => void) => {
    const clipboard = (pasteEvent as ClipboardEvent).clipboardData;
    const items = clipboard && clipboard.items;

    if (!items) {
        return;
    }

    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") === -1) {
            continue;
        }

        const blob = items[i].getAsFile();
        if (!blob) continue;
        const canvasElement = document.createElement("canvas");
        const ctx = canvasElement.getContext('2d');
        const img = new Image();

        img.onload = function () {
            canvasElement.width = img.width;
            canvasElement.height = img.height;
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(img.src);
            onSuccess(canvasElement.toDataURL("image/png"));
        };

        const URLObj = window.URL || window.webkitURL;
        img.onerror = () => URLObj.revokeObjectURL(img.src);
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
    return new Promise((resolved, rejected) => {
        const image = new Image()
        image.onload = function () {
            resolved(image)
        };
        image.onerror = () => rejected(new Error('Could not decode image'));
        image.src = imageData
    });
}

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