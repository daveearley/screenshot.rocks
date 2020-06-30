import React from "react";
import {view} from "@risingstack/react-easy-state";
import {app, defaultCanvasBgColor} from "../../../stores/appStore";
import {styles} from "./styles";
import {Browser} from "../Browser";
import {BrowserThemes, browserThemes} from "../Browser/styles";
import {ColorPicker} from "../ColorPicker";
import {rgba2hexa} from "../../../utils/image";

export const BrowserThemeSelector = view(() => {
    const handleThemeClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, theme: BrowserThemes) => {
        app.setBrowserTheme(theme);
    };

    const handleCustomThemeClick = (): void => {
        app.setBrowserTheme((app.browserTheme === BrowserThemes.Custom) ? BrowserThemes.Default : BrowserThemes.Custom);
    };

    const deriveBgColor = () => {
        // If we're in a default state make the bg color something nicer
        // todo - not this
        if (app.canvasStyles.bgColor === defaultCanvasBgColor) {
            return '#9F58B6';
        }

        return app.canvasStyles.bgColor;
    };

    return (
        <div className={styles(deriveBgColor())}>
            <div className={`theme-selection ${app.browserTheme === BrowserThemes.Custom ? 'd-none' : ''}`}>
                {Object.keys(browserThemes).map((theme) => {
                    return (
                        <a href={'/#'}
                           key={theme}
                           onClick={(e) => handleThemeClick(e, theme as any)}
                           className="d-block style-preview">
                            <Browser showControlsOnly={true}
                                     canvasBgColor={deriveBgColor()}
                                     canvasBgImage={app.canvasStyles.bgImage}
                                     canvasBgType={app.browserSettings.backgroundType}
                                     styles={(browserThemes as any)[theme]}
                                     isDownloadMode={false}
                                     showBoxShadow={app.browserSettings.showBoxShadow}
                            />
                        </a>
                    )
                })}
            </div>
            <div className={`custom-theme-settings ${app.browserTheme !== BrowserThemes.Custom ? 'd-none' : ''}`}>
                <div className="row">
                    <div className="col-3">
                        <ColorPicker
                            initialColor={app.browserStyles.browserChromeBgColor}
                            onColorChange={(color => app.browserStyles.browserChromeBgColor = rgba2hexa(color))}
                        />
                    </div>
                    <div className="col-9">
                        <span>Browser Background</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <ColorPicker
                            initialColor={app.browserStyles.browserControlsBgColor}
                            onColorChange={(color => app.browserStyles.browserControlsBgColor = rgba2hexa(color))}
                        />
                    </div>
                    <div className="col-9">
                        <span>
                            Controls Background
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <ColorPicker
                            initialColor={app.browserStyles.browserControlsTextColor}
                            onColorChange={(color => app.browserStyles.browserControlsTextColor = rgba2hexa(color))}
                        />
                    </div>
                    <div className="col-9">
                        <span>
                            Controls Text
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <ColorPicker
                            initialColor={app.browserStyles.closeButtonColor}
                            onColorChange={(color => app.browserStyles.closeButtonColor = rgba2hexa(color))}
                        />
                    </div>
                    <div className="col-9">
                        <span>
                            Close Button
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <ColorPicker
                            initialColor={app.browserStyles.maximizeButtonColor}
                            onColorChange={(color => app.browserStyles.maximizeButtonColor = rgba2hexa(color))}
                        />
                    </div>
                    <div className="col-9">
                        <span>
                            Maximize Button
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <ColorPicker
                            initialColor={app.browserStyles.minimizeButtonColor}
                            onColorChange={(color => app.browserStyles.minimizeButtonColor = rgba2hexa(color))}
                        />
                    </div>
                    <div className="col-9">
                        <span>
                            Minimize Button
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label htmlFor="horizontalPadding" className="form-label">
                            Border Radius
                        </label>
                    </div>
                    <div className="col">
                        <input
                            onChange={(e) => {
                                app.browserStyles.browserBorderRadius = (e.target.value as unknown as number)
                                app.browserStyles.controlsBorderRadius = (e.target.value as unknown as number)
                            }}
                            value={app.browserStyles.browserBorderRadius}
                            type="range"
                            className="form-range"
                            min="0"
                            max="100"
                            id="horizontalPadding"
                        />
                    </div>
                </div>
            </div>
            <a href="/#" onClick={handleCustomThemeClick} className="btn btn-sm btn-link text-white w-100">
                or <span>{app.browserTheme !== BrowserThemes.Custom ? 'Style Your Own' : 'Choose Style'}</span>
            </a>
        </div>
    );
});