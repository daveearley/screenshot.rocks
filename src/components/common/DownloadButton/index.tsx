import React, {useState} from "react";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../stores/appStore";
import {downloadImage, ImageFormats} from "../../../utils/image";

export const DownloadButtons = view(() => {
    let [imageFormat, setImageFormat] = useState<ImageFormats>(app.defaultImageFormat);

    const handleImageDownload = () => {
        app.isDownloadMode= true;
        downloadImage(document.getElementById('canvas'), imageFormat).then(() => {
            app.isDownloadMode = false;
        });
    };

    const handleImageTypeSwitch = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const input = e.target as HTMLElement;
        setImageFormat(input.innerText.toLowerCase() as ImageFormats)
    };

    return (
        <>
            <div className="btn-group btn-group-sm w-100 mb-2">
                {Object.keys(ImageFormats).map(format => {
                    return (
                        <a href="#"
                           onClick={handleImageTypeSwitch}
                           className={(imageFormat === format.toLowerCase() ? 'active' : '') + ' btn btn-secondary'}>
                            {format}
                        </a>
                    )
                })}
            </div>
            <button disabled={!app.imageData} onClick={handleImageDownload} className="btn btn-success w-100 btn-lg">
                Download
            </button>
            {app.imageData &&
                <button
                    className="btn btn-sm btn-link text-white w-100"
                    onClick={() => app.setImageData(null)}>or upload new image
                </button>}
        </>
    );
});