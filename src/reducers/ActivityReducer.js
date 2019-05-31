import {Action} from "redux";
import {STARTED_TIMED_ACTIVITY} from "../events/ActivityEvents";

export type ActivityState = {
  shouldTime: boolean,
}

const INITIAL_ACTIVITY_STATE: ActivityState = {
  shouldTime: false,
};


const userReducer = (state: ActivityState = INITIAL_ACTIVITY_STATE, action: Action) => {
  switch (action.type) {
    case STARTED_TIMED_ACTIVITY :
      return {
        ...state,
        shouldTime: true,
      };
    default:
      return state
  }
};

export default userReducer;
