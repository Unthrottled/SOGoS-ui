import {combineReducers} from "redux";
import userReducer from './UserReducer';
import securityReducer from './SecurityReducer';
import configurationReducer from './ConfigurationReducer';
import activityReducer from './ActivityReducer';
import networkReducer from './NetworkReducer';
import HistoryReducer from "./HistoryReducer";
import StrategyReducer from "./StrategyReducer";

const rootReducer = combineReducers({
  security: securityReducer,
  user: userReducer,
  configuration: configurationReducer,
  activity: activityReducer,
  network: networkReducer,
  history: HistoryReducer,
  strategy: StrategyReducer,
});

export const selectSecurityState = globalState =>globalState.security;

export const selectConfigurationState = globalState =>globalState.configuration;

export const selectActivityState = globalState =>globalState.activity;

export const selectNetworkState = globalState =>globalState.network;

export const selectUserState = globalState =>globalState.user;

export const selectHistoryState = globalState =>globalState.history;

export const selectStrategyState = globalState =>globalState.strategy;

export default rootReducer;
