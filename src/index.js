import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/App';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import {fetchApplicationConfiguration} from "./config/Configuration";
import {PersistGate} from "redux-persist/lib/integration/react";
import initWorkboxRefresh from '@loopmode/cra-workbox-refresh';

const { store, persistor } = fetchApplicationConfiguration();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App/>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

const renderRefreshUI = registration =>{
  window.dispatchEvent(new CustomEvent('sogosUpdateAvailable', {
    detail: registration
  }));
};

if(process.env.NODE_ENV === 'production'){
  serviceWorker.register({
    onUpdate: registration => initWorkboxRefresh(registration, {
      render: renderRefreshUI
    })
  });
} else {
  serviceWorker.unregister();
}
