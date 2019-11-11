import type {Objective, ObjectiveCacheEvent} from "../types/StrategyModels";

export const VIEWED_OBJECTIVES: 'VIEWED_OBJECTIVES' = 'VIEWED_OBJECTIVES';
export const CREATED_OBJECTIVE: 'CREATED_OBJECTIVE' = 'CREATED_OBJECTIVE';
export const UPDATED_OBJECTIVE: 'UPDATED_OBJECTIVE' = 'UPDATED_OBJECTIVE';
export const DELETED_OBJECTIVE: 'DELETED_OBJECTIVE' = 'DELETED_OBJECTIVE';
export const COMPLETED_OBJECTIVE: 'COMPLETED_OBJECTIVE' = 'COMPLETED_OBJECTIVE';
export const SYNCED_OBJECTIVE: 'SYNCED_OBJECTIVE' = 'SYNCED_OBJECTIVE';
export const SYNCED_OBJECTIVES: 'SYNCED_OBJECTIVES' = 'SYNCED_OBJECTIVES';
export const CACHED_OBJECTIVE: 'CACHED_OBJECTIVE' = 'CACHED_OBJECTIVE';
export const FOUND_OBJECTIVES: 'FOUND_OBJECTIVES' = 'FOUND_OBJECTIVES';

export const createViewedObjectivesEvent = () => ({
  type: VIEWED_OBJECTIVES,
});

export const createCachedObjectiveEvent = (objectiveCacheEvent: ObjectiveCacheEvent) => ({
  type: CACHED_OBJECTIVE,
  payload: objectiveCacheEvent
});

export const createFetchedObjectivesEvent = (objectiveHistory: Objective[]) => ({
  type: FOUND_OBJECTIVES,
  payload: objectiveHistory
});

export const createSyncedObjectiveEvent = (objective: Objective) => ({
  type: SYNCED_OBJECTIVE,
  payload: objective,
});

export const createSyncedObjectivesEvent = (userGUID: string) => ({
  type: SYNCED_OBJECTIVES,
  payload: userGUID,
});

export const createCreatedObjectiveEvent = (objective: Objective) => ({
  type: CREATED_OBJECTIVE,
  payload: objective,
});

export const createUpdatedObjectiveEvent = (objective: Objective) => ({
  type: UPDATED_OBJECTIVE,
  payload: objective,
});


export const createDeletedObjectiveEvent = (objective: Objective) => ({
  type: DELETED_OBJECTIVE,
  payload: objective,
});

export const createCompletedObjectiveEvent = (objective: Objective) => ({
  type: COMPLETED_OBJECTIVE,
  payload: objective,
});