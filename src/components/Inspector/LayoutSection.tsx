import React from "react";
import {view} from "@risingstack/react-easy-state";
import {css} from "emotion";
import {app, defaultCanvasSizeMap} from "../../stores/appStore";
import {historyStore} from "../../stores/historyStore";
import {CONFIG} from "../../config";
import {Button, NumberField, Section, Segmented, SliderRow} from "../ui/controls";

const checkpoint = () => historyStore.saveState();

export const ASPECT_RATIOS = [
    {label: '16:9', width: 1920, height: 1080},
    {label: '4:3', width: 1600, height: 1200},
    {label: '1:1', width: 1200, height: 1200},
    {label: '4:5', width: 1080, height: 1350},
    {label: '9:16', width: 1080, height: 1920},
];

const styles = css`
  .dimensions { display: flex; align-items: center; gap: 8px; margin: 10px 0 14px; font-size: 13px; color: var(--label-2); }
  .dimensions label { display: flex; align-items: center; gap: 6px; flex: 1; }
  .dimensions input { width: 100%; }
  .dimensions .times { color: var(--label-3); }
`;

export const LayoutSection = view(() => {
    const dimensions = app.getCanvasDimensions();
    const canvas = app.canvasStyles;
    const ratio = dimensions.width / dimensions.height;
    const aspect = ASPECT_RATIOS.find(option => Math.abs(option.width / option.height - ratio) < .01);

    const reset = () => {
        checkpoint();
        app.setCanvasSize(defaultCanvasSizeMap.get(app.frameType));
        canvas.horizontalPosition = 0;
        canvas.verticalPosition = 0;
        canvas.rotateX = 0;
        canvas.rotateY = 0;
    };

    return (
        <Section id="layout" title="Layout" accessory={<Button variant="plain" onClick={reset}>Reset</Button>}>
            <div className={styles}>
                <Segmented label="Canvas aspect ratio" value={aspect ? aspect.label : ''}
                           options={ASPECT_RATIOS.map(option => ({value: option.label, label: option.label}))}
                           onChange={label => {
                               const option = ASPECT_RATIOS.find(o => o.label === label);
                               checkpoint();
                               app.setCanvasWidth(option.width);
                               app.setCanvasHeight(option.height);
                           }}/>
                <div className="dimensions">
                    <label>W
                        <NumberField label="Canvas width" value={dimensions.width} min={CONFIG.minCanvasWidth} max={CONFIG.maxCanvasWidth}
                                     onCommit={width => { checkpoint(); app.setCanvasWidth(width); }}/>
                    </label>
                    <span className="times">×</span>
                    <label>H
                        <NumberField label="Canvas height" value={dimensions.height} min={CONFIG.minCanvasHeight} max={CONFIG.maxCanvasHeight}
                                     onCommit={height => { checkpoint(); app.setCanvasHeight(height); }}/>
                    </label>
                </div>
                <SliderRow id="size" label="Scale" value={app.getCanvasSize()} min={20} max={250} suffix="%"
                           defaultValue={defaultCanvasSizeMap.get(app.frameType)} onStart={checkpoint} onChange={value => app.setCanvasSize(value)}/>
                <SliderRow id="position-x" label="Offset X" value={canvas.horizontalPosition} min={-75} max={75} defaultValue={0}
                           onStart={checkpoint} onChange={value => canvas.horizontalPosition = value}/>
                <SliderRow id="position-y" label="Offset Y" value={canvas.verticalPosition} min={-75} max={75} defaultValue={0}
                           onStart={checkpoint} onChange={value => canvas.verticalPosition = value}/>
                <SliderRow id="tilt-x" label="Tilt" value={canvas.rotateY} min={-20} max={20} defaultValue={0} suffix="°"
                           onStart={checkpoint} onChange={value => canvas.rotateY = value}/>
                <SliderRow id="tilt-y" label="Lean" value={canvas.rotateX} min={-20} max={20} defaultValue={0} suffix="°"
                           onStart={checkpoint} onChange={value => canvas.rotateX = value}/>
            </div>
        </Section>
    );
});
