import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers/index";
import createSagaMiddleware from 'redux-saga'

// ...
import { neffosSaga } from './sagas'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(neffosSaga)

export default store;