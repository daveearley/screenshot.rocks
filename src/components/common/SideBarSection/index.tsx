import React from "react";
import {css} from "emotion";

interface sideBarSectionProps {
    title: string,
    isDisabled: boolean,
    children?: React.ReactNode,
}

const styles = css`
  padding: 10px 12px;
  background: #ffffff20;
  border-radius: 10px;
  margin-top: 10px;
  position: relative;

  &.disabled {
    opacity: .5;
  }

  .is-disabled {
    z-index: 5;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: 10px;
  }

  h3 {
    font-size: 1.2em;
    color: #ff79ee;
    text-align: center;
    margin-bottom: .7em;
  }
`

export const SideBarSection = ({title, isDisabled, children}: sideBarSectionProps) => {
    return (
        <div className={styles + `${isDisabled ? ' disabled' : ''}`}>
            {isDisabled && (
                <div className="is-disabled"/>
            )}
            <h3>{title}</h3>
            {children}
        </div>
    );
}