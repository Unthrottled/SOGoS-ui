import axios from "axios";

export const LOGGED_ON: 'LOGGED_ON' = 'LOGGED_ON';
export const LOGGED_OFF: 'LOGGED_OFF' = 'LOGGED_OFF';
export const FAILED_LOGGING_OFF: 'FAILED_LOGGING_OFF' = 'FAILED_LOGGING_OFF';
export const FAILED_LOGGING_ON: 'FAILED_LOGGING_ON' = 'FAILED_LOGGING_ON';
export const REQUESTED_USER: 'REQUESTED_USER' = 'REQUESTED_USER';
export const REQUESTED_LOGOFF: 'REQUESTED_LOGOFF' = 'REQUESTED_LOGOFF';
export const REQUESTED_LOGON: 'REQUESTED_LOGON' = 'REQUESTED_LOGON';
export const FAILED_REQUESTED_USER: 'FAILED_REQUESTED_USER' = 'FAILED_REQUESTED_USER';
export const RECEIVED_USER: 'RECEIVED_USER' = 'RECEIVED_USER';

export const requestUser = () => ({
  type: REQUESTED_USER,
});

export const requestLogoff = () => ({
  type: REQUESTED_LOGOFF,
});

export const requestLogon = () => ({
  type: REQUESTED_LOGON,
});

export type User = {
  fullName: string,
  userName: string,
  firstName: string,
  lastName: string,
  email: string,
}

export const receivedUser = (user: User) => ({
  type: RECEIVED_USER,
  payload: user
});

export const failedToGetUser = (error) => ({
  type: FAILED_REQUESTED_USER,
  payload: error
});

export const createFailureToLogOffAction = (error) => ({
  type: FAILED_LOGGING_OFF,
  payload: error
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

const fetchUser = () => dispetch => {
  dispetch(requestUser());
  return axios.get('./api/user')
    .then(response => response.data)
    .then(user => dispetch(receivedUser(user)))
    .catch(error => dispetch(failedToGetUser(error)))

};

const logoutUser = () => dispetch => {
  dispetch(requestLogoff()); // todo: clean all the states an that stuff
  return axios.post('./logout')
    .then(()=> dispetch(createLoggedOffAction()))
    .catch(error => dispetch(createFailureToLogOffAction(error)));
};

const loginUser = () => dispetch => {
  dispetch(requestLogon());
  window.location.reload();// hax: The backend will send a redirect which will send you to the authorization server.
};

const shouldFindWaldo = (state) => {
  return !state.user.information.email; // todo: maybe have a function that gets stuff out of the state
};

export const wheresWaldo = () => (dispetch, getState) =>{
  if(shouldFindWaldo(getState())){
    return dispetch(fetchUser())
  }
};

export const logout = () => dispetch => dispetch(logoutUser());

export const login = () => dispetch => dispetch(loginUser());
