import type {Objective} from "../reducers/StrategyReducer";

export const VIEWED_OBJECTIVES: 'VIEWED_OBJECTIVES' = 'VIEWED_OBJECTIVES';
export const CREATED_OBJECTIVE: 'CREATED_OBJECTIVE' = 'CREATED_OBJECTIVE';
export const SYNCED_OBJECTIVE: 'SYNCED_OBJECTIVE' = 'SYNCED_OBJECTIVE';

export const createViewedObjectivesEvent = () => ({
  type: VIEWED_OBJECTIVES,
});

export const createSyncedObjectiveEvent = (objective: Objective) => ({
  type: SYNCED_OBJECTIVE,
  payload: objective,
});

export const createCreatedObjectiveEvent = (objective: Objective) => ({
  type: CREATED_OBJECTIVE,
  payload: objective,
});
