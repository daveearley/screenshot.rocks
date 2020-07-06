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