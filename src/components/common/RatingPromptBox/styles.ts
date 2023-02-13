import {css} from "emotion";

export const styles = (): string => {
    return css`
      padding: 10px 12px;
      background: #534473;
      border-radius: 10px;
      margin-top: 10px;
      text-align: center;
      color: #ffffff;
      
      a {
        font-weight: bold;
        color: #ffffff;
      }
      
      .emoji {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-evenly;
        margin-bottom: 10px;
        
        span {
          display: flex;
          font-size: 50px;
        }
      }
      
      h3 {
        color: #fff !important;
        font-weight: bold;
      }
`
};