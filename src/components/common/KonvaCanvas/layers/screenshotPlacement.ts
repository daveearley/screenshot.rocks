export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ScreenshotPlacement {
    image: HTMLImageElement;
    /** Where the full image is drawn, in canvas coordinates (can extend past `visible` for object-fit: cover). */
    drawn: Rect;
    visible: Rect;
}

export const intersect = (a: Rect, b: Rect): Rect | null => {
    const x = Math.max(a.x, b.x), y = Math.max(a.y, b.y);
    const right = Math.min(a.x + a.width, b.x + b.width), bottom = Math.min(a.y + a.height, b.y + b.height);
    return right > x && bottom > y ? {x, y, width: right - x, height: bottom - y} : null;
};

/** Measures the screenshot's DOM position in canvas coordinates. Tilted frames are approximated by their bounding box. */
export const measureScreenshot = (): ScreenshotPlacement | null => {
    const canvas = document.getElementById('canvas');
    const image = canvas?.querySelector('.manipulable-frame img') as HTMLImageElement | null;
    if (!canvas || !image || !image.complete || !image.naturalWidth || !canvas.offsetWidth) return null;

    const canvasRect = canvas.getBoundingClientRect();
    const previewScale = canvasRect.width / canvas.offsetWidth;
    const box = image.getBoundingClientRect();
    const visible = {
        x: (box.left - canvasRect.left) / previewScale,
        y: (box.top - canvasRect.top) / previewScale,
        width: box.width / previewScale,
        height: box.height / previewScale,
    };

    const style = getComputedStyle(image);
    if (style.objectFit !== 'cover') return {image, drawn: visible, visible};

    const scale = Math.max(visible.width / image.naturalWidth, visible.height / image.naturalHeight);
    const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
    const top = style.objectPosition.split(' ')[1] === '0%'; // computed as "50% 0%" for `top`
    return {
        image,
        visible,
        drawn: {
            x: visible.x + (visible.width - width) / 2,
            y: top ? visible.y : visible.y + (visible.height - height) / 2,
            width,
            height,
        },
    };
};
