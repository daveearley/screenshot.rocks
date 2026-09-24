import {store} from "@risingstack/react-easy-state";

export interface IFont {
    id: string;
    name: string;
    family: string;
    bunny?: string;
    boldable: boolean;
}

/** Served by Bunny Fonts, and only fetched when a font is used or the font menu opens. */
export const FONTS: IFont[] = [
    {id: 'system', name: 'System', family: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif', boldable: true},
    {id: 'inter', name: 'Inter', family: '"Inter", sans-serif', bunny: 'inter:400,700', boldable: true},
    {id: 'dm-sans', name: 'DM Sans', family: '"DM Sans", sans-serif', bunny: 'dm-sans:400,700', boldable: true},
    {id: 'space-grotesk', name: 'Space Grotesk', family: '"Space Grotesk", sans-serif', bunny: 'space-grotesk:400,700', boldable: true},
    {id: 'playfair-display', name: 'Playfair Display', family: '"Playfair Display", serif', bunny: 'playfair-display:400,700', boldable: true},
    {id: 'lora', name: 'Lora', family: '"Lora", serif', bunny: 'lora:400,700', boldable: true},
    {id: 'jetbrains-mono', name: 'JetBrains Mono', family: '"JetBrains Mono", monospace', bunny: 'jetbrains-mono:400,700', boldable: true},
    {id: 'bebas-neue', name: 'Bebas Neue', family: '"Bebas Neue", sans-serif', bunny: 'bebas-neue:400', boldable: false},
    {id: 'caveat', name: 'Caveat', family: '"Caveat", cursive', bunny: 'caveat:400,700', boldable: true},
    {id: 'permanent-marker', name: 'Permanent Marker', family: '"Permanent Marker", cursive', bunny: 'permanent-marker:400', boldable: false},
];

export const DEFAULT_FONT_ID = 'system';
const BUNNY_CSS = 'https://fonts.bunny.net/css';

export const getFont = (id?: string): IFont => FONTS.find(font => font.id === id) || FONTS[0];

/** Bumps whenever a font finishes loading so canvas text can re-measure and redraw. */
export const fontStore = store({version: 0});

const requested = new Set<string>();
const pending = new Map<string, Promise<void>>();

const addStylesheet = (families: string[]) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${BUNNY_CSS}?family=${families.join('|')}&display=swap`;
    link.dataset.fonts = 'bunny';
    document.head.appendChild(link);
    return new Promise<void>(resolve => {
        link.onload = () => resolve();
        link.onerror = () => resolve(); // Fall back to the next family in the stack.
    });
};

const waitForFaces = async (font: IFont) => {
    if (!('fonts' in document)) return;
    const name = font.family.split(',')[0];
    const weights = font.boldable ? ['400', '700'] : ['400'];
    try {
        await Promise.all(weights.map(weight => (document as any).fonts.load(`${weight} 32px ${name}`)));
    } catch (_) { /* The fallback family will be used. */ }
};

export const loadFont = (id?: string): Promise<void> => {
    const font = getFont(id);
    if (!font.bunny) return Promise.resolve();
    if (pending.has(font.id)) return pending.get(font.id);
    const stylesheet = requested.has(font.id) ? Promise.resolve() : addStylesheet([font.bunny]);
    requested.add(font.id);
    const promise = stylesheet.then(() => waitForFaces(font)).then(() => { fontStore.version++; });
    pending.set(font.id, promise);
    return promise;
};

export const loadFontPreviews = () => {
    const missing = FONTS.filter(font => font.bunny && !requested.has(font.id));
    if (!missing.length) return;
    missing.forEach(font => requested.add(font.id));
    addStylesheet(missing.map(font => font.bunny)).then(() => { fontStore.version++; });
};
