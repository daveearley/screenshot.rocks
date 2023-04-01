import React from "react";
import {view} from "@risingstack/react-easy-state";
import {BrowserThemeSelector} from "./Browser";
import {PhoneThemeSelector} from "./Phone";
import {ScreenshotType} from "../../../types";
import {app} from "../../../stores/appStore";
import {NoFrameThemeSelector} from "./NoFrame";

const themeMap = {
    [ScreenshotType.Device]: <PhoneThemeSelector/>,
    [ScreenshotType.Browser]: <BrowserThemeSelector/>,
    [ScreenshotType.None]: <NoFrameThemeSelector/>,
};

export const ThemeSelector = view(() => {
    return (themeMap as any)[app.frameType];
});