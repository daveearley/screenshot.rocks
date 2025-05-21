import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { Canvas, ICanvasProps } from './index'; // Assuming './index' is the correct path
import { app, AnnotationType, IAnnotation } from '../../../stores/appStore';

// Default props for Canvas component
const defaultCanvasProps: ICanvasProps = {
  imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // 1x1 transparent png
  styles: {}, // Empty browser styles for simplicity
  isDownloadMode: false,
  isAutoRotateActive: false,
  borderRadius: 0,
  canvasBgColor: '#ffffff',
  canvasVerticalPadding: 10, // Example padding
  canvasHorizontalPadding: 10,
};

// Mock window.prompt
let mockPrompt: jest.SpyInstance;

describe('Canvas Component - Annotations Integration', () => {
  beforeEach(() => {
    act(() => {
      app.annotations = [];
      app.selectedAnnotationTool = null;
      app.annotationColor = '#ff0000'; // Default red
      app.annotationFontSize = 16;
      app.annotationStrokeWidth = 2;
      app.imageData = defaultCanvasProps.imageData; // Ensure imageData is set for SVG to render
    });
    if (mockPrompt) {
      mockPrompt.mockClear();
    }
  });

  afterEach(() => {
    if (mockPrompt) {
      mockPrompt.mockRestore();
    }
    jest.clearAllMocks();
  });

  describe('Rendering Existing Annotations', () => {
    const sampleAnnotations: IAnnotation[] = [
      { id: 'text1', type: AnnotationType.Text, x: 10, y: 20, text: 'Hello World', color: '#0000ff', fontSize: 14 },
      { id: 'rect1', type: AnnotationType.Rectangle, x: 50, y: 50, width: 30, height: 40, color: '#00ff00', strokeWidth: 3 },
      { id: 'circ1', type: AnnotationType.Circle, x: 100, y: 100, width: 50, height: 50, color: '#ff00ff', strokeWidth: 1 },
      { id: 'arrow1', type: AnnotationType.Arrow, x: 150, y: 150, width: 40, height: -30, color: '#00ffff', strokeWidth: 2 },
    ];

    test('renders various types of annotations from app.annotations', () => {
      act(() => {
        app.annotations = [...sampleAnnotations];
      });
      const { container } = render(<Canvas {...defaultCanvasProps} />);

      // Check for Text
      const textElement = screen.getByText('Hello World');
      expect(textElement).toBeInTheDocument();
      expect(textElement.getAttribute('x')).toBe('10');
      expect(textElement.getAttribute('y')).toBe((20 + 14).toString()); // y + fontSize adjustment
      expect(textElement.getAttribute('fill')).toBe('#0000ff');
      expect(textElement.getAttribute('font-size')).toBe('14');

      // Check for Rectangle (more generic query)
      const rectElement = container.querySelector(`rect[x="50"][y="50"]`);
      expect(rectElement).toBeInTheDocument();
      expect(rectElement.getAttribute('width')).toBe('30');
      expect(rectElement.getAttribute('height')).toBe('40');
      expect(rectElement.getAttribute('stroke')).toBe('#00ff00');
      expect(rectElement.getAttribute('stroke-width')).toBe('3');

      // Check for Circle
      const circleElement = container.querySelector(`circle[cx="${100 + 50 / 2}"][cy="${100 + 50 / 2}"]`);
      expect(circleElement).toBeInTheDocument();
      expect(circleElement.getAttribute('r')).toBe((50 / 2).toString());
      expect(circleElement.getAttribute('stroke')).toBe('#ff00ff');

      // Check for Arrow (Line)
      const arrowLineElement = container.querySelector(`line[x1="150"][y1="150"]`);
      expect(arrowLineElement).toBeInTheDocument();
      expect(arrowLineElement.getAttribute('x2')).toBe((150 + 40).toString());
      expect(arrowLineElement.getAttribute('y2')).toBe((150 - 30).toString());
      expect(arrowLineElement.getAttribute('stroke')).toBe('#00ffff');
      expect(arrowLineElement.getAttribute('marker-end')).toContain('url(#arrowhead-marker)');
    });

    test('renders no annotation elements if app.annotations is empty', () => {
      const { container } = render(<Canvas {...defaultCanvasProps} />);
      // Check that no common annotation elements are found
      expect(container.querySelector('svg > text')).toBeNull();
      expect(container.querySelector('svg > rect')).toBeNull();
      expect(container.querySelector('svg > circle')).toBeNull();
      expect(container.querySelector('svg > line')).toBeNull();
    });
  });

  describe('Attempting to Add Annotations (Simulating Interaction)', () => {
    test('drawing a Rectangle adds an annotation to the store', () => {
      act(() => {
        app.selectedAnnotationTool = AnnotationType.Rectangle;
      });
      const { container } = render(<Canvas {...defaultCanvasProps} />);
      const svgCanvas = container.querySelector('svg');
      expect(svgCanvas).toBeInTheDocument();

      const initialAnnotationCount = app.annotations.length;

      // Simulate drawing
      fireEvent.mouseDown(svgCanvas, { clientX: 10, clientY: 10 });
      fireEvent.mouseMove(svgCanvas, { clientX: 60, clientY: 60 }); // 50x50 rectangle
      fireEvent.mouseUp(svgCanvas);
      
      expect(app.annotations.length).toBe(initialAnnotationCount + 1);
      const addedAnnotation = app.annotations[app.annotations.length -1];
      expect(addedAnnotation.type).toBe(AnnotationType.Rectangle);
      expect(addedAnnotation.x).toBeDefined(); // Exact coords depend on getRelativeCoords mock or actual calculation
      expect(addedAnnotation.width).toBeGreaterThan(0);
      expect(addedAnnotation.height).toBeGreaterThan(0);
      expect(addedAnnotation.color).toBe(app.annotationColor); // Check if it uses current store color
    });

    test('drawing Text prompts for input and adds annotation', async () => {
      mockPrompt = jest.spyOn(window, 'prompt').mockReturnValue('Test Text Input');
      act(() => {
        app.selectedAnnotationTool = AnnotationType.Text;
      });
      const { container } = render(<Canvas {...defaultCanvasProps} />);
      const svgCanvas = container.querySelector('svg');

      const initialAnnotationCount = app.annotations.length;

      // Simulate a click for text (minimal drag)
      fireEvent.mouseDown(svgCanvas, { clientX: 20, clientY: 20 });
      fireEvent.mouseMove(svgCanvas, { clientX: 22, clientY: 22 }); // Small drag
      fireEvent.mouseUp(svgCanvas);
      
      expect(mockPrompt).toHaveBeenCalledTimes(1);
      
      await waitFor(() => { // Wait for store update if any async nature (though current setup is sync)
        expect(app.annotations.length).toBe(initialAnnotationCount + 1);
        const addedAnnotation = app.annotations[app.annotations.length - 1];
        expect(addedAnnotation.type).toBe(AnnotationType.Text);
        expect(addedAnnotation.text).toBe('Test Text Input');
        expect(addedAnnotation.fontSize).toBe(app.annotationFontSize);
      });
    });

    test('cancelling text prompt aborts text annotation', () => {
      mockPrompt = jest.spyOn(window, 'prompt').mockReturnValue(null); // Simulate user cancelling prompt
       act(() => {
        app.selectedAnnotationTool = AnnotationType.Text;
      });
      const { container } = render(<Canvas {...defaultCanvasProps} />);
      const svgCanvas = container.querySelector('svg');
      const initialAnnotationCount = app.annotations.length;

      fireEvent.mouseDown(svgCanvas, { clientX: 20, clientY: 20 });
      fireEvent.mouseUp(svgCanvas); // Click

      expect(mockPrompt).toHaveBeenCalledTimes(1);
      expect(app.annotations.length).toBe(initialAnnotationCount); // No annotation added
    });

    test('drawing a very small shape does not add an annotation', () => {
      act(() => {
        app.selectedAnnotationTool = AnnotationType.Circle;
      });
      const { container } = render(<Canvas {...defaultCanvasProps} />);
      const svgCanvas = container.querySelector('svg');
      const initialAnnotationCount = app.annotations.length;

      // Simulate a very small drag
      fireEvent.mouseDown(svgCanvas, { clientX: 30, clientY: 30 });
      fireEvent.mouseMove(svgCanvas, { clientX: 31, clientY: 31 }); // 1x1 shape
      fireEvent.mouseUp(svgCanvas);

      expect(app.annotations.length).toBe(initialAnnotationCount);
    });

     test('drawing an Arrow adds an annotation to the store', () => {
      act(() => {
        app.selectedAnnotationTool = AnnotationType.Arrow;
      });
      const { container } = render(<Canvas {...defaultCanvasProps} />);
      const svgCanvas = container.querySelector('svg');
      expect(svgCanvas).toBeInTheDocument();

      const initialAnnotationCount = app.annotations.length;

      // Simulate drawing
      fireEvent.mouseDown(svgCanvas, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(svgCanvas, { clientX: 150, clientY: 50 }); // Arrow pointing up-right
      fireEvent.mouseUp(svgCanvas);
      
      expect(app.annotations.length).toBe(initialAnnotationCount + 1);
      const addedAnnotation = app.annotations[app.annotations.length -1];
      expect(addedAnnotation.type).toBe(AnnotationType.Arrow);
      expect(addedAnnotation.x).toBe(100); // Relative x
      expect(addedAnnotation.y).toBe(100); // Relative y
      expect(addedAnnotation.width).toBe(50);  // dx
      expect(addedAnnotation.height).toBe(-50); // dy
    });
  });
});
