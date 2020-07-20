import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {Global} from "@emotion/core";
import {styles} from "./styles";
import {MainApp} from "./components/layout";

ReactDOM.render(
    <React.StrictMode>
        <Global styles={styles()}/>
        <MainApp/>
    </React.StrictMode>,
    document.getElementById('screenshot.rocks')
);

serviceWorker.register();
