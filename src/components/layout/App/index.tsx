import React, {useEffect} from "react";
import './styles'
import {Canvas} from "../../common/Canvas";
import {DownloadButtons} from "../../common/DownloadButton";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../stores/appStore";
import {styles} from "./styles";
import {listenForImagePaste} from "../../../utils/image";
import {Logo, LogoStyle} from "../../common/Logo";
import {browserStore} from "../../../stores/browserStore";
import {Settings} from "../../common/Settings/Settings";
import {FrameType} from "../../../types";
import {ThemeSelector} from "../../common/ThemeSelector";
import {phoneStore} from "../../../stores/phoneStore";
import {BackgroundSettings} from "../../common/Settings/BackgroundSettings";
import {CanvasSettings} from "../../common/Settings/CanvasSettings";

export const App = view(() => {
    useEffect(() => listenForImagePaste(), [])

    const handleFrameTypeChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        app.frameType = ((e.target as HTMLElement).innerText as FrameType);
    };

    return (
        <main className={styles()}>
            <aside className="sidebar">
                <Logo style={LogoStyle.Light}/>
                <div className="settings">
                    <div className="frame-type">
                        <div className="btn-group btn-group-sm w-100 mb-2">
                            {Object.keys(FrameType).map(type => {
                                return (
                                    <button
                                        key={type}
                                        onClick={handleFrameTypeChange}
                                        className={(app.frameType === type ? 'active' : '') + ' btn btn-success'}>
                                        {type}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    <ThemeSelector/>
                    <h3 className="mt-3">Canvas</h3>
                    <CanvasSettings/>
                    <h3 className="mt-3">Background</h3>
                    <BackgroundSettings/>
                    <h3 className="mt-3">Settings</h3>
                    <Settings/>
                </div>
                <div className="footer">
                    <DownloadButtons/>
                </div>
            </aside>
            <div className="main-content">
                <Canvas
                    imageData={app.imageData}
                    canvasBgColor={app.canvasBgColor}
                    canvasBgImage={app.canvasStyles.bgImage}
                    canvasVerticalPadding={app.canvasStyles.verticalPadding}
                    canvasHorizontalPadding={app.canvasStyles.horizontalPadding}
                    styles={app.frameType === FrameType.Browser ? browserStore.styles : phoneStore.styles}
                    isDownloadMode={app.isDownloadMode}
                    showBoxShadow={app.frameType === FrameType.Browser ? browserStore.settings.showBoxShadow : phoneStore.settings.showShadow}
                    urlTextOverride={'edit-me.com'}
                    frameType={app.frameType}
                    isAutoRotateActive={app.isAutoRotateActive}
                />
            </div>
        </main>
    );
});