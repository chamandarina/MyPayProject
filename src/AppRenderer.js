import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { configureStore } from './redux/store';
import { loadState, saveState } from './redux/localStorage';

const persistedState = loadState();

const App = React.lazy(() => import(/* webpackChunkName: "App" */'./App' ));

ReactDOM.render(
  <Provider store={configureStore(persistedState)}>
    <Suspense fallback={<div className="loading" />}>
      <App />
    </Suspense>
  </Provider>,
  document.getElementById('root')
);
/*
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: https://bit.ly/CRA-PWA
 */
serviceWorker.unregister();
