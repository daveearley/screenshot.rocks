import {css} from "emotion";

export const styles = () => {
    return css`
          display: grid;
          grid-template-areas: 
                         "sidebar main-content";
          grid-template-columns: 250px auto;
          height: 100vh;
          background: #524573 url("/images/bg.png");

          .navbar {
            grid-area: nav;
          }

          .sidebar {
            display: flex;
            flex-direction: column;
            padding: 5px;
            font-size: .9em;
            
            .form-check-input:checked {
                background-color: #c45fc0;
                border-color: #c45fc0;
            }
            
            .form-range::-webkit-slider-thumb {
              background: #28a745;
            }
            
            .form-range::-moz-range-thumb {
              background: #28a745;
            }
            
            .form-range::-ms-thumb {
              background: #28a745;
            }
           
            .logo {
              padding: 10px;
              font-size: 1.4em;
              text-align: center;
              color: #ff79ee;
              img {
                max-width: 100%;
              }
            }
        
            .settings {
              flex-grow: 1;
              padding: 12px;
              
              h3 {
                font-size: 1.2em;
                color: #ff79ee;
              }
            }
        
            .footer {
              padding: 20px;
            }
        
            color: #fff;
            background: #211440;
            grid-area: sidebar;
          }
        
          .main-content {
            display: flex;
            vertical-align: middle;
            align-items: center;
            grid-area: main-content;
            margin: 0 auto;
            flex-direction: column;
          }
`;
}