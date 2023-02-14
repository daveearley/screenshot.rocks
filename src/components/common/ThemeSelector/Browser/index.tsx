import React from "react";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../../stores/appStore";
import {styles} from "./styles";
import {BrowserFrame} from "../../Frames/Browser";
import {BrowserThemes, browserThemes} from "../../Frames/Browser/styles";
import {ColorPicker} from "../../ColorPicker";
import {rgba2hexa} from "../../../../utils/image";
import {browserStore} from "../../../../stores/browserStore";

export const BrowserThemeSelector = view(() => {
    const handleThemeClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, theme: BrowserThemes) => {
        browserStore.setBrowserTheme(theme);
    };

    const handleCustomThemeClick = (): void => {
        browserStore.setBrowserTheme((browserStore.settings.activeTheme === BrowserThemes.Custom) ? BrowserThemes.Default : BrowserThemes.Custom);
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
        <div className={styles(app.canvasBgColor)}>
            <div className={`theme-selection ${browserStore.settings.activeTheme === BrowserThemes.Custom ? 'd-none' : ''}`}>
                {Object.keys(browserThemes).map((theme) => {
                    return (
                        <a href={'#!'}
                           key={theme}
                           onClick={(e) => handleThemeClick(e, theme as any)}
                           className="d-block style-preview">
                            <BrowserFrame key={theme}
                                          showControlsOnly={true}
                                          canvasBgColor={app.canvasStyles.bgColor}
                                          canvasBgImage={app.canvasStyles.bgImage}
                                          canvasBgType={app.canvasStyles.backgroundType}
                                          styles={(browserThemes as any)[theme]}
                                          isDownloadMode={false}
                                          showBoxShadow={browserStore.settings.showBoxShadow}
                                          isAutoRotateActive={false}
                                          borderRadius={app.canvasStyles.borderRadius}
                            />
                        </a>
                    )
                })}
            </div>
            <div
                className={`custom-theme-settings ${browserStore.settings.activeTheme !== BrowserThemes.Custom ? 'd-none' : ''}`}>
                {Object.keys(browserStyleMap).map(browserStyle => {
                    return <div className="row" key={browserStyle}>
                        <div className="col-9">
                            <span>{(browserStyleMap as any)[browserStyle]}</span>
                        </div>
                        <div className="col-3">
                            <ColorPicker
                                initialColor={(browserStore.styles as any)[browserStyle]}
                                onColorChange={(color => (browserStore.styles as any)[browserStyle] = rgba2hexa(color))}
                            />
                        </div>
                    </div>
                })}
            </div>
            <button onClick={handleCustomThemeClick} className="btn btn-m btn-link text-white w-100">
                or <span>{browserStore.settings.activeTheme !== BrowserThemes.Custom ? 'Style Your Own' : 'Choose Style'}</span>
            </button>
        </div>
    );
});