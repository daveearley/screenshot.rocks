import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Arrow, Circle, Ellipse, Group, Image as KonvaImage, Layer, Rect, Text} from 'react-konva';
import {view} from '@risingstack/react-easy-state';
import Konva from 'konva';
import {annotationStore} from '../../../../stores/annotationStore';
import {historyStore} from '../../../../stores/historyStore';
import {canvasStore} from '../../../../stores/canvasStore';
import {app} from '../../../../stores/appStore';
import {browserStore} from '../../../../stores/browserStore';
import {phoneStore} from '../../../../stores/phoneStore';
import {AnnotationType, IAnnotation} from '../../../../types/annotations';
import {fontStore, getFont} from '../../../../utils/fonts';
import '../../../../utils/konvaFonts';
import {intersect, measureScreenshot, Rect as Box, ScreenshotPlacement} from './screenshotPlacement';

type KonvaEvent = Konva.KonvaEventObject<Event>;

const ACCENT = '#5e5ce6';
const TEXT_LINE_HEIGHT = 1.15;

const setCursor = (event: KonvaEvent, cursor: string) => {
    const container = event.target.getStage()?.container();
    if (container) container.style.cursor = cursor;
};

const interactive = (annotation: IAnnotation) => ({
    id: annotation.id,
    name: 'annotation',
    draggable: !annotationStore.activeTool,
    onMouseDown: (event: KonvaEvent) => {
        if (annotationStore.activeTool) return;
        event.cancelBubble = true;
        annotationStore.selectAnnotation(annotation.id);
    },
    onTap: (event: KonvaEvent) => { event.cancelBubble = true; annotationStore.selectAnnotation(annotation.id); },
    onDragStart: () => { historyStore.saveState(); annotationStore.selectAnnotation(annotation.id); },
    onTransformStart: () => historyStore.saveState(),
    onMouseEnter: (event: KonvaEvent) => { if (!annotationStore.activeTool) setCursor(event, 'move'); },
    onMouseLeave: (event: KonvaEvent) => { if (!annotationStore.activeTool) setCursor(event, 'default'); },
});

const bakeScale = (node: Konva.Node) => {
    const scaleX = node.scaleX(), scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    return {scaleX, scaleY};
};

// Blur pixelates and blurs the screenshot's own pixels (the frame is DOM, not part of the Konva stage).

const samePlacement = (a: ScreenshotPlacement | null, b: ScreenshotPlacement | null) => {
    if (!a || !b) return a === b;
    const keys: (keyof Box)[] = ['x', 'y', 'width', 'height'];
    return a.image === b.image && keys.every(k => Math.abs(a.drawn[k] - b.drawn[k]) < .5 && Math.abs(a.visible[k] - b.visible[k]) < .5);
};

const averageColor = (image: HTMLImageElement, crop: Box) => {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const context = canvas.getContext('2d');
        context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, 1, 1);
        const [r, g, b] = Array.from(context.getImageData(0, 0, 1, 1).data);
        return `rgb(${r}, ${g}, ${b})`;
    } catch (_) {
        return '#8e8e93';
    }
};

