import {Action} from "redux";
import type {PomodoroSettings, TacticalActivity} from "../types/TacticalModels";
import {
  CACHED_SETTINGS,
  REGISTERED_POMODORO_SETTINGS,
  SYNCED_SETTINGS,
  UPDATED_POMODORO_SETTINGS
} from "../events/TacticalEvents";
import {objectToKeyValueArray} from "../miscellanous/Tools";
import TacticalActivityReducer from "./TacticalActivityReducer";

export type PomodoroState = {
  settings: PomodoroSettings,
  cache: any,
}

export type TacticalActivityState = {
  activities: TacticalActivity[],
  cache: any,
}

export type TacticalState = {
  activity: TacticalActivityState,
  pomodoro: PomodoroState,
}

export const INITIAL_TACTICAL_STATE: TacticalState = {
  pomodoro: {
    settings: {
      loadDuration: 1620000,//milliseconds
      shortRecoveryDuration: 180000,
      longRecoveryDuration: 2400000,
    },
    cache: {},
  },
  activity: {
    activities: {},
    cache: {},
  }
};

const TacticalReducer = (state: TacticalState = INITIAL_TACTICAL_STATE, action: Action) => {
  const updatedState = TacticalActivityReducer(state, action);
  switch (action.type) {
    case UPDATED_POMODORO_SETTINGS:
    case REGISTERED_POMODORO_SETTINGS:
      return {
        ...updatedState,
        settings: {
          ...updatedState.pomodoro.settings,
          ...action.payload
        }
      };
    case CACHED_SETTINGS: {
      const {userGUID, cachedSettings} = action.payload;
      updatedState.pomodoro.cache[userGUID] = cachedSettings;
      return updatedState;
    }
    case SYNCED_SETTINGS: {
      return {
        ...updatedState,
        pomodoro: {
          ...updatedState.pomodoro,
          cache: {
            ...objectToKeyValueArray(updatedState.cache)
              .filter(keyValues => keyValues.key !== action.payload)
              .reduce((accum, keyValue) => {
                accum[keyValue.key] = keyValue.value;
                return accum
              }, {}),
          }
        }
      };
    }
    default:
      return updatedState
  }
};

export default TacticalReducer;
