import type {Objective, ObjectiveCacheEvent} from "../reducers/StrategyReducer";

export const VIEWED_OBJECTIVES: 'VIEWED_OBJECTIVES' = 'VIEWED_OBJECTIVES';
export const CREATED_OBJECTIVE: 'CREATED_OBJECTIVE' = 'CREATED_OBJECTIVE';
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

export const createCreatedObjectiveEvent = (objective: Objective) => ({
  type: CREATED_OBJECTIVE,
  payload: objective,
});
