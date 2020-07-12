import {css} from "emotion";

export const styles = () => {
    return css`
          display: grid;
          grid-template-areas: 
                         "sidebar main-content";
          grid-template-columns: 250px auto;
          height: 100vh;

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
              background: #c460c0;
            }
            
            .form-range::-moz-range-thumb {
              background: #c460c0;
            }
            
            .form-range::-ms-thumb {
              background: #c460c0;
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
              padding: 0 12px;
              
              h3 {
                font-size: 1.2em;
                color: #ff79ee;
              }
              
              .bg-image-preview {
                 padding: 5px;
                 height: 40px;
                 margin: 2px;
                 border: 1px solid #ffffff;
                 border-radius: 4px;
                 background-size: cover;
                 cursor: pointer;
                 
                 &.active {
                  border-width: 2px;
                 }
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
          
          .btn-group-sm>.btn, .btn-sm {
            padding: 0.15rem .15rem;
            font-size: .775rem;
          }
`;
}