import React, {useState} from "react";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../stores/appStore";
import {copyImageToClipboard, downloadImage} from "../../../utils/image";
import {Browsers, ImageFormats} from "../../../types";
import {getBrowserType} from "../../../utils/misc";
import {css} from "emotion";

export const DownloadButtons = view(() => {
    const [imageFormat, setImageFormat] = useState<ImageFormats>(app.defaultImageFormat);
    const browser = getBrowserType();

    const canCopyToClipboard = () => {
        // Copying images to clipboard is currently not supported in firefox
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1560373
        if (browser === Browsers.Firefox || browser === Browsers.Safari) {
            return false;
        }
        try {
            return navigator.permissions.query({name: 'clipboard-write' as PermissionName}).then(res => {
                return res.state === 'granted';
            });
        } catch (error) {
            return false
        }
    };

    const handlePostDownload = () => {
        app.isDownloadMode = false;
        app.hasDownloaded = true;
        localStorage.setItem('hasDownloaded', 'true');
    };

    const handleImageDownload = () => {
        app.isDownloadMode = true;
        downloadImage(document.getElementById('canvas'), imageFormat).then(handlePostDownload);
    };

    const handleImageCopy = () => {
        app.isDownloadMode = true;
        copyImageToClipboard(document.getElementById('canvas')).then(handlePostDownload)
    }

    const handleImageTypeSwitch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const input = e.target as HTMLElement;
        setImageFormat(input.innerText.toLowerCase() as ImageFormats)
    };

    return (
        <>
            <div className="btn-group btn-group-sm w-100 mb-2">
                {Object.keys(ImageFormats).map(format => {
                    return (
                        <button
                            key={format}
                            onClick={handleImageTypeSwitch}
                            className={(imageFormat === format.toLowerCase() ? 'active' : '') + ' btn btn-success'}>
                            {format}
                        </button>
                    )
                })}
            </div>
            <button disabled={!app.imageData || app.isDownloadMode} onClick={handleImageDownload}
                    className="btn btn-success w-100 btn-s">
                {app.isDownloadMode ? 'Downloading...' : `Download ${imageFormat.toUpperCase()}`}
            </button>
            {canCopyToClipboard() && <button disabled={!app.imageData || app.isDownloadMode} onClick={handleImageCopy}
                                             className="btn btn-success w-100 btn-s mt-2 mb-2">
                {app.isDownloadMode ? 'Copying...' : `Copy to Clipboard`}
                <br/>
                <span className={css`font-size: .7em;`}>Can be pasted in Twitter, GitHub etc.</span>
            </button>}
            {app.imageData &&
                <button
                    className="btn btn-m btn-link text-white w-100"
                    onClick={() => app.imageData = null}>or Choose a new image
                </button>}
        </>
    );
});