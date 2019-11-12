import {objectToArray, objectToKeyValueArray} from "../miscellanous/Tools";
import {TacticalState} from "./TacticalReducer";
import {INITIAL_TACTICAL_STATE} from "./TacticalReducer";
import {
  ARCHIVED_ACTIVITY,
  CACHED_TACTICAL_ACTIVITY,
  CREATED_ACTIVITY,
  DELETED_ACTIVITY,
  FOUND_ACTIVITIES,
  REPLACE_ACTIVITIES,
  RESTORED_ACTIVITY,
  SYNCED_TACTICAL_ACTIVITIES,
  UPDATED_ACTIVITY
} from "../events/TacticalEvents";
import {dictionaryReducer} from "./StrategyReducer";
import {TacticalActivity} from "../types/TacticalTypes";


export const rankReducer = (accum: any, toIndex: TacticalActivity, index: number) => {
  if(!toIndex.rank && toIndex.rank !== 0) {
    toIndex.rank = index;
  }
  accum[toIndex.rank] = toIndex;
  return accum;
};

const updateStateWithActivities = (newActivities: TacticalActivity[], state: TacticalState): TacticalState => {
  const tacticalActivities = [
    ...objectToArray(state.activity.activities),
    ...newActivities.filter(tactAct => !tactAct.hidden)
  ].reduce(rankReducer, {});
  const archivedTacticalActivities = [
    ...objectToArray(state.activity.archivedActivities),
    ...newActivities.filter(tactAct => tactAct.hidden)
  ].reduce(dictionaryReducer, {});
  return {
    ...state,
    activity: {
      ...state.activity,
      activities: tacticalActivities,
      archivedActivities: archivedTacticalActivities,
    }
  };
};

const TacticalActivityReducer = (state: TacticalState = INITIAL_TACTICAL_STATE, action: any) => {
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
          activities: newActivities.reduce(rankReducer, {}),
        }
      };
    case ARCHIVED_ACTIVITY:
      return {
        ...state,
        activity: {
          ...state.activity,
          activities: objectToArray(state.activity.activities)
            .filter(activity => activity.id !== action.payload.id)
            .reduce(rankReducer, {})
        }
      };
    case RESTORED_ACTIVITY:
      return {
        ...state,
        activity: {
          ...state.activity,
          archivedActivities: objectToArray(state.activity.archivedActivities)
            .filter(activity => activity.id !== action.payload.id)
            .reduce(rankReducer, {})
        }
      };
    case FOUND_ACTIVITIES:
      const activeActivities = action.payload
          .filter((tactActivity: TacticalActivity) => !tactActivity.hidden);
      const archivedActivities = action.payload
          .filter((tactActivity: TacticalActivity) => tactActivity.hidden);
      const rememberedActivities = activeActivities.reduce(rankReducer, {});
      return {
        ...state,
        activity: {
          ...state.activity,
          activities: rememberedActivities,
          archivedActivities: archivedActivities.reduce(dictionaryReducer, {}),
        },
      };
    case REPLACE_ACTIVITIES:
      return {
        ...state,
        activity: {
          ...state.activity,
          activities: action.payload
            .filter((tactActivity: TacticalActivity) => !tactActivity.hidden)
            .reduce(rankReducer, {}),
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
                // @ts-ignore
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
