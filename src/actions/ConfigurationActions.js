import {createNotificationPermissionReceivedEvent} from "../events/ConfigurationEvents";


export const
  receivedNotificationPermission = (notificationPermission: String) =>
    dispetch => {
      dispetch(createNotificationPermissionReceivedEvent(notificationPermission));
    };

