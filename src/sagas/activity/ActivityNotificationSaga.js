import {select} from 'redux-saga/effects'
import {selectConfigurationState} from "../../reducers";


export function* activityNotificationSaga() {
  const {miscellaneous: {notificationsAllowed}} = yield select(selectConfigurationState);
  if (notificationsAllowed === "granted" && ("Notification" in window)) {
    new Notification("Fam ravioli");
    window.navigator.vibrate([200, 100, 200])
  }
}
