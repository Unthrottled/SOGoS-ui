import {createStartedActivityEvent} from "../events/ActivityEvents";
import type {Activity} from "../events/ActivityEvents";


export const startActivity = (activity: Activity) => dispetch => dispetch(createStartedActivityEvent(activity));
