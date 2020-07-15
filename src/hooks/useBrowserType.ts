import {Browsers} from "../types";

export const useBrowserType = (): Browsers | null => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes('Edg')) {
        return Browsers.Edge;
    }

    if (userAgent.includes('Firefox')) {
        return Browsers.Firefox
    }

    if (userAgent.includes('Chrome')) {
        return Browsers.Chrome;
    }

    return null;
}
