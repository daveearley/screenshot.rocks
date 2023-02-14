import {view} from "@risingstack/react-easy-state";
import {app, defaultResettableCanvasStyles} from "../../../stores/appStore";
import React from "react";
import {FrameType} from "../../../types";
import {css} from "emotion";
import {SettingValue} from "../SettingValue";

export const CanvasSettings = view(() => {

    const isSettingsDisabled = !app.imageData;

    const styles = css`
      input:disabled {
        opacity: .4;
      }
    `;

    return (
        <div className={styles}>
            <div className="row">
                <div className="col-8">
                    <label htmlFor="size" className="form-label">
                        Size <SettingValue value={app.canvasStyles.size}/>
                    </label>
                </div>
                <div className="col-4">
                    <input
                        onChange={(e) => app.canvasStyles.size = (e.target.value as unknown as number)}
                        value={app.canvasStyles.size}
                        type="range"
                        className="form-range"
                        min="20"
                        max="250"
                        id="size"
                        disabled={isSettingsDisabled}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-8">
                    <label htmlFor="horizontalPadding" className="form-label">
                        Horizontal Space <SettingValue value={app.canvasStyles.horizontalPadding}/>
                    </label>
                </div>
                <div className="col-4">
                    <input
                        onChange={(e) => app.canvasStyles.horizontalPadding = (e.target.value as unknown as number)}
                        value={app.canvasStyles.horizontalPadding}
                        type="range"
                        className="form-range"
                        min="0"
                        max="140"
                        id="horizontalPadding"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-8">
                    <label htmlFor="verticalPadding" className="form-label">
                        Vertical Space <SettingValue value={app.canvasStyles.verticalPadding}/>
                    </label>
                </div>
                <div className="col-4">
                    <input
                        onChange={(e) => app.canvasStyles.verticalPadding = (e.target.value as unknown as number)}
                        value={app.canvasStyles.verticalPadding}
                        type="range"
                        className="form-range"
                        min="0"
                        max="140"
                        id="verticalPadding"
                    />
                </div>
            </div>
            {app.frameType !== FrameType.Phone &&
                <div className="row">
                    <div className="col-8">
                        <label htmlFor="borderRadius" className="form-label">
                            Border Radius <SettingValue value={app.canvasStyles.borderRadius}/>
                        </label>
                    </div>
                    <div className="col-4">
                        <input
                            onChange={(e) => app.canvasStyles.borderRadius = (e.target.value as unknown as number)}
                            value={app.canvasStyles.borderRadius}
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
                <div className="col-8">
                    <label htmlFor="shadow" className="form-label">
                        Shadow <SettingValue value={app.canvasStyles.shadowSize}/>
                    </label>
                </div>
                <div className="col-4">
                    <input
                        onChange={(e) => app.canvasStyles.shadowSize = (e.target.value as unknown as number)}
                        value={app.canvasStyles.shadowSize}
                        type="range"
                        className="form-range"
                        min="0"
                        max="100"
                        id="shadow"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-8">
                    <label htmlFor="rotateX" className="form-label">
                        Vertical Tilt <SettingValue value={app.canvasStyles.rotateX}/>
                    </label>
                </div>
                <div className="col-4">
                    <input
                        onChange={(e) => app.canvasStyles.rotateX = (e.target.value as unknown as number)}
                        value={app.canvasStyles.rotateX}
                        type="range"
                        className="form-range"
                        min="-20"
                        max="20"
                        id="rotateX"
                        disabled={isSettingsDisabled}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-8">
                    <label htmlFor="rotateY" className="form-label">
                        Horizontal Tilt <SettingValue value={app.canvasStyles.rotateY}/>
                    </label>
                </div>
                <div className="col-4">
                    <input
                        onChange={(e) => app.canvasStyles.rotateY = (e.target.value as unknown as number)}
                        value={app.canvasStyles.rotateY}
                        type="range"
                        className="form-range"
                        min="-20"
                        max="20"
                        id="rotateY"
                        disabled={isSettingsDisabled}
                    />
                </div>
            </div>
            <div className="row">
                <button
                    className="btn btn-m btn-link text-white w-100"
                    onClick={() => app.canvasStyles = {...app.canvasStyles, ...defaultResettableCanvasStyles}}>Restore
                    Defaults
                </button>
            </div>
            {window.location.href.includes('localhost') &&
                <div className="row">
                    <button
                        className="btn btn-m btn-link text-white w-100"
                        onClick={() => app.isDownloadMode = !app.isDownloadMode}>[Debug] Toggle Download Mode
                    </button>
                    <button
                        className="btn btn-m btn-link text-white w-100"
                        onClick={() => {
                            localStorage.clear();
                            app.canvasStyles = {...app.canvasStyles, ...defaultResettableCanvasStyles};
                        }}>[Debug] Clear Local Storage
                    </button>
                </div>
            }
        </div>
    );
});