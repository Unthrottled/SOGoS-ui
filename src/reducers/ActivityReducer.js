import {Action} from "redux";
import {
  CACHED_ACTIVITY,
  RESUMED_NON_TIMED_ACTIVITY,
  RESUMED_TIMED_ACTIVITY,
  STARTED_NON_TIMED_ACTIVITY,
  STARTED_TIMED_ACTIVITY, SYNCED_ACTIVITIES
} from "../events/ActivityEvents";
import type {Activity} from "../events/ActivityEvents";

export type ActivityState = {
  shouldTime: boolean,
  currentActivity: Activity,
  previousActivity: Activity,
  cache: any,
}

const INITIAL_ACTIVITY_STATE: ActivityState = {
  shouldTime: false,
  currentActivity: {
    content:{}
  },
  previousActivity: {
    content:{}
  },
  cache: {},
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
    case CACHED_ACTIVITY: {
      const {userGUID, cachedActivity} = action.payload;
      if(state.cache[userGUID]){
        state.cache[userGUID].push(cachedActivity)
      } else {
        state.cache[userGUID] = [cachedActivity]
      }
      return state;
    }
    case SYNCED_ACTIVITIES: {
      state.cache[action.payload] = [];
      return state;
    }
    default:
      return state
  }
};

export default userReducer;
