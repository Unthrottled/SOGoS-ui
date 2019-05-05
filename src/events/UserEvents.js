
export const FAILED_REQUESTED_USER: 'FAILED_REQUESTED_USER' = 'FAILED_REQUESTED_USER';
export const RECEIVED_USER: 'RECEIVED_USER' = 'RECEIVED_USER';

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