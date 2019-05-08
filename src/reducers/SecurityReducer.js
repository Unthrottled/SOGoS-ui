import {LOGGED_OFF, LOGGED_ON, RECEIVED_TOKENS} from "../events/SecurityEvents";
import {tokenReceptionReducer} from "./security/TokenReducers";

export type TokenInformation = {
  expiresAt: number, //epoch second
  issuedAt: number, //epoch second
}

export type SecurityState = {
  isLoggedIn: boolean,
  accessToken: string,
  accessTokenInformation: TokenInformation,
  refreshToken: string,
  refreshTokenInformation: TokenInformation,
  idToken: string
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
    case RECEIVED_TOKENS:
      return tokenReceptionReducer(state, action.payload);
    default:
      return state
  }
};

export default securityReducer;
