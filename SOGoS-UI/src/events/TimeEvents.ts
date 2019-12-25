import {BaseEvent} from "./Event";

export const TIME_INCREMENTED: 'TIME_INCREMENTED' = 'TIME_INCREMENTED';
export const TIME_DECREMENTED: 'TIME_DECREMENTED' = 'TIME_DECREMENTED';

export const createTimeIncrementEvent = (): BaseEvent => ({
  type: TIME_INCREMENTED,
});

export const createTimeDecrementEvent = (): BaseEvent => ({
  type: TIME_DECREMENTED,
});
