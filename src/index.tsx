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

// The old service worker served the app for every URL, hiding the static pages; remove it and reload those URLs.
serviceWorker.unregister();
if ('serviceWorker' in navigator && navigator.serviceWorker.controller && !/^\/(app)?$/.test(window.location.pathname)) {
    navigator.serviceWorker.getRegistrations()
        .then(registrations => Promise.all(registrations.map(registration => registration.unregister())))
        .then(() => window.location.reload());
}
