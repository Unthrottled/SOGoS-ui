import {LOGGED_ON, LOGGED_OFF} from "../actions/SecurityActions";

export type SecurityState = {
  isLoggedIn: boolean,
};

const INITIAL_SECURITY_STATE: SecurityState = {
  isLoggedIn: false,
};

const securityReducer = (state = INITIAL_SECURITY_STATE, action) => {
  switch (action.type) {
    case LOGGED_ON :
      return {
        ...state,
        isLoggedIn: true
      };
    case LOGGED_OFF :
      return {
        ...INITIAL_SECURITY_STATE,
        isLoggedIn: false
      };
    default:
      return state
  }
};

export default securityReducer;
