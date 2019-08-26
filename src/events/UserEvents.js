import type {User} from "../types/UserModels";

export const FAILED_REQUESTED_USER: 'FAILED_REQUESTED_USER' = 'FAILED_REQUESTED_USER';
export const RECEIVED_USER: 'RECEIVED_USER' = 'RECEIVED_USER';
export const CHECKED_CACHES: 'CHECKED_CACHES' = 'CHECKED_CACHES';
export const CACHED_DATA: 'CACHED_DATA' = 'CACHED_DATA';
export const SYNCED_DATA: 'SYNCED_DATA' = 'SYNCED_DATA';
export const REQUESTED_SYNC: 'REQUESTED_SYNC' = 'REQUESTED_SYNC';

export const createReceivedUserEvent = (user: User) => ({
  type: RECEIVED_USER,
  payload: user
});

export const createRequestedSyncEvent = () => ({
  type: REQUESTED_SYNC,
});

export const createCheckedCachesEvent = (hasItemsToCache) => ({
  type: CHECKED_CACHES,
  payload: hasItemsToCache,
});

export const createCachedDataEvent = () => ({
  type: CACHED_DATA,
});

export const createSyncedDataEvent = () => ({
  type: SYNCED_DATA,
});

export const createFailedToGetUserEvent = (error) => ({
  type: FAILED_REQUESTED_USER,
  payload: error
});
