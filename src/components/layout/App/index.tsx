import React, {useEffect, useState} from "react";
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
import {ScreenshotType} from "../../../types";
import {ThemeSelector} from "../../common/ThemeSelector";
import {BackgroundSettings} from "../../common/Settings/BackgroundSettings";
import {CanvasSettings} from "../../common/Settings/CanvasSettings";
import {RatingPromptBox} from "../../common/RatingPromptBox";
import {ImageSelector} from "../../common/ImageSelector";
import {CropModal} from "../../common/CropModal";
import {CONFIG} from "../../../config";
import {SideBarSection} from "../../common/SideBarSection";
import {DownloadMask} from "../../common/DownloadMask";
import {ShareButtons} from "../../common/ShareButtons";

export const App = view(() => {
    const [showSharePrompt, setShowSharePrompt] = useState(false);

    useEffect(() => checkForImageFromLocalstorageUrlOrPaste(), [])

    const handleFrameTypeChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        app.frameType = ((e.target as HTMLElement).innerText as ScreenshotType);
    };

    const frameToStyleMap = {
        [ScreenshotType.Browser]: browserStore.styles,
    };

    const ImageSelectorWrap = () => {
        return (
            <div className="image-selector-wrap">
                <ImageSelector/>
            </div>
        )
    };

    setTimeout(() => {
        setShowSharePrompt(true);
    }, 30000);

    return (
        <>
            <main className={styles()}>
                <div className="toolbar">
                    <div className="crop-buttons">
                        <button disabled={!app.imageData}
                                className="btn btn-success btn-sm d-inline-flex align-items-center"
                                onClick={app.resetImage}>
                            <img alt="New" className="mr-2" src={'images/icons/image.svg'}/>
                            New Image
                        </button>
                        <button disabled={!app.imageData}
                                className="btn btn-success btn-sm d-inline-flex align-items-center"
                                onClick={() => app.cropIsActive = !app.cropIsActive}>
                            <img alt="Crop" className="mr-2" src={'images/icons/crop.svg'}/>
                            Crop Image
                        </button>
                    </div>
                    <div className="share-this">
                        {showSharePrompt && (
                            <div className={'share-prompt'}>
                                Find this app useful? Please Share&nbsp;&nbsp; 👉
                            </div>
                        )}
                        <ShareButtons/>
                    </div>
                </div>
                <aside className="sidebar">
                    <Logo style={LogoStyle.Light}/>
                    <div className="settings">
                        <SideBarSection title={"Frame Type"} isDisabled={!app.imageData}>
                            <div className="frame-type">
                                <div className="btn-group btn-group-sm w-100 mb-3">
                                    {Object.keys(ScreenshotType).map(type => {
                                        if (!CONFIG.enabledScreenShotTypes.includes(type as ScreenshotType)) {
                                            return null;
                                        }
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
                        </SideBarSection>
                        {app.frameType !== ScreenshotType.None && (
                            <SideBarSection title={'Frame Settings'} isDisabled={!app.imageData}>
                                <Settings/>
                            </SideBarSection>
                        )}
                        <SideBarSection title={'Background Settings'} isDisabled={!app.imageData}>
                            <BackgroundSettings/>
                        </SideBarSection>
                        <SideBarSection title={'Canvas Settings'} isDisabled={!app.imageData}>
                            <CanvasSettings/>
                        </SideBarSection>
                        <RatingPromptBox/>
                    </div>
                    <div className="footer">
                        <DownloadButtons/>
                    </div>
                </aside>
                <div className="main-content" id="main">
                    {app.imageData ? <Canvas
                        imageData={app.imageData}
                        canvasBgColor={app.canvasBgColor}
                        canvasBgImage={app.canvasStyles.bgImage}
                        canvasVerticalPadding={app.canvasStyles.verticalPosition}
                        canvasHorizontalPadding={app.canvasStyles.horizontalPosition}
                        styles={(frameToStyleMap as any)[app.frameType]}
                        borderRadius={app.canvasStyles.borderRadius}
                        isDownloadMode={app.isDownloadMode}
                        frameType={app.frameType}
                        isAutoRotateActive={app.isAutoRotateActive}
                        canvasBgType={app.canvasStyles.backgroundType}
                    /> : <ImageSelectorWrap/>}
                </div>
            </main>
            {app.cropIsActive && <CropModal/>}
            {app.isDownloadMode && <DownloadMask/>}
        </>

    );
});