import {RECEIVED_USER, User} from "../events/UserActions";
import {LOGGED_OFF} from "../events/SecurityActions";

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


const userReducer = (state = INITIAL_USER_STATE, action) => {
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
