import {Action} from "redux";
import {
  CACHED_OBJECTIVE,
  CREATED_OBJECTIVE,
  DELETED_OBJECTIVE,
  FOUND_OBJECTIVES,
  SYNCED_OBJECTIVES,
  UPDATED_OBJECTIVE
} from "../events/StrategyEvents";
import {objectToArray} from "../miscellanous/Tools";
import type {KeyResult, Objective} from "../types/StrategyModels";

export type StrategyState = {
  objectives: Objective[],
  keyResults: KeyResult[],
  cache: any,
}

const INITIAL_USER_STATE: StrategyState = {
  objectives: {},
  keyResults: {},
  cache: {},
};


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

const StrategyReducer = (state: StrategyState = INITIAL_USER_STATE, action: Action) => {
  switch (action.type) {
    case CREATED_OBJECTIVE:
    case UPDATED_OBJECTIVE:
      const newObjective = [action.payload];
      const keyResult = action.payload.keyResults;
      return updateStateWithObjectives(newObjective, keyResult, state);
    case DELETED_OBJECTIVE:
      const {payload: deletedObjective} = action;
      const newObjectives = objectToArray(state.objectives).filter(suspiciousObjective =>
        suspiciousObjective.id !== deletedObjective.id);
      const newKeyResults = objectToArray(state.keyResults).filter(keyResult =>
        deletedObjective.keyResults
          .filter(keyResultToRemove =>
            keyResultToRemove.id === keyResult.id));
      return {
        ...state,
        objectives: newObjectives.reduce(dictionaryReducer, {}),
        keyResults: newKeyResults.reduce(dictionaryReducer, {}),
      };
    case FOUND_OBJECTIVES:
      const rememberedObjectives = action.payload.reduce(dictionaryReducer, {});
      const rememberedKeyResults = action.payload.flatMap(foundObjective => foundObjective.keyResults).reduce(dictionaryReducer, {});
      return {
        ...state,
        objectives: rememberedObjectives,
        keyResults: rememberedKeyResults,
      };
    case CACHED_OBJECTIVE: {
      const {userGUID, objective} = action.payload;
      if (state.cache[userGUID]) {
        state.cache[userGUID].push(objective)
      } else {
        state.cache[userGUID] = [objective]
      }
      return state;
    }
    case SYNCED_OBJECTIVES: {
      state.cache[action.payload] = [];
      return state;
    }
    default:
      return state
  }
};

export default StrategyReducer;
