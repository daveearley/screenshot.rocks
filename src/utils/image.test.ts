import {checkForImageFromLocalstorageUrlOrPaste, retrieveImageFromClipboardAsBase64} from './image';
import {app} from '../stores/appStore';
jest.mock('../stores/appStore', () => ({app: {setImageData: jest.fn()}}));

beforeEach(() => { sessionStorage.clear(); jest.clearAllMocks(); });
test('imports the existing extension session payload once', () => {
    const image = 'data:image/png;base64,aGVsbG8=';
    sessionStorage.setItem('imageFromPost', image);
    const cleanup = checkForImageFromLocalstorageUrlOrPaste();
    expect(app.setImageData).toHaveBeenCalledWith(image);
    expect(sessionStorage.getItem('imageFromPost')).toBeNull();
    cleanup();
    checkForImageFromLocalstorageUrlOrPaste()();
    expect(app.setImageData).toHaveBeenCalledTimes(1);
});
test('ignores invalid old extension payloads', () => {
    sessionStorage.setItem('imageFromPost', 'null');
    checkForImageFromLocalstorageUrlOrPaste()();
    expect(app.setImageData).not.toHaveBeenCalled();
});
test('ignores clipboard events without image data', () => {
    expect(() => retrieveImageFromClipboardAsBase64(new Event('paste'), jest.fn())).not.toThrow();
});
