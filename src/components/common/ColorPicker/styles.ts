import {css} from "emotion";

export const styles = (color: any) => {
    return css`
        .color {
          width: 36px;
          height: 14px;
          border-radius: 2px;
          background: rgba(${color.r}, ${color.g}, ${color.b}, ${color.a});
        }
        
        .swatch {
          padding: 5px;
          background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==");
          background-color: #ffffff;
          border-radius: 3px;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, .1);
          display: inline-block;
          cursor: pointer;
        }
        
        .popup {
          position: absolute;
          z-index: 2;
        }
        
        .cover {
          position: fixed;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;
        }     
`;
};