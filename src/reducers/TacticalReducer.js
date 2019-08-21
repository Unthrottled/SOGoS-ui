import {Action} from "redux";
import type {PomodoroSettings} from "../types/TacticalModels";
import {UPDATED_POMODORO_SETTINGS} from "../events/TacticalEvents";

export type TacticalState = {
  pomodoroSettings: PomodoroSettings,
}

const INITIAL_TACTICAL_STATE: TacticalState = {
  pomodoroSettings: {
    loadDuration: 25,
    shortRecoveryDuration: 5,
    longRecoveryDuration: 30,
  }
};

const TacticalReducer = (state: TacticalState = INITIAL_TACTICAL_STATE, action: Action) => {
  switch (action.type) {
    case UPDATED_POMODORO_SETTINGS:
      return {
        ...state,
        pomodoroSettings: action.payload
      };
    default:
      return state
  }
};

export default TacticalReducer;
