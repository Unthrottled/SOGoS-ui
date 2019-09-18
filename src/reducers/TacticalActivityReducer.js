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

const dictionaryReducer = (accum, toIndex) => {
  accum[toIndex.id] = toIndex;
  return accum;
};

function updateStateWithObjectives(newObjectives, newKeyResults, state) {
  const objectives = [
    ...objectToArray(state.objectives),
    ...newObjectives
  ].reduce(dictionaryReducer, {});
  const keyResults = [
    ...objectToArray(state.keyResults),
    ...newKeyResults,
  ].reduce(dictionaryReducer, {});
  return {
    ...state,
    objectives,
    keyResults
  };
}

const TacticalActivityReducer = (state: TacticalState = INITIAL_TACTICAL_STATE, action: Action) => {
  switch (action.type) {
    case CREATED_ACTIVITY:
    case UPDATED_ACTIVITY:
      const newObjective = [action.payload];
      const keyResult = action.payload.keyResults;
      return updateStateWithObjectives(newObjective, keyResult, state);
    case DELETED_ACTIVITY:
      const {payload: deletedObjective} = action;
      const newObjectives = objectToArray(state.objectives).filter(suspiciousObjective =>
        suspiciousObjective.id !== deletedObjective.id);
      const newKeyResults = objectToArray(state.keyResults).filter(keyResult =>
        deletedObjective.keyResults
          .filter(keyResultToRemove =>
            keyResultToRemove.id === keyResult.id).length === 0);
      return {
        ...state,
        objectives: newObjectives.reduce(dictionaryReducer, {}),
        keyResults: newKeyResults.reduce(dictionaryReducer, {}),
      };
    case FOUND_ACTIVITIES:
      const rememberedObjectives = action.payload.reduce(dictionaryReducer, {});
      const rememberedKeyResults = action.payload.flatMap(foundObjective => foundObjective.keyResults).reduce(dictionaryReducer, {});
      return {
        ...state,
        objectives: rememberedObjectives,
        keyResults: rememberedKeyResults,
      };
    case CACHED_TACTICAL_ACTIVITY: {
      const {userGUID, objective} = action.payload;
      if (state.cache[userGUID]) {
        state.cache[userGUID].push(objective)
      } else {
        state.cache[userGUID] = [objective]
      }
      return state;
    }
    case SYNCED_TACTICAL_ACTIVITIES: {
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

export default TacticalActivityReducer;
