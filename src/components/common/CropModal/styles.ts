import {css} from "emotion";

export const styles = (): string => {
    return css`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #00000099;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      .crop-wrapper {
        width: 600px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        
        .ReactCrop {
          max-height: 90vh;
        }

        .aspect-type {
          color: #ffffff;
          text-align: left;
          display: inline-block;
          flex-grow: 1;

          .btn {
            color: #ffffff;
          }
        }

        .crop-toolbar {
          display: flex;
          padding: 10px;
        }
      }
    `
};