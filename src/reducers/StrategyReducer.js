import {Action} from "redux";

export type Objective = {
  id: string,
}

export type KeyResult = {
  id: string,
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
    default:
      return state
  }
};

export default StrategyReducer;
