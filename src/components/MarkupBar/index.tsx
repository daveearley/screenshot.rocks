import React, {useRef, useState} from "react";
import {view} from "@risingstack/react-easy-state";
import {css, cx} from "emotion";
import {FiArrowUpRight, FiBold, FiChevronDown, FiCircle, FiDroplet, FiHash, FiMousePointer, FiSquare, FiTrash2, FiType} from "react-icons/fi";
import {annotationStore, MARKUP_COLORS, STROKE_WIDTHS} from "../../stores/annotationStore";
import {AnnotationType} from "../../types/annotations";
import {historyStore} from "../../stores/historyStore";
import {FONTS, fontStore, getFont, loadFontPreviews} from "../../utils/fonts";
import {Button, NumberField} from "../ui/controls";
import {Popover} from "../ui/Popover";
import {ColorWell} from "../ui/ColorWell";

const TOOLS = [
    {tool: null, label: 'Select', shortcut: 'V', icon: <FiMousePointer/>},
    {tool: AnnotationType.Text, label: 'Text', shortcut: 'T', icon: <FiType/>},
    {tool: AnnotationType.Rectangle, label: 'Rectangle', shortcut: 'R', icon: <FiSquare/>},
    {tool: AnnotationType.Circle, label: 'Ellipse', shortcut: 'O', icon: <FiCircle/>},
    {tool: AnnotationType.Arrow, label: 'Arrow', shortcut: 'A', icon: <FiArrowUpRight/>},
    {tool: AnnotationType.Blur, label: 'Blur', shortcut: 'B', icon: <FiDroplet/>},
    {tool: AnnotationType.Callout, label: 'Numbered step', shortcut: 'N', icon: <FiHash/>},
];
export const MARKUP_SHORTCUTS = TOOLS.reduce((map, {tool, shortcut}) => ({...map, [shortcut.toLowerCase()]: tool}), {} as {[key: string]: AnnotationType | null});

const styles = css`
  display: flex;
  align-items: center;
  gap: 2px;
  height: 40px;
  padding: 0 6px;
  border-radius: 12px;
  background: rgba(44, 44, 46, .88);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  box-shadow: var(--shadow-popover);
  animation: markup-in .18s var(--ease);

  @keyframes markup-in {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: none; }
  }

  .tool[aria-pressed="true"] { background: var(--accent); color: white; }
  .separator { width: 1px; height: 20px; margin: 0 6px; background: var(--separator-strong); }

  .color {
    width: 22px;
    height: 22px;
    margin: 0 4px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(44, 44, 46, .9), 0 0 0 3.5px rgba(255, 255, 255, .5);
    cursor: default;
  }

  .context { display: flex; align-items: center; gap: 2px; width: 252px; }
  .context .end { margin-left: auto; }
  .font { width: 132px; justify-content: space-between; }
  .font span { overflow: hidden; text-overflow: ellipsis; }
  .size { width: 44px; text-align: center; }
  .stroke-preview { display: block; width: 18px; border-radius: 4px; background: currentColor; }
`;

const menuStyles = css`
  padding: 5px;
  min-width: 180px;

  button {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 6px 10px;
    border: 0;
    border-radius: var(--radius-s);
    background: none;
    color: var(--label);
    font-size: 15px;
    text-align: left;
    white-space: nowrap;
    cursor: default;
  }
  button:hover, button:focus-visible { background: var(--accent); box-shadow: none; }
  button[aria-checked="true"]::after { content: "✓"; margin-left: auto; font-size: 13px; font-family: var(--font-ui); }
  .stroke-preview { display: block; width: 36px; border-radius: 8px; background: currentColor; }
  .stroke-label { font-size: 13px; font-family: var(--font-ui); }
`;

const colorStyles = css`
  display: grid;
  grid-template-columns: repeat(4, 28px);
  gap: 10px;
  padding: 12px;

  button {
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .18);
    cursor: default;
  }
  button[aria-pressed="true"] { box-shadow: 0 0 0 2px var(--bg-popover), 0 0 0 4px var(--label); }
  .custom { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--separator); color: var(--label-2); font-size: 12px; }
`;

