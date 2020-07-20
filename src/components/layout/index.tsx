import {view} from "@risingstack/react-easy-state";
import {App} from "./App";
import {Homepage} from "./Homepage";
import React, {useEffect} from "react";
import {Routes, routeStore} from "../../stores/routeStore";

export const MainApp = view(() => {
    if (routeStore.currentRoute === null) {
        routeStore.determineRoute();
    }

    useEffect(() => {
        window.addEventListener('popstate', routeStore.determineRoute);
        return () => window.removeEventListener('popstate', routeStore.determineRoute);
    });

    switch (routeStore.currentRoute) {
        case Routes.App:
            return <App/>;
        case Routes.Home:
            return <Homepage />;
        default:
            //todo - add 404 page
            return <Homepage />;
    }
});