export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function dragPosition(start: number, delta: number, canvasPixels: number, previewScale: number) {
    return clamp(start + delta / (canvasPixels * previewScale) * 100, -75, 75);
}

export function resizedScale(start: number, dx: number, dy: number, width: number, height: number, corner: string) {
    const x = corner.includes('r') ? dx : -dx;
    const y = corner.includes('b') ? dy : -dy;
    // Project the drag onto the corner diagonal, preserving the image's aspect ratio.
    return clamp(start * (1 + 2 * (x * width + y * height) / (width * width + height * height)), 20, 250);
}

export function fittedImageWidth(imageWidth: number, imageHeight: number, canvasWidth: number, canvasHeight: number, chromeHeight = 0) {
    const ratio = imageWidth / Math.max(1, imageHeight);
    return Math.max(1, Math.min(canvasWidth, Math.max(1, canvasHeight - chromeHeight) * ratio));
}
