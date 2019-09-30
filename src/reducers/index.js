import {combineReducers} from "redux";
import type {UserState} from "./UserReducer";
import userReducer from './UserReducer';
import type {SecurityState} from "./SecurityReducer";
import securityReducer from './SecurityReducer';
import type {ConfigurationState} from "./ConfigurationReducer";
import configurationReducer from './ConfigurationReducer';
import type {ActivityState} from "./ActivityReducer";
import activityReducer from './ActivityReducer';
import type {NetworkState} from "./NetworkReducer";
import networkReducer from './NetworkReducer';
import type {HistoryState} from "./HistoryReducer";
import HistoryReducer from "./HistoryReducer";
import type {StrategyState} from "./StrategyReducer";
import StrategyReducer from "./StrategyReducer";
import TacticalReducer from "./TacticalReducer";
import type {PomodoroState, TacticalActivityState, TacticalState} from "./TacticalReducer";
import MiscReducer from "./MiscReducer";
import type {MiscState} from "./MiscReducer";
import type {PomodoroSettings} from "../types/TacticalModels";

const rootReducer = combineReducers({
  security: securityReducer,
  user: userReducer,
  configuration: configurationReducer,
  activity: activityReducer,
  network: networkReducer,
  history: HistoryReducer,
  strategy: StrategyReducer,
  tactical: TacticalReducer,
  misc: MiscReducer,
});

export const selectSecurityState = (globalState): SecurityState => globalState.security;

export const selectMiscState = (globalState): MiscState => globalState.misc;

export const selectActivityState = (globalState): ActivityState => globalState.activity;

export const selectNetworkState = (globalState): NetworkState => globalState.network;

export const selectUserState = (globalState): UserState => globalState.user;

export const selectConfigurationState = (globalState): ConfigurationState => globalState.configuration;

export const selectHistoryState = (globalState): HistoryState => globalState.history;

export const selectStrategyState = (globalState): StrategyState => globalState.strategy;

export const selectTacticalState = (globalState): TacticalState => globalState.tactical;

export const selectPomodoroState = (globalState): PomodoroState => selectTacticalState(globalState).pomodoro;

export const selectTacticalActivityState = (globalState): TacticalActivityState => selectTacticalState(globalState).activity;

export default rootReducer;
