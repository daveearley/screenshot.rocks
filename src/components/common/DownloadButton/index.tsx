import React, {useState} from "react";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../stores/appStore";
import {downloadImage} from "../../../utils/image";
import {ImageFormats} from "../../../types";
import {Routes, routeStore} from "../../../stores/routeStore";

export const DownloadButtons = view(() => {
    let [imageFormat, setImageFormat] = useState<ImageFormats>(app.defaultImageFormat);

    const handleImageDownload = () => {
        app.isDownloadMode = true;
        downloadImage(document.getElementById('canvas'), imageFormat).then(() => {
            app.isDownloadMode = false;
        });
    };

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
                    className="btn btn-success w-100 btn-lg">
                {app.isDownloadMode ? 'Downloading...' : `Download ${imageFormat.toUpperCase()}`}
            </button>
            {app.imageData &&
            <button
                className="btn btn-sm btn-link text-white w-100"
                onClick={() => routeStore.goToRoute(Routes.Home)}>or start over
            </button>}
        </>
    );
});