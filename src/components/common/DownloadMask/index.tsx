import React from "react";
import {css} from "emotion";

const styles = css`
  background: #524573 url("/images/bg.png");
  background-size: 100px;
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  flex-direction: column;

  h2 {
    color: #ffffff;
    font-weight: bold;
  }

  img {
    margin-top: 10px;
    width: 100px;
    animation-name: wiggle;
    animation-iteration-count: infinite;

    animation: wiggle .3s infinite;
    animation-direction: alternate;

    @keyframes wiggle {
      from {
        transform: rotate(10deg);
        display: none;
      }

      to {
        transform: rotate(-10deg);
      }
    }
  }
`

export const DownloadMask = () => {
    return (
        <div className={styles}>
            <img alt={'Just a second...'} src={'images/hand-logo-sqr-white.png'}/>
            <h2>Just a second...</h2>
        </div>
    );
};