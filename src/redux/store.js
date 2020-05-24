import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from "redux-saga";
import reducers from './reducers';
import sagas from "./sagas";
import { saveState } from './localStorage';
import { throttle } from 'redux-saga/effects';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

export function configureStore(initialState) {

    const store = createStore(
        reducers,
        initialState,
        compose(applyMiddleware(...middlewares))
    );

    sagaMiddleware.run(sagas);

    // store.subscribe(() => {
    //     saveState(store.getState());
    //   });

    if (module.hot) {
        module.hot.accept('./reducers', () => {
            const nextRootReducer = require('./reducers');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
