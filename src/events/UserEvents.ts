import {UserResponse} from '../types/UserTypes';
import {BaseEvent, PayloadEvent} from './Event';

export const FAILED_REQUESTED_USER: 'FAILED_REQUESTED_USER' =
  'FAILED_REQUESTED_USER';
export const RECEIVED_USER: 'RECEIVED_USER' = 'RECEIVED_USER';
export const UPDATED_SHARED_DASHBOARD: 'UPDATED_SHARED_DASHBOARD' = 'UPDATED_SHARED_DASHBOARD';
export const SYNCED_SHARED_DASHBOARD: 'SYNCED_SHARED_DASHBOARD' = 'SYNCED_SHARED_DASHBOARD';
export const CHECKED_CACHES: 'CHECKED_CACHES' = 'CHECKED_CACHES';
export const CACHED_DATA: 'CACHED_DATA' = 'CACHED_DATA';
export const SYNCED_DATA: 'SYNCED_DATA' = 'SYNCED_DATA';
export const REQUESTED_SYNC: 'REQUESTED_SYNC' = 'REQUESTED_SYNC';

export const createReceivedUserEvent = (
  user: UserResponse,
): PayloadEvent<UserResponse> => ({
  type: RECEIVED_USER,
  payload: user,
});

export const createUserUpdatedSharedDashboardEvent = (
  hasShared: boolean,
): PayloadEvent<boolean> => ({
  type: UPDATED_SHARED_DASHBOARD,
  payload: hasShared,
});
export const createSyncedSharedDashboardUpdateEvent = (
  hasShared: boolean,
): PayloadEvent<boolean> => ({
  type: SYNCED_SHARED_DASHBOARD,
  payload: hasShared,
});

export const createRequestedSyncEvent = (): BaseEvent => ({
  type: REQUESTED_SYNC,
});

export const createCheckedCachesEvent = (
  hasItemsToCache: boolean,
): PayloadEvent<boolean> => ({
  type: CHECKED_CACHES,
  payload: hasItemsToCache,
});

export const createCachedDataEvent = (): BaseEvent => ({
  type: CACHED_DATA,
});

export const createSyncedDataEvent = (): BaseEvent => ({
  type: SYNCED_DATA,
});

export const createFailedToGetUserEvent = (
  error: Error,
): PayloadEvent<Error> => ({
  type: FAILED_REQUESTED_USER,
  payload: error,
});
