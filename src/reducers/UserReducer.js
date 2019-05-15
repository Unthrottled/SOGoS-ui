import {RECEIVED_USER, User} from "../events/UserEvents";
import {LOGGED_OFF} from "../events/SecurityEvents";
import {Action} from "redux";

export type UserState = {
  information: User
}

const INITIAL_USER_STATE : UserState = {
  information: {
    firstName: 'Smitty',
    lastName: 'Werbenjagermangensen',
    email: '',
    fullName: 'Smitty Werbenjagermangensen',
    guid: '',
  }
};


const userReducer = (state: UserState = INITIAL_USER_STATE, action: Action) => {
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

export default userReducer;
