import {getActivityContent, getActivityName, isActivityRecovery} from "../../types/ActivityModels";

const audio = new Audio('/notification.mp3');

export function activityNotificationSaga({payload}) {
  Notification.requestPermission()
    .then(_ => {
      if (("Notification" in window) &&
        getActivityContent(payload).autoStart) {
        if (isActivityRecovery(payload)) {
          new Notification("Take a Break!");
        } else {
          new Notification(`Get Back to ${getActivityName(payload)}!`);
        }
        audio.play().then(_ => {
        });
        try{
          window.navigator.vibrate([200, 100, 200]);
        } catch(_){}
      }
    });
}
