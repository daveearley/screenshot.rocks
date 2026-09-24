import React, {useEffect, useRef, useState} from "react";
import {css, cx} from "emotion";
import {ColorResult, CustomPicker} from "react-color";
import {Alpha, Hue, Saturation} from "react-color/lib/components/common";
import {Popover} from "./Popover";
import {fieldStyles} from "./controls";

const checkerboard = 'repeating-conic-gradient(#8e8e93 0% 25%, #d1d1d6 0% 50%) 0 0 / 8px 8px';

export const DEFAULT_SWATCHES = [
    '#ffffff', '#eae8e3', '#d1d1d6', '#8e8e93', '#3a3a3c', '#15171b',
    '#ff453a', '#ff9f0a', '#ffd60a', '#30d158', '#64d2ff', '#0a84ff',
    '#5e5ce6', '#bf5af2', '#ff375f', '#dbe5dc', '#dcd9f4', '#e9ddd3',
];

export const parseHex = (value: string) => {
    const hex = (value || '').replace('#', '').trim();
    const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex;
    if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(full)) return null;
    return {
        r: parseInt(full.slice(0, 2), 16),
        g: parseInt(full.slice(2, 4), 16),
        b: parseInt(full.slice(4, 6), 16),
        a: full.length === 8 ? Math.round(parseInt(full.slice(6, 8), 16) / 255 * 100) / 100 : 1,
    };
};

const toHex = ({r, g, b, a = 1}: {r: number, g: number, b: number, a?: number}) => {
    const pair = (n: number) => Math.round(n).toString(16).padStart(2, '0');
    return `#${pair(r)}${pair(g)}${pair(b)}${a < 1 ? pair(a * 255) : ''}`;
};

const wellStyles = css`
  position: relative;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: ${checkerboard};
  overflow: hidden;
  cursor: default;

  span { position: absolute; inset: 0; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .16); border-radius: inherit; }
  &[aria-expanded="true"] { box-shadow: var(--focus-ring); }
`;

const pickerStyles = css`
  width: 232px;
  padding: 12px;

  .saturation { position: relative; height: 140px; border-radius: var(--radius-m); overflow: hidden; }
  .slider { position: relative; height: 12px; margin-top: 12px; border-radius: 6px; overflow: hidden; }
  .slider > div, .slider .hue-horizontal { border-radius: 6px; }
  .alpha-track { position: absolute; inset: 0; background: ${checkerboard}; border-radius: 6px; }

  .pointer {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 0 .5px rgba(0, 0, 0, .3), 0 1px 3px rgba(0, 0, 0, .4);
    transform: translate(-7px, -7px);
  }
  .slider .pointer { transform: translate(-7px, -1px); }

  .hex-row { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
  .hex-row label { color: var(--label-2); font-size: 12px; }
  .hex-row input { flex: 1; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: uppercase; }

  .swatches { display: grid; grid-template-columns: repeat(9, 1fr); gap: 6px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--separator); }
  .swatches button {
    aspect-ratio: 1;
    width: 100%;
    padding: 0;
    border: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .14);
    cursor: default;
    transition: transform .12s var(--ease);
  }
  .swatches button:hover { transform: scale(1.12); }
  .swatches button[aria-pressed="true"] { box-shadow: 0 0 0 2px var(--bg-popover), 0 0 0 3.5px var(--label); }
`;

const Pointer = () => <div className="pointer"/>;

// react-color's typings for the common building blocks are incomplete; they need the injected hsl/hsv props.
const SaturationArea = Saturation as any;
const HueSlider = Hue as any;
const AlphaSlider = Alpha as any;

const Picker = CustomPicker((props: any) => (
    <>
        <div className="saturation"><SaturationArea {...props} pointer={Pointer}/></div>
        <div className="slider"><HueSlider {...props} direction="horizontal" pointer={Pointer}/></div>
        {props.showAlpha && <div className="slider">
            <div className="alpha-track"/>
            <AlphaSlider {...props} pointer={Pointer}/>
        </div>}
    </>
)) as any;

interface ColorWellProps {
    label: string;
    value: string;
    onChange: (hex: string) => void;
    /** Called when the picker opens, so one editing session is one undo step. */
    onStart?: () => void;
    swatches?: string[];
    showAlpha?: boolean;
    className?: string;
}

export const ColorWell = ({label, value, onChange, onStart, swatches = DEFAULT_SWATCHES, showAlpha = true, className}: ColorWellProps) => {
    const anchor = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const rgba = parseHex(value) || {r: 0, g: 0, b: 0, a: 1};
    const [hexDraft, setHexDraft] = useState(value);
    useEffect(() => setHexDraft(toHex(rgba).toUpperCase()), [value]); // eslint-disable-line react-hooks/exhaustive-deps

    const commitHex = () => {
        const parsed = parseHex(hexDraft);
        if (parsed) onChange(toHex(parsed)); else setHexDraft(toHex(rgba).toUpperCase());
    };

    return (
        <>
            <button ref={anchor} type="button" className={cx(wellStyles, className)} aria-label={label} aria-haspopup="dialog"
                    aria-expanded={open} onClick={() => { if (!open && onStart) onStart(); setOpen(!open); }}>
                <span style={{background: toHex(rgba)}}/>
            </button>
            <Popover anchor={anchor.current} open={open} onClose={() => setOpen(false)} label={label} placement="bottom" align="end">
                <div className={pickerStyles}>
                    <Picker color={rgba} showAlpha={showAlpha}
                            onChange={(color: ColorResult) => onChange(toHex({...color.rgb, a: showAlpha ? color.rgb.a : 1}))}/>
                    <div className="hex-row">
                        <label htmlFor={`${label}-hex`}>Hex</label>
                        <input id={`${label}-hex`} className={fieldStyles} value={hexDraft} spellCheck={false}
                               onChange={event => setHexDraft(event.target.value)} onBlur={commitHex}
                               onKeyDown={event => { if (event.key === 'Enter') commitHex(); }}/>
                    </div>
                    {swatches.length > 0 && <div className="swatches">
                        {swatches.map(swatch => (
                            <button key={swatch} type="button" aria-label={swatch} aria-pressed={swatch.toLowerCase() === toHex(rgba)}
                                    style={{background: swatch}} onClick={() => onChange(swatch)}/>
                        ))}
                    </div>}
                </div>
            </Popover>
        </>
    );
};
