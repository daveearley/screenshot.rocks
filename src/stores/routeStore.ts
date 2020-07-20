import {store} from "@risingstack/react-easy-state";

export enum Routes {
    App,
    Home,
}

export const RouteConfig = {
    [Routes.App]: {
        path: '/app',
        regex: /^\/?app$/,
    },
    [Routes.Home]: {
        path: '/',
        regex: /^\/$/,
    }
}

interface IRouteStore {
    currentRoute: Routes | null;

    goToRoute(route: Routes): void;

    determineRoute(): void;
}

export const routeStore = store({
    currentRoute: null,

    goToRoute: (route: Routes) => {
        if (route !== routeStore.currentRoute) {
            window.history.pushState(null, null, RouteConfig[route].path);
            dispatchEvent(new PopStateEvent('popstate', null));
        }
    },
    determineRoute: () => {
        Object.keys(RouteConfig).forEach((config, routeIndex) => {
            if (window.location.pathname.match((RouteConfig as any)[config].regex)) {
                routeStore.currentRoute = routeIndex;
            }
        });
    }

} as IRouteStore);