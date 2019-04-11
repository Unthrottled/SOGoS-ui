import {combineReducers} from "redux";
import {LOGGED_ON, LOGGED_OFF, RECEIVED_USER} from "../actions";
import type {User} from "../actions";

const INITIAL_SECURITY_STATE = {
  isLoggedIn: true, // the backend does all of the security, less having to worry about tokens and shit like that
};

export type UserState = {
  information: User
}

const INITIAL_USER_STATE : UserState = {
  information: {
    firstName: 'Smitty',
    lastName: 'Werbenjagermangensen',
    email: '',
    fullName: 'Smitty Werbenjagermangensen'
  }
};

const security = (state = INITIAL_SECURITY_STATE, action) => {
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

const user = (state = INITIAL_USER_STATE, action) => {
  switch (action.type) {
    case RECEIVED_USER :
      return {
        ...state,
        information: {
          ...state.information,
          ...action.payload
        }
      };
    case LOGGED_OFF: {
      return INITIAL_USER_STATE
    }
    default:
      return state
  }
};

const rootReducer = combineReducers({
  security,
  user
});

export default rootReducer;
