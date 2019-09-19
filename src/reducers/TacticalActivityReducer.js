import {Action} from "redux";
import {objectToArray, objectToKeyValueArray} from "../miscellanous/Tools";
import type {TacticalState} from "./TacticalReducer";
import {INITIAL_TACTICAL_STATE} from "./TacticalReducer";
import {
  CACHED_TACTICAL_ACTIVITY,
  CREATED_ACTIVITY,
  DELETED_ACTIVITY,
  FOUND_ACTIVITIES,
  SYNCED_TACTICAL_ACTIVITIES,
  UPDATED_ACTIVITY
} from "../events/TacticalEvents";
import {dictionaryReducer} from "./StrategyReducer";


const updateStateWithActivities = (newActivities, state: TacticalState): TacticalState => {
  const tacticalActivities = [
    ...objectToArray(state.activity.activities),
    ...newActivities
  ].reduce(dictionaryReducer, {});
  return {
    ...state,
    activity: {
      ...state.activity,
      activities: tacticalActivities
    }
  };
};

const TacticalActivityReducer = (state: TacticalState = INITIAL_TACTICAL_STATE, action: Action) => {
  switch (action.type) {
    case CREATED_ACTIVITY:
    case UPDATED_ACTIVITY:
      const newActivity = [action.payload];
      return updateStateWithActivities(newActivity, state);
    case DELETED_ACTIVITY:
      const {payload: deletedActivity} = action;
      const newActivities = objectToArray(state.activity.activities).filter(suspiciousActivity =>
        suspiciousActivity.id !== deletedActivity.id);
      return {
        ...state,
        activity: {
         ...state.activity,
          activities: newActivities.reduce(dictionaryReducer, {}),
        }
      };
    case FOUND_ACTIVITIES:
      const rememberedActivities = action.payload.reduce(dictionaryReducer, {});
      return {
        ...state,
        activity: {
          ...state.activity,
          activities: rememberedActivities,
        },
      };
    case CACHED_TACTICAL_ACTIVITY: {
      const {userGUID, cachedActivity} = action.payload;
      if (state.activity.cache[userGUID]) {
        state.activity.cache[userGUID].push(cachedActivity)
      } else {
        state.activity.cache[userGUID] = [cachedActivity]
      }
      return {
        ...state,
        activity: {
          ...state.activity,
        }
      };
    }
    case SYNCED_TACTICAL_ACTIVITIES: {
      return {
        ...state,
        activity: {
          ...state.activity,
          cache: {
            ...objectToKeyValueArray(state.activity.cache)
              .filter(keyValues => keyValues.key !== action.payload)
              .reduce((accum, keyValue) => {
                accum[keyValue.key] = keyValue.value;
                return accum
              }, {}),
          }
        },
      };
    }
    default:
      return state
  }
};

export default TacticalActivityReducer;
