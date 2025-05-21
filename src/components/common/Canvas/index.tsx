import React, {useEffect, useState} from "react";
import {styles} from "./styles";
import {BrowserFrame} from "../Frames/Browser";
import {IBrowserStyles} from "../../../stores/browserStore";
import {CanvasBackgroundTypes, ScreenshotType} from "../../../types";
import {PhoneFrame} from "../Frames/Phone";
import {view} from "@risingstack/react-easy-state";
import {NoFrameFrame} from "../Frames/NoFrame";
import {TwitterFrame} from "../Frames/Twitter";
import { app, AnnotationType, IAnnotation } from "../../../stores/appStore";

export interface ICanvasProps {
    showControlsOnly?: boolean;
    imageData?: string;
    canvasBgColor?: string;
    canvasBgImage?: string;
    canvasBgType?: CanvasBackgroundTypes;
    canvasVerticalPadding?: number;
    canvasHorizontalPadding?: number;
    styles: IBrowserStyles;
    isDownloadMode: boolean;
    isAutoRotateActive: boolean;
    frameType?: ScreenshotType;
    hideAddressBarOverride?: boolean;
    borderRadius: number;
}

export const Canvas = view((props: ICanvasProps) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
    const [currentAnnotation, setCurrentAnnotation] = useState<IAnnotation | null>(null);

    const getRelativeCoords = (event: React.MouseEvent): { x: number; y: number } | null => {
        const svgElement = event.currentTarget as SVGSVGElement;
        // Check if event.target is the svgElement itself or one of its children
        // If it's a child, offsetX/Y might be relative to the child.
        // We need coordinates relative to the SVG container.
        const rect = svgElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return { x, y };
    };


    const handleMouseDown = (event: React.MouseEvent) => {
        if (!app.selectedAnnotationTool || event.button !== 0) return; // Only main button

        const coords = getRelativeCoords(event);
        if (!coords) return;

        setIsDrawing(true);
        setStartPoint(coords);

        const newAnnotation: IAnnotation = {
            id: `drawing-${Date.now()}`,
            type: app.selectedAnnotationTool,
            x: coords.x,
            y: coords.y,
            width: 0,
            height: 0,
            color: app.annotationColor,
            fontSize: app.annotationFontSize,
            strokeWidth: app.annotationStrokeWidth,
            text: '',
        };
        setCurrentAnnotation(newAnnotation);
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (!isDrawing || !currentAnnotation || !startPoint) return;

        const coords = getRelativeCoords(event);
        if (!coords) return;

        let newWidth = coords.x - startPoint.x;
        let newHeight = coords.y - startPoint.y;
        let newX = startPoint.x;
        let newY = startPoint.y;

        if (currentAnnotation.type !== AnnotationType.Arrow) {
            if (newWidth < 0) {
                newX = coords.x;
                newWidth = -newWidth;
            }
            if (newHeight < 0) {
                newY = coords.y;
                newHeight = -newHeight;
            }
        }

        setCurrentAnnotation({
            ...currentAnnotation,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
        });
    };

    const handleMouseUp = () => {
        if (!isDrawing || !currentAnnotation) return;
        setIsDrawing(false);

        let finalAnnotation = { ...currentAnnotation };

        // For arrows, x,y remain startPoint, width/height are dx/dy
        if (finalAnnotation.type === AnnotationType.Arrow) {
            finalAnnotation.x = startPoint.x;
            finalAnnotation.y = startPoint.y;
        }


        if (finalAnnotation.type === AnnotationType.Text) {
            if (Math.abs(finalAnnotation.width) < 5 && Math.abs(finalAnnotation.height) < 5) { // Click for text
                finalAnnotation.width = 120; // Default width
                finalAnnotation.height = (finalAnnotation.fontSize || app.annotationFontSize) * 1.5; // Default height based on font
            }
            const textInput = window.prompt("Enter text:", "");
            if (textInput === null) { // User cancelled prompt
                setCurrentAnnotation(null);
                setStartPoint(null);
                return;
            }
            finalAnnotation.text = textInput;
        } else { // For shapes and arrows
            if (Math.abs(finalAnnotation.width) < 5 && Math.abs(finalAnnotation.height) < 5) {
                setCurrentAnnotation(null); // Too small, abort
                setStartPoint(null);
                return;
            }
        }
        
        const { id, ...annotationToAdd } = finalAnnotation; // Remove temporary id
        app.addAnnotation(annotationToAdd);

        setCurrentAnnotation(null);
        setStartPoint(null);
    };


    const scaleCanvasOnWindowResize = () => {
        const canvas = document.querySelector<HTMLElement>('.canvas');
        const mainContent = document.querySelector<HTMLElement>('.main-content');
        const maxWidth = mainContent.offsetWidth;
        const maxHeight = window.innerHeight;
        const height = canvas.clientHeight;
        const width = canvas.clientWidth;
        const minScale = .35;
        const maxScale = 1;
        const scale = Math.min(Math.max(Math.min(maxWidth / width, maxHeight / height), minScale), maxScale) * .75;

        canvas.style.transform = 'scale(' + scale + ')';
    };

    useEffect(() => {
        window.addEventListener('resize', scaleCanvasOnWindowResize);
        scaleCanvasOnWindowResize()
        return () => {
            window.removeEventListener('resize', scaleCanvasOnWindowResize);
        }
    });

    return (
        <div className={styles(props) + ' canvas'} id="canvas">
            {(props.frameType === ScreenshotType.Browser || !props.frameType) && <BrowserFrame {...props} />}
            {props.frameType === ScreenshotType.Device && <PhoneFrame {...props} />}
            {props.frameType === ScreenshotType.None && <NoFrameFrame {...props} />}
            {props.frameType === ScreenshotType.Twitter && <TwitterFrame {...props} />}

            {/* Annotation Layer - Rendered on top of the frame/image */}
            {/* Conditional rendering of SVG changed to always render if there's an image, 
                 so drawing is possible even if no annotations exist yet */}
            {props.imageData && (
                <svg
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp} // If mouse leaves canvas, treat as mouse up
                    style={{
                        position: 'absolute',
                        top: `${props.canvasVerticalPadding || 0}%`,
                        left: `${props.canvasHorizontalPadding || 0}%`,
                        width: `${100 - 2 * (props.canvasHorizontalPadding || 0)}%`,
                        height: `${100 - 2 * (props.canvasVerticalPadding || 0)}%`,
                        pointerEvents: app.selectedAnnotationTool ? 'auto' : 'none', // Enable pointer events only if a tool is selected
                        cursor: app.selectedAnnotationTool ? 'crosshair' : 'default',
                        overflow: 'visible',
                    }}
                >
                    <defs>
                        {/* Arrowhead marker definition - fill color will be dynamic if we pass color to it or use CSScurrentColor */}
                        <marker
                            id="arrowhead-marker" // Changed ID to be more specific
                            markerWidth="3"
                            markerHeight="2"
                            refX="2.8" // Adjusted for better line connection
                            refY="1"
                            orient="auto"
                            markerUnits="strokeWidth"
                        >
                            {/* Using currentColor makes the arrowhead inherit the stroke color of the line */}
                            <path d="M0,0 L3,1 L0,2 Z" fill="currentColor" />
                        </marker>
                    </defs>
                    {[...app.annotations, ...(currentAnnotation ? [currentAnnotation] : [])].map((ann) => {
                        // Common props for shapes
                        const shapeProps = {
                            stroke: ann.color || app.annotationColor,
                            strokeWidth: ann.strokeWidth || app.annotationStrokeWidth,
                            fill: "transparent",
                        };
                        // For arrows, if width/height is negative, the arrowhead might point the wrong way
                        // This logic is tricky; SVG lines go from (x1,y1) to (x2,y2).
                        // Our current ann.width/height for arrows is dx/dy.
                        let x2_arrow = ann.x + (ann.width || 0);
                        let y2_arrow = ann.y + (ann.height || 0);

                        switch (ann.type) {
                            case AnnotationType.Text:
                                return (
                                    <text
                                        key={ann.id}
                                        x={ann.x}
                                        y={ann.y + (ann.fontSize || app.annotationFontSize)} // Adjust y for dominantBaseline alternative
                                        fill={ann.color || app.annotationColor}
                                        fontSize={ann.fontSize || app.annotationFontSize}
                                        fontFamily="Arial, sans-serif"
                                        // dominantBaseline="hanging" // Not always perfectly supported, using y adjustment
                                        style={{ userSelect: 'none' }}
                                    >
                                        {ann.text}
                                    </text>
                                );
                            case AnnotationType.Rectangle:
                                return (
                                    <rect
                                        key={ann.id}
                                        x={ann.x}
                                        y={ann.y}
                                        width={Math.abs(ann.width || 0)} // Ensure positive width
                                        height={Math.abs(ann.height || 0)} // Ensure positive height
                                        {...shapeProps}
                                        rx={ann.rotation ? 2 : 0}
                                    />
                                );
                            case AnnotationType.Circle:
                                const radius = Math.min(Math.abs(ann.width || 0), Math.abs(ann.height || 0)) / 2;
                                const cx = ann.x + (ann.width || 0) / 2; // Center based on potentially negative width/height during drawing
                                const cy = ann.y + (ann.height || 0) / 2;
                                return (
                                    <circle
                                        key={ann.id}
                                        cx={cx}
                                        cy={cy}
                                        r={radius}
                                        {...shapeProps}
                                    />
                                );
                            case AnnotationType.Arrow:
                                return (
                                    <line
                                        key={ann.id}
                                        x1={ann.x}
                                        y1={ann.y}
                                        x2={x2_arrow}
                                        y2={y2_arrow}
                                        stroke={ann.color || app.annotationColor}
                                        strokeWidth={ann.strokeWidth || app.annotationStrokeWidth}
                                        markerEnd="url(#arrowhead-marker)"
                                    />
                                );
                            default:
                                return null;
                        }
                    })}
                </svg>
            )}
        </div>
    );
});