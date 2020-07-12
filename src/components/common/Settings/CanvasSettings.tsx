import {view} from "@risingstack/react-easy-state";
import {app} from "../../../stores/appStore";
import React from "react";

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
        </>
    );
});