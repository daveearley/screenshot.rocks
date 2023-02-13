import React from "react";
import {browserStore} from "../../../stores/browserStore";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../stores/appStore";
import {FrameType} from "../../../types";
import {phoneStore} from "../../../stores/phoneStore";
import {noFrameStore} from "../../../stores/noFrameStore";

const browserSettings = {
    showWindowControls: 'Window Controls',
    showAddressBar: 'URL Bar',
    showAddressBarUrl: 'URL Text',
    showNavigationButtons: 'Nav Buttons',
    showSettingsButton: 'Settings Button',
    showBoxShadow: 'Show Shadow',
}

const phoneSettings = {
    showSpeaker: 'Show Speaker',
    showCamera: 'Show Camera',
    showVolumeRocker: 'Show Volume Rocker',
    showShadow: 'Show Shadow',
}

const noFrameSettings = {
    showShadow: 'Show Shadow',
}

const frameTypeToSettingsMap = {
    [FrameType.Browser]: browserSettings,
    [FrameType.Phone]: phoneSettings,
    [FrameType.None]: noFrameSettings,
}

const frameTypeToStoreMap = {
    [FrameType.Browser]: browserStore,
    [FrameType.Phone]: phoneStore,
    [FrameType.None]: noFrameStore,
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
            <input
                onChange={onChange}
                checked={checked}
                className="form-check-input"
                type="checkbox"
                id={id}/>
            <label className="form-check-label" htmlFor={id}>
                {label}
            </label>
        </div>
    );
}

export const Settings = view(() => {
    const settings = frameTypeToSettingsMap[app.frameType] as any;
    const store = (frameTypeToStoreMap as any)[app.frameType];
    return (
        <>
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
        </>
    );
});
