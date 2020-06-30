import {view} from "@risingstack/react-easy-state";
import {app} from "../../stores/appStore";
import {App} from "./App";
import {Homepage} from "./Homepage";
import React from "react";

export const Layout = view(() => {
    return app.imageData ? <App/> : <Homepage/>;
});