import {view} from "@risingstack/react-easy-state";
import {app} from "../../../stores/appStore";
import React from "react";
import {browserStore} from "../../../stores/browserStore";
import {noFrameStore} from "../../../stores/noFrameStore";
import {FrameType} from "../../../types";

export const CanvasSettings = view(() => {
    return (
        <>
            <div className="row">
                <div className="col">
                    <label htmlFor="horizontalPadding" className="form-label">
                        Horizontal
                    </label>
                </div>
                <div className="col">
                    <input
                        onChange={(e) => app.canvasStyles.horizontalPadding = (e.target.value as unknown as number)}
                        value={app.canvasStyles.horizontalPadding}
                        type="range"
                        className="form-range"
                        min="0"
                        max="120"
                        id="horizontalPadding"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <label htmlFor="verticalPadding" className="form-label">
                        Vertical
                    </label>
                </div>
                <div className="col">
                    <input
                        onChange={(e) => app.canvasStyles.verticalPadding = (e.target.value as unknown as number)}
                        value={app.canvasStyles.verticalPadding}
                        type="range"
                        className="form-range"
                        min="0"
                        max="120"
                        id="verticalPadding"
                    />
                </div>
            </div>
            {app.frameType !== FrameType.Phone &&
                <div className="row">
                    <div className="col">
                        <label htmlFor="borderRadius" className="form-label">
                            Border
                        </label>
                    </div>
                    <div className="col">
                        <input
                            onChange={(e) => {
                                noFrameStore.styles.borderRadius = (e.target.value as unknown as number)
                                browserStore.styles.browserBorderRadius = (e.target.value as unknown as number)
                                browserStore.styles.controlsBorderRadius = (e.target.value as unknown as number)
                            }}
                            value={browserStore.styles.browserBorderRadius}
                            type="range"
                            className="form-range"
                            min="0"
                            max="100"
                            id="borderRadius"
                        />
                    </div>
                </div>
            }
            <div className="row">
                <div className="col">
                    <label htmlFor="shadow" className="form-label">
                        Shadow
                    </label>
                </div>
                <div className="col">
                    <input
                        onChange={(e) => {
                            app.canvasStyles.shadowSize = (e.target.value as unknown as number)
                        }}
                        value={app.canvasStyles.shadowSize}
                        type="range"
                        className="form-range"
                        min="0"
                        max="100"
                        id="shadow"
                    />
                </div>
            </div>
        </>
    );
});