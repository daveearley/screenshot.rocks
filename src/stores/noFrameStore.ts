import {store} from "@risingstack/react-easy-state";

export interface INoFrameStore {
}

export let noFrameStore = store({
    settings: {},
} as INoFrameStore);
