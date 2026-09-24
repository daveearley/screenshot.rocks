import React from "react";
import {view} from "@risingstack/react-easy-state";
import {css} from "emotion";
import {FiPlus, FiRepeat} from "react-icons/fi";
import {app, bgImages} from "../../stores/appStore";
import {historyStore} from "../../stores/historyStore";
import {CanvasBackgroundTypes} from "../../types";
import {Button, Row, Section, Segmented, SliderRow} from "../ui/controls";
import {ColorWell} from "../ui/ColorWell";
import {showToast} from "../ui/Toast";

/** A downscaled data URL, because blob: URLs don't survive a reload and settings are saved in local storage. */
const backgroundDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
        const scale = Math.min(1, 2400 / image.naturalWidth);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.naturalWidth * scale);
        canvas.height = Math.round(image.naturalHeight * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', .85));
    };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Unreadable image')); };
    image.src = url;
});

const checkpoint = () => historyStore.saveState();

const SOLIDS = [
    '#ffffff', '#f2f2f7', '#eae8e3', '#e9ddd3', '#dbe5dc', '#dcd9f4',
    '#dbe7f3', '#fde2e4', '#2d2a4a', '#0b3d2e', '#3a3a3c', '#15171b',
];

const GRADIENTS: [string, string][] = [
    ['#dcd9f4', '#f1e7e1'], ['#e7edf4', '#cddce9'], ['#fbc2eb', '#a6c1ee'], ['#f6d365', '#fda085'],
    ['#d4fc79', '#96e6a1'], ['#5e5ce6', '#bf5af2'], ['#2e3192', '#1bffff'], ['#141e30', '#243b55'],
];

const styles = css`
  .picker { margin-top: 14px; }

  .swatches { display: grid; grid-template-columns: repeat(6, minmax(0, 36px)); justify-content: space-between; gap: 8px; margin-bottom: 12px; }
  .swatch {
    aspect-ratio: 1;
    width: 100%;
    padding: 0;
    border: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .2);
    cursor: default;
    transition: transform .12s var(--ease);
  }
  .swatch:hover { transform: scale(1.08); }
  .swatch[aria-pressed="true"] { box-shadow: 0 0 0 2px var(--bg-sidebar), 0 0 0 4px var(--accent); }

  .gradients { grid-template-columns: repeat(4, minmax(0, 1fr)); justify-content: stretch; }
  .gradients .swatch { aspect-ratio: 1.6; border-radius: var(--radius-m); }

  .images { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .image {
    position: relative;
    aspect-ratio: 1.5;
    padding: 0;
    border: 0;
    border-radius: var(--radius-m);
    background-size: cover;
    background-position: center;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .1);
    overflow: hidden;
    cursor: default;
  }
  .image[aria-pressed="true"] { box-shadow: 0 0 0 2px var(--bg-sidebar), 0 0 0 4px var(--accent); }
  .image.upload { display: flex; align-items: center; justify-content: center; background: var(--fill); color: var(--label-2); }
  .image.upload:hover { background: var(--fill-hover); color: var(--label); }
  .image.upload svg { width: 18px; height: 18px; }
  .image.upload input { position: absolute; inset: 0; opacity: 0; cursor: default; }

  .gradient-colors { display: flex; align-items: center; gap: 6px; }

  .note { margin: 0; color: var(--label-2); font-size: 12px; line-height: 1.45; }
`;

const same = (a: string, b: string) => (a || '').toLowerCase() === (b || '').toLowerCase();

const SolidPicker = view(() => {
    const styles = app.canvasStyles;
    return <>
        <div className="swatches" role="group" aria-label="Background colors">
            {SOLIDS.map(color => (
                <button key={color} type="button" className="swatch" aria-label={color} aria-pressed={same(styles.bgColor, color)}
                        style={{background: color}} onClick={() => { checkpoint(); styles.bgColor = color; }}/>
            ))}
        </div>
        <Row label="Color">
            <ColorWell label="Background color" value={styles.bgColor} onStart={checkpoint} onChange={hex => styles.bgColor = hex}/>
        </Row>
    </>;
});

