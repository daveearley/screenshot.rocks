import React from "react";
import {ICanvasProps} from "../../Canvas";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../../stores/appStore";
import {phoneStore} from "../../../../stores/phoneStore";

export const PhoneFrame = view((props: ICanvasProps) => {
    const finish = phoneStore.finish;
    const {showDynamicIsland, alignment} = phoneStore.settings;
    return <div className="minimal-phone" style={{
        width: '100%', boxSizing: 'border-box', padding: 10, borderRadius: 54, position: 'relative',
        background: finish.body, border: `2px solid ${finish.edge}`,
        boxShadow: `inset 0 0 0 1px rgba(255,255,255,.06), 0 20px ${Number(app.canvasStyles.shadowSize) * 2}px -12px #11182755`,
    }}>
        <div style={{borderRadius: 42, overflow: 'hidden', background: '#fff', height: 953, boxShadow: '0 0 0 1px rgba(0,0,0,.35)'}}>
            <img alt="iPhone mockup" draggable={false} src={app.croppedImageData || props.imageData}
                 style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: alignment === 'center' ? 'center' : 'top', display: 'block'}}/>
        </div>
        {showDynamicIsland && <div style={{position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)', width: 108, height: 30, borderRadius: 20, background: '#000'}}/>}
    </div>;
});
