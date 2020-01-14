import {
  Activity,
  getActivityContent,
  getActivityName,
  isActivityRecovery,
} from '../../types/ActivityTypes';
import {PayloadEvent} from '../../events/Event';

// eslint-disable-next-line no-undef
const audio = new Audio('/notification.mp3');

export function activityNotificationSaga({payload}: PayloadEvent<Activity>) {
  // eslint-disable-next-line no-undef
  Notification.requestPermission().then(_ => {
    if ('Notification' in window && getActivityContent(payload).autoStart) {
      if (isActivityRecovery(payload)) {
        // eslint-disable-next-line no-undef,no-new
        new Notification('Take a Break!', {
          icon: '/images/reach_orange_512.png',
        });
      } else {
        // eslint-disable-next-line no-undef,no-new
        new Notification(`Get Back to ${getActivityName(payload)}!`, {
          icon: '/images/reach_orange_512.png',
        });
      }
      audio.play().then(__ => {});
      try {
        window.navigator.vibrate([200, 100, 200]);
      } catch (__) {}
    }
  });
}
