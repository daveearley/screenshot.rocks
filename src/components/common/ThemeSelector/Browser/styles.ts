import {css} from "emotion";

export const styles = (bgColor: string) => {
    return css`
        .theme-selection {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }

        a.style-preview {
            flex: 0 130px;
            position: relative;
            overflow: hidden;
            height: 30px;
            background: ${bgColor};
            border-radius: 10px;
            border: 1px solid #fff;
            margin-bottom: 8px;
           
             > div {
                position: absolute;
                left: 15px;
                top: 8px;
                transform: scale(.3);
                width: 440px;
                margin: 0 auto;
                transform-origin: 0 0;
             }
        }
`
}