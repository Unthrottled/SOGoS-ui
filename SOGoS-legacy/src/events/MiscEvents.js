
export const REQUESTED_NOTIFICATION: 'REQUESTED_NOTIFICATION' = 'REQUESTED_NOTIFICATION';
export const DISMISSED_NOTIFICATION: 'DISMISSED_NOTIFICATION' = 'DISMISSED_NOTIFICATION';

export const createHideNotificationEvent = () => ({
  type: DISMISSED_NOTIFICATION,
});

export const createShowWarningNotificationEvent = (message: string) => ({
  type: REQUESTED_NOTIFICATION,
  payload: message,
});

