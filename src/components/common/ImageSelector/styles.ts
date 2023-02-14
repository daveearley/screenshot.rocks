import {css} from "emotion";
import {Routes} from "../../../stores/routeStore";

export const styles = (currentRoute?: Routes): string => {
    return css`
          width: 100%;
          background-color: #ffffff;
          padding: 50px 30px 50px 30px;
          min-height: ${currentRoute === Routes.App ? '40vh' : 'auto'};
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
          
          .drop-here {
            padding: 70px;
            border: 2px dashed #e4e4e4;
            margin-bottom: 20px;
            border-radius: 5px;
            color: #a2a2a2;
            background: #f9f9f9;
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
      
          .demo-image {
            margin-top: 10px;
            
            button {
              padding: 0;
              margin: 0;
              color: #534473;
              text-decoration: none;
              
              :hover {
                text-shadow: 0 1px 15px #53447387
              }
            }
          }
`
};