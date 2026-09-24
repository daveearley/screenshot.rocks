import {store} from '@risingstack/react-easy-state';
import Konva from 'konva';

export interface ICanvasStore {
    stageRef: Konva.Stage | null;
    previewScale: number;
    setStageRef(stage: Konva.Stage | null): void;
}

export const canvasStore: ICanvasStore = store({
    stageRef: null,
    previewScale: 1,
    setStageRef(stage) {
        canvasStore.stageRef = stage;
    },
} as ICanvasStore);
