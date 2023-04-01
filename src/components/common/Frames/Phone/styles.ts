import {css} from "emotion";
import {app} from "../../../../stores/appStore";

export const styles = (): string => {
    const boxShadow = `0 2px ${app.canvasStyles.shadowSize}px -1px rgba(0, 0, 0, .4)`;
    return css`
      border-radius: ${app.adjustMeasurementForDownload(10)}px;
      min-width: 200px;
      position: relative;
      display: flex;
      vertical-align: middle;
      justify-content: center;
      transform: ${app.imageData ? app.cssTransformString : ''};
      translate: ${app.canvasStyles.horizontalPosition}% ${app.canvasStyles.verticalPosition}%;

      .device-iphone-14-pro .device-frame {
        box-shadow: inset 0 0 4px 2px #c0b7cd, inset 0 0 0 6px #342c3f, ${boxShadow};
      }

      .device-iphone-14 .device-frame {
        box-shadow: inset 0 0 4px 2px #b0b8c0, inset 0 0 0 6px #272c31, ${boxShadow}
      }

      .device-google-pixel-6-pro .device-frame {
        box-shadow: inset 0 0 12px #8d8d86, inset 0 7px 0 3px #fdfdfc, inset 0 -6px 0 3px #fdfdfc, ${boxShadow};
      }

      .device-apple-watch-ultra .device-frame {
        box-shadow: inset 0 0 12px 1px rgba(13, 13, 13, .75), inset 0 0 0 6px #d6ccc2, inset 0 0 0 12px #d6ccc2, ${boxShadow};
      }

      .device-apple-watch-s8 .device-frame {
        box-shadow: inset 0 0 24px 1px #0d0d0d, inset 0 0 0 12px #606c78, ${boxShadow};
      }
    `
};