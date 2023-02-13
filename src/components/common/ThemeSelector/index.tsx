import React from "react";
import {view} from "@risingstack/react-easy-state";
import {BrowserThemeSelector} from "./Browser";
import {PhoneThemeSelector} from "./Phone";
import {FrameType} from "../../../types";
import {app} from "../../../stores/appStore";
import {NoFrameThemeSelector} from "./NoFrame";

const themeMap = {
    [FrameType.Phone]: <PhoneThemeSelector/>,
    [FrameType.Browser]: <BrowserThemeSelector/>,
    [FrameType.None]: <NoFrameThemeSelector/>,
};

export const ThemeSelector = view(() => {
    return (themeMap as any)[app.frameType];
});