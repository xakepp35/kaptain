import { POD_ADD, POD_DEL } from "./types";

export function podAdd(payload) {
    return { type: POD_ADD, payload }
};

export function podDel(payload) {
    return { type: POD_DEL, payload }
};