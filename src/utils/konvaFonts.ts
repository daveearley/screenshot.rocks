import Konva from 'konva';

/**
 * Konva 7 wraps `fontFamily` in quotes when building the canvas font string, so a family list such as
 * `"Inter", sans-serif` becomes invalid and the canvas silently falls back to 10px sans-serif. Konva 8 normalises
 * family lists; this applies the same behaviour. Remove once react-konva allows Konva 8+.
 */
const TextPrototype = Konva.Text.prototype as any;
if (!TextPrototype.__familyListPatched) {
    const original = TextPrototype._getContextFont;
    TextPrototype._getContextFont = function () {
        const family: string = this.fontFamily();
        if (!/[,"']/.test(family)) return original.call(this);
        return `${this.fontStyle()} ${this.fontVariant()} ${this.fontSize()}px ${family}`;
    };
    TextPrototype.__familyListPatched = true;
}
