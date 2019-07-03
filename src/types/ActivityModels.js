import type {Activity} from "../events/ActivityEvents";
import {CREATED, DELETED, UPDATED} from "../events/ActivityEvents";

export type ActivityContent = {
  uuid: string,
  name: string,
}
export const ActivityType = {
  ACTIVE: 'ACTIVE',
  PASSIVE: 'PASSIVE',
};
export const ActivityTimedType = {
  NONE: 'NONE',
  TIMER: 'TIMER',
  STOP_WATCH: 'STOP_WATCH',
};
export type CachedActivity = {
  uploadType: CREATED | UPDATED | DELETED,
  activity: Activity
};
export type ActivityRegistryFailure = {
  error: any,
  activity: Activity,
}
