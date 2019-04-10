import {combineReducers} from "redux";

const LOGIN: 'LOGIN' = 'LOGIN';
const LOGOFF: 'LOGOFF' = 'LOGOFF';

const security = (state = {}, action) => {
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
