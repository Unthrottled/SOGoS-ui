import {BaseEvent, PayloadEvent} from './Event';
import {NotificationType} from "../reducers/MiscellaneousReducer";

export const REQUESTED_NOTIFICATION: 'REQUESTED_NOTIFICATION' =
  'REQUESTED_NOTIFICATION';
export const DISMISSED_NOTIFICATION: 'DISMISSED_NOTIFICATION' =
  'DISMISSED_NOTIFICATION';
export const SAVED_REDIRECT: 'SAVED_REDIRECT' = 'SAVED_REDIRECT';

export const createHideNotificationEvent = (): BaseEvent => ({
  type: DISMISSED_NOTIFICATION,
});

type NotificationPayload = {
  message: string;
  type: NotificationType;
}
export const createShowWarningNotificationEvent = (
  message: string,
): PayloadEvent<NotificationPayload> => ({
  type: REQUESTED_NOTIFICATION,
  payload: {
    message,
    type: NotificationType.WARNING
  },
});

export const createShowInfoNotificationEvent = (
  message: string,
): PayloadEvent<NotificationPayload> => ({
  type: REQUESTED_NOTIFICATION,
  payload: {
    message,
    type: NotificationType.INFO
  },
});

export const createSaveRedirect = (
  redirectPath: string,
): PayloadEvent<String> => ({
  type: SAVED_REDIRECT,
  payload: redirectPath,
});
