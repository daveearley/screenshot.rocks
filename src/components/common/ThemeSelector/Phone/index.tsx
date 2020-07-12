import React from "react";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../../stores/appStore";
import {ColorPicker} from "../../ColorPicker";
import {rgba2hexa} from "../../../../utils/image";
import {phoneStore} from "../../../../stores/phoneStore";
import {styles} from "./styles";
import {PhoneThemes, phoneThemeStyles} from "../../Frames/Phone/styles";
import {PhoneFrame} from "../../Frames/Phone";

export const PhoneThemeSelector = view(() => {
    const handleThemeClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, theme: PhoneThemes) => {
        phoneStore.activeTheme = theme;
    };

    const handleCustomThemeClick = (): void => {
        phoneStore.activeTheme = (phoneStore.activeTheme === PhoneThemes.Custom) ? PhoneThemes.Default : PhoneThemes.Custom;
    };

    const phoneStyleMap = {
        frameColor: 'Frame Color',
    }

    return (
        <div className={styles(app.canvasStyles.bgColor)}>
            <div className={`theme-selection ${phoneStore.activeTheme === PhoneThemes.Custom ? 'd-none' : ''}`}>
                {Object.keys(phoneThemeStyles).map((theme) => {
                    return (
                        <a href={'/#'}
                           key={theme}
                           onClick={(e) => handleThemeClick(e, theme as any)}
                           className="d-block style-preview">
                            <PhoneFrame
                                canvasBgColor={app.canvasStyles.bgColor}
                                canvasBgImage={app.canvasStyles.bgImage}
                                styles={(phoneThemeStyles as any)[theme]}
                                isDownloadMode={false}
                                showBoxShadow={phoneStore.settings.showShadow}
                                imageData={app.imageData}
                                isAutoRotateActive={app.isAutoRotateActive}
                            />
                        </a>
                    )
                })}
            </div>
            <div className={`custom-theme-settings ${phoneStore.activeTheme !== PhoneThemes.Custom ? 'd-none' : ''}`}>
                {Object.keys(phoneStyleMap).map(browserStyle => {
                    return <div className="row" key={browserStyle}>
                        <div className="col-3">
                            <ColorPicker
                                initialColor={(phoneStore.styles as any)[browserStyle]}
                                onColorChange={(color => (phoneStore.styles as any)[browserStyle] = rgba2hexa(color))}
                            />
                        </div>
                        <div className="col-9">
                            <span>{(phoneStyleMap as any)[browserStyle]}</span>
                        </div>
                    </div>
                })}
            </div>
            <button onClick={handleCustomThemeClick} className="btn btn-sm btn-link text-white w-100">
                or <span>{phoneStore.activeTheme !== PhoneThemes.Custom ? 'Choose a Color' : 'Choose Style'}</span>
            </button>
        </div>
    );
});