const BlurRegion = view(({annotation}: {annotation: IAnnotation}) => {
    const imageRef = useRef<Konva.Image>(null);
    const [placement, setPlacement] = useState<ScreenshotPlacement | null>(null);

    // Subscribe to everything that moves the screenshot so the blurred pixels follow it.
    void [Object.values(app.canvasStyles), app.frameType, app.getCanvasSize(), app.getCanvasDimensions().width,
        app.getCanvasDimensions().height, app.croppedImageData, app.imageData, browserStore.settings.activeTheme,
        browserStore.settings.showAddressBar, phoneStore.settings.alignment];

    useEffect(() => {
        let image: HTMLImageElement | null = null;
        const remeasure = () => setPlacement(measureScreenshot());
        const frame = requestAnimationFrame(() => {
            const next = measureScreenshot();
            setPlacement(previous => samePlacement(previous, next) ? previous : next);
            if (!next) {
                // The image may still be decoding; try again once it has loaded.
                image = document.querySelector('#canvas .manipulable-frame img') as HTMLImageElement | null;
                image?.addEventListener('load', remeasure, {once: true});
            }
        });
        return () => {
            cancelAnimationFrame(frame);
            image?.removeEventListener('load', remeasure);
        };
    });

    const region = {x: annotation.x, y: annotation.y, width: annotation.width, height: annotation.height};
    const onScreen = placement && intersect(placement.visible, placement.drawn);
    const visible = onScreen && intersect(region, onScreen);
    const crop = visible && placement && {
        x: (visible.x - placement.drawn.x) * placement.image.naturalWidth / placement.drawn.width,
        y: (visible.y - placement.drawn.y) * placement.image.naturalHeight / placement.drawn.height,
        width: visible.width * placement.image.naturalWidth / placement.drawn.width,
        height: visible.height * placement.image.naturalHeight / placement.drawn.height,
    };
    const strength = annotation.blurAmount || 14;
    const cropKey = crop ? [crop.x, crop.y, crop.width, crop.height, visible.width, visible.height].map(Math.round).join() : '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const base = useMemo(() => crop && placement ? averageColor(placement.image, crop) : '#8e8e93', [cropKey, placement?.image]);

    useEffect(() => {
        const node = imageRef.current;
        if (!node) return;
        node.cache({pixelRatio: 1});
        node.filters([Konva.Filters.Pixelate, Konva.Filters.Blur]);
        node.pixelSize(Math.max(6, Math.round(strength * .8)));
        node.blurRadius(strength);
        node.getLayer()?.batchDraw();
    }, [cropKey, strength]);

    return (
        <Group {...interactive(annotation)} x={annotation.x} y={annotation.y}
               onDragMove={event => annotationStore.updateAnnotation(annotation.id, {x: event.target.x(), y: event.target.y()}, false)}
               onTransformEnd={event => {
                   const {scaleX, scaleY} = bakeScale(event.target);
                   annotationStore.updateAnnotation(annotation.id, {
                       x: event.target.x(), y: event.target.y(),
                       width: Math.max(10, annotation.width * scaleX), height: Math.max(10, annotation.height * scaleY),
                   }, false);
               }}>
            <Rect width={annotation.width} height={annotation.height} fill="rgba(0, 0, 0, 0.001)"/>
            {visible && crop && <>
                <Rect x={visible.x - region.x} y={visible.y - region.y} width={visible.width} height={visible.height} fill={base}/>
                <KonvaImage ref={imageRef} image={placement.image} crop={crop}
                            x={visible.x - region.x} y={visible.y - region.y} width={visible.width} height={visible.height}/>
            </>}
            {/* Otherwise a blur over the background would be invisible; not exported. */}
            {!visible && <Rect name="editor-only" width={annotation.width} height={annotation.height}
                               stroke="rgba(255, 255, 255, .8)" strokeWidth={2} dash={[8, 6]}/>}
        </Group>
    );
});

const ArrowHandles = view(({annotation}: {annotation: IAnnotation}) => {
    const scale = canvasStore.previewScale;
    const handle = (end: boolean) => (
        <Circle x={end ? annotation.endX : annotation.x} y={end ? annotation.endY : annotation.y} radius={6 / scale}
                fill="#ffffff" stroke={ACCENT} strokeWidth={1.5 / scale} hitStrokeWidth={16 / scale} draggable name="arrow-handle"
                onMouseDown={event => { event.cancelBubble = true; }}
                onDragStart={() => historyStore.saveState()}
                onDragMove={event => annotationStore.updateAnnotation(annotation.id, end
                    ? {endX: event.target.x(), endY: event.target.y()}
                    : {x: event.target.x(), y: event.target.y()}, false)}
                onMouseEnter={event => setCursor(event, 'crosshair')}
                onMouseLeave={event => setCursor(event, 'default')}/>
    );
    return <>{handle(false)}{handle(true)}</>;
});

