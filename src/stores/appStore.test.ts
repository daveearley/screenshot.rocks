import {app} from './appStore';
import {getImageDimensions} from '../utils/image';
import {routeStore, Routes} from './routeStore';
import {ScreenshotType} from '../types';
jest.mock('../utils/image', () => ({getImageDimensions: jest.fn(() => Promise.resolve({width: 1600, height: 900}))}));

test('replacement imports clear stale crops and open the editor', async () => {
    app.croppedImageData = 'old-crop';
    app.cropIsActive = true;
    routeStore.currentRoute = Routes.Home;
    const navigate = jest.spyOn(routeStore, 'goToRoute');
    app.setImageData('new-image');
    await Promise.resolve();
    expect(app.imageData).toBe('new-image');
    expect(app.originalImageData).toBe('new-image');
    expect(app.croppedImageData).toBeNull();
    expect(app.cropIsActive).toBe(false);
    expect(navigate).toHaveBeenCalledWith(Routes.App);
    navigate.mockRestore();
});
test('portrait imports select a device frame', async () => {
    (getImageDimensions as jest.Mock).mockResolvedValue({width: 600, height: 1200});
    app.setImageData('portrait');
    await Promise.resolve();
    expect(app.frameType).toBe(ScreenshotType.Device);
});
