import {BaseEvent, PayloadEvent} from "./Event";

export const REQUESTED_NOTIFICATION: 'REQUESTED_NOTIFICATION' = 'REQUESTED_NOTIFICATION';
export const DISMISSED_NOTIFICATION: 'DISMISSED_NOTIFICATION' = 'DISMISSED_NOTIFICATION';

export const createHideNotificationEvent = (): BaseEvent => ({
    type: DISMISSED_NOTIFICATION,
});

export const createShowWarningNotificationEvent = (message: string): PayloadEvent<String> => ({
    type: REQUESTED_NOTIFICATION,
    payload: message,
});

