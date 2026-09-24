import React, {useState} from "react";
import {view} from "@risingstack/react-easy-state";
import {useDropzone} from "react-dropzone";
import {FiUpload} from "react-icons/fi";
import {ACCEPTED_IMAGES, useImageInput} from "../../../hooks/useImageInput";
import {Button, fieldStyles} from "../../ui/controls";
import {styles} from "./styles";

const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform);

export const ImageSelector = view(() => {
    const {openFiles, capture, capturing, error, clearError, openDemo} = useImageInput();
    const [address, setAddress] = useState(() => new URL(window.location.href).searchParams.get('text') || '');
    const [mobile, setMobile] = useState(false);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: openFiles, accept: ACCEPTED_IMAGES});

    return (
        <div className={styles}>
            <div {...getRootProps({className: `drop ${isDragActive ? 'active' : ''}`})}>
                <input {...getInputProps()}/>
                <FiUpload aria-hidden="true"/>
                <h2>{isDragActive ? 'Drop to open' : 'Add a screenshot'}</h2>
                <p>Drop an image here, <span className="link">choose a file</span>, or paste with {isMac ? '⌘V' : 'Ctrl+V'}.</p>
            </div>

            <form className="capture" onSubmit={event => { event.preventDefault(); capture(address, mobile); }}>
                <label htmlFor="capture-address">Or capture a website</label>
                <div className="capture-row">
                    <input id="capture-address" className={fieldStyles} aria-label="Website URL" placeholder="example.com"
                           value={address} disabled={capturing} spellCheck={false} aria-invalid={!!error}
                           onChange={event => { setAddress(event.target.value); if (error) clearError(); }}/>
                    <label className="mobile"><input type="checkbox" checked={mobile} onChange={() => setMobile(!mobile)}/>Mobile</label>
                    <Button type="submit" disabled={capturing}>{capturing ? 'Capturing…' : 'Capture'}</Button>
                </div>
                {error && <p className="error" role="alert">{error}</p>}
            </form>

            <p className="demo">
                No screenshot handy? Try the <button type="button" onClick={() => openDemo(false)}>Browser</button> or <button
                type="button" onClick={() => openDemo(true)}>Mobile</button> demo.
            </p>
        </div>
    );
});
