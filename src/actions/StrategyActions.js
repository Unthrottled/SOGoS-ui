import {createViewedObjectivesEvent} from "../events/StrategyEvents";

export const
  viewedObjectives = () =>
    dispetch => {
      dispetch(createViewedObjectivesEvent());
    };
