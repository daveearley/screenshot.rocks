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

    const browserStyleMap = {
        browserChromeBgColor: 'Browser Background',
        browserControlsBgColor: 'Controls Background',
        browserControlsTextColor: 'Controls Text',
        closeButtonColor: 'Close Button',
        maximizeButtonColor: 'Maximize Button',
        minimizeButtonColor: 'Minimize Button'
    }

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
                {Object.keys(browserStyleMap).map(browserStyle => {
                    return <div className="row">
                        <div className="col-3">
                            <ColorPicker
                                initialColor={(app.browserStyles as any)[browserStyle]}
                                onColorChange={(color => (app.browserStyles as any)[browserStyle] = rgba2hexa(color))}
                            />
                        </div>
                        <div className="col-9">
                            <span>{(browserStyleMap as any)[browserStyle]}</span>
                        </div>
                    </div>
                })}
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
            <button onClick={handleCustomThemeClick} className="btn btn-sm btn-link text-white w-100">
                or <span>{app.browserTheme !== BrowserThemes.Custom ? 'Style Your Own' : 'Choose Style'}</span>
            </button>
        </div>
    );
});