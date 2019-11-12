import {combineReducers} from "redux";
import {UserState} from "./UserReducer";
import userReducer from './UserReducer';
import {SecurityState} from "./SecurityReducer";
import securityReducer from './SecurityReducer';
import {ConfigurationState} from "./ConfigurationReducer";
import configurationReducer from './ConfigurationReducer';
import {ActivityState} from "./ActivityReducer";
import activityReducer from './ActivityReducer';
import {NetworkState} from "./NetworkReducer";
import networkReducer from './NetworkReducer';
import {HistoryState} from "./HistoryReducer";
import HistoryReducer from "./HistoryReducer";
import {StrategyState} from "./StrategyReducer";
import StrategyReducer from "./StrategyReducer";
import {PomodoroState, TacticalActivityState, TacticalState} from "./TacticalReducer";
import TacticalReducer from "./TacticalReducer";
import {MiscState} from "./MiscReducer";
import MiscReducer from "./MiscReducer";

export interface GlobalState {
  security: SecurityState;
  user: UserState;
  configuration: ConfigurationState;
  activity: ActivityState;
  network: NetworkState;
  history: HistoryState;
  strategy: StrategyState;
  tactical: TacticalState;
  misc: MiscState;
}

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

export const selectSecurityState =
    (globalState: GlobalState): SecurityState => globalState.security;

export const selectMiscState =
    (globalState: GlobalState): MiscState => globalState.misc;

export const selectActivityState =
    (globalState: GlobalState): ActivityState => globalState.activity;

export const selectNetworkState =
    (globalState: GlobalState): NetworkState => globalState.network;

export const selectUserState =
    (globalState: GlobalState): UserState => globalState.user;

export const selectConfigurationState =
    (globalState: GlobalState): ConfigurationState => globalState.configuration;

export const selectHistoryState =
    (globalState: GlobalState): HistoryState => globalState.history;

export const selectStrategyState =
    (globalState: GlobalState): StrategyState => globalState.strategy;

export const selectTacticalState =
    (globalState: GlobalState): TacticalState => globalState.tactical;

export const selectPomodoroState =
    (globalState: GlobalState): PomodoroState => selectTacticalState(globalState).pomodoro;

export const selectTacticalActivityState =
    (globalState: GlobalState): TacticalActivityState => selectTacticalState(globalState).activity;

export default rootReducer;
