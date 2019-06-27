import {Action} from "redux";
import {CREATED_OBJECTIVE} from "../events/StrategyEvents";

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
}

const INITIAL_USER_STATE: StrategyState = {
  objectives: [],
  keyResults: [],
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
      }
    default:
      return state
  }
};

export default StrategyReducer;
