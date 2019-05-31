import type {ActivityContent} from "../events/ActivityEvents";
import {createStartedActivityEvent, createStartedTimedActivityEvent} from "../events/ActivityEvents";


export const
  startActivity = (activityContent: ActivityContent) =>
    dispetch => {
      dispetch(createStartedActivityEvent(activityContent));
      dispetch(createStartedTimedActivityEvent(activityContent));
    };
