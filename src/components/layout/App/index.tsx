import React, {useEffect} from "react";
import './styles'
import {BrowserCanvas} from "../../common/BrowserCanvas";
import {DownloadButtons} from "../../common/DownloadButton";
import {BrowserThemeSelector} from "../../common/BrowserThemeSelector";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../stores/appStore";
import {styles} from "./styles";
import {ColorPicker} from "../../common/ColorPicker";
import {retrieveImageFromClipboardAsBase64, rgba2hexa} from "../../../utils/image";
import {Logo, LogoStyle} from "../../common/Logo/index.";

export const App = view(() => {
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent | Event) => {
            retrieveImageFromClipboardAsBase64(e, (base64Data: string) => {
                app.imageData = base64Data;
            });
        };

        window.addEventListener("paste", handlePaste, false);
        return () => window.removeEventListener("paste", handlePaste)
    }, [])

    return (
        <main className={styles()}>
            <aside className="sidebar">
                <Logo style={LogoStyle.Light}/>
                <div className="settings">
                    <BrowserThemeSelector/>
                    <h3 className="mt-3">Canvas Padding</h3>
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
                                max="100"
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
                                max="100"
                                id="verticalPadding"
                            />
                        </div>
                    </div>
                    <h3 className="mt-3">Canvas Background</h3>
                    <div className="row">
                        <div className="col-3">
                            <ColorPicker
                                initialColor={app.canvasStyles.bgColor}
                                onColorChange={(color => app.canvasStyles.bgColor = rgba2hexa(color))}
                            />
                        </div>
                        <div className="col-9">
                        <span>

                        </span>
                        </div>
                    </div>

                    <h3 className="mt-3">Settings</h3>
                    <div className="form-check form-switch">
                        <input
                            onChange={(e) => app.browserSettings.showWindowControls = e.target.checked}
                            checked={app.browserSettings.showWindowControls}
                            className="form-check-input"
                            type="checkbox"
                            id="toggleWindowControls"/>
                        <label className="form-check-label" htmlFor="toggleWindowControls">Window Controls</label>
                    </div>
                    <div className="form-check form-switch">
                        <input
                            onChange={(e) => app.browserSettings.showAddressBar = e.target.checked}
                            checked={app.browserSettings.showAddressBar}
                            className="form-check-input"
                            type="checkbox"
                            id="toggleUrlBar"/>
                        <label className="form-check-label" htmlFor="toggleUrlBar">URL Bar</label>
                    </div>
                    <div className="form-check form-switch">
                        <input
                            onChange={(e) => app.browserSettings.showAddressBarUrl = e.target.checked}
                            checked={app.browserSettings.showAddressBarUrl}
                            className="form-check-input"
                            type="checkbox"
                            id="toggleUrlText"/>
                        <label className="form-check-label" htmlFor="toggleUrlText">URL Text</label>
                    </div>
                    <div className="form-check form-switch">
                        <input
                            onChange={(e) => app.browserSettings.showNavigationButtons = e.target.checked}
                            checked={app.browserSettings.showNavigationButtons}
                            className="form-check-input"
                            type="checkbox"
                            id="toggleNavButtons"/>
                        <label className="form-check-label" htmlFor="toggleNavButtons">Nav Buttons</label>
                    </div>
                    <div className="form-check form-switch">
                        <input
                            onChange={(e) => app.browserSettings.showSettingsButton = e.target.checked}
                            checked={app.browserSettings.showSettingsButton}
                            className="form-check-input"
                            type="checkbox"
                            id="toggleSettingsButton"/>
                        <label className="form-check-label" htmlFor="toggleSettingsButton">Settings Button</label>
                    </div>
                    <div className="form-check form-switch">
                        <input
                            onChange={(e) => app.browserSettings.showBoxShadow = e.target.checked}
                            checked={app.browserSettings.showBoxShadow}
                            className="form-check-input"
                            type="checkbox"
                            id="toggleBoxShadow"/>
                        <label className="form-check-label" htmlFor="toggleBoxShadow">Browser Shadow</label>
                    </div>
                </div>
                <div className="footer">
                    <DownloadButtons/>
                </div>
            </aside>
            <div className="main-content">
                <BrowserCanvas
                    imageData={app.imageData}
                    canvasBgColor={app.canvasStyles.bgColor}
                    canvasBgImage={app.canvasStyles.bgImage}
                    canvasBgType={app.browserSettings.backgroundType}
                    canvasVerticalPadding={app.canvasStyles.verticalPadding}
                    canvasHorizontalPadding={app.canvasStyles.horizontalPadding}
                    styles={app.browserStyles}
                    isDownloadMode={app.isDownloadMode}
                    showBoxShadow={app.browserSettings.showBoxShadow}
                    urlTextOverride={'edit-me.com'}
                />
            </div>
        </main>
    );
});