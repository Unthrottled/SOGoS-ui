import {combineReducers} from "redux";
import {LOGIN, LOGOFF} from "../actions";

const INITIAL_SECURITY_STATE = {
  isLoggedIn: true, // the backend does all of the security, less having to worry about tokens and shit like that
};

const security = (state = INITIAL_SECURITY_STATE, action) => {
  switch (action.type) {
    case LOGIN :
      return {
        ...state,
        isLoggedIn: true
      };
    case LOGOFF :
      return {
        ...state,
        isLoggedIn: false
      };
    default:
      return state
  }
};

const rootReducer = combineReducers({
  security
});

export default rootReducer;
