import axios from "axios";

export const LOGIN: 'LOGIN' = 'LOGIN';
export const LOGGED_OFF: 'LOGGED_OFF' = 'LOGGED_OFF';
export const FAILED_LOGGING_OFF: 'FAILED_LOGGING_OFF' = 'FAILED_LOGGING_OFF';
export const REQUESTED_USER: 'REQUESTED_USER' = 'REQUESTED_USER';
export const REQUESTED_LOGOFF: 'REQUESTED_LOGOFF' = 'REQUESTED_LOGOFF';
export const FAILED_REQUESTED_USER: 'FAILED_REQUESTED_USER' = 'FAILED_REQUESTED_USER';
export const RECEIVED_USER: 'RECEIVED_USER' = 'RECEIVED_USER';

export const requestUser = () => ({
  type: REQUESTED_USER,
});

export const requestLogoff = () => ({
  type: REQUESTED_LOGOFF,
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

const fetchUser = () => dispetch => {
  dispetch(requestUser());
  return axios.get('./api/user')
    .then(response => response.data)
    .then(user => dispetch(receivedUser(user)))
    .catch(error => dispetch(failedToGetUser(error)))

};

const logoutUser = () => dispetch => {
  dispetch(requestLogoff());
  return axios.post('./logout')
    .then(()=> dispetch(createLoggedOffAction()))
    .catch(error => dispetch(createFailureToLogOffAction(error)));
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