const GradientPicker = view(() => {
    const styles = app.canvasStyles;
    return <>
        <div className="swatches gradients" role="group" aria-label="Background gradients">
            {GRADIENTS.map(([one, two]) => (
                <button key={one + two} type="button" className="swatch" aria-label={`${one} to ${two}`}
                        aria-pressed={same(styles.gradientColorOne, one) && same(styles.gradientColorTwo, two)}
                        style={{background: `linear-gradient(-${styles.gradientAngle}deg, ${one}, ${two})`}}
                        onClick={() => { checkpoint(); styles.gradientColorOne = one; styles.gradientColorTwo = two; }}/>
            ))}
        </div>
        <Row label="Colors">
            <div className="gradient-colors">
                <ColorWell label="Gradient start color" value={styles.gradientColorOne} onStart={checkpoint} onChange={hex => styles.gradientColorOne = hex}/>
                <Button icon variant="plain" title="Swap colors" aria-label="Swap gradient colors" onClick={() => {
                    checkpoint();
                    [styles.gradientColorOne, styles.gradientColorTwo] = [styles.gradientColorTwo, styles.gradientColorOne];
                }}><FiRepeat/></Button>
                <ColorWell label="Gradient end color" value={styles.gradientColorTwo} onStart={checkpoint} onChange={hex => styles.gradientColorTwo = hex}/>
            </div>
        </Row>
        <SliderRow id="gradient-angle" label="Angle" value={styles.gradientAngle} min={0} max={360} defaultValue={45} suffix="°"
                   onStart={checkpoint} onChange={value => styles.gradientAngle = value}/>
    </>;
});

const ImagePicker = view(() => {
    const styles = app.canvasStyles;
    const upload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        event.target.value = '';
        if (!file) return;
        backgroundDataUrl(file).then(dataUrl => {
            checkpoint();
            styles.bgImage = dataUrl;
        }).catch(() => showToast('Couldn’t open that image. Try a PNG or JPEG.', 'error'));
    };
    return (
        <div className="images" role="group" aria-label="Background images">
            {bgImages.map((image, index) => (
                <button key={image} type="button" className="image" aria-label={`Background image ${index + 1}`}
                        aria-pressed={styles.bgImage === image} style={{backgroundImage: `url(${image}.small.png)`}}
                        onClick={() => { checkpoint(); styles.bgImage = image; }}/>
            ))}
            {!bgImages.includes(styles.bgImage) && styles.bgImage &&
                <button type="button" className="image" aria-label="Your background image" aria-pressed="true"
                        style={{backgroundImage: `url(${styles.bgImage})`}}/>}
            <label className="image upload" title="Choose an image">
                <FiPlus/>
                <input type="file" accept="image/*" aria-label="Upload background image" onChange={upload}/>
            </label>
        </div>
    );
});

const backgroundOptions = [
    {value: CanvasBackgroundTypes.Solid, label: 'Color'},
    {value: CanvasBackgroundTypes.Gradient, label: 'Gradient'},
    {value: CanvasBackgroundTypes.Image, label: 'Image'},
    {value: CanvasBackgroundTypes.None, label: 'None'},
];

export const BackgroundSection = view(() => {
    const type = app.canvasStyles.backgroundType;
    return (
        <Section id="background" title="Background">
            <div className={styles}>
                <Segmented label="Background type" options={backgroundOptions} value={type}
                           onChange={value => { if (value !== type) { checkpoint(); app.canvasStyles.backgroundType = value; } }}/>
                <div className="picker">
                    {type === CanvasBackgroundTypes.Solid && <SolidPicker/>}
                    {type === CanvasBackgroundTypes.Gradient && <GradientPicker/>}
                    {type === CanvasBackgroundTypes.Image && <ImagePicker/>}
                    {type === CanvasBackgroundTypes.None &&
                        <p className="note">The background is transparent in PNG, WebP and SVG exports. JPEG files use white.</p>}
                </div>
            </div>
        </Section>
    );
});
