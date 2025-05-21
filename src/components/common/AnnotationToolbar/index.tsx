import React from 'react';
import { view } from '@risingstack/react-easy-state';
import { AnnotationType, app } from '../../../stores/appStore';
import { ToolbarContainer, ToolButton, InputGroup, Separator } from './styles';

const AnnotationToolbar: React.FC = view(() => {
  const handleToolSelect = (tool: AnnotationType) => {
    app.setSelectedAnnotationTool(app.selectedAnnotationTool === tool ? null : tool);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    app.setAnnotationColor(event.target.value);
  };

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    if (!isNaN(newSize)) {
      app.setAnnotationFontSize(newSize);
    }
  };

  const handleStrokeWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(event.target.value, 10);
    if (!isNaN(newWidth)) {
      app.setAnnotationStrokeWidth(newWidth);
    }
  };

  return (
    <ToolbarContainer>
      <ToolButton
        active={app.selectedAnnotationTool === AnnotationType.Text}
        onClick={() => handleToolSelect(AnnotationType.Text)}
      >
        Text
      </ToolButton>
      <ToolButton
        active={app.selectedAnnotationTool === AnnotationType.Rectangle}
        onClick={() => handleToolSelect(AnnotationType.Rectangle)}
      >
        Rectangle
      </ToolButton>
      <ToolButton
        active={app.selectedAnnotationTool === AnnotationType.Circle}
        onClick={() => handleToolSelect(AnnotationType.Circle)}
      >
        Circle
      </ToolButton>
      <ToolButton
        active={app.selectedAnnotationTool === AnnotationType.Arrow}
        onClick={() => handleToolSelect(AnnotationType.Arrow)}
      >
        Arrow
      </ToolButton>

      <Separator />

      <InputGroup>
        <label htmlFor="annotationColor">Color:</label>
        <input
          type="color"
          id="annotationColor"
          value={app.annotationColor}
          onChange={handleColorChange}
        />
      </InputGroup>

      <Separator />

      <InputGroup>
        <label htmlFor="fontSize">Font Size:</label>
        <input
          type="number"
          id="fontSize"
          value={app.annotationFontSize}
          onChange={handleFontSizeChange}
          min="1"
        />
      </InputGroup>

      <InputGroup>
        <label htmlFor="strokeWidth">Stroke Width:</label>
        <input
          type="number"
          id="strokeWidth"
          value={app.annotationStrokeWidth}
          onChange={handleStrokeWidthChange}
          min="1"
        />
      </InputGroup>
    </ToolbarContainer>
  );
});

export default AnnotationToolbar;
