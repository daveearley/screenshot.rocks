import React from "react";
import {ICanvasProps} from "../../Canvas";
import {view} from "@risingstack/react-easy-state";
import {styles} from "./styles";
import {ImageSelector} from "../../ImageSelector";

export const NoFrameFrame = view((props: ICanvasProps) => {
    return (
        <div className={styles(props)}>
                {props.imageData
                    ? <img id="screenshot"
                           src={props.imageData}
                           alt="Screenshot.rocks browser mockup"/>
                    : <ImageSelector/>}
        </div>
    );
});