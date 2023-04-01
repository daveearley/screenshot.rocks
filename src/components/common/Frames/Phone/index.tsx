import React from "react";
import {ICanvasProps} from "../../Canvas";
import {view} from "@risingstack/react-easy-state";
import {styles} from "./styles";
import "../../../../css/devices.css";
import {deviceIdMap, phoneStore} from "../../../../stores/phoneStore";
import {app} from "../../../../stores/appStore";

export const PhoneFrame = view((props: ICanvasProps) => {
    const colourVariant = phoneStore.getColourVariant() ? `device-${phoneStore.getColourVariant()}` : '';
    return (
        <div className={styles()}>
            <div className={`device ${colourVariant} device-${deviceIdMap[phoneStore.activeTheme]}`}>
                <div className="device-frame">
                    <img className="device-screen"
                         src={app.croppedImageData || props.imageData}
                         loading="lazy"
                         alt="Mobile mockup"
                    />
                </div>
                <div className="device-stripe"/>
                <div className="device-header"/>
                <div className="device-sensors"/>
                <div className="device-btns"/>
                <div className="device-power"/>
                <div className="device-home"/>
            </div>
        </div>
    );
});