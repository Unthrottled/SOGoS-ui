import {Action} from "redux";
import type {PomodoroSettings} from "../types/TacticalModels";
import {
  CACHED_SETTINGS,
  REGISTERED_POMODORO_SETTINGS,
  SYNCED_SETTINGS,
  UPDATED_POMODORO_SETTINGS
} from "../events/TacticalEvents";
import {objectToKeyValueArray} from "../miscellanous/Tools";
import type {TacticalActivity} from "../types/ActivityModels";

export type PomodoroState = {
  pomodoroSettings: PomodoroSettings,
  cache: any,
}

export type ActivityState = {
  activities: TacticalActivity[],
  cache: any,
}

export type TacticalState = {
  activity: ActivityState,
  pomodoro: PomodoroState,
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
    case REGISTERED_POMODORO_SETTINGS:
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
      return {
        ...state,
        cache: {
          ...objectToKeyValueArray(state.cache)
            .filter(keyValues => keyValues.key !== action.payload)
            .reduce((accum, keyValue) => {
              accum[keyValue.key] = keyValue.value;
              return accum
            }, {}),
        }
      };
    }
    default:
      return state
  }
};

export default TacticalReducer;
