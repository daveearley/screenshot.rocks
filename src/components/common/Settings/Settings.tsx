import React, {FormEvent} from "react";
import {browserStore} from "../../../stores/browserStore";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../stores/appStore";
import {ScreenshotType} from "../../../types";
import {deviceColourVariantMap, deviceNamesMap, phoneStore, PhoneThemes} from "../../../stores/phoneStore";
import {noFrameStore} from "../../../stores/noFrameStore";
import {styles} from "./styles";
import {DeviceColour} from "../../../values/device-colour";

const browserSettings = {
    showWindowControls: 'Show Window Controls',
    showNavigationButtons: 'Show Nav Buttons',
    showSettingsButton: 'Show Settings Button',
    showAddressBar: 'Show URL Bar',
    showAddressBarUrl: 'Show URL Text',
}

const phoneSettings = {}

const noFrameSettings = {};

const twitterSettings = {
    showTwitterLogo: "Show Twitter Logo",
    showMetrics: "Show Tweet Metrics",
    showMedia: "Show Twitter Media",
}

const frameTypeToSettingsMap = {
    [ScreenshotType.Browser]: browserSettings,
    [ScreenshotType.Device]: phoneSettings,
    [ScreenshotType.None]: noFrameSettings,
    [ScreenshotType.Code]: noFrameSettings,
    [ScreenshotType.Twitter]: noFrameSettings,
}

const frameTypeToStoreMap = {
    [ScreenshotType.Browser]: browserStore,
    [ScreenshotType.Device]: phoneStore,
    [ScreenshotType.None]: noFrameStore,
}

interface settingToggleProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {};
    checked: boolean;
    id: string;
    label: string;
}

const SettingToggle = ({onChange, checked, id, label}: settingToggleProps) => {
    return (
        <div className="form-check form-switch">
            <label className="form-check-label" htmlFor={id}>
                {label}
            </label>
            <input
                onChange={onChange}
                checked={checked}
                className="form-check-input"
                type="checkbox"
                id={id}/>
        </div>
    );
}

const UrlInput = view(() => {
    if (!browserStore.settings.showAddressBarUrl || app.frameType !== ScreenshotType.Browser) {
        return null;
    }
    return (
        <div className="row mt-2">
            <div className="col-5 d-flex align-items-center">
                Browser URL
            </div>
            <div className="col-7 pl-0">
                <input
                    className="url-input"
                    value={browserStore.settings.addressBarUrl}
                    type="text"
                    onChange={(e: FormEvent<HTMLInputElement>) => {
                        browserStore.settings.addressBarUrl = e.currentTarget.value
                    }}
                />
            </div>
        </div>
    )
});

const ColourVariants = view(({colourVariants, onColourSelect}: {colourVariants: DeviceColour[], onColourSelect: (colourVariant: string) => void}) => {
    return (
        <div className="colour-variants">
            {colourVariants.map(colourVariant => {
                return (
                    <div style={{
                        background: colourVariant.hexCode
                    }}
                         onClick={() => onColourSelect(colourVariant.colourName)}
                         className={`variant ${phoneStore.getColourVariant() === colourVariant.colourName ? 'selected' : ''}`}
                    />
                )
            })}
        </div>
    );
});

const PhoneFrameInput = (() => {
    if (app.frameType !== ScreenshotType.Device) {
        return null;
    }
    const selectedDevice: number = phoneStore.activeTheme;
    const colourVariants: DeviceColour[] = deviceColourVariantMap.get(parseInt(String(selectedDevice)));

    return (
        <>
            <select name="device-type"
                    onChange={(event) => phoneStore.activeTheme = event.target.value as unknown as PhoneThemes}>
                {Object.keys(deviceNamesMap).map((key) => {
                    return (
                        <option
                            key={PhoneThemes[selectedDevice]}
                            selected={key.toString() === selectedDevice.toString()}
                            value={key}>
                            {(deviceNamesMap as any)[key]}
                        </option>
                    );
                })}
            </select>
        </>

    );
});

export const Settings = view(() => {
    const settings = frameTypeToSettingsMap[app.frameType] as any;
    const store = (frameTypeToStoreMap as any)[app.frameType];

    return (
        <div className={styles()}>
            {Object.keys(settings).map((setting) => {
                const checked = store.settings[setting];
                return (
                    <SettingToggle
                        key={setting}
                        onChange={(e) => store.settings[setting] = e.target.checked}
                        checked={checked}
                        id={setting}
                        label={settings[setting]}
                    />
                );
            })}
            <UrlInput/>
            <PhoneFrameInput/>
        </div>
    );
});
