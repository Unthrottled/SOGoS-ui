import {Action} from "redux";
import {
  CACHED_ACTIVITY, FOUND_PREVIOUS_ACTIVITY,
  RESUMED_NON_TIMED_ACTIVITY,
  RESUMED_TIMED_ACTIVITY,
  STARTED_NON_TIMED_ACTIVITY,
  STARTED_TIMED_ACTIVITY,
  SYNCED_ACTIVITIES
} from "../events/ActivityEvents";
import type {Activity} from "../types/ActivityModels";
import {objectToKeyValueArray} from "../miscellanous/Tools";

export type ActivityState = {
  shouldTime: boolean,
  currentActivity: Activity,
  previousActivity: Activity,
  cache: any,
}

export const INITIAL_ACTIVITY_STATE: ActivityState = {
  shouldTime: false,
  currentActivity: {
    content: {}
  },
  previousActivity: {
    content: {}
  },
  cache: {},
};


const activityReducer = (state: ActivityState = INITIAL_ACTIVITY_STATE, action: Action) => {
  switch (action.type) {
    case STARTED_TIMED_ACTIVITY :
    case RESUMED_TIMED_ACTIVITY :
      return {
        ...state,
        shouldTime: true,
        previousActivity: state.currentActivity.antecedenceTime ? state.currentActivity : state.previousActivity,
        currentActivity: action.payload
      };
    case STARTED_NON_TIMED_ACTIVITY:
    case RESUMED_NON_TIMED_ACTIVITY:
      return {
        ...state,
        shouldTime: false,
        previousActivity: state.currentActivity.antecedenceTime ? state.currentActivity: state.previousActivity,
        currentActivity: action.payload,
      };
    case FOUND_PREVIOUS_ACTIVITY:
      return {
        ...state,
        previousActivity: action.payload,
      };
    case CACHED_ACTIVITY: {
      const {userGUID, cachedActivity} = action.payload;
      if (state.cache[userGUID]) {
        state.cache[userGUID].push(cachedActivity)
      } else {
        state.cache[userGUID] = [cachedActivity]
      }
      return {
        ...state,
        cache: {
          ...state.cache,
        }
      };
    }
    case SYNCED_ACTIVITIES: {
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

export default activityReducer;
