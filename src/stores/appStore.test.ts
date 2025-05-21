import { app, AnnotationType, IAnnotation } from './appStore';
// Assuming default values are exported or known for testing initial state
// If not, we use the values set during store initialization as seen in appStore.ts

const defaultAnnotationColor = '#ff0000';
const defaultAnnotationFontSize = 16;
const defaultAnnotationStrokeWidth = 2;

describe('appStore - Annotations', () => {
  beforeEach(() => {
    // Reset relevant parts of the store before each test
    app.annotations = [];
    app.selectedAnnotationTool = null;
    app.annotationColor = defaultAnnotationColor;
    app.annotationFontSize = defaultAnnotationFontSize;
    app.annotationStrokeWidth = defaultAnnotationStrokeWidth;
    // Reset other potentially interfering state if necessary
    app.imageData = null;
    app.originalImageData = null;
  });

  describe('Initial State', () => {
    test('annotations should be initially empty', () => {
      expect(app.annotations).toEqual([]);
    });

    test('selectedAnnotationTool should be initially null', () => {
      expect(app.selectedAnnotationTool).toBeNull();
    });

    test('should have correct initial annotationColor', () => {
      expect(app.annotationColor).toBe(defaultAnnotationColor);
    });

    test('should have correct initial annotationFontSize', () => {
      expect(app.annotationFontSize).toBe(defaultAnnotationFontSize);
    });

    test('should have correct initial annotationStrokeWidth', () => {
      expect(app.annotationStrokeWidth).toBe(defaultAnnotationStrokeWidth);
    });
  });

  describe('addAnnotation Action', () => {
    test('should add a new annotation to the annotations array', () => {
      const newRectAnnotation: Omit<IAnnotation, 'id'> = {
        type: AnnotationType.Rectangle,
        x: 10, y: 10, width: 50, height: 50,
        color: '#00ff00', strokeWidth: 3,
      };
      app.addAnnotation(newRectAnnotation);
      expect(app.annotations.length).toBe(1);
      expect(app.annotations[0].type).toBe(AnnotationType.Rectangle);
      expect(app.annotations[0].x).toBe(10);
    });

    test('added annotation should have a unique id', () => {
      const newTextAnnotation: Omit<IAnnotation, 'id'> = {
        type: AnnotationType.Text,
        x: 20, y: 20, text: 'Hello',
        color: '#0000ff', fontSize: 12,
      };
      app.addAnnotation(newTextAnnotation);
      app.addAnnotation({ ...newTextAnnotation, x: 30 }); // Add another one
      expect(app.annotations.length).toBe(2);
      expect(app.annotations[0].id).toBeDefined();
      expect(app.annotations[1].id).toBeDefined();
      expect(app.annotations[0].id).not.toBe(app.annotations[1].id);
    });

    test('should allow adding annotations of different types', () => {
      app.addAnnotation({ type: AnnotationType.Circle, x: 0, y: 0, width: 10, height: 10, color: 'red' });
      app.addAnnotation({ type: AnnotationType.Arrow, x: 1, y: 1, width: 20, height: 20, color: 'blue' });
      expect(app.annotations.length).toBe(2);
      expect(app.annotations.find(a => a.type === AnnotationType.Circle)).toBeDefined();
      expect(app.annotations.find(a => a.type === AnnotationType.Arrow)).toBeDefined();
    });
  });

  describe('updateAnnotation Action', () => {
    let testAnnotationId: string;
    beforeEach(() => {
      const newAnnotation: Omit<IAnnotation, 'id'> = {
        type: AnnotationType.Rectangle, x: 10, y: 10, width: 50, height: 50, color: '#111111',
      };
      app.addAnnotation(newAnnotation);
      testAnnotationId = app.annotations[0].id; // Get the ID of the added annotation
    });

    test('should update properties of an existing annotation', () => {
      const updates: Partial<IAnnotation> = { color: '#222222', width: 60 };
      app.updateAnnotation(testAnnotationId, updates);
      const updatedAnnotation = app.annotations.find(a => a.id === testAnnotationId);
      expect(updatedAnnotation.color).toBe('#222222');
      expect(updatedAnnotation.width).toBe(60);
      expect(updatedAnnotation.x).toBe(10); // Unchanged property
    });

    test('should not affect other annotations', () => {
      app.addAnnotation({ type: AnnotationType.Text, x: 100, y: 100, text: 'Keep me', color: '#333333' });
      const updates: Partial<IAnnotation> = { color: '#444444' };
      app.updateAnnotation(testAnnotationId, updates);
      
      const otherAnnotation = app.annotations.find(a => a.id !== testAnnotationId);
      expect(otherAnnotation.color).toBe('#333333'); // Should remain unchanged
      expect(app.annotations.length).toBe(2);
    });

    test('should handle updating a non-existent annotation gracefully', () => {
      const originalAnnotations = [...app.annotations];
      expect(() => app.updateAnnotation('non-existent-id', { color: '#555555' })).not.toThrow();
      expect(app.annotations).toEqual(originalAnnotations); // State should not change
    });
  });

  describe('removeAnnotation Action', () => {
    let ann1Id: string, ann2Id: string;
    beforeEach(() => {
      app.addAnnotation({ type: AnnotationType.Rectangle, x: 1, y: 1, color: 'red' });
      ann1Id = app.annotations[0].id;
      app.addAnnotation({ type: AnnotationType.Text, x: 2, y: 2, text: 'remove me', color: 'blue' });
      ann2Id = app.annotations[1].id;
    });

    test('should remove the correct annotation', () => {
      app.removeAnnotation(ann2Id);
      expect(app.annotations.length).toBe(1);
      expect(app.annotations.find(a => a.id === ann2Id)).toBeUndefined();
      expect(app.annotations.find(a => a.id === ann1Id)).toBeDefined();
    });

    test('should handle removing a non-existent annotation gracefully', () => {
      const originalLength = app.annotations.length;
      expect(() => app.removeAnnotation('non-existent-id')).not.toThrow();
      expect(app.annotations.length).toBe(originalLength);
    });
  });

  describe('clearAnnotations Action', () => {
    test('should remove all annotations from the array', () => {
      app.addAnnotation({ type: AnnotationType.Rectangle, x: 1, y: 1, color: 'red' });
      app.addAnnotation({ type: AnnotationType.Text, x: 2, y: 2, text: 'clear me', color: 'blue' });
      expect(app.annotations.length).toBe(2);
      app.clearAnnotations();
      expect(app.annotations.length).toBe(0);
      expect(app.annotations).toEqual([]);
    });
  });

  describe('resetImage Action', () => {
    test('should also call clearAnnotations, emptying the annotations array', () => {
      app.addAnnotation({ type: AnnotationType.Rectangle, x: 1, y: 1, color: 'red' });
      app.imageData = 'someimagedata'; // Set some image data to make resetImage do its work
      expect(app.annotations.length).toBe(1);
      app.resetImage();
      expect(app.annotations.length).toBe(0);
      expect(app.annotations).toEqual([]);
      expect(app.imageData).toBeNull(); // Verify other parts of resetImage also run
    });
  });

  describe('Toolbar Actions', () => {
    test('setSelectedAnnotationTool should update selectedAnnotationTool', () => {
      expect(app.selectedAnnotationTool).toBeNull();
      app.setSelectedAnnotationTool(AnnotationType.Rectangle);
      expect(app.selectedAnnotationTool).toBe(AnnotationType.Rectangle);
      app.setSelectedAnnotationTool(null);
      expect(app.selectedAnnotationTool).toBeNull();
    });

    test('setAnnotationColor should update annotationColor', () => {
      const newColor = '#00ff00';
      app.setAnnotationColor(newColor);
      expect(app.annotationColor).toBe(newColor);
    });

    test('setAnnotationFontSize should update annotationFontSize', () => {
      const newSize = 24;
      app.setAnnotationFontSize(newSize);
      expect(app.annotationFontSize).toBe(newSize);
    });

    test('setAnnotationStrokeWidth should update annotationStrokeWidth', () => {
      const newWidth = 5;
      app.setAnnotationStrokeWidth(newWidth);
      expect(app.annotationStrokeWidth).toBe(newWidth);
    });
  });
});
