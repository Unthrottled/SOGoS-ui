import {Action} from "redux";
import type {PomodoroSettings} from "../types/TacticalModels";
import {CACHED_SETTINGS, SYNCED_SETTINGS, UPDATED_POMODORO_SETTINGS} from "../events/TacticalEvents";

export type TacticalState = {
  pomodoroSettings: PomodoroSettings,
  cache: any,
}

const INITIAL_TACTICAL_STATE: TacticalState = {
  pomodoroSettings: {
    loadDuration: 1620000,//milliseconds
    shortRecoveryDuration: 180000,
    longRecoveryDuration: 2400000,
  },
  cache: {},
};

const TacticalReducer = (state: TacticalState = INITIAL_TACTICAL_STATE, action: Action) => {
  switch (action.type) {
    case UPDATED_POMODORO_SETTINGS:
      return {
        ...state,
        pomodoroSettings: {
          ...state.pomodoroSettings,
          ...action.payload
        }
      };
    case CACHED_SETTINGS: {
      const {userGUID, cachedSettings} = action.payload;
      state.cache[userGUID] = cachedSettings;
      return state;
    }
    case SYNCED_SETTINGS: {
      delete state.cache[action.payload];
      return state;
    }
    default:
      return state
  }
};

export default TacticalReducer;
