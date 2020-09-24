import {css} from "emotion";

export const styles = () => {
    return css`
      max-width: 100%;
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
       
       section {
        max-width: 850px;
        margin: 0 auto;
        
        .row img {
          max-width: 340px;
        }

        .row {
          margin-left: unset;
          margin-right: unset;
        }
       }
       
       a {
       color: #fe79ed;
       }
       
      .logo {
        max-width: 350px;
        margin: 20px auto 0;
        img {
          max-width: 100%;
        }
      }
      
       h1, h2 {
         text-align: center;
         margin: 20px;
         color: #ffffff;
       }
       
       h2 {
        font-size: 1em;
        color: #fe79ed;
       }
       
       h2.features {
        color: #ffffff;
        font-size: 2.5em;
        border-bottom: 2px solid #fd7aec;
        max-width: 300px;
        margin: 0 auto;     
       }
       
       .ImageSelector {
         min-height: auto;
         padding: 0;
         min-width: auto;
         
         .dropzone {
            border: none;
            background: none;
            
            p:nth-child(2) {
               font-size: .8em;
            }
         }
       }
       
       .browser-extensions {
        max-width: 400px;
        margin: 20px auto;
        color: #ffffff;
        text-align: center;
       }
       
       .share {
        text-align: center;
        button {
          background: none;
          border: none;
        }
        svg {
          fill: #fff;
          width: 30px;
          height: 30px;
          margin: 0 10px;
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
          
          &.github {
            svg {
              fill: #ffffff;
            }
          }
          
          @media screen and (max-width: 500px) {
            font-size: .8em;
          }
        }
       }
`;
};
