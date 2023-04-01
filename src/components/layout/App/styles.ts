import {css} from "emotion";

export const styles = () => {
    return css`
      display: grid;
      grid-template-areas: 
                         "sidebar toolbar"
                         "sidebar main-content";
      grid-template-columns: var(--sidebar-width) auto;
      grid-template-rows: 40px auto;

      .toolbar {
        grid-area: toolbar;
        background-color: #00000020;
        position: sticky;
        top: 0;
        z-index: 1;
        align-items: center;
        display: flex;

        .crop-buttons {
          flex-grow: 1;

          .btn:first-of-type {
            margin-right: 5px;
            margin-left: 5px;
          }
        }

        .share-this {
          display: flex;
          color: #ffffff;
          position: relative;

          .share-prompt {
            background-color: #2114406b;
            color: #ffffff;
            padding: 2px 10px;
            border-radius: 5px;
            text-align: center;
          }

          svg {
            width: 20px;
          !important;
            height: 20px;
          !important;
          }
        }
      }

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
            max-width: 75%;
          }
        }

        .settings {
          padding: 0 12px;

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

            &.bg-image-preview--file {
              position: relative;
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='white' d='M492 236H276V20c0-11.046-8.954-20-20-20s-20 8.954-20 20v216H20c-11.046 0-20 8.954-20 20s8.954 20 20 20h216v216c0 11.046 8.954 20 20 20s20-8.954 20-20V276h216c11.046 0 20-8.954 20-20s-8.954-20-20-20z'/%3E%3C/svg%3E");
              background-size: 40%;
              background-repeat: no-repeat;
              background-position: center;
              cursor: pointer;

              input[type="file"] {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer;
              }

            }
          }
        }

        .footer {
          padding: 12px;
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
        flex-direction: column;
        justify-content: center;
        max-height: 100vh;
        max-width: 100vw;
        min-width: 800px;
        position: sticky;
        top: 0;
        overflow: hidden;
      }

      .btn-group-sm > .btn, .btn-sm {
        padding: 0.15rem .15rem;
        font-size: .775rem;
      }
    `;
}