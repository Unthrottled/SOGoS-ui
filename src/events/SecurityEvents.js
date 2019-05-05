import {TokenResponse} from "@openid/appauth";

export const LOGGED_ON: 'LOGGED_ON' = 'LOGGED_ON';
export const LOGGED_OFF: 'LOGGED_OFF' = 'LOGGED_OFF';
export const FAILED_LOGGING_OFF: 'FAILED_LOGGING_OFF' = 'FAILED_LOGGING_OFF';
export const FAILED_LOGGING_ON: 'FAILED_LOGGING_ON' = 'FAILED_LOGGING_ON';
export const REQUESTED_LOGOFF: 'REQUESTED_LOGOFF' = 'REQUESTED_LOGOFF';
export const REQUESTED_LOGON: 'REQUESTED_LOGON' = 'REQUESTED_LOGON';
export const REQUESTED_AUTH_CHECK: 'REQUESTED_AUTH_CHECK' = 'REQUESTED_AUTH_CHECK';
export const CHECKED_AUTH: 'CHECKED_AUTH' = 'CHECKED_AUTH';
export const REQUESTED_ACCESS_TOKEN: 'REQUESTED_ACCESS_TOKEN' = 'REQUESTED_ACCESS_TOKEN';
export const FOUND_ACCESS_TOKEN: 'FOUND_ACCESS_TOKEN' = 'FOUND_ACCESS_TOKEN';
export const RECEIVED_TOKENS: 'RECEIVED_TOKENS' = 'RECEIVED_TOKENS';
export const INITIALIZED_SECURITY: 'INITIALIZED_SECURITY' = 'INITIALIZED_SECURITY';

export const requestLogoff = () => ({
  type: REQUESTED_LOGOFF,
});

export const requestAccessToken = () => ({
  type: REQUESTED_ACCESS_TOKEN,
});

export const foundAccessToken = accessToken => ({
  type: FOUND_ACCESS_TOKEN,
  payload: accessToken,
});

export const requestLogon = (oauthConfig) => ({
  type: REQUESTED_LOGON,
  payload: oauthConfig
});

export const requestAuthorizationGrantCheck = (oauthConfig) => ({
  type: REQUESTED_AUTH_CHECK,
  payload: oauthConfig
});

export const createFailureToLogOffAction = (error) => ({
  type: FAILED_LOGGING_OFF,
  payload: error
});

export const createTokenReceptionEvent = (tokenResponse: TokenResponse) => ({
  type: RECEIVED_TOKENS,
  payload: tokenResponse
});

export const createSecurityInitalizedEvent = () => ({
  type: INITIALIZED_SECURITY,
});

export const createCheckedAuthorizationEvent = () => ({
  type: CHECKED_AUTH,
});

export const createLoggedOffEvent = () => ({
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
  // return axios.post('./logout')
  //   .then(()=> dispetch(createLoggedOffEvent()))
  //   .catch(error => dispetch(createFailureToLogOffAction(error)));
};

const loginUser = () => dispetch => {
  dispetch(requestLogon());
};


export const logout = () => dispetch => dispetch(logoutUser());

export const login = () => dispetch => dispetch(loginUser());
