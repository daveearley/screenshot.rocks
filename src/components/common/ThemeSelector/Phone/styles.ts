import {css} from "emotion";

export const styles = (bgColor: string) => {
    return css`
         color: #ffffff;
        .theme-selection {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
          
          a {
            flex: 0 120px;
            position: relative;
            overflow: hidden;
            height: 65px;
            background: ${bgColor};
            border-radius: 10px;
            border: 1px solid #fff;
            margin-bottom: 8px;     
            > div {
              transform: scale(.35);
              transform-origin: 35px 18px;
              position: absolute;
            }
          }
        }
`;
};