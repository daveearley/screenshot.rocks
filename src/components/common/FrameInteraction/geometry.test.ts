import {dragPosition, resizedScale} from './geometry';
test('drag tracks the mouse at different preview scales', () => {
    expect(dragPosition(0, 100, 1600, .5)).toBe(12.5);
    expect(dragPosition(0, 50, 1600, .25)).toBe(12.5);
    expect(dragPosition(10, -40, 1000, .4)).toBe(0);
});
test('drag stays within positioning limits', () => {
    expect(dragPosition(70, 500, 1000, .5)).toBe(75);
    expect(dragPosition(-70, -500, 1000, .5)).toBe(-75);
});
test('corner resize preserves ratio and supports opposite corners', () => {
    expect(resizedScale(80, 50, 25, 400, 200, 'br')).toBe(100);
    expect(resizedScale(80, -50, -25, 400, 200, 'tl')).toBe(100);
    expect(resizedScale(80, -500, -250, 400, 200, 'br')).toBe(20);
});

import {fittedImageWidth} from './geometry';
test('fits a tall browser capture including its toolbar', () => {
    const width = fittedImageWidth(400, 2400, 1600, 1000, 50);
    expect(width / (400 / 2400) + 50).toBeCloseTo(1000);
    expect(fittedImageWidth(2400, 400, 1600, 1000, 50)).toBe(1600);
});
