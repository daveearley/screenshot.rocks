import React from "react";
import {ICanvasProps} from "../../Canvas";
import {view} from "@risingstack/react-easy-state";
import {styles} from "./styles";
import {ImageSelector} from "../../ImageSelector";
import {app} from "../../../../stores/appStore";

export const NoFrameFrame = view((props: ICanvasProps) => {
    return (
        <div className={styles(props)}>
                {props.imageData
                    ? <img alt={'Screenshot'} id="screenshot" src={app.croppedImageData || app.imageData}/>
                    : <ImageSelector/>}
        </div>
    );
});