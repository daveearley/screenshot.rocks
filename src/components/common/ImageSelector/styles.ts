import {css} from "emotion";

export const styles = (imageData?: string): string => {
    return css`
          width: 100%;
          background-color: #ffffff;
          padding: 50px 30px;
          min-height: ${imageData ? '40vh' : 'auto'};
          text-align: center;
          font-size: 1.2em;
          cursor: pointer;
          display: flex;
          vertical-align: middle;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        
          .dropzone {
            height: fit-content;
          }
          
          .url-form {
            max-width: 500px;
            
            button {
              color: #fff;
              background-color: #fe79ed;
              border-color: #fd7aec;
              border-radius: 0 5px 5px 0 !important;
             }
             @media screen and (max-width: 500px) {
              input[type="text"] {
                width: 100%;
                border-radius: 5px 5px 0 0 !important;
              }
              .input-group-text {
                border-radius: 0 0 0 5px !important;
                border-right: none;
                border-top: none;
                margin-left: 0;
                width: 70%;
              }
              button {
                border: none;
                border-radius: 0 0px 5px 0 !important;
                margin-left: 0 !important;
                width: 30%;
              }
             }
          }
        
          svg {
            width: 50px;
            height: auto !important;
            fill: #211540;
          }
        
          &.dragActive {
            background-color: #fff;
          }
`
};