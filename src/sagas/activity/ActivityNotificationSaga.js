import {select} from 'redux-saga/effects'
import {selectConfigurationState} from "../../reducers";
import {getActivityContent} from "../../types/ActivityModels";

//todo: only notify after auto starting.
export function* activityNotificationSaga({payload}) {
  const {miscellaneous: {notificationsAllowed}} = yield select(selectConfigurationState);
  if (notificationsAllowed === "granted" && ("Notification" in window) && getActivityContent(payload).autoComplete) {
    new Notification("Fam ravioli");
    window.navigator.vibrate([200, 100, 200]);
    const audio = new Audio('/notif.mp3');
    audio.play().then(()=>{})
  }
}
