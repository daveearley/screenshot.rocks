import React from "react";
import {ICanvasProps} from "../../Canvas";
import {view} from "@risingstack/react-easy-state";
import {styles} from "./styles";

export const PhoneFrame = view((props: ICanvasProps) => {
    return (
        <div className={styles(props)}>

            <div className="bezel">
                <div className="volume-buttons">
                    <div/>
                    <div/>
                </div>
                <div className="power-button"/>
                <div className="top">
                    <div className="inner-top">
                        <div className="speaker"/>
                        <div className="camera"/>
                    </div>
                </div>
                <img id="screenshot"
                     src={props.imageData}
                     alt="Screenshot.rocks browser mockup"/>
            </div>
        </div>
    );
});