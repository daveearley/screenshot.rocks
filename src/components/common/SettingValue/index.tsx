import React from "react";
import {styles} from "./styles";

export const SettingValue = (props: {value: string | number}) => {
    return  <div className={styles()}>{props.value}</div>
};