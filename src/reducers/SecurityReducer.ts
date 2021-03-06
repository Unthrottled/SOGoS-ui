import {
  EXPIRED_SESSION,
  FAILED_TO_RECEIVE_READ_TOKEN,
  INITIALIZED_SECURITY,
  LOGGED_OFF,
  LOGGED_ON,
  RECEIVED_READ_TOKEN,
  RECEIVED_TOKENS, REQUESTED_LOGON,
} from '../events/SecurityEvents';
import {readTokenReceptionReducer, tokenReceptionReducer} from './security/TokenReducer';
import {RECEIVED_USER, UPDATED_SHARED_DASHBOARD} from '../events/UserEvents';
import {TokenInformation} from '../types/SecurityTypes';
import {TIME_IS_WACK} from '../events/ApplicationLifecycleEvents';
import omit from 'lodash/omit';

export enum SharedStatus {
  UNKNOWN, NOT_SHARED, SHARED
}

export type SecurityState = {
  isLoggedIn: boolean;
  accessToken: string;
  accessTokenInformation: TokenInformation;
  refreshToken: string;
  refreshTokenInformation: TokenInformation;
  idToken?: string;
  realAccessToken: string;
  verificationKey: string;
  isExpired: boolean;
  isInitialized: boolean;
  isOutOfSync: boolean;
  readOnly: boolean;
  readToken: string;
  hasShared: SharedStatus;
  shareCode?: string;
  identityProvider?: string;
  readTokenInformation: TokenInformation;
};

const defaultTokenInfo = {
  issuedAt: 0,
  expiresAt: 69,
  expiresHuman: '69',
};
export const INITIAL_SECURITY_STATE: SecurityState = {
  refreshTokenInformation: defaultTokenInfo,
  accessToken: '',
  accessTokenInformation: defaultTokenInfo,
  idToken: '',
  refreshToken: '',
  verificationKey: '',
  isLoggedIn: false,
  realAccessToken: '',
  isExpired: false,
  isInitialized: false,
  isOutOfSync: false,
  readToken: '',
  readOnly: false,
  hasShared: SharedStatus.UNKNOWN,
  readTokenInformation: defaultTokenInfo,
};

const securityReducer = (state = INITIAL_SECURITY_STATE, action: any) => {
  switch (action.type) {
    case LOGGED_ON:
      return {
        ...state,
        isLoggedIn: true,
      };
    case LOGGED_OFF:
      return {
        ...INITIAL_SECURITY_STATE,
        identityProvider: state.identityProvider
      };
    case FAILED_TO_RECEIVE_READ_TOKEN:
      return {
        ...omit(state, ['readToken']),
        hasShared: SharedStatus.NOT_SHARED
      }
    case REQUESTED_LOGON: {
      return {
        ...state,
        identityProvider: action.payload,
      }
    }
    case EXPIRED_SESSION:
      delete state.refreshToken;
      delete state.refreshTokenInformation;
      return {
        ...state,
        isExpired: true,
      };
    case INITIALIZED_SECURITY:
      return {
        ...state,
        isExpired: false,
        isInitialized: true,
      };
    case TIME_IS_WACK:
      return {
        ...state,
        isOutOfSync: true,
      };
    case UPDATED_SHARED_DASHBOARD:
      return {
        ...state,
        hasShared: action.payload ? SharedStatus.SHARED : SharedStatus.NOT_SHARED
      }
    case RECEIVED_READ_TOKEN:
      return readTokenReceptionReducer(state, action.payload);
    case RECEIVED_TOKENS:
      return tokenReceptionReducer(state, action.payload);
    case RECEIVED_USER:
      return {
        ...state,
        ...action.payload.security,
        hasShared: action.payload.security ?
          action.payload.security.hasShared ? SharedStatus.SHARED :
            SharedStatus.NOT_SHARED : SharedStatus.UNKNOWN,
      };
    default:
      return state;
  }
};

export default securityReducer;
