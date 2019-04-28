import axios from "axios";
import { AuthorizationServiceConfiguration } from "@openid/appauth";


export const FAILED_REQUESTED_USER: 'FAILED_REQUESTED_USER' = 'FAILED_REQUESTED_USER';
export const RECEIVED_USER: 'RECEIVED_USER' = 'RECEIVED_USER';
export const REQUESTED_USER: 'REQUESTED_USER' = 'REQUESTED_USER';

export type User = {
  fullName: string,
  userName: string,
  firstName: string,
  lastName: string,
  email: string,
}


export const requestUser = () => ({
  type: REQUESTED_USER,
});

export const receivedUser = (user: User) => ({
  type: RECEIVED_USER,
  payload: user
});

export const failedToGetUser = (error) => ({
  type: FAILED_REQUESTED_USER,
  payload: error
});

const fetchUser = () => dispetch => {
  dispetch(requestUser());
  return AuthorizationServiceConfiguration.fetchFromIssuer("http://localhost:8080/auth/realms/master")
    .then(response => {
      console.log(response)
       return axios.get('./api/user');
    })
    .then(response => response.data)
    .then(user => dispetch(receivedUser(user)))
    .catch(error => dispetch(failedToGetUser(error)))

};

const shouldFindWaldo = (state) => {
  return !state.user.information.email; // todo: maybe have a function that gets stuff out of the state
};

export const wheresWaldo = () => (dispetch, getState) =>{
  if(shouldFindWaldo(getState())){
    return dispetch(fetchUser())
  }
};

