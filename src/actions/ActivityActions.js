import type {ActivityContent} from "../events/ActivityEvents";
import {createStartedActivityEvent} from "../events/ActivityEvents";


export const
  startActivity = (activityContent: ActivityContent) =>
    dispetch => dispetch(createStartedActivityEvent(activityContent));
