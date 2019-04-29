import {combineReducers} from "redux";
import userReducer from './UserReducer';
import securityReducer from './SecurityReducer';
import configurationReducer from './ConfigurationReducer';

const rootReducer = combineReducers({
  security: securityReducer,
  user: userReducer,
  configuration: configurationReducer
});

export default rootReducer;
