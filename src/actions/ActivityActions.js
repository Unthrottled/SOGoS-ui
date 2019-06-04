import type {ActivityContent} from "../events/ActivityEvents";
import {
  createStartedActivityEvent,
  createStartedNonTimedActivityEvent,
  createStartedTimedActivityEvent
} from "../events/ActivityEvents";


export const
  startTimedActivity = (activityContent: ActivityContent) =>
    dispetch => {
      dispetch(createStartedActivityEvent(activityContent)); // to the backend event
      dispetch(createStartedTimedActivityEvent(activityContent)); // internal event
    };

export const
  startNonTimedActivity = (activityContent: ActivityContent) =>
    dispetch => {
      dispetch(createStartedActivityEvent(activityContent)); // to the backend event
      dispetch(createStartedNonTimedActivityEvent(activityContent)); // internal event
    };
