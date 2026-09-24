import React, {useEffect, useRef} from 'react';
import {Transformer} from 'react-konva';
import {view} from '@risingstack/react-easy-state';
import Konva from 'konva';
import {annotationStore} from '../../../stores/annotationStore';
import {AnnotationType} from '../../../types/annotations';
import {fontStore} from '../../../utils/fonts';
import {canvasStore} from '../../../stores/canvasStore';

const ACCENT = '#5e5ce6';
const ALL_ANCHORS = ['top-left', 'top-center', 'top-right', 'middle-right', 'bottom-right', 'bottom-center', 'bottom-left', 'middle-left'];
const CORNERS = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];

export const SelectionTransformer = view(() => {
    const ref = useRef<Konva.Transformer>(null);
    const selected = annotationStore.getSelectedAnnotation();
    const editing = !!annotationStore.editingText;
    const target = selected && selected.type !== AnnotationType.Arrow && !editing && !annotationStore.activeTool ? selected : null;
    // Includes the font version: text nodes remount when a web font loads.
    const geometry = target ? [target.id, target.x, target.y, target.width, target.height, target.fontSize, target.text, target.fontId, fontStore.version].join() : '';

    useEffect(() => {
        const transformer = ref.current;
        if (!transformer) return;
        const node = target ? transformer.getStage()?.findOne(`#${target.id}`) : null;
        transformer.nodes(node ? [node] : []);
        transformer.getLayer()?.batchDraw();
    }, [geometry]); // eslint-disable-line react-hooks/exhaustive-deps

    const type = target?.type;
    const scale = canvasStore.previewScale; // keep handles a usable size on the scaled-down stage
    return (
        <Transformer
            ref={ref}
            rotateEnabled={false}
            ignoreStroke
            keepRatio={type === AnnotationType.Text}
            resizeEnabled={type !== AnnotationType.Callout}
            enabledAnchors={type === AnnotationType.Text ? CORNERS : ALL_ANCHORS}
            boundBoxFunc={(oldBox, newBox) => (newBox.width < 10 || newBox.height < 10 ? oldBox : newBox)}
            anchorSize={10 / scale}
            anchorCornerRadius={5 / scale}
            anchorFill="#ffffff"
            anchorStroke={ACCENT}
            anchorStrokeWidth={1.5 / scale}
            borderStroke={ACCENT}
            borderStrokeWidth={1.5 / scale}
            padding={0}
        />
    );
});
