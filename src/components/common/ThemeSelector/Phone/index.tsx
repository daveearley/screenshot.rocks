import React from "react";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../../stores/appStore";
import {BrowserThemes, browserThemes} from "../../Frames/BrowserFrame/styles";
import {ColorPicker} from "../../ColorPicker";
import {rgba2hexa} from "../../../../utils/image";
import {browserStore} from "../../../../stores/browserStore";
import {phoneStore} from "../../../../stores/phoneStore";
import {styles} from "./styles";
import {PhoneThemes} from "../../Frames/PhoneFrame/styles";
import {PhoneFrame} from "../../Frames/PhoneFrame";

export const PhoneThemeSelector = view(() => {
    const handleThemeClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, theme: PhoneThemes) => {
        phoneStore.activeTheme = theme;
    };

    const handleCustomThemeClick = (): void => {
        phoneStore.activeTheme = (phoneStore.activeTheme === PhoneThemes.Android) ? PhoneThemes.Android : PhoneThemes.Custom;
    };

    const browserStyleMap = {
        browserChromeBgColor: 'BrowserFrame Background',
        browserControlsBgColor: 'Controls Background',
        browserControlsTextColor: 'Controls Text',
        closeButtonColor: 'Close Button',
        maximizeButtonColor: 'Maximize Button',
        minimizeButtonColor: 'Minimize Button'
    }

    return (
        <div className={styles()}>
            <div className={`theme-selection ${phoneStore.activeTheme === PhoneThemes.Custom ? 'd-none' : ''}`}>
                {Object.keys(browserThemes).map((theme) => {
                    return (
                        <a href={'/#'}
                           key={theme}
                           onClick={(e) => handleThemeClick(e, theme as any)}
                           className="d-block style-preview">
                            <PhoneFrame showControlsOnly={true}
                                          canvasBgColor={app.canvasStyles.bgColor}
                                          canvasBgImage={app.canvasStyles.bgImage}
                                          canvasBgType={browserStore.settings.backgroundType}
                                          styles={(browserThemes as any)[theme]}
                                          isDownloadMode={false}
                                          showBoxShadow={browserStore.settings.showBoxShadow}
                            />
                        </a>
                    )
                })}
            </div>
            <div className={`custom-theme-settings ${browserStore.activeTheme !== BrowserThemes.Custom ? 'd-none' : ''}`}>
                {Object.keys(browserStyleMap).map(browserStyle => {
                    return <div className="row">
                        <div className="col-3">
                            <ColorPicker
                                initialColor={(browserStore.styles as any)[browserStyle]}
                                onColorChange={(color => (browserStore.styles as any)[browserStyle] = rgba2hexa(color))}
                            />
                        </div>
                        <div className="col-9">
                            <span>{(browserStyleMap as any)[browserStyle]}</span>
                        </div>
                    </div>
                })}
            </div>
            <button onClick={handleCustomThemeClick} className="btn btn-sm btn-link text-white w-100">
                or <span>{browserStore.activeTheme !== BrowserThemes.Custom ? 'Style Your Own' : 'Choose Style'}</span>
            </button>
        </div>
    );
});