const renderAnnotation = (annotation: IAnnotation) => {
    const selected = annotationStore.selectedAnnotationId === annotation.id;
    const moved = (event: KonvaEvent, updates: Partial<IAnnotation>) => annotationStore.updateAnnotation(annotation.id, updates, false);

    switch (annotation.type) {
        case AnnotationType.Rectangle:
            return <Rect key={annotation.id} {...interactive(annotation)} x={annotation.x} y={annotation.y}
                         width={annotation.width} height={annotation.height} stroke={annotation.color}
                         strokeWidth={annotation.strokeWidth} cornerRadius={Math.min(8, annotation.strokeWidth)} fill="transparent"
                         strokeScaleEnabled={false}
                         onDragEnd={event => moved(event, {x: event.target.x(), y: event.target.y()})}
                         onTransformEnd={event => {
                             const {scaleX, scaleY} = bakeScale(event.target);
                             moved(event, {x: event.target.x(), y: event.target.y(), width: annotation.width * scaleX, height: annotation.height * scaleY});
                         }}/>;

        case AnnotationType.Circle:
            return <Ellipse key={annotation.id} {...interactive(annotation)} x={annotation.x + annotation.width / 2}
                            y={annotation.y + annotation.height / 2} radiusX={annotation.width / 2} radiusY={annotation.height / 2}
                            stroke={annotation.color} strokeWidth={annotation.strokeWidth} fill="transparent" strokeScaleEnabled={false}
                            onDragEnd={event => moved(event, {x: event.target.x() - annotation.width / 2, y: event.target.y() - annotation.height / 2})}
                            onTransformEnd={event => {
                                const {scaleX, scaleY} = bakeScale(event.target);
                                const width = annotation.width * scaleX, height = annotation.height * scaleY;
                                moved(event, {x: event.target.x() - width / 2, y: event.target.y() - height / 2, width, height});
                            }}/>;

        case AnnotationType.Arrow: {
            const pointer = Math.max(12, annotation.strokeWidth * 3);
            return <Group key={annotation.id}>
                <Arrow {...interactive(annotation)} points={[annotation.x, annotation.y, annotation.endX, annotation.endY]}
                       stroke={annotation.color} fill={annotation.color} strokeWidth={annotation.strokeWidth}
                       pointerLength={pointer} pointerWidth={pointer} lineCap="round" lineJoin="round" hitStrokeWidth={24}
                       onDragEnd={event => {
                           const dx = event.target.x(), dy = event.target.y();
                           event.target.position({x: 0, y: 0});
                           moved(event, {x: annotation.x + dx, y: annotation.y + dy, endX: annotation.endX + dx, endY: annotation.endY + dy});
                       }}/>
                {selected && !annotationStore.activeTool && <ArrowHandles annotation={annotation}/>}
            </Group>;
        }

        case AnnotationType.Text: {
            const font = getFont(annotation.fontId);
            return <Text key={`${annotation.id}-${fontStore.version}`} {...interactive(annotation)} x={annotation.x} y={annotation.y}
                         text={annotation.text || ''} fontSize={annotation.fontSize} fontFamily={font.family}
                         fontStyle={annotation.bold !== false && font.boldable ? 'bold' : 'normal'} lineHeight={TEXT_LINE_HEIGHT}
                         fill={annotation.color} visible={annotationStore.editingText?.id !== annotation.id}
                         onDblClick={() => annotationStore.editText(annotation.id)}
                         onDblTap={() => annotationStore.editText(annotation.id)}
                         onDragEnd={event => moved(event, {x: event.target.x(), y: event.target.y()})}
                         onTransformEnd={event => {
                             const {scaleY} = bakeScale(event.target);
                             moved(event, {x: event.target.x(), y: event.target.y(), fontSize: Math.max(8, Math.round(annotation.fontSize * scaleY))});
                         }}/>;
        }

        case AnnotationType.Blur:
            return <BlurRegion key={annotation.id} annotation={annotation}/>;

        case AnnotationType.Callout: {
            const size = annotation.width || 48;
            return <Group key={annotation.id} {...interactive(annotation)} x={annotation.x} y={annotation.y}
                          onDragEnd={event => moved(event, {x: event.target.x(), y: event.target.y()})}>
                <Circle radius={size / 2} fill={annotation.color} stroke="#ffffff" strokeWidth={3}
                        shadowColor="rgba(0, 0, 0, .35)" shadowBlur={8} shadowOffsetY={2}/>
                <Text text={String(annotation.calloutNumber || 1)} fontSize={size * .5} fontStyle="bold"
                      fontFamily={getFont('system').family} fill={annotation.color.toLowerCase() === '#ffffff' ? '#1c1c1e' : '#ffffff'}
                      width={size} height={size} offsetX={size / 2} offsetY={size / 2} align="center" verticalAlign="middle" listening={false}/>
            </Group>;
        }

        default:
            return null;
    }
};

const DrawingPreview = view(() => {
    const {drawStartPoint: start, drawCurrentPoint: end, activeTool: tool, activeColor: color, activeStrokeWidth: strokeWidth} = annotationStore;
    if (!annotationStore.isDrawing || !start || !end || !tool) return null;
    const x = Math.min(start.x, end.x), y = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x), height = Math.abs(end.y - start.y);

    switch (tool) {
        case AnnotationType.Rectangle:
            return <Rect x={x} y={y} width={width} height={height} stroke={color} strokeWidth={strokeWidth} cornerRadius={Math.min(8, strokeWidth)} listening={false}/>;
        case AnnotationType.Circle:
            return <Ellipse x={x + width / 2} y={y + height / 2} radiusX={width / 2} radiusY={height / 2} stroke={color} strokeWidth={strokeWidth} listening={false}/>;
        case AnnotationType.Arrow: {
            const pointer = Math.max(12, strokeWidth * 3);
            return <Arrow points={[start.x, start.y, end.x, end.y]} stroke={color} fill={color} strokeWidth={strokeWidth}
                          pointerLength={pointer} pointerWidth={pointer} lineCap="round" listening={false}/>;
        }
        case AnnotationType.Blur:
            return <Rect x={x} y={y} width={width} height={height} fill="rgba(255, 255, 255, .35)" stroke="#ffffff"
                         strokeWidth={2} dash={[8, 6]} listening={false}/>;
        default:
            return null;
    }
});

export const AnnotationLayer = view(() => {
    void fontStore.version; // re-measure text when a web font finishes loading
    return (
        <Layer>
            {annotationStore.annotations.map(renderAnnotation)}
            <DrawingPreview/>
        </Layer>
    );
});
