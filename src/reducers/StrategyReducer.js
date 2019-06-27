import {Action} from "redux";
import {CACHED_OBJECTIVE, CREATED_OBJECTIVE, SYNCED_OBJECTIVES} from "../events/StrategyEvents";

export type KeyResult = {
  id: string,
  objectiveId: string,
}

export type Objective = {
  id: string,
  keyResult: KeyResult[],
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
  objectives: [],
  keyResults: [],
  cache: {},
};


const StrategyReducer = (state: StrategyState = INITIAL_USER_STATE, action: Action) => {
  switch (action.type) {
    case CREATED_OBJECTIVE:
      return {
        ...state,
        objectives: [
          ...state.objectives,
          action.payload
        ],
        keyResults: [
          ...state.keyResults,
          action.payload.keyResults,
        ]
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
