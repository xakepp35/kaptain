import { POD_ADD, POD_DEL } from "../actions/types";

const initialState = {
    podsData: {}
};

const mapPodPayload = (podPayload) => ({
    uid: podPayload.metadata.uid,
    namespace: podPayload.metadata.namespace,
    name: podPayload.metadata.name,
    status: podPayload.status.phase,
    startTime: podPayload.status.startTime,
    nodeName: podPayload.spec.nodeName,
})
  
const rootReducer = (state = initialState, action) => {
    switch(action.type) {
        case POD_ADD:
            return {
                ...state,
                podsData: {
                    ...state.podsData,
                    [action.payload.metadata.uid]: mapPodPayload(action.payload),
                }
            }
        case POD_DEL:
            const next = {...state}
            delete next.podsData[action.payload]
            return next
    }
    return state
}

export default rootReducer;