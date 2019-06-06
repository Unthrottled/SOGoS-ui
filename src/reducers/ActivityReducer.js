import {Action} from "redux";
import {
  RESUMED_NON_TIMED_ACTIVITY,
  RESUMED_TIMED_ACTIVITY,
  STARTED_NON_TIMED_ACTIVITY,
  STARTED_TIMED_ACTIVITY
} from "../events/ActivityEvents";
import type {Activity} from "../events/ActivityEvents";

export type ActivityState = {
  shouldTime: boolean,
  currentActivity: Activity,
  previousActivity: Activity,
}

const INITIAL_ACTIVITY_STATE: ActivityState = {
  shouldTime: false,
  currentActivity: {
    content:{}
  },
  previousActivity: {
    content:{}
  },
};


const userReducer = (state: ActivityState = INITIAL_ACTIVITY_STATE, action: Action) => {
  switch (action.type) {
    case STARTED_TIMED_ACTIVITY :
    case RESUMED_TIMED_ACTIVITY :
      return {
        ...state,
        shouldTime: true,
        previousActivity: state.currentActivity,
        currentActivity: action.payload
      };
    case STARTED_NON_TIMED_ACTIVITY:
    case RESUMED_NON_TIMED_ACTIVITY:
      return {
        ...state,
        shouldTime: false,
        previousActivity: state.currentActivity,
        currentActivity: action.payload,
      };
    default:
      return state
  }
};

export default userReducer;
