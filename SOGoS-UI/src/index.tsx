import './modules/modules.d';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/App';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import {fetchApplicationConfiguration, history} from "./config/Configuration";
import {PersistGate} from "redux-persist/lib/integration/react";
import initWorkboxRefresh from '@loopmode/cra-workbox-refresh';
import {BrowserRouter as Router} from "react-router-dom";
import {ConnectedRouter} from "connected-react-router";

const {store, persistor} = fetchApplicationConfiguration();

ReactDOM.render(
    <Router>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <ConnectedRouter history={history}>
                    <App/>
                </ConnectedRouter>
            </PersistGate>
        </Provider>
    </Router>,
    document.getElementById('root')
);

const renderRefreshUI = (registration: any) => {
    window.dispatchEvent(new CustomEvent('sogosUpdateAvailable', {
        detail: registration
    }));
};

if (process.env.NODE_ENV === 'production') {
    serviceWorker.register({
        onUpdate: registration => initWorkboxRefresh(registration, {
            render: renderRefreshUI
        })
    });
} else {
    serviceWorker.unregister();
}
