import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "../reducers";
import thunk from "redux-thunk";

const fetchMiddleware = () =>{
  const commonMiddleware = [thunk];
  if (process.env.NODE_ENV === 'development') {
    const reactoTron = require('./ReactotronConfiguration').default;
    return compose(applyMiddleware(...commonMiddleware), reactoTron.createEnhancer());
  }
  return applyMiddleware(...commonMiddleware);
};

export const fetchApplicationConfiguration = () =>{

  const store = createStore(
    rootReducer,
    fetchMiddleware()
  );

  return {
    store
  }
};
