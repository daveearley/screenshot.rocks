import {css} from "emotion";
import {ICanvasProps} from "../../Canvas";
import {app} from "../../../../stores/appStore";

export const styles = (props: ICanvasProps): string => {
    return css`
      border-radius: ${props.borderRadius}px;
      overflow: hidden;
      box-shadow: 0 2px ${app.canvasStyles.shadowSize}px -1px rgba(0, 0, 0, .4);
      transform: ${app.imageData ? app.cssTransformString : ''};
      translate: ${app.canvasStyles.horizontalPosition}% ${app.canvasStyles.verticalPosition}%;
      background-color: #ffffff;
      padding: 30px;
      font-family: "Arial", sans-serif;

      .twitter-logo {
        width: 35px;
        position: absolute;
        right: 20px;
        top: 20px;
      }

      .tweet-author-handle {
        color: #7f7f7f;
      }

      .tweet-content {
        font-size: 1.2em;
      }

      .tweet-date {
        font-size: .9em;
        color: #7f7f7f;
      }

      .tweet-metrics {
        margin-top: 20px;
        display: flex;

        .metric {
          display: flex;
          margin-right: 5px;
          font-size: .9em;
          color: #7f7f7f;

          svg {
            width: 25px;
            fill: #7f7f7f;
            margin-right: 8px;
          }

          > div {
            margin-right: 5px;
            align-self: center;
          }
        }
      }
    `
};