import {createCreatedObjectiveEvent, createViewedObjectivesEvent} from "../events/StrategyEvents";
import type {Objective} from "../reducers/StrategyReducer";

export const
  viewedObjectives = () =>
    dispetch => {
      dispetch(createViewedObjectivesEvent());
    };

export const createdObjective = (objective: Objective) => dispatch =>
  dispatch(createCreatedObjectiveEvent(objective));
