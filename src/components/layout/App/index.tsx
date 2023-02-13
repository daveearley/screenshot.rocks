import React, {useEffect} from "react";
import './styles'
import {Canvas} from "../../common/Canvas";
import {DownloadButtons} from "../../common/DownloadButton";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../stores/appStore";
import {styles} from "./styles";
import {checkForImageFromLocalstorageUrlOrPaste} from "../../../utils/image";
import {Logo, LogoStyle} from "../../common/Logo";
import {browserStore} from "../../../stores/browserStore";
import {Settings} from "../../common/Settings/Settings";
import {FrameType} from "../../../types";
import {ThemeSelector} from "../../common/ThemeSelector";
import {phoneStore} from "../../../stores/phoneStore";
import {BackgroundSettings} from "../../common/Settings/BackgroundSettings";
import {CanvasSettings} from "../../common/Settings/CanvasSettings";
import {noFrameStore} from "../../../stores/noFrameStore";
import {RatingPromptBox} from "../../common/RatingPromptBox";

export const App = view(() => {
    useEffect(() => checkForImageFromLocalstorageUrlOrPaste(), [])

    const handleFrameTypeChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        app.frameType = ((e.target as HTMLElement).innerText as FrameType);
    };

    const frameToStyleMap = {
        [FrameType.Phone]: phoneStore.styles,
        [FrameType.Browser]: browserStore.styles,
        [FrameType.None]: noFrameStore.styles,
    };

    const frameToShadow = {
        [FrameType.Browser]: browserStore.settings.showBoxShadow,
        [FrameType.Phone]: phoneStore.settings.showShadow,
        [FrameType.None]: noFrameStore.settings.showShadow,
    };

    return (
        <main className={styles()}>
            <aside className="sidebar">
                <Logo style={LogoStyle.Light}/>
                <div className="settings">
                    <div className={'section-wrap'}>
                        <div className="frame-type">
                            <h3>Frame Type</h3>
                            <div className="btn-group btn-group-sm w-100 mb-3">
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
                    </div>
                    <div className={'section-wrap'}>
                        <h3>Canvas</h3>
                        <CanvasSettings/>
                    </div>
                    <div className={'section-wrap'}>
                        <h3>Background</h3>
                        <BackgroundSettings/>
                    </div>
                    <div className={'section-wrap'}>
                        <h3>Settings</h3>
                        <Settings/>
                    </div>
                    <RatingPromptBox/>
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
                    styles={(frameToStyleMap as any)[app.frameType]}
                    isDownloadMode={app.isDownloadMode}
                    showBoxShadow={(frameToShadow as any)[app.frameType]}
                    frameType={app.frameType}
                    isAutoRotateActive={app.isAutoRotateActive}
                    canvasBgType={app.canvasStyles.backgroundType}
                />
            </div>
        </main>
    );
});