const ColorControl = view(() => {
    const anchor = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const color = annotationStore.activeColor;
    return <>
        <button ref={anchor} type="button" className="color" aria-label="Markup color" title="Color" aria-expanded={open}
                style={{background: color}} onClick={() => setOpen(!open)}/>
        <Popover anchor={anchor.current} open={open} onClose={() => setOpen(false)} label="Markup color" align="center">
            <div className={colorStyles}>
                {MARKUP_COLORS.map(swatch => (
                    <button key={swatch} type="button" aria-label={swatch} aria-pressed={swatch === color} style={{background: swatch}}
                            onClick={() => { annotationStore.setActiveColor(swatch); setOpen(false); }}/>
                ))}
                <div className="custom">Custom
                    <ColorWell label="Custom markup color" value={color} showAlpha={false} swatches={[]}
                               onStart={() => { if (annotationStore.selectedAnnotationId) historyStore.saveState(); }}
                               onChange={hex => annotationStore.setActiveColor(hex, false)}/>
                </div>
            </div>
        </Popover>
    </>;
});

const StrokeControl = view(() => {
    const anchor = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const current = annotationStore.activeStrokeWidth;
    return <>
        <Button ref={anchor} icon variant="plain" aria-label="Line width" title="Line width" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span className="stroke-preview" style={{height: Math.max(2, Math.min(8, current / 2))}}/>
        </Button>
        <Popover anchor={anchor.current} open={open} onClose={() => setOpen(false)} label="Line width" align="center">
            <div className={menuStyles} role="menu">
                {STROKE_WIDTHS.map(({width, label}) => (
                    <button key={width} type="button" role="menuitemradio" aria-checked={width === current}
                            onClick={() => { annotationStore.setActiveStrokeWidth(width); setOpen(false); }}>
                        <span className="stroke-preview" style={{height: Math.max(2, Math.min(10, width / 1.6))}}/>
                        <span className="stroke-label">{label}</span>
                    </button>
                ))}
            </div>
        </Popover>
    </>;
});

const TextControls = view(() => {
    const anchor = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const font = getFont(annotationStore.activeFontId);
    void fontStore.version; // re-render previews as fonts arrive
    return <>
        <Button ref={anchor} className="font" aria-label={`Font: ${font.name}`} title="Font" aria-expanded={open}
                onClick={() => { if (!open) loadFontPreviews(); setOpen(!open); }}>
            <span>{font.name}</span><FiChevronDown/>
        </Button>
        <Popover anchor={anchor.current} open={open} onClose={() => setOpen(false)} label="Font">
            <div className={menuStyles} role="menu">
                {FONTS.map(option => (
                    <button key={option.id} type="button" role="menuitemradio" aria-checked={option.id === font.id}
                            style={{fontFamily: option.family}}
                            onClick={() => { annotationStore.setActiveFont(option.id); setOpen(false); }}>
                        {option.name}
                    </button>
                ))}
            </div>
        </Popover>
        <NumberField className="size" label="Font size" value={annotationStore.activeFontSize} min={8} max={400}
                     onCommit={size => annotationStore.setActiveFontSize(size)}/>
        <Button icon variant="plain" aria-label="Bold" title="Bold" disabled={!font.boldable}
                aria-pressed={annotationStore.activeBold && font.boldable} onClick={() => annotationStore.setActiveBold(!annotationStore.activeBold)}>
            <FiBold/>
        </Button>
    </>;
});

export const MarkupBar = view(({className}: {className?: string}) => {
    const selected = annotationStore.getSelectedAnnotation();
    const context = annotationStore.activeTool || selected?.type || null;
    const showText = context === AnnotationType.Text;
    const showStroke = context === AnnotationType.Rectangle || context === AnnotationType.Circle || context === AnnotationType.Arrow;

    return (
        <div className={cx(styles, className)} role="toolbar" aria-label="Markup tools" data-export-exclude="true">
            {TOOLS.map(({tool, label, shortcut, icon}) => (
                <Button key={label} icon variant="plain" className="tool" aria-label={label} title={`${label} (${shortcut})`}
                        aria-pressed={annotationStore.activeTool === tool}
                        onClick={() => annotationStore.setActiveTool(tool)}>
                    {icon}
                </Button>
            ))}
            <span className="separator"/>
            <div className="context">
                <ColorControl/>
                {showStroke && <StrokeControl/>}
                {showText && <><span className="separator"/><TextControls/></>}
                <Button icon variant="plain" className="end" aria-label="Delete selected markup" title="Delete (⌫)"
                        disabled={!selected} onClick={() => selected && annotationStore.deleteAnnotation(selected.id)}><FiTrash2/></Button>
            </div>
        </div>
    );
});
