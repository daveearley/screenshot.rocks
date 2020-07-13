import React from "react";
import {browserStore} from "../../../stores/browserStore";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../stores/appStore";
import {FrameType} from "../../../types";
import {phoneStore} from "../../../stores/phoneStore";

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
    // showShadow: 'Show Shadow',
    showVolumeRocker: 'Show Volume Rocker',
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

const BrowserSettings = view(() => {
    return (
        <>
            {Object.keys(browserSettings).map((setting) => {
                return (
                    <SettingToggle
                        key={setting}
                        onChange={(e) => (browserStore.settings as any)[setting] = e.target.checked}
                        checked={(browserStore.settings as any)[setting]}
                        id={setting}
                        label={(browserSettings as any)[setting]}
                    />
                );
            })}
        </>
    );
})

const PhoneSettings = view(() => {
    return (
        <>
            {Object.keys(phoneSettings).map((setting) => {
                return (
                    <SettingToggle
                        key={setting}
                        onChange={(e) => (phoneStore.settings as any)[setting] = e.target.checked}
                        checked={(phoneStore.settings as any)[setting]}
                        id={setting}
                        label={(phoneSettings as any)[setting]}
                    />
                );
            })}
        </>
    );
})

export const Settings = () => {
    return (
        <>
            {app.frameType === FrameType.Browser && <BrowserSettings/>}
            {app.frameType === FrameType.Phone && <PhoneSettings/>}
        </>
    );
};