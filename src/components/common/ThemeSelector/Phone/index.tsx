import React from "react";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../../stores/appStore";
import {styles} from "./styles";

export const PhoneThemeSelector = view(() => {
    return (
        <div className={styles(app.canvasBgColor)}>

        </div>
    );
});