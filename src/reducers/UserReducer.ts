import {CHECKED_CACHES, RECEIVED_PARTIAL_USER, RECEIVED_USER, RECEIVED_USER_PROFILE} from '../events/UserEvents';
import {LOGGED_OFF} from '../events/SecurityEvents';
import {User, UserOnBoarding} from '../types/UserTypes';
import {ACKNOWLEDGED_TACMOD, THANKED_FOR_TACMOD, USER_WELCOMED} from '../events/ActivityEvents';

export type UserMiscellaneous = {
  hasItemsCached: boolean;
  onboarding: UserOnBoarding;
};

export type UserState = {
  information: User;
  miscellaneous: UserMiscellaneous;
};
export const INITIAL_USER_STATE: UserState = {
  information: {
    firstName: '',
    lastName: '',
    email: '',
    fullName: '',
    guid: '',
    userName: '',
  },
  miscellaneous: {
    hasItemsCached: false,
    onboarding: {},
  },
};

const userReducer = (state: UserState = INITIAL_USER_STATE, action: any) => {
  switch (action.type) {
    case ACKNOWLEDGED_TACMOD:
      return {
        ...state,
        miscellaneous: {
          ...state.miscellaneous,
          onboarding: {
            ...state.miscellaneous.onboarding,
            TacModNotified: true,
          },
        },
      };
    case USER_WELCOMED:
      return {
        ...state,
        miscellaneous: {
          ...state.miscellaneous,
          onboarding: {
            ...state.miscellaneous.onboarding,
            welcomed: true,
          },
        },
      };
    case THANKED_FOR_TACMOD:
      return {
        ...state,
        miscellaneous: {
          ...state.miscellaneous,
          onboarding: {
            ...state.miscellaneous.onboarding,
            TacModThanked: true,
          },
        },
      };
    case RECEIVED_USER_PROFILE:
      return {
        ...state,
        information: {
          ...state.information,
          ...action.payload,
        }
      }
    case RECEIVED_PARTIAL_USER:
      return {
        ...state,
        information: {
          ...state.information,
          guid: action.payload,
        }
      }
    case RECEIVED_USER:
      return {
        ...state,
        information: {
          ...state.information,
          ...action.payload.information,
        },
        miscellaneous: {
          ...state.miscellaneous,
          onboarding: action.payload.misc.onboarding || {},
        },
      };
    case LOGGED_OFF: {
      return INITIAL_USER_STATE;
    }
    case CHECKED_CACHES: {
      return {
        ...state,
        miscellaneous: {
          ...state.miscellaneous,
          hasItemsCached: action.payload,
        },
      };
    }

    default:
      return state;
  }
};

export default userReducer;
