import styled from 'styled-components';

export const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ToolButton = styled.button<{ active?: boolean }>`
  background-color: ${props => props.active ? '#c0c0c0' : '#e0e0e0'};
  border: 1px solid #b0b0b0;
  border-radius: 4px;
  padding: 6px 10px;
  margin-right: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #d0d0d0;
  }

  &:last-child {
    margin-right: 0;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  label {
    margin-right: 4px;
    font-size: 14px;
  }

  input[type="color"] {
    width: 30px;
    height: 30px;
    border: 1px solid #b0b0b0;
    border-radius: 4px;
    cursor: pointer;
    padding: 0; /* Remove default padding for color input */
  }

  input[type="number"] {
    width: 50px;
    padding: 4px;
    border: 1px solid #b0b0b0;
    border-radius: 4px;
    font-size: 14px;
    margin-left: 4px;
  }
`;

export const Separator = styled.div`
  width: 1px;
  height: 24px;
  background-color: #c0c0c0;
  margin: 0 10px;
`;
