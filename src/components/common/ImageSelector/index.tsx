import React, {useCallback} from "react";
import {resizeImage} from "../../../utils/image";
import {view} from "@risingstack/react-easy-state";
import {app} from '../../../stores/appStore'
import {useDropzone} from "react-dropzone";
import './styles.scss';

export const ImageSelector = view(() => {
    const onDrop = useCallback(files => {
        if (files && files[0]) {
            const fileReader = new FileReader();
            fileReader.addEventListener("load", e => {
                app.browserSettings.reduceImageQualityOnUpload ?
                    resizeImage(e.target.result as string)
                        .then(img => app.setImageData(img))
                        .catch(() => alert('Shit!'))
                    : app.setImageData(e.target.result as string);
            });

            fileReader.readAsDataURL(files[0]);
        }
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div className={`ImageSelector ${isDragActive ? ' dragActive' : ''}`} {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the image ...</p> :
                    <div className="dropzone">
                        <p><b>Drop</b>, <b>paste</b> or <b>click</b> to upload an image...</p>
                        <p>All processing is done in the browser, nothing is sent to our servers.</p>
                    </div>

            }
        </div>
    );
});