import React, {useEffect, useRef, useState} from "react";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../stores/appStore";
import {styles} from "./styles";
import ReactCrop, {centerCrop, makeAspectCrop, PixelCrop, Crop, convertToPixelCrop} from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css'
import {deviceNamesMap, phoneStore} from "../../../stores/phoneStore";
import {ScreenshotType} from "../../../types";
import {Button, Segmented} from "../../ui/controls";

export const CropModal = view(() => {
    const imgRef = useRef<HTMLImageElement>(null)
    const sheetRef = useRef<HTMLDivElement>(null);

    // Take focus when opening (Apply starts disabled, so focus the dialog itself) and give it back on close.
    useEffect(() => {
        const opener = document.activeElement as HTMLElement | null;
        sheetRef.current?.focus();
        return () => opener?.focus();
    }, []);
    const [crop, setCrop] = useState<Crop>(app.cropData);
    const [isApplying, setIsApplying] = useState(false);
    const [aspect, setAspect] = useState<number | undefined>(app.getAspectRatio())


    const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> => new Promise((resolve) => {
        canvas.toBlob(resolve)
    });

    const canvasPreview = async (image: HTMLImageElement, canvas: HTMLCanvasElement, crop: PixelCrop,) => {
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            console.error('No 2D context')
            return;
        }

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        const pixelRatio = window.devicePixelRatio

        canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
        canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

        ctx.scale(pixelRatio, pixelRatio)
        ctx.imageSmoothingQuality = 'high'

        const cropX = crop.x * scaleX
        const cropY = crop.y * scaleY

        const centerX = image.naturalWidth / 2
        const centerY = image.naturalHeight / 2

        ctx.save()

        ctx.translate(-cropX, -cropY)
        ctx.translate(centerX, centerY)
        ctx.translate(-centerX, -centerY)
        ctx.drawImage(
            image,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
        )

        ctx.restore()
    };

    const imgPreview = async (image: HTMLImageElement, crop: PixelCrop) => {
        const canvas = document.createElement('canvas')
        await canvasPreview(image, canvas, crop)

        const blob = await canvasToBlob(canvas)
        if (!blob) {
            console.error('Failed to create blob')
            return;
        }


        // Store the previous data so we can easily revert
        app.previousCropData = app.cropData;
        if (app.previousCroppedImageData?.startsWith('blob:')) URL.revokeObjectURL(app.previousCroppedImageData);
        app.previousCroppedImageData = app.croppedImageData;

        app.croppedImageData = URL.createObjectURL(blob);
    };

    const centerAspectCrop = (mediaWidth: number, mediaHeight: number, aspect: number) => centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );


    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        if (aspect && !crop) {
            const {width, height} = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect));
        }
    };

    const applyCrop = async () => {
        if (isApplying || !imgRef.current || !crop || !crop.width || !crop.height) return;
        setIsApplying(true);
        try {
            await imgPreview(imgRef.current, convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height));
            app.cropData = crop;
            app.cropIsActive = false;
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <div className={styles()} role="presentation" onPointerDown={event => { if (event.target === event.currentTarget) app.cropIsActive = false; }}>
            <div ref={sheetRef} tabIndex={-1} className="sheet" role="dialog" aria-modal="true" aria-labelledby="crop-title"
                 onKeyDown={event => {
                     // Keep keys inside the dialog; the editor's shortcuts shouldn't act on the page behind it.
                     event.stopPropagation();
                     if (event.key === 'Escape') app.cropIsActive = false;
                     // Enter confirms, except on buttons, which handle Enter themselves.
                     if (event.key === 'Enter' && !(event.target as HTMLElement).closest('button')) applyCrop();
                 }}>
                <header>
                    <h2 id="crop-title">Crop</h2>
                    <Segmented label="Crop aspect ratio" value={aspect ? 'canvas' : 'free'}
                               options={[{value: 'free', label: 'Freeform'}, {value: 'canvas', label: app.frameType === ScreenshotType.Device ? deviceNamesMap[phoneStore.activeTheme] : 'Canvas ratio'}]}
                               onChange={value => setAspect(value === 'free' ? undefined : app.getAspectRatio())}/>
                </header>
                <div className="crop-area">
                    <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)} aspect={aspect} minWidth={50} minHeight={50}>
                        <img src={app.imageData} ref={imgRef} onLoad={onImageLoad} alt="cropping canvas"/>
                    </ReactCrop>
                </div>
                <footer>
                    <span className="hint">Drag to select the area to keep</span>
                    <Button onClick={() => app.cropIsActive = false}>Cancel</Button>
                    <Button variant="primary" disabled={isApplying || !crop || !crop.width || !crop.height} onClick={applyCrop} autoFocus>
                        {isApplying ? 'Applying…' : 'Apply Crop'}
                    </Button>
                </footer>
            </div>
        </div>
    );
});