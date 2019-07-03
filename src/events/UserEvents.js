import type {User} from "../types/UserModels";

export const FAILED_REQUESTED_USER: 'FAILED_REQUESTED_USER' = 'FAILED_REQUESTED_USER';
export const RECEIVED_USER: 'RECEIVED_USER' = 'RECEIVED_USER';

export const createReceivedUserEvent = (user: User) => ({
  type: RECEIVED_USER,
  payload: user
});

export const createFailedToGetUserEvent = (error) => ({
  type: FAILED_REQUESTED_USER,
  payload: error
});
