import {view} from "@risingstack/react-easy-state";
import {app, defaultCanvasSizeMap, defaultResettableCanvasStyles} from "../../../stores/appStore";
import React from "react";
import {ScreenshotType} from "../../../types";
import {css} from "emotion";
import {SettingValue} from "../SettingValue";
import {Slider} from "../Slider";
import {clamp} from "../../../utils/misc";
import {CONFIG} from "../../../config";

export const CanvasSettings = view(() => {
    const styles = css`
      input:disabled {
        opacity: .4;
      }

      .dimensions {
        display: flex;
        text-align: center;
        margin-bottom: 10px;

        label {
          > span {
            font-size: .8em;
          }
          
          :first-of-type {
            margin-right: 5px;
          }

          display: flex;
          flex-direction: column;
          text-align: left;

          input {
            width: 100%;
          }
        }

        > * {
          flex-grow: 1;
        }

        input {
          width: 50px;
          font-size: 1em;
          border: none;
          border-radius: 4px;
          text-align: center;

          :first-of-type {
            margin-right: 4px;
          }
        }
      }
    `;

    return (
        <div className={styles}>
            <div className="dimensions">
                <label htmlFor="width">
                    <span>Width</span>
                    <input
                        className="dimension-input"
                        onChange={(e) => {
                            const number = e.target.value as unknown as number;
                            app.setCanvasWidth(clamp(number, CONFIG.minCanvasWidth, CONFIG.maxCanvasWidth))
                        }}
                        value={app.getCanvasDimensions().width}
                        type="number"
                        id="width"
                        min="500"
                        step={100}
                        max="2300"
                        name="width"
                    />
                </label>

                <label htmlFor="height">
                    <span>Height</span>
                    <input
                        className="dimension-input"
                        onChange={(e) => {
                            const number = e.target.value as unknown as number;
                            app.setCanvasHeight(clamp(number, CONFIG.minCanvasHeight, CONFIG.maxCanvasHeight))
                        }}
                        value={app.getCanvasDimensions().height}
                        type="number"
                        step={100}
                        id="height"
                        min="500"
                        max="2300"
                    />

                </label>
            </div>
            <div className="row">
                <div className="col-7 pr-0">
                    <label htmlFor="size" className="form-label">
                        Size <SettingValue value={app.getCanvasSize()}/>
                    </label>
                </div>
                <div className="col-5">
                    <Slider
                        onChange={(e) => app.setCanvasSize(e.target.value as unknown as number)}
                        value={app.getCanvasSize()}
                        type="range"
                        className="form-range"
                        min="20"
                        max="250"
                        id="size"
                        onResetClick={() => app.setCanvasSize(defaultCanvasSizeMap.get(app.frameType))}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-7 pr-0">
                    <label htmlFor="horizontalPosition" className="form-label">
                        Horizontal Position <SettingValue value={app.canvasStyles.horizontalPosition}/>
                    </label>
                </div>
                <div className="col-5">
                    <Slider
                        onChange={(e) => app.canvasStyles.horizontalPosition = (e.target.value as unknown as number)}
                        value={app.canvasStyles.horizontalPosition}
                        type="range"
                        className="form-range"
                        min="-75"
                        max="75"
                        step="1"
                        id="horizontalPosition"
                        onResetClick={() => app.canvasStyles.horizontalPosition = 0}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-7 pr-0">
                    <label htmlFor="verticalPosition" className="form-label">
                        Vertical Position <SettingValue value={app.canvasStyles.verticalPosition}/>
                    </label>
                </div>
                <div className="col-5">
                    <Slider
                        onChange={(e) => app.canvasStyles.verticalPosition = (e.target.value as unknown as number)}
                        value={app.canvasStyles.verticalPosition}
                        type="range"
                        className="form-range"
                        min="-75"
                        max="75"
                        step="1"
                        id="verticalPosition"
                        onResetClick={() => app.canvasStyles.verticalPosition = 0}
                    />
                </div>
            </div>
            {app.frameType !== ScreenshotType.Device &&
                <div className="row">
                    <div className="col-7 pr-0">
                        <label htmlFor="borderRadius" className="form-label">
                            Border Radius <SettingValue value={app.canvasStyles.borderRadius}/>
                        </label>
                    </div>
                    <div className="col-5">
                        <Slider
                            onChange={(e) => app.canvasStyles.borderRadius = (e.target.value as unknown as number)}
                            value={app.canvasStyles.borderRadius}
                            type="range"
                            className="form-range"
                            min="0"
                            max="100"
                            id="borderRadius"
                            onResetClick={() => app.canvasStyles.borderRadius = 10}
                        />
                    </div>
                </div>
            }
            <div className="row">
                <div className="col-7 pr-0">
                    <label htmlFor="shadow" className="form-label">
                        Shadow <SettingValue value={app.canvasStyles.shadowSize}/>
                    </label>
                </div>
                <div className="col-5">
                    <Slider
                        onChange={(e) => app.canvasStyles.shadowSize = (e.target.value as unknown as number)}
                        value={app.canvasStyles.shadowSize}
                        type="range"
                        className="form-range"
                        min="0"
                        max="100"
                        id="shadow"
                        onResetClick={() => app.canvasStyles.shadowSize = 4}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-7 pr-0">
                    <label htmlFor="rotateX" className="form-label">
                        Vertical Tilt <SettingValue value={app.canvasStyles.rotateX}/>
                    </label>
                </div>
                <div className="col-5">
                    <Slider
                        onChange={(e) => app.canvasStyles.rotateX = (e.target.value as unknown as number)}
                        value={app.canvasStyles.rotateX}
                        type="range"
                        className="form-range"
                        min="-20"
                        max="20"
                        id="rotateX"
                        onResetClick={() => app.canvasStyles.rotateX = 0}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-7 pr-0">
                    <label htmlFor="rotateY" className="form-label">
                        Horizontal Tilt <SettingValue value={app.canvasStyles.rotateY}/>
                    </label>
                </div>
                <div className="col-5">
                    <Slider
                        onChange={(e) => app.canvasStyles.rotateY = (e.target.value as unknown as number)}
                        value={app.canvasStyles.rotateY}
                        type="range"
                        className="form-range"
                        min="-20"
                        max="20"
                        id="rotateY"
                        onResetClick={() => app.canvasStyles.rotateY = 0}
                    />
                </div>
            </div>
            {document.location.href.includes('localhost') &&
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