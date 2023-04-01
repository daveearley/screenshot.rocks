import React from "react";
import {css} from "emotion";

export interface ISliderProps {
    defaultValue?: string | number;
    onResetClick?: () => void;
}

const styles = css`
  display: flex;
  align-items: center;

  > input {
    flex: 1;
  }

  a {
    width: 17px;
    height: 17px;
    display: flex;
    align-self: center;
    margin-left: 4px;
    padding: 2px;
  }
`

export const Slider = (props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & ISliderProps) => {
    return (
        <div className={styles}>
            <input {...props} />
            <a title={'Reset'} onClick={() => props.onResetClick()} href={'#!'}><img alt={'reset'} src={'images/reset.svg'}/></a>
        </div>
    )
}