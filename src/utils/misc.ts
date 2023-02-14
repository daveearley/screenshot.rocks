import {Browsers} from "../types";

export const getBrowserType = (): Browsers | null => {
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

    if (userAgent.includes('Safari')) {
        return Browsers.Safari;
    }

    return null;
}

export const getBrowserExtensionInfo = () => {
    const browser = getBrowserType();

    const availableExtension = {
        [Browsers.Firefox]: {
            link: 'https://addons.mozilla.org/en-US/firefox/addon/one-click-design-mockups',
            name: 'FireFox Add-On',
        },
        [Browsers.Edge]: {
            link: 'https://microsoftedge.microsoft.com/addons/detail/clennbaklmghlnlamipjmfikdnlhiaem',
            name: 'Edge Add-On',
        },
        [Browsers.Chrome]: {
            link: 'https://chrome.google.com/webstore/detail/screenshotrocks-one-click/oolmphedpohnagciifbnfpemadolahki/',
            name: 'Chrome Extension',
        }
    };
    if (!availableExtension.hasOwnProperty(browser)) {
        return null;
    }

    return (availableExtension as any)[browser];
}

export const equals = (thing1: any, thing2: any): boolean => (thing1 === thing2);