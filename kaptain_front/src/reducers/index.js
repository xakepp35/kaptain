import { POD_ADD, POD_DEL } from "../actions/types";

const initialState = {
    podsData: {}
};
  
const rootReducer = (state = initialState, action) => {
    switch(action.type) {
        case POD_ADD:
            state.podsData[action.payload.metadata.uid] = action.payload
            break
        case POD_DEL:
            delete state.podsData[action.payload.metadata.uid]
            break
    }
    return state
}

export default rootReducer;