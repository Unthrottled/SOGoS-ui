import axios from "axios";
import {TokenResponse} from "@openid/appauth";

export const LOGGED_ON: 'LOGGED_ON' = 'LOGGED_ON';
export const LOGGED_OFF: 'LOGGED_OFF' = 'LOGGED_OFF';
export const FAILED_LOGGING_OFF: 'FAILED_LOGGING_OFF' = 'FAILED_LOGGING_OFF';
export const FAILED_LOGGING_ON: 'FAILED_LOGGING_ON' = 'FAILED_LOGGING_ON';
export const REQUESTED_LOGOFF: 'REQUESTED_LOGOFF' = 'REQUESTED_LOGOFF';
export const REQUESTED_LOGON: 'REQUESTED_LOGON' = 'REQUESTED_LOGON';
export const RECEIVED_TOKENS: 'RECEIVED_TOKENS' = 'RECEIVED_TOKENS';

export const requestLogoff = () => ({
  type: REQUESTED_LOGOFF,
});

export const requestLogon = () => ({
  type: REQUESTED_LOGON,
});

export const createFailureToLogOffAction = (error) => ({
  type: FAILED_LOGGING_OFF,
  payload: error
});

export const createTokenReceptionEvent = (tokenResponse: TokenResponse) => ({
  type: RECEIVED_TOKENS,
  payload: tokenResponse
});

export const createLoggedOffAction = () => ({
  type: LOGGED_OFF,
});

export const createFailureToLogOnAction = (error) => ({
  type: FAILED_LOGGING_ON,
  payload: error
});

export const createLoggedOnAction = () => ({
  type: LOGGED_ON,
});

const logoutUser = () => dispetch => {
  dispetch(requestLogoff()); // todo: clean all the states an that stuff
  return axios.post('./logout')
    .then(()=> dispetch(createLoggedOffAction()))
    .catch(error => dispetch(createFailureToLogOffAction(error)));
};

const loginUser = () => dispetch => {
  dispetch(requestLogon());
};


export const logout = () => dispetch => dispetch(logoutUser());

export const login = () => dispetch => dispetch(loginUser());
