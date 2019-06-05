import {combineReducers} from "redux";
import userReducer from './UserReducer';
import securityReducer from './SecurityReducer';
import configurationReducer from './ConfigurationReducer';
import activityReducer from './ActivityReducer';

const rootReducer = combineReducers({
  security: securityReducer,
  user: userReducer,
  configuration: configurationReducer,
  activity: activityReducer,
});

export const selectSecurityState = globalState =>globalState.security;

export const selectConfigurationState = globalState =>globalState.configuration;

export const selectActivityState = globalState =>globalState.activity;

export default rootReducer;
