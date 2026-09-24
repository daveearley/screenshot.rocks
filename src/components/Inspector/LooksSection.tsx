import React, {useRef, useState} from "react";
import {view} from "@risingstack/react-easy-state";
import {css} from "emotion";
import {FiPlus, FiX} from "react-icons/fi";
import {presetsStore} from "../../stores/presetsStore";
import {app} from "../../stores/appStore";
import {IPreset} from "../../types/presets";
import {CanvasBackgroundTypes, ScreenshotType} from "../../types";
import {Section, Button, fieldStyles} from "../ui/controls";
import {Popover} from "../ui/Popover";

const styles = css`
  .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px 8px; }

  .look {
    position: relative;
    min-width: 0;
    padding: 0;
    border: 0;
    background: none;
    color: var(--label-2);
    text-align: center;
    cursor: default;
  }
  .look .thumb {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1 / 1;
    border-radius: var(--radius-m);
    background-size: cover;
    background-position: center;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .08);
    overflow: hidden;
    transition: box-shadow .15s, transform .15s var(--ease);
  }
  .look:hover .thumb { transform: translateY(-1px); }
  .look:focus-visible { box-shadow: none; }
  .look:focus-visible .thumb { box-shadow: var(--focus-ring); }
  .look[aria-pressed="true"] .thumb { box-shadow: 0 0 0 2px var(--bg-sidebar), 0 0 0 4px var(--accent); }
  .look .name { display: block; margin-top: 5px; font-size: 11px; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .look[aria-pressed="true"] .name { color: var(--label); }

  .mini { overflow: hidden; background: #fff; box-shadow: 0 2px 6px rgba(0, 0, 0, .18); }
  .mini img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top; }
  .mini.browser { width: 76%; height: 52%; border-radius: 3px; border-top: 5px solid #f3f3f5; }
  .mini.browser.dark { border-top-color: #2a2b30; }
  .mini.device { width: 34%; height: 76%; border-radius: 6px; border: 2px solid #1b1b1e; }
  .mini.none { width: 76%; height: 56%; border-radius: 3px; }

  .delete {
    position: absolute;
    top: -5px;
    right: -5px;
    display: none;
    width: 18px;
    height: 18px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: var(--bg-elevated);
    color: var(--label);
    box-shadow: 0 1px 3px rgba(0, 0, 0, .4);
    align-items: center;
    justify-content: center;
    svg { width: 11px; height: 11px; }
  }
  .look:hover .delete, .look:focus-within .delete { display: flex; }
`;

const saveStyles = css`
  width: 240px;
  padding: 14px;
  h3 { margin: 0 0 4px; font-size: 13px; font-weight: 600; }
  p { margin: 0 0 12px; color: var(--label-2); font-size: 12px; line-height: 1.4; }
  input { width: 100%; height: 28px; font-size: 13px; }
  .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
`;

const background = (preset: IPreset) => {
    const b = preset.backgroundSettings;
    switch (b.backgroundType) {
        case CanvasBackgroundTypes.Gradient:
            return `linear-gradient(-${b.gradientAngle || 45}deg, ${b.gradientColorOne}, ${b.gradientColorTwo})`;
        case CanvasBackgroundTypes.Image:
            return `url(${b.bgImage}) center / cover`;
        case CanvasBackgroundTypes.None:
            return 'repeating-conic-gradient(#3a3a3c 0% 25%, #2c2c2e 0% 50%) 0 0 / 10px 10px';
        default:
            return b.bgColor || '#fff';
    }
};

const Look = view(({preset}: {preset: IPreset}) => {
    const frame = preset.frameSettings?.frameType || ScreenshotType.Browser;
    const kind = frame === ScreenshotType.Device ? 'device' : frame === ScreenshotType.None ? 'none' : 'browser';
    const dark = preset.frameSettings?.browserTheme === '1';
    return (
        <div className="look" role="button" tabIndex={0} aria-label={`Apply ${preset.name} look`}
             aria-pressed={presetsStore.selectedPresetId === preset.id}
             onClick={() => presetsStore.applyPreset(preset.id)}
             onKeyDown={event => {
                 if (event.target !== event.currentTarget) return; // e.g. Enter on the delete button
                 if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); presetsStore.applyPreset(preset.id); }
             }}>
            <span className="thumb" style={{background: background(preset)}}>
                <span className={`mini ${kind} ${dark ? 'dark' : ''}`}>
                    <img alt="" draggable={false} src={app.croppedImageData || app.imageData || '/images/demo-image.png'}/>
                </span>
            </span>
            <span className="name">{preset.name}</span>
            {!preset.isBuiltIn && <button type="button" className="delete" aria-label={`Delete ${preset.name} look`}
                                          onClick={event => { event.stopPropagation(); presetsStore.deletePreset(preset.id); }}>
                <FiX/>
            </button>}
        </div>
    );
});

export const LooksSection = view(() => {
    const addButton = useRef<HTMLButtonElement>(null);
    const [saving, setSaving] = useState(false);
    const [name, setName] = useState('');

    const save = (event: React.FormEvent) => {
        event.preventDefault();
        if (!name.trim()) return;
        const preset = presetsStore.saveCurrentAsPreset(name.trim());
        presetsStore.selectedPresetId = preset.id;
        setName('');
        setSaving(false);
    };

    return (
        <Section id="looks" title="Looks" accessory={
            <Button ref={addButton} variant="plain" icon aria-label="Save current look" title="Save current look"
                    aria-expanded={saving} onClick={() => setSaving(!saving)}><FiPlus/></Button>
        }>
            <div className={styles}>
                <div className="grid">
                    {presetsStore.getAllPresets().map(preset => <Look key={preset.id} preset={preset}/>)}
                </div>
            </div>
            <Popover anchor={addButton.current} open={saving} onClose={() => setSaving(false)} label="Save look" align="center">
                <form className={saveStyles} onSubmit={save}>
                    <h3>Save look</h3>
                    <p>Keep this frame, background and layout to reuse on other screenshots.</p>
                    <input className={fieldStyles} aria-label="Look name" placeholder="Name" autoFocus value={name}
                           onChange={event => setName(event.target.value)}/>
                    <div className="actions">
                        <Button onClick={() => setSaving(false)}>Cancel</Button>
                        <Button type="submit" variant="primary" disabled={!name.trim()}>Save</Button>
                    </div>
                </form>
            </Popover>
        </Section>
    );
});
