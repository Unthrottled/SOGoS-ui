import {Action} from "redux";
import {RESUMED_TIMED_ACTIVITY, STARTED_TIMED_ACTIVITY} from "../events/ActivityEvents";
import type {Activity} from "../events/ActivityEvents";

export type ActivityState = {
  shouldTime: boolean,
  currentActivity: Activity,
}

const INITIAL_ACTIVITY_STATE: ActivityState = {
  shouldTime: false,
  currentActivity: {},
};


const userReducer = (state: ActivityState = INITIAL_ACTIVITY_STATE, action: Action) => {
  switch (action.type) {
    case STARTED_TIMED_ACTIVITY :
    case RESUMED_TIMED_ACTIVITY :
      return {
        ...state,
        shouldTime: true,
        currentActivity: action.payload
      };
    default:
      return state
  }
};

export default userReducer;
