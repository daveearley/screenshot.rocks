import React, {useRef, useState} from "react";
import {view} from "@risingstack/react-easy-state";
import {css} from "emotion";
import {FiCheck, FiChevronDown, FiCopy} from "react-icons/fi";
import {app} from "../../stores/appStore";
import {annotationStore} from "../../stores/annotationStore";
import {canvasStore} from "../../stores/canvasStore";
import {CanvasBackgroundTypes, ImageFormats} from "../../types";
import {copyImageToClipboard, downloadImage, renderPngBlob, supportsWebPExport} from "../../utils/image";
import {Button} from "../ui/controls";
import {Popover} from "../ui/Popover";
import {showToast} from "../ui/Toast";

const ALL_FORMATS: {format: ImageFormats, label: string, detail: string, quality: number}[] = [
    {format: ImageFormats.PNG, label: 'PNG', detail: 'Sharpest text, supports transparency', quality: 1},
    {format: ImageFormats.JPEG, label: 'JPEG', detail: 'Small files, no transparency', quality: .9},
    {format: ImageFormats.WebP, label: 'WebP', detail: 'Smaller than PNG, supports transparency', quality: .9},
    {format: ImageFormats.SVG, label: 'SVG', detail: 'The image inside an SVG file', quality: 1},
];
const FORMATS = ALL_FORMATS.filter(option => option.format !== ImageFormats.WebP || supportsWebPExport());

const FORMAT_KEY = 'exportFormat';
const readFormat = (): ImageFormats => {
    try {
        const saved = localStorage.getItem(FORMAT_KEY) as ImageFormats;
        return FORMATS.some(option => option.format === saved) ? saved : app.defaultImageFormat;
    } catch (_) { return app.defaultImageFormat; }
};

const styles = css`
  display: flex;
  align-items: center;
  gap: 8px;

  .split { display: flex; }
  .split > button:first-child { border-top-right-radius: 0; border-bottom-right-radius: 0; }
  .split > button:last-child {
    width: 26px;
    padding: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    box-shadow: inset 1px 0 0 rgba(255, 255, 255, .2);
  }
`;

const menuStyles = css`
  width: 248px;
  padding: 5px;

  button {
    display: grid;
    grid-template-columns: 18px 1fr;
    align-items: center;
    column-gap: 6px;
    width: 100%;
    padding: 6px 8px;
    border: 0;
    border-radius: var(--radius-s);
    background: none;
    color: var(--label);
    text-align: left;
    cursor: default;
  }
  button:hover, button:focus-visible { background: var(--accent); box-shadow: none; }
  button:hover small, button:focus-visible small { color: rgba(255, 255, 255, .8); }
  svg { width: 14px; height: 14px; }
  span { font-size: 13px; font-weight: 500; }
  small { grid-column: 2; color: var(--label-2); font-size: 11px; }
`;

const nextFrame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

export const ExportControls = view(() => {
    const [format, setFormatState] = useState<ImageFormats>(readFormat);
    const [menuOpen, setMenuOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const chevron = useRef<HTMLButtonElement>(null);
    const canCopy = typeof ClipboardItem !== 'undefined' && !!navigator.clipboard;
    const label = FORMATS.find(option => option.format === format).label;

    const setFormat = (next: ImageFormats) => {
        setFormatState(next);
        try { localStorage.setItem(FORMAT_KEY, next); } catch (_) { /* optional */ }
    };

    const run = async (copy: boolean, exportFormat: ImageFormats = format) => {
        const canvas = document.getElementById('canvas');
        if (!canvas || busy) return;
        setBusy(true);

        const transparent = app.canvasStyles.backgroundType === CanvasBackgroundTypes.None;
        const background = transparent ? (exportFormat === ImageFormats.JPEG && !copy ? '#ffffff' : 'transparent') : undefined;
        const transformers = canvasStore.stageRef ? canvasStore.stageRef.find('Transformer').toArray() : [];
        const editorOnly = canvasStore.stageRef ? canvasStore.stageRef.find('.editor-only').toArray() : [];
        // Selection chrome must never end up in the image.
        const prepare = async () => {
            annotationStore.selectAnnotation(null);
            annotationStore.setActiveTool(null);
            transformers.forEach(node => node.hide());
            editorOnly.forEach(node => node.hide());
            canvasStore.stageRef?.draw();
            await nextFrame();
        };

        try {
            if (copy) {
                // Started synchronously so the clipboard write counts as part of the click (required by Safari).
                await copyImageToClipboard(() => prepare().then(() => renderPngBlob(canvas, background)));
                showToast('Copied to clipboard');
            } else {
                await prepare();
                const {width, height} = app.getCanvasDimensions();
                const {quality, label} = FORMATS.find(option => option.format === exportFormat);
                await downloadImage(canvas, exportFormat, height, width, quality, background);
                app.hasDownloaded = true;
                showToast(`Exported ${label}`);
            }
        } catch (_) {
            showToast(copy ? 'Couldn’t copy the image. Try exporting instead.' : 'Couldn’t export the image. Please try again.', 'error');
        } finally {
            transformers.forEach(node => node.show());
            editorOnly.forEach(node => node.show());
            canvasStore.stageRef?.draw();
            setBusy(false);
        }
        if (!copy) {
            try { localStorage.setItem('hasDownloaded', 'true'); } catch (_) { /* optional */ }
        }
    };

    return (
        <div className={styles}>
            {canCopy && <Button disabled={!app.imageData || busy} onClick={() => run(true)} title="Copy image to clipboard" aria-label="Copy">
                <FiCopy/><span className="label">Copy</span>
            </Button>}
            <div className="split">
                <Button variant="primary" disabled={!app.imageData || busy} onClick={() => run(false)}>
                    {busy ? 'Exporting…' : `Export ${label}`}
                </Button>
                <Button ref={chevron} variant="primary" disabled={!app.imageData || busy} aria-label="Choose export format"
                        aria-haspopup="menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
                    <FiChevronDown/>
                </Button>
            </div>
            <Popover anchor={chevron.current} open={menuOpen} onClose={() => setMenuOpen(false)} align="end" label="Export format">
                <div className={menuStyles} role="menu">
                    {FORMATS.map(option => (
                        <button key={option.format} type="button" role="menuitemradio" aria-checked={option.format === format}
                                onClick={() => { setFormat(option.format); setMenuOpen(false); run(false, option.format); }}>
                            {option.format === format ? <FiCheck/> : <i/>}
                            <span>Export as {option.label}</span>
                            <small>{option.detail}</small>
                        </button>
                    ))}
                </div>
            </Popover>
        </div>
    );
});
