import {applyMiddleware, compose, createStore} from 'redux';
import omit from 'lodash/omit';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';
import {createTransform, persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import {routerMiddleware} from 'connected-react-router';
import {createBrowserHistory} from 'history';

export const history = createBrowserHistory();
const fetchMiddleware = (sagaMiddleware: any) => {
  const commonMiddleware = [thunk, sagaMiddleware, routerMiddleware(history)];
  if (process.env.NODE_ENV === 'development') {
    const reactoTron = require('./ReactotronConfiguration').default;
    return compose(
      applyMiddleware(...commonMiddleware),
      reactoTron.createEnhancer(),
    );
  }
  return applyMiddleware(...commonMiddleware);
};

const blackListTransform = createTransform((inboundState: any, key) => {
  if (key === 'security') {
    return omit(inboundState, ['isInitialized', 'isOutOfSync', 'readOnly', 'readToken']);
  } else if (key === 'misc') {
    return omit(inboundState, ['notification', 'avatarUpload',]);
  } else {
    return inboundState;
  }
});

export const fetchApplicationConfiguration = () => {
  const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['security', 'user', 'activity', 'strategy', 'tactical', 'misc'],
    transforms: [blackListTransform],
  };

  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    persistReducer(persistConfig, rootReducer(history)),
    fetchMiddleware(sagaMiddleware),
  );
  sagaMiddleware.run(rootSaga);

  const persistor = persistStore(store);

  return {
    store,
    persistor,
  };
};
