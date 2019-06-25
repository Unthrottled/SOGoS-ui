import {createViewedObjectivesEvent} from "../events/ObjectiveEvents";

export const
  viewedObjectives = () =>
    dispetch => {
      dispetch(createViewedObjectivesEvent());
    };
