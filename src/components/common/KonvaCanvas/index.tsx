import React, {useCallback, useEffect, useRef} from 'react';
import {Layer, Stage} from 'react-konva';
import {view} from '@risingstack/react-easy-state';
import Konva from 'konva';
import {canvasStore} from '../../../stores/canvasStore';
import {annotationStore} from '../../../stores/annotationStore';
import {AnnotationType} from '../../../types/annotations';
import {AnnotationLayer} from './layers/AnnotationLayer';
import {SelectionTransformer} from './SelectionTransformer';
import {TextEditor} from './TextEditor';

interface AnnotationCanvasProps {
    width: number;
    height: number;
    interactionEnabled: boolean;
}

const cursorFor = (tool: AnnotationType | null) => tool === AnnotationType.Text ? 'text' : tool ? 'crosshair' : 'default';

export const KonvaCanvas = view(({width, height, interactionEnabled}: AnnotationCanvasProps) => {
    const stageRef = useRef<Konva.Stage>(null);

    useEffect(() => {
        canvasStore.setStageRef(stageRef.current);
        return () => canvasStore.setStageRef(null);
    }, []);

    const pointer = (event: Konva.KonvaEventObject<Event>) => event.target.getStage()?.getPointerPosition();

    const onPointerDown = useCallback((event: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        const position = pointer(event);
        if (!position) return;
        if (annotationStore.activeTool) {
            annotationStore.startDrawing(position.x, position.y);
        } else if (event.target === event.target.getStage()) {
            annotationStore.selectAnnotation(null);
        }
    }, []);

    const onPointerMove = useCallback((event: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!annotationStore.isDrawing) return;
        const position = pointer(event);
        if (position) annotationStore.updateDrawing(position.x, position.y);
    }, []);

    const onPointerUp = useCallback(() => {
        if (annotationStore.isDrawing) annotationStore.finishDrawing();
    }, []);

    return (
        <div style={{position: 'absolute', inset: 0, pointerEvents: interactionEnabled ? 'auto' : 'none'}}>
            <Stage ref={stageRef} width={width} height={height}
                   style={{cursor: cursorFor(annotationStore.activeTool)}}
                   onMouseDown={onPointerDown} onTouchStart={onPointerDown}
                   onMouseMove={onPointerMove} onTouchMove={onPointerMove}
                   onMouseUp={onPointerUp} onTouchEnd={onPointerUp} onMouseLeave={onPointerUp}>
                <AnnotationLayer/>
                <Layer>
                    <SelectionTransformer/>
                </Layer>
            </Stage>
            {annotationStore.editingText && <TextEditor key={annotationStore.editingText.id || `${annotationStore.editingText.x},${annotationStore.editingText.y}`}/>}
        </div>
    );
});
