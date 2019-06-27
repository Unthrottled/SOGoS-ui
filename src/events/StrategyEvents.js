import type {Objective} from "../reducers/StrategyReducer";

export const VIEWED_OBJECTIVES: 'VIEWED_OBJECTIVES' = 'VIEWED_OBJECTIVES';
export const CREATED_OBJECTIVE: 'CREATED_OBJECTIVE' = 'CREATED_OBJECTIVE';

export const createViewedObjectivesEvent = () => ({
  type: VIEWED_OBJECTIVES,
});

export const createCreatedObjectiveEvent = (objective: Objective) => ({
  type: CREATED_OBJECTIVE,
  payload: objective
});
