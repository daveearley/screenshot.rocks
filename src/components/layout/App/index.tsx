import React, {useEffect, useRef, useState} from "react";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../stores/appStore";
import {annotationStore} from "../../../stores/annotationStore";
import {browserStore} from "../../../stores/browserStore";
import {checkForImageFromLocalstorageUrlOrPaste} from "../../../utils/image";
import {useKeyboardShortcuts} from "../../../hooks/useKeyboardShortcuts";
import {ImageSelector} from "../../common/ImageSelector";
import {CropModal} from "../../common/CropModal";
import {Canvas} from "../../common/Canvas";
import {KonvaCanvas} from "../../common/KonvaCanvas";
import {Inspector} from "../../Inspector";
import {Toolbar} from "../../Toolbar";
import {MarkupBar} from "../../MarkupBar";
import {Toast} from "../../ui/Toast";
import {canvasStore} from "../../../stores/canvasStore";
import {AnnotationType} from "../../../types/annotations";
import {styles} from "./styles";

const STAGE_PADDING = 48;

const useElementSize = (ref: React.RefObject<HTMLElement>) => {
    const [size, setSize] = useState({width: 0, height: 0});
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const measure = () => setSize({width: element.clientWidth, height: element.clientHeight});
        measure();
        const Observer = (window as any).ResizeObserver; // not in TypeScript 3.7's DOM typings
        const observer = Observer ? new Observer(measure) : null;
        if (observer) observer.observe(element); else window.addEventListener('resize', measure);
        return () => observer ? observer.disconnect() : window.removeEventListener('resize', measure);
    }, [ref]);
    return size;
};

const hint = () => {
    if (!annotationStore.markupMode) return 'Drag the screenshot to move it · Drag a corner to resize · Arrow keys nudge';
    switch (annotationStore.activeTool) {
        case null: return 'Select markup to move or resize it · Double-click text to edit';
        case AnnotationType.Text: return 'Click where the text should go · Esc to stop';
        case AnnotationType.Callout: return 'Click to place each numbered step · Esc to stop';
        default: return 'Drag on the canvas to draw · Esc to stop';
    }
};

export const App = view(() => {
    const stageRef = useRef<HTMLDivElement>(null);
    const stage = useElementSize(stageRef);

    useKeyboardShortcuts();
    useEffect(() => checkForImageFromLocalstorageUrlOrPaste(), []);

    const canvas = app.getCanvasDimensions();
    const markup = annotationStore.markupMode && !!app.imageData;
    const reserved = 56; // markup bar space, reserved even when closed so the canvas doesn't jump
    const displayScale = Math.max(.05, Math.min(1,
        (stage.width - STAGE_PADDING * 2) / canvas.width,
        (stage.height - STAGE_PADDING * 2 - reserved) / canvas.height,
    ));

    useEffect(() => { canvasStore.previewScale = displayScale; }, [displayScale]);

    return (
        <div className={styles()}>
            <Inspector/>
            <div className="workspace">
                <Toolbar/>
                <main className={`stage ${app.imageData ? '' : 'empty'}`} id="main" ref={stageRef}>
                    {markup && <MarkupBar className="markup-bar"/>}
                    {app.imageData ? (
                        <div className="canvas-wrapper" style={{width: canvas.width * displayScale, height: canvas.height * displayScale}}>
                            <Canvas
                                imageData={app.imageData}
                                canvasBgColor={app.canvasBgColor}
                                canvasBgImage={app.canvasStyles.bgImage}
                                canvasBgType={app.canvasStyles.backgroundType}
                                canvasVerticalPadding={app.canvasStyles.verticalPosition}
                                canvasHorizontalPadding={app.canvasStyles.horizontalPosition}
                                styles={browserStore.styles}
                                borderRadius={app.canvasStyles.borderRadius}
                                isDownloadMode={app.isDownloadMode}
                                frameType={app.frameType}
                                isAutoRotateActive={app.isAutoRotateActive}
                                previewScale={displayScale}
                            >
                                <KonvaCanvas width={canvas.width} height={canvas.height} interactionEnabled={markup}/>
                            </Canvas>
                        </div>
                    ) : (
                        <div className="image-selector-wrap"><ImageSelector/></div>
                    )}
                    {app.imageData && <p className="canvas-hint" aria-live="polite">{hint()}</p>}
                </main>
            </div>
            {app.cropIsActive && <CropModal/>}
            <Toast/>
        </div>
    );
});
