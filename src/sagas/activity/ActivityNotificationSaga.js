import {select} from 'redux-saga/effects'
import {selectConfigurationState} from "../../reducers";
import {getActivityContent, getActivityName, isActivityRecovery} from "../../types/ActivityModels";

const audio = new Audio('/notification.mp3');

export function* activityNotificationSaga({payload}) {
  const {miscellaneous: {notificationsAllowed}} = yield select(selectConfigurationState);
  if (notificationsAllowed === "granted" &&
    ("Notification" in window) &&
    getActivityContent(payload).autoStart) {
    if(isActivityRecovery(payload)){
      new Notification("Take a Break!");
    } else {
      new Notification(`Get Back to ${getActivityName(payload)}!`);
    }
    window.navigator.vibrate([200, 100, 200]);

    audio.play().then(_ => {})
  }
}
