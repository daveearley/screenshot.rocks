import React from "react";
import {view} from "@risingstack/react-easy-state";
import {CanvasBackgroundTypes} from "../../../types";
import {app, bgImages} from "../../../stores/appStore";
import {equals} from "../../../utils/misc";
import {ColorPicker} from "../ColorPicker";
import {rgba2hexa} from "../../../utils/image";
import {SettingValue} from "../SettingValue";

export const BackgroundSettings = view(() => {
    const handleBgTypeChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        app.canvasStyles.backgroundType = ((e.target as HTMLElement).innerText as CanvasBackgroundTypes);
    };

    const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        app.canvasStyles.bgImage = URL.createObjectURL(e.target.files[0]);
    }

    return (
        <>
            <div className="btn-group btn-group-sm w-100 mb-3">
                {Object.keys(CanvasBackgroundTypes).map((bgType) => {
                    return <button
                        key={bgType}
                        onClick={handleBgTypeChange}
                        className={`${app.canvasStyles.backgroundType === bgType ? 'active' : ''} btn btn-success`}>
                        {(CanvasBackgroundTypes as any)[bgType]}
                    </button>
                })}
            </div>
            {equals(app.canvasStyles.backgroundType, CanvasBackgroundTypes.Solid) &&
                <div className="row">
                    <div className="col-9">
                        Background Color
                    </div>
                    <div className="col-3">
                        <ColorPicker
                            initialColor={app.canvasStyles.bgColor}
                            onColorChange={(color => app.canvasStyles.bgColor = rgba2hexa(color))}
                        />
                    </div>
                </div>}
            {equals(app.canvasStyles.backgroundType, CanvasBackgroundTypes.Gradient) &&
                <>
                    <div className="row">
                        <div className="col-9">
                            Color #1
                        </div>
                        <div className="col-3">
                            <ColorPicker
                                initialColor={app.canvasStyles.gradientColorOne}
                                onColorChange={(color => app.canvasStyles.gradientColorOne = rgba2hexa(color))}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-9">
                            Color #2
                        </div>
                        <div className="col-3">
                            <ColorPicker
                                initialColor={app.canvasStyles.gradientColorTwo}
                                onColorChange={(color => app.canvasStyles.gradientColorTwo = rgba2hexa(color))}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            Angle <SettingValue value={app.canvasStyles.gradientAngle + '°'}/>
                        </div>
                        <div className="col">
                            <input
                                onChange={(e) => {
                                    app.canvasStyles.gradientAngle = (e.target.value as unknown as number)
                                }}
                                value={app.canvasStyles.gradientAngle}
                                type="range"
                                className="form-range"
                                min="0"
                                max="360"
                                id="horizontalPosition"
                            />
                        </div>
                    </div>
                </>}
            {equals(app.canvasStyles.backgroundType, CanvasBackgroundTypes.Image) &&
                <div className="row g-0">
                    {bgImages.map(img => {
                        return <div className="col" key={img}>
                            <div onClick={() => app.canvasStyles.bgImage = img}
                                 className={`bg-image-preview ${equals(app.canvasStyles.bgImage, img) ? 'active' : ''}`}
                                 style={{backgroundImage: `url(${img}.small.png)`}}
                            />
                        </div>
                    })}
                    <div className="col">
                        <div className={`bg-image-preview bg-image-preview--file`}>
                            <input title="Upload custom background image" type="file" accept="image/*" onChange={handleBgImageUpload} />
                        </div>
                    </div>
                </div>}
        </>
    )
});
