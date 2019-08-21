import {Action} from "redux";

export type TacticalState = {

}

const INITIAL_TACTICAL_STATE: TacticalState = {

};

const TacticalReducer = (state: TacticalState = INITIAL_TACTICAL_STATE, action: Action) => {
  switch (action.type) {
    default:
      return state
  }
};

export default TacticalReducer;
