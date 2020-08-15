import React from "react";
import {ICanvasProps} from "../../Canvas";
import {view} from "@risingstack/react-easy-state";
import {styles} from "./styles";
import {phoneStore} from "../../../../stores/phoneStore";
import {ImageSelector} from "../../ImageSelector";

export const PhoneFrame = view((props: ICanvasProps) => {
    return (
        <div className={styles(props)}>
            <div className="bezel">
                {phoneStore.settings.showVolumeRocker &&
                <div className="volume-buttons">
                    <div/>
                    <div/>
                </div>
                }
                <div className="power-button"/>
                <div className="top">
                    <div className="inner-top">
                        {phoneStore.settings.showSpeaker && <div className="speaker"/>}
                        {phoneStore.settings.showCamera && <div className="camera"/>}
                    </div>
                </div>
                {props.imageData
                    ? <img id="screenshot"
                           src={props.imageData}
                           alt="Screenshot.rocks browser mockup"/>
                    : <ImageSelector/>}
            </div>
        </div>
    );
});