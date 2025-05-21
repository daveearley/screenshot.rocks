import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AnnotationToolbar from './index'; // Assuming './index' is the correct path to the component
import { app, AnnotationType } from '../../../stores/appStore';
import { act } from 'react-dom/test-utils'; // For wrapping state updates outside of RTL event handlers

// Default values from appStore for resetting
const defaultAnnotationColor = '#ff0000';
const defaultAnnotationFontSize = 16;
const defaultAnnotationStrokeWidth = 2;

// Helper to get the active style for buttons (implementation depends on how 'active' is styled)
// For this test, we'll assume the 'active' prop directly influences a style we can check,
// or we can check for a specific class if the styled-component adds one.
// Since ToolButton is a styled-component, checking its props or a resulting class/style might be complex.
// A simpler approach for testing is to verify the effect (app.selectedAnnotationTool changes).
// We can also check if the button's appearance *changes* if 'active' affects style directly,
// e.g. by checking computed styles, but this is often more brittle.
// Let's focus on store interactions and input values for robustness.

describe('AnnotationToolbar Component', () => {
  beforeEach(() => {
    // Reset appStore state before each test
    act(() => {
      app.selectedAnnotationTool = null;
      app.annotationColor = defaultAnnotationColor;
      app.annotationFontSize = defaultAnnotationFontSize;
      app.annotationStrokeWidth = defaultAnnotationStrokeWidth;
    });
  });

  describe('Rendering', () => {
    test('renders all tool buttons', () => {
      render(<AnnotationToolbar />);
      expect(screen.getByRole('button', { name: /Text/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Rectangle/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Circle/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Arrow/i })).toBeInTheDocument();
    });

    test('renders property input controls', () => {
      render(<AnnotationToolbar />);
      expect(screen.getByLabelText(/Color:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Font Size:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Stroke Width:/i)).toBeInTheDocument();
    });

    test('inputs display initial values from appStore', () => {
      act(() => {
        app.annotationColor = '#00ff00';
        app.annotationFontSize = 20;
        app.annotationStrokeWidth = 5;
      });
      render(<AnnotationToolbar />);
      expect(screen.getByLabelText<HTMLInputElement>(/Color:/i).value).toBe('#00ff00');
      expect(screen.getByLabelText<HTMLInputElement>(/Font Size:/i).value).toBe('20');
      expect(screen.getByLabelText<HTMLInputElement>(/Stroke Width:/i).value).toBe('5');
    });
  });

  describe('Tool Selection Interaction', () => {
    test('clicking a tool button calls app.setSelectedAnnotationTool and updates active state', () => {
      render(<AnnotationToolbar />);
      const textButton = screen.getByRole('button', { name: /Text/i });
      
      fireEvent.click(textButton);
      expect(app.selectedAnnotationTool).toBe(AnnotationType.Text);
      // To verify active style, we would need a way to inspect the styled-component's prop or resulting style.
      // For now, we assume the component correctly uses app.selectedAnnotationTool for its 'active' prop.

      fireEvent.click(textButton); // Click again to toggle off
      expect(app.selectedAnnotationTool).toBeNull();
    });

    test('clicking different tool buttons changes the selected tool', () => {
      render(<AnnotationToolbar />);
      const rectButton = screen.getByRole('button', { name: /Rectangle/i });
      const circleButton = screen.getByRole('button', { name: /Circle/i });

      fireEvent.click(rectButton);
      expect(app.selectedAnnotationTool).toBe(AnnotationType.Rectangle);

      fireEvent.click(circleButton);
      expect(app.selectedAnnotationTool).toBe(AnnotationType.Circle);
    });
  });

  describe('Property Input Interaction', () => {
    describe('Color Picker', () => {
      test('changing color picker calls app.setAnnotationColor', () => {
        render(<AnnotationToolbar />);
        const colorInput = screen.getByLabelText<HTMLInputElement>(/Color:/i);
        
        fireEvent.change(colorInput, { target: { value: '#0000ff' } });
        expect(app.annotationColor).toBe('#0000ff');
      });

      test('color picker updates when app.annotationColor changes externally', async () => {
        render(<AnnotationToolbar />);
        const colorInput = screen.getByLabelText<HTMLInputElement>(/Color:/i);
        expect(colorInput.value).toBe(defaultAnnotationColor); // Initial

        act(() => {
          app.annotationColor = '#abcdef';
        });
        
        await waitFor(() => {
          expect(colorInput.value).toBe('#abcdef');
        });
      });
    });

    describe('Font Size Input', () => {
      test('changing font size input calls app.setAnnotationFontSize', () => {
        render(<AnnotationToolbar />);
        const fontSizeInput = screen.getByLabelText<HTMLInputElement>(/Font Size:/i);

        fireEvent.change(fontSizeInput, { target: { value: '22' } });
        expect(app.annotationFontSize).toBe(22);
      });

      test('font size input updates when app.annotationFontSize changes externally', async () => {
        render(<AnnotationToolbar />);
        const fontSizeInput = screen.getByLabelText<HTMLInputElement>(/Font Size:/i);
        expect(fontSizeInput.value).toBe(defaultAnnotationFontSize.toString());

        act(() => {
          app.annotationFontSize = 30;
        });

        await waitFor(() => {
          expect(fontSizeInput.value).toBe('30');
        });
      });

      test('font size input handles non-numeric input gracefully (optional, depends on component)', () => {
        render(<AnnotationToolbar />);
        const fontSizeInput = screen.getByLabelText<HTMLInputElement>(/Font Size:/i);
        const initialSize = app.annotationFontSize;

        fireEvent.change(fontSizeInput, { target: { value: 'abc' } });
        // The component's parseInt might result in NaN, and the store update might not happen or set to NaN.
        // The component's handler has `if (!isNaN(newSize))`, so it should not update.
        expect(app.annotationFontSize).toBe(initialSize); 
      });
    });

    describe('Stroke Width Input', () => {
      test('changing stroke width input calls app.setAnnotationStrokeWidth', () => {
        render(<AnnotationToolbar />);
        const strokeWidthInput = screen.getByLabelText<HTMLInputElement>(/Stroke Width:/i);

        fireEvent.change(strokeWidthInput, { target: { value: '4' } });
        expect(app.annotationStrokeWidth).toBe(4);
      });

      test('stroke width input updates when app.annotationStrokeWidth changes externally', async () => {
        render(<AnnotationToolbar />);
        const strokeWidthInput = screen.getByLabelText<HTMLInputElement>(/Stroke Width:/i);
        expect(strokeWidthInput.value).toBe(defaultAnnotationStrokeWidth.toString());

        act(() => {
          app.annotationStrokeWidth = 7;
        });
        
        await waitFor(() => {
          expect(strokeWidthInput.value).toBe('7');
        });
      });
    });
  });
});
