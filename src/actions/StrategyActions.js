import {
  createCompletedObjectiveEvent,
  createCreatedObjectiveEvent,
  createDeletedObjectiveEvent,
  createUpdatedObjectiveEvent,
  createViewedObjectivesEvent
} from "../events/StrategyEvents";
import type {Objective} from "../types/StrategyModels";

export const
  viewedObjectives = () =>
    dispetch => {
      dispetch(createViewedObjectivesEvent());
    };

export const createdObjective = (objective: Objective) => dispatch =>
  dispatch(createCreatedObjectiveEvent(objective));

export const deletedObjective = (objective: Objective) => dispatch =>
  dispatch(createDeletedObjectiveEvent(objective));

export const completedObjective = (objective: Objective) => dispatch =>
  dispatch(createCompletedObjectiveEvent(objective));

export const updatedObjective = (objective: Objective) => dispatch =>
  dispatch(createUpdatedObjectiveEvent(objective));
