import React, {useRef, useState, useEffect} from 'react';
import {view} from '@risingstack/react-easy-state';
import {css} from 'emotion';
import {app} from '../../../stores/appStore';
import {annotationStore} from '../../../stores/annotationStore';
import {historyStore} from '../../../stores/historyStore';
import {ScreenshotType} from '../../../types';
import {browserStore} from '../../../stores/browserStore';
import {dragPosition, resizedScale, fittedImageWidth} from './geometry';

const styles = css`
    position: relative;
    flex-shrink: 0;
    touch-action: none;
    cursor: grab;
    outline: none;
    > div:first-of-type { transform: none !important; translate: none !important; }
    img { user-select: none; -webkit-user-drag: none; }
    &:active { cursor: grabbing; }
    .frame-selection { position: absolute; inset: 0; pointer-events: none; border: var(--handle-border) solid #a899ff; }
    .frame-handle { position: absolute; width: var(--handle-size); height: var(--handle-size); border: var(--handle-border) solid #8270e0; background: white; border-radius: 25%; pointer-events: auto; padding: 0; }
    .tl { top: 0; left: 0; transform: translate(-50%, -50%); cursor: nwse-resize; }
    .tr { top: 0; right: 0; transform: translate(50%, -50%); cursor: nesw-resize; }
    .bl { bottom: 0; left: 0; transform: translate(-50%, 50%); cursor: nesw-resize; }
    .br { bottom: 0; right: 0; transform: translate(50%, 50%); cursor: nwse-resize; }
    &:focus-visible .frame-selection { border-color: white; }
    &:focus-visible { outline: calc(var(--handle-border) * 2) solid #a5a4ff; outline-offset: calc(var(--handle-border) * 4); }
`;

interface Gesture {
    x: number; y: number; horizontal: number; vertical: number; size: number;
    width: number; height: number; corner?: string; saved: boolean;
}

export const FrameInteraction = view(({children, previewScale = 1}: {children: React.ReactNode, previewScale?: number}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState(false);
    const gesture = useRef<Gesture | null>(null);
    const imageData = app.croppedImageData || app.imageData;
    const [imageSize, setImageSize] = useState({width: 1600, height: 1000});
    useEffect(() => {
        let cancelled = false;
        const image = new Image();
        image.onload = () => { if (!cancelled) setImageSize({width: image.naturalWidth, height: image.naturalHeight}); };
        image.src = imageData || '';
        return () => {cancelled = true;};
    }, [imageData]);
    useEffect(() => {setSelected(false); gesture.current = null;}, [imageData]);
    const dimensions = app.getCanvasDimensions();
    const phoneFit = app.frameType === ScreenshotType.Device ? Math.min(1, dimensions.width * .85 / 460, dimensions.height * .85 / 977) : 1;
    const scale = Number(app.getCanvasSize()) / 100 * phoneFit;
    const frameWidth = app.frameType === ScreenshotType.Device ? 460 : fittedImageWidth(imageSize.width, imageSize.height, dimensions.width, dimensions.height, app.frameType === ScreenshotType.Browser ? browserStore.styles.chromeHeight : 0);
    const active = !annotationStore.activeTool;

    const start = (event: React.PointerEvent, corner?: string) => {
        if (!active || event.button !== 0) return;
        if (!corner && (event.target as HTMLElement).closest('input, [contenteditable="true"]')) return;
        event.preventDefault();
        event.stopPropagation();
        setSelected(true);
        annotationStore.selectAnnotation(null);
        ref.current.focus({preventScroll: true});
        ref.current.setPointerCapture(event.pointerId);
        const rect = ref.current.getBoundingClientRect();
        gesture.current = {x: event.clientX, y: event.clientY, horizontal: Number(app.canvasStyles.horizontalPosition),
            vertical: Number(app.canvasStyles.verticalPosition), size: Number(app.getCanvasSize()), width: rect.width, height: rect.height, corner, saved: false};
    };
    const move = (event: React.PointerEvent) => {
        const g = gesture.current;
        if (!g) return;
        const dx = event.clientX - g.x, dy = event.clientY - g.y;
        if (!g.saved) {
            if (Math.abs(dx) + Math.abs(dy) < 3) return;
            historyStore.saveState();
            g.saved = true;
        }
        if (g.corner) {
            app.setCanvasSize(resizedScale(g.size, dx, dy, g.width, g.height, g.corner));
        } else {
            app.canvasStyles.horizontalPosition = dragPosition(g.horizontal, dx, dimensions.width, previewScale);
            app.canvasStyles.verticalPosition = dragPosition(g.vertical, dy, dimensions.height, previewScale);
        }
    };
    const end = () => { gesture.current = null; };
    const keyDown = (event: React.KeyboardEvent) => {
        if (event.target !== ref.current) return;
        if (event.key === 'Escape') { setSelected(false); return; }
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault();
        historyStore.saveState();
        const step = event.shiftKey ? 10 : 1;
        app.canvasStyles.horizontalPosition = dragPosition(Number(app.canvasStyles.horizontalPosition), event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0, dimensions.width, 1);
        app.canvasStyles.verticalPosition = dragPosition(Number(app.canvasStyles.verticalPosition), event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0, dimensions.height, 1);
    };
    return <div ref={ref} className={`${styles} manipulable-frame`} tabIndex={active ? 0 : -1}
        aria-label="Screenshot frame. Drag to move, use corner handles to resize, or arrow keys to nudge."
        onPointerDown={event => start(event)} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}
        onKeyDown={keyDown} onBlur={event => {if (!event.currentTarget.contains(event.relatedTarget as Node)) setSelected(false);}}
        style={{width: frameWidth,
            transform: `translate(${Number(app.canvasStyles.horizontalPosition) * dimensions.width / 100}px, ${Number(app.canvasStyles.verticalPosition) * dimensions.height / 100}px) scale(${scale}) perspective(1800px) rotateX(${app.canvasStyles.rotateX}deg) rotateY(${app.canvasStyles.rotateY}deg)`,
            '--handle-size': `${10 / (previewScale * scale)}px`, '--handle-border': `${1 / (previewScale * scale)}px`,
        } as React.CSSProperties}>
        {children}
        {active && selected && <div className="frame-selection" data-export-exclude="true">
            {['tl', 'tr', 'bl', 'br'].map(corner => <button key={corner} className={`frame-handle ${corner}`} aria-label={`Resize ${corner} corner`}
                onPointerDown={event => start(event, corner)} />)}
        </div>}
    </div>;
});
