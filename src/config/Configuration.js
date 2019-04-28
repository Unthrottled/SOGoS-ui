import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "../reducers";
import thunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import rootSaga from '../sagas';

const fetchMiddleware = (sagaMiddleware) =>{
  const commonMiddleware = [thunk, sagaMiddleware];
  if (process.env.NODE_ENV === 'development') {
    const reactoTron = require('./ReactotronConfiguration').default;
    return compose(applyMiddleware(...commonMiddleware), reactoTron.createEnhancer());
  }
  return applyMiddleware(...commonMiddleware);
};

export const fetchApplicationConfiguration = () =>{
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducer,
    fetchMiddleware(sagaMiddleware)
  );
  sagaMiddleware.run(rootSaga);

  return {
    store
  }
};
