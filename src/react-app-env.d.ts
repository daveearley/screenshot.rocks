/// <reference types="react-scripts" />
declare module 'dom-to-image';

declare class ClipboardItem {
    constructor(data: { [mimeType: string]: Blob });
}

interface Clipboard extends EventTarget {
    readText(): Promise<string>;
    writeText(data: string): Promise<void>;
    write(data: ClipboardItem): Promise<void>;
}
