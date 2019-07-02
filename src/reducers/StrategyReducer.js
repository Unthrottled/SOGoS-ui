import {Action} from "redux";
import {CACHED_OBJECTIVE, CREATED_OBJECTIVE, FOUND_OBJECTIVES, SYNCED_OBJECTIVES} from "../events/StrategyEvents";
import {objectToArray} from "../miscellanous/Tools";

export type KeyResult = {
  id: string,
  objectiveId: string,
  valueStatement: string,
}

export type Objective = {
  id: string,
  valueStatement: string,
  keyResults: KeyResult[],
}

export type StrategyState = {
  objectives: Objective[],
  keyResults: KeyResult[],
  cache: any,
}

export type ObjectiveCacheEvent = {
  objective: Objective,
  userGUID: string,
};

const INITIAL_USER_STATE: StrategyState = {
  objectives: {},
  keyResults: {},
  cache: {},
};


function updateStateWithObjectives(newObjectives, newKeyResults, state) {
  const objectives = [
    ...objectToArray(state.objectives),
    ...newObjectives
  ].reduce((accum, toIndex) => {
    accum[toIndex.id] = toIndex;
    return accum;
  }, {});
  const keyResults = [
    ...objectToArray(state.keyResults),
    ...newKeyResults,
  ].reduce((accum, toIndex) => {
    accum[toIndex.id] = toIndex;
    return accum;
  }, {});
  return {
    ...state,
    objectives,
    keyResults
  };
}

const StrategyReducer = (state: StrategyState = INITIAL_USER_STATE, action: Action) => {
  switch (action.type) {
    case CREATED_OBJECTIVE:
      const newObjective = [action.payload];
      const keyResult = action.payload.keyResults;
      return updateStateWithObjectives(newObjective, keyResult, state);
    case FOUND_OBJECTIVES:
      const rememberedObjectives = action.payload;
      const rememberedKeyResults = action.payload.flatMap(foundObjective => foundObjective.keyResults);
      return updateStateWithObjectives(rememberedObjectives, rememberedKeyResults, state);
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
