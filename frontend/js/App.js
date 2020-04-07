import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Routes from './routes';
import rootReducer from './state/reducers';
import SentryBoundary from './utils/SentryBoundary';

const store = createStore(rootReducer);

const App = () => (
  <SentryBoundary>
    <Provider store={store}>
      <Routes />
    </Provider>
  </SentryBoundary>
);

export default hot(App);
