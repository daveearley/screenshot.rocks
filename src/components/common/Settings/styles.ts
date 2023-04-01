import {css} from "emotion";

export const styles = (): string => {
    return css`
      .url-input {
        width: 100%;
        border: none;
        border-radius: 5px;
        padding: 4px;
      }

      select[name="device-type"] {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 5px;
      }

      .colour-variants {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        gap: 10px;

        .variant {
          border-radius: 50px;
          border: 1px solid #ddd;
          height: 20px;
          width: 20px;
          cursor: pointer;
          
          &.selected {
            border-width: 2px;
          }
          
          :hover {
            border-color: #ffffff;
          }
        }
      }
    `
};