import React, {useRef, useState} from "react";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../stores/appStore";
import {styles} from "./styles";
import ReactCrop, {centerCrop, makeAspectCrop, PixelCrop} from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css'
import {useDebounceEffect} from "../../../hooks/useDebounceEffect";
import {deviceNamesMap, phoneStore} from "../../../stores/phoneStore";
import {ScreenshotType} from "../../../types";

export const CropModal = view(() => {
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [aspect, setAspect] = useState<number | undefined>(app.getAspectRatio())

    let previewUrl = ''

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

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
        }

        // Store the previous data so we can easily revert
        app.previousCropData = app.cropData;
        app.previousCroppedImageData = app.croppedImageData;

        app.croppedImageData = URL.createObjectURL(blob);
        app.cropData = crop;
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
        if (aspect && !app.previousCropData) {
            const {width, height} = e.currentTarget
            app.cropData = centerAspectCrop(width, height, aspect);
        }
    };

    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                await imgPreview(imgRef.current, completedCrop);
            }
        },
        100,
        [completedCrop],
    )

    return (
        <div className={styles()}>
            <div className="crop-wrapper">
                <ReactCrop
                    crop={app.cropData}
                    onChange={(_, percentCrop) => app.cropData = percentCrop}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    minWidth={50}
                    minHeight={50}
                >
                    <img
                        src={app.imageData}
                        ref={imgRef}
                        onLoad={onImageLoad}
                        alt="cropping canvas"/>
                </ReactCrop>
                <div className="crop-toolbar">
                    <div className="aspect-type">
                        Aspect ratio {aspect ? 'locked' : 'unlocked'}
                        {(app.frameType === ScreenshotType.Device && aspect) && ` to ${deviceNamesMap[phoneStore.activeTheme]}`}
                        <button className="btn btn-sm btn-link mr-2"
                                onClick={() => setAspect(aspect ? undefined : app.getAspectRatio())}>
                            {aspect ? 'Unlock' : 'Lock'}
                        </button>
                    </div>
                    <div className="action-buttons">
                        <button className="btn btn-sm btn-danger mr-2"
                                onClick={() => {
                                    app.cropData = app.previousCropData;
                                    app.croppedImageData = app.previousCroppedImageData;
                                    app.cropIsActive = !app.cropIsActive;
                                }}>
                            Cancel
                        </button>
                        <button className="btn btn-sm btn-success mr-2"
                                onClick={() => app.cropIsActive = !app.cropIsActive}>
                            Apply Crop
                        </button>
                    </div>
                </div>
                {!!completedCrop && (
                    <canvas
                        ref={previewCanvasRef}
                        style={{
                            objectFit: 'contain',
                            width: completedCrop.width,
                            height: completedCrop.height,
                            display: "none",
                        }}
                    />
                )}
            </div>
        </div>
    );
});