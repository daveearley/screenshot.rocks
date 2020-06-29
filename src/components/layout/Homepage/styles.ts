import {css} from "emotion";

export const styles = () => {
  return css`
      max-width: 900px;
      margin: 0 auto;
      
      @media screen and (max-width: 500px) {
          .url-bar {
           opacity: 0 !important;
          }
          
          .window-controls {
            margin: 0 3% !important;
          }
          
          .page-controls {
            opacity: 0;
          }
          
          .browser-container {
            :last-of-type {
              margin-right: 3% !important;
            }
          }
        }
     
            
      .logo {
        max-width: 350px;
        margin: 20px auto 0;
        img {
          max-width: 100%;
        }
      }
      
       h1 {
         text-align: center;
         margin: 20px;
         color: #ffffff;
       }
       
       .ImageSelector {
         min-height: auto;
         padding: 0;
         
         .dropzone {
            border: none;
            background: none;
            
            p:nth-child(2) {
               font-size: .8em;
            }
         }
       }
       
       .footer {
        display: flex;
        text-align: center;
        max-width: 500px;
        margin: 20px auto;
        align-items: center;
        place-content: space-evenly;
        button {
          text-decoration: none;
          color: #fff;
          padding: 2px 8px;
          border-radius: 0;          
          svg {
            width: 25px;
            fill: #29bc9b;
          }
          
          @media screen and (max-width: 500px) {
            font-size: .8em;
          }
        }
       }
`;
};