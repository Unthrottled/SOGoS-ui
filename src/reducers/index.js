import {combineReducers} from "redux";

const LOGIN: 'LOGIN' = 'LOGIN';
const LOGOFF: 'LOGOFF' = 'LOGOFF';

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
