import React, {useCallback, useState} from "react";
import {view} from "@risingstack/react-easy-state";
import {app} from '../../../stores/appStore'
import {useDropzone} from "react-dropzone";
import {styles} from "./styles";
import {validURL} from "../../../utils/url";
import {routeStore} from "../../../stores/routeStore";
import {loadImageFromImageUrl} from "../../../utils/image";

export const ImageSelector = view(() => {
    const existingUrl = () => {
        const parsedUrl = new URL(window.location.href);
        if(parsedUrl.searchParams.get('text')){
            return parsedUrl.searchParams.get('text');
        }
        return null;
    }

    const [urlValue, setUrlValue] = useState(existingUrl());
    const [urlIsInvalid, setUrlIsInvalid] = useState(false);
    const [urlLoading, setUrlLoading] = useState(false);
    const [requestFailed, setRequestFailed] = useState(false);
    const [enableMobileScreenshot, setEnableMobileScreenshot] = useState(false);

    const onDrop = useCallback(files => {
        if (files && files[0]) {
            const fileReader = new FileReader();
            fileReader.addEventListener("load", e => app.setImageData(e.target.result as string));
            fileReader.readAsDataURL(files[0]);
        }
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop,  accept: ['.jpeg', '.png', '.jpg']})

    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleUrlEnter();
        }
    };

    const handleUrlEnter = () => {
        if (!validURL(urlValue)) {
            setUrlIsInvalid(true);
            return;
        }

        setUrlLoading(true);
        fetch(`${process.env.REACT_APP_SCREENSHOT_API}?url=${urlValue}${enableMobileScreenshot ? '&mobile=1' : ''}`)
            .then(response => response.json())
            .then(data => app.setImageData(`data:image/png;base64, ${data.imageBase64}`))
            .catch(() => {
                setUrlLoading(false);
                setRequestFailed(true);
            })
            .finally(() => setUrlLoading(false));
    }

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!urlIsInvalid) {
            setUrlIsInvalid(false);
        }
        setUrlValue(e.target.value);
    }

    const handleDemoImage = () => {
         loadImageFromImageUrl('/images/demo-image.png').then((img) => {
             app.setImageData(img as string);
         })
    };

    return (
        <div className={`${styles(routeStore.currentRoute)} ${isDragActive ? ' dragActive' : ''}`}>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <div className="drop-here">Drop your image here...</div> :
                        <div>
                            <div className="dropzone">
                                <p><b>Drop</b>, <b>paste</b> or <b>click</b> here to upload an image...</p>
                                <p>or enter a URL</p>
                            </div>
                        </div>
                }
            </div>
            <div className="input-group url-form">
                <input
                    disabled={urlLoading}
                    onKeyDown={handleEnterKey}
                    onChange={handleUrlChange}
                    type="text"
                    className={`form-control ${urlIsInvalid || requestFailed ? 'is-invalid' : ''}`}
                    placeholder="https://your-website.com"
                    value={urlValue}
                />
                <div className="input-group-text">
                    <label htmlFor="mobile">Mobile</label>
                    <input onChange={() => setEnableMobileScreenshot(!enableMobileScreenshot)}
                           checked={enableMobileScreenshot}
                           id="mobile"
                           className="form-check-input ml-2"
                           type="checkbox"
                           value="1"
                    />
                </div>
                <button onClick={handleUrlEnter} disabled={urlLoading} className="btn btn-primary" type="button">
                    {urlLoading ? 'Working...' : 'Go'}
                </button>
                <div className="invalid-feedback">
                    {urlIsInvalid && 'Whoops! Looks like you entered an invalid URL.'}
                    {requestFailed && 'Something has gone wrong. Please check your URL is valid and try again.'}
                </div>
            </div>
            <div className="demo-image">
                or <button className="btn btn-link" onClick={handleDemoImage}>Try a demo image <span aria-label="try demo image emoji" role="img">🤟</span></button>
            </div>
        </div>
    );